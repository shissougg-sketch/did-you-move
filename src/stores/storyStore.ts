import { create } from 'zustand';
import type { StoryProgress } from '../types/story';
import {
  DEFAULT_STORY_PROGRESS,
  STORY_ARCS,
  SIDE_PATHS,
  getCurrentArc,
  getNextArc,
  calculateSceneIndex,
} from '../types/story';
import { getCurrentUserId } from '../utils/localStorage';

const BASE_STORAGE_KEY = 'mobble-story-progress';

const getStorageKey = (): string => {
  const userId = getCurrentUserId();
  return userId ? `${BASE_STORAGE_KEY}-${userId}` : BASE_STORAGE_KEY;
};

// Load story progress from localStorage
const loadStoryProgress = (): StoryProgress => {
  try {
    const stored = localStorage.getItem(getStorageKey());
    if (stored) {
      return { ...DEFAULT_STORY_PROGRESS, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load story progress:', error);
  }
  return DEFAULT_STORY_PROGRESS;
};

// Save story progress to localStorage
const saveStoryProgress = (progress: StoryProgress): void => {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save story progress:', error);
  }
};

interface StoryStore {
  progress: StoryProgress;

  // Reload progress from localStorage (for user switch)
  reloadProgress: () => void;

  // Core progression
  recordCheckIn: () => { newScene: boolean; arcCompleted: boolean; newArc: boolean };
  getProgress: () => StoryProgress;

  // Scene helpers
  getCurrentScene: () => { arc: typeof STORY_ARCS[0]; scene: typeof STORY_ARCS[0]['scenes'][0] } | null;
  getArcProgress: () => { current: number; total: number; percentage: number };

  // Side paths
  unlockSidePath: (sidePathId: string) => boolean;
  canAffordSidePath: (sidePathId: string, availablePoints: number) => boolean;
  getSidePathProgress: (sidePathId: string) => number;
  advanceSidePath: (sidePathId: string) => boolean;

  // Utility
  hasStartedJourney: () => boolean;
  startJourney: () => void;
  resetProgress: () => void;
}

export const useStoryStore = create<StoryStore>((set, get) => ({
  progress: loadStoryProgress(),

  reloadProgress: () => {
    const progress = loadStoryProgress();
    set({ progress });
  },

  recordCheckIn: () => {
    const { progress } = get();
    const currentArc = getCurrentArc(progress.currentArcId);

    if (!currentArc) {
      return { newScene: false, arcCompleted: false, newArc: false };
    }

    const today = new Date().toISOString().split('T')[0];
    const newCheckInsThisArc = progress.checkInsThisArc + 1;
    const newTotalCheckIns = progress.totalCheckIns + 1;

    // Calculate new scene index
    const oldSceneIndex = progress.currentSceneIndex;
    const newSceneIndex = calculateSceneIndex(newCheckInsThisArc, currentArc);
    const newScene = newSceneIndex > oldSceneIndex;

    // Track unlocked scenes
    const currentScene = currentArc.scenes[newSceneIndex];
    const unlockedScenes = newScene && currentScene
      ? [...progress.unlockedScenes, currentScene.id]
      : progress.unlockedScenes;

    // Check if arc is completed
    const arcCompleted = newSceneIndex >= currentArc.scenes.length - 1 &&
      newCheckInsThisArc >= currentArc.totalSteps;

    let newProgress: StoryProgress;
    let newArc = false;

    if (arcCompleted && !progress.completedArcs.includes(currentArc.id)) {
      // Complete current arc and move to next
      const nextArc = getNextArc(currentArc.id);
      newArc = !!nextArc;

      newProgress = {
        ...progress,
        totalCheckIns: newTotalCheckIns,
        checkInsThisArc: nextArc ? 0 : newCheckInsThisArc,
        currentSceneIndex: nextArc ? 0 : newSceneIndex,
        currentArcId: nextArc ? nextArc.id : progress.currentArcId,
        unlockedScenes,
        completedArcs: [...progress.completedArcs, currentArc.id],
        lastCheckInDate: today,
      };
    } else {
      newProgress = {
        ...progress,
        totalCheckIns: newTotalCheckIns,
        checkInsThisArc: newCheckInsThisArc,
        currentSceneIndex: newSceneIndex,
        unlockedScenes,
        lastCheckInDate: today,
      };
    }

    saveStoryProgress(newProgress);
    set({ progress: newProgress });

    return { newScene, arcCompleted, newArc };
  },

  getProgress: () => get().progress,

  getCurrentScene: () => {
    const { progress } = get();
    const arc = getCurrentArc(progress.currentArcId);

    if (!arc) return null;

    const scene = arc.scenes[progress.currentSceneIndex];
    return scene ? { arc, scene } : null;
  },

  getArcProgress: () => {
    const { progress } = get();
    const arc = getCurrentArc(progress.currentArcId);

    if (!arc) {
      return { current: 0, total: 0, percentage: 0 };
    }

    return {
      current: progress.checkInsThisArc,
      total: arc.totalSteps,
      percentage: Math.min(100, Math.round((progress.checkInsThisArc / arc.totalSteps) * 100)),
    };
  },

  unlockSidePath: (sidePathId: string) => {
    const { progress } = get();

    // Already unlocked
    if (progress.unlockedSidePaths.includes(sidePathId)) {
      return true;
    }

    const sidePath = SIDE_PATHS.find(sp => sp.id === sidePathId);
    if (!sidePath) return false;

    const newProgress = {
      ...progress,
      unlockedSidePaths: [...progress.unlockedSidePaths, sidePathId],
    };

    saveStoryProgress(newProgress);
    set({ progress: newProgress });
    return true;
  },

  canAffordSidePath: (sidePathId: string, availablePoints: number) => {
    const sidePath = SIDE_PATHS.find(sp => sp.id === sidePathId);
    if (!sidePath) return false;
    return availablePoints >= sidePath.pointsCost;
  },

  getSidePathProgress: (sidePathId: string) => {
    const { progress } = get();

    if (!progress.unlockedSidePaths.includes(sidePathId)) {
      return 0;
    }

    const sidePath = SIDE_PATHS.find(sp => sp.id === sidePathId);
    if (!sidePath) return 0;

    // Count unlocked scenes for this side path
    const unlockedCount = sidePath.scenes.filter(
      scene => progress.unlockedScenes.includes(scene.id)
    ).length;

    return unlockedCount;
  },

  advanceSidePath: (sidePathId: string) => {
    const { progress } = get();

    if (!progress.unlockedSidePaths.includes(sidePathId)) {
      return false;
    }

    const sidePath = SIDE_PATHS.find(sp => sp.id === sidePathId);
    if (!sidePath) return false;

    // Find next scene to unlock
    const currentProgress = get().getSidePathProgress(sidePathId);
    const nextScene = sidePath.scenes[currentProgress];

    if (!nextScene) {
      // Already completed
      if (!progress.completedSidePaths.includes(sidePathId)) {
        const newProgress = {
          ...progress,
          completedSidePaths: [...progress.completedSidePaths, sidePathId],
        };
        saveStoryProgress(newProgress);
        set({ progress: newProgress });
      }
      return false;
    }

    const newProgress = {
      ...progress,
      unlockedScenes: [...progress.unlockedScenes, nextScene.id],
    };

    // Check if this completes the side path
    if (currentProgress + 1 >= sidePath.scenes.length) {
      newProgress.completedSidePaths = [...progress.completedSidePaths, sidePathId];
    }

    saveStoryProgress(newProgress);
    set({ progress: newProgress });
    return true;
  },

  hasStartedJourney: () => {
    return get().progress.journeyStartedAt !== null;
  },

  startJourney: () => {
    const { progress } = get();

    if (progress.journeyStartedAt) return;

    const newProgress = {
      ...progress,
      journeyStartedAt: new Date().toISOString(),
    };

    saveStoryProgress(newProgress);
    set({ progress: newProgress });
  },

  resetProgress: () => {
    saveStoryProgress(DEFAULT_STORY_PROGRESS);
    set({ progress: DEFAULT_STORY_PROGRESS });
  },
}));

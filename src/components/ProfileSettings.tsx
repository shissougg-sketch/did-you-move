import { useState } from 'react';
import { User, Edit2, X, Check } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';
import type { BiologicalSex, HeightUnit, WeightUnit, ActivityLevel } from '../types/profile';
import { ACTIVITY_LEVELS } from '../types/profile';
import {
  formatHeight,
  formatWeight,
  feetInchesToCm,
  cmToFeetInches,
  lbsToKg,
  kgToLbs,
} from '../utils/bmrCalculator';

export const ProfileSettings = () => {
  const { settings, updateProfile } = useSettingsStore();
  const { profile } = settings;

  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [age, setAge] = useState<string>(profile.age?.toString() || '');
  const [heightUnit, setHeightUnit] = useState<HeightUnit>(profile.preferredHeightUnit);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>(profile.preferredWeightUnit);
  const [biologicalSex, setBiologicalSex] = useState<BiologicalSex | ''>(
    profile.biologicalSex || ''
  );
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | ''>(
    profile.activityLevel || ''
  );
  const [weightPreferNotToSay, setWeightPreferNotToSay] = useState(
    profile.weightPreferNotToSay || false
  );

  // Height state (handle both units)
  const [heightCm, setHeightCm] = useState<string>(profile.heightCm?.toString() || '');
  const [heightFeet, setHeightFeet] = useState<string>(() => {
    if (!profile.heightCm) return '';
    const { feet } = cmToFeetInches(profile.heightCm);
    return feet.toString();
  });
  const [heightInches, setHeightInches] = useState<string>(() => {
    if (!profile.heightCm) return '';
    const { inches } = cmToFeetInches(profile.heightCm);
    return inches.toString();
  });

  // Weight state (handle both units)
  const [weightKg, setWeightKg] = useState<string>(profile.weightKg?.toString() || '');
  const [weightLbs, setWeightLbs] = useState<string>(() => {
    if (!profile.weightKg) return '';
    return kgToLbs(profile.weightKg).toString();
  });

  const handleStartEdit = () => {
    // Reset form state from current profile
    setAge(profile.age?.toString() || '');
    setHeightUnit(profile.preferredHeightUnit);
    setWeightUnit(profile.preferredWeightUnit);
    setBiologicalSex(profile.biologicalSex || '');
    setActivityLevel(profile.activityLevel || '');
    setWeightPreferNotToSay(profile.weightPreferNotToSay || false);
    setHeightCm(profile.heightCm?.toString() || '');
    setWeightKg(profile.weightKg?.toString() || '');
    if (profile.heightCm) {
      const { feet, inches } = cmToFeetInches(profile.heightCm);
      setHeightFeet(feet.toString());
      setHeightInches(inches.toString());
    }
    if (profile.weightKg) {
      setWeightLbs(kgToLbs(profile.weightKg).toString());
    }
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    // Convert height to cm
    let finalHeightCm: number | null = null;
    if (heightUnit === 'cm' && heightCm) {
      finalHeightCm = parseInt(heightCm, 10);
    } else if (heightUnit === 'ft-in' && heightFeet) {
      finalHeightCm = feetInchesToCm(
        parseInt(heightFeet, 10) || 0,
        parseInt(heightInches, 10) || 0
      );
    }

    // Convert weight to kg (null if prefer not to say)
    let finalWeightKg: number | null = null;
    if (!weightPreferNotToSay) {
      if (weightUnit === 'kg' && weightKg) {
        finalWeightKg = parseFloat(weightKg);
      } else if (weightUnit === 'lbs' && weightLbs) {
        finalWeightKg = lbsToKg(parseFloat(weightLbs));
      }
    }

    updateProfile({
      age: age ? parseInt(age, 10) : null,
      heightCm: finalHeightCm,
      weightKg: finalWeightKg,
      weightPreferNotToSay,
      biologicalSex: biologicalSex || null,
      activityLevel: activityLevel || null,
      preferredHeightUnit: heightUnit,
      preferredWeightUnit: weightUnit,
    });

    setIsEditing(false);
  };

  const hasProfile = profile.age || profile.heightCm || profile.weightKg;

  if (isEditing) {
    return (
      <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-slate-700" />
            <h3 className="font-semibold text-slate-800">Edit Profile</h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={handleSave}
              className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
            >
              <Check className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              min="13"
              max="120"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>

          {/* Height */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-slate-700">Height</label>
              <div className="flex space-x-1">
                <button
                  onClick={() => setHeightUnit('cm')}
                  className={`px-2 py-1 text-xs rounded ${
                    heightUnit === 'cm'
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  cm
                </button>
                <button
                  onClick={() => setHeightUnit('ft-in')}
                  className={`px-2 py-1 text-xs rounded ${
                    heightUnit === 'ft-in'
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  ft/in
                </button>
              </div>
            </div>
            {heightUnit === 'cm' ? (
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="Height in cm"
                min="100"
                max="250"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            ) : (
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={heightFeet}
                  onChange={(e) => setHeightFeet(e.target.value)}
                  placeholder="Feet"
                  min="3"
                  max="8"
                  className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
                <input
                  type="number"
                  value={heightInches}
                  onChange={(e) => setHeightInches(e.target.value)}
                  placeholder="Inches"
                  min="0"
                  max="11"
                  className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                />
              </div>
            )}
          </div>

          {/* Weight */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-slate-700">Weight</label>
              {!weightPreferNotToSay && (
                <div className="flex space-x-1">
                  <button
                    onClick={() => setWeightUnit('kg')}
                    className={`px-2 py-1 text-xs rounded ${
                      weightUnit === 'kg'
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    kg
                  </button>
                  <button
                    onClick={() => setWeightUnit('lbs')}
                    className={`px-2 py-1 text-xs rounded ${
                      weightUnit === 'lbs'
                        ? 'bg-slate-800 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    lbs
                  </button>
                </div>
              )}
            </div>
            {!weightPreferNotToSay ? (
              <input
                type="number"
                value={weightUnit === 'kg' ? weightKg : weightLbs}
                onChange={(e) =>
                  weightUnit === 'kg' ? setWeightKg(e.target.value) : setWeightLbs(e.target.value)
                }
                placeholder={`Weight in ${weightUnit}`}
                min="30"
                max={weightUnit === 'kg' ? '300' : '660'}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            ) : (
              <p className="text-sm text-slate-500 py-2">Using average estimate based on height</p>
            )}
            <button
              onClick={() => {
                setWeightPreferNotToSay(!weightPreferNotToSay);
                if (!weightPreferNotToSay) {
                  setWeightKg('');
                  setWeightLbs('');
                }
              }}
              className={`w-full mt-2 py-2 px-3 text-sm rounded-lg border-2 transition-colors ${
                weightPreferNotToSay
                  ? 'border-slate-800 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              Prefer not to say
            </button>
          </div>

          {/* Biological Sex */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Biological Sex
            </label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
                { value: 'prefer-not-to-say', label: 'Prefer not to say' },
              ] as const).map((option) => (
                <button
                  key={option.value}
                  onClick={() => setBiologicalSex(option.value)}
                  className={`py-2 px-3 text-sm rounded-lg border-2 transition-colors ${
                    biologicalSex === option.value
                      ? 'border-slate-800 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Activity Level
            </label>
            <div className="space-y-2">
              {ACTIVITY_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setActivityLevel(level.value)}
                  className={`w-full py-2 px-3 text-left text-sm rounded-lg border-2 transition-colors ${
                    activityLevel === level.value
                      ? 'border-slate-800 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="font-medium">{level.label}</span>
                  <span className="text-slate-500 ml-2">{level.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-slate-700" />
          <div>
            <h3 className="font-semibold text-slate-800">Your Profile</h3>
            <p className="text-sm text-slate-500">
              {hasProfile ? 'Used for personalized insights' : 'Add your info for personalized insights'}
            </p>
          </div>
        </div>
        <button
          onClick={handleStartEdit}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Edit2 className="w-5 h-5" />
        </button>
      </div>

      {hasProfile ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500">Age</p>
              <p className="text-lg font-medium text-slate-800">
                {profile.age ? `${profile.age} years` : 'Not set'}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500">Height</p>
              <p className="text-lg font-medium text-slate-800">
                {formatHeight(profile.heightCm, profile.preferredHeightUnit)}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500">Weight</p>
              <p className="text-lg font-medium text-slate-800">
                {profile.weightPreferNotToSay
                  ? 'Prefer not to say'
                  : formatWeight(profile.weightKg, profile.preferredWeightUnit)}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-3">
              <p className="text-xs text-slate-500">Activity</p>
              <p className="text-lg font-medium text-slate-800">
                {profile.activityLevel
                  ? ACTIVITY_LEVELS.find(l => l.value === profile.activityLevel)?.label || 'Not set'
                  : 'Not set'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={handleStartEdit}
          className="w-full py-3 px-4 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
        >
          Set up your profile
        </button>
      )}
    </div>
  );
};

import type { AIInterpretation } from '../types/aiInterpretation';
import type { DidMove, Intensity, Feeling } from '../types/entry';

interface AnalyzeNoteRequest {
  note: string;
  userDidMove: DidMove;
  userIntensity: Intensity | null;
  userFeeling: Feeling | null;
}

interface AnalyzeNoteResult {
  interpretation: AIInterpretation;
  hasDiscrepancy: boolean;
}

/**
 * Analyzes a user's note to detect movement, intensity, and feeling.
 * Compares AI interpretation with user's self-reported answers.
 *
 * TODO: Implement actual AI API call (Claude Haiku recommended)
 *
 * The AI should:
 * 1. Read the note and extract movement indicators
 * 2. Detect intensity words (walked, ran, exhausted, etc.)
 * 3. Detect feeling words (great, tired, better, etc.)
 * 4. Compare with user's answers and note discrepancies
 * 5. Return structured interpretation with confidence score
 */
export const analyzeNote = async (
  request: AnalyzeNoteRequest
): Promise<AnalyzeNoteResult | null> => {
  const { note } = request;

  // Skip analysis if no note provided
  if (!note || note.trim().length === 0) {
    return null;
  }

  // TODO: Replace with actual AI API call (Claude Haiku recommended)
  // The request object contains userDidMove, userIntensity, userFeeling
  // to compare against AI's interpretation
  //
  // Example prompt structure for when API is implemented:
  /*
  const prompt = `
    Analyze this fitness log note and extract:
    1. Did they actually move/exercise? (yes/kind-of/no)
    2. What intensity level? (easy/moderate/hard/exhausting)
    3. How do they seem to feel? (better/same/worse)

    User's note: "${request.note}"

    User self-reported: movement=${request.userDidMove}, intensity=${request.userIntensity}, feeling=${request.userFeeling}

    Return JSON with: detectedMovement, inferredIntensity, inferredFeeling, confidence (0-1), reasoning
  `;
  */

  // Placeholder: Return null until AI is implemented
  // When implemented, this will return the AI's interpretation
  console.log('[noteAnalyzer] AI analysis not yet implemented. Note:', note.substring(0, 50));

  // Placeholder response structure (for testing UI)
  const placeholderInterpretation: AIInterpretation = {
    detectedMovement: null,
    inferredIntensity: null,
    inferredFeeling: null,
    confidence: 0,
    reasoning: 'AI analysis not yet implemented',
    analyzedAt: new Date().toISOString(),
  };

  return {
    interpretation: placeholderInterpretation,
    hasDiscrepancy: false,
  };
};

/**
 * Batch analyze multiple notes for insights page.
 * Generates a summary of patterns detected across all notes.
 *
 * TODO: Implement batch AI analysis for insights
 */
export const analyzeNotesForInsights = async (
  notes: Array<{ date: string; note: string; userDidMove: DidMove }>
): Promise<string | null> => {
  if (notes.length === 0) {
    return null;
  }

  // TODO: Implement batch analysis
  // This would send all notes to AI and get a summary like:
  // "Based on your notes, you seem to underreport your movement.
  //  On 3 days you marked 'no' but mentioned walking or physical activity."

  console.log('[noteAnalyzer] Batch analysis not yet implemented. Notes count:', notes.length);

  return null;
};

/**
 * Check if AI interpretation differs significantly from user input
 */
export const hasSignificantDiscrepancy = (
  userDidMove: DidMove,
  aiDetected: DidMove | null
): boolean => {
  if (!aiDetected) return false;

  // Major discrepancy: user said no but AI detected movement
  if (userDidMove === 'no' && (aiDetected === 'yes' || aiDetected === 'kind-of')) {
    return true;
  }

  // Minor discrepancy: user said yes but AI detected no movement
  if (userDidMove === 'yes' && aiDetected === 'no') {
    return true;
  }

  return false;
};

import type { DidMove, Intensity, Feeling } from './entry';

export interface AIInterpretation {
  // What the AI detected from the note
  detectedMovement: DidMove | null;
  inferredIntensity: Intensity | null;
  inferredFeeling: Feeling | null;

  // Confidence level (0-1)
  confidence: number;

  // Brief explanation of why AI interpreted this way
  reasoning: string;

  // Timestamp of analysis
  analyzedAt: string;
}

export interface NoteAnalysisRequest {
  note: string;
  userDidMove: DidMove;
  userIntensity: Intensity | null;
  userFeeling: Feeling | null;
}

export interface NoteAnalysisResult {
  interpretation: AIInterpretation;
  hasDiscrepancy: boolean; // True if AI detected something different from user input
}

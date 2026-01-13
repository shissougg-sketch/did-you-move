import type { DidMove, Intensity, Feeling } from '../types/entry';
import type { Tone } from '../types/settings';

interface GenerateResponseRequest {
  didMove: DidMove;
  intensity: Intensity | null;
  feeling: Feeling | null;
  note: string | null;
  tone: Tone;
}

// interface GenerateResponseResult {
//   response: string;
//   timestamp: string;
// }

export const generateAIResponse = async (
  data: GenerateResponseRequest
): Promise<string> => {
  try {
    // TODO: Implement actual API call to /api/generate-response
    // For now, return a placeholder message
    const fallbackMessages: Record<Tone, string> = {
      gentle: 'That sounds like a good day. Keep listening to your body.',
      neutral: 'Entry recorded.',
      direct: 'Got it.',
    };

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return fallbackMessages[data.tone];
  } catch (error) {
    console.error('Failed to generate AI response:', error);
    return 'Entry saved.';
  }
};

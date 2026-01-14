const NOTE_SUGGESTIONS = [
  'Walked the dog',
  'Went to work',
  'Gym session',
  'Morning jog',
  'Yoga/stretching',
  'Bike ride',
  'Swimming',
  'Played with kids',
  'Housework/cleaning',
  'Gardening',
  'Took the stairs',
  'Rest day',
];

interface NoteSuggestionsProps {
  currentNote: string;
  onSuggestionClick: (suggestion: string) => void;
}

export const NoteSuggestions = ({ currentNote, onSuggestionClick }: NoteSuggestionsProps) => {
  const handleClick = (suggestion: string) => {
    // If note already contains this suggestion, don't add it again
    if (currentNote.toLowerCase().includes(suggestion.toLowerCase())) {
      return;
    }

    // Append with comma if note already has content
    if (currentNote.trim()) {
      onSuggestionClick(`${currentNote.trim()}, ${suggestion.toLowerCase()}`);
    } else {
      onSuggestionClick(suggestion);
    }
  };

  const isUsed = (suggestion: string) => {
    return currentNote.toLowerCase().includes(suggestion.toLowerCase());
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {NOTE_SUGGESTIONS.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => handleClick(suggestion)}
          disabled={isUsed(suggestion)}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            isUsed(suggestion)
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
          }`}
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

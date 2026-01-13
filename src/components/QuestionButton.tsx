interface QuestionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  variant?: 'yes' | 'kind-of' | 'no' | 'default';
}

export const QuestionButton = ({
  label,
  selected,
  onClick,
  variant = 'default',
}: QuestionButtonProps) => {
  const getVariantClasses = () => {
    if (!selected) {
      return 'bg-white border-2 border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50';
    }

    switch (variant) {
      case 'yes':
        return 'bg-moved-yes border-2 border-moved-yes text-slate-900';
      case 'kind-of':
        return 'bg-moved-kind-of border-2 border-moved-kind-of text-slate-900';
      case 'no':
        return 'bg-moved-no border-2 border-moved-no text-slate-700';
      default:
        return 'bg-slate-800 border-2 border-slate-800 text-white';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`
        w-full py-4 px-6 rounded-xl font-medium text-lg
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-4 focus:ring-slate-300 focus:ring-offset-2
        ${getVariantClasses()}
      `}
    >
      {label}
    </button>
  );
};

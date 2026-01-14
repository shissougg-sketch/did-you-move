import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface AIResponseProps {
  response: string;
  isLoading?: boolean;
}

export const AIResponse = ({ response, isLoading = false }: AIResponseProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isLoading && response) {
      // Gentle fade-in animation
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, response]);

  if (isLoading) {
    return (
      <div className="mt-8 p-6 bg-slate-100 rounded-xl flex items-center justify-center space-x-3">
        <Sparkles className="w-5 h-5 text-slate-400 animate-pulse" />
        <span className="text-slate-600">Thinking...</span>
      </div>
    );
  }

  if (!response) return null;

  return (
    <div
      className={`
        mt-8 p-6 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl
        border border-slate-200
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      <div className="flex items-start space-x-3">
        <Sparkles className="w-5 h-5 text-slate-500 mt-1 flex-shrink-0" />
        <p className="text-slate-700 text-lg leading-relaxed">{response}</p>
      </div>
    </div>
  );
};

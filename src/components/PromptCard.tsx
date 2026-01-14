import { useNavigate } from 'react-router-dom';
import { X, ChevronRight } from 'lucide-react';
import { MobbleEmote } from './MobbleEmote';
import type { PromptDefinition } from '../types/prompts';

interface PromptCardProps {
  prompt: PromptDefinition;
  onDismiss: () => void;
  onAction: () => void;
}

export const PromptCard = ({ prompt, onDismiss, onAction }: PromptCardProps) => {
  const navigate = useNavigate();

  const handleAction = () => {
    onAction();
    if (prompt.actionPath) {
      navigate(prompt.actionPath);
    }
  };

  // Choose emote based on prompt type
  const getEmote = () => {
    switch (prompt.id) {
      case 'complete-profile':
      case 'set-activity-level':
        return 'coy'; // Curious/inquisitive look
      case 'add-notes':
        return 'happysmile';
      case 'discover-story':
        return 'winkwink';
      case 'discover-insights':
        return 'wegotthis';
      default:
        return 'happy';
    }
  };

  return (
    <div
      className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-white/20 animate-in fade-in slide-in-from-bottom duration-500"
      style={{
        boxShadow: '0 10px 40px rgba(78, 205, 196, 0.15)',
        borderColor: 'rgba(78, 205, 196, 0.2)',
      }}
    >
      <div className="flex items-start gap-3">
        {/* Mobble emote */}
        <div className="flex-shrink-0">
          <MobbleEmote
            emote={getEmote()}
            animation="breathing"
            size="sm"
            alt="Mobble suggestion"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className="font-semibold text-sm"
              style={{
                background: 'linear-gradient(135deg, #4ECDC4 0%, #44A8B3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {prompt.title}
            </h4>
            <button
              onClick={onDismiss}
              className="flex-shrink-0 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm text-slate-600 mt-1">{prompt.message}</p>

          {/* Action button */}
          <button
            onClick={handleAction}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #4ECDC4 0%, #44A8B3 100%)',
              boxShadow: '0 2px 10px rgba(78, 205, 196, 0.3)',
            }}
          >
            {prompt.actionLabel}
            {prompt.actionPath && <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

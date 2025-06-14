
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface BitLifeEvent {
  id: string;
  title: string;
  description: string;
  emoji: string;
  choices: {
    id: string;
    text: string;
    effects: { [key: string]: number };
    emoji?: string;
  }[];
  type: 'random' | 'major' | 'relationship' | 'career';
}

interface BitLifeEventOverlayProps {
  event: BitLifeEvent | null;
  isOpen: boolean;
  onChoice: (choice: any) => void;
  onClose: () => void;
}

const BitLifeEventOverlay = ({ event, isOpen, onChoice, onClose }: BitLifeEventOverlayProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleChoice = (choice: any) => {
    onChoice(choice);
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  if (!event || !isOpen) return null;

  return (
    <div className={`event-overlay ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`event-card ${isVisible ? 'scale-100' : 'scale-95'}`}>
        <div className="flex justify-between items-start mb-6">
          <div className="text-6xl">{event.emoji}</div>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 p-0"
          >
            <X size={16} />
          </Button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-3">{event.title}</h2>
          <p className="text-white/80 text-lg leading-relaxed">{event.description}</p>
        </div>

        <div className="space-y-3">
          {event.choices.map((choice) => (
            <Button
              key={choice.id}
              onClick={() => handleChoice(choice)}
              className="w-full p-4 h-auto text-left ios-button hover:bg-white/10 border-white/20"
              variant="outline"
            >
              <div className="flex items-center gap-3">
                {choice.emoji && <span className="text-2xl">{choice.emoji}</span>}
                <div className="flex-1">
                  <div className="text-white font-medium text-base">{choice.text}</div>
                  {Object.entries(choice.effects).length > 0 && (
                    <div className="text-white/60 text-sm mt-1">
                      {Object.entries(choice.effects)
                        .map(([key, value]) => {
                          const sign = value > 0 ? '+' : '';
                          const color = value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-white/60';
                          return (
                            <span key={key} className={color}>
                              {key}: {sign}{value}%
                            </span>
                          );
                        })
                        .reduce((prev, curr, i) => i === 0 ? [curr] : [...prev, ', ', curr], [] as any[])}
                    </div>
                  )}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BitLifeEventOverlay;

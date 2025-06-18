
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Zap, Heart, Briefcase, DollarSign, Users, Scale, GraduationCap, Home, Shield } from 'lucide-react';
import { EnhancedEvent, EnhancedChoice, processEnhancedChoice } from '../types/EnhancedEvents';

interface EnhancedEventOverlayProps {
  event: EnhancedEvent | null;
  character: any;
  isOpen: boolean;
  onChoice: (choice: any, effects: any, eventText: string) => void;
  onClose: () => void;
}

const categoryConfig = {
  life_stage: { color: 'from-purple-600 to-purple-800', icon: Zap, bg: 'bg-purple-500/20' },
  relationship: { color: 'from-pink-600 to-pink-800', icon: Heart, bg: 'bg-pink-500/20' },
  family: { color: 'from-rose-600 to-rose-800', icon: Home, bg: 'bg-rose-500/20' },
  romance: { color: 'from-red-600 to-red-800', icon: Heart, bg: 'bg-red-500/20' },
  career: { color: 'from-blue-600 to-blue-800', icon: Briefcase, bg: 'bg-blue-500/20' },
  health: { color: 'from-green-600 to-green-800', icon: Shield, bg: 'bg-green-500/20' },
  financial: { color: 'from-yellow-600 to-yellow-800', icon: DollarSign, bg: 'bg-yellow-500/20' },
  social: { color: 'from-indigo-600 to-indigo-800', icon: Users, bg: 'bg-indigo-500/20' },
  legal: { color: 'from-gray-600 to-gray-800', icon: Scale, bg: 'bg-gray-500/20' },
  educational: { color: 'from-teal-600 to-teal-800', icon: GraduationCap, bg: 'bg-teal-500/20' },
  crime: { color: 'from-red-800 to-black', icon: Shield, bg: 'bg-red-900/20' }
};

const EnhancedEventOverlay = ({ event, character, isOpen, onChoice, onClose }: EnhancedEventOverlayProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setSelectedChoice(null);
    }
  }, [isOpen]);

  const handleChoice = (choice: EnhancedChoice) => {
    setSelectedChoice(choice.id);
    
    setTimeout(() => {
      const { effects, eventText } = processEnhancedChoice(choice, character);
      onChoice(choice, effects, eventText);
      setIsVisible(false);
      setTimeout(() => onClose(), 300);
    }, 200);
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const canUseChoice = (choice: EnhancedChoice): boolean => {
    if (!choice.requirements) return true;
    
    return Object.entries(choice.requirements).every(([stat, value]) => {
      return character[stat] >= value;
    });
  };

  const getSuccessChanceColor = (chance: number): string => {
    if (chance >= 80) return 'text-green-400';
    if (chance >= 60) return 'text-yellow-400';
    if (chance >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  if (!event || !isOpen) return null;

  const config = categoryConfig[event.category];
  const CategoryIcon = config.icon;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      isVisible ? 'opacity-100 backdrop-blur-sm bg-black/50' : 'opacity-0 pointer-events-none'
    }`}>
      <div className={`relative max-w-md w-full transform transition-all duration-300 ${
        isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        {/* Background with category-specific gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${config.color} rounded-2xl opacity-90`} />
        
        {/* Content */}
        <div className="relative bg-slate-900/95 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${config.bg} border border-white/10`}>
                <CategoryIcon size={24} className="text-white" />
              </div>
              <div>
                <div className="text-xs text-white/60 uppercase tracking-wider font-medium">
                  {event.category.replace('_', ' ')}
                </div>
                <div className="text-2xl">{event.emoji}</div>
              </div>
            </div>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 rounded-full h-8 w-8 p-0"
            >
              <X size={16} />
            </Button>
          </div>

          {/* Event Content */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-white mb-3">{event.title}</h2>
            <p className="text-white/80 text-base leading-relaxed">{event.description}</p>
            
            {event.type === 'milestone' && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full">
                <Zap size={14} className="text-purple-400" />
                <span className="text-xs text-purple-300 font-medium">Life Milestone</span>
              </div>
            )}
          </div>

          {/* Choices */}
          <div className="space-y-3">
            {event.choices.map((choice) => {
              const canUse = canUseChoice(choice);
              const isSelected = selectedChoice === choice.id;
              
              return (
                <Button
                  key={choice.id}
                  onClick={() => canUse && handleChoice(choice)}
                  disabled={!canUse || selectedChoice !== null}
                  className={`w-full p-4 h-auto text-left transition-all duration-200 ${
                    isSelected 
                      ? 'bg-white/20 border-white/40 scale-105' 
                      : canUse 
                        ? 'bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/30' 
                        : 'bg-gray-800/50 border-gray-600/50 opacity-50 cursor-not-allowed'
                  }`}
                  variant="outline"
                >
                  <div className="flex items-center gap-3 w-full">
                    {choice.emoji && (
                      <span className="text-2xl flex-shrink-0">{choice.emoji}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm mb-1">{choice.text}</div>
                      
                      {/* Effects Preview */}
                      {Object.entries(choice.effects).length > 0 && (
                        <div className="text-xs text-white/60 mb-1">
                          {Object.entries(choice.effects)
                            .map(([key, value]) => {
                              const sign = value > 0 ? '+' : '';
                              const color = value > 0 ? 'text-green-400' : value < 0 ? 'text-red-400' : 'text-white/60';
                              return (
                                <span key={key} className={color}>
                                  {key}: {sign}{value}
                                </span>
                              );
                            })
                            .reduce((prev, curr, i) => i === 0 ? [curr] : [...prev, ', ', curr], [] as any[])}
                        </div>
                      )}
                      
                      {/* Success Chance */}
                      {choice.successChance !== undefined && (
                        <div className="text-xs mb-1">
                          <span className="text-white/60">Success: </span>
                          <span className={getSuccessChanceColor(choice.successChance)}>
                            {choice.successChance}%
                          </span>
                        </div>
                      )}
                      
                      {/* Requirements */}
                      {!canUse && choice.requirements && (
                        <div className="text-xs text-red-400">
                          Requires: {Object.entries(choice.requirements)
                            .map(([key, value]) => `${key} ${value}+`)
                            .join(', ')}
                        </div>
                      )}
                      
                      {choice.requirementText && (
                        <div className="text-xs text-amber-400 mt-1">
                          {choice.requirementText}
                        </div>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedEventOverlay;

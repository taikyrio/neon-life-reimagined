
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Character } from '../types/Character';
import { MajorLifeEvent, EventChoice } from '../types/MajorEvents';

interface MajorEventDialogProps {
  isOpen: boolean;
  event: MajorLifeEvent | null;
  character: Character;
  onChoice: (choice: EventChoice) => void;
  onClose: () => void;
}

const MajorEventDialog = ({ isOpen, event, character, onChoice, onClose }: MajorEventDialogProps) => {
  if (!event) return null;

  const handleChoice = (choice: EventChoice) => {
    onChoice(choice);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {event.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-slate-300 text-center">{event.description}</p>
          
          <div className="space-y-2">
            {event.choices.map((choice) => {
              const canChoose = !choice.requirements || 
                Object.entries(choice.requirements).every(([stat, value]) => 
                  (character as any)[stat] >= value
                );

              return (
                <Button
                  key={choice.id}
                  onClick={() => handleChoice(choice)}
                  disabled={!canChoose}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-left p-4 h-auto"
                  variant="outline"
                >
                  <div>
                    <div className="font-medium">{choice.text}</div>
                    {Object.entries(choice.effects).length > 0 && (
                      <div className="text-sm text-slate-400 mt-1">
                        Effects: {Object.entries(choice.effects)
                          .map(([key, value]) => `${key} ${value > 0 ? '+' : ''}${value}`)
                          .join(', ')}
                      </div>
                    )}
                    {!canChoose && choice.requirements && (
                      <div className="text-sm text-red-400 mt-1">
                        Requires: {Object.entries(choice.requirements)
                          .map(([key, value]) => `${key} ${value}`)
                          .join(', ')}
                      </div>
                    )}
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MajorEventDialog;

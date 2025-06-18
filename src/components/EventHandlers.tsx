
import MajorEventDialog from './MajorEventDialog';
import BitLifeEventOverlay from './BitLifeEventOverlay';
import EnhancedEventOverlay from './EnhancedEventOverlay';
import { Character } from '../types/Character';
import { MajorLifeEvent, EventChoice } from '../types/MajorEvents';
import { BitLifeEvent, EnhancedEvent } from '../types/BitLifeEvents';

interface EventHandlersProps {
  character: Character;
  currentMajorEvent: MajorLifeEvent | null;
  showEventDialog: boolean;
  currentBitLifeEvent: BitLifeEvent | null;
  currentEnhancedEvent: EnhancedEvent | null;
  showBitLifeEvent: boolean;
  showEnhancedEvent: boolean;
  onMajorEventChoice: (choice: EventChoice) => void;
  onBitLifeEventChoice: (choice: any) => void;
  onEnhancedEventChoice: (choice: any, effects: any, eventText: string) => void;
  onMajorEventClose: () => void;
  onBitLifeEventClose: () => void;
  onEnhancedEventClose: () => void;
}

const EventHandlers = ({
  character,
  currentMajorEvent,
  showEventDialog,
  currentBitLifeEvent,
  currentEnhancedEvent,
  showBitLifeEvent,
  showEnhancedEvent,
  onMajorEventChoice,
  onBitLifeEventChoice,
  onEnhancedEventChoice,
  onMajorEventClose,
  onBitLifeEventClose,
  onEnhancedEventClose
}: EventHandlersProps) => {
  return (
    <>
      <EnhancedEventOverlay
        event={currentEnhancedEvent}
        character={character}
        isOpen={showEnhancedEvent}
        onChoice={onEnhancedEventChoice}
        onClose={onEnhancedEventClose}
      />

      <BitLifeEventOverlay
        event={currentBitLifeEvent}
        isOpen={showBitLifeEvent}
        onChoice={onBitLifeEventChoice}
        onClose={onBitLifeEventClose}
      />

      <MajorEventDialog
        isOpen={showEventDialog}
        event={currentMajorEvent}
        character={character}
        onChoice={onMajorEventChoice}
        onClose={onMajorEventClose}
      />
    </>
  );
};

export default EventHandlers;

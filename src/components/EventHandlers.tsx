
import MajorEventDialog from './MajorEventDialog';
import BitLifeEventOverlay from './BitLifeEventOverlay';
import { Character } from '../types/Character';
import { MajorLifeEvent, EventChoice } from '../types/MajorEvents';
import { BitLifeEvent } from '../types/BitLifeEvents';

interface EventHandlersProps {
  character: Character;
  currentMajorEvent: MajorLifeEvent | null;
  showEventDialog: boolean;
  currentBitLifeEvent: BitLifeEvent | null;
  showBitLifeEvent: boolean;
  onMajorEventChoice: (choice: EventChoice) => void;
  onBitLifeEventChoice: (choice: any) => void;
  onMajorEventClose: () => void;
  onBitLifeEventClose: () => void;
}

const EventHandlers = ({
  character,
  currentMajorEvent,
  showEventDialog,
  currentBitLifeEvent,
  showBitLifeEvent,
  onMajorEventChoice,
  onBitLifeEventChoice,
  onMajorEventClose,
  onBitLifeEventClose
}: EventHandlersProps) => {
  return (
    <>
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

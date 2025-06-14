
import SocialStatusCard from './social/SocialStatusCard';
import RomanceCard from './social/RomanceCard';
import FamilyCard from './social/FamilyCard';
import SocialActivitiesCard from './social/SocialActivitiesCard';
import FriendsCard from './social/FriendsCard';
import { Character } from '../types/Character';

interface SocialActivitiesPanelProps {
  character: Character;
  onAction: (actionType: string, payload: { [key: string]: any }) => void;
}

const SocialActivitiesPanel = ({ character, onAction }: SocialActivitiesPanelProps) => {
  return (
    <div className="space-y-4 pb-4">
      <SocialStatusCard character={character} />
      <RomanceCard character={character} onAction={onAction} />
      <FamilyCard character={character} onAction={onAction} />
      <SocialActivitiesCard character={character} onAction={onAction} />
      <FriendsCard character={character} />
    </div>
  );
};

export default SocialActivitiesPanel;


import { useState } from 'react';
import { Character } from '../types/Character';
import { Toaster } from "@/components/ui/toaster";
import { useGameLogic } from '../hooks/useGameLogic';
import CharacterHeader from './CharacterHeader';
import BottomNavigation from './BottomNavigation';
import EventHandlers from './EventHandlers';
import TimelineView from './TimelineView';
import AssetsPanel from './AssetsPanel';
import ProfileView from './ProfileView';
import SocialActivitiesPanel from './SocialActivitiesPanel';
import LifeStageActions from './LifeStageActions';
import EnhancedRelationships from './EnhancedRelationships';
import AchievementsPanel from './AchievementsPanel';
import CareerDevelopment from './CareerDevelopment';
import CrimeActivities from './CrimeActivities';

interface GameInterfaceProps {
  character: Character;
  setCharacter: (character: Character | ((prevCharacter: Character) => Character)) => void;
}

const GameInterface = ({ character, setCharacter }: GameInterfaceProps) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'activities' | 'relationships' | 'assets' | 'profile' | 'achievements' | 'career' | 'crime'>('timeline');
  
  const {
    currentMajorEvent,
    setCurrentMajorEvent,
    showEventDialog,
    setShowEventDialog,
    currentBitLifeEvent,
    setCurrentBitLifeEvent,
    showBitLifeEvent,
    setShowBitLifeEvent,
    totalMonthlyExpenses,
    totalMonthlyAssetIncome,
    ageUp,
    handleLifeStageAction,
    handleMajorEventChoice,
    handleBitLifeEventChoice
  } = useGameLogic({ character, setCharacter });

  const renderContent = () => {
    switch (activeTab) {
      case 'timeline':
        return <TimelineView character={character} onAgeUp={ageUp} onLifeStageAction={handleLifeStageAction} monthlyExpenses={totalMonthlyExpenses} monthlyAssetIncome={totalMonthlyAssetIncome} />;
      case 'activities':
        return <LifeStageActions character={character} onAction={handleLifeStageAction} />;
      case 'assets':
        return <AssetsPanel character={character} onAction={handleLifeStageAction} />;
      case 'relationships':
        return <EnhancedRelationships character={character} setCharacter={setCharacter} />;
      case 'profile':
        return <ProfileView character={character} />;
      case 'achievements':
        return <AchievementsPanel character={character} />;
      case 'career':
        return <CareerDevelopment character={character} onAction={handleLifeStageAction} />;
      case 'crime':
        return <CrimeActivities character={character} onAction={handleLifeStageAction} />;
      default:
        return <TimelineView character={character} onAgeUp={ageUp} onLifeStageAction={handleLifeStageAction} monthlyExpenses={totalMonthlyExpenses} monthlyAssetIncome={totalMonthlyAssetIncome} />;
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Toaster />
      
      <CharacterHeader character={character} />

      <div className="flex-grow overflow-y-auto pb-20">
        {renderContent()}
      </div>

      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <EventHandlers
        character={character}
        currentMajorEvent={currentMajorEvent}
        showEventDialog={showEventDialog}
        currentBitLifeEvent={currentBitLifeEvent}
        showBitLifeEvent={showBitLifeEvent}
        onMajorEventChoice={handleMajorEventChoice}
        onBitLifeEventChoice={handleBitLifeEventChoice}
        onMajorEventClose={() => { setShowEventDialog(false); setCurrentMajorEvent(null); }}
        onBitLifeEventClose={() => { setShowBitLifeEvent(false); setCurrentBitLifeEvent(null); }}
      />
    </div>
  );
};

export default GameInterface;


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
import PrisonInterface from './PrisonInterface';

interface GameInterfaceProps {
  character: Character;
  setCharacter: (character: Character | ((prevCharacter: Character) => Character)) => void;
}

const GameInterface = ({ character, setCharacter }: GameInterfaceProps) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'activities' | 'relationships' | 'assets' | 'profile' | 'achievements' | 'career' | 'crime' | 'prison'>('timeline');
  
  const {
    currentMajorEvent,
    setCurrentMajorEvent,
    showEventDialog,
    setShowEventDialog,
    currentBitLifeEvent,
    setCurrentBitLifeEvent,
    currentEnhancedEvent,
    setCurrentEnhancedEvent,
    showBitLifeEvent,
    setShowBitLifeEvent,
    showEnhancedEvent,
    setShowEnhancedEvent,
    totalMonthlyExpenses,
    totalMonthlyAssetIncome,
    ageUp,
    handleLifeStageAction,
    handleMajorEventChoice,
    handleBitLifeEventChoice,
    handleEnhancedEventChoice
  } = useGameLogic({ character, setCharacter });

  // Override tab if character is incarcerated
  const effectiveTab = character.isIncarcerated && activeTab !== 'prison' && activeTab !== 'profile' && activeTab !== 'timeline' ? 'prison' : activeTab;

  const renderContent = () => {
    switch (effectiveTab) {
      case 'timeline':
        return <TimelineView character={character} onAgeUp={ageUp} onLifeStageAction={handleLifeStageAction} monthlyExpenses={totalMonthlyExpenses} monthlyAssetIncome={totalMonthlyAssetIncome} />;
      case 'activities':
        return character.isIncarcerated ? 
          <PrisonInterface character={character} onAction={handleLifeStageAction} /> :
          <LifeStageActions character={character} onAction={handleLifeStageAction} />;
      case 'assets':
        return character.isIncarcerated ? 
          <div className="text-center p-8 text-white/60">Assets unavailable while incarcerated</div> :
          <AssetsPanel character={character} onAction={handleLifeStageAction} />;
      case 'relationships':
        return <EnhancedRelationships character={character} setCharacter={setCharacter} />;
      case 'profile':
        return <ProfileView character={character} />;
      case 'achievements':
        return <AchievementsPanel character={character} />;
      case 'career':
        return character.isIncarcerated ? 
          <div className="text-center p-8 text-white/60">Career unavailable while incarcerated</div> :
          <CareerDevelopment character={character} onAction={handleLifeStageAction} />;
      case 'crime':
        return character.isIncarcerated ? 
          <PrisonInterface character={character} onAction={handleLifeStageAction} /> :
          <CrimeActivities character={character} onAction={handleLifeStageAction} />;
      case 'prison':
        return character.isIncarcerated ? 
          <PrisonInterface character={character} onAction={handleLifeStageAction} /> :
          <div className="text-center p-8 text-white/60">Not currently incarcerated</div>;
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

      <BottomNavigation 
        activeTab={effectiveTab} 
        setActiveTab={setActiveTab} 
        isIncarcerated={character.isIncarcerated} 
      />

      <EventHandlers
        character={character}
        currentMajorEvent={currentMajorEvent}
        showEventDialog={showEventDialog}
        currentBitLifeEvent={currentBitLifeEvent}
        currentEnhancedEvent={currentEnhancedEvent}
        showBitLifeEvent={showBitLifeEvent}
        showEnhancedEvent={showEnhancedEvent}
        onMajorEventChoice={handleMajorEventChoice}
        onBitLifeEventChoice={handleBitLifeEventChoice}
        onEnhancedEventChoice={handleEnhancedEventChoice}
        onMajorEventClose={() => { setShowEventDialog(false); setCurrentMajorEvent(null); }}
        onBitLifeEventClose={() => { setShowBitLifeEvent(false); setCurrentBitLifeEvent(null); }}
        onEnhancedEventClose={() => { setShowEnhancedEvent(false); setCurrentEnhancedEvent(null); }}
      />
    </div>
  );
};

export default GameInterface;

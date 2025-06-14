import { useState } from 'react';
import { Character } from '../types/Character';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, User, Briefcase, Calendar, Menu } from 'lucide-react';
import ActionsPanel from './ActionsPanel';
import RelationshipsPanel from './RelationshipsPanel';
import LifeEvents from './LifeEvents';
import SettingsPanel from './SettingsPanel';
import LifeStageActions from './LifeStageActions';
import MajorEventDialog from './MajorEventDialog';
import { MAJOR_LIFE_EVENTS, MajorLifeEvent, EventChoice } from '../types/MajorEvents';
import { getCurrentLifeStage } from '../types/LifeStages';

interface GameInterfaceProps {
  character: Character;
  setCharacter: (character: Character) => void;
}

const GameInterface = ({ character, setCharacter }: GameInterfaceProps) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'activities' | 'relationships' | 'profile' | 'settings'>('timeline');
  const [currentMajorEvent, setCurrentMajorEvent] = useState<MajorLifeEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);

  const ageUp = () => {
    const newCharacter = { ...character };
    newCharacter.age += 1;
    
    // Apply monthly expenses
    newCharacter.money = Math.max(0, newCharacter.money - (newCharacter.monthlyExpenses || 0));
    
    // Add monthly salary
    newCharacter.money += Math.floor((newCharacter.salary || 0) / 12);
    
    // Continue education
    if (newCharacter.currentEducation && newCharacter.educationYearsLeft) {
      newCharacter.educationYearsLeft -= 1;
      if (newCharacter.educationYearsLeft <= 0) {
        newCharacter.education = newCharacter.currentEducation;
        newCharacter.currentEducation = undefined;
        newCharacter.educationYearsLeft = undefined;
        
        newCharacter.lifeEvents.push({
          id: Math.random().toString(36).substr(2, 9),
          year: newCharacter.birthYear + newCharacter.age,
          age: newCharacter.age,
          event: `Graduated with ${newCharacter.education}!`,
          type: 'positive'
        });
      }
    }
    
    // Apply random stat changes when aging
    const statChanges = {
      health: Math.floor(Math.random() * 11) - 5,
      happiness: Math.floor(Math.random() * 11) - 5,
      smartness: Math.floor(Math.random() * 6) - 2,
      appearance: Math.floor(Math.random() * 7) - 3,
      fitness: Math.floor(Math.random() * 9) - 4
    };

    // Apply changes with bounds checking
    newCharacter.health = Math.max(0, Math.min(100, newCharacter.health + statChanges.health));
    newCharacter.happiness = Math.max(0, Math.min(100, newCharacter.happiness + statChanges.happiness));
    newCharacter.smartness = Math.max(0, Math.min(100, newCharacter.smartness + statChanges.smartness));
    newCharacter.appearance = Math.max(0, Math.min(100, newCharacter.appearance + statChanges.appearance));
    newCharacter.fitness = Math.max(0, Math.min(100, newCharacter.fitness + statChanges.fitness));
    
    // Check for major life events
    const possibleEvents = MAJOR_LIFE_EVENTS.filter(event => 
      newCharacter.age >= event.minAge && 
      newCharacter.age <= event.maxAge &&
      Math.random() < event.probability
    );
    
    if (possibleEvents.length > 0) {
      const selectedEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
      setCurrentMajorEvent(selectedEvent);
      setShowEventDialog(true);
    }
    
    // Random life events
    const randomEvents = [
      'Had a great day at school',
      'Made a new friend',
      'Learned something new',
      'Had a peaceful day',
      'Enjoyed time with family',
      'Got sick and stayed home',
      'Had an argument with a friend',
      'Received a compliment',
      'Failed a test',
      'Won a small prize'
    ];
    
    if (Math.random() < 0.3) {
      const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
      const eventType = event.includes('sick') || event.includes('argument') || event.includes('Failed') ? 'negative' : 
                       event.includes('great') || event.includes('Won') || event.includes('compliment') ? 'positive' : 'neutral';
      
      newCharacter.lifeEvents.push({
        id: Math.random().toString(36).substr(2, 9),
        year: newCharacter.birthYear + newCharacter.age,
        age: newCharacter.age,
        event,
        type: eventType
      });
    }

    // Age family members
    newCharacter.family = newCharacter.family.map(member => ({
      ...member,
      age: member.age + 1
    }));

    setCharacter(newCharacter);
  };

  const handleLifeStageAction = (action: string, effects: { [key: string]: any }) => {
    const newCharacter = { ...character };
    
    // Apply effects
    Object.entries(effects).forEach(([key, value]) => {
      if (key === 'educationType') {
        newCharacter.currentEducation = value;
      } else if (key === 'duration') {
        newCharacter.educationYearsLeft = value;
      } else if (typeof value === 'number' && (newCharacter as any)[key] !== undefined) {
        (newCharacter as any)[key] = Math.max(0, (newCharacter as any)[key] + value);
      } else {
        (newCharacter as any)[key] = value;
      }
    });
    
    // Add life event
    const actionMessages = {
      start_education: `Started ${effects.educationType} education`,
      change_job: `Became a ${effects.job}`,
      buy_housing: `Moved to ${effects.housing}`
    };
    
    newCharacter.lifeEvents.push({
      id: Math.random().toString(36).substr(2, 9),
      year: newCharacter.birthYear + newCharacter.age,
      age: newCharacter.age,
      event: actionMessages[action as keyof typeof actionMessages] || action,
      type: 'positive'
    });
    
    setCharacter(newCharacter);
  };

  const handleMajorEventChoice = (choice: EventChoice) => {
    const newCharacter = { ...character };
    
    // Apply effects
    Object.entries(choice.effects).forEach(([key, value]) => {
      if (typeof value === 'number' && (newCharacter as any)[key] !== undefined) {
        (newCharacter as any)[key] = Math.max(0, (newCharacter as any)[key] + value);
      }
    });
    
    // Add life event
    newCharacter.lifeEvents.push({
      id: Math.random().toString(36).substr(2, 9),
      year: newCharacter.birthYear + newCharacter.age,
      age: newCharacter.age,
      event: `${currentMajorEvent?.name}: ${choice.text}`,
      type: choice.effects.happiness && choice.effects.happiness > 0 ? 'positive' : 
            choice.effects.happiness && choice.effects.happiness < 0 ? 'negative' : 'neutral'
    });
    
    setCharacter(newCharacter);
  };

  const menuItems = [
    { id: 'relationships', icon: Heart },
    { id: 'profile', icon: User },
    { id: 'activities', icon: Briefcase },
    { id: 'timeline', icon: Calendar },
    { id: 'settings', icon: Menu }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'timeline':
        return <TimelineView character={character} onAgeUp={ageUp} onLifeStageAction={handleLifeStageAction} />;
      case 'activities':
        return <ActionsPanel character={character} setCharacter={setCharacter} />;
      case 'relationships':
        return <RelationshipsPanel character={character} setCharacter={setCharacter} />;
      case 'profile':
        return <LifeEvents character={character} />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <TimelineView character={character} onAgeUp={ageUp} onLifeStageAction={handleLifeStageAction} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Stats Header - Always Visible */}
      <div className="bg-slate-800 p-4 border-b border-slate-700">
        <div className="text-center mb-3">
          <h1 className="text-xl font-bold">{character.name}</h1>
          <p className="text-slate-300">
            Age {character.age} • ${character.money.toLocaleString()} • {getCurrentLifeStage(character.age).name}
          </p>
          {character.currentEducation && (
            <p className="text-blue-400 text-sm">
              Studying {character.currentEducation} ({character.educationYearsLeft} years left)
            </p>
          )}
        </div>
        
        {/* Stat Bars */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <StatBar label="Health" value={character.health} color="bg-green-500" />
          <StatBar label="Happiness" value={character.happiness} color="bg-yellow-500" />
          <StatBar label="Smarts" value={character.smartness} color="bg-blue-500" />
          <StatBar label="Looks" value={character.appearance} color="bg-pink-500" />
        </div>
        <div className="mt-2">
          <StatBar label="Fitness" value={character.fitness} color="bg-red-500" />
        </div>
      </div>

      {/* Content Area */}
      <div className="pb-20 px-4 pt-4 overflow-y-auto">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 px-4 py-2">
        <div className="flex justify-around items-center">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`p-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <item.icon size={24} />
            </button>
          ))}
        </div>
      </div>

      {/* Major Event Dialog */}
      <MajorEventDialog
        isOpen={showEventDialog}
        event={currentMajorEvent}
        character={character}
        onChoice={handleMajorEventChoice}
        onClose={() => setShowEventDialog(false)}
      />
    </div>
  );
};

const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs">
      <span className="text-slate-300">{label}</span>
      <span className="text-white">{value}%</span>
    </div>
    <div className="w-full bg-slate-700 rounded-full h-1.5">
      <div
        className={`h-1.5 rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  </div>
);

const TimelineView = ({ 
  character, 
  onAgeUp, 
  onLifeStageAction 
}: { 
  character: Character; 
  onAgeUp: () => void;
  onLifeStageAction: (action: string, effects: { [key: string]: any }) => void;
}) => {
  const currentStage = getCurrentLifeStage(character.age);

  return (
    <div className="space-y-4">
      {/* Character Info Card */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <p className="text-slate-300">
              You are a {character.age} year old {character.gender} in the {currentStage.name} stage
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div className="space-y-1">
                <p className="text-slate-400">Education: <span className="text-white">{character.education}</span></p>
                <p className="text-slate-400">Job: <span className="text-white">{character.job}</span></p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400">Housing: <span className="text-white">{character.housing || 'Parents House'}</span></p>
                <p className="text-slate-400">Monthly Income: <span className="text-green-400">${Math.floor((character.salary || 0) / 12).toLocaleString()}</span></p>
              </div>
            </div>

            {character.family.length > 0 && (
              <div className="space-y-1 text-sm mt-4">
                <p className="text-slate-400">Family:</p>
                {character.family.slice(0, 3).map((member) => (
                  <p key={member.id} className="text-slate-300">
                    {member.name} ({member.relationship}), {member.age}
                  </p>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Life Stage Actions */}
      <LifeStageActions character={character} onAction={onLifeStageAction} />

      {/* Recent Life Events */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Recent Events</h3>
        {character.lifeEvents
          .slice()
          .reverse()
          .slice(0, 5)
          .map((event) => (
            <Card key={event.id} className="bg-slate-800 border-slate-700">
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-white text-sm">{event.event}</p>
                    <p className="text-slate-400 text-xs">
                      Age {event.age} • {event.year}
                    </p>
                  </div>
                  <span className="text-lg">
                    {event.type === 'positive' ? '🎉' : 
                     event.type === 'negative' ? '😢' : '📝'}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Age Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onAgeUp}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg"
        >
          Age Up!
        </Button>
      </div>
    </div>
  );
};

export default GameInterface;

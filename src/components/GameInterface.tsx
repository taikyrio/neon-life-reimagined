
import { useState } from 'react';
import { Character } from '../types/Character';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, User, Briefcase, Calendar, Menu } from 'lucide-react';
import ActionsPanel from './ActionsPanel';
import RelationshipsPanel from './RelationshipsPanel';
import LifeEvents from './LifeEvents';
import SettingsPanel from './SettingsPanel';

interface GameInterfaceProps {
  character: Character;
  setCharacter: (character: Character) => void;
}

const GameInterface = ({ character, setCharacter }: GameInterfaceProps) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'activities' | 'relationships' | 'profile' | 'settings'>('timeline');

  const ageUp = () => {
    const newCharacter = { ...character };
    newCharacter.age += 1;
    
    // Apply random stat changes when aging
    const statChanges = {
      health: Math.floor(Math.random() * 11) - 5, // -5 to +5
      happiness: Math.floor(Math.random() * 11) - 5,
      smartness: Math.floor(Math.random() * 6) - 2, // -2 to +3
      appearance: Math.floor(Math.random() * 7) - 3,
      fitness: Math.floor(Math.random() * 9) - 4
    };

    // Apply changes with bounds checking
    newCharacter.health = Math.max(0, Math.min(100, newCharacter.health + statChanges.health));
    newCharacter.happiness = Math.max(0, Math.min(100, newCharacter.happiness + statChanges.happiness));
    newCharacter.smartness = Math.max(0, Math.min(100, newCharacter.smartness + statChanges.smartness));
    newCharacter.appearance = Math.max(0, Math.min(100, newCharacter.appearance + statChanges.appearance));
    newCharacter.fitness = Math.max(0, Math.min(100, newCharacter.fitness + statChanges.fitness));
    
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
    
    if (Math.random() < 0.4) {
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
        return <TimelineView character={character} onAgeUp={ageUp} />;
      case 'activities':
        return <ActionsPanel character={character} setCharacter={setCharacter} />;
      case 'relationships':
        return <RelationshipsPanel character={character} setCharacter={setCharacter} />;
      case 'profile':
        return <LifeEvents character={character} />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <TimelineView character={character} onAgeUp={ageUp} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Stats Header - Always Visible */}
      <div className="bg-slate-800 p-4 border-b border-slate-700">
        <div className="text-center mb-3">
          <h1 className="text-xl font-bold">{character.name}</h1>
          <p className="text-slate-300">Age {character.age} • ${character.money.toLocaleString()}</p>
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

const TimelineView = ({ character, onAgeUp }: { character: Character; onAgeUp: () => void }) => {
  return (
    <div className="space-y-4">
      {/* Character Info Card */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <p className="text-slate-300">
              You are a {character.age} year old {character.gender}
            </p>
            
            {character.family.length > 0 && (
              <div className="space-y-1 text-sm">
                <p className="text-slate-400">Family:</p>
                {character.family.map((member) => (
                  <p key={member.id} className="text-slate-300">
                    {member.name} ({member.relationship}), {member.age}
                  </p>
                ))}
              </div>
            )}

            <div className="mt-4 p-3 bg-slate-700 rounded-lg text-sm">
              <p className="text-slate-300">Job: {character.job}</p>
              <p className="text-slate-300">Education: {character.education}</p>
            </div>
          </div>
        </CardContent>
      </Card>

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


import { useState } from 'react';
import { Character } from '../types/Character';
import StatsPanel from './StatsPanel';
import LifeEvents from './LifeEvents';
import ActionsPanel from './ActionsPanel';
import RelationshipsPanel from './RelationshipsPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, GraduationCap, Newspaper, Users, Diamond, User, Settings } from 'lucide-react';

interface GameInterfaceProps {
  character: Character;
  setCharacter: (character: Character) => void;
}

const GameInterface = ({ character, setCharacter }: GameInterfaceProps) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'activities' | 'relationships' | 'stats' | 'assets' | 'profile' | 'settings'>('timeline');

  const ageUp = () => {
    const newCharacter = { ...character };
    newCharacter.age += 1;
    
    // Random life events
    const randomEvents = [
      'Had a great day at school',
      'Made a new friend',
      'Learned something new',
      'Had a peaceful day',
      'Enjoyed time with family'
    ];
    
    if (Math.random() < 0.3) {
      const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
      newCharacter.lifeEvents.push({
        id: Math.random().toString(36).substr(2, 9),
        year: newCharacter.birthYear + newCharacter.age,
        age: newCharacter.age,
        event,
        type: 'positive'
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
    { id: 'timeline', icon: Calendar, label: 'Timeline' },
    { id: 'activities', icon: GraduationCap, label: 'Activities' },
    { id: 'relationships', icon: Users, label: 'Relationships' },
    { id: 'stats', icon: Newspaper, label: 'Stats' },
    { id: 'assets', icon: Diamond, label: 'Assets' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'timeline':
        return <TimelineView character={character} onAgeUp={ageUp} />;
      case 'activities':
        return <ActionsPanel character={character} setCharacter={setCharacter} />;
      case 'relationships':
        return <RelationshipsPanel character={character} setCharacter={setCharacter} />;
      case 'stats':
        return <StatsPanel character={character} />;
      case 'profile':
        return <LifeEvents character={character} />;
      default:
        return <TimelineView character={character} onAgeUp={ageUp} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Icon Menu */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200 p-4">
        <div className="flex justify-center space-x-2 overflow-x-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/60 text-slate-600 hover:bg-white/80'
              }`}
            >
              <item.icon size={24} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        {renderContent()}
      </div>
    </div>
  );
};

const TimelineView = ({ character, onAgeUp }: { character: Character; onAgeUp: () => void }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Character Info Card */}
      <Card className="bg-white/90 backdrop-blur-lg border-slate-200 shadow-lg">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-slate-800">
              {character.age} Years Old - {character.birthYear + character.age}
            </h1>
            <p className="text-lg text-slate-600">
              You are a {character.gender}, living your life.
            </p>
            <p className="text-xl font-semibold text-slate-700">
              Your name is {character.name}.
            </p>
            
            {character.family.length > 0 && (
              <div className="mt-4 space-y-1">
                <p className="text-slate-600">You are the {character.gender === 'male' ? 'son' : 'daughter'} of:</p>
                {character.family.map((member) => (
                  <p key={member.id} className="text-slate-700">
                    {member.name} ({member.relationship.charAt(0).toUpperCase() + member.relationship.slice(1)}), {member.age}.
                  </p>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-slate-100 rounded-lg">
              <p className="text-slate-600 font-medium">Money: ${character.money.toLocaleString()}</p>
              <p className="text-slate-600">Job: {character.job}</p>
              <p className="text-slate-600">Education: {character.education}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline of Life Events */}
      <div className="space-y-3">
        {character.lifeEvents
          .slice()
          .reverse()
          .slice(0, 10)
          .map((event, index) => (
            <Card key={event.id} className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-amber-700">
                      {event.age} Years Old - {event.year}
                    </h3>
                    <p className="text-slate-700 mt-1">{event.event}</p>
                  </div>
                  <span className={`text-2xl ${
                    event.type === 'positive' ? '🎉' : 
                    event.type === 'negative' ? '😢' : '📝'
                  }`} />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Age Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={onAgeUp}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg"
        >
          Age!
        </Button>
      </div>
    </div>
  );
};

export default GameInterface;

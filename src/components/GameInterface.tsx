
import { useState } from 'react';
import { Character } from '../types/Character';
import StatsPanel from './StatsPanel';
import LifeEvents from './LifeEvents';
import ActionsPanel from './ActionsPanel';
import RelationshipsPanel from './RelationshipsPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface GameInterfaceProps {
  character: Character;
  setCharacter: (character: Character) => void;
}

const GameInterface = ({ character, setCharacter }: GameInterfaceProps) => {
  const [activeTab, setActiveTab] = useState<'activities' | 'relationships' | 'profile'>('activities');

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

  return (
    <div className="min-h-screen p-4 space-y-4">
      {/* Header */}
      <Card className="bg-slate-800/90 backdrop-blur-lg border-slate-700">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">{character.name}</h1>
              <p className="text-slate-300">Age {character.age} • ${character.money.toLocaleString()}</p>
            </div>
            <Button 
              onClick={ageUp}
              className="bg-green-600 hover:bg-green-700"
            >
              Age +
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Panel */}
      <StatsPanel character={character} />

      {/* Navigation */}
      <div className="flex space-x-2">
        <Button
          variant={activeTab === 'activities' ? 'default' : 'outline'}
          onClick={() => setActiveTab('activities')}
          className="flex-1"
        >
          Activities
        </Button>
        <Button
          variant={activeTab === 'relationships' ? 'default' : 'outline'}
          onClick={() => setActiveTab('relationships')}
          className="flex-1"
        >
          Relationships
        </Button>
        <Button
          variant={activeTab === 'profile' ? 'default' : 'outline'}
          onClick={() => setActiveTab('profile')}
          className="flex-1"
        >
          Profile
        </Button>
      </div>

      {/* Content Panels */}
      {activeTab === 'activities' && (
        <ActionsPanel character={character} setCharacter={setCharacter} />
      )}
      
      {activeTab === 'relationships' && (
        <RelationshipsPanel character={character} setCharacter={setCharacter} />
      )}
      
      {activeTab === 'profile' && (
        <LifeEvents character={character} />
      )}
    </div>
  );
};

export default GameInterface;

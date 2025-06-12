
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Character } from '../types/Character';
import { toast } from 'sonner';

interface ActionsPanelProps {
  character: Character;
  setCharacter: (character: Character) => void;
}

const ActionsPanel = ({ character, setCharacter }: ActionsPanelProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'school' | 'gym' | 'crime' | 'work'>('school');

  const performAction = (action: string, effects: Partial<Character>) => {
    const newCharacter = { ...character, ...effects };
    
    // Add life event
    newCharacter.lifeEvents.push({
      id: Math.random().toString(36).substr(2, 9),
      year: character.birthYear + character.age,
      age: character.age,
      event: action,
      type: effects.happiness && effects.happiness > character.happiness ? 'positive' : 
            effects.happiness && effects.happiness < character.happiness ? 'negative' : 'neutral'
    });

    setCharacter(newCharacter);
    toast.success(action);
  };

  const schoolActions = [
    {
      name: 'Study Hard',
      action: () => performAction('Studied hard and learned new things', {
        smartness: Math.min(100, character.smartness + Math.floor(Math.random() * 10) + 5),
        happiness: Math.max(0, character.happiness - Math.floor(Math.random() * 5))
      })
    },
    {
      name: 'Socialize',
      action: () => performAction('Made new friends at school', {
        happiness: Math.min(100, character.happiness + Math.floor(Math.random() * 10) + 5),
        smartness: Math.max(0, character.smartness - Math.floor(Math.random() * 3))
      })
    }
  ];

  const gymActions = [
    {
      name: 'Cardio Workout',
      action: () => performAction('Did an intense cardio workout', {
        fitness: Math.min(100, character.fitness + Math.floor(Math.random() * 8) + 3),
        health: Math.min(100, character.health + Math.floor(Math.random() * 5) + 2)
      })
    },
    {
      name: 'Weight Training',
      action: () => performAction('Lifted weights and built muscle', {
        fitness: Math.min(100, character.fitness + Math.floor(Math.random() * 10) + 5),
        appearance: Math.min(100, character.appearance + Math.floor(Math.random() * 3) + 1)
      })
    }
  ];

  const crimeActions = [
    {
      name: 'Shoplift',
      action: () => {
        const caught = Math.random() < 0.3;
        if (caught) {
          performAction('Got caught shoplifting', {
            happiness: Math.max(0, character.happiness - 20),
            money: Math.max(0, character.money - 100)
          });
          const newCharacter = { ...character };
          newCharacter.criminalRecord.push({
            id: Math.random().toString(36).substr(2, 9),
            crime: 'Shoplifting',
            year: character.birthYear + character.age,
            age: character.age,
            caught: true,
            punishment: 'Fine'
          });
          setCharacter(newCharacter);
        } else {
          performAction('Successfully shoplifted', {
            money: character.money + Math.floor(Math.random() * 50) + 10,
            happiness: Math.min(100, character.happiness + 5)
          });
        }
      }
    },
    {
      name: 'Vandalism',
      action: () => {
        const caught = Math.random() < 0.4;
        if (caught) {
          performAction('Got caught vandalizing property', {
            happiness: Math.max(0, character.happiness - 15),
            money: Math.max(0, character.money - 200)
          });
        } else {
          performAction('Vandalized property and got away', {
            happiness: Math.min(100, character.happiness + 3)
          });
        }
      }
    }
  ];

  const workActions = [
    {
      name: 'Work Part-time',
      action: () => performAction('Worked a part-time job', {
        money: character.money + Math.floor(Math.random() * 100) + 50,
        happiness: Math.max(0, character.happiness - Math.floor(Math.random() * 5)),
        fitness: Math.max(0, character.fitness - Math.floor(Math.random() * 3))
      })
    },
    {
      name: 'Freelance',
      action: () => performAction('Did freelance work', {
        money: character.money + Math.floor(Math.random() * 200) + 100,
        smartness: Math.min(100, character.smartness + Math.floor(Math.random() * 3) + 1)
      })
    }
  ];

  const getActions = () => {
    switch (selectedCategory) {
      case 'school': return schoolActions;
      case 'gym': return gymActions;
      case 'crime': return crimeActions;
      case 'work': return workActions;
      default: return [];
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Button
          variant={selectedCategory === 'school' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('school')}
          className="text-sm"
        >
          📚 School
        </Button>
        <Button
          variant={selectedCategory === 'gym' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('gym')}
          className="text-sm"
        >
          💪 Gym
        </Button>
        <Button
          variant={selectedCategory === 'work' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('work')}
          className="text-sm"
        >
          💼 Work
        </Button>
        <Button
          variant={selectedCategory === 'crime' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('crime')}
          className="text-sm"
        >
          🔫 Crime
        </Button>
      </div>

      {/* Actions */}
      <Card className="bg-slate-800/90 backdrop-blur-lg border-slate-700">
        <CardHeader>
          <CardTitle className="text-white capitalize">{selectedCategory} Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {getActions().map((action, index) => (
            <Button
              key={index}
              onClick={action.action}
              variant="outline"
              className="w-full justify-start text-left h-auto py-3 bg-slate-700/30 hover:bg-slate-600/50 border-slate-600"
            >
              {action.name}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActionsPanel;

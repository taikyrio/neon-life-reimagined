
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Character } from '../types/Character';

interface CharacterCreationProps {
  onCharacterCreated: (character: Character) => void;
}

const CharacterCreation = ({ onCharacterCreated }: CharacterCreationProps) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const generateRandomStats = () => ({
    health: Math.floor(Math.random() * 50) + 50,
    happiness: Math.floor(Math.random() * 50) + 50,
    smartness: Math.floor(Math.random() * 50) + 50,
    appearance: Math.floor(Math.random() * 50) + 50,
    fitness: Math.floor(Math.random() * 50) + 50,
  });

  const createCharacter = () => {
    if (!name.trim()) return;

    const stats = generateRandomStats();
    const birthYear = new Date().getFullYear();
    
    const character: Character = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      age: 0,
      gender,
      birthYear,
      ...stats,
      money: 0,
      education: 'None',
      job: 'Unemployed',
      salary: 0,
      family: [
        {
          id: '1',
          name: gender === 'male' ? 'John Martin' : 'Jane Martin',
          relationship: 'father',
          age: Math.floor(Math.random() * 20) + 25,
          alive: true,
          relationshipLevel: Math.floor(Math.random() * 50) + 50
        },
        {
          id: '2',
          name: gender === 'male' ? 'Mary Martin' : 'Maria Martin',
          relationship: 'mother',
          age: Math.floor(Math.random() * 20) + 25,
          alive: true,
          relationshipLevel: Math.floor(Math.random() * 50) + 50
        }
      ],
      relationships: [],
      lifeEvents: [{
        id: '1',
        year: birthYear,
        age: 0,
        event: `${name} was born!`,
        type: 'positive'
      }],
      achievements: [],
      criminalRecord: [],
      assets: []
    };

    onCharacterCreated(character);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-lg border-slate-200 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-800">Create Your Life</CardTitle>
          <p className="text-slate-600">Start your journey</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="bg-white/80 border-slate-300 text-slate-800 placeholder-slate-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={gender === 'male' ? 'default' : 'outline'}
                onClick={() => setGender('male')}
                className={gender === 'male' 
                  ? "bg-blue-500 hover:bg-blue-600 text-white" 
                  : "bg-white/80 hover:bg-white border-slate-300 text-slate-700"
                }
              >
                Male
              </Button>
              <Button
                variant={gender === 'female' ? 'default' : 'outline'}
                onClick={() => setGender('female')}
                className={gender === 'female' 
                  ? "bg-pink-500 hover:bg-pink-600 text-white" 
                  : "bg-white/80 hover:bg-white border-slate-300 text-slate-700"
                }
              >
                Female
              </Button>
            </div>
          </div>

          <Button
            onClick={createCharacter}
            disabled={!name.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
          >
            Start Life
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CharacterCreation;

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Character } from '../types/Character';
import { generateRandomPersonality } from '../types/SocialSystem';

interface CharacterCreationProps {
  onCharacterCreate: (character: Character) => void;
}

const CharacterCreation = ({ onCharacterCreate }: CharacterCreationProps) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const stats = generateRandomStats();
    const personalityTraits = generateRandomPersonality();
    
    const newCharacter: Character = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      age: 0,
      gender: gender as 'male' | 'female',
      birthYear: new Date().getFullYear(),
      
      // Core stats
      health: stats.health,
      happiness: stats.happiness,
      smartness: stats.smartness,
      appearance: stats.appearance,
      fitness: stats.fitness,
      
      // Life status
      money: Math.floor(Math.random() * 1000) + 500,
      education: 'none',
      job: 'unemployed',
      salary: 0,
      housing: 'family_home',
      
      // Life progress
      careerLevel: 0,
      
      // Social System
      socialStatus: {
        reputation: 50,
        socialClass: 'lower',
        popularity: Math.floor(Math.random() * 30) + 20,
        networkSize: Math.floor(Math.random() * 5) + 2,
      },
      datingProfile: {
        isActive: false,
        preferences: {
          minAge: Math.max(16, 0),
          maxAge: Math.min(100, 0 + 10),
          personalityTraits: [],
        },
        attractiveness: 0,
        relationshipGoals: 'casual',
      },
      marriageStatus: {
        isMarried: false,
        marriageHappiness: 0,
        divorceRisk: 0,
      },
      personalityTraits,
      
      // Relationships
      family: generateFamily(gender as 'male' | 'female'),
      relationships: [],
      children: [],
      
      // Life events
      lifeEvents: [{
        id: Math.random().toString(36).substr(2, 9),
        year: new Date().getFullYear(),
        age: 0,
        event: `${name} was born!`,
        type: 'positive'
      }],
      pendingEvents: [],
      
      // Other
      achievements: [],
      criminalRecord: [],
      assets: []
    };

    onCharacterCreate(newCharacter);
  };

  const generateRandomStats = () => {
    return {
      health: Math.floor(Math.random() * 30) + 70, // 70-100
      happiness: Math.floor(Math.random() * 30) + 70, // 70-100
      smartness: Math.floor(Math.random() * 50) + 50, // 50-100
      appearance: Math.floor(Math.random() * 50) + 50, // 50-100
      fitness: Math.floor(Math.random() * 30) + 70, // 70-100
    };
  };

  const generateFamily = (gender: 'male' | 'female') => {
    const fatherName = gender === 'male' ? 'John Doe Sr.' : 'John Doe';
    const motherName = gender === 'male' ? 'Jane Doe' : 'Jane Doe Sr.';
    
    return [
      {
        id: '1',
        name: fatherName,
        relationship: 'father',
        age: Math.floor(Math.random() * 15) + 25, // 25-40
        alive: true,
        relationshipLevel: Math.floor(Math.random() * 30) + 70, // 70-100
      },
      {
        id: '2',
        name: motherName,
        relationship: 'mother',
        age: Math.floor(Math.random() * 15) + 25, // 25-40
        alive: true,
        relationshipLevel: Math.floor(Math.random() * 30) + 70, // 70-100
      },
    ];
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Create Your Character</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input
                id="name"
                placeholder="Enter your character's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-white">Gender</Label>
              <RadioGroup 
                value={gender} 
                onValueChange={setGender}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="text-white">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="text-white">Female</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Start Life
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CharacterCreation;


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

  // Random name generation
  const maleFirstNames = [
    'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher',
    'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua',
    'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Jason', 'Edward', 'Jeffrey', 'Ryan'
  ];

  const femaleFirstNames = [
    'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
    'Lisa', 'Nancy', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle',
    'Laura', 'Sarah', 'Kimberly', 'Deborah', 'Dorothy', 'Lisa', 'Nancy', 'Karen', 'Betty', 'Helen'
  ];

  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
  ];

  const getRandomName = (namesArray: string[]) => {
    return namesArray[Math.floor(Math.random() * namesArray.length)];
  };

  const generateRandomCharacterName = (selectedGender: string) => {
    const firstName = selectedGender === 'male' 
      ? getRandomName(maleFirstNames) 
      : getRandomName(femaleFirstNames);
    const lastName = getRandomName(lastNames);
    return `${firstName} ${lastName}`;
  };

  const generateRandomButton = () => {
    const randomName = generateRandomCharacterName(gender);
    setName(randomName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const stats = generateRandomStats();
    const personalityTraits = generateRandomPersonality();
    const characterLastName = name.split(' ').pop() || getRandomName(lastNames);
    
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
      family: generateFamily(gender as 'male' | 'female', characterLastName),
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

  const generateFamily = (selectedGender: 'male' | 'female', lastName: string) => {
    const fatherFirstName = getRandomName(maleFirstNames);
    const motherFirstName = getRandomName(femaleFirstNames);
    
    return [
      {
        id: '1',
        name: `${fatherFirstName} ${lastName}`,
        relationship: 'father' as const,
        age: Math.floor(Math.random() * 15) + 25, // 25-40
        alive: true,
        relationshipLevel: Math.floor(Math.random() * 30) + 70, // 70-100
      },
      {
        id: '2',
        name: `${motherFirstName} ${lastName}`,
        relationship: 'mother' as const,
        age: Math.floor(Math.random() * 15) + 25, // 25-40
        alive: true,
        relationshipLevel: Math.floor(Math.random() * 30) + 70, // 70-100
      },
    ];
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <Card className="w-full max-w-md bg-slate-800/90 backdrop-blur-sm border-slate-600 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-white mb-2">Create Your Character</CardTitle>
          <p className="text-slate-300 text-sm">Begin your life simulation journey</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white font-medium">Character Name</Label>
              <div className="flex gap-2">
                <Input
                  id="name"
                  placeholder="Enter your character's name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-700/80 border-slate-500 text-white placeholder:text-slate-400 focus:border-blue-400 transition-colors flex-1"
                  required
                />
                <Button
                  type="button"
                  onClick={generateRandomButton}
                  className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-2 text-sm"
                >
                  Random
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label className="text-white font-medium">Gender</Label>
              <RadioGroup 
                value={gender} 
                onValueChange={setGender}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" className="border-slate-400 text-blue-400" />
                  <Label htmlFor="male" className="text-white cursor-pointer">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" className="border-slate-400 text-blue-400" />
                  <Label htmlFor="female" className="text-white cursor-pointer">Female</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Start Life Journey
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CharacterCreation;

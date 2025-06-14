
import { useEffect, useState } from 'react';
import GameInterface from '../components/GameInterface';
import { Character } from '../types/Character';
import { generateRandomPersonality } from '../types/SocialSystem';

// Helper function for random name generation (copied & streamlined from CharacterCreation)
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

function generateFamily(selectedGender: 'male' | 'female', lastName: string) {
  const fatherFirstName = getRandomName(maleFirstNames);
  const motherFirstName = getRandomName(femaleFirstNames);

  return [
    {
      id: '1',
      name: `${fatherFirstName} ${lastName}`,
      relationship: 'father' as const,
      age: Math.floor(Math.random() * 15) + 25, // 25-40
      alive: true,
      relationshipLevel: Math.floor(Math.random() * 30) + 70,
    },
    {
      id: '2',
      name: `${motherFirstName} ${lastName}`,
      relationship: 'mother' as const,
      age: Math.floor(Math.random() * 15) + 25, // 25-40
      alive: true,
      relationshipLevel: Math.floor(Math.random() * 30) + 70,
    },
  ];
}

function generateRandomCharacter(): Character {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  const firstName = gender === 'male'
    ? getRandomName(maleFirstNames)
    : getRandomName(femaleFirstNames);
  const lastName = getRandomName(lastNames);
  const fullName = `${firstName} ${lastName}`;
  const personalityTraits = generateRandomPersonality();

  return {
    id: Math.random().toString(36).substr(2, 9),
    name: fullName,
    age: 0,
    gender: gender as 'male' | 'female',
    birthYear: new Date().getFullYear(),
    health: Math.floor(Math.random() * 30) + 70,
    happiness: Math.floor(Math.random() * 30) + 70,
    smartness: Math.floor(Math.random() * 50) + 50,
    appearance: Math.floor(Math.random() * 50) + 50,
    fitness: Math.floor(Math.random() * 30) + 70,
    money: Math.floor(Math.random() * 1000) + 500,
    education: 'none',
    job: 'unemployed',
    salary: 0,
    housing: 'family_home',
    careerLevel: 0,
    socialStatus: {
      reputation: 50,
      socialClass: 'lower',
      popularity: Math.floor(Math.random() * 30) + 20,
      networkSize: Math.floor(Math.random() * 5) + 2,
    },
    datingProfile: {
      isActive: false,
      preferences: {
        minAge: 16,
        maxAge: 26,
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
    family: generateFamily(gender as 'male' | 'female', lastName),
    relationships: [],
    children: [],
    lifeEvents: [{
      id: Math.random().toString(36).substr(2, 9),
      year: new Date().getFullYear(),
      age: 0,
      event: `${fullName} was born!`,
      type: 'positive'
    }],
    pendingEvents: [],
    achievements: [],
    criminalRecord: [],
    assets: []
  };
}

const Index = () => {
  const [character, setCharacter] = useState<Character | null>(null);

  // Only runs once, on mount.
  useEffect(() => {
    setCharacter(generateRandomCharacter());
  }, []);

  return (
    <div className="min-h-screen bg-slate-900">
      {character && (
        <GameInterface character={character} setCharacter={setCharacter} />
      )}
    </div>
  );
};

export default Index;

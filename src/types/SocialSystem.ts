
export interface SocialStatus {
  reputation: number; // 0-100
  socialClass: 'lower' | 'middle' | 'upper';
  popularity: number; // 0-100
  networkSize: number;
}

export interface DatingProfile {
  isActive: boolean;
  preferences: {
    minAge: number;
    maxAge: number;
    personalityTraits: string[];
  };
  attractiveness: number; // Calculated from appearance + personality
  relationshipGoals: 'casual' | 'serious' | 'marriage';
}

export interface MarriageStatus {
  isMarried: boolean;
  spouseId?: string;
  marriageYear?: number;
  marriageHappiness: number; // 0-100
  divorceRisk: number; // 0-100
}

export interface SocialActivity {
  id: string;
  name: string;
  description: string;
  type: 'friendship' | 'dating' | 'family' | 'networking' | 'hobby';
  cost: number;
  minAge: number;
  requirements?: {
    minMoney?: number;
    minSocialStatus?: number;
    specificRelationships?: string[];
  };
  effects: {
    happiness?: number;
    reputation?: number;
    popularity?: number;
    relationshipBoost?: number;
    newRelationshipChance?: number;
  };
  duration: number; // in years
}

export interface Child {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  birthYear: number;
  personality: string[];
  relationshipWithParent: number; // 0-100
  health: number;
  happiness: number;
  smartness: number;
  isAdopted: boolean;
}

export const SOCIAL_ACTIVITIES: SocialActivity[] = [
  {
    id: 'dating_app',
    name: 'Use Dating App',
    description: 'Swipe through potential matches and go on dates',
    type: 'dating',
    cost: 50,
    minAge: 18,
    effects: {
      happiness: 5,
      newRelationshipChance: 30,
    },
    duration: 1,
  },
  {
    id: 'speed_dating',
    name: 'Speed Dating Event',
    description: 'Meet multiple potential partners in one evening',
    type: 'dating',
    cost: 100,
    minAge: 21,
    effects: {
      happiness: 10,
      newRelationshipChance: 45,
      popularity: 5,
    },
    duration: 1,
  },
  {
    id: 'join_club',
    name: 'Join Social Club',
    description: 'Meet like-minded people through shared interests',
    type: 'friendship',
    cost: 200,
    minAge: 16,
    effects: {
      happiness: 15,
      popularity: 10,
      newRelationshipChance: 25,
    },
    duration: 1,
  },
  {
    id: 'host_party',
    name: 'Host House Party',
    description: 'Invite friends over for a memorable gathering',
    type: 'friendship',
    cost: 300,
    minAge: 18,
    requirements: {
      minMoney: 500,
    },
    effects: {
      happiness: 20,
      popularity: 15,
      relationshipBoost: 10,
    },
    duration: 1,
  },
  {
    id: 'networking_event',
    name: 'Professional Networking',
    description: 'Build connections that could benefit your career',
    type: 'networking',
    cost: 150,
    minAge: 22,
    effects: {
      reputation: 10,
      popularity: 8,
      newRelationshipChance: 20,
    },
    duration: 1,
  },
  {
    id: 'charity_work',
    name: 'Volunteer for Charity',
    description: 'Help others and build your reputation in the community',
    type: 'networking',
    cost: 0,
    minAge: 16,
    effects: {
      happiness: 25,
      reputation: 20,
      popularity: 10,
    },
    duration: 1,
  },
  {
    id: 'family_vacation',
    name: 'Family Vacation',
    description: 'Spend quality time with family members',
    type: 'family',
    cost: 1000,
    minAge: 0,
    requirements: {
      minMoney: 1500,
    },
    effects: {
      happiness: 30,
      relationshipBoost: 15,
    },
    duration: 1,
  },
];

export const PERSONALITY_TRAITS = [
  'outgoing', 'shy', 'adventurous', 'creative', 'ambitious', 
  'laid-back', 'intellectual', 'sporty', 'artistic', 'practical',
  'humorous', 'serious', 'optimistic', 'romantic', 'independent'
];

export const calculateAttractiveness = (appearance: number, personality: string[], reputation: number): number => {
  const baseAttractiveness = appearance;
  const personalityBonus = personality.includes('humorous') ? 10 : 
                          personality.includes('outgoing') ? 8 :
                          personality.includes('creative') ? 6 : 0;
  const reputationBonus = Math.floor(reputation / 10);
  
  return Math.min(100, baseAttractiveness + personalityBonus + reputationBonus);
};

export const generateRandomPersonality = (): string[] => {
  const numTraits = Math.floor(Math.random() * 3) + 2; // 2-4 traits
  const shuffled = [...PERSONALITY_TRAITS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numTraits);
};

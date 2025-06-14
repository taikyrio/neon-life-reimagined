
import { Asset as ImportedAsset } from './Asset';
import { SocialStatus, DatingProfile, MarriageStatus, Child } from './SocialSystem';
import { Skill } from './Skills';

export interface Character {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  birthYear: number;
  
  // Core Stats
  health: number;
  happiness: number;
  smartness: number;
  appearance: number;
  fitness: number;
  
  // Life Status
  money: number;
  education: string;
  job: string;
  salary: number;
  housing: string;
  
  // Life Progress
  currentEducation?: string;
  educationYearsLeft?: number;
  careerLevel: number;
  
  // New Career System
  skills?: Skill[];
  experiencePoints?: number;
  
  // Social System
  socialStatus: SocialStatus;
  datingProfile: DatingProfile;
  marriageStatus: MarriageStatus;
  personalityTraits: string[];
  
  // Relationships
  family: FamilyMember[];
  relationships: Relationship[];
  children: Child[];
  
  // Life Events
  lifeEvents: LifeEvent[];
  pendingEvents: PendingEvent[];
  
  // Achievements
  achievements: string[];
  
  // Criminal Record
  criminalRecord: CrimeRecord[];
  
  // Assets
  assets: ImportedAsset[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'mother' | 'father' | 'sibling' | 'child' | 'spouse';
  age: number;
  alive: boolean;
  relationshipLevel: number;
}

export interface Relationship {
  id: string;
  name: string;
  type: 'friend' | 'romantic' | 'enemy' | 'acquaintance' | 'dating' | 'engaged';
  relationshipLevel: number;
  age: number;
  personalityTraits: string[];
  yearMet: number;
  isActive: boolean;
}

export interface LifeEvent {
  id: string;
  year: number;
  age: number;
  event: string;
  type: 'positive' | 'negative' | 'neutral';
}

export interface CrimeRecord {
  id: string;
  crime: string;
  year: number;
  age: number;
  caught: boolean;
  punishment?: string;
}

export interface PendingEvent {
  id: string;
  eventId: string;
  triggerAge: number;
}

// Helper functions
export const calculateTotalMonthlyExpenses = (character: Character, housingOptions: any[], assetList: ImportedAsset[]): number => {
  let totalExpenses = 0;

  const currentHousing = housingOptions.find(h => h.id === character.housing);
  if (currentHousing) {
    totalExpenses += currentHousing.monthlyExpenses;
  }

  character.assets.forEach(asset => {
    totalExpenses += asset.monthlyMaintenance;
  });
  
  // Add child support costs
  const childSupport = character.children.length * 500; // $500 per child per month
  totalExpenses += childSupport;

  return totalExpenses;
};

export const calculateTotalMonthlyAssetIncome = (character: Character): number => {
  let totalIncome = 0;
  character.assets.forEach(asset => {
    totalIncome += asset.monthlyIncome;
  });
  return totalIncome;
};

export const calculateSocialClass = (money: number, salary: number, reputation: number): 'lower' | 'middle' | 'upper' => {
  const totalWealth = money + (salary * 2); // Consider both current money and earning potential
  const adjustedWealth = totalWealth + (reputation * 1000); // Reputation adds to perceived class
  
  if (adjustedWealth < 50000) return 'lower';
  if (adjustedWealth < 200000) return 'middle';
  return 'upper';
};

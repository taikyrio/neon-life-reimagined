
import { Asset as ImportedAsset } from './Asset'; // Renamed import to avoid conflict during transition, will use ImportedAsset

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
  job: string; // Job ID from CAREERS
  salary: number; // Annual salary
  housing: string; // Housing ID from HOUSING_OPTIONS
  
  // Life Progress
  currentEducation?: string; // Education ID from EDUCATION_LEVELS
  educationYearsLeft?: number;
  careerLevel: number; // Index or level within a career path
  
  // Relationships
  family: FamilyMember[];
  relationships: Relationship[];
  
  // Life Events
  lifeEvents: LifeEvent[];
  pendingEvents: PendingEvent[];
  
  // Achievements
  achievements: string[];
  
  // Criminal Record
  criminalRecord: CrimeRecord[];
  
  // Assets
  assets: ImportedAsset[]; // Character's owned assets, using the imported type
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
  type: 'friend' | 'romantic' | 'enemy';
  relationshipLevel: number;
  age: number;
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

// Removed the local Asset interface definition that was causing a conflict.
// export interface Asset {
//   id: string;
//   name: string;
//   type: 'vehicle' | 'property' | 'luxury';
//   value: number;
//   purchaseYear: number;
//   monthlyIncome: number;
//   monthlyMaintenance: number;
// }

export interface PendingEvent {
  id: string;
  eventId: string; // Could be a MajorLifeEvent ID or a custom event ID
  triggerAge: number;
  // additionalData?: any; // For event-specific parameters
}

// Helper function to calculate total monthly expenses (can be moved to a utility file later)
export const calculateTotalMonthlyExpenses = (character: Character, housingOptions: any[], assetList: ImportedAsset[]): number => {
  let totalExpenses = 0;

  // Housing expenses
  const currentHousing = housingOptions.find(h => h.id === character.housing);
  if (currentHousing) {
    totalExpenses += currentHousing.monthlyExpenses;
  }

  // Asset maintenance
  character.assets.forEach(asset => {
    totalExpenses += asset.monthlyMaintenance;
  });
  
  // Add other base living expenses if any (e.g. food, utilities not covered by housing/assets)
  // For now, we'll assume housing and asset maintenance cover a lot.
  // Could add a base living cost: e.g., totalExpenses += 200 (for food, basic needs)

  return totalExpenses;
};

// Helper function to calculate total monthly income from assets
export const calculateTotalMonthlyAssetIncome = (character: Character): number => {
  let totalIncome = 0;
  character.assets.forEach(asset => {
    totalIncome += asset.monthlyIncome;
  });
  return totalIncome;
};


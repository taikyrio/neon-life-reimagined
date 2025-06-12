
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
  
  // Relationships
  family: FamilyMember[];
  relationships: Relationship[];
  
  // Life Events
  lifeEvents: LifeEvent[];
  
  // Achievements
  achievements: string[];
  
  // Criminal Record
  criminalRecord: CrimeRecord[];
  
  // Assets
  assets: Asset[];
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

export interface Asset {
  id: string;
  name: string;
  type: 'vehicle' | 'property' | 'luxury';
  value: number;
  purchaseYear: number;
}


export interface Crime {
  id: string;
  name: string;
  description: string;
  minAge: number;
  maxAge: number;
  category: 'petty' | 'serious' | 'major' | 'white_collar';
  baseSuccessRate: number;
  basePayout: number;
  maxPayout: number;
  arrestChance: number;
  requiredStats?: { [key: string]: number };
  consequences: {
    jail: { min: number; max: number }; // months
    fine: { min: number; max: number };
    reputation: number;
  };
}

export interface CriminalOrganization {
  id: string;
  name: string;
  type: 'gang' | 'mafia' | 'cartel' | 'syndicate';
  reputation: number;
  loyalty: number;
  territory: string[];
  benefits: string[];
  risks: string[];
}

export interface LegalConsequence {
  id: string;
  type: 'arrest' | 'trial' | 'sentence' | 'probation';
  crime: string;
  severity: 'misdemeanor' | 'felony';
  status: 'pending' | 'active' | 'completed';
  duration: number; // months
  fine?: number;
  restrictions: string[];
}

export const CRIMES: Crime[] = [
  // Petty Crimes (Age 12+)
  {
    id: 'shoplifting',
    name: 'Shoplifting',
    description: 'Steal small items from a store',
    minAge: 12,
    maxAge: 100,
    category: 'petty',
    baseSuccessRate: 70,
    basePayout: 50,
    maxPayout: 200,
    arrestChance: 15,
    consequences: {
      jail: { min: 0, max: 3 },
      fine: { min: 100, max: 500 },
      reputation: -5
    }
  },
  {
    id: 'vandalism',
    name: 'Vandalism',
    description: 'Damage public or private property',
    minAge: 12,
    maxAge: 100,
    category: 'petty',
    baseSuccessRate: 80,
    basePayout: 0,
    maxPayout: 0,
    arrestChance: 20,
    consequences: {
      jail: { min: 0, max: 2 },
      fine: { min: 200, max: 1000 },
      reputation: -3
    }
  },
  
  // Serious Crimes (Age 16+)
  {
    id: 'car_theft',
    name: 'Car Theft',
    description: 'Steal a vehicle',
    minAge: 16,
    maxAge: 100,
    category: 'serious',
    baseSuccessRate: 40,
    basePayout: 5000,
    maxPayout: 25000,
    arrestChance: 35,
    requiredStats: { fitness: 30 },
    consequences: {
      jail: { min: 6, max: 24 },
      fine: { min: 2000, max: 10000 },
      reputation: -15
    }
  },
  {
    id: 'burglary',
    name: 'Burglary',
    description: 'Break into a house and steal valuables',
    minAge: 16,
    maxAge: 100,
    category: 'serious',
    baseSuccessRate: 50,
    basePayout: 2000,
    maxPayout: 15000,
    arrestChance: 30,
    requiredStats: { fitness: 25 },
    consequences: {
      jail: { min: 3, max: 18 },
      fine: { min: 1000, max: 8000 },
      reputation: -12
    }
  },
  {
    id: 'drug_dealing',
    name: 'Drug Dealing',
    description: 'Sell illegal substances',
    minAge: 16,
    maxAge: 100,
    category: 'serious',
    baseSuccessRate: 60,
    basePayout: 1000,
    maxPayout: 10000,
    arrestChance: 25,
    requiredStats: { smartness: 20 },
    consequences: {
      jail: { min: 12, max: 60 },
      fine: { min: 5000, max: 50000 },
      reputation: -20
    }
  },
  
  // Major Crimes (Age 18+)
  {
    id: 'bank_robbery',
    name: 'Bank Robbery',
    description: 'Rob a bank for a massive payout',
    minAge: 18,
    maxAge: 100,
    category: 'major',
    baseSuccessRate: 20,
    basePayout: 50000,
    maxPayout: 500000,
    arrestChance: 60,
    requiredStats: { fitness: 50, smartness: 40 },
    consequences: {
      jail: { min: 60, max: 300 },
      fine: { min: 25000, max: 100000 },
      reputation: -50
    }
  },
  {
    id: 'kidnapping',
    name: 'Kidnapping',
    description: 'Kidnap someone for ransom',
    minAge: 18,
    maxAge: 100,
    category: 'major',
    baseSuccessRate: 30,
    basePayout: 100000,
    maxPayout: 1000000,
    arrestChance: 70,
    requiredStats: { fitness: 60, smartness: 50 },
    consequences: {
      jail: { min: 120, max: 600 },
      fine: { min: 50000, max: 500000 },
      reputation: -75
    }
  },
  
  // White Collar Crimes (Age 22+)
  {
    id: 'embezzlement',
    name: 'Embezzlement',
    description: 'Steal money from your company',
    minAge: 22,
    maxAge: 100,
    category: 'white_collar',
    baseSuccessRate: 70,
    basePayout: 25000,
    maxPayout: 250000,
    arrestChance: 20,
    requiredStats: { smartness: 60 },
    consequences: {
      jail: { min: 12, max: 84 },
      fine: { min: 10000, max: 200000 },
      reputation: -30
    }
  },
  {
    id: 'tax_evasion',
    name: 'Tax Evasion',
    description: 'Hide income from tax authorities',
    minAge: 22,
    maxAge: 100,
    category: 'white_collar',
    baseSuccessRate: 80,
    basePayout: 15000,
    maxPayout: 100000,
    arrestChance: 15,
    requiredStats: { smartness: 70 },
    consequences: {
      jail: { min: 6, max: 36 },
      fine: { min: 20000, max: 150000 },
      reputation: -25
    }
  }
];

export const CRIMINAL_ORGANIZATIONS: CriminalOrganization[] = [
  {
    id: 'street_gang',
    name: 'Street Gang',
    type: 'gang',
    reputation: 0,
    loyalty: 0,
    territory: ['Downtown', 'Industrial'],
    benefits: ['Protection', 'Drug Network', 'Weapons Access'],
    risks: ['Gang Wars', 'Police Raids', 'Betrayal']
  },
  {
    id: 'crime_family',
    name: 'Crime Family',
    type: 'mafia',
    reputation: 0,
    loyalty: 0,
    territory: ['Business District', 'Waterfront'],
    benefits: ['High-Level Contacts', 'Money Laundering', 'Political Influence'],
    risks: ['FBI Investigation', 'Family Feuds', 'Omerta Code']
  }
];

export const calculateCrimeSuccess = (
  crime: Crime,
  character: any,
  criminalExperience: number = 0
): { success: boolean; payout: number; arrested: boolean; consequences?: LegalConsequence } => {
  let successRate = crime.baseSuccessRate;
  let arrestChance = crime.arrestChance;
  
  // Modify success rate based on character stats
  if (crime.requiredStats) {
    Object.entries(crime.requiredStats).forEach(([stat, required]) => {
      const characterStat = character[stat] || 0;
      if (characterStat >= required) {
        successRate += Math.min(20, (characterStat - required) / 2);
      } else {
        successRate -= (required - characterStat) / 2;
        arrestChance += (required - characterStat) / 3;
      }
    });
  }
  
  // Criminal experience bonus
  successRate += Math.min(30, criminalExperience / 10);
  arrestChance -= Math.min(15, criminalExperience / 20);
  
  // Criminal record penalty
  const crimeCount = character.criminalRecord?.length || 0;
  arrestChance += crimeCount * 5;
  
  const success = Math.random() * 100 < Math.max(5, Math.min(95, successRate));
  const arrested = Math.random() * 100 < Math.max(1, Math.min(90, arrestChance));
  
  let payout = 0;
  if (success) {
    const payoutRange = crime.maxPayout - crime.basePayout;
    payout = crime.basePayout + Math.random() * payoutRange;
  }
  
  let consequences: LegalConsequence | undefined;
  if (arrested) {
    const jailTime = crime.consequences.jail.min + 
      Math.random() * (crime.consequences.jail.max - crime.consequences.jail.min);
    const fine = crime.consequences.fine.min + 
      Math.random() * (crime.consequences.fine.max - crime.consequences.fine.min);
    
    consequences = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'sentence',
      crime: crime.name,
      severity: crime.category === 'petty' ? 'misdemeanor' : 'felony',
      status: 'active',
      duration: Math.floor(jailTime),
      fine: Math.floor(fine),
      restrictions: ['Background Check Issues', 'Job Application Penalties']
    };
  }
  
  return { success, payout: Math.floor(payout), arrested, consequences };
};


export interface PrisonSentence {
  id: string;
  crime: string;
  originalSentenceYears: number;
  remainingSentenceYears: number;
  startYear: number;
  prisonLevel: 'minimum' | 'medium' | 'maximum';
  paroleEligibleYear?: number;
  goodBehaviorReduction: number;
  behaviorRecord: ('good' | 'neutral' | 'bad')[];
}

export interface PrisonRecord {
  totalTimeServed: number;
  prisonBreaks: number;
  riotsParticipated: number;
  fightsWon: number;
  fightsLost: number;
  educationCompleted: string[];
  reputation: 'weak' | 'neutral' | 'respected' | 'feared';
}

export interface PrisonEvent {
  id: string;
  name: string;
  description: string;
  probability: number;
  consequences: {
    health?: number;
    happiness?: number;
    sentenceModifier?: number;
    reputation?: 'weak' | 'neutral' | 'respected' | 'feared';
    injury?: boolean;
  };
  choices: PrisonChoice[];
}

export interface PrisonChoice {
  id: string;
  text: string;
  effects: {
    health?: number;
    happiness?: number;
    sentenceYears?: number;
    behaviorRating?: 'good' | 'neutral' | 'bad';
    reputation?: 'weak' | 'neutral' | 'respected' | 'feared';
    injury?: boolean;
    escapeAttempt?: boolean;
  };
  requirements?: {
    reputation?: string;
    health?: number;
    money?: number;
  };
}

// Prison-specific crimes with realistic sentences
export const PRISON_CRIMES = [
  { id: 'assault', name: 'Assault', minYears: 1, maxYears: 4, prisonLevel: 'medium' as const },
  { id: 'burglary', name: 'Burglary', minYears: 3, maxYears: 7, prisonLevel: 'medium' as const },
  { id: 'murder', name: 'Murder', minYears: 25, maxYears: 50, prisonLevel: 'maximum' as const },
  { id: 'soliciting', name: 'Soliciting Prostitution', minYears: 1, maxYears: 3, prisonLevel: 'minimum' as const },
  { id: 'disturbing_scene', name: 'Disturbing Crime Scene', minYears: 1, maxYears: 2, prisonLevel: 'minimum' as const },
  { id: 'illegal_immigration', name: 'Illegal Immigration', minYears: 4, maxYears: 6, prisonLevel: 'medium' as const },
  { id: 'noise_complaints', name: 'Excessive Noise Complaints', minYears: 1, maxYears: 2, prisonLevel: 'minimum' as const },
  { id: 'government_protest', name: 'Government Protest', minYears: 1, maxYears: 3, prisonLevel: 'minimum' as const }
];

export const PRISON_EVENTS: PrisonEvent[] = [
  {
    id: 'prison_fight',
    name: 'Prison Fight',
    description: 'Another inmate is challenging you to a fight. How do you respond?',
    probability: 0.3,
    consequences: {},
    choices: [
      {
        id: 'fight_back',
        text: 'Fight back aggressively',
        effects: { health: -15, reputation: 'respected', behaviorRating: 'bad' }
      },
      {
        id: 'defend_only',
        text: 'Defend yourself',
        effects: { health: -5, reputation: 'neutral', behaviorRating: 'neutral' }
      },
      {
        id: 'walk_away',
        text: 'Walk away',
        effects: { reputation: 'weak', behaviorRating: 'good' }
      }
    ]
  },
  {
    id: 'drug_offer',
    name: 'Drug Offering',
    description: 'Someone offers you drugs in prison. What do you do?',
    probability: 0.25,
    consequences: {},
    choices: [
      {
        id: 'accept_drugs',
        text: 'Accept the drugs',
        effects: { happiness: 10, health: -10, behaviorRating: 'bad' }
      },
      {
        id: 'refuse_politely',
        text: 'Politely refuse',
        effects: { behaviorRating: 'good' }
      },
      {
        id: 'report_dealer',
        text: 'Report to guards',
        effects: { reputation: 'weak', behaviorRating: 'good', sentenceYears: -0.5 }
      }
    ]
  },
  {
    id: 'riot_opportunity',
    name: 'Prison Riot',
    description: 'A riot is starting in the prison. Do you want to participate?',
    probability: 0.15,
    consequences: {},
    choices: [
      {
        id: 'join_riot',
        text: 'Join the riot',
        effects: { sentenceYears: 2, reputation: 'feared', behaviorRating: 'bad', injury: true }
      },
      {
        id: 'stay_neutral',
        text: 'Stay in your cell',
        effects: { behaviorRating: 'good' }
      },
      {
        id: 'help_guards',
        text: 'Help the guards',
        effects: { sentenceYears: -1, reputation: 'weak', behaviorRating: 'good' }
      }
    ]
  },
  {
    id: 'education_program',
    name: 'Prison Education',
    description: 'You have the opportunity to join an education program. Will you participate?',
    probability: 0.2,
    consequences: {},
    choices: [
      {
        id: 'join_program',
        text: 'Join the program',
        effects: { sentenceYears: -0.5, behaviorRating: 'good' }
      },
      {
        id: 'skip_program',
        text: 'Skip it',
        effects: { behaviorRating: 'neutral' }
      }
    ]
  },
  {
    id: 'bribery_attempt',
    name: 'Bribery Opportunity',
    description: 'A corrupt guard hints that money could reduce your sentence. What do you do?',
    probability: 0.1,
    consequences: {},
    choices: [
      {
        id: 'pay_bribe',
        text: 'Pay the bribe ($50,000)',
        effects: { sentenceYears: -2, behaviorRating: 'bad' },
        requirements: { money: 50000 }
      },
      {
        id: 'refuse_bribe',
        text: 'Refuse to pay',
        effects: { behaviorRating: 'good' }
      },
      {
        id: 'report_corruption',
        text: 'Report the corruption',
        effects: { sentenceYears: -1, behaviorRating: 'good', reputation: 'weak' }
      }
    ]
  },
  {
    id: 'escape_plan',
    name: 'Escape Opportunity',
    description: 'Fellow inmates invite you to join an escape plan. This is extremely risky.',
    probability: 0.05,
    consequences: {},
    choices: [
      {
        id: 'join_escape',
        text: 'Join the escape attempt',
        effects: { escapeAttempt: true, behaviorRating: 'bad' }
      },
      {
        id: 'decline_escape',
        text: 'Decline to participate',
        effects: { behaviorRating: 'neutral' }
      },
      {
        id: 'report_escape',
        text: 'Report the plan to guards',
        effects: { sentenceYears: -1, reputation: 'weak', behaviorRating: 'good' }
      }
    ]
  }
];

export const calculateSentence = (crimeId: string): { years: number; prisonLevel: 'minimum' | 'medium' | 'maximum' } => {
  const crime = PRISON_CRIMES.find(c => c.id === crimeId);
  if (!crime) return { years: 1, prisonLevel: 'minimum' };
  
  const years = crime.minYears + Math.random() * (crime.maxYears - crime.minYears);
  return { years: Math.ceil(years), prisonLevel: crime.prisonLevel };
};

export const processEscapeAttempt = (character: any): { success: boolean; consequences: any } => {
  const baseSuccessRate = 0.05; // 5% base success rate
  let successRate = baseSuccessRate;
  
  // Factors affecting escape success
  if (character.fitness > 70) successRate += 0.1;
  if (character.smartness > 80) successRate += 0.15;
  if (character.prisonRecord?.reputation === 'feared') successRate += 0.05;
  
  const success = Math.random() < successRate;
  
  if (success) {
    return {
      success: true,
      consequences: {
        freedom: true,
        criminalRecord: 'escaped_convict',
        reputation: { criminal: 50 }
      }
    };
  } else {
    return {
      success: false,
      consequences: {
        sentenceYears: 5, // Add 5 years for failed escape
        health: -20,
        happiness: -30,
        injury: true
      }
    };
  }
};

export const calculateParoleEligibility = (sentence: PrisonSentence): boolean => {
  const timeServed = sentence.originalSentenceYears - sentence.remainingSentenceYears;
  const minimumTimeForParole = Math.ceil(sentence.originalSentenceYears * 0.5); // 50% minimum
  
  return timeServed >= minimumTimeForParole && sentence.goodBehaviorReduction > 0;
};

export const processParoleHearing = (character: any, sentence: PrisonSentence): { granted: boolean; reduction: number } => {
  let paroleChance = 0.3; // Base 30% chance
  
  // Factors affecting parole success
  const goodBehaviorCount = sentence.behaviorRecord.filter(b => b === 'good').length;
  const badBehaviorCount = sentence.behaviorRecord.filter(b => b === 'bad').length;
  
  paroleChance += (goodBehaviorCount * 0.1) - (badBehaviorCount * 0.15);
  
  if (character.education !== 'high_school') paroleChance += 0.1;
  if (character.money > 100000) paroleChance += 0.05; // Good lawyer
  
  const granted = Math.random() < Math.max(0.05, Math.min(0.8, paroleChance));
  const reduction = granted ? Math.ceil(sentence.remainingSentenceYears * 0.5) : 0;
  
  return { granted, reduction };
};

export const generateRandomPrisonEvent = (): PrisonEvent | null => {
  const availableEvents = PRISON_EVENTS.filter(event => Math.random() < event.probability);
  
  if (availableEvents.length === 0) return null;
  
  return availableEvents[Math.floor(Math.random() * availableEvents.length)];
};

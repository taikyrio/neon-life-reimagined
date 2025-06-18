
export interface EnhancedEvent {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: EventCategory;
  type: 'random' | 'contextual' | 'milestone' | 'chain';
  minAge: number;
  maxAge: number;
  baseProbability: number;
  
  // Contextual requirements
  requirements?: {
    stats?: { [key: string]: number };
    education?: string[];
    job?: string[];
    housing?: string[];
    money?: { min?: number; max?: number };
    relationships?: { type: string; minLevel?: number };
    assets?: string[];
    criminalRecord?: boolean;
    married?: boolean;
  };
  
  choices: EnhancedChoice[];
  
  // Event chain properties
  triggerEvents?: string[]; // Events this can trigger
  cooldownDays?: number;
  oncePerLifetime?: boolean;
  
  // Visual properties
  backgroundColor?: string;
  textColor?: string;
}

export interface EnhancedChoice {
  id: string;
  text: string;
  emoji?: string;
  effects: { [key: string]: number };
  
  // Advanced choice properties
  successChance?: number;
  requirements?: { [key: string]: number };
  unlockActions?: string[];
  triggerEvents?: string[];
  cooldownDays?: number;
  
  // Contextual text
  requirementText?: string;
  successText?: string;
  failureText?: string;
}

export type EventCategory = 
  | 'life_stage' 
  | 'relationship' 
  | 'career' 
  | 'health' 
  | 'financial' 
  | 'social' 
  | 'legal' 
  | 'educational'
  | 'crime'
  | 'family'
  | 'romance';

export const ENHANCED_EVENTS: EnhancedEvent[] = [
  // Life Stage Events
  {
    id: 'first_day_school',
    title: 'First Day of School!',
    description: 'Today is your first day of elementary school. You\'re nervous but excited!',
    emoji: '🏫',
    category: 'life_stage',
    type: 'milestone',
    minAge: 5,
    maxAge: 6,
    baseProbability: 0.8,
    oncePerLifetime: true,
    choices: [
      {
        id: 'excited',
        text: 'Be excited and make friends',
        emoji: '😊',
        effects: { happiness: 15, smartness: 5 }
      },
      {
        id: 'shy',
        text: 'Stay quiet and observe',
        emoji: '😐',
        effects: { smartness: 10, happiness: -5 }
      },
      {
        id: 'cry',
        text: 'Cry and want to go home',
        emoji: '😢',
        effects: { happiness: -10, health: -5 }
      }
    ]
  },
  
  // Relationship Events
  {
    id: 'family_fight',
    title: 'Family Argument',
    description: 'Your parents are having a heated argument about money. It\'s making you uncomfortable.',
    emoji: '😰',
    category: 'family',
    type: 'contextual',
    minAge: 8,
    maxAge: 17,
    baseProbability: 0.15,
    requirements: {
      relationships: { type: 'family', minLevel: 30 }
    },
    choices: [
      {
        id: 'mediate',
        text: 'Try to help them resolve it',
        emoji: '🤝',
        effects: { happiness: -5, smartness: 10 },
        successChance: 60,
        successText: 'Your parents appreciate your maturity',
        failureText: 'They tell you it\'s not your business'
      },
      {
        id: 'room',
        text: 'Go to your room and ignore it',
        emoji: '🚪',
        effects: { happiness: -15, health: -5 }
      },
      {
        id: 'support',
        text: 'Comfort the parent who seems more upset',
        emoji: '🤗',
        effects: { happiness: 5 }
      }
    ]
  },
  
  // Career Events
  {
    id: 'workplace_drama',
    title: 'Office Drama',
    description: 'A coworker is spreading rumors about you at work. This could affect your reputation.',
    emoji: '💼',
    category: 'career',
    type: 'contextual',
    minAge: 18,
    maxAge: 65,
    baseProbability: 0.12,
    requirements: {
      job: ['office_worker', 'manager', 'executive', 'lawyer', 'accountant']
    },
    choices: [
      {
        id: 'confront',
        text: 'Confront them directly',
        emoji: '😠',
        effects: { happiness: 10 },
        successChance: 70,
        requirements: { fitness: 60 },
        successText: 'They back down and apologize',
        failureText: 'The confrontation makes things worse'
      },
      {
        id: 'hr',
        text: 'Report them to HR',
        emoji: '📋',
        effects: { smartness: 5 },
        successChance: 80
      },
      {
        id: 'ignore',
        text: 'Ignore it and focus on work',
        emoji: '🤐',
        effects: { happiness: -10, money: 500 }
      }
    ]
  },
  
  // Health Events
  {
    id: 'food_poisoning',
    title: 'Food Poisoning',
    description: 'You ate something that didn\'t agree with you. You feel terrible and need to decide how to handle it.',
    emoji: '🤮',
    category: 'health',
    type: 'random',
    minAge: 10,
    maxAge: 100,
    baseProbability: 0.08,
    choices: [
      {
        id: 'doctor',
        text: 'Go to the doctor immediately',
        emoji: '👩‍⚕️',
        effects: { health: 15, money: -300 }
      },
      {
        id: 'medicine',
        text: 'Take over-the-counter medicine',
        emoji: '💊',
        effects: { health: 10, money: -50 }
      },
      {
        id: 'tough_it_out',
        text: 'Tough it out and rest at home',
        emoji: '🛏️',
        effects: { health: 5, happiness: -10 }
      }
    ]
  },
  
  // Financial Events
  {
    id: 'investment_opportunity',
    title: 'Investment Opportunity',
    description: 'A friend offers you a chance to invest in their startup. It could be risky but profitable.',
    emoji: '📈',
    category: 'financial',
    type: 'contextual',
    minAge: 22,
    maxAge: 60,
    baseProbability: 0.1,
    requirements: {
      money: { min: 10000 },
      smartness: 50
    },
    choices: [
      {
        id: 'invest_big',
        text: 'Invest $10,000',
        emoji: '💰',
        effects: { money: -10000 },
        successChance: 30,
        successText: 'The startup succeeds! You get $50,000 back',
        failureText: 'The startup fails. You lose your investment'
      },
      {
        id: 'invest_small',
        text: 'Invest $2,000 to be safe',
        emoji: '💵',
        effects: { money: -2000 },
        successChance: 30,
        successText: 'You get $10,000 back!',
        failureText: 'You lose the $2,000'
      },
      {
        id: 'decline',
        text: 'Politely decline',
        emoji: '🙅',
        effects: { happiness: -5 }
      }
    ]
  },
  
  // Social Events
  {
    id: 'party_invitation',
    title: 'Party Invitation',
    description: 'You\'ve been invited to a popular classmate\'s party. Everyone who\'s anyone will be there.',
    emoji: '🎉',
    category: 'social',
    type: 'random',
    minAge: 14,
    maxAge: 25,
    baseProbability: 0.15,
    choices: [
      {
        id: 'go_party',
        text: 'Go and have a great time',
        emoji: '🕺',
        effects: { happiness: 20, health: -5 },
        successChance: 85,
        failureText: 'The party gets busted by police'
      },
      {
        id: 'go_responsible',
        text: 'Go but stay responsible',
        emoji: '😇',
        effects: { happiness: 10, smartness: 5 }
      },
      {
        id: 'stay_home',
        text: 'Stay home and study instead',
        emoji: '📚',
        effects: { smartness: 15, happiness: -10 }
      }
    ]
  },
  
  // Legal Events
  {
    id: 'jury_duty',
    title: 'Jury Duty',
    description: 'You\'ve been called for jury duty. It\'s your civic responsibility, but it will take time away from work.',
    emoji: '⚖️',
    category: 'legal',
    type: 'random',
    minAge: 18,
    maxAge: 70,
    baseProbability: 0.05,
    choices: [
      {
        id: 'serve',
        text: 'Serve proudly',
        emoji: '🇺🇸',
        effects: { money: -500, happiness: 10, smartness: 5 }
      },
      {
        id: 'try_excuse',
        text: 'Try to get excused',
        emoji: '🤷',
        effects: { money: 0 },
        successChance: 60,
        failureText: 'You have to serve anyway'
      }
    ]
  },
  
  // Educational Events
  {
    id: 'scholarship_offer',
    title: 'Scholarship Opportunity',
    description: 'A prestigious university is offering you a partial scholarship based on your academic performance!',
    emoji: '🎓',
    category: 'educational',
    type: 'contextual',
    minAge: 17,
    maxAge: 18,
    baseProbability: 0.2,
    requirements: {
      smartness: 80,
      education: ['high_school']
    },
    oncePerLifetime: true,
    choices: [
      {
        id: 'accept',
        text: 'Accept the scholarship',
        emoji: '✅',
        effects: { happiness: 25, smartness: 10, money: 25000 }
      },
      {
        id: 'negotiate',
        text: 'Try to negotiate for more money',
        emoji: '💬',
        effects: { smartness: 5 },
        successChance: 40,
        requirements: { smartness: 90 },
        successText: 'They increase the scholarship amount!',
        failureText: 'They withdraw the offer entirely'
      },
      {
        id: 'decline',
        text: 'Decline and explore other options',
        emoji: '❌',
        effects: { happiness: -10 }
      }
    ]
  },
  
  // Romance Events
  {
    id: 'first_crush',
    title: 'First Crush',
    description: 'You have your first real crush on someone at school. Your heart races when you see them.',
    emoji: '💘',
    category: 'romance',
    type: 'milestone',
    minAge: 12,
    maxAge: 16,
    baseProbability: 0.3,
    oncePerLifetime: true,
    choices: [
      {
        id: 'tell_them',
        text: 'Tell them how you feel',
        emoji: '😍',
        effects: { happiness: 10 },
        successChance: 50,
        successText: 'They like you too!',
        failureText: 'They just want to be friends'
      },
      {
        id: 'secret',
        text: 'Keep it a secret',
        emoji: '🤫',
        effects: { happiness: -5, smartness: 5 }
      },
      {
        id: 'tell_friend',
        text: 'Tell your best friend',
        emoji: '👥',
        effects: { happiness: 5 }
      }
    ]
  }
];

// Enhanced event generation with contextual logic
export const generateEnhancedEvent = (character: any, eventHistory: any[] = []): EnhancedEvent | null => {
  // Filter events based on character context
  const availableEvents = ENHANCED_EVENTS.filter(event => {
    // Age check
    if (character.age < event.minAge || character.age > event.maxAge) return false;
    
    // Once per lifetime check
    if (event.oncePerLifetime && eventHistory.some(e => e.eventId === event.id)) return false;
    
    // Cooldown check (simplified for now)
    const recentSameEvent = eventHistory
      .filter(e => e.eventId === event.id)
      .sort((a, b) => b.year - a.year)[0];
    if (recentSameEvent && event.cooldownDays) {
      const daysSince = (character.age - recentSameEvent.age) * 365;
      if (daysSince < event.cooldownDays) return false;
    }
    
    // Requirements check
    if (event.requirements) {
      const req = event.requirements;
      
      // Stats check
      if (req.stats) {
        for (const [stat, value] of Object.entries(req.stats)) {
          if (character[stat] < value) return false;
        }
      }
      
      // Education check
      if (req.education && !req.education.includes(character.education)) return false;
      
      // Job check
      if (req.job && !req.job.includes(character.job)) return false;
      
      // Money check
      if (req.money) {
        if (req.money.min && character.money < req.money.min) return false;
        if (req.money.max && character.money > req.money.max) return false;
      }
      
      // Criminal record check
      if (req.criminalRecord !== undefined) {
        const hasCriminalRecord = character.criminalRecord && character.criminalRecord.length > 0;
        if (req.criminalRecord !== hasCriminalRecord) return false;
      }
      
      // Marriage check
      if (req.married !== undefined && character.marriageStatus?.isMarried !== req.married) return false;
    }
    
    return true;
  });
  
  if (availableEvents.length === 0) return null;
  
  // Weight events by probability and context
  const weightedEvents = availableEvents.map(event => {
    let weight = event.baseProbability;
    
    // Boost contextual events that match character's situation well
    if (event.type === 'contextual') {
      if (event.category === 'career' && character.job !== 'unemployed') weight *= 1.5;
      if (event.category === 'educational' && character.currentEducation) weight *= 2;
      if (event.category === 'financial' && character.money > 50000) weight *= 1.3;
    }
    
    // Boost milestone events
    if (event.type === 'milestone') weight *= 2;
    
    return { event, weight };
  });
  
  // Random selection based on weights
  const totalWeight = weightedEvents.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of weightedEvents) {
    random -= item.weight;
    if (random <= 0) {
      return item.event;
    }
  }
  
  return weightedEvents[0]?.event || null;
};

// Process choice outcomes with success/failure logic
export const processEnhancedChoice = (choice: EnhancedChoice, character: any) => {
  let effects = { ...choice.effects };
  let eventText = choice.text;
  
  // Handle success chance
  if (choice.successChance !== undefined) {
    const success = Math.random() * 100 < choice.successChance;
    
    if (success && choice.successText) {
      eventText += ` - ${choice.successText}`;
      // Boost positive effects on success
      Object.keys(effects).forEach(key => {
        if (effects[key] > 0) effects[key] = Math.floor(effects[key] * 1.5);
      });
    } else if (!success && choice.failureText) {
      eventText += ` - ${choice.failureText}`;
      // Apply negative consequences on failure
      effects.happiness = (effects.happiness || 0) - 10;
    }
  }
  
  return { effects, eventText };
};

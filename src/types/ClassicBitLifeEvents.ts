
export interface BitLifeEvent {
  id: string;
  title: string;
  description: string;
  emoji: string;
  choices: {
    id: string;
    text: string;
    effects: { [key: string]: number };
    emoji?: string;
  }[];
  type: 'random' | 'major' | 'relationship' | 'career';
  minAge: number;
  maxAge: number;
  probability: number;
}

export const BITLIFE_EVENTS: BitLifeEvent[] = [
  {
    id: 'found_money',
    title: 'Lucky Day!',
    description: 'You found $500 on the ground while walking down the street!',
    emoji: '💰',
    type: 'random',
    minAge: 5,
    maxAge: 100,
    probability: 0.05,
    choices: [
      {
        id: 'keep',
        text: 'Keep the money',
        effects: { money: 500, happiness: 10 },
        emoji: '😊'
      },
      {
        id: 'police',
        text: 'Turn it in to the police',
        effects: { happiness: 5 },
        emoji: '👮'
      }
    ]
  },
  {
    id: 'bully_encounter',
    title: 'Bullying Incident',
    description: 'A classmate is bullying you at school. How do you handle it?',
    emoji: '😠',
    type: 'random',
    minAge: 6,
    maxAge: 18,
    probability: 0.08,
    choices: [
      {
        id: 'fight_back',
        text: 'Fight back',
        effects: { fitness: 5, happiness: -5 },
        emoji: '👊'
      },
      {
        id: 'tell_teacher',
        text: 'Tell a teacher',
        effects: { happiness: 10 },
        emoji: '🏫'
      },
      {
        id: 'ignore',
        text: 'Ignore them',
        effects: { happiness: -10 },
        emoji: '😔'
      }
    ]
  },
  {
    id: 'exam_time',
    title: 'Important Exam',
    description: 'You have a big exam coming up. How do you prepare?',
    emoji: '📚',
    type: 'random',
    minAge: 10,
    maxAge: 25,
    probability: 0.12,
    choices: [
      {
        id: 'study_hard',
        text: 'Study really hard',
        effects: { smartness: 15, happiness: -5 },
        emoji: '🤓'
      },
      {
        id: 'study_normal',
        text: 'Study a reasonable amount',
        effects: { smartness: 8 },
        emoji: '📖'
      },
      {
        id: 'party',
        text: 'Go to a party instead',
        effects: { happiness: 10, smartness: -5 },
        emoji: '🎉'
      }
    ]
  },
  {
    id: 'job_interview',
    title: 'Job Interview',
    description: 'You have an interview for your dream job. How do you prepare?',
    emoji: '💼',
    type: 'career',
    minAge: 16,
    maxAge: 65,
    probability: 0.1,
    choices: [
      {
        id: 'prepare_well',
        text: 'Prepare thoroughly and dress professionally',
        effects: { happiness: 15, money: 1000 },
        emoji: '👔'
      },
      {
        id: 'wing_it',
        text: 'Wing it and hope for the best',
        effects: { happiness: -10 },
        emoji: '🤷'
      },
      {
        id: 'nervous',
        text: 'Get too nervous and cancel',
        effects: { happiness: -20 },
        emoji: '😰'
      }
    ]
  },
  {
    id: 'lottery_ticket',
    title: 'Lottery Ticket',
    description: 'You bought a lottery ticket and won $10,000!',
    emoji: '🎰',
    type: 'random',
    minAge: 18,
    maxAge: 100,
    probability: 0.01,
    choices: [
      {
        id: 'celebrate',
        text: 'Celebrate with friends',
        effects: { money: 10000, happiness: 25 },
        emoji: '🍾'
      },
      {
        id: 'invest',
        text: 'Invest it wisely',
        effects: { money: 12000, smartness: 5 },
        emoji: '📈'
      },
      {
        id: 'spend_all',
        text: 'Go on a shopping spree',
        effects: { money: 5000, happiness: 15 },
        emoji: '🛍️'
      }
    ]
  },
  {
    id: 'health_scare',
    title: 'Health Concern',
    description: 'You\'re feeling unwell and considering seeing a doctor.',
    emoji: '🤒',
    type: 'random',
    minAge: 20,
    maxAge: 100,
    probability: 0.06,
    choices: [
      {
        id: 'see_doctor',
        text: 'Go to the doctor immediately',
        effects: { health: 20, money: -200 },
        emoji: '👩‍⚕️'
      },
      {
        id: 'home_remedy',
        text: 'Try home remedies',
        effects: { health: 5 },
        emoji: '🍵'
      },
      {
        id: 'ignore',
        text: 'Ignore it and hope it goes away',
        effects: { health: -10 },
        emoji: '😷'
      }
    ]
  },
  {
    id: 'charity_request',
    title: 'Charity Appeal',
    description: 'A charity is asking for donations to help those in need.',
    emoji: '❤️',
    type: 'random',
    minAge: 16,
    maxAge: 100,
    probability: 0.07,
    choices: [
      {
        id: 'donate_large',
        text: 'Donate $1,000',
        effects: { money: -1000, happiness: 20 },
        emoji: '💝'
      },
      {
        id: 'donate_small',
        text: 'Donate $100',
        effects: { money: -100, happiness: 10 },
        emoji: '💰'
      },
      {
        id: 'decline',
        text: 'Politely decline',
        effects: { happiness: -5 },
        emoji: '🙅'
      }
    ]
  }
];

// Generate random classic BitLife event
export const generateClassicEvent = (age: number): BitLifeEvent | null => {
  const eligibleEvents = BITLIFE_EVENTS.filter(event => 
    age >= event.minAge && 
    age <= event.maxAge &&
    Math.random() < event.probability
  );
  
  if (eligibleEvents.length === 0) return null;
  
  return eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
};

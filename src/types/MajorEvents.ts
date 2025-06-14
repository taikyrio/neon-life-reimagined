
export interface MajorLifeEvent {
  id: string;
  name: string;
  description: string;
  choices: EventChoice[];
  minAge: number;
  maxAge: number;
  probability: number;
  requirements?: { [key: string]: any };
}

export interface EventChoice {
  id: string;
  text: string;
  effects: { [key: string]: number };
  requirements?: { [key: string]: number };
}

export const MAJOR_LIFE_EVENTS: MajorLifeEvent[] = [
  {
    id: 'college_acceptance',
    name: 'College Acceptance',
    description: 'You\'ve been accepted to college! What do you want to do?',
    minAge: 17,
    maxAge: 19,
    probability: 0.3,
    choices: [
      {
        id: 'accept',
        text: 'Accept and go to college',
        effects: { money: -50000, smartness: 25, happiness: 10 }
      },
      {
        id: 'decline',
        text: 'Decline and start working',
        effects: { money: 20000, smartness: -5 }
      }
    ]
  },
  {
    id: 'job_promotion',
    name: 'Job Promotion Opportunity',
    description: 'Your boss is offering you a promotion with more responsibilities.',
    minAge: 25,
    maxAge: 55,
    probability: 0.2,
    choices: [
      {
        id: 'accept',
        text: 'Accept the promotion',
        effects: { money: 15000, happiness: 15, health: -5 }
      },
      {
        id: 'decline',
        text: 'Stay in current position',
        effects: { happiness: -5 }
      }
    ]
  },
  {
    id: 'inheritance',
    name: 'Unexpected Inheritance',
    description: 'A distant relative has left you money in their will.',
    minAge: 20,
    maxAge: 70,
    probability: 0.1,
    choices: [
      {
        id: 'accept',
        text: 'Accept the inheritance',
        effects: { money: 75000, happiness: 20 }
      }
    ]
  }
];

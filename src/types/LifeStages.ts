
export interface LifeStage {
  name: string;
  minAge: number;
  maxAge: number;
  availableActivities: string[];
  description: string;
}

export const LIFE_STAGES: LifeStage[] = [
  {
    name: 'Baby',
    minAge: 0,
    maxAge: 2,
    availableActivities: ['cry', 'sleep', 'play'],
    description: 'Learning to walk and talk'
  },
  {
    name: 'Child',
    minAge: 3,
    maxAge: 12,
    availableActivities: ['study', 'play', 'make_friends', 'help_family'],
    description: 'Going to elementary school'
  },
  {
    name: 'Teenager',
    minAge: 13,
    maxAge: 17,
    availableActivities: ['study', 'part_time_job', 'date', 'rebel', 'sports', 'volunteer'],
    description: 'High school years'
  },
  {
    name: 'Young Adult',
    minAge: 18,
    maxAge: 25,
    availableActivities: ['college', 'work', 'date', 'travel', 'party', 'move_out'],
    description: 'Starting independence'
  },
  {
    name: 'Adult',
    minAge: 26,
    maxAge: 50,
    availableActivities: ['career', 'marriage', 'buy_house', 'invest', 'raise_children'],
    description: 'Building a life'
  },
  {
    name: 'Middle-aged',
    minAge: 51,
    maxAge: 65,
    availableActivities: ['senior_career', 'mentor', 'travel', 'invest', 'grandchildren'],
    description: 'Peak career years'
  },
  {
    name: 'Senior',
    minAge: 66,
    maxAge: 100,
    availableActivities: ['retire', 'volunteer', 'travel', 'spend_time_family', 'write_memoirs'],
    description: 'Golden years'
  }
];

export const getCurrentLifeStage = (age: number): LifeStage => {
  return LIFE_STAGES.find(stage => age >= stage.minAge && age <= stage.maxAge) || LIFE_STAGES[0];
};

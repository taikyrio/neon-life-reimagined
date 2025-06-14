export interface Career {
  id: string;
  name: string;
  category: string;
  minEducation: string;
  minAge: number;
  baseSalary: number;
  maxSalary: number;
  requiredStats: { [key: string]: number };
  description: string;
}

export interface Education {
  id: string;
  name: string;
  duration: number;
  cost: number;
  minAge: number;
  statBoosts: { [key: string]: number };
  description: string;
}

export const EDUCATION_LEVELS: Education[] = [
  {
    id: 'none',
    name: 'No Education',
    duration: 0,
    cost: 0,
    minAge: 0,
    statBoosts: {},
    description: 'No formal education'
  },
  {
    id: 'elementary',
    name: 'Elementary School',
    duration: 0,
    cost: 0,
    minAge: 5,
    statBoosts: { smartness: 5 },
    description: 'Basic elementary education'
  },
  {
    id: 'middle_school',
    name: 'Middle School',
    duration: 0,
    cost: 0,
    minAge: 11,
    statBoosts: { smartness: 5 },
    description: 'Middle school education'
  },
  {
    id: 'high_school',
    name: 'High School',
    duration: 4,
    cost: 0,
    minAge: 14,
    statBoosts: { smartness: 10 },
    description: 'High school education'
  },
  {
    id: 'college',
    name: 'College Degree',
    duration: 4,
    cost: 50000,
    minAge: 18,
    statBoosts: { smartness: 25, happiness: 5 },
    description: 'University education'
  },
  {
    id: 'masters',
    name: 'Master\'s Degree',
    duration: 2,
    cost: 30000,
    minAge: 22,
    statBoosts: { smartness: 15 },
    description: 'Advanced degree'
  }
];

export const CAREERS: Career[] = [
  {
    id: 'unemployed',
    name: 'Unemployed',
    category: 'none',
    minEducation: 'none',
    minAge: 0,
    baseSalary: 0,
    maxSalary: 0,
    requiredStats: {},
    description: 'Not working'
  },
  {
    id: 'retail_worker',
    name: 'Retail Worker',
    category: 'service',
    minEducation: 'high_school',
    minAge: 16,
    baseSalary: 25000,
    maxSalary: 35000,
    requiredStats: { appearance: 30 },
    description: 'Working in retail'
  },
  {
    id: 'teacher',
    name: 'Teacher',
    category: 'education',
    minEducation: 'college',
    minAge: 22,
    baseSalary: 45000,
    maxSalary: 70000,
    requiredStats: { smartness: 60, happiness: 40 },
    description: 'Educating the next generation'
  },
  {
    id: 'engineer',
    name: 'Software Engineer',
    category: 'technology',
    minEducation: 'college',
    minAge: 22,
    baseSalary: 75000,
    maxSalary: 150000,
    requiredStats: { smartness: 70 },
    description: 'Building software solutions'
  },
  {
    id: 'doctor',
    name: 'Doctor',
    category: 'healthcare',
    minEducation: 'masters',
    minAge: 26,
    baseSalary: 120000,
    maxSalary: 300000,
    requiredStats: { smartness: 80, health: 60 },
    description: 'Healing the sick'
  }
];

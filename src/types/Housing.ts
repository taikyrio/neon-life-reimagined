
export interface Housing {
  id: string;
  name: string;
  cost: number;
  monthlyExpenses: number;
  minAge: number;
  statEffects: { [key: string]: number };
  description: string;
}

export const HOUSING_OPTIONS: Housing[] = [
  {
    id: 'parents_house',
    name: 'Living with Parents',
    cost: 0,
    monthlyExpenses: 0,
    minAge: 0,
    statEffects: { happiness: -5 },
    description: 'Free but limiting'
  },
  {
    id: 'apartment',
    name: 'Small Apartment',
    cost: 80000,
    monthlyExpenses: 1200,
    minAge: 18,
    statEffects: { happiness: 10 },
    description: 'Your first independent living space'
  },
  {
    id: 'house',
    name: 'Family House',
    cost: 250000,
    monthlyExpenses: 2000,
    minAge: 25,
    statEffects: { happiness: 20, health: 5 },
    description: 'Perfect for raising a family'
  },
  {
    id: 'mansion',
    name: 'Luxury Mansion',
    cost: 1000000,
    monthlyExpenses: 5000,
    minAge: 30,
    statEffects: { happiness: 35, appearance: 10 },
    description: 'Living in luxury'
  }
];

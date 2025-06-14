export interface Asset {
  id: string;
  name: string;
  type: 'vehicle' | 'property' | 'investment' | 'luxury_good' | 'business';
  purchasePrice: number;
  currentValue: number;
  purchaseYear?: number; // Year it was bought by the character
  monthlyMaintenance: number;
  monthlyIncome: number;
  description: string;
  minAgeToAcquire: number;
  statEffectsOnPurchase?: { [key: string]: number }; // e.g., happiness boost
  // For investments
  volatility?: number; // e.g., 0.1 for 10% potential swing per year
  averageAnnualGrowth?: number; // e.g., 0.05 for 5% average growth
}

export const ASSET_OPTIONS: Asset[] = [
  {
    id: 'used_car',
    name: 'Used Car',
    type: 'vehicle',
    purchasePrice: 5000,
    currentValue: 5000,
    monthlyMaintenance: 100,
    monthlyIncome: 0,
    description: 'A reliable, if unimpressive, first car.',
    minAgeToAcquire: 16,
    statEffectsOnPurchase: { happiness: 5 },
    averageAnnualGrowth: -0.1, // Depreciates
    volatility: 0.05,
  },
  {
    id: 'new_car',
    name: 'New Car',
    type: 'vehicle',
    purchasePrice: 25000,
    currentValue: 25000,
    monthlyMaintenance: 200,
    monthlyIncome: 0,
    description: 'A brand new car with that new car smell.',
    minAgeToAcquire: 18,
    statEffectsOnPurchase: { happiness: 10 },
    averageAnnualGrowth: -0.08, // Depreciates
    volatility: 0.05,
  },
  {
    id: 'starter_stock_portfolio',
    name: 'Starter Stock Portfolio',
    type: 'investment',
    purchasePrice: 1000,
    currentValue: 1000,
    monthlyMaintenance: 0,
    monthlyIncome: 0, // Income through growth/selling
    description: 'Dip your toes into the stock market.',
    minAgeToAcquire: 18,
    averageAnnualGrowth: 0.07,
    volatility: 0.15,
  },
  {
    id: 'rental_property_small',
    name: 'Small Rental Property',
    type: 'property',
    purchasePrice: 120000,
    currentValue: 120000,
    monthlyMaintenance: 300,
    monthlyIncome: 700,
    description: 'A small property to generate rental income.',
    minAgeToAcquire: 25,
    statEffectsOnPurchase: { happiness: 5 },
    averageAnnualGrowth: 0.03,
    volatility: 0.05,
  },
  {
    id: 'luxury_watch',
    name: 'Luxury Watch',
    type: 'luxury_good',
    purchasePrice: 10000,
    currentValue: 10000,
    monthlyMaintenance: 10,
    monthlyIncome: 0,
    description: 'A fine timepiece that showcases your status.',
    minAgeToAcquire: 22,
    statEffectsOnPurchase: { appearance: 5, happiness: 5 },
    averageAnnualGrowth: 0.01, // Might appreciate slightly or hold value
    volatility: 0.1,
  }
];

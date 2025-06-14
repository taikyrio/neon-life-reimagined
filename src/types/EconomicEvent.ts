import { Asset } from './Asset';

export interface EconomicEvent {
  id: string;
  name: string;
  description: string;
  effects: {
    inflation?: number; // e.g., 0.02 for 2% inflation. Affects all expenses.
    marketTrend?: number; // General trend for investments, e.g., 1.1 for 10% up, 0.9 for 10% down.
    assetTypeSpecificTrend?: { assetType: Asset['type']; trend: number }; // Trend for a specific asset type.
    jobMarketImpact?: 'boom' | 'recession' | 'stagnation'; // Affects job finding, salaries.
    interestRateChange?: number; // New base interest rate, could affect loans or savings.
  };
  durationYears?: number; // How long the event's direct effects might last or be prominent.
  probability: number; // Chance of occurring each year.
}

export const ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: 'recession',
    name: 'Economic Recession',
    description: 'The economy is shrinking. Jobs are harder to find and investments may suffer.',
    effects: {
      marketTrend: 0.85, // Investments generally lose 15% value
      jobMarketImpact: 'recession',
      inflation: 0.01, // Lower inflation during recession
    },
    probability: 0.05, // 5% chance per year
    durationYears: 2,
  },
  {
    id: 'economic_boom',
    name: 'Economic Boom',
    description: 'The economy is thriving! Job opportunities are plentiful and investments are soaring.',
    effects: {
      marketTrend: 1.15, // Investments generally gain 15% value
      jobMarketImpact: 'boom',
      inflation: 0.04, // Higher inflation during boom
    },
    probability: 0.05,
    durationYears: 3,
  },
  {
    id: 'housing_market_crash',
    name: 'Housing Market Crash',
    description: 'Property values have plummeted.',
    effects: {
      assetTypeSpecificTrend: { assetType: 'property', trend: 0.70 }, // Properties lose 30% value
    },
    probability: 0.02,
    durationYears: 1,
  },
  {
    id: 'tech_bubble_burst',
    name: 'Tech Bubble Burst',
    description: 'Technology-related investments have taken a significant hit.',
    effects: {
      // Assuming 'investment' type might cover tech stocks, or we'd need a more granular asset type.
      // For now, let's say general investments are affected slightly, and if we had 'tech_stock' asset type, it would be hit hard.
      marketTrend: 0.90, 
      // If we had assetType 'tech_investment': assetTypeSpecificTrend: { assetType: 'tech_investment', trend: 0.5 }
    },
    probability: 0.03,
    durationYears: 1,
  }
];

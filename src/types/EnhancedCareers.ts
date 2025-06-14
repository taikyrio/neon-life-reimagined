
import { Career } from './Career';

export interface EnhancedCareer extends Career {
  specializations?: CareerSpecialization[];
  criminalOpportunities?: string[];
  lawEnforcementInteraction?: boolean;
}

export interface CareerSpecialization {
  id: string;
  name: string;
  description: string;
  requiredExperience: number;
  salaryMultiplier: number;
  requiredSkills: string[];
}

export const ENHANCED_CAREERS: EnhancedCareer[] = [
  // Law Enforcement Careers
  {
    id: 'police_officer',
    name: 'Police Officer',
    category: 'law_enforcement',
    minEducation: 'high_school',
    minAge: 21,
    baseSalary: 45000,
    maxSalary: 85000,
    requiredStats: { fitness: 50, health: 60 },
    description: 'Protect and serve the community',
    lawEnforcementInteraction: true,
    specializations: [
      {
        id: 'detective',
        name: 'Detective',
        description: 'Investigate crimes and solve cases',
        requiredExperience: 5,
        salaryMultiplier: 1.3,
        requiredSkills: ['analytics', 'communication']
      },
      {
        id: 'swat',
        name: 'SWAT Officer',
        description: 'Special weapons and tactics unit',
        requiredExperience: 7,
        salaryMultiplier: 1.5,
        requiredSkills: ['athletics', 'leadership']
      }
    ]
  },
  {
    id: 'fbi_agent',
    name: 'FBI Agent',
    category: 'law_enforcement',
    minEducation: 'college',
    minAge: 23,
    baseSalary: 65000,
    maxSalary: 130000,
    requiredStats: { smartness: 70, fitness: 60 },
    description: 'Federal law enforcement and investigation',
    lawEnforcementInteraction: true,
    specializations: [
      {
        id: 'cybercrime',
        name: 'Cybercrime Specialist',
        description: 'Combat digital crimes and hackers',
        requiredExperience: 3,
        salaryMultiplier: 1.4,
        requiredSkills: ['programming', 'analytics']
      },
      {
        id: 'organized_crime',
        name: 'Organized Crime Unit',
        description: 'Investigate criminal organizations',
        requiredExperience: 8,
        salaryMultiplier: 1.6,
        requiredSkills: ['negotiation', 'leadership']
      }
    ]
  },
  
  // Criminal Careers
  {
    id: 'crime_boss',
    name: 'Crime Boss',
    category: 'criminal',
    minEducation: 'none',
    minAge: 25,
    baseSalary: 0,
    maxSalary: 1000000,
    requiredStats: { smartness: 60, leadership: 70 },
    description: 'Lead a criminal organization',
    criminalOpportunities: ['extortion', 'money_laundering', 'territory_control']
  },
  {
    id: 'hacker',
    name: 'Criminal Hacker',
    category: 'criminal',
    minEducation: 'high_school',
    minAge: 18,
    baseSalary: 0,
    maxSalary: 500000,
    requiredStats: { smartness: 80 },
    description: 'Cybercriminal specializing in digital theft',
    criminalOpportunities: ['identity_theft', 'cryptocurrency_theft', 'corporate_espionage']
  },
  {
    id: 'drug_lord',
    name: 'Drug Lord',
    category: 'criminal',
    minEducation: 'none',
    minAge: 20,
    baseSalary: 0,
    maxSalary: 2000000,
    requiredStats: { smartness: 50, leadership: 60 },
    description: 'Control drug trafficking operations',
    criminalOpportunities: ['drug_manufacturing', 'territory_wars', 'corruption']
  },
  
  // Enhanced Legal Careers
  {
    id: 'lawyer',
    name: 'Lawyer',
    category: 'legal',
    minEducation: 'masters',
    minAge: 25,
    baseSalary: 80000,
    maxSalary: 500000,
    requiredStats: { smartness: 75, communication: 70 },
    description: 'Practice law and represent clients',
    specializations: [
      {
        id: 'criminal_defense',
        name: 'Criminal Defense Attorney',
        description: 'Defend criminals in court',
        requiredExperience: 3,
        salaryMultiplier: 1.8,
        requiredSkills: ['negotiation', 'public_speaking']
      },
      {
        id: 'prosecutor',
        name: 'Prosecutor',
        description: 'Prosecute criminals for the state',
        requiredExperience: 5,
        salaryMultiplier: 1.4,
        requiredSkills: ['analytics', 'public_speaking']
      }
    ]
  },
  {
    id: 'judge',
    name: 'Judge',
    category: 'legal',
    minEducation: 'masters',
    minAge: 35,
    baseSalary: 120000,
    maxSalary: 250000,
    requiredStats: { smartness: 85, leadership: 60 },
    description: 'Preside over court proceedings',
    lawEnforcementInteraction: true
  },
  
  // Enhanced Security Careers
  {
    id: 'private_investigator',
    name: 'Private Investigator',
    category: 'security',
    minEducation: 'high_school',
    minAge: 25,
    baseSalary: 35000,
    maxSalary: 85000,
    requiredStats: { smartness: 60, fitness: 40 },
    description: 'Conduct private investigations',
    specializations: [
      {
        id: 'corporate_security',
        name: 'Corporate Security Specialist',
        description: 'Protect corporate interests',
        requiredExperience: 4,
        salaryMultiplier: 1.5,
        requiredSkills: ['analytics', 'negotiation']
      }
    ]
  },
  {
    id: 'bodyguard',
    name: 'Bodyguard',
    category: 'security',
    minEducation: 'high_school',
    minAge: 21,
    baseSalary: 40000,
    maxSalary: 150000,
    requiredStats: {fitness: 70, health: 65 },
    description: 'Protect high-profile individuals',
    specializations: [
      {
        id: 'celebrity_protection',
        name: 'Celebrity Protection',
        description: 'Protect celebrities and VIPs',
        requiredExperience: 6,
        salaryMultiplier: 2.0,
        requiredSkills: ['athletics', 'time_management']
      }
    ]
  }
];

export const getCareerCrimeOpportunities = (careerId: string): string[] => {
  const career = ENHANCED_CAREERS.find(c => c.id === careerId);
  return career?.criminalOpportunities || [];
};

export const isLawEnforcementCareer = (careerId: string): boolean => {
  const career = ENHANCED_CAREERS.find(c => c.id === careerId);
  return career?.lawEnforcementInteraction || false;
};

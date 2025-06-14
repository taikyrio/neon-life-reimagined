
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'education' | 'career' | 'relationship' | 'financial' | 'health' | 'social';
  unlocked: boolean;
  unlockedAt?: {
    age: number;
    year: number;
  };
}

export const ACHIEVEMENTS: Achievement[] = [
  // Education
  {
    id: 'graduate_high_school',
    name: 'Graduate',
    description: 'Complete high school education',
    icon: '🎓',
    category: 'education',
    unlocked: false
  },
  {
    id: 'college_graduate',
    name: 'Scholar',
    description: 'Earn a college degree',
    icon: '📚',
    category: 'education',
    unlocked: false
  },
  {
    id: 'masters_degree',
    name: 'Academic Excellence',
    description: 'Earn a master\'s degree',
    icon: '🏆',
    category: 'education',
    unlocked: false
  },
  
  // Career
  {
    id: 'first_job',
    name: 'Working Life',
    description: 'Get your first job',
    icon: '💼',
    category: 'career',
    unlocked: false
  },
  {
    id: 'promotion',
    name: 'Moving Up',
    description: 'Get promoted at work',
    icon: '📈',
    category: 'career',
    unlocked: false
  },
  {
    id: 'high_salary',
    name: 'Big Earner',
    description: 'Earn over $100,000 per year',
    icon: '💰',
    category: 'career',
    unlocked: false
  },
  
  // Financial
  {
    id: 'first_10k',
    name: 'Saver',
    description: 'Save $10,000',
    icon: '💵',
    category: 'financial',
    unlocked: false
  },
  {
    id: 'millionaire',
    name: 'Millionaire',
    description: 'Accumulate $1,000,000',
    icon: '💎',
    category: 'financial',
    unlocked: false
  },
  
  // Relationships
  {
    id: 'best_friend',
    name: 'Best Friends',
    description: 'Have a relationship level of 90+ with someone',
    icon: '👥',
    category: 'relationship',
    unlocked: false
  },
  {
    id: 'married',
    name: 'Married Life',
    description: 'Get married',
    icon: '💒',
    category: 'relationship',
    unlocked: false
  },
  {
    id: 'parent',
    name: 'Parent',
    description: 'Have your first child',
    icon: '👶',
    category: 'relationship',
    unlocked: false
  },
  
  // Social
  {
    id: 'popular',
    name: 'Popular',
    description: 'Reach 80+ popularity',
    icon: '⭐',
    category: 'social',
    unlocked: false
  }
];

export const checkAchievements = (character: any): Achievement[] => {
  const newAchievements: Achievement[] = [];
  
  ACHIEVEMENTS.forEach(achievement => {
    if (character.achievements?.includes(achievement.id)) return;
    
    let shouldUnlock = false;
    
    switch (achievement.id) {
      case 'graduate_high_school':
        shouldUnlock = character.education === 'high_school' && character.age >= 18;
        break;
      case 'college_graduate':
        shouldUnlock = character.education === 'college';
        break;
      case 'masters_degree':
        shouldUnlock = character.education === 'masters';
        break;
      case 'first_job':
        shouldUnlock = character.job !== 'unemployed';
        break;
      case 'promotion':
        shouldUnlock = character.careerLevel > 0;
        break;
      case 'high_salary':
        shouldUnlock = character.salary >= 100000;
        break;
      case 'first_10k':
        shouldUnlock = character.money >= 10000;
        break;
      case 'millionaire':
        shouldUnlock = character.money >= 1000000;
        break;
      case 'best_friend':
        shouldUnlock = character.relationships?.some((rel: any) => rel.relationshipLevel >= 90) ||
                      character.family?.some((member: any) => member.relationshipLevel >= 90);
        break;
      case 'married':
        shouldUnlock = character.marriageStatus?.isMarried;
        break;
      case 'parent':
        shouldUnlock = character.children?.length > 0;
        break;
      case 'popular':
        shouldUnlock = character.socialStatus?.popularity >= 80;
        break;
    }
    
    if (shouldUnlock) {
      newAchievements.push({
        ...achievement,
        unlocked: true,
        unlockedAt: {
          age: character.age,
          year: character.birthYear + character.age
        }
      });
    }
  });
  
  return newAchievements;
};

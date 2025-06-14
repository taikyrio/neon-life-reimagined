
export interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
  category: 'technical' | 'social' | 'creative' | 'physical' | 'business';
}

export interface CareerAdvancement {
  currentLevel: number;
  experiencePoints: number;
  nextPromotionAt: number;
  availableSkills: string[];
}

export const SKILL_DEFINITIONS = [
  { id: 'programming', name: 'Programming', category: 'technical' as const },
  { id: 'communication', name: 'Communication', category: 'social' as const },
  { id: 'leadership', name: 'Leadership', category: 'business' as const },
  { id: 'creativity', name: 'Creativity', category: 'creative' as const },
  { id: 'athletics', name: 'Athletics', category: 'physical' as const },
  { id: 'negotiation', name: 'Negotiation', category: 'business' as const },
  { id: 'design', name: 'Design', category: 'creative' as const },
  { id: 'analytics', name: 'Analytics', category: 'technical' as const },
  { id: 'public_speaking', name: 'Public Speaking', category: 'social' as const },
  { id: 'time_management', name: 'Time Management', category: 'business' as const }
];

export const getCareerSkillBonus = (skills: Skill[], careerType: string): number => {
  const relevantSkills = {
    'engineer': ['programming', 'analytics', 'creativity'],
    'teacher': ['communication', 'public_speaking', 'leadership'],
    'doctor': ['analytics', 'communication', 'time_management'],
    'retail_worker': ['communication', 'time_management']
  };
  
  const career = relevantSkills[careerType as keyof typeof relevantSkills] || [];
  const totalBonus = career.reduce((sum, skillId) => {
    const skill = skills.find(s => s.id === skillId);
    return sum + (skill ? skill.level : 0);
  }, 0);
  
  return Math.floor(totalBonus / career.length) || 0;
};

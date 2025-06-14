
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Lock } from 'lucide-react';
import { Character } from '../types/Character';
import { SKILL_DEFINITIONS, getCareerSkillBonus } from '../types/Skills';
import { toast } from 'sonner';

interface CareerDevelopmentProps {
  character: Character;
  onAction: (actionType: string, payload: any) => void;
}

const CareerDevelopment = ({ character, onAction }: CareerDevelopmentProps) => {
  const skills = character.skills || [];
  const careerLevel = character.careerLevel || 0;
  const experiencePoints = character.experiencePoints || 0;
  const nextPromotionAt = (careerLevel + 1) * 100;
  
  // Age restrictions
  const canTrainSkills = character.age >= 12; // Middle school age
  const canRequestPromotion = character.age >= 16 && character.job !== 'unemployed';
  
  const skillTraining = (skillId: string) => {
    if (!canTrainSkills) {
      toast.error("You're too young to start skill training!");
      return;
    }
    
    const cost = 500;
    if (character.money < cost) {
      toast.error("Not enough money for skill training!");
      return;
    }
    
    onAction('train_skill', {
      skillId,
      cost,
      experienceGain: 25
    });
    toast.success(`Improved ${SKILL_DEFINITIONS.find(s => s.id === skillId)?.name} skill!`);
  };

  const requestPromotion = () => {
    if (!canRequestPromotion) {
      if (character.age < 16) {
        toast.error("You need to be at least 16 to get promotions!");
      } else {
        toast.error("You need a job first!");
      }
      return;
    }
    
    if (experiencePoints < nextPromotionAt) {
      toast.error(`Need ${nextPromotionAt - experiencePoints} more experience points!`);
      return;
    }
    
    const skillBonus = getCareerSkillBonus(skills, character.job);
    const promotionChance = Math.min(80, 40 + skillBonus);
    
    if (Math.random() * 100 < promotionChance) {
      onAction('promotion', {
        salaryIncrease: Math.floor(character.salary * 0.3),
        experienceReset: true
      });
      toast.success("Promoted! Your salary increased!");
    } else {
      toast.error("Promotion denied. Keep building your skills!");
    }
  };

  const getSkillMinAge = (skillId: string) => {
    const ageRequirements = {
      'programming': 12,
      'analytics': 14,
      'design': 8,
      'creativity': 5,
      'communication': 8,
      'public_speaking': 12,
      'leadership': 16,
      'negotiation': 16,
      'time_management': 10,
      'athletics': 6
    };
    return ageRequirements[skillId as keyof typeof ageRequirements] || 12;
  };

  const categoryColors = {
    technical: 'bg-blue-500',
    social: 'bg-green-500',
    creative: 'bg-purple-500',
    physical: 'bg-red-500',
    business: 'bg-yellow-500'
  };

  if (character.age < 5) {
    return (
      <div className="space-y-4">
        <Card className="bg-slate-800/90 backdrop-blur-lg border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock size={20} />
              Career Development
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-slate-400 text-lg">
              You're too young for career development!
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Come back when you're older to start building skills.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Career Progress */}
      <Card className="bg-slate-800/90 backdrop-blur-lg border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Career Development</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300">Career Level: {careerLevel}</span>
              <span className="text-slate-400">Next: {experiencePoints}/{nextPromotionAt} XP</span>
            </div>
            <Progress value={(experiencePoints / nextPromotionAt) * 100} className="h-2" />
          </div>
          
          <Button 
            onClick={requestPromotion}
            disabled={!canRequestPromotion || experiencePoints < nextPromotionAt}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600"
          >
            {!canRequestPromotion ? (
              character.age < 16 ? "Too Young for Promotions" : "Need a Job First"
            ) : experiencePoints < nextPromotionAt ? (
              "Not Enough Experience"
            ) : (
              "Request Promotion"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="bg-slate-800/90 backdrop-blur-lg border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Skills Development</CardTitle>
          {!canTrainSkills && (
            <p className="text-slate-400 text-sm">
              Available from age 12 - focus on school for now!
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {SKILL_DEFINITIONS.map((skillDef) => {
            const currentSkill = skills.find(s => s.id === skillDef.id);
            const level = currentSkill?.level || 0;
            const minAge = getSkillMinAge(skillDef.id);
            const isLocked = character.age < minAge;
            
            return (
              <div key={skillDef.id} className={`p-3 rounded-lg ${isLocked ? 'bg-slate-700/20 opacity-50' : 'bg-slate-700/30'}`}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-white font-medium ${isLocked ? 'text-slate-500' : ''}`}>
                      {skillDef.name}
                    </span>
                    <span className={`w-3 h-3 rounded-full ${categoryColors[skillDef.category]}`} title={skillDef.category}></span>
                    {isLocked && <Lock size={14} className="text-slate-500" />}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => skillTraining(skillDef.id)}
                    disabled={isLocked || !canTrainSkills || character.money < 500 || level >= 100}
                    className="bg-green-600 hover:bg-green-700 text-xs disabled:bg-slate-600"
                  >
                    {isLocked ? `Age ${minAge}+` : 
                     !canTrainSkills ? "Too Young" :
                     character.money < 500 ? "No Money" :
                     level >= 100 ? "Maxed" : "Train ($500)"}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={level} className="flex-1 h-2" />
                  <span className={`text-sm w-12 ${isLocked ? 'text-slate-500' : 'text-slate-400'}`}>
                    {level}%
                  </span>
                </div>
                {isLocked && (
                  <p className="text-slate-500 text-xs mt-1">
                    Unlocks at age {minAge}
                  </p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerDevelopment;

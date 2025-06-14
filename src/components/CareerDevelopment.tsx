
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  
  const skillTraining = (skillId: string) => {
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
    if (character.job === 'unemployed') {
      toast.error("You need a job first!");
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

  const categoryColors = {
    technical: 'bg-blue-500',
    social: 'bg-green-500',
    creative: 'bg-purple-500',
    physical: 'bg-red-500',
    business: 'bg-yellow-500'
  };

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
          
          {character.job !== 'unemployed' && (
            <Button 
              onClick={requestPromotion}
              disabled={experiencePoints < nextPromotionAt}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Request Promotion
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="bg-slate-800/90 backdrop-blur-lg border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Skills Development</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {SKILL_DEFINITIONS.map((skillDef) => {
            const currentSkill = skills.find(s => s.id === skillDef.id);
            const level = currentSkill?.level || 0;
            
            return (
              <div key={skillDef.id} className="p-3 bg-slate-700/30 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{skillDef.name}</span>
                    <span className={`w-3 h-3 rounded-full ${categoryColors[skillDef.category]}`} title={skillDef.category}></span>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => skillTraining(skillDef.id)}
                    disabled={character.money < 500 || level >= 100}
                    className="bg-green-600 hover:bg-green-700 text-xs"
                  >
                    Train ($500)
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={level} className="flex-1 h-2" />
                  <span className="text-slate-400 text-sm w-12">{level}%</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default CareerDevelopment;

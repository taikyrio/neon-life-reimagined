
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Character } from '../types/Character';
import { getCurrentLifeStage } from '../types/LifeStages';
import { CAREERS, EDUCATION_LEVELS } from '../types/Career';
import { HOUSING_OPTIONS } from '../types/Housing';

interface LifeStageActionsProps {
  character: Character;
  onAction: (action: string, effects: { [key: string]: any }) => void;
}

const LifeStageActions = ({ character, onAction }: LifeStageActionsProps) => {
  const currentStage = getCurrentLifeStage(character.age);
  
  const getAvailableActions = () => {
    const actions = [];
    
    // Education actions
    if (character.age >= 18 && !character.currentEducation) {
      const availableEducation = EDUCATION_LEVELS.filter(
        edu => character.age >= edu.minAge && edu.id !== character.education
      );
      
      actions.push(...availableEducation.map(edu => ({
        id: `start_education_${edu.id}`,
        name: `Start ${edu.name}`,
        description: edu.description,
        cost: edu.cost,
        action: () => onAction('start_education', {
          educationType: edu.id,
          duration: edu.duration,
          cost: -edu.cost,
          ...Object.fromEntries(Object.entries(edu.statBoosts).map(([k, v]) => [k, v]))
        })
      })));
    }
    
    // Career actions
    if (character.age >= 16) {
      const availableCareers = CAREERS.filter(career => 
        character.age >= career.minAge && 
        career.id !== character.job &&
        (career.minEducation === 'none' || 
         EDUCATION_LEVELS.findIndex(e => e.id === character.education) >= 
         EDUCATION_LEVELS.findIndex(e => e.id === career.minEducation))
      );
      
      actions.push(...availableCareers.map(career => ({
        id: `change_job_${career.id}`,
        name: `Become ${career.name}`,
        description: career.description,
        salary: career.baseSalary,
        action: () => onAction('change_job', {
          job: career.id,
          salary: career.baseSalary,
          happiness: 10
        })
      })));
    }
    
    // Housing actions
    if (character.age >= 18) {
      const availableHousing = HOUSING_OPTIONS.filter(house =>
        character.age >= house.minAge && 
        house.id !== character.housing &&
        character.money >= house.cost
      );
      
      actions.push(...availableHousing.map(house => ({
        id: `buy_housing_${house.id}`,
        name: `Move to ${house.name}`,
        description: house.description,
        cost: house.cost,
        action: () => onAction('buy_housing', {
          housing: house.id,
          cost: -house.cost,
          monthlyExpenses: house.monthlyExpenses,
          ...Object.fromEntries(Object.entries(house.statEffects).map(([k, v]) => [k, v]))
        })
      })));
    }
    
    return actions;
  };

  const actions = getAvailableActions();

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">
          {currentStage.name} Actions ({character.age} years old)
        </CardTitle>
        <p className="text-slate-400 text-sm">{currentStage.description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.length === 0 ? (
          <p className="text-slate-400 text-center py-4">No actions available at this time</p>
        ) : (
          actions.map((action) => (
            <div key={action.id} className="p-3 bg-slate-700 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-white font-medium">{action.name}</h4>
                  <p className="text-slate-300 text-sm">{action.description}</p>
                </div>
                {(action.cost || action.salary) && (
                  <div className="text-right text-sm">
                    {action.cost && <p className="text-red-400">Cost: ${action.cost.toLocaleString()}</p>}
                    {action.salary && <p className="text-green-400">Salary: ${action.salary.toLocaleString()}</p>}
                  </div>
                )}
              </div>
              <Button
                onClick={action.action}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={action.cost && character.money < action.cost}
              >
                {action.cost && character.money < action.cost ? 'Cannot Afford' : 'Choose'}
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default LifeStageActions;

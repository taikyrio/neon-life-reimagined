import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Character } from '../types/Character';
import { getCurrentLifeStage } from '../types/LifeStages';
import { CAREERS, EDUCATION_LEVELS } from '../types/Career';
import { HOUSING_OPTIONS } from '../types/Housing';
import { ASSET_OPTIONS, Asset } from '../types/Asset';

interface LifeStageActionsProps {
  character: Character;
  onAction: (actionType: string, payload: { [key: string]: any }) => void;
}

const LifeStageActions = ({ character, onAction }: LifeStageActionsProps) => {
  const currentStage = getCurrentLifeStage(character.age);
  
  const getAvailableActions = () => {
    const actions = [];
    
    // Education actions
    if (character.age >= 18 && !character.currentEducation) {
      const availableEducation = EDUCATION_LEVELS.filter(
        edu => character.age >= edu.minAge && edu.id !== character.education && character.money >= edu.cost
      );
      
      actions.push(...availableEducation.map(edu => ({
        id: `start_education_${edu.id}`,
        name: `Start ${edu.name} ($${edu.cost.toLocaleString()})`,
        description: edu.description,
        cost: edu.cost,
        type: 'education',
        action: () => onAction('start_education', {
          educationId: edu.id,
          duration: edu.duration,
          cost: edu.cost,
          statBoosts: edu.statBoosts
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
        name: `Become ${career.name} (Salary: $${career.baseSalary.toLocaleString()}/yr)`,
        description: career.description,
        salary: career.baseSalary,
        type: 'career',
        action: () => onAction('change_job', {
          jobId: career.id,
          salary: career.baseSalary,
          happinessBoost: 10
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
        name: `Move to ${house.name} ($${house.cost.toLocaleString()})`,
        description: house.description,
        cost: house.cost,
        type: 'housing',
        action: () => onAction('buy_housing', {
          housingId: house.id,
          cost: house.cost,
          monthlyExpensesChange: house.monthlyExpenses,
          statEffects: house.statEffects
        })
      })));
    }

    // Asset Purchase Actions
    ASSET_OPTIONS.forEach(asset => {
      if (character.age >= asset.minAgeToAcquire && character.money >= asset.purchasePrice && !character.assets.find(a => a.id === asset.id)) {
        actions.push({
          id: `buy_asset_${asset.id}`,
          name: `Buy ${asset.name} ($${asset.purchasePrice.toLocaleString()})`,
          description: `${asset.description} (Maint: $${asset.monthlyMaintenance}/mo, Income: $${asset.monthlyIncome}/mo)`,
          cost: asset.purchasePrice,
          type: 'asset_buy',
          action: () => onAction('buy_asset', {
            assetId: asset.id,
            purchasePrice: asset.purchasePrice,
            statEffects: asset.statEffectsOnPurchase,
          }),
        });
      }
    });

    // Asset Sell Actions
    character.assets.forEach(ownedAsset => {
      const assetDetails = ASSET_OPTIONS.find(opt => opt.id === ownedAsset.id);
      if (assetDetails) {
        actions.push({
          id: `sell_asset_${ownedAsset.id}`,
          name: `Sell ${ownedAsset.name} (Value: $${ownedAsset.currentValue.toLocaleString()})`,
          description: `Sell your ${ownedAsset.name}.`,
          type: 'asset_sell',
          income: ownedAsset.currentValue,
          action: () => onAction('sell_asset', {
            assetId: ownedAsset.id,
            sellPrice: ownedAsset.currentValue,
          }),
        });
      }
    });
    
    return actions.sort((a, b) => (a.cost || 0) - (b.cost || 0));
  };

  const actions = getAvailableActions();

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-lg">
      <CardHeader>
        <CardTitle className="text-white text-xl">
          {currentStage.name} Opportunities ({character.age} years old)
        </CardTitle>
        <p className="text-slate-400 text-sm">{currentStage.description}</p>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {actions.length === 0 ? (
          <p className="text-slate-400 text-center py-4">No specific opportunities available right now. Focus on your current path or age up!</p>
        ) : (
          actions.map((action) => (
            <div key={action.id} className="p-3 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-blue-500 transition-all">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-white font-semibold">{action.name}</h4>
                  <p className="text-slate-300 text-xs">{action.description}</p>
                </div>
                {(action.cost || action.salary || action.income) && (
                  <div className="text-right text-sm ml-2 flex-shrink-0">
                    {action.cost && <p className="text-red-400">Cost: ${action.cost.toLocaleString()}</p>}
                    {action.salary && <p className="text-green-400">Salary: ${action.salary.toLocaleString()}/yr</p>}
                    {action.income && <p className="text-green-400">Gain: $${action.income.toLocaleString()}</p>}
                  </div>
                )}
              </div>
              <Button
                onClick={action.action}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5"
                disabled={(action.type === 'education' || action.type === 'housing' || action.type === 'asset_buy') && action.cost && character.money < action.cost}
              >
                {(action.type === 'education' || action.type === 'housing' || action.type === 'asset_buy') && action.cost && character.money < action.cost ? 'Not Enough Funds' : 
                 action.type === 'asset_sell' ? 'Sell Item' : 'Choose'}
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default LifeStageActions;

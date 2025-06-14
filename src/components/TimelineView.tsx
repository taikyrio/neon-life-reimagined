
import { Character } from '../types/Character';
import { getCurrentLifeStage } from '../types/LifeStages';
import LifeStageActions from './LifeStageActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TimelineViewProps {
  character: Character;
  onAgeUp: () => void;
  onLifeStageAction: (actionType: string, payload: { [key: string]: any }) => void;
  monthlyExpenses: number;
  monthlyAssetIncome: number;
}

const TimelineView = ({ 
  character, 
  onAgeUp, 
  onLifeStageAction,
  monthlyExpenses,
  monthlyAssetIncome
}: TimelineViewProps) => {
  const currentStage = getCurrentLifeStage(character.age);
  const yearlySalary = character.salary || 0;
  const netMonthlyCashflow = Math.floor(yearlySalary / 12) + monthlyAssetIncome - monthlyExpenses;

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/70 border-slate-700 shadow-lg">
        <CardContent className="p-3">
          <div className="text-center space-y-1">
             <p className="text-slate-300 text-sm">
              You are a {character.age} year old {character.gender} in the {currentStage.name} stage.
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-left">
              <p className="text-slate-400">Education: <span className="text-white font-medium">{character.education}</span></p>
              <p className="text-slate-400">Job: <span className="text-white font-medium">{character.job}</span></p>
              <p className="text-slate-400">Housing: <span className="text-white font-medium">{character.housing || 'With Parents'}</span></p>
              <p className="text-slate-400">Salary: <span className="text-green-400 font-medium">${yearlySalary.toLocaleString()}/yr</span></p>
              <p className="text-slate-400">Expenses: <span className="text-red-400 font-medium">${monthlyExpenses.toLocaleString()}/mo</span></p>
              <p className="text-slate-400">Asset Income: <span className="text-sky-400 font-medium">${monthlyAssetIncome.toLocaleString()}/mo</span></p>
            </div>
            <p className={`text-sm font-semibold pt-1 ${netMonthlyCashflow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              Net Cashflow: ${netMonthlyCashflow.toLocaleString()}/mo
            </p>
          </div>
        </CardContent>
      </Card>

      <LifeStageActions character={character} onAction={onLifeStageAction} />

      <Card className="bg-slate-800/70 border-slate-700 shadow-lg">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-white text-md">Recent Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-60 overflow-y-auto px-3 pb-3 pr-1">
          {character.lifeEvents.length === 0 && <p className="text-slate-400 text-sm text-center py-2">No major events yet.</p>}
          {character.lifeEvents
            .slice()
            .reverse()
            .slice(0, 7)
            .map((event) => (
              <div key={event.id} className="p-2 bg-slate-700/50 rounded-md border border-slate-600 text-xs">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-white">{event.event}</p>
                    <p className="text-slate-400 text-[10px]">
                      Age {event.age} • Year {event.year}
                    </p>
                  </div>
                  <span className={`text-sm ml-2 ${event.type === 'positive' ? 'text-green-400' : event.type === 'negative' ? 'text-red-400' : 'text-slate-400'}`}>
                    {event.type === 'positive' ? '🎉' : 
                     event.type === 'negative' ? '😟' : ' событий'} {/* Russian "событий" meaning "events" - using an emoji or simple icon may be better */}
                  </span>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      <div className="flex justify-center pt-2 pb-4">
        <Button
          onClick={onAgeUp}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-10 py-3 text-base font-semibold rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-150"
        >
          Age Up! ({character.age + 1})
        </Button>
      </div>
    </div>
  );
};

export default TimelineView;

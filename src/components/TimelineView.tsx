
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
    <div className="space-y-3 px-2">
      {/* Character Stats - Mobile Optimized */}
      <div className="mica-card p-4 border border-white/10">
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-white mb-1">{character.name}</h2>
          <p className="text-white/70 text-sm">
            Age {character.age} • ${character.money.toLocaleString()} • {currentStage.name}
          </p>
        </div>
        
        {/* Stats Bars - Similar to second photo */}
        <div className="space-y-3">
          <StatBar label="Health" value={character.health} color="bg-green-500" />
          <StatBar label="Happiness" value={character.happiness} color="bg-yellow-500" />
          <StatBar label="Smartness" value={character.smartness} color="bg-blue-500" />
          <StatBar label="Appearance" value={character.appearance} color="bg-pink-500" />
          <StatBar label="Fitness" value={character.fitness} color="bg-red-500" />
        </div>
      </div>

      {/* Life Stage Info */}
      <div className="mica-card p-4 border border-white/10">
        <h3 className="text-white font-semibold text-center text-lg mb-3">{currentStage.name}</h3>
        <div className="text-center space-y-2 text-sm">
          <p className="text-white/80">
            You are a {character.age} year old {character.gender} in the {currentStage.name} stage.
          </p>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="text-left">
              <p className="text-white/60 text-xs">Education:</p>
              <p className="text-white font-medium text-sm">{character.education}</p>
            </div>
            <div className="text-left">
              <p className="text-white/60 text-xs">Job:</p>
              <p className="text-white font-medium text-sm">{character.job}</p>
            </div>
            <div className="text-left">
              <p className="text-white/60 text-xs">Housing:</p>
              <p className="text-white font-medium text-sm">{character.housing || 'With Parents'}</p>
            </div>
            <div className="text-left">
              <p className="text-white/60 text-xs">Salary:</p>
              <p className="text-green-400 font-medium text-sm">${yearlySalary.toLocaleString()}/yr</p>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-white/10">
            <p className={`text-sm font-semibold ${netMonthlyCashflow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              Net Cashflow: ${netMonthlyCashflow.toLocaleString()}/mo
            </p>
          </div>
        </div>
      </div>

      {/* Life Stage Actions */}
      <LifeStageActions character={character} onAction={onLifeStageAction} />

      {/* Timeline - Similar to second photo */}
      <div className="mica-card p-4 border border-white/10">
        <h3 className="text-white font-semibold text-lg mb-3">Timeline</h3>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {character.lifeEvents.length === 0 && (
            <p className="text-white/60 text-sm text-center py-4">No major events yet.</p>
          )}
          {character.lifeEvents
            .slice()
            .reverse()
            .slice(0, 10)
            .map((event, index) => (
              <div key={event.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    event.type === 'positive' ? 'bg-green-400' : 
                    event.type === 'negative' ? 'bg-red-400' : 'bg-white/60'
                  }`} />
                  {index < character.lifeEvents.slice().reverse().slice(0, 10).length - 1 && (
                    <div className="w-0.5 h-8 bg-white/20 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="glass-card p-3 border border-white/10">
                    <p className="text-white text-sm font-medium">{event.event}</p>
                    <p className="text-white/60 text-xs mt-1">
                      {event.year} - Age {event.age}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Age Up Button */}
      <div className="sticky bottom-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent pt-4 pb-2">
        <Button
          onClick={onAgeUp}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 text-lg font-semibold rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-150"
        >
          Age Up! ({character.age + 1})
        </Button>
      </div>
    </div>
  );
};

const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-20 text-right">
      <span className="text-white text-sm font-medium">{label}:</span>
    </div>
    <div className="flex-1 h-6 bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-300 rounded-full`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
    <div className="w-12 text-left">
      <span className="text-white/80 text-sm font-medium">{value}%</span>
    </div>
  </div>
);

export default TimelineView;

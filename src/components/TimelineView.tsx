
import { Character } from '../types/Character';
import { getCurrentLifeStage } from '../types/LifeStages';
import LifeStageActions from './LifeStageActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  // Create a timeline entry for every age from 0 to current age
  const createFullTimeline = () => {
    const timeline = [];
    for (let age = 0; age <= character.age; age++) {
      const year = character.birthYear + age;
      const eventsAtAge = character.lifeEvents.filter(event => event.age === age);
      
      if (eventsAtAge.length > 0) {
        // Add each event for this age
        eventsAtAge.forEach(event => {
          timeline.push({
            id: event.id,
            age,
            year,
            event: event.event,
            type: event.type,
            hasEvent: true
          });
        });
      } else {
        // Add a basic age entry if no events
        timeline.push({
          id: `age-${age}`,
          age,
          year,
          event: `Turned ${age} years old`,
          type: 'neutral' as const,
          hasEvent: false
        });
      }
    }
    return timeline.reverse(); // Show newest first
  };

  const fullTimeline = createFullTimeline();

  return (
    <div className="flex flex-col h-full relative">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 space-y-3 px-2">
        {/* Character Stats - Mobile Optimized */}
        <div className="mica-card p-4 border border-white/10">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-white mb-1">{character.name}</h2>
            <p className="text-white/70 text-sm">
              Age {character.age} • ${character.money.toLocaleString()} • {currentStage.name}
            </p>
          </div>
          
          {/* Stats Bars - Windows 11 Style */}
          <div className="space-y-4">
            <Win11StatBar label="Health" value={character.health} color="from-green-400 to-green-600" />
            <Win11StatBar label="Happiness" value={character.happiness} color="from-yellow-400 to-yellow-600" />
            <Win11StatBar label="Smartness" value={character.smartness} color="from-blue-400 to-blue-600" />
            <Win11StatBar label="Appearance" value={character.appearance} color="from-pink-400 to-pink-600" />
            <Win11StatBar label="Fitness" value={character.fitness} color="from-red-400 to-red-600" />
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

        {/* Timeline - Scrollable Box */}
        <div className="mica-card p-4 border border-white/10">
          <h3 className="text-white font-semibold text-lg mb-3">Complete Timeline</h3>
          <ScrollArea className="h-64 w-full rounded-md">
            <div className="space-y-3 pr-4">
              {fullTimeline.length === 0 && (
                <p className="text-white/60 text-sm text-center py-8">No timeline entries yet.</p>
              )}
              {fullTimeline.map((entry, index) => (
                <div key={entry.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      entry.hasEvent ? (
                        entry.type === 'positive' ? 'bg-green-400' : 
                        entry.type === 'negative' ? 'bg-red-400' : 'bg-white/60'
                      ) : 'bg-white/30'
                    }`} />
                    {index < fullTimeline.length - 1 && (
                      <div className="w-0.5 h-8 bg-white/20 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className={`${entry.hasEvent ? 'glass-card' : 'bg-white/5'} p-3 border border-white/10 rounded`}>
                      <p className={`text-sm font-medium ${entry.hasEvent ? 'text-white' : 'text-white/70'}`}>
                        {entry.event}
                      </p>
                      <p className="text-white/60 text-xs mt-1">
                        {entry.year} - Age {entry.age}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Fixed Age Up Button - Always visible at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent pt-4 pb-4 px-2">
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

const Win11StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-20 text-right">
      <span className="text-white text-sm font-medium">{label}:</span>
    </div>
    <div className="flex-1 relative">
      {/* Background track */}
      <div className="h-3 bg-white/10 rounded-full shadow-inner backdrop-blur-sm border border-white/5">
        {/* Progress fill */}
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-500 ease-out shadow-sm relative overflow-hidden`}
          style={{ width: `${Math.min(value, 100)}%` }}
        >
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
        </div>
      </div>
    </div>
    <div className="w-12 text-left">
      <span className="text-white/80 text-sm font-medium">{value}%</span>
    </div>
  </div>
);

export default TimelineView;

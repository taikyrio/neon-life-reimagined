
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Character } from '../types/Character';

interface LifeEventsProps {
  character: Character;
}

const LifeEvents = ({ character }: LifeEventsProps) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'positive': return '🎉';
      case 'negative': return '😢';
      default: return '📝';
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Profile Summary */}
      <Card className="bg-slate-800/90 backdrop-blur-lg border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Education</p>
              <p className="text-white">{character.education}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Job</p>
              <p className="text-white">{character.job}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Net Worth</p>
              <p className="text-white">${character.money.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Criminal Record</p>
              <p className="text-white">{character.criminalRecord.length} crimes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Life Timeline */}
      <Card className="bg-slate-800/90 backdrop-blur-lg border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Life Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {character.lifeEvents
              .slice()
              .reverse()
              .map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 bg-slate-700/30 rounded-lg">
                  <span className="text-xl">{getEventIcon(event.type)}</span>
                  <div className="flex-1">
                    <p className={`font-medium ${getEventColor(event.type)}`}>
                      {event.event}
                    </p>
                    <p className="text-slate-400 text-sm">
                      Age {event.age} • {event.year}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Criminal Record */}
      {character.criminalRecord.length > 0 && (
        <Card className="bg-slate-800/90 backdrop-blur-lg border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Criminal Record</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {character.criminalRecord.map((crime) => (
                <div key={crime.id} className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-red-400 font-medium">{crime.crime}</span>
                    <span className="text-slate-400 text-sm">Age {crime.age}</span>
                  </div>
                  {crime.caught && crime.punishment && (
                    <p className="text-red-300 text-sm mt-1">Punishment: {crime.punishment}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LifeEvents;

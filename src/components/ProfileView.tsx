
import { Character } from '../types/Character';
import LifeEvents from './LifeEvents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileViewProps {
  character: Character;
}

const ProfileView = ({ character }: ProfileViewProps) => {
  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/70 border-slate-700 shadow-lg">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-white text-lg">{character.name}'s Profile</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mb-3">
            <p className="text-slate-400">Age: <span className="text-white">{character.age}</span></p>
            <p className="text-slate-400">Gender: <span className="text-white capitalize">{character.gender}</span></p>
            <p className="text-slate-400">Money: <span className="text-green-400">${character.money.toLocaleString()}</span></p>
            <p className="text-slate-400">Education: <span className="text-white">{character.education}</span></p>
            <p className="text-slate-400">Job: <span className="text-white">{character.job}</span></p>
            <p className="text-slate-400">Salary: <span className="text-green-400">${character.salary.toLocaleString()}/yr</span></p>
            <p className="text-slate-400">Housing: <span className="text-white">{character.housing}</span></p>
          </div>

          {/* Achievements (Placeholder) */}
          {character.achievements.length > 0 && (
            <div className="mb-3">
              <h4 className="text-slate-200 font-semibold text-sm mb-1">Achievements:</h4>
              <div className="flex flex-wrap gap-1">
                {character.achievements.map(ach => (
                  <span key={ach} className="bg-yellow-500 text-slate-900 text-xs px-2 py-0.5 rounded-full">{ach}</span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <LifeEvents character={character} />
    </div>
  );
};

export default ProfileView;


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Character } from '../types/Character';

interface StatsPanelProps {
  character: Character;
}

const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span className="text-slate-300">{label}:</span>
      <span className="text-white">{value}%</span>
    </div>
    <div className="w-full bg-slate-700 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  </div>
);

const StatsPanel = ({ character }: StatsPanelProps) => {
  return (
    <Card className="bg-slate-800/90 backdrop-blur-lg border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-center">Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <StatBar label="Health" value={character.health} color="bg-green-500" />
        <StatBar label="Happiness" value={character.happiness} color="bg-yellow-500" />
        <StatBar label="Smartness" value={character.smartness} color="bg-blue-500" />
        <StatBar label="Appearance" value={character.appearance} color="bg-pink-500" />
        <StatBar label="Fitness" value={character.fitness} color="bg-red-500" />
      </CardContent>
    </Card>
  );
};

export default StatsPanel;

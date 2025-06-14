
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Character } from '../types/Character';
import { ACHIEVEMENTS } from '../types/Achievements';

interface AchievementsPanelProps {
  character: Character;
}

const AchievementsPanel = ({ character }: AchievementsPanelProps) => {
  const unlockedAchievements = ACHIEVEMENTS.filter(achievement => 
    character.achievements.includes(achievement.id)
  );
  
  const lockedAchievements = ACHIEVEMENTS.filter(achievement => 
    !character.achievements.includes(achievement.id)
  );

  const categoryColors = {
    education: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    career: 'bg-green-500/20 text-green-400 border-green-500/50',
    financial: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    relationship: 'bg-pink-500/20 text-pink-400 border-pink-500/50',
    social: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    health: 'bg-red-500/20 text-red-400 border-red-500/50'
  };

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/90 backdrop-blur-lg border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            🏆 Achievements ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <div>
              <h3 className="text-green-400 font-semibold mb-2">Unlocked</h3>
              <div className="grid grid-cols-1 gap-2">
                {unlockedAchievements.map((achievement) => (
                  <div key={achievement.id} className="p-3 bg-slate-700/50 rounded-lg border border-green-500/30">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{achievement.name}</h4>
                        <p className="text-slate-400 text-sm">{achievement.description}</p>
                      </div>
                      <Badge className={categoryColors[achievement.category]}>
                        {achievement.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locked Achievements */}
          {lockedAchievements.length > 0 && (
            <div>
              <h3 className="text-slate-400 font-semibold mb-2">Locked</h3>
              <div className="grid grid-cols-1 gap-2">
                {lockedAchievements.map((achievement) => (
                  <div key={achievement.id} className="p-3 bg-slate-700/20 rounded-lg border border-slate-600/30 opacity-60">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl grayscale">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4 className="text-slate-300 font-medium">{achievement.name}</h4>
                        <p className="text-slate-500 text-sm">{achievement.description}</p>
                      </div>
                      <Badge className="bg-slate-600/20 text-slate-500 border-slate-600/50">
                        {achievement.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AchievementsPanel;

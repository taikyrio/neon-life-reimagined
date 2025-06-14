
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Character } from '../../types/Character';

interface SocialStatusCardProps {
  character: Character;
}

const SocialStatusCard = ({ character }: SocialStatusCardProps) => {
  const getSocialClassColor = (socialClass: string) => {
    switch (socialClass) {
      case 'upper': return 'text-yellow-400';
      case 'middle': return 'text-blue-400';
      case 'lower': return 'text-gray-400';
      default: return 'text-white';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 border-slate-600 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Social Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-slate-400">Reputation</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${character.socialStatus.reputation}%` }}
                />
              </div>
              <p className="text-white font-semibold">{character.socialStatus.reputation}%</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-slate-400">Popularity</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full transition-all"
                  style={{ width: `${character.socialStatus.popularity}%` }}
                />
              </div>
              <p className="text-white font-semibold">{character.socialStatus.popularity}%</p>
            </div>
          </div>
          <div>
            <p className="text-slate-400">Social Class</p>
            <p className={`font-semibold capitalize ${getSocialClassColor(character.socialStatus.socialClass)}`}>
              {character.socialStatus.socialClass}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Network Size</p>
            <p className="text-white font-semibold">{character.socialStatus.networkSize}</p>
          </div>
        </div>
        
        <div>
          <p className="text-slate-400 text-sm mb-2">Personality Traits</p>
          <div className="flex flex-wrap gap-1">
            {character.personalityTraits.map(trait => (
              <Badge key={trait} variant="secondary" className="text-xs bg-slate-600 text-slate-200 hover:bg-slate-500">
                {trait}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialStatusCard;

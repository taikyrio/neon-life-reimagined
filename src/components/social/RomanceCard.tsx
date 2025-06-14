
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Heart as RingIcon } from 'lucide-react';
import { Character } from '../../types/Character';
import { calculateAttractiveness } from '../../types/SocialSystem';
import { toast } from 'sonner';

interface RomanceCardProps {
  character: Character;
  onAction: (actionType: string, payload: { [key: string]: any }) => void;
}

const RomanceCard = ({ character, onAction }: RomanceCardProps) => {
  const startDating = () => {
    if (character.marriageStatus.isMarried) {
      toast.error("You're already married!");
      return;
    }
    
    onAction('start_dating', {
      attractiveness: calculateAttractiveness(character.appearance, character.personalityTraits, character.socialStatus.reputation)
    });
  };

  const proposeMarriage = (relationshipId: string) => {
    const relationship = character.relationships.find(r => r.id === relationshipId);
    if (!relationship || relationship.type !== 'romantic') {
      toast.error("You can only propose to romantic partners!");
      return;
    }
    
    onAction('propose_marriage', { relationshipId });
  };

  const romanticPartners = character.relationships.filter(r => r.type === 'romantic' || r.type === 'dating');

  return (
    <Card className="bg-gradient-to-br from-pink-900/50 to-red-900/50 border-pink-700/50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-400" />
          Romance & Marriage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {character.marriageStatus.isMarried ? (
          <div className="p-3 bg-pink-900/30 rounded-lg border border-pink-700/50">
            <p className="text-pink-300 font-semibold flex items-center gap-2">
              <RingIcon className="w-4 h-4" />
              Married
            </p>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-300 text-sm">Marriage Happiness:</span>
                <span className="text-white">{character.marriageStatus.marriageHappiness}%</span>
              </div>
              <div className="bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full"
                  style={{ width: `${character.marriageStatus.marriageHappiness}%` }}
                />
              </div>
            </div>
            <p className="text-slate-400 text-xs mt-2">Married since {character.marriageStatus.marriageYear}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Attractiveness:</span>
              <span className="text-pink-300 font-medium">
                {calculateAttractiveness(character.appearance, character.personalityTraits, character.socialStatus.reputation)}%
              </span>
            </div>
            
            {romanticPartners.length > 0 && (
              <div className="space-y-2">
                <p className="text-slate-300 text-sm font-medium">Romantic Partners:</p>
                {romanticPartners.map(partner => (
                  <div key={partner.id} className="flex justify-between items-center p-2 bg-slate-700/50 rounded border border-slate-600">
                    <div>
                      <p className="text-white text-sm">{partner.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-600 rounded-full h-1 w-16">
                          <div 
                            className="bg-pink-400 h-1 rounded-full"
                            style={{ width: `${partner.relationshipLevel}%` }}
                          />
                        </div>
                        <span className="text-slate-400 text-xs">{partner.relationshipLevel}%</span>
                      </div>
                    </div>
                    {partner.relationshipLevel >= 80 && (
                      <Button
                        size="sm"
                        onClick={() => proposeMarriage(partner.id)}
                        className="bg-pink-600 hover:bg-pink-700 text-xs"
                      >
                        <RingIcon className="w-3 h-3 mr-1" />
                        Propose
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <Button
              onClick={startDating}
              className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700"
              disabled={character.age < 16}
            >
              {character.age < 16 ? 'Too Young to Date' : 'Start Dating'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RomanceCard;

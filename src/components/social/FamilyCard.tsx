
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Baby } from 'lucide-react';
import { Character } from '../../types/Character';
import { toast } from 'sonner';

interface FamilyCardProps {
  character: Character;
  onAction: (actionType: string, payload: { [key: string]: any }) => void;
}

const FamilyCard = ({ character, onAction }: FamilyCardProps) => {
  const tryForBaby = () => {
    if (!character.marriageStatus.isMarried) {
      toast.error("You need to be married to try for a baby!");
      return;
    }
    
    onAction('try_for_baby', {});
  };

  const adoptChild = () => {
    if (character.age < 25) {
      toast.error("You must be at least 25 years old to adopt!");
      return;
    }
    
    onAction('adopt_child', { cost: 5000 });
  };

  return (
    <Card className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border-blue-700/50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Baby className="w-5 h-5 text-blue-400" />
          Family & Children
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {character.children.length > 0 ? (
          <div className="space-y-2">
            <p className="text-slate-300 text-sm font-medium">Your Children:</p>
            {character.children.map(child => (
              <div key={child.id} className="p-2 bg-slate-700/50 rounded border border-slate-600">
                <p className="text-white text-sm">{child.name} ({child.gender}, {child.age} years old)</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-slate-400 text-xs">Relationship:</span>
                  <div className="flex-1 bg-slate-600 rounded-full h-1">
                    <div 
                      className="bg-blue-400 h-1 rounded-full"
                      style={{ width: `${child.relationshipWithParent}%` }}
                    />
                  </div>
                  <span className="text-slate-400 text-xs">{child.relationshipWithParent}%</span>
                </div>
                {child.isAdopted && <Badge variant="outline" className="text-xs mt-1">Adopted</Badge>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 text-sm text-center py-2">No children yet</p>
        )}
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={tryForBaby}
            disabled={!character.marriageStatus.isMarried}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Try for Baby
          </Button>
          <Button
            onClick={adoptChild}
            disabled={character.age < 25 || character.money < 5000}
            size="sm"
            variant="outline"
            className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
          >
            Adopt ($5,000)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FamilyCard;


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Character, FamilyMember } from '../types/Character';
import { toast } from 'sonner';

interface RelationshipsPanelProps {
  character: Character;
  setCharacter: (character: Character) => void;
}

const RelationshipsPanel = ({ character, setCharacter }: RelationshipsPanelProps) => {
  const interactWithFamily = (memberId: string, action: 'compliment' | 'insult' | 'spend_time') => {
    const newCharacter = { ...character };
    const member = newCharacter.family.find(f => f.id === memberId);
    
    if (!member) return;

    let relationshipChange = 0;
    let actionText = '';

    switch (action) {
      case 'compliment':
        relationshipChange = Math.floor(Math.random() * 10) + 5;
        actionText = `Complimented ${member.name}`;
        break;
      case 'insult':
        relationshipChange = -(Math.floor(Math.random() * 15) + 5);
        actionText = `Insulted ${member.name}`;
        break;
      case 'spend_time':
        relationshipChange = Math.floor(Math.random() * 8) + 3;
        actionText = `Spent quality time with ${member.name}`;
        break;
    }

    member.relationshipLevel = Math.max(0, Math.min(100, member.relationshipLevel + relationshipChange));
    
    newCharacter.lifeEvents.push({
      id: Math.random().toString(36).substr(2, 9),
      year: character.birthYear + character.age,
      age: character.age,
      event: actionText,
      type: relationshipChange > 0 ? 'positive' : 'negative'
    });

    setCharacter(newCharacter);
    toast.success(actionText);
  };

  const getRelationshipColor = (level: number) => {
    if (level >= 80) return 'text-green-400';
    if (level >= 60) return 'text-yellow-400';
    if (level >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRelationshipText = (level: number) => {
    if (level >= 80) return 'Excellent';
    if (level >= 60) return 'Good';
    if (level >= 40) return 'Fair';
    if (level >= 20) return 'Poor';
    return 'Terrible';
  };

  return (
    <div className="space-y-4">
      {/* Family */}
      <Card className="bg-slate-800/90 backdrop-blur-lg border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Family</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {character.family.map((member) => (
            <div key={member.id} className="p-4 bg-slate-700/30 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-white font-semibold">{member.name}</h3>
                  <p className="text-slate-400 text-sm capitalize">{member.relationship} • Age {member.age}</p>
                  <p className={`text-sm font-medium ${getRelationshipColor(member.relationshipLevel)}`}>
                    {getRelationshipText(member.relationshipLevel)} ({member.relationshipLevel}%)
                  </p>
                </div>
                <div className="w-16 h-1 bg-slate-600 rounded-full">
                  <div
                    className="h-1 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                    style={{ width: `${member.relationshipLevel}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => interactWithFamily(member.id, 'compliment')}
                  className="text-xs bg-green-600/20 hover:bg-green-600/30 border-green-600/50"
                >
                  Compliment
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => interactWithFamily(member.id, 'spend_time')}
                  className="text-xs bg-blue-600/20 hover:bg-blue-600/30 border-blue-600/50"
                >
                  Spend Time
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => interactWithFamily(member.id, 'insult')}
                  className="text-xs bg-red-600/20 hover:bg-red-600/30 border-red-600/50"
                >
                  Insult
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Friends */}
      <Card className="bg-slate-800/90 backdrop-blur-lg border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Friends & Relationships</CardTitle>
        </CardHeader>
        <CardContent>
          {character.relationships.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No friends or relationships yet</p>
          ) : (
            <div className="space-y-3">
              {character.relationships.map((rel) => (
                <div key={rel.id} className="p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-white font-medium">{rel.name}</h4>
                      <p className="text-slate-400 text-sm capitalize">{rel.type} • Age {rel.age}</p>
                    </div>
                    <span className={`text-sm ${getRelationshipColor(rel.relationshipLevel)}`}>
                      {rel.relationshipLevel}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RelationshipsPanel;

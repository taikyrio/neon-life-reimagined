
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Character, FamilyMember } from '../types/Character';
import { toast } from 'sonner';

interface EnhancedRelationshipsProps {
  character: Character;
  setCharacter: (character: Character) => void;
}

const EnhancedRelationships = ({ character, setCharacter }: EnhancedRelationshipsProps) => {
  const interactWithFamily = (memberId: string, action: string) => {
    const newCharacter = { ...character };
    const member = newCharacter.family.find(f => f.id === memberId);

    if (!member) return;

    let relationshipChange = 0;
    let actionText = '';
    let happinessChange = 0;

    switch (action) {
      case 'deep_conversation':
        relationshipChange = Math.floor(Math.random() * 15) + 10;
        happinessChange = 5;
        actionText = `Had a meaningful conversation with ${member.name}`;
        break;
      case 'give_gift':
        if (character.money < 100) {
          toast.error("Not enough money for a gift!");
          return;
        }
        newCharacter.money -= 100;
        relationshipChange = Math.floor(Math.random() * 20) + 15;
        happinessChange = 8;
        actionText = `Gave a thoughtful gift to ${member.name}`;
        break;
      case 'ask_for_advice':
        relationshipChange = Math.floor(Math.random() * 8) + 5;
        newCharacter.smartness = Math.min(100, newCharacter.smartness + 2);
        actionText = `Asked ${member.name} for advice`;
        break;
      case 'apologize':
        if (member.relationshipLevel < 50) {
          relationshipChange = Math.floor(Math.random() * 20) + 15;
          actionText = `Apologized to ${member.name}`;
        } else {
          toast.error(`Your relationship with ${member.name} is already good!`);
          return;
        }
        break;
      case 'plan_activity':
        if (character.money < 200) {
          toast.error("Not enough money to plan an activity!");
          return;
        }
        newCharacter.money -= 200;
        relationshipChange = Math.floor(Math.random() * 25) + 20;
        happinessChange = 15;
        actionText = `Planned a fun activity with ${member.name}`;
        break;
      case 'argue':
        relationshipChange = -(Math.floor(Math.random() * 20) + 10);
        happinessChange = -10;
        actionText = `Had an argument with ${member.name}`;
        break;
    }

    member.relationshipLevel = Math.max(0, Math.min(100, member.relationshipLevel + relationshipChange));
    newCharacter.happiness = Math.max(0, Math.min(100, newCharacter.happiness + happinessChange));

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
    if (level >= 90) return 'text-emerald-400';
    if (level >= 70) return 'text-green-400';
    if (level >= 50) return 'text-yellow-400';
    if (level >= 30) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRelationshipText = (level: number) => {
    if (level >= 90) return 'Excellent';
    if (level >= 70) return 'Great';
    if (level >= 50) return 'Good';
    if (level >= 30) return 'Fair';
    if (level >= 10) return 'Poor';
    return 'Terrible';
  };

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/90 backdrop-blur-lg border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Family Relationships</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {character.family.map((member) => (
            <div key={member.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{member.name}</h3>
                  <p className="text-slate-400 text-sm capitalize">{member.relationship} • Age {member.age}</p>
                  <p className={`text-sm font-medium ${getRelationshipColor(member.relationshipLevel)}`}>
                    {getRelationshipText(member.relationshipLevel)} ({member.relationshipLevel}%)
                  </p>
                </div>
                <div className="w-20 h-2 bg-slate-600 rounded-full">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                    style={{ width: `${member.relationshipLevel}%` }}
                  />
                </div>
              </div>

              {/* Enhanced Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => interactWithFamily(member.id, 'deep_conversation')}
                  className="text-xs bg-blue-600/20 hover:bg-blue-600/30 border-blue-600/50"
                >
                  Deep Talk
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => interactWithFamily(member.id, 'give_gift')}
                  disabled={character.money < 100}
                  className="text-xs bg-purple-600/20 hover:bg-purple-600/30 border-purple-600/50"
                >
                  Gift ($100)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => interactWithFamily(member.id, 'ask_for_advice')}
                  className="text-xs bg-green-600/20 hover:bg-green-600/30 border-green-600/50"
                >
                  Ask Advice
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => interactWithFamily(member.id, 'plan_activity')}
                  disabled={character.money < 200}
                  className="text-xs bg-yellow-600/20 hover:bg-yellow-600/30 border-yellow-600/50"
                >
                  Activity ($200)
                </Button>
                {member.relationshipLevel < 50 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => interactWithFamily(member.id, 'apologize')}
                    className="text-xs bg-pink-600/20 hover:bg-pink-600/30 border-pink-600/50"
                  >
                    Apologize
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => interactWithFamily(member.id, 'argue')}
                  className="text-xs bg-red-600/20 hover:bg-red-600/30 border-red-600/50"
                >
                  Argue
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedRelationships;

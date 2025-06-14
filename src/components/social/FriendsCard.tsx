
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { Character } from '../../types/Character';

interface FriendsCardProps {
  character: Character;
}

const FriendsCard = ({ character }: FriendsCardProps) => {
  const friends = character.relationships.filter(r => r.type === 'friend');

  if (friends.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 border-yellow-700/50 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-yellow-400" />
          Friends ({friends.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-48 overflow-y-auto">
        {friends.map(friend => (
          <div key={friend.id} className="flex justify-between items-center p-2 bg-slate-700/50 rounded border border-slate-600">
            <div className="flex-1">
              <p className="text-white text-sm">{friend.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-slate-400 text-xs">Friendship:</span>
                <div className="flex-1 bg-slate-600 rounded-full h-1">
                  <div 
                    className="bg-yellow-400 h-1 rounded-full"
                    style={{ width: `${friend.relationshipLevel}%` }}
                  />
                </div>
                <span className="text-slate-400 text-xs">{friend.relationshipLevel}%</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FriendsCard;

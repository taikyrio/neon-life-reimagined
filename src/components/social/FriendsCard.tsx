
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
    <div className="mica-card p-4 border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Users className="w-6 h-6 text-yellow-400" />
        <h3 className="text-white font-semibold text-lg">
          Friends ({friends.length})
        </h3>
      </div>
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {friends.map(friend => (
          <div key={friend.id} className="glass-card p-3 border border-white/10 fluent-hover">
            <div className="flex-1">
              <p className="text-white font-medium">{friend.name}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-white/60 text-sm">Friendship:</span>
                <div className="flex-1 progress-bar h-2">
                  <div 
                    className="progress-fill bg-gradient-to-r from-yellow-400 to-orange-400"
                    style={{ width: `${friend.relationshipLevel}%` }}
                  />
                </div>
                <span className="text-white/80 text-sm font-medium">{friend.relationshipLevel}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsCard;

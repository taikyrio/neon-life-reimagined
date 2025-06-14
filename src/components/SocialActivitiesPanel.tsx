
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Character } from '../types/Character';
import { SOCIAL_ACTIVITIES, SocialActivity, calculateAttractiveness, generateRandomPersonality, PERSONALITY_TRAITS } from '../types/SocialSystem';
import { Heart, Users, Star, Baby, Ring } from 'lucide-react';
import { toast } from 'sonner';

interface SocialActivitiesPanelProps {
  character: Character;
  onAction: (actionType: string, payload: { [key: string]: any }) => void;
}

const SocialActivitiesPanel = ({ character, onAction }: SocialActivitiesPanelProps) => {
  const [selectedActivity, setSelectedActivity] = useState<SocialActivity | null>(null);

  const availableActivities = SOCIAL_ACTIVITIES.filter(activity => 
    character.age >= activity.minAge &&
    character.money >= activity.cost &&
    (!activity.requirements?.minMoney || character.money >= activity.requirements.minMoney) &&
    (!activity.requirements?.minSocialStatus || character.socialStatus.reputation >= (activity.requirements.minSocialStatus || 0))
  );

  const handleActivityClick = (activity: SocialActivity) => {
    setSelectedActivity(activity);
  };

  const performActivity = (activity: SocialActivity) => {
    onAction('social_activity', {
      activityId: activity.id,
      cost: activity.cost,
      effects: activity.effects,
      type: activity.type
    });
    setSelectedActivity(null);
    toast.success(`Started ${activity.name}!`);
  };

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

  const getSocialClassColor = (socialClass: string) => {
    switch (socialClass) {
      case 'upper': return 'text-yellow-400';
      case 'middle': return 'text-blue-400';
      case 'lower': return 'text-gray-400';
      default: return 'text-white';
    }
  };

  const romanticPartners = character.relationships.filter(r => r.type === 'romantic' || r.type === 'dating');
  const friends = character.relationships.filter(r => r.type === 'friend');

  return (
    <div className="space-y-4">
      {/* Social Status Overview */}
      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Star className="w-5 h-5" />
            Social Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Reputation</p>
              <p className="text-white font-semibold">{character.socialStatus.reputation}%</p>
            </div>
            <div>
              <p className="text-slate-400">Popularity</p>
              <p className="text-white font-semibold">{character.socialStatus.popularity}%</p>
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
                <Badge key={trait} variant="secondary" className="text-xs">
                  {trait}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dating & Marriage */}
      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Romance & Marriage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {character.marriageStatus.isMarried ? (
            <div className="p-3 bg-pink-900/30 rounded-lg border border-pink-700">
              <p className="text-pink-300 font-semibold">Married</p>
              <p className="text-white text-sm">Marriage Happiness: {character.marriageStatus.marriageHappiness}%</p>
              <p className="text-slate-400 text-xs">Married since {character.marriageStatus.marriageYear}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-slate-400 text-sm">
                Attractiveness: {calculateAttractiveness(character.appearance, character.personalityTraits, character.socialStatus.reputation)}%
              </p>
              
              {romanticPartners.length > 0 && (
                <div className="space-y-2">
                  <p className="text-slate-300 text-sm font-medium">Romantic Partners:</p>
                  {romanticPartners.map(partner => (
                    <div key={partner.id} className="flex justify-between items-center p-2 bg-slate-700/50 rounded">
                      <div>
                        <p className="text-white text-sm">{partner.name}</p>
                        <p className="text-slate-400 text-xs">Relationship: {partner.relationshipLevel}%</p>
                      </div>
                      {partner.relationshipLevel >= 80 && (
                        <Button
                          size="sm"
                          onClick={() => proposeMarriage(partner.id)}
                          className="bg-pink-600 hover:bg-pink-700"
                        >
                          <Ring className="w-4 h-4 mr-1" />
                          Propose
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <Button
                onClick={startDating}
                className="w-full bg-pink-600 hover:bg-pink-700"
                disabled={character.age < 16}
              >
                {character.age < 16 ? 'Too Young to Date' : 'Start Dating'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Family & Children */}
      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Baby className="w-5 h-5" />
            Family & Children
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {character.children.length > 0 ? (
            <div className="space-y-2">
              <p className="text-slate-300 text-sm font-medium">Your Children:</p>
              {character.children.map(child => (
                <div key={child.id} className="p-2 bg-slate-700/50 rounded">
                  <p className="text-white text-sm">{child.name} ({child.gender}, {child.age} years old)</p>
                  <p className="text-slate-400 text-xs">Relationship: {child.relationshipWithParent}%</p>
                  {child.isAdopted && <Badge variant="outline" className="text-xs">Adopted</Badge>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm">No children yet</p>
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
            >
              Adopt ($5,000)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Social Activities */}
      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Social Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-64 overflow-y-auto">
          {availableActivities.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No social activities available right now</p>
          ) : (
            availableActivities.map(activity => (
              <div key={activity.id} className="p-3 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-blue-500 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-white font-semibold text-sm">{activity.name}</h4>
                    <p className="text-slate-300 text-xs">{activity.description}</p>
                    <Badge variant="outline" className="text-xs mt-1 capitalize">
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-red-400 text-sm font-medium">${activity.cost}</p>
                </div>
                <Button
                  onClick={() => performActivity(activity)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-sm py-1.5"
                >
                  Participate
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Friends List */}
      {friends.length > 0 && (
        <Card className="bg-slate-800/70 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white">Friends ({friends.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-48 overflow-y-auto">
            {friends.map(friend => (
              <div key={friend.id} className="flex justify-between items-center p-2 bg-slate-700/50 rounded">
                <div>
                  <p className="text-white text-sm">{friend.name}</p>
                  <p className="text-slate-400 text-xs">Friendship: {friend.relationshipLevel}%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SocialActivitiesPanel;


import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Character } from '../types/Character';
import { SOCIAL_ACTIVITIES, SocialActivity, calculateAttractiveness, generateRandomPersonality, PERSONALITY_TRAITS } from '../types/SocialSystem';
import { Heart, Users, Star, Baby, Heart as RingIcon } from 'lucide-react';
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
    <div className="space-y-4 pb-4">
      {/* Social Status Overview */}
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

      {/* Dating & Marriage */}
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

      {/* Family & Children */}
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

      {/* Social Activities */}
      <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-700/50 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-green-400" />
            Social Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-64 overflow-y-auto">
          {availableActivities.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No social activities available right now</p>
          ) : (
            availableActivities.map(activity => (
              <div key={activity.id} className="p-3 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-green-500 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm">{activity.name}</h4>
                    <p className="text-slate-300 text-xs mt-1">{activity.description}</p>
                    <Badge variant="outline" className="text-xs mt-1 capitalize border-green-600 text-green-400">
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-red-400 text-sm font-medium">${activity.cost}</p>
                </div>
                <Button
                  onClick={() => performActivity(activity)}
                  className="w-full bg-green-600 hover:bg-green-700 text-sm py-1.5"
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
      )}
    </div>
  );
};

export default SocialActivitiesPanel;

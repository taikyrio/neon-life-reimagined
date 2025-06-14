
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { Character } from '../../types/Character';
import { SOCIAL_ACTIVITIES, SocialActivity } from '../../types/SocialSystem';
import { toast } from 'sonner';

interface SocialActivitiesCardProps {
  character: Character;
  onAction: (actionType: string, payload: { [key: string]: any }) => void;
}

const SocialActivitiesCard = ({ character, onAction }: SocialActivitiesCardProps) => {
  const availableActivities = SOCIAL_ACTIVITIES.filter(activity => 
    character.age >= activity.minAge &&
    character.money >= activity.cost &&
    (!activity.requirements?.minMoney || character.money >= activity.requirements.minMoney) &&
    (!activity.requirements?.minSocialStatus || character.socialStatus.reputation >= (activity.requirements.minSocialStatus || 0))
  );

  const performActivity = (activity: SocialActivity) => {
    onAction('social_activity', {
      activityId: activity.id,
      cost: activity.cost,
      effects: activity.effects,
      type: activity.type
    });
    toast.success(`Started ${activity.name}!`);
  };

  return (
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
  );
};

export default SocialActivitiesCard;

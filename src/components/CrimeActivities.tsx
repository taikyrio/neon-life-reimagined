
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Gavel, Shield, Zap, DollarSign, Clock } from 'lucide-react';
import { Character } from '../types/Character';
import { CRIMES, Crime, calculateCrimeSuccess, CRIMINAL_ORGANIZATIONS } from '../types/Crime';
import { toast } from 'sonner';

interface CrimeActivitiesProps {
  character: Character;
  onAction: (actionType: string, payload: any) => void;
}

const CrimeActivities = ({ character, onAction }: CrimeActivitiesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const criminalExperience = character.criminalRecord?.length || 0;
  const isInJail = character.criminalRecord?.some(record => 
    record.punishment && record.punishment.includes('jail')
  ) || false;
  
  const availableCrimes = CRIMES.filter(crime => 
    character.age >= crime.minAge && 
    character.age <= crime.maxAge &&
    (selectedCategory === 'all' || crime.category === selectedCategory)
  );
  
  const attemptCrime = (crime: Crime) => {
    if (isInJail) {
      toast.error("You can't commit crimes while in jail!");
      return;
    }
    
    const result = calculateCrimeSuccess(crime, character, criminalExperience);
    
    if (result.success && !result.arrested) {
      toast.success(`Successfully committed ${crime.name}! Earned $${result.payout.toLocaleString()}`);
      onAction('commit_crime', {
        crimeId: crime.id,
        success: true,
        payout: result.payout,
        arrested: false
      });
    } else if (result.success && result.arrested) {
      toast.error(`You committed ${crime.name} but got caught! Earned $${result.payout.toLocaleString()} but facing consequences.`);
      onAction('commit_crime', {
        crimeId: crime.id,
        success: true,
        payout: result.payout,
        arrested: true,
        consequences: result.consequences
      });
    } else if (!result.success && result.arrested) {
      toast.error(`Failed to commit ${crime.name} and got arrested!`);
      onAction('commit_crime', {
        crimeId: crime.id,
        success: false,
        payout: 0,
        arrested: true,
        consequences: result.consequences
      });
    } else {
      toast.error(`Failed to commit ${crime.name}. Better luck next time.`);
      onAction('commit_crime', {
        crimeId: crime.id,
        success: false,
        payout: 0,
        arrested: false
      });
    }
  };
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'petty': return 'bg-yellow-500';
      case 'serious': return 'bg-orange-500';
      case 'major': return 'bg-red-500';
      case 'white_collar': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'petty': return <Shield size={16} />;
      case 'serious': return <AlertTriangle size={16} />;
      case 'major': return <Zap size={16} />;
      case 'white_collar': return <Gavel size={16} />;
      default: return <Shield size={16} />;
    }
  };
  
  if (character.age < 12) {
    return (
      <Card className="bg-slate-800/90 backdrop-blur-lg border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle size={20} />
            Criminal Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-slate-400 text-lg">
            You're too young for criminal activities!
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Criminal activities become available at age 12.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Criminal Record Summary */}
      <Card className="bg-slate-800/90 backdrop-blur-lg border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Gavel size={20} />
            Criminal Record
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-slate-400 text-sm">Total Crimes</p>
              <p className="text-white font-bold text-lg">{criminalExperience}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">Status</p>
              <Badge variant={isInJail ? "destructive" : "secondary"}>
                {isInJail ? "Incarcerated" : "Free"}
              </Badge>
            </div>
          </div>
          
          {character.criminalRecord && character.criminalRecord.length > 0 && (
            <div className="mt-4">
              <p className="text-slate-300 text-sm mb-2">Recent Crimes:</p>
              <div className="space-y-1">
                {character.criminalRecord.slice(-3).map((record, index) => (
                  <div key={index} className="flex justify-between items-center text-sm bg-slate-700/30 p-2 rounded">
                    <span className="text-white">{record.crime}</span>
                    <span className={`${record.caught ? 'text-red-400' : 'text-green-400'}`}>
                      {record.caught ? 'Caught' : 'Not Caught'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Crime Categories Filter */}
      <Card className="bg-slate-800/90 backdrop-blur-lg border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Available Criminal Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {['all', 'petty', 'serious', 'major', 'white_collar'].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category.replace('_', ' ')}
              </Button>
            ))}
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            {availableCrimes.length === 0 ? (
              <p className="text-slate-400 text-center py-4">
                No crimes available in this category for your age.
              </p>
            ) : (
              availableCrimes.map((crime) => (
                <div key={crime.id} className="bg-slate-700/30 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold">{crime.name}</h3>
                      <Badge className={`${getCategoryColor(crime.category)} text-white`}>
                        {getCategoryIcon(crime.category)}
                        <span className="ml-1 capitalize">{crime.category.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold flex items-center gap-1">
                        <DollarSign size={14} />
                        ${crime.basePayout.toLocaleString()} - ${crime.maxPayout.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-sm mb-3">{crime.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Shield size={14} />
                      Success: {crime.baseSuccessRate}%
                    </div>
                    <div className="flex items-center gap-1 text-red-400">
                      <AlertTriangle size={14} />
                      Arrest: {crime.arrestChance}%
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock size={14} />
                      Jail: {crime.consequences.jail.min}-{crime.consequences.jail.max} months
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      <DollarSign size={14} />
                      Fine: ${crime.consequences.fine.min.toLocaleString()}-${crime.consequences.fine.max.toLocaleString()}
                    </div>
                  </div>
                  
                  {crime.requiredStats && (
                    <div className="mb-3">
                      <p className="text-slate-400 text-xs mb-1">Requirements:</p>
                      <div className="flex gap-2">
                        {Object.entries(crime.requiredStats).map(([stat, required]) => {
                          const characterStat = (character as any)[stat] || 0;
                          const meets = characterStat >= required;
                          return (
                            <Badge key={stat} variant={meets ? "secondary" : "destructive"} className="text-xs">
                              {stat}: {required}% {meets ? '✓' : '✗'}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <Button
                    onClick={() => attemptCrime(crime)}
                    disabled={isInJail}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-slate-600"
                  >
                    {isInJail ? "In Jail" : `Attempt ${crime.name}`}
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Criminal Organizations */}
      <Card className="bg-slate-800/90 backdrop-blur-lg border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Criminal Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-400 text-sm mb-4">
            Join criminal organizations to access better opportunities and protection.
          </p>
          <div className="space-y-3">
            {CRIMINAL_ORGANIZATIONS.map((org) => (
              <div key={org.id} className="bg-slate-700/30 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-white font-semibold">{org.name}</h3>
                  <Badge className="bg-purple-600 text-white capitalize">{org.type}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400 mb-1">Benefits:</p>
                    <ul className="text-green-400 text-xs space-y-1">
                      {org.benefits.map((benefit, index) => (
                        <li key={index}>• {benefit}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-slate-400 mb-1">Risks:</p>
                    <ul className="text-red-400 text-xs space-y-1">
                      {org.risks.map((risk, index) => (
                        <li key={index}>• {risk}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 border-purple-600 text-purple-400 hover:bg-purple-600/20"
                  disabled={character.age < 16}
                >
                  {character.age < 16 ? "Too Young (16+)" : "Join Organization"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrimeActivities;

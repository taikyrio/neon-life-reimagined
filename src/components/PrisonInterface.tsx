
import { useState } from 'react';
import { Character } from '../types/Character';
import { PrisonSentence, PrisonEvent, generateRandomPrisonEvent, calculateParoleEligibility, processParoleHearing, processEscapeAttempt } from '../types/PrisonSystem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Calendar, Users, Zap } from 'lucide-react';

interface PrisonInterfaceProps {
  character: Character;
  onAction: (actionType: string, payload: { [key: string]: any }) => void;
}

const PrisonInterface = ({ character, onAction }: PrisonInterfaceProps) => {
  const [currentEvent, setCurrentEvent] = useState<PrisonEvent | null>(null);
  
  // Use the currentSentence from character directly
  const currentSentence = character.currentSentence;

  if (!currentSentence || !character.isIncarcerated) {
    return (
      <div className="text-center p-8 text-white/60">
        Not currently incarcerated
      </div>
    );
  }

  const timeServed = currentSentence.originalSentenceYears - currentSentence.remainingSentenceYears;
  const progressPercent = (timeServed / currentSentence.originalSentenceYears) * 100;
  const isParoleEligible = calculateParoleEligibility(currentSentence);

  const handlePrisonAction = (actionType: string, payload: any = {}) => {
    onAction(actionType, payload);
  };

  const handleRandomEvent = () => {
    const event = generateRandomPrisonEvent();
    if (event) {
      setCurrentEvent(event);
    }
  };

  const handleEventChoice = (choice: any) => {
    if (choice.effects.escapeAttempt) {
      const escapeResult = processEscapeAttempt(character);
      if (escapeResult.success) {
        onAction('escape_success', escapeResult.consequences);
      } else {
        onAction('escape_failure', escapeResult.consequences);
      }
    } else {
      onAction('prison_event_choice', {
        choice,
        effects: choice.effects,
        sentenceId: currentSentence.id
      });
    }
    setCurrentEvent(null);
  };

  const handleParoleHearing = () => {
    const result = processParoleHearing(character, currentSentence);
    onAction('parole_hearing', {
      granted: result.granted,
      reduction: result.reduction,
      sentenceId: currentSentence.id
    });
  };

  const handleInitiateRiot = () => {
    onAction('initiate_riot', {
      sentenceId: currentSentence.id,
      effects: {
        sentenceYears: 3,
        reputation: 'feared',
        behaviorRating: 'bad',
        injury: true,
        happiness: 15
      }
    });
  };

  const handleAppeal = () => {
    const successChance = character.money > 500000 ? 0.3 : 0.1;
    const success = Math.random() < successChance;
    
    onAction('legal_appeal', {
      success,
      cost: character.money > 500000 ? 500000 : 50000,
      reduction: success ? Math.ceil(currentSentence.remainingSentenceYears * 0.3) : 0,
      sentenceId: currentSentence.id
    });
  };

  return (
    <div className="space-y-4 p-4">
      {/* Prison Status Header */}
      <Card className="border-red-600/20 bg-red-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            INCARCERATED
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/60">Crime:</p>
              <p className="text-white font-medium">{currentSentence.crime}</p>
            </div>
            <div>
              <p className="text-white/60">Prison Level:</p>
              <Badge variant={currentSentence.prisonLevel === 'maximum' ? 'destructive' : 'secondary'}>
                {currentSentence.prisonLevel}
              </Badge>
            </div>
            <div>
              <p className="text-white/60">Time Served:</p>
              <p className="text-white font-medium">{timeServed} / {currentSentence.originalSentenceYears} years</p>
            </div>
            <div>
              <p className="text-white/60">Remaining:</p>
              <p className="text-yellow-400 font-medium">{currentSentence.remainingSentenceYears} years</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/80 text-sm">Sentence Progress</span>
              <span className="text-white/60 text-sm">{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {currentSentence.goodBehaviorReduction > 0 && (
            <div className="bg-green-900/20 border border-green-600/20 rounded p-2">
              <p className="text-green-400 text-sm">
                Good Behavior: -{currentSentence.goodBehaviorReduction} years reduction earned
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prison Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Prison Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={handleRandomEvent}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Daily Prison Life
            </Button>

            <Button
              onClick={handleInitiateRiot}
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={currentSentence.remainingSentenceYears < 1}
            >
              <Zap className="w-4 h-4 mr-2" />
              Start a Riot
            </Button>

            {isParoleEligible && (
              <Button
                onClick={handleParoleHearing}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Users className="w-4 h-4 mr-2" />
                Parole Hearing
              </Button>
            )}

            <Button
              onClick={handleAppeal}
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={character.money < 50000}
            >
              Legal Appeal ({character.money >= 500000 ? '$500,000' : '$50,000'})
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-white/60 text-sm">
              Most activities are unavailable while incarcerated
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Prison Reputation & Record */}
      {character.prisonRecord && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Prison Record</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-white/60">Reputation:</p>
                <Badge variant={
                  character.prisonRecord.reputation === 'feared' ? 'destructive' :
                  character.prisonRecord.reputation === 'respected' ? 'default' :
                  character.prisonRecord.reputation === 'weak' ? 'secondary' : 'outline'
                }>
                  {character.prisonRecord.reputation}
                </Badge>
              </div>
              <div>
                <p className="text-white/60">Fights Won:</p>
                <p className="text-white">{character.prisonRecord.fightsWon}</p>
              </div>
              <div>
                <p className="text-white/60">Riots Participated:</p>
                <p className="text-white">{character.prisonRecord.riotsParticipated}</p>
              </div>
              <div>
                <p className="text-white/60">Education Completed:</p>
                <p className="text-white">{character.prisonRecord.educationCompleted.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Dialog */}
      {currentEvent && (
        <Card className="border-yellow-600/20 bg-yellow-950/20">
          <CardHeader>
            <CardTitle className="text-yellow-400">{currentEvent.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/80">{currentEvent.description}</p>
            <div className="space-y-2">
              {currentEvent.choices.map(choice => {
                const canAfford = !choice.requirements?.money || character.money >= choice.requirements.money;
                const meetsRequirements = !choice.requirements || (
                  (!choice.requirements.health || character.health >= choice.requirements.health) &&
                  (!choice.requirements.reputation || character.prisonRecord?.reputation === choice.requirements.reputation) &&
                  canAfford
                );

                return (
                  <Button
                    key={choice.id}
                    onClick={() => handleEventChoice(choice)}
                    disabled={!meetsRequirements}
                    className="w-full justify-start text-left bg-white/10 hover:bg-white/20"
                  >
                    {choice.text}
                    {choice.requirements?.money && (
                      <span className="ml-auto text-green-400">
                        ${choice.requirements.money.toLocaleString()}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PrisonInterface;

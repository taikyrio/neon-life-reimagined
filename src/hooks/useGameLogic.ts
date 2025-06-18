import { useState, useEffect } from 'react';
import { Character, calculateTotalMonthlyExpenses, calculateTotalMonthlyAssetIncome, calculateSocialClass } from '../types/Character';
import { MAJOR_LIFE_EVENTS, MajorLifeEvent, EventChoice } from '../types/MajorEvents';
import { ASSET_OPTIONS, Asset } from '../types/Asset';
import { ECONOMIC_EVENTS } from '../types/EconomicEvent';
import { HOUSING_OPTIONS } from '../types/Housing';
import { generateRandomEvent, BitLifeEvent, EnhancedEvent } from '../types/BitLifeEvents';
import { checkAchievements } from '../types/Achievements';
import { SKILL_DEFINITIONS } from '../types/Skills';
import { CRIMES } from '../types/Crime';
import { useToast } from '@/hooks/use-toast';

interface UseGameLogicProps {
  character: Character;
  setCharacter: (character: Character | ((prevCharacter: Character) => Character)) => void;
}

export const useGameLogic = ({ character, setCharacter }: UseGameLogicProps) => {
  const [currentMajorEvent, setCurrentMajorEvent] = useState<MajorLifeEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [currentBitLifeEvent, setCurrentBitLifeEvent] = useState<BitLifeEvent | null>(null);
  const [currentEnhancedEvent, setCurrentEnhancedEvent] = useState<EnhancedEvent | null>(null);
  const [showBitLifeEvent, setShowBitLifeEvent] = useState(false);
  const [showEnhancedEvent, setShowEnhancedEvent] = useState(false);
  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState(0);
  const [totalMonthlyAssetIncome, setTotalMonthlyAssetIncome] = useState(0);
  
  const { toast } = useToast();

  useEffect(() => {
    setTotalMonthlyExpenses(calculateTotalMonthlyExpenses(character, HOUSING_OPTIONS, character.assets));
    setTotalMonthlyAssetIncome(calculateTotalMonthlyAssetIncome(character));
  }, [character, character.housing, character.assets]);

  const ageUp = () => {
    setCharacter(prevCharacter => {
      let newCharacter = { ...prevCharacter };
      newCharacter.age += 1;
      
      if (newCharacter.age === 5) {
        newCharacter.education = 'elementary';
        newCharacter.lifeEvents = [...newCharacter.lifeEvents, {
          id: Math.random().toString(36).substr(2, 9),
          year: newCharacter.birthYear + newCharacter.age,
          age: newCharacter.age,
          event: 'Started elementary school!',
          type: 'positive'
        }];
        newCharacter.smartness = Math.min(100, newCharacter.smartness + 5);
      }
      
      if (newCharacter.age === 11) {
        newCharacter.education = 'middle_school';
        newCharacter.lifeEvents = [...newCharacter.lifeEvents, {
          id: Math.random().toString(36).substr(2, 9),
          year: newCharacter.birthYear + newCharacter.age,
          age: newCharacter.age,
          event: 'Started middle school!',
          type: 'positive'
        }];
        newCharacter.smartness = Math.min(100, newCharacter.smartness + 5);
      }
      
      if (newCharacter.age === 14) {
        newCharacter.education = 'high_school';
        newCharacter.lifeEvents = [...newCharacter.lifeEvents, {
          id: Math.random().toString(36).substr(2, 9),
          year: newCharacter.birthYear + newCharacter.age,
          age: newCharacter.age,
          event: 'Started high school!',
          type: 'positive'
        }];
        newCharacter.smartness = Math.min(100, newCharacter.smartness + 5);
      }
      
      if (newCharacter.age === 18) {
        newCharacter.education = 'high_school';
        newCharacter.lifeEvents = [...newCharacter.lifeEvents, {
          id: Math.random().toString(36).substr(2, 9),
          year: newCharacter.birthYear + newCharacter.age,
          age: newCharacter.age,
          event: 'Graduated from high school! Time to choose your path in life.',
          type: 'positive'
        }];
        newCharacter.smartness = Math.min(100, newCharacter.smartness + 10);
        
        const lifePathEvent: MajorLifeEvent = {
          id: 'life_path_choice',
          name: 'Choose Your Path',
          description: 'You\'ve graduated high school! What do you want to do with your life?',
          minAge: 18,
          maxAge: 18,
          probability: 1.0,
          choices: [
            {
              id: 'college',
              text: 'Go to college',
              effects: { money: -50000, smartness: 25, happiness: 10 }
            },
            {
              id: 'work',
              text: 'Start working immediately',
              effects: { money: 20000, smartness: -5 }
            },
            {
              id: 'gap_year',
              text: 'Take a gap year to figure things out',
              effects: { happiness: 15, smartness: 5 }
            },
            {
              id: 'military',
              text: 'Join the military',
              effects: { fitness: 20, health: 10, smartness: 5, money: 15000 }
            }
          ]
        };
        
        setCurrentMajorEvent(lifePathEvent);
        setShowEventDialog(true);
      }
      
      const currentTotalMonthlyExpenses = calculateTotalMonthlyExpenses(newCharacter, HOUSING_OPTIONS, newCharacter.assets);
      const currentTotalMonthlyAssetIncome = calculateTotalMonthlyAssetIncome(newCharacter);

      const netMonthlyChange = Math.floor((newCharacter.salary || 0) / 12) + currentTotalMonthlyAssetIncome - currentTotalMonthlyExpenses;
      newCharacter.money += netMonthlyChange;
      newCharacter.money = Math.max(0, newCharacter.money);

      if (newCharacter.currentEducation && newCharacter.educationYearsLeft) {
        newCharacter.educationYearsLeft -= 1;
        if (newCharacter.educationYearsLeft <= 0) {
          const completedEducation = newCharacter.currentEducation;
          newCharacter.education = newCharacter.currentEducation;
          newCharacter.currentEducation = undefined;
          newCharacter.educationYearsLeft = undefined;
          
          newCharacter.lifeEvents = [...newCharacter.lifeEvents, {
            id: Math.random().toString(36).substr(2, 9),
            year: newCharacter.birthYear + newCharacter.age,
            age: newCharacter.age,
            event: `Graduated with ${completedEducation}!`, 
            type: 'positive'
          }];
        }
      }
      
      newCharacter.assets = newCharacter.assets.map(asset => {
        const assetInfo = ASSET_OPTIONS.find(opt => opt.id === asset.id);
        if (!assetInfo) return asset;

        let annualGrowth = assetInfo.averageAnnualGrowth || 0;
        const volatility = assetInfo.volatility || 0;
        const randomFluctuation = (Math.random() - 0.5) * 2 * volatility;
        const effectiveGrowth = annualGrowth + randomFluctuation;
        
        return {
          ...asset,
          currentValue: Math.max(0, Math.floor(asset.currentValue * (1 + effectiveGrowth))),
        };
      });
      
      ECONOMIC_EVENTS.forEach(event => {
        if (Math.random() < event.probability) {
          toast({
            title: `Economic Event: ${event.name}`,
            description: event.description,
            variant: (event.effects.marketTrend && event.effects.marketTrend < 1) || event.effects.jobMarketImpact === 'recession' ? 'destructive' : 'default',
          });
          newCharacter.lifeEvents = [...newCharacter.lifeEvents, {
            id: Math.random().toString(36).substr(2, 9),
            year: newCharacter.birthYear + newCharacter.age,
            age: newCharacter.age,
            event: `Economic Event: ${event.name} - ${event.description}`,
            type: (event.effects.marketTrend && event.effects.marketTrend < 1) || event.effects.jobMarketImpact === 'recession' ? 'negative' : 'neutral',
          }];

          if (event.effects.marketTrend) {
            newCharacter.assets = newCharacter.assets.map(asset => {
              if (asset.type === 'investment') {
                return { ...asset, currentValue: Math.floor(asset.currentValue * event.effects.marketTrend!) };
              }
              return asset;
            });
          }
          if (event.effects.assetTypeSpecificTrend) {
            newCharacter.assets = newCharacter.assets.map(asset => {
              if (asset.type === event.effects.assetTypeSpecificTrend?.assetType) {
                return { ...asset, currentValue: Math.floor(asset.currentValue * event.effects.assetTypeSpecificTrend!.trend) };
              }
              return asset;
            });
          }
        }
      });

      newCharacter.children = newCharacter.children.map(child => {
        const agedChild = { ...child, age: child.age + 1 };
        
        if (agedChild.age >= 18) {
          agedChild.relationshipWithParent = Math.max(30, agedChild.relationshipWithParent + (Math.random() * 10 - 5));
        }
        
        return agedChild;
      });
      
      if (newCharacter.marriageStatus.isMarried) {
        const happinessChange = Math.random() * 10 - 5;
        newCharacter.marriageStatus.marriageHappiness = Math.max(0, Math.min(100, 
          newCharacter.marriageStatus.marriageHappiness + happinessChange
        ));
        
        if (newCharacter.marriageStatus.marriageHappiness < 30) {
          newCharacter.marriageStatus.divorceRisk = Math.min(100, newCharacter.marriageStatus.divorceRisk + 10);
        } else {
          newCharacter.marriageStatus.divorceRisk = Math.max(0, newCharacter.marriageStatus.divorceRisk - 5);
        }
        
        if (newCharacter.marriageStatus.divorceRisk > 70 && Math.random() < 0.1) {
          const spouse = newCharacter.family.find(f => f.relationship === 'spouse');
          newCharacter.marriageStatus.isMarried = false;
          newCharacter.marriageStatus.spouseId = undefined;
          newCharacter.marriageStatus.marriageHappiness = 0;
          newCharacter.marriageStatus.divorceRisk = 0;
          newCharacter.family = newCharacter.family.filter(f => f.relationship !== 'spouse');
          
          newCharacter.lifeEvents = [...newCharacter.lifeEvents, {
            id: Math.random().toString(36).substr(2, 9),
            year: newCharacter.birthYear + newCharacter.age,
            age: newCharacter.age,
            event: `Divorced from ${spouse?.name || 'spouse'}.`,
            type: 'negative'
          }];
          
          newCharacter.happiness = Math.max(0, newCharacter.happiness - 20);
        }
      }
      
      newCharacter.socialStatus.socialClass = calculateSocialClass(
        newCharacter.money, 
        newCharacter.salary, 
        newCharacter.socialStatus.reputation
      );
      
      newCharacter.relationships = newCharacter.relationships.map(rel => {
        if (rel.isActive) {
          const decayChance = Math.random();
          if (decayChance < 0.1) {
            return { ...rel, relationshipLevel: Math.max(0, rel.relationshipLevel - 5) };
          }
        }
        return rel;
      }).filter(rel => rel.relationshipLevel > 0);
      
      const statChanges = {
        health: Math.floor(Math.random() * 11) - 5,
        happiness: Math.floor(Math.random() * 11) - 5,
        smartness: Math.floor(Math.random() * 6) - 2,
        appearance: Math.floor(Math.random() * 7) - 3,
        fitness: Math.floor(Math.random() * 9) - 4
      };

      newCharacter.health = Math.max(0, Math.min(100, newCharacter.health + statChanges.health));
      newCharacter.happiness = Math.max(0, Math.min(100, newCharacter.happiness + statChanges.happiness));
      newCharacter.smartness = Math.max(0, Math.min(100, newCharacter.smartness + statChanges.smartness));
      newCharacter.appearance = Math.max(0, Math.min(100, newCharacter.appearance + statChanges.appearance));
      newCharacter.fitness = Math.max(0, Math.min(100, newCharacter.fitness + statChanges.fitness));
      
      if (newCharacter.age !== 18) {
        const possibleEvents = MAJOR_LIFE_EVENTS.filter(event => 
          newCharacter.age >= event.minAge && 
          newCharacter.age <= event.maxAge &&
          Math.random() < event.probability
        );
        
        if (possibleEvents.length > 0 && !currentMajorEvent && !showEventDialog) {
          const selectedEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
          setCurrentMajorEvent(selectedEvent);
          setShowEventDialog(true);
        }
      }
      
      const randomLifeEventsPool = [ 
        'Had a great day!', 'Made a new friend', 'Learned something new', 'Felt a bit down',
        'Enjoyed time with family', 'Got a minor cold', 'Had an argument', 'Received a compliment',
        'Lost your keys', 'Found some money on the street'
      ];
      if (Math.random() < 0.25) {
        const eventText = randomLifeEventsPool[Math.floor(Math.random() * randomLifeEventsPool.length)];
        const eventType = eventText.includes('great') || eventText.includes('friend') || eventText.includes('compliment') || eventText.includes('Found some money') ? 'positive' :
                         eventText.includes('down') || eventText.includes('cold') || eventText.includes('argument') || eventText.includes('Lost your keys') ? 'negative' : 'neutral';
        newCharacter.lifeEvents = [...newCharacter.lifeEvents, {
          id: Math.random().toString(36).substr(2, 9),
          year: newCharacter.birthYear + newCharacter.age,
          age: newCharacter.age,
          event: eventText,
          type: eventType
        }];
      }

      newCharacter.family = newCharacter.family.map(member => ({
        ...member,
        age: member.age + 1,
      }));
      
      // Enhanced event generation with history - now using unified system
      const eventHistory = newCharacter.lifeEvents || [];
      
      if (!showBitLifeEvent && !showEnhancedEvent && Math.random() < 0.35) {
        const randomEvent = generateRandomEvent(newCharacter, eventHistory);
        
        if (randomEvent) {
          // Check if it's an enhanced event or classic BitLife event
          if ('category' in randomEvent) {
            setCurrentEnhancedEvent(randomEvent as EnhancedEvent);
            setShowEnhancedEvent(true);
          } else {
            setCurrentBitLifeEvent(randomEvent as BitLifeEvent);
            setShowBitLifeEvent(true);
          }
        }
      }
      
      // Check for new achievements
      const newAchievements = checkAchievements(newCharacter);
      if (newAchievements.length > 0) {
        newAchievements.forEach(achievement => {
          if (!newCharacter.achievements) newCharacter.achievements = [];
          newCharacter.achievements.push(achievement.id);
          
          newCharacter.lifeEvents.push({
            id: Math.random().toString(36).substr(2, 9),
            year: newCharacter.birthYear + newCharacter.age,
            age: newCharacter.age,
            event: `🏆 Achievement Unlocked: ${achievement.name}`,
            type: 'positive'
          });
        });
      }
      
      // Gain work experience if employed
      if (newCharacter.job !== 'unemployed') {
        newCharacter.experiencePoints = (newCharacter.experiencePoints || 0) + 10;
      }
      
      return newCharacter;
    });
  };

  const handleLifeStageAction = (actionType: string, payload: { [key: string]: any }) => {
    setCharacter(prevCharacter => {
      let newCharacter = { ...prevCharacter };
      let eventMessage = '';

      switch (actionType) {
        case 'commit_crime':
          const crime = CRIMES.find(c => c.id === payload.crimeId);
          if (crime) {
            // Initialize reputation if not exists
            if (!newCharacter.reputation) {
              newCharacter.reputation = { legal: 50, criminal: 0 };
            }
            
            // Add to criminal record
            const crimeRecord = {
              id: Math.random().toString(36).substr(2, 9),
              crime: crime.name,
              year: newCharacter.birthYear + newCharacter.age,
              age: newCharacter.age,
              caught: payload.arrested,
              punishment: payload.consequences?.duration ? 
                `${payload.consequences.duration} months jail, $${payload.consequences.fine?.toLocaleString()} fine` : 
                undefined,
              severity: crime.category === 'petty' ? 'misdemeanor' as const : 'felony' as const
            };
            
            newCharacter.criminalRecord = [...newCharacter.criminalRecord, crimeRecord];
            
            // Update money and reputation
            if (payload.success) {
              newCharacter.money += payload.payout;
              newCharacter.reputation.criminal += 5;
              newCharacter.criminalExperience = (newCharacter.criminalExperience || 0) + 1;
            }
            
            if (payload.arrested) {
              newCharacter.reputation.legal -= 10;
              newCharacter.happiness = Math.max(0, newCharacter.happiness - 15);
              
              if (payload.consequences?.fine) {
                newCharacter.money = Math.max(0, newCharacter.money - payload.consequences.fine);
              }
              
              // Add legal consequences
              if (payload.consequences) {
                if (!newCharacter.legalConsequences) newCharacter.legalConsequences = [];
                newCharacter.legalConsequences.push(payload.consequences);
              }
            }
            
            eventMessage = payload.success ? 
              `Successfully committed ${crime.name}${payload.arrested ? ' but got caught' : ''}` :
              `Failed to commit ${crime.name}${payload.arrested ? ' and got arrested' : ''}`;
          }
          break;
        
        case 'start_education':
          newCharacter.money -= payload.cost;
          newCharacter.currentEducation = payload.educationId;
          newCharacter.educationYearsLeft = payload.duration;
          Object.entries(payload.statBoosts || {}).forEach(([key, value]) => {
            if (typeof value === 'number' && (newCharacter as any)[key] !== undefined) {
              (newCharacter as any)[key] = Math.max(0, Math.min(100, (newCharacter as any)[key] + value));
            }
          });
          eventMessage = `Started ${payload.educationId} education.`;
          break;
        case 'change_job':
          newCharacter.job = payload.jobId;
          newCharacter.salary = payload.salary;
          if (payload.happinessBoost) newCharacter.happiness = Math.min(100, newCharacter.happiness + payload.happinessBoost);
          eventMessage = `Became a ${payload.jobId}.`;
          break;
        case 'buy_housing':
          newCharacter.money -= payload.cost;
          newCharacter.housing = payload.housingId;
          Object.entries(payload.statEffects || {}).forEach(([key, value]) => {
            if (typeof value === 'number' && (newCharacter as any)[key] !== undefined) {
              (newCharacter as any)[key] = Math.max(0, Math.min(100, (newCharacter as any)[key] + value));
            }
          });
          eventMessage = `Moved to ${payload.housingId}.`;
          break;
        case 'buy_asset':
          const assetToBuy = ASSET_OPTIONS.find(a => a.id === payload.assetId);
          if (assetToBuy && newCharacter.money >= assetToBuy.purchasePrice) {
            newCharacter.money -= assetToBuy.purchasePrice;
            const purchasedAsset: Asset = { 
              ...assetToBuy, 
              currentValue: assetToBuy.purchasePrice,
              purchaseYear: newCharacter.birthYear + newCharacter.age 
            };
            newCharacter.assets = [...newCharacter.assets, purchasedAsset];
            Object.entries(payload.statEffects || {}).forEach(([key, value]) => {
              if (typeof value === 'number' && (newCharacter as any)[key] !== undefined) {
                (newCharacter as any)[key] = Math.max(0, Math.min(100, (newCharacter as any)[key] + value));
              }
            });
            eventMessage = `Purchased ${assetToBuy.name}.`;
          }
          break;
        case 'sell_asset':
          const assetToSell = newCharacter.assets.find(a => a.id === payload.assetId);
          if (assetToSell) {
            newCharacter.money += payload.sellPrice;
            newCharacter.assets = newCharacter.assets.filter(a => a.id !== payload.assetId);
            eventMessage = `Sold ${assetToSell.name} for $${payload.sellPrice.toLocaleString()}.`;
          }
          break;
        case 'train_skill':
          newCharacter.money -= payload.cost;
          if (!newCharacter.skills) newCharacter.skills = [];
          
          const existingSkill = newCharacter.skills.find(s => s.id === payload.skillId);
          if (existingSkill) {
            existingSkill.level = Math.min(100, existingSkill.level + 15);
          } else {
            const skillDef = SKILL_DEFINITIONS.find(s => s.id === payload.skillId);
            if (skillDef) {
              newCharacter.skills.push({
                id: payload.skillId,
                name: skillDef.name,
                level: 15,
                category: skillDef.category
              });
            }
          }
          
          newCharacter.experiencePoints = (newCharacter.experiencePoints || 0) + payload.experienceGain;
          eventMessage = `Improved ${SKILL_DEFINITIONS.find(s => s.id === payload.skillId)?.name} skill through training.`;
          break;
        case 'promotion':
          newCharacter.careerLevel += 1;
          newCharacter.salary += payload.salaryIncrease;
          if (payload.experienceReset) {
            newCharacter.experiencePoints = 0;
          }
          newCharacter.happiness = Math.min(100, newCharacter.happiness + 20);
          eventMessage = `Got promoted! New career level: ${newCharacter.careerLevel}`;
          break;
        default:
          Object.entries(payload).forEach(([key, value]) => {
             if (typeof value === 'number' && (newCharacter as any)[key] !== undefined) {
               (newCharacter as any)[key] = Math.max(0, Math.min(100, (newCharacter as any)[key] + value));
             } else if (key !== 'actionType') {
                (newCharacter as any)[key] = value;
             }
          });
          eventMessage = `Performed action: ${actionType}`;
          break;
      }
      
      if (eventMessage) {
        newCharacter.lifeEvents = [...newCharacter.lifeEvents, {
          id: Math.random().toString(36).substr(2, 9),
          year: newCharacter.birthYear + newCharacter.age,
          age: newCharacter.age,
          event: eventMessage,
          type: actionType === 'commit_crime' ? 
            (payload.success && !payload.arrested ? 'positive' : 'negative') : 'neutral'
        }];
      }
      return newCharacter;
    });
  };

  const handleMajorEventChoice = (choice: EventChoice) => {
    setCharacter(prevCharacter => {
        let newCharacter = { ...prevCharacter };
        Object.entries(choice.effects).forEach(([key, value]) => {
            if (typeof value === 'number' && typeof (newCharacter as any)[key] === 'number') {
                (newCharacter as any)[key] = Math.max(0, (newCharacter as any)[key] + value);
                if (key !== 'money') { 
                    (newCharacter as any)[key] = Math.min(100, (newCharacter as any)[key]);
                }
            } else {
                 (newCharacter as any)[key] = value;
            }
        });

        newCharacter.lifeEvents = [...newCharacter.lifeEvents, {
            id: Math.random().toString(36).substr(2, 9),
            year: newCharacter.birthYear + newCharacter.age,
            age: newCharacter.age,
            event: `${currentMajorEvent?.name}: ${choice.text}`,
            type: choice.effects.happiness && choice.effects.happiness > 0 ? 'positive' : 
                  choice.effects.happiness && choice.effects.happiness < 0 ? 'negative' : 'neutral'
        }];
        return newCharacter;
    });
    setShowEventDialog(false); 
    setCurrentMajorEvent(null);
  };

  const handleBitLifeEventChoice = (choice: any) => {
    setCharacter(prevCharacter => {
      let newCharacter = { ...prevCharacter };
      
      Object.entries(choice.effects).forEach(([key, value]) => {
        if (typeof value === 'number' && typeof (newCharacter as any)[key] === 'number') {
          (newCharacter as any)[key] = Math.max(0, (newCharacter as any)[key] + value);
          if (key !== 'money') {
            (newCharacter as any)[key] = Math.min(100, (newCharacter as any)[key]);
          }
        }
      });

      newCharacter.lifeEvents = [...newCharacter.lifeEvents, {
        id: Math.random().toString(36).substr(2, 9),
        year: newCharacter.birthYear + newCharacter.age,
        age: newCharacter.age,
        event: `${currentBitLifeEvent?.title}: ${choice.text}`,
        type: choice.effects.happiness && choice.effects.happiness > 0 ? 'positive' : 
              choice.effects.happiness && choice.effects.happiness < 0 ? 'negative' : 'neutral'
      }];

      return newCharacter;
    });
    
    setShowBitLifeEvent(false);
    setCurrentBitLifeEvent(null);
  };

  const handleEnhancedEventChoice = (choice: any, effects: any, eventText: string) => {
    setCharacter(prevCharacter => {
      let newCharacter = { ...prevCharacter };
      
      // Apply effects
      Object.entries(effects).forEach(([key, value]) => {
        if (typeof value === 'number' && typeof (newCharacter as any)[key] === 'number') {
          (newCharacter as any)[key] = Math.max(0, (newCharacter as any)[key] + value);
          if (key !== 'money') {
            (newCharacter as any)[key] = Math.min(100, (newCharacter as any)[key]);
          }
        }
      });

      // Add to life events with enhanced text
      newCharacter.lifeEvents = [...newCharacter.lifeEvents, {
        id: Math.random().toString(36).substr(2, 9),
        year: newCharacter.birthYear + newCharacter.age,
        age: newCharacter.age,
        event: `${currentEnhancedEvent?.title}: ${eventText}`,
        type: effects.happiness && effects.happiness > 0 ? 'positive' : 
              effects.happiness && effects.happiness < 0 ? 'negative' : 'neutral'
      }];

      // Handle special triggers
      if (choice.triggerEvents) {
        // Store triggered events for future processing
        newCharacter.pendingEvents = newCharacter.pendingEvents || [];
        choice.triggerEvents.forEach((eventId: string) => {
          newCharacter.pendingEvents.push({
            id: Math.random().toString(36).substr(2, 9),
            eventId,
            triggerAge: newCharacter.age + 1
          });
        });
      }

      return newCharacter;
    });
    
    setShowEnhancedEvent(false);
    setCurrentEnhancedEvent(null);
  };

  return {
    currentMajorEvent,
    setCurrentMajorEvent,
    showEventDialog,
    setShowEventDialog,
    currentBitLifeEvent,
    setCurrentBitLifeEvent,
    currentEnhancedEvent,
    setCurrentEnhancedEvent,
    showBitLifeEvent,
    setShowBitLifeEvent,
    showEnhancedEvent,
    setShowEnhancedEvent,
    totalMonthlyExpenses,
    totalMonthlyAssetIncome,
    ageUp,
    handleLifeStageAction,
    handleMajorEventChoice,
    handleBitLifeEventChoice,
    handleEnhancedEventChoice
  };
};

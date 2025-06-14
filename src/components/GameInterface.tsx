import { useState, useEffect } from 'react';
import { Character, calculateTotalMonthlyExpenses, calculateTotalMonthlyAssetIncome, calculateSocialClass } from '../types/Character';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, User, Briefcase, Calendar, Menu as MenuIcon, TrendingUp, PiggyBank, Building } from 'lucide-react';
import RelationshipsPanel from './RelationshipsPanel';
import SettingsPanel from './SettingsPanel';
import LifeStageActions from './LifeStageActions';
import MajorEventDialog from './MajorEventDialog';
import { MAJOR_LIFE_EVENTS, MajorLifeEvent, EventChoice } from '../types/MajorEvents';
import { getCurrentLifeStage } from '../types/LifeStages';
import { ASSET_OPTIONS, Asset } from '../types/Asset';
import { ECONOMIC_EVENTS, EconomicEvent } from '../types/EconomicEvent';
import { HOUSING_OPTIONS } from '../types/Housing';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from "@/components/ui/toaster";

import TimelineView from './TimelineView';
import AssetsPanel from './AssetsPanel';
import ProfileView from './ProfileView';
import SocialActivitiesPanel from './SocialActivitiesPanel';
import BitLifeEventOverlay from './BitLifeEventOverlay';
import { BITLIFE_EVENTS, generateRandomEvent, BitLifeEvent } from '../types/BitLifeEvents';

interface GameInterfaceProps {
  character: Character;
  setCharacter: (character: Character | ((prevCharacter: Character) => Character)) => void;
}

const GameInterface = ({ character, setCharacter }: GameInterfaceProps) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'activities' | 'relationships' | 'assets' | 'profile' | 'settings'>('timeline');
  const [currentMajorEvent, setCurrentMajorEvent] = useState<MajorLifeEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  
  // BitLife-style events
  const [currentBitLifeEvent, setCurrentBitLifeEvent] = useState<BitLifeEvent | null>(null);
  const [showBitLifeEvent, setShowBitLifeEvent] = useState(false);
  
  const { toast } = useToast();

  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState(0);
  const [totalMonthlyAssetIncome, setTotalMonthlyAssetIncome] = useState(0);

  useEffect(() => {
    setTotalMonthlyExpenses(calculateTotalMonthlyExpenses(character, HOUSING_OPTIONS, character.assets));
    setTotalMonthlyAssetIncome(calculateTotalMonthlyAssetIncome(character));
  }, [character, character.housing, character.assets]);

  const ageUp = () => {
    setCharacter(prevCharacter => {
      let newCharacter = { ...prevCharacter };
      newCharacter.age += 1;
      
      // Handle automatic school enrollments
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
        
        // Create a special major event for choosing life path at 18
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

      // Net monthly cash flow
      const netMonthlyChange = Math.floor((newCharacter.salary || 0) / 12) + currentTotalMonthlyAssetIncome - currentTotalMonthlyExpenses;
      newCharacter.money += netMonthlyChange;
      newCharacter.money = Math.max(0, newCharacter.money);

      // ... keep existing code (education completion logic)
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
      
      // ... keep existing code (asset value updates, economic events, children aging, marriage logic, social status updates, relationship decay, stat changes, major events, random life events, family aging, BitLife events)
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
      
      // Only check for other major events if we haven't triggered the life path choice at 18
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
      
      if (!showBitLifeEvent && Math.random() < 0.3) {
        const randomEvent = generateRandomEvent(newCharacter.age);
        if (randomEvent) {
          setCurrentBitLifeEvent(randomEvent);
          setShowBitLifeEvent(true);
        }
      }
      
      return newCharacter;
    });
  };

  const handleLifeStageAction = (actionType: string, payload: { [key: string]: any }) => {
    setCharacter(prevCharacter => {
      let newCharacter = { ...prevCharacter };
      let eventMessage = '';

      switch (actionType) {
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
          type: 'neutral'
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

  const menuItems = [
    { id: 'timeline', icon: Calendar, label: 'Timeline' },
    { id: 'activities', icon: Briefcase, label: 'Actions' },
    { id: 'assets', icon: PiggyBank, label: 'Assets' },
    { id: 'relationships', icon: Heart, label: 'Relations' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'timeline':
        return <TimelineView character={character} onAgeUp={ageUp} onLifeStageAction={handleLifeStageAction} monthlyExpenses={totalMonthlyExpenses} monthlyAssetIncome={totalMonthlyAssetIncome} />;
      case 'activities':
        return <LifeStageActions character={character} onAction={handleLifeStageAction} />;
      case 'assets':
        return <AssetsPanel character={character} onAction={handleLifeStageAction} />;
      case 'relationships':
        return <SocialActivitiesPanel character={character} onAction={handleLifeStageAction} />;
      case 'profile':
        return <ProfileView character={character} />;
      default:
        return <TimelineView character={character} onAgeUp={ageUp} onLifeStageAction={handleLifeStageAction} monthlyExpenses={totalMonthlyExpenses} monthlyAssetIncome={totalMonthlyAssetIncome} />;
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Toaster />
      
      <div className="glass-card m-2 p-3 shadow-lg sticky top-2 z-10 border border-white/20">
        <div className="text-center">
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {character.name}
          </h1>
          <p className="text-white/70 text-xs">
            ${character.money.toLocaleString()}
          </p>
          {character.currentEducation && (
            <p className="text-blue-400 text-xs italic mt-1">
              📚 {character.currentEducation} ({character.educationYearsLeft} yrs)
            </p>
          )}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto pb-20">
        {renderContent()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 mica-card border-t border-white/10 px-2 py-2 shadow-2xl safe-area-bottom">
        <div className="flex justify-around items-center">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 flex-1 max-w-20 fluent-hover
                ${ activeTab === item.id
                    ? 'win11-button text-white shadow-lg scale-105'
                    : 'text-white/60 hover:text-white hover:bg-white/10 ios-button'
                }`}
              title={item.label}
            >
              <item.icon size={20} />
              <span className="text-[10px] mt-1 font-medium leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <BitLifeEventOverlay
        event={currentBitLifeEvent}
        isOpen={showBitLifeEvent}
        onChoice={handleBitLifeEventChoice}
        onClose={() => {
          setShowBitLifeEvent(false);
          setCurrentBitLifeEvent(null);
        }}
      />

      <MajorEventDialog
        isOpen={showEventDialog}
        event={currentMajorEvent}
        character={character}
        onChoice={handleMajorEventChoice}
        onClose={() => { setShowEventDialog(false); setCurrentMajorEvent(null); }}
      />
    </div>
  );
};

export default GameInterface;

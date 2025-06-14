import { useState, useEffect } from 'react';
import { Character, calculateTotalMonthlyExpenses, calculateTotalMonthlyAssetIncome } from '../types/Character';
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

interface GameInterfaceProps {
  character: Character;
  setCharacter: (character: Character | ((prevCharacter: Character) => Character)) => void;
}

const GameInterface = ({ character, setCharacter }: GameInterfaceProps) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'activities' | 'relationships' | 'assets' | 'profile' | 'settings'>('timeline');
  const [currentMajorEvent, setCurrentMajorEvent] = useState<MajorLifeEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
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
      
      const currentTotalMonthlyExpenses = calculateTotalMonthlyExpenses(newCharacter, HOUSING_OPTIONS, newCharacter.assets);
      const currentTotalMonthlyAssetIncome = calculateTotalMonthlyAssetIncome(newCharacter);

      // Net monthly cash flow
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

      // Age children and update their relationships
      newCharacter.children = newCharacter.children.map(child => {
        const agedChild = { ...child, age: child.age + 1 };
        
        // Children develop over time
        if (agedChild.age >= 18) {
          // Child becomes independent, relationship might change
          agedChild.relationshipWithParent = Math.max(30, agedChild.relationshipWithParent + (Math.random() * 10 - 5));
        }
        
        return agedChild;
      });
      
      // Update marriage happiness if married
      if (newCharacter.marriageStatus.isMarried) {
        const happinessChange = Math.random() * 10 - 5; // -5 to +5
        newCharacter.marriageStatus.marriageHappiness = Math.max(0, Math.min(100, 
          newCharacter.marriageStatus.marriageHappiness + happinessChange
        ));
        
        // Check for divorce risk
        if (newCharacter.marriageStatus.marriageHappiness < 30) {
          newCharacter.marriageStatus.divorceRisk = Math.min(100, newCharacter.marriageStatus.divorceRisk + 10);
        } else {
          newCharacter.marriageStatus.divorceRisk = Math.max(0, newCharacter.marriageStatus.divorceRisk - 5);
        }
        
        // Potential divorce
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
      
      // Update social status
      newCharacter.socialStatus.socialClass = calculateSocialClass(
        newCharacter.money, 
        newCharacter.salary, 
        newCharacter.socialStatus.reputation
      );
      
      // Social relationships can decay over time
      newCharacter.relationships = newCharacter.relationships.map(rel => {
        if (rel.isActive) {
          const decayChance = Math.random();
          if (decayChance < 0.1) { // 10% chance of relationship decay
            return { ...rel, relationshipLevel: Math.max(0, rel.relationshipLevel - 5) };
          }
        }
        return rel;
      }).filter(rel => rel.relationshipLevel > 0); // Remove completely failed relationships
      
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

  const menuItems = [
    { id: 'timeline', icon: Calendar, label: 'Timeline' },
    { id: 'activities', icon: Briefcase, label: 'Actions' },
    { id: 'assets', icon: PiggyBank, label: 'Assets' },
    { id: 'relationships', icon: Heart, label: 'Relations' },
    { id: 'profile', icon: User, label: 'Profile' },
    // { id: 'settings', icon: SettingsIcon, label: 'Settings' } // Or MenuIcon for a generic menu
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
        return <RelationshipsPanel character={character} setCharacter={setCharacter} />;
      case 'profile':
        return <ProfileView character={character} />;
      // case 'settings':
      //   return <SettingsPanel />;
      default:
        return <TimelineView character={character} onAgeUp={ageUp} onLifeStageAction={handleLifeStageAction} monthlyExpenses={totalMonthlyExpenses} monthlyAssetIncome={totalMonthlyAssetIncome} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <Toaster />
      {/* Stats Header - Always Visible */}
      <div className="bg-slate-800 p-3 border-b border-slate-700 shadow-md sticky top-0 z-10">
        <div className="text-center mb-2">
          <h1 className="text-lg font-bold">{character.name}</h1>
          <p className="text-slate-300 text-xs">
            Age {character.age} • ${character.money.toLocaleString()} • {getCurrentLifeStage(character.age).name}
          </p>
          {character.currentEducation && (
            <p className="text-blue-400 text-xs italic">
              Studying {character.currentEducation} ({character.educationYearsLeft} yrs left)
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-x-2 gap-y-1 text-xs">
          <StatBar label="Health" value={character.health} color="bg-green-500" />
          <StatBar label="Happiness" value={character.happiness} color="bg-yellow-500" />
          <StatBar label="Smarts" value={character.smartness} color="bg-blue-500" />
          <StatBar label="Looks" value={character.appearance} color="bg-pink-500" />
          <StatBar label="Fitness" value={character.fitness} color="bg-red-500" />
          <FinancialStatBar label="Expenses/mo" value={totalMonthlyExpenses} color="text-red-400" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-y-auto pb-20 px-2 sm:px-4 pt-3">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 px-2 py-1.5 shadow-top">
        <div className="flex justify-around items-center">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 w-1/5
                ${ activeTab === item.id
                    ? 'bg-blue-600 text-white scale-105'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              title={item.label}
            >
              <item.icon size={20} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

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

const StatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="space-y-0.5">
    <div className="flex justify-between text-xs">
      <span className="text-slate-300">{label}</span>
      <span className="text-white font-medium">{value}%</span>
    </div>
    <div className="w-full bg-slate-700 rounded-full h-1.5">
      <div
        className={`h-1.5 rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  </div>
);

const FinancialStatBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className="space-y-0.5">
    <div className="flex justify-between text-xs">
      <span className="text-slate-300">{label}</span>
      <span className={`${color} font-medium`}>${value.toLocaleString()}</span>
    </div>
     <div className="w-full bg-slate-700 rounded-full h-1.5">
    </div>
  </div>
);

export default GameInterface;

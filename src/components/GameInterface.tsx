import { useState, useEffect } from 'react';
import { Character, calculateTotalMonthlyExpenses, calculateTotalMonthlyAssetIncome } from '../types/Character';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, User, Briefcase, Calendar, Menu as MenuIcon, TrendingUp, PiggyBank, Building } from 'lucide-react'; // Added MenuIcon, TrendingUp, PiggyBank, Building
import ActionsPanel from './ActionsPanel'; // This might be deprecated or integrated
import RelationshipsPanel from './RelationshipsPanel';
import LifeEvents from './LifeEvents'; // This is more of a profile/log view
import SettingsPanel from './SettingsPanel';
import LifeStageActions from './LifeStageActions';
import MajorEventDialog from './MajorEventDialog';
import { MAJOR_LIFE_EVENTS, MajorLifeEvent, EventChoice } from '../types/MajorEvents';
import { getCurrentLifeStage } from '../types/LifeStages';
import { ASSET_OPTIONS, Asset } from '../types/Asset'; // Import Asset types
import { ECONOMIC_EVENTS, EconomicEvent } from '../types/EconomicEvent'; // Import Economic Events
import { HOUSING_OPTIONS } from '../types/Housing'; // Import Housing options for expense calculation
import { useToast } from '@/hooks/use-toast'; // Shadcn toast
import { Toaster } from "@/components/ui/toaster"; // Toaster component

interface GameInterfaceProps {
  character: Character;
  setCharacter: (character: Character | ((prevCharacter: Character) => Character)) => void;
}

const GameInterface = ({ character, setCharacter }: GameInterfaceProps) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'activities' | 'relationships' | 'assets' | 'settings'>('timeline'); // Added 'assets' tab
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
      newCharacter.money = Math.max(0, newCharacter.money); // Ensure money doesn't go negative from this step

      // ... keep existing code (education progression)
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
            event: `Graduated with ${completedEducation}!`, // Use the stored completed education
            type: 'positive'
          }];
        }
      }
      
      // Asset value changes (simple model: average growth + volatility)
      newCharacter.assets = newCharacter.assets.map(asset => {
        const assetInfo = ASSET_OPTIONS.find(opt => opt.id === asset.id);
        if (!assetInfo) return asset;

        let annualGrowth = assetInfo.averageAnnualGrowth || 0;
        const volatility = assetInfo.volatility || 0;
        // Random factor based on volatility: (Math.random() - 0.5) results in a range from -0.5 to 0.5
        // Multiply by 2 to get a range from -1 to 1, then by volatility
        const randomFluctuation = (Math.random() - 0.5) * 2 * volatility;
        const effectiveGrowth = annualGrowth + randomFluctuation;
        
        return {
          ...asset,
          currentValue: Math.max(0, Math.floor(asset.currentValue * (1 + effectiveGrowth))),
        };
      });
      
      // Check for Economic Events
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

          // Apply economic event effects (simplified)
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
          // TODO: Inflation, job market impact would require more complex logic affecting salary changes, job search etc.
        }
      });

      // ... keep existing code (Apply random stat changes, Check for major life events, Random life events, Age family members)
      const statChanges = {
        health: Math.floor(Math.random() * 11) - 5, // -5 to +5
        happiness: Math.floor(Math.random() * 11) - 5, // -5 to +5
        smartness: Math.floor(Math.random() * 6) - 2,  // -2 to +3
        appearance: Math.floor(Math.random() * 7) - 3, // -3 to +3
        fitness: Math.floor(Math.random() * 9) - 4    // -4 to +4
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
      
      if (possibleEvents.length > 0 && !currentMajorEvent && !showEventDialog) { // Ensure no event is currently showing
        const selectedEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
        setCurrentMajorEvent(selectedEvent);
        setShowEventDialog(true);
      }
      
      const randomLifeEventsPool = [ /* ... keep existing random events pool ... */ 
        'Had a great day!', 'Made a new friend', 'Learned something new', 'Felt a bit down',
        'Enjoyed time with family', 'Got a minor cold', 'Had an argument', 'Received a compliment',
        'Lost your keys', 'Found some money on the street'
      ];
      if (Math.random() < 0.25) { // Adjusted probability
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
        // TODO: Add chance of family member death, relationship changes
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
          // monthlyExpenses related to housing are handled by calculateTotalMonthlyExpenses
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
              currentValue: assetToBuy.purchasePrice, // Start with purchase price as current value
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
          // Generic effect application for other actions if any
          Object.entries(payload).forEach(([key, value]) => {
             if (typeof value === 'number' && (newCharacter as any)[key] !== undefined) {
               (newCharacter as any)[key] = Math.max(0, Math.min(100, (newCharacter as any)[key] + value));
             } else if (key !== 'actionType') {
                (newCharacter as any)[key] = value;
             }
          });
          eventMessage = `Performed action: ${actionType}`; // Fallback message
          break;
      }
      
      if (eventMessage) {
        newCharacter.lifeEvents = [...newCharacter.lifeEvents, {
          id: Math.random().toString(36).substr(2, 9),
          year: newCharacter.birthYear + newCharacter.age,
          age: newCharacter.age,
          event: eventMessage,
          type: 'neutral' // Default to neutral, can be refined
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
                if (key !== 'money') { // Stats like health, happiness etc. should be capped at 100
                    (newCharacter as any)[key] = Math.min(100, (newCharacter as any)[key]);
                }
            } else {
                 // Handle other types of effects if necessary, e.g., string changes for job/education
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
    setShowEventDialog(false); // Close dialog after choice
    setCurrentMajorEvent(null);
  };

  const menuItems = [
    { id: 'timeline', icon: Calendar, label: 'Timeline' },
    { id: 'activities', icon: Briefcase, label: 'Actions' }, // This might become "Opportunities" or integrated
    { id: 'assets', icon: PiggyBank, label: 'Assets' },
    { id: 'relationships', icon: Heart, label: 'Relations' },
    { id: 'profile', icon: User, label: 'Profile' }, // Profile could show detailed stats, life log
    // { id: 'settings', icon: MenuIcon, label: 'Menu' } // Settings might be better accessed from a top-bar menu or profile
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'timeline':
        return <TimelineView character={character} onAgeUp={ageUp} onLifeStageAction={handleLifeStageAction} monthlyExpenses={totalMonthlyExpenses} monthlyAssetIncome={totalMonthlyAssetIncome} />;
      case 'activities': // Consider renaming or merging this. For now, it points to LifeStageActions
        return <LifeStageActions character={character} onAction={handleLifeStageAction} />;
      case 'assets':
        return <AssetsPanel character={character} onAction={handleLifeStageAction} />;
      case 'relationships':
        return <RelationshipsPanel character={character} setCharacter={setCharacter} />; // Needs review
      case 'profile':
        return <ProfileView character={character} />; // New ProfileView component
      // case 'settings':
      //   return <SettingsPanel />; // Needs review
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

// ... keep existing code (StatBar component)
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
      {/* Optional: could add a bar here if it makes sense, e.g. relative to income */}
    </div>
  </div>
);


// ... TimelineView component ...
const TimelineView = ({ 
  character, 
  onAgeUp, 
  onLifeStageAction,
  monthlyExpenses,
  monthlyAssetIncome
}: { 
  character: Character; 
  onAgeUp: () => void;
  onLifeStageAction: (actionType: string, payload: { [key: string]: any }) => void;
  monthlyExpenses: number;
  monthlyAssetIncome: number;
}) => {
  const currentStage = getCurrentLifeStage(character.age);
  const yearlySalary = character.salary || 0;
  const netMonthlyCashflow = Math.floor(yearlySalary / 12) + monthlyAssetIncome - monthlyExpenses;

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/70 border-slate-700 shadow-lg">
        <CardContent className="p-3">
          <div className="text-center space-y-1">
             <p className="text-slate-300 text-sm">
              You are a {character.age} year old {character.gender} in the {currentStage.name} stage.
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-left">
              <p className="text-slate-400">Education: <span className="text-white font-medium">{character.education}</span></p>
              <p className="text-slate-400">Job: <span className="text-white font-medium">{character.job}</span></p>
              <p className="text-slate-400">Housing: <span className="text-white font-medium">{character.housing || 'With Parents'}</span></p>
              <p className="text-slate-400">Salary: <span className="text-green-400 font-medium">${yearlySalary.toLocaleString()}/yr</span></p>
              <p className="text-slate-400">Expenses: <span className="text-red-400 font-medium">${monthlyExpenses.toLocaleString()}/mo</span></p>
              <p className="text-slate-400">Asset Income: <span className="text-sky-400 font-medium">${monthlyAssetIncome.toLocaleString()}/mo</span></p>
            </div>
            <p className={`text-sm font-semibold pt-1 ${netMonthlyCashflow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              Net Cashflow: ${netMonthlyCashflow.toLocaleString()}/mo
            </p>
          </div>
        </CardContent>
      </Card>

      <LifeStageActions character={character} onAction={onLifeStageAction} />

      <Card className="bg-slate-800/70 border-slate-700 shadow-lg">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-white text-md">Recent Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-60 overflow-y-auto px-3 pb-3 pr-1">
          {character.lifeEvents.length === 0 && <p className="text-slate-400 text-sm text-center py-2">No major events yet.</p>}
          {character.lifeEvents
            .slice()
            .reverse()
            .slice(0, 7)
            .map((event) => (
              <div key={event.id} className="p-2 bg-slate-700/50 rounded-md border border-slate-600 text-xs">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-white">{event.event}</p>
                    <p className="text-slate-400 text-[10px]">
                      Age {event.age} • Year {event.year}
                    </p>
                  </div>
                  <span className={`text-sm ml-2 ${event.type === 'positive' ? 'text-green-400' : event.type === 'negative' ? 'text-red-400' : 'text-slate-400'}`}>
                    {event.type === 'positive' ? '🎉' : 
                     event.type === 'negative' ? '😟' : ' событий'} {/* Russian "событий" meaning "events" - using an emoji or simple icon may be better */}
                  </span>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      <div className="flex justify-center pt-2 pb-4">
        <Button
          onClick={onAgeUp}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-10 py-3 text-base font-semibold rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-150"
        >
          Age Up! ({character.age + 1})
        </Button>
      </div>
    </div>
  );
};

// New AssetsPanel component
const AssetsPanel = ({ character, onAction }: { character: Character, onAction: (actionType: string, payload: { [key: string]: any }) => void }) => {
  const totalAssetValue = character.assets.reduce((sum, asset) => sum + asset.currentValue, 0);

  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/70 border-slate-700 shadow-lg">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-white text-lg">My Assets</CardTitle>
          <p className="text-slate-300 text-sm">Total Value: <span className="font-semibold text-green-400">${totalAssetValue.toLocaleString()}</span></p>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto px-3 pb-3 pr-1">
          {character.assets.length === 0 ? (
            <p className="text-slate-400 text-center py-4">You don't own any assets yet. Check "Actions" to acquire some!</p>
          ) : (
            character.assets.map(asset => (
              <Card key={asset.id} className="bg-slate-700/50 border-slate-600 p-3">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-white font-semibold">{asset.name} <span className="text-xs text-slate-400">({asset.type})</span></h4>
                  <p className="text-green-400 font-medium">${asset.currentValue.toLocaleString()}</p>
                </div>
                <p className="text-slate-300 text-xs mb-1">{asset.description}</p>
                <div className="grid grid-cols-2 gap-x-2 text-xs mb-2">
                  <p className="text-slate-400">Bought: <span className="text-white">${asset.purchasePrice.toLocaleString()}</span> (Yr {asset.purchaseYear})</p>
                  <p className="text-red-400">Maint./mo: <span className="text-white">${asset.monthlyMaintenance.toLocaleString()}</span></p>
                  <p className="text-sky-400">Income/mo: <span className="text-white">${asset.monthlyIncome.toLocaleString()}</span></p>
                </div>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="w-full text-xs py-1"
                  onClick={() => onAction('sell_asset', { assetId: asset.id, sellPrice: asset.currentValue })}
                >
                  Sell for ${asset.currentValue.toLocaleString()}
                </Button>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
       {/* Section for available assets to buy could also go here, or keep it in LifeStageActions */}
    </div>
  );
};

// New ProfileView component
const ProfileView = ({ character }: { character: Character }) => {
  return (
    <div className="space-y-4">
      <Card className="bg-slate-800/70 border-slate-700 shadow-lg">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-white text-lg">{character.name}'s Profile</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mb-3">
            <p className="text-slate-400">Age: <span className="text-white">{character.age}</span></p>
            <p className="text-slate-400">Gender: <span className="text-white capitalize">{character.gender}</span></p>
            <p className="text-slate-400">Money: <span className="text-green-400">${character.money.toLocaleString()}</span></p>
            <p className="text-slate-400">Education: <span className="text-white">{character.education}</span></p>
            <p className="text-slate-400">Job: <span className="text-white">{character.job}</span></p>
            <p className="text-slate-400">Salary: <span className="text-green-400">${character.salary.toLocaleString()}/yr</span></p>
            <p className="text-slate-400">Housing: <span className="text-white">{character.housing}</span></p>
          </div>

          {/* Achievements (Placeholder) */}
          {character.achievements.length > 0 && (
            <div className="mb-3">
              <h4 className="text-slate-200 font-semibold text-sm mb-1">Achievements:</h4>
              <div className="flex flex-wrap gap-1">
                {character.achievements.map(ach => (
                  <span key={ach} className="bg-yellow-500 text-slate-900 text-xs px-2 py-0.5 rounded-full">{ach}</span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Life Events Log (taken from existing LifeEvents component logic) */}
      <LifeEvents character={character} />
    </div>
  );
};


export default GameInterface;

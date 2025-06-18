
import { Calendar, User, Activity, DollarSign, Trophy, Briefcase, Shield, Lock } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: 'timeline' | 'activities' | 'relationships' | 'assets' | 'profile' | 'achievements' | 'career' | 'crime' | 'prison') => void;
  isIncarcerated?: boolean;
}

const BottomNavigation = ({ activeTab, setActiveTab, isIncarcerated }: BottomNavigationProps) => {
  const tabs = [
    { id: 'timeline', icon: Calendar, label: 'Timeline', disabled: false },
    { id: 'activities', icon: Activity, label: isIncarcerated ? 'Prison' : 'Activities', disabled: false },
    { id: 'relationships', icon: User, label: 'Social', disabled: false },
    { id: 'assets', icon: DollarSign, label: 'Assets', disabled: isIncarcerated },
    { id: 'career', icon: Briefcase, label: 'Career', disabled: isIncarcerated },
    { id: 'crime', icon: Shield, label: isIncarcerated ? 'Prison' : 'Crime', disabled: false },
    { id: 'profile', icon: Trophy, label: 'Profile', disabled: false },
  ];

  // Add prison tab if incarcerated
  if (isIncarcerated) {
    tabs.push({ id: 'prison', icon: Lock, label: 'Prison', disabled: false });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/95 to-slate-900/80 backdrop-blur-lg border-t border-white/10">
      <div className="flex justify-around items-center py-2 px-1">
        {tabs.slice(0, 5).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const isDisabled = tab.disabled;
          
          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && setActiveTab(tab.id as any)}
              disabled={isDisabled}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400'
                  : isDisabled
                  ? 'text-white/30 cursor-not-allowed'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isDisabled ? 'opacity-30' : ''}`} />
              <span className={`text-xs font-medium ${isDisabled ? 'opacity-30' : ''}`}>
                {tab.label}
              </span>
              {isDisabled && (
                <Lock className="w-3 h-3 absolute top-1 right-1 text-red-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;

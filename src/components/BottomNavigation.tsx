
import { Heart, User, Briefcase, Calendar, PiggyBank, Trophy, TrendingUp } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'timeline' | 'activities' | 'relationships' | 'assets' | 'profile' | 'achievements' | 'career';
  setActiveTab: (tab: 'timeline' | 'activities' | 'relationships' | 'assets' | 'profile' | 'achievements' | 'career') => void;
}

const BottomNavigation = ({ activeTab, setActiveTab }: BottomNavigationProps) => {
  const menuItems = [
    { id: 'timeline', icon: Calendar, label: 'Timeline' },
    { id: 'activities', icon: Briefcase, label: 'Actions' },
    { id: 'career', icon: TrendingUp, label: 'Career' },
    { id: 'relationships', icon: Heart, label: 'Relations' },
    { id: 'achievements', icon: Trophy, label: 'Achievements' },
    { id: 'assets', icon: PiggyBank, label: 'Assets' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 mica-card border-t border-white/10 px-2 py-2 shadow-2xl safe-area-bottom">
      <div className="flex justify-around items-center">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 flex-1 max-w-20 fluent-hover
              ${ activeTab === item.id
                  ? 'win11-button text-white shadow-lg scale-110 bg-blue-500/90'
                  : 'text-white/60 hover:text-white hover:bg-white/10 ios-button'
              }`}
            title={item.label}
          >
            <item.icon size={28} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;

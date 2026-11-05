import React from 'react';
import { Home, Users, BookOpen, User } from 'lucide-react';
import { NavTab } from '../types/hub';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab
}) => {
  const tabs: {
    id: NavTab;
    label: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'communities', label: 'Communities', icon: Users },
    { id: 'trainings', label: 'Trainings', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <footer className="shrink-0 z-30 bg-white border-t border-[#CBE3D6] px-2 pb-2 shadow-[0_-6px_24px_rgba(19,66,43,0.08)]">
      <nav
        aria-label="Bottom Navigation"
        className="grid grid-cols-4 items-center"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-1 pt-2.5 pb-1.5 transition-colors cursor-pointer ${
                isActive
                  ? 'text-[#0E9F6E] font-extrabold'
                  : 'text-[#64748B] hover:text-[#13422B] font-medium'
              }`}
            >
              {/* Top Active Emerald Indicator Bar (Theme 1: Emerald Trust) */}
              <span
                className={`absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-12 rounded-b-full transition-all ${
                  isActive ? 'bg-[#0E9F6E]' : 'bg-transparent'
                }`}
              />

              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? 'text-[#0E9F6E] stroke-[2.4]'
                    : 'text-[#64748B] stroke-[2]'
                }`}
              />
              <span className="text-[11.5px] leading-none">{tab.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="mt-1 pt-1.5 border-t border-[#EDF5F0] text-center">
        <p className="text-[10.5px] font-medium text-[#5C7267] leading-tight">
          Developed by{' '}
          <span className="font-bold text-[#13422B]">Food Specialist</span>
        </p>
      </div>
    </footer>
  );
};

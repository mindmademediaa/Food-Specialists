import React from 'react';
import { Home, Users, BookOpen, Wrench, User } from 'lucide-react';
import { NavTab } from '../types/hub';
import { LegalTabType } from './LegalComplianceModal';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenLegal?: (tab: LegalTabType) => void;
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
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'communities', label: 'Communities', icon: Users },
    { id: 'trainings', label: 'Trainings', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <footer className="shrink-0 z-30 bg-white border-t border-[#D2DEEA] px-1.5 py-1.5">
      <nav
        aria-label="Bottom Navigation"
        className="grid grid-cols-5 items-stretch gap-1"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`min-h-[46px] flex flex-col items-center justify-center gap-1 py-1.5 px-0.5 rounded-xl transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#F0F6FC] text-[#1673B8] font-extrabold'
                  : 'bg-transparent text-slate-600 hover:text-[#1673B8] hover:bg-slate-50 font-semibold'
              }`}
            >
              <Icon
                className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
                  isActive
                    ? 'text-[#1673B8] stroke-[2.4]'
                    : 'text-slate-500 stroke-[2]'
                }`}
              />
              <span className="text-[10px] sm:text-[11px] leading-none tracking-tight whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
};

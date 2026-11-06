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
  onSelectTab,
  onOpenLegal
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
    <footer className="shrink-0 z-30 bg-[#F7F8F7] pt-1.5 pb-2 px-1.5 border-t border-gray-200">
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
              className={`flex flex-col items-center justify-center gap-1.5 py-2.5 px-1 rounded-t-[18px] bg-white border border-b-0 border-gray-200/90 shadow-[0_-2px_8px_rgba(0,0,0,0.03)] transition-colors cursor-pointer ${
                isActive
                  ? 'text-[#0F8A3E] font-bold'
                  : 'text-[#374151] hover:text-[#0F8A3E] font-medium'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? 'text-[#0F8A3E] stroke-[2.4]'
                    : 'text-[#6B7280] stroke-[2]'
                }`}
              />
              <span className="text-[11px] leading-none">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-2 pt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center">
        <span className="text-[11px] font-normal text-[#6B7280] leading-tight">
          Developed by Food Specialist
        </span>
        {onOpenLegal && (
          <>
            <span className="text-[10px] text-gray-300">•</span>
            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="text-[10px] font-semibold text-[#0F8A3E] hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-[10px] text-gray-300">•</span>
            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="text-[10px] font-semibold text-[#0F8A3E] hover:underline cursor-pointer"
            >
              Terms
            </button>
            <span className="text-[10px] text-gray-300">•</span>
            <button
              type="button"
              onClick={() => onOpenLegal('deletion')}
              className="text-[10px] font-semibold text-[#6B7280] hover:text-red-600 hover:underline cursor-pointer"
            >
              Data Deletion
            </button>
          </>
        )}
      </div>
    </footer>
  );
};

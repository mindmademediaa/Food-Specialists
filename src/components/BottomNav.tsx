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
    <footer className="shrink-0 z-30 bg-white border-t border-[#CBE3D6] px-2 pb-1.5 shadow-[0_-6px_24px_rgba(19,66,43,0.08)]">
      <nav
        aria-label="Bottom Navigation"
        className="grid grid-cols-5 items-center"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-1 pt-2 pb-1 transition-colors cursor-pointer ${
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
              <span className="text-[11px] leading-none">{tab.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="mt-1 pt-1 border-t border-[#EDF5F0] flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center">
        <span className="text-[10px] font-medium text-[#5C7267] leading-tight">
          Developed by{' '}
          <span className="font-bold text-[#13422B]">Food Specialist</span>
        </span>
        {onOpenLegal && (
          <>
            <span className="text-[10px] text-gray-300">•</span>
            <button
              type="button"
              onClick={() => onOpenLegal('privacy')}
              className="text-[10px] font-bold text-[#0E9F6E] hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-[10px] text-gray-300">•</span>
            <button
              type="button"
              onClick={() => onOpenLegal('terms')}
              className="text-[10px] font-bold text-[#0E9F6E] hover:underline cursor-pointer"
            >
              Terms
            </button>
            <span className="text-[10px] text-gray-300">•</span>
            <button
              type="button"
              onClick={() => onOpenLegal('deletion')}
              className="text-[10px] font-bold text-[#5C7267] hover:text-red-600 hover:underline cursor-pointer"
            >
              Data Deletion
            </button>
          </>
        )}
      </div>
    </footer>
  );
};


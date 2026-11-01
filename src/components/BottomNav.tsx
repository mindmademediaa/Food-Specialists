import React from 'react';
import { Home, Users, BookOpen, User } from 'lucide-react';
import { NavTab } from '../types/hub';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'communities', label: 'Communities', icon: Users },
    { id: 'trainings', label: 'Trainings', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <footer className="sticky bottom-0 inset-x-0 z-30 bg-white border-t border-emerald-100 rounded-t-[28px] px-3 pt-2.5 pb-2 shadow-[0_-4px_20px_rgba(22,163,74,0.08)]">
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
              className={`flex flex-col items-center justify-center gap-1 py-1 rounded-xl transition-colors cursor-pointer ${
                isActive ? 'text-[#16A34A] font-bold' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive && tab.id === 'home'
                    ? 'fill-[#16A34A] text-[#16A34A]'
                    : isActive
                    ? 'text-[#16A34A] stroke-[2.3]'
                    : 'text-gray-500'
                }`}
              />
              <span className="text-[11.5px] leading-none">{tab.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="mt-1.5 pt-1.5 border-t border-emerald-50 text-center">
        <p className="text-[10.5px] font-medium text-gray-500 leading-tight">
          Developed by <span className="font-bold text-[#15803D]">Muneeb Khan</span>, Food Safety Specialist,{' '}
          <a
            href="https://wa.me/923240906384"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#16A34A] hover:underline"
          >
            +923240906384
          </a>
        </p>
      </div>
    </footer>
  );
};


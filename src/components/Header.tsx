import React from 'react';
import { Search, Bell, ArrowLeft, Shield } from 'lucide-react';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  onHomeClick: () => void;
  onSearchClick: () => void;
  onBellClick: () => void;
  onProfileClick: () => void;
  onAdminClick?: () => void;
  isAdmin?: boolean;
  userInitial?: string;
  notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  showBack = false,
  onBack,
  onHomeClick,
  onSearchClick,
  onBellClick,
  onProfileClick,
  onAdminClick,
  isAdmin = false,
  userInitial = 'A',
  notificationCount = 1
}) => {
  return (
    <header className="bg-[#16A34A] text-white rounded-[24px] px-5 py-3.5 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2.5 min-w-0">
        {showBack && onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go Back"
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
        )}
        <button
          type="button"
          onClick={onHomeClick}
          className="text-[24px] font-bold tracking-tight text-white font-display leading-none truncate"
        >
          Food Careers
        </button>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {isAdmin && onAdminClick && (
          <button
            type="button"
            onClick={onAdminClick}
            title="Open Admin Panel"
            className="px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 text-[11px] font-bold text-white flex items-center gap-1 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        )}

        <button
          type="button"
          onClick={onSearchClick}
          aria-label="Search"
          className="w-9 h-9 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors"
        >
          <Search className="w-5 h-5 text-white stroke-[2.2]" />
        </button>

        <button
          type="button"
          onClick={onBellClick}
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors"
        >
          <Bell className="w-5 h-5 text-white fill-white" />
          <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#B9E29A] text-[#0D2E1B] text-[10px] font-bold flex items-center justify-center tabular-nums">
            {notificationCount}
          </span>
        </button>

        <button
          type="button"
          onClick={onProfileClick}
          aria-label="Profile"
          className="w-10 h-10 rounded-full bg-[#EBF5ED] border-2 border-white flex items-center justify-center shadow-xs hover:scale-105 transition-transform"
        >
          <span className="w-7 h-7 rounded-full border-2 border-[#16A34A] flex items-center justify-center text-sm font-bold text-[#14532D]">
            {userInitial}
          </span>
        </button>
      </div>
    </header>
  );
};

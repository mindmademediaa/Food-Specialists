import React from 'react';
import { Search, Bell, ArrowLeft, Shield, LogOut } from 'lucide-react';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  onHomeClick: () => void;
  onSearchClick: () => void;
  onBellClick: () => void;
  onProfileClick: () => void;
  onSignOutClick?: () => void;
  userEmail?: string | null;
  onAdminClick?: () => void;
  isAdmin?: boolean;
  userInitial?: string;
  userAvatarUrl?: string;
  notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  showBack = false,
  onBack,
  onHomeClick,
  onSearchClick,
  onBellClick,
  onProfileClick,
  onSignOutClick,
  userEmail,
  onAdminClick,
  isAdmin = false,
  userInitial = 'A',
  userAvatarUrl,
  notificationCount = 1
}) => {
  return (
    <header className="bg-[#16A34A] text-white rounded-[24px] px-3 sm:px-5 py-3 flex items-center justify-between gap-2 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
        {showBack && onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go Back"
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
        )}

        {/* Small Avatar next to Food Specialists Portal */}
        <button
          type="button"
          onClick={onProfileClick}
          aria-label="My Profile"
          title="Open Profile"
          className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#EBF5ED] border-2 border-white flex items-center justify-center overflow-hidden shrink-0 shadow-xs hover:scale-105 transition-transform cursor-pointer"
        >
          {userAvatarUrl ? (
            <img
              src={userAvatarUrl}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-xs font-bold text-[#14532D]">
              {userInitial}
            </span>
          )}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#B9E29A] border-2 border-[#16A34A]" />
        </button>

        <div className="min-w-0 flex-1 pr-1">
          <button
            type="button"
            onClick={onHomeClick}
            className="text-[14.5px] sm:text-[18px] font-extrabold tracking-tight text-white font-display leading-tight truncate block w-full cursor-pointer text-left"
          >
            Food Specialists Portal
          </button>
          {userEmail && (
            <div
              title={userEmail}
              className="flex items-center gap-1 text-[10px] font-semibold text-emerald-100 truncate mt-0.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#B9E29A] shrink-0" />
              <span className="truncate">{userEmail}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {isAdmin && onAdminClick && (
          <button
            type="button"
            onClick={onAdminClick}
            title="Open Admin Panel"
            className="px-2 py-1 rounded-full bg-white/15 hover:bg-white/25 text-[11px] font-bold text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </button>
        )}

        <button
          type="button"
          onClick={onSearchClick}
          aria-label="Search"
          className="w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Search className="w-4 h-4 text-white stroke-[2.3]" />
        </button>

        <button
          type="button"
          onClick={onBellClick}
          aria-label="Notifications"
          className="relative w-8 h-8 rounded-full hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Bell className="w-4 h-4 text-white fill-white" />
          <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#B9E29A] text-[#0D2E1B] text-[9.5px] font-bold flex items-center justify-center tabular-nums">
            {notificationCount}
          </span>
        </button>

        {onSignOutClick && (
          <button
            type="button"
            onClick={onSignOutClick}
            aria-label="Sign Out"
            title="Sign Out"
            className="px-2.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white text-[11px] font-extrabold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </header>
  );
};

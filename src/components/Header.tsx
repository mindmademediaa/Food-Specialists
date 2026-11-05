import React from 'react';
import { Search, Bell, ArrowLeft, Shield, LogOut } from 'lucide-react';
import { FS_PORTAL_LOGO_DATA_URI } from '../lib/brandLogo';

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
  pendingAdminCount?: number;
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
  notificationCount = 1,
  pendingAdminCount = 0
}) => {
  return (
    <header className="bg-[#16A34A] text-white rounded-[24px] px-3 sm:px-5 py-3 flex items-center justify-between gap-2 shadow-sm">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
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

        {/* FS Portal Brand Logo before FS Portal Title — Zoomed to cover full circular logo area */}
        <button
          type="button"
          onClick={onHomeClick}
          aria-label="FS Portal Home"
          title="FS Portal"
          className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white border-2 border-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm hover:scale-105 transition-transform cursor-pointer"
        >
          <img
            src={FS_PORTAL_LOGO_DATA_URI}
            alt="FS Portal"
            className="w-full h-full object-contain scale-[1.85] transform-gpu select-none"
          />
        </button>

        <div className="min-w-0 flex-1 pr-1">
          <button
            type="button"
            onClick={onHomeClick}
            className="text-[16px] sm:text-[19px] font-extrabold tracking-tight text-white font-display leading-tight truncate block w-full cursor-pointer text-left"
          >
            FS Portal
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
            className="relative px-2.5 py-1.5 rounded-full bg-[#FEF3C7] hover:bg-[#FDE68A] text-[11px] font-extrabold text-[#92400E] border border-[#F59E0B] flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
          >
            <Shield className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Admin</span>
            {pendingAdminCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#DC2626] text-white text-[9.5px] font-extrabold tabular-nums">
                {pendingAdminCount}
              </span>
            )}
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

import React from 'react';
import {
  Search,
  Bell,
  ArrowLeft,
  Shield,
  LogOut,
  SlidersHorizontal
} from 'lucide-react';
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
  onSignOutClick,
  userEmail,
  onAdminClick,
  isAdmin = false,
  notificationCount = 1,
  pendingAdminCount = 0
}) => {
  return (
    <header className="shrink-0 z-30 bg-[#13422B] text-white px-3 sm:px-4 pt-2.5 pb-2.5 space-y-2 shadow-md">
      {/* Top Row: Brand Logo + Title on Left, Admin / Bell / Sign Out on Right */}
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {showBack && onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go Back"
              className="w-7 h-7 rounded-full bg-white/12 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-white" />
            </button>
          )}

          {/* FS Portal Brand Logo */}
          <button
            type="button"
            onClick={onHomeClick}
            aria-label="FS Portal Home"
            title="FS Portal"
            className="relative w-9 h-9 rounded-full bg-white border-2 border-[#10B981] flex items-center justify-center overflow-hidden shrink-0 shadow-sm hover:scale-105 transition-transform cursor-pointer"
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
              className="text-[15.5px] sm:text-[18px] font-extrabold tracking-tight text-white leading-tight block w-full cursor-pointer text-left"
            >
              FS Portal
            </button>
            {userEmail && (
              <div
                title={userEmail}
                className="flex items-center gap-1 text-[9.5px] sm:text-[10.5px] font-medium text-[#A7F3D0] break-all leading-tight mt-0.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
                <span className="line-clamp-1">{userEmail}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isAdmin && onAdminClick && (
            <button
              type="button"
              onClick={onAdminClick}
              title="Open Admin Panel"
              className="relative px-2 py-1 rounded-full bg-[#FEF3C7] hover:bg-[#FDE68A] text-[10px] font-extrabold text-[#92400E] border border-[#F59E0B] flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
            >
              <Shield className="w-3 h-3 text-[#D97706]" />
              <span>Admin</span>
              {pendingAdminCount > 0 && (
                <span className="px-1 py-0.2 rounded-full bg-[#DC2626] text-white text-[9px] font-extrabold tabular-nums">
                  {pendingAdminCount}
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onBellClick}
            aria-label="Notifications"
            className="relative w-8 h-8 rounded-full hover:bg-white/12 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <Bell className="w-4 h-4 text-white stroke-[2]" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F87171] ring-2 ring-[#13422B]" />
            )}
          </button>

          {onSignOutClick && (
            <button
              type="button"
              onClick={onSignOutClick}
              aria-label="Sign Out"
              title="Sign Out"
              className="px-2 py-1 rounded-full bg-white/12 hover:bg-white/20 border border-white/20 text-white text-[10px] sm:text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row inside Dark Forest Emerald Header: Integrated Search Input + Filter Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSearchClick}
          className="flex-1 h-9 sm:h-10 px-3 rounded-[12px] bg-[#D5E6DC] hover:bg-[#E1EFE7] text-[#3B5949] flex items-center gap-2 text-left transition-colors cursor-pointer shadow-inner"
        >
          <Search className="w-3.5 h-3.5 text-[#2C4C3B] stroke-[2.2] shrink-0" />
          <span className="text-[12px] sm:text-[13px] font-medium text-[#3B5949] truncate">
            Search jobs, specialists...
          </span>
        </button>

        <button
          type="button"
          onClick={onSearchClick}
          aria-label="Filter Options"
          title="Search & Filter"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-[12px] bg-[#D5E6DC] hover:bg-[#E1EFE7] text-[#13422B] flex items-center justify-center shrink-0 transition-colors cursor-pointer shadow-xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 stroke-[2.3]" />
        </button>
      </div>
    </header>
  );
};

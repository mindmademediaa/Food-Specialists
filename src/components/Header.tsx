import React from 'react';
import {
  Search,
  Bell,
  ArrowLeft,
  Shield
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
    <header className="shrink-0 z-30 bg-white">
      {/* Top Green Accent Strip */}
      <div className="h-3 w-full bg-[#2E8B57]" />

      {/* Main White Header Row: Logo + FS Portal + Email + Bell + Sign Out */}
      <div className="px-3.5 sm:px-5 py-3 border-b border-gray-200 shadow-[0_2px_6px_rgba(0,0,0,0.04)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {showBack && onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go Back"
              className="w-8 h-8 rounded-full bg-[#F1F5F2] hover:bg-[#E2ECE5] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#0E4722]" />
            </button>
          )}

          {/* Brand Logo */}
          <button
            type="button"
            onClick={onHomeClick}
            aria-label="FS Portal Home"
            title="FS Portal"
            className="relative w-9 h-9 rounded-xl bg-[#E8F5EC] border border-[#B8DEC2] flex items-center justify-center overflow-hidden shrink-0 cursor-pointer"
          >
            <img
              src={FS_PORTAL_LOGO_DATA_URI}
              alt="FS Portal"
              className="w-full h-full object-contain scale-[1.75] transform-gpu select-none"
            />
          </button>

          {/* FS Portal Title + Email inline */}
          <div className="flex items-baseline gap-2 min-w-0 flex-1">
            <button
              type="button"
              onClick={onHomeClick}
              className="text-[20px] sm:text-[23px] font-extrabold tracking-tight text-[#0D4722] leading-none shrink-0 cursor-pointer"
            >
              FS Portal
            </button>

            {userEmail && (
              <span
                title={userEmail}
                className="text-[10.5px] sm:text-[11.5px] font-medium text-[#222222] truncate"
              >
                {userEmail}
              </span>
            )}
          </div>
        </div>

        {/* Right Actions: Admin (if admin), Bell, Sign Out */}
        <div className="flex items-center gap-2 shrink-0">
          {isAdmin && onAdminClick && (
            <button
              type="button"
              onClick={onAdminClick}
              title="Open Admin Panel"
              className="relative px-2.5 py-1 rounded-full bg-[#FEF3C7] hover:bg-[#FDE68A] text-[10px] font-extrabold text-[#92400E] border border-[#F59E0B] flex items-center gap-1 transition-colors cursor-pointer"
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
            className="relative w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <Bell className="w-5 h-5 text-[#111827] stroke-[2]" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#10B981]" />
            )}
          </button>

          {onSignOutClick && (
            <button
              type="button"
              onClick={onSignOutClick}
              aria-label="Sign Out"
              title="Sign Out"
              className="px-3.5 py-1.5 rounded-full bg-[#F3F4F3] hover:bg-[#E5E7E5] border border-[#D5DBD7] text-[#111827] text-[11.5px] font-semibold transition-colors cursor-pointer shrink-0"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Rounded Search Bar Row below Header */}
      <div className="px-4 sm:px-5 pt-3.5 pb-1 bg-[#FAFBF9]">
        <button
          type="button"
          onClick={onSearchClick}
          className="w-full h-11 sm:h-12 px-4 rounded-[16px] bg-[#F2F3F2] hover:bg-[#EAECEA] border border-[#D4D8D5] shadow-[0_2px_5px_rgba(0,0,0,0.04)] flex items-center gap-3 text-left transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#111827] stroke-[2.2] shrink-0" />
          <span className="text-[14px] sm:text-[15px] font-normal text-[#6B7280] truncate">
            Search jobs specialists
          </span>
        </button>
      </div>
    </header>
  );
};

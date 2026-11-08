import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ArrowLeft,
  Shield,
  MoreVertical,
  Lock,
  Globe,
  FileText,
  Trash2,
  Power,
  LogOut
} from 'lucide-react';
import { FS_PORTAL_LOGO_DATA_URI } from '../lib/brandLogo';
import { LegalTabType } from './LegalComplianceModal';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  onHomeClick: () => void;
  onSearchClick: () => void;
  onBellClick: () => void;
  onProfileClick: () => void;
  onSignOutClick?: () => void;
  onOpenLegal?: (tab: LegalTabType) => void;
  userEmail?: string | null;
  onAdminClick?: () => void;
  isAdmin?: boolean;
  userInitial?: string;
  userAvatarUrl?: string;
  notificationCount?: number;
  pendingAdminCount?: number;
  hideSearchBar?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  showBack = false,
  onBack,
  onHomeClick,
  onSearchClick,
  onBellClick,
  onSignOutClick,
  onOpenLegal,
  onAdminClick,
  isAdmin = false,
  pendingAdminCount = 0,
  hideSearchBar = false
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="shrink-0 z-30 bg-white border-b border-[#D2DEEA]">
      {/* Main Header Row: Logo + FS Portal (No Email, No Green Top Bar/Dot) + Bell + 3-Dots Policy Menu */}
      <div className="px-3.5 sm:px-4 py-2.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {showBack && onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go Back"
              className="w-8 h-8 rounded-full bg-[#F0F6FC] hover:bg-[#E1EEF9] border border-[#D2DEEA] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#1A2138]" />
            </button>
          )}

          {/* Brand Logo */}
          <button
            type="button"
            onClick={onHomeClick}
            aria-label="FS Portal Home"
            title="FS Portal"
            className="relative w-8 h-8 rounded-xl bg-[#F0F6FC] border border-[#1673B8]/30 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer"
          >
            <img
              src={FS_PORTAL_LOGO_DATA_URI}
              alt="FS Portal"
              className="w-full h-full object-contain scale-[1.7] transform-gpu select-none"
            />
          </button>

          {/* FS Portal Brand Title (Certificate Style — Email Removed) */}
          <button
            type="button"
            onClick={onHomeClick}
            className="text-[18px] sm:text-[20px] font-black tracking-tight leading-none flex items-baseline shrink-0 cursor-pointer"
          >
            <span className="text-[#1A2138]">FS Port</span>
            <span className="text-[#1673B8] border-b-[2.5px] border-[#1673B8] pb-0.5 leading-none">
              al
            </span>
          </button>
        </div>

        {/* Right Actions: Admin (if admin), Bell (No Green Light Dot), 3-Dots Menu */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isAdmin && onAdminClick && (
            <button
              type="button"
              onClick={onAdminClick}
              title="Open Admin Panel"
              className="relative px-2.5 py-1 rounded-lg bg-[#F0F6FC] hover:bg-[#E1EEF9] text-[10.5px] font-extrabold text-[#1673B8] border border-[#1673B8]/40 flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Shield className="w-3 h-3 text-[#1673B8]" />
              <span>Admin</span>
              {pendingAdminCount > 0 && (
                <span className="px-1 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-extrabold tabular-nums">
                  {pendingAdminCount}
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onBellClick}
            aria-label="Notifications"
            className="w-8 h-8 rounded-full hover:bg-[#F0F6FC] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <Bell className="w-4 h-4 text-[#1A2138] stroke-[2]" />
          </button>

          {/* 3-Dots Google Play Store Policy & App Closure Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Policies, Legal & App Closure Menu"
              title="Policies & App Options"
              className="w-8 h-8 rounded-full bg-[#F0F6FC] hover:bg-[#E1EEF9] border border-[#D2DEEA] text-[#1A2138] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <MoreVertical className="w-4 h-4 stroke-[2.2]" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-[#D2DEEA] shadow-xl py-1.5 z-50 text-left">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#1673B8]">
                    Google Play &amp; App Policies
                  </p>
                  <p className="text-[11px] font-semibold text-slate-600">
                    Official Compliance &amp; Session Controls
                  </p>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenLegal?.('privacy');
                    }}
                    className="w-full px-3.5 py-2 text-xs font-bold text-[#1A2138] hover:bg-[#F0F6FC] flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5 text-[#1673B8] shrink-0" />
                    <span>Privacy Policy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenLegal?.('ads');
                    }}
                    className="w-full px-3.5 py-2 text-xs font-bold text-[#1A2138] hover:bg-[#F0F6FC] flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-[#1673B8] shrink-0" />
                    <span>AdMob &amp; Ads Policy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenLegal?.('terms');
                    }}
                    className="w-full px-3.5 py-2 text-xs font-bold text-[#1A2138] hover:bg-[#F0F6FC] flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#1673B8] shrink-0" />
                    <span>Terms &amp; Conditions Policy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenLegal?.('deletion');
                    }}
                    className="w-full px-3.5 py-2 text-xs font-bold text-red-700 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Data &amp; Account Deletion Policy</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenLegal?.('closure');
                    }}
                    className="w-full px-3.5 py-2 text-xs font-bold text-[#1A2138] hover:bg-[#F0F6FC] flex items-center gap-2.5 cursor-pointer transition-colors"
                  >
                    <Power className="w-3.5 h-3.5 text-[#1673B8] shrink-0" />
                    <span>App Closure Policy</span>
                  </button>
                </div>

                {onSignOutClick && (
                  <div className="border-t border-slate-100 pt-1 mt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onSignOutClick();
                      }}
                      className="w-full px-3.5 py-2 text-xs font-extrabold text-[#1A2138] hover:bg-slate-100 flex items-center gap-2.5 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                      <span>Sign Out / Close Session</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compact Responsive Search Bar Row (Hidden when hideSearchBar is true, e.g. in Communities) */}
      {!hideSearchBar && (
        <div className="px-3.5 sm:px-4 py-2 bg-[#F8FAFC]">
          <button
            type="button"
            onClick={onSearchClick}
            className="w-full h-9 sm:h-10 px-3.5 rounded-xl bg-white hover:bg-[#F0F6FC] border border-[#D2DEEA] shadow-2xs flex items-center gap-2.5 text-left transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4 text-[#1673B8] stroke-[2.2] shrink-0" />
            <span className="text-[12.5px] sm:text-[13px] font-medium text-slate-500 truncate">
              Search jobs, scholarships, trainings &amp; specialists...
            </span>
          </button>
        </div>
      )}
    </header>
  );
};

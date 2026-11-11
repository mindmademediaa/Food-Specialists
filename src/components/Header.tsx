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
  LogOut,
  Briefcase,
  MapPin,
  CheckCheck,
  ChevronRight,
  Home,
  GraduationCap,
  Wrench,
  Users,
  BookOpen,
  User,
  Smartphone,
  Download
} from 'lucide-react';
import { FS_PORTAL_LOGO_DATA_URI } from '../lib/brandLogo';
import { LegalTabType } from './LegalComplianceModal';
import { HubJob } from '../types/hub';

export type WebsiteNavSection =
  | 'home'
  | 'jobs'
  | 'scholarships'
  | 'tools'
  | 'communities'
  | 'trainings'
  | 'profile';

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
  jobNotifications?: HubJob[];
  readJobIds?: string[];
  onSelectJobNotification?: (jobId: string) => void;
  onMarkAllNotificationsRead?: () => void;
  activeWebsiteNav?: WebsiteNavSection;
  onNavigateWebsiteSection?: (section: WebsiteNavSection) => void;
  isStandaloneApp?: boolean;
  onInstallAppClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  showBack = false,
  onBack,
  onHomeClick,
  onSearchClick,
  onBellClick,
  onProfileClick,
  onSignOutClick,
  onOpenLegal,
  onAdminClick,
  isAdmin = false,
  userInitial = 'U',
  userAvatarUrl,
  pendingAdminCount = 0,
  hideSearchBar = false,
  jobNotifications = [],
  readJobIds = [],
  onSelectJobNotification,
  onMarkAllNotificationsRead,
  activeWebsiteNav = 'home',
  onNavigateWebsiteSection,
  isStandaloneApp = false,
  onInstallAppClick
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);

  const unreadJobs = jobNotifications.filter((j) => !readJobIds.includes(j.id));
  const unreadCount = unreadJobs.length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (menuOpen || notifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen, notifOpen]);

  const desktopNavItems: {
    id: WebsiteNavSection;
    label: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'scholarships', label: 'Scholarships', icon: GraduationCap },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'communities', label: 'Communities', icon: Users },
    { id: 'trainings', label: 'Trainings', icon: BookOpen },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <header className="shrink-0 z-30 bg-white border-b border-[#D2DEEA] shadow-2xs">
      {/* Main Header Container — Full-Width Edge-to-Edge with Centered 1440px Website Alignment */}
      <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-10 py-2.5 md:py-3 flex items-center justify-between gap-3 lg:gap-4">
        {/* Left: Back Button + Brand Emblem + Brand Name (shrink-0 & whitespace-nowrap so it NEVER overlaps) */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          {showBack && onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Go Back"
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#F0F6FC] hover:bg-[#E1EEF9] border border-[#D2DEEA] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#1A2138]" />
            </button>
          )}

          {/* Brand Logo + Food Science Portal Title */}
          <button
            type="button"
            onClick={onHomeClick}
            aria-label="Food Science Portal Home"
            title="Food Science Portal"
            className="flex items-center gap-2.5 sm:gap-3 shrink-0 cursor-pointer text-left group"
          >
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-white border border-[#1673B8]/35 p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs group-hover:border-[#1673B8] transition-colors">
              <img
                src={FS_PORTAL_LOGO_DATA_URI}
                alt="Food Science Portal"
                className="w-full h-full object-contain select-none"
              />
            </div>

            <div className="flex items-center gap-1.5 whitespace-nowrap shrink-0 leading-none">
              <span className="text-[16px] sm:text-[18.5px] md:text-[20px] font-black tracking-tight text-[#0C182D]">
                Food Science
              </span>
              <span className="text-[16px] sm:text-[18.5px] md:text-[20px] font-black tracking-tight text-[#1673B8] underline decoration-[#1673B8] decoration-2 underline-offset-4">
                Portal
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Horizontal Website Navigation (Visible inline on xl+ screens; md–lg uses full-width row below so logo & title never overlap) */}
        {onNavigateWebsiteSection && (
          <nav
            aria-label="Website Main Navigation"
            className="hidden xl:flex items-center gap-1 bg-[#F4F8FD] border border-[#D2DEEA] rounded-2xl p-1 shrink-0"
          >
            {desktopNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeWebsiteNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigateWebsiteSection(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1673B8] text-white shadow-2xs'
                      : 'text-[#1A2138] hover:bg-[#EBF4FC] hover:text-[#1673B8]'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive
                        ? 'text-white stroke-[2.3]'
                        : 'text-[#1673B8] stroke-[2]'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Actions: Desktop Quick Search Pill, Install App Button, Admin, Bell, User Avatar, 3-Dots Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Desktop Inline Quick Search Button */}
          <button
            type="button"
            onClick={onSearchClick}
            title="Search Portal (Jobs, Scholarships, Tools, Trainings & Specialists)"
            className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F4F8FD] hover:bg-[#EBF4FC] border border-[#D2DEEA] text-slate-600 hover:text-[#1673B8] text-xs font-bold transition-colors cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Search className="w-3.5 h-3.5 text-[#1673B8] stroke-[2.3] shrink-0" />
            <span className="hidden 2xl:inline">Search jobs, grants, tools...</span>
            <span className="2xl:hidden">Search</span>
          </button>

          {/* Install Mobile App Button (Shown on Website when not already running as installed standalone app) */}
          {!isStandaloneApp && onInstallAppClick && (
            <button
              type="button"
              onClick={onInstallAppClick}
              title="Download & Install Food Science Portal Mobile App"
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#1A2138] to-[#1673B8] hover:from-[#105E9A] hover:to-[#1673B8] text-white text-[10.5px] sm:text-xs font-extrabold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-sky-200 shrink-0" />
              <span className="hidden sm:inline">Install App</span>
              <span className="inline sm:hidden">App</span>
            </button>
          )}

          {isAdmin && onAdminClick && (
            <button
              type="button"
              onClick={onAdminClick}
              title="Open Admin Panel"
              className="relative px-2.5 py-1.5 rounded-xl bg-[#F0F6FC] hover:bg-[#E1EEF9] text-[10.5px] sm:text-xs font-extrabold text-[#1673B8] border border-[#1673B8]/40 flex items-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Shield className="w-3.5 h-3.5 text-[#1673B8]" />
              <span>Admin</span>
              {pendingAdminCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-extrabold tabular-nums">
                  {pendingAdminCount}
                </span>
              )}
            </button>
          )}

          {/* Bell Job Notifications Menu */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setNotifOpen((prev) => !prev);
              }}
              aria-label="Job Notifications"
              title="New Job Notifications"
              className={`relative w-8 h-8 md:w-9 md:h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                notifOpen
                  ? 'bg-[#EBF4FC] border-[#1673B8] text-[#1673B8]'
                  : 'bg-[#F0F6FC] hover:bg-[#E1EEF9] border-[#D2DEEA] text-[#1A2138]'
              }`}
            >
              <Bell className="w-4 h-4 stroke-[2.2]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#1673B8] text-white text-[9.5px] font-extrabold flex items-center justify-center border-2 border-white shadow-2xs tabular-nums">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-[310px] sm:w-[350px] rounded-2xl bg-white border border-[#D2DEEA] shadow-[0_18px_45px_rgba(26,33,56,0.18)] overflow-hidden z-50 text-left">
                {/* Dropdown Header */}
                <div className="px-3.5 py-2.5 bg-gradient-to-r from-[#1A2138] to-[#1673B8] text-white flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Bell className="w-4 h-4 text-sky-200 shrink-0" />
                    <div>
                      <p className="text-xs font-extrabold leading-tight">
                        Job Notifications
                      </p>
                      <p className="text-[10px] text-sky-100 font-medium">
                        {unreadCount > 0
                          ? `${unreadCount} new job alert${unreadCount === 1 ? '' : 's'} posted`
                          : 'All job alerts read'}
                      </p>
                    </div>
                  </div>
                  {unreadCount > 0 && onMarkAllNotificationsRead && (
                    <button
                      type="button"
                      onClick={() => onMarkAllNotificationsRead()}
                      className="px-2 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white text-[10px] font-extrabold inline-flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    >
                      <CheckCheck className="w-3 h-3" />
                      <span>Mark read</span>
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {jobNotifications.length === 0 ? (
                    <div className="p-6 text-center space-y-1.5">
                      <Briefcase className="w-6 h-6 text-[#1673B8] mx-auto opacity-60" />
                      <p className="text-xs font-bold text-[#1A2138]">
                        No job notifications yet
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Whenever a new job is posted, you will receive an instant notification here.
                      </p>
                    </div>
                  ) : (
                    jobNotifications.slice(0, 10).map((job) => {
                      const isUnread = !readJobIds.includes(job.id);
                      return (
                        <button
                          key={job.id}
                          type="button"
                          onClick={() => {
                            setNotifOpen(false);
                            if (onSelectJobNotification) {
                              onSelectJobNotification(job.id);
                            } else {
                              onBellClick();
                            }
                          }}
                          className={`w-full px-3.5 py-2.5 text-left transition-colors flex items-start gap-2.5 cursor-pointer ${
                            isUnread
                              ? 'bg-[#F0F6FC]/90 hover:bg-[#E4F0FB]'
                              : 'bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                              isUnread
                                ? 'bg-[#1673B8] text-white'
                                : 'bg-[#F0F6FC] text-[#1673B8]'
                            }`}
                          >
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1.5">
                              <span
                                className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                                  isUnread
                                    ? 'bg-[#1673B8] text-white'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {isUnread ? 'New Job Posted' : job.category || 'Job'}
                              </span>
                              <span className="text-[10px] font-semibold text-slate-400 truncate">
                                {job.postedAt || 'Recently'}
                              </span>
                            </div>
                            <p className="text-xs font-extrabold text-[#1A2138] truncate mt-1">
                              {job.title}
                            </p>
                            <p className="text-[11px] font-semibold text-slate-600 truncate">
                              {job.company}
                            </p>
                            <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500 mt-0.5">
                              <MapPin className="w-3 h-3 text-[#1673B8] shrink-0" />
                              <span className="truncate">{job.location}</span>
                            </div>
                          </div>
                          {isUnread && (
                            <span className="w-2 h-2 rounded-full bg-[#1673B8] shrink-0 mt-2" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Dropdown Footer */}
                <div className="p-2 bg-[#F8FAFC] border-t border-[#D2DEEA]">
                  <button
                    type="button"
                    onClick={() => {
                      setNotifOpen(false);
                      onBellClick();
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-[#EBF4FC] hover:bg-[#D2DEEA] text-[#1673B8] text-xs font-extrabold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View All Posted Jobs</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop User Profile Avatar Button */}
          <button
            type="button"
            onClick={onProfileClick}
            title="My Profile & CV"
            className="hidden md:flex w-9 h-9 rounded-full bg-[#EBF4FC] hover:bg-[#D2DEEA] border border-[#1673B8]/40 text-[#1673B8] font-extrabold text-xs items-center justify-center overflow-hidden transition-colors cursor-pointer shrink-0"
          >
            {userAvatarUrl ? (
              <img
                src={userAvatarUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{userInitial}</span>
            )}
          </button>

          {/* 3-Dots Google Play Store Policy & App Closure Menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => {
                setNotifOpen(false);
                setMenuOpen((prev) => !prev);
              }}
              aria-label="Policies, Legal & App Closure Menu"
              title="Policies & App Options"
              className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[#F0F6FC] hover:bg-[#E1EEF9] border border-[#D2DEEA] text-[#1A2138] flex items-center justify-center transition-colors cursor-pointer shrink-0"
            >
              <MoreVertical className="w-4 h-4 stroke-[2.2]" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#D2DEEA] shadow-xl py-1.5 z-50 text-left">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#1673B8]">
                    Google Play &amp; Portal Options
                  </p>
                  <p className="text-[11px] font-semibold text-slate-600">
                    Official Compliance, App Install &amp; Session
                  </p>
                </div>

                <div className="py-1">
                  {onInstallAppClick && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onInstallAppClick();
                      }}
                      className="w-full px-3.5 py-2 text-xs font-extrabold text-[#1673B8] bg-[#F0F6FC]/70 hover:bg-[#E1EEF9] flex items-center gap-2.5 cursor-pointer transition-colors"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-[#1673B8] shrink-0" />
                      <span>Download / Install Mobile App</span>
                    </button>
                  )}

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

      {/* Medium Tablet & Laptop Navigation Bar (Visible on md–lg screens where xl top bar is compact) */}
      {onNavigateWebsiteSection && (
        <div className="hidden md:flex xl:hidden items-center justify-center gap-1.5 px-6 py-2 bg-[#F4F8FD] border-t border-[#D2DEEA] overflow-x-auto">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeWebsiteNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigateWebsiteSection(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1673B8] text-white shadow-2xs'
                    : 'text-[#1A2138] hover:bg-[#EBF4FC] hover:text-[#1673B8]'
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isActive
                      ? 'text-white stroke-[2.3]'
                      : 'text-[#1673B8] stroke-[2]'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Mobile Compact Search Bar Row (Visible on mobile < 768px when hideSearchBar is false) */}
      {!hideSearchBar && (
        <div className="md:hidden px-3.5 sm:px-4 py-2 bg-[#F8FAFC] border-t border-[#E6EEF6]">
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

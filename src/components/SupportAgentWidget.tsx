import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CheckCircle2,
  Headset,
  Loader2,
  MessageSquare,
  Send,
  ShieldAlert,
  Star,
  UserCheck,
  X
} from 'lucide-react';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { stripUndefinedDeep } from '../lib/firestoreUtils';
import {
  HubUser,
  PaymentGatewayConfig,
  SupportRequestType,
  SupportTicketItem,
  SupportTranscriptMessage
} from '../types/hub';
import {
  getLocalizedCertificateFee,
  getLocalizedMembershipPricing,
  useGeoCurrency
} from '../lib/geoCurrency';

interface SupportAgentWidgetProps {
  user: HubUser;
  isSignedIn: boolean;
  isUserPaid: boolean;
  routeName: string;
  activeToolSection: string;
  myTickets: SupportTicketItem[];
  paymentGateway?: Partial<PaymentGatewayConfig>;
  onOpenAuthModal?: () => void;
}

type WidgetTab = 'chat' | 'submit' | 'history';

const GUEST_SUPPORT_UID_KEY = 'fsp_guest_support_uid_v1';

function getOrCreateGuestSupportUid(): string {
  if (typeof window === 'undefined') return 'guest_visitor';
  try {
    const existing = window.localStorage.getItem(GUEST_SUPPORT_UID_KEY);
    if (existing && /^guest_[a-zA-Z0-9_-]+$/.test(existing)) {
      return existing;
    }
    const created = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    window.localStorage.setItem(GUEST_SUPPORT_UID_KEY, created);
    return created;
  } catch {
    return `guest_${Date.now()}`;
  }
}

const CONTEXT_LABELS: Record<string, string> = {
  home: 'Home Feed & Overview',
  jobs: 'Jobs & Internships Board',
  'job-detail': 'Job Details Page',
  scholarships: 'Scholarships & Fellowships',
  'scholarship-detail': 'Scholarship Details Page',
  trainings: 'Trainings & Official Certificates',
  'training-detail': 'Course Modules & Assessment',
  'trainings-highfield': 'Highfield Trainings Hub',
  'trainings-lead-auditor-hub': 'Lead Auditor Courses Hub',
  communities: 'Member Directory & Communities',
  'community-member': 'Member Public Profile',
  tools: 'Tools Hub',
  profile: 'My Profile & Account Settings',
  search: 'Global Search'
};

const TOOL_LABELS: Record<string, string> = {
  hub: 'All Tools Grid',
  nutrition: 'Nutrition & Dietetics Suite',
  exam: 'Food Science Exam Prep',
  'lab-formula': 'Lab & Formula Calculator',
  'pearson-square': 'Pearson Square Batch Tool',
  'molarity-normality': 'Molarity & Normality Calculator',
  'moisture-ash': 'Moisture, Ash & Yield %',
  'production-floor': 'Production Floor & OEE',
  'e-numbers': 'E-Numbers Instant Finder',
  'job-cover-letter': 'Job Cover Letter Generator',
  'citation-generator': 'Citation & Reference Generator',
  'nutrition-label': 'Nutrition Facts Label Generator',
  'thermal-aw': 'Thermal (F0 / PU) & aw Calculator',
  'templates-vault': 'QA/QC, ISO 9001, FSSC 22000 & HACCP Vault',
  'authority-limits': 'Food Authority Limits Lookup',
  'complaint-handling': 'Complaint Handling & QR CAPA'
};

export const SupportAgentWidget: React.FC<SupportAgentWidgetProps> = ({
  user,
  isSignedIn,
  isUserPaid,
  routeName,
  activeToolSection,
  myTickets,
  paymentGateway,
  onOpenAuthModal
}) => {
  const geo = useGeoCurrency();
  const localizedPlan = useMemo(
    () => getLocalizedMembershipPricing(paymentGateway, geo),
    [paymentGateway, geo]
  );
  const standardCertFee = useMemo(
    () => getLocalizedCertificateFee(1000, paymentGateway, geo),
    [paymentGateway, geo]
  );
  const dietaryCertFee = useMemo(
    () => getLocalizedCertificateFee(8000, paymentGateway, geo),
    [paymentGateway, geo]
  );

  const staticHelpTopics = useMemo<Array<{ title: string; answer: string }>>(
    () => [
      {
        title: 'QA/QC Document Vault (ISO 9001 / FSSC / HACCP)',
        answer:
          'Open Tools -> QA/QC, ISO 9001 & FSSC Document Vault. First fill Module "00. Company Setup" with your Company Name, Logo, Address & License #, click Save Workspace, then edit SOPs, ASP, Pest Management, HACCP Team, Flow Diagram, Hazard Analysis, CCP Tree, Critical Limits, Checklists, CAPA, Verification & Risk Assessment. Paid members can export Controlled PDF & CSV files.'
      },
      {
        title: 'Complaint Handling & QR Code CAPA',
        answer:
          'Open Tools -> Complaint Handling & QR CAPA -> Enter Organization Name, Logo & Sector -> Click Save & Generate QR Code. Share the QR code with customers; every scanned complaint is saved privately only in your directory. Up to 10 complaints are free; Paid Membership unlocks unlimited complaints & digitally signed CAPA PDF downloads.'
      },
      {
        title: 'Official Certificates & LinkedIn Share',
        answer: geo.isPakistan
          ? `Complete any course study & pass its assessment (>=60%), submit the certificate fee (${standardCertFee.formatted} for standard courses; ${dietaryCertFee.formatted} for Food Manager & Dietary Officer) with Transaction ID + slip, and once verified by Admin, open Trainings -> My Certificates to download your Portrait A4 QR-verified PDF or share it via Add to LinkedIn / Share Post.`
          : `Complete any course study & pass its assessment (>=60%), submit the certificate fee (${standardCertFee.formattedWithUsdHint}) with Transaction ID + slip, and once verified by Admin, open Trainings -> My Certificates to download your Portrait A4 QR-verified PDF or share it via Add to LinkedIn / Share Post.`
      },
      {
        title: 'Upgrade to Paid Membership',
        answer: `Your localized Paid Membership plan (${geo.countryName}): ${localizedPlan.monthlyWithUsdHint} / Month or ${localizedPlan.yearlyWithUsdHint} / Year (${localizedPlan.discountPct}% OFF). Click any Upgrade/Unlock button, choose JazzCash / EasyPaisa / Bank Transfer, enter Transaction ID + upload receipt screenshot. Admin verifies slips in the Admin Control Panel.`
      },
      {
        title: 'Install App on Android or iPhone',
        answer:
          'On Android, open foodscienceportal.com in Chrome (tap "Open in Chrome" if coming from WhatsApp) and tap Install App. On iPhone/iPad, open foodscienceportal.com in Safari -> tap Share -> Add to Home Screen.'
      }
    ],
    [geo.isPakistan, geo.countryName, localizedPlan, standardCertFee, dietaryCertFee]
  );

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<WidgetTab>('chat');

  const currentPageContext = useMemo(() => {
    const rLabel = CONTEXT_LABELS[routeName] || routeName;
    if (routeName === 'tools' && activeToolSection && activeToolSection !== 'hub') {
      return `${rLabel} · ${TOOL_LABELS[activeToolSection] || activeToolSection}`;
    }
    return rLabel;
  }, [routeName, activeToolSection]);

  // AI Chat state
  const [messages, setMessages] = useState<SupportTranscriptMessage[]>(() => [
    {
      role: 'assistant',
      text: 'Assalam-o-Alaikum! Main Food Science Portal ka Support and Help Assistant hoon. Kisi bhi page, calculator, ISO/HACCP document vault, certificate, ya complaint tool mein koi masla ho to poochein — ya apni personal Custom Opinion / Issue seedha Admin Control Panel mein bhejein.',
      at: new Date().toISOString()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [staticFallbackAvailable, setStaticFallbackAvailable] = useState(false);
  const [expandedStaticTopic, setExpandedStaticTopic] = useState<string | null>(null);

  // Submit Custom Opinion / Highlight Issue Form state
  const [requestType, setRequestType] = useState<SupportRequestType>('custom_opinion');
  const [guestName, setGuestName] = useState(user?.name && user.name !== 'Guest Visitor' ? user.name : '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.whatsappNumber || user?.phone || '');
  const [subject, setSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [attachTranscript, setAttachTranscript] = useState<boolean>(true);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketFeedback, setTicketFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Follow-up input per existing ticket
  const [followUpDrafts, setFollowUpDrafts] = useState<Record<string, string>>({});
  const [savingFollowUpId, setSavingFollowUpId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      if (user?.name && !guestName) setGuestName(user.name);
      if (user?.email && !guestEmail) setGuestEmail(user.email);
      if ((user?.whatsappNumber || user?.phone) && !guestPhone) {
        setGuestPhone(user.whatsappNumber || user.phone || '');
      }
    }
  }, [isSignedIn, user?.name, user?.email, user?.whatsappNumber, user?.phone]);

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  const adminReplyCount = useMemo(
    () => myTickets.filter((t) => Boolean(t.adminReply && t.status !== 'resolved')).length,
    [myTickets]
  );

  const contextPrompts = useMemo(() => {
    if (routeName === 'tools' && activeToolSection === 'templates-vault') {
      return [
        'ISO 9001 / HACCP Document Vault mein company logo aur PDF kaise banaye?',
        'Process Flow Diagram aur CCP Decision Tree kaise use karein?',
        'Apni personal Custom Opinion Admin ko bhejni hai'
      ];
    }
    if (routeName === 'tools' && activeToolSection === 'complaint-handling') {
      return [
        'QR Complaint portal kaise setup aur share karoon?',
        '10 complaints limit aur Paid CAPA PDF ke baare mein batayein',
        'Mujhe complaint tool mein issue aa raha hai'
      ];
    }
    if (routeName === 'trainings') {
      return [
        'Training certificate PDF aur LinkedIn post kaise share hota hai?',
        'Payment verification kitne time mein hoti hai?'
      ];
    }
    return [
      'Is page ya tool ko kaise use karna hai?',
      'Paid membership aur payment slip approve kaise hoti hai?',
      'Android ya iPhone par app install kaise karoon?'
    ];
  }, [routeName, activeToolSection]);

  const handleSendChatMessage = async (overrideText?: string) => {
    const cleanText = (overrideText ?? chatInput).trim();
    if (!cleanText || isSendingChat) return;

    const userMsg: SupportTranscriptMessage = {
      role: 'user',
      text: cleanText,
      at: new Date().toISOString()
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    if (!overrideText) setChatInput('');
    setChatError(null);
    setIsSendingChat(true);

    try {
      const response = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleanText,
          history: nextHistory.slice(-12).map((m) => ({ role: m.role, text: m.text })),
          currentContext: {
            routeName,
            activeTool: activeToolSection,
            userRole: isSignedIn ? (isUserPaid ? 'Paid Member' : 'Free Member') : 'Guest',
            userName: user?.name || 'Visitor',
            pricing: {
              region: geo.isPakistan ? 'Pakistan' : 'International',
              countryName: geo.countryName,
              currencyCode: geo.currencyCode,
              monthlyFee: localizedPlan.monthlyWithUsdHint,
              yearlyFee: localizedPlan.yearlyWithUsdHint,
              yearlyDiscountPct: localizedPlan.discountPct,
              standardCertificateFee: standardCertFee.formattedWithUsdHint,
              specialCertificateFee: geo.isPakistan
                ? dietaryCertFee.formattedWithUsdHint
                : standardCertFee.formattedWithUsdHint
            }
          }
        })
      });

      if (response.status === 404 || response.status === 405) {
        setStaticFallbackAvailable(true);
        setChatError(
          'Live AI server route is unavailable on static hosting. You can read the Built-in Help Guides below or send your Custom Opinion / Issue directly to the Admin Control Panel.'
        );
        return;
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        setStaticFallbackAvailable(true);
        setChatError(
          'Live AI chat endpoint is not active on this host. Use the Opinion & Issue tab to send your feedback straight to the Admin Control Panel.'
        );
        return;
      }

      const data = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok || !data.reply) {
        setChatError(data.error || `Support service error (HTTP ${response.status}).`);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply as string,
          at: new Date().toISOString()
        }
      ]);
    } catch {
      setStaticFallbackAvailable(true);
      setChatError(
        'Could not reach the AI Support endpoint. You can still submit your Custom Opinion or Highlight Issue directly via the Opinion & Issue tab.'
      );
    } finally {
      setIsSendingChat(false);
    }
  };

  const openEscalationTab = (mode: SupportRequestType) => {
    setRequestType(mode === 'admin_chat' ? 'issue_report' : mode);
    setTicketFeedback(null);
    if (mode === 'custom_opinion' && !subject.trim()) {
      setSubject('Personal Opinion & Suggestion for Food Science Portal');
    } else if (mode !== 'custom_opinion' && !subject.trim()) {
      setSubject(`Issue on ${currentPageContext}`);
    }
    setActiveTab('submit');
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = (isSignedIn ? user.name : guestName).trim() || 'Website Visitor';
    const cleanSubject = subject.trim();
    const cleanMessage = formMessage.trim();

    if (!cleanSubject || !cleanMessage) {
      setTicketFeedback({
        type: 'error',
        text: 'Please enter both a short Subject and your detailed Message or Opinion.'
      });
      return;
    }

    setIsSubmittingTicket(true);
    setTicketFeedback(null);

    const nowIso = new Date().toISOString();
    const ticketId = `sup-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const targetUid = isSignedIn ? user.uid : getOrCreateGuestSupportUid();
    const cleanEmail = (isSignedIn ? user.email : guestEmail).trim().slice(0, 200);
    const cleanPhone = (
      isSignedIn ? user.whatsappNumber || user.phone || guestPhone : guestPhone
    )
      .trim()
      .slice(0, 60);

    const trimmedTranscript = attachTranscript
      ? messages.slice(-15).map((m) => ({
          role: m.role,
          text: m.text.slice(0, 600),
          at: m.at
        }))
      : [];

    const payload: SupportTicketItem = {
      id: ticketId,
      uid: targetUid,
      isGuest: !isSignedIn,
      userName: cleanName.slice(0, 120),
      userEmail: cleanEmail,
      userPhone: cleanPhone,
      userPlan: isSignedIn ? (isUserPaid ? 'paid' : 'free') : 'guest',
      requestType,
      pageContext: currentPageContext.slice(0, 160),
      subject: cleanSubject.slice(0, 200),
      message: cleanMessage.slice(0, 3000),
      ...(requestType === 'custom_opinion' ? { rating } : {}),
      ...(trimmedTranscript.length > 0 ? { chatTranscript: trimmedTranscript } : {}),
      status: 'open',
      createdAt: nowIso,
      updatedAt: nowIso
    };

    try {
      await setDoc(doc(db, 'supportTickets', ticketId), stripUndefinedDeep(payload));
      setSubject('');
      setFormMessage('');
      setTicketFeedback({
        type: 'success',
        text:
          requestType === 'custom_opinion'
            ? 'Shukriya! Aapki personal custom opinion seedha Admin Control Panel mein Admin ke paas bhej di gayi hai.'
            : 'Aapka issue highlight Admin Control Panel mein submit ho gaya hai. Admin jald review karega.'
      });
      if (isSignedIn) {
        setTimeout(() => setActiveTab('history'), 1300);
      }
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.CREATE, `supportTickets/${ticketId}`);
      } catch {
        setTicketFeedback({
          type: 'error',
          text: 'Could not save your request right now. Please check your connection and try again.'
        });
      }
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  const handleSendFollowUp = async (ticket: SupportTicketItem) => {
    const text = (followUpDrafts[ticket.id] || '').trim();
    if (!text || !isSignedIn) return;
    setSavingFollowUpId(ticket.id);
    try {
      await updateDoc(doc(db, 'supportTickets', ticket.id), {
        userFollowUp: text.slice(0, 2000),
        updatedAt: new Date().toISOString()
      });
      setFollowUpDrafts((prev) => ({ ...prev, [ticket.id]: '' }));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `supportTickets/${ticket.id}`);
    } finally {
      setSavingFollowUpId(null);
    }
  };

  return (
    <>
      {/* FLOATING SUPPORT AND HELP LAUNCHER BUTTON */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Support and Help"
          className="fixed bottom-[76px] md:bottom-5 right-4 z-40 px-4 py-2.5 rounded-2xl bg-[#0F172A] hover:bg-[#1673B8] text-white shadow-lg border border-white/15 flex items-center gap-2 text-xs font-semibold cursor-pointer transition-colors"
        >
          <Headset className="w-4 h-4 text-sky-300 shrink-0" />
          <span className="whitespace-nowrap">Support and Help</span>
          {adminReplyCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-mono font-bold tabular-nums">
              {adminReplyCount}
            </span>
          )}
        </button>
      )}

      {/* FLOATING SUPPORT AND HELP PANEL */}
      {isOpen && (
        <section
          aria-label="Food Science Portal Support and Help"
          className="fixed bottom-[72px] md:bottom-5 right-3 sm:right-5 z-50 w-[min(430px,calc(100vw-24px))] h-[min(630px,80dvh)] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* PANEL HEADER */}
          <div className="bg-[#0F172A] text-white px-4 py-3 flex items-center justify-between gap-2 shrink-0">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Headset className="w-4 h-4 text-sky-300 shrink-0" />
                <h2 className="text-sm font-bold tracking-tight truncate">
                  Support and Help
                </h2>
              </div>
              <p className="text-[11px] text-slate-300 truncate mt-0.5">
                {currentPageContext}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close Support and Help"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 3-TAB SEGMENTED CONTROL */}
          <div className="p-2 bg-slate-50 border-b border-slate-200 shrink-0">
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/70 rounded-xl text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`py-1.5 px-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'chat'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                AI Assistant
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('submit')}
                className={`py-1.5 px-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'submit'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Opinion &amp; Issue
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`py-1.5 px-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'history'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Requests ({isSignedIn ? myTickets.length : 0})
              </button>
            </div>
          </div>

          {/* TAB 1: AI SUPPORT CHAT */}
          {activeTab === 'chat' && (
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/50">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-[#1673B8] text-white'
                          : 'bg-white border border-slate-200 text-slate-800'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isSendingChat && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 text-xs text-slate-600 inline-flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1673B8]" />
                      <span>Checking portal guidance...</span>
                    </div>
                  </div>
                )}

                {chatError && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-950 space-y-2">
                    <div className="flex items-start gap-2 font-semibold">
                      <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>{chatError}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEscalationTab('custom_opinion')}
                        className="px-2.5 py-1.5 rounded-lg bg-[#0F172A] text-white text-[11px] font-semibold cursor-pointer"
                      >
                        Send Custom Opinion
                      </button>
                      <button
                        type="button"
                        onClick={() => openEscalationTab('issue_report')}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 text-[11px] font-semibold cursor-pointer"
                      >
                        Highlight Issue
                      </button>
                    </div>
                  </div>
                )}

                {staticFallbackAvailable && (
                  <div className="rounded-xl bg-white border border-slate-200 p-3 space-y-2">
                    <p className="text-[11px] font-bold text-slate-700">
                      Built-in Quick Help Guides ({geo.countryName})
                    </p>
                    <div className="space-y-1.5">
                      {staticHelpTopics.map((topic) => {
                        const open = expandedStaticTopic === topic.title;
                        return (
                          <div key={topic.title} className="border border-slate-200 rounded-lg">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedStaticTopic(open ? null : topic.title)
                              }
                              className="w-full text-left px-2.5 py-2 text-[11px] font-semibold text-slate-800 hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-2"
                            >
                              <span>{topic.title}</span>
                              <span className="text-[#1673B8]">{open ? '−' : '+'}</span>
                            </button>
                            {open && (
                              <p className="px-2.5 pb-2.5 text-[11px] text-slate-600 leading-relaxed border-t border-slate-100 pt-1.5">
                                {topic.answer}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Context-aware quick prompts when conversation just started */}
                {messages.length <= 2 && !isSendingChat && (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-semibold text-slate-500">
                      Quick questions for this page:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {contextPrompts.map((prompt) => (
                        <button
                          key={prompt}
                          type="button"
                          onClick={() => {
                            if (prompt.toLowerCase().includes('custom opinion')) {
                              openEscalationTab('custom_opinion');
                            } else {
                              handleSendChatMessage(prompt);
                            }
                          }}
                          className="text-left px-2.5 py-1.5 rounded-lg bg-white hover:bg-sky-50 border border-slate-200 text-[11px] font-medium text-slate-700 cursor-pointer transition-colors"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Action Bar */}
              <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => openEscalationTab('custom_opinion')}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-[#0F172A] hover:bg-[#1673B8] text-white text-[11px] font-semibold cursor-pointer whitespace-nowrap truncate"
                >
                  Give Custom Opinion
                </button>
                <button
                  type="button"
                  onClick={() => openEscalationTab('issue_report')}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-[11px] font-semibold text-slate-800 cursor-pointer whitespace-nowrap truncate"
                >
                  Highlight Issue
                </button>
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChatMessage();
                }}
                className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Apna masla ya sawal likhein..."
                  disabled={isSendingChat}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-[#1673B8]"
                />
                <button
                  type="submit"
                  disabled={isSendingChat || !chatInput.trim()}
                  aria-label="Send support message"
                  className="w-9 h-9 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] disabled:opacity-50 text-white flex items-center justify-center cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: PERSONAL CUSTOM OPINION / ISSUE HIGHLIGHT */}
          {activeTab === 'submit' && (
            <form
              onSubmit={handleSubmitTicket}
              className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-white"
            >
              <div>
                <p className="text-[11px] font-semibold text-slate-600 mb-1.5">
                  Direct Admin Control Panel mein bhejne ke liye option chunein
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-semibold">
                  {[
                    { id: 'custom_opinion' as const, label: 'Custom Opinion' },
                    { id: 'issue_report' as const, label: 'Highlight Issue' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setRequestType(opt.id)}
                      className={`py-2 px-2 rounded-lg border cursor-pointer transition-colors whitespace-nowrap ${
                        requestType === opt.id
                          ? 'bg-[#1673B8] border-[#1673B8] text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {requestType === 'custom_opinion' && (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-slate-700">
                    Website / App Rating
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        aria-label={`Rate ${star} stars`}
                        className="p-0.5 cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= rating
                              ? 'text-amber-500 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!isSignedIn && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Your Name"
                    required
                    className="px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs"
                  />
                  <input
                    type="text"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="WhatsApp / Phone (Optional)"
                    className="px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs"
                  />
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="Email (Optional)"
                    className="sm:col-span-2 px-2.5 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs"
                  />
                </div>
              )}

              {isSignedIn && (
                <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100 pb-2">
                  <span>Sending as {user.name}</span>
                  <span className="font-mono">{isUserPaid ? 'Paid Member' : 'Free Member'}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  placeholder={
                    requestType === 'custom_opinion'
                      ? 'e.g. Suggestion for HACCP Vault or UI improvement'
                      : 'e.g. Issue inside PDF download or login'
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  {requestType === 'custom_opinion'
                    ? 'Your Personal Custom Opinion / Feedback'
                    : 'Describe the Issue'}
                </label>
                <textarea
                  rows={4}
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  required
                  placeholder={
                    requestType === 'custom_opinion'
                      ? 'Website ya mobile app ke baare mein apni personal rai, naye features ka idea, ya improvement likhein...'
                      : 'Detail mein batayein ke kis page ya tool mein kya issue aa raha hai...'
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-900"
                />
              </div>

              <label className="flex items-center gap-2 text-[11px] text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attachTranscript}
                  onChange={(e) => setAttachTranscript(e.target.checked)}
                />
                <span>Attach current AI chat conversation for Admin context</span>
              </label>

              {ticketFeedback && (
                <div
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-start gap-2 ${
                    ticketFeedback.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  {ticketFeedback.type === 'success' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <span>{ticketFeedback.text}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmittingTicket}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0F172A] hover:bg-[#1673B8] disabled:opacity-60 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {isSubmittingTicket ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>
                  {requestType === 'custom_opinion'
                    ? 'Send Custom Opinion to Admin'
                    : 'Submit Issue to Admin Panel'}
                </span>
              </button>
            </form>
          )}

          {/* TAB 3: MY REQUESTS & ADMIN REPLIES */}
          {activeTab === 'history' && (
            <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/50">
              {!isSignedIn ? (
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-center space-y-2.5">
                  <UserCheck className="w-6 h-6 text-[#1673B8] mx-auto" />
                  <p className="text-xs font-semibold text-slate-800">
                    Sign in to track your requests &amp; read Admin replies live
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Guest issues and custom opinions are still delivered straight to the Admin Control Panel.
                  </p>
                  {onOpenAuthModal && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        onOpenAuthModal();
                      }}
                      className="px-4 py-2 rounded-lg bg-[#1673B8] text-white text-xs font-semibold cursor-pointer"
                    >
                      Sign In / Create Account
                    </button>
                  )}
                </div>
              ) : myTickets.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-5 text-center space-y-2">
                  <MessageSquare className="w-6 h-6 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">
                    No support requests or opinions submitted yet
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('submit')}
                    className="px-3.5 py-1.5 rounded-lg bg-[#1673B8] text-white text-xs font-semibold cursor-pointer"
                  >
                    Submit Issue or Custom Opinion
                  </button>
                </div>
              ) : (
                myTickets.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white border border-slate-200 rounded-xl p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-[#1673B8]">
                        {t.requestType === 'custom_opinion'
                          ? 'Custom Opinion'
                          : t.requestType === 'admin_chat'
                          ? 'Admin Request'
                          : 'Issue Highlight'}
                      </span>
                      <span className="font-mono uppercase font-semibold text-slate-700">
                        {t.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{t.subject}</h4>
                    <p className="text-[11px] text-slate-600 whitespace-pre-wrap">
                      {t.message}
                    </p>

                    {t.adminReply && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 space-y-1">
                        <div className="text-[10.5px] font-bold text-emerald-800">
                          Admin Reply · {(t.adminRepliedAt || '').slice(0, 10)}
                        </div>
                        <p className="text-[11px] text-emerald-950 whitespace-pre-wrap">
                          {t.adminReply}
                        </p>
                      </div>
                    )}

                    {t.userFollowUp && (
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
                        <span className="font-semibold">Your follow-up: </span>
                        {t.userFollowUp}
                      </div>
                    )}

                    {t.status !== 'resolved' && (
                      <div className="flex items-center gap-1.5 pt-1">
                        <input
                          type="text"
                          value={followUpDrafts[t.id] || ''}
                          onChange={(e) =>
                            setFollowUpDrafts((prev) => ({
                              ...prev,
                              [t.id]: e.target.value
                            }))
                          }
                          placeholder="Add follow-up note for Admin..."
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-300 text-[11px]"
                        />
                        <button
                          type="button"
                          disabled={savingFollowUpId === t.id || !(followUpDrafts[t.id] || '').trim()}
                          onClick={() => handleSendFollowUp(t)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-semibold cursor-pointer disabled:opacity-50"
                        >
                          Send
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      )}
    </>
  );
};

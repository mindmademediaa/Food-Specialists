import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Award,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  FileText,
  GitBranch,
  HelpCircle,
  Layers,
  ShieldCheck,
  Sparkles,
  Thermometer,
  XCircle
} from 'lucide-react';
import {
  CoursePresentationSlide,
  SlideClassifierItem,
  SlideDocumentTemplateBlock,
  SlideHighLowItem,
  SlidePrpProcedureItem,
  SlideVisualIllustration
} from '../data/internationalTrainingsData';

const TONE_MAP: Record<
  'blue' | 'emerald' | 'amber' | 'rose' | 'slate',
  { border: string; bg: string; heading: string; text: string }
> = {
  blue: {
    border: 'border-[#BFD7ED]',
    bg: 'bg-[#F4F8FD]',
    heading: 'text-[#105E9A]',
    text: 'text-[#1A2138]'
  },
  emerald: {
    border: 'border-emerald-200',
    bg: 'bg-emerald-50/60',
    heading: 'text-emerald-900',
    text: 'text-emerald-950'
  },
  amber: {
    border: 'border-amber-200',
    bg: 'bg-amber-50/70',
    heading: 'text-amber-900',
    text: 'text-amber-950'
  },
  rose: {
    border: 'border-rose-200',
    bg: 'bg-rose-50/60',
    heading: 'text-rose-900',
    text: 'text-rose-950'
  },
  slate: {
    border: 'border-slate-200',
    bg: 'bg-slate-50',
    heading: 'text-[#1A2138]',
    text: 'text-slate-800'
  }
};

// ============================================================================
// 1. ZERO-OVERFLOW RESPONSIVE DIAGRAMS & COMPACT VECTOR AVATARS / ICONS
// All labels live inside fluid CSS Grid/Flex containers (zero clipped SVG text)
// ============================================================================
const SlideSvgArtwork: React.FC<{ type: SlideVisualIllustration }> = ({ type }) => {
  switch (type) {
    case 'instructor-profile':
      return (
        <svg viewBox="0 0 120 120" className="w-24 h-24 shrink-0" aria-hidden="true">
          <rect x="4" y="4" width="112" height="112" rx="22" fill="#EBF4FC" stroke="#BFD7ED" strokeWidth="2" />
          <path d="M24 112 C24 84 40 76 60 76 C80 76 96 84 96 112 Z" fill="#FFFFFF" stroke="#1673B8" strokeWidth="2" />
          <path d="M48 76 L60 100 L72 76" fill="#1673B8" opacity="0.16" />
          <path d="M48 76 L60 96 L72 76" fill="none" stroke="#105E9A" strokeWidth="2" />
          <rect x="65" y="92" width="14" height="16" rx="2" fill="#1673B8" />
          <line x1="68" y1="97" x2="76" y2="97" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="68" y1="101" x2="74" y2="101" stroke="#FBBF24" strokeWidth="1.5" />
          <circle cx="60" cy="48" r="20" fill="#FCD9B6" stroke="#1A2138" strokeWidth="1.8" />
          <path d="M40 46 C40 28 80 28 80 46 C76 36 44 36 40 46 Z" fill="#1A2138" />
          <rect x="45" y="44" width="12" height="8" rx="2.5" fill="#EBF4FC" fillOpacity="0.65" stroke="#105E9A" strokeWidth="1.6" />
          <rect x="63" y="44" width="12" height="8" rx="2.5" fill="#EBF4FC" fillOpacity="0.65" stroke="#105E9A" strokeWidth="1.6" />
          <line x1="57" y1="48" x2="63" y2="48" stroke="#105E9A" strokeWidth="1.6" />
          <path d="M54 58 Q60 63 66 58" fill="none" stroke="#1A2138" strokeWidth="1.8" strokeLinecap="round" />
          <rect x="14" y="70" width="22" height="28" rx="3" fill="#1A2138" />
          <rect x="18" y="75" width="14" height="19" rx="1" fill="#FFFFFF" />
          <path d="M21 82 L24 85 L30 79" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'four-hazards':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Biological */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 flex flex-col items-center text-center space-y-1.5">
            <svg viewBox="0 0 56 56" className="w-11 h-11 shrink-0" aria-hidden="true">
              <circle cx="28" cy="28" r="22" fill="#FEE2E2" stroke="#DC2626" strokeWidth="2" />
              <ellipse cx="28" cy="28" rx="10" ry="5" fill="#DC2626" />
              <line x1="28" y1="2" x2="28" y2="8" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
              <line x1="28" y1="48" x2="28" y2="54" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
              <line x1="2" y1="28" x2="8" y2="28" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
              <line x1="48" y1="28" x2="54" y2="28" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="text-xs font-black text-rose-900 leading-tight">
              MICROBIOLOGICAL
            </div>
            <div className="text-[11px] font-semibold text-rose-800 leading-snug">
              Bacteria · Viruses · Moulds · Parasites
            </div>
          </div>

          {/* Physical */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 flex flex-col items-center text-center space-y-1.5">
            <svg viewBox="0 0 56 56" className="w-11 h-11 shrink-0" aria-hidden="true">
              <polygon points="28,8 48,44 8,44" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.2" strokeLinejoin="round" />
              <line x1="28" y1="20" x2="28" y2="32" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="28" cy="38" r="2" fill="#92400E" />
            </svg>
            <div className="text-xs font-black text-amber-900 leading-tight">
              PHYSICAL
            </div>
            <div className="text-[11px] font-semibold text-amber-800 leading-snug">
              Glass · Metal Swarf · Hard Plastic · Wood
            </div>
          </div>

          {/* Chemical */}
          <div className="rounded-xl border border-[#BFD7ED] bg-[#F4F8FD] p-3 flex flex-col items-center text-center space-y-1.5">
            <svg viewBox="0 0 56 56" className="w-11 h-11 shrink-0" aria-hidden="true">
              <path d="M21 10 L35 10 L32 24 L44 44 L12 44 L24 24 Z" fill="#DBEAFE" stroke="#1673B8" strokeWidth="2.2" strokeLinejoin="round" />
              <line x1="17" y1="36" x2="39" y2="36" stroke="#105E9A" strokeWidth="2" />
            </svg>
            <div className="text-xs font-black text-[#105E9A] leading-tight">
              CHEMICAL
            </div>
            <div className="text-[11px] font-semibold text-[#1E3A8A] leading-snug">
              Sanitisers · Pesticides · Heavy Metals
            </div>
          </div>

          {/* Allergenic */}
          <div className="rounded-xl border border-violet-200 bg-violet-50/70 p-3 flex flex-col items-center text-center space-y-1.5">
            <svg viewBox="0 0 56 56" className="w-11 h-11 shrink-0" aria-hidden="true">
              <circle cx="28" cy="28" r="22" fill="#EDE9FE" stroke="#6D28D9" strokeWidth="2" />
              <ellipse cx="23" cy="28" rx="6" ry="11" transform="rotate(-18 23 28)" fill="#7C3AED" opacity="0.75" />
              <ellipse cx="33" cy="28" rx="6" ry="11" transform="rotate(18 33 28)" fill="#5B21B6" opacity="0.75" />
            </svg>
            <div className="text-xs font-black text-violet-900 leading-tight">
              ALLERGENIC
            </div>
            <div className="text-[11px] font-semibold text-violet-800 leading-snug">
              14 Major Allergens · Cross-Contact
            </div>
          </div>
        </div>
      );

    case 'microbe-spore':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Vegetative cell */}
          <div className="rounded-xl border border-[#BFD7ED] bg-[#F4F8FD] p-3.5 flex items-center gap-3">
            <svg viewBox="0 0 72 56" className="w-16 h-14 shrink-0" aria-hidden="true">
              <rect x="6" y="14" width="44" height="24" rx="12" fill="#1673B8" opacity="0.2" stroke="#1673B8" strokeWidth="2.2" />
              <path d="M50 26 Q58 20 64 27 T70 25" fill="none" stroke="#1673B8" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="space-y-1 min-w-0">
              <div className="text-xs font-black text-[#1A2138]">Vegetative Bacterium</div>
              <p className="text-[11px] text-slate-700 leading-snug">
                Active cells dividing via binary fission every 10–20 minutes in warm food.
              </p>
              <p className="text-[11px] font-extrabold text-emerald-700">
                Destroyed by core cooking ≥ 75°C
              </p>
            </div>
          </div>

          {/* Bacterial endospore */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 flex items-center gap-3">
            <svg viewBox="0 0 72 56" className="w-16 h-14 shrink-0" aria-hidden="true">
              <ellipse cx="36" cy="28" rx="26" ry="17" fill="#F59E0B" opacity="0.28" stroke="#B45309" strokeWidth="3" />
              <ellipse cx="36" cy="28" rx="12" ry="8" fill="#92400E" />
            </svg>
            <div className="space-y-1 min-w-0">
              <div className="text-xs font-black text-amber-950">Bacterial Endospore</div>
              <p className="text-[11px] text-amber-900 leading-snug">
                Protective armour coat allows Clostridium &amp; Bacillus spores to survive 100°C boiling.
              </p>
              <p className="text-[11px] font-extrabold text-rose-700">
                Germinates rapidly if cooled slowly (5°C–63°C)
              </p>
            </div>
          </div>
        </div>
      );

    case 'prp-foundation':
      return (
        <div className="rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] p-3.5 sm:p-4 space-y-2.5">
          {/* Roof banner */}
          <div className="rounded-xl bg-[#1A2138] text-white px-4 py-3 text-center">
            <div className="text-[11px] font-black uppercase tracking-wider text-amber-300">
              HACCP Plan Roof (Process-Specific CCPs)
            </div>
            <div className="text-xs sm:text-sm font-bold mt-0.5 leading-snug">
              Specific Control Measures &amp; CCPs for Significant Remaining Hazards
            </div>
          </div>

          {/* 7 PRP Columns cleanly wrapped in responsive CSS Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { name: 'Cleaning & SSOP', sub: '6-Step Wet/Dry' },
              { name: 'Pest Control', sub: 'IPM & Screens' },
              { name: 'Personal Hygiene', sub: 'PPE & 48h Rule' },
              { name: 'Approved Suppliers', sub: 'COA & Audits' },
              { name: 'Maintenance', sub: 'H1 Grease / Glass' },
              { name: 'Staff Training', sub: 'Task Competence' },
              { name: 'Traceability', sub: 'Batch & Recall' }
            ].map((col) => (
              <div
                key={col.name}
                className="rounded-lg border border-[#1673B8]/40 bg-white px-2.5 py-2.5 text-center flex flex-col justify-center min-w-0"
              >
                <div className="text-[11px] font-black text-[#105E9A] leading-tight break-words">
                  {col.name}
                </div>
                <div className="text-[10px] font-semibold text-slate-600 mt-1 leading-tight break-words">
                  {col.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Solid Foundation Base */}
          <div className="rounded-lg bg-[#1673B8] text-white px-3 py-2 text-center text-[11px] font-black tracking-wide">
            PREREQUISITE PROGRAMMES (PRPs) — MANDATORY GMP &amp; GHP BUILDING FOUNDATION
          </div>
        </div>
      );

    case 'approved-supplier':
      return (
        <div className="rounded-xl border border-[#BFD7ED] bg-[#F4F8FD] p-3.5 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center gap-4">
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#D2DEEA] bg-white px-4 py-3 shrink-0">
            <svg viewBox="0 0 180 86" className="w-40 h-20" aria-hidden="true">
              <rect x="8" y="14" width="110" height="50" rx="6" fill="#EBF4FC" stroke="#1673B8" strokeWidth="2.2" />
              <rect x="118" y="28" width="44" height="36" rx="5" fill="#1673B8" />
              <rect x="128" y="34" width="24" height="14" rx="2" fill="#FFFFFF" />
              <circle cx="38" cy="68" r="10" fill="#1A2138" />
              <circle cx="38" cy="68" r="4" fill="#FFFFFF" />
              <circle cx="140" cy="68" r="10" fill="#1A2138" />
              <circle cx="140" cy="68" r="4" fill="#FFFFFF" />
            </svg>
            <span className="text-[11px] font-black text-[#105E9A] mt-1">
              Chilled ≤ 5°C · Frozen ≤ -18°C
            </span>
          </div>

          <div className="flex-1 rounded-xl border border-[#D2DEEA] bg-white p-3.5 space-y-1.5 min-w-0">
            <div className="text-xs font-black text-[#1A2138]">
              Receiving QA Gatekeeper Verification Protocol
            </div>
            <ul className="space-y-1 text-xs text-slate-700 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Confirm Approved Supplier List status, valid COA &amp; tamper-evident seals</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Probe between packs with calibrated thermometer (≤ 5°C chilled / ≤ -18°C frozen)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Check vehicle hygiene, off-odours, pest signs, Use-By dates &amp; assign Lot Code</span>
              </li>
            </ul>
          </div>
        </div>
      );

    case 'codex-12-steps':
      return (
        <div className="space-y-3">
          {/* Steps 1 to 5 */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 space-y-2">
            <div className="text-[11px] font-black uppercase tracking-wider text-amber-900">
              Preliminary Preparation Steps (Codex Steps 1–5)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {[
                '1. Assemble HACCP Team',
                '2. Describe Product',
                '3. Identify Intended Use',
                '4. Construct Flow Chart',
                '5. On-Site Confirm Flow'
              ].map((step) => (
                <div
                  key={step}
                  className="rounded-lg border border-amber-300 bg-white px-2.5 py-2 text-[11px] font-extrabold text-amber-950 text-center"
                >
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Steps 6 to 12 */}
          <div className="rounded-xl border border-[#BFD7ED] bg-[#F4F8FD] p-3 space-y-2">
            <div className="text-[11px] font-black uppercase tracking-wider text-[#105E9A]">
              The 7 Core HACCP Principles (Codex Steps 6–12)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {[
                '6. Hazard Analysis',
                '7. Determine CCPs',
                '8. Critical Limits',
                '9. Monitoring System',
                '10. Corrective Actions',
                '11. Verification Plan',
                '12. Records & Docs'
              ].map((step) => (
                <div
                  key={step}
                  className="rounded-lg bg-[#1673B8] text-white px-2.5 py-2 text-[11px] font-extrabold text-center"
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'thermometer-calibration':
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Ice water */}
          <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-3.5 flex items-center gap-3">
            <svg viewBox="0 0 64 72" className="w-14 h-16 shrink-0" aria-hidden="true">
              <rect x="12" y="24" width="40" height="40" rx="5" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2.2" />
              <polygon points="18,34 28,34 26,44 16,44" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="1" />
              <polygon points="34,38 44,38 42,48 32,48" fill="#FFFFFF" stroke="#38BDF8" strokeWidth="1" />
              <line x1="32" y1="8" x2="32" y2="54" stroke="#1A2138" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="22" y="4" width="20" height="9" rx="2" fill="#1A2138" />
            </svg>
            <div className="space-y-1 min-w-0">
              <div className="text-xs font-black text-sky-900">Ice-Slurry Check (0.0°C)</div>
              <p className="text-[11px] text-slate-700 leading-snug">
                50% crushed ice + 50% potable water; immerse probe without touching beaker wall.
              </p>
              <p className="text-[11px] font-extrabold text-emerald-700">
                Acceptable Range: -0.5°C to +0.5°C
              </p>
            </div>
          </div>

          {/* Boiling water */}
          <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-3.5 flex items-center gap-3">
            <svg viewBox="0 0 64 72" className="w-14 h-16 shrink-0" aria-hidden="true">
              <rect x="12" y="24" width="40" height="40" rx="5" fill="#FFEDD5" stroke="#EA580C" strokeWidth="2.2" />
              <circle cx="24" cy="48" r="3" fill="#FFFFFF" />
              <circle cx="38" cy="42" r="2.5" fill="#FFFFFF" />
              <line x1="32" y1="8" x2="32" y2="54" stroke="#1A2138" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="22" y="4" width="20" height="9" rx="2" fill="#1A2138" />
            </svg>
            <div className="space-y-1 min-w-0">
              <div className="text-xs font-black text-orange-900">Rolling Boil Check (100.0°C)</div>
              <p className="text-[11px] text-slate-700 leading-snug">
                Immerse 5cm into vigorously boiling water, suspended away from pot bottom.
              </p>
              <p className="text-[11px] font-extrabold text-emerald-700">
                Acceptable Range: 99.5°C to 100.5°C
              </p>
            </div>
          </div>
        </div>
      );

    case 'corrective-action':
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 space-y-1">
            <div className="text-[11px] font-black uppercase tracking-wider text-rose-900">
              1. Deviation Detected
            </div>
            <p className="text-xs font-bold text-[#1A2138]">
              Example: Poultry core reads 68.5°C
            </p>
            <p className="text-[11px] text-rose-800">
              Breaches ≥ 75°C Critical Limit; hold batch immediately.
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 space-y-1">
            <div className="text-[11px] font-black uppercase tracking-wider text-amber-900">
              2. Contain &amp; Fix Product
            </div>
            <p className="text-xs font-bold text-[#1A2138]">
              Quarantine Tag + Continue Cook
            </p>
            <p className="text-[11px] text-amber-800">
              Hold all units since last good check; cook to ≥ 75°C or condemn safely.
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 space-y-1">
            <div className="text-[11px] font-black uppercase tracking-wider text-emerald-900">
              3. Root Cause &amp; Log
            </div>
            <p className="text-xs font-bold text-[#1A2138]">
              5-Why Fix + QA Sign-Off
            </p>
            <p className="text-[11px] text-emerald-800">
              Repair oven element / adjust tray spacing and sign CAPA form.
            </p>
          </div>
        </div>
      );

    case 'cdm-care-team':
      return (
        <div className="rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] p-3.5 sm:p-4 space-y-3">
          <div className="rounded-xl bg-[#1A2138] text-white px-4 py-2.5 text-center">
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-300">
              Interdisciplinary Clinical Nutrition &amp; Foodservice Care Ecosystem
            </div>
            <div className="text-xs sm:text-sm font-bold mt-0.5">
              Right Diet · Right Texture · Right Temperature · Right Patient
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {[
              { step: '1. Physician', role: 'Prescribes medical diet order & NPO status', tone: 'border-sky-300 bg-sky-50/70 text-sky-950' },
              { step: '2. Clinical Dietitian', role: 'Nutrition assessment, MNT & nutrient targets', tone: 'border-emerald-300 bg-emerald-50/70 text-emerald-950' },
              { step: '3. Dietary Manager (CDM)', role: 'Menus, recipes, HACCP, tray ops, budget & staff', tone: 'border-[#1673B8] bg-[#EBF4FC] text-[#0C182D] ring-1 ring-[#1673B8]/30' },
              { step: '4. Chefs & Tray Aides', role: 'Standardized production, IDDSI prep & assembly', tone: 'border-amber-300 bg-amber-50/70 text-amber-950' },
              { step: '5. Ward Nursing', role: 'Verifies patient ID, assists feeding & logs intake', tone: 'border-violet-300 bg-violet-50/70 text-violet-950' }
            ].map((node) => (
              <div key={node.step} className={`rounded-xl border p-2.5 text-center flex flex-col justify-center ${node.tone}`}>
                <div className="text-xs font-black leading-tight">{node.step}</div>
                <div className="text-[10.5px] font-semibold opacity-90 mt-1 leading-snug">{node.role}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'cdm-kitchen-zones':
      return (
        <div className="rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] p-3.5 sm:p-4 space-y-2.5">
          <div className="text-[11px] font-black uppercase tracking-wider text-[#105E9A] text-center">
            Hospital 6-Zone One-Way (Dirty → Clean) Kitchen Layout
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { num: 'Zone 1', name: 'Receiving Bay', sub: 'Temp ≤5°C / -18°C & Weighing', cls: 'border-slate-300 bg-white' },
              { num: 'Zone 2', name: 'Dry & Cold Store', sub: 'FIFO/FEFO · 15 cm Off Floor', cls: 'border-sky-300 bg-sky-50/60' },
              { num: 'Zone 3', name: 'Segregated Prep', sub: 'Color-Coded Raw vs Veg', cls: 'border-amber-300 bg-amber-50/60' },
              { num: 'Zone 4', name: 'Hot & Diet Cook', sub: 'Core ≥75°C · Diet Kettles', cls: 'border-orange-300 bg-orange-50/60' },
              { num: 'Zone 5', name: 'Tray Line & Cart', sub: 'Clean Zone · Ticket Audit', cls: 'border-emerald-400 bg-emerald-50/70' },
              { num: 'Zone 6', name: 'Isolated Scullery', sub: 'Separate Dirty Return Door', cls: 'border-rose-300 bg-rose-50/60' }
            ].map((z) => (
              <div key={z.num} className={`rounded-xl border p-2.5 text-center ${z.cls}`}>
                <div className="text-[10px] font-black uppercase text-[#1673B8]">{z.num}</div>
                <div className="text-xs font-black text-[#1A2138] leading-tight mt-0.5">{z.name}</div>
                <div className="text-[10px] font-semibold text-slate-600 mt-1 leading-snug">{z.sub}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-[#1673B8] text-white px-3 py-1.5 text-center text-[11px] font-extrabold">
            ZERO BACK-TRACKING RULE: Raw ingredients and returning soiled ward carts never cross clean cooked food or plated trays.
          </div>
        </div>
      );

    case 'cdm-therapeutic-diets':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {[
            { name: 'Diabetic (Carb-Controlled)', rule: 'Consistent carbs (45–60 g/meal), zero refined sugar, high fiber, low GI', tone: 'border-sky-200 bg-sky-50/70 text-sky-950' },
            { name: 'Renal (CKD / Dialysis)', rule: 'Restricted Sodium (<2 g), Potassium (<2 g), Phosphorus & measured fluids', tone: 'border-amber-200 bg-amber-50/70 text-amber-950' },
            { name: 'Cardiac (DASH / Low-Na)', rule: 'Low Sodium (≤1,500–2,000 mg/day), low saturated fat, lean proteins & herbs', tone: 'border-rose-200 bg-rose-50/70 text-rose-950' },
            { name: 'High-Protein / Wound Care', rule: '1.2–1.5 g protein/kg, fortified shakes, Vitamin C & Zinc for tissue repair', tone: 'border-emerald-200 bg-emerald-50/70 text-emerald-950' },
            { name: 'Neutropenic / Low-Microbial', rule: 'Zero raw salads/unpasteurized dairy; thoroughly cooked ≥75°C sealed portions', tone: 'border-violet-200 bg-violet-50/70 text-violet-950' },
            { name: 'Allergen-Free / Celiac', rule: 'Dedicated purple utensils, strict wheat/gluten/nut isolation & label check', tone: 'border-[#BFD7ED] bg-[#F4F8FD] text-[#1A2138]' }
          ].map((d) => (
            <div key={d.name} className={`rounded-xl border p-3 space-y-1 ${d.tone}`}>
              <div className="text-xs font-black leading-tight">{d.name}</div>
              <p className="text-[11px] font-medium leading-snug opacity-90">{d.rule}</p>
            </div>
          ))}
        </div>
      );

    case 'cdm-iddsi-levels':
      return (
        <div className="rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] p-3.5 sm:p-4 space-y-2.5">
          <div className="text-[11px] font-black uppercase tracking-wider text-[#105E9A] text-center">
            International Dysphagia Diet Standardisation Initiative (IDDSI Levels 0–7)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl border border-sky-200 bg-white p-3 space-y-1.5">
              <div className="text-[11px] font-black uppercase text-sky-800">Drinks (Syringe Flow Test — Levels 0 to 4)</div>
              {[
                'Level 0 — Thin: Flows like water (0 mL left in 10 mL syringe after 10 sec)',
                'Level 1 — Slightly Thick: Thicker than water (1–4 mL remaining)',
                'Level 2 — Mildly Thick: Sip-able nectar thickness (4–8 mL remaining)',
                'Level 3 — Moderately Thick: Liquidised (>8 mL; slow drip through fork)',
                'Level 4 — Extremely Thick: Pureed / spoon-thick (holds shape on spoon)'
              ].map((l) => (
                <div key={l} className="text-[11px] font-semibold text-slate-700 bg-sky-50/70 px-2.5 py-1 rounded-lg border border-sky-100">
                  {l}
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-emerald-200 bg-white p-3 space-y-1.5">
              <div className="text-[11px] font-black uppercase text-emerald-800">Foods (Fork Drip &amp; Spoon Tilt — Levels 3 to 7)</div>
              {[
                'Level 3 — Liquidised: Smooth, no lumps, cannot be eaten with fork',
                'Level 4 — Pureed: Smooth, cohesive, slides cleanly off tilted spoon',
                'Level 5 — Minced & Moist: Soft 4 mm lumps, squashes easily with fork',
                'Level 6 — Soft & Bite-Sized: Tender 1.5 cm pieces, no knife needed',
                'Level 7 — Easy to Chew / Regular: Normal everyday hospital textures'
              ].map((l) => (
                <div key={l} className="text-[11px] font-semibold text-slate-700 bg-emerald-50/70 px-2.5 py-1 rounded-lg border border-emerald-100">
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'cdm-tray-accuracy':
      return (
        <div className="rounded-xl border border-[#BFD7ED] bg-[#F4F8FD] p-3.5 sm:p-4 space-y-2.5">
          <div className="text-[11px] font-black uppercase tracking-wider text-[#105E9A] text-center">
            4-Gate Patient Tray Line Safety &amp; Accuracy Verification
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              { gate: 'Gate 1: Dual Patient ID', desc: 'Verify Full Name + MRN / Bed Number against live Ward Census before assembly', badge: 'ZERO MIX-UP' },
              { gate: 'Gate 2: Diet & Allergen Match', desc: 'Confirm therapeutic order, IDDSI level, allergen flags & verify NOT NPO', badge: 'CLINICAL SAFE' },
              { gate: 'Gate 3: Portion & Visual Check', desc: 'Verify standardized scoops, clean rim, covered dome & complete cutlery', badge: 'PRESENTATION' },
              { gate: 'Gate 4: Thermal Delivery Check', desc: 'Hot entrée ≥63°C · Cold salad/dessert ≤5°C · Ward delivery ≤30 mins', badge: 'TEMP CONTROL' }
            ].map((g) => (
              <div key={g.gate} className="rounded-xl border border-[#D2DEEA] bg-white p-3 space-y-1.5">
                <span className="inline-block px-2 py-0.5 rounded bg-[#EBF4FC] text-[#105E9A] text-[9.5px] font-black uppercase tracking-wider">
                  {g.badge}
                </span>
                <div className="text-xs font-black text-[#1A2138]">{g.gate}</div>
                <p className="text-[11px] text-slate-600 leading-snug">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'cdm-inventory-fifo':
      return (
        <div className="rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] p-3.5 sm:p-4 space-y-2.5">
          <div className="text-[11px] font-black uppercase tracking-wider text-[#105E9A] text-center">
            Hospital Store Control: FIFO / FEFO, Par Levels &amp; Cold-Chain Zoning
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              { title: 'Dry Store (15°C–21°C)', body: 'RH <60% · Shelving ≥15 cm off floor & 5 cm from walls · Sealed food-grade bins' },
              { title: 'Chiller (+1°C to +4°C)', body: 'Top: RTE & Dairy · Middle: Veg/Cooked · Bottom: Raw Meat/Poultry in drip trays' },
              { title: 'Freezer (≤ -18°C)', body: 'Airflow gaps maintained · Frozen solid · Labeled with Delivery & Use-By dates' },
              { title: 'FIFO / FEFO & Par Stock', body: 'First Expired First Out rotation · Weekly inventory count · Reorder at Par Minimum' }
            ].map((box) => (
              <div key={box.title} className="rounded-xl border border-[#D2DEEA] bg-white p-3 space-y-1">
                <div className="text-xs font-black text-[#105E9A]">{box.title}</div>
                <p className="text-[11px] text-slate-700 leading-snug">{box.body}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'cdm-emergency-plan':
      return (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 sm:p-4 space-y-2.5">
          <div className="text-[11px] font-black uppercase tracking-wider text-amber-900 text-center">
            Hospital 72-Hour Emergency &amp; Disaster Foodservice Contingency Framework
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              { title: '72-Hour Reserve Stock', desc: 'Shelf-stable UHT milk, canned proteins, crackers, oral nutrition shakes & bottled water (≥3 L/patient/day)' },
              { title: 'Power Outage Protocol', desc: 'Keep chiller/freezer doors closed; log internal temps every 2h; discard chilled items >5°C for >2–4h' },
              { title: 'Boil-Water / Utility Failure', desc: 'Switch immediately to bottled water, no-cook disaster menu & single-use disposable plates/cutlery' },
              { title: 'Foodborne Outbreak Response', desc: 'Preserve 72-hour retained food samples (150 g each), alert Infection Control & trace supplier lot ≤4h' }
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-amber-300 bg-white p-3 space-y-1">
                <div className="text-xs font-black text-amber-950">{item.title}</div>
                <p className="text-[11px] text-slate-700 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'cdm-quality-audit':
      return (
        <div className="rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] p-3.5 sm:p-4 space-y-2.5">
          <div className="text-[11px] font-black uppercase tracking-wider text-[#105E9A] text-center">
            Certified Dietary Manager (CDM) Continuous Quality Improvement (CQI) Benchmarks
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {[
              { kpi: '≥ 98%', label: 'Tray Accuracy Rate', sub: 'Zero therapeutic / allergen error' },
              { kpi: '≥ 63°C / ≤ 5°C', label: 'Meal Temp Compliance', sub: 'Verified via daily test tray' },
              { kpi: '< 15%', label: 'Patient Plate Waste', sub: 'Tracked by ward & recipe' },
              { kpi: '72 Hours', label: 'Retained Food Samples', sub: '150 g per dish at ≤ 4°C' },
              { kpi: '≤ 4 Hours', label: 'Batch Traceability', sub: 'Supplier lot to ward tray' }
            ].map((m) => (
              <div key={m.label} className="rounded-xl border border-[#1673B8]/35 bg-white p-2.5 text-center">
                <div className="text-sm font-black text-[#1673B8] tabular-nums">{m.kpi}</div>
                <div className="text-[11px] font-black text-[#1A2138] mt-0.5 leading-tight">{m.label}</div>
                <div className="text-[10px] font-medium text-slate-500 mt-0.5 leading-snug">{m.sub}</div>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
};

// ============================================================================
// 2. SAMPLE HACCP CONTROLLED DOCUMENT TEMPLATE RENDERER (12 CODEX STEPS)
// ============================================================================
const DocumentTemplateCard: React.FC<{ doc: SlideDocumentTemplateBlock }> = ({ doc }) => (
  <div className="rounded-xl border-2 border-[#1673B8]/35 bg-white overflow-hidden shadow-xs">
    {/* Document Header Strip */}
    <div className="bg-[#1A2138] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <FileText className="w-4 h-4 text-amber-400 shrink-0" />
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-wider text-amber-300">
            {doc.codexStepLabel} · Sample Controlled Document
          </div>
          <div className="text-xs sm:text-sm font-black leading-snug">{doc.docTitle}</div>
        </div>
      </div>
      <div className="text-[11px] font-mono font-bold text-[#DCE9F6] bg-white/10 px-2.5 py-1 rounded-md shrink-0">
        {doc.docCode} · {doc.version}
      </div>
    </div>

    {/* Document Body */}
    <div className="p-4 space-y-3 bg-[#F4F8FD]/50">
      <p className="text-xs font-semibold text-slate-700 leading-relaxed">
        <span className="font-black text-[#105E9A]">Purpose: </span>
        {doc.purpose}
      </p>

      {/* Metadata fields */}
      {doc.fields.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {doc.fields.map((f) => (
            <div
              key={f.label}
              className="rounded-lg border border-[#D2DEEA] bg-white px-3 py-2 text-xs"
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                {f.label}
              </span>
              <span className="font-bold text-[#1A2138] leading-snug block mt-0.5">
                {f.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Embedded Document Grid Table */}
      {doc.tablePreview && (
        <div className="overflow-x-auto rounded-lg border border-[#D2DEEA] bg-white">
          <table className="w-full text-xs border-collapse tabular-nums">
            <thead>
              <tr className="bg-[#F4F8FD] border-b border-[#D2DEEA] text-left">
                {doc.tablePreview.headers.map((h) => (
                  <th key={h} className="p-2.5 font-black text-[#105E9A]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {doc.tablePreview.rows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b last:border-b-0 border-slate-100">
                  {row.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className={`p-2.5 align-top leading-snug ${
                        cIdx === 0 ? 'font-bold text-[#1A2138]' : 'text-slate-700'
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Document Control Footer Sign-off */}
      <div className="rounded-lg border border-dashed border-[#1673B8]/40 bg-white px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-slate-600">
        <span>Sign-Off Verification: {doc.signOffLine}</span>
        <span className="font-bold text-[#105E9A]">Controlled QA Copy</span>
      </div>
    </div>
  </div>
);

// ============================================================================
// 3. INTERACTIVE PRP SOP PROCEDURES DEMONSTRATOR
// ============================================================================
const PrpProcedureShowcase: React.FC<{ items: SlidePrpProcedureItem[] }> = ({ items }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const current = items[activeIdx] || items[0];

  return (
    <div className="rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#1673B8]" />
          <span className="text-xs font-black uppercase tracking-wider text-[#105E9A]">
            Interactive Standard Operating Procedures (SOPs) — Select a Protocol Below
          </span>
        </div>
        <span className="text-[11px] font-bold text-slate-500">
          {items.length} Operational SOPs
        </span>
      </div>

      {/* Selector buttons */}
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, idx) => (
          <button
            key={item.prpCode}
            type="button"
            onClick={() => setActiveIdx(idx)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-extrabold transition cursor-pointer ${
              idx === activeIdx
                ? 'border-[#1673B8] bg-[#1673B8] text-white shadow-xs'
                : 'border-[#D2DEEA] bg-white text-[#1A2138] hover:border-[#1673B8]'
            }`}
          >
            {item.prpCode}: {item.prpName}
          </button>
        ))}
      </div>

      {/* Step-by-step SOP flow */}
      <div className="rounded-xl border border-[#D2DEEA] bg-white p-4 space-y-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#1673B8]">
            {current.prpCode} Operational Objective
          </span>
          <h5 className="text-sm font-black text-[#1A2138] mt-0.5">{current.prpName}</h5>
          <p className="text-xs text-slate-700 mt-1">{current.objective}</p>
        </div>

        <div className="space-y-1.5">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-600">
            Step-by-Step Floor Procedure (How It Works)
          </div>
          <ol className="space-y-1.5">
            {current.steps.map((step, sIdx) => (
              <li
                key={sIdx}
                className="flex items-start gap-2.5 rounded-lg bg-[#F4F8FD] border border-[#D2DEEA]/70 px-3 py-2 text-xs text-[#1A2138] font-medium"
              >
                <span className="w-5 h-5 rounded-full bg-[#1673B8] text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {sIdx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-900 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong className="font-black">Audit Verification &amp; Log: </strong>
            {current.verificationRecord}
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. INTERACTIVE GERMOMETER TEMPERATURE GAUGE
// ============================================================================
interface TempZoneStop {
  temp: string;
  label: string;
  status: string;
  tone: 'blue' | 'emerald' | 'amber' | 'rose';
  detail: string;
  action: string;
}

const GERMOMETER_STOPS: TempZoneStop[] = [
  {
    temp: '100°C',
    label: 'Boiling Point',
    status: 'Vegetative Cells Destroyed · Spores Can Survive',
    tone: 'emerald',
    detail:
      'Water boils at 100°C (used for boiling-water probe calibration). Vegetative pathogens die rapidly, but heat-resistant bacterial spores (Clostridium perfringens, Bacillus cereus) survive.',
    action: 'Cool cooked bulk rice/curries rapidly through the Danger Zone so surviving spores cannot germinate.'
  },
  {
    temp: '75°C',
    label: 'Core Cooking CCP',
    status: 'Thermal Kill Step (≥ 75°C Core)',
    tone: 'emerald',
    detail:
      'Minimum validated internal core temperature for poultry, minced meats, and reheated dishes (equivalent to 70°C held for 2 minutes). Achieves rapid pathogen log-reduction.',
    action: 'Always probe the thickest thermal centre using a clean sanitised digital probe.'
  },
  {
    temp: '63°C',
    label: 'Hot Hold Minimum',
    status: 'Above Danger Zone — Safe Hot Hold',
    tone: 'amber',
    detail:
      'Minimum legal hot-holding temperature for Bain-maries, carveries, and hot cabinets. Above 63°C vegetative bacteria cannot multiply.',
    action: 'Discard or rapidly chill within 2 hours if hot-held food slips below 63°C.'
  },
  {
    temp: '37°C',
    label: 'Peak Danger Zone',
    status: 'Rapid Multiplication (5°C – 63°C)',
    tone: 'rose',
    detail:
      'Human pathogens divide fastest between 20°C and 50°C — doubling every 10–20 minutes via binary fission around 37°C! One bacterium can reach millions in a single shift.',
    action: 'Never defrost raw poultry on counters or leave cooked sauces cooling at ambient room temperature.'
  },
  {
    temp: '1°C–5°C',
    label: 'Chilled Safe Zone',
    status: 'Slowed Growth · Safe Chilled Storage',
    tone: 'blue',
    detail:
      'Target chiller operating band (1°C–4°C target; ≤ 5°C critical limit in retail/catering). Cold slows most pathogens, though Listeria monocytogenes still grows slowly.',
    action: 'Calibrate chiller sensors weekly and verify incoming chilled deliveries between packs.'
  },
  {
    temp: '-18°C',
    label: 'Deep Freeze Dormant',
    status: 'Dormant Microbes (Not Killed!)',
    tone: 'blue',
    detail:
      'Freezing locks up water moisture and halts bacterial division completely — but does NOT kill pathogens or spores! Once thawed, dormant microbes wake up immediately.',
    action: 'Thaw high-risk frozen meats in bottom-shelf thaw chillers at ≤ 5°C, never at ambient temperature.'
  }
];

const InteractiveGermometer: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState<number>(3);
  const active = GERMOMETER_STOPS[selectedIdx];
  const tone = TONE_MAP[active.tone];

  return (
    <div className="rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-[#1673B8]" />
          <span className="text-xs font-black uppercase tracking-wider text-[#105E9A]">
            Interactive Germometer — Click Any Temperature Zone
          </span>
        </div>
        <span className="text-[11px] font-bold text-slate-500">
          Danger Zone: 5°C to 63°C
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {GERMOMETER_STOPS.map((stop, idx) => {
          const isSelected = idx === selectedIdx;
          const badgeTone =
            stop.tone === 'rose'
              ? 'border-rose-300 bg-rose-50 text-rose-900'
              : stop.tone === 'amber'
              ? 'border-amber-300 bg-amber-50 text-amber-900'
              : stop.tone === 'emerald'
              ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
              : 'border-sky-300 bg-sky-50 text-sky-900';

          return (
            <button
              key={stop.temp}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className={`rounded-xl border p-2.5 text-left transition cursor-pointer ${
                isSelected
                  ? 'border-[#1673B8] bg-white ring-2 ring-[#1673B8]/25 shadow-xs'
                  : `${badgeTone} hover:brightness-95`
              }`}
            >
              <div className="font-mono text-sm font-black tabular-nums text-[#1A2138]">
                {stop.temp}
              </div>
              <div className="text-[11px] font-bold text-slate-700 leading-tight mt-0.5">
                {stop.label}
              </div>
            </button>
          );
        })}
      </div>

      <div className={`rounded-xl border p-3.5 ${tone.border} bg-white space-y-1.5`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={`text-xs sm:text-sm font-black ${tone.heading}`}>
            {active.temp} — {active.status}
          </span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed">{active.detail}</p>
        <p className="text-xs font-bold text-[#105E9A] pt-0.5">
          Supervisor Rule: {active.action}
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// 5. INTERACTIVE HAZARD CLASSIFIER DRILL (M / P / C / A)
// ============================================================================
const CATEGORIES: Array<SlideClassifierItem['category']> = [
  'Microbiological',
  'Physical',
  'Chemical',
  'Allergenic'
];

const InteractiveHazardClassifier: React.FC<{ items: SlideClassifierItem[] }> = ({ items }) => {
  const [answers, setAnswers] = useState<Record<number, SlideClassifierItem['category']>>({});

  return (
    <div className="rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-[#105E9A]">
          Interactive Activity — Classify Each Hazard (M / P / C / A)
        </span>
        <span className="text-[11px] font-bold text-slate-500">
          Select a category button for each item
        </span>
      </div>

      <div className="space-y-2">
        {items.map((row, idx) => {
          const picked = answers[idx];
          const isCorrect = picked === row.category;
          return (
            <div
              key={row.item}
              className="rounded-xl border border-[#D2DEEA] bg-white p-3 space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-bold text-[#1A2138]">
                  {idx + 1}. {row.item}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map((cat) => {
                    const selected = picked === cat;
                    let cls =
                      'border-slate-200 bg-slate-50 text-slate-700 hover:border-[#1673B8]';
                    if (selected) {
                      cls =
                        cat === row.category
                          ? 'border-emerald-500 bg-emerald-600 text-white'
                          : 'border-rose-500 bg-rose-600 text-white';
                    }
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setAnswers((prev) => ({ ...prev, [idx]: cat }))}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-extrabold transition cursor-pointer ${cls}`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>
              {picked && (
                <div
                  className={`text-xs rounded-lg px-2.5 py-1.5 flex items-start gap-1.5 font-semibold ${
                    isCorrect
                      ? 'bg-emerald-50 text-emerald-900'
                      : 'bg-rose-50 text-rose-900'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                  )}
                  <span>
                    {isCorrect ? `Correct (${row.category}): ` : `Actually ${row.category}: `}
                    {row.reason}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 6. INTERACTIVE HIGH-RISK VS LOW-RISK FOOD CHECKER
// ============================================================================
const InteractiveHighLowRisk: React.FC<{ items: SlideHighLowItem[] }> = ({ items }) => {
  const [choices, setChoices] = useState<Record<number, 'High-Risk' | 'Low-Risk'>>({});

  return (
    <div className="rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-[#105E9A]">
          Interactive Activity — High-Risk vs Low-Risk Food Classification
        </span>
        <span className="text-[11px] font-bold text-slate-500">
          Consider Protein, Moisture (Aw), pH &amp; Ready-to-Eat Status
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {items.map((item, idx) => {
          const picked = choices[idx];
          const isCorrect = picked === item.risk;
          return (
            <div key={item.food} className="rounded-xl border border-[#D2DEEA] bg-white p-3 space-y-2">
              <div className="text-xs sm:text-sm font-bold text-[#1A2138]">{item.food}</div>
              <div className="flex gap-2">
                {(['High-Risk', 'Low-Risk'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setChoices((prev) => ({ ...prev, [idx]: r }))}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-extrabold transition cursor-pointer ${
                      picked === r
                        ? r === item.risk
                          ? 'border-emerald-500 bg-emerald-600 text-white'
                          : 'border-rose-500 bg-rose-600 text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-[#1673B8]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              {picked && (
                <p
                  className={`text-[11px] rounded-lg px-2.5 py-1.5 font-semibold ${
                    isCorrect ? 'bg-emerald-50 text-emerald-900' : 'bg-rose-50 text-rose-900'
                  }`}
                >
                  {isCorrect ? 'Correct — ' : `Actually ${item.risk} — `}
                  {item.reason}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// 7. INTERACTIVE 3x3 RISK ASSESSMENT MATRIX
// ============================================================================
const MATRIX_CELLS = [
  [
    {
      l: 3,
      s: 1,
      score: 3,
      band: 'Medium',
      tone: 'amber' as const,
      example: 'Frequent mild discomfort (e.g., harmless stalk/pip in fruit dessert).'
    },
    {
      l: 3,
      s: 2,
      score: 6,
      band: 'Significant (High)',
      tone: 'rose' as const,
      example: 'High likelihood of moderate gastroenteritis (e.g., cross-contamination of ready salad).'
    },
    {
      l: 3,
      s: 3,
      score: 9,
      band: 'Critical (High)',
      tone: 'rose' as const,
      example: 'Frequent life-threatening hazard (e.g., undercooked poultry / undeclared peanut).'
    }
  ],
  [
    {
      l: 2,
      s: 1,
      score: 2,
      band: 'Low (PRP)',
      tone: 'emerald' as const,
      example: 'Occasional nuisance foreign body causing no clinical injury.'
    },
    {
      l: 2,
      s: 2,
      score: 4,
      band: 'Medium',
      tone: 'amber' as const,
      example: 'Occasional moderate illness or chemical taint managed via tight SOPs/PRPs.'
    },
    {
      l: 2,
      s: 3,
      score: 6,
      band: 'Significant (High)',
      tone: 'rose' as const,
      example: 'Occasional severe injury (e.g., glass bottle breakage near open line or allergen mix-up).'
    }
  ],
  [
    {
      l: 1,
      s: 1,
      score: 1,
      band: 'Low (PRP)',
      tone: 'emerald' as const,
      example: 'Rare trivial quality defect; managed under standard housekeeping PRPs.'
    },
    {
      l: 1,
      s: 2,
      score: 2,
      band: 'Low (PRP)',
      tone: 'emerald' as const,
      example: 'Rare mild contamination; controlled through routine GMP & supplier checks.'
    },
    {
      l: 1,
      s: 3,
      score: 3,
      band: 'Medium (Review)',
      tone: 'amber' as const,
      example: 'Low probability yet severe harm (e.g., Botulism in vacuum packs) — review specific controls!'
    }
  ]
];

const InteractiveRiskMatrix: React.FC = () => {
  const [selected, setSelected] = useState<{ r: number; c: number }>({ r: 0, c: 2 });
  const cell = MATRIX_CELLS[selected.r][selected.c];

  return (
    <div className="rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-[#105E9A]">
          Interactive 3×3 Quantitative Risk Matrix (Likelihood × Severity)
        </span>
        <span className="text-[11px] font-bold text-slate-500">
          Score ≥ 6 = Significant Hazard (Proceed to CCP Decision Tree)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="text-[11px] font-black text-[#1A2138]">
              <th className="p-2 text-left bg-white border border-[#D2DEEA]">Likelihood ↓ / Severity →</th>
              <th className="p-2 text-center bg-white border border-[#D2DEEA]">1 · Low (Minor)</th>
              <th className="p-2 text-center bg-white border border-[#D2DEEA]">2 · Medium (Illness)</th>
              <th className="p-2 text-center bg-white border border-[#D2DEEA]">3 · High (Fatal / Severe)</th>
            </tr>
          </thead>
          <tbody>
            {['3 · High (Likely)', '2 · Medium (Possible)', '1 · Low (Rare)'].map((rowLabel, rIdx) => (
              <tr key={rowLabel}>
                <td className="p-2 font-bold text-[#1A2138] bg-white border border-[#D2DEEA]">
                  {rowLabel}
                </td>
                {MATRIX_CELLS[rIdx].map((c, cIdx) => {
                  const isActive = selected.r === rIdx && selected.c === cIdx;
                  const cellStyle =
                    c.tone === 'rose'
                      ? 'bg-rose-100 text-rose-950 hover:bg-rose-200'
                      : c.tone === 'amber'
                      ? 'bg-amber-100 text-amber-950 hover:bg-amber-200'
                      : 'bg-emerald-100 text-emerald-950 hover:bg-emerald-200';
                  return (
                    <td key={cIdx} className="p-1 border border-[#D2DEEA] bg-white">
                      <button
                        type="button"
                        onClick={() => setSelected({ r: rIdx, c: cIdx })}
                        className={`w-full rounded-lg p-2 text-center transition cursor-pointer font-extrabold tabular-nums ${cellStyle} ${
                          isActive ? 'ring-2 ring-[#1A2138]' : ''
                        }`}
                      >
                        Score {c.score} · {c.band}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-[#D2DEEA] bg-white p-3 text-xs space-y-1">
        <p className="font-black text-[#1A2138]">
          Selected Cell: Likelihood ({cell.l}) × Severity ({cell.s}) = Score {cell.score} — {cell.band}
        </p>
        <p className="text-slate-700 leading-relaxed">{cell.example}</p>
      </div>
    </div>
  );
};

// ============================================================================
// 8. INTERACTIVE CCP DECISION TREES (CODEX 4-QUESTION & SIMPLIFIED 3-Q)
// ============================================================================
interface DecisionScenario {
  stepName: string;
  hazard: string;
  q1: boolean;
  q2: boolean;
  q3: boolean;
  q4: boolean;
  verdict: 'CCP' | 'Not a CCP (Controlled by Subsequent Step)' | 'Not a CCP (Manage via PRP)';
  rationale: string;
}

const CODEX_SCENARIOS: DecisionScenario[] = [
  {
    stepName: 'Core Poultry Cooking (≥ 75°C)',
    hazard: 'Survival of Salmonella & Campylobacter',
    q1: true,
    q2: true,
    q3: true,
    q4: false,
    verdict: 'CCP',
    rationale:
      'Q1 = Yes (time/temp control) → Q2 = Yes (specifically designed to achieve ≥ 6-log pathogen kill with no later lethality step) → Mandatory CCP!'
  },
  {
    stepName: 'Chilled Raw Poultry Delivery (≤ 5°C)',
    hazard: 'Bacterial multiplication during transit',
    q1: true,
    q2: false,
    q3: true,
    q4: true,
    verdict: 'Not a CCP (Controlled by Subsequent Step)',
    rationale:
      'Q1 = Yes → Q2 = No (cold does not kill Salmonella) → Q3 = Yes (growth possible) → Q4 = Yes (Cooking ≥ 75°C later eliminates pathogens). Managed as PRP!'
  },
  {
    stepName: 'Metal Detection on Packed Sealed Ready Meals',
    hazard: 'Ferrous / non-ferrous / stainless metal fragments',
    q1: true,
    q2: true,
    q3: true,
    q4: false,
    verdict: 'CCP',
    rationale:
      'Q1 = Yes (calibrated detector + auto-reject) → Q2 = Yes (final barrier to detect & reject metal before dispatch) → CCP!'
  },
  {
    stepName: 'Cold-Chain Storage of Ready-to-Eat Cheesecake (≤ 5°C)',
    hazard: 'Growth of Listeria / toxin formation prior to service',
    q1: true,
    q2: false,
    q3: true,
    q4: false,
    verdict: 'CCP',
    rationale:
      'Q1 = Yes → Q2 = No (chilling slows growth, doesn’t kill) → Q3 = Yes (abuse allows toxin growth) → Q4 = No (served cold without further cooking!) → Critical CCP!'
  }
];

const InteractiveCcpDecisionTree: React.FC<{ mode: 'codex' | 'simple' }> = ({ mode }) => {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const sc = CODEX_SCENARIOS[scenarioIdx];

  return (
    <div className="rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <GitBranch className="w-4 h-4 text-[#1673B8]" />
          <span className="text-xs font-black uppercase tracking-wider text-[#105E9A]">
            {mode === 'codex'
              ? 'Interactive Codex 4-Question CCP Decision Tree'
              : 'Interactive Simplified 3-Question Decision Tree'}
          </span>
        </div>
        <span className="text-[11px] font-bold text-slate-500">Test a Step to Trace Path</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {CODEX_SCENARIOS.map((item, idx) => (
          <button
            key={item.stepName}
            type="button"
            onClick={() => setScenarioIdx(idx)}
            className={`text-left px-3 py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
              idx === scenarioIdx
                ? 'border-[#1673B8] bg-[#1673B8] text-white'
                : 'border-[#D2DEEA] bg-white text-[#1A2138] hover:border-[#1673B8]'
            }`}
          >
            {item.stepName}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[#D2DEEA] bg-white p-3.5 space-y-2.5 text-xs">
        <div className="font-bold text-slate-600">
          Evaluated Hazard: <span className="text-[#1A2138]">{sc.hazard}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="rounded-lg border border-slate-200 p-2.5 bg-slate-50">
            <span className="font-black text-[#105E9A]">Q1. Control measure exists?</span>
            <p className="mt-0.5 font-bold text-emerald-700">Answer: YES → Proceed to Q2</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-2.5 bg-slate-50">
            <span className="font-black text-[#105E9A]">Q2. Eliminates / reduces hazard to safe level?</span>
            <p className={`mt-0.5 font-bold ${sc.q2 ? 'text-emerald-700' : 'text-amber-800'}`}>
              Answer: {sc.q2 ? 'YES → CCP Identified!' : 'NO → Proceed to Q3'}
            </p>
          </div>
          {!sc.q2 && (
            <>
              <div className="rounded-lg border border-slate-200 p-2.5 bg-slate-50">
                <span className="font-black text-[#105E9A]">Q3. Contamination could occur / increase?</span>
                <p className={`mt-0.5 font-bold ${sc.q3 ? 'text-amber-800' : 'text-slate-600'}`}>
                  Answer: {sc.q3 ? 'YES → Proceed to Q4' : 'NO → Not a CCP (Stop)'}
                </p>
              </div>
              {mode === 'codex' && (
                <div className="rounded-lg border border-slate-200 p-2.5 bg-slate-50">
                  <span className="font-black text-[#105E9A]">Q4. Subsequent step eliminates hazard?</span>
                  <p className={`mt-0.5 font-bold ${sc.q4 ? 'text-sky-700' : 'text-rose-700'}`}>
                    Answer: {sc.q4 ? 'YES → Not a CCP' : 'NO → Critical Control Point (CCP)!'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div
          className={`rounded-lg px-3 py-2 font-extrabold flex items-center justify-between gap-2 ${
            sc.verdict === 'CCP'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
              : 'bg-sky-50 border border-sky-300 text-sky-900'
          }`}
        >
          <span>Outcome: {sc.verdict}</span>
        </div>
        <p className="text-slate-700 leading-relaxed">{sc.rationale}</p>
      </div>
    </div>
  );
};

// ============================================================================
// 9. FLOW DIAGRAM COMPONENT (LINEAR & MULTI-STREAM)
// ============================================================================
const FlowDiagramBlock: React.FC<{
  data: NonNullable<CoursePresentationSlide['flowDiagramData']>;
}> = ({ data }) => (
  <div className="rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] p-4 space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-xs font-black uppercase tracking-wider text-[#105E9A]">
        {data.title}
      </span>
      {data.isMultiStream && (
        <span className="text-[11px] font-bold text-slate-600">
          Multi-Stream Convergence Mapped
        </span>
      )}
    </div>

    <div className="space-y-1.5">
      {data.mainSteps.map((st, idx) => {
        const mergingStream = data.secondarySteps?.find((sec) => sec.joinAtIndex === idx);
        return (
          <React.Fragment key={st.step}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div
                className={`flex-1 rounded-xl border px-3.5 py-2.5 flex items-center justify-between gap-2 min-w-0 ${
                  st.isCcp
                    ? 'border-[#1673B8] bg-[#1673B8] text-white'
                    : 'border-[#D2DEEA] bg-white text-[#1A2138]'
                }`}
              >
                <div className="min-w-0">
                  <span className="text-xs font-black block leading-snug">
                    {idx + 1}. {st.step}
                  </span>
                  {st.note && (
                    <p
                      className={`text-[11px] mt-0.5 leading-snug ${
                        st.isCcp ? 'text-[#EBF4FC]' : 'text-slate-500'
                      }`}
                    >
                      {st.note}
                    </p>
                  )}
                </div>
                {st.isCcp && (
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shrink-0">
                    CCP
                  </span>
                )}
              </div>

              {mergingStream && (
                <div className="sm:w-64 flex items-center gap-1.5">
                  <ArrowRight className="w-4 h-4 text-[#1673B8] rotate-180 hidden sm:block shrink-0" />
                  <div className="flex-1 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 min-w-0">
                    <span className="text-[11px] font-black text-amber-900 block leading-snug">
                      + Stream: {mergingStream.step}
                    </span>
                    {mergingStream.note && (
                      <span className="text-[10px] text-amber-800 block leading-snug">
                        {mergingStream.note}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {idx < data.mainSteps.length - 1 && (
              <div className="pl-6 py-0.5">
                <ArrowDown className="w-4 h-4 text-[#1673B8]" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

// ============================================================================
// 10. INTERACTIVE REVISION DEFINITION MATCH DRILL
// ============================================================================
const DefinitionMatchBlock: React.FC<{
  items: NonNullable<CoursePresentationSlide['definitionMatchDrill']>;
}> = ({ items }) => {
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const allShown = items.every((_, idx) => revealed[idx]);

  return (
    <div className="rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-[#105E9A]">
          Revision Drill — Recall &amp; Reveal Official Definitions
        </span>
        <button
          type="button"
          onClick={() => {
            const next: Record<number, boolean> = {};
            items.forEach((_, idx) => {
              next[idx] = !allShown;
            });
            setRevealed(next);
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#D2DEEA] text-[11px] font-extrabold text-[#105E9A] hover:bg-slate-50 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          {allShown ? 'Hide All Definitions' : 'Reveal All Definitions'}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#D2DEEA] bg-white">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-[#F4F8FD] border-b border-[#D2DEEA] text-left">
              <th className="p-2.5 font-black text-[#105E9A] w-1/3">Key Term</th>
              <th className="p-2.5 font-black text-[#105E9A]">Official / Exam Definition</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row, idx) => {
              const isOpen = !!revealed[idx];
              return (
                <tr key={row.term} className="border-b last:border-b-0 border-slate-100">
                  <td className="p-2.5 font-extrabold text-[#1A2138] align-top">
                    {row.term}
                  </td>
                  <td className="p-2.5 text-slate-700 align-top">
                    {isOpen ? (
                      <span>{row.definition}</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setRevealed((p) => ({ ...p, [idx]: true }))}
                        className="inline-flex items-center gap-1 text-[#1673B8] font-bold hover:underline cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        Test yourself first, then click to reveal definition
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// 11. MASTER SLIDE RICH VISUAL DISPATCHER
// ============================================================================
export const HaccpDemoSlideVisuals: React.FC<{ slide: CoursePresentationSlide }> = ({
  slide
}) => {
  const hasAnyExtra =
    slide.trainerCard ||
    slide.visualIllustration ||
    slide.calloutBanner ||
    slide.twoColumns ||
    slide.tableBlock ||
    slide.documentTemplateBlock ||
    slide.prpProceduresBlock ||
    slide.germometerInteractive ||
    slide.riskMatrixHighlight ||
    slide.flowDiagramData ||
    slide.classifierDrill ||
    slide.highLowRiskDrill ||
    slide.definitionMatchDrill;

  if (!hasAnyExtra) return null;

  return (
    <div className="space-y-4">
      {/* Instructor Bio Card */}
      {slide.trainerCard && (
        <div className="rounded-xl border border-[#BFD7ED] bg-[#F4F8FD] p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <SlideSvgArtwork type="instructor-profile" />
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-black text-[#1A2138]">
                {slide.trainerCard.name}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#1673B8] text-white text-[11px] font-bold">
                <Award className="w-3 h-3" />
                {slide.trainerCard.experience}
              </span>
            </div>
            <p className="text-xs font-bold text-[#105E9A]">{slide.trainerCard.credential}</p>
            <p className="text-xs text-slate-700 leading-relaxed">
              {slide.trainerCard.introNote}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {slide.trainerCard.specialties.map((sp) => (
                <span
                  key={sp}
                  className="px-2 py-0.5 rounded-md border border-[#D2DEEA] bg-white text-[11px] font-semibold text-[#1A2138]"
                >
                  {sp}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Responsive Diagrams & Artwork */}
      {slide.visualIllustration && slide.visualIllustration !== 'instructor-profile' && (
        <SlideSvgArtwork type={slide.visualIllustration} />
      )}

      {/* Highlighted Callout / Definition Box */}
      {slide.calloutBanner && (
        <div
          className={`rounded-xl border p-3.5 flex items-start gap-2.5 ${
            TONE_MAP[slide.calloutBanner.tone || 'blue'].border
          } ${TONE_MAP[slide.calloutBanner.tone || 'blue'].bg}`}
        >
          <ShieldCheck
            className={`w-4 h-4 shrink-0 mt-0.5 ${
              TONE_MAP[slide.calloutBanner.tone || 'blue'].heading
            }`}
          />
          <div className="space-y-0.5 min-w-0">
            <span
              className={`text-[11px] font-black uppercase tracking-wider block ${
                TONE_MAP[slide.calloutBanner.tone || 'blue'].heading
              }`}
            >
              {slide.calloutBanner.label}
            </span>
            <p
              className={`text-xs sm:text-sm font-semibold leading-relaxed ${
                TONE_MAP[slide.calloutBanner.tone || 'blue'].text
              }`}
            >
              {slide.calloutBanner.text}
            </p>
          </div>
        </div>
      )}

      {/* Two-Column Structured Comparison */}
      {slide.twoColumns && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              title: slide.twoColumns.leftTitle,
              items: slide.twoColumns.leftItems,
              tone: TONE_MAP[slide.twoColumns.leftTone || 'blue']
            },
            {
              title: slide.twoColumns.rightTitle,
              items: slide.twoColumns.rightItems,
              tone: TONE_MAP[slide.twoColumns.rightTone || 'amber']
            }
          ].map((col) => (
            <div
              key={col.title}
              className={`rounded-xl border ${col.tone.border} ${col.tone.bg} p-3.5 space-y-2`}
            >
              <div className={`text-xs font-black uppercase tracking-wider ${col.tone.heading}`}>
                {col.title}
              </div>
              <ul className="space-y-1.5">
                {col.items.map((it) => (
                  <li
                    key={it}
                    className={`flex items-start gap-2 text-xs leading-relaxed font-medium ${col.tone.text}`}
                  >
                    <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-75" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Controlled Sample HACCP Document Template */}
      {slide.documentTemplateBlock && (
        <DocumentTemplateCard doc={slide.documentTemplateBlock} />
      )}

      {/* Interactive PRP Standard Operating Procedures */}
      {slide.prpProceduresBlock && slide.prpProceduresBlock.length > 0 && (
        <PrpProcedureShowcase items={slide.prpProceduresBlock} />
      )}

      {/* Structured Tabular Data Table */}
      {slide.tableBlock && (
        <div className="rounded-xl border border-[#D2DEEA] bg-white overflow-hidden">
          {slide.tableBlock.caption && (
            <div className="bg-[#F4F8FD] border-b border-[#D2DEEA] px-3.5 py-2 flex items-center gap-2 text-xs font-black text-[#105E9A]">
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>{slide.tableBlock.caption}</span>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse tabular-nums">
              <thead>
                <tr className="bg-[#F4F8FD] border-b border-[#D2DEEA] text-left">
                  {slide.tableBlock.headers.map((hdr) => (
                    <th key={hdr} className="p-2.5 font-black text-[#1A2138]">
                      {hdr}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slide.tableBlock.rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="border-b last:border-b-0 border-slate-100 hover:bg-slate-50/70"
                  >
                    {row.map((cell, cIdx) => (
                      <td
                        key={cIdx}
                        className={`p-2.5 align-top leading-relaxed ${
                          cIdx === 0 ? 'font-bold text-[#105E9A]' : 'text-slate-700'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Widgets */}
      {slide.germometerInteractive && <InteractiveGermometer />}
      {slide.riskMatrixHighlight && <InteractiveRiskMatrix />}
      {slide.visualIllustration === 'ccp-tree-codex' && (
        <InteractiveCcpDecisionTree mode="codex" />
      )}
      {slide.visualIllustration === 'ccp-tree-simple' && (
        <InteractiveCcpDecisionTree mode="simple" />
      )}
      {slide.flowDiagramData && <FlowDiagramBlock data={slide.flowDiagramData} />}
      {slide.classifierDrill && <InteractiveHazardClassifier items={slide.classifierDrill} />}
      {slide.highLowRiskDrill && <InteractiveHighLowRisk items={slide.highLowRiskDrill} />}
      {slide.definitionMatchDrill && (
        <DefinitionMatchBlock items={slide.definitionMatchDrill} />
      )}
      {slide.visualIllustration === 'failure-causes' && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3.5 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-rose-950 leading-relaxed">
            Audit Reality Check: Most HACCP failures stem from unverified flow diagrams, copying generic templates without site adaptation, classifying too many CCPs (monitoring fatigue), or lack of visible management commitment.
          </p>
        </div>
      )}
    </div>
  );
};

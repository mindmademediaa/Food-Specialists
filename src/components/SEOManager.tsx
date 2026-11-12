import React, { useEffect } from 'react';
import { Calculator, GraduationCap, Briefcase, Globe, ShieldCheck } from 'lucide-react';
import { ActiveToolSection } from './ToolsHubView';
import { INTERNATIONAL_TRAINING_COURSES } from '../data/internationalTrainingsData';

export interface SEOManagerProps {
  routeName: string;
  activeToolSection?: string;
}

const TOOL_SEO_METADATA: Record<
  string,
  { title: string; description: string }
> = {
  hub: {
    title:
      'Food Science & QA/QC Calculators Hub — Pearson Square, Brix, Molarity, OEE & ANOVA | Food Science Portal',
    description:
      'Access 11+ industrial Food Science & QA/QC Calculators: Pearson Square Batch Standardization, Sanitizer PPM Dilution, Titratable Acidity, Molarity, Moisture/Ash Yield, Production OEE, Thesis Converter, ANOVA & Halal E-Numbers.'
  },
  'lab-formula': {
    title:
      'Lab Sanitizer PPM Dilution, Titratable Acidity & Brix:Acid Ratio Calculator | Food Science Portal',
    description:
      'Calculate sanitizer PPM dilution batches (Sodium Hypochlorite, QAC, PAA) and Titratable Acidity / Brix:Acid Ratio for juices, dairy, and food laboratories.'
  },
  'pearson-square': {
    title:
      'Pearson Square & Multi-Industry Batch Standardization Calculator (Dairy Fat/SNF, Brix, pH) | Food Science Portal',
    description:
      'Standardize Dairy Milk Fat & SNF, Juice & Beverage Brix/Acidity/pH, Bakery, Ketchup, and Mayonnaise batches using the industrial Pearson Square Calculator.'
  },
  'molarity-normality': {
    title:
      'Lab Solution Molarity, Normality & Acid/Base Dilution Calculator | Food Science Portal',
    description:
      'Prepare accurate laboratory reagent solutions with Molarity (M), Normality (N), W/V %, and C1V1=C2V2 stock dilution calculations for food analysis.'
  },
  'moisture-ash': {
    title:
      'Moisture, Total Ash, Dry Matter & Process Yield Calculator | Food Science Portal',
    description:
      'Calculate wet-basis and dry-basis moisture content, total ash percentage, dry matter, and industrial food processing yield.'
  },
  'production-floor': {
    title:
      'Production Line Net Efficiency (1-Hour & Full-Day OEE), Syrup Room Yield & Worker Calculator | Food Science Portal',
    description:
      'Calculate 1-Hour Line Efficiency, Full-Day Net Production Efficiency (including late start, breaks & CIP downtime), Syrup Room Batch Yield & Waste, and Labor Productivity.'
  },
  'citation-generator': {
    title:
      'Research Paper, Thesis-to-Journal Converter, Statistical One-Way ANOVA & Citation Suite | Food Science Portal',
    description:
      'Convert MSc/PhD Food Science theses to target journal formats, run One-Way ANOVA & Tukey HSD statistical tests, and format APA/Harvard/IEEE/Vancouver references.'
  },
  'e-numbers': {
    title:
      'Halal & Food Additive E-Numbers Instant Finder (Codex INS Status & Functions) | Food Science Portal',
    description:
      'Search E-Numbers (E100–E1599) for Halal/Haram/Mushbooh status, functional class, ADI safety limits, and Codex Alimentarius regulatory approval.'
  },
  nutrition: {
    title:
      'Nutrition Facts, BMI/TDEE & Diet Planning Calculator | Food Science Portal',
    description:
      'Calculate BMR, TDEE, BMI, daily macronutrient targets, and clinical meal plans for nutritionists and dietary specialists.'
  },
  exam: {
    title:
      'Food Safety, HACCP & Food Science Exam Prep (2,000+ MCQs Bank) | Food Science Portal',
    description:
      'Practice 2,000+ MCQs for PPSC, FPSC, Food Safety Officer, Highfield HACCP, ISO 22000, Dairy, Cereal, and Meat Technology exams.'
  },
  interview: {
    title:
      'QA/QC, Production & Food Technologist Interview Prep Bank | Food Science Portal',
    description:
      'Prepare for Food Industry QA/QC, R&D, Production, and Regulatory Affairs job interviews with model answers and technical scenarios.'
  },
  'job-cover-letter': {
    title:
      'Food Technologist & QA/QC Job Application Email & Cover Letter Generator | Food Science Portal',
    description:
      'Generate tailored job application emails and cover letters for QA/QC Officer, Food Technologist, R&D, and HSE roles.'
  }
};

const ROUTE_SEO_METADATA: Record<
  string,
  { title: string; description: string; sectionParam?: string }
> = {
  home: {
    title:
      'Food Science Portal — QA/QC Calculators, HACCP & ISO Trainings, Jobs & Scholarships',
    description:
      'Food Science Portal — Free Food Safety & QA/QC Calculators (Pearson Square, Brix Acid Ratio, Molarity, OEE Yield, ANOVA), 13 Accredited HACCP/ISO/BRCGS Certifications, Jobs & Scholarships.'
  },
  jobs: {
    title:
      'Food Science, QA/QC, Production & Nutritionist Jobs Portal | Food Science Portal',
    description:
      'Browse verified Food Technologist, QA/QC Officer, Food Safety Auditor, R&D, Production Supervisor, and Nutritionist jobs across Pakistan, Gulf, UK & Europe.',
    sectionParam: 'jobs'
  },
  scholarships: {
    title:
      'Fully Funded Food Science, Agriculture & Nutrition Scholarships (MSc/PhD) | Food Science Portal',
    description:
      'Explore Erasmus Mundus, Fulbright, CSC, DAAD, Commonwealth, and global fully funded MSc & PhD scholarships in Food Science and Nutrition.',
    sectionParam: 'scholarships'
  },
  trainings: {
    title:
      'Accredited Food Safety, HACCP Level 3 & 4, ISO 22000, FSSC v7 & BRCGS Issue 9 Courses | Food Science Portal',
    description:
      'Free online study & exam for 13 certifications: Certified Dietary Manager, HACCP Level 03 & 04, Food Safety Level 03 & 04, ISO 9001, ISO 22000, FSSC 22000 v7, BRCGS Issue 09, ISO 14001, ISO 45001, MS Office & English.',
    sectionParam: 'trainings'
  },
  communities: {
    title:
      'Verified Food Science & QA/QC Specialists Directory & Community | Food Science Portal',
    description:
      'Connect with verified Food Technologists, QA/QC Managers, Lead Auditors, Nutritionists, and Academic Researchers on Food Science Portal.',
    sectionParam: 'communities'
  },
  search: {
    title:
      'Search Food Science Calculators, Trainings, Jobs & Scholarships | Food Science Portal',
    description:
      'Search across all Food Science Portal tools, accredited certification trainings, jobs, scholarships, and verified specialists.',
    sectionParam: 'search'
  }
};

function upsertMetaTag(
  attrName: 'name' | 'property',
  attrValue: string,
  content: string
) {
  if (typeof document === 'undefined') return;
  let el = document.querySelector(
    `meta[${attrName}="${attrValue}"]`
  ) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonicalLink(url: string) {
  if (typeof document === 'undefined') return;
  let link = document.querySelector(
    'link[rel="canonical"]'
  ) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export const SEOManager: React.FC<SEOManagerProps> = ({
  routeName,
  activeToolSection = 'hub'
}) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const verifyParam = params.get('verify') || params.get('cert');
    const courseParam = params.get('course');

    let seo = ROUTE_SEO_METADATA[routeName] || ROUTE_SEO_METADATA.home;

    if (routeName === 'tools') {
      seo = TOOL_SEO_METADATA[activeToolSection] || TOOL_SEO_METADATA.hub;
    } else if (routeName === 'trainings' && courseParam) {
      const matchedCourse = INTERNATIONAL_TRAINING_COURSES.find(
        (c) =>
          c.id.toLowerCase() === courseParam.toLowerCase() ||
          c.code.toLowerCase() === courseParam.toLowerCase()
      );
      if (matchedCourse) {
        seo = {
          title: `${matchedCourse.title} (${matchedCourse.code}) — Free 05-Module Presentation Course & Exam | Food Science Portal`,
          description: matchedCourse.description
        };
      }
    }

    document.title = seo.title;
    upsertMetaTag('name', 'description', seo.description);
    upsertMetaTag('property', 'og:title', seo.title);
    upsertMetaTag('property', 'og:description', seo.description);
    upsertMetaTag('name', 'twitter:title', seo.title);
    upsertMetaTag('name', 'twitter:description', seo.description);

    // Keep URL clean and indexable without overwriting QR verification URLs
    if (!verifyParam) {
      const nextParams = new URLSearchParams();
      if (routeName === 'tools') {
        nextParams.set('section', 'tools');
        if (activeToolSection && activeToolSection !== 'hub') {
          nextParams.set('tool', activeToolSection);
        }
      } else if (routeName === 'trainings') {
        nextParams.set('section', 'trainings');
        if (courseParam) {
          nextParams.set('course', courseParam);
        }
      } else if (ROUTE_SEO_METADATA[routeName]?.sectionParam) {
        nextParams.set('section', ROUTE_SEO_METADATA[routeName].sectionParam!);
      }

      const queryString = nextParams.toString();
      const cleanUrl = `${window.location.origin}${window.location.pathname}${
        queryString ? `?${queryString}` : ''
      }`;
      upsertCanonicalLink(cleanUrl);
      upsertMetaTag('property', 'og:url', cleanUrl);

      try {
        window.history.replaceState({}, '', cleanUrl);
      } catch {
        // Ignore history errors in restricted iframes
      }
    }
  }, [routeName, activeToolSection]);

  return null;
};

interface SEODirectoryFooterProps {
  onOpenTool: (tool: ActiveToolSection) => void;
  onOpenCourse: (courseId: string) => void;
  onNavigateSection: (
    section: 'jobs' | 'scholarships' | 'tools' | 'trainings' | 'communities'
  ) => void;
}

export const SEODirectoryFooter: React.FC<SEODirectoryFooterProps> = ({
  onOpenTool,
  onOpenCourse,
  onNavigateSection
}) => {
  const toolLinks: Array<{ id: ActiveToolSection; label: string }> = [
    {
      id: 'pearson-square',
      label: 'Pearson Square & Multi-Industry Batch Standardizer (Dairy, Juice, Bakery, Sauces)'
    },
    {
      id: 'lab-formula',
      label: 'Sanitizer PPM Dilution, Titratable Acidity & Brix:Acid Ratio Calculator'
    },
    {
      id: 'production-floor',
      label: 'Production Line 1-Hour & Full-Day Net Efficiency (OEE) & Syrup Yield Calculator'
    },
    {
      id: 'citation-generator',
      label: 'Research Paper, Thesis-to-Journal Converter, One-Way ANOVA & Citation Suite'
    },
    {
      id: 'molarity-normality',
      label: 'Lab Solution Molarity (M), Normality (N) & Stock Dilution Calculator'
    },
    {
      id: 'moisture-ash',
      label: 'Moisture %, Total Ash %, Dry Matter & Process Yield Calculator'
    },
    {
      id: 'e-numbers',
      label: 'Halal & Food Additive E-Numbers Instant Finder (E100–E1599)'
    },
    {
      id: 'nutrition',
      label: 'Clinical Nutrition, BMI, BMR/TDEE & Diet Plan Calculator'
    },
    {
      id: 'exam',
      label: 'Food Science & Food Safety Officer Exam Prep (2,000+ MCQs)'
    },
    {
      id: 'interview',
      label: 'QA/QC, Production & Food Technologist Interview Prep Bank'
    },
    {
      id: 'job-cover-letter',
      label: 'Food Industry Job Email & Cover Letter Generator'
    }
  ];

  return (
    <footer
      aria-label="Food Science Portal SEO Directory & Sitemap"
      className="sr-only"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-sm sm:text-base font-black text-[#0C182D] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#1673B8]" />
            <span>
              Food Science Portal — Public Tools, Calculators &amp; Accredited Courses Directory
            </span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Direct public access to all industrial QA/QC calculators, laboratory formulation tools, and 13 international certification courses.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F0F6FC] border border-[#D2DEEA] text-[#1673B8] text-[11px] font-extrabold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Public Search Indexed</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Industrial Calculators & Tools */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1673B8] flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5" />
            <span>Food Science &amp; QA/QC Calculators</span>
          </h3>
          <ul className="space-y-1.5">
            {toolLinks.map((t) => (
              <li key={t.id}>
                <a
                  href={`?section=tools&tool=${t.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenTool(t.id);
                  }}
                  className="text-xs font-semibold text-slate-700 hover:text-[#1673B8] hover:underline block leading-snug"
                >
                  • {t.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: 13 Accredited Certification Courses */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1673B8] flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>13 Accredited Training Courses (05 Modules + 40 MCQs)</span>
          </h3>
          <ul className="space-y-1.5">
            {INTERNATIONAL_TRAINING_COURSES.map((course) => (
              <li key={course.id}>
                <a
                  href={`?section=trainings&course=${course.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenCourse(course.id);
                  }}
                  className="text-xs font-semibold text-slate-700 hover:text-[#1673B8] hover:underline block leading-snug"
                >
                  • {course.title} ({course.code})
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Career Portal, Scholarships & Verification */}
        <div className="space-y-2">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1673B8] flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Careers, Global Grants &amp; Registry</span>
          </h3>
          <ul className="space-y-1.5 text-xs font-semibold text-slate-700">
            <li>
              <a
                href="?section=jobs"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateSection('jobs');
                }}
                className="hover:text-[#1673B8] hover:underline block"
              >
                • Food Technologist, QA/QC &amp; Nutritionist Jobs Portal
              </a>
            </li>
            <li>
              <a
                href="?section=scholarships"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateSection('scholarships');
                }}
                className="hover:text-[#1673B8] hover:underline block"
              >
                • Fully Funded MSc &amp; PhD Food Science Scholarships
              </a>
            </li>
            <li>
              <a
                href="?section=trainings"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateSection('trainings');
                }}
                className="hover:text-[#1673B8] hover:underline block"
              >
                • Online QR Certificate Verification Registry
              </a>
            </li>
            <li>
              <a
                href="?section=communities"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateSection('communities');
                }}
                className="hover:text-[#1673B8] hover:underline block"
              >
                • Verified Food Safety &amp; QA/QC Specialists Directory
              </a>
            </li>
            <li>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-[#1673B8] hover:underline block pt-1"
              >
                • XML Sitemap for Google Search Console (/sitemap.xml)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

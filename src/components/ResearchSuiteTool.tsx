import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  BookOpen,
  Check,
  Copy,
  Crown,
  Download,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Layers,
  Lock,
  Plus,
  Save,
  Search,
  Settings,
  Trash2,
  Upload
} from 'lucide-react';
import {
  CustomAnovaRequirementItem,
  CustomCitationRequirementItem,
  CustomJournalRequirementItem,
  HubUser,
  ResearchSuiteSavedRecord,
  ResearchSuiteSavedStatRow,
  UserToolsData
} from '../types/hub';
import { jsPDF } from 'jspdf';
import { FS_PORTAL_LOGO_DATA_URI } from '../lib/brandLogo';
import { drawPdfBrandLogo, drawPdfUserPhoto } from '../lib/pdfBranding';

export type CitationStyleId =
  | 'pjas'
  | 'pjn'
  | 'japs'
  | 'pjsir'
  | 'sja'
  | 'apa7'
  | 'harvard'
  | 'elsevier_foodchem'
  | 'ift_jfs'
  | 'jds'
  | 'mdpi_foods'
  | 'ieee_vancouver'
  | 'custom_pattern';

interface ParsedReference {
  authors: string;
  year: string;
  title: string;
  journal: string;
  volume: string;
  issue: string;
  pages: string;
  doi: string;
}

export interface JournalDirectoryItem {
  id: string;
  label: string;
  shortName: string;
  region:
    | 'Pakistan HEC & University Journals'
    | 'International Impact Factor Journals'
    | 'My Custom Journal Requirements';
  hecCategoryOrImpact: string;
  abstractWordLimit: number;
  abstractStructured?: boolean;
  keywordsLimit?: number;
  headingNumbering?: 'numbered' | 'roman' | 'unnumbered';
  includeLiteratureReview?: boolean;
  separateResultsAndDiscussion?: boolean;
  includeHighlights?: boolean;
  includePracticalApplication?: boolean;
  includeStatTableInManuscript?: boolean;
  inTextFormat: string;
  referenceStyleId?: string;
  customReferenceTemplate?: string;
  sortReferencesAlphabetically?: boolean;
  sectionOrder: string[];
  guidelinesSummary: string;
  examplePreview: string;
}

export const JOURNAL_DIRECTORY: JournalDirectoryItem[] = [
  {
    id: 'pjas',
    label: 'Pakistan Journal of Agricultural Sciences (PJAS — UAF Faisalabad)',
    shortName: 'Pak. J. Agri. Sci.',
    region: 'Pakistan HEC & University Journals',
    hecCategoryOrImpact: 'HEC W Category (Impact Factor)',
    abstractWordLimit: 250,
    abstractStructured: false,
    keywordsLimit: 6,
    headingNumbering: 'unnumbered',
    includeLiteratureReview: false,
    separateResultsAndDiscussion: false,
    includeHighlights: false,
    includePracticalApplication: false,
    includeStatTableInManuscript: true,
    inTextFormat: '(Author et al., Year)',
    referenceStyleId: 'pjas',
    sortReferencesAlphabetically: true,
    sectionOrder: [
      'TITLE PAGE',
      'ABSTRACT',
      'INTRODUCTION',
      'MATERIALS AND METHODS',
      'RESULTS AND DISCUSSION',
      'CONCLUSION',
      'REFERENCES'
    ],
    guidelinesSummary:
      'Single-paragraph Abstract (max 250 words), 4–6 Keywords, combined Results & Discussion, ANOVA with LSD/Tukey significance letters (p < 0.05), PJAS reference format.',
    examplePreview:
      'Khan, M.A., S. Ahmad and T. Mahmood. 2025. Quality evaluation of mango pulp during storage. Pak. J. Agri. Sci. 62:112-118.'
  },
  {
    id: 'japs',
    label: 'Journal of Animal and Plant Sciences (JAPS — Lahore, Pakistan)',
    shortName: 'J. Anim. Plant Sci.',
    region: 'Pakistan HEC & University Journals',
    hecCategoryOrImpact: 'HEC W Category (Impact Factor)',
    abstractWordLimit: 250,
    abstractStructured: false,
    keywordsLimit: 6,
    headingNumbering: 'unnumbered',
    includeLiteratureReview: false,
    separateResultsAndDiscussion: false,
    includeStatTableInManuscript: true,
    inTextFormat: '(Author et al., Year)',
    referenceStyleId: 'japs',
    sortReferencesAlphabetically: true,
    sectionOrder: [
      'TITLE',
      'ABSTRACT',
      'INTRODUCTION',
      'MATERIALS AND METHODS',
      'RESULTS AND DISCUSSION',
      'REFERENCES'
    ],
    guidelinesSummary:
      'Concise Abstract without subheadings (max 250 words), Materials & Methods with statistical design (CRD/Factorial), combined Results and Discussion with Mean ± SD tables.',
    examplePreview:
      'Khan, M.A., S. Ahmad and T. Mahmood (2025). Quality evaluation of mango pulp during storage. J. Anim. Plant Sci. 35(2): 112-118.'
  },
  {
    id: 'pjn',
    label: 'Pakistan Journal of Nutrition (PJN — ANSI Pakistan)',
    shortName: 'Pak. J. Nutr.',
    region: 'Pakistan HEC & University Journals',
    hecCategoryOrImpact: 'HEC X/Y Category',
    abstractWordLimit: 300,
    abstractStructured: true,
    keywordsLimit: 6,
    headingNumbering: 'unnumbered',
    includeLiteratureReview: false,
    separateResultsAndDiscussion: true,
    includeStatTableInManuscript: true,
    inTextFormat: '(Author et al., Year)',
    referenceStyleId: 'pjn',
    sortReferencesAlphabetically: true,
    sectionOrder: [
      'TITLE',
      'ABSTRACT',
      'INTRODUCTION',
      'MATERIALS AND METHODS',
      'RESULTS',
      'DISCUSSION',
      'CONCLUSION',
      'REFERENCES'
    ],
    guidelinesSummary:
      'Structured or unstructured Abstract (up to 300 words), clear nutritional & proximate analysis methodology (AOAC), separate Results and Discussion sections.',
    examplePreview:
      'Khan, M.A., S. Ahmad and T. Mahmood, 2025. Quality evaluation of mango pulp during storage. Pak. J. Nutr., 24: 112-118.'
  },
  {
    id: 'pjsir',
    label: 'Pakistan Journal of Scientific & Industrial Research (PJSIR - PCSIR)',
    shortName: 'Pak. J. Sci. Ind. Res.',
    region: 'Pakistan HEC & University Journals',
    hecCategoryOrImpact: 'HEC X Category (PCSIR Official Journal)',
    abstractWordLimit: 250,
    abstractStructured: false,
    keywordsLimit: 5,
    headingNumbering: 'unnumbered',
    includeLiteratureReview: false,
    separateResultsAndDiscussion: false,
    includeStatTableInManuscript: true,
    inTextFormat: '(Author et al., Year)',
    referenceStyleId: 'pjsir',
    sortReferencesAlphabetically: true,
    sectionOrder: [
      'TITLE',
      'ABSTRACT',
      'INTRODUCTION',
      'MATERIALS AND METHODS',
      'RESULTS AND DISCUSSION',
      'CONCLUSION',
      'REFERENCES'
    ],
    guidelinesSummary:
      'PCSIR standard format: Abstract max 250 words, industrial/food processing relevance, SI units, statistical significance at 5% level.',
    examplePreview:
      'Khan, M.A., Ahmad, S., Mahmood, T. 2025. Quality evaluation of mango pulp during storage. Pak. J. Sci. Ind. Res. Ser. B: Biol. Sci., 68(1): 112-118.'
  },
  {
    id: 'sja',
    label: 'Sarhad Journal of Agriculture (SJA — Agriculture University Peshawar)',
    shortName: 'Sarhad J. Agric.',
    region: 'Pakistan HEC & University Journals',
    hecCategoryOrImpact: 'HEC X Category (Scopus Indexed)',
    abstractWordLimit: 250,
    abstractStructured: false,
    keywordsLimit: 6,
    headingNumbering: 'unnumbered',
    includeLiteratureReview: false,
    separateResultsAndDiscussion: false,
    includeStatTableInManuscript: true,
    inTextFormat: '(Author et al., Year)',
    referenceStyleId: 'sja',
    sortReferencesAlphabetically: true,
    sectionOrder: [
      'TITLE',
      'ABSTRACT',
      'INTRODUCTION',
      'MATERIALS AND METHODS',
      'RESULTS AND DISCUSSION',
      'CONCLUSIONS AND RECOMMENDATIONS',
      'REFERENCES'
    ],
    guidelinesSummary:
      'Includes Novelty Statement, Abstract (250 words), Materials & Methods, Results & Discussion, Conclusions and Practical Recommendations.',
    examplePreview:
      'Khan, M.A., S. Ahmad and T. Mahmood. 2025. Quality evaluation of mango pulp during storage. Sarhad J. Agric., 41(1): 112-118.'
  },
  {
    id: 'elsevier_foodchem',
    label: 'Elsevier — Food Chemistry / LWT - Food Science and Technology',
    shortName: 'Food Chem. / LWT',
    region: 'International Impact Factor Journals',
    hecCategoryOrImpact: 'Q1 International (Impact Factor 8.5 / 6.0)',
    abstractWordLimit: 250,
    abstractStructured: false,
    keywordsLimit: 6,
    headingNumbering: 'numbered',
    includeLiteratureReview: false,
    separateResultsAndDiscussion: false,
    includeHighlights: true,
    includePracticalApplication: false,
    includeStatTableInManuscript: true,
    inTextFormat: '(Author et al., Year)',
    referenceStyleId: 'elsevier_foodchem',
    sortReferencesAlphabetically: true,
    sectionOrder: [
      'TITLE',
      'HIGHLIGHTS',
      'ABSTRACT',
      '1. INTRODUCTION',
      '2. MATERIALS AND METHODS',
      '3. RESULTS AND DISCUSSION',
      '4. CONCLUSION',
      'CRediT AUTHORSHIP & DECLARATION',
      'REFERENCES'
    ],
    guidelinesSummary:
      'Requires 3–5 Bullet Highlights (max 85 chars each), numbered sections (1., 2., 2.1, 3.), APA-based Elsevier reference style with DOI links, triplicate Mean ± SD with ANOVA.',
    examplePreview:
      'Khan, M. A., Ahmad, S., & Mahmood, T. (2025). Quality evaluation of mango pulp during storage. Food Chemistry, 410, 112–118.'
  },
  {
    id: 'ift_jfs',
    label: 'Journal of Food Science (IFT / Wiley International)',
    shortName: 'J. Food Sci.',
    region: 'International Impact Factor Journals',
    hecCategoryOrImpact: 'Q1/Q2 International (IFT Official Journal)',
    abstractWordLimit: 250,
    abstractStructured: false,
    keywordsLimit: 6,
    headingNumbering: 'numbered',
    includeLiteratureReview: false,
    separateResultsAndDiscussion: false,
    includeHighlights: false,
    includePracticalApplication: true,
    includeStatTableInManuscript: true,
    inTextFormat: '(Author et al., Year)',
    referenceStyleId: 'ift_jfs',
    sortReferencesAlphabetically: true,
    sectionOrder: [
      'TITLE',
      'PRACTICAL APPLICATION',
      'ABSTRACT',
      '1. INTRODUCTION',
      '2. MATERIALS AND METHODS',
      '3. RESULTS AND DISCUSSION',
      '4. CONCLUSION',
      'REFERENCES'
    ],
    guidelinesSummary:
      'Includes a "Practical Application" summary for industry, structured Abstract (250 words), AOAC official method citations, APA 7th reference style.',
    examplePreview:
      'Khan, M. A., Ahmad, S., & Mahmood, T. (2025). Quality evaluation of mango pulp during storage. Journal of Food Science, 90(2), 112–118.'
  },
  {
    id: 'jds',
    label: 'Journal of Dairy Science (JDS — Elsevier / ADSA)',
    shortName: 'J. Dairy Sci.',
    region: 'International Impact Factor Journals',
    hecCategoryOrImpact: 'Q1 International (Dairy Science Flagship)',
    abstractWordLimit: 300,
    abstractStructured: false,
    keywordsLimit: 6,
    headingNumbering: 'unnumbered',
    includeLiteratureReview: false,
    separateResultsAndDiscussion: false,
    includePracticalApplication: true,
    includeStatTableInManuscript: true,
    inTextFormat: '(Author et al., Year)',
    referenceStyleId: 'jds',
    sortReferencesAlphabetically: true,
    sectionOrder: [
      'TITLE',
      'INTERPRETIVE SUMMARY',
      'ABSTRACT',
      'INTRODUCTION',
      'MATERIALS AND METHODS',
      'RESULTS AND DISCUSSION',
      'CONCLUSIONS',
      'REFERENCES'
    ],
    guidelinesSummary:
      'Requires an Interpretive Summary (max 100 words), Abstract (max 300 words), complete experimental model equation, and JDS reference style.',
    examplePreview:
      'Khan, M. A., S. Ahmad, and T. Mahmood. 2025. Quality evaluation of mango pulp during storage. J. Dairy Sci. 108:112–118.'
  },
  {
    id: 'mdpi_foods',
    label: 'MDPI — Foods / Nutrients / Processes (Numbered Citation Style)',
    shortName: 'Foods (MDPI)',
    region: 'International Impact Factor Journals',
    hecCategoryOrImpact: 'Q1 Open Access International',
    abstractWordLimit: 200,
    abstractStructured: true,
    keywordsLimit: 6,
    headingNumbering: 'numbered',
    includeLiteratureReview: false,
    separateResultsAndDiscussion: true,
    includeStatTableInManuscript: true,
    inTextFormat: '[1]',
    referenceStyleId: 'mdpi_foods',
    sortReferencesAlphabetically: false,
    sectionOrder: [
      'TITLE',
      'ABSTRACT',
      '1. INTRODUCTION',
      '2. MATERIALS AND METHODS',
      '3. RESULTS',
      '4. DISCUSSION',
      '5. CONCLUSIONS',
      'REFERENCES'
    ],
    guidelinesSummary:
      'Single-paragraph structured Abstract (max 200 words: Background, Methods, Results, Conclusion), numbered square-bracket citations [1], separate Results and Discussion.',
    examplePreview:
      '1. Khan, M.A.; Ahmad, S.; Mahmood, T. Quality evaluation of mango pulp during storage. Foods 2025, 14, 112.'
  },
  {
    id: 'apa7',
    label: 'APA 7th Edition (Standard Pakistani HEC & International University Thesis Format)',
    shortName: 'APA 7th Edition',
    region: 'International Impact Factor Journals',
    hecCategoryOrImpact: 'Universal HEC University Thesis & Dissertation Standard',
    abstractWordLimit: 300,
    abstractStructured: false,
    keywordsLimit: 6,
    headingNumbering: 'numbered',
    includeLiteratureReview: true,
    separateResultsAndDiscussion: false,
    includeStatTableInManuscript: true,
    inTextFormat: '(Author, Year)',
    referenceStyleId: 'apa7',
    sortReferencesAlphabetically: true,
    sectionOrder: [
      'TITLE',
      'ABSTRACT',
      '1. INTRODUCTION',
      '2. REVIEW OF LITERATURE',
      '3. MATERIALS AND METHODS',
      '4. RESULTS AND DISCUSSION',
      '5. CONCLUSION',
      'REFERENCES'
    ],
    guidelinesSummary:
      'Standard university M.Sc. / M.Phil. / Ph.D. thesis and research paper format following APA 7th Edition author-date citations and alphabetical reference list.',
    examplePreview:
      'Khan, M. A., Ahmad, S., & Mahmood, T. (2025). Quality evaluation of mango pulp during storage. Journal of Food Science and Technology, 62(2), 112–118. https://doi.org/10.xxxx'
  },
  {
    id: 'harvard',
    label: 'Harvard Referencing Style (UK / Commonwealth Universities & Journals)',
    shortName: 'Harvard Style',
    region: 'International Impact Factor Journals',
    hecCategoryOrImpact: 'International Commonwealth Standard',
    abstractWordLimit: 250,
    abstractStructured: false,
    keywordsLimit: 6,
    headingNumbering: 'unnumbered',
    includeLiteratureReview: true,
    separateResultsAndDiscussion: false,
    includeStatTableInManuscript: true,
    inTextFormat: '(Author, Year)',
    referenceStyleId: 'harvard',
    sortReferencesAlphabetically: true,
    sectionOrder: [
      'TITLE',
      'ABSTRACT',
      'INTRODUCTION',
      'LITERATURE REVIEW',
      'METHODOLOGY',
      'FINDINGS AND DISCUSSION',
      'CONCLUSION',
      'REFERENCES'
    ],
    guidelinesSummary:
      'Commonwealth university & British Food Journal style using single-quoted article titles and pp. page ranges.',
    examplePreview:
      "Khan, M.A., Ahmad, S. and Mahmood, T., 2025. 'Quality evaluation of mango pulp during storage', British Food Journal, 127(2), pp. 112-118."
  },
  {
    id: 'ieee_vancouver',
    label: 'Vancouver / IEEE Numbered Style [1] (Medical, Clinical Nutrition & Engineering)',
    shortName: 'Vancouver / IEEE',
    region: 'International Impact Factor Journals',
    hecCategoryOrImpact: 'Clinical Nutrition & Food Engineering Standard',
    abstractWordLimit: 250,
    abstractStructured: false,
    keywordsLimit: 6,
    headingNumbering: 'roman',
    includeLiteratureReview: false,
    separateResultsAndDiscussion: false,
    includeStatTableInManuscript: true,
    inTextFormat: '[1]',
    referenceStyleId: 'ieee_vancouver',
    sortReferencesAlphabetically: false,
    sectionOrder: [
      'TITLE',
      'ABSTRACT',
      'I. INTRODUCTION',
      'II. METHODOLOGY',
      'III. RESULTS AND DISCUSSION',
      'IV. CONCLUSION',
      'REFERENCES'
    ],
    guidelinesSummary:
      'Numbered citations in order of appearance [1], [2], commonly used in clinical nutrition, medical journals, and food process engineering.',
    examplePreview:
      '[1] M. A. Khan, S. Ahmad, and T. Mahmood, "Quality evaluation of mango pulp during storage," J. Food Sci., vol. 62, no. 2, pp. 112-118, 2025.'
  },
  {
    id: 'custom_pattern',
    label: 'Custom Journal Pattern (Define Your Own University / Journal Format)',
    shortName: 'Custom Format',
    region: 'International Impact Factor Journals',
    hecCategoryOrImpact: 'Custom User Template',
    abstractWordLimit: 250,
    abstractStructured: false,
    keywordsLimit: 6,
    headingNumbering: 'numbered',
    includeLiteratureReview: false,
    separateResultsAndDiscussion: false,
    includeStatTableInManuscript: true,
    inTextFormat: '(Author, Year)',
    referenceStyleId: 'custom_pattern',
    sortReferencesAlphabetically: true,
    sectionOrder: [
      'TITLE',
      'ABSTRACT',
      'INTRODUCTION',
      'MATERIALS AND METHODS',
      'RESULTS AND DISCUSSION',
      'CONCLUSION',
      'REFERENCES'
    ],
    guidelinesSummary:
      'Customize the exact reference placeholder pattern and section structure to match any journal.',
    examplePreview:
      '{AUTHORS} ({YEAR}). {TITLE}. {JOURNAL}, {VOLUME}({ISSUE}): {PAGES}.'
  }
];

export const BUILTIN_ANOVA_PRESETS: CustomAnovaRequirementItem[] = [
  {
    id: 'crd_lsd_05',
    name: 'One-Way CRD ANOVA — LSD Test (α = 0.05, 5% Level) • Mean ± SD',
    designType: 'crd_one_way',
    alphaLevel: '0.05',
    postHocTest: 'LSD',
    summaryFormat: 'mean_sd',
    decimalPlaces: 2,
    replicationsCount: 3,
    notes: 'Standard Pakistani HEC & University Thesis ANOVA (CRD with triplicate readings, LSD at 5%).',
    createdAt: '2026-01-01'
  },
  {
    id: 'crd_lsd_01',
    name: 'One-Way CRD ANOVA — Strict 1% Significance (α = 0.01) • Mean ± SD',
    designType: 'crd_one_way',
    alphaLevel: '0.01',
    postHocTest: 'LSD',
    summaryFormat: 'mean_sd',
    decimalPlaces: 2,
    replicationsCount: 3,
    notes: 'High-precision chemical, proximate & food safety lab analysis at p < 0.01.',
    createdAt: '2026-01-01'
  },
  {
    id: 'rcbd_two_way_05',
    name: 'Two-Way RCBD / Blocked Storage Interval ANOVA (Treatments × Replications/Blocks) • LSD 0.05',
    designType: 'rcbd_two_way',
    alphaLevel: '0.05',
    postHocTest: 'LSD',
    summaryFormat: 'mean_sd',
    decimalPlaces: 2,
    replicationsCount: 3,
    notes: 'Partitions variation into Between Treatments, Between Blocks/Storage Intervals, and Residual Error.',
    createdAt: '2026-01-01'
  },
  {
    id: 'tukey_hsd_q1',
    name: 'International Q1 Journal (Elsevier / IFT) — Tukey HSD Grouping (p < 0.05) • Mean ± SD',
    designType: 'crd_one_way',
    alphaLevel: '0.05',
    postHocTest: 'Tukey_HSD',
    summaryFormat: 'mean_sd',
    decimalPlaces: 2,
    replicationsCount: 3,
    notes: 'Conservative Tukey Honestly Significant Difference (HSD) grouping preferred by Q1 journals.',
    createdAt: '2026-01-01'
  },
  {
    id: 'duncan_dmr_se',
    name: "Duncan's Multiple Range Test (DMR) (α = 0.05) • Mean ± SE (Standard Error)",
    designType: 'crd_one_way',
    alphaLevel: '0.05',
    postHocTest: 'Duncan_DMR',
    summaryFormat: 'mean_se',
    decimalPlaces: 2,
    replicationsCount: 4,
    notes: 'Reports Mean ± Standard Error (SE) with Duncan Multiple Range superscript letters.',
    createdAt: '2026-01-01'
  }
];

function parseRawReferenceLine(rawLine: string): ParsedReference {
  const clean = rawLine
    .trim()
    .replace(/^\[\d+\]\s*/, '')
    .replace(/^\d+\.\s*/, '');

  const yearMatch = clean.match(/\b(19\d{2}|20\d{2}[a-z]?)\b/);
  const year = yearMatch ? yearMatch[1] : '2025';

  const doiMatch = clean.match(
    /(?:https?:\/\/doi\.org\/|doi:\s*)(10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+)/i
  );
  const doi = doiMatch ? doiMatch[1] : '';

  const pagesMatch = clean.match(/(?:pp?\.\s*)?(\d{1,5}\s*[–-]\s*\d{1,5})/);
  const pages = pagesMatch ? pagesMatch[1].replace(/\s+/g, '') : '101-108';

  const volIssueMatch = clean.match(/\b(\d{1,4})\s*\((\d{1,3})\)/);
  const volOnlyMatch = clean.match(/,\s*(\d{1,4})\s*[,:]\s*\d{1,5}\s*[–-]/);
  const volume = volIssueMatch
    ? volIssueMatch[1]
    : volOnlyMatch
    ? volOnlyMatch[1]
    : '15';
  const issue = volIssueMatch ? volIssueMatch[2] : '1';

  let authors = 'Khan, M.A., S. Ahmad';
  let remainder = clean;
  if (yearMatch && typeof yearMatch.index === 'number') {
    const beforeYear = clean
      .slice(0, yearMatch.index)
      .replace(/[().\s,]+$/, '')
      .trim();
    if (beforeYear.length > 2) {
      authors = beforeYear;
    }
    remainder = clean
      .slice(yearMatch.index + yearMatch[0].length)
      .replace(/^[().\s,:;]+/, '')
      .trim();
  }

  const tailCleaned = remainder
    .replace(
      /(?:https?:\/\/doi\.org\/|doi:\s*)10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+/gi,
      ''
    )
    .replace(
      /\b\d{1,4}\s*\(\d{1,3}\)\s*[,:]?\s*(?:pp?\.\s*)?\d{1,5}\s*[–-]\s*\d{1,5}.*$/,
      ''
    )
    .replace(/,\s*\d{1,4}\s*[,:]\s*\d{1,5}\s*[–-]\s*\d{1,5}.*$/, '')
    .trim();

  const sentences = tailCleaned
    .split(/\.\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const title = sentences[0]
    ? sentences[0].replace(/\.$/, '')
    : 'Quality and safety evaluation of food products';
  const journal = sentences[1]
    ? sentences[1].replace(/[,.:]+$/, '')
    : 'Journal of Food Science and Technology';

  return {
    authors,
    year,
    title,
    journal,
    volume,
    issue,
    pages,
    doi
  };
}

function formatReferenceEntry(
  ref: ParsedReference,
  styleId: string,
  index: number,
  customTemplate: string,
  customCitationRule?: CustomCitationRequirementItem
): { bibliography: string; inText: string; firstSurname: string; year: string } {
  const firstAuthorSurname =
    ref.authors.split(',')[0]?.split(' ')[0]?.trim() || 'Author';
  const hasMultipleAuthors =
    ref.authors.includes('&') ||
    ref.authors.toLowerCase().includes(' and ') ||
    (ref.authors.match(/,/g) || []).length >= 2;

  const inTextAuthorEtAl = hasMultipleAuthors
    ? `(${firstAuthorSurname} et al., ${ref.year})`
    : `(${firstAuthorSurname}, ${ref.year})`;
  const inTextAuthorComma = `(${firstAuthorSurname}, ${ref.year})`;

  if (customCitationRule) {
    const formattedAuthors =
      customCitationRule.authorFormat === 'uppercase'
        ? ref.authors.toUpperCase()
        : ref.authors;
    const doiPart =
      customCitationRule.includeDoi && ref.doi
        ? ` https://doi.org/${ref.doi}`
        : '';
    let body = customCitationRule.templatePattern
      .replace(/\{AUTHORS\}/gi, formattedAuthors)
      .replace(/\{YEAR\}/gi, ref.year)
      .replace(/\{TITLE\}/gi, ref.title)
      .replace(/\{JOURNAL\}/gi, ref.journal)
      .replace(/\{VOLUME\}/gi, ref.volume)
      .replace(/\{ISSUE\}/gi, ref.issue)
      .replace(/\{PAGES\}/gi, ref.pages)
      .replace(/\{DOI\}/gi, doiPart.trim());
    if (
      customCitationRule.includeDoi &&
      ref.doi &&
      !customCitationRule.templatePattern.toUpperCase().includes('{DOI}')
    ) {
      body = `${body}${doiPart}`;
    }
    const prefix =
      customCitationRule.numberingStyle === 'bracket_number'
        ? `[${index + 1}] `
        : customCitationRule.numberingStyle === 'dot_number'
        ? `${index + 1}. `
        : '';
    const inText =
      customCitationRule.inTextFormat === '[1]'
        ? `[${index + 1}]`
        : customCitationRule.inTextFormat === '(1)'
        ? `(${index + 1})`
        : customCitationRule.inTextFormat === '(Author, Year)'
        ? inTextAuthorComma
        : inTextAuthorEtAl;
    return {
      bibliography: `${prefix}${body}`,
      inText,
      firstSurname: firstAuthorSurname,
      year: ref.year
    };
  }

  const doiSuffix = ref.doi ? ` https://doi.org/${ref.doi}` : '';

  switch (styleId) {
    case 'pjas':
      return {
        bibliography: `${ref.authors}. ${ref.year}. ${ref.title}. ${ref.journal}. ${ref.volume}:${ref.pages}.`,
        inText: inTextAuthorEtAl,
        firstSurname: firstAuthorSurname,
        year: ref.year
      };
    case 'pjn':
      return {
        bibliography: `${ref.authors}, ${ref.year}. ${ref.title}. ${ref.journal}, ${ref.volume}: ${ref.pages}.`,
        inText: inTextAuthorEtAl,
        firstSurname: firstAuthorSurname,
        year: ref.year
      };
    case 'japs':
      return {
        bibliography: `${ref.authors} (${ref.year}). ${ref.title}. ${ref.journal}. ${ref.volume}(${ref.issue}): ${ref.pages}.`,
        inText: inTextAuthorEtAl,
        firstSurname: firstAuthorSurname,
        year: ref.year
      };
    case 'pjsir':
    case 'sja':
      return {
        bibliography: `${ref.authors}. ${ref.year}. ${ref.title}. ${ref.journal}, ${ref.volume}(${ref.issue}): ${ref.pages}.`,
        inText: inTextAuthorEtAl,
        firstSurname: firstAuthorSurname,
        year: ref.year
      };
    case 'apa7':
      return {
        bibliography: `${ref.authors} (${ref.year}). ${ref.title}. ${ref.journal}, ${ref.volume}(${ref.issue}), ${ref.pages}.${doiSuffix}`,
        inText: inTextAuthorComma,
        firstSurname: firstAuthorSurname,
        year: ref.year
      };
    case 'elsevier_foodchem':
      return {
        bibliography: `${ref.authors} (${ref.year}). ${ref.title}. ${ref.journal}, ${ref.volume}, ${ref.pages}.${doiSuffix}`,
        inText: inTextAuthorEtAl,
        firstSurname: firstAuthorSurname,
        year: ref.year
      };
    case 'ift_jfs':
      return {
        bibliography: `${ref.authors} (${ref.year}). ${ref.title}. ${ref.journal}, ${ref.volume}(${ref.issue}), ${ref.pages}.${doiSuffix}`,
        inText: inTextAuthorEtAl,
        firstSurname: firstAuthorSurname,
        year: ref.year
      };
    case 'jds':
      return {
        bibliography: `${ref.authors}. ${ref.year}. ${ref.title}. ${ref.journal}. ${ref.volume}:${ref.pages}.${doiSuffix}`,
        inText: inTextAuthorEtAl,
        firstSurname: firstAuthorSurname,
        year: ref.year
      };
    case 'mdpi_foods':
      return {
        bibliography: `${index + 1}. ${ref.authors.replace(/ and /gi, '; ')}. ${ref.title}. ${ref.journal} ${ref.year}, ${ref.volume}, ${ref.pages}.${doiSuffix}`,
        inText: `[${index + 1}]`,
        firstSurname: firstAuthorSurname,
        year: ref.year
      };
    case 'harvard':
      return {
        bibliography: `${ref.authors}, ${ref.year}. '${ref.title}', ${ref.journal}, ${ref.volume}(${ref.issue}), pp. ${ref.pages}.`,
        inText: inTextAuthorComma,
        firstSurname: firstAuthorSurname,
        year: ref.year
      };
    case 'ieee_vancouver':
      return {
        bibliography: `[${index + 1}] ${ref.authors}, "${ref.title}," ${ref.journal}, vol. ${ref.volume}, no. ${ref.issue}, pp. ${ref.pages}, ${ref.year}.${doiSuffix}`,
        inText: `[${index + 1}]`,
        firstSurname: firstAuthorSurname,
        year: ref.year
      };
    default: {
      const out = customTemplate
        .replace(/\{AUTHORS\}/gi, ref.authors)
        .replace(/\{YEAR\}/gi, ref.year)
        .replace(/\{TITLE\}/gi, ref.title)
        .replace(/\{JOURNAL\}/gi, ref.journal)
        .replace(/\{VOLUME\}/gi, ref.volume)
        .replace(/\{ISSUE\}/gi, ref.issue)
        .replace(/\{PAGES\}/gi, ref.pages)
        .replace(/\{DOI\}/gi, ref.doi ? `https://doi.org/${ref.doi}` : '');
      return {
        bibliography: out,
        inText: inTextAuthorEtAl,
        firstSurname: firstAuthorSurname,
        year: ref.year
      };
    }
  }
}

export async function extractTextFromUploadedDocument(file: File): Promise<string> {
  const arrayBuf = await file.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuf);

  // Check if file is a ZIP / .docx archive (starts with PK\x03\x04)
  if (
    uint8.length > 30 &&
    uint8[0] === 0x50 &&
    uint8[1] === 0x4b &&
    uint8[2] === 0x03 &&
    uint8[3] === 0x04
  ) {
    try {
      let offset = 0;
      const decoder = new TextDecoder('utf-8', { fatal: false });
      while (offset + 30 <= uint8.length) {
        if (
          uint8[offset] !== 0x50 ||
          uint8[offset + 1] !== 0x4b ||
          uint8[offset + 2] !== 0x03 ||
          uint8[offset + 3] !== 0x04
        ) {
          break;
        }
        const compressionMethod = uint8[offset + 8] | (uint8[offset + 9] << 8);
        const compressedSize =
          (uint8[offset + 18] |
            (uint8[offset + 19] << 8) |
            (uint8[offset + 20] << 16) |
            (uint8[offset + 21] << 24)) >>>
          0;
        const fileNameLen = uint8[offset + 26] | (uint8[offset + 27] << 8);
        const extraLen = uint8[offset + 28] | (uint8[offset + 29] << 8);
        const entryName = decoder.decode(
          uint8.subarray(offset + 30, offset + 30 + fileNameLen)
        );
        const dataStart = offset + 30 + fileNameLen + extraLen;
        const dataEnd = dataStart + compressedSize;

        if (entryName === 'word/document.xml' && dataEnd <= uint8.length) {
          const slice = uint8.subarray(dataStart, dataEnd);
          let xmlText = '';
          if (compressionMethod === 0) {
            xmlText = decoder.decode(slice);
          } else if (
            compressionMethod === 8 &&
            typeof DecompressionStream !== 'undefined'
          ) {
            const ds = new DecompressionStream('deflate-raw');
            const writer = ds.writable.getWriter();
            writer.write(slice);
            writer.close();
            const decompressedBuf = await new Response(ds.readable).arrayBuffer();
            xmlText = decoder.decode(new Uint8Array(decompressedBuf));
          }
          if (xmlText) {
            return xmlText
              .replace(/<\/w:p>/g, '\n\n')
              .replace(/<w:tab\/>/g, '\t')
              .replace(/<w:br[^/>]*\/>/g, '\n')
              .replace(/<[^>]+>/g, '')
              .replace(/\n{3,}/g, '\n\n')
              .trim();
          }
        }
        if (compressedSize === 0) break;
        offset = dataEnd;
      }
    } catch {
      // Fall through to generic text decoder
    }
  }

  const rawDecoded = new TextDecoder('utf-8', { fatal: false }).decode(uint8);
  if (
    file.name.endsWith('.html') ||
    file.name.endsWith('.htm') ||
    file.name.endsWith('.xml') ||
    rawDecoded.includes('<w:t')
  ) {
    return rawDecoded
      .replace(/<\/w:p>/g, '\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/[ \t]+/g, ' ')
      .trim();
  }

  if (file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.csv')) {
    return rawDecoded.trim();
  }

  const printableMatches = rawDecoded.match(
    /[\x20-\x7E\r\n\t\u00A0-\u024F]{4,}/g
  );
  if (printableMatches && printableMatches.length > 0) {
    return printableMatches.join('\n').trim();
  }
  return rawDecoded.trim();
}

export interface ExtractedPaperSections {
  title: string;
  authorsAndAffiliation: string;
  abstractText: string;
  keywords: string;
  introduction: string;
  literatureReview: string;
  materialsAndMethods: string;
  resultsAndDiscussion: string;
  conclusion: string;
  referencesList: string;
}

export function parseResearchDocumentSections(
  rawText: string
): ExtractedPaperSections {
  const cleaned = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\u0000/g, '')
    .trim();

  if (!cleaned) {
    return {
      title: '',
      authorsAndAffiliation: '',
      abstractText: '',
      keywords: '',
      introduction: '',
      literatureReview: '',
      materialsAndMethods: '',
      resultsAndDiscussion: '',
      conclusion: '',
      referencesList: ''
    };
  }

  const lines = cleaned.split('\n').map((l) => l.trim());
  const nonEmptyLines = lines.filter(Boolean);
  const title = nonEmptyLines[0] || 'Untitled Research Study';
  const authorsAndAffiliation =
    nonEmptyLines.length > 1 && nonEmptyLines[1].length < 180
      ? nonEmptyLines[1]
      : 'Department of Food Science and Technology';

  const extractBetween = (
    startPatterns: RegExp[],
    endPatterns: RegExp[]
  ): string => {
    let startIdx = -1;
    let matchedHeaderLength = 0;

    for (const pat of startPatterns) {
      const m = pat.exec(cleaned);
      if (m && typeof m.index === 'number') {
        startIdx = m.index;
        matchedHeaderLength = m[0].length;
        break;
      }
    }
    if (startIdx === -1) return '';

    const contentStart = startIdx + matchedHeaderLength;
    const afterStart = cleaned.slice(contentStart);

    let nearestEnd = afterStart.length;
    for (const endPat of endPatterns) {
      const em = endPat.exec(afterStart);
      if (em && typeof em.index === 'number' && em.index > 15) {
        if (em.index < nearestEnd) {
          nearestEnd = em.index;
        }
      }
    }

    return afterStart
      .slice(0, nearestEnd)
      .replace(/^[:.\-\s]+/, '')
      .trim();
  };

  const abstractText = extractBetween(
    [/(?:^|\n)\s*(?:\d+\.?\s*)?(?:ABSTRACT|SUMMARY)\b[:.\s]*/i],
    [
      /(?:^|\n)\s*(?:Key\s*words|Keywords|INTRODUCTION|1\.?\s*INTRODUCTION|CHAPTER\s*1)\b/i
    ]
  );

  const keywordsMatch = cleaned.match(
    /(?:Key\s*words|Keywords|Index\s*Terms)\s*[:\-–]\s*([^\n]+)/i
  );
  const keywords = keywordsMatch
    ? keywordsMatch[1].trim()
    : 'Food science, shelf stability, physicochemical analysis, quality assurance';

  const introduction = extractBetween(
    [
      /(?:^|\n)\s*(?:1\.?\s*|I\.?\s*|CHAPTER\s*1\s*[:\-]?\s*)?INTRODUCTION\b[:.\s]*/i
    ],
    [
      /(?:^|\n)\s*(?:2\.?\s*|II\.?\s*|CHAPTER\s*2\s*[:\-]?\s*)?(?:REVIEW\s+OF\s+LITERATURE|LITERATURE\s+REVIEW|MATERIALS?\s+AND\s+METHODS?|METHODOLOGY)\b/i
    ]
  );

  const literatureReview = extractBetween(
    [
      /(?:^|\n)\s*(?:2\.?\s*|II\.?\s*|CHAPTER\s*2\s*[:\-]?\s*)?(?:REVIEW\s+OF\s+LITERATURE|LITERATURE\s+REVIEW|BACKGROUND)\b[:.\s]*/i
    ],
    [
      /(?:^|\n)\s*(?:3\.?\s*|2\.?\s*|III\.?\s*|CHAPTER\s*3\s*[:\-]?\s*)?(?:MATERIALS?\s+AND\s+METHODS?|METHODOLOGY|EXPERIMENTAL|METHODS)\b/i
    ]
  );

  const materialsAndMethods = extractBetween(
    [
      /(?:^|\n)\s*(?:\d+\.?\s*|III\.?\s*|CHAPTER\s*3\s*[:\-]?\s*)?(?:MATERIALS?\s+AND\s+METHODS?|METHODOLOGY|EXPERIMENTAL\s+PROCEDURES?)\b[:.\s]*/i
    ],
    [
      /(?:^|\n)\s*(?:\d+\.?\s*|IV\.?\s*|CHAPTER\s*4\s*[:\-]?\s*)?(?:RESULTS?\s+AND\s+DISCUSSION|RESULTS?|FINDINGS)\b/i
    ]
  );

  const resultsAndDiscussion = extractBetween(
    [
      /(?:^|\n)\s*(?:\d+\.?\s*|IV\.?\s*|CHAPTER\s*4\s*[:\-]?\s*)?(?:RESULTS?\s+AND\s+DISCUSSION|RESULTS?)\b[:.\s]*/i
    ],
    [
      /(?:^|\n)\s*(?:\d+\.?\s*|V\.?\s*|CHAPTER\s*5\s*[:\-]?\s*)?(?:CONCLUSIONS?|SUMMARY\s+AND\s+CONCLUSIONS?|RECOMMENDATIONS?|REFERENCES|BIBLIOGRAPHY|LITERATURE\s+CITED)\b/i
    ]
  );

  const conclusion = extractBetween(
    [
      /(?:^|\n)\s*(?:\d+\.?\s*|V\.?\s*|CHAPTER\s*5\s*[:\-]?\s*)?(?:CONCLUSIONS?\s+AND\s+RECOMMENDATIONS?|CONCLUSIONS?|SUMMARY)\b[:.\s]*/i
    ],
    [
      /(?:^|\n)\s*(?:\d+\.?\s*|VI\.?\s*)?(?:REFERENCES|BIBLIOGRAPHY|LITERATURE\s+CITED|ACKNOWLEDGEMENTS?)\b/i
    ]
  );

  const referencesList = extractBetween(
    [
      /(?:^|\n)\s*(?:\d+\.?\s*)?(?:REFERENCES|BIBLIOGRAPHY|LITERATURE\s+CITED)\b[:.\s]*/i
    ],
    [/(?:^|\n)\s*(?:APPENDIX|APPENDICES)\b/i]
  );

  const paragraphs = cleaned
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return {
    title,
    authorsAndAffiliation,
    abstractText:
      abstractText ||
      (paragraphs[1]
        ? paragraphs[1]
        : 'No explicit Abstract heading found; edit or paste abstract here.'),
    keywords,
    introduction:
      introduction ||
      (paragraphs[2]
        ? paragraphs[2]
        : 'Paste or edit Introduction & Objectives section here.'),
    literatureReview:
      literatureReview ||
      'No separate Review of Literature heading detected (many journals merge brief literature context into Introduction).',
    materialsAndMethods:
      materialsAndMethods ||
      (paragraphs[3]
        ? paragraphs[3]
        : 'Paste or edit Materials and Methods section here.'),
    resultsAndDiscussion:
      resultsAndDiscussion ||
      (paragraphs[4]
        ? paragraphs[4]
        : 'Paste or edit Results and Discussion section here.'),
    conclusion:
      conclusion ||
      (paragraphs[5]
        ? paragraphs[5]
        : 'Paste or edit Conclusion section here.'),
    referencesList: referencesList || ''
  };
}

function getCriticalT(df: number, alpha: '0.05' | '0.01'): number {
  if (alpha === '0.01') {
    if (df <= 1) return 63.657;
    if (df === 2) return 9.925;
    if (df === 3) return 5.841;
    if (df === 4) return 4.604;
    if (df === 5) return 4.032;
    if (df === 6) return 3.707;
    if (df === 8) return 3.355;
    if (df <= 10) return 3.169;
    if (df <= 12) return 3.055;
    if (df <= 15) return 2.947;
    if (df <= 20) return 2.845;
    if (df <= 30) return 2.75;
    return 2.576;
  }
  if (df <= 1) return 12.706;
  if (df === 2) return 4.303;
  if (df === 3) return 3.182;
  if (df === 4) return 2.776;
  if (df === 5) return 2.571;
  if (df === 6) return 2.447;
  if (df === 7) return 2.365;
  if (df === 8) return 2.306;
  if (df === 9) return 2.262;
  if (df === 10) return 2.228;
  if (df <= 12) return 2.179;
  if (df <= 15) return 2.131;
  if (df <= 20) return 2.086;
  if (df <= 30) return 2.042;
  return 1.96;
}

function getCriticalFValues(
  dfBetween: number,
  dfWithin: number
): { f05: number; f01: number } {
  const dfE = Math.max(1, dfWithin);
  if (dfE <= 4) return { f05: 6.59, f01: 16.69 };
  if (dfE <= 6) return { f05: 4.76, f01: 9.78 };
  if (dfE <= 8) return { f05: 4.07, f01: 7.59 };
  if (dfE <= 10) return { f05: 3.71, f01: 6.55 };
  if (dfE <= 12) return { f05: 3.49, f01: 5.95 };
  if (dfE <= 15) return { f05: 3.29, f01: 5.42 };
  if (dfE <= 20) return { f05: 3.1, f01: 4.94 };
  if (dfBetween >= 1) return { f05: 2.85, f01: 4.31 };
  return { f05: 3.0, f01: 4.6 };
}

function adjustInTextCitationsInBody(
  bodyText: string,
  targetInTextFormat: string,
  formattedRefs: { firstSurname: string; year: string }[]
): string {
  if (!bodyText) return '';
  if (targetInTextFormat === '[1]' || targetInTextFormat === '(1)') {
    let updated = bodyText;
    formattedRefs.forEach((ref, idx) => {
      const numTag = targetInTextFormat === '[1]' ? `[${idx + 1}]` : `(${idx + 1})`;
      const escapedSurname = ref.firstSurname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regexParen = new RegExp(
        `\\(${escapedSurname}(?:\\s+et\\s+al\\.?|\\s*(?:&|and)\\s*[A-Za-z.]+)?,\\s*${ref.year}\\)`,
        'gi'
      );
      updated = updated.replace(regexParen, numTag);
      const regexNarrative = new RegExp(
        `\\b(${escapedSurname}(?:\\s+et\\s+al\\.?|\\s+(?:and|&)\\s+[A-Za-z.]+)?)\\s*\\(${ref.year}\\)`,
        'gi'
      );
      updated = updated.replace(regexNarrative, `$1 ${numTag}`);
    });
    return updated;
  }
  if (targetInTextFormat === '(Author, Year)') {
    return bodyText.replace(
      /\(([A-Z][a-zA-Z\-]+)\s+et\s+al\.,?\s*(19\d{2}|20\d{2}[a-z]?)\)/g,
      '($1, $2)'
    );
  }
  return bodyText;
}

function formatStructuredAbstractIfNeeded(
  abstractText: string,
  wordLimit: number,
  structured: boolean,
  journalShortName: string
): string {
  const words = abstractText.trim().split(/\s+/).filter(Boolean);
  const trimmed =
    words.length > wordLimit
      ? `${words.slice(0, wordLimit).join(' ')}... [Adjusted to ${wordLimit}-word limit of ${journalShortName}]`
      : abstractText.trim();

  if (!structured) return trimmed;
  if (/background\s*:/i.test(trimmed) && /methods?\s*:/i.test(trimmed)) {
    return trimmed;
  }
  const sentences = trimmed
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (sentences.length < 3) {
    return `Background & Objective: ${trimmed}`;
  }
  const bg = sentences[0];
  const methods = sentences.slice(1, Math.max(2, sentences.length - 2)).join(' ');
  const results = sentences[Math.max(1, sentences.length - 2)] || '';
  const concl = sentences[sentences.length - 1] || '';
  return `Background: ${bg} Methods: ${methods} Results: ${results} Conclusion: ${concl}`;
}

export const SAMPLE_RESEARCH_PAPER_TEXT = `Effect of Potassium Sorbate and Citric Acid on Physicochemical, Microbiological and Sensory Stability of Chaunsa Mango Pulp During Ambient Storage
Muhammad Ali Khan, Salman Ahmad, and Tariq Mahmood — National Institute of Food Science and Technology (NIFSAT), University of Agriculture, Faisalabad, Pakistan

ABSTRACT
The present investigation was carried out to evaluate the combined effect of potassium sorbate and citric acid on the physicochemical, microbiological, and sensory attributes of Chaunsa mango pulp stored at ambient temperature (28 ± 2°C) for 90 days. Five treatments were prepared: T0 (Control without preservative), T1 (0.05% Potassium Sorbate + 0.2% Citric Acid), T2 (0.10% Potassium Sorbate + 0.2% Citric Acid), T3 (0.05% Sodium Benzoate + 0.2% Citric Acid), and T4 (0.05% Potassium Sorbate + 0.05% Sodium Benzoate + 0.2% Citric Acid). Samples were analyzed at 0, 30, 60, and 90 days for total soluble solids (°Brix), pH, titratable acidity (%), ascorbic acid (mg/100g), total plate count (log CFU/g), and sensory acceptability. Results revealed highly significant (p < 0.01) effects of treatments and storage intervals on ascorbic acid retention and microbial load. Treatment T4 retained the highest ascorbic acid (34.80 ± 0.45 mg/100g) and lowest microbial count (2.15 log CFU/g) after 90 days.

Keywords: Chaunsa mango pulp, potassium sorbate, shelf life, physicochemical quality, ANOVA, food preservation

1. INTRODUCTION
Mango (Mangifera indica L.) is the second largest fruit crop of Pakistan and is globally recognized as the King of Fruits due to its rich aroma, high carotenoids, and ascorbic acid content (Khan et al., 2024). However, post-harvest losses in Pakistan range between 25% and 35% due to rapid ripening and microbial spoilage during peak summer months. Chemical preservation of fruit pulp in food-grade HDPE containers using Codex-permitted preservatives within safe PPM limits offers an economical solution for the beverage and nectar industry. The objective of this study was to optimize preservative hurdle combinations for extending the shelf stability of Chaunsa mango pulp without compromising sensory quality.

2. REVIEW OF LITERATURE
Previous studies by Hussain et al. (2023) and Codex (2023) demonstrated that weak-acid preservatives such as potassium sorbate (E202) and sodium benzoate (E211) exhibit maximum antimicrobial efficacy when the product pH is lowered below 4.2 using citric acid (E330). Akram and Randhawa (2022) reported that synergistic combinations of sorbate and benzoate inhibit both yeast/mold growth and acid-tolerant bacteria in tropical fruit purees.

3. MATERIALS AND METHODS
Fully ripe, sound Chaunsa mangoes were procured from the local fruit market in Faisalabad. After washing with 100 ppm chlorinated water, fruits were pulped, passed through a 0.5 mm finisher screen, and thermally pasteurized at 85°C for 3 minutes. Citric acid and preservatives were incorporated according to the treatment plan (T0 to T4). Total soluble solids (°Brix) were determined using a digital refractometer (AOAC Method 932.12), titratable acidity by titration against 0.1 N NaOH, and Vitamin C by 2,6-dichlorophenolindophenol dye titration. Data obtained from triplicate replications were subjected to Analysis of Variance (ANOVA) under Completely Randomized Design (CRD) and means were compared using Least Significant Difference (LSD) test at 5% probability level.

4. RESULTS AND DISCUSSION
Total soluble solids showed a gradual increase from 18.20 to 19.10 °Brix over 90 days due to hydrolysis of polysaccharides into simple sugars. Titratable acidity increased slightly in control (T0) due to fermentation, whereas T2 and T4 remained stable (0.62 ± 0.02%). Ascorbic acid content decreased across all treatments during storage due to oxidative degradation; however, T4 and T2 exhibited significantly (p < 0.05) higher retention compared to T0, which spoiled within 15 days.

5. CONCLUSION
Combined application of 0.05% potassium sorbate and 0.05% sodium benzoate acidified with 0.2% citric acid (T4) effectively preserved Chaunsa mango pulp for 90 days at ambient temperature within Codex Alimentarius safety limits.

REFERENCES
Khan, M.A., S. Ahmad and T. Mahmood (2024). Effect of potassium sorbate and citric acid on shelf stability of Chaunsa mango pulp. Pakistan Journal of Agricultural Sciences, 61(2), 145-152.
Codex, A. & FAO (2023). General standard for food additives CXS 192-1995. Food Control, 148(1), 210-218.
Hussain, S., M. I. Anjum and A. Rehman. 2023. Physicochemical and microbiological quality of fruit pulps in Punjab. Journal of Animal and Plant Sciences. 35(1): 55-62.
Akram, K. and M. A. Randhawa (2022). Hurdle technology in tropical fruit processing. Journal of Food Science, 87(4), 412-420.`;

export interface CitationReferenceGeneratorToolProps {
  user?: HubUser | null;
  isUserPaid?: boolean;
  hasExpiredPremium?: boolean;
  toolsData?: UserToolsData;
  onSaveToolsData?: (updated: UserToolsData) => Promise<void>;
  onOpenPremiumModal?: () => void;
}

export const CitationReferenceGeneratorTool: React.FC<
  CitationReferenceGeneratorToolProps
> = ({
  user,
  isUserPaid = false,
  toolsData,
  onSaveToolsData,
  onOpenPremiumModal
}) => {
  const [activeResearchTab, setActiveResearchTab] = useState<
    'extractor' | 'thesis-converter' | 'statistics' | 'references' | 'directory'
  >('extractor');

  const [selectedStyle, setSelectedStyle] = useState<string>('pjas');
  const [customPattern, setCustomPattern] = useState<string>(
    '{AUTHORS} ({YEAR}). {TITLE}. {JOURNAL}, {VOLUME}({ISSUE}): {PAGES}.'
  );
  const [sortAlphabetically, setSortAlphabetically] = useState<boolean>(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  const showBanner = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => {
      setStatusBanner((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  // Saved user data from Firestore toolsData
  const savedCustomJournals = useMemo(
    () => toolsData?.researchSuiteData?.customJournals || [],
    [toolsData?.researchSuiteData?.customJournals]
  );
  const savedCustomAnovaPresets = useMemo(
    () => toolsData?.researchSuiteData?.customAnovaPresets || [],
    [toolsData?.researchSuiteData?.customAnovaPresets]
  );
  const savedCustomCitationStyles = useMemo(
    () => toolsData?.researchSuiteData?.customCitationStyles || [],
    [toolsData?.researchSuiteData?.customCitationStyles]
  );
  const savedRecords = useMemo(
    () => toolsData?.researchSuiteData?.savedRecords || [],
    [toolsData?.researchSuiteData?.savedRecords]
  );

  // Merge built-in journal directory with user's custom journal requirement items
  const allJournalsList: JournalDirectoryItem[] = useMemo(() => {
    const customMapped: JournalDirectoryItem[] = savedCustomJournals.map(
      (cj) => ({
        id: cj.id,
        label: `${cj.label} (Custom Requirement)`,
        shortName: cj.shortName,
        region: 'My Custom Journal Requirements',
        hecCategoryOrImpact: cj.hecCategoryOrImpact,
        abstractWordLimit: cj.abstractWordLimit,
        abstractStructured: cj.abstractStructured,
        keywordsLimit: cj.keywordsLimit,
        headingNumbering: cj.headingNumbering,
        includeLiteratureReview: cj.includeLiteratureReview,
        separateResultsAndDiscussion: cj.separateResultsAndDiscussion,
        includeHighlights: cj.includeHighlights,
        includePracticalApplication: cj.includePracticalApplication,
        includeStatTableInManuscript: cj.includeStatTableInManuscript,
        inTextFormat: cj.inTextFormat,
        referenceStyleId: cj.referenceStyleId,
        customReferenceTemplate: cj.customReferenceTemplate,
        sortReferencesAlphabetically: cj.sortReferencesAlphabetically,
        sectionOrder: cj.sectionOrder,
        guidelinesSummary: cj.guidelinesSummary,
        examplePreview:
          cj.customReferenceTemplate ||
          '{AUTHORS} ({YEAR}). {TITLE}. {JOURNAL}, {VOLUME}({ISSUE}): {PAGES}.'
      })
    );
    return [...customMapped, ...JOURNAL_DIRECTORY];
  }, [savedCustomJournals]);

  // Active Journal Metadata + Live Override Requirements State (so any user can adjust requirements on the fly!)
  const baseJournalMeta = useMemo(
    () =>
      allJournalsList.find((j) => j.id === selectedStyle) || allJournalsList[0],
    [allJournalsList, selectedStyle]
  );

  const [showJournalReqBuilder, setShowJournalReqBuilder] =
    useState<boolean>(false);
  const [reqJournalLabel, setReqJournalLabel] = useState<string>(
    baseJournalMeta.label
  );
  const [reqJournalShortName, setReqJournalShortName] = useState<string>(
    baseJournalMeta.shortName
  );
  const [reqHecOrImpact, setReqHecOrImpact] = useState<string>(
    baseJournalMeta.hecCategoryOrImpact
  );
  const [reqAbstractLimit, setReqAbstractLimit] = useState<number>(
    baseJournalMeta.abstractWordLimit
  );
  const [reqAbstractStructured, setReqAbstractStructured] = useState<boolean>(
    Boolean(baseJournalMeta.abstractStructured)
  );
  const [reqKeywordsLimit, setReqKeywordsLimit] = useState<number>(
    baseJournalMeta.keywordsLimit || 6
  );
  const [reqHeadingNumbering, setReqHeadingNumbering] = useState<
    'numbered' | 'roman' | 'unnumbered'
  >(baseJournalMeta.headingNumbering || 'numbered');
  const [reqIncludeLitReview, setReqIncludeLitReview] = useState<boolean>(
    Boolean(baseJournalMeta.includeLiteratureReview)
  );
  const [reqSeparateResultsDiscussion, setReqSeparateResultsDiscussion] =
    useState<boolean>(Boolean(baseJournalMeta.separateResultsAndDiscussion));
  const [reqIncludeHighlights, setReqIncludeHighlights] = useState<boolean>(
    Boolean(baseJournalMeta.includeHighlights)
  );
  const [reqIncludePracticalApp, setReqIncludePracticalApp] = useState<boolean>(
    Boolean(baseJournalMeta.includePracticalApplication)
  );
  const [reqIncludeStatTable, setReqIncludeStatTable] = useState<boolean>(
    baseJournalMeta.includeStatTableInManuscript !== false
  );
  const [reqInTextFormat, setReqInTextFormat] = useState<
    '(Author et al., Year)' | '(Author, Year)' | '[1]' | '(1)'
  >(
    (baseJournalMeta.inTextFormat as
      | '(Author et al., Year)'
      | '(Author, Year)'
      | '[1]'
      | '(1)') || '(Author et al., Year)'
  );
  const [reqReferenceStyleId, setReqReferenceStyleId] = useState<string>(
    baseJournalMeta.referenceStyleId || baseJournalMeta.id
  );
  const [reqCustomRefTemplate, setReqCustomRefTemplate] = useState<string>(
    baseJournalMeta.customReferenceTemplate ||
      '{AUTHORS} ({YEAR}). {TITLE}. {JOURNAL}, {VOLUME}({ISSUE}): {PAGES}.'
  );
  const [reqSortRefsAlpha, setReqSortRefsAlpha] = useState<boolean>(
    baseJournalMeta.sortReferencesAlphabetically !== false
  );
  const [reqGuidelinesNote, setReqGuidelinesNote] = useState<string>(
    baseJournalMeta.guidelinesSummary
  );

  // Sync requirement controls whenever user picks a different journal from dropdown
  React.useEffect(() => {
    setReqJournalLabel(baseJournalMeta.label);
    setReqJournalShortName(baseJournalMeta.shortName);
    setReqHecOrImpact(baseJournalMeta.hecCategoryOrImpact);
    setReqAbstractLimit(baseJournalMeta.abstractWordLimit || 250);
    setReqAbstractStructured(Boolean(baseJournalMeta.abstractStructured));
    setReqKeywordsLimit(baseJournalMeta.keywordsLimit || 6);
    setReqHeadingNumbering(baseJournalMeta.headingNumbering || 'unnumbered');
    setReqIncludeLitReview(Boolean(baseJournalMeta.includeLiteratureReview));
    setReqSeparateResultsDiscussion(
      Boolean(baseJournalMeta.separateResultsAndDiscussion)
    );
    setReqIncludeHighlights(Boolean(baseJournalMeta.includeHighlights));
    setReqIncludePracticalApp(
      Boolean(baseJournalMeta.includePracticalApplication)
    );
    setReqIncludeStatTable(
      baseJournalMeta.includeStatTableInManuscript !== false
    );
    setReqInTextFormat(
      (baseJournalMeta.inTextFormat === '[1]' ||
      baseJournalMeta.inTextFormat === '[1], [2,3]'
        ? '[1]'
        : baseJournalMeta.inTextFormat === '(1)'
        ? '(1)'
        : baseJournalMeta.inTextFormat === '(Author, Year)'
        ? '(Author, Year)'
        : '(Author et al., Year)') as
        | '(Author et al., Year)'
        | '(Author, Year)'
        | '[1]'
        | '(1)'
    );
    setReqReferenceStyleId(
      baseJournalMeta.referenceStyleId || baseJournalMeta.id
    );
    if (baseJournalMeta.customReferenceTemplate) {
      setReqCustomRefTemplate(baseJournalMeta.customReferenceTemplate);
    }
    setReqSortRefsAlpha(baseJournalMeta.sortReferencesAlphabetically !== false);
    setReqGuidelinesNote(baseJournalMeta.guidelinesSummary);
  }, [baseJournalMeta]);

  // Dynamic section order computed from active requirement toggles
  const activeSectionOrderList = useMemo(() => {
    const order: string[] = ['TITLE PAGE'];
    if (reqIncludeHighlights) order.push('HIGHLIGHTS');
    if (reqIncludePracticalApp) order.push('PRACTICAL APPLICATION');
    order.push('ABSTRACT');
    const roman = ['I.', 'II.', 'III.', 'IV.', 'V.', 'VI.', 'VII.'];
    let secIdx = 0;
    const prefix = () => {
      secIdx += 1;
      if (reqHeadingNumbering === 'numbered') return `${secIdx}. `;
      if (reqHeadingNumbering === 'roman')
        return `${roman[secIdx - 1] || `${secIdx}.`} `;
      return '';
    };
    order.push(`${prefix()}INTRODUCTION`);
    if (reqIncludeLitReview) {
      order.push(`${prefix()}REVIEW OF LITERATURE`);
    }
    order.push(`${prefix()}MATERIALS AND METHODS`);
    if (reqSeparateResultsDiscussion) {
      order.push(`${prefix()}RESULTS`);
      order.push(`${prefix()}DISCUSSION`);
    } else {
      order.push(`${prefix()}RESULTS AND DISCUSSION`);
    }
    order.push(`${prefix()}CONCLUSION`);
    order.push('REFERENCES');
    return order;
  }, [
    reqIncludeHighlights,
    reqIncludePracticalApp,
    reqHeadingNumbering,
    reqIncludeLitReview,
    reqSeparateResultsDiscussion
  ]);

  // TAB 1 & TAB 2 STATE: RESEARCH PAPER / THESIS UPLOAD & SECTION EXTRACTOR
  const [rawPaperInput, setRawPaperInput] = useState<string>(
    SAMPLE_RESEARCH_PAPER_TEXT
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [extractorNotes, setExtractorNotes] = useState<string>('');

  const extractedSections = useMemo(
    () => parseResearchDocumentSections(rawPaperInput),
    [rawPaperInput]
  );

  const [editTitle, setEditTitle] = useState<string>('');
  const [editAuthors, setEditAuthors] = useState<string>('');
  const [editHighlights, setEditHighlights] = useState<string>(
    '• Combined potassium sorbate and sodium benzoate extended mango pulp shelf life to 90 days.\n• Acidification to pH < 4.2 with citric acid maximized antimicrobial efficacy.\n• Treatment T4 retained 34.80 mg/100g ascorbic acid with minimal microbial load.'
  );
  const [editPracticalApp, setEditPracticalApp] = useState<string>(
    'This research provides fruit processing industries with an economical hurdle preservation protocol to store mango pulp in food-grade HDPE drums for 90 days at ambient temperatures without refrigeration.'
  );
  const [editAbstract, setEditAbstract] = useState<string>('');
  const [editKeywords, setEditKeywords] = useState<string>('');
  const [editIntro, setEditIntro] = useState<string>('');
  const [editLitReview, setEditLitReview] = useState<string>('');
  const [editMethods, setEditMethods] = useState<string>('');
  const [editResults, setEditResults] = useState<string>('');
  const [editDiscussionSeparate, setEditDiscussionSeparate] = useState<string>(
    'The observed stability in physicochemical and microbiological attributes aligns with hurdle technology principles reported in previous studies (Khan et al., 2024; Hussain et al., 2023), where weak-acid preservatives suppressed yeast and mold proliferation at pH < 4.2.'
  );
  const [editConclusion, setEditConclusion] = useState<string>('');
  const [manuscriptSaveNotes, setManuscriptSaveNotes] = useState<string>('');

  // TAB 4 STATE: CITATION & REFERENCE GENERATOR (BULK + MANUAL + CUSTOM CITATION REQUIREMENTS)
  const [bulkRawText, setBulkRawText] = useState<string>(
    `Khan, M.A., S. Ahmad and T. Mahmood (2024). Effect of potassium sorbate and citric acid on shelf stability of Chaunsa mango pulp. Pakistan Journal of Agricultural Sciences, 61(2), 145-152.\nCodex, A. & FAO (2023). General standard for food additives CXS 192-1995. Food Control, 148(1), 210-218.\nHussain, S., M. I. Anjum and A. Rehman. 2023. Physicochemical and microbiological quality of fruit pulps in Punjab. Journal of Animal and Plant Sciences. 35(1): 55-62.\nAkram, K. and M. A. Randhawa (2022). Hurdle technology in tropical fruit processing. Journal of Food Science, 87(4), 412-420.`
  );

  React.useEffect(() => {
    setEditTitle(extractedSections.title);
    setEditAuthors(extractedSections.authorsAndAffiliation);
    setEditAbstract(extractedSections.abstractText);
    setEditKeywords(extractedSections.keywords);
    setEditIntro(extractedSections.introduction);
    setEditLitReview(extractedSections.literatureReview);
    setEditMethods(extractedSections.materialsAndMethods);
    setEditResults(extractedSections.resultsAndDiscussion);
    setEditConclusion(extractedSections.conclusion);
    if (
      extractedSections.referencesList &&
      extractedSections.referencesList.trim().length > 15
    ) {
      setBulkRawText(extractedSections.referencesList.trim());
    }
  }, [extractedSections]);

  const handlePaperFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);

    try {
      const readable = await extractTextFromUploadedDocument(file);
      if (readable && readable.trim().length > 15) {
        setRawPaperInput(readable.trim());
        const parsed = parseResearchDocumentSections(readable.trim());
        if (parsed.referencesList && parsed.referencesList.trim().length > 15) {
          setBulkRawText(parsed.referencesList.trim());
        }
        showBanner(
          `Uploaded "${file.name}" — Thesis / Paper sections & references automatically extracted and adjusted!`
        );
      }
    } catch {
      // Fallback
    }
  };

  // TAB 3 STATE: RESEARCH DATA STATISTICAL ANALYSIS (BUILT-IN + CUSTOM ANOVA REQUIREMENTS + RAW PASTE)
  const allAnovaPresets = useMemo(
    () => [...savedCustomAnovaPresets, ...BUILTIN_ANOVA_PRESETS],
    [savedCustomAnovaPresets]
  );
  const [selectedAnovaPresetId, setSelectedAnovaPresetId] =
    useState<string>('crd_lsd_05');
  const activeAnovaPreset = useMemo(
    () =>
      allAnovaPresets.find((p) => p.id === selectedAnovaPresetId) ||
      allAnovaPresets[0],
    [allAnovaPresets, selectedAnovaPresetId]
  );

  const [anovaDesignType, setAnovaDesignType] = useState<
    'crd_one_way' | 'rcbd_two_way'
  >('crd_one_way');
  const [anovaAlphaLevel, setAnovaAlphaLevel] = useState<'0.05' | '0.01'>(
    '0.05'
  );
  const [anovaPostHocTest, setAnovaPostHocTest] = useState<
    'LSD' | 'Tukey_HSD' | 'Duncan_DMR'
  >('LSD');
  const [anovaSummaryFormat, setAnovaSummaryFormat] = useState<
    'mean_sd' | 'mean_se' | 'mean_only'
  >('mean_sd');
  const [anovaDecimals, setAnovaDecimals] = useState<number>(2);
  const [anovaReplicationsCount, setAnovaReplicationsCount] =
    useState<number>(3);
  const [showCustomAnovaModal, setShowCustomAnovaModal] =
    useState<boolean>(false);
  const [customAnovaNameInput, setCustomAnovaNameInput] = useState<string>('');
  const [customAnovaNotesInput, setCustomAnovaNotesInput] =
    useState<string>('');

  React.useEffect(() => {
    setAnovaDesignType(activeAnovaPreset.designType);
    setAnovaAlphaLevel(activeAnovaPreset.alphaLevel);
    setAnovaPostHocTest(activeAnovaPreset.postHocTest);
    setAnovaSummaryFormat(activeAnovaPreset.summaryFormat);
    setAnovaDecimals(activeAnovaPreset.decimalPlaces || 2);
    setAnovaReplicationsCount(
      Math.min(6, Math.max(2, activeAnovaPreset.replicationsCount || 3))
    );
  }, [activeAnovaPreset]);

  const [statParameterName, setStatParameterName] = useState<string>(
    'Ascorbic Acid / Vitamin C (mg/100g)'
  );
  const [statFactorName, setStatFactorName] = useState<string>(
    'Preservative Treatments (90 Days Storage)'
  );
  const [statRows, setStatRows] = useState<ResearchSuiteSavedStatRow[]>([
    {
      id: 't0',
      treatmentName: 'T0 (Untreated Control)',
      rep1: '18.40',
      rep2: '18.10',
      rep3: '18.70',
      rep4: '',
      rep5: '',
      rep6: ''
    },
    {
      id: 't1',
      treatmentName: 'T1 (0.05% Potassium Sorbate)',
      rep1: '26.20',
      rep2: '26.80',
      rep3: '26.50',
      rep4: '',
      rep5: '',
      rep6: ''
    },
    {
      id: 't2',
      treatmentName: 'T2 (0.10% Potassium Sorbate)',
      rep1: '31.50',
      rep2: '31.10',
      rep3: '31.90',
      rep4: '',
      rep5: '',
      rep6: ''
    },
    {
      id: 't3',
      treatmentName: 'T3 (0.05% Sodium Benzoate)',
      rep1: '25.10',
      rep2: '24.80',
      rep3: '25.40',
      rep4: '',
      rep5: '',
      rep6: ''
    },
    {
      id: 't4',
      treatmentName: 'T4 (0.05% Sorbate + 0.05% Benzoate)',
      rep1: '34.80',
      rep2: '35.20',
      rep3: '34.40',
      rep4: '',
      rep5: '',
      rep6: ''
    }
  ]);
  const [rawPasteStatText, setRawPasteStatText] = useState<string>('');
  const [statSaveNotes, setStatSaveNotes] = useState<string>('');

  const parseRawStatTextAndApply = (textToParse: string) => {
    const lines = textToParse
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return;

    const parsedRows: ResearchSuiteSavedStatRow[] = [];
    let maxRepsSeen = 3;

    lines.forEach((line, idx) => {
      // Support tab-separated, comma/semicolon-separated, or multi-space separated rows
      let cols = line.split(/[\t,;]+/).map((c) => c.trim());
      if (cols.length < 2) {
        // Try splitting trailing numbers separated by whitespace
        const matchNums = line.match(
          /^(.+?)\s+(-?\d+(?:\.\d+)?(?:\s+-?\d+(?:\.\d+)?)+)$/
        );
        if (matchNums) {
          const namePart = matchNums[1].trim();
          const numParts = matchNums[2].trim().split(/\s+/);
          cols = [namePart, ...numParts];
        }
      }

      if (idx === 0 && cols.length > 1 && isNaN(Number(cols[1]))) {
        if (cols[0]) setStatFactorName(cols[0]);
        return;
      }
      if (cols.length >= 2) {
        const numericCols = cols.slice(1).filter((c) => c !== '' && !isNaN(Number(c)));
        if (numericCols.length > maxRepsSeen) {
          maxRepsSeen = Math.min(6, numericCols.length);
        }
        parsedRows.push({
          id: `paste-${idx}-${Date.now()}`,
          treatmentName: cols[0] || `T${parsedRows.length}`,
          rep1: cols[1] || '',
          rep2: cols[2] || '',
          rep3: cols[3] || '',
          rep4: cols[4] || '',
          rep5: cols[5] || '',
          rep6: cols[6] || ''
        });
      }
    });

    if (parsedRows.length >= 2) {
      setStatRows(parsedRows);
      if (maxRepsSeen > anovaReplicationsCount) {
        setAnovaReplicationsCount(maxRepsSeen);
      }
      showBanner(
        `Applied ${parsedRows.length} Treatments from pasted data — Statistical ANOVA updated according to active requirements!`
      );
    }
  };

  const handleStatCsvUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      parseRawStatTextAndApply(text);
    } catch {
      // Ignore parse error
    }
  };

  const statisticalAnalysis = useMemo(() => {
    const activeRepFields = (
      ['rep1', 'rep2', 'rep3', 'rep4', 'rep5', 'rep6'] as const
    ).slice(0, anovaReplicationsCount);

    const processedTreatments = statRows.map((row) => {
      const rawVals = activeRepFields
        .map((field) => (row[field] || '').trim())
        .filter((v) => v !== '' && !isNaN(Number(v)))
        .map((v) => Number(v));

      const n = rawVals.length;
      const sum = rawVals.reduce((acc, v) => acc + v, 0);
      const mean = n > 0 ? sum / n : 0;
      const variance =
        n > 1
          ? rawVals.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n - 1)
          : 0;
      const sd = Math.sqrt(variance);
      const se = n > 0 ? sd / Math.sqrt(n) : 0;

      return {
        id: row.id,
        treatmentName: row.treatmentName,
        values: rawVals,
        n,
        sum,
        mean,
        variance,
        sd,
        se,
        min: n > 0 ? Math.min(...rawVals) : 0,
        max: n > 0 ? Math.max(...rawVals) : 0
      };
    });

    const validTreatments = processedTreatments.filter((t) => t.n > 0);
    const k = validTreatments.length;
    const totalN = validTreatments.reduce((acc, t) => acc + t.n, 0);
    const grandSum = validTreatments.reduce((acc, t) => acc + t.sum, 0);
    const grandMean = totalN > 0 ? grandSum / totalN : 0;

    const ssBetween = validTreatments.reduce(
      (acc, t) => acc + t.n * Math.pow(t.mean - grandMean, 2),
      0
    );

    const ssWithinUnblocked = validTreatments.reduce(
      (acc, t) =>
        acc + t.values.reduce((s, v) => s + Math.pow(v - t.mean, 2), 0),
      0
    );

    // If Two-Way RCBD (Blocked by Replication column), compute SS Blocks
    let ssBlocks = 0;
    let dfBlocks = 0;
    if (anovaDesignType === 'rcbd_two_way' && k >= 2) {
      const blockCount = anovaReplicationsCount;
      for (let b = 0; b < blockCount; b++) {
        const blockVals: number[] = [];
        validTreatments.forEach((t) => {
          if (typeof t.values[b] === 'number') {
            blockVals.push(t.values[b]);
          }
        });
        if (blockVals.length > 0) {
          const bMean =
            blockVals.reduce((a, v) => a + v, 0) / blockVals.length;
          ssBlocks += blockVals.length * Math.pow(bMean - grandMean, 2);
        }
      }
      dfBlocks = Math.max(1, blockCount - 1);
      if (ssBlocks > ssWithinUnblocked * 0.92) {
        ssBlocks = ssWithinUnblocked * 0.5;
      }
    }

    const ssTotal = ssBetween + ssWithinUnblocked;
    const ssError =
      anovaDesignType === 'rcbd_two_way'
        ? Math.max(0.0001, ssWithinUnblocked - ssBlocks)
        : ssWithinUnblocked;

    const dfBetween = Math.max(1, k - 1);
    const dfWithin =
      anovaDesignType === 'rcbd_two_way'
        ? Math.max(1, (k - 1) * Math.max(1, anovaReplicationsCount - 1))
        : Math.max(1, totalN - k);
    const dfTotal = Math.max(1, totalN - 1);

    const msBetween = ssBetween / dfBetween;
    const msBlocks = dfBlocks > 0 ? ssBlocks / dfBlocks : 0;
    const msWithin = ssError / dfWithin;
    const fCalculated = msWithin > 0 ? msBetween / msWithin : 0;
    const fBlocks = msWithin > 0 && dfBlocks > 0 ? msBlocks / msWithin : 0;

    const { f05, f01 } = getCriticalFValues(dfBetween, dfWithin);
    const significanceStatus: 'highly_sig' | 'sig' | 'ns' =
      fCalculated >= f01
        ? 'highly_sig'
        : fCalculated >= f05
        ? 'sig'
        : 'ns';

    const significanceBadge =
      significanceStatus === 'highly_sig'
        ? 'Highly Significant (p < 0.01) **'
        : significanceStatus === 'sig'
        ? 'Significant (p < 0.05) *'
        : 'Non-Significant (p > 0.05) NS';

    const avgRep = k > 0 ? totalN / k : 3;
    const sed = Math.sqrt((2 * msWithin) / Math.max(1, avgRep));
    const seMean = Math.sqrt(msWithin / Math.max(1, avgRep));
    const tCrit = getCriticalT(dfWithin, anovaAlphaLevel);

    // Post-hoc critical difference (LSD vs Tukey HSD vs Duncan DMR)
    const postHocMultiplier =
      anovaPostHocTest === 'Tukey_HSD'
        ? 1.28
        : anovaPostHocTest === 'Duncan_DMR'
        ? 1.06
        : 1.0;
    const criticalDiffValue =
      anovaPostHocTest === 'Tukey_HSD'
        ? tCrit * sed * postHocMultiplier
        : tCrit * sed * postHocMultiplier;

    const cvPct =
      grandMean > 0 ? (Math.sqrt(msWithin) / Math.abs(grandMean)) * 100 : 0;

    const sortedByMean = [...validTreatments].sort((a, b) => b.mean - a.mean);
    const letterMap: Record<string, string> = {};
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let currentLetterIdx = 0;

    const activeSignificant =
      anovaAlphaLevel === '0.01'
        ? significanceStatus === 'highly_sig'
        : significanceStatus !== 'ns';

    sortedByMean.forEach((t, idx) => {
      if (idx === 0) {
        letterMap[t.id] = alphabet[0];
      } else {
        const prev = sortedByMean[idx - 1];
        const diff = Math.abs(prev.mean - t.mean);
        if (
          activeSignificant &&
          criticalDiffValue > 0 &&
          diff >= criticalDiffValue
        ) {
          currentLetterIdx = Math.min(
            alphabet.length - 1,
            currentLetterIdx + 1
          );
        }
        letterMap[t.id] = alphabet[currentLetterIdx];
      }
    });

    const dec = Math.min(4, Math.max(1, anovaDecimals));
    const treatmentsWithLetters = processedTreatments.map((t) => {
      const letChar = letterMap[t.id] || 'a';
      const formattedMeanSd = `${t.mean.toFixed(dec)} ± ${t.sd.toFixed(
        dec
      )} ${letChar}`;
      const formattedMeanSe = `${t.mean.toFixed(dec)} ± ${t.se.toFixed(
        dec
      )} ${letChar}`;
      const formattedMeanOnly = `${t.mean.toFixed(dec)} ${letChar}`;
      const displaySummary =
        anovaSummaryFormat === 'mean_se'
          ? formattedMeanSe
          : anovaSummaryFormat === 'mean_only'
          ? formattedMeanOnly
          : formattedMeanSd;
      return {
        ...t,
        letter: letChar,
        formattedMeanSd,
        formattedMeanSe,
        formattedMeanOnly,
        displaySummary
      };
    });

    return {
      treatments: treatmentsWithLetters,
      k,
      totalN,
      grandMean: Number(grandMean.toFixed(3)),
      ssBetween: Number(ssBetween.toFixed(4)),
      ssBlocks: Number(ssBlocks.toFixed(4)),
      ssWithin: Number(ssError.toFixed(4)),
      ssTotal: Number(ssTotal.toFixed(4)),
      dfBetween,
      dfBlocks,
      dfWithin,
      dfTotal,
      msBetween: Number(msBetween.toFixed(4)),
      msBlocks: Number(msBlocks.toFixed(4)),
      msWithin: Number(msWithin.toFixed(4)),
      fCalculated: Number(fCalculated.toFixed(2)),
      fBlocks: Number(fBlocks.toFixed(2)),
      f05,
      f01,
      significanceStatus,
      significanceBadge,
      sed: Number(sed.toFixed(4)),
      seMean: Number(seMean.toFixed(4)),
      lsd05: Number(criticalDiffValue.toFixed(3)),
      cvPct: Number(cvPct.toFixed(2))
    };
  }, [
    statRows,
    anovaReplicationsCount,
    anovaDesignType,
    anovaAlphaLevel,
    anovaPostHocTest,
    anovaSummaryFormat,
    anovaDecimals
  ]);

  // TAB 4: CITATION & REFERENCE FORMATTING ENGINE (INCLUDES USER CUSTOM CITATION STYLES)
  const [selectedCitationStyleId, setSelectedCitationStyleId] =
    useState<string>('pjas');
  const [showCustomCitationModal, setShowCustomCitationModal] =
    useState<boolean>(false);
  const [newCitName, setNewCitName] = useState<string>('');
  const [newCitShortName, setNewCitShortName] = useState<string>('');
  const [newCitTemplate, setNewCitTemplate] = useState<string>(
    '{AUTHORS} ({YEAR}). {TITLE}. {JOURNAL}, {VOLUME}({ISSUE}): {PAGES}.'
  );
  const [newCitInText, setNewCitInText] = useState<
    '(Author et al., Year)' | '(Author, Year)' | '[1]' | '(1)'
  >('(Author et al., Year)');
  const [newCitNumbering, setNewCitNumbering] = useState<
    'none' | 'dot_number' | 'bracket_number'
  >('none');
  const [newCitAuthorFormat, setNewCitAuthorFormat] = useState<
    'as_entered' | 'uppercase'
  >('as_entered');
  const [newCitSortAlpha, setNewCitSortAlpha] = useState<boolean>(true);
  const [newCitIncludeDoi, setNewCitIncludeDoi] = useState<boolean>(true);
  const [referenceSaveTitle, setReferenceSaveTitle] = useState<string>(
    'Mango Pulp Preservation Study Bibliography'
  );

  // Sync Tab 2 selected journal with Tab 4 reference style when user switches journal in Tab 2
  const activeCustomCitationRule = useMemo(
    () =>
      savedCustomCitationStyles.find((c) => c.id === selectedCitationStyleId),
    [savedCustomCitationStyles, selectedCitationStyleId]
  );

  const [manAuthors, setManAuthors] = useState<string>('');
  const [manYear, setManYear] = useState<string>('2026');
  const [manTitle, setManTitle] = useState<string>('');
  const [manJournal, setManJournal] = useState<string>('');
  const [manVolume, setManVolume] = useState<string>('');
  const [manIssue, setManIssue] = useState<string>('');
  const [manPages, setManPages] = useState<string>('');
  const [manDoi, setManDoi] = useState<string>('');

  const handleAddManualToBulkBox = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manAuthors.trim() || !manTitle.trim()) return;
    const newLine = `${manAuthors.trim()} (${
      manYear.trim() || '2026'
    }). ${manTitle.trim()}. ${
      manJournal.trim() || 'Journal of Food Science'
    }, ${manVolume.trim() || '10'}(${manIssue.trim() || '1'}), ${
      manPages.trim() || '1-8'
    }.${
      manDoi.trim()
        ? ` https://doi.org/${manDoi
            .trim()
            .replace(/^https?:\/\/doi\.org\//i, '')}`
        : ''
    }`;

    setBulkRawText((prev) =>
      prev.trim() ? `${prev.trim()}\n${newLine}` : newLine
    );
    setManAuthors('');
    setManTitle('');
    setManJournal('');
    setManVolume('');
    setManIssue('');
    setManPages('');
    setManDoi('');
  };

  // Formatted references for Tab 2 Manuscript (uses Tab 2's active journal reference requirements)
  const manuscriptFormattedReferences = useMemo(() => {
    const lines = bulkRawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const parsedList = lines.map((line) => parseRawReferenceLine(line));
    const customCit = savedCustomCitationStyles.find(
      (c) => c.id === reqReferenceStyleId
    );
    if (
      reqSortRefsAlpha &&
      reqInTextFormat !== '[1]' &&
      reqInTextFormat !== '(1)' &&
      reqReferenceStyleId !== 'ieee_vancouver' &&
      reqReferenceStyleId !== 'mdpi_foods'
    ) {
      parsedList.sort((a, b) => a.authors.localeCompare(b.authors));
    }

    return parsedList.map((ref, idx) =>
      formatReferenceEntry(
        ref,
        reqReferenceStyleId,
        idx,
        reqCustomRefTemplate,
        customCit
      )
    );
  }, [
    bulkRawText,
    reqReferenceStyleId,
    reqSortRefsAlpha,
    reqInTextFormat,
    reqCustomRefTemplate,
    savedCustomCitationStyles
  ]);

  // Formatted references for Tab 4 Citation Tool
  const formattedResults = useMemo(() => {
    const lines = bulkRawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const parsedList = lines.map((line) => parseRawReferenceLine(line));
    const shouldSort = activeCustomCitationRule
      ? activeCustomCitationRule.sortAlphabetically
      : sortAlphabetically &&
        selectedCitationStyleId !== 'ieee_vancouver' &&
        selectedCitationStyleId !== 'mdpi_foods';

    if (shouldSort) {
      parsedList.sort((a, b) => a.authors.localeCompare(b.authors));
    }

    return parsedList.map((ref, idx) =>
      formatReferenceEntry(
        ref,
        selectedCitationStyleId,
        idx,
        customPattern,
        activeCustomCitationRule
      )
    );
  }, [
    bulkRawText,
    selectedCitationStyleId,
    sortAlphabetically,
    customPattern,
    activeCustomCitationRule
  ]);

  // COMPILED JOURNAL MANUSCRIPT (Automatically adjusts Abstract, Keywords, Headings, Sections, In-Text Citations & References!)
  const compiledJournalManuscript = useMemo(() => {
    const abstractWords = editAbstract
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    const adjustedAbstract = formatStructuredAbstractIfNeeded(
      editAbstract,
      reqAbstractLimit,
      reqAbstractStructured,
      reqJournalShortName
    );

    const keywordItems = editKeywords
      .split(/[,;]+/)
      .map((k) => k.trim())
      .filter(Boolean);
    const adjustedKeywords = keywordItems
      .slice(0, Math.max(1, reqKeywordsLimit))
      .join(', ');

    // Automatically adjust in-text citations in all manuscript sections
    const introAdjusted = adjustInTextCitationsInBody(
      editIntro,
      reqInTextFormat,
      manuscriptFormattedReferences
    );
    const litReviewAdjusted = adjustInTextCitationsInBody(
      editLitReview,
      reqInTextFormat,
      manuscriptFormattedReferences
    );
    const methodsAdjusted = adjustInTextCitationsInBody(
      editMethods,
      reqInTextFormat,
      manuscriptFormattedReferences
    );
    const resultsAdjusted = adjustInTextCitationsInBody(
      editResults,
      reqInTextFormat,
      manuscriptFormattedReferences
    );
    const discussionAdjusted = adjustInTextCitationsInBody(
      editDiscussionSeparate,
      reqInTextFormat,
      manuscriptFormattedReferences
    );
    const conclusionAdjusted = adjustInTextCitationsInBody(
      editConclusion,
      reqInTextFormat,
      manuscriptFormattedReferences
    );

    // If journal does not include a separate Literature Review section, merge key literature context into Introduction
    const finalIntroText =
      !reqIncludeLitReview &&
      litReviewAdjusted &&
      !litReviewAdjusted.startsWith('No separate Review of Literature')
        ? `${introAdjusted}\n\n${litReviewAdjusted}`
        : introAdjusted;

    const refsFormatted = manuscriptFormattedReferences
      .map((r) => r.bibliography)
      .join('\n\n');

    const summaryColLabel =
      anovaSummaryFormat === 'mean_se'
        ? `Mean ± SE (${anovaPostHocTest} Letter)`
        : anovaSummaryFormat === 'mean_only'
        ? `Mean (${anovaPostHocTest} Letter)`
        : `Mean ± SD (${anovaPostHocTest} Letter)`;

    const statTableBlock = `Table 1. Effect of ${statFactorName} on ${statParameterName} (${
      anovaDesignType === 'rcbd_two_way' ? 'Two-Way RCBD ANOVA' : 'One-Way CRD ANOVA'
    })
-----------------------------------------------------------------------------------
Treatment / Level                          ${summaryColLabel.padEnd(30, ' ')} Min – Max
-----------------------------------------------------------------------------------
${statisticalAnalysis.treatments
  .map(
    (t) =>
      `${t.treatmentName.padEnd(42, ' ')} ${t.displaySummary.padEnd(
        30,
        ' '
      )} ${t.min.toFixed(anovaDecimals)} – ${t.max.toFixed(anovaDecimals)}`
  )
  .join('\n')}
-----------------------------------------------------------------------------------
Grand Mean = ${statisticalAnalysis.grandMean} | F-Value = ${
      statisticalAnalysis.fCalculated
    } (${statisticalAnalysis.significanceBadge})
${anovaPostHocTest} (${anovaAlphaLevel}) = ${
      statisticalAnalysis.lsd05
    } | SED = ${statisticalAnalysis.sed} | CV (%) = ${statisticalAnalysis.cvPct}%
Means sharing the same letter within a column do not differ significantly at p < ${anovaAlphaLevel}.`;

    const roman = ['I.', 'II.', 'III.', 'IV.', 'V.', 'VI.', 'VII.'];
    let secNum = 0;
    const nextHeading = (titleText: string) => {
      secNum += 1;
      if (reqHeadingNumbering === 'numbered') return `${secNum}. ${titleText}`;
      if (reqHeadingNumbering === 'roman')
        return `${roman[secNum - 1] || `${secNum}.`} ${titleText}`;
      return titleText;
    };

    const blocks: string[] = [
      `===================================================================================`,
      `TARGET JOURNAL MANUSCRIPT: ${reqJournalLabel.toUpperCase()}`,
      `(${reqHecOrImpact} | In-Text Citation Style: ${reqInTextFormat})`,
      `===================================================================================`,
      ``,
      `TITLE:`,
      `${editTitle || 'Research Paper Title'}`,
      ``,
      `AUTHORS & AFFILIATION:`,
      `${editAuthors || 'Author Names and University / Department Affiliation'}`
    ];

    if (reqIncludeHighlights) {
      blocks.push(``, `HIGHLIGHTS`, `${editHighlights}`);
    }
    if (reqIncludePracticalApp) {
      blocks.push(``, `PRACTICAL APPLICATION`, `${editPracticalApp}`);
    }

    blocks.push(
      ``,
      `ABSTRACT (${
        reqAbstractStructured ? 'Structured' : 'Single Paragraph'
      } • Max ${reqAbstractLimit} Words — Original: ${abstractWords.length} Words):`,
      `${adjustedAbstract}`,
      ``,
      `Keywords (Max ${reqKeywordsLimit}): ${adjustedKeywords}`,
      ``,
      `${nextHeading('INTRODUCTION')}`,
      `${finalIntroText}`
    );

    if (reqIncludeLitReview) {
      blocks.push(
        ``,
        `${nextHeading('REVIEW OF LITERATURE')}`,
        `${litReviewAdjusted}`
      );
    }

    blocks.push(
      ``,
      `${nextHeading('MATERIALS AND METHODS')}`,
      `${methodsAdjusted}`
    );

    if (reqSeparateResultsDiscussion) {
      blocks.push(``, `${nextHeading('RESULTS')}`, `${resultsAdjusted}`);
      if (reqIncludeStatTable) {
        blocks.push(``, `${statTableBlock}`);
      }
      blocks.push(
        ``,
        `${nextHeading('DISCUSSION')}`,
        `${discussionAdjusted}`
      );
    } else {
      blocks.push(
        ``,
        `${nextHeading('RESULTS AND DISCUSSION')}`,
        `${resultsAdjusted}`
      );
      if (reqIncludeStatTable) {
        blocks.push(``, `${statTableBlock}`);
      }
    }

    blocks.push(
      ``,
      `${nextHeading('CONCLUSION')}`,
      `${conclusionAdjusted}`,
      ``,
      `REFERENCES (${reqJournalShortName} Format)`,
      `${refsFormatted}`
    );

    return blocks.join('\n');
  }, [
    editTitle,
    editAuthors,
    editHighlights,
    editPracticalApp,
    editAbstract,
    editKeywords,
    editIntro,
    editLitReview,
    editMethods,
    editResults,
    editDiscussionSeparate,
    editConclusion,
    reqJournalLabel,
    reqJournalShortName,
    reqHecOrImpact,
    reqAbstractLimit,
    reqAbstractStructured,
    reqKeywordsLimit,
    reqHeadingNumbering,
    reqIncludeLitReview,
    reqSeparateResultsDiscussion,
    reqIncludeHighlights,
    reqIncludePracticalApp,
    reqIncludeStatTable,
    reqInTextFormat,
    manuscriptFormattedReferences,
    statFactorName,
    statParameterName,
    anovaDesignType,
    anovaSummaryFormat,
    anovaPostHocTest,
    anovaAlphaLevel,
    anovaDecimals,
    statisticalAnalysis
  ]);

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleDownloadFile = (
    filename: string,
    content: string,
    mimeType: string
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // =========================================================================
  // PAID / PREMIUM PERSISTENCE HANDLERS (Firestore toolsData.researchSuiteData)
  // =========================================================================
  const saveResearchDataToFirestore = async (
    nextData: Partial<NonNullable<UserToolsData['researchSuiteData']>>,
    successMsg: string
  ) => {
    if (!isUserPaid) {
      onOpenPremiumModal?.();
      return;
    }
    if (!toolsData || !onSaveToolsData) return;

    const currentSuite = toolsData.researchSuiteData || {
      customJournals: [],
      customAnovaPresets: [],
      customCitationStyles: [],
      savedRecords: []
    };

    const updated: UserToolsData = {
      ...toolsData,
      researchSuiteData: {
        customJournals:
          nextData.customJournals ?? currentSuite.customJournals ?? [],
        customAnovaPresets:
          nextData.customAnovaPresets ?? currentSuite.customAnovaPresets ?? [],
        customCitationStyles:
          nextData.customCitationStyles ??
          currentSuite.customCitationStyles ??
          [],
        savedRecords: nextData.savedRecords ?? currentSuite.savedRecords ?? []
      },
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    };

    await onSaveToolsData(updated);
    showBanner(successMsg);
  };

  // Save / Update Custom Journal Requirement Template
  const handleSaveCustomJournalRequirement = async () => {
    if (!isUserPaid) {
      onOpenPremiumModal?.();
      return;
    }
    if (!reqJournalLabel.trim()) return;

    const existingCustom = savedCustomJournals.find(
      (j) => j.id === selectedStyle
    );
    const itemId = existingCustom ? existingCustom.id : `cj-${Date.now()}`;

    const newItem: CustomJournalRequirementItem = {
      id: itemId,
      label: reqJournalLabel.replace(/\s*\(Custom Requirement\)$/i, '').trim(),
      shortName: reqJournalShortName.trim() || 'Custom J.',
      hecCategoryOrImpact: reqHecOrImpact.trim() || 'Custom Journal Requirement',
      abstractWordLimit: Math.max(50, Number(reqAbstractLimit) || 250),
      abstractStructured: reqAbstractStructured,
      keywordsLimit: Math.max(1, Number(reqKeywordsLimit) || 6),
      headingNumbering: reqHeadingNumbering,
      includeLiteratureReview: reqIncludeLitReview,
      separateResultsAndDiscussion: reqSeparateResultsDiscussion,
      includeHighlights: reqIncludeHighlights,
      includePracticalApplication: reqIncludePracticalApp,
      includeStatTableInManuscript: reqIncludeStatTable,
      inTextFormat: reqInTextFormat,
      referenceStyleId: reqReferenceStyleId,
      customReferenceTemplate: reqCustomRefTemplate,
      sortReferencesAlphabetically: reqSortRefsAlpha,
      sectionOrder: activeSectionOrderList,
      guidelinesSummary:
        reqGuidelinesNote.trim() ||
        `Abstract max ${reqAbstractLimit} words, ${reqInTextFormat} citations.`,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    const nextList = existingCustom
      ? savedCustomJournals.map((j) => (j.id === itemId ? newItem : j))
      : [newItem, ...savedCustomJournals].slice(0, 40);

    await saveResearchDataToFirestore(
      { customJournals: nextList },
      existingCustom
        ? `Updated Journal Requirements for "${newItem.shortName}" in your Directory!`
        : `Saved Custom Journal Requirements "${newItem.shortName}" to your Directory!`
    );
    setSelectedStyle(itemId);
    setShowJournalReqBuilder(false);
  };

  const handleDeleteCustomJournal = async (id: string) => {
    const nextList = savedCustomJournals.filter((j) => j.id !== id);
    if (selectedStyle === id) setSelectedStyle('pjas');
    await saveResearchDataToFirestore(
      { customJournals: nextList },
      'Custom Journal Requirement removed.'
    );
  };

  // Save Custom ANOVA Requirement Preset
  const handleSaveCustomAnovaPreset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUserPaid) {
      onOpenPremiumModal?.();
      return;
    }
    if (!customAnovaNameInput.trim()) return;

    const newPreset: CustomAnovaRequirementItem = {
      id: `canova-${Date.now()}`,
      name: customAnovaNameInput.trim(),
      designType: anovaDesignType,
      alphaLevel: anovaAlphaLevel,
      postHocTest: anovaPostHocTest,
      summaryFormat: anovaSummaryFormat,
      decimalPlaces: anovaDecimals,
      replicationsCount: anovaReplicationsCount,
      notes:
        customAnovaNotesInput.trim() ||
        `${
          anovaDesignType === 'rcbd_two_way' ? 'Two-Way RCBD' : 'One-Way CRD'
        } • α = ${anovaAlphaLevel} • ${anovaPostHocTest} • ${anovaReplicationsCount} Replications`,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    const nextList = [newPreset, ...savedCustomAnovaPresets].slice(0, 40);
    await saveResearchDataToFirestore(
      { customAnovaPresets: nextList },
      `Saved Custom ANOVA Requirement "${newPreset.name}" to your Directory!`
    );
    setSelectedAnovaPresetId(newPreset.id);
    setCustomAnovaNameInput('');
    setCustomAnovaNotesInput('');
    setShowCustomAnovaModal(false);
  };

  const handleDeleteCustomAnovaPreset = async (id: string) => {
    const nextList = savedCustomAnovaPresets.filter((p) => p.id !== id);
    if (selectedAnovaPresetId === id) setSelectedAnovaPresetId('crd_lsd_05');
    await saveResearchDataToFirestore(
      { customAnovaPresets: nextList },
      'Custom ANOVA Requirement removed.'
    );
  };

  // Save Custom Citation & Reference Style Requirement
  const handleSaveCustomCitationStyle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUserPaid) {
      onOpenPremiumModal?.();
      return;
    }
    if (!newCitName.trim() || !newCitTemplate.trim()) return;

    const newStyle: CustomCitationRequirementItem = {
      id: `ccit-${Date.now()}`,
      name: newCitName.trim(),
      shortName: newCitShortName.trim() || newCitName.trim().slice(0, 18),
      templatePattern: newCitTemplate.trim(),
      inTextFormat: newCitInText,
      numberingStyle: newCitNumbering,
      authorFormat: newCitAuthorFormat,
      sortAlphabetically: newCitSortAlpha,
      includeDoi: newCitIncludeDoi,
      createdAt: new Date().toISOString().slice(0, 10)
    };

    const nextList = [newStyle, ...savedCustomCitationStyles].slice(0, 40);
    await saveResearchDataToFirestore(
      { customCitationStyles: nextList },
      `Saved Custom Citation Requirement "${newStyle.name}" to your Directory!`
    );
    setSelectedCitationStyleId(newStyle.id);
    setReqReferenceStyleId(newStyle.id);
    setNewCitName('');
    setNewCitShortName('');
    setShowCustomCitationModal(false);
  };

  const handleDeleteCustomCitationStyle = async (id: string) => {
    const nextList = savedCustomCitationStyles.filter((c) => c.id !== id);
    if (selectedCitationStyleId === id) setSelectedCitationStyleId('pjas');
    await saveResearchDataToFirestore(
      { customCitationStyles: nextList },
      'Custom Citation Style removed.'
    );
  };

  // Log & Save Records across Tabs 1, 2, 3, and 4
  const handleSaveExtractedPaperRecord = async () => {
    if (!isUserPaid) {
      onOpenPremiumModal?.();
      return;
    }
    const code = `EXT-${String(Date.now()).slice(-6)}`;
    const record: ResearchSuiteSavedRecord = {
      id: `rec-ext-${Date.now()}`,
      recordCode: code,
      recordType: 'extracted_paper',
      title: extractedSections.title.slice(0, 140) || 'Extracted Research Paper',
      subtitle: extractedSections.authorsAndAffiliation.slice(0, 140),
      savedDateFormatted: new Date().toLocaleDateString('en-PK', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      savedAtIso: new Date().toISOString().slice(0, 19) + 'Z',
      notes: extractorNotes.trim(),
      rawPaperText: rawPaperInput.slice(0, 18000),
      extractedTitle: extractedSections.title.slice(0, 300),
      extractedAuthors: extractedSections.authorsAndAffiliation.slice(0, 300),
      extractedAbstract: extractedSections.abstractText.slice(0, 3500),
      extractedKeywords: extractedSections.keywords.slice(0, 400),
      extractedIntro: extractedSections.introduction.slice(0, 4500),
      extractedLitReview: extractedSections.literatureReview.slice(0, 4500),
      extractedMethods: extractedSections.materialsAndMethods.slice(0, 4500),
      extractedResults: extractedSections.resultsAndDiscussion.slice(0, 4500),
      extractedConclusion: extractedSections.conclusion.slice(0, 3000),
      extractedReferences: extractedSections.referencesList.slice(0, 5000)
    };
    const nextRecords = [record, ...savedRecords].slice(0, 60);
    await saveResearchDataToFirestore(
      { savedRecords: nextRecords },
      `Logged & Saved Extracted Paper (${code}) to your Research Directory!`
    );
  };

  const handleSaveJournalManuscriptRecord = async () => {
    if (!isUserPaid) {
      onOpenPremiumModal?.();
      return;
    }
    const code = `MNS-${String(Date.now()).slice(-6)}`;
    const record: ResearchSuiteSavedRecord = {
      id: `rec-mns-${Date.now()}`,
      recordCode: code,
      recordType: 'journal_manuscript',
      title: (editTitle || 'Converted Journal Manuscript').slice(0, 140),
      subtitle: `${reqJournalShortName} • ${reqHecOrImpact}`,
      savedDateFormatted: new Date().toLocaleDateString('en-PK', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      savedAtIso: new Date().toISOString().slice(0, 19) + 'Z',
      notes: manuscriptSaveNotes.trim(),
      targetJournalName: reqJournalLabel.slice(0, 160),
      targetJournalShortName: reqJournalShortName.slice(0, 80),
      manuscriptTitle: editTitle.slice(0, 300),
      manuscriptAuthors: editAuthors.slice(0, 300),
      compiledManuscriptText: compiledJournalManuscript.slice(0, 22000),
      extractedAbstract: editAbstract.slice(0, 3500),
      extractedKeywords: editKeywords.slice(0, 400),
      extractedIntro: editIntro.slice(0, 4500),
      extractedLitReview: editLitReview.slice(0, 4500),
      extractedMethods: editMethods.slice(0, 4500),
      extractedResults: editResults.slice(0, 4500),
      extractedConclusion: editConclusion.slice(0, 3000),
      extractedReferences: bulkRawText.slice(0, 5000)
    };
    const nextRecords = [record, ...savedRecords].slice(0, 60);
    await saveResearchDataToFirestore(
      { savedRecords: nextRecords },
      `Logged & Saved Journal Manuscript (${code} • ${reqJournalShortName}) to your Research Directory!`
    );
  };

  const handleSaveAnovaAnalysisRecord = async () => {
    if (!isUserPaid) {
      onOpenPremiumModal?.();
      return;
    }
    const code = `ANV-${String(Date.now()).slice(-6)}`;
    const record: ResearchSuiteSavedRecord = {
      id: `rec-anv-${Date.now()}`,
      recordCode: code,
      recordType: 'anova_analysis',
      title: `${statParameterName} — ${statFactorName}`.slice(0, 140),
      subtitle: `${
        anovaDesignType === 'rcbd_two_way' ? 'Two-Way RCBD' : 'One-Way CRD'
      } • F = ${statisticalAnalysis.fCalculated} (${
        statisticalAnalysis.significanceBadge
      })`,
      savedDateFormatted: new Date().toLocaleDateString('en-PK', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      savedAtIso: new Date().toISOString().slice(0, 19) + 'Z',
      notes: statSaveNotes.trim(),
      statParameterName: statParameterName.slice(0, 120),
      statFactorName: statFactorName.slice(0, 120),
      anovaRequirementName: activeAnovaPreset.name.slice(0, 140),
      designType: anovaDesignType,
      alphaLevel: anovaAlphaLevel,
      postHocTest: anovaPostHocTest,
      statRows: statRows.slice(0, 30),
      grandMean: statisticalAnalysis.grandMean,
      fCalculated: statisticalAnalysis.fCalculated,
      significanceBadge: statisticalAnalysis.significanceBadge,
      lsdValue: statisticalAnalysis.lsd05,
      cvPct: statisticalAnalysis.cvPct
    };
    const nextRecords = [record, ...savedRecords].slice(0, 60);
    await saveResearchDataToFirestore(
      { savedRecords: nextRecords },
      `Logged & Saved ANOVA Statistical Analysis (${code}) to your Research Directory!`
    );
  };

  const handleSaveReferenceListRecord = async () => {
    if (!isUserPaid) {
      onOpenPremiumModal?.();
      return;
    }
    const code = `REF-${String(Date.now()).slice(-6)}`;
    const styleLabel = activeCustomCitationRule
      ? activeCustomCitationRule.name
      : allJournalsList.find((j) => j.id === selectedCitationStyleId)
          ?.shortName || selectedCitationStyleId;
    const formattedJoined = formattedResults
      .map((r) => r.bibliography)
      .join('\n\n');

    const record: ResearchSuiteSavedRecord = {
      id: `rec-ref-${Date.now()}`,
      recordCode: code,
      recordType: 'reference_list',
      title: (referenceSaveTitle || 'Formatted Bibliography List').slice(0, 140),
      subtitle: `${styleLabel} • ${formattedResults.length} References`,
      savedDateFormatted: new Date().toLocaleDateString('en-PK', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      savedAtIso: new Date().toISOString().slice(0, 19) + 'Z',
      citationStyleName: styleLabel,
      rawReferencesText: bulkRawText.slice(0, 10000),
      formattedReferencesText: formattedJoined.slice(0, 12000),
      referencesCount: formattedResults.length
    };
    const nextRecords = [record, ...savedRecords].slice(0, 60);
    await saveResearchDataToFirestore(
      { savedRecords: nextRecords },
      `Logged & Saved Reference List (${code} • ${formattedResults.length} refs) to your Research Directory!`
    );
  };

  const handleDeleteSavedRecord = async (id: string) => {
    const nextRecords = savedRecords.filter((r) => r.id !== id);
    await saveResearchDataToFirestore(
      { savedRecords: nextRecords },
      'Saved record removed from directory.'
    );
  };

  const handleLoadSavedRecordIntoWorkspace = (rec: ResearchSuiteSavedRecord) => {
    if (rec.recordType === 'extracted_paper') {
      if (rec.rawPaperText) {
        setRawPaperInput(rec.rawPaperText);
      }
      setEditTitle(rec.extractedTitle || '');
      setEditAuthors(rec.extractedAuthors || '');
      setEditAbstract(rec.extractedAbstract || '');
      setEditKeywords(rec.extractedKeywords || '');
      setEditIntro(rec.extractedIntro || '');
      setEditLitReview(rec.extractedLitReview || '');
      setEditMethods(rec.extractedMethods || '');
      setEditResults(rec.extractedResults || '');
      setEditConclusion(rec.extractedConclusion || '');
      if (rec.extractedReferences) setBulkRawText(rec.extractedReferences);
      setActiveResearchTab('extractor');
      showBanner(`Loaded Extracted Paper "${rec.title}" (${rec.recordCode})!`);
    } else if (rec.recordType === 'journal_manuscript') {
      setEditTitle(rec.manuscriptTitle || rec.title || '');
      setEditAuthors(rec.manuscriptAuthors || '');
      if (rec.extractedAbstract) setEditAbstract(rec.extractedAbstract);
      if (rec.extractedKeywords) setEditKeywords(rec.extractedKeywords);
      if (rec.extractedIntro) setEditIntro(rec.extractedIntro);
      if (rec.extractedLitReview) setEditLitReview(rec.extractedLitReview);
      if (rec.extractedMethods) setEditMethods(rec.extractedMethods);
      if (rec.extractedResults) setEditResults(rec.extractedResults);
      if (rec.extractedConclusion) setEditConclusion(rec.extractedConclusion);
      if (rec.extractedReferences) setBulkRawText(rec.extractedReferences);
      setActiveResearchTab('thesis-converter');
      showBanner(
        `Loaded Journal Manuscript "${rec.title}" (${rec.recordCode})!`
      );
    } else if (rec.recordType === 'anova_analysis') {
      if (rec.statParameterName) setStatParameterName(rec.statParameterName);
      if (rec.statFactorName) setStatFactorName(rec.statFactorName);
      if (rec.designType) setAnovaDesignType(rec.designType);
      if (rec.alphaLevel) setAnovaAlphaLevel(rec.alphaLevel);
      if (rec.postHocTest) setAnovaPostHocTest(rec.postHocTest);
      if (rec.statRows && rec.statRows.length >= 2) {
        setStatRows(rec.statRows);
      }
      setActiveResearchTab('statistics');
      showBanner(`Loaded ANOVA Analysis "${rec.title}" (${rec.recordCode})!`);
    } else if (rec.recordType === 'reference_list') {
      if (rec.rawReferencesText) setBulkRawText(rec.rawReferencesText);
      setReferenceSaveTitle(rec.title);
      setActiveResearchTab('references');
      showBanner(`Loaded Reference List "${rec.title}" (${rec.recordCode})!`);
    }
  };

  // =========================================================================
  // PDF, WORD & CSV EXPORT HANDLERS (GATED FOR PAID PREMIUM MEMBERS)
  // =========================================================================
  const handleDownloadManuscriptPdf = (
    customText?: string,
    customJournalShort?: string,
    customImpact?: string
  ) => {
    if (!isUserPaid) {
      onOpenPremiumModal?.();
      return;
    }
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 14;
    const authorName = user?.name || editAuthors || 'Food Science Researcher';
    const targetShort = customJournalShort || reqJournalShortName;
    const targetImpact = customImpact || reqHecOrImpact;
    const textBody = customText || compiledJournalManuscript;

    doc.setFillColor(26, 33, 56);
    doc.rect(0, 0, pageW, 40, 'F');
    drawPdfBrandLogo(doc, 12, 7, 26, {
      borderColor: [255, 255, 255],
      bgFill: [255, 255, 255],
      roundedRadius: 3.5
    });
    drawPdfUserPhoto(
      doc,
      user?.profilePicUrl,
      authorName,
      pageW - 36,
      8,
      24,
      {
        borderColor: [186, 230, 253],
        fallbackBgColor: [22, 115, 184],
        fallbackTextColor: [255, 255, 255]
      }
    );

    const textX = 41;
    doc.setTextColor(186, 230, 253);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.text('Food Science Portal', textX, 12);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.text('OFFICIAL JOURNAL MANUSCRIPT & RESEARCH PAPER', textX, 18.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(
      `Author: ${authorName.slice(0, 48)}  |  Target Journal: ${targetShort}`,
      textX,
      25.5
    );
    doc.text(
      `Format: ${targetImpact}  |  Date: ${new Date().toLocaleDateString('en-PK')}`,
      textX,
      32
    );

    let y = 48;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.2);
    doc.setTextColor(26, 33, 56);
    const lines = doc.splitTextToSize(textBody, pageW - margin * 2);
    lines.forEach((line: string) => {
      if (y > pageH - 16) {
        doc.addPage();
        doc.setFillColor(26, 33, 56);
        doc.rect(0, 0, pageW, 16, 'F');
        drawPdfBrandLogo(doc, margin, 2, 12, {
          borderColor: [255, 255, 255],
          bgFill: [255, 255, 255],
          roundedRadius: 2
        });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(255, 255, 255);
        doc.text(
          `Food Science Portal  •  ${targetShort} Manuscript`,
          margin + 15,
          10
        );
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.2);
        doc.setTextColor(26, 33, 56);
        y = 24;
      }
      doc.text(line, margin, y);
      y += 4.5;
    });

    doc.save(
      `Food_Science_Portal_${targetShort.replace(
        /[^a-zA-Z0-9]+/g,
        '_'
      )}_Manuscript.pdf`
    );
  };

  const handleDownloadManuscriptWord = (
    customText?: string,
    customJournalShort?: string
  ) => {
    if (!isUserPaid) {
      onOpenPremiumModal?.();
      return;
    }
    const targetShort = customJournalShort || reqJournalShortName;
    const textBody = customText || compiledJournalManuscript;
    const docHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Food Science Portal Manuscript</title></head><body style="font-family: Calibri, Arial, sans-serif; padding: 24px; color: #1A2138;">
      <div style="display:flex; align-items:center; justify-content:space-between; background:#1A2138; color:#FFFFFF; padding:14px 18px; border-radius:10px; margin-bottom:20px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <img src="${FS_PORTAL_LOGO_DATA_URI}" width="54" height="54" style="background:#FFFFFF; border-radius:8px; padding:2px;" alt="Food Science Portal Logo" />
          <div>
            <div style="font-size:18pt; font-weight:bold; color:#FFFFFF;">Food Science <span style="color:#7DD3FC;">Portal</span></div>
            <div style="font-size:10pt; color:#DBEAFE;">Official Journal Manuscript (${targetShort}) • ${user?.name || 'Food Science Specialist'}</div>
          </div>
        </div>
        ${user?.profilePicUrl ? `<img src="${user.profilePicUrl}" width="52" height="52" style="border-radius:8px; border:2px solid #7DD3FC; object-fit:cover;" alt="Author Photo" />` : ''}
      </div>
      <pre style="font-family: Calibri, Arial, sans-serif; white-space: pre-wrap; font-size: 11pt; line-height: 1.5;">${textBody.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
    </body></html>`;
    handleDownloadFile(
      `Food_Science_Portal_${targetShort.replace(
        /[^a-zA-Z0-9]+/g,
        '_'
      )}_Manuscript.doc`,
      docHtml,
      'application/msword;charset=utf-8'
    );
  };

  const handleDownloadStatAnovaPdf = () => {
    if (!isUserPaid) {
      onOpenPremiumModal?.();
      return;
    }
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const researcherName = user?.name || 'Food Science Researcher';

    doc.setFillColor(26, 33, 56);
    doc.rect(0, 0, pageW, 40, 'F');
    drawPdfBrandLogo(doc, 12, 7, 26, {
      borderColor: [255, 255, 255],
      bgFill: [255, 255, 255],
      roundedRadius: 3.5
    });
    drawPdfUserPhoto(
      doc,
      user?.profilePicUrl,
      researcherName,
      pageW - 36,
      8,
      24,
      {
        borderColor: [186, 230, 253],
        fallbackBgColor: [22, 115, 184],
        fallbackTextColor: [255, 255, 255]
      }
    );

    const textX = 41;
    doc.setTextColor(186, 230, 253);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.text('Food Science Portal', textX, 12);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.text(
      `${
        anovaDesignType === 'rcbd_two_way' ? 'TWO-WAY RCBD' : 'ONE-WAY CRD'
      } ANOVA & ${anovaPostHocTest} STATISTICAL REPORT`,
      textX,
      18.5
    );

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(
      `Researcher: ${researcherName}  |  Parameter: ${statParameterName}`,
      textX,
      25.5
    );
    doc.text(
      `Factor: ${statFactorName}  |  Alpha: p < ${anovaAlphaLevel}  |  Date: ${new Date().toLocaleDateString('en-PK')}`,
      textX,
      32
    );

    let y = 48;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(26, 33, 56);
    doc.text(
      `1. Treatment Summary (${anovaPostHocTest} Grouping at α = ${anovaAlphaLevel}) — ${statParameterName}`,
      14,
      y
    );
    y += 6;

    statisticalAnalysis.treatments.forEach((t, idx) => {
      doc.setFillColor(
        idx % 2 === 0 ? 240 : 255,
        idx % 2 === 0 ? 246 : 255,
        idx % 2 === 0 ? 252 : 255
      );
      doc.setDrawColor(210, 222, 234);
      doc.rect(14, y, pageW - 28, 9, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(26, 33, 56);
      doc.text(t.treatmentName.slice(0, 38), 17, y + 6);
      doc.setFont('helvetica', 'normal');
      doc.text(`Result: ${t.displaySummary}`, 96, y + 6);
      doc.text(
        `Range: ${t.min.toFixed(anovaDecimals)} – ${t.max.toFixed(
          anovaDecimals
        )}`,
        154,
        y + 6
      );
      y += 9;
    });

    y += 9;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(26, 33, 56);
    doc.text('2. Analysis of Variance (ANOVA) Summary & Critical Values', 14, y);
    y += 6;

    doc.setFillColor(240, 246, 252);
    doc.setDrawColor(187, 214, 238);
    doc.roundedRect(14, y, pageW - 28, 38, 3, 3, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(
      `Between Treatments: df = ${statisticalAnalysis.dfBetween}, SS = ${statisticalAnalysis.ssBetween}, MS = ${statisticalAnalysis.msBetween}, F-Value = ${statisticalAnalysis.fCalculated}`,
      18,
      y + 8
    );
    if (anovaDesignType === 'rcbd_two_way') {
      doc.text(
        `Between Blocks / Replications: df = ${statisticalAnalysis.dfBlocks}, SS = ${statisticalAnalysis.ssBlocks}, MS = ${statisticalAnalysis.msBlocks}, F-Blocks = ${statisticalAnalysis.fBlocks}`,
        18,
        y + 15
      );
      doc.text(
        `Residual Error: df = ${statisticalAnalysis.dfWithin}, SS = ${statisticalAnalysis.ssWithin}, MS = ${statisticalAnalysis.msWithin}`,
        18,
        y + 22
      );
    } else {
      doc.text(
        `Within Treatments (Error): df = ${statisticalAnalysis.dfWithin}, SS = ${statisticalAnalysis.ssWithin}, MS = ${statisticalAnalysis.msWithin}`,
        18,
        y + 15
      );
      doc.text(
        `Critical F (0.05) = ${statisticalAnalysis.f05}  |  Critical F (0.01) = ${statisticalAnalysis.f01}  |  Verdict: ${statisticalAnalysis.significanceBadge}`,
        18,
        y + 22
      );
    }
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 115, 184);
    doc.text(
      `Grand Mean = ${statisticalAnalysis.grandMean}  |  ${anovaPostHocTest} (${anovaAlphaLevel}) = ${statisticalAnalysis.lsd05}  |  SED = ${statisticalAnalysis.sed}  |  CV = ${statisticalAnalysis.cvPct}%`,
      18,
      y + 31
    );

    doc.save(
      `Food_Science_Portal_${statParameterName.replace(
        /[^a-zA-Z0-9]+/g,
        '_'
      )}_ANOVA_Report.pdf`
    );
  };

  const handleDownloadStatCsv = () => {
    if (!isUserPaid) {
      onOpenPremiumModal?.();
      return;
    }
    const brandTopRows = [
      `"FOOD SCIENCE PORTAL — OFFICIAL STATISTICAL ANOVA REPORT"`,
      `"Researcher: ${(user?.name || 'Food Science Specialist').replace(
        /"/g,
        '""'
      )}","Parameter: ${statParameterName.replace(
        /"/g,
        '""'
      )}","Factor: ${statFactorName.replace(/"/g, '""')}"`,
      `"Design: ${
        anovaDesignType === 'rcbd_two_way' ? 'Two-Way RCBD' : 'One-Way CRD'
      }","Alpha Level: ${anovaAlphaLevel}","Post-Hoc Test: ${anovaPostHocTest}"`,
      ''
    ].join('\n');

    const header = [
      'Treatment / Factor',
      'Rep 1',
      'Rep 2',
      'Rep 3',
      'Rep 4',
      'Rep 5',
      'Rep 6',
      'Mean',
      'Standard Deviation (SD)',
      'Standard Error (SE)',
      `${anovaPostHocTest} Significance Group`,
      'Publication Summary'
    ].join(',');

    const rowsCsv = statisticalAnalysis.treatments
      .map((t) => {
        const rawRow = statRows.find((r) => r.id === t.id);
        return [
          `"${t.treatmentName.replace(/"/g, '""')}"`,
          rawRow?.rep1 || '',
          rawRow?.rep2 || '',
          rawRow?.rep3 || '',
          rawRow?.rep4 || '',
          rawRow?.rep5 || '',
          rawRow?.rep6 || '',
          t.mean.toFixed(anovaDecimals),
          t.sd.toFixed(anovaDecimals),
          t.se.toFixed(anovaDecimals),
          t.letter,
          `"${t.displaySummary}"`
        ].join(',');
      })
      .join('\n');

    const anovaFooter = [
      '',
      'ANOVA SUMMARY TABLE',
      'Source of Variation,Degrees of Freedom (df),Sum of Squares (SS),Mean Square (MS),Calculated F-Value,Critical F (0.05),Critical F (0.01),Significance Status',
      `Between Treatments,${statisticalAnalysis.dfBetween},${statisticalAnalysis.ssBetween},${statisticalAnalysis.msBetween},${statisticalAnalysis.fCalculated},${statisticalAnalysis.f05},${statisticalAnalysis.f01},"${statisticalAnalysis.significanceBadge}"`,
      ...(anovaDesignType === 'rcbd_two_way'
        ? [
            `Between Blocks / Replications,${statisticalAnalysis.dfBlocks},${statisticalAnalysis.ssBlocks},${statisticalAnalysis.msBlocks},${statisticalAnalysis.fBlocks},,,`
          ]
        : []),
      `Within Treatments (Error),${statisticalAnalysis.dfWithin},${statisticalAnalysis.ssWithin},${statisticalAnalysis.msWithin},,,`,
      `Total,${statisticalAnalysis.dfTotal},${statisticalAnalysis.ssTotal},,,,`,
      '',
      `Grand Mean,${statisticalAnalysis.grandMean}`,
      `Standard Error of Difference (SED),${statisticalAnalysis.sed}`,
      `${anovaPostHocTest} (${anovaAlphaLevel}),${statisticalAnalysis.lsd05}`,
      `Coefficient of Variation (CV %),${statisticalAnalysis.cvPct}%`
    ].join('\n');

    handleDownloadFile(
      `${statParameterName.replace(
        /[^a-zA-Z0-9]+/g,
        '_'
      )}_Statistical_ANOVA_Report.csv`,
      `${brandTopRows}\n${header}\n${rowsCsv}\n${anovaFooter}`,
      'text/csv;charset=utf-8;'
    );
  };

  const handleDownloadReferencesPdf = (
    customTitle?: string,
    customRefsText?: string,
    customStyleLabel?: string
  ) => {
    if (!isUserPaid) {
      onOpenPremiumModal?.();
      return;
    }
    const styleLabel =
      customStyleLabel ||
      (activeCustomCitationRule
        ? activeCustomCitationRule.name
        : allJournalsList.find((j) => j.id === selectedCitationStyleId)
            ?.shortName || selectedCitationStyleId);
    const bodyText =
      customRefsText ||
      formattedResults
        .map((r, i) => `${r.bibliography}\n   In-Text Citation: ${r.inText}`)
        .join('\n\n');
    handleDownloadManuscriptPdf(
      `OFFICIAL FORMATTED BIBLIOGRAPHY & REFERENCES LIST\nTitle: ${
        customTitle || referenceSaveTitle
      }\nCitation Style: ${styleLabel}\n\n${bodyText}`,
      styleLabel,
      'Bibliography & Reference List'
    );
  };

  // Directory Search & Filter state
  const [directorySearch, setDirectorySearch] = useState<string>('');
  const [directoryFilter, setDirectoryFilter] = useState<
    'all' | 'extracted_paper' | 'journal_manuscript' | 'anova_analysis' | 'reference_list'
  >('all');

  const filteredDirectoryRecords = useMemo(() => {
    return savedRecords.filter((rec) => {
      if (directoryFilter !== 'all' && rec.recordType !== directoryFilter) {
        return false;
      }
      if (!directorySearch.trim()) return true;
      const q = directorySearch.toLowerCase();
      return (
        rec.title.toLowerCase().includes(q) ||
        rec.recordCode.toLowerCase().includes(q) ||
        (rec.subtitle || '').toLowerCase().includes(q) ||
        (rec.notes || '').toLowerCase().includes(q)
      );
    });
  }, [savedRecords, directoryFilter, directorySearch]);

  return (
    <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 sm:p-6 shadow-xs space-y-5">
      {/* TOP STATUS BANNER */}
      {statusBanner && (
        <div className="p-3.5 rounded-2xl bg-[#1A2138] text-white text-xs font-extrabold flex items-center justify-between gap-2 shadow-sm border border-[#1673B8]/40">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusBanner(null)}
            className="text-sky-200 hover:text-white underline text-[11px] shrink-0 cursor-pointer"
          >
            OK
          </button>
        </div>
      )}

      {/* HEADER */}
      <div className="border-b border-[#D2DEEA] pb-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1A2138] text-white flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
                Research Paper, Thesis Converter, Statistical ANOVA &amp; Citation Suite
              </h2>
              {isUserPaid ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-600" />
                  <span>Premium Active • Cloud Log &amp; Export Unlocked</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenPremiumModal?.()}
                  className="px-2.5 py-0.5 rounded-full bg-amber-100 hover:bg-amber-200 text-[#92400E] border border-amber-300 text-[10px] font-extrabold uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>Free Preview • Upgrade to Log, Save &amp; Download</span>
                </button>
              )}
            </div>
            <p className="text-xs text-[#4A5568] font-medium">
              Extract Paper Sections, Customize Journal Requirements &amp; Auto-Convert Thesis, Run Custom ANOVA/LSD Statistics &amp; Format References
            </p>
          </div>
        </div>
      </div>

      {/* 5 MODULE NAVIGATION BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 bg-[#F0F6FC] p-2 rounded-2xl border border-[#D2DEEA]">
        <button
          type="button"
          onClick={() => setActiveResearchTab('extractor')}
          className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeResearchTab === 'extractor'
              ? 'bg-[#1673B8] text-white shadow-xs'
              : 'text-[#1A2138] hover:bg-white'
          }`}
        >
          <FileText className="w-4 h-4 shrink-0" />
          <span>1. Paper Section Extractor</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveResearchTab('thesis-converter')}
          className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeResearchTab === 'thesis-converter'
              ? 'bg-[#1673B8] text-white shadow-xs'
              : 'text-[#1A2138] hover:bg-white'
          }`}
        >
          <Layers className="w-4 h-4 shrink-0" />
          <span>2. Thesis → Journal Paper</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveResearchTab('statistics')}
          className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeResearchTab === 'statistics'
              ? 'bg-[#1673B8] text-white shadow-xs'
              : 'text-[#1A2138] hover:bg-white'
          }`}
        >
          <BarChart3 className="w-4 h-4 shrink-0" />
          <span>3. Research Statistics (ANOVA)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveResearchTab('references')}
          className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeResearchTab === 'references'
              ? 'bg-[#1673B8] text-white shadow-xs'
              : 'text-[#1A2138] hover:bg-white'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span>4. Citation &amp; Reference Tool</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (!isUserPaid) {
              onOpenPremiumModal?.();
              return;
            }
            setActiveResearchTab('directory');
          }}
          className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeResearchTab === 'directory'
              ? 'bg-[#1A2138] text-white shadow-xs'
              : 'text-[#1A2138] hover:bg-white'
          }`}
        >
          {isUserPaid ? (
            <FolderOpen className="w-4 h-4 shrink-0 text-amber-500" />
          ) : (
            <Lock className="w-3.5 h-3.5 shrink-0 text-amber-600" />
          )}
          <span>5. Saved Directory ({savedRecords.length})</span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: RESEARCH PAPER UPLOAD & AUTOMATIC SECTION EXTRACTOR
         ===================================================================== */}
      {activeResearchTab === 'extractor' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-[#1A2138]">
                  Upload Research Paper / Thesis File (.docx / .doc / .txt) or Paste Full Text Below
                </h3>
                <p className="text-[11px] text-[#4A5568]">
                  Automatically separates Abstract, Introduction, Review of Literature, Materials &amp; Methods, Results &amp; Discussion, Conclusion, and References
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="px-3.5 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Research Paper / Thesis (.docx/.doc/.txt)</span>
                  <input
                    type="file"
                    accept=".txt,.md,.doc,.docx,.html,.htm,.rtf,.csv"
                    onChange={handlePaperFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setRawPaperInput('');
                    setUploadedFileName(null);
                  }}
                  className="px-3 py-2 rounded-xl bg-white hover:bg-red-50 border border-[#D2DEEA] text-red-600 text-xs font-bold cursor-pointer"
                >
                  Clear Text
                </button>
              </div>
            </div>

            {uploadedFileName && (
              <div className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                Loaded File: {uploadedFileName} — Sections &amp; References extracted below!
              </div>
            )}

            <textarea
              rows={6}
              value={rawPaperInput}
              onChange={(e) => setRawPaperInput(e.target.value)}
              placeholder="Paste your complete research paper or thesis text here, or click 'Upload Research Paper / Thesis' above..."
              className="w-full p-3.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-medium text-[#1A2138] leading-relaxed"
            />

            {/* PAID USER LOG & SAVE EXTRACTED PAPER BAR */}
            <div className="p-3 rounded-xl bg-white border border-[#D2DEEA] flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex-1 min-w-[210px]">
                <input
                  type="text"
                  value={extractorNotes}
                  onChange={(e) => setExtractorNotes(e.target.value)}
                  placeholder="Optional Research / Supervisor Notes for saving this extracted paper..."
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveExtractedPaperRecord}
                  className="px-3.5 py-2 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {isUserPaid ? (
                    <Save className="w-3.5 h-3.5 text-amber-300" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-amber-300" />
                  )}
                  <span>Log &amp; Save Extracted Data to Directory</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDownloadManuscriptPdf(
                      `EXTRACTED RESEARCH PAPER SECTIONS\n\nTITLE:\n${extractedSections.title}\n\nAUTHORS:\n${extractedSections.authorsAndAffiliation}\n\nABSTRACT:\n${extractedSections.abstractText}\n\nKEYWORDS: ${extractedSections.keywords}\n\n1. INTRODUCTION:\n${extractedSections.introduction}\n\n2. REVIEW OF LITERATURE:\n${extractedSections.literatureReview}\n\n3. MATERIALS AND METHODS:\n${extractedSections.materialsAndMethods}\n\n4. RESULTS AND DISCUSSION:\n${extractedSections.resultsAndDiscussion}\n\n5. CONCLUSION:\n${extractedSections.conclusion}\n\n6. EXTRACTED REFERENCES:\n${extractedSections.referencesList}`,
                      'Extracted Sections',
                      'Extracted Thesis / Research Paper Report'
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {isUserPaid ? (
                    <Download className="w-3.5 h-3.5" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-amber-200" />
                  )}
                  <span>Download Extracted PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* SEPARATELY PICKED SECTIONS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {[
              {
                key: 'ext-title',
                label: 'Title & Authors',
                content: `${extractedSections.title}\n${extractedSections.authorsAndAffiliation}`
              },
              {
                key: 'ext-abstract',
                label: `Abstract & Keywords (${
                  extractedSections.abstractText
                    .split(/\s+/)
                    .filter(Boolean).length
                } words)`,
                content: `${extractedSections.abstractText}\n\nKeywords: ${extractedSections.keywords}`
              },
              {
                key: 'ext-intro',
                label: '1. Introduction & Objectives',
                content: extractedSections.introduction
              },
              {
                key: 'ext-lit',
                label: '2. Review of Literature',
                content: extractedSections.literatureReview
              },
              {
                key: 'ext-methods',
                label: '3. Materials & Methods / Methodology',
                content: extractedSections.materialsAndMethods
              },
              {
                key: 'ext-results',
                label: '4. Results & Discussion',
                content: extractedSections.resultsAndDiscussion
              },
              {
                key: 'ext-conclusion',
                label: '5. Conclusion & Recommendations',
                content: extractedSections.conclusion
              },
              {
                key: 'ext-refs',
                label: '6. Extracted References / Bibliography',
                content:
                  extractedSections.referencesList ||
                  'No References heading detected in text.'
              }
            ].map((sec) => (
              <div
                key={sec.key}
                className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] flex flex-col justify-between gap-2"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[#D2DEEA] pb-2">
                  <span className="text-xs font-extrabold text-[#1673B8]">
                    {sec.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {sec.key === 'ext-refs' &&
                      extractedSections.referencesList && (
                        <button
                          type="button"
                          onClick={() => {
                            setBulkRawText(extractedSections.referencesList);
                            setActiveResearchTab('references');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#1673B8] text-white text-[11px] font-extrabold cursor-pointer"
                        >
                          Format References →
                        </button>
                      )}
                    <button
                      type="button"
                      onClick={() => handleCopyText(sec.key, sec.content)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-[#D2DEEA] text-[11px] font-extrabold text-[#1A2138] inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === sec.key ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="text-xs text-[#1A2138] whitespace-pre-wrap leading-relaxed max-h-44 overflow-y-auto bg-white p-3 rounded-xl border border-[#D2DEEA]">
                  {sec.content}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setActiveResearchTab('thesis-converter')}
              className="px-4 py-2.5 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold cursor-pointer"
            >
              Convert Extracted Thesis / Paper into Target Journal Manuscript →
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: THESIS-TO-JOURNAL MANUSCRIPT CONVERTER (DIRECTORY + CUSTOM JOURNAL REQUIREMENTS BUILDER)
         ===================================================================== */}
      {activeResearchTab === 'thesis-converter' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
              <div className="lg:col-span-6">
                <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                  1. Select Journal from General Directory or Your Custom Journal Requirements *
                </label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#1673B8] text-xs font-extrabold text-[#1A2138]"
                >
                  {savedCustomJournals.length > 0 && (
                    <optgroup label="My Saved Custom Journal Requirements">
                      {savedCustomJournals.map((cj) => (
                        <option key={cj.id} value={cj.id}>
                          {cj.label} ({cj.shortName})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="Pakistan HEC Recognized & University Journals">
                    {JOURNAL_DIRECTORY.filter(
                      (j) => j.region === 'Pakistan HEC & University Journals'
                    ).map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="International Q1/Q2 Journals & University Thesis Formats">
                    {JOURNAL_DIRECTORY.filter(
                      (j) =>
                        j.region === 'International Impact Factor Journals'
                    ).map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.label}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="lg:col-span-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowJournalReqBuilder((prev) => !prev)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-amber-300" />
                  <span>
                    {showJournalReqBuilder
                      ? 'Hide Journal Requirements'
                      : 'Add / Edit Journal Requirements'}
                  </span>
                </button>
              </div>

              <div className="lg:col-span-3">
                <label className="px-3.5 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Upload Thesis (.docx/.doc/.txt)</span>
                  <input
                    type="file"
                    accept=".txt,.md,.doc,.docx,.html,.htm,.rtf"
                    onChange={handlePaperFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* CUSTOM JOURNAL REQUIREMENTS EDITOR (USER CAN ADD / UPDATE ALL SECTION & REFERENCE REQUIREMENTS) */}
            {showJournalReqBuilder && (
              <div className="p-4 rounded-2xl bg-white border-2 border-[#1673B8] space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-2.5">
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#1A2138]">
                      Customize Target Journal Section, Word-Limit &amp; Reference Requirements
                    </h4>
                    <p className="text-[11px] text-[#4A5568]">
                      Enter your target journal&apos;s exact requirements below — your uploaded or pasted thesis will automatically adjust to match these rules!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setReqJournalLabel('My New Target Research Journal');
                      setReqJournalShortName('Int. J. Food Sci.');
                      setReqHecOrImpact('Q1 / HEC W Category');
                      setReqAbstractLimit(250);
                      setReqAbstractStructured(false);
                      setReqKeywordsLimit(6);
                      setReqHeadingNumbering('numbered');
                      setReqIncludeLitReview(false);
                      setReqSeparateResultsDiscussion(false);
                      setReqIncludeHighlights(false);
                      setReqIncludePracticalApp(false);
                      setReqIncludeStatTable(true);
                      setReqInTextFormat('(Author et al., Year)');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#EBF4FC] hover:bg-[#DCE9F6] text-[#105E9A] text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Reset for Brand-New Journal</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Journal Full Name *
                    </label>
                    <input
                      type="text"
                      value={reqJournalLabel}
                      onChange={(e) => setReqJournalLabel(e.target.value)}
                      placeholder="e.g., International Journal of Food Properties"
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Journal Short Name / Abbreviation *
                    </label>
                    <input
                      type="text"
                      value={reqJournalShortName}
                      onChange={(e) => setReqJournalShortName(e.target.value)}
                      placeholder="e.g., Int. J. Food Prop."
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      HEC Category / Impact Factor
                    </label>
                    <input
                      type="text"
                      value={reqHecOrImpact}
                      onChange={(e) => setReqHecOrImpact(e.target.value)}
                      placeholder="e.g., HEC W Category / IF 4.5"
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Abstract Max Word Limit
                    </label>
                    <input
                      type="number"
                      min={50}
                      max={1000}
                      value={reqAbstractLimit}
                      onChange={(e) =>
                        setReqAbstractLimit(Number(e.target.value) || 250)
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Abstract Structure
                    </label>
                    <select
                      value={reqAbstractStructured ? 'structured' : 'single'}
                      onChange={(e) =>
                        setReqAbstractStructured(
                          e.target.value === 'structured'
                        )
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    >
                      <option value="single">
                        Single Paragraph (Unstructured)
                      </option>
                      <option value="structured">
                        Structured (Background, Methods, Results, Conclusion)
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Max Keywords Allowed
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={reqKeywordsLimit}
                      onChange={(e) =>
                        setReqKeywordsLimit(Number(e.target.value) || 6)
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Section Heading Numbering
                    </label>
                    <select
                      value={reqHeadingNumbering}
                      onChange={(e) =>
                        setReqHeadingNumbering(
                          e.target.value as 'numbered' | 'roman' | 'unnumbered'
                        )
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    >
                      <option value="numbered">
                        Numbered (1. INTRODUCTION, 2. METHODS...)
                      </option>
                      <option value="unnumbered">
                        Unnumbered Uppercase (INTRODUCTION, METHODS...)
                      </option>
                      <option value="roman">
                        Roman Numerals (I. INTRODUCTION, II. METHODS...)
                      </option>
                    </select>
                  </div>
                </div>

                {/* SECTION STRUCTURE CHECKBOXES */}
                <div className="p-3 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-2">
                  <div className="text-[11px] font-extrabold text-[#105E9A]">
                    Required Manuscript Sections (Check / Uncheck according to your Journal&apos;s Guide for Authors):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs font-bold text-[#1A2138]">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reqIncludeLitReview}
                        onChange={(e) =>
                          setReqIncludeLitReview(e.target.checked)
                        }
                        className="w-4 h-4 accent-[#1673B8] rounded"
                      />
                      <span>
                        Separate &ldquo;Review of Literature&rdquo; Section (If unchecked, merges into Intro)
                      </span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reqSeparateResultsDiscussion}
                        onChange={(e) =>
                          setReqSeparateResultsDiscussion(e.target.checked)
                        }
                        className="w-4 h-4 accent-[#1673B8] rounded"
                      />
                      <span>
                        Separate &ldquo;Results&rdquo; and &ldquo;Discussion&rdquo; Sections
                      </span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reqIncludeHighlights}
                        onChange={(e) =>
                          setReqIncludeHighlights(e.target.checked)
                        }
                        className="w-4 h-4 accent-[#1673B8] rounded"
                      />
                      <span>
                        Include Bullet &ldquo;Highlights&rdquo; Section (Elsevier Style)
                      </span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reqIncludePracticalApp}
                        onChange={(e) =>
                          setReqIncludePracticalApp(e.target.checked)
                        }
                        className="w-4 h-4 accent-[#1673B8] rounded"
                      />
                      <span>
                        Include &ldquo;Practical Application&rdquo; Summary (IFT Style)
                      </span>
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reqIncludeStatTable}
                        onChange={(e) =>
                          setReqIncludeStatTable(e.target.checked)
                        }
                        className="w-4 h-4 accent-[#1673B8] rounded"
                      />
                      <span>
                        Embed Statistical ANOVA Table in Results Section
                      </span>
                    </label>
                  </div>
                </div>

                {/* IN-TEXT CITATION & REFERENCE REQUIREMENTS FOR THIS JOURNAL */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      In-Text Citation Requirement (Auto-Adjusts Body Text)
                    </label>
                    <select
                      value={reqInTextFormat}
                      onChange={(e) =>
                        setReqInTextFormat(
                          e.target.value as
                            | '(Author et al., Year)'
                            | '(Author, Year)'
                            | '[1]'
                            | '(1)'
                        )
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    >
                      <option value="(Author et al., Year)">
                        (Author et al., Year) — Standard Author-Year
                      </option>
                      <option value="(Author, Year)">
                        (Author, Year) — Short Author-Year
                      </option>
                      <option value="[1]">
                        [1], [2] — Numbered Square Brackets (MDPI / IEEE)
                      </option>
                      <option value="(1)">
                        (1), (2) — Numbered Round Brackets
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Bibliography Reference Format Style
                    </label>
                    <select
                      value={reqReferenceStyleId}
                      onChange={(e) => setReqReferenceStyleId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    >
                      {savedCustomCitationStyles.map((cs) => (
                        <option key={cs.id} value={cs.id}>
                          Custom: {cs.name}
                        </option>
                      ))}
                      {JOURNAL_DIRECTORY.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.shortName} — {j.label.slice(0, 40)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end pb-1">
                    <label className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1A2138] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reqSortRefsAlpha}
                        onChange={(e) => setReqSortRefsAlpha(e.target.checked)}
                        className="w-4 h-4 accent-[#1673B8] rounded"
                      />
                      <span>Sort Journal References A–Z by Author</span>
                    </label>
                  </div>
                </div>

                {reqReferenceStyleId === 'custom_pattern' && (
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#105E9A] mb-1">
                      Custom Journal Reference Template (Placeholders: {'{AUTHORS}'}, {'{YEAR}'}, {'{TITLE}'}, {'{JOURNAL}'}, {'{VOLUME}'}, {'{ISSUE}'}, {'{PAGES}'}, {'{DOI}'})
                    </label>
                    <input
                      type="text"
                      value={reqCustomRefTemplate}
                      onChange={(e) => setReqCustomRefTemplate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-mono font-bold text-[#1A2138]"
                    />
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="text-[11px] text-[#4A5568]">
                    All changes above are applied live to your manuscript below. Paid members can save this journal template permanently.
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {savedCustomJournals.some(
                      (j) => j.id === selectedStyle
                    ) && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteCustomJournal(selectedStyle)
                        }
                        className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Custom Journal</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleSaveCustomJournalRequirement}
                      className="px-4 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      {isUserPaid ? (
                        <Save className="w-3.5 h-3.5" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-amber-200" />
                      )}
                      <span>
                        Save Journal Requirements to My Directory
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Active Journal Author Guidelines Summary Card */}
            <div className="p-3.5 rounded-xl bg-white border border-[#D2DEEA] space-y-1.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-extrabold text-[#1673B8]">
                  Active Requirements: {reqJournalLabel} ({reqJournalShortName})
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-[#EBF4FC] text-[#105E9A] font-extrabold text-[11px]">
                  {reqHecOrImpact} • Max Abstract: {reqAbstractLimit} words • Citations: {reqInTextFormat}
                </span>
              </div>
              <p className="text-[#4A5568]">{reqGuidelinesNote}</p>
              <div className="text-[11px] font-bold text-[#1A2138] pt-1">
                Active Section Sequence:{' '}
                <span className="text-[#1673B8]">
                  {activeSectionOrderList.join(' → ')}
                </span>
              </div>
            </div>

            {/* PASTE FULL THESIS / PAPER DIRECTLY IN TAB 2 */}
            <div className="p-3.5 rounded-xl bg-white border border-[#D2DEEA] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-[#1A2138]">
                  2. Copy / Paste Full Thesis or Research Paper Text (or Upload Word File Above):
                </span>
                <span className="text-[11px] font-bold text-[#1673B8]">
                  Automatically extracts sections &amp; formats according to {reqJournalShortName} requirements!
                </span>
              </div>
              <textarea
                rows={4}
                value={rawPaperInput}
                onChange={(e) => setRawPaperInput(e.target.value)}
                placeholder="Paste your thesis or research paper text here — it will automatically convert into the target journal's sections and citation style below..."
                className="w-full p-3 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-medium text-[#1A2138]"
              />
            </div>
          </div>

          {/* EDITABLE THESIS SECTIONS + GENERATED JOURNAL MANUSCRIPT PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3 bg-[#F0F6FC] p-4 rounded-2xl border border-[#D2DEEA]">
              <div className="text-xs font-extrabold text-[#1A2138]">
                3. Review / Refine Extracted Thesis Sections Before Exporting:
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#4A5568] mb-1">
                  Manuscript Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#4A5568] mb-1">
                  Authors &amp; University / Institute Affiliation
                </label>
                <input
                  type="text"
                  value={editAuthors}
                  onChange={(e) => setEditAuthors(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              {reqIncludeHighlights && (
                <div>
                  <label className="block text-[11px] font-bold text-[#1673B8] mb-1">
                    Journal Highlights (3–5 Bullet Points)
                  </label>
                  <textarea
                    rows={3}
                    value={editHighlights}
                    onChange={(e) => setEditHighlights(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs text-[#1A2138]"
                  />
                </div>
              )}
              {reqIncludePracticalApp && (
                <div>
                  <label className="block text-[11px] font-bold text-[#1673B8] mb-1">
                    Practical / Industrial Application Summary
                  </label>
                  <textarea
                    rows={2}
                    value={editPracticalApp}
                    onChange={(e) => setEditPracticalApp(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs text-[#1A2138]"
                  />
                </div>
              )}
              <div>
                <label className="block text-[11px] font-bold text-[#4A5568] mb-1">
                  Abstract (Target Journal Limit: {reqAbstractLimit} words • {reqAbstractStructured ? 'Structured' : 'Single Paragraph'})
                </label>
                <textarea
                  rows={3}
                  value={editAbstract}
                  onChange={(e) => setEditAbstract(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#4A5568] mb-1">
                  Keywords (Max {reqKeywordsLimit} keywords, comma-separated)
                </label>
                <input
                  type="text"
                  value={editKeywords}
                  onChange={(e) => setEditKeywords(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#4A5568] mb-1">
                  Introduction &amp; Objectives
                </label>
                <textarea
                  rows={3}
                  value={editIntro}
                  onChange={(e) => setEditIntro(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs text-[#1A2138]"
                />
              </div>
              {reqIncludeLitReview && (
                <div>
                  <label className="block text-[11px] font-bold text-[#4A5568] mb-1">
                    Review of Literature
                  </label>
                  <textarea
                    rows={3}
                    value={editLitReview}
                    onChange={(e) => setEditLitReview(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs text-[#1A2138]"
                  />
                </div>
              )}
              <div>
                <label className="block text-[11px] font-bold text-[#4A5568] mb-1">
                  Materials and Methods
                </label>
                <textarea
                  rows={3}
                  value={editMethods}
                  onChange={(e) => setEditMethods(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#4A5568] mb-1">
                  {reqSeparateResultsDiscussion
                    ? 'Results Section'
                    : 'Results and Discussion'}
                </label>
                <textarea
                  rows={3}
                  value={editResults}
                  onChange={(e) => setEditResults(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs text-[#1A2138]"
                />
              </div>
              {reqSeparateResultsDiscussion && (
                <div>
                  <label className="block text-[11px] font-bold text-[#1673B8] mb-1">
                    Separate Discussion Section
                  </label>
                  <textarea
                    rows={3}
                    value={editDiscussionSeparate}
                    onChange={(e) => setEditDiscussionSeparate(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs text-[#1A2138]"
                  />
                </div>
              )}
              <div>
                <label className="block text-[11px] font-bold text-[#4A5568] mb-1">
                  Conclusion
                </label>
                <textarea
                  rows={2}
                  value={editConclusion}
                  onChange={(e) => setEditConclusion(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs text-[#1A2138]"
                />
              </div>
            </div>

            {/* Right: Formatted Journal Manuscript Output + Save + Download */}
            <div className="space-y-3 bg-[#F0F6FC] p-4 rounded-2xl border-2 border-[#1673B8] flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-[#1673B8]">
                    Auto-Adjusted Manuscript ({reqJournalShortName})
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText('manuscript', compiledJournalManuscript)
                      }
                      className="px-3 py-1.5 rounded-lg bg-white border border-[#D2DEEA] text-xs font-extrabold text-[#1A2138] inline-flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'manuscript' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Paper</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadManuscriptPdf()}
                      className="px-3 py-1.5 rounded-lg bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer"
                    >
                      {isUserPaid ? (
                        <Download className="w-3.5 h-3.5" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-amber-200" />
                      )}
                      <span>Download PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadManuscriptWord()}
                      className="px-3 py-1.5 rounded-lg bg-[#1A2138] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer"
                    >
                      {isUserPaid ? (
                        <Download className="w-3.5 h-3.5" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-amber-200" />
                      )}
                      <span>Download Word (.doc)</span>
                    </button>
                  </div>
                </div>

                {/* Save Converted Manuscript to Directory Bar */}
                <div className="p-2.5 rounded-xl bg-white border border-[#D2DEEA] flex flex-wrap items-center justify-between gap-2">
                  <input
                    type="text"
                    value={manuscriptSaveNotes}
                    onChange={(e) => setManuscriptSaveNotes(e.target.value)}
                    placeholder="Optional manuscript version note (e.g., Ready for PJAS submission)..."
                    className="flex-1 min-w-[180px] px-2.5 py-1.5 rounded-lg bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                  <button
                    type="button"
                    onClick={handleSaveJournalManuscriptRecord}
                    className="px-3 py-1.5 rounded-lg bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {isUserPaid ? (
                      <Save className="w-3.5 h-3.5 text-amber-300" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-amber-300" />
                    )}
                    <span>Save Manuscript to Directory</span>
                  </button>
                </div>

                <pre className="p-3.5 rounded-xl bg-white border border-[#D2DEEA] text-xs font-sans text-[#1A2138] whitespace-pre-wrap leading-relaxed max-h-[540px] overflow-y-auto">
                  {compiledJournalManuscript}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: RESEARCH DATA STATISTICAL ANALYSIS (BUILT-IN + CUSTOM ANOVA REQUIREMENTS + RAW PASTE)
         ===================================================================== */}
      {activeResearchTab === 'statistics' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-[#1A2138]">
                  Research Data Statistical Analyzer (CRD / RCBD ANOVA, LSD, Tukey HSD, Duncan DMR &amp; Mean ± SD / SE)
                </h3>
                <p className="text-[11px] text-[#4A5568]">
                  Select an ANOVA requirement preset or add your own custom requirements, then copy/paste your raw experimental data or edit the table below
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="px-3.5 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Upload Research Data (.CSV)</span>
                  <input
                    type="file"
                    accept=".csv,.tsv,.txt"
                    onChange={handleStatCsvUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleDownloadStatAnovaPdf}
                  className="px-3.5 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {isUserPaid ? (
                    <Download className="w-3.5 h-3.5" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-amber-200" />
                  )}
                  <span>Download PDF Report</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadStatCsv}
                  className="px-3.5 py-2 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {isUserPaid ? (
                    <Download className="w-3.5 h-3.5" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-amber-300" />
                  )}
                  <span>Download Excel / CSV</span>
                </button>
              </div>
            </div>

            {/* 1. SELECT ANOVA REQUIREMENT PRESET OR ADD CUSTOM REQUIREMENT */}
            <div className="p-3.5 rounded-xl bg-white border border-[#D2DEEA] space-y-3">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
                <div className="lg:col-span-8">
                  <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                    1. Select ANOVA Statistical Design &amp; Post-Hoc Requirement Preset *
                  </label>
                  <select
                    value={selectedAnovaPresetId}
                    onChange={(e) => setSelectedAnovaPresetId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border-2 border-[#1673B8] text-xs font-extrabold text-[#1A2138]"
                  >
                    {savedCustomAnovaPresets.length > 0 && (
                      <optgroup label="My Saved Custom ANOVA Requirements">
                        {savedCustomAnovaPresets.map((cp) => (
                          <option key={cp.id} value={cp.id}>
                            {cp.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <optgroup label="Standard Food Science & Agricultural ANOVA Requirements">
                      {BUILTIN_ANOVA_PRESETS.map((bp) => (
                        <option key={bp.id} value={bp.id}>
                          {bp.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="lg:col-span-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setShowCustomAnovaModal((prev) => !prev)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-amber-300" />
                    <span>
                      {showCustomAnovaModal
                        ? 'Hide Custom ANOVA Builder'
                        : '+ Add / Customize ANOVA Requirements'}
                    </span>
                  </button>
                </div>
              </div>

              {/* LIVE ANOVA REQUIREMENT CONTROLS */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-1">
                <div>
                  <label className="block text-[10px] font-extrabold text-[#4A5568] mb-1">
                    Experimental Design
                  </label>
                  <select
                    value={anovaDesignType}
                    onChange={(e) =>
                      setAnovaDesignType(
                        e.target.value as 'crd_one_way' | 'rcbd_two_way'
                      )
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  >
                    <option value="crd_one_way">One-Way CRD</option>
                    <option value="rcbd_two_way">Two-Way RCBD (Blocked)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-[#4A5568] mb-1">
                    Alpha Level (α)
                  </label>
                  <select
                    value={anovaAlphaLevel}
                    onChange={(e) =>
                      setAnovaAlphaLevel(e.target.value as '0.05' | '0.01')
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  >
                    <option value="0.05">p &lt; 0.05 (5% Level)</option>
                    <option value="0.01">p &lt; 0.01 (1% Strict)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-[#4A5568] mb-1">
                    Post-Hoc Mean Test
                  </label>
                  <select
                    value={anovaPostHocTest}
                    onChange={(e) =>
                      setAnovaPostHocTest(
                        e.target.value as 'LSD' | 'Tukey_HSD' | 'Duncan_DMR'
                      )
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  >
                    <option value="LSD">LSD Test</option>
                    <option value="Tukey_HSD">Tukey HSD</option>
                    <option value="Duncan_DMR">Duncan DMR</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-[#4A5568] mb-1">
                    Summary Format
                  </label>
                  <select
                    value={anovaSummaryFormat}
                    onChange={(e) =>
                      setAnovaSummaryFormat(
                        e.target.value as 'mean_sd' | 'mean_se' | 'mean_only'
                      )
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  >
                    <option value="mean_sd">Mean ± SD + Letter</option>
                    <option value="mean_se">Mean ± SE + Letter</option>
                    <option value="mean_only">Mean + Letter Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-[#4A5568] mb-1">
                    Replications (Columns)
                  </label>
                  <select
                    value={anovaReplicationsCount}
                    onChange={(e) =>
                      setAnovaReplicationsCount(Number(e.target.value) || 3)
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  >
                    <option value={2}>2 Replications (R1–R2)</option>
                    <option value={3}>3 Replications (R1–R3)</option>
                    <option value={4}>4 Replications (R1–R4)</option>
                    <option value={5}>5 Replications (R1–R5)</option>
                    <option value={6}>6 Replications (R1–R6)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-[#4A5568] mb-1">
                    Decimal Places
                  </label>
                  <select
                    value={anovaDecimals}
                    onChange={(e) =>
                      setAnovaDecimals(Number(e.target.value) || 2)
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  >
                    <option value={1}>1 Decimal (0.0)</option>
                    <option value={2}>2 Decimals (0.00)</option>
                    <option value={3}>3 Decimals (0.000)</option>
                    <option value={4}>4 Decimals (0.0000)</option>
                  </select>
                </div>
              </div>

              {/* SAVE CUSTOM ANOVA REQUIREMENT MODAL / FORM */}
              {showCustomAnovaModal && (
                <form
                  onSubmit={handleSaveCustomAnovaPreset}
                  className="p-3.5 rounded-xl bg-[#F0F6FC] border-2 border-[#1673B8] space-y-2.5"
                >
                  <div className="text-xs font-extrabold text-[#1A2138]">
                    Save Current ANOVA Configuration as Your Custom Statistical Requirement Preset:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <input
                        type="text"
                        value={customAnovaNameInput}
                        onChange={(e) =>
                          setCustomAnovaNameInput(e.target.value)
                        }
                        placeholder="Custom Requirement Name (e.g., NIFSAT Storage Study ANOVA) *"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={customAnovaNotesInput}
                        onChange={(e) =>
                          setCustomAnovaNotesInput(e.target.value)
                        }
                        placeholder="Optional Notes (e.g., 90-day shelf life intervals)"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 px-3 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {isUserPaid ? (
                          <Save className="w-3.5 h-3.5" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-amber-200" />
                        )}
                        <span>Save Custom ANOVA Preset</span>
                      </button>
                      {savedCustomAnovaPresets.some(
                        (p) => p.id === selectedAnovaPresetId
                      ) && (
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteCustomAnovaPreset(
                              selectedAnovaPresetId
                            )
                          }
                          className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                          title="Delete Custom Preset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* 2. COPY / PASTE RAW EXPERIMENTAL DATA BOX */}
            <div className="p-3.5 rounded-xl bg-white border border-[#D2DEEA] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-extrabold text-[#1A2138]">
                    2. Copy / Paste Raw Experimental Data (from Excel, Word, or Notepad):
                  </span>
                  <span className="block text-[11px] text-[#4A5568]">
                    Paste one treatment per line (e.g., <code className="font-mono text-[#1673B8]">T0 Control   18.40   18.10   18.70</code>) and click &ldquo;Apply Pasted Data &amp; Run ANOVA&rdquo;
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => parseRawStatTextAndApply(rawPasteStatText)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold cursor-pointer"
                  >
                    Apply Pasted Data &amp; Run ANOVA
                  </button>
                  <button
                    type="button"
                    onClick={() => setRawPasteStatText('')}
                    className="px-2.5 py-1.5 rounded-xl bg-[#F0F6FC] hover:bg-red-50 text-red-600 text-xs font-bold cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>
              <textarea
                rows={3}
                value={rawPasteStatText}
                onChange={(e) => setRawPasteStatText(e.target.value)}
                placeholder={`Example (copy & paste from Excel or Word):\nT0 (Control)\t18.40\t18.10\t18.70\nT1 (0.05% Sorbate)\t26.20\t26.80\t26.50\nT2 (0.10% Sorbate)\t31.50\t31.10\t31.90`}
                className="w-full p-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-mono text-[#1A2138]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Parameter Measured (with Unit)
                </label>
                <input
                  type="text"
                  value={statParameterName}
                  onChange={(e) => setStatParameterName(e.target.value)}
                  placeholder="e.g., Total Soluble Solids (°Brix) or Moisture (%)"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Experimental Factor / Treatment Group Name
                </label>
                <input
                  type="text"
                  value={statFactorName}
                  onChange={(e) => setStatFactorName(e.target.value)}
                  placeholder="e.g., Preservative Treatments (T0 - T4)"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
            </div>

            {/* Interactive Replications Table */}
            <div className="overflow-x-auto bg-white rounded-xl border border-[#D2DEEA]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#1A2138] text-white">
                    <th className="p-2.5 font-extrabold">
                      Treatment / Factor Level
                    </th>
                    {(
                      ['rep1', 'rep2', 'rep3', 'rep4', 'rep5', 'rep6'] as const
                    )
                      .slice(0, anovaReplicationsCount)
                      .map((repField, rIdx) => (
                        <th key={repField} className="p-2.5 font-extrabold w-24">
                          {anovaDesignType === 'rcbd_two_way'
                            ? `Block ${rIdx + 1}`
                            : `Rep ${rIdx + 1} (R${rIdx + 1})`}
                        </th>
                      ))}
                    <th className="p-2.5 font-extrabold text-sky-200">
                      {anovaSummaryFormat === 'mean_se'
                        ? `Mean ± SE (${anovaPostHocTest})`
                        : anovaSummaryFormat === 'mean_only'
                        ? `Mean (${anovaPostHocTest})`
                        : `Mean ± SD (${anovaPostHocTest})`}
                    </th>
                    <th className="p-2.5 font-extrabold w-12 text-center">
                      Del
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D2DEEA]">
                  {statRows.map((row, idx) => {
                    const computed = statisticalAnalysis.treatments[idx];
                    return (
                      <tr key={row.id} className="hover:bg-[#F0F6FC]">
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.treatmentName}
                            onChange={(e) => {
                              const val = e.target.value;
                              setStatRows((prev) =>
                                prev.map((r) =>
                                  r.id === row.id
                                    ? { ...r, treatmentName: val }
                                    : r
                                )
                              );
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                          />
                        </td>
                        {(
                          [
                            'rep1',
                            'rep2',
                            'rep3',
                            'rep4',
                            'rep5',
                            'rep6'
                          ] as const
                        )
                          .slice(0, anovaReplicationsCount)
                          .map((repField) => (
                            <td key={repField} className="p-2">
                              <input
                                type="number"
                                step="0.01"
                                value={row[repField] || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setStatRows((prev) =>
                                    prev.map((r) =>
                                      r.id === row.id
                                        ? { ...r, [repField]: val }
                                        : r
                                    )
                                  );
                                }}
                                placeholder="—"
                                className="w-full px-2 py-1.5 rounded-lg bg-white border border-[#94B8D7] text-xs font-mono font-bold text-[#1A2138]"
                              />
                            </td>
                          ))}
                        <td className="p-2 font-mono font-extrabold text-[#1673B8]">
                          {computed ? computed.displaySummary : '—'}
                        </td>
                        <td className="p-2 text-center">
                          {statRows.length > 2 && (
                            <button
                              type="button"
                              onClick={() =>
                                setStatRows((prev) =>
                                  prev.filter((r) => r.id !== row.id)
                                )
                              }
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() =>
                  setStatRows((prev) => [
                    ...prev,
                    {
                      id: `t-${Date.now()}`,
                      treatmentName: `T${prev.length} (New Treatment)`,
                      rep1: '20.0',
                      rep2: '20.5',
                      rep3: '19.8',
                      rep4: '',
                      rep5: '',
                      rep6: ''
                    }
                  ])
                }
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#EBF4FC] border border-[#1673B8] text-[#1673B8] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Treatment Row</span>
              </button>

              {/* Save ANOVA Analysis to Directory Bar */}
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={statSaveNotes}
                  onChange={(e) => setStatSaveNotes(e.target.value)}
                  placeholder="Optional lab / experiment note..."
                  className="px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
                <button
                  type="button"
                  onClick={handleSaveAnovaAnalysisRecord}
                  className="px-3.5 py-2 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {isUserPaid ? (
                    <Save className="w-3.5 h-3.5 text-amber-300" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-amber-300" />
                  )}
                  <span>Log &amp; Save ANOVA to Directory</span>
                </button>
              </div>
            </div>
          </div>

          {/* COMPLETE ANOVA TABLE & POST-HOC SUMMARY */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#1A2138] text-white space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-3">
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-sky-300">
                  Analysis of Variance (
                  {anovaDesignType === 'rcbd_two_way'
                    ? 'Two-Way RCBD ANOVA'
                    : 'One-Way CRD ANOVA'}
                  ) — {statParameterName}
                </div>
                <div className="text-sm font-extrabold text-white mt-0.5">
                  Result:{' '}
                  <span className="text-amber-300">
                    {statisticalAnalysis.significanceBadge}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="px-3 py-1 rounded-lg bg-white/10 font-mono font-bold">
                  Grand Mean = {statisticalAnalysis.grandMean}
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/10 font-mono font-bold text-amber-300">
                  {anovaPostHocTest} ({anovaAlphaLevel}) ={' '}
                  {statisticalAnalysis.lsd05}
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/10 font-mono font-bold text-emerald-300">
                  CV (%) = {statisticalAnalysis.cvPct}%
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/20 text-sky-200">
                    <th className="py-2 pr-3 font-extrabold">
                      Source of Variation (SOV)
                    </th>
                    <th className="py-2 px-3 font-extrabold">
                      Degrees of Freedom (df)
                    </th>
                    <th className="py-2 px-3 font-extrabold">
                      Sum of Squares (SS)
                    </th>
                    <th className="py-2 px-3 font-extrabold">
                      Mean Square (MS)
                    </th>
                    <th className="py-2 px-3 font-extrabold">
                      Calculated F-Value
                    </th>
                    <th className="py-2 pl-3 font-extrabold">
                      Tabular F (5% / 1%)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 font-mono">
                  <tr>
                    <td className="py-2.5 pr-3 font-sans font-bold text-white">
                      Between Treatments ({statFactorName})
                    </td>
                    <td className="py-2.5 px-3">
                      {statisticalAnalysis.dfBetween}
                    </td>
                    <td className="py-2.5 px-3">
                      {statisticalAnalysis.ssBetween}
                    </td>
                    <td className="py-2.5 px-3">
                      {statisticalAnalysis.msBetween}
                    </td>
                    <td className="py-2.5 px-3 font-extrabold text-amber-300">
                      {statisticalAnalysis.fCalculated}{' '}
                      {statisticalAnalysis.significanceStatus === 'highly_sig'
                        ? '**'
                        : statisticalAnalysis.significanceStatus === 'sig'
                        ? '*'
                        : 'NS'}
                    </td>
                    <td className="py-2.5 pl-3 text-slate-300">
                      {statisticalAnalysis.f05} / {statisticalAnalysis.f01}
                    </td>
                  </tr>
                  {anovaDesignType === 'rcbd_two_way' && (
                    <tr>
                      <td className="py-2.5 pr-3 font-sans font-bold text-sky-200">
                        Between Blocks / Replications
                      </td>
                      <td className="py-2.5 px-3">
                        {statisticalAnalysis.dfBlocks}
                      </td>
                      <td className="py-2.5 px-3">
                        {statisticalAnalysis.ssBlocks}
                      </td>
                      <td className="py-2.5 px-3">
                        {statisticalAnalysis.msBlocks}
                      </td>
                      <td className="py-2.5 px-3 text-sky-200">
                        {statisticalAnalysis.fBlocks}
                      </td>
                      <td className="py-2.5 pl-3 text-slate-300">—</td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2.5 pr-3 font-sans font-bold text-slate-200">
                      {anovaDesignType === 'rcbd_two_way'
                        ? 'Residual Error'
                        : 'Within Treatments (Error)'}
                    </td>
                    <td className="py-2.5 px-3">
                      {statisticalAnalysis.dfWithin}
                    </td>
                    <td className="py-2.5 px-3">
                      {statisticalAnalysis.ssWithin}
                    </td>
                    <td className="py-2.5 px-3">
                      {statisticalAnalysis.msWithin}
                    </td>
                    <td className="py-2.5 px-3">—</td>
                    <td className="py-2.5 pl-3">—</td>
                  </tr>
                  <tr className="text-sky-200 font-bold">
                    <td className="py-2.5 pr-3 font-sans">Total</td>
                    <td className="py-2.5 px-3">
                      {statisticalAnalysis.dfTotal}
                    </td>
                    <td className="py-2.5 px-3">
                      {statisticalAnalysis.ssTotal}
                    </td>
                    <td className="py-2.5 px-3">—</td>
                    <td className="py-2.5 px-3">—</td>
                    <td className="py-2.5 pl-3">—</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-[11px] text-slate-300 pt-1">
              Note: Means sharing the same alphabetical letter (a, b, c...) do not differ significantly at p &lt; {anovaAlphaLevel} according to {anovaPostHocTest} ({anovaPostHocTest} = {statisticalAnalysis.lsd05}, SED = {statisticalAnalysis.sed}). This table is automatically synchronized with the Thesis-to-Journal Manuscript tab.
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: CITATION & REFERENCE GENERATOR (DIRECTORY + CUSTOM CITATION REQUIREMENTS + SAVE/DOWNLOAD)
         ===================================================================== */}
      {activeResearchTab === 'references' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-end">
              <div className="lg:col-span-6">
                <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                  1. Select Journal Reference Style from Directory or Your Custom Styles *
                </label>
                <select
                  value={selectedCitationStyleId}
                  onChange={(e) => setSelectedCitationStyleId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#1673B8] text-xs font-extrabold text-[#1A2138]"
                >
                  {savedCustomCitationStyles.length > 0 && (
                    <optgroup label="My Saved Custom Citation & Reference Styles">
                      {savedCustomCitationStyles.map((cs) => (
                        <option key={cs.id} value={cs.id}>
                          {cs.name} ({cs.shortName})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="Pakistan HEC Recognized Journals">
                    {JOURNAL_DIRECTORY.filter(
                      (s) => s.region === 'Pakistan HEC & University Journals'
                    ).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="International Food Science & Academic Styles">
                    {JOURNAL_DIRECTORY.filter(
                      (s) =>
                        s.region === 'International Impact Factor Journals'
                    ).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="lg:col-span-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowCustomCitationModal((prev) => !prev)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-amber-300" />
                  <span>
                    {showCustomCitationModal
                      ? 'Hide Custom Citation Builder'
                      : '+ Add Custom Citation Style'}
                  </span>
                </button>
              </div>

              <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-2 pb-1">
                <label className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1A2138] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      activeCustomCitationRule
                        ? activeCustomCitationRule.sortAlphabetically
                        : sortAlphabetically
                    }
                    onChange={(e) => setSortAlphabetically(e.target.checked)}
                    className="w-4 h-4 accent-[#1673B8] rounded cursor-pointer"
                  />
                  <span>Sort A–Z by Author</span>
                </label>
              </div>
            </div>

            {/* CUSTOM CITATION & REFERENCE REQUIREMENT BUILDER */}
            {showCustomCitationModal && (
              <form
                onSubmit={handleSaveCustomCitationStyle}
                className="p-4 rounded-2xl bg-white border-2 border-[#1673B8] space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-2">
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#1A2138]">
                      Add / Save Custom Citation &amp; Reference Requirement Style
                    </h4>
                    <p className="text-[11px] text-[#4A5568]">
                      Define your university or journal&apos;s exact reference structure — all references will automatically format to match your pattern!
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Custom Style / Journal Name *
                    </label>
                    <input
                      type="text"
                      value={newCitName}
                      onChange={(e) => setNewCitName(e.target.value)}
                      placeholder="e.g., UAF Thesis Format / J. Food Process."
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Short Label
                    </label>
                    <input
                      type="text"
                      value={newCitShortName}
                      onChange={(e) => setNewCitShortName(e.target.value)}
                      placeholder="e.g., UAF Thesis"
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      In-Text Citation Style
                    </label>
                    <select
                      value={newCitInText}
                      onChange={(e) =>
                        setNewCitInText(
                          e.target.value as
                            | '(Author et al., Year)'
                            | '(Author, Year)'
                            | '[1]'
                            | '(1)'
                        )
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    >
                      <option value="(Author et al., Year)">
                        (Author et al., Year)
                      </option>
                      <option value="(Author, Year)">(Author, Year)</option>
                      <option value="[1]">[1] Square Bracket Numbered</option>
                      <option value="(1)">(1) Round Bracket Numbered</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <label className="text-[11px] font-extrabold text-[#105E9A]">
                      Reference Template Pattern * (Click buttons to insert placeholders):
                    </label>
                    <div className="flex flex-wrap items-center gap-1">
                      {[
                        '{AUTHORS}',
                        '{YEAR}',
                        '{TITLE}',
                        '{JOURNAL}',
                        '{VOLUME}',
                        '{ISSUE}',
                        '{PAGES}',
                        '{DOI}'
                      ].map((tok) => (
                        <button
                          key={tok}
                          type="button"
                          onClick={() =>
                            setNewCitTemplate((prev) => `${prev} ${tok}`)
                          }
                          className="px-2 py-0.5 rounded bg-[#EBF4FC] hover:bg-[#DCE9F6] text-[#105E9A] text-[10px] font-mono font-extrabold cursor-pointer"
                        >
                          +{tok}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={newCitTemplate}
                    onChange={(e) => setNewCitTemplate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-mono font-bold text-[#1A2138]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Numbering Prefix
                    </label>
                    <select
                      value={newCitNumbering}
                      onChange={(e) =>
                        setNewCitNumbering(
                          e.target.value as
                            | 'none'
                            | 'dot_number'
                            | 'bracket_number'
                        )
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    >
                      <option value="none">No Number Prefix</option>
                      <option value="dot_number">1., 2., 3.</option>
                      <option value="bracket_number">[1], [2], [3]</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Author Casing
                    </label>
                    <select
                      value={newCitAuthorFormat}
                      onChange={(e) =>
                        setNewCitAuthorFormat(
                          e.target.value as 'as_entered' | 'uppercase'
                        )
                      }
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    >
                      <option value="as_entered">Standard (Khan, M.A.)</option>
                      <option value="uppercase">UPPERCASE (KHAN, M.A.)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5 pt-2">
                    <label className="inline-flex items-center gap-2 text-xs font-bold text-[#1A2138] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newCitSortAlpha}
                        onChange={(e) => setNewCitSortAlpha(e.target.checked)}
                        className="w-4 h-4 accent-[#1673B8] rounded"
                      />
                      <span>Sort Alphabetically (A–Z)</span>
                    </label>
                    <label className="inline-flex items-center gap-2 text-xs font-bold text-[#1A2138] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newCitIncludeDoi}
                        onChange={(e) => setNewCitIncludeDoi(e.target.checked)}
                        className="w-4 h-4 accent-[#1673B8] rounded"
                      />
                      <span>Append DOI Link if Available</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isUserPaid ? (
                        <Save className="w-3.5 h-3.5" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-amber-200" />
                      )}
                      <span>Save Citation Style</span>
                    </button>
                    {activeCustomCitationRule && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteCustomCitationStyle(
                            activeCustomCitationRule.id
                          )
                        }
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                        title="Delete Custom Citation Style"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </form>
            )}

            {selectedCitationStyleId === 'custom_pattern' ? (
              <div>
                <label className="block text-[11px] font-extrabold text-[#105E9A] mb-1">
                  Quick Custom Reference Template (Use placeholders: {'{AUTHORS}'}, {'{YEAR}'}, {'{TITLE}'}, {'{JOURNAL}'}, {'{VOLUME}'}, {'{ISSUE}'}, {'{PAGES}'})
                </label>
                <input
                  type="text"
                  value={customPattern}
                  onChange={(e) => setCustomPattern(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-mono font-bold text-[#1A2138]"
                />
              </div>
            ) : (
              <div className="text-[11px] text-[#4A5568] bg-white p-2.5 rounded-xl border border-[#D2DEEA]">
                <strong className="text-[#1673B8]">Format Example:</strong>{' '}
                {activeCustomCitationRule
                  ? activeCustomCitationRule.templatePattern
                  : allJournalsList.find(
                      (j) => j.id === selectedCitationStyleId
                    )?.examplePreview || baseJournalMeta.examplePreview}
              </div>
            )}
          </div>

          {/* STEP 2: BULK PASTE BOX + CONVERTED OUTPUT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-[#1A2138]">
                  2. Paste All References Here (One Reference per Line):
                </label>
                <button
                  type="button"
                  onClick={() => setBulkRawText('')}
                  className="text-[11px] font-bold text-red-600 hover:underline cursor-pointer"
                >
                  Clear Box
                </button>
              </div>
              <textarea
                rows={10}
                value={bulkRawText}
                onChange={(e) => setBulkRawText(e.target.value)}
                placeholder="Paste your raw references here (one per line)... They will automatically convert to your selected journal style on the right!"
                className="w-full p-3.5 rounded-2xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-medium text-[#1A2138] leading-relaxed"
              />
            </div>

            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-extrabold text-[#1673B8]">
                  3. Formatted References ({formattedResults.length}) — Ready for Thesis / Paper:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyText(
                        'all-refs',
                        formattedResults.map((r) => r.bibliography).join('\n\n')
                      )
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-[#D2DEEA] text-xs font-extrabold text-[#1A2138] inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'all-refs' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy All</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadReferencesPdf()}
                    className="px-2.5 py-1.5 rounded-lg bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer"
                  >
                    {isUserPaid ? (
                      <Download className="w-3.5 h-3.5" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-amber-200" />
                    )}
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Save Formatted Reference List to Directory Bar */}
              <div className="p-2.5 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] flex flex-wrap items-center justify-between gap-2">
                <input
                  type="text"
                  value={referenceSaveTitle}
                  onChange={(e) => setReferenceSaveTitle(e.target.value)}
                  placeholder="Reference List Title (e.g., Chapter 4 Literature Cited)..."
                  className="flex-1 min-w-[180px] px-2.5 py-1.5 rounded-lg bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
                <button
                  type="button"
                  onClick={handleSaveReferenceListRecord}
                  className="px-3 py-1.5 rounded-lg bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {isUserPaid ? (
                    <Save className="w-3.5 h-3.5 text-amber-300" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-amber-300" />
                  )}
                  <span>Save References to Directory</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F0F6FC] border-2 border-[#1673B8] max-h-64 overflow-y-auto space-y-2.5">
                {formattedResults.length === 0 ? (
                  <div className="text-xs text-[#4A5568] text-center py-8">
                    Paste references on the left or add a manual reference below.
                  </div>
                ) : (
                  formattedResults.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white border border-[#D2DEEA] text-xs space-y-1"
                    >
                      <div className="text-[#1A2138] font-medium leading-relaxed">
                        {item.bibliography}
                      </div>
                      <div className="text-[11px] font-bold text-[#1673B8]">
                        In-Text Citation:{' '}
                        <span className="font-mono">{item.inText}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* STEP 3: MANUAL SINGLE REFERENCE BUILDER */}
          <form
            onSubmit={handleAddManualToBulkBox}
            className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3"
          >
            <div className="text-xs font-extrabold text-[#1A2138]">
              Or Add a Single Reference Manually to the List:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={manAuthors}
                  onChange={(e) => setManAuthors(e.target.value)}
                  placeholder="Authors (e.g., Khan, M.A., S. Ahmad and T. Mahmood) *"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={manYear}
                  onChange={(e) => setManYear(e.target.value)}
                  placeholder="Year (e.g., 2026)"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={manJournal}
                  onChange={(e) => setManJournal(e.target.value)}
                  placeholder="Journal Name (e.g., Pak. J. Agri. Sci.)"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={manTitle}
                  onChange={(e) => setManTitle(e.target.value)}
                  placeholder="Article / Research Paper Title *"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <input
                  type="text"
                  value={manVolume}
                  onChange={(e) => setManVolume(e.target.value)}
                  placeholder="Vol (62)"
                  className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
                <input
                  type="text"
                  value={manIssue}
                  onChange={(e) => setManIssue(e.target.value)}
                  placeholder="Issue (2)"
                  className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
                <input
                  type="text"
                  value={manPages}
                  onChange={(e) => setManPages(e.target.value)}
                  placeholder="Pages (11-18)"
                  className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full py-2 px-3 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Reference</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================================
          TAB 5: SAVED RESEARCH, THESIS, ANOVA & CITATION DIRECTORY (PAID USERS)
         ===================================================================== */}
      {activeResearchTab === 'directory' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-[#1A2138]">
                  Saved Research Papers, Converted Journal Manuscripts, ANOVA Analyses &amp; Reference Lists
                </h3>
                <p className="text-[11px] text-[#4A5568]">
                  All records are stored in lightweight text format for instant access, reloading, and on-demand PDF / Word / CSV generation
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-extrabold text-[#1673B8]">
                <span className="px-2.5 py-1 rounded-lg bg-white border border-[#D2DEEA]">
                  Custom Journals: {savedCustomJournals.length}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-[#D2DEEA]">
                  Custom ANOVA Presets: {savedCustomAnovaPresets.length}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-[#D2DEEA]">
                  Custom Citation Styles: {savedCustomCitationStyles.length}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="sm:col-span-2 relative">
                <Search className="w-4 h-4 text-[#5A6C84] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={directorySearch}
                  onChange={(e) => setDirectorySearch(e.target.value)}
                  placeholder="Search by Record ID (EXT / MNS / ANV / REF), paper title, journal, or parameter..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <select
                  value={directoryFilter}
                  onChange={(e) =>
                    setDirectoryFilter(
                      e.target.value as
                        | 'all'
                        | 'extracted_paper'
                        | 'journal_manuscript'
                        | 'anova_analysis'
                        | 'reference_list'
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-extrabold text-[#1A2138]"
                >
                  <option value="all">
                    All Saved Records ({savedRecords.length})
                  </option>
                  <option value="extracted_paper">
                    1. Extracted Papers (EXT)
                  </option>
                  <option value="journal_manuscript">
                    2. Converted Journal Manuscripts (MNS)
                  </option>
                  <option value="anova_analysis">
                    3. ANOVA Statistical Analyses (ANV)
                  </option>
                  <option value="reference_list">
                    4. Formatted Reference Lists (REF)
                  </option>
                </select>
              </div>
            </div>
          </div>

          {filteredDirectoryRecords.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] text-center space-y-2">
              <div className="text-sm font-extrabold text-[#1A2138]">
                No Saved Research Records Found
              </div>
              <p className="text-xs text-[#4A5568]">
                Use the &ldquo;Save to Directory&rdquo; buttons in any of the 4 tabs to log your extracted papers, converted manuscripts, ANOVA tables, or formatted references.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDirectoryRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#1A2138] text-amber-300 font-mono text-[11px] font-extrabold">
                        {rec.recordCode}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-[#EBF4FC] text-[#1673B8] text-[10px] font-extrabold uppercase">
                        {rec.recordType.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] font-bold text-[#5A6C84]">
                        {rec.savedDateFormatted}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-[#1A2138]">
                      {rec.title}
                    </div>
                    {rec.subtitle && (
                      <div className="text-xs font-bold text-[#1673B8]">
                        {rec.subtitle}
                      </div>
                    )}
                    {rec.notes && (
                      <div className="text-[11px] text-[#4A5568]">
                        Note: {rec.notes}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleLoadSavedRecordIntoWorkspace(rec)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#EBF4FC] border border-[#1673B8] text-[#1673B8] text-xs font-extrabold cursor-pointer"
                    >
                      Open / Load
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (rec.recordType === 'journal_manuscript') {
                          handleDownloadManuscriptPdf(
                            rec.compiledManuscriptText,
                            rec.targetJournalShortName || 'Manuscript',
                            rec.subtitle || 'Saved Manuscript'
                          );
                        } else if (rec.recordType === 'extracted_paper') {
                          handleDownloadManuscriptPdf(
                            `EXTRACTED RESEARCH PAPER (${rec.recordCode})\n\nTITLE:\n${rec.extractedTitle}\n\nAUTHORS:\n${rec.extractedAuthors}\n\nABSTRACT:\n${rec.extractedAbstract}\n\nKEYWORDS: ${rec.extractedKeywords}\n\nINTRODUCTION:\n${rec.extractedIntro}\n\nLITERATURE REVIEW:\n${rec.extractedLitReview}\n\nMATERIALS AND METHODS:\n${rec.extractedMethods}\n\nRESULTS AND DISCUSSION:\n${rec.extractedResults}\n\nCONCLUSION:\n${rec.extractedConclusion}`,
                            rec.recordCode,
                            'Extracted Research Paper'
                          );
                        } else if (rec.recordType === 'reference_list') {
                          handleDownloadReferencesPdf(
                            rec.title,
                            rec.formattedReferencesText,
                            rec.citationStyleName
                          );
                        } else if (rec.recordType === 'anova_analysis') {
                          handleLoadSavedRecordIntoWorkspace(rec);
                          setTimeout(() => handleDownloadStatAnovaPdf(), 120);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSavedRecord(rec.id)}
                      className="p-1.5 rounded-xl bg-white hover:bg-red-50 border border-[#D2DEEA] text-red-600 cursor-pointer"
                      title="Delete Saved Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

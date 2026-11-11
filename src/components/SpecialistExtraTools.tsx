import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Beaker,
  BookOpen,
  Calculator,
  Check,
  Copy,
  Download,
  Factory,
  FileSpreadsheet,
  FileText,
  FlaskConical,
  Layers,
  Mail,
  Plus,
  Scale,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  Upload
} from 'lucide-react';
import {
  CustomAcidFactorItem,
  CustomSanitizerItem,
  HubUser,
  LabFormulaSavedRecord,
  LabMolarityCustomReagentItem,
  LabMolaritySavedRecord,
  MoistureAshSavedRecord,
  PearsonBatchSavedRecord,
  PearsonCalculatorMode,
  PearsonCustomProductItem,
  ProductionFloorSavedRecord,
  UserToolsData
} from '../types/hub';
import { E_NUMBERS_DATABASE, ENumberAdditive } from '../data/eNumbersData';
import { jsPDF } from 'jspdf';
import { FS_PORTAL_LOGO_DATA_URI } from '../lib/brandLogo';
import { drawPdfBrandLogo, drawPdfUserPhoto } from '../lib/pdfBranding';

interface LabFormulaCalculatorToolProps {
  user?: HubUser;
  isUserPaid?: boolean;
  hasExpiredPremium?: boolean;
  toolsData?: UserToolsData;
  onSaveToolsData?: (updated: UserToolsData) => Promise<void>;
  onOpenPremiumModal?: () => void;
}

const DEFAULT_SANITIZERS: { name: string; pct: string }[] = [
  { name: 'Household Bleach (5.25% NaOCl)', pct: '5.25' },
  { name: 'Industrial Liquid Chlorine (12% NaOCl)', pct: '12' },
  { name: 'Peracetic Acid / PAA (15%)', pct: '15' },
  { name: 'Quaternary Ammonium / QAC (10%)', pct: '10' },
  { name: 'Hydrogen Peroxide Food Grade (35% H2O2)', pct: '35' },
  { name: 'Iodophor Sanitizer (1.75% Titratable Iodine)', pct: '1.75' }
];

const DEFAULT_ACID_FACTORS: { label: string; val: string }[] = [
  { label: 'Citric Acid Anhydrous (Citrus / Soft Drinks / Jams) — Factor 0.064', val: '0.064' },
  { label: 'Citric Acid Monohydrate (Beverages) — Factor 0.070', val: '0.070' },
  { label: 'Lactic Acid (Milk, Yogurt, Curd, Fermented Foods) — Factor 0.090', val: '0.090' },
  { label: 'Malic Acid (Apple, Peach, Pear, Apricot Juice) — Factor 0.067', val: '0.067' },
  { label: 'Tartaric Acid (Grape Juice & Tamarind) — Factor 0.075', val: '0.075' },
  { label: 'Acetic Acid (Vinegar, Pickles, Ketchup, Mayonnaise) — Factor 0.060', val: '0.060' },
  { label: 'Oleic Acid (Free Fatty Acids / FFA in Edible Oils) — Factor 0.282', val: '0.282' }
];

// ============================================================================
// 1. LAB & FORMULA CALCULATOR (SANITIZER PPM, TITRATABLE ACIDITY, BRIX/ACID, CONVERTER & SAVED DIRECTORY)
// ============================================================================
export const LabFormulaCalculatorTool: React.FC<LabFormulaCalculatorToolProps> = ({
  user,
  isUserPaid = false,
  hasExpiredPremium = false,
  toolsData,
  onSaveToolsData,
  onOpenPremiumModal
}) => {
  const canUsePremium = Boolean(
    (isUserPaid && !hasExpiredPremium) || user?.isAdmin
  );

  const [subMode, setSubMode] = useState<
    'ppm' | 'acidity' | 'converter' | 'directory'
  >('ppm');
  const [statusToast, setStatusToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setStatusToast(msg);
    setTimeout(() => {
      setStatusToast((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Saved Custom Sanitizers, Custom Acids & Lab Directory Records from toolsData
  const customSanitizers: CustomSanitizerItem[] = useMemo(
    () => toolsData?.labFormulaData?.customSanitizers || [],
    [toolsData?.labFormulaData?.customSanitizers]
  );
  const customAcids: CustomAcidFactorItem[] = useMemo(
    () => toolsData?.labFormulaData?.customAcids || [],
    [toolsData?.labFormulaData?.customAcids]
  );
  const savedRecords: LabFormulaSavedRecord[] = useMemo(
    () => toolsData?.labFormulaData?.savedRecords || [],
    [toolsData?.labFormulaData?.savedRecords]
  );

  // Combined Sanitizers List (Default + Paid User Custom Sanitizers)
  const allSanitizerOptions = useMemo(() => {
    const customMapped = customSanitizers.map((c) => ({
      id: c.id,
      name: `${c.name} (${c.concentrationPct}%)`,
      rawName: c.name,
      pct: String(c.concentrationPct),
      isCustom: true
    }));
    const defaultMapped = DEFAULT_SANITIZERS.map((d, idx) => ({
      id: `default-san-${idx}`,
      name: d.name,
      rawName: d.name,
      pct: d.pct,
      isCustom: false
    }));
    return [...customMapped, ...defaultMapped];
  }, [customSanitizers]);

  // Combined Acid Factors List (Default + Paid User Custom Acids)
  const allAcidOptions = useMemo(() => {
    const customMapped = customAcids.map((c) => ({
      id: c.id,
      label: `${c.label} — Factor ${c.factor}`,
      rawLabel: c.label,
      val: c.factor,
      isCustom: true
    }));
    const defaultMapped = DEFAULT_ACID_FACTORS.map((d, idx) => ({
      id: `default-acid-${idx}`,
      label: d.label,
      rawLabel: d.label.split('—')[0].trim(),
      val: d.val,
      isCustom: false
    }));
    return [...customMapped, ...defaultMapped];
  }, [customAcids]);

  // A. Sanitizer / Chlorine PPM Dilution State
  const [sanitizerType, setSanitizerType] = useState<string>(
    'Household Bleach (5.25% NaOCl)'
  );
  const [stockStrengthPct, setStockStrengthPct] = useState<string>('5.25');
  const [waterVolumeLiters, setWaterVolumeLiters] = useState<string>('100');
  const [targetPpm, setTargetPpm] = useState<string>('200');
  const [ppmBatchName, setPpmBatchName] = useState<string>('');
  const [ppmNotes, setPpmNotes] = useState<string>('');

  // Add Custom Sanitizer Form State (Paid Only)
  const [showAddSanitizerForm, setShowAddSanitizerForm] =
    useState<boolean>(false);
  const [newChemicalName, setNewChemicalName] = useState<string>('');
  const [newChemicalPct, setNewChemicalPct] = useState<string>('10');

  const ppmResult = useMemo(() => {
    const stockPct = Math.max(0.01, Number(stockStrengthPct) || 5.25);
    const volL = Math.max(0.1, Number(waterVolumeLiters) || 100);
    const ppm = Math.max(1, Number(targetPpm) || 200);
    // 1% = 10,000 PPM. Volume of stock (mL) = (Target PPM * Water L) / (Stock % * 10)
    const stockMlRequired = (ppm * volL) / (stockPct * 10);
    const stockLitersRequired = stockMlRequired / 1000;
    const stockMlPerLiter = stockMlRequired / volL;

    let applicationGuide =
      'Food contact surfaces & equipment sanitization (No-rinse up to 200 PPM).';
    if (ppm <= 60) {
      applicationGuide =
        'Raw fruit & vegetable washing tank (typically 50–100 PPM free chlorine, pH 6.5–7.5).';
    } else if (ppm > 200 && ppm <= 400) {
      applicationGuide =
        'Floor, drain, crates & non-food contact sanitization (Rinse required if applied to food surfaces).';
    } else if (ppm > 400) {
      applicationGuide =
        'Heavy bio-security / footbath / mold disinfection (Strictly non-food contact or potable water rinse required).';
    }

    return {
      stockMlRequired: Number(stockMlRequired.toFixed(2)),
      stockLitersRequired: Number(stockLitersRequired.toFixed(4)),
      stockMlPerLiter: Number(stockMlPerLiter.toFixed(2)),
      applicationGuide
    };
  }, [stockStrengthPct, waterVolumeLiters, targetPpm]);

  // B. Titratable Acidity (% TA) & Brix:Acid Ratio State
  const [selectedAcidLabel, setSelectedAcidLabel] = useState<string>(
    DEFAULT_ACID_FACTORS[0].label
  );
  const [taSampleWeightG, setTaSampleWeightG] = useState<string>('10');
  const [taNaohMl, setTaNaohMl] = useState<string>('4.5');
  const [taNaohNormality, setTaNaohNormality] = useState<string>('0.1');
  const [taAcidFactor, setTaAcidFactor] = useState<string>('0.064'); // Citric Acid anhydrous = 0.064
  const [taSampleBrix, setTaSampleBrix] = useState<string>('12.5');
  const [taSampleName, setTaSampleName] = useState<string>('');
  const [taNotes, setTaNotes] = useState<string>('');

  // Add Custom Acid Form State (Paid Only)
  const [showAddAcidForm, setShowAddAcidForm] = useState<boolean>(false);
  const [newAcidName, setNewAcidName] = useState<string>('');
  const [newAcidFactor, setNewAcidFactor] = useState<string>('0.064');
  const [newAcidEqWeight, setNewAcidEqWeight] = useState<string>('');

  const taResult = useMemo(() => {
    const w = Math.max(0.1, Number(taSampleWeightG) || 10);
    const v = Math.max(0, Number(taNaohMl) || 0);
    const n = Math.max(0.001, Number(taNaohNormality) || 0.1);
    const eq = Math.max(0.001, Number(taAcidFactor) || 0.064);
    const brix = Math.max(0, Number(taSampleBrix) || 0);

    // % Acidity = (V_NaOH * N_NaOH * meq_factor * 100) / Sample_g
    const acidityPct = (v * n * eq * 100) / w;
    const brixAcidRatio = acidityPct > 0 ? brix / acidityPct : 0;

    return {
      acidityPct: Number(acidityPct.toFixed(3)),
      brixAcidRatio: Number(brixAcidRatio.toFixed(1))
    };
  }, [taSampleWeightG, taNaohMl, taNaohNormality, taAcidFactor, taSampleBrix]);

  // C. Quick Food Unit Converter State
  const [tempC, setTempC] = useState<string>('72');
  const [pctVal, setPctVal] = useState<string>('0.05');
  const [brixVal, setBrixVal] = useState<string>('11.5');

  const unitConversions = useMemo(() => {
    const c = Number(tempC) || 0;
    const f = (c * 9) / 5 + 32;
    const k = c + 273.15;

    const pct = Math.max(0, Number(pctVal) || 0);
    const ppm = pct * 10000;

    const bx = Math.min(85, Math.max(0, Number(brixVal) || 0));
    const sg = 1 / (1 - bx / 261.3);
    const baume = bx * 0.555;

    return {
      tempF: Number(f.toFixed(1)),
      tempK: Number(k.toFixed(1)),
      ppm: Number(ppm.toFixed(1)),
      sg: Number(sg.toFixed(4)),
      baume: Number(baume.toFixed(2))
    };
  }, [tempC, pctVal, brixVal]);

  // D. Directory Filter & Search State (Paid Users)
  const [dirTypeFilter, setDirTypeFilter] = useState<'all' | 'ppm' | 'acidity'>(
    'all'
  );
  const [dirPeriodFilter, setDirPeriodFilter] = useState<
    'all' | 'today' | 'week' | 'month'
  >('all');
  const [dirSearchQuery, setDirSearchQuery] = useState<string>('');

  const filteredDirectoryRecords = useMemo(() => {
    const now = Date.now();
    return savedRecords.filter((rec) => {
      if (dirTypeFilter !== 'all' && rec.recordType !== dirTypeFilter) {
        return false;
      }
      if (dirPeriodFilter !== 'all' && rec.savedAtIso) {
        const recTime = new Date(rec.savedAtIso).getTime();
        const diffDays = (now - recTime) / (1000 * 3600 * 24);
        if (dirPeriodFilter === 'today' && diffDays > 1) return false;
        if (dirPeriodFilter === 'week' && diffDays > 7) return false;
        if (dirPeriodFilter === 'month' && diffDays > 31) return false;
      }
      if (dirSearchQuery.trim()) {
        const q = dirSearchQuery.toLowerCase();
        const hay = `${rec.recordCode} ${rec.batchOrSampleName} ${
          rec.sanitizerName || ''
        } ${rec.acidName || ''} ${rec.savedDateFormatted} ${
          rec.notes || ''
        }`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [savedRecords, dirTypeFilter, dirPeriodFilter, dirSearchQuery]);

  // Helper to persist LabFormulaUserData into toolsData
  const persistLabFormulaData = async (nextLabData: {
    customSanitizers?: CustomSanitizerItem[];
    customAcids?: CustomAcidFactorItem[];
    savedRecords?: LabFormulaSavedRecord[];
  }) => {
    if (!toolsData || !onSaveToolsData) return;
    const updated: UserToolsData = {
      ...toolsData,
      labFormulaData: {
        customSanitizers: nextLabData.customSanitizers ?? customSanitizers,
        customAcids: nextLabData.customAcids ?? customAcids,
        savedRecords: nextLabData.savedRecords ?? savedRecords
      },
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    };
    await onSaveToolsData(updated);
  };

  // Save Custom Sanitizer / Chemical (Paid Only)
  const handleSaveCustomSanitizer = async () => {
    if (!canUsePremium) {
      onOpenPremiumModal?.();
      return;
    }
    const cleanName = newChemicalName.trim();
    const pctNum = Number(newChemicalPct);
    if (!cleanName) {
      showToast('Please enter the chemical / sanitizer name.');
      return;
    }
    if (!pctNum || pctNum <= 0 || pctNum > 100) {
      showToast('Please enter a valid stock concentration % (0.01 to 100).');
      return;
    }

    const newItem: CustomSanitizerItem = {
      id: `chem-${Date.now()}`,
      name: cleanName,
      concentrationPct: Number(pctNum.toFixed(2)),
      createdAt: new Date().toISOString()
    };

    const nextList = [newItem, ...customSanitizers];
    await persistLabFormulaData({ customSanitizers: nextList });

    const formattedOptionName = `${newItem.name} (${newItem.concentrationPct}%)`;
    setSanitizerType(formattedOptionName);
    setStockStrengthPct(String(newItem.concentrationPct));
    setNewChemicalName('');
    setNewChemicalPct('10');
    setShowAddSanitizerForm(false);
    showToast(
      `Saved "${newItem.name} (${newItem.concentrationPct}%)" to your Chemical List!`
    );
  };

  // Delete Custom Sanitizer
  const handleDeleteCustomSanitizer = async (id: string) => {
    const nextList = customSanitizers.filter((c) => c.id !== id);
    await persistLabFormulaData({ customSanitizers: nextList });
    showToast('Custom chemical removed from list.');
  };

  // Save Custom Organic Acid / Factor (Paid Only)
  const handleSaveCustomAcid = async () => {
    if (!canUsePremium) {
      onOpenPremiumModal?.();
      return;
    }
    const cleanLabel = newAcidName.trim();
    const factorNum = Number(newAcidFactor);
    if (!cleanLabel) {
      showToast('Please enter the Acid or Food Matrix name.');
      return;
    }
    if (!factorNum || factorNum <= 0 || factorNum > 5) {
      showToast('Please enter a valid acid factor (e.g. 0.064).');
      return;
    }

    const factorStr = String(Number(factorNum.toFixed(4)));
    const newItem: CustomAcidFactorItem = {
      id: `acid-${Date.now()}`,
      label: cleanLabel,
      factor: factorStr,
      createdAt: new Date().toISOString()
    };

    const nextList = [newItem, ...customAcids];
    await persistLabFormulaData({ customAcids: nextList });

    const fullLabel = `${newItem.label} — Factor ${newItem.factor}`;
    setSelectedAcidLabel(fullLabel);
    setTaAcidFactor(newItem.factor);
    setNewAcidName('');
    setNewAcidFactor('0.064');
    setNewAcidEqWeight('');
    setShowAddAcidForm(false);
    showToast(
      `Saved "${newItem.label} (Factor ${newItem.factor})" to your Acid List!`
    );
  };

  // Delete Custom Acid
  const handleDeleteCustomAcid = async (id: string) => {
    const nextList = customAcids.filter((c) => c.id !== id);
    await persistLabFormulaData({ customAcids: nextList });
    showToast('Custom acid removed from list.');
  };

  // Save PPM Solution Record to Directory (Paid Only)
  const handleSavePpmRecordToDirectory = async () => {
    if (!canUsePremium) {
      onOpenPremiumModal?.();
      return;
    }
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const recordCode = `LAB-SOL-${1001 + savedRecords.length}`;
    const batchTitle =
      ppmBatchName.trim() ||
      `${sanitizerType} @ ${targetPpm} PPM (${waterVolumeLiters} L)`;

    const newRec: LabFormulaSavedRecord = {
      id: `lab-rec-${Date.now()}`,
      recordCode,
      recordType: 'ppm',
      savedDateFormatted: dateFormatted,
      savedAtIso: now.toISOString(),
      batchOrSampleName: batchTitle,
      notes: ppmNotes.trim(),
      sanitizerName: sanitizerType,
      stockStrengthPct: Number(stockStrengthPct) || 5.25,
      waterVolumeLiters: Number(waterVolumeLiters) || 100,
      targetPpm: Number(targetPpm) || 200,
      stockMlRequired: ppmResult.stockMlRequired,
      stockLitersRequired: ppmResult.stockLitersRequired,
      stockMlPerLiter: ppmResult.stockMlPerLiter,
      applicationGuide: ppmResult.applicationGuide
    };

    const nextRecords = [newRec, ...savedRecords].slice(0, 200);
    await persistLabFormulaData({ savedRecords: nextRecords });
    setPpmBatchName('');
    setPpmNotes('');
    showToast(`Saved "${batchTitle}" (${recordCode}) to your Lab Directory!`);
  };

  // Save Titratable Acidity & Brix:Acid Record to Directory (Paid Only)
  const handleSaveAcidityRecordToDirectory = async () => {
    if (!canUsePremium) {
      onOpenPremiumModal?.();
      return;
    }
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const recordCode = `LAB-TA-${1001 + savedRecords.length}`;
    const sampleTitle =
      taSampleName.trim() ||
      `Titratable Acidity (${taResult.acidityPct}%) & Brix:Acid (${taResult.brixAcidRatio}:1)`;

    const newRec: LabFormulaSavedRecord = {
      id: `lab-rec-${Date.now()}`,
      recordCode,
      recordType: 'acidity',
      savedDateFormatted: dateFormatted,
      savedAtIso: now.toISOString(),
      batchOrSampleName: sampleTitle,
      notes: taNotes.trim(),
      acidName: selectedAcidLabel,
      acidFactor: Number(taAcidFactor) || 0.064,
      sampleWeightG: Number(taSampleWeightG) || 10,
      naohMl: Number(taNaohMl) || 4.5,
      naohNormality: Number(taNaohNormality) || 0.1,
      sampleBrix: Number(taSampleBrix) || 0,
      acidityPct: taResult.acidityPct,
      brixAcidRatio: taResult.brixAcidRatio
    };

    const nextRecords = [newRec, ...savedRecords].slice(0, 200);
    await persistLabFormulaData({ savedRecords: nextRecords });
    setTaSampleName('');
    setTaNotes('');
    showToast(`Saved "${sampleTitle}" (${recordCode}) to your Lab Directory!`);
  };

  const handleDeleteDirectoryRecord = async (id: string) => {
    const nextRecords = savedRecords.filter((r) => r.id !== id);
    await persistLabFormulaData({ savedRecords: nextRecords });
    showToast('Record deleted from Lab Directory.');
  };

  // Load a saved record back into the active calculator
  const handleLoadRecordIntoCalculator = (rec: LabFormulaSavedRecord) => {
    if (rec.recordType === 'ppm') {
      setSanitizerType(rec.sanitizerName || 'Household Bleach (5.25% NaOCl)');
      setStockStrengthPct(String(rec.stockStrengthPct ?? 5.25));
      setWaterVolumeLiters(String(rec.waterVolumeLiters ?? 100));
      setTargetPpm(String(rec.targetPpm ?? 200));
      setPpmBatchName(rec.batchOrSampleName || '');
      setPpmNotes(rec.notes || '');
      setSubMode('ppm');
      showToast(`Loaded "${rec.batchOrSampleName}" into Sanitizer Calculator!`);
    } else {
      setSelectedAcidLabel(rec.acidName || DEFAULT_ACID_FACTORS[0].label);
      setTaAcidFactor(String(rec.acidFactor ?? 0.064));
      setTaSampleWeightG(String(rec.sampleWeightG ?? 10));
      setTaNaohMl(String(rec.naohMl ?? 4.5));
      setTaNaohNormality(String(rec.naohNormality ?? 0.1));
      setTaSampleBrix(String(rec.sampleBrix ?? 12.5));
      setTaSampleName(rec.batchOrSampleName || '');
      setTaNotes(rec.notes || '');
      setSubMode('acidity');
      showToast(`Loaded "${rec.batchOrSampleName}" into Acidity Calculator!`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Download Single Lab Record PDF Report (On-the-fly generation — zero DB load)
  const handleDownloadSingleLabRecordPdf = (rec: LabFormulaSavedRecord) => {
    if (!canUsePremium) {
      onOpenPremiumModal?.();
      return;
    }
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const specialistName = (user?.name || 'Food Safety & QA Specialist').trim();

    // Header Banner
    pdf.setFillColor(26, 33, 56);
    pdf.rect(0, 0, 210, 44, 'F');
    pdf.setFillColor(22, 115, 184);
    pdf.rect(0, 41, 210, 3, 'F');

    drawPdfBrandLogo(pdf, 14, 8, 26, {
      borderColor: [255, 255, 255],
      bgFill: [255, 255, 255],
      roundedRadius: 4
    });

    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Food Science Portal — Official QA Laboratory Log', 44, 17);
    pdf.setFontSize(17);
    pdf.text(
      rec.recordType === 'ppm'
        ? 'CHEMICAL / SANITIZER DILUTION BATCH REPORT'
        : 'TITRATABLE ACIDITY & BRIX:ACID LAB REPORT',
      44,
      26
    );
    pdf.setFontSize(9.5);
    pdf.setTextColor(220, 233, 246);
    pdf.text(
      `Record ID: ${rec.recordCode}   •   Date Prepared: ${rec.savedDateFormatted}`,
      44,
      34
    );

    drawPdfUserPhoto(pdf, user?.profilePicUrl, specialistName, 172, 8, 24, {
      borderColor: [255, 255, 255],
      fallbackBgColor: [22, 115, 184],
      fallbackTextColor: [255, 255, 255]
    });

    // Specialist & Batch Info Card
    pdf.setFillColor(240, 246, 252);
    pdf.setDrawColor(210, 222, 234);
    pdf.roundedRect(14, 52, 182, 30, 3, 3, 'FD');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(26, 33, 56);
    pdf.text(`Prepared By: ${specialistName}`, 20, 61);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(74, 85, 104);
    pdf.text(
      `Batch / Sample Name: ${rec.batchOrSampleName}`,
      20,
      68
    );
    pdf.text(
      `Record Code: ${rec.recordCode}   |   Timestamp: ${rec.savedDateFormatted}`,
      20,
      75
    );

    let y = 92;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(22, 115, 184);
    pdf.text(
      rec.recordType === 'ppm'
        ? '1. Sanitizer / Chemical Solution Parameters & Dosing'
        : '1. Titratable Acidity (% TA) & Brix:Acid Analytical Parameters',
      14,
      y
    );
    y += 6;

    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(22, 115, 184);
    pdf.roundedRect(14, y, 182, 64, 3, 3, 'FD');

    pdf.setFontSize(10.5);
    pdf.setTextColor(26, 33, 56);
    if (rec.recordType === 'ppm') {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Chemical / Sanitizer Used:`, 20, y + 12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${rec.sanitizerName || '-'}`, 82, y + 12);

      pdf.setFont('helvetica', 'bold');
      pdf.text(`Stock Chemical Concentration:`, 20, y + 22);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${rec.stockStrengthPct}% Active Ingredient`, 82, y + 22);

      pdf.setFont('helvetica', 'bold');
      pdf.text(`Total Batch / Water Volume:`, 20, y + 32);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${rec.waterVolumeLiters} Liters`, 82, y + 32);

      pdf.setFont('helvetica', 'bold');
      pdf.text(`Target Required Concentration:`, 20, y + 42);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${rec.targetPpm} PPM (mg/L)`, 82, y + 42);

      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(22, 115, 184);
      pdf.text(`EXACT CHEMICAL DOSING REQUIRED:`, 20, y + 54);
      pdf.text(
        `${rec.stockMlRequired} mL (${rec.stockLitersRequired} L)  [${rec.stockMlPerLiter} mL per 1 L water]`,
        92,
        y + 54
      );
    } else {
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Predominant Organic Acid & Factor:`, 20, y + 12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `${(rec.acidName || '-').slice(0, 58)} (Factor: ${rec.acidFactor})`,
        86,
        y + 12
      );

      pdf.setFont('helvetica', 'bold');
      pdf.text(`Sample Weight / Volume Analyzed:`, 20, y + 22);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${rec.sampleWeightG} g (or mL)`, 86, y + 22);

      pdf.setFont('helvetica', 'bold');
      pdf.text(`NaOH Titrant Volume & Normality:`, 20, y + 32);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${rec.naohMl} mL of ${rec.naohNormality} N NaOH`, 86, y + 32);

      pdf.setFont('helvetica', 'bold');
      pdf.text(`Sample Refractometer °Brix:`, 20, y + 42);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${rec.sampleBrix} °Brix`, 86, y + 42);

      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(22, 115, 184);
      pdf.text(`ANALYTICAL RESULT:`, 20, y + 54);
      pdf.text(
        `Titratable Acidity = ${rec.acidityPct}%   |   Brix:Acid Ratio = ${rec.brixAcidRatio} : 1`,
        72,
        y + 54
      );
    }

    y += 76;
    if (rec.applicationGuide || rec.notes) {
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(210, 222, 234);
      pdf.roundedRect(14, y, 182, 34, 3, 3, 'FD');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(26, 33, 56);
      pdf.text('HACCP Guideline & Laboratory Notes:', 20, y + 10);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      pdf.setTextColor(74, 85, 104);
      const combinedNote = `${rec.applicationGuide ? `Guideline: ${rec.applicationGuide} ` : ''}${
        rec.notes ? `| Lab Notes: ${rec.notes}` : ''
      }`;
      const wrapped = pdf.splitTextToSize(combinedNote, 170);
      pdf.text(wrapped.slice(0, 3), 20, y + 18);
    }

    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8.5);
    pdf.setTextColor(120, 130, 145);
    pdf.text(
      'Generated by Food Science Portal — QA & Laboratory Formula Suite',
      14,
      284
    );

    pdf.save(`${rec.recordCode}_${rec.recordType.toUpperCase()}_Report.pdf`);
    showToast(`Downloaded PDF Report (${rec.recordCode})!`);
  };

  // Download Full Directory Logbook PDF (All Filtered Records)
  const handleDownloadDirectoryLogbookPdf = () => {
    if (!canUsePremium) {
      onOpenPremiumModal?.();
      return;
    }
    if (filteredDirectoryRecords.length === 0) {
      showToast('No saved records to export.');
      return;
    }
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const specialistName = (user?.name || 'Food Safety & QA Specialist').trim();

    pdf.setFillColor(26, 33, 56);
    pdf.rect(0, 0, 210, 42, 'F');
    drawPdfBrandLogo(pdf, 14, 8, 25, {
      borderColor: [255, 255, 255],
      bgFill: [255, 255, 255],
      roundedRadius: 4
    });

    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Food Science Portal — QA Laboratory Logbook', 44, 17);
    pdf.setFontSize(16);
    pdf.text('SAVED SOLUTIONS & TITRATION DIRECTORY REPORT', 44, 26);
    pdf.setFontSize(9.5);
    pdf.setTextColor(220, 233, 246);
    pdf.text(
      `Specialist: ${specialistName}   •   Total Records: ${filteredDirectoryRecords.length}`,
      44,
      34
    );

    drawPdfUserPhoto(pdf, user?.profilePicUrl, specialistName, 172, 8, 24, {
      borderColor: [255, 255, 255],
      fallbackBgColor: [22, 115, 184],
      fallbackTextColor: [255, 255, 255]
    });

    let y = 50;
    filteredDirectoryRecords.forEach((rec, idx) => {
      if (y > 255) {
        pdf.addPage();
        y = 20;
      }
      pdf.setFillColor(idx % 2 === 0 ? 248 : 240, idx % 2 === 0 ? 250 : 246, 252);
      pdf.setDrawColor(210, 222, 234);
      pdf.roundedRect(14, y, 182, 26, 2.5, 2.5, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(26, 33, 56);
      pdf.text(
        `${idx + 1}. [${rec.recordCode}] ${rec.batchOrSampleName}  (${rec.savedDateFormatted})`,
        18,
        y + 7
      );

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.8);
      pdf.setTextColor(22, 115, 184);
      if (rec.recordType === 'ppm') {
        pdf.text(
          `Sanitizer Dilution: ${rec.sanitizerName} (${rec.stockStrengthPct}% stock) -> ${rec.waterVolumeLiters} L @ ${rec.targetPpm} PPM = Add ${rec.stockMlRequired} mL`,
          18,
          y + 14.5
        );
      } else {
        pdf.text(
          `Titratable Acidity: ${(rec.acidName || '').split('—')[0].trim()} (Factor ${rec.acidFactor}) | Sample ${rec.sampleWeightG}g, NaOH ${rec.naohMl}mL (${rec.naohNormality}N) => TA: ${rec.acidityPct}% | Brix:Acid: ${rec.brixAcidRatio}:1`,
          18,
          y + 14.5
        );
      }

      if (rec.notes) {
        pdf.setTextColor(90, 108, 132);
        pdf.text(`Notes: ${rec.notes.slice(0, 95)}`, 18, y + 21.5);
      }
      y += 30;
    });

    pdf.save(`Lab_Formula_Directory_Logbook_${Date.now()}.pdf`);
    showToast('Downloaded Complete Lab Directory Logbook PDF!');
  };

  return (
    <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 sm:p-6 shadow-xs space-y-6">
      {/* Toast Notification */}
      {statusToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#1A2138] text-white text-xs font-extrabold shadow-lg flex items-center gap-2 border border-[#1673B8]/40">
          <Check className="w-4 h-4 text-[#60A5FA] shrink-0" />
          <span>{statusToast}</span>
        </div>
      )}

      {/* Header & Sub-Mode Tabs */}
      <div className="border-b border-[#D2DEEA] pb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1673B8] text-white flex items-center justify-center shrink-0">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
                Lab &amp; Formula Calculator
              </h2>
              <span className="text-[11px] font-extrabold text-[#1673B8]">
                {canUsePremium
                  ? '· Paid Pro Mode (Custom Chemicals & Directory Unlocked)'
                  : '· Free Basic Calculator'}
              </span>
            </div>
            <p className="text-xs text-[#4A5568] font-medium">
              Sanitizer PPM Dilution, Titratable Acidity (% TA), Brix:Acid Ratio,
              Unit Converter &amp; Saved Lab Solutions Directory
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-[#F0F6FC] p-1 rounded-xl border border-[#D2DEEA]">
          {[
            { id: 'ppm' as const, label: 'Sanitizer PPM Dilution' },
            { id: 'acidity' as const, label: 'Titratable Acidity & Brix:Acid' },
            { id: 'converter' as const, label: 'Temp, PPM & Brix Converter' },
            ...(canUsePremium
              ? [
                  {
                    id: 'directory' as const,
                    label: `Saved Directory (${savedRecords.length})`
                  }
                ]
              : [])
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSubMode(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                subMode === t.id
                  ? 'bg-[#1673B8] text-white shadow-2xs'
                  : 'text-[#1A2138] hover:bg-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================================
          MODE 1: SANITIZER / CHEMICAL PPM DILUTION CALCULATOR
         ===================================================================== */}
      {subMode === 'ppm' && (
        <div className="space-y-5">
          {/* Paid Member Custom Chemical Addition Bar */}
          {canUsePremium ? (
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-[#1A2138]">
                  <span className="font-extrabold text-[#1673B8]">
                    Custom Chemical / Sanitizer Library:
                  </span>{' '}
                  If your sanitizer or chemical is not in the dropdown list below,
                  click <strong>+ Add Custom Chemical</strong> to save its name and
                  stock concentration (%) for future batches.
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setShowAddSanitizerForm((prev) => !prev)
                  }
                  className="px-3.5 py-1.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {showAddSanitizerForm
                      ? 'Close Form'
                      : '+ Add Custom Chemical'}
                  </span>
                </button>
              </div>

              {showAddSanitizerForm && (
                <div className="p-4 rounded-xl bg-white border border-[#94B8D7] grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-6">
                    <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                      New Chemical / Sanitizer Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Chlorine Dioxide (ClO2) / Divosan / Virkon S"
                      value={newChemicalName}
                      onChange={(e) => setNewChemicalName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                      Its Stock Concentration (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g., 15"
                      value={newChemicalPct}
                      onChange={(e) => setNewChemicalPct(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <button
                      type="button"
                      onClick={handleSaveCustomSanitizer}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold cursor-pointer"
                    >
                      Save Chemical to List ✓
                    </button>
                  </div>
                </div>
              )}

              {customSanitizers.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="font-extrabold text-[#5A6C84]">
                    Your Saved Chemicals:
                  </span>
                  {customSanitizers.map((cs) => (
                    <span
                      key={cs.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#D2DEEA] text-[#1A2138] font-bold"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSanitizerType(
                            `${cs.name} (${cs.concentrationPct}%)`
                          );
                          setStockStrengthPct(String(cs.concentrationPct));
                        }}
                        className="hover:text-[#1673B8] cursor-pointer"
                      >
                        {cs.name} ({cs.concentrationPct}%)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomSanitizer(cs.id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        title="Remove custom chemical"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Sanitizer / Chemical Type
              </label>
              <select
                value={sanitizerType}
                onChange={(e) => {
                  const val = e.target.value;
                  setSanitizerType(val);
                  const matched = allSanitizerOptions.find(
                    (o) => o.name === val
                  );
                  if (matched) {
                    setStockStrengthPct(matched.pct);
                  }
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              >
                {allSanitizerOptions.map((opt) => (
                  <option key={opt.id} value={opt.name}>
                    {opt.isCustom ? `★ ${opt.name}` : opt.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Stock Chemical Concentration (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={stockStrengthPct}
                onChange={(e) => setStockStrengthPct(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Water Tank / Batch Volume (Liters)
              </label>
              <input
                type="number"
                step="1"
                value={waterVolumeLiters}
                onChange={(e) => setWaterVolumeLiters(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Required Target Concentration (PPM)
              </label>
              <input
                type="number"
                step="5"
                value={targetPpm}
                onChange={(e) => setTargetPpm(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[50, 100, 150, 200, 400, 1000].map((presetPpm) => (
              <button
                key={presetPpm}
                type="button"
                onClick={() => setTargetPpm(String(presetPpm))}
                className={`px-3 py-1 rounded-lg text-xs font-extrabold cursor-pointer border ${
                  Number(targetPpm) === presetPpm
                    ? 'bg-[#1A2138] text-white border-[#1A2138]'
                    : 'bg-[#F0F6FC] text-[#1A2138] border-[#D2DEEA]'
                }`}
              >
                {presetPpm} PPM
              </button>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F6FC] border-2 border-[#1673B8] space-y-3">
            <div className="text-xs font-extrabold text-[#1673B8] uppercase tracking-wider">
              Exact Dosing Prescription for {waterVolumeLiters} Liters @{' '}
              {targetPpm} PPM ({sanitizerType})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[11px] font-bold text-[#4A5568]">
                  Add Stock Chemical (mL)
                </div>
                <div className="text-2xl font-extrabold text-[#1673B8] mt-0.5 font-mono tabular-nums">
                  {ppmResult.stockMlRequired} mL
                </div>
                <div className="text-[11px] text-[#4A5568] mt-0.5 tabular-nums">
                  ({ppmResult.stockLitersRequired} Liters total)
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[11px] font-bold text-[#4A5568]">
                  Dosing Rate per 1 Liter Water
                </div>
                <div className="text-2xl font-extrabold text-[#1A2138] mt-0.5 font-mono tabular-nums">
                  {ppmResult.stockMlPerLiter} mL / L
                </div>
                <div className="text-[11px] text-[#4A5568] mt-0.5">
                  From {stockStrengthPct}% stock solution
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[11px] font-bold text-[#4A5568]">
                  HACCP / Hygiene Guideline
                </div>
                <div className="text-xs font-bold text-[#1A2138] mt-1 leading-snug">
                  {ppmResult.applicationGuide}
                </div>
              </div>
            </div>

            {/* Paid User: Save Solution to Lab Directory */}
            {canUsePremium && (
              <div className="pt-3 border-t border-[#BBD6EE] grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Batch / Line / Tank Label (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Veg Wash Tank #1 — Morning Shift"
                    value={ppmBatchName}
                    onChange={(e) => setPpmBatchName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Verification Notes / Operator (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Verified 200 PPM via test strip, pH 6.8"
                    value={ppmNotes}
                    onChange={(e) => setPpmNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div className="sm:col-span-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSavePpmRecordToDirectory}
                    className="flex-1 py-2.5 px-3.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold cursor-pointer shadow-xs"
                  >
                    Save Solution to Directory ✓
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODE 2: TITRATABLE ACIDITY (% TA) & BRIX:ACID RATIO CALCULATOR
         ===================================================================== */}
      {subMode === 'acidity' && (
        <div className="space-y-5">
          {/* Paid Member Custom Acid / Factor Addition Bar */}
          {canUsePremium ? (
            <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-[#1A2138]">
                  <span className="font-extrabold text-[#1673B8]">
                    Custom Acid / Matrix Library:
                  </span>{' '}
                  If your organic acid or food item is not in the list below,
                  click <strong>+ Add Custom Acid / Factor</strong> to save it for
                  future titrations.
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddAcidForm((prev) => !prev)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {showAddAcidForm
                      ? 'Close Form'
                      : '+ Add Custom Acid / Factor'}
                  </span>
                </button>
              </div>

              {showAddAcidForm && (
                <div className="p-4 rounded-xl bg-white border border-[#94B8D7] grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-5">
                    <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                      Acid Name &amp; Food Product
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Ascorbic Acid (Vitamin C Fruit Drink) / Phosphoric Acid"
                      value={newAcidName}
                      onChange={(e) => setNewAcidName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                      Eq. Wt (Optional)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 88"
                      value={newAcidEqWeight}
                      onChange={(e) => {
                        setNewAcidEqWeight(e.target.value);
                        const eqW = Number(e.target.value);
                        if (eqW > 0) {
                          setNewAcidFactor(
                            String(Number((eqW / 1000).toFixed(4)))
                          );
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                      meq Factor
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      placeholder="e.g., 0.088"
                      value={newAcidFactor}
                      onChange={(e) => setNewAcidFactor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <button
                      type="button"
                      onClick={handleSaveCustomAcid}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold cursor-pointer"
                    >
                      Save Acid to List ✓
                    </button>
                  </div>
                </div>
              )}

              {customAcids.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="font-extrabold text-[#5A6C84]">
                    Your Saved Acids:
                  </span>
                  {customAcids.map((ca) => (
                    <span
                      key={ca.id}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#D2DEEA] text-[#1A2138] font-bold"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedAcidLabel(
                            `${ca.label} — Factor ${ca.factor}`
                          );
                          setTaAcidFactor(ca.factor);
                        }}
                        className="hover:text-[#1673B8] cursor-pointer"
                      >
                        {ca.label} ({ca.factor})
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomAcid(ca.id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        title="Remove custom acid"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Select Predominant Organic Acid (meq Factor)
              </label>
              <select
                value={selectedAcidLabel}
                onChange={(e) => {
                  const lbl = e.target.value;
                  setSelectedAcidLabel(lbl);
                  const matched = allAcidOptions.find((a) => a.label === lbl);
                  if (matched) {
                    setTaAcidFactor(matched.val);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              >
                {allAcidOptions.map((af) => (
                  <option key={af.id} value={af.label}>
                    {af.isCustom ? `★ ${af.label}` : af.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Sample Weight or Volume (g or mL)
              </label>
              <input
                type="number"
                step="0.1"
                value={taSampleWeightG}
                onChange={(e) => setTaSampleWeightG(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Volume of NaOH Consumed in Titration (mL)
              </label>
              <input
                type="number"
                step="0.05"
                value={taNaohMl}
                onChange={(e) => setTaNaohMl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Normality of NaOH (N)
              </label>
              <input
                type="number"
                step="0.01"
                value={taNaohNormality}
                onChange={(e) => setTaNaohNormality(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Sample Refractometer °Brix (Optional for Brix:Acid Ratio)
              </label>
              <input
                type="number"
                step="0.1"
                value={taSampleBrix}
                onChange={(e) => setTaSampleBrix(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F6FC] border-2 border-[#1673B8] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[11px] font-bold text-[#4A5568]">
                  Titratable Acidity (% w/w or % w/v)
                </div>
                <div className="text-2xl font-extrabold text-[#1673B8] mt-0.5 font-mono tabular-nums">
                  {taResult.acidityPct}%
                </div>
                <div className="text-[11px] text-[#4A5568] mt-0.5">
                  Formula: (mL NaOH × N × {taAcidFactor} × 100) / Sample Weight
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[11px] font-bold text-[#4A5568]">
                  Sugar / Acid Ratio (°Brix : Acidity)
                </div>
                <div className="text-2xl font-extrabold text-[#1A2138] mt-0.5 font-mono tabular-nums">
                  {taResult.brixAcidRatio} : 1
                </div>
                <div className="text-[11px] text-[#4A5568] mt-0.5">
                  {taResult.brixAcidRatio >= 12 && taResult.brixAcidRatio <= 22
                    ? 'Balanced sensory sweetness-to-tartness ratio for beverages/juices'
                    : 'Check product sensory spec (Typical juices: 12:1 to 22:1)'}
                </div>
              </div>
            </div>

            {/* Paid User: Save Titration & Brix:Acid Record to Directory */}
            {canUsePremium && (
              <div className="pt-3 border-t border-[#BBD6EE] grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Sample / Product Batch Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Mango Nectar Batch #402 / Raw Milk"
                    value={taSampleName}
                    onChange={(e) => setTaSampleName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Lab Analyst Notes / Spec Verdict (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Passed QA Spec (Target TA 0.28%–0.32%)"
                    value={taNotes}
                    onChange={(e) => setTaNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div className="sm:col-span-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveAcidityRecordToDirectory}
                    className="flex-1 py-2.5 px-3.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold cursor-pointer shadow-xs"
                  >
                    Save Acidity Record to Directory ✓
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODE 3: QUICK FOOD UNIT CONVERTER
         ===================================================================== */}
      {subMode === 'converter' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-2.5">
            <label className="block text-xs font-extrabold text-[#1A2138]">
              Temperature (°C → °F &amp; Kelvin)
            </label>
            <input
              type="number"
              value={tempC}
              onChange={(e) => setTempC(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
            />
            <div className="text-xs font-bold text-[#1673B8] space-y-1 pt-1">
              <div>Fahrenheit: {unitConversions.tempF} °F</div>
              <div>Kelvin: {unitConversions.tempK} K</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-2.5">
            <label className="block text-xs font-extrabold text-[#1A2138]">
              Percentage (%) ↔ PPM (mg/kg)
            </label>
            <input
              type="number"
              step="0.001"
              value={pctVal}
              onChange={(e) => setPctVal(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
            />
            <div className="text-xs font-bold text-[#1673B8] space-y-1 pt-1">
              <div>Equals: {unitConversions.ppm} PPM (mg/kg or mg/L)</div>
              <div className="text-[11px] text-[#4A5568]">1% = 10,000 PPM</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-2.5">
            <label className="block text-xs font-extrabold text-[#1A2138]">
              °Brix → Specific Gravity &amp; °Baumé
            </label>
            <input
              type="number"
              step="0.1"
              value={brixVal}
              onChange={(e) => setBrixVal(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
            />
            <div className="text-xs font-bold text-[#1673B8] space-y-1 pt-1">
              <div>Specific Gravity (20°C): {unitConversions.sg}</div>
              <div>Degrees Baumé (°Bé): {unitConversions.baume}</div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PAID MEMBER SAVED LAB SOLUTIONS & TITRATION DIRECTORY
          (Shown when in 'directory' tab OR below the calculator for Paid Users)
         ===================================================================== */}
      {canUsePremium && (
        <div className="pt-4 border-t-2 border-[#E4EDF7] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-extrabold text-[#1673B8]">
                Paid Member Laboratory Logbook &amp; Saved Directory
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
                Saved Solutions &amp; Titration Directory ({savedRecords.length})
              </h3>
              <p className="text-xs text-[#5A6C84]">
                Track what date and time you prepared each sanitizer solution or
                acidity test, reload parameters anytime, or download official
                PDF reports.
              </p>
            </div>

            {savedRecords.length > 0 && (
              <button
                type="button"
                onClick={handleDownloadDirectoryLogbookPdf}
                className="px-4 py-2.5 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Full Directory PDF ({filteredDirectoryRecords.length})</span>
              </button>
            )}
          </div>

          {/* Search & Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center bg-[#F8FAFC] p-3 rounded-2xl border border-[#D2DEEA]">
            <div className="sm:col-span-5 relative">
              <Search className="w-4 h-4 text-[#5A6C84] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by chemical, batch name, ID or date..."
                value={dirSearchQuery}
                onChange={(e) => setDirSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-bold text-[#1A2138]"
              />
            </div>

            <div className="sm:col-span-4 flex flex-wrap gap-1">
              {[
                { id: 'all' as const, label: 'All Types' },
                { id: 'ppm' as const, label: 'Sanitizer PPM' },
                { id: 'acidity' as const, label: 'Acidity & Brix' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setDirTypeFilter(f.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold cursor-pointer ${
                    dirTypeFilter === f.id
                      ? 'bg-[#1673B8] text-white'
                      : 'bg-white text-[#5A6C84] border border-[#D2DEEA]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="sm:col-span-3 flex flex-wrap gap-1 sm:justify-end">
              {[
                { id: 'all' as const, label: 'All Time' },
                { id: 'today' as const, label: 'Today' },
                { id: 'week' as const, label: 'Week' },
                { id: 'month' as const, label: 'Month' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setDirPeriodFilter(p.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold cursor-pointer ${
                    dirPeriodFilter === p.id
                      ? 'bg-[#1A2138] text-white'
                      : 'bg-white text-[#5A6C84] border border-[#D2DEEA]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Records List */}
          {filteredDirectoryRecords.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA] text-center space-y-1">
              <div className="text-xs font-extrabold text-[#1A2138]">
                No Saved Lab Solutions or Titration Records Found
              </div>
              <p className="text-[11px] text-[#5A6C84]">
                Calculate a Sanitizer PPM dilution or Titratable Acidity above
                and click &ldquo;Save to Directory&rdquo; to log your solution
                with date &amp; time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredDirectoryRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-[#F8FAFC] hover:bg-white border border-[#D2DEEA] hover:border-[#1673B8] transition-all space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-extrabold">
                      <span className="text-[#1673B8]">
                        {rec.recordCode} ·{' '}
                        {rec.recordType === 'ppm'
                          ? 'Sanitizer Solution'
                          : 'Titratable Acidity & Brix'}
                      </span>
                      <span className="text-[#5A6C84]">
                        Date: {rec.savedDateFormatted}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-[#1A2138]">
                      {rec.batchOrSampleName}
                    </h4>

                    {rec.recordType === 'ppm' ? (
                      <div className="p-2.5 rounded-xl bg-white border border-[#D2DEEA] text-xs space-y-1">
                        <div>
                          <span className="font-bold text-[#5A6C84]">
                            Chemical Prepared:
                          </span>{' '}
                          <span className="font-extrabold text-[#1A2138]">
                            {rec.sanitizerName} (Stock {rec.stockStrengthPct}%)
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-[#5A6C84]">
                            Batch &amp; Target:
                          </span>{' '}
                          <span className="font-extrabold text-[#1A2138]">
                            {rec.waterVolumeLiters} Liters @ {rec.targetPpm} PPM
                          </span>
                        </div>
                        <div className="text-[#1673B8] font-extrabold">
                          Dosing Added: {rec.stockMlRequired} mL (
                          {rec.stockLitersRequired} L) [{rec.stockMlPerLiter}{' '}
                          mL/L]
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-white border border-[#D2DEEA] text-xs space-y-1">
                        <div>
                          <span className="font-bold text-[#5A6C84]">
                            Acid &amp; Factor:
                          </span>{' '}
                          <span className="font-extrabold text-[#1A2138]">
                            {(rec.acidName || '').split('—')[0].trim()} (Factor{' '}
                            {rec.acidFactor})
                          </span>
                        </div>
                        <div>
                          <span className="font-bold text-[#5A6C84]">
                            Titration Inputs:
                          </span>{' '}
                          <span className="font-extrabold text-[#1A2138]">
                            Sample {rec.sampleWeightG}g · NaOH {rec.naohMl} mL (
                            {rec.naohNormality} N) · {rec.sampleBrix} °Brix
                          </span>
                        </div>
                        <div className="text-[#1673B8] font-extrabold">
                          Result: Acidity = {rec.acidityPct}% · Brix:Acid Ratio ={' '}
                          {rec.brixAcidRatio} : 1
                        </div>
                      </div>
                    )}

                    {rec.notes && (
                      <p className="text-[11px] text-[#5A6C84] italic">
                        Notes: {rec.notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#E4EDF7] flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleLoadRecordIntoCalculator(rec)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#EBF4FC] border border-[#D2DEEA] text-[#1A2138] text-[11px] font-extrabold cursor-pointer"
                    >
                      Reload Parameters
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDownloadSingleLabRecordPdf(rec)}
                        className="px-3 py-1.5 rounded-lg bg-[#1673B8] hover:bg-[#105E9A] text-white text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download PDF</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDirectoryRecord(rec.id)}
                        className="p-1.5 rounded-lg bg-white hover:bg-red-50 border border-[#D2DEEA] text-red-600 cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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

// ============================================================================
// 2. PEARSON SQUARE & BATCH STANDARDIZATION / CORRECTION CALCULATOR
//    (BEVERAGE / JUICE BRIX + ACIDITY + WATER CORRECTOR, DAIRY FAT/SNF STANDARDIZER
//     & CLASSIC PEARSON SQUARE — WITH PAID MEMBER PRODUCT DIRECTORY & PDF REPORTS)
// ============================================================================
interface PearsonSquareBatchToolProps {
  user?: HubUser;
  isUserPaid?: boolean;
  hasExpiredPremium?: boolean;
  toolsData?: UserToolsData;
  onSaveToolsData?: (updated: UserToolsData) => Promise<void>;
  onOpenPremiumModal?: () => void;
}

const INDUSTRY_CATEGORIES: {
  industry: string;
  defaultMode: PearsonCalculatorMode;
  defaultProduct: string;
}[] = [
  {
    industry: 'Juice, Nectar & Beverage Industry',
    defaultMode: 'beverage',
    defaultProduct: 'Mango Fruit Drink'
  },
  {
    industry: 'Dairy, Milk & Ice Cream Industry',
    defaultMode: 'dairy',
    defaultProduct: 'Pasteurized Standardized Milk'
  },
  {
    industry: 'Sauces, Ketchup, Mayonnaise & Condiments Industry',
    defaultMode: 'sauces_mayo',
    defaultProduct: 'Tomato Ketchup Batch'
  },
  {
    industry: 'Baking, Biscuits & Confectionery Industry',
    defaultMode: 'baking_biscuits',
    defaultProduct: 'Sweet Biscuit Dough Batch'
  },
  {
    industry: 'Edible Oil, Meat & General Food Processing (Pearson)',
    defaultMode: 'classic',
    defaultProduct: 'Standardized Blended Batch'
  }
];

export const PearsonSquareBatchTool: React.FC<PearsonSquareBatchToolProps> = ({
  user,
  isUserPaid = false,
  hasExpiredPremium = false,
  toolsData,
  onSaveToolsData,
  onOpenPremiumModal
}) => {
  const canUsePremium = Boolean(
    (isUserPaid && !hasExpiredPremium) || user?.isAdmin
  );

  const [industryMode, setIndustryMode] = useState<
    PearsonCalculatorMode | 'directory'
  >('beverage');
  const [statusToast, setStatusToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setStatusToast(msg);
    window.setTimeout(() => {
      setStatusToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Saved Custom Products & Saved Batch Records from toolsData
  const customProducts: PearsonCustomProductItem[] = useMemo(
    () => toolsData?.pearsonBatchData?.customProducts || [],
    [toolsData?.pearsonBatchData?.customProducts]
  );

  const savedBatchRecords: PearsonBatchSavedRecord[] = useMemo(
    () => toolsData?.pearsonBatchData?.savedBatchRecords || [],
    [toolsData?.pearsonBatchData?.savedBatchRecords]
  );

  // Paid Member Industry & Product Selection State (No Batch/Lot No, No Quick-Select Chips)
  const [selectedIndustry, setSelectedIndustry] = useState<string>(
    INDUSTRY_CATEGORIES[0].industry
  );
  const [productName, setProductName] = useState<string>('Mango Fruit Drink');
  const [batchNotes, setBatchNotes] = useState<string>('');

  // Add Custom Product to Reusable Library State
  const [showAddProductForm, setShowAddProductForm] = useState<boolean>(false);
  const [newCustomProductName, setNewCustomProductName] = useState<string>('');
  const [newCustomProductIndustry, setNewCustomProductIndustry] =
    useState<string>(INDUSTRY_CATEGORIES[0].industry);

  // =========================================================================
  // MODE 1: JUICE & BEVERAGE BATCH CORRECTOR (Batch Size, Brix, Acidity & pH)
  // =========================================================================
  const [bevBatchKg, setBevBatchKg] = useState<string>('500');
  const [bevCurrentBrix, setBevCurrentBrix] = useState<string>('10.2');
  const [bevTargetBrix, setBevTargetBrix] = useState<string>('13.0');
  const [bevCurrentAcid, setBevCurrentAcid] = useState<string>('0.18');
  const [bevTargetAcid, setBevTargetAcid] = useState<string>('0.28');
  const [bevCurrentPh, setBevCurrentPh] = useState<string>('3.85');
  const [bevTargetPh, setBevTargetPh] = useState<string>('3.50');
  const [bevSugarSourceBrix, setBevSugarSourceBrix] = useState<string>('100');

  const beverageCorrection = useMemo(() => {
    const M0 = Math.max(1, Number(bevBatchKg) || 500);
    const B0 = Math.max(0, Number(bevCurrentBrix) || 0);
    const Bt = Math.max(0.1, Number(bevTargetBrix) || 13);
    const A0 = Math.max(0, Number(bevCurrentAcid) || 0);
    const At = Math.max(0.01, Number(bevTargetAcid) || 0.25);
    const pH0 = Math.max(1, Number(bevCurrentPh) || 3.85);
    const pHt = Math.max(1, Number(bevTargetPh) || 3.5);
    const Bs = Math.max(Bt + 1, Number(bevSugarSourceBrix) || 100);

    const currentSolidsKg = M0 * (B0 / 100);
    const currentAcidKg = M0 * (A0 / 100);

    const minMassForAcid = At > 0 ? currentAcidKg / (At / 100) : M0;
    const minMassForBrix = Bt > 0 ? currentSolidsKg / (Bt / 100) : M0;

    const bsFrac = Bs / 100;
    const btFrac = Bt / 100;
    const atFrac = At / 100;

    const denom = bsFrac - btFrac - atFrac * (bsFrac - 1);
    let Mf_noWater = M0;
    if (denom > 0.0001) {
      const numer =
        bsFrac * M0 -
        currentSolidsKg -
        currentAcidKg * (bsFrac - 1);
      Mf_noWater = numer / denom;
    }

    const Mf = Math.max(M0, minMassForAcid, minMassForBrix, Mf_noWater);
    const addAcidKg = Math.max(0, Mf * atFrac - currentAcidKg);
    const neededExtraSolidsFromSugar = Math.max(
      0,
      Mf * btFrac - currentSolidsKg - addAcidKg
    );
    const addSugarKg = Math.max(0, neededExtraSolidsFromSugar / bsFrac);
    const addWaterKg = Math.max(0, Mf - M0 - addSugarKg - addAcidKg);

    const finalMass = M0 + addSugarKg + addAcidKg + addWaterKg;
    const finalBrix =
      ((currentSolidsKg + addSugarKg * bsFrac + addAcidKg) / finalMass) * 100;
    const finalAcid = ((currentAcidKg + addAcidKg) / finalMass) * 100;

    const brixStatus =
      Math.abs(B0 - Bt) < 0.05
        ? 'ON TARGET'
        : B0 < Bt
        ? `LOW BY ${(Bt - B0).toFixed(2)} °Brix`
        : `HIGH BY ${(B0 - Bt).toFixed(2)} °Brix (Dilution Required)`;

    const acidStatus =
      Math.abs(A0 - At) < 0.005
        ? 'ON TARGET'
        : A0 < At
        ? `LOW BY ${(At - A0).toFixed(3)}%`
        : `HIGH BY ${(A0 - At).toFixed(3)}% (Dilution Required)`;

    const phDiff = pH0 - pHt;
    const phStatus =
      Math.abs(phDiff) <= 0.05
        ? `ON TARGET (pH ${pH0.toFixed(2)})`
        : phDiff > 0
        ? `HIGH BY +${phDiff.toFixed(2)} pH (Citric Acid Addition Lowers pH to ~${pHt.toFixed(2)})`
        : `LOW BY ${phDiff.toFixed(2)} pH (Dilution / Sodium Citrate Buffer Needed)`;

    return {
      brixStatus,
      acidStatus,
      phStatus,
      currentRatio: A0 > 0 ? (B0 / A0).toFixed(1) : '—',
      targetRatio: At > 0 ? (Bt / At).toFixed(1) : '—',
      addSugarKg: Number(addSugarKg.toFixed(3)),
      addSugarGrams: Math.round(addSugarKg * 1000),
      addAcidKg: Number(addAcidKg.toFixed(3)),
      addAcidGrams: Math.round(addAcidKg * 1000),
      addWaterLiters: Number(addWaterKg.toFixed(2)),
      finalBatchKg: Number(finalMass.toFixed(2)),
      verifiedBrix: Number(finalBrix.toFixed(2)),
      verifiedAcid: Number(finalAcid.toFixed(3))
    };
  }, [
    bevBatchKg,
    bevCurrentBrix,
    bevTargetBrix,
    bevCurrentAcid,
    bevTargetAcid,
    bevCurrentPh,
    bevTargetPh,
    bevSugarSourceBrix
  ]);

  // =========================================================================
  // MODE 2: DAIRY MILK STANDARDIZATION (Current Milk Batch -> Target Fat % & SNF %)
  // =========================================================================
  const [dairyBatchKg, setDairyBatchKg] = useState<string>('1000');
  const [dairyCurrentFat, setDairyCurrentFat] = useState<string>('4.8');
  const [dairyTargetFat, setDairyTargetFat] = useState<string>('3.5');
  const [dairyCurrentSnf, setDairyCurrentSnf] = useState<string>('8.3');
  const [dairyTargetSnf, setDairyTargetSnf] = useState<string>('8.5');
  const [skimMilkFat, setSkimMilkFat] = useState<string>('0.1');
  const [skimMilkSnf, setSkimMilkSnf] = useState<string>('8.9');
  const [creamFat, setCreamFat] = useState<string>('40');

  const dairyCorrection = useMemo(() => {
    const M0 = Math.max(1, Number(dairyBatchKg) || 1000);
    const F0 = Math.max(0, Number(dairyCurrentFat) || 4.8);
    const Ft = Math.max(0.1, Number(dairyTargetFat) || 3.5);
    const S0 = Math.max(0, Number(dairyCurrentSnf) || 8.3);
    const St = Math.max(0.1, Number(dairyTargetSnf) || 8.5);
    const Fskim = Math.max(0, Number(skimMilkFat) || 0.1);
    const Sskim = Math.max(1, Number(skimMilkSnf) || 8.9);
    const Fcream = Math.max(Ft + 5, Number(creamFat) || 40);
    const Scream = (100 - Fcream) * 0.09;

    let addSkimKg = 0;
    let addCreamKg = 0;
    let addSmpKg = 0;
    let addWaterKg = 0;

    if (F0 > Ft && Ft > Fskim) {
      addSkimKg = M0 * ((F0 - Ft) / (Ft - Fskim));
    } else if (F0 < Ft && Fcream > Ft) {
      addCreamKg = M0 * ((Ft - F0) / (Fcream - Ft));
    }

    const intermediateMass = M0 + addSkimKg + addCreamKg;
    const currentSnfMass =
      M0 * (S0 / 100) +
      addSkimKg * (Sskim / 100) +
      addCreamKg * (Scream / 100);
    const currentSnfPct = (currentSnfMass / intermediateMass) * 100;

    if (currentSnfPct < St) {
      addSmpKg = (intermediateMass * (St - currentSnfPct)) / (96 - St);
    } else if (currentSnfPct > St + 0.15 && F0 > Ft) {
      addWaterKg = (intermediateMass * (currentSnfPct - St)) / St;
    }

    const finalMass = intermediateMass + addSmpKg + addWaterKg;

    return {
      addSkimKg: Number(addSkimKg.toFixed(2)),
      addCreamKg: Number(addCreamKg.toFixed(2)),
      addSmpKg: Number(addSmpKg.toFixed(2)),
      addWaterKg: Number(addWaterKg.toFixed(2)),
      finalMass: Number(finalMass.toFixed(2))
    };
  }, [
    dairyBatchKg,
    dairyCurrentFat,
    dairyTargetFat,
    dairyCurrentSnf,
    dairyTargetSnf,
    skimMilkFat,
    skimMilkSnf,
    creamFat
  ]);

  // =========================================================================
  // MODE 3: SAUCES, KETCHUP & MAYONNAISE STANDARDIZER
  //         (TSS/Brix or Oil Phase %, Acidity %, Salt NaCl %, pH & Vinegar)
  // =========================================================================
  const [sauceSubType, setSauceSubType] = useState<
    'ketchup_sauce' | 'mayo_emulsion'
  >('ketchup_sauce');
  const [sauceBatchKg, setSauceBatchKg] = useState<string>('500');
  const [sauceCurrentTssOrOil, setSauceCurrentTssOrOil] =
    useState<string>('25.5');
  const [sauceTargetTssOrOil, setSauceTargetTssOrOil] =
    useState<string>('29.0');
  const [sauceCurrentAcid, setSauceCurrentAcid] = useState<string>('0.95');
  const [sauceTargetAcid, setSauceTargetAcid] = useState<string>('1.25');
  const [sauceCurrentSalt, setSauceCurrentSalt] = useState<string>('1.70');
  const [sauceTargetSalt, setSauceTargetSalt] = useState<string>('2.10');
  const [sauceCurrentPh, setSauceCurrentPh] = useState<string>('4.12');
  const [sauceTargetPh, setSauceTargetPh] = useState<string>('3.75');
  const [sauceVinegarStrength, setSauceVinegarStrength] =
    useState<string>('10'); // 10% distilled vinegar or 100% glacial/citric

  const sauceMayoCorrection = useMemo(() => {
    const M0 = Math.max(1, Number(sauceBatchKg) || 500);
    const T0 = Math.max(0, Number(sauceCurrentTssOrOil) || 0);
    const Tt = Math.max(0.5, Number(sauceTargetTssOrOil) || 28);
    const A0 = Math.max(0, Number(sauceCurrentAcid) || 0);
    const At = Math.max(0.05, Number(sauceTargetAcid) || 1.2);
    const S0 = Math.max(0, Number(sauceCurrentSalt) || 0);
    const St = Math.max(0.05, Number(sauceTargetSalt) || 2.0);
    const pH0 = Math.max(1, Number(sauceCurrentPh) || 4.1);
    const pHt = Math.max(1, Number(sauceTargetPh) || 3.8);
    const vinPct = Math.max(2, Number(sauceVinegarStrength) || 10);

    const curSolidsOrOilKg = M0 * (T0 / 100);
    const curAcidKg = M0 * (A0 / 100);
    const curSaltKg = M0 * (S0 / 100);

    // Minimum final mass if any parameter is over-spec and requires dilution
    const minMassT = Tt > 0 ? curSolidsOrOilKg / (Tt / 100) : M0;
    const minMassA = At > 0 ? curAcidKg / (At / 100) : M0;
    const minMassS = St > 0 ? curSaltKg / (St / 100) : M0;

    // Estimate final batch mass Mf accounting for Vinegar water content
    const extraAcidNeededBase = Math.max(0, M0 * (At / 100) - curAcidKg);
    const vinegarEstKg = extraAcidNeededBase / (vinPct / 100);
    const solidsEstKg = Math.max(0, M0 * (Tt / 100) - curSolidsOrOilKg);
    const saltEstKg = Math.max(0, M0 * (St / 100) - curSaltKg);

    const Mf = Math.max(
      M0 + vinegarEstKg + solidsEstKg + saltEstKg,
      minMassT,
      minMassA,
      minMassS
    );

    const addPureAcidKg = Math.max(0, Mf * (At / 100) - curAcidKg);
    const addVinegarKg = addPureAcidKg / (vinPct / 100);
    const addSaltKg = Math.max(0, Mf * (St / 100) - curSaltKg);
    const addSolidsOrOilKg = Math.max(
      0,
      Mf * (Tt / 100) - curSolidsOrOilKg
    );
    const addWaterKg = Math.max(
      0,
      Mf - M0 - addVinegarKg - addSaltKg - addSolidsOrOilKg
    );
    const finalBatchKg =
      M0 + addSolidsOrOilKg + addVinegarKg + addSaltKg + addWaterKg;

    const phDiff = pH0 - pHt;
    const phStatus =
      Math.abs(phDiff) <= 0.05
        ? `SAFE ON TARGET (pH ${pH0.toFixed(2)})`
        : phDiff > 0
        ? `HIGH BY +${phDiff.toFixed(2)} pH (Vinegar/Acid Addition Drops pH to ${pHt.toFixed(2)})`
        : `LOW BY ${phDiff.toFixed(2)} pH (High Acidity / Dilute slightly)`;

    return {
      addSolidsOrOilKg: Number(addSolidsOrOilKg.toFixed(2)),
      addVinegarKg: Number(addVinegarKg.toFixed(2)),
      addSaltKg: Number(addSaltKg.toFixed(3)),
      addSaltGrams: Math.round(addSaltKg * 1000),
      addWaterKg: Number(addWaterKg.toFixed(2)),
      phStatus,
      finalBatchKg: Number(finalBatchKg.toFixed(2))
    };
  }, [
    sauceBatchKg,
    sauceCurrentTssOrOil,
    sauceTargetTssOrOil,
    sauceCurrentAcid,
    sauceTargetAcid,
    sauceCurrentSalt,
    sauceTargetSalt,
    sauceCurrentPh,
    sauceTargetPh,
    sauceVinegarStrength
  ]);

  // =========================================================================
  // MODE 4: BAKING, BISCUITS & DOUGH STANDARDIZER
  //         (Flour/Dough Moisture %, Protein/Gluten %, Shortening Fat % & Sugar %)
  // =========================================================================
  const [bakingBatchKg, setBakingBatchKg] = useState<string>('500');
  const [bakingCurrentMoisture, setBakingCurrentMoisture] =
    useState<string>('13.2');
  const [bakingTargetMoisture, setBakingTargetMoisture] =
    useState<string>('18.5');
  const [bakingCurrentProtein, setBakingCurrentProtein] =
    useState<string>('9.2');
  const [bakingTargetProtein, setBakingTargetProtein] =
    useState<string>('10.8');
  const [bakingCurrentFat, setBakingCurrentFat] = useState<string>('15.5');
  const [bakingTargetFat, setBakingTargetFat] = useState<string>('18.0');
  const [bakingCurrentSugar, setBakingCurrentSugar] = useState<string>('20.0');
  const [bakingTargetSugar, setBakingTargetSugar] = useState<string>('22.5');
  const [bakingGlutenSourcePct, setBakingGlutenSourcePct] =
    useState<string>('75'); // Vital Wheat Gluten (75% protein)

  const bakingCorrection = useMemo(() => {
    const M0 = Math.max(1, Number(bakingBatchKg) || 500);
    const W0 = Math.max(0, Number(bakingCurrentMoisture) || 13);
    const Wt = Math.max(1, Number(bakingTargetMoisture) || 18);
    const P0 = Math.max(0, Number(bakingCurrentProtein) || 9.2);
    const Pt = Math.max(1, Number(bakingTargetProtein) || 10.5);
    const F0 = Math.max(0, Number(bakingCurrentFat) || 15);
    const Ft = Math.max(0, Number(bakingTargetFat) || 18);
    const Sug0 = Math.max(0, Number(bakingCurrentSugar) || 20);
    const SugT = Math.max(0, Number(bakingTargetSugar) || 22);
    const Gsrc = Math.max(Pt + 5, Number(bakingGlutenSourcePct) || 75);

    // 1. Vital Wheat Gluten needed via Pearson Square on flour mass M0:
    const addGlutenKg =
      Pt > P0 ? M0 * ((Pt - P0) / (Gsrc - Pt)) : 0;

    // 2. Water needed to bring moisture from W0% to Wt%:
    const addWaterLiters =
      Wt > W0 && Wt < 95 ? M0 * ((Wt - W0) / (100 - Wt)) : 0;

    // 3. Shortening / Bakery Fat needed to raise Fat % from F0% to Ft%:
    const addShorteningFatKg =
      Ft > F0 && Ft < 95 ? M0 * ((Ft - F0) / (100 - Ft)) : 0;

    // 4. Sugar / Icing Sugar needed to raise Sugar % from Sug0% to SugT%:
    const addSugarKg =
      SugT > Sug0 && SugT < 95 ? M0 * ((SugT - Sug0) / (100 - SugT)) : 0;

    const finalDoughKg =
      M0 + addWaterLiters + addGlutenKg + addShorteningFatKg + addSugarKg;

    return {
      addWaterLiters: Number(addWaterLiters.toFixed(2)),
      addGlutenKg: Number(addGlutenKg.toFixed(2)),
      addGlutenGrams: Math.round(addGlutenKg * 1000),
      addShorteningFatKg: Number(addShorteningFatKg.toFixed(2)),
      addSugarKg: Number(addSugarKg.toFixed(2)),
      finalDoughKg: Number(finalDoughKg.toFixed(2))
    };
  }, [
    bakingBatchKg,
    bakingCurrentMoisture,
    bakingTargetMoisture,
    bakingCurrentProtein,
    bakingTargetProtein,
    bakingCurrentFat,
    bakingTargetFat,
    bakingCurrentSugar,
    bakingTargetSugar,
    bakingGlutenSourcePct
  ]);

  // =========================================================================
  // MODE 5: CLASSIC 2-INGREDIENT PEARSON SQUARE
  // =========================================================================
  const [psIngredientAName, setPsIngredientAName] = useState<string>(
    'High Concentration Stream (Ingredient A)'
  );
  const [psIngredientBName, setPsIngredientBName] = useState<string>(
    'Low Concentration / Diluent (Ingredient B)'
  );
  const [psHighVal, setPsHighVal] = useState<string>('65');
  const [psLowVal, setPsLowVal] = useState<string>('0');
  const [psTargetVal, setPsTargetVal] = useState<string>('12');
  const [psTotalBatch, setPsTotalBatch] = useState<string>('1000');

  const classicPearson = useMemo(() => {
    const H = Number(psHighVal) || 0;
    const L = Number(psLowVal) || 0;
    const T = Number(psTargetVal) || 0;
    const batch = Math.max(1, Number(psTotalBatch) || 100);

    const highParts = Math.abs(T - L);
    const lowParts = Math.abs(H - T);
    const totalParts = Math.max(0.0001, highParts + lowParts);

    const highAmount = (highParts / totalParts) * batch;
    const lowAmount = (lowParts / totalParts) * batch;
    const isValid = (T >= L && T <= H) || (T >= H && T <= L);

    return {
      isValid,
      highParts: Number(highParts.toFixed(2)),
      lowParts: Number(lowParts.toFixed(2)),
      highPct: Number(((highParts / totalParts) * 100).toFixed(2)),
      lowPct: Number(((lowParts / totalParts) * 100).toFixed(2)),
      highAmount: Number(highAmount.toFixed(2)),
      lowAmount: Number(lowAmount.toFixed(2))
    };
  }, [psHighVal, psLowVal, psTargetVal, psTotalBatch]);

  // Directory Search & Filter State
  const [dirSearchQuery, setDirSearchQuery] = useState<string>('');
  const [dirModeFilter, setDirModeFilter] = useState<
    'all' | PearsonCalculatorMode
  >('all');
  const [dirPeriodFilter, setDirPeriodFilter] = useState<
    'all' | 'today' | 'week' | 'month'
  >('all');

  const filteredBatchRecords = useMemo(() => {
    const now = Date.now();
    return savedBatchRecords.filter((rec) => {
      if (dirModeFilter !== 'all' && rec.calculatorMode !== dirModeFilter) {
        return false;
      }
      if (dirPeriodFilter !== 'all') {
        const recTime = new Date(rec.savedAtIso).getTime();
        if (!Number.isNaN(recTime)) {
          const diffDays = (now - recTime) / (1000 * 60 * 60 * 24);
          if (dirPeriodFilter === 'today' && diffDays > 1) return false;
          if (dirPeriodFilter === 'week' && diffDays > 7) return false;
          if (dirPeriodFilter === 'month' && diffDays > 31) return false;
        }
      }
      if (dirSearchQuery.trim()) {
        const q = dirSearchQuery.toLowerCase();
        const hay = [
          rec.recordCode,
          rec.productName,
          rec.industryCategory,
          rec.notes || '',
          rec.savedDateFormatted
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [savedBatchRecords, dirModeFilter, dirPeriodFilter, dirSearchQuery]);

  // Persist helper for pearsonBatchData
  const persistPearsonData = async (
    nextProducts: PearsonCustomProductItem[],
    nextRecords: PearsonBatchSavedRecord[]
  ) => {
    if (!toolsData || !onSaveToolsData) return;
    const updated: UserToolsData = {
      ...toolsData,
      pearsonBatchData: {
        customProducts: nextProducts,
        savedBatchRecords: nextRecords
      },
      updatedAt: new Date().toISOString()
    };
    await onSaveToolsData(updated);
  };

  // Save a custom product name to reusable product list
  const handleSaveCustomProduct = async () => {
    if (!canUsePremium) {
      onOpenPremiumModal?.();
      return;
    }
    const cleanName = newCustomProductName.trim();
    if (!cleanName) {
      showToast('Please enter a Product Name to add to your list.');
      return;
    }
    const activeCalcMode: PearsonCalculatorMode =
      industryMode === 'directory' ? 'beverage' : industryMode;
    const newItem: PearsonCustomProductItem = {
      id: `prod-${Date.now()}`,
      productName: cleanName,
      industryCategory: newCustomProductIndustry || selectedIndustry,
      calculatorMode: activeCalcMode,
      createdAt: new Date().toISOString()
    };
    const nextProducts = [newItem, ...customProducts];
    await persistPearsonData(nextProducts, savedBatchRecords);
    setSelectedIndustry(newItem.industryCategory);
    setProductName(cleanName);
    setNewCustomProductName('');
    setShowAddProductForm(false);
    showToast(`Added "${cleanName}" to your custom Product List!`);
  };

  const handleDeleteCustomProduct = async (id: string) => {
    const nextProducts = customProducts.filter((p) => p.id !== id);
    await persistPearsonData(nextProducts, savedBatchRecords);
    showToast('Removed custom product from your list.');
  };

  // Build a PearsonBatchSavedRecord from the active calculator mode
  const buildCurrentBatchRecord = (
    mode: PearsonCalculatorMode
  ): PearsonBatchSavedRecord => {
    const now = new Date();
    const formattedDate = now.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const prefix =
      mode === 'beverage'
        ? 'BATCH-BEV'
        : mode === 'dairy'
        ? 'BATCH-DRY'
        : mode === 'sauces_mayo'
        ? 'BATCH-SAU'
        : mode === 'baking_biscuits'
        ? 'BATCH-BAK'
        : 'BATCH-PRS';
    const recordCode = `${prefix}-${String(
      savedBatchRecords.length + 101
    ).padStart(4, '0')}`;
    const cleanProd =
      productName.trim() ||
      (mode === 'beverage'
        ? 'Beverage / Juice Batch'
        : mode === 'dairy'
        ? 'Standardized Milk Batch'
        : mode === 'sauces_mayo'
        ? 'Ketchup / Sauce / Mayonnaise Batch'
        : mode === 'baking_biscuits'
        ? 'Biscuit / Bakery Dough Batch'
        : 'Pearson Square Standardized Batch');

    if (mode === 'beverage') {
      return {
        id: `pbatch-${Date.now()}`,
        recordCode,
        calculatorMode: 'beverage',
        industryCategory: selectedIndustry,
        productName: cleanProd,
        notes: batchNotes.trim() || undefined,
        savedDateFormatted: formattedDate,
        savedAtIso: now.toISOString(),
        bevBatchKg: Number(bevBatchKg) || 500,
        bevCurrentBrix: Number(bevCurrentBrix) || 0,
        bevTargetBrix: Number(bevTargetBrix) || 0,
        bevCurrentAcid: Number(bevCurrentAcid) || 0,
        bevTargetAcid: Number(bevTargetAcid) || 0,
        bevCurrentPh: Number(bevCurrentPh) || 3.85,
        bevTargetPh: Number(bevTargetPh) || 3.5,
        bevSugarSourceBrix: Number(bevSugarSourceBrix) || 100,
        bevBrixStatus: beverageCorrection.brixStatus,
        bevAcidStatus: beverageCorrection.acidStatus,
        bevPhStatus: beverageCorrection.phStatus,
        bevCurrentRatio: beverageCorrection.currentRatio,
        bevTargetRatio: beverageCorrection.targetRatio,
        bevAddSugarKg: beverageCorrection.addSugarKg,
        bevAddSugarGrams: beverageCorrection.addSugarGrams,
        bevAddAcidKg: beverageCorrection.addAcidKg,
        bevAddAcidGrams: beverageCorrection.addAcidGrams,
        bevAddWaterLiters: beverageCorrection.addWaterLiters,
        bevFinalBatchKg: beverageCorrection.finalBatchKg,
        bevVerifiedBrix: beverageCorrection.verifiedBrix,
        bevVerifiedAcid: beverageCorrection.verifiedAcid
      };
    }

    if (mode === 'dairy') {
      return {
        id: `pbatch-${Date.now()}`,
        recordCode,
        calculatorMode: 'dairy',
        industryCategory: selectedIndustry,
        productName: cleanProd,
        notes: batchNotes.trim() || undefined,
        savedDateFormatted: formattedDate,
        savedAtIso: now.toISOString(),
        dairyBatchKg: Number(dairyBatchKg) || 1000,
        dairyCurrentFat: Number(dairyCurrentFat) || 0,
        dairyTargetFat: Number(dairyTargetFat) || 0,
        dairyCurrentSnf: Number(dairyCurrentSnf) || 0,
        dairyTargetSnf: Number(dairyTargetSnf) || 0,
        skimMilkFat: Number(skimMilkFat) || 0.1,
        skimMilkSnf: Number(skimMilkSnf) || 8.9,
        creamFat: Number(creamFat) || 40,
        dairyAddSkimKg: dairyCorrection.addSkimKg,
        dairyAddCreamKg: dairyCorrection.addCreamKg,
        dairyAddSmpKg: dairyCorrection.addSmpKg,
        dairyAddWaterKg: dairyCorrection.addWaterKg,
        dairyFinalMass: dairyCorrection.finalMass
      };
    }

    if (mode === 'sauces_mayo') {
      return {
        id: `pbatch-${Date.now()}`,
        recordCode,
        calculatorMode: 'sauces_mayo',
        industryCategory: selectedIndustry,
        productName: cleanProd,
        notes: batchNotes.trim() || undefined,
        savedDateFormatted: formattedDate,
        savedAtIso: now.toISOString(),
        sauceSubType,
        sauceBatchKg: Number(sauceBatchKg) || 500,
        sauceCurrentTssOrOil: Number(sauceCurrentTssOrOil) || 0,
        sauceTargetTssOrOil: Number(sauceTargetTssOrOil) || 0,
        sauceCurrentAcid: Number(sauceCurrentAcid) || 0,
        sauceTargetAcid: Number(sauceTargetAcid) || 0,
        sauceCurrentSalt: Number(sauceCurrentSalt) || 0,
        sauceTargetSalt: Number(sauceTargetSalt) || 0,
        sauceCurrentPh: Number(sauceCurrentPh) || 4.1,
        sauceTargetPh: Number(sauceTargetPh) || 3.75,
        sauceVinegarStrength: Number(sauceVinegarStrength) || 10,
        sauceAddSolidsOrOilKg: sauceMayoCorrection.addSolidsOrOilKg,
        sauceAddVinegarKg: sauceMayoCorrection.addVinegarKg,
        sauceAddSaltKg: sauceMayoCorrection.addSaltKg,
        sauceAddWaterKg: sauceMayoCorrection.addWaterKg,
        saucePhStatus: sauceMayoCorrection.phStatus,
        sauceFinalBatchKg: sauceMayoCorrection.finalBatchKg
      };
    }

    if (mode === 'baking_biscuits') {
      return {
        id: `pbatch-${Date.now()}`,
        recordCode,
        calculatorMode: 'baking_biscuits',
        industryCategory: selectedIndustry,
        productName: cleanProd,
        notes: batchNotes.trim() || undefined,
        savedDateFormatted: formattedDate,
        savedAtIso: now.toISOString(),
        bakingBatchKg: Number(bakingBatchKg) || 500,
        bakingCurrentMoisture: Number(bakingCurrentMoisture) || 13,
        bakingTargetMoisture: Number(bakingTargetMoisture) || 18,
        bakingCurrentProtein: Number(bakingCurrentProtein) || 9.2,
        bakingTargetProtein: Number(bakingTargetProtein) || 10.8,
        bakingCurrentFat: Number(bakingCurrentFat) || 15.5,
        bakingTargetFat: Number(bakingTargetFat) || 18,
        bakingCurrentSugar: Number(bakingCurrentSugar) || 20,
        bakingTargetSugar: Number(bakingTargetSugar) || 22.5,
        bakingGlutenSourcePct: Number(bakingGlutenSourcePct) || 75,
        bakingAddWaterLiters: bakingCorrection.addWaterLiters,
        bakingAddGlutenKg: bakingCorrection.addGlutenKg,
        bakingAddShorteningFatKg: bakingCorrection.addShorteningFatKg,
        bakingAddSugarKg: bakingCorrection.addSugarKg,
        bakingFinalDoughKg: bakingCorrection.finalDoughKg
      };
    }

    return {
      id: `pbatch-${Date.now()}`,
      recordCode,
      calculatorMode: 'classic',
      industryCategory: selectedIndustry,
      productName: cleanProd,
      notes: batchNotes.trim() || undefined,
      savedDateFormatted: formattedDate,
      savedAtIso: now.toISOString(),
      psIngredientAName: psIngredientAName.trim() || 'Ingredient A (High)',
      psIngredientBName: psIngredientBName.trim() || 'Ingredient B (Low)',
      psHighVal: Number(psHighVal) || 0,
      psLowVal: Number(psLowVal) || 0,
      psTargetVal: Number(psTargetVal) || 0,
      psTotalBatch: Number(psTotalBatch) || 100,
      psHighParts: classicPearson.highParts,
      psLowParts: classicPearson.lowParts,
      psHighPct: classicPearson.highPct,
      psLowPct: classicPearson.lowPct,
      psHighAmount: classicPearson.highAmount,
      psLowAmount: classicPearson.lowAmount
    };
  };

  const handleSaveBatchToDirectory = async (mode: PearsonCalculatorMode) => {
    if (!canUsePremium) {
      onOpenPremiumModal?.();
      return;
    }
    if (mode === 'classic' && !classicPearson.isValid) {
      showToast(
        'Target concentration must be between Ingredient A and Ingredient B before saving.'
      );
      return;
    }
    const newRecord = buildCurrentBatchRecord(mode);
    const nextRecords = [newRecord, ...savedBatchRecords];
    await persistPearsonData(customProducts, nextRecords);
    showToast(
      `Saved "${newRecord.productName}" (${newRecord.recordCode}) to Batch Directory!`
    );
  };

  const handleDeleteBatchRecord = async (id: string) => {
    const nextRecords = savedBatchRecords.filter((r) => r.id !== id);
    await persistPearsonData(customProducts, nextRecords);
    showToast('Batch record removed from directory.');
  };

  const handleReloadBatchRecord = (rec: PearsonBatchSavedRecord) => {
    setSelectedIndustry(rec.industryCategory || INDUSTRY_CATEGORIES[0].industry);
    setProductName(rec.productName || '');
    setBatchNotes(rec.notes || '');

    if (rec.calculatorMode === 'beverage') {
      setIndustryMode('beverage');
      setBevBatchKg(String(rec.bevBatchKg ?? 500));
      setBevCurrentBrix(String(rec.bevCurrentBrix ?? 10.2));
      setBevTargetBrix(String(rec.bevTargetBrix ?? 13.0));
      setBevCurrentAcid(String(rec.bevCurrentAcid ?? 0.18));
      setBevTargetAcid(String(rec.bevTargetAcid ?? 0.28));
      setBevCurrentPh(String(rec.bevCurrentPh ?? 3.85));
      setBevTargetPh(String(rec.bevTargetPh ?? 3.5));
      setBevSugarSourceBrix(String(rec.bevSugarSourceBrix ?? 100));
    } else if (rec.calculatorMode === 'dairy') {
      setIndustryMode('dairy');
      setDairyBatchKg(String(rec.dairyBatchKg ?? 1000));
      setDairyCurrentFat(String(rec.dairyCurrentFat ?? 4.8));
      setDairyTargetFat(String(rec.dairyTargetFat ?? 3.5));
      setDairyCurrentSnf(String(rec.dairyCurrentSnf ?? 8.3));
      setDairyTargetSnf(String(rec.dairyTargetSnf ?? 8.5));
      setSkimMilkFat(String(rec.skimMilkFat ?? 0.1));
      setSkimMilkSnf(String(rec.skimMilkSnf ?? 8.9));
      setCreamFat(String(rec.creamFat ?? 40));
    } else if (rec.calculatorMode === 'sauces_mayo') {
      setIndustryMode('sauces_mayo');
      setSauceSubType(rec.sauceSubType || 'ketchup_sauce');
      setSauceBatchKg(String(rec.sauceBatchKg ?? 500));
      setSauceCurrentTssOrOil(String(rec.sauceCurrentTssOrOil ?? 25.5));
      setSauceTargetTssOrOil(String(rec.sauceTargetTssOrOil ?? 29.0));
      setSauceCurrentAcid(String(rec.sauceCurrentAcid ?? 0.95));
      setSauceTargetAcid(String(rec.sauceTargetAcid ?? 1.25));
      setSauceCurrentSalt(String(rec.sauceCurrentSalt ?? 1.7));
      setSauceTargetSalt(String(rec.sauceTargetSalt ?? 2.1));
      setSauceCurrentPh(String(rec.sauceCurrentPh ?? 4.12));
      setSauceTargetPh(String(rec.sauceTargetPh ?? 3.75));
      setSauceVinegarStrength(String(rec.sauceVinegarStrength ?? 10));
    } else if (rec.calculatorMode === 'baking_biscuits') {
      setIndustryMode('baking_biscuits');
      setBakingBatchKg(String(rec.bakingBatchKg ?? 500));
      setBakingCurrentMoisture(String(rec.bakingCurrentMoisture ?? 13.2));
      setBakingTargetMoisture(String(rec.bakingTargetMoisture ?? 18.5));
      setBakingCurrentProtein(String(rec.bakingCurrentProtein ?? 9.2));
      setBakingTargetProtein(String(rec.bakingTargetProtein ?? 10.8));
      setBakingCurrentFat(String(rec.bakingCurrentFat ?? 15.5));
      setBakingTargetFat(String(rec.bakingTargetFat ?? 18.0));
      setBakingCurrentSugar(String(rec.bakingCurrentSugar ?? 20.0));
      setBakingTargetSugar(String(rec.bakingTargetSugar ?? 22.5));
      setBakingGlutenSourcePct(String(rec.bakingGlutenSourcePct ?? 75));
    } else {
      setIndustryMode('classic');
      setPsIngredientAName(rec.psIngredientAName || 'Ingredient A (High)');
      setPsIngredientBName(rec.psIngredientBName || 'Ingredient B (Low)');
      setPsHighVal(String(rec.psHighVal ?? 65));
      setPsLowVal(String(rec.psLowVal ?? 0));
      setPsTargetVal(String(rec.psTargetVal ?? 12));
      setPsTotalBatch(String(rec.psTotalBatch ?? 1000));
    }
    showToast(
      `Reloaded batch ${rec.recordCode} (${rec.productName}) into calculator.`
    );
  };

  // Generate Single Batch Standardization PDF Report
  const handleDownloadSingleBatchPdf = (rec: PearsonBatchSavedRecord) => {
    if (!canUsePremium) {
      onOpenPremiumModal?.();
      return;
    }

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const specialistName = (user?.name || 'Food Safety & QA Specialist').trim();
    const specialistRole = (
      user?.currentRole ||
      user?.qualification ||
      'Quality Assurance & Production Specialist'
    ).trim();

    // Header Banner
    pdf.setFillColor(26, 33, 56);
    pdf.rect(0, 0, 210, 42, 'F');
    pdf.setFillColor(22, 115, 184);
    pdf.rect(0, 39, 210, 3, 'F');

    drawPdfBrandLogo(pdf, 14, 8, 25, {
      borderColor: [255, 255, 255],
      bgFill: [255, 255, 255],
      roundedRadius: 4
    });

    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Food Science Portal — Batch Standardization Report', 44, 17);

    const modeTitle =
      rec.calculatorMode === 'beverage'
        ? 'JUICE & BEVERAGE BATCH CORRECTION CERTIFICATE'
        : rec.calculatorMode === 'dairy'
        ? 'DAIRY FAT & SNF STANDARDIZATION CERTIFICATE'
        : rec.calculatorMode === 'sauces_mayo'
        ? 'KETCHUP, SAUCES & MAYONNAISE BATCH CERTIFICATE'
        : rec.calculatorMode === 'baking_biscuits'
        ? 'BAKING, BISCUITS & DOUGH STANDARDIZATION CERTIFICATE'
        : 'PEARSON SQUARE MASS BALANCE CERTIFICATE';
    pdf.setFontSize(13);
    pdf.text(modeTitle, 44, 25.5);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(220, 233, 246);
    pdf.text(
      `Record ID: ${rec.recordCode}   •   Date & Time: ${rec.savedDateFormatted}`,
      44,
      33.5
    );

    drawPdfUserPhoto(pdf, user?.profilePicUrl, specialistName, 172, 8, 24, {
      borderColor: [255, 255, 255],
      fallbackBgColor: [22, 115, 184],
      fallbackTextColor: [255, 255, 255]
    });

    // Metadata Card (Specialist + Industry + Product Name)
    pdf.setFillColor(240, 246, 252);
    pdf.setDrawColor(210, 222, 234);
    pdf.roundedRect(14, 49, 182, 25, 3, 3, 'FD');

    pdf.setTextColor(26, 33, 56);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10.5);
    pdf.text(`Product Name: ${rec.productName}`, 19, 58);
    pdf.text(`Industry Sector: ${rec.industryCategory}`, 19, 66.5);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(74, 85, 104);
    pdf.text(`Prepared By: ${specialistName} (${specialistRole})`, 112, 58);

    let y = 82;

    const renderSpecTableAndBox = (
      title1: string,
      rows: [string, string][],
      title2: string,
      bullets: string[],
      summaryLine: string
    ) => {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(22, 115, 184);
      pdf.text(title1, 14, y);
      y += 5.5;

      rows.forEach(([label, val], idx) => {
        pdf.setFillColor(
          idx % 2 === 0 ? 248 : 255,
          idx % 2 === 0 ? 250 : 255,
          idx % 2 === 0 ? 252 : 255
        );
        pdf.setDrawColor(210, 222, 234);
        pdf.rect(14, y, 182, 9, 'FD');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9.2);
        pdf.setTextColor(26, 33, 56);
        pdf.text(label, 18, y + 6);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(22, 115, 184);
        pdf.text(String(val), 96, y + 6);
        y += 9;
      });

      y += 7;
      const boxH = 16 + bullets.length * 7.5;
      pdf.setFillColor(26, 33, 56);
      pdf.roundedRect(14, y, 182, boxH, 3, 3, 'F');
      pdf.setTextColor(125, 211, 252);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10.2);
      pdf.text(title2, 19, y + 8.5);

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10.5);
      bullets.forEach((b, i) => {
        pdf.text(b, 19, y + 16.5 + i * 7.2);
      });

      pdf.setTextColor(253, 224, 71);
      pdf.setFontSize(9.8);
      pdf.text(summaryLine, 19, y + boxH - 4);
      y += boxH + 8;
    };

    if (rec.calculatorMode === 'beverage') {
      renderSpecTableAndBox(
        '1. INITIAL JUICE / BEVERAGE BATCH VS. TARGET SPECIFICATION',
        [
          ['Current Batch Size (Before Adjustment)', `${rec.bevBatchKg} L / kg`],
          [
            'Current °Brix vs. Target °Brix',
            `${rec.bevCurrentBrix} °Brix  -->  Target: ${rec.bevTargetBrix} °Brix (${rec.bevBrixStatus})`
          ],
          [
            'Current Acidity (%) vs. Target Acidity (%)',
            `${rec.bevCurrentAcid}%  -->  Target: ${rec.bevTargetAcid}% (${rec.bevAcidStatus})`
          ],
          [
            'Current pH vs. Target pH',
            `pH ${rec.bevCurrentPh ?? 3.85}  -->  Target pH: ${rec.bevTargetPh ?? 3.5} (${rec.bevPhStatus || 'Checked'})`
          ],
          [
            'Brix : Acid Ratio (Current vs. Target)',
            `Current ${rec.bevCurrentRatio} : 1   |   Target ${rec.bevTargetRatio} : 1`
          ]
        ],
        `2. EXACT BATCH CORRECTION ADDITIONS (FOR ${rec.bevBatchKg} L/kg BATCH)`,
        [
          `• Add Sugar / Syrup (${rec.bevSugarSourceBrix}°Bx):  + ${rec.bevAddSugarKg} kg  (${(rec.bevAddSugarGrams || 0).toLocaleString()} grams)`,
          `• Add Citric Acid (Anhydrous):  + ${rec.bevAddAcidKg} kg  (${(rec.bevAddAcidGrams || 0).toLocaleString()} grams)`,
          `• Add Treated Water:  + ${rec.bevAddWaterLiters} Liters`
        ],
        `Final Standardized Batch: ${rec.bevFinalBatchKg} L/kg (Verified: ${rec.bevVerifiedBrix}°Bx, ${rec.bevVerifiedAcid}% Acid, Target pH ${rec.bevTargetPh ?? 3.5})`
      );
    } else if (rec.calculatorMode === 'dairy') {
      renderSpecTableAndBox(
        '1. RAW MILK BATCH ANALYSIS VS. TARGET STANDARDIZATION SPEC',
        [
          ['Initial Raw Milk Batch Mass', `${rec.dairyBatchKg} kg / L`],
          [
            'Milk Fat (%) — Current vs. Required Target',
            `Current: ${rec.dairyCurrentFat}% Fat   -->   Target: ${rec.dairyTargetFat}% Fat`
          ],
          [
            'Milk SNF (%) — Current vs. Required Target',
            `Current: ${rec.dairyCurrentSnf}% SNF   -->   Target: ${rec.dairyTargetSnf}% SNF`
          ],
          [
            'Available Skim Milk & Cream Specs',
            `Skim: ${rec.skimMilkFat}% Fat, ${rec.skimMilkSnf}% SNF  |  Cream: ${rec.creamFat}% Fat`
          ]
        ],
        `2. DAIRY STANDARDIZATION PRESCRIPTION (${rec.dairyTargetFat}% FAT & ${rec.dairyTargetSnf}% SNF)`,
        [
          `• Add Skim Milk (${rec.skimMilkFat}% Fat / ${rec.skimMilkSnf}% SNF):  + ${rec.dairyAddSkimKg} kg`,
          `• Add Fresh Cream (${rec.creamFat}% Fat):  + ${rec.dairyAddCreamKg} kg`,
          `• Add Skim Milk Powder (SMP 96% SNF):  + ${rec.dairyAddSmpKg} kg   |   Water: + ${rec.dairyAddWaterKg} kg`
        ],
        `Final Standardized Milk Yield: ${rec.dairyFinalMass} kg`
      );
    } else if (rec.calculatorMode === 'sauces_mayo') {
      const isMayo = rec.sauceSubType === 'mayo_emulsion';
      renderSpecTableAndBox(
        `1. ${isMayo ? 'MAYONNAISE / DRESSING' : 'KETCHUP / SAUCE'} BATCH ANALYSIS VS. TARGET SPEC`,
        [
          ['Current Batch Weight', `${rec.sauceBatchKg} kg`],
          [
            isMayo
              ? 'Oil / Fat Phase (%) — Current vs. Target'
              : 'Total Soluble Solids (°Brix) — Current vs. Target',
            `Current: ${rec.sauceCurrentTssOrOil}%   -->   Target: ${rec.sauceTargetTssOrOil}%`
          ],
          [
            'Acidity (% Acetic) — Current vs. Target',
            `Current: ${rec.sauceCurrentAcid}%   -->   Target: ${rec.sauceTargetAcid}%`
          ],
          [
            'Salt (% NaCl) — Current vs. Target',
            `Current: ${rec.sauceCurrentSalt}%   -->   Target: ${rec.sauceTargetSalt}%`
          ],
          [
            'pH — Current vs. Required Target pH',
            `Current pH: ${rec.sauceCurrentPh}   -->   Target pH: ${rec.sauceTargetPh} (${rec.saucePhStatus})`
          ]
        ],
        `2. EXACT ${isMayo ? 'MAYONNAISE' : 'KETCHUP / SAUCE'} STANDARDIZATION ADDITIONS`,
        [
          `• Add ${isMayo ? 'Vegetable Oil Phase' : 'Sugar / Paste Solids'}:  + ${rec.sauceAddSolidsOrOilKg} kg`,
          `• Add Vinegar / Acidulant (${rec.sauceVinegarStrength}% Strength):  + ${rec.sauceAddVinegarKg} kg`,
          `• Add Refined Food-Grade Salt (NaCl):  + ${rec.sauceAddSaltKg} kg`,
          `• Add Treated Water:  + ${rec.sauceAddWaterKg} kg`
        ],
        `Final Standardized Batch Weight: ${rec.sauceFinalBatchKg} kg (Target pH ${rec.sauceTargetPh})`
      );
    } else if (rec.calculatorMode === 'baking_biscuits') {
      renderSpecTableAndBox(
        '1. BAKING / BISCUIT DOUGH & FLOUR BATCH VS. TARGET SPEC',
        [
          ['Current Flour / Dough Batch Weight', `${rec.bakingBatchKg} kg`],
          [
            'Moisture / Dough Hydration (%) — Current vs. Target',
            `Current: ${rec.bakingCurrentMoisture}%   -->   Target: ${rec.bakingTargetMoisture}%`
          ],
          [
            'Flour Protein / Gluten (%) — Current vs. Target',
            `Current: ${rec.bakingCurrentProtein}%   -->   Target: ${rec.bakingTargetProtein}%`
          ],
          [
            'Shortening / Bakery Fat (%) — Current vs. Target',
            `Current: ${rec.bakingCurrentFat}%   -->   Target: ${rec.bakingTargetFat}%`
          ],
          [
            'Sugar (%) — Current vs. Target',
            `Current: ${rec.bakingCurrentSugar}%   -->   Target: ${rec.bakingTargetSugar}%`
          ]
        ],
        `2. EXACT BAKING / BISCUIT DOUGH CORRECTION ADDITIONS`,
        [
          `• Add Hydration Water:  + ${rec.bakingAddWaterLiters} Liters (kg)`,
          `• Add Vital Wheat Gluten (${rec.bakingGlutenSourcePct}% Protein):  + ${rec.bakingAddGlutenKg} kg`,
          `• Add Bakery Shortening / Fat:  + ${rec.bakingAddShorteningFatKg} kg`,
          `• Add Sugar / Icing Sugar:  + ${rec.bakingAddSugarKg} kg`
        ],
        `Final Standardized Dough / Biscuit Batch: ${rec.bakingFinalDoughKg} kg`
      );
    } else {
      renderSpecTableAndBox(
        '1. CLASSIC PEARSON SQUARE 2-STREAM INPUT PARAMETERS',
        [
          [
            `${rec.psIngredientAName || 'Ingredient A (High Stream)'} Concentration`,
            `${rec.psHighVal}%`
          ],
          [
            `${rec.psIngredientBName || 'Ingredient B (Low Stream)'} Concentration`,
            `${rec.psLowVal}%`
          ],
          ['Desired Target Concentration (%)', `${rec.psTargetVal}%`],
          ['Total Required Target Batch Size', `${rec.psTotalBatch} kg / L`]
        ],
        `2. EXACT PEARSON SQUARE BLENDING QUANTITIES (FOR ${rec.psTotalBatch} kg/L)`,
        [
          `• ${rec.psIngredientAName || 'Ingredient A'} (${rec.psHighVal}%):  ${rec.psHighAmount} kg/L  (${rec.psHighParts} parts / ${rec.psHighPct}%)`,
          `• ${rec.psIngredientBName || 'Ingredient B'} (${rec.psLowVal}%):  ${rec.psLowAmount} kg/L  (${rec.psLowParts} parts / ${rec.psLowPct}%)`
        ],
        `Total Standardized Blend: ${rec.psTotalBatch} kg/L @ ${rec.psTargetVal}%`
      );
    }

    if (rec.notes) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(26, 33, 56);
      pdf.text('QA / Production Batch Adjustment Notes:', 14, y);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      pdf.setTextColor(74, 85, 104);
      const splitNotes = pdf.splitTextToSize(rec.notes, 180);
      pdf.text(splitNotes, 14, y + 6);
    }

    // Footer
    pdf.setDrawColor(210, 222, 234);
    pdf.line(14, 277, 196, 277);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.setTextColor(90, 108, 132);
    pdf.text(
      'Food Science Portal — Official Industrial Batch Standardization & Mass Balance Record',
      14,
      283
    );

    pdf.save(
      `${rec.recordCode}_${rec.productName.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`
    );
    showToast(`Downloaded PDF report for ${rec.productName}!`);
  };

  // Download Full Directory Logbook PDF (All Filtered Batch Records)
  const handleDownloadDirectoryLogbookPdf = () => {
    if (!canUsePremium) {
      onOpenPremiumModal?.();
      return;
    }
    if (filteredBatchRecords.length === 0) {
      showToast('No saved batch records to export.');
      return;
    }
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const specialistName = (user?.name || 'Food Safety & QA Specialist').trim();

    pdf.setFillColor(26, 33, 56);
    pdf.rect(0, 0, 210, 42, 'F');
    drawPdfBrandLogo(pdf, 14, 8, 25, {
      borderColor: [255, 255, 255],
      bgFill: [255, 255, 255],
      roundedRadius: 4
    });

    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Food Science Portal — Batch Standardization Logbook', 44, 17);
    pdf.setFontSize(15);
    pdf.text('SAVED BATCH STANDARDIZATION DIRECTORY REPORT', 44, 26);
    pdf.setFontSize(9.5);
    pdf.setTextColor(220, 233, 246);
    pdf.text(
      `Specialist: ${specialistName}   •   Total Saved Batches: ${filteredBatchRecords.length}`,
      44,
      34
    );

    drawPdfUserPhoto(pdf, user?.profilePicUrl, specialistName, 172, 8, 24, {
      borderColor: [255, 255, 255],
      fallbackBgColor: [22, 115, 184],
      fallbackTextColor: [255, 255, 255]
    });

    let y = 50;
    filteredBatchRecords.forEach((rec, idx) => {
      if (y > 250) {
        pdf.addPage();
        y = 20;
      }
      pdf.setFillColor(
        idx % 2 === 0 ? 248 : 240,
        idx % 2 === 0 ? 250 : 246,
        252
      );
      pdf.setDrawColor(210, 222, 234);
      pdf.roundedRect(14, y, 182, 28, 2.5, 2.5, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(26, 33, 56);
      pdf.text(
        `${idx + 1}. [${rec.recordCode}] ${rec.productName} — ${rec.industryCategory} (${rec.savedDateFormatted})`,
        18,
        y + 7
      );

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.6);
      pdf.setTextColor(22, 115, 184);
      if (rec.calculatorMode === 'beverage') {
        pdf.text(
          `Beverage (${rec.bevBatchKg} L/kg): Brix ${rec.bevCurrentBrix}°->${rec.bevTargetBrix}° | Acid ${rec.bevCurrentAcid}%->${rec.bevTargetAcid}% | pH ${rec.bevCurrentPh ?? 3.85}->${rec.bevTargetPh ?? 3.5}`,
          18,
          y + 14
        );
        pdf.setTextColor(26, 33, 56);
        pdf.text(
          `Prescription: +${rec.bevAddSugarKg} kg Sugar, +${rec.bevAddAcidKg} kg Citric Acid, +${rec.bevAddWaterLiters} L Water => Final: ${rec.bevFinalBatchKg} kg`,
          18,
          y + 20.5
        );
      } else if (rec.calculatorMode === 'dairy') {
        pdf.text(
          `Dairy (${rec.dairyBatchKg} kg): Fat ${rec.dairyCurrentFat}%->${rec.dairyTargetFat}% | SNF ${rec.dairyCurrentSnf}%->${rec.dairyTargetSnf}%`,
          18,
          y + 14
        );
        pdf.setTextColor(26, 33, 56);
        pdf.text(
          `Prescription: +${rec.dairyAddSkimKg} kg Skim, +${rec.dairyAddCreamKg} kg Cream, +${rec.dairyAddSmpKg} kg SMP, +${rec.dairyAddWaterKg} kg Water => Final: ${rec.dairyFinalMass} kg`,
          18,
          y + 20.5
        );
      } else if (rec.calculatorMode === 'sauces_mayo') {
        pdf.text(
          `Ketchup/Mayo (${rec.sauceBatchKg} kg): TSS/Oil ${rec.sauceCurrentTssOrOil}%->${rec.sauceTargetTssOrOil}% | Acid ${rec.sauceCurrentAcid}%->${rec.sauceTargetAcid}% | Salt ${rec.sauceCurrentSalt}%->${rec.sauceTargetSalt}% | pH ${rec.sauceCurrentPh}->${rec.sauceTargetPh}`,
          18,
          y + 14
        );
        pdf.setTextColor(26, 33, 56);
        pdf.text(
          `Prescription: +${rec.sauceAddSolidsOrOilKg} kg Solids/Oil, +${rec.sauceAddVinegarKg} kg Vinegar, +${rec.sauceAddSaltKg} kg Salt, +${rec.sauceAddWaterKg} kg Water => Final: ${rec.sauceFinalBatchKg} kg`,
          18,
          y + 20.5
        );
      } else if (rec.calculatorMode === 'baking_biscuits') {
        pdf.text(
          `Baking/Biscuit (${rec.bakingBatchKg} kg): Moisture ${rec.bakingCurrentMoisture}%->${rec.bakingTargetMoisture}% | Protein ${rec.bakingCurrentProtein}%->${rec.bakingTargetProtein}% | Fat ${rec.bakingCurrentFat}%->${rec.bakingTargetFat}% | Sugar ${rec.bakingCurrentSugar}%->${rec.bakingTargetSugar}%`,
          18,
          y + 14
        );
        pdf.setTextColor(26, 33, 56);
        pdf.text(
          `Prescription: +${rec.bakingAddWaterLiters} L Water, +${rec.bakingAddGlutenKg} kg Gluten, +${rec.bakingAddShorteningFatKg} kg Fat, +${rec.bakingAddSugarKg} kg Sugar => Final: ${rec.bakingFinalDoughKg} kg`,
          18,
          y + 20.5
        );
      } else {
        pdf.text(
          `Classic Pearson (${rec.psTotalBatch} kg/L @ Target ${rec.psTargetVal}%): ${rec.psIngredientAName} (${rec.psHighVal}%) + ${rec.psIngredientBName} (${rec.psLowVal}%)`,
          18,
          y + 14
        );
        pdf.setTextColor(26, 33, 56);
        pdf.text(
          `Prescription: ${rec.psIngredientAName}: ${rec.psHighAmount} kg/L (${rec.psHighPct}%)  |  ${rec.psIngredientBName}: ${rec.psLowAmount} kg/L (${rec.psLowPct}%)`,
          18,
          y + 20.5
        );
      }

      if (rec.notes) {
        pdf.setTextColor(90, 108, 132);
        pdf.text(`Notes: ${rec.notes.slice(0, 85)}`, 18, y + 26);
      }
      y += 32;
    });

    pdf.save(`Batch_Standardization_Directory_Logbook_${Date.now()}.pdf`);
    showToast('Downloaded Complete Batch Standardization Logbook PDF!');
  };

  return (
    <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 sm:p-6 shadow-xs space-y-5">
      {/* Toast Notification */}
      {statusToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#1A2138] text-white text-xs font-extrabold shadow-lg flex items-center gap-2 border border-[#1673B8]/40">
          <Check className="w-4 h-4 text-[#60A5FA] shrink-0" />
          <span>{statusToast}</span>
        </div>
      )}

      {/* Header & Industry Calculator Tabs */}
      <div className="border-b border-[#D2DEEA] pb-3.5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#1A2138] text-white flex items-center justify-center shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
                  Pearson Square &amp; Batch Standardization Calculator
                </h2>
                <span className="text-[11px] font-extrabold text-[#1673B8]">
                  {canUsePremium
                    ? '· Paid Pro Mode (Industry Batch Logbook & PDF Active)'
                    : '· Free Standard Calculator'}
                </span>
              </div>
              <p className="text-xs text-[#4A5568] font-medium">
                Industry-Specific Batch Standardization: Juice &amp; Beverage
                (Brix, Acidity, pH), Dairy (Fat &amp; SNF), Sauces/Ketchup/Mayo,
                Baking/Biscuits &amp; Classic Pearson
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-[#F0F6FC] p-1.5 rounded-xl border border-[#D2DEEA]">
          {[
            {
              id: 'beverage' as const,
              label: 'Juice & Beverage (Brix, Acid & pH)'
            },
            { id: 'dairy' as const, label: 'Dairy Fat & SNF Standardizer' },
            {
              id: 'sauces_mayo' as const,
              label: 'Ketchup, Sauces & Mayonnaise'
            },
            {
              id: 'baking_biscuits' as const,
              label: 'Baking, Biscuits & Dough'
            },
            { id: 'classic' as const, label: 'Classic Pearson Square' },
            ...(canUsePremium
              ? [
                  {
                    id: 'directory' as const,
                    label: `Saved Batch Directory (${savedBatchRecords.length})`
                  }
                ]
              : [])
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setIndustryMode(m.id);
                if (m.id !== 'directory') {
                  const matchedCat = INDUSTRY_CATEGORIES.find(
                    (c) => c.defaultMode === m.id
                  );
                  if (matchedCat) {
                    setSelectedIndustry(matchedCat.industry);
                  }
                }
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                industryMode === m.id
                  ? 'bg-[#1673B8] text-white shadow-2xs'
                  : 'text-[#1A2138] hover:bg-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================================
          PAID MEMBER INDUSTRY & PRODUCT IDENTIFICATION HEADER
          (No Quick-Select Chips, No Batch/Tank Lot No — Clean Industry + Product Input)
         ===================================================================== */}
      {canUsePremium && industryMode !== 'directory' && (
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#94B8D7] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-xs font-extrabold text-[#1673B8]">
                Step 1: Select Industry &amp; Enter Product Name for Batch Record
              </div>
              <p className="text-[11px] text-[#5A6C84]">
                Selecting an industry automatically loads its specification
                parameters below. Enter your Product Name to save and download
                your batch standardization record.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setNewCustomProductIndustry(selectedIndustry);
                setShowAddProductForm((prev) => !prev);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>
                {showAddProductForm
                  ? 'Close Product Form'
                  : '+ Add Custom Product to List'}
              </span>
            </button>
          </div>

          {showAddProductForm && (
            <div className="p-3.5 rounded-xl bg-white border border-[#1673B8]/40 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-4">
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Industry Sector
                </label>
                <select
                  value={newCustomProductIndustry}
                  onChange={(e) => setNewCustomProductIndustry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                >
                  {INDUSTRY_CATEGORIES.map((c) => (
                    <option key={c.industry} value={c.industry}>
                      {c.industry}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-5">
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  New Custom Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mango Nectar / Standardized Milk / Garlic Mayo / Marie Biscuit"
                  value={newCustomProductName}
                  onChange={(e) => setNewCustomProductName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div className="sm:col-span-3">
                <button
                  type="button"
                  onClick={handleSaveCustomProduct}
                  className="w-full py-2 px-4 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold cursor-pointer"
                >
                  Save Product to List ✓
                </button>
              </div>
            </div>
          )}

          {/* Industry Sector + Product Name + Optional QA Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                Your Industry Sector
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => {
                  const nextInd = e.target.value;
                  setSelectedIndustry(nextInd);
                  const found = INDUSTRY_CATEGORIES.find(
                    (c) => c.industry === nextInd
                  );
                  if (found) {
                    setIndustryMode(found.defaultMode);
                    setProductName(found.defaultProduct);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              >
                {INDUSTRY_CATEGORIES.map((c) => (
                  <option key={c.industry} value={c.industry}>
                    {c.industry}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter Product Name (e.g., Mango Nectar, Tomato Ketchup, Biscuit Dough)"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#1673B8] text-xs font-bold text-[#1A2138]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                QA / Production Notes (Optional)
              </label>
              <input
                type="text"
                value={batchNotes}
                onChange={(e) => setBatchNotes(e.target.value)}
                placeholder="e.g., Adjusted before pasteurization / baking"
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              />
            </div>
          </div>

          {customProducts.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#E4EDF7] text-[11px]">
              <span className="font-extrabold text-[#1673B8]">
                Your Saved Custom Products:
              </span>
              {customProducts.map((cp) => (
                <span
                  key={cp.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white border border-[#D2DEEA] text-[#1A2138] font-bold"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIndustry(cp.industryCategory);
                      setIndustryMode(cp.calculatorMode);
                      setProductName(cp.productName);
                    }}
                    className="hover:text-[#1673B8] cursor-pointer"
                  >
                    ★ {cp.productName}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCustomProduct(cp.id)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                    title="Delete custom product"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          MODE 1: JUICE & BEVERAGE BATCH CORRECTOR (Batch Size, Brix, Acidity & pH)
         ===================================================================== */}
      {industryMode === 'beverage' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box A: Current Out-of-Spec Batch Details */}
            <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
              <div className="text-xs font-extrabold text-[#1A2138] uppercase tracking-wider border-b border-[#D2DEEA] pb-2">
                1. Current Batch / Lab Sample Details (Out-of-Spec)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Current Batch Size (L / kg)
                  </label>
                  <input
                    type="number"
                    value={bevBatchKg}
                    onChange={(e) => setBevBatchKg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Current °Brix (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bevCurrentBrix}
                    onChange={(e) => setBevCurrentBrix(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Current Acidity (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={bevCurrentAcid}
                    onChange={(e) => setBevCurrentAcid(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Current pH
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={bevCurrentPh}
                    onChange={(e) => setBevCurrentPh(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
              </div>
              <div className="text-[11px] font-bold text-[#4A5568] flex flex-wrap items-center justify-between gap-2">
                <span>
                  Current Brix:Acid Ratio:{' '}
                  <strong className="text-[#1A2138]">
                    {beverageCorrection.currentRatio} : 1
                  </strong>
                </span>
                <span>
                  Current Sample pH:{' '}
                  <strong className="text-[#1673B8]">{bevCurrentPh}</strong>
                </span>
              </div>
            </div>

            {/* Box B: Required Target Product Specification */}
            <div className="p-4 rounded-2xl bg-[#EBF4FC] border border-[#1673B8]/40 space-y-3">
              <div className="text-xs font-extrabold text-[#105E9A] uppercase tracking-wider border-b border-[#D2DEEA] pb-2">
                2. Required Target Product Specification
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Target °Brix (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bevTargetBrix}
                    onChange={(e) => setBevTargetBrix(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Target Acidity (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={bevTargetAcid}
                    onChange={(e) => setBevTargetAcid(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Target pH
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={bevTargetPh}
                    onChange={(e) => setBevTargetPh(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Sugar / Syrup °Brix
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={bevSugarSourceBrix}
                    onChange={(e) => setBevSugarSourceBrix(e.target.value)}
                    title="100 for crystalline sugar, or e.g. 65 for sugar syrup"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
              </div>
              <div className="text-[11px] font-bold text-[#105E9A] flex flex-wrap items-center justify-between gap-2">
                <span>
                  Target Brix:Acid Ratio:{' '}
                  <strong>{beverageCorrection.targetRatio} : 1</strong>
                </span>
                <span>Target pH: {bevTargetPh} (100 = Dry Sugar, 65 = Syrup)</span>
              </div>
            </div>
          </div>

          {/* Box C: Exact Correction Prescription */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#1A2138] text-white space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-2.5">
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-sky-300">
                  Batch Standardization Prescription (Add to Current{' '}
                  {bevBatchKg} L/kg Batch
                  {canUsePremium && productName ? ` — ${productName}` : ''})
                </div>
                <div className="text-xs text-slate-200 mt-0.5">
                  Brix: <strong>{beverageCorrection.brixStatus}</strong> ·
                  Acidity: <strong>{beverageCorrection.acidStatus}</strong> · pH:{' '}
                  <strong className="text-sky-300">
                    {beverageCorrection.phStatus}
                  </strong>
                </div>
              </div>
              <div className="text-xs font-extrabold text-amber-300">
                Final Corrected Batch: {beverageCorrection.finalBatchKg} L / kg
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] font-bold text-sky-200">
                  1. Add Sugar / Syrup ({bevSugarSourceBrix}°Bx)
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-white mt-0.5 font-mono">
                  + {beverageCorrection.addSugarKg} kg
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  ({beverageCorrection.addSugarGrams.toLocaleString()} grams)
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] font-bold text-sky-200">
                  2. Add Citric Acid (Anhydrous)
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-amber-300 mt-0.5 font-mono">
                  + {beverageCorrection.addAcidKg} kg
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  ({beverageCorrection.addAcidGrams.toLocaleString()} grams ·
                  Target pH {bevTargetPh})
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] font-bold text-sky-200">
                  3. Add Treated Water
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-300 mt-0.5 font-mono">
                  + {beverageCorrection.addWaterLiters} Liters
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Verified Output: {beverageCorrection.verifiedBrix}°Bx,{' '}
                  {beverageCorrection.verifiedAcid}% Acid &amp; pH {bevTargetPh}
                </div>
              </div>
            </div>

            {/* Save & Download Action Bar */}
            {canUsePremium ? (
              <div className="pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] text-slate-300">
                  Save this adjusted Juice / Beverage batch to your directory or
                  download its official PDF standardization report.
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveBatchToDirectory('beverage')}
                    className="px-4 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Batch Record to Directory</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingleBatchPdf(
                        buildCurrentBatchRecord('beverage')
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#1A2138] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Report PDF</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-200">
                  Want to save adjusted batches by Product Name &amp; Industry
                  and download PDF Batch Standardization Reports?
                </span>
                <button
                  type="button"
                  onClick={() => onOpenPremiumModal?.()}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1673B8] text-white text-xs font-extrabold cursor-pointer"
                >
                  Unlock Paid Batch Directory &amp; PDF
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODE 2: DAIRY FAT & SNF STANDARDIZATION
         ===================================================================== */}
      {industryMode === 'dairy' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Current Raw Milk Batch (kg / L)
              </label>
              <input
                type="number"
                value={dairyBatchKg}
                onChange={(e) => setDairyBatchKg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Current Milk Fat (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={dairyCurrentFat}
                onChange={(e) => setDairyCurrentFat(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Required Target Fat (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={dairyTargetFat}
                onChange={(e) => setDairyTargetFat(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#EBF4FC] border border-[#1673B8] text-xs font-bold text-[#1A2138]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Available Cream Fat (%)
              </label>
              <input
                type="number"
                step="1"
                value={creamFat}
                onChange={(e) => setCreamFat(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Current Milk SNF (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={dairyCurrentSnf}
                onChange={(e) => setDairyCurrentSnf(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Required Target SNF (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={dairyTargetSnf}
                onChange={(e) => setDairyTargetSnf(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#EBF4FC] border border-[#1673B8] text-xs font-bold text-[#1A2138]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Skim Milk Fat (%)
              </label>
              <input
                type="number"
                step="0.05"
                value={skimMilkFat}
                onChange={(e) => setSkimMilkFat(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Skim Milk SNF (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={skimMilkSnf}
                onChange={(e) => setSkimMilkSnf(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              />
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#1A2138] text-white space-y-3.5">
            <div className="text-xs font-extrabold text-sky-300 uppercase tracking-wider">
              Dairy Standardization Prescription (To Achieve {dairyTargetFat}%
              Fat &amp; {dairyTargetSnf}% SNF
              {canUsePremium && productName ? ` — ${productName}` : ''})
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] text-sky-200 font-bold">
                  Add Skim Milk
                </div>
                <div className="text-lg font-extrabold font-mono mt-0.5">
                  + {dairyCorrection.addSkimKg} kg
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] text-sky-200 font-bold">
                  Add Cream ({creamFat}%)
                </div>
                <div className="text-lg font-extrabold font-mono mt-0.5">
                  + {dairyCorrection.addCreamKg} kg
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] text-sky-200 font-bold">
                  Add Skim Milk Powder (SMP)
                </div>
                <div className="text-lg font-extrabold text-amber-300 font-mono mt-0.5">
                  + {dairyCorrection.addSmpKg} kg
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] text-sky-200 font-bold">
                  Final Standardized Milk
                </div>
                <div className="text-lg font-extrabold text-emerald-300 font-mono mt-0.5">
                  {dairyCorrection.finalMass} kg
                </div>
              </div>
            </div>

            {canUsePremium ? (
              <div className="pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] text-slate-300">
                  Save this Dairy Fat &amp; SNF standardization batch to your
                  directory or download its PDF report.
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveBatchToDirectory('dairy')}
                    className="px-4 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Dairy Batch to Directory</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingleBatchPdf(
                        buildCurrentBatchRecord('dairy')
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#1A2138] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Report PDF</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-200">
                  Want to save Dairy Standardization batches and download
                  official PDF certificates?
                </span>
                <button
                  type="button"
                  onClick={() => onOpenPremiumModal?.()}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1673B8] text-white text-xs font-extrabold cursor-pointer"
                >
                  Unlock Paid Batch Directory &amp; PDF
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODE 3: KETCHUP, SAUCES & MAYONNAISE STANDARDIZER
         ===================================================================== */}
      {industryMode === 'sauces_mayo' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#F8FAFC] p-3 rounded-xl border border-[#D2DEEA]">
            <div className="text-xs font-extrabold text-[#1A2138]">
              Select Product Sub-Type Parameters:
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setSauceSubType('ketchup_sauce');
                  setSauceCurrentTssOrOil('25.5');
                  setSauceTargetTssOrOil('29.0');
                  setSauceCurrentAcid('0.95');
                  setSauceTargetAcid('1.25');
                  setSauceCurrentSalt('1.70');
                  setSauceTargetSalt('2.10');
                  setSauceCurrentPh('4.12');
                  setSauceTargetPh('3.75');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer ${
                  sauceSubType === 'ketchup_sauce'
                    ? 'bg-[#1673B8] text-white'
                    : 'bg-white text-[#1A2138] border border-[#D2DEEA]'
                }`}
              >
                Tomato Ketchup / Chili &amp; Culinary Sauces (TSS °Brix, Acid,
                Salt, pH)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSauceSubType('mayo_emulsion');
                  setSauceCurrentTssOrOil('61.5');
                  setSauceTargetTssOrOil('65.0');
                  setSauceCurrentAcid('0.45');
                  setSauceTargetAcid('0.65');
                  setSauceCurrentSalt('1.30');
                  setSauceTargetSalt('1.60');
                  setSauceCurrentPh('4.25');
                  setSauceTargetPh('3.85');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer ${
                  sauceSubType === 'mayo_emulsion'
                    ? 'bg-[#1673B8] text-white'
                    : 'bg-white text-[#1A2138] border border-[#D2DEEA]'
                }`}
              >
                Mayonnaise &amp; Emulsified Dressings (Oil Phase %, Acid, Salt,
                pH)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Out-of-Spec Batch */}
            <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
              <div className="text-xs font-extrabold text-[#1A2138] uppercase tracking-wider border-b border-[#D2DEEA] pb-2">
                1. Current {sauceSubType === 'mayo_emulsion' ? 'Mayonnaise' : 'Ketchup / Sauce'} Batch (Out-of-Spec)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Current Batch Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={sauceBatchKg}
                    onChange={(e) => setSauceBatchKg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    {sauceSubType === 'mayo_emulsion'
                      ? 'Current Oil Phase (%)'
                      : 'Current TSS / °Brix (%)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={sauceCurrentTssOrOil}
                    onChange={(e) => setSauceCurrentTssOrOil(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Current Acidity (% Acetic)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={sauceCurrentAcid}
                    onChange={(e) => setSauceCurrentAcid(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Current Salt (% NaCl)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={sauceCurrentSalt}
                    onChange={(e) => setSauceCurrentSalt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Current pH
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={sauceCurrentPh}
                    onChange={(e) => setSauceCurrentPh(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
              </div>
            </div>

            {/* Required Target Spec */}
            <div className="p-4 rounded-2xl bg-[#EBF4FC] border border-[#1673B8]/40 space-y-3">
              <div className="text-xs font-extrabold text-[#105E9A] uppercase tracking-wider border-b border-[#D2DEEA] pb-2">
                2. Required Target Specification
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    {sauceSubType === 'mayo_emulsion'
                      ? 'Target Oil Phase (%)'
                      : 'Target TSS / °Brix (%)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={sauceTargetTssOrOil}
                    onChange={(e) => setSauceTargetTssOrOil(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Target Acidity (% Acetic)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={sauceTargetAcid}
                    onChange={(e) => setSauceTargetAcid(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Target Salt (% NaCl)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={sauceTargetSalt}
                    onChange={(e) => setSauceTargetSalt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Target pH
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={sauceTargetPh}
                    onChange={(e) => setSauceTargetPh(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Vinegar / Acid Strength (%)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={sauceVinegarStrength}
                    onChange={(e) => setSauceVinegarStrength(e.target.value)}
                    title="e.g. 10% for Distilled Vinegar or 100% for Glacial/Citric Acid"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#1A2138] text-white space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-2.5">
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-sky-300">
                  {sauceSubType === 'mayo_emulsion'
                    ? 'Mayonnaise & Emulsion Standardization Prescription'
                    : 'Ketchup & Sauce Standardization Prescription'}
                  {canUsePremium && productName ? ` — ${productName}` : ''}
                </div>
                <div className="text-xs text-slate-200 mt-0.5">
                  pH Safety Check: <strong>{sauceMayoCorrection.phStatus}</strong>
                </div>
              </div>
              <div className="text-xs font-extrabold text-amber-300">
                Final Standardized Batch: {sauceMayoCorrection.finalBatchKg} kg
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] text-sky-200 font-bold">
                  1. Add{' '}
                  {sauceSubType === 'mayo_emulsion'
                    ? 'Vegetable Oil Phase'
                    : 'Sugar / Paste Solids'}
                </div>
                <div className="text-lg font-extrabold font-mono mt-0.5">
                  + {sauceMayoCorrection.addSolidsOrOilKg} kg
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] text-sky-200 font-bold">
                  2. Add Vinegar ({sauceVinegarStrength}%)
                </div>
                <div className="text-lg font-extrabold text-amber-300 font-mono mt-0.5">
                  + {sauceMayoCorrection.addVinegarKg} kg
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] text-sky-200 font-bold">
                  3. Add Refined Salt (NaCl)
                </div>
                <div className="text-lg font-extrabold font-mono mt-0.5">
                  + {sauceMayoCorrection.addSaltKg} kg
                </div>
                <div className="text-[10px] text-slate-300">
                  ({sauceMayoCorrection.addSaltGrams.toLocaleString()} g)
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] text-sky-200 font-bold">
                  4. Add Treated Water
                </div>
                <div className="text-lg font-extrabold text-emerald-300 font-mono mt-0.5">
                  + {sauceMayoCorrection.addWaterKg} kg
                </div>
              </div>
            </div>

            {canUsePremium ? (
              <div className="pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] text-slate-300">
                  Save this Ketchup / Sauce / Mayonnaise batch record to your
                  directory or download its PDF report.
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSaveBatchToDirectory('sauces_mayo')}
                    className="px-4 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Batch Record to Directory</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingleBatchPdf(
                        buildCurrentBatchRecord('sauces_mayo')
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#1A2138] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Report PDF</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-200">
                  Want to save Ketchup, Sauce &amp; Mayonnaise batches and
                  download PDF reports?
                </span>
                <button
                  type="button"
                  onClick={() => onOpenPremiumModal?.()}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1673B8] text-white text-xs font-extrabold cursor-pointer"
                >
                  Unlock Paid Batch Directory &amp; PDF
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODE 4: BAKING, BISCUITS & DOUGH STANDARDIZER
         ===================================================================== */}
      {industryMode === 'baking_biscuits' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Dough / Flour Batch */}
            <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
              <div className="text-xs font-extrabold text-[#1A2138] uppercase tracking-wider border-b border-[#D2DEEA] pb-2">
                1. Current Flour / Biscuit Dough Batch Details
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Current Flour / Dough (kg)
                  </label>
                  <input
                    type="number"
                    value={bakingBatchKg}
                    onChange={(e) => setBakingBatchKg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Current Moisture (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bakingCurrentMoisture}
                    onChange={(e) => setBakingCurrentMoisture(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Current Flour Protein (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bakingCurrentProtein}
                    onChange={(e) => setBakingCurrentProtein(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Current Shortening Fat (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bakingCurrentFat}
                    onChange={(e) => setBakingCurrentFat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Current Sugar (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bakingCurrentSugar}
                    onChange={(e) => setBakingCurrentSugar(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
              </div>
            </div>

            {/* Target Baking / Biscuit Specification */}
            <div className="p-4 rounded-2xl bg-[#EBF4FC] border border-[#1673B8]/40 space-y-3">
              <div className="text-xs font-extrabold text-[#105E9A] uppercase tracking-wider border-b border-[#D2DEEA] pb-2">
                2. Required Target Baking / Biscuit Specification
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Target Dough Moisture (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bakingTargetMoisture}
                    onChange={(e) => setBakingTargetMoisture(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Target Flour Protein (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bakingTargetProtein}
                    onChange={(e) => setBakingTargetProtein(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Target Shortening Fat (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bakingTargetFat}
                    onChange={(e) => setBakingTargetFat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Target Sugar (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={bakingTargetSugar}
                    onChange={(e) => setBakingTargetSugar(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Vital Wheat Gluten (% Prot)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={bakingGlutenSourcePct}
                    onChange={(e) => setBakingGlutenSourcePct(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#1A2138] text-white space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-2.5">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-sky-300">
                Baking &amp; Biscuit Dough Standardization Prescription (For{' '}
                {bakingBatchKg} kg Batch
                {canUsePremium && productName ? ` — ${productName}` : ''})
              </div>
              <div className="text-xs font-extrabold text-amber-300">
                Final Standardized Dough Batch: {bakingCorrection.finalDoughKg}{' '}
                kg
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] text-sky-200 font-bold">
                  1. Add Hydration Water
                </div>
                <div className="text-lg font-extrabold text-emerald-300 font-mono mt-0.5">
                  + {bakingCorrection.addWaterLiters} L / kg
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] text-sky-200 font-bold">
                  2. Add Vital Wheat Gluten ({bakingGlutenSourcePct}%)
                </div>
                <div className="text-lg font-extrabold text-amber-300 font-mono mt-0.5">
                  + {bakingCorrection.addGlutenKg} kg
                </div>
                <div className="text-[10px] text-slate-300">
                  ({bakingCorrection.addGlutenGrams.toLocaleString()} g)
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] text-sky-200 font-bold">
                  3. Add Shortening / Bakery Fat
                </div>
                <div className="text-lg font-extrabold font-mono mt-0.5">
                  + {bakingCorrection.addShorteningFatKg} kg
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] text-sky-200 font-bold">
                  4. Add Sugar / Icing Sugar
                </div>
                <div className="text-lg font-extrabold font-mono mt-0.5">
                  + {bakingCorrection.addSugarKg} kg
                </div>
              </div>
            </div>

            {canUsePremium ? (
              <div className="pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] text-slate-300">
                  Save this Baking / Biscuit dough standardization batch to your
                  directory or download its PDF report.
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleSaveBatchToDirectory('baking_biscuits')
                    }
                    className="px-4 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Batch Record to Directory</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingleBatchPdf(
                        buildCurrentBatchRecord('baking_biscuits')
                      )
                    }
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#1A2138] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Report PDF</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-200">
                  Want to save Baking &amp; Biscuit dough batches and download
                  PDF reports?
                </span>
                <button
                  type="button"
                  onClick={() => onOpenPremiumModal?.()}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1673B8] text-white text-xs font-extrabold cursor-pointer"
                >
                  Unlock Paid Batch Directory &amp; PDF
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          MODE 5: CLASSIC 2-STREAM PEARSON SQUARE
         ===================================================================== */}
      {industryMode === 'classic' && (
        <div className="space-y-4">
          {canUsePremium && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Ingredient A Name (High Concentration Stream)
                </label>
                <input
                  type="text"
                  value={psIngredientAName}
                  onChange={(e) => setPsIngredientAName(e.target.value)}
                  placeholder="e.g., 65°Brix Sugar Syrup / 40% Cream / High-Fat Trim"
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Ingredient B Name (Low Concentration / Diluent Stream)
                </label>
                <input
                  type="text"
                  value={psIngredientBName}
                  onChange={(e) => setPsIngredientBName(e.target.value)}
                  placeholder="e.g., Treated Water (0%) / Skim Milk / Lean Trim"
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Ingredient A Concentration (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={psHighVal}
                onChange={(e) => setPsHighVal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Ingredient B Concentration (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={psLowVal}
                onChange={(e) => setPsLowVal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Desired Target Concentration (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={psTargetVal}
                onChange={(e) => setPsTargetVal(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#EBF4FC] border border-[#1673B8] text-xs font-bold text-[#1A2138]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Total Target Batch (kg or L)
              </label>
              <input
                type="number"
                step="1"
                value={psTotalBatch}
                onChange={(e) => setPsTotalBatch(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              />
            </div>
          </div>

          {!classicPearson.isValid ? (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
              Target concentration ({psTargetVal}%) must lie between Ingredient
              A ({psHighVal}%) and Ingredient B ({psLowVal}%).
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#F0F6FC] border-2 border-[#1673B8] space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-[#D2DEEA]">
                  <div className="text-[11px] font-bold text-[#4A5568]">
                    {canUsePremium && psIngredientAName
                      ? `${psIngredientAName} (${psHighVal}%) Required`
                      : `Ingredient A (${psHighVal}%) Required`}
                  </div>
                  <div className="text-2xl font-extrabold text-[#1673B8] font-mono mt-0.5">
                    {classicPearson.highAmount} kg/L
                  </div>
                  <div className="text-[11px] text-[#4A5568] mt-0.5">
                    {classicPearson.highParts} parts ({classicPearson.highPct}%
                    of batch)
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#D2DEEA]">
                  <div className="text-[11px] font-bold text-[#4A5568]">
                    {canUsePremium && psIngredientBName
                      ? `${psIngredientBName} (${psLowVal}%) Required`
                      : `Ingredient B (${psLowVal}%) Required`}
                  </div>
                  <div className="text-2xl font-extrabold text-[#1A2138] font-mono mt-0.5">
                    {classicPearson.lowAmount} kg/L
                  </div>
                  <div className="text-[11px] text-[#4A5568] mt-0.5">
                    {classicPearson.lowParts} parts ({classicPearson.lowPct}% of
                    batch)
                  </div>
                </div>
              </div>

              {canUsePremium ? (
                <div className="pt-2 border-t border-[#D2DEEA] flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[11px] text-[#4A5568] font-medium">
                    Save this Classic Pearson Square batch record to your
                    directory or download its official PDF report.
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveBatchToDirectory('classic')}
                      className="px-4 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Pearson Batch to Directory</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleDownloadSingleBatchPdf(
                          buildCurrentBatchRecord('classic')
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Report PDF</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-[#D2DEEA] flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#1A2138]">
                    Want to save Classic Pearson Square batches by Product Name
                    and download official PDF reports?
                  </span>
                  <button
                    type="button"
                    onClick={() => onOpenPremiumModal?.()}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1673B8] text-white text-xs font-extrabold cursor-pointer"
                  >
                    Unlock Paid Batch Directory &amp; PDF
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          PAID MEMBER SAVED BATCH STANDARDIZATION DIRECTORY
         ===================================================================== */}
      {canUsePremium && (
        <div className="pt-4 border-t-2 border-[#E4EDF7] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-extrabold text-[#1673B8]">
                Paid Member Batch Standardization Logbook &amp; Directory
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
                Saved Batch Standardization Directory ({savedBatchRecords.length})
              </h3>
              <p className="text-xs text-[#5A6C84]">
                Complete history of all Juice &amp; Beverage, Dairy,
                Sauces/Ketchup/Mayonnaise, Baking/Biscuits, and Pearson Square
                batches adjusted by product, industry, and date.
              </p>
            </div>

            {savedBatchRecords.length > 0 && (
              <button
                type="button"
                onClick={handleDownloadDirectoryLogbookPdf}
                className="px-4 py-2.5 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  Download All Directory PDF ({filteredBatchRecords.length})
                </span>
              </button>
            )}
          </div>

          {/* Search & Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center bg-[#F8FAFC] p-3 rounded-2xl border border-[#D2DEEA]">
            <div className="sm:col-span-4 relative">
              <Search className="w-4 h-4 text-[#5A6C84] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by product name, industry or date..."
                value={dirSearchQuery}
                onChange={(e) => setDirSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-bold text-[#1A2138]"
              />
            </div>

            <div className="sm:col-span-5 flex flex-wrap gap-1">
              {[
                { id: 'all' as const, label: 'All' },
                { id: 'beverage' as const, label: 'Juice/Bev' },
                { id: 'dairy' as const, label: 'Dairy' },
                { id: 'sauces_mayo' as const, label: 'Ketchup/Mayo' },
                { id: 'baking_biscuits' as const, label: 'Baking/Biscuits' },
                { id: 'classic' as const, label: 'Pearson' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setDirModeFilter(f.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold cursor-pointer ${
                    dirModeFilter === f.id
                      ? 'bg-[#1673B8] text-white'
                      : 'bg-white text-[#5A6C84] border border-[#D2DEEA]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="sm:col-span-3 flex flex-wrap gap-1 sm:justify-end">
              {[
                { id: 'all' as const, label: 'All Time' },
                { id: 'today' as const, label: 'Today' },
                { id: 'week' as const, label: 'Week' },
                { id: 'month' as const, label: 'Month' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setDirPeriodFilter(p.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-extrabold cursor-pointer ${
                    dirPeriodFilter === p.id
                      ? 'bg-[#1A2138] text-white'
                      : 'bg-white text-[#5A6C84] border border-[#D2DEEA]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Saved Batch Cards */}
          {filteredBatchRecords.length === 0 ? (
            <div className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA] text-center space-y-1">
              <div className="text-xs font-extrabold text-[#1A2138]">
                No Saved Batch Standardization Records Found
              </div>
              <p className="text-[11px] text-[#5A6C84]">
                Enter your product name and batch parameters above, then click
                &ldquo;Save Batch Record to Directory&rdquo; to store your
                adjusted batch history.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredBatchRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-[#F8FAFC] hover:bg-white border border-[#D2DEEA] hover:border-[#1673B8] transition-all space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2 text-[11px] font-extrabold">
                      <span className="text-[#1673B8]">
                        {rec.recordCode} ·{' '}
                        {rec.calculatorMode === 'beverage'
                          ? 'Juice & Beverage Batch'
                          : rec.calculatorMode === 'dairy'
                          ? 'Dairy Fat & SNF Batch'
                          : rec.calculatorMode === 'sauces_mayo'
                          ? 'Ketchup / Sauce / Mayo Batch'
                          : rec.calculatorMode === 'baking_biscuits'
                          ? 'Baking & Biscuit Dough Batch'
                          : 'Classic Pearson Batch'}
                      </span>
                      <span className="text-[#5A6C84]">
                        {rec.savedDateFormatted}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-[#1A2138]">
                        {rec.productName}
                      </h4>
                      <div className="text-[11px] font-bold text-[#5A6C84]">
                        Industry: {rec.industryCategory}
                      </div>
                    </div>

                    {rec.calculatorMode === 'beverage' && (
                      <div className="p-2.5 rounded-xl bg-white border border-[#D2DEEA] text-xs space-y-1">
                        <div>
                          <span className="font-bold text-[#5A6C84]">
                            Initial vs. Target:
                          </span>{' '}
                          <span className="font-extrabold text-[#1A2138]">
                            {rec.bevBatchKg} L/kg | Brix {rec.bevCurrentBrix}° →{' '}
                            {rec.bevTargetBrix}° | Acid {rec.bevCurrentAcid}% →{' '}
                            {rec.bevTargetAcid}% | pH{' '}
                            {rec.bevCurrentPh ?? 3.85} →{' '}
                            {rec.bevTargetPh ?? 3.5}
                          </span>
                        </div>
                        <div className="text-[#1673B8] font-extrabold">
                          Added: +{rec.bevAddSugarKg} kg Sugar (
                          {rec.bevSugarSourceBrix}°Bx) · +{rec.bevAddAcidKg} kg
                          Citric Acid · +{rec.bevAddWaterLiters} L Water → Final:{' '}
                          {rec.bevFinalBatchKg} kg
                        </div>
                      </div>
                    )}

                    {rec.calculatorMode === 'dairy' && (
                      <div className="p-2.5 rounded-xl bg-white border border-[#D2DEEA] text-xs space-y-1">
                        <div>
                          <span className="font-bold text-[#5A6C84]">
                            Initial vs. Target:
                          </span>{' '}
                          <span className="font-extrabold text-[#1A2138]">
                            {rec.dairyBatchKg} kg Milk | Fat{' '}
                            {rec.dairyCurrentFat}% → {rec.dairyTargetFat}% | SNF{' '}
                            {rec.dairyCurrentSnf}% → {rec.dairyTargetSnf}%
                          </span>
                        </div>
                        <div className="text-[#1673B8] font-extrabold">
                          Added: +{rec.dairyAddSkimKg} kg Skim · +
                          {rec.dairyAddCreamKg} kg Cream ({rec.creamFat}%) · +
                          {rec.dairyAddSmpKg} kg SMP · +{rec.dairyAddWaterKg} kg
                          Water → Final: {rec.dairyFinalMass} kg
                        </div>
                      </div>
                    )}

                    {rec.calculatorMode === 'sauces_mayo' && (
                      <div className="p-2.5 rounded-xl bg-white border border-[#D2DEEA] text-xs space-y-1">
                        <div>
                          <span className="font-bold text-[#5A6C84]">
                            Initial vs. Target:
                          </span>{' '}
                          <span className="font-extrabold text-[#1A2138]">
                            {rec.sauceBatchKg} kg | TSS/Oil{' '}
                            {rec.sauceCurrentTssOrOil}% →{' '}
                            {rec.sauceTargetTssOrOil}% | Acid{' '}
                            {rec.sauceCurrentAcid}% → {rec.sauceTargetAcid}% |
                            Salt {rec.sauceCurrentSalt}% → {rec.sauceTargetSalt}
                            % | pH {rec.sauceCurrentPh} → {rec.sauceTargetPh}
                          </span>
                        </div>
                        <div className="text-[#1673B8] font-extrabold">
                          Added: +{rec.sauceAddSolidsOrOilKg} kg Solids/Oil · +
                          {rec.sauceAddVinegarKg} kg Vinegar · +
                          {rec.sauceAddSaltKg} kg Salt · +{rec.sauceAddWaterKg}{' '}
                          kg Water → Final: {rec.sauceFinalBatchKg} kg
                        </div>
                      </div>
                    )}

                    {rec.calculatorMode === 'baking_biscuits' && (
                      <div className="p-2.5 rounded-xl bg-white border border-[#D2DEEA] text-xs space-y-1">
                        <div>
                          <span className="font-bold text-[#5A6C84]">
                            Initial vs. Target:
                          </span>{' '}
                          <span className="font-extrabold text-[#1A2138]">
                            {rec.bakingBatchKg} kg | Moisture{' '}
                            {rec.bakingCurrentMoisture}% →{' '}
                            {rec.bakingTargetMoisture}% | Protein{' '}
                            {rec.bakingCurrentProtein}% →{' '}
                            {rec.bakingTargetProtein}% | Fat{' '}
                            {rec.bakingCurrentFat}% → {rec.bakingTargetFat}% |
                            Sugar {rec.bakingCurrentSugar}% →{' '}
                            {rec.bakingTargetSugar}%
                          </span>
                        </div>
                        <div className="text-[#1673B8] font-extrabold">
                          Added: +{rec.bakingAddWaterLiters} L Water · +
                          {rec.bakingAddGlutenKg} kg Gluten · +
                          {rec.bakingAddShorteningFatKg} kg Fat · +
                          {rec.bakingAddSugarKg} kg Sugar → Final:{' '}
                          {rec.bakingFinalDoughKg} kg
                        </div>
                      </div>
                    )}

                    {rec.calculatorMode === 'classic' && (
                      <div className="p-2.5 rounded-xl bg-white border border-[#D2DEEA] text-xs space-y-1">
                        <div>
                          <span className="font-bold text-[#5A6C84]">
                            Streams &amp; Target:
                          </span>{' '}
                          <span className="font-extrabold text-[#1A2138]">
                            {rec.psIngredientAName} ({rec.psHighVal}%) +{' '}
                            {rec.psIngredientBName} ({rec.psLowVal}%) → Target{' '}
                            {rec.psTargetVal}% ({rec.psTotalBatch} kg/L)
                          </span>
                        </div>
                        <div className="text-[#1673B8] font-extrabold">
                          Blend: {rec.psHighAmount} kg/L ({rec.psHighPct}%){' '}
                          {rec.psIngredientAName} + {rec.psLowAmount} kg/L (
                          {rec.psLowPct}%) {rec.psIngredientBName}
                        </div>
                      </div>
                    )}

                    {rec.notes && (
                      <p className="text-[11px] text-[#5A6C84] italic">
                        Notes: {rec.notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#E4EDF7] flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleReloadBatchRecord(rec)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#EBF4FC] border border-[#D2DEEA] text-[#1A2138] text-[11px] font-extrabold cursor-pointer"
                    >
                      Reload Batch
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleDownloadSingleBatchPdf(rec)}
                        className="px-3 py-1.5 rounded-lg bg-[#1673B8] hover:bg-[#105E9A] text-white text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download Report</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBatchRecord(rec.id)}
                        className="p-1.5 rounded-lg bg-white hover:bg-red-50 border border-[#D2DEEA] text-red-600 cursor-pointer"
                        title="Delete Batch Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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

// ============================================================================
// 3. LAB SOLUTION & MOLARITY / NORMALITY CALCULATOR
// ============================================================================
const LAB_REAGENTS = [
  { name: 'Sodium Hydroxide (NaOH)', mw: 40.0, nFactor: 1, form: 'solid' },
  { name: 'Potassium Hydroxide (KOH)', mw: 56.11, nFactor: 1, form: 'solid' },
  { name: 'Silver Nitrate (AgNO₃ — Mohr Salt Titration)', mw: 169.87, nFactor: 1, form: 'solid' },
  { name: 'Oxalic Acid Dihydrate (H₂C₂O₄·2H₂O)', mw: 126.07, nFactor: 2, form: 'solid' },
  { name: 'Sodium Carbonate Anhydrous (Na₂CO₃)', mw: 105.99, nFactor: 2, form: 'solid' },
  { name: 'Sodium Thiosulfate Pentahydrate (Na₂S₂O₃·5H₂O)', mw: 248.18, nFactor: 1, form: 'solid' },
  { name: 'Potassium Permanganate (KMnO₄ — Acidic Redox)', mw: 158.03, nFactor: 5, form: 'solid' },
  { name: 'Citric Acid Anhydrous (C₆H₈O₇)', mw: 192.12, nFactor: 3, form: 'solid' },
  { name: 'EDTA Disodium Salt Dihydrate', mw: 372.24, nFactor: 2, form: 'solid' },
  { name: 'Potassium Hydrogen Phthalate (KHP Primary Standard)', mw: 204.22, nFactor: 1, form: 'solid' },
  { name: 'Sodium Chloride (NaCl)', mw: 58.44, nFactor: 1, form: 'solid' }
];

export const LabSolutionMolarityTool: React.FC<LabFormulaCalculatorToolProps> = ({
  user,
  isUserPaid = false,
  hasExpiredPremium = false,
  toolsData,
  onSaveToolsData,
  onOpenPremiumModal
}) => {
  const canUsePremium = Boolean(isUserPaid && !hasExpiredPremium);

  const [viewTab, setViewTab] = useState<'calculator' | 'directory'>('calculator');
  const [statusToast, setStatusToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setStatusToast(msg);
    setTimeout(() => {
      setStatusToast((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  const customReagents: LabMolarityCustomReagentItem[] = useMemo(
    () => toolsData?.molarityData?.customReagents || [],
    [toolsData?.molarityData?.customReagents]
  );

  const savedRecords: LabMolaritySavedRecord[] = useMemo(
    () => toolsData?.molarityData?.savedRecords || [],
    [toolsData?.molarityData?.savedRecords]
  );

  const allReagentOptions = useMemo(() => {
    const customList = customReagents.map((cr) => ({
      id: cr.id,
      name: cr.name,
      mw: cr.mw,
      nFactor: cr.nFactor,
      isCustom: true
    }));
    const defaultList = LAB_REAGENTS.map((r, i) => ({
      id: `def-reagent-${i}`,
      name: r.name,
      mw: r.mw,
      nFactor: r.nFactor,
      isCustom: false
    }));
    return [...customList, ...defaultList];
  }, [customReagents]);

  const [selectedReagentName, setSelectedReagentName] = useState<string>(
    LAB_REAGENTS[0].name
  );
  const [mw, setMw] = useState<string>('40.0');
  const [nFactor, setNFactor] = useState<string>('1');
  const [concMode, setConcMode] = useState<'N' | 'M'>('N');
  const [targetConc, setTargetConc] = useState<string>('0.1');
  const [targetVolMl, setTargetVolMl] = useState<string>('1000');
  const [purityPct, setPurityPct] = useState<string>('99');

  // Custom Reagent Form (Paid users)
  const [showAddReagentForm, setShowAddReagentForm] = useState<boolean>(false);
  const [newReagentName, setNewReagentName] = useState<string>('');
  const [newReagentMw, setNewReagentMw] = useState<string>('');
  const [newReagentNFactor, setNewReagentNFactor] = useState<string>('1');

  // Stock liquid dilution (C1V1 = C2V2)
  const [c1, setC1] = useState<string>('1.0');
  const [c2, setC2] = useState<string>('0.1');
  const [v2Ml, setV2Ml] = useState<string>('500');

  // Paid Member Solution Logging Fields
  const [solutionLabel, setSolutionLabel] = useState<string>('');
  const [solutionNotes, setSolutionNotes] = useState<string>('');
  const [dilutionLabel, setDilutionLabel] = useState<string>('');
  const [dilutionNotes, setDilutionNotes] = useState<string>('');

  // Directory Search & Filters
  const [dirSearchQuery, setDirSearchQuery] = useState<string>('');
  const [dirTypeFilter, setDirTypeFilter] = useState<
    'all' | 'solid_prep' | 'liquid_dilution'
  >('all');
  const [dirDateFilter, setDirDateFilter] = useState<
    'all' | 'today' | 'week' | 'month'
  >('all');

  const solidCalc = useMemo(() => {
    const molW = Math.max(1, Number(mw) || 40);
    const valency = Math.max(1, Number(nFactor) || 1);
    const eqWeight = molW / valency;
    const conc = Math.max(0.0001, Number(targetConc) || 0.1);
    const volL = Math.max(1, Number(targetVolMl) || 1000) / 1000;
    const purity = Math.min(100, Math.max(1, Number(purityPct) || 99)) / 100;

    // Pure mass (g) = Molarity * MW * L  OR  Normality * EqWeight * L
    const pureGrams =
      concMode === 'M' ? conc * molW * volL : conc * eqWeight * volL;
    const actualGramsToWeigh = pureGrams / purity;

    const equivMolarity = concMode === 'M' ? conc : conc / valency;
    const equivNormality = concMode === 'N' ? conc : conc * valency;

    return {
      eqWeight: Number(eqWeight.toFixed(2)),
      pureGrams: Number(pureGrams.toFixed(4)),
      actualGramsToWeigh: Number(actualGramsToWeigh.toFixed(4)),
      equivMolarity: Number(equivMolarity.toFixed(4)),
      equivNormality: Number(equivNormality.toFixed(4))
    };
  }, [mw, nFactor, concMode, targetConc, targetVolMl, purityPct]);

  const dilutionCalc = useMemo(() => {
    const stockC = Math.max(0.0001, Number(c1) || 1);
    const desiredC = Math.max(0.0001, Number(c2) || 0.1);
    const finalV = Math.max(1, Number(v2Ml) || 500);
    const v1Ml = (desiredC * finalV) / stockC;
    const waterToAddMl = Math.max(0, finalV - v1Ml);
    return {
      v1Ml: Number(v1Ml.toFixed(2)),
      waterToAddMl: Number(waterToAddMl.toFixed(2))
    };
  }, [c1, c2, v2Ml]);

  const handleSaveCustomReagent = async () => {
    if (!canUsePremium || !toolsData || !onSaveToolsData) {
      onOpenPremiumModal?.();
      return;
    }
    const cleanName = newReagentName.trim();
    const parsedMw = Number(newReagentMw);
    const parsedNF = Math.max(1, Number(newReagentNFactor) || 1);
    if (!cleanName || !parsedMw || parsedMw <= 0) {
      showToast('Please enter a valid reagent name and molecular weight (g/mol).');
      return;
    }
    const newItem: LabMolarityCustomReagentItem = {
      id: `reagent-${Date.now()}`,
      name: cleanName,
      mw: Number(parsedMw.toFixed(2)),
      nFactor: parsedNF,
      createdAt: new Date().toISOString()
    };
    const nextCustom = [newItem, ...customReagents];
    await onSaveToolsData({
      ...toolsData,
      molarityData: {
        customReagents: nextCustom,
        savedRecords
      },
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    });
    setSelectedReagentName(newItem.name);
    setMw(String(newItem.mw));
    setNFactor(String(newItem.nFactor));
    setNewReagentName('');
    setNewReagentMw('');
    setNewReagentNFactor('1');
    setShowAddReagentForm(false);
    showToast(`Saved "${newItem.name}" (MW ${newItem.mw}) to your Reagent List!`);
  };

  const handleDeleteCustomReagent = async (id: string) => {
    if (!canUsePremium || !toolsData || !onSaveToolsData) return;
    const nextCustom = customReagents.filter((r) => r.id !== id);
    await onSaveToolsData({
      ...toolsData,
      molarityData: {
        customReagents: nextCustom,
        savedRecords
      },
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    });
    showToast('Removed custom reagent from list.');
  };

  const buildCurrentSolidRecord = (): LabMolaritySavedRecord => {
    const now = new Date();
    const defaultTitle =
      solutionLabel.trim() ||
      `${targetConc} ${concMode} ${selectedReagentName} (${targetVolMl} mL)`;
    return {
      id: `mol-rec-${Date.now()}`,
      recordCode: `MOL-${String(Date.now()).slice(-6)}`,
      recordType: 'solid_prep',
      solutionName: defaultTitle,
      notes: solutionNotes.trim() || undefined,
      savedDateFormatted: now.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      savedAtIso: now.toISOString(),
      reagentName: selectedReagentName,
      mw: Number(mw) || 40,
      nFactor: Number(nFactor) || 1,
      concMode,
      targetConc: Number(targetConc) || 0.1,
      targetVolMl: Number(targetVolMl) || 1000,
      purityPct: Number(purityPct) || 99,
      eqWeight: solidCalc.eqWeight,
      pureGrams: solidCalc.pureGrams,
      actualGramsToWeigh: solidCalc.actualGramsToWeigh,
      equivMolarity: solidCalc.equivMolarity,
      equivNormality: solidCalc.equivNormality
    };
  };

  const buildCurrentDilutionRecord = (): LabMolaritySavedRecord => {
    const now = new Date();
    const defaultTitle =
      dilutionLabel.trim() ||
      `Stock Dilution (${c1} -> ${c2}, Final ${v2Ml} mL)`;
    return {
      id: `mol-rec-${Date.now()}`,
      recordCode: `MOL-${String(Date.now()).slice(-6)}`,
      recordType: 'liquid_dilution',
      solutionName: defaultTitle,
      notes: dilutionNotes.trim() || undefined,
      savedDateFormatted: now.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      savedAtIso: now.toISOString(),
      stockC1: Number(c1) || 1.0,
      desiredC2: Number(c2) || 0.1,
      finalV2Ml: Number(v2Ml) || 500,
      requiredStockV1Ml: dilutionCalc.v1Ml,
      waterToAddMl: dilutionCalc.waterToAddMl
    };
  };

  const handleSaveRecordToDirectory = async (
    type: 'solid_prep' | 'liquid_dilution'
  ) => {
    if (!canUsePremium || !toolsData || !onSaveToolsData) {
      onOpenPremiumModal?.();
      return;
    }
    const newRec =
      type === 'solid_prep'
        ? buildCurrentSolidRecord()
        : buildCurrentDilutionRecord();
    const nextRecords = [newRec, ...savedRecords].slice(0, 200);
    await onSaveToolsData({
      ...toolsData,
      molarityData: {
        customReagents,
        savedRecords: nextRecords
      },
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    });
    if (type === 'solid_prep') {
      setSolutionLabel('');
      setSolutionNotes('');
    } else {
      setDilutionLabel('');
      setDilutionNotes('');
    }
    showToast(
      `Saved "${newRec.solutionName}" (${newRec.recordCode}) to your Lab Solutions Directory!`
    );
  };

  const handleDeleteSavedRecord = async (id: string) => {
    if (!canUsePremium || !toolsData || !onSaveToolsData) return;
    const nextRecords = savedRecords.filter((r) => r.id !== id);
    await onSaveToolsData({
      ...toolsData,
      molarityData: {
        customReagents,
        savedRecords: nextRecords
      },
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    });
    showToast('Removed solution record from directory.');
  };

  const handleLoadRecordIntoCalculator = (rec: LabMolaritySavedRecord) => {
    if (rec.recordType === 'solid_prep') {
      if (rec.reagentName) setSelectedReagentName(rec.reagentName);
      if (rec.mw !== undefined) setMw(String(rec.mw));
      if (rec.nFactor !== undefined) setNFactor(String(rec.nFactor));
      if (rec.concMode) setConcMode(rec.concMode);
      if (rec.targetConc !== undefined) setTargetConc(String(rec.targetConc));
      if (rec.targetVolMl !== undefined) setTargetVolMl(String(rec.targetVolMl));
      if (rec.purityPct !== undefined) setPurityPct(String(rec.purityPct));
      setSolutionLabel(rec.solutionName || '');
      setSolutionNotes(rec.notes || '');
    } else {
      if (rec.stockC1 !== undefined) setC1(String(rec.stockC1));
      if (rec.desiredC2 !== undefined) setC2(String(rec.desiredC2));
      if (rec.finalV2Ml !== undefined) setV2Ml(String(rec.finalV2Ml));
      setDilutionLabel(rec.solutionName || '');
      setDilutionNotes(rec.notes || '');
    }
    setViewTab('calculator');
    showToast(`Loaded "${rec.solutionName}" (${rec.recordCode}) into Calculator!`);
  };

  // Single Solution PDF Report
  const handleDownloadSingleSolutionPdf = (rec: LabMolaritySavedRecord) => {
    if (!canUsePremium) {
      onOpenPremiumModal?.();
      return;
    }
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const specialistName = (user?.name || 'Food Safety & QA Specialist').trim();
    const specialistRole = (
      user?.currentRole ||
      user?.qualification ||
      'QA & Analytical Chemist'
    ).trim();

    pdf.setFillColor(26, 33, 56);
    pdf.rect(0, 0, 210, 44, 'F');
    drawPdfBrandLogo(pdf, 14, 8, 26, {
      borderColor: [255, 255, 255],
      bgFill: [255, 255, 255],
      roundedRadius: 4
    });

    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Food Science Portal — Analytical Lab Suite', 45, 17);
    pdf.setFontSize(16);
    pdf.text(
      rec.recordType === 'solid_prep'
        ? 'MOLARITY / NORMALITY SOLUTION PREP SHEET'
        : 'LIQUID STOCK SOLUTION DILUTION SHEET (C1V1=C2V2)',
      45,
      26
    );
    pdf.setFontSize(9.5);
    pdf.setTextColor(220, 233, 246);
    pdf.text(
      `Record ID: ${rec.recordCode}   •   Prepared On: ${rec.savedDateFormatted}`,
      45,
      34
    );

    drawPdfUserPhoto(pdf, user?.profilePicUrl, specialistName, 170, 8, 26, {
      borderColor: [255, 255, 255],
      fallbackBgColor: [22, 115, 184],
      fallbackTextColor: [255, 255, 255]
    });

    pdf.setFillColor(240, 246, 252);
    pdf.setDrawColor(187, 214, 238);
    pdf.roundedRect(14, 50, 182, 28, 3, 3, 'FD');

    pdf.setTextColor(26, 33, 56);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text(`Solution / Batch Label: ${rec.solutionName}`, 20, 60);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.text(
      `Prepared By: ${specialistName} (${specialistRole})`,
      20,
      68
    );
    pdf.text(
      `Method Type: ${
        rec.recordType === 'solid_prep'
          ? 'Solid Reagent to Molar (M) / Normal (N) Solution'
          : 'Liquid Stock Dilution Formula (C1 × V1 = C2 × V2)'
      }`,
      20,
      74
    );

    let y = 88;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(22, 115, 184);
    pdf.text(
      rec.recordType === 'solid_prep'
        ? '1. Analytical Reagent Specifications & Weighing Calculation'
        : '1. Stock Solution Dilution Parameters & Volumetric Addition',
      14,
      y
    );
    y += 6;

    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(22, 115, 184);
    pdf.roundedRect(14, y, 182, 74, 3, 3, 'FD');

    pdf.setFontSize(10);
    pdf.setTextColor(26, 33, 56);
    if (rec.recordType === 'solid_prep') {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Chemical / Reagent Name:', 20, y + 12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${rec.reagentName || '-'}`, 82, y + 12);

      pdf.setFont('helvetica', 'bold');
      pdf.text('Molecular Weight & Valency Factor:', 20, y + 22);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `MW = ${rec.mw} g/mol   |   Valency Factor (n) = ${rec.nFactor}   |   Eq. Weight = ${rec.eqWeight} g/eq`,
        82,
        y + 22
      );

      pdf.setFont('helvetica', 'bold');
      pdf.text('Target Solution Strength & Volume:', 20, y + 32);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `${rec.targetConc} ${rec.concMode}   (Final Volume = ${rec.targetVolMl} mL)   |   Reagent Purity = ${rec.purityPct}%`,
        82,
        y + 32
      );

      pdf.setFont('helvetica', 'bold');
      pdf.text('Equivalent Strength Conversion:', 20, y + 42);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `Normality = ${rec.equivNormality} N   |   Molarity = ${rec.equivMolarity} M`,
        82,
        y + 42
      );

      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(22, 115, 184);
      pdf.text('EXACT MASS TO WEIGH ON BALANCE:', 20, y + 54);
      pdf.text(
        `${rec.actualGramsToWeigh} grams   (100% Pure Theoretical Mass: ${rec.pureGrams} g)`,
        88,
        y + 54
      );

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.2);
      pdf.setTextColor(74, 85, 104);
      pdf.text(
        `SOP: Weigh ${rec.actualGramsToWeigh} g reagent, dissolve in ~${Math.round(
          (rec.targetVolMl || 1000) * 0.6
        )} mL distilled water, cool to 20°C, and make up to ${rec.targetVolMl} mL.`,
        20,
        y + 65
      );
    } else {
      pdf.setFont('helvetica', 'bold');
      pdf.text('Stock Solution Concentration (C1):', 20, y + 14);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${rec.stockC1} (N, M, or %)`, 92, y + 14);

      pdf.setFont('helvetica', 'bold');
      pdf.text('Desired Target Concentration (C2):', 20, y + 25);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${rec.desiredC2} (N, M, or %)`, 92, y + 25);

      pdf.setFont('helvetica', 'bold');
      pdf.text('Desired Final Solution Volume (V2):', 20, y + 36);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${rec.finalV2Ml} mL`, 92, y + 36);

      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(22, 115, 184);
      pdf.text('REQUIRED STOCK VOLUME (V1):', 20, y + 50);
      pdf.text(`${rec.requiredStockV1Ml} mL`, 92, y + 50);

      pdf.setTextColor(26, 33, 56);
      pdf.text('DISTILLED WATER TO ADD:', 20, y + 62);
      pdf.text(
        `+ ${rec.waterToAddMl} mL   (Total Final Volume = ${rec.finalV2Ml} mL)`,
        92,
        y + 62
      );
    }

    y += 84;
    if (rec.notes) {
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(210, 222, 234);
      pdf.roundedRect(14, y, 182, 30, 3, 3, 'FD');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(26, 33, 56);
      pdf.text('Analyst / Preparation Notes:', 20, y + 10);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      pdf.setTextColor(74, 85, 104);
      const wrapped = pdf.splitTextToSize(rec.notes, 170);
      pdf.text(wrapped.slice(0, 2), 20, y + 18);
    }

    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8.5);
    pdf.setTextColor(120, 130, 145);
    pdf.text(
      'Generated by Food Science Portal — Lab Solution & Molarity / Normality Suite',
      14,
      284
    );

    pdf.save(`${rec.recordCode}_Lab_Solution_Report.pdf`);
    showToast(`Downloaded Solution Report PDF (${rec.recordCode})!`);
  };

  // Filtered Directory Records
  const filteredDirectoryRecords = useMemo(() => {
    const q = dirSearchQuery.trim().toLowerCase();
    const now = new Date();
    return savedRecords.filter((rec) => {
      if (dirTypeFilter !== 'all' && rec.recordType !== dirTypeFilter) {
        return false;
      }
      if (dirDateFilter !== 'all' && rec.savedAtIso) {
        const recDate = new Date(rec.savedAtIso);
        const diffDays =
          (now.getTime() - recDate.getTime()) / (1000 * 60 * 60 * 24);
        if (dirDateFilter === 'today' && diffDays > 1) return false;
        if (dirDateFilter === 'week' && diffDays > 7) return false;
        if (dirDateFilter === 'month' && diffDays > 31) return false;
      }
      if (!q) return true;
      return (
        rec.solutionName.toLowerCase().includes(q) ||
        rec.recordCode.toLowerCase().includes(q) ||
        (rec.reagentName || '').toLowerCase().includes(q) ||
        (rec.notes || '').toLowerCase().includes(q)
      );
    });
  }, [savedRecords, dirSearchQuery, dirTypeFilter, dirDateFilter]);

  // Full Directory Logbook PDF
  const handleDownloadDirectoryLogbookPdf = () => {
    if (!canUsePremium) {
      onOpenPremiumModal?.();
      return;
    }
    if (filteredDirectoryRecords.length === 0) {
      showToast('No saved solution records to export.');
      return;
    }
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const specialistName = (user?.name || 'Food Safety & QA Specialist').trim();

    pdf.setFillColor(26, 33, 56);
    pdf.rect(0, 0, 210, 42, 'F');
    drawPdfBrandLogo(pdf, 14, 8, 25, {
      borderColor: [255, 255, 255],
      bgFill: [255, 255, 255],
      roundedRadius: 4
    });

    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Food Science Portal — Analytical Reagent Logbook', 44, 17);
    pdf.setFontSize(15.5);
    pdf.text('MOLARITY, NORMALITY & DILUTION DIRECTORY REPORT', 44, 26);
    pdf.setFontSize(9.5);
    pdf.setTextColor(220, 233, 246);
    pdf.text(
      `Specialist: ${specialistName}   •   Total Logged Solutions: ${filteredDirectoryRecords.length}`,
      44,
      34
    );

    drawPdfUserPhoto(pdf, user?.profilePicUrl, specialistName, 172, 8, 24, {
      borderColor: [255, 255, 255],
      fallbackBgColor: [22, 115, 184],
      fallbackTextColor: [255, 255, 255]
    });

    let y = 50;
    filteredDirectoryRecords.forEach((rec, idx) => {
      if (y > 252) {
        pdf.addPage();
        y = 20;
      }
      pdf.setFillColor(
        idx % 2 === 0 ? 248 : 240,
        idx % 2 === 0 ? 250 : 246,
        252
      );
      pdf.setDrawColor(210, 222, 234);
      pdf.roundedRect(14, y, 182, 27, 2.5, 2.5, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(26, 33, 56);
      pdf.text(
        `${idx + 1}. [${rec.recordCode}] ${rec.solutionName}  (${rec.savedDateFormatted})`,
        18,
        y + 7
      );

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.7);
      pdf.setTextColor(22, 115, 184);
      if (rec.recordType === 'solid_prep') {
        pdf.text(
          `Solid Reagent: ${rec.reagentName} (MW ${rec.mw}, n=${rec.nFactor}, Purity ${rec.purityPct}%) -> ${rec.targetConc} ${rec.concMode} (${rec.targetVolMl} mL) => Weigh ${rec.actualGramsToWeigh} g`,
          18,
          y + 14.5
        );
      } else {
        pdf.text(
          `Stock Dilution (C1V1=C2V2): Stock C1=${rec.stockC1} -> Target C2=${rec.desiredC2} (${rec.finalV2Ml} mL) => Take ${rec.requiredStockV1Ml} mL Stock + ${rec.waterToAddMl} mL Water`,
          18,
          y + 14.5
        );
      }

      if (rec.notes) {
        pdf.setTextColor(90, 108, 132);
        pdf.text(`Notes: ${rec.notes.slice(0, 95)}`, 18, y + 21.5);
      }
      y += 31;
    });

    pdf.save(`Molarity_Normality_Directory_Logbook_${Date.now()}.pdf`);
    showToast('Downloaded Complete Molarity & Solutions Logbook PDF!');
  };

  return (
    <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 sm:p-6 shadow-xs space-y-5">
      {/* Toast Notification */}
      {statusToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#1A2138] text-white text-xs font-extrabold shadow-lg flex items-center gap-2 border border-[#1673B8]/40">
          <Check className="w-4 h-4 text-[#60A5FA] shrink-0" />
          <span>{statusToast}</span>
        </div>
      )}

      <div className="border-b border-[#D2DEEA] pb-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1673B8] text-white flex items-center justify-center shrink-0">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
                Lab Solution &amp; Molarity / Normality Calculator
              </h2>
              <span className="text-[11px] font-extrabold text-[#1673B8]">
                {canUsePremium
                  ? '· Paid Pro Mode (Solution Log, Directory & PDF Unlocked)'
                  : '· Free Basic Calculator'}
              </span>
            </div>
            <p className="text-xs text-[#4A5568] font-medium">
              Analytical Reagent Preparation (Grams to Weigh) &amp; Stock Dilution Formula (C1 × V1 = C2 × V2)
            </p>
          </div>
        </div>

        {canUsePremium && (
          <div className="flex flex-wrap gap-1.5 bg-[#F0F6FC] p-1 rounded-xl border border-[#D2DEEA]">
            <button
              type="button"
              onClick={() => setViewTab('calculator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                viewTab === 'calculator'
                  ? 'bg-[#1673B8] text-white shadow-2xs'
                  : 'text-[#1A2138] hover:bg-white'
              }`}
            >
              Solution Calculator
            </button>
            <button
              type="button"
              onClick={() => setViewTab('directory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                viewTab === 'directory'
                  ? 'bg-[#1673B8] text-white shadow-2xs'
                  : 'text-[#1A2138] hover:bg-white'
              }`}
            >
              Saved Solutions Directory ({savedRecords.length})
            </button>
          </div>
        )}
      </div>

      {viewTab === 'calculator' && (
        <>
          {/* SECTION 1: SOLID REAGENT TO MOLAR / NORMAL SOLUTION */}
          <div className="space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1673B8]">
                1. Prepare Molar (M) or Normal (N) Solution from Solid Reagent
              </h3>
              <span className="text-[11px] font-bold text-[#4A5568] bg-[#F0F6FC] px-2.5 py-1 rounded-lg border border-[#D2DEEA]">
                {concMode === 'N'
                  ? 'Formula: Grams = (Normality × Equivalent Weight × Volume in mL) / 1000'
                  : 'Formula: Grams = (Molarity × Molecular Weight × Volume in mL) / 1000'}
              </span>
            </div>

            {/* Paid Member Custom Reagent Addition Bar */}
            {canUsePremium && (
              <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA] space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs text-[#1A2138]">
                    <span className="font-extrabold text-[#1673B8]">
                      Custom Lab Reagent Library:
                    </span>{' '}
                    Add any custom laboratory salt, standard, or reagent with its
                    Molecular Weight &amp; Valency Factor to reuse anytime.
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddReagentForm((prev) => !prev)}
                    className="px-3 py-1.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>
                      {showAddReagentForm ? 'Close Form' : '+ Add Custom Reagent'}
                    </span>
                  </button>
                </div>

                {showAddReagentForm && (
                  <div className="p-3.5 rounded-xl bg-white border border-[#94B8D7] grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-5">
                      <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                        Reagent / Chemical Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Potassium Dichromate (K2Cr2O7)"
                        value={newReagentName}
                        onChange={(e) => setNewReagentName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                        Molecular Wt (g/mol)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="294.18"
                        value={newReagentMw}
                        onChange={(e) => setNewReagentMw(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                        Valency Factor (n)
                      </label>
                      <input
                        type="number"
                        step="1"
                        placeholder="6"
                        value={newReagentNFactor}
                        onChange={(e) => setNewReagentNFactor(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <button
                        type="button"
                        onClick={handleSaveCustomReagent}
                        className="w-full py-2 px-3 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold cursor-pointer"
                      >
                        Save Reagent ✓
                      </button>
                    </div>
                  </div>
                )}

                {customReagents.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="font-extrabold text-[#5A6C84]">
                      Saved Custom Reagents:
                    </span>
                    {customReagents.map((cr) => (
                      <span
                        key={cr.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#D2DEEA] text-[#1A2138] font-bold"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedReagentName(cr.name);
                            setMw(String(cr.mw));
                            setNFactor(String(cr.nFactor));
                          }}
                          className="hover:text-[#1673B8] cursor-pointer"
                        >
                          {cr.name} (MW {cr.mw}, n={cr.nFactor})
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomReagent(cr.id)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                          title="Delete custom reagent"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                  Select Food Lab Chemical / Reagent (Auto-Fills Molecular Weight &amp; Valency Factor)
                </label>
                <select
                  value={selectedReagentName}
                  onChange={(e) => {
                    const nameVal = e.target.value;
                    setSelectedReagentName(nameVal);
                    const r = allReagentOptions.find((item) => item.name === nameVal);
                    if (r) {
                      setMw(String(r.mw));
                      setNFactor(String(r.nFactor));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                >
                  {allReagentOptions.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.isCustom ? `★ ${r.name}` : r.name} — Molecular Wt: {r.mw} g/mol (Valency Factor = {r.nFactor})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                  Concentration Unit
                </label>
                <div className="grid grid-cols-2 gap-1.5 bg-[#F0F6FC] p-1 rounded-xl border border-[#D2DEEA]">
                  <button
                    type="button"
                    onClick={() => setConcMode('N')}
                    className={`py-1.5 rounded-lg text-xs font-extrabold cursor-pointer ${
                      concMode === 'N' ? 'bg-[#1673B8] text-white' : 'text-[#1A2138]'
                    }`}
                  >
                    Normality (N)
                  </button>
                  <button
                    type="button"
                    onClick={() => setConcMode('M')}
                    className={`py-1.5 rounded-lg text-xs font-extrabold cursor-pointer ${
                      concMode === 'M' ? 'bg-[#1673B8] text-white' : 'text-[#1A2138]'
                    }`}
                  >
                    Molarity (M)
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Molecular Weight (g/mol)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={mw}
                  onChange={(e) => setMw(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Valency Factor (Acidity/Basicity)
                </label>
                <input
                  type="number"
                  step="1"
                  value={nFactor}
                  onChange={(e) => setNFactor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Desired {concMode === 'N' ? 'Normality (N)' : 'Molarity (M)'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={targetConc}
                  onChange={(e) => setTargetConc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#EBF4FC] border border-[#1673B8] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Final Volume (mL)
                </label>
                <input
                  type="number"
                  step="50"
                  value={targetVolMl}
                  onChange={(e) => setTargetVolMl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Reagent Purity (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={purityPct}
                  onChange={(e) => setPurityPct(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#1A2138] text-white grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] text-sky-200 font-bold">
                  Exact Mass to Weigh on Analytical Balance
                </div>
                <div className="text-2xl font-extrabold text-amber-300 font-mono mt-0.5">
                  {solidCalc.actualGramsToWeigh} g
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  (100% Pure Reagent Weight: {solidCalc.pureGrams} g)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] text-sky-200 font-bold">
                  Equivalent Weight &amp; Solution Strength
                </div>
                <div className="text-sm font-extrabold text-white font-mono mt-1">
                  Equivalent Weight = {solidCalc.eqWeight} g/eq
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Normality: {solidCalc.equivNormality} N | Molarity: {solidCalc.equivMolarity} M
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] text-sky-200 font-bold">
                  Standard Lab Preparation Method
                </div>
                <div className="text-[11px] text-slate-200 mt-1 leading-snug">
                  Weigh <strong>{solidCalc.actualGramsToWeigh} g</strong> of reagent, dissolve in ~{Math.round(Number(targetVolMl) * 0.6)} mL distilled water, cool to 20°C, and make up final volume to <strong>{targetVolMl} mL</strong> in a volumetric flask.
                </div>
              </div>
            </div>

            {/* Paid Member Save & PDF Report Bar for Section 1 */}
            {canUsePremium && (
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA] space-y-3">
                <div className="text-xs font-extrabold text-[#1A2138] flex items-center justify-between">
                  <span>
                    Log Solid Reagent Solution to Directory &amp; Generate PDF Report
                  </span>
                  <span className="text-[11px] text-[#1673B8]">
                    Saved in your Paid Member Directory
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Solution / Reagent Batch Label (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder={`e.g., ${targetConc} ${concMode} ${selectedReagentName} for Titration`}
                      value={solutionLabel}
                      onChange={(e) => setSolutionLabel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Analyst / Standardization Notes (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Standardized against KHP primary standard"
                      value={solutionNotes}
                      onChange={(e) => setSolutionNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                  <div className="sm:col-span-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveRecordToDirectory('solid_prep')}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Solution</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleDownloadSingleSolutionPdf(buildCurrentSolidRecord())
                      }
                      className="py-2.5 px-3 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF Report</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: C1 x V1 = C2 x V2 LIQUID DILUTION */}
          <div className="pt-3 border-t border-[#D2DEEA] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1673B8]">
                2. Liquid Stock Solution Dilution Calculator
              </h3>
              <span className="text-[11px] font-bold text-[#4A5568] bg-[#F0F6FC] px-2.5 py-1 rounded-lg border border-[#D2DEEA]">
                Formula: Stock Volume (V1) = (Desired Concentration C2 × Final Volume V2) / Stock Concentration C1
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Stock Solution Concentration (C1 in N, M, or %)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={c1}
                  onChange={(e) => setC1(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Desired Target Concentration (C2)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={c2}
                  onChange={(e) => setC2(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Desired Final Volume (V2 in mL)
                </label>
                <input
                  type="number"
                  step="50"
                  value={v2Ml}
                  onChange={(e) => setV2Ml(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F0F6FC] border border-[#1673B8] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-[#4A5568]">Required Stock Solution Volume (V1): </span>
                <span className="text-base font-extrabold text-[#1673B8] font-mono">
                  {dilutionCalc.v1Ml} mL
                </span>
              </div>
              <div>
                <span className="font-bold text-[#4A5568]">Distilled Water to Add: </span>
                <span className="text-base font-extrabold text-[#1A2138] font-mono">
                  + {dilutionCalc.waterToAddMl} mL
                </span>
              </div>
              <div className="font-bold text-[#105E9A]">
                Total Final Solution Volume (V2) = {v2Ml} mL
              </div>
            </div>

            {/* Paid Member Save & PDF Report Bar for Section 2 */}
            {canUsePremium && (
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA] space-y-3">
                <div className="text-xs font-extrabold text-[#1A2138] flex items-center justify-between">
                  <span>
                    Log Stock Dilution (C1V1 = C2V2) to Directory &amp; Generate PDF Report
                  </span>
                  <span className="text-[11px] text-[#1673B8]">
                    Saved in your Paid Member Directory
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Dilution Solution Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder={`e.g., Working Acid Solution (${c1} -> ${c2})`}
                      value={dilutionLabel}
                      onChange={(e) => setDilutionLabel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                      Lab Notes (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Prepared for daily milk acidity bench"
                      value={dilutionNotes}
                      onChange={(e) => setDilutionNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                    />
                  </div>
                  <div className="sm:col-span-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleSaveRecordToDirectory('liquid_dilution')
                      }
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Dilution</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleDownloadSingleSolutionPdf(
                          buildCurrentDilutionRecord()
                        )
                      }
                      className="py-2.5 px-3 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF Report</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* SAVED SOLUTIONS DIRECTORY TAB (PAID USERS) */}
      {canUsePremium && viewTab === 'directory' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#1A2138]">
                Saved Lab Solutions &amp; Molarity Directory ({filteredDirectoryRecords.length})
              </h3>
              <p className="text-xs text-[#5A6C84]">
                Search, reload, or download official PDF Lab Preparation Reports for any saved Molar/Normal solution or stock dilution.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadDirectoryLogbookPdf}
              className="px-4 py-2.5 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Directory Logbook PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-[#5A6C84] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by solution name, reagent, or record code (MOL-...)..."
                value={dirSearchQuery}
                onChange={(e) => setDirSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              />
            </div>
            <div className="sm:col-span-3">
              <select
                value={dirTypeFilter}
                onChange={(e) =>
                  setDirTypeFilter(
                    e.target.value as 'all' | 'solid_prep' | 'liquid_dilution'
                  )
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              >
                <option value="all">All Solution Types</option>
                <option value="solid_prep">Solid Reagent (M / N)</option>
                <option value="liquid_dilution">Stock Dilution (C1V1)</option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <select
                value={dirDateFilter}
                onChange={(e) =>
                  setDirDateFilter(
                    e.target.value as 'all' | 'today' | 'week' | 'month'
                  )
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          {filteredDirectoryRecords.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#F8FAFC] border border-dashed border-[#94B8D7] text-center space-y-2">
              <div className="text-sm font-extrabold text-[#1A2138]">
                No Saved Lab Solutions Found
              </div>
              <p className="text-xs text-[#5A6C84]">
                Use the Solution Calculator tab and click &ldquo;Save Solution&rdquo; or &ldquo;Save Dilution&rdquo; to log records here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDirectoryRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA] hover:border-[#1673B8] transition-colors space-y-2.5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-[#1A2138] text-white text-[10px] font-extrabold font-mono">
                          {rec.recordCode}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#EBF4FC] text-[#1673B8] text-[10px] font-extrabold">
                          {rec.recordType === 'solid_prep'
                            ? 'Solid Reagent Prep (M / N)'
                            : 'Stock Dilution (C1V1 = C2V2)'}
                        </span>
                        <span className="text-[11px] font-bold text-[#5A6C84]">
                          {rec.savedDateFormatted}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-[#1A2138] mt-1">
                        {rec.solutionName}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleLoadRecordIntoCalculator(rec)}
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#EBF4FC] border border-[#94B8D7] text-[#1A2138] text-[11px] font-extrabold cursor-pointer"
                      >
                        Load into Calculator
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadSingleSolutionPdf(rec)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#1673B8] hover:bg-[#105E9A] text-white text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF Report</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSavedRecord(rec.id)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {rec.recordType === 'solid_prep' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                        <div className="text-[10px] text-[#5A6C84] font-bold">
                          Reagent &amp; MW
                        </div>
                        <div className="font-extrabold text-[#1A2138] truncate">
                          {rec.reagentName} ({rec.mw} g/mol)
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                        <div className="text-[10px] text-[#5A6C84] font-bold">
                          Target Strength &amp; Volume
                        </div>
                        <div className="font-extrabold text-[#1673B8] font-mono">
                          {rec.targetConc} {rec.concMode} • {rec.targetVolMl} mL
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                        <div className="text-[10px] text-[#5A6C84] font-bold">
                          Exact Mass to Weigh
                        </div>
                        <div className="font-extrabold text-emerald-700 font-mono">
                          {rec.actualGramsToWeigh} g ({rec.purityPct}% purity)
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                        <div className="text-[10px] text-[#5A6C84] font-bold">
                          Normality / Molarity
                        </div>
                        <div className="font-extrabold text-[#1A2138] font-mono">
                          {rec.equivNormality} N / {rec.equivMolarity} M
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                        <div className="text-[10px] text-[#5A6C84] font-bold">
                          Stock (C1) → Desired (C2)
                        </div>
                        <div className="font-extrabold text-[#1A2138] font-mono">
                          C1: {rec.stockC1} → C2: {rec.desiredC2}
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                        <div className="text-[10px] text-[#5A6C84] font-bold">
                          Required Stock Volume (V1)
                        </div>
                        <div className="font-extrabold text-[#1673B8] font-mono">
                          {rec.requiredStockV1Ml} mL
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                        <div className="text-[10px] text-[#5A6C84] font-bold">
                          Water to Add (Final V2 = {rec.finalV2Ml} mL)
                        </div>
                        <div className="font-extrabold text-emerald-700 font-mono">
                          + {rec.waterToAddMl} mL Distilled Water
                        </div>
                      </div>
                    </div>
                  )}

                  {rec.notes && (
                    <div className="text-[11px] text-[#4A5568] bg-white px-3 py-1.5 rounded-lg border border-[#D2DEEA]">
                      <strong className="text-[#1A2138]">Notes:</strong> {rec.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 4. MOISTURE, ASH & PROXIMATE ANALYSIS % CALCULATOR
// ============================================================================
export const MoistureAshYieldTool: React.FC<LabFormulaCalculatorToolProps> = ({
  user,
  isUserPaid = false,
  hasExpiredPremium = false,
  toolsData,
  onSaveToolsData,
  onOpenPremiumModal
}) => {
  const canUsePremium = Boolean(isUserPaid && !hasExpiredPremium);

  const [viewTab, setViewTab] = useState<'calculator' | 'directory'>('calculator');
  const [statusToast, setStatusToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setStatusToast(msg);
    setTimeout(() => {
      setStatusToast((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  const savedRecords: MoistureAshSavedRecord[] = useMemo(
    () => toolsData?.moistureAshData?.savedRecords || [],
    [toolsData?.moistureAshData?.savedRecords]
  );

  // Paid Member Sample Identification & Notes
  const [sampleName, setSampleName] = useState<string>('');
  const [productCategory, setProductCategory] = useState<string>(
    'Flour, Bakery & Biscuits'
  );
  const [sampleNotes, setSampleNotes] = useState<string>('');

  // Directory Search & Filters
  const [dirSearchQuery, setDirSearchQuery] = useState<string>('');
  const [dirCategoryFilter, setDirCategoryFilter] = useState<string>('all');
  const [dirDateFilter, setDirDateFilter] = useState<
    'all' | 'today' | 'week' | 'month'
  >('all');

  // Moisture Dish Weights
  const [mEmptyDish, setMEmptyDish] = useState<string>('24.5120');
  const [mDishPlusWet, setMDishPlusWet] = useState<string>('29.5140');
  const [mDishPlusDry, setMDishPlusDry] = useState<string>('28.9120');

  // Ash Crucible Weights
  const [aEmptyCrucible, setAEmptyCrucible] = useState<string>('18.2100');
  const [aCruciblePlusSample, setACruciblePlusSample] = useState<string>('23.2100');
  const [aCruciblePlusAsh, setACruciblePlusAsh] = useState<string>('18.2950');

  // Kjeldahl Protein
  const [kSampleWeightG, setKSampleWeightG] = useState<string>('1.000');
  const [kSampleTitrationMl, setKSampleTitrationMl] = useState<string>('15.4');
  const [kBlankTitrationMl, setKBlankTitrationMl] = useState<string>('0.2');
  const [kAcidNormality, setKAcidNormality] = useState<string>('0.1');
  const [kProteinFactorSelect, setKProteinFactorSelect] = useState<string>('6.25');
  const [kCustomProteinFactor, setKCustomProteinFactor] = useState<string>('6.25');

  const effectiveProteinFactor = useMemo(() => {
    if (kProteinFactorSelect === 'other') {
      const parsed = Number(kCustomProteinFactor);
      return parsed > 0 ? parsed : 6.25;
    }
    return Number(kProteinFactorSelect) || 6.25;
  }, [kProteinFactorSelect, kCustomProteinFactor]);

  const moistureCalc = useMemo(() => {
    const w1 = Number(mEmptyDish) || 0;
    const w2 = Number(mDishPlusWet) || 0;
    const w3 = Number(mDishPlusDry) || 0;
    const wetSample = Math.max(0.0001, w2 - w1);
    const drySample = Math.max(0, w3 - w1);
    const waterLoss = Math.max(0, w2 - w3);

    const moistureWetBasis = (waterLoss / wetSample) * 100;
    const totalSolidsPct = 100 - moistureWetBasis;
    const moistureDryBasis = drySample > 0 ? (waterLoss / drySample) * 100 : 0;

    return {
      wetSampleG: Number(wetSample.toFixed(4)),
      drySampleG: Number(drySample.toFixed(4)),
      waterLossG: Number(waterLoss.toFixed(4)),
      moistureWetBasis: Number(moistureWetBasis.toFixed(2)),
      totalSolidsPct: Number(totalSolidsPct.toFixed(2)),
      moistureDryBasis: Number(moistureDryBasis.toFixed(2))
    };
  }, [mEmptyDish, mDishPlusWet, mDishPlusDry]);

  const ashCalc = useMemo(() => {
    const c1 = Number(aEmptyCrucible) || 0;
    const c2 = Number(aCruciblePlusSample) || 0;
    const c3 = Number(aCruciblePlusAsh) || 0;
    const sampleW = Math.max(0.0001, c2 - c1);
    const ashW = Math.max(0, c3 - c1);
    const ashWetBasis = (ashW / sampleW) * 100;
    const dryMatterFrac = Math.max(0.01, moistureCalc.totalSolidsPct / 100);
    const ashDryBasis = ashWetBasis / dryMatterFrac;

    return {
      sampleG: Number(sampleW.toFixed(4)),
      ashG: Number(ashW.toFixed(4)),
      ashWetBasis: Number(ashWetBasis.toFixed(3)),
      ashDryBasis: Number(ashDryBasis.toFixed(3))
    };
  }, [
    aEmptyCrucible,
    aCruciblePlusSample,
    aCruciblePlusAsh,
    moistureCalc.totalSolidsPct
  ]);

  const kjeldahlCalc = useMemo(() => {
    const w = Math.max(0.01, Number(kSampleWeightG) || 1);
    const vs = Math.max(0, Number(kSampleTitrationMl) || 0);
    const vb = Math.max(0, Number(kBlankTitrationMl) || 0);
    const n = Math.max(0.001, Number(kAcidNormality) || 0.1);
    const pf = effectiveProteinFactor;

    // % Nitrogen = ((Vs - Vb) * N * 1.4007) / Weight(g)
    const nitrogenPct = Math.max(0, ((vs - vb) * n * 1.4007) / w);
    const crudeProteinPct = nitrogenPct * pf;

    return {
      nitrogenPct: Number(nitrogenPct.toFixed(3)),
      crudeProteinPct: Number(crudeProteinPct.toFixed(2))
    };
  }, [
    kSampleWeightG,
    kSampleTitrationMl,
    kBlankTitrationMl,
    kAcidNormality,
    effectiveProteinFactor
  ]);

  const buildCurrentProximateRecord = (): MoistureAshSavedRecord => {
    const now = new Date();
    const defaultTitle =
      sampleName.trim() ||
      `${productCategory} Sample (${moistureCalc.moistureWetBasis}% Moisture)`;
    return {
      id: `prx-rec-${Date.now()}`,
      recordCode: `PRX-${String(Date.now()).slice(-6)}`,
      sampleName: defaultTitle,
      productCategory,
      notes: sampleNotes.trim() || undefined,
      savedDateFormatted: now.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      savedAtIso: now.toISOString(),

      mEmptyDish: Number(mEmptyDish) || 0,
      mDishPlusWet: Number(mDishPlusWet) || 0,
      mDishPlusDry: Number(mDishPlusDry) || 0,
      wetSampleG: moistureCalc.wetSampleG,
      drySampleG: moistureCalc.drySampleG,
      waterLossG: moistureCalc.waterLossG,
      moistureWetBasis: moistureCalc.moistureWetBasis,
      totalSolidsPct: moistureCalc.totalSolidsPct,
      moistureDryBasis: moistureCalc.moistureDryBasis,

      aEmptyCrucible: Number(aEmptyCrucible) || 0,
      aCruciblePlusSample: Number(aCruciblePlusSample) || 0,
      aCruciblePlusAsh: Number(aCruciblePlusAsh) || 0,
      ashSampleG: ashCalc.sampleG,
      ashResidueG: ashCalc.ashG,
      ashWetBasis: ashCalc.ashWetBasis,
      ashDryBasis: ashCalc.ashDryBasis,

      kSampleWeightG: Number(kSampleWeightG) || 1,
      kSampleTitrationMl: Number(kSampleTitrationMl) || 0,
      kBlankTitrationMl: Number(kBlankTitrationMl) || 0,
      kAcidNormality: Number(kAcidNormality) || 0.1,
      kProteinFactor: effectiveProteinFactor,
      nitrogenPct: kjeldahlCalc.nitrogenPct,
      crudeProteinPct: kjeldahlCalc.crudeProteinPct
    };
  };

  const handleSaveProximateRecord = async () => {
    if (!canUsePremium || !toolsData || !onSaveToolsData) {
      onOpenPremiumModal?.();
      return;
    }
    const newRec = buildCurrentProximateRecord();
    const nextRecords = [newRec, ...savedRecords].slice(0, 200);
    await onSaveToolsData({
      ...toolsData,
      moistureAshData: {
        savedRecords: nextRecords
      },
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    });
    setSampleName('');
    setSampleNotes('');
    showToast(
      `Saved "${newRec.sampleName}" (${newRec.recordCode}) to your Proximate Analysis Directory!`
    );
  };

  const handleDeleteProximateRecord = async (id: string) => {
    if (!canUsePremium || !toolsData || !onSaveToolsData) return;
    const nextRecords = savedRecords.filter((r) => r.id !== id);
    await onSaveToolsData({
      ...toolsData,
      moistureAshData: {
        savedRecords: nextRecords
      },
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    });
    showToast('Removed proximate analysis record from directory.');
  };

  const handleLoadRecordIntoCalculator = (rec: MoistureAshSavedRecord) => {
    setSampleName(rec.sampleName || '');
    if (rec.productCategory) setProductCategory(rec.productCategory);
    setSampleNotes(rec.notes || '');

    if (rec.mEmptyDish !== undefined) setMEmptyDish(String(rec.mEmptyDish));
    if (rec.mDishPlusWet !== undefined) setMDishPlusWet(String(rec.mDishPlusWet));
    if (rec.mDishPlusDry !== undefined) setMDishPlusDry(String(rec.mDishPlusDry));

    if (rec.aEmptyCrucible !== undefined)
      setAEmptyCrucible(String(rec.aEmptyCrucible));
    if (rec.aCruciblePlusSample !== undefined)
      setACruciblePlusSample(String(rec.aCruciblePlusSample));
    if (rec.aCruciblePlusAsh !== undefined)
      setACruciblePlusAsh(String(rec.aCruciblePlusAsh));

    if (rec.kSampleWeightG !== undefined)
      setKSampleWeightG(String(rec.kSampleWeightG));
    if (rec.kSampleTitrationMl !== undefined)
      setKSampleTitrationMl(String(rec.kSampleTitrationMl));
    if (rec.kBlankTitrationMl !== undefined)
      setKBlankTitrationMl(String(rec.kBlankTitrationMl));
    if (rec.kAcidNormality !== undefined)
      setKAcidNormality(String(rec.kAcidNormality));
    if (rec.kProteinFactor !== undefined) {
      const presetFactors = ['6.25', '6.38', '5.70', '5.71', '5.95', '5.55'];
      const pfStr = Number(rec.kProteinFactor).toFixed(2);
      if (presetFactors.includes(pfStr)) {
        setKProteinFactorSelect(pfStr);
      } else {
        setKProteinFactorSelect('other');
        setKCustomProteinFactor(String(rec.kProteinFactor));
      }
    }
    setViewTab('calculator');
    showToast(`Loaded "${rec.sampleName}" (${rec.recordCode}) into Calculator!`);
  };

  // Single Sample Proximate Analysis PDF Report
  const handleDownloadSingleProximatePdf = (rec: MoistureAshSavedRecord) => {
    if (!canUsePremium) {
      onOpenPremiumModal?.();
      return;
    }
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const specialistName = (user?.name || 'Food Safety & QA Specialist').trim();
    const specialistRole = (
      user?.currentRole ||
      user?.qualification ||
      'Food Analytical Chemist'
    ).trim();

    pdf.setFillColor(26, 33, 56);
    pdf.rect(0, 0, 210, 44, 'F');
    drawPdfBrandLogo(pdf, 14, 8, 26, {
      borderColor: [255, 255, 255],
      bgFill: [255, 255, 255],
      roundedRadius: 4
    });

    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Food Science Portal — Proximate & Gravimetric Lab', 45, 17);
    pdf.setFontSize(15.5);
    pdf.text('MOISTURE, ASH & CRUDE PROTEIN ANALYSIS REPORT', 45, 26);
    pdf.setFontSize(9.5);
    pdf.setTextColor(220, 233, 246);
    pdf.text(
      `Report Code: ${rec.recordCode}   •   Analyzed On: ${rec.savedDateFormatted}`,
      45,
      34
    );

    drawPdfUserPhoto(pdf, user?.profilePicUrl, specialistName, 170, 8, 26, {
      borderColor: [255, 255, 255],
      fallbackBgColor: [22, 115, 184],
      fallbackTextColor: [255, 255, 255]
    });

    pdf.setFillColor(240, 246, 252);
    pdf.setDrawColor(187, 214, 238);
    pdf.roundedRect(14, 50, 182, 26, 3, 3, 'FD');

    pdf.setTextColor(26, 33, 56);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text(`Sample / Product Name: ${rec.sampleName}`, 20, 59);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.text(
      `Category: ${rec.productCategory || 'General Food Sample'}   |   Analyst: ${specialistName} (${specialistRole})`,
      20,
      67
    );

    let y = 84;
    // 1. Moisture & Total Solids
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11.5);
    pdf.setTextColor(22, 115, 184);
    pdf.text('1. Gravimetric Oven Moisture & Total Solids (Dry Matter) Analysis', 14, y);
    y += 5;

    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(210, 222, 234);
    pdf.roundedRect(14, y, 182, 42, 3, 3, 'FD');
    pdf.setFontSize(9.5);
    pdf.setTextColor(26, 33, 56);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `Dish Weights: Empty Dish (W1) = ${rec.mEmptyDish} g   |   Dish + Wet (W2) = ${rec.mDishPlusWet} g   |   Dish + Dry (W3) = ${rec.mDishPlusDry} g`,
      20,
      y + 10
    );
    pdf.text(
      `Sample Mass: Wet Sample = ${rec.wetSampleG} g   |   Dried Sample = ${rec.drySampleG} g   |   Moisture Loss = ${rec.waterLossG} g`,
      20,
      y + 19
    );
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(22, 115, 184);
    pdf.text(
      `RESULT: Moisture (Wet Basis) = ${rec.moistureWetBasis}%   |   Total Solids (Dry Matter) = ${rec.totalSolidsPct}%   |   Moisture (Dry Basis) = ${rec.moistureDryBasis}%`,
      20,
      y + 31
    );

    y += 50;
    // 2. Total Ash
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11.5);
    pdf.setTextColor(22, 115, 184);
    pdf.text('2. Muffle Furnace Total Ash Analysis (550°C)', 14, y);
    y += 5;

    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(210, 222, 234);
    pdf.roundedRect(14, y, 182, 38, 3, 3, 'FD');
    pdf.setFontSize(9.5);
    pdf.setTextColor(26, 33, 56);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `Crucible Weights: Empty (W1) = ${rec.aEmptyCrucible} g   |   Crucible + Sample (W2) = ${rec.aCruciblePlusSample} g   |   Crucible + Ash (W3) = ${rec.aCruciblePlusAsh} g`,
      20,
      y + 10
    );
    pdf.text(
      `Net Sample Incinerated = ${rec.ashSampleG} g   |   Net Inorganic Ash Residue = ${rec.ashResidueG} g`,
      20,
      y + 19
    );
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(22, 115, 184);
    pdf.text(
      `RESULT: Total Ash (As-Is Wet Basis) = ${rec.ashWetBasis}%   |   Total Ash (Dry Matter Basis) = ${rec.ashDryBasis}%`,
      20,
      y + 30
    );

    y += 46;
    // 3. Kjeldahl Nitrogen & Crude Protein
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11.5);
    pdf.setTextColor(22, 115, 184);
    pdf.text('3. Kjeldahl Total Nitrogen (% N) & Crude Protein Analysis', 14, y);
    y += 5;

    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(210, 222, 234);
    pdf.roundedRect(14, y, 182, 38, 3, 3, 'FD');
    pdf.setFontSize(9.5);
    pdf.setTextColor(26, 33, 56);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `Digestion Sample = ${rec.kSampleWeightG} g   |   Sample Titre (Vs) = ${rec.kSampleTitrationMl} mL   |   Blank Titre (Vb) = ${rec.kBlankTitrationMl} mL`,
      20,
      y + 10
    );
    pdf.text(
      `Standard Acid Normality = ${rec.kAcidNormality} N   |   Nitrogen-to-Protein Factor = ${rec.kProteinFactor}`,
      20,
      y + 19
    );
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(22, 115, 184);
    pdf.text(
      `RESULT: Total Nitrogen (% N) = ${rec.nitrogenPct}%   |   Crude Protein = ${rec.crudeProteinPct}%`,
      20,
      y + 30
    );

    y += 46;
    if (rec.notes) {
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(210, 222, 234);
      pdf.roundedRect(14, y, 182, 26, 3, 3, 'FD');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(26, 33, 56);
      pdf.text('Analyst / Quality Remarks:', 20, y + 9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(74, 85, 104);
      const wrapped = pdf.splitTextToSize(rec.notes, 170);
      pdf.text(wrapped.slice(0, 2), 20, y + 17);
    }

    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8.5);
    pdf.setTextColor(120, 130, 145);
    pdf.text(
      'Generated by Food Science Portal — Moisture, Ash & Proximate Analysis Suite',
      14,
      284
    );

    pdf.save(`${rec.recordCode}_Proximate_Analysis_Report.pdf`);
    showToast(`Downloaded Proximate Analysis PDF (${rec.recordCode})!`);
  };

  const filteredDirectoryRecords = useMemo(() => {
    const q = dirSearchQuery.trim().toLowerCase();
    const now = new Date();
    return savedRecords.filter((rec) => {
      if (
        dirCategoryFilter !== 'all' &&
        rec.productCategory !== dirCategoryFilter
      ) {
        return false;
      }
      if (dirDateFilter !== 'all' && rec.savedAtIso) {
        const recDate = new Date(rec.savedAtIso);
        const diffDays =
          (now.getTime() - recDate.getTime()) / (1000 * 60 * 60 * 24);
        if (dirDateFilter === 'today' && diffDays > 1) return false;
        if (dirDateFilter === 'week' && diffDays > 7) return false;
        if (dirDateFilter === 'month' && diffDays > 31) return false;
      }
      if (!q) return true;
      return (
        rec.sampleName.toLowerCase().includes(q) ||
        rec.recordCode.toLowerCase().includes(q) ||
        (rec.productCategory || '').toLowerCase().includes(q) ||
        (rec.notes || '').toLowerCase().includes(q)
      );
    });
  }, [savedRecords, dirSearchQuery, dirCategoryFilter, dirDateFilter]);

  const handleDownloadDirectoryLogbookPdf = () => {
    if (!canUsePremium) {
      onOpenPremiumModal?.();
      return;
    }
    if (filteredDirectoryRecords.length === 0) {
      showToast('No saved proximate records to export.');
      return;
    }
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const specialistName = (user?.name || 'Food Safety & QA Specialist').trim();

    pdf.setFillColor(26, 33, 56);
    pdf.rect(0, 0, 210, 42, 'F');
    drawPdfBrandLogo(pdf, 14, 8, 25, {
      borderColor: [255, 255, 255],
      bgFill: [255, 255, 255],
      roundedRadius: 4
    });

    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('Food Science Portal — Proximate Analysis Logbook', 44, 17);
    pdf.setFontSize(15.5);
    pdf.text('MOISTURE, DRY MATTER, ASH & PROTEIN DIRECTORY', 44, 26);
    pdf.setFontSize(9.5);
    pdf.setTextColor(220, 233, 246);
    pdf.text(
      `Specialist: ${specialistName}   •   Total Samples Logged: ${filteredDirectoryRecords.length}`,
      44,
      34
    );

    drawPdfUserPhoto(pdf, user?.profilePicUrl, specialistName, 172, 8, 24, {
      borderColor: [255, 255, 255],
      fallbackBgColor: [22, 115, 184],
      fallbackTextColor: [255, 255, 255]
    });

    let y = 50;
    filteredDirectoryRecords.forEach((rec, idx) => {
      if (y > 250) {
        pdf.addPage();
        y = 20;
      }
      pdf.setFillColor(
        idx % 2 === 0 ? 248 : 240,
        idx % 2 === 0 ? 250 : 246,
        252
      );
      pdf.setDrawColor(210, 222, 234);
      pdf.roundedRect(14, y, 182, 28, 2.5, 2.5, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(26, 33, 56);
      pdf.text(
        `${idx + 1}. [${rec.recordCode}] ${rec.sampleName} — ${rec.productCategory || 'Food Sample'} (${rec.savedDateFormatted})`,
        18,
        y + 7
      );

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.8);
      pdf.setTextColor(22, 115, 184);
      pdf.text(
        `Moisture: ${rec.moistureWetBasis}%  |  Total Solids: ${rec.totalSolidsPct}%  |  Ash (Wet/Dry): ${rec.ashWetBasis}% / ${rec.ashDryBasis}%  |  Nitrogen: ${rec.nitrogenPct}%  |  Crude Protein: ${rec.crudeProteinPct}%`,
        18,
        y + 15
      );

      if (rec.notes) {
        pdf.setTextColor(90, 108, 132);
        pdf.text(`Notes: ${rec.notes.slice(0, 95)}`, 18, y + 22);
      }
      y += 32;
    });

    pdf.save(`Proximate_Analysis_Logbook_${Date.now()}.pdf`);
    showToast('Downloaded Complete Proximate Analysis Logbook PDF!');
  };

  return (
    <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 sm:p-6 shadow-xs space-y-5">
      {/* Toast Notification */}
      {statusToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#1A2138] text-white text-xs font-extrabold shadow-lg flex items-center gap-2 border border-[#1673B8]/40">
          <Check className="w-4 h-4 text-[#60A5FA] shrink-0" />
          <span>{statusToast}</span>
        </div>
      )}

      <div className="border-b border-[#D2DEEA] pb-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1A2138] text-white flex items-center justify-center shrink-0">
            <Beaker className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
                Moisture, Ash &amp; Proximate Analysis % Calculator
              </h2>
              <span className="text-[11px] font-extrabold text-[#1673B8]">
                {canUsePremium
                  ? '· Paid Pro Mode (Sample Log, Directory & COA PDF Unlocked)'
                  : '· Free Basic Calculator'}
              </span>
            </div>
            <p className="text-xs text-[#4A5568] font-medium">
              Gravimetric Oven Moisture %, Total Solids / Dry Matter %, Muffle Furnace Ash % &amp; Kjeldahl Crude Protein %
            </p>
          </div>
        </div>

        {canUsePremium && (
          <div className="flex flex-wrap gap-1.5 bg-[#F0F6FC] p-1 rounded-xl border border-[#D2DEEA]">
            <button
              type="button"
              onClick={() => setViewTab('calculator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                viewTab === 'calculator'
                  ? 'bg-[#1673B8] text-white shadow-2xs'
                  : 'text-[#1A2138] hover:bg-white'
              }`}
            >
              Proximate Calculator
            </button>
            <button
              type="button"
              onClick={() => setViewTab('directory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                viewTab === 'directory'
                  ? 'bg-[#1673B8] text-white shadow-2xs'
                  : 'text-[#1A2138] hover:bg-white'
              }`}
            >
              Saved Proximate Directory ({savedRecords.length})
            </button>
          </div>
        )}
      </div>

      {viewTab === 'calculator' && (
        <>
          {/* PAID MEMBER SAMPLE LOGGING & REPORT HEADER */}
          {canUsePremium && (
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-extrabold text-[#1A2138]">
                  Paid Member Proximate Sample Logger &amp; Certificate of Analysis (COA) PDF
                </div>
                <span className="text-[11px] font-bold text-[#1673B8]">
                  Saves Moisture %, Total Solids %, Ash %, and Crude Protein % together
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Product / Sample Category
                  </label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  >
                    <option value="Flour, Bakery & Biscuits">
                      Flour, Bakery &amp; Biscuits
                    </option>
                    <option value="Milk & Dairy Products">
                      Milk &amp; Dairy Products
                    </option>
                    <option value="Meat, Poultry & Seafood">
                      Meat, Poultry &amp; Seafood
                    </option>
                    <option value="Grains, Cereals & Pulses">
                      Grains, Cereals &amp; Pulses
                    </option>
                    <option value="Sauces, Ketchup & Condiments">
                      Sauces, Ketchup &amp; Condiments
                    </option>
                    <option value="Beverages & Concentrates">
                      Beverages &amp; Concentrates
                    </option>
                    <option value="Spices, Oils & Other">
                      Spices, Oils &amp; Other
                    </option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Sample / Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Wheat Flour Patent / Biscuit Dough"
                    value={sampleName}
                    onChange={(e) => setSampleName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Analyst / Lab Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Oven 105°C for 3 hrs, Muffle 550°C"
                    value={sampleNotes}
                    onChange={(e) => setSampleNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>

                <div className="sm:col-span-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleSaveProximateRecord}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Analysis</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingleProximatePdf(
                        buildCurrentProximateRecord()
                      )
                    }
                    className="py-2.5 px-3 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF Report</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 1. MOISTURE & TOTAL SOLIDS */}
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-extrabold text-[#1673B8] uppercase tracking-wider">
                1. Moisture &amp; Dry Matter (Total Solids) %
              </div>
              <span className="text-[11px] font-bold text-[#4A5568]">
                Formula: Moisture % = ((Dish + Wet Sample - Dish + Dried Sample) / Wet Sample Weight) × 100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Empty Dish Weight (W1 in grams)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={mEmptyDish}
                  onChange={(e) => setMEmptyDish(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Dish + Wet Sample Weight (W2 in grams)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={mDishPlusWet}
                  onChange={(e) => setMDishPlusWet(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Dish + Dried Sample Weight (W3 in grams)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={mDishPlusDry}
                  onChange={(e) => setMDishPlusDry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10.5px] font-bold text-[#4A5568]">Moisture % (Wet Basis)</div>
                <div className="text-lg font-extrabold text-[#1673B8] font-mono">
                  {moistureCalc.moistureWetBasis}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10.5px] font-bold text-[#4A5568]">Total Solids / Dry Matter %</div>
                <div className="text-lg font-extrabold text-[#1A2138] font-mono">
                  {moistureCalc.totalSolidsPct}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10.5px] font-bold text-[#4A5568]">Moisture % (Dry Basis)</div>
                <div className="text-lg font-extrabold text-[#1A2138] font-mono">
                  {moistureCalc.moistureDryBasis}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10.5px] font-bold text-[#4A5568]">Wet Sample / Moisture Loss</div>
                <div className="text-xs font-extrabold text-[#4A5568] font-mono mt-1">
                  {moistureCalc.wetSampleG} g / {moistureCalc.waterLossG} g lost
                </div>
              </div>
            </div>
          </div>

          {/* 2. TOTAL ASH % */}
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-extrabold text-[#1673B8] uppercase tracking-wider">
                2. Total Ash % (Muffle Furnace at 550°C)
              </div>
              <span className="text-[11px] font-bold text-[#4A5568]">
                Formula: Total Ash % = ((Crucible + Ash - Empty Crucible) / Sample Weight) × 100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Empty Crucible Weight (W1 in grams)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={aEmptyCrucible}
                  onChange={(e) => setAEmptyCrucible(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Crucible + Sample Weight (W2 in grams)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={aCruciblePlusSample}
                  onChange={(e) => setACruciblePlusSample(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Crucible + Ash Residue Weight (W3 in grams)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={aCruciblePlusAsh}
                  onChange={(e) => setACruciblePlusAsh(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10.5px] font-bold text-[#4A5568]">Total Ash % (As-Is Basis)</div>
                <div className="text-lg font-extrabold text-[#1673B8] font-mono">
                  {ashCalc.ashWetBasis}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10.5px] font-bold text-[#4A5568]">Total Ash % (Dry Matter Basis)</div>
                <div className="text-lg font-extrabold text-[#1A2138] font-mono">
                  {ashCalc.ashDryBasis}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10.5px] font-bold text-[#4A5568]">Net Ash Residue Weight</div>
                <div className="text-sm font-extrabold text-[#4A5568] font-mono mt-1">
                  {ashCalc.ashG} g (from {ashCalc.sampleG} g sample)
                </div>
              </div>
            </div>
          </div>

          {/* 3. KJELDAHL CRUDE PROTEIN % */}
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-extrabold text-[#1673B8] uppercase tracking-wider">
                3. Kjeldahl Nitrogen &amp; Crude Protein % Calculator
              </div>
              <span className="text-[11px] font-bold text-[#4A5568]">
                Formula: Nitrogen % = ((Sample Titre - Blank Titre) × Acid Normality × 1.4007) / Sample Weight (g)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Sample Weight (grams)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={kSampleWeightG}
                  onChange={(e) => setKSampleWeightG(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Sample Titre Volume (mL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={kSampleTitrationMl}
                  onChange={(e) => setKSampleTitrationMl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Blank Titre Volume (mL)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={kBlankTitrationMl}
                  onChange={(e) => setKBlankTitrationMl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Standard Acid Normality (N)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={kAcidNormality}
                  onChange={(e) => setKAcidNormality(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Nitrogen Factor (N Factor)
                </label>
                <select
                  value={kProteinFactorSelect}
                  onChange={(e) => setKProteinFactorSelect(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                >
                  <option value="6.25">6.25 (Meat / General Food)</option>
                  <option value="6.38">6.38 (Milk &amp; Dairy)</option>
                  <option value="5.70">5.70 (Wheat Flour)</option>
                  <option value="5.71">5.71 (Soybean)</option>
                  <option value="5.95">5.95 (Rice)</option>
                  <option value="5.55">5.55 (Gelatin)</option>
                  <option value="other">Other (Enter Custom Factor)</option>
                </select>
              </div>
            </div>

            {/* Custom N Factor Input Box when "Other" is selected */}
            {kProteinFactorSelect === 'other' && (
              <div className="p-3 rounded-xl bg-white border-2 border-[#1673B8] flex flex-wrap items-center justify-between gap-3">
                <label className="text-xs font-extrabold text-[#1A2138]">
                  Enter Desired Custom Nitrogen-to-Protein Factor:
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={kCustomProteinFactor}
                  onChange={(e) => setKCustomProteinFactor(e.target.value)}
                  placeholder="e.g., 6.10 or 5.83"
                  className="w-44 px-3 py-1.5 rounded-xl bg-[#F0F6FC] border border-[#1673B8] text-xs font-extrabold text-[#1A2138]"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10.5px] font-bold text-[#4A5568]">Total Nitrogen (% N)</div>
                <div className="text-lg font-extrabold text-[#1A2138] font-mono">
                  {kjeldahlCalc.nitrogenPct}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10.5px] font-bold text-[#4A5568]">
                  Crude Protein % (Nitrogen % × {effectiveProteinFactor})
                </div>
                <div className="text-lg font-extrabold text-[#1673B8] font-mono">
                  {kjeldahlCalc.crudeProteinPct}%
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* SAVED PROXIMATE ANALYSIS DIRECTORY TAB (PAID USERS) */}
      {canUsePremium && viewTab === 'directory' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#1A2138]">
                Saved Proximate Analysis Directory ({filteredDirectoryRecords.length})
              </h3>
              <p className="text-xs text-[#5A6C84]">
                Search, reload, or download Certificate of Analysis (COA) PDF reports for all saved Moisture, Total Solids, Ash &amp; Protein records.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadDirectoryLogbookPdf}
              className="px-4 py-2.5 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4" />
              <span>Download Full Proximate Logbook PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-[#5A6C84] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by sample name, category, or record code (PRX-...)..."
                value={dirSearchQuery}
                onChange={(e) => setDirSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              />
            </div>
            <div className="sm:col-span-3">
              <select
                value={dirCategoryFilter}
                onChange={(e) => setDirCategoryFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              >
                <option value="all">All Categories</option>
                <option value="Flour, Bakery & Biscuits">
                  Flour, Bakery &amp; Biscuits
                </option>
                <option value="Milk & Dairy Products">
                  Milk &amp; Dairy Products
                </option>
                <option value="Meat, Poultry & Seafood">
                  Meat, Poultry &amp; Seafood
                </option>
                <option value="Grains, Cereals & Pulses">
                  Grains, Cereals &amp; Pulses
                </option>
                <option value="Sauces, Ketchup & Condiments">
                  Sauces, Ketchup &amp; Condiments
                </option>
                <option value="Beverages & Concentrates">
                  Beverages &amp; Concentrates
                </option>
                <option value="Spices, Oils & Other">
                  Spices, Oils &amp; Other
                </option>
              </select>
            </div>
            <div className="sm:col-span-3">
              <select
                value={dirDateFilter}
                onChange={(e) =>
                  setDirDateFilter(
                    e.target.value as 'all' | 'today' | 'week' | 'month'
                  )
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>

          {filteredDirectoryRecords.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#F8FAFC] border border-dashed border-[#94B8D7] text-center space-y-2">
              <div className="text-sm font-extrabold text-[#1A2138]">
                No Saved Proximate Analysis Records Found
              </div>
              <p className="text-xs text-[#5A6C84]">
                Enter your sample details in the Proximate Calculator tab and click &ldquo;Save Analysis&rdquo; to store records here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDirectoryRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA] hover:border-[#1673B8] transition-colors space-y-2.5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-[#1A2138] text-white text-[10px] font-extrabold font-mono">
                          {rec.recordCode}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#EBF4FC] text-[#1673B8] text-[10px] font-extrabold">
                          {rec.productCategory || 'Food Sample'}
                        </span>
                        <span className="text-[11px] font-bold text-[#5A6C84]">
                          {rec.savedDateFormatted}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-[#1A2138] mt-1">
                        {rec.sampleName}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleLoadRecordIntoCalculator(rec)}
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#EBF4FC] border border-[#94B8D7] text-[#1A2138] text-[11px] font-extrabold cursor-pointer"
                      >
                        Load into Calculator
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadSingleProximatePdf(rec)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#1673B8] hover:bg-[#105E9A] text-white text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF Report</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProximateRecord(rec.id)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                      <div className="text-[10px] text-[#5A6C84] font-bold">
                        Moisture (Wet Basis)
                      </div>
                      <div className="font-extrabold text-[#1673B8] font-mono">
                        {rec.moistureWetBasis}%
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                      <div className="text-[10px] text-[#5A6C84] font-bold">
                        Total Solids / Dry Matter
                      </div>
                      <div className="font-extrabold text-[#1A2138] font-mono">
                        {rec.totalSolidsPct}%
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                      <div className="text-[10px] text-[#5A6C84] font-bold">
                        Total Ash (Wet / Dry)
                      </div>
                      <div className="font-extrabold text-[#1A2138] font-mono">
                        {rec.ashWetBasis}% / {rec.ashDryBasis}%
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                      <div className="text-[10px] text-[#5A6C84] font-bold">
                        Kjeldahl Nitrogen (% N)
                      </div>
                      <div className="font-extrabold text-[#1A2138] font-mono">
                        {rec.nitrogenPct}%
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                      <div className="text-[10px] text-[#5A6C84] font-bold">
                        Crude Protein (×{rec.kProteinFactor})
                      </div>
                      <div className="font-extrabold text-emerald-700 font-mono">
                        {rec.crudeProteinPct}%
                      </div>
                    </div>
                  </div>

                  {rec.notes && (
                    <div className="text-[11px] text-[#4A5568] bg-white px-3 py-1.5 rounded-lg border border-[#D2DEEA]">
                      <strong className="text-[#1A2138]">Notes:</strong> {rec.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 5. PRODUCTION FLOOR, LINE EFFICIENCY, SYRUP ROOM & WORKERS TOOL
// ============================================================================
export const ProductionFloorWorkersTool: React.FC<LabFormulaCalculatorToolProps> = ({
  user,
  isUserPaid = false,
  hasExpiredPremium = false,
  toolsData,
  onSaveToolsData,
  onOpenPremiumModal
}) => {
  const canUsePremium = Boolean(isUserPaid && !hasExpiredPremium);

  const [viewTab, setViewTab] = useState<
    'calculator' | 'directory' | 'analytics'
  >('calculator');
  const [statusToast, setStatusToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setStatusToast(msg);
    setTimeout(() => {
      setStatusToast((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  const savedRecords: ProductionFloorSavedRecord[] = useMemo(
    () => toolsData?.productionFloorData?.savedRecords || [],
    [toolsData?.productionFloorData?.savedRecords]
  );

  // Paid Member Plant / Line / Shift Identification
  const [plantCompanyName, setPlantCompanyName] = useState<string>(
    () =>
      toolsData?.productionFloorData?.defaultPlantName ||
      user?.company ||
      'Food & Beverage Processing Plant'
  );
  const [lineOrProductName, setLineOrProductName] = useState<string>(
    'Line 1 — Beverage / Food Trays'
  );
  const [shiftName, setShiftName] = useState<string>('Morning Shift (A)');
  const [productionDate, setProductionDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [shiftNotes, setShiftNotes] = useState<string>('');

  // 1. 1-HOUR MACHINE EFFICIENCY (TRAYS / HOUR)
  const [machineSpeedTraysPerHour, setMachineSpeedTraysPerHour] =
    useState<string>('1000');
  const [oneHourActualTrays, setOneHourActualTrays] = useState<string>('880');

  // 2. FULL-DAY NET EFFICIENCY (START TIME, LATE START, BREAK, CIP, DOWNTIME, TOTAL TRAYS)
  const [scheduledStartTime, setScheduledStartTime] = useState<string>('08:00');
  const [actualStartTime, setActualStartTime] = useState<string>('08:25');
  const [lateStartMins, setLateStartMins] = useState<string>('25');
  const [totalShiftHours, setTotalShiftHours] = useState<string>('8');
  const [breakMins, setBreakMins] = useState<string>('45');
  const [cipMins, setCipMins] = useState<string>('40');
  const [unplannedDowntimeMins, setUnplannedDowntimeMins] =
    useState<string>('20');
  const [totalFullDayTrays, setTotalFullDayTrays] = useState<string>('5850');
  const [rejectedTrays, setRejectedTrays] = useState<string>('35');
  const [workersCount, setWorkersCount] = useState<string>('12');

  // Helper to auto-sync Late Start minutes when Scheduled or Actual Start Time changes
  const computeLateMinsFromTimes = (sched: string, actual: string): number => {
    const [sh, sm] = sched.split(':').map(Number);
    const [ah, am] = actual.split(':').map(Number);
    if (
      Number.isNaN(sh) ||
      Number.isNaN(sm) ||
      Number.isNaN(ah) ||
      Number.isNaN(am)
    ) {
      return 0;
    }
    const diff = ah * 60 + am - (sh * 60 + sm);
    return Math.max(0, diff);
  };

  // 3. SYRUP ROOM / PREPARATION ROOM BATCH EFFICIENCY
  const [syrupUnit, setSyrupUnit] = useState<'Liters' | 'kg'>('Liters');
  const [syrupPreparedTotal, setSyrupPreparedTotal] = useState<string>('5000');
  const [syrupPackedTotal, setSyrupPackedTotal] = useState<string>('4860');
  const [syrupCustomWasteInput, setSyrupCustomWasteInput] =
    useState<string>('');
  const [syrupCostPerUnit, setSyrupCostPerUnit] = useState<string>('95');

  // 4. RAW-TO-PACKED PROCESS YIELD & WASTAGE
  const [rawInputKg, setRawInputKg] = useState<string>('1200');
  const [trimmedPreppedKg, setTrimmedPreppedKg] = useState<string>('1050');
  const [finalPackedKg, setFinalPackedKg] = useState<string>('990');
  const [rawCostPerKg, setRawCostPerKg] = useState<string>('220');

  // Directory & Analytics Filters
  const [dirSearchQuery, setDirSearchQuery] = useState<string>('');
  const [dirPlantFilter, setDirPlantFilter] = useState<string>('all');
  const [dirPeriodFilter, setDirPeriodFilter] = useState<
    'all' | 'today' | 'week' | 'month' | 'year'
  >('all');
  const [analyticsGrouping, setAnalyticsGrouping] = useState<
    'daily' | 'weekly' | 'monthly' | 'yearly'
  >('daily');

  // 1-Hour Efficiency Calculation
  const oneHourStats = useMemo(() => {
    const ratedPerHr = Math.max(1, Number(machineSpeedTraysPerHour) || 1000);
    const actual1Hr = Math.max(0, Number(oneHourActualTrays) || 0);
    const efficiencyPct = (actual1Hr / ratedPerHr) * 100;
    const lostTrays = Math.max(0, ratedPerHr - actual1Hr);
    const ratedPerMin = ratedPerHr / 60;
    const actualPerMin = actual1Hr / 60;

    return {
      ratedPerHr,
      actual1Hr,
      efficiencyPct: Number(efficiencyPct.toFixed(2)),
      lostTrays: Number(lostTrays.toFixed(0)),
      ratedPerMin: Number(ratedPerMin.toFixed(2)),
      actualPerMin: Number(actualPerMin.toFixed(2))
    };
  }, [machineSpeedTraysPerHour, oneHourActualTrays]);

  // Full-Day Net Efficiency Calculation (with Late Start, Break, CIP, Unplanned Downtime)
  const fullDayStats = useMemo(() => {
    const speedPerHr = Math.max(1, Number(machineSpeedTraysPerHour) || 1000);
    const speedPerMin = speedPerHr / 60;
    const shiftHrs = Math.max(1, Number(totalShiftHours) || 8);
    const totalShiftMins = shiftHrs * 60;

    const lateMins = Math.max(0, Number(lateStartMins) || 0);
    const brkMins = Math.max(0, Number(breakMins) || 0);
    const cipSanitationMins = Math.max(0, Number(cipMins) || 0);
    const breakdownMins = Math.max(0, Number(unplannedDowntimeMins) || 0);

    const totalTrays = Math.max(0, Number(totalFullDayTrays) || 0);
    const rejects = Math.max(0, Number(rejectedTrays) || 0);
    const goodTrays = Math.max(0, totalTrays - rejects);
    const workers = Math.max(1, Number(workersCount) || 1);

    // 1. Gross Shift Target (100% of total shift hours without deductions)
    const grossShiftTargetTrays = shiftHrs * speedPerHr;
    const grossShiftEfficiencyPct =
      grossShiftTargetTrays > 0
        ? (totalTrays / grossShiftTargetTrays) * 100
        : 0;

    // 2. Scheduled Net Production Time (Shift minus Planned Break & Planned CIP)
    // Late Start & Unplanned Downtime remain inside Net Production Time so they directly impact Net Efficiency
    const netAvailableMinsAfterBreakCip = Math.max(
      15,
      totalShiftMins - brkMins - cipSanitationMins
    );
    const netAvailableHoursAfterBreakCip = netAvailableMinsAfterBreakCip / 60;
    const netTargetTraysAfterBreakCip =
      netAvailableMinsAfterBreakCip * speedPerMin;

    const netEfficiencyPct =
      netTargetTraysAfterBreakCip > 0
        ? (totalTrays / netTargetTraysAfterBreakCip) * 100
        : 0;

    // 3. Actual Running Time (Deducting Late Start + Break + CIP + Breakdown)
    const actualRunningMins = Math.max(
      10,
      totalShiftMins - lateMins - brkMins - cipSanitationMins - breakdownMins
    );
    const actualRunningHours = actualRunningMins / 60;
    const theoreticalTraysDuringRunning = actualRunningMins * speedPerMin;
    const runningSpeedPerformancePct =
      theoreticalTraysDuringRunning > 0
        ? (totalTrays / theoreticalTraysDuringRunning) * 100
        : 0;

    // Availability % = Actual Running Mins / Net Available Mins (after Break & CIP)
    const availabilityPct =
      (actualRunningMins / netAvailableMinsAfterBreakCip) * 100;
    const qualityPct = totalTrays > 0 ? (goodTrays / totalTrays) * 100 : 100;

    const oeePct =
      (Math.min(100, availabilityPct) / 100) *
      (Math.min(100, runningSpeedPerformancePct) / 100) *
      (Math.min(100, qualityPct) / 100) *
      100;

    // Trays Equivalent for each Factor
    const traysLostToLateStart = Math.round(lateMins * speedPerMin);
    const traysInBreakTime = Math.round(brkMins * speedPerMin);
    const traysInCipTime = Math.round(cipSanitationMins * speedPerMin);
    const traysLostToBreakdown = Math.round(breakdownMins * speedPerMin);

    const lateStartImpactPct =
      netTargetTraysAfterBreakCip > 0
        ? (traysLostToLateStart / netTargetTraysAfterBreakCip) * 100
        : 0;

    const traysPerWorkerShift = goodTrays / workers;
    const traysPerWorkerHour = traysPerWorkerShift / shiftHrs;

    return {
      totalShiftMins,
      netAvailableMinsAfterBreakCip: Math.round(netAvailableMinsAfterBreakCip),
      netAvailableHoursAfterBreakCip: Number(
        netAvailableHoursAfterBreakCip.toFixed(2)
      ),
      actualRunningMins: Math.round(actualRunningMins),
      actualRunningHours: Number(actualRunningHours.toFixed(2)),
      grossShiftTargetTrays: Math.round(grossShiftTargetTrays),
      netTargetTraysAfterBreakCip: Math.round(netTargetTraysAfterBreakCip),
      theoreticalTraysDuringRunning: Math.round(theoreticalTraysDuringRunning),
      goodTrays,
      grossShiftEfficiencyPct: Number(grossShiftEfficiencyPct.toFixed(2)),
      netEfficiencyPct: Number(netEfficiencyPct.toFixed(2)),
      runningSpeedPerformancePct: Number(runningSpeedPerformancePct.toFixed(2)),
      availabilityPct: Number(Math.min(100, availabilityPct).toFixed(1)),
      qualityPct: Number(Math.min(100, qualityPct).toFixed(2)),
      oeePct: Number(Math.min(100, oeePct).toFixed(1)),
      traysLostToLateStart,
      traysInBreakTime,
      traysInCipTime,
      traysLostToBreakdown,
      lateStartImpactPct: Number(lateStartImpactPct.toFixed(2)),
      traysPerWorkerShift: Math.round(traysPerWorkerShift),
      traysPerWorkerHour: Math.round(traysPerWorkerHour)
    };
  }, [
    machineSpeedTraysPerHour,
    totalShiftHours,
    lateStartMins,
    breakMins,
    cipMins,
    unplannedDowntimeMins,
    totalFullDayTrays,
    rejectedTrays,
    workersCount
  ]);

  // Syrup Room / Preparation Room Batch Efficiency Calculation
  const syrupStats = useMemo(() => {
    const prepared = Math.max(0.1, Number(syrupPreparedTotal) || 5000);
    const packed = Math.max(0, Number(syrupPackedTotal) || 0);
    const calculatedLoss = Math.max(0, prepared - packed);
    const wasteTotal =
      syrupCustomWasteInput.trim() !== ''
        ? Math.max(0, Number(syrupCustomWasteInput) || 0)
        : calculatedLoss;

    const batchEfficiencyPct = (packed / prepared) * 100;
    const wastagePct = (wasteTotal / prepared) * 100;
    const unaccountedDiff = Number((calculatedLoss - wasteTotal).toFixed(2));
    const unitRate = Math.max(0, Number(syrupCostPerUnit) || 0);
    const wasteCostRs = wasteTotal * unitRate;

    return {
      prepared: Number(prepared.toFixed(2)),
      packed: Number(packed.toFixed(2)),
      wasteTotal: Number(wasteTotal.toFixed(2)),
      calculatedLoss: Number(calculatedLoss.toFixed(2)),
      unaccountedDiff,
      batchEfficiencyPct: Number(batchEfficiencyPct.toFixed(2)),
      wastagePct: Number(wastagePct.toFixed(2)),
      wasteCostRs: Math.round(wasteCostRs)
    };
  }, [
    syrupPreparedTotal,
    syrupPackedTotal,
    syrupCustomWasteInput,
    syrupCostPerUnit
  ]);

  // Process Yield & Wastage Calculation
  const yieldStats = useMemo(() => {
    const raw = Math.max(1, Number(rawInputKg) || 1200);
    const prepped = Math.max(0, Number(trimmedPreppedKg) || 1050);
    const finalOut = Math.max(0, Number(finalPackedKg) || 990);
    const costKg = Math.max(0, Number(rawCostPerKg) || 0);

    const prepYieldPct = (prepped / raw) * 100;
    const netProcessYieldPct = (finalOut / raw) * 100;
    const totalLossKg = Math.max(0, raw - finalOut);
    const totalLossPct = (totalLossKg / raw) * 100;
    const effectiveRawCostPerFinalKg =
      finalOut > 0 ? (raw * costKg) / finalOut : 0;

    return {
      prepYieldPct: Number(prepYieldPct.toFixed(2)),
      netProcessYieldPct: Number(netProcessYieldPct.toFixed(2)),
      totalLossKg: Number(totalLossKg.toFixed(2)),
      totalLossPct: Number(totalLossPct.toFixed(2)),
      effectiveRawCostPerFinalKg: Number(effectiveRawCostPerFinalKg.toFixed(2))
    };
  }, [rawInputKg, trimmedPreppedKg, finalPackedKg, rawCostPerKg]);

  const buildCurrentProductionRecord = (): ProductionFloorSavedRecord => {
    const now = new Date();
    const cleanPlant =
      plantCompanyName.trim() || 'Food & Beverage Processing Plant';
    const cleanLine =
      lineOrProductName.trim() || 'Production Line 1';
    const dateStr = productionDate || now.toISOString().slice(0, 10);

    return {
      id: `prd-rec-${Date.now()}`,
      recordCode: `PRD-${String(Date.now()).slice(-6)}`,
      plantCompanyName: cleanPlant,
      lineOrProductName: cleanLine,
      shiftName: shiftName || 'Morning Shift (A)',
      productionDate: dateStr,
      savedDateFormatted: `${dateStr} (${now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      })})`,
      savedAtIso: now.toISOString(),
      notes: shiftNotes.trim() || undefined,

      machineSpeedTraysPerHour: oneHourStats.ratedPerHr,
      oneHourActualTrays: oneHourStats.actual1Hr,
      oneHourEfficiencyPct: oneHourStats.efficiencyPct,
      oneHourLostTrays: oneHourStats.lostTrays,

      scheduledStartTime,
      actualStartTime,
      totalShiftHours: Number(totalShiftHours) || 8,
      lateStartMins: Number(lateStartMins) || 0,
      breakMins: Number(breakMins) || 0,
      cipMins: Number(cipMins) || 0,
      unplannedDowntimeMins: Number(unplannedDowntimeMins) || 0,
      totalFullDayTrays: Number(totalFullDayTrays) || 0,
      rejectedTrays: Number(rejectedTrays) || 0,
      goodFullDayTrays: fullDayStats.goodTrays,
      workersCount: Number(workersCount) || 1,
      fullDayGrossEfficiencyPct: fullDayStats.grossShiftEfficiencyPct,
      fullDayNetOperatingEfficiencyPct: fullDayStats.netEfficiencyPct,
      fullDayOeePct: fullDayStats.oeePct,
      traysPerWorkerHour: fullDayStats.traysPerWorkerHour,

      syrupUnit,
      syrupPreparedTotal: syrupStats.prepared,
      syrupPackedTotal: syrupStats.packed,
      syrupWasteTotal: syrupStats.wasteTotal,
      syrupBatchEfficiencyPct: syrupStats.batchEfficiencyPct,
      syrupWastagePct: syrupStats.wastagePct,
      syrupCostPerUnit: Number(syrupCostPerUnit) || 0,
      syrupWasteCostRs: syrupStats.wasteCostRs,

      rawInputKg: Number(rawInputKg) || 0,
      trimmedPreppedKg: Number(trimmedPreppedKg) || 0,
      finalPackedKg: Number(finalPackedKg) || 0,
      rawCostPerKg: Number(rawCostPerKg) || 0,
      prepYieldPct: yieldStats.prepYieldPct,
      netProcessYieldPct: yieldStats.netProcessYieldPct,
      totalLossKg: yieldStats.totalLossKg,
      totalLossPct: yieldStats.totalLossPct,
      effectiveRawCostPerFinalKg: yieldStats.effectiveRawCostPerFinalKg
    };
  };

  const handleSaveProductionRecord = async () => {
    if (!canUsePremium || !toolsData || !onSaveToolsData) {
      onOpenPremiumModal?.();
      return;
    }
    const newRec = buildCurrentProductionRecord();
    const nextRecords = [newRec, ...savedRecords].slice(0, 365);
    await onSaveToolsData({
      ...toolsData,
      productionFloorData: {
        defaultPlantName: newRec.plantCompanyName,
        savedRecords: nextRecords
      },
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    });
    setShiftNotes('');
    showToast(
      `Saved Shift Record "${newRec.lineOrProductName}" (${newRec.recordCode}) to your Plant Directory!`
    );
  };

  const handleDeleteProductionRecord = async (id: string) => {
    if (!canUsePremium || !toolsData || !onSaveToolsData) return;
    const nextRecords = savedRecords.filter((r) => r.id !== id);
    await onSaveToolsData({
      ...toolsData,
      productionFloorData: {
        defaultPlantName: plantCompanyName.trim(),
        savedRecords: nextRecords
      },
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    });
    showToast('Removed production record from directory.');
  };

  const handleLoadRecordIntoCalculator = (rec: ProductionFloorSavedRecord) => {
    setPlantCompanyName(rec.plantCompanyName || '');
    setLineOrProductName(rec.lineOrProductName || '');
    setShiftName(rec.shiftName || 'Morning Shift (A)');
    setProductionDate(rec.productionDate || new Date().toISOString().slice(0, 10));
    setShiftNotes(rec.notes || '');

    setMachineSpeedTraysPerHour(String(rec.machineSpeedTraysPerHour));
    setOneHourActualTrays(String(rec.oneHourActualTrays));

    setScheduledStartTime(rec.scheduledStartTime || '08:00');
    setActualStartTime(rec.actualStartTime || '08:25');
    setTotalShiftHours(String(rec.totalShiftHours));
    setLateStartMins(String(rec.lateStartMins));
    setBreakMins(String(rec.breakMins));
    setCipMins(String(rec.cipMins));
    setUnplannedDowntimeMins(String(rec.unplannedDowntimeMins));
    setTotalFullDayTrays(String(rec.totalFullDayTrays));
    setRejectedTrays(String(rec.rejectedTrays));
    setWorkersCount(String(rec.workersCount));

    setSyrupUnit(rec.syrupUnit || 'Liters');
    setSyrupPreparedTotal(String(rec.syrupPreparedTotal));
    setSyrupPackedTotal(String(rec.syrupPackedTotal));
    setSyrupCustomWasteInput(String(rec.syrupWasteTotal));
    setSyrupCostPerUnit(String(rec.syrupCostPerUnit || 0));

    setRawInputKg(String(rec.rawInputKg));
    setTrimmedPreppedKg(String(rec.trimmedPreppedKg));
    setFinalPackedKg(String(rec.finalPackedKg));
    setRawCostPerKg(String(rec.rawCostPerKg));

    setViewTab('calculator');
    showToast(`Loaded "${rec.lineOrProductName}" (${rec.recordCode}) into Calculator!`);
  };

  // Distinct Plant Names for filtering
  const uniquePlantNames = useMemo(() => {
    const set = new Set<string>();
    savedRecords.forEach((r) => {
      if (r.plantCompanyName) set.add(r.plantCompanyName);
    });
    return Array.from(set);
  }, [savedRecords]);

  // Filtered Directory Records
  const filteredDirectoryRecords = useMemo(() => {
    const q = dirSearchQuery.trim().toLowerCase();
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    return savedRecords.filter((rec) => {
      if (
        dirPlantFilter !== 'all' &&
        rec.plantCompanyName !== dirPlantFilter
      ) {
        return false;
      }
      if (dirPeriodFilter !== 'all') {
        const dStr = rec.productionDate || rec.savedAtIso.slice(0, 10);
        if (dirPeriodFilter === 'today' && dStr !== todayStr) return false;
        const recDate = new Date(dStr);
        const diffDays =
          (now.getTime() - recDate.getTime()) / (1000 * 60 * 60 * 24);
        if (dirPeriodFilter === 'week' && diffDays > 7) return false;
        if (dirPeriodFilter === 'month' && diffDays > 31) return false;
        if (dirPeriodFilter === 'year' && diffDays > 366) return false;
      }
      if (!q) return true;
      return (
        rec.plantCompanyName.toLowerCase().includes(q) ||
        rec.lineOrProductName.toLowerCase().includes(q) ||
        rec.shiftName.toLowerCase().includes(q) ||
        rec.recordCode.toLowerCase().includes(q) ||
        rec.productionDate.toLowerCase().includes(q) ||
        (rec.notes || '').toLowerCase().includes(q)
      );
    });
  }, [savedRecords, dirSearchQuery, dirPlantFilter, dirPeriodFilter]);

  // Daily / Weekly / Monthly / Yearly Plant Efficiency Aggregations
  const analyticsGroups = useMemo(() => {
    const source =
      dirPlantFilter === 'all'
        ? savedRecords
        : savedRecords.filter((r) => r.plantCompanyName === dirPlantFilter);

    const map = new Map<
      string,
      {
        periodKey: string;
        periodLabel: string;
        shiftsCount: number;
        avgOneHourEff: number;
        avgFullDayNetEff: number;
        avgFullDayGrossEff: number;
        avgOee: number;
        avgSyrupEff: number;
        avgProcessYield: number;
        totalTrays: number;
        totalSyrupPrepared: number;
        totalSyrupPacked: number;
        totalSyrupWaste: number;
        totalLateMins: number;
        totalBreakMins: number;
        totalCipMins: number;
      }
    >();

    const getPeriodKeyAndLabel = (dateStr: string) => {
      const clean = dateStr || new Date().toISOString().slice(0, 10);
      const d = new Date(clean + 'T00:00:00');
      if (Number.isNaN(d.getTime())) {
        return { key: clean, label: clean };
      }
      if (analyticsGrouping === 'daily') {
        return { key: clean, label: `Day: ${clean}` };
      }
      if (analyticsGrouping === 'weekly') {
        // ISO week start (Monday)
        const dayOfWeek = d.getDay() || 7;
        const monday = new Date(d);
        monday.setDate(d.getDate() - dayOfWeek + 1);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        const mStr = monday.toISOString().slice(0, 10);
        const sStr = sunday.toISOString().slice(5, 10);
        return {
          key: `W-${mStr}`,
          label: `Week of ${mStr} to ${sStr}`
        };
      }
      if (analyticsGrouping === 'monthly') {
        const ym = clean.slice(0, 7);
        const monthLabel = d.toLocaleDateString('en-GB', {
          month: 'long',
          year: 'numeric'
        });
        return { key: ym, label: `Month: ${monthLabel}` };
      }
      // yearly
      const yr = clean.slice(0, 4);
      return { key: yr, label: `Year: ${yr}` };
    };

    source.forEach((rec) => {
      const { key, label } = getPeriodKeyAndLabel(rec.productionDate);
      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          periodKey: key,
          periodLabel: label,
          shiftsCount: 1,
          avgOneHourEff: rec.oneHourEfficiencyPct,
          avgFullDayNetEff: rec.fullDayNetOperatingEfficiencyPct,
          avgFullDayGrossEff: rec.fullDayGrossEfficiencyPct,
          avgOee: rec.fullDayOeePct,
          avgSyrupEff: rec.syrupBatchEfficiencyPct,
          avgProcessYield: rec.netProcessYieldPct,
          totalTrays: rec.totalFullDayTrays,
          totalSyrupPrepared: rec.syrupPreparedTotal,
          totalSyrupPacked: rec.syrupPackedTotal,
          totalSyrupWaste: rec.syrupWasteTotal,
          totalLateMins: rec.lateStartMins,
          totalBreakMins: rec.breakMins,
          totalCipMins: rec.cipMins
        });
      } else {
        const n = existing.shiftsCount + 1;
        existing.avgOneHourEff = Number(
          (
            (existing.avgOneHourEff * existing.shiftsCount +
              rec.oneHourEfficiencyPct) /
            n
          ).toFixed(2)
        );
        existing.avgFullDayNetEff = Number(
          (
            (existing.avgFullDayNetEff * existing.shiftsCount +
              rec.fullDayNetOperatingEfficiencyPct) /
            n
          ).toFixed(2)
        );
        existing.avgFullDayGrossEff = Number(
          (
            (existing.avgFullDayGrossEff * existing.shiftsCount +
              rec.fullDayGrossEfficiencyPct) /
            n
          ).toFixed(2)
        );
        existing.avgOee = Number(
          ((existing.avgOee * existing.shiftsCount + rec.fullDayOeePct) / n).toFixed(
            1
          )
        );
        existing.avgSyrupEff = Number(
          (
            (existing.avgSyrupEff * existing.shiftsCount +
              rec.syrupBatchEfficiencyPct) /
            n
          ).toFixed(2)
        );
        existing.avgProcessYield = Number(
          (
            (existing.avgProcessYield * existing.shiftsCount +
              rec.netProcessYieldPct) /
            n
          ).toFixed(2)
        );
        existing.shiftsCount = n;
        existing.totalTrays += rec.totalFullDayTrays;
        existing.totalSyrupPrepared = Number(
          (existing.totalSyrupPrepared + rec.syrupPreparedTotal).toFixed(1)
        );
        existing.totalSyrupPacked = Number(
          (existing.totalSyrupPacked + rec.syrupPackedTotal).toFixed(1)
        );
        existing.totalSyrupWaste = Number(
          (existing.totalSyrupWaste + rec.syrupWasteTotal).toFixed(1)
        );
        existing.totalLateMins += rec.lateStartMins;
        existing.totalBreakMins += rec.breakMins;
        existing.totalCipMins += rec.cipMins;
      }
    });

    return Array.from(map.values()).sort((a, b) =>
      b.periodKey.localeCompare(a.periodKey)
    );
  }, [savedRecords, dirPlantFilter, analyticsGrouping]);

  // Overall Plant Summary KPIs across filtered records
  const overallPlantKpis = useMemo(() => {
    const source =
      dirPlantFilter === 'all'
        ? savedRecords
        : savedRecords.filter((r) => r.plantCompanyName === dirPlantFilter);
    if (source.length === 0) {
      return {
        totalShifts: 0,
        avg1HrEff: 0,
        avgNetDayEff: 0,
        avgSyrupEff: 0,
        avgProcessYield: 0,
        totalTraysProduced: 0,
        totalSyrupWaste: 0,
        totalLateStartHrs: 0,
        totalCipHrs: 0
      };
    }
    const n = source.length;
    const sum1Hr = source.reduce((s, r) => s + r.oneHourEfficiencyPct, 0);
    const sumNetDay = source.reduce(
      (s, r) => s + r.fullDayNetOperatingEfficiencyPct,
      0
    );
    const sumSyrup = source.reduce((s, r) => s + r.syrupBatchEfficiencyPct, 0);
    const sumYield = source.reduce((s, r) => s + r.netProcessYieldPct, 0);
    const totalTraysProduced = source.reduce(
      (s, r) => s + r.totalFullDayTrays,
      0
    );
    const totalSyrupWaste = source.reduce((s, r) => s + r.syrupWasteTotal, 0);
    const totalLateMins = source.reduce((s, r) => s + r.lateStartMins, 0);
    const totalCipMins = source.reduce((s, r) => s + r.cipMins, 0);

    return {
      totalShifts: n,
      avg1HrEff: Number((sum1Hr / n).toFixed(2)),
      avgNetDayEff: Number((sumNetDay / n).toFixed(2)),
      avgSyrupEff: Number((sumSyrup / n).toFixed(2)),
      avgProcessYield: Number((sumYield / n).toFixed(2)),
      totalTraysProduced,
      totalSyrupWaste: Number(totalSyrupWaste.toFixed(1)),
      totalLateStartHrs: Number((totalLateMins / 60).toFixed(1)),
      totalCipHrs: Number((totalCipMins / 60).toFixed(1))
    };
  }, [savedRecords, dirPlantFilter]);

  // Download Single Shift / Batch Production & Syrup Room Efficiency PDF Report
  const handleDownloadSingleProductionPdf = (
    rec: ProductionFloorSavedRecord
  ) => {
    if (!canUsePremium) {
      onOpenPremiumModal?.();
      return;
    }
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const specialistName = (user?.name || 'Production & QA Specialist').trim();
    const specialistRole = (
      user?.currentRole ||
      user?.qualification ||
      'Production & Plant Operations Manager'
    ).trim();

    pdf.setFillColor(26, 33, 56);
    pdf.rect(0, 0, 210, 44, 'F');
    drawPdfBrandLogo(pdf, 14, 8, 26, {
      borderColor: [255, 255, 255],
      bgFill: [255, 255, 255],
      roundedRadius: 4
    });

    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13.5);
    pdf.text(
      `${rec.plantCompanyName.slice(0, 48)} — Production Efficiency Report`,
      45,
      17
    );
    pdf.setFontSize(15);
    pdf.text('1-HR & FULL-DAY NET EFFICIENCY, SYRUP ROOM & YIELD', 45, 26);
    pdf.setFontSize(9.2);
    pdf.setTextColor(220, 233, 246);
    pdf.text(
      `Record Code: ${rec.recordCode}   •   Production Date: ${rec.productionDate}   •   ${rec.shiftName}`,
      45,
      34
    );

    drawPdfUserPhoto(pdf, user?.profilePicUrl, specialistName, 170, 8, 26, {
      borderColor: [255, 255, 255],
      fallbackBgColor: [22, 115, 184],
      fallbackTextColor: [255, 255, 255]
    });

    // Plant & Specialist Box
    pdf.setFillColor(240, 246, 252);
    pdf.setDrawColor(187, 214, 238);
    pdf.roundedRect(14, 49, 182, 24, 3, 3, 'FD');
    pdf.setTextColor(26, 33, 56);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10.5);
    pdf.text(
      `Plant / Company: ${rec.plantCompanyName}   |   Line / Product: ${rec.lineOrProductName}`,
      19,
      58
    );
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.2);
    pdf.text(
      `Supervisor / Specialist: ${specialistName} (${specialistRole})   |   Workers on Line: ${rec.workersCount}`,
      19,
      66
    );

    let y = 80;
    // SECTION 1: 1-Hour Machine Efficiency
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(22, 115, 184);
    pdf.text('1. 1-Hour Machine Production Efficiency (Trays / Hour)', 14, y);
    y += 4.5;

    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(210, 222, 234);
    pdf.roundedRect(14, y, 182, 24, 2.5, 2.5, 'FD');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(26, 33, 56);
    pdf.text(
      `Rated Machine Speed: ${rec.machineSpeedTraysPerHour} Trays/Hour   |   Actual 1-Hour Production: ${rec.oneHourActualTrays} Trays   |   Shortfall: ${rec.oneHourLostTrays} Trays`,
      19,
      y + 9.5
    );
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(22, 115, 184);
    pdf.text(
      `1-HOUR MACHINE EFFICIENCY = ${rec.oneHourEfficiencyPct}%   (Formula: ${rec.oneHourActualTrays} / ${rec.machineSpeedTraysPerHour} × 100)`,
      19,
      y + 18.5
    );

    y += 31;
    // SECTION 2: Full-Day Net Efficiency (Start Time, Late Start, Break, CIP, Total Trays)
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(22, 115, 184);
    pdf.text(
      '2. Full-Day Net Efficiency (Including Start Time, Late Start, Break & CIP Factors)',
      14,
      y
    );
    y += 4.5;

    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(210, 222, 234);
    pdf.roundedRect(14, y, 182, 46, 2.5, 2.5, 'FD');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.2);
    pdf.setTextColor(26, 33, 56);
    pdf.text(
      `Scheduled Start: ${rec.scheduledStartTime}  |  Actual Start: ${rec.actualStartTime}  |  Total Shift: ${rec.totalShiftHours} Hours  |  Rated Speed: ${rec.machineSpeedTraysPerHour} Trays/Hr`,
      19,
      y + 9
    );
    pdf.text(
      `Time Factors: Late Start = ${rec.lateStartMins} mins  |  Break Time = ${rec.breakMins} mins  |  CIP Time = ${rec.cipMins} mins  |  Breakdown = ${rec.unplannedDowntimeMins} mins`,
      19,
      y + 17.5
    );
    pdf.text(
      `Full-Day Output: Total Produced = ${rec.totalFullDayTrays} Trays  |  Good Trays = ${rec.goodFullDayTrays} (Rejects: ${rec.rejectedTrays})  |  Worker Rate = ${rec.traysPerWorkerHour} Trays/Worker/Hr`,
      19,
      y + 26
    );
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(22, 115, 184);
    pdf.text(
      `FULL-DAY NET EFFICIENCY (After Break & CIP) = ${rec.fullDayNetOperatingEfficiencyPct}%   |   Gross Shift Efficiency = ${rec.fullDayGrossEfficiencyPct}%   |   Line OEE = ${rec.fullDayOeePct}%`,
      19,
      y + 37.5
    );

    y += 53;
    // SECTION 3: Syrup Room / Preparation Room Batch Efficiency
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(22, 115, 184);
    pdf.text(
      '3. Syrup Room / Preparation Room Batch Efficiency & Wastage',
      14,
      y
    );
    y += 4.5;

    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(210, 222, 234);
    pdf.roundedRect(14, y, 182, 30, 2.5, 2.5, 'FD');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.2);
    pdf.setTextColor(26, 33, 56);
    pdf.text(
      `Total Syrup / Batch Prepared: ${rec.syrupPreparedTotal} ${rec.syrupUnit}   |   Total Packed: ${rec.syrupPackedTotal} ${rec.syrupUnit}   |   Total Waste / Drain: ${rec.syrupWasteTotal} ${rec.syrupUnit}`,
      19,
      y + 10
    );
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(22, 115, 184);
    pdf.text(
      `SYRUP ROOM BATCH EFFICIENCY = ${rec.syrupBatchEfficiencyPct}%   |   Syrup Wastage = ${rec.syrupWastagePct}%   |   Waste Cost = Rs. ${rec.syrupWasteCostRs.toLocaleString()}`,
      19,
      y + 21
    );

    y += 37;
    // SECTION 4: Process Yield & Material Cost
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(22, 115, 184);
    pdf.text(
      '4. Raw Material to Final Packed Process Yield & Wastage',
      14,
      y
    );
    y += 4.5;

    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(210, 222, 234);
    pdf.roundedRect(14, y, 182, 28, 2.5, 2.5, 'FD');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.2);
    pdf.setTextColor(26, 33, 56);
    pdf.text(
      `Raw Input: ${rec.rawInputKg} kg   |   After Trim/Prep: ${rec.trimmedPreppedKg} kg (${rec.prepYieldPct}%)   |   Final Packed: ${rec.finalPackedKg} kg`,
      19,
      y + 10
    );
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(22, 115, 184);
    pdf.text(
      `NET PACKED YIELD = ${rec.netProcessYieldPct}%   |   Total Loss = ${rec.totalLossKg} kg (${rec.totalLossPct}%)   |   Effective Cost = Rs. ${rec.effectiveRawCostPerFinalKg}/kg`,
      19,
      y + 20
    );

    y += 34;
    if (rec.notes) {
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(210, 222, 234);
      pdf.roundedRect(14, y, 182, 20, 2.5, 2.5, 'FD');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(26, 33, 56);
      pdf.text(`Production Notes: ${rec.notes.slice(0, 110)}`, 19, y + 11);
    }

    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(8.5);
    pdf.setTextColor(120, 130, 145);
    pdf.text(
      'Generated by Food Science Portal — Production Yield, Line Efficiency & Syrup Room Suite',
      14,
      285
    );

    pdf.save(`${rec.recordCode}_Production_Syrup_Efficiency_Report.pdf`);
    showToast(`Downloaded Production Efficiency PDF (${rec.recordCode})!`);
  };

  // Download Plant Efficiency Analytics & Logbook PDF (Daily / Weekly / Monthly / Yearly)
  const handleDownloadPlantAnalyticsPdf = () => {
    if (!canUsePremium) {
      onOpenPremiumModal?.();
      return;
    }
    if (savedRecords.length === 0) {
      showToast('No saved production records yet to generate plant analytics report.');
      return;
    }
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const specialistName = (user?.name || 'Production & QA Specialist').trim();
    const targetPlantTitle =
      dirPlantFilter === 'all'
        ? plantCompanyName.trim() || 'All Logged Plants / Companies'
        : dirPlantFilter;

    pdf.setFillColor(26, 33, 56);
    pdf.rect(0, 0, 210, 44, 'F');
    drawPdfBrandLogo(pdf, 14, 8, 25, {
      borderColor: [255, 255, 255],
      bgFill: [255, 255, 255],
      roundedRadius: 4
    });

    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13.5);
    pdf.text(`${targetPlantTitle.slice(0, 52)}`, 44, 16);
    pdf.setFontSize(15);
    pdf.text(
      `PLANT EFFICIENCY REPORT (${analyticsGrouping.toUpperCase()} BREAKDOWN)`,
      44,
      25
    );
    pdf.setFontSize(9.2);
    pdf.setTextColor(220, 233, 246);
    pdf.text(
      `Specialist: ${specialistName}   •   Total Shifts Logged: ${overallPlantKpis.totalShifts}   •   Total Trays: ${overallPlantKpis.totalTraysProduced.toLocaleString()}`,
      44,
      34
    );

    drawPdfUserPhoto(pdf, user?.profilePicUrl, specialistName, 172, 8, 24, {
      borderColor: [255, 255, 255],
      fallbackBgColor: [22, 115, 184],
      fallbackTextColor: [255, 255, 255]
    });

    // Overall Plant Summary Box
    pdf.setFillColor(240, 246, 252);
    pdf.setDrawColor(22, 115, 184);
    pdf.roundedRect(14, 50, 182, 24, 3, 3, 'FD');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9.5);
    pdf.setTextColor(26, 33, 56);
    pdf.text(
      `Plant Averages:  1-Hr Efficiency = ${overallPlantKpis.avg1HrEff}%   |   Full-Day Net Efficiency = ${overallPlantKpis.avgNetDayEff}%   |   Syrup Room Efficiency = ${overallPlantKpis.avgSyrupEff}%`,
      18,
      59
    );
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(
      `Avg Process Yield: ${overallPlantKpis.avgProcessYield}%   |   Total Syrup Waste: ${overallPlantKpis.totalSyrupWaste}   |   Late Start Hrs: ${overallPlantKpis.totalLateStartHrs}h   |   CIP Hrs: ${overallPlantKpis.totalCipHrs}h`,
      18,
      67
    );

    let y = 82;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(22, 115, 184);
    pdf.text(
      `${analyticsGrouping.toUpperCase()} PLANT & SYRUP ROOM EFFICIENCY SUMMARY`,
      14,
      y
    );
    y += 5;

    analyticsGroups.forEach((grp, idx) => {
      if (y > 252) {
        pdf.addPage();
        y = 20;
      }
      pdf.setFillColor(
        idx % 2 === 0 ? 248 : 240,
        idx % 2 === 0 ? 250 : 246,
        252
      );
      pdf.setDrawColor(210, 222, 234);
      pdf.roundedRect(14, y, 182, 24, 2.5, 2.5, 'FD');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9.5);
      pdf.setTextColor(26, 33, 56);
      pdf.text(
        `${idx + 1}. ${grp.periodLabel}   (${grp.shiftsCount} Shift${
          grp.shiftsCount > 1 ? 's' : ''
        } • Total Trays: ${grp.totalTrays.toLocaleString()})`,
        18,
        y + 7.5
      );

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.8);
      pdf.setTextColor(22, 115, 184);
      pdf.text(
        `1-Hr Eff: ${grp.avgOneHourEff}%  |  Full-Day Net Eff: ${grp.avgFullDayNetEff}%  |  OEE: ${grp.avgOee}%  |  Syrup Room Eff: ${grp.avgSyrupEff}%  |  Process Yield: ${grp.avgProcessYield}%`,
        18,
        y + 14.5
      );

      pdf.setTextColor(90, 108, 132);
      pdf.text(
        `Syrup Prepared/Packed/Waste: ${grp.totalSyrupPrepared} / ${grp.totalSyrupPacked} / ${grp.totalSyrupWaste}   |   Late Start: ${grp.totalLateMins}m • Break: ${grp.totalBreakMins}m • CIP: ${grp.totalCipMins}m`,
        18,
        y + 20.5
      );
      y += 27.5;
    });

    pdf.save(
      `Plant_Efficiency_${analyticsGrouping.toUpperCase()}_Report_${Date.now()}.pdf`
    );
    showToast(
      `Downloaded ${analyticsGrouping.toUpperCase()} Plant Efficiency Report PDF!`
    );
  };

  return (
    <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 sm:p-6 shadow-xs space-y-5">
      {/* Toast Notification */}
      {statusToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#1A2138] text-white text-xs font-extrabold shadow-lg flex items-center gap-2 border border-[#1673B8]/40">
          <Check className="w-4 h-4 text-[#60A5FA] shrink-0" />
          <span>{statusToast}</span>
        </div>
      )}

      {/* HEADER & TABS */}
      <div className="border-b border-[#D2DEEA] pb-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1673B8] text-white flex items-center justify-center shrink-0">
            <Factory className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
                Production Floor, Net Efficiency, Syrup Room &amp; Yield Tool
              </h2>
              <span className="text-[11px] font-extrabold text-[#1673B8]">
                {canUsePremium
                  ? '· Paid Pro Mode (Plant Log, Daily/Weekly/Monthly/Yearly Analytics & PDF Unlocked)'
                  : '· Free Calculator View'}
              </span>
            </div>
            <p className="text-xs text-[#4A5568] font-medium">
              1-Hour &amp; Full-Day Net Efficiency (Late Start, Break, CIP), Syrup/Prep Room Batch Efficiency, Process Yield &amp; Plant Analytics
            </p>
          </div>
        </div>

        {canUsePremium && (
          <div className="flex flex-wrap gap-1.5 bg-[#F0F6FC] p-1 rounded-xl border border-[#D2DEEA]">
            <button
              type="button"
              onClick={() => setViewTab('calculator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                viewTab === 'calculator'
                  ? 'bg-[#1673B8] text-white shadow-2xs'
                  : 'text-[#1A2138] hover:bg-white'
              }`}
            >
              Production Calculator
            </button>
            <button
              type="button"
              onClick={() => setViewTab('directory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                viewTab === 'directory'
                  ? 'bg-[#1673B8] text-white shadow-2xs'
                  : 'text-[#1A2138] hover:bg-white'
              }`}
            >
              Saved Directory ({savedRecords.length})
            </button>
            <button
              type="button"
              onClick={() => setViewTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                viewTab === 'analytics'
                  ? 'bg-[#1A2138] text-white shadow-2xs'
                  : 'text-[#1A2138] hover:bg-white'
              }`}
            >
              Plant Efficiency (Daily/Weekly/Monthly/Yearly)
            </button>
          </div>
        )}
      </div>

      {/* =====================================================================
          TAB 1: PRODUCTION & SYRUP ROOM CALCULATOR
         ===================================================================== */}
      {viewTab === 'calculator' && (
        <div className="space-y-5">
          {/* PAID MEMBER PLANT / COMPANY & SHIFT LOGGER BAR */}
          {canUsePremium && (
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA] space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-extrabold text-[#1A2138]">
                  Paid Member Plant / Factory Logger &amp; Professional PDF Report Generator
                </div>
                <span className="text-[11px] font-bold text-[#1673B8]">
                  Logs Daily, Weekly, Monthly &amp; Yearly Plant Efficiency automatically
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Plant / Factory / Company Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., ABC Foods & Beverages Plant"
                    value={plantCompanyName}
                    onChange={(e) => setPlantCompanyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Production Line / Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Line 1 — Mango Drink 250mL Trays"
                    value={lineOrProductName}
                    onChange={(e) => setLineOrProductName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Shift
                  </label>
                  <select
                    value={shiftName}
                    onChange={(e) => setShiftName(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  >
                    <option value="Morning Shift (A)">Morning Shift (A)</option>
                    <option value="Evening Shift (B)">Evening Shift (B)</option>
                    <option value="Night Shift (C)">Night Shift (C)</option>
                    <option value="Full Day Operations">Full Day Operations</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                    Production Date
                  </label>
                  <input
                    type="date"
                    value={productionDate}
                    onChange={(e) => setProductionDate(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div className="sm:col-span-2 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={handleSaveProductionRecord}
                    className="flex-1 py-2 px-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-[11px] font-extrabold inline-flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Log</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingleProductionPdf(
                        buildCurrentProductionRecord()
                      )
                    }
                    className="py-2 px-2.5 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-[11px] font-extrabold inline-flex items-center justify-center gap-1 cursor-pointer"
                    title="Download Shift Efficiency PDF Report"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Optional Shift / Downtime / Syrup Room Remarks (e.g., 25m late start due to steam boiler warm-up, CIP completed on Tank 2)..."
                  value={shiftNotes}
                  onChange={(e) => setShiftNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
            </div>
          )}

          {/* =================================================================
              SECTION 1: 1-HOUR MACHINE EFFICIENCY (TRAYS / HOUR)
             ================================================================= */}
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-extrabold text-[#1673B8] uppercase tracking-wider">
                1. Net Efficiency for 1 Hour (Hourly Machine Speed vs Actual Trays Produced)
              </div>
              <span className="text-[11px] font-bold text-[#4A5568]">
                Formula: 1-Hour Efficiency (%) = (Trays Produced in 1 Hour ÷ Machine Rated Speed per Hour) × 100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Machine Rated Speed per 1 Hour (Trays / Cartons / Packs per Hour)
                </label>
                <input
                  type="number"
                  step="10"
                  value={machineSpeedTraysPerHour}
                  onChange={(e) => setMachineSpeedTraysPerHour(e.target.value)}
                  placeholder="e.g., 1000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Actual Trays Produced in Full 1 Hour
                </label>
                <input
                  type="number"
                  step="10"
                  value={oneHourActualTrays}
                  onChange={(e) => setOneHourActualTrays(e.target.value)}
                  placeholder="e.g., 880"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#1673B8] text-xs font-bold text-[#1A2138]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-3.5 rounded-xl bg-[#1A2138] text-white">
                <div className="text-[10.5px] font-bold text-sky-200">
                  1-Hour Machine Efficiency
                </div>
                <div className="text-2xl font-extrabold text-amber-300 font-mono mt-0.5">
                  {oneHourStats.efficiencyPct}%
                </div>
                <div className="text-[10.5px] text-slate-300 mt-0.5">
                  ({oneHourStats.actual1Hr} ÷ {oneHourStats.ratedPerHr} Trays × 100)
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10.5px] font-bold text-[#4A5568]">
                  1-Hour Trays Shortfall / Loss
                </div>
                <div className="text-lg font-extrabold text-red-600 font-mono mt-0.5">
                  {oneHourStats.lostTrays} Trays
                </div>
                <div className="text-[10.5px] text-[#5A6C84] mt-0.5">
                  Target: {oneHourStats.ratedPerHr} Trays/hr
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10.5px] font-bold text-[#4A5568]">
                  Speed per Minute (Actual vs Rated)
                </div>
                <div className="text-lg font-extrabold text-[#1673B8] font-mono mt-0.5">
                  {oneHourStats.actualPerMin} / {oneHourStats.ratedPerMin} Trays/min
                </div>
                <div className="text-[10.5px] text-[#5A6C84] mt-0.5">
                  Live 60-minute run rate
                </div>
              </div>
            </div>
          </div>

          {/* =================================================================
              SECTION 2: FULL-DAY NET EFFICIENCY (START TIME, LATE START, BREAK, CIP)
             ================================================================= */}
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-extrabold text-[#1673B8] uppercase tracking-wider">
                2. Net Efficiency for Full Day (Start Time, Late Production Start, Break Hour, CIP Time &amp; Total Trays)
              </div>
              <span className="text-[11px] font-bold text-[#4A5568]">
                Includes Late Start, Meal/Tea Break, CIP Sanitation &amp; Unplanned Downtime Factors
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-[10.5px] font-extrabold text-[#1A2138] mb-1">
                  Scheduled Start Time
                </label>
                <input
                  type="time"
                  value={scheduledStartTime}
                  onChange={(e) => {
                    const nextSched = e.target.value;
                    setScheduledStartTime(nextSched);
                    setLateStartMins(
                      String(
                        computeLateMinsFromTimes(nextSched, actualStartTime)
                      )
                    );
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-extrabold text-[#1A2138] mb-1">
                  Actual Production Start
                </label>
                <input
                  type="time"
                  value={actualStartTime}
                  onChange={(e) => {
                    const nextAct = e.target.value;
                    setActualStartTime(nextAct);
                    setLateStartMins(
                      String(
                        computeLateMinsFromTimes(scheduledStartTime, nextAct)
                      )
                    );
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-extrabold text-[#1A2138] mb-1">
                  Late Start Factor (Mins)
                </label>
                <input
                  type="number"
                  value={lateStartMins}
                  onChange={(e) => setLateStartMins(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-amber-400 text-xs font-bold text-[#1A2138]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-extrabold text-[#1A2138] mb-1">
                  Break Hour Factor (Mins)
                </label>
                <input
                  type="number"
                  value={breakMins}
                  onChange={(e) => setBreakMins(e.target.value)}
                  placeholder="e.g., 45 or 60"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-extrabold text-[#1A2138] mb-1">
                  CIP Cleaning Time (Mins)
                </label>
                <input
                  type="number"
                  value={cipMins}
                  onChange={(e) => setCipMins(e.target.value)}
                  placeholder="e.g., 40"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-extrabold text-[#1A2138] mb-1">
                  Total Shift Duration (Hours)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={totalShiftHours}
                  onChange={(e) => setTotalShiftHours(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-extrabold text-[#1A2138] mb-1">
                  Machine Speed (Trays/Hr)
                </label>
                <input
                  type="number"
                  step="10"
                  value={machineSpeedTraysPerHour}
                  onChange={(e) => setMachineSpeedTraysPerHour(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-extrabold text-[#1A2138] mb-1">
                  Total Trays Produced (Full Day)
                </label>
                <input
                  type="number"
                  value={totalFullDayTrays}
                  onChange={(e) => setTotalFullDayTrays(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#1673B8] text-xs font-bold text-[#1A2138]"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-extrabold text-[#1A2138] mb-1">
                  Other Stoppage / Breakdown (Mins)
                </label>
                <input
                  type="number"
                  value={unplannedDowntimeMins}
                  onChange={(e) => setUnplannedDowntimeMins(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10.5px] font-extrabold text-[#1A2138] mb-1">
                    Reject Trays
                  </label>
                  <input
                    type="number"
                    value={rejectedTrays}
                    onChange={(e) => setRejectedTrays(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
                <div>
                  <label className="block text-[10.5px] font-extrabold text-[#1A2138] mb-1">
                    Workers
                  </label>
                  <input
                    type="number"
                    value={workersCount}
                    onChange={(e) => setWorkersCount(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                  />
                </div>
              </div>
            </div>

            {/* Full-Day Net Efficiency Result Banner */}
            <div className="p-4 rounded-2xl bg-[#1A2138] text-white grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[10.5px] text-sky-200 font-bold">
                  Full-Day Net Efficiency
                </div>
                <div className="text-2xl font-extrabold text-amber-300 font-mono">
                  {fullDayStats.netEfficiencyPct}%
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5">
                  Net Target (After Break &amp; CIP): {fullDayStats.netTargetTraysAfterBreakCip} Trays
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[10.5px] text-sky-200 font-bold">
                  Gross Shift Efficiency
                </div>
                <div className="text-lg font-extrabold text-white font-mono">
                  {fullDayStats.grossShiftEfficiencyPct}%
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5">
                  Full {totalShiftHours}h Target: {fullDayStats.grossShiftTargetTrays} Trays
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[10.5px] text-sky-200 font-bold">
                  Running Speed Efficiency
                </div>
                <div className="text-lg font-extrabold text-emerald-300 font-mono">
                  {fullDayStats.runningSpeedPerformancePct}%
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5">
                  Net Run Time: {fullDayStats.actualRunningHours} hrs ({fullDayStats.actualRunningMins}m)
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[10.5px] text-sky-200 font-bold">
                  Overall Line OEE
                </div>
                <div className="text-lg font-extrabold text-sky-300 font-mono">
                  {fullDayStats.oeePct}%
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5">
                  Avail {fullDayStats.availabilityPct}% • Qual {fullDayStats.qualityPct}%
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[10.5px] text-sky-200 font-bold">
                  Worker Productivity
                </div>
                <div className="text-sm font-extrabold text-white font-mono mt-0.5">
                  {fullDayStats.traysPerWorkerHour} Trays/worker/hr
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5">
                  {fullDayStats.traysPerWorkerShift} Trays/worker/shift
                </div>
              </div>
            </div>

            {/* Factor-wise Tray & Time Impact Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-amber-300">
                <div className="text-[10px] font-bold text-[#92400E]">
                  Late Production Start Impact ({lateStartMins}m)
                </div>
                <div className="font-extrabold text-red-600 font-mono mt-0.5">
                  -{fullDayStats.traysLostToLateStart} Trays (-{fullDayStats.lateStartImpactPct}%)
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10px] font-bold text-[#4A5568]">
                  Break Time Factor ({breakMins}m)
                </div>
                <div className="font-extrabold text-[#1A2138] font-mono mt-0.5">
                  {fullDayStats.traysInBreakTime} Trays (Deducted)
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10px] font-bold text-[#4A5568]">
                  CIP Sanitation Factor ({cipMins}m)
                </div>
                <div className="font-extrabold text-[#1673B8] font-mono mt-0.5">
                  {fullDayStats.traysInCipTime} Trays (Deducted)
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10px] font-bold text-[#4A5568]">
                  Breakdown / Stoppage ({unplannedDowntimeMins}m)
                </div>
                <div className="font-extrabold text-red-600 font-mono mt-0.5">
                  -{fullDayStats.traysLostToBreakdown} Trays Lost
                </div>
              </div>
            </div>
          </div>

          {/* =================================================================
              SECTION 3: SYRUP ROOM / PREPARATION ROOM BATCH EFFICIENCY
             ================================================================= */}
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-extrabold text-[#1673B8] uppercase tracking-wider">
                3. Syrup Room / Preparation Room Batch Efficiency (Prepared vs Packed vs Waste)
              </div>
              <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-[#D2DEEA]">
                <span className="text-[10.5px] font-bold text-[#4A5568]">Unit:</span>
                {(['Liters', 'kg'] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setSyrupUnit(u)}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-extrabold cursor-pointer ${
                      syrupUnit === u
                        ? 'bg-[#1673B8] text-white'
                        : 'text-[#1A2138]'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Total Syrup / Batch Prepared ({syrupUnit})
                </label>
                <input
                  type="number"
                  step="10"
                  value={syrupPreparedTotal}
                  onChange={(e) => setSyrupPreparedTotal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Total Syrup / Batch Packed ({syrupUnit})
                </label>
                <input
                  type="number"
                  step="10"
                  value={syrupPackedTotal}
                  onChange={(e) => setSyrupPackedTotal(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#1673B8] text-xs font-bold text-[#1A2138]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Syrup Waste / Drain / CIP Loss ({syrupUnit})
                </label>
                <input
                  type="number"
                  step="1"
                  value={syrupCustomWasteInput}
                  onChange={(e) => setSyrupCustomWasteInput(e.target.value)}
                  placeholder={`Auto: ${syrupStats.calculatedLoss} ${syrupUnit}`}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Syrup Cost Rate (Rs. / {syrupUnit})
                </label>
                <input
                  type="number"
                  step="1"
                  value={syrupCostPerUnit}
                  onChange={(e) => setSyrupCostPerUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-[#1A2138] text-white">
                <div className="text-[10.5px] font-bold text-sky-200">
                  Syrup Room Batch Efficiency
                </div>
                <div className="text-xl font-extrabold text-amber-300 font-mono">
                  {syrupStats.batchEfficiencyPct}%
                </div>
                <div className="text-[10px] text-slate-300">
                  Packed {syrupStats.packed} of {syrupStats.prepared} {syrupUnit}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10.5px] font-bold text-[#4A5568]">
                  Total Syrup Wasted / Lost
                </div>
                <div className="text-lg font-extrabold text-red-600 font-mono">
                  {syrupStats.wasteTotal} {syrupUnit} ({syrupStats.wastagePct}%)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10.5px] font-bold text-[#4A5568]">
                  Financial Value of Syrup Waste
                </div>
                <div className="text-lg font-extrabold text-[#1A2138] font-mono">
                  Rs. {syrupStats.wasteCostRs.toLocaleString()}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10.5px] font-bold text-[#4A5568]">
                  Mass Balance Status
                </div>
                <div className="text-xs font-extrabold text-emerald-700 mt-1">
                  {syrupStats.unaccountedDiff === 0
                    ? `100% Accounted (${syrupStats.prepared} ${syrupUnit})`
                    : `Variance: ${syrupStats.unaccountedDiff} ${syrupUnit}`}
                </div>
              </div>
            </div>
          </div>

          {/* =================================================================
              SECTION 4: RAW-TO-PACKED PROCESS YIELD & WASTAGE
             ================================================================= */}
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
            <div className="text-xs font-extrabold text-[#1673B8] uppercase tracking-wider">
              4. Raw Material to Packed Process Yield %, Peeling/Trim Loss &amp; Cost Impact
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Raw Material Input (kg)
                </label>
                <input
                  type="number"
                  value={rawInputKg}
                  onChange={(e) => setRawInputKg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  After Trim / Prep (kg)
                </label>
                <input
                  type="number"
                  value={trimmedPreppedKg}
                  onChange={(e) => setTrimmedPreppedKg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Final Packed Output (kg)
                </label>
                <input
                  type="number"
                  value={finalPackedKg}
                  onChange={(e) => setFinalPackedKg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Raw Material Rate (Rs./kg)
                </label>
                <input
                  type="number"
                  value={rawCostPerKg}
                  onChange={(e) => setRawCostPerKg(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10.5px] font-bold text-[#4A5568]">Net Packed Yield %</div>
                <div className="text-xl font-extrabold text-[#1673B8] font-mono">
                  {yieldStats.netProcessYieldPct}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10.5px] font-bold text-[#4A5568]">Prep / Trim Yield %</div>
                <div className="text-xl font-extrabold text-[#1A2138] font-mono">
                  {yieldStats.prepYieldPct}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10.5px] font-bold text-[#4A5568]">Total Wastage / Loss</div>
                <div className="text-base font-extrabold text-red-600 font-mono mt-0.5">
                  {yieldStats.totalLossKg} kg ({yieldStats.totalLossPct}%)
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10.5px] font-bold text-[#4A5568]">Effective Material Cost</div>
                <div className="text-base font-extrabold text-[#1A2138] font-mono mt-0.5">
                  Rs. {yieldStats.effectiveRawCostPerFinalKg}/kg
                </div>
              </div>
            </div>
          </div>

          {/* =================================================================
              SECTION 5: CONSOLIDATED PRODUCTION & SYRUP ROOM REPORT PREVIEW
             ================================================================= */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border-2 border-[#1673B8] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-[#1A2138] uppercase tracking-wider">
                  Consolidated Production Floor &amp; Syrup Room Efficiency Report Summary
                </h3>
                <p className="text-[11px] text-[#5A6C84]">
                  Live executive summary combining 1-Hour Efficiency, Full-Day Net Efficiency, Syrup Room Yield &amp; Process Yield
                </p>
              </div>
              {canUsePremium && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleSaveProductionRecord}
                    className="px-3.5 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Shift Record to Directory</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSingleProductionPdf(
                        buildCurrentProductionRecord()
                      )
                    }
                    className="px-3.5 py-2 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Full Shift PDF Report</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10px] font-bold text-[#5A6C84]">
                  1-Hour Machine Efficiency
                </div>
                <div className="text-base font-extrabold text-[#1673B8] font-mono">
                  {oneHourStats.efficiencyPct}% ({oneHourStats.actual1Hr}/{oneHourStats.ratedPerHr} Trays)
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10px] font-bold text-[#5A6C84]">
                  Full-Day Net Efficiency
                </div>
                <div className="text-base font-extrabold text-[#1A2138] font-mono">
                  {fullDayStats.netEfficiencyPct}% ({totalFullDayTrays} Trays)
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10px] font-bold text-[#5A6C84]">
                  Syrup / Prep Room Efficiency
                </div>
                <div className="text-base font-extrabold text-emerald-700 font-mono">
                  {syrupStats.batchEfficiencyPct}% (Waste: {syrupStats.wasteTotal} {syrupUnit})
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[10px] font-bold text-[#5A6C84]">
                  Raw-to-Packed Process Yield
                </div>
                <div className="text-base font-extrabold text-[#1A2138] font-mono">
                  {yieldStats.netProcessYieldPct}% (Loss: {yieldStats.totalLossKg} kg)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: SAVED PRODUCTION DIRECTORY (PAID USERS)
         ===================================================================== */}
      {canUsePremium && viewTab === 'directory' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#1A2138]">
                Saved Production Floor &amp; Syrup Room Directory ({filteredDirectoryRecords.length})
              </h3>
              <p className="text-xs text-[#5A6C84]">
                Search, reload, or download official PDF Shift &amp; Batch Efficiency Reports for your plant.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadPlantAnalyticsPdf}
              className="px-4 py-2.5 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4" />
              <span>Download Plant Efficiency Logbook PDF</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-[#5A6C84] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by plant/company, line, shift, date, or record code (PRD-...)..."
                value={dirSearchQuery}
                onChange={(e) => setDirSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              />
            </div>
            <div className="sm:col-span-3">
              <select
                value={dirPlantFilter}
                onChange={(e) => setDirPlantFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              >
                <option value="all">All Plants / Companies</option>
                {uniquePlantNames.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-3">
              <select
                value={dirPeriodFilter}
                onChange={(e) =>
                  setDirPeriodFilter(
                    e.target.value as 'all' | 'today' | 'week' | 'month' | 'year'
                  )
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days (Weekly)</option>
                <option value="month">Last 30 Days (Monthly)</option>
                <option value="year">Last 365 Days (Yearly)</option>
              </select>
            </div>
          </div>

          {filteredDirectoryRecords.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#F8FAFC] border border-dashed border-[#94B8D7] text-center space-y-2">
              <div className="text-sm font-extrabold text-[#1A2138]">
                No Saved Production Records Found
              </div>
              <p className="text-xs text-[#5A6C84]">
                Enter your shift and syrup room data in the Production Calculator tab and click &ldquo;Save Log&rdquo; to build your plant directory.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDirectoryRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA] hover:border-[#1673B8] transition-colors space-y-2.5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-[#1A2138] text-white text-[10px] font-extrabold font-mono">
                          {rec.recordCode}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#EBF4FC] text-[#1673B8] text-[10px] font-extrabold">
                          {rec.plantCompanyName}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-[#D2DEEA] text-[#1A2138] text-[10px] font-extrabold">
                          {rec.shiftName} • {rec.productionDate}
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-[#1A2138] mt-1">
                        {rec.lineOrProductName}
                      </h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleLoadRecordIntoCalculator(rec)}
                        className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#EBF4FC] border border-[#94B8D7] text-[#1A2138] text-[11px] font-extrabold cursor-pointer"
                      >
                        Load into Calculator
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadSingleProductionPdf(rec)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#1673B8] hover:bg-[#105E9A] text-white text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF Report</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProductionRecord(rec.id)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                      <div className="text-[10px] text-[#5A6C84] font-bold">
                        1-Hour Efficiency
                      </div>
                      <div className="font-extrabold text-[#1673B8] font-mono">
                        {rec.oneHourEfficiencyPct}% ({rec.oneHourActualTrays}/{rec.machineSpeedTraysPerHour})
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                      <div className="text-[10px] text-[#5A6C84] font-bold">
                        Full-Day Net Efficiency
                      </div>
                      <div className="font-extrabold text-[#1A2138] font-mono">
                        {rec.fullDayNetOperatingEfficiencyPct}% ({rec.totalFullDayTrays} Trays)
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                      <div className="text-[10px] text-[#5A6C84] font-bold">
                        Late / Break / CIP
                      </div>
                      <div className="font-extrabold text-[#92400E] font-mono">
                        {rec.lateStartMins}m / {rec.breakMins}m / {rec.cipMins}m
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                      <div className="text-[10px] text-[#5A6C84] font-bold">
                        Syrup Room Efficiency
                      </div>
                      <div className="font-extrabold text-emerald-700 font-mono">
                        {rec.syrupBatchEfficiencyPct}% (Waste: {rec.syrupWasteTotal} {rec.syrupUnit})
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                      <div className="text-[10px] text-[#5A6C84] font-bold">
                        Process Yield &amp; OEE
                      </div>
                      <div className="font-extrabold text-[#1A2138] font-mono">
                        Yield {rec.netProcessYieldPct}% • OEE {rec.fullDayOeePct}%
                      </div>
                    </div>
                  </div>

                  {rec.notes && (
                    <div className="text-[11px] text-[#4A5568] bg-white px-3 py-1.5 rounded-lg border border-[#D2DEEA]">
                      <strong className="text-[#1A2138]">Remarks:</strong> {rec.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 3: PLANT / COMPANY EFFICIENCY ANALYTICS (DAILY / WEEKLY / MONTHLY / YEARLY)
         ===================================================================== */}
      {canUsePremium && viewTab === 'analytics' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#1A2138]">
                Plant / Factory / Company Efficiency Tracker (Daily, Weekly, Monthly &amp; Yearly)
              </h3>
              <p className="text-xs text-[#5A6C84]">
                Track your company&apos;s 1-Hour Efficiency, Full-Day Net Efficiency, Syrup Room Batch Efficiency &amp; Process Yield across any time horizon.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadPlantAnalyticsPdf}
              className="px-4 py-2.5 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4" />
              <span>
                Download {analyticsGrouping.toUpperCase()} Plant Efficiency PDF
              </span>
            </button>
          </div>

          {/* Plant Filter & Grouping Period Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#1A2138]">
                Plant / Company:
              </span>
              <select
                value={dirPlantFilter}
                onChange={(e) => setDirPlantFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              >
                <option value="all">All Logged Plants ({savedRecords.length} shifts)</option>
                {uniquePlantNames.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-1.5 bg-[#F0F6FC] p-1 rounded-xl border border-[#D2DEEA]">
              {(
                [
                  { id: 'daily', label: 'Daily-Wise' },
                  { id: 'weekly', label: 'Weekly-Wise' },
                  { id: 'monthly', label: 'Monthly-Wise' },
                  { id: 'yearly', label: 'Yearly-Wise' }
                ] as const
              ).map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setAnalyticsGrouping(g.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold cursor-pointer transition-colors ${
                    analyticsGrouping === g.id
                      ? 'bg-[#1673B8] text-white shadow-2xs'
                      : 'text-[#1A2138] hover:bg-white'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Plant Overall KPI Cards */}
          <div className="p-4 rounded-2xl bg-[#1A2138] text-white grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-white/10 border border-white/15">
              <div className="text-[10.5px] text-sky-200 font-bold">
                Plant Avg 1-Hour Efficiency
              </div>
              <div className="text-2xl font-extrabold text-amber-300 font-mono">
                {overallPlantKpis.avg1HrEff}%
              </div>
              <div className="text-[10px] text-slate-300 mt-0.5">
                Across {overallPlantKpis.totalShifts} logged shifts
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/15">
              <div className="text-[10.5px] text-sky-200 font-bold">
                Plant Avg Full-Day Net Efficiency
              </div>
              <div className="text-2xl font-extrabold text-emerald-300 font-mono">
                {overallPlantKpis.avgNetDayEff}%
              </div>
              <div className="text-[10px] text-slate-300 mt-0.5">
                Total Produced: {overallPlantKpis.totalTraysProduced.toLocaleString()} Trays
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/15">
              <div className="text-[10.5px] text-sky-200 font-bold">
                Avg Syrup Room Batch Efficiency
              </div>
              <div className="text-2xl font-extrabold text-sky-300 font-mono">
                {overallPlantKpis.avgSyrupEff}%
              </div>
              <div className="text-[10px] text-slate-300 mt-0.5">
                Total Syrup Waste: {overallPlantKpis.totalSyrupWaste}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/10 border border-white/15">
              <div className="text-[10.5px] text-sky-200 font-bold">
                Avg Process Yield &amp; Time Factors
              </div>
              <div className="text-xl font-extrabold text-white font-mono">
                {overallPlantKpis.avgProcessYield}% Yield
              </div>
              <div className="text-[10px] text-slate-300 mt-0.5">
                Late Start: {overallPlantKpis.totalLateStartHrs}h • CIP: {overallPlantKpis.totalCipHrs}h
              </div>
            </div>
          </div>

          {/* Period-by-Period Breakdown List */}
          {analyticsGroups.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#F8FAFC] border border-dashed border-[#94B8D7] text-center space-y-2">
              <div className="text-sm font-extrabold text-[#1A2138]">
                No Plant Efficiency Data Logged Yet
              </div>
              <p className="text-xs text-[#5A6C84]">
                Save your daily shifts in the Production Calculator tab to view Daily, Weekly, Monthly, and Yearly plant performance trends.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {analyticsGroups.map((grp) => (
                <div
                  key={grp.periodKey}
                  className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#D2DEEA] space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-sm font-extrabold text-[#1A2138]">
                        {grp.periodLabel}
                      </span>
                      <span className="ml-2 px-2.5 py-0.5 rounded-md bg-[#EBF4FC] text-[#1673B8] text-[11px] font-extrabold">
                        {grp.shiftsCount} Shift{grp.shiftsCount > 1 ? 's' : ''} Logged
                      </span>
                    </div>
                    <div className="text-xs font-extrabold text-[#1A2138] font-mono">
                      Total Output: {grp.totalTrays.toLocaleString()} Trays
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-[#D2DEEA]">
                      <div className="text-[10px] font-bold text-[#5A6C84]">
                        Avg 1-Hour Efficiency
                      </div>
                      <div className="text-base font-extrabold text-[#1673B8] font-mono">
                        {grp.avgOneHourEff}%
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#D2DEEA]">
                      <div className="text-[10px] font-bold text-[#5A6C84]">
                        Avg Full-Day Net Eff.
                      </div>
                      <div className="text-base font-extrabold text-[#1A2138] font-mono">
                        {grp.avgFullDayNetEff}%
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#D2DEEA]">
                      <div className="text-[10px] font-bold text-[#5A6C84]">
                        Avg Syrup Room Eff.
                      </div>
                      <div className="text-base font-extrabold text-emerald-700 font-mono">
                        {grp.avgSyrupEff}%
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#D2DEEA]">
                      <div className="text-[10px] font-bold text-[#5A6C84]">
                        Avg Process Yield %
                      </div>
                      <div className="text-base font-extrabold text-[#1A2138] font-mono">
                        {grp.avgProcessYield}%
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-[#D2DEEA]">
                      <div className="text-[10px] font-bold text-[#5A6C84]">
                        Late / Break / CIP Mins
                      </div>
                      <div className="text-xs font-extrabold text-[#92400E] font-mono mt-1">
                        {grp.totalLateMins}m / {grp.totalBreakMins}m / {grp.totalCipMins}m
                      </div>
                    </div>
                  </div>

                  {/* Visual Efficiency Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10.5px] font-bold text-[#5A6C84]">
                      <span>
                        Syrup Prepared: {grp.totalSyrupPrepared} • Packed: {grp.totalSyrupPacked} • Waste: {grp.totalSyrupWaste}
                      </span>
                      <span>Net Efficiency: {grp.avgFullDayNetEff}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#D2DEEA] overflow-hidden">
                      <div
                        className="h-full bg-[#1673B8] rounded-full"
                        style={{
                          width: `${Math.min(100, Math.max(5, grp.avgFullDayNetEff))}%`
                        }}
                      />
                    </div>
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

// ============================================================================
// 6. E-NUMBERS & FOOD ADDITIVES INSTANT FINDER (PRESERVATIVES, COLORS, EMULSIFIERS, HALAL & DOSING)
// ============================================================================
export const ENumbersInstantFinderTool: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [catFilter, setCatFilter] = useState<string>('All');
  const [halalFilter, setHalalFilter] = useState<string>('All');

  // Quick Preservative / Additive PPM Batch Dosing Calculator
  const [batchSizeKg, setBatchSizeKg] = useState<string>('250');
  const [targetAdditivePpm, setTargetAdditivePpm] = useState<string>('300');

  const filteredAdditives = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return E_NUMBERS_DATABASE.filter((item) => {
      if (catFilter !== 'All' && item.category !== catFilter) return false;
      if (halalFilter !== 'All' && !item.halalStatus.includes(halalFilter)) return false;
      if (!q) return true;
      return (
        item.code.toLowerCase().includes(q) ||
        item.insNumber.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.functionSummary.toLowerCase().includes(q) ||
        item.commonFoods.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, catFilter, halalFilter]);

  const gramsForBatch = useMemo(() => {
    const kg = Math.max(0.1, Number(batchSizeKg) || 100);
    const ppm = Math.max(1, Number(targetAdditivePpm) || 200);
    // 1 PPM = 1 mg/kg = 0.001 g/kg
    const totalGrams = kg * ppm * 0.001;
    return Number(totalGrams.toFixed(2));
  }, [batchSizeKg, targetAdditivePpm]);

  const categories = [
    'All',
    'Preservative',
    'Antioxidant',
    'Color',
    'Emulsifier & Stabilizer',
    'Acidity Regulator',
    'Sweetener',
    'Flavor Enhancer',
    'Anti-Caking & Glazing'
  ];

  return (
    <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 sm:p-6 shadow-xs space-y-5">
      <div className="border-b border-[#D2DEEA] pb-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1A2138] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
              E-Numbers &amp; Food Additives Instant Finder
            </h2>
            <p className="text-xs text-[#4A5568] font-medium">
              Search Preservatives, Antioxidants, Colors, Emulsifiers, Codex Limits (PPM) &amp; Halal Status
            </p>
          </div>
        </div>
        <span className="text-xs font-extrabold text-[#1673B8]">
          {filteredAdditives.length} Additives Found
        </span>
      </div>

      {/* SEARCH + FILTERS */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-[#1673B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by E-Number (e.g. E211, E330, E471), Name (Benzoate, Xanthan, Nitrite) or Food (Juice, Bread)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
            />
          </div>

          <div>
            <select
              value={halalFilter}
              onChange={(e) => setHalalFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
            >
              <option value="All">All Halal / Source Statuses</option>
              <option value="Halal">Halal (Plant / Synthetic)</option>
              <option value="Mushbooh">Mushbooh (Verify Animal vs Plant)</option>
              <option value="Haram">Haram / Restricted</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCatFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-colors ${
                catFilter === cat
                  ? 'bg-[#1673B8] text-white'
                  : 'bg-[#F0F6FC] text-[#1A2138] border border-[#D2DEEA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* QUICK PPM TO GRAMS BATCH DOSING CALCULATOR BAR */}
      <div className="p-3.5 rounded-2xl bg-[#EBF4FC] border border-[#1673B8]/40 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-extrabold text-[#1A2138]">
          Quick Additive Dosing Calculator (PPM → Grams for Batch):
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-[#4A5568]">Batch (kg/L):</span>
          <input
            type="number"
            value={batchSizeKg}
            onChange={(e) => setBatchSizeKg(e.target.value)}
            className="w-20 px-2.5 py-1.5 rounded-lg bg-white border border-[#94B8D7] font-bold text-[#1A2138]"
          />
          <span className="font-bold text-[#4A5568]">Target PPM (mg/kg):</span>
          <input
            type="number"
            value={targetAdditivePpm}
            onChange={(e) => setTargetAdditivePpm(e.target.value)}
            className="w-20 px-2.5 py-1.5 rounded-lg bg-white border border-[#94B8D7] font-bold text-[#1A2138]"
          />
          <span className="px-3 py-1.5 rounded-lg bg-[#1A2138] text-white font-mono font-extrabold">
            Add {gramsForBatch} grams
          </span>
        </div>
      </div>

      {/* ADDITIVES DIRECTORY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-h-[540px] overflow-y-auto pr-1">
        {filteredAdditives.map((item: ENumberAdditive) => (
          <div
            key={item.code}
            className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-extrabold text-sm text-[#1673B8]">
                    {item.code}
                  </span>
                  <span className="text-xs text-[#4A5568]">·</span>
                  <span className="text-sm font-extrabold text-[#1A2138]">
                    {item.name}
                  </span>
                </div>
                <div className="text-[11px] font-bold text-[#105E9A] mt-0.5">
                  {item.category} · {item.insNumber}
                </div>
              </div>

              <span
                className={`text-[11px] font-extrabold shrink-0 ${
                  item.halalStatus.startsWith('Halal')
                    ? 'text-emerald-700'
                    : item.halalStatus.startsWith('Mushbooh')
                    ? 'text-amber-700'
                    : 'text-red-700'
                }`}
              >
                {item.halalStatus}
              </span>
            </div>

            <p className="text-xs text-[#1A2138] font-medium leading-snug">
              {item.functionSummary}
            </p>

            <div className="text-[11px] text-[#4A5568] space-y-0.5 pt-1 border-t border-[#D2DEEA]">
              <div>
                <strong className="text-[#1A2138]">Foods:</strong> {item.commonFoods}
              </div>
              <div>
                <strong className="text-[#1A2138]">Codex Max Limit:</strong>{' '}
                <span className="text-[#1673B8] font-bold">{item.codexMaxLimit}</span>
              </div>
              <div>
                <strong className="text-[#1A2138]">Regulatory / Safety Note:</strong>{' '}
                {item.safetyNotes}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 7. JOB APPLICATION EMAIL & COVER LETTER GENERATOR (AUTO-SYNCED WITH USER PROFILE)
// ============================================================================
export const JobEmailCoverLetterTool: React.FC<{ user: HubUser }> = ({ user }) => {
  const [jobTitle, setJobTitle] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [hrEmail, setHrEmail] = useState<string>('');
  const [customHighlight, setCustomHighlight] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const applicantName = user.name || 'Food Safety & Quality Specialist';
  const applicantEmail = user.email || '';
  const applicantPhone = user.phone || '+92 300 0000000';
  const applicantQualification =
    user.qualification || 'BS / MS Food Science & Technology';
  const applicantCurrentRole =
    user.title || user.currentRole || 'Food Safety & Quality Professional';
  const applicantLocation = user.location || 'Pakistan';
  const applicantSkills =
    user.skills && user.skills.length > 0
      ? user.skills.join(', ')
      : 'HACCP, ISO 22000, FSSC 22000, GMP/GHP, Raw Material & Finished Product Testing, Internal Auditing';
  const applicantExperienceSummary =
    typeof user.experience === 'string' && user.experience.trim()
      ? user.experience.trim()
      : 'hands-on experience in food safety management, quality assurance testing, hygiene compliance, and production line monitoring';

  const generatedDocs = useMemo(() => {
    const cleanJob = jobTitle.trim() || '[Enter Job Title]';
    const cleanComp = companyName.trim() || 'your esteemed organization';

    // Strictly "Application for the Position of [Job Title]" with no education/extra text appended
    const subject = `Application for the Position of ${cleanJob}`;

    const introParagraph = `I am writing to formally apply for the position of ${cleanJob} at ${cleanComp}. Holding a qualification in ${applicantQualification} and working as a ${applicantCurrentRole}, I bring practical expertise in ${applicantExperienceSummary}.`;

    const extraLine = customHighlight.trim()
      ? `\nIn addition, ${customHighlight.trim()}\n`
      : '';

    const emailBody = `Dear Hiring Manager / HR Team,

${introParagraph}

Key Highlights of My Profile:
• Qualification: ${applicantQualification}
• Core Competencies: ${applicantSkills}
• Current Role & Location: ${applicantCurrentRole} (${applicantLocation})${extraLine}
I have attached my updated CV/Resume for your review. I would welcome the opportunity to discuss how my technical background in Food Safety and Quality Assurance can contribute to ${cleanComp}.

Thank you for your time and consideration.

Warm regards,
${applicantName}
${applicantQualification}
Phone / WhatsApp: ${applicantPhone}
Email: ${applicantEmail}`;

    const todayStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    const coverLetter = `${applicantName}
${applicantCurrentRole} | ${applicantQualification}
Location: ${applicantLocation}
Phone: ${applicantPhone} | Email: ${applicantEmail}

Date: ${todayStr}

To,
The Human Resources Manager / Hiring Committee,
${companyName.trim() || '[Company / Organization Name]'}

Subject: Application for the Position of ${cleanJob}

Dear Hiring Manager,

${introParagraph}

Throughout my academic and professional journey, I have focused on maintaining strict compliance with international food safety and quality standards (${applicantSkills}). In my capacity as ${applicantCurrentRole}, I have consistently ensured that raw materials, in-process checks (CCPs/OPRPs), lab analyses, and finished product dispatches meet regulatory and customer specifications.${extraLine}

What I bring to ${cleanComp} as a ${cleanJob}:
1. Strong command of Food Safety Management Systems (HACCP, ISO 22000, GMP/GHP, and traceability).
2. Accurate analytical and laboratory documentation, root-cause analysis (CAPA), and sensory/physicochemical testing.
3. Dedication to continuous improvement, audit readiness, and cross-functional teamwork with Production and R&D.

Please find my detailed CV attached with this application. I am available for an interview at your earliest convenience and can be reached directly at ${applicantPhone} or ${applicantEmail}.

Thank you for considering my application.

Sincerely,

${applicantName}
${applicantQualification}`;

    return { subject, emailBody, coverLetter };
  }, [
    jobTitle,
    companyName,
    customHighlight,
    applicantName,
    applicantEmail,
    applicantPhone,
    applicantQualification,
    applicantCurrentRole,
    applicantLocation,
    applicantSkills,
    applicantExperienceSummary
  ]);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const mailtoHref = `mailto:${encodeURIComponent(hrEmail.trim())}?subject=${encodeURIComponent(
    generatedDocs.subject
  )}&body=${encodeURIComponent(generatedDocs.emailBody)}`;

  const gmailWebHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    hrEmail.trim()
  )}&su=${encodeURIComponent(generatedDocs.subject)}&body=${encodeURIComponent(
    generatedDocs.emailBody
  )}`;

  return (
    <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 sm:p-6 shadow-xs space-y-5">
      <div className="border-b border-[#D2DEEA] pb-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1673B8] text-white flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
              Job Application Email &amp; Cover Letter Generator
            </h2>
            <p className="text-xs text-[#4A5568] font-medium">
              Auto-personalized from your Profile ({applicantName}) — Enter Your Desired Job Title &amp; Send in 1 Click
            </p>
          </div>
        </div>
      </div>

      {/* USER INPUTS (NO PRESET DESIGNATIONS & NO TONE SELECTOR) */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
              Enter Job Title You Are Applying For *
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Write your desired job title here..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border-2 border-[#1673B8] text-xs font-bold text-[#1A2138]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
              Company / Organization Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company or organization name..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
              HR / Recruiter Email (For 1-Click Send)
            </label>
            <input
              type="email"
              value={hrEmail}
              onChange={(e) => setHrEmail(e.target.value)}
              placeholder="e.g., careers@company.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
            Optional Extra Note / Achievement to Include
          </label>
          <input
            type="text"
            value={customHighlight}
            onChange={(e) => setCustomHighlight(e.target.value)}
            placeholder="Optional: Add any specific certification, notice period, or achievement..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
          />
        </div>
      </div>

      {/* 1-CLICK SEND BUTTONS */}
      <div className="flex flex-wrap items-center gap-2.5 p-3.5 rounded-2xl bg-[#EBF4FC] border border-[#1673B8]/40">
        <a
          href={mailtoHref}
          className="px-4 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-2 shadow-xs transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>1-Click Open in Default Email App</span>
        </a>

        <a
          href={gmailWebHref}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-2 shadow-xs transition-colors"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Open Directly in Gmail Compose ↗</span>
        </a>
      </div>

      {/* GENERATED SUBJECT + EMAIL BODY + COVER LETTER */}
      <div className="space-y-4">
        {/* Subject */}
        <div className="p-3.5 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold text-[#1673B8]">
              1. Generated Email Subject Line
            </span>
            <button
              type="button"
              onClick={() => handleCopy('subject', generatedDocs.subject)}
              className="px-3 py-1 rounded-lg bg-white hover:bg-[#EBF4FC] border border-[#D2DEEA] text-xs font-extrabold text-[#1A2138] inline-flex items-center gap-1 cursor-pointer"
            >
              {copiedField === 'subject' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Subject</span>
                </>
              )}
            </button>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-[#D2DEEA] text-xs font-extrabold text-[#1A2138]">
            {generatedDocs.subject}
          </div>
        </div>

        {/* Email Body & Cover Letter Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-[#1673B8]">
                2. Ready-to-Send Email Body
              </span>
              <button
                type="button"
                onClick={() => handleCopy('body', generatedDocs.emailBody)}
                className="px-3 py-1 rounded-lg bg-white hover:bg-[#EBF4FC] border border-[#D2DEEA] text-xs font-extrabold text-[#1A2138] inline-flex items-center gap-1 cursor-pointer"
              >
                {copiedField === 'body' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Email Body</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-white border border-[#D2DEEA] text-xs font-sans text-[#1A2138] whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {generatedDocs.emailBody}
            </pre>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-extrabold text-[#1A2138]">
                3. Complete Formal Cover Letter
              </span>
              <button
                type="button"
                onClick={() => handleCopy('cover', generatedDocs.coverLetter)}
                className="px-3 py-1 rounded-lg bg-white hover:bg-[#EBF4FC] border border-[#D2DEEA] text-xs font-extrabold text-[#1A2138] inline-flex items-center gap-1 cursor-pointer"
              >
                {copiedField === 'cover' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Cover Letter</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-white border border-[#D2DEEA] text-xs font-sans text-[#1A2138] whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {generatedDocs.coverLetter}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 8. RESEARCH PAPER, THESIS CONVERTER, STATISTICAL ANALYSIS & CITATION SUITE
// ============================================================================
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

interface JournalDirectoryItem {
  id: CitationStyleId;
  label: string;
  shortName: string;
  region: 'Pakistan HEC & University Journals' | 'International Impact Factor Journals';
  hecCategoryOrImpact: string;
  abstractWordLimit: number;
  inTextFormat: string;
  sectionOrder: string[];
  guidelinesSummary: string;
  examplePreview: string;
}

const JOURNAL_DIRECTORY: JournalDirectoryItem[] = [
  {
    id: 'pjas',
    label: 'Pakistan Journal of Agricultural Sciences (PJAS — UAF Faisalabad)',
    shortName: 'Pak. J. Agri. Sci.',
    region: 'Pakistan HEC & University Journals',
    hecCategoryOrImpact: 'HEC W Category (Impact Factor)',
    abstractWordLimit: 250,
    inTextFormat: '(Author et al., Year)',
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
      'Single-paragraph Abstract (max 250 words), 4–6 Keywords, combined or separate Results & Discussion, ANOVA with LSD/Tukey significance letters (p < 0.05), PJAS reference format.',
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
    inTextFormat: '(Author et al., Year)',
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
    inTextFormat: '(Author et al., Year)',
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
    inTextFormat: '(Author et al., Year)',
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
    inTextFormat: '(Author et al., Year)',
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
    inTextFormat: '(Author et al., Year)',
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
    inTextFormat: '(Author et al., Year)',
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
    inTextFormat: '(Author et al., Year)',
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
    inTextFormat: '[1], [2,3]',
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
    inTextFormat: '(Author, Year)',
    sectionOrder: [
      'TITLE',
      'ABSTRACT',
      'INTRODUCTION',
      'REVIEW OF LITERATURE',
      'MATERIALS AND METHODS',
      'RESULTS AND DISCUSSION',
      'CONCLUSION',
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
    inTextFormat: '(Author, Year)',
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
    inTextFormat: '[1]',
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
    inTextFormat: '(Author, Year)',
    sectionOrder: [
      'TITLE',
      'ABSTRACT',
      'INTRODUCTION',
      'MATERIALS AND METHODS',
      'RESULTS AND DISCUSSION',
      'CONCLUSION',
      'REFERENCES'
    ],
    guidelinesSummary: 'Customize the exact reference placeholder pattern to match any journal.',
    examplePreview: '{AUTHORS} ({YEAR}). {TITLE}. {JOURNAL}, {VOLUME}({ISSUE}): {PAGES}.'
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
  styleId: CitationStyleId,
  index: number,
  customTemplate: string
): { bibliography: string; inText: string } {
  const firstAuthorSurname =
    ref.authors.split(',')[0]?.split(' ')[0]?.trim() || 'Author';
  const hasMultipleAuthors =
    ref.authors.includes('&') ||
    ref.authors.toLowerCase().includes(' and ') ||
    (ref.authors.match(/,/g) || []).length >= 2;

  const inTextAuthorYear = hasMultipleAuthors
    ? `(${firstAuthorSurname} et al., ${ref.year})`
    : `(${firstAuthorSurname}, ${ref.year})`;

  const doiSuffix = ref.doi ? ` https://doi.org/${ref.doi}` : '';

  switch (styleId) {
    case 'pjas':
      return {
        bibliography: `${ref.authors}. ${ref.year}. ${ref.title}. ${ref.journal}. ${ref.volume}:${ref.pages}.`,
        inText: inTextAuthorYear
      };
    case 'pjn':
      return {
        bibliography: `${ref.authors}, ${ref.year}. ${ref.title}. ${ref.journal}, ${ref.volume}: ${ref.pages}.`,
        inText: inTextAuthorYear
      };
    case 'japs':
      return {
        bibliography: `${ref.authors} (${ref.year}). ${ref.title}. ${ref.journal}. ${ref.volume}(${ref.issue}): ${ref.pages}.`,
        inText: inTextAuthorYear
      };
    case 'pjsir':
    case 'sja':
      return {
        bibliography: `${ref.authors}. ${ref.year}. ${ref.title}. ${ref.journal}, ${ref.volume}(${ref.issue}): ${ref.pages}.`,
        inText: inTextAuthorYear
      };
    case 'apa7':
      return {
        bibliography: `${ref.authors} (${ref.year}). ${ref.title}. ${ref.journal}, ${ref.volume}(${ref.issue}), ${ref.pages}.${doiSuffix}`,
        inText: inTextAuthorYear
      };
    case 'elsevier_foodchem':
      return {
        bibliography: `${ref.authors} (${ref.year}). ${ref.title}. ${ref.journal}, ${ref.volume}, ${ref.pages}.${doiSuffix}`,
        inText: inTextAuthorYear
      };
    case 'ift_jfs':
      return {
        bibliography: `${ref.authors} (${ref.year}). ${ref.title}. ${ref.journal}, ${ref.volume}(${ref.issue}), ${ref.pages}.${doiSuffix}`,
        inText: inTextAuthorYear
      };
    case 'jds':
      return {
        bibliography: `${ref.authors}. ${ref.year}. ${ref.title}. ${ref.journal}. ${ref.volume}:${ref.pages}.${doiSuffix}`,
        inText: inTextAuthorYear
      };
    case 'mdpi_foods':
      return {
        bibliography: `${index + 1}. ${ref.authors.replace(/ and /gi, '; ')}. ${ref.title}. ${ref.journal} ${ref.year}, ${ref.volume}, ${ref.pages}.${doiSuffix}`,
        inText: `[${index + 1}]`
      };
    case 'harvard':
      return {
        bibliography: `${ref.authors}, ${ref.year}. '${ref.title}', ${ref.journal}, ${ref.volume}(${ref.issue}), pp. ${ref.pages}.`,
        inText: inTextAuthorYear
      };
    case 'ieee_vancouver':
      return {
        bibliography: `[${index + 1}] ${ref.authors}, "${ref.title}," ${ref.journal}, vol. ${ref.volume}, no. ${ref.issue}, pp. ${ref.pages}, ${ref.year}.${doiSuffix}`,
        inText: `[${index + 1}]`
      };
    case 'custom_pattern': {
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
        inText: inTextAuthorYear
      };
    }
  }
}

interface ExtractedPaperSections {
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

function parseResearchDocumentSections(rawText: string): ExtractedPaperSections {
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
      (paragraphs[1] ? paragraphs[1] : 'No explicit Abstract heading found; edit or paste abstract here.'),
    keywords,
    introduction:
      introduction ||
      (paragraphs[2] ? paragraphs[2] : 'Paste or edit Introduction & Objectives section here.'),
    literatureReview:
      literatureReview ||
      'No separate Review of Literature heading detected (many journals merge brief literature context into Introduction).',
    materialsAndMethods:
      materialsAndMethods ||
      (paragraphs[3] ? paragraphs[3] : 'Paste or edit Materials and Methods section here.'),
    resultsAndDiscussion:
      resultsAndDiscussion ||
      (paragraphs[4] ? paragraphs[4] : 'Paste or edit Results and Discussion section here.'),
    conclusion:
      conclusion ||
      (paragraphs[5] ? paragraphs[5] : 'Paste or edit Conclusion section here.'),
    referencesList: referencesList || ''
  };
}

interface StatTreatmentRow {
  id: string;
  treatmentName: string;
  rep1: string;
  rep2: string;
  rep3: string;
  rep4: string;
}

function getCriticalT05(df: number): number {
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
  if (dfE <= 20) return { f05: 3.10, f01: 4.94 };
  if (dfBetween >= 1) return { f05: 2.85, f01: 4.31 };
  return { f05: 3.0, f01: 4.6 };
}

const SAMPLE_RESEARCH_PAPER_TEXT = `Effect of Potassium Sorbate and Citric Acid on Physicochemical, Microbiological and Sensory Stability of Chaunsa Mango Pulp During Ambient Storage
Muhammad Ali Khan, Salman Ahmad, and Tariq Mahmood — National Institute of Food Science and Technology (NIFSAT), University of Agriculture, Faisalabad, Pakistan

ABSTRACT
The present investigation was carried out to evaluate the combined effect of potassium sorbate and citric acid on the physicochemical, microbiological, and sensory attributes of Chaunsa mango pulp stored at ambient temperature (28 ± 2°C) for 90 days. Five treatments were prepared: T0 (Control without preservative), T1 (0.05% Potassium Sorbate + 0.2% Citric Acid), T2 (0.10% Potassium Sorbate + 0.2% Citric Acid), T3 (0.05% Sodium Benzoate + 0.2% Citric Acid), and T4 (0.05% Potassium Sorbate + 0.05% Sodium Benzoate + 0.2% Citric Acid). Samples were analyzed at 0, 30, 60, and 90 days for total soluble solids (°Brix), pH, titratable acidity (%), ascorbic acid (mg/100g), total plate count (log CFU/g), and sensory acceptability. Results revealed highly significant (p < 0.01) effects of treatments and storage intervals on ascorbic acid retention and microbial load. Treatment T4 retained the highest ascorbic acid (34.80 ± 0.45 mg/100g) and lowest microbial count (2.15 log CFU/g) after 90 days.

Keywords: Chaunsa mango pulp, potassium sorbate, shelf life, physicochemical quality, ANOVA, food preservation

1. INTRODUCTION
Mango (Mangifera indica L.) is the second largest fruit crop of Pakistan and is globally recognized as the King of Fruits due to its rich aroma, high carotenoids, and ascorbic acid content (Khan et al., 2024). However, post-harvest losses in Pakistan range between 25% and 35% due to rapid ripening and microbial spoilage during peak summer months. Chemical preservation of fruit pulp in food-grade HDPE containers using Codex-permitted preservatives within safe PPM limits offers an economical solution for the beverage and nectar industry. The objective of this study was to optimize preservative hurdle combinations for extending the shelf stability of Chaunsa mango pulp without compromising sensory quality.

2. REVIEW OF LITERATURE
Previous studies by Hussain et al. (2023) and Codex Alimentarius (2023) demonstrated that weak-acid preservatives such as potassium sorbate (E202) and sodium benzoate (E211) exhibit maximum antimicrobial efficacy when the product pH is lowered below 4.2 using citric acid (E330). Akram and Randhawa (2022) reported that synergistic combinations of sorbate and benzoate inhibit both yeast/mold growth and acid-tolerant bacteria in tropical fruit purees.

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

export const CitationReferenceGeneratorTool: React.FC<{
  user?: HubUser | null;
}> = ({ user }) => {
  const [activeResearchTab, setActiveResearchTab] = useState<
    'extractor' | 'thesis-converter' | 'statistics' | 'references'
  >('extractor');

  const [selectedStyle, setSelectedStyle] = useState<CitationStyleId>('pjas');
  const [customPattern, setCustomPattern] = useState<string>(
    '{AUTHORS} ({YEAR}). {TITLE}. {JOURNAL}, {VOLUME}({ISSUE}): {PAGES}.'
  );
  const [sortAlphabetically, setSortAlphabetically] = useState<boolean>(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // TAB 1 & TAB 2 STATE: RESEARCH PAPER / THESIS UPLOAD & SECTION EXTRACTOR
  const [rawPaperInput, setRawPaperInput] = useState<string>(
    SAMPLE_RESEARCH_PAPER_TEXT
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const extractedSections = useMemo(
    () => parseResearchDocumentSections(rawPaperInput),
    [rawPaperInput]
  );

  const [editTitle, setEditTitle] = useState<string>('');
  const [editAuthors, setEditAuthors] = useState<string>('');
  const [editAbstract, setEditAbstract] = useState<string>('');
  const [editKeywords, setEditKeywords] = useState<string>('');
  const [editIntro, setEditIntro] = useState<string>('');
  const [editLitReview, setEditLitReview] = useState<string>('');
  const [editMethods, setEditMethods] = useState<string>('');
  const [editResults, setEditResults] = useState<string>('');
  const [editConclusion, setEditConclusion] = useState<string>('');

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
  }, [extractedSections]);

  const handlePaperFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);

    try {
      const arrayBuf = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuf);
      const rawDecoded = new TextDecoder('utf-8', { fatal: false }).decode(
        uint8
      );

      let readable = rawDecoded;
      if (
        file.name.endsWith('.html') ||
        file.name.endsWith('.htm') ||
        file.name.endsWith('.xml') ||
        rawDecoded.includes('<w:t')
      ) {
        readable = rawDecoded
          .replace(/<\/w:p>/g, '\n\n')
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<\/p>/gi, '\n\n')
          .replace(/<[^>]+>/g, ' ')
          .replace(/[ \t]+/g, ' ');
      } else {
        const printableMatches = rawDecoded.match(
          /[\x20-\x7E\r\n\t\u00A0-\u024F]{4,}/g
        );
        if (printableMatches && printableMatches.length > 0) {
          readable = printableMatches.join('\n');
        }
      }

      if (readable.trim().length > 20) {
        setRawPaperInput(readable.trim());
        const parsed = parseResearchDocumentSections(readable.trim());
        if (parsed.referencesList && parsed.referencesList.trim().length > 15) {
          setBulkRawText(parsed.referencesList.trim());
        }
      }
    } catch {
      // Fallback
    }
  };

  // TAB 3 STATE: RESEARCH DATA STATISTICAL ANALYSIS (CRD ANOVA, LSD, MEAN ± SD)
  const [statParameterName, setStatParameterName] = useState<string>(
    'Ascorbic Acid / Vitamin C (mg/100g)'
  );
  const [statFactorName, setStatFactorName] = useState<string>(
    'Preservative Treatments (90 Days Storage)'
  );
  const [statRows, setStatRows] = useState<StatTreatmentRow[]>([
    {
      id: 't0',
      treatmentName: 'T0 (Untreated Control)',
      rep1: '18.40',
      rep2: '18.10',
      rep3: '18.70',
      rep4: ''
    },
    {
      id: 't1',
      treatmentName: 'T1 (0.05% Potassium Sorbate)',
      rep1: '26.20',
      rep2: '26.80',
      rep3: '26.50',
      rep4: ''
    },
    {
      id: 't2',
      treatmentName: 'T2 (0.10% Potassium Sorbate)',
      rep1: '31.50',
      rep2: '31.10',
      rep3: '31.90',
      rep4: ''
    },
    {
      id: 't3',
      treatmentName: 'T3 (0.05% Sodium Benzoate)',
      rep1: '25.10',
      rep2: '24.80',
      rep3: '25.40',
      rep4: ''
    },
    {
      id: 't4',
      treatmentName: 'T4 (0.05% Sorbate + 0.05% Benzoate)',
      rep1: '34.80',
      rep2: '35.20',
      rep3: '34.40',
      rep4: ''
    }
  ]);

  const handleStatCsvUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length === 0) return;

      const parsedRows: StatTreatmentRow[] = [];
      lines.forEach((line, idx) => {
        const cols = line.split(/[,;\t]/).map((c) => c.trim());
        if (idx === 0 && cols.length > 1 && isNaN(Number(cols[1]))) {
          if (cols[0]) setStatFactorName(cols[0]);
          return;
        }
        if (cols.length >= 2) {
          parsedRows.push({
            id: `csv-${idx}-${Date.now()}`,
            treatmentName: cols[0] || `T${parsedRows.length}`,
            rep1: cols[1] || '0',
            rep2: cols[2] || '0',
            rep3: cols[3] || '0',
            rep4: cols[4] || ''
          });
        }
      });

      if (parsedRows.length >= 2) {
        setStatRows(parsedRows);
      }
    } catch {
      // Ignore parse error
    }
  };

  const statisticalAnalysis = useMemo(() => {
    const processedTreatments = statRows.map((row) => {
      const rawVals = [row.rep1, row.rep2, row.rep3, row.rep4]
        .map((v) => v.trim())
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

    const ssWithin = validTreatments.reduce(
      (acc, t) =>
        acc + t.values.reduce((s, v) => s + Math.pow(v - t.mean, 2), 0),
      0
    );

    const ssTotal = ssBetween + ssWithin;
    const dfBetween = Math.max(1, k - 1);
    const dfWithin = Math.max(1, totalN - k);
    const dfTotal = Math.max(1, totalN - 1);

    const msBetween = ssBetween / dfBetween;
    const msWithin = ssWithin / dfWithin;
    const fCalculated = msWithin > 0 ? msBetween / msWithin : 0;

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
    const tCrit05 = getCriticalT05(dfWithin);
    const lsd05 = tCrit05 * sed;

    const cvPct =
      grandMean > 0 ? (Math.sqrt(msWithin) / Math.abs(grandMean)) * 100 : 0;

    const sortedByMean = [...validTreatments].sort((a, b) => b.mean - a.mean);
    const letterMap: Record<string, string> = {};
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let currentLetterIdx = 0;

    sortedByMean.forEach((t, idx) => {
      if (idx === 0) {
        letterMap[t.id] = alphabet[0];
      } else {
        const prev = sortedByMean[idx - 1];
        const diff = Math.abs(prev.mean - t.mean);
        if (
          significanceStatus !== 'ns' &&
          lsd05 > 0 &&
          diff >= lsd05
        ) {
          currentLetterIdx = Math.min(alphabet.length - 1, currentLetterIdx + 1);
        }
        letterMap[t.id] = alphabet[currentLetterIdx];
      }
    });

    const treatmentsWithLetters = processedTreatments.map((t) => ({
      ...t,
      letter: letterMap[t.id] || 'a',
      formattedMeanSd: `${t.mean.toFixed(2)} ± ${t.sd.toFixed(2)} ${
        letterMap[t.id] || 'a'
      }`,
      formattedMeanSe: `${t.mean.toFixed(2)} ± ${t.se.toFixed(2)} ${
        letterMap[t.id] || 'a'
      }`
    }));

    return {
      treatments: treatmentsWithLetters,
      k,
      totalN,
      grandMean: Number(grandMean.toFixed(3)),
      ssBetween: Number(ssBetween.toFixed(4)),
      ssWithin: Number(ssWithin.toFixed(4)),
      ssTotal: Number(ssTotal.toFixed(4)),
      dfBetween,
      dfWithin,
      dfTotal,
      msBetween: Number(msBetween.toFixed(4)),
      msWithin: Number(msWithin.toFixed(4)),
      fCalculated: Number(fCalculated.toFixed(2)),
      f05,
      f01,
      significanceStatus,
      significanceBadge,
      sed: Number(sed.toFixed(4)),
      lsd05: Number(lsd05.toFixed(3)),
      cvPct: Number(cvPct.toFixed(2))
    };
  }, [statRows]);

  // TAB 4 STATE: CITATION & REFERENCE GENERATOR (BULK + MANUAL)
  const [bulkRawText, setBulkRawText] = useState<string>(
    `Khan, M.A., S. Ahmad and T. Mahmood (2024). Effect of potassium sorbate and citric acid on shelf stability of Chaunsa mango pulp. Pakistan Journal of Agricultural Sciences, 61(2), 145-152.\nCodex, A. & FAO (2023). General standard for food additives CXS 192-1995. Food Control, 148(1), 210-218.\nHussain, S., M. I. Anjum and A. Rehman. 2025. Physicochemical and microbiological quality of raw buffalo milk in Punjab. Journal of Animal and Plant Sciences. 35(1): 55-62.`
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
    const newLine = `${manAuthors.trim()} (${manYear.trim() || '2026'}). ${manTitle.trim()}. ${
      manJournal.trim() || 'Journal of Food Science'
    }, ${manVolume.trim() || '10'}(${manIssue.trim() || '1'}), ${
      manPages.trim() || '1-8'
    }.${
      manDoi.trim()
        ? ` https://doi.org/${manDoi.trim().replace(/^https?:\/\/doi\.org\//i, '')}`
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

  const formattedResults = useMemo(() => {
    const lines = bulkRawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    const parsedList = lines.map((line) => parseRawReferenceLine(line));
    if (
      sortAlphabetically &&
      selectedStyle !== 'ieee_vancouver' &&
      selectedStyle !== 'mdpi_foods'
    ) {
      parsedList.sort((a, b) => a.authors.localeCompare(b.authors));
    }

    return parsedList.map((ref, idx) =>
      formatReferenceEntry(ref, selectedStyle, idx, customPattern)
    );
  }, [bulkRawText, selectedStyle, sortAlphabetically, customPattern]);

  const activeJournalMeta =
    JOURNAL_DIRECTORY.find((j) => j.id === selectedStyle) ||
    JOURNAL_DIRECTORY[0];

  const compiledJournalManuscript = useMemo(() => {
    const abstractWords = editAbstract
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    const trimmedAbstract =
      abstractWords.length > activeJournalMeta.abstractWordLimit
        ? `${abstractWords
            .slice(0, activeJournalMeta.abstractWordLimit)
            .join(' ')}... [Trimmed to ${
            activeJournalMeta.abstractWordLimit
          }-word limit of ${activeJournalMeta.shortName}]`
        : editAbstract.trim();

    const refsFormatted = formattedResults
      .map((r) => r.bibliography)
      .join('\n\n');

    const statTableBlock = `Table 1. Effect of ${statFactorName} on ${statParameterName} (Mean ± SD)
-----------------------------------------------------------------------------------
Treatment / Level                          Mean ± SD (with LSD Letter)    Min – Max
-----------------------------------------------------------------------------------
${statisticalAnalysis.treatments
  .map(
    (t) =>
      `${t.treatmentName.padEnd(42, ' ')} ${t.formattedMeanSd.padEnd(
        30,
        ' '
      )} ${t.min.toFixed(2)} – ${t.max.toFixed(2)}`
  )
  .join('\n')}
-----------------------------------------------------------------------------------
Grand Mean = ${statisticalAnalysis.grandMean} | F-Value = ${
      statisticalAnalysis.fCalculated
    } (${statisticalAnalysis.significanceBadge})
LSD (0.05) = ${statisticalAnalysis.lsd05} | SED = ${
      statisticalAnalysis.sed
    } | CV (%) = ${statisticalAnalysis.cvPct}%
Means followed by different letters within a column differ significantly at p < 0.05.`;

    return `===================================================================================
TARGET JOURNAL MANUSCRIPT: ${activeJournalMeta.label.toUpperCase()}
(${activeJournalMeta.hecCategoryOrImpact} | Citation Format: ${activeJournalMeta.inTextFormat})
===================================================================================

TITLE:
${editTitle || 'Research Paper Title'}

AUTHORS & AFFILIATION:
${editAuthors || 'Author Names and University / Department Affiliation'}

ABSTRACT (Max ${activeJournalMeta.abstractWordLimit} Words — Current: ${
      abstractWords.length
    } Words):
${trimmedAbstract}

Keywords: ${editKeywords}

1. INTRODUCTION
${editIntro}
${
  activeJournalMeta.sectionOrder.includes('REVIEW OF LITERATURE') ||
  activeJournalMeta.sectionOrder.includes('LITERATURE REVIEW')
    ? `\n2. REVIEW OF LITERATURE\n${editLitReview}\n`
    : ''
}
MATERIALS AND METHODS
${editMethods}

RESULTS AND DISCUSSION
${editResults}

${statTableBlock}

CONCLUSION
${editConclusion}

REFERENCES (${activeJournalMeta.shortName} Style)
${refsFormatted}`;
  }, [
    activeJournalMeta,
    editTitle,
    editAuthors,
    editAbstract,
    editKeywords,
    editIntro,
    editLitReview,
    editMethods,
    editResults,
    editConclusion,
    formattedResults,
    statFactorName,
    statParameterName,
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

  const handleDownloadManuscriptPdf = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 14;
    const authorName = user?.name || editAuthors || 'Food Science Researcher';

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
      `Author: ${authorName.slice(0, 48)}  |  Target Journal: ${activeJournalMeta.shortName}`,
      textX,
      25.5
    );
    doc.text(
      `Format: ${activeJournalMeta.hecCategoryOrImpact}  |  Date: ${new Date().toLocaleDateString('en-PK')}`,
      textX,
      32
    );

    let y = 48;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.2);
    doc.setTextColor(26, 33, 56);
    const lines = doc.splitTextToSize(
      compiledJournalManuscript,
      pageW - margin * 2
    );
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
          `Food Science Portal  •  ${activeJournalMeta.shortName} Manuscript`,
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
      `Food_Science_Portal_${activeJournalMeta.shortName.replace(
        /[^a-zA-Z0-9]+/g,
        '_'
      )}_Manuscript.pdf`
    );
  };

  const handleDownloadStatAnovaPdf = () => {
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
    doc.text('ONE-WAY ANOVA & LSD STATISTICAL ANALYSIS REPORT', textX, 18.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(
      `Researcher: ${researcherName}  |  Parameter: ${statParameterName}`,
      textX,
      25.5
    );
    doc.text(
      `Factor: ${statFactorName}  |  Date: ${new Date().toLocaleDateString('en-PK')}`,
      textX,
      32
    );

    let y = 48;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(26, 33, 56);
    doc.text(
      `1. Treatment Means ± SD & LSD (0.05) Grouping — ${statParameterName}`,
      14,
      y
    );
    y += 6;

    statisticalAnalysis.treatments.forEach((t, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 240 : 255, idx % 2 === 0 ? 246 : 255, idx % 2 === 0 ? 252 : 255);
      doc.setDrawColor(210, 222, 234);
      doc.rect(14, y, pageW - 28, 9, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(26, 33, 56);
      doc.text(t.treatmentName.slice(0, 38), 17, y + 6);
      doc.setFont('helvetica', 'normal');
      doc.text(`Mean ± SD: ${t.formattedMeanSd}`, 98, y + 6);
      doc.text(`Range: ${t.min.toFixed(2)} – ${t.max.toFixed(2)}`, 155, y + 6);
      y += 9;
    });

    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(26, 33, 56);
    doc.text('2. One-Way ANOVA Summary & Critical Values', 14, y);
    y += 6;

    doc.setFillColor(240, 246, 252);
    doc.setDrawColor(187, 214, 238);
    doc.roundedRect(14, y, pageW - 28, 34, 3, 3, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.2);
    doc.text(
      `Between Treatments: df = ${statisticalAnalysis.dfBetween}, SS = ${statisticalAnalysis.ssBetween}, MS = ${statisticalAnalysis.msBetween}, F-Value = ${statisticalAnalysis.fCalculated}`,
      18,
      y + 8
    );
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
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 115, 184);
    doc.text(
      `Grand Mean = ${statisticalAnalysis.grandMean}  |  LSD (0.05) = ${statisticalAnalysis.lsd05}  |  SED = ${statisticalAnalysis.sed}  |  CV = ${statisticalAnalysis.cvPct}%`,
      18,
      y + 29
    );

    doc.save(
      `Food_Science_Portal_${statParameterName.replace(
        /[^a-zA-Z0-9]+/g,
        '_'
      )}_ANOVA_Report.pdf`
    );
  };

  const handleDownloadStatCsv = () => {
    const brandTopRows = [
      `"FOOD SCIENCE PORTAL — OFFICIAL STATISTICAL ANOVA REPORT"`,
      `"Researcher: ${(user?.name || 'Food Science Specialist').replace(/"/g, '""')}","Parameter: ${statParameterName.replace(/"/g, '""')}","Factor: ${statFactorName.replace(/"/g, '""')}"`,
      ''
    ].join('\n');

    const header = [
      'Treatment / Factor',
      'Rep 1',
      'Rep 2',
      'Rep 3',
      'Rep 4',
      'Mean',
      'Standard Deviation (SD)',
      'Standard Error (SE)',
      'LSD Significance Group',
      'Publication Format (Mean ± SD)'
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
          t.mean.toFixed(3),
          t.sd.toFixed(3),
          t.se.toFixed(3),
          t.letter,
          `"${t.formattedMeanSd}"`
        ].join(',');
      })
      .join('\n');

    const anovaFooter = [
      '',
      'ONE-WAY ANOVA SUMMARY TABLE',
      'Source of Variation,Degrees of Freedom (df),Sum of Squares (SS),Mean Square (MS),Calculated F-Value,Critical F (0.05),Critical F (0.01),Significance Status',
      `Between Treatments,${statisticalAnalysis.dfBetween},${statisticalAnalysis.ssBetween},${statisticalAnalysis.msBetween},${statisticalAnalysis.fCalculated},${statisticalAnalysis.f05},${statisticalAnalysis.f01},"${statisticalAnalysis.significanceBadge}"`,
      `Within Treatments (Error),${statisticalAnalysis.dfWithin},${statisticalAnalysis.ssWithin},${statisticalAnalysis.msWithin},,,`,
      `Total,${statisticalAnalysis.dfTotal},${statisticalAnalysis.ssTotal},,,,`,
      '',
      `Grand Mean,${statisticalAnalysis.grandMean}`,
      `Standard Error of Difference (SED),${statisticalAnalysis.sed}`,
      `Least Significant Difference LSD (0.05),${statisticalAnalysis.lsd05}`,
      `Coefficient of Variation (CV %),${statisticalAnalysis.cvPct}%`
    ].join('\n');

    handleDownloadFile(
      `${statParameterName.replace(/[^a-zA-Z0-9]+/g, '_')}_Statistical_ANOVA_Report.csv`,
      `${brandTopRows}\n${header}\n${rowsCsv}\n${anovaFooter}`,
      'text/csv;charset=utf-8;'
    );
  };

  return (
    <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 sm:p-6 shadow-xs space-y-5">
      {/* HEADER */}
      <div className="border-b border-[#D2DEEA] pb-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1A2138] text-white flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
              Research Paper, Thesis Converter, Statistical ANOVA &amp; Citation Suite
            </h2>
            <p className="text-xs text-[#4A5568] font-medium">
              Extract Paper Sections, Convert Thesis to Pakistani HEC &amp; International Journals, Run ANOVA/LSD Statistics &amp; Format References
            </p>
          </div>
        </div>
      </div>

      {/* 4 MODULE NAVIGATION BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 bg-[#F0F6FC] p-2 rounded-2xl border border-[#D2DEEA]">
        <button
          type="button"
          onClick={() => setActiveResearchTab('extractor')}
          className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
          className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
          className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
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
          className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeResearchTab === 'references'
              ? 'bg-[#1673B8] text-white shadow-xs'
              : 'text-[#1A2138] hover:bg-white'
          }`}
        >
          <BookOpen className="w-4 h-4 shrink-0" />
          <span>4. Citation &amp; Reference Tool</span>
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
                  Upload Research Paper / Thesis File or Paste Full Text Below
                </h3>
                <p className="text-[11px] text-[#4A5568]">
                  Automatically separates Abstract, Introduction, Review of Literature, Materials &amp; Methods, Results &amp; Discussion, Conclusion, and References
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="px-3.5 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer shadow-2xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Research Paper / Thesis</span>
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
                Loaded File: {uploadedFileName} — Sections extracted below!
              </div>
            )}

            <textarea
              rows={6}
              value={rawPaperInput}
              onChange={(e) => setRawPaperInput(e.target.value)}
              placeholder="Paste your complete research paper or thesis text here, or click 'Upload Research Paper / Thesis' above..."
              className="w-full p-3.5 rounded-xl bg-white border border-[#94B8D7] text-xs font-medium text-[#1A2138] leading-relaxed"
            />
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
          TAB 2: THESIS-TO-JOURNAL MANUSCRIPT CONVERTER (PAKISTAN HEC & INTERNATIONAL DIRECTORY)
         ===================================================================== */}
      {activeResearchTab === 'thesis-converter' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-end">
              <div className="lg:col-span-2">
                <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                  Select Target Pakistani HEC or International Journal from Directory *
                </label>
                <select
                  value={selectedStyle}
                  onChange={(e) =>
                    setSelectedStyle(e.target.value as CitationStyleId)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#1673B8] text-xs font-extrabold text-[#1A2138]"
                >
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

              <div>
                <label className="px-3.5 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Upload Thesis File (.txt/.doc/.docx)</span>
                  <input
                    type="file"
                    accept=".txt,.md,.doc,.docx,.html,.htm,.rtf"
                    onChange={handlePaperFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Journal Author Guidelines Card */}
            <div className="p-3.5 rounded-xl bg-white border border-[#D2DEEA] space-y-1.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-extrabold text-[#1673B8]">
                  {activeJournalMeta.label} — Author Requirements:
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-[#EBF4FC] text-[#105E9A] font-extrabold text-[11px]">
                  {activeJournalMeta.hecCategoryOrImpact}
                </span>
              </div>
              <p className="text-[#4A5568]">{activeJournalMeta.guidelinesSummary}</p>
              <div className="text-[11px] font-bold text-[#1A2138] pt-1">
                Required Section Order:{' '}
                <span className="text-[#1673B8]">
                  {activeJournalMeta.sectionOrder.join(' → ')}
                </span>
              </div>
            </div>
          </div>

          {/* EDITABLE THESIS SECTIONS + GENERATED JOURNAL MANUSCRIPT PREVIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3 bg-[#F0F6FC] p-4 rounded-2xl border border-[#D2DEEA]">
              <div className="text-xs font-extrabold text-[#1A2138]">
                Edit / Refine Extracted Thesis Sections Before Exporting:
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
              <div>
                <label className="block text-[11px] font-bold text-[#4A5568] mb-1">
                  Abstract (Target Journal Limit: {activeJournalMeta.abstractWordLimit} words)
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
                  Introduction &amp; Objectives
                </label>
                <textarea
                  rows={3}
                  value={editIntro}
                  onChange={(e) => setEditIntro(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs text-[#1A2138]"
                />
              </div>
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
                  Results and Discussion
                </label>
                <textarea
                  rows={3}
                  value={editResults}
                  onChange={(e) => setEditResults(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-[#94B8D7] text-xs text-[#1A2138]"
                />
              </div>
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

            {/* Right: Formatted Journal Manuscript Output + Download */}
            <div className="space-y-3 bg-[#F0F6FC] p-4 rounded-2xl border-2 border-[#1673B8] flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-extrabold text-[#1673B8]">
                    Formatted Manuscript ({activeJournalMeta.shortName})
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
                      onClick={handleDownloadManuscriptPdf}
                      className="px-3 py-1.5 rounded-lg bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const docHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Food Science Portal Manuscript</title></head><body style="font-family: Calibri, Arial, sans-serif; padding: 24px; color: #1A2138;">
                          <div style="display:flex; align-items:center; justify-content:space-between; background:#1A2138; color:#FFFFFF; padding:14px 18px; border-radius:10px; margin-bottom:20px;">
                            <div style="display:flex; align-items:center; gap:12px;">
                              <img src="${FS_PORTAL_LOGO_DATA_URI}" width="54" height="54" style="background:#FFFFFF; border-radius:8px; padding:2px;" alt="Food Science Portal Logo" />
                              <div>
                                <div style="font-size:18pt; font-weight:bold; color:#FFFFFF;">Food Science <span style="color:#7DD3FC;">Portal</span></div>
                                <div style="font-size:10pt; color:#DBEAFE;">Official Journal Manuscript • ${user?.name || 'Food Science Specialist'}</div>
                              </div>
                            </div>
                            ${user?.profilePicUrl ? `<img src="${user.profilePicUrl}" width="52" height="52" style="border-radius:8px; border:2px solid #7DD3FC; object-fit:cover;" alt="Author Photo" />` : ''}
                          </div>
                          <pre style="font-family: Calibri, Arial, sans-serif; white-space: pre-wrap; font-size: 11pt; line-height: 1.5;">${compiledJournalManuscript.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
                        </body></html>`;
                        handleDownloadFile(
                          `Food_Science_Portal_${activeJournalMeta.shortName.replace(
                            /[^a-zA-Z0-9]+/g,
                            '_'
                          )}_Manuscript.doc`,
                          docHtml,
                          'application/msword;charset=utf-8'
                        );
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#1A2138] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Word (.doc)</span>
                    </button>
                  </div>
                </div>

                <pre className="p-3.5 rounded-xl bg-white border border-[#D2DEEA] text-xs font-sans text-[#1A2138] whitespace-pre-wrap leading-relaxed max-h-[520px] overflow-y-auto">
                  {compiledJournalManuscript}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: RESEARCH DATA STATISTICAL ANALYSIS (ONE-WAY ANOVA, LSD, MEAN ± SD, CV%)
         ===================================================================== */}
      {activeResearchTab === 'statistics' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-[#1A2138]">
                  Research Data Statistical Analyzer (ANOVA, LSD 0.05, Mean ± SD &amp; Significance Letters)
                </h3>
                <p className="text-[11px] text-[#4A5568]">
                  Enter your experimental treatments and replication readings below (or upload a CSV file) to generate ANOVA, p-value significance, and publication-ready Mean ± SD tables
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
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Report</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadStatCsv}
                  className="px-3.5 py-2 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Excel / CSV</span>
                </button>
              </div>
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
                    <th className="p-2.5 font-extrabold">Treatment / Factor Level</th>
                    <th className="p-2.5 font-extrabold w-24">Rep 1 (R1)</th>
                    <th className="p-2.5 font-extrabold w-24">Rep 2 (R2)</th>
                    <th className="p-2.5 font-extrabold w-24">Rep 3 (R3)</th>
                    <th className="p-2.5 font-extrabold w-24">Rep 4 (Opt)</th>
                    <th className="p-2.5 font-extrabold text-sky-200">
                      Mean ± SD (LSD Letter)
                    </th>
                    <th className="p-2.5 font-extrabold w-12 text-center">Del</th>
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
                        {(['rep1', 'rep2', 'rep3', 'rep4'] as const).map(
                          (repField) => (
                            <td key={repField} className="p-2">
                              <input
                                type="number"
                                step="0.01"
                                value={row[repField]}
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
                          )
                        )}
                        <td className="p-2 font-mono font-extrabold text-[#1673B8]">
                          {computed ? computed.formattedMeanSd : '—'}
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
                    rep4: ''
                  }
                ])
              }
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#EBF4FC] border border-[#1673B8] text-[#1673B8] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Treatment Row</span>
            </button>
          </div>

          {/* COMPLETE ONE-WAY ANOVA TABLE & LSD SUMMARY */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#1A2138] text-white space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-3">
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-sky-300">
                  Analysis of Variance (One-Way CRD ANOVA) — {statParameterName}
                </div>
                <div className="text-sm font-extrabold text-white mt-0.5">
                  Result: <span className="text-amber-300">{statisticalAnalysis.significanceBadge}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="px-3 py-1 rounded-lg bg-white/10 font-mono font-bold">
                  Grand Mean = {statisticalAnalysis.grandMean}
                </span>
                <span className="px-3 py-1 rounded-lg bg-white/10 font-mono font-bold text-amber-300">
                  LSD (0.05) = {statisticalAnalysis.lsd05}
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
                    <th className="py-2 pr-3 font-extrabold">Source of Variation (SOV)</th>
                    <th className="py-2 px-3 font-extrabold">Degrees of Freedom (df)</th>
                    <th className="py-2 px-3 font-extrabold">Sum of Squares (SS)</th>
                    <th className="py-2 px-3 font-extrabold">Mean Square (MS)</th>
                    <th className="py-2 px-3 font-extrabold">Calculated F-Value</th>
                    <th className="py-2 pl-3 font-extrabold">Tabular F (5% / 1%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 font-mono">
                  <tr>
                    <td className="py-2.5 pr-3 font-sans font-bold text-white">
                      Between Treatments ({statFactorName})
                    </td>
                    <td className="py-2.5 px-3">{statisticalAnalysis.dfBetween}</td>
                    <td className="py-2.5 px-3">{statisticalAnalysis.ssBetween}</td>
                    <td className="py-2.5 px-3">{statisticalAnalysis.msBetween}</td>
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
                  <tr>
                    <td className="py-2.5 pr-3 font-sans font-bold text-slate-200">
                      Within Treatments (Error)
                    </td>
                    <td className="py-2.5 px-3">{statisticalAnalysis.dfWithin}</td>
                    <td className="py-2.5 px-3">{statisticalAnalysis.ssWithin}</td>
                    <td className="py-2.5 px-3">{statisticalAnalysis.msWithin}</td>
                    <td className="py-2.5 px-3">—</td>
                    <td className="py-2.5 pl-3">—</td>
                  </tr>
                  <tr className="text-sky-200 font-bold">
                    <td className="py-2.5 pr-3 font-sans">Total</td>
                    <td className="py-2.5 px-3">{statisticalAnalysis.dfTotal}</td>
                    <td className="py-2.5 px-3">{statisticalAnalysis.ssTotal}</td>
                    <td className="py-2.5 px-3">—</td>
                    <td className="py-2.5 px-3">—</td>
                    <td className="py-2.5 pl-3">—</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-[11px] text-slate-300 pt-1">
              Note: Means sharing the same alphabetical letter (a, b, c...) do not differ significantly at p &lt; 0.05 according to Least Significant Difference (LSD = {statisticalAnalysis.lsd05}, SED = {statisticalAnalysis.sed}). This table is automatically included in the Thesis-to-Journal Manuscript tab.
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: CITATION & REFERENCE GENERATOR (BULK BOX + MANUAL BUILDER)
         ===================================================================== */}
      {activeResearchTab === 'references' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div className="sm:col-span-2">
                <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                  1. Select Target Pakistani HEC or International Journal Style *
                </label>
                <select
                  value={selectedStyle}
                  onChange={(e) =>
                    setSelectedStyle(e.target.value as CitationStyleId)
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#1673B8] text-xs font-extrabold text-[#1A2138]"
                >
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

              <div className="flex items-center justify-between sm:justify-end gap-2 pb-1">
                <label className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1A2138] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sortAlphabetically}
                    onChange={(e) => setSortAlphabetically(e.target.checked)}
                    className="w-4 h-4 accent-[#1673B8] rounded cursor-pointer"
                  />
                  <span>Sort A–Z by Author</span>
                </label>
              </div>
            </div>

            {selectedStyle === 'custom_pattern' ? (
              <div>
                <label className="block text-[11px] font-extrabold text-[#105E9A] mb-1">
                  Custom Journal Reference Template (Use placeholders: {'{AUTHORS}'}, {'{YEAR}'}, {'{TITLE}'}, {'{JOURNAL}'}, {'{VOLUME}'}, {'{ISSUE}'}, {'{PAGES}'})
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
                {activeJournalMeta.examplePreview}
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
                rows={9}
                value={bulkRawText}
                onChange={(e) => setBulkRawText(e.target.value)}
                placeholder="Paste your raw references here (one per line)... They will automatically convert to your selected journal style on the right!"
                className="w-full p-3.5 rounded-2xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-medium text-[#1A2138] leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#1673B8]">
                  3. Formatted References ({formattedResults.length}) — Ready for Thesis / Paper:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopyText(
                      'all-refs',
                      formattedResults.map((r) => r.bibliography).join('\n\n')
                    )
                  }
                  className="px-3 py-1 rounded-lg bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'all-refs' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied All!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy All References</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F0F6FC] border-2 border-[#1673B8] max-h-60 overflow-y-auto space-y-2.5">
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
    </div>
  );
};

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
import { HubUser } from '../types/hub';
import { E_NUMBERS_DATABASE, ENumberAdditive } from '../data/eNumbersData';
import { jsPDF } from 'jspdf';
import { FS_PORTAL_LOGO_DATA_URI } from '../lib/brandLogo';
import { drawPdfBrandLogo, drawPdfUserPhoto } from '../lib/pdfBranding';

// ============================================================================
// 1. LAB & FORMULA CALCULATOR (SANITIZER PPM, TITRATABLE ACIDITY, BRIX/ACID & CONVERTER)
// ============================================================================
export const LabFormulaCalculatorTool: React.FC = () => {
  const [subMode, setSubMode] = useState<'ppm' | 'acidity' | 'converter'>('ppm');

  // A. Sanitizer / Chlorine PPM Dilution State
  const [sanitizerType, setSanitizerType] = useState<string>('Sodium Hypochlorite (Bleach)');
  const [stockStrengthPct, setStockStrengthPct] = useState<string>('5.25');
  const [waterVolumeLiters, setWaterVolumeLiters] = useState<string>('100');
  const [targetPpm, setTargetPpm] = useState<string>('200');

  const ppmResult = useMemo(() => {
    const stockPct = Math.max(0.01, Number(stockStrengthPct) || 5.25);
    const volL = Math.max(0.1, Number(waterVolumeLiters) || 100);
    const ppm = Math.max(1, Number(targetPpm) || 200);
    // 1% = 10,000 PPM. Volume of stock (mL) = (Target PPM * Water L * 1000) / (Stock % * 10,000) = (Target PPM * Water L) / (Stock % * 10)
    const stockMlRequired = (ppm * volL) / (stockPct * 10);
    const stockLitersRequired = stockMlRequired / 1000;
    const stockMlPerLiter = stockMlRequired / volL;

    let applicationGuide = 'Food contact surfaces & equipment sanitization (No-rinse up to 200 PPM).';
    if (ppm <= 60) {
      applicationGuide = 'Raw fruit & vegetable washing tank (typically 50–100 PPM free chlorine, pH 6.5–7.5).';
    } else if (ppm > 200 && ppm <= 400) {
      applicationGuide = 'Floor, drain, crates & non-food contact sanitization (Rinse required if applied to food surfaces).';
    } else if (ppm > 400) {
      applicationGuide = 'Heavy bio-security / footbath / mold disinfection (Strictly non-food contact or potable water rinse required).';
    }

    return {
      stockMlRequired: Number(stockMlRequired.toFixed(2)),
      stockLitersRequired: Number(stockLitersRequired.toFixed(4)),
      stockMlPerLiter: Number(stockMlPerLiter.toFixed(2)),
      applicationGuide
    };
  }, [stockStrengthPct, waterVolumeLiters, targetPpm]);

  // B. Titratable Acidity (% TA) & Brix:Acid Ratio State
  const [taSampleWeightG, setTaSampleWeightG] = useState<string>('10');
  const [taNaohMl, setTaNaohMl] = useState<string>('4.5');
  const [taNaohNormality, setTaNaohNormality] = useState<string>('0.1');
  const [taAcidFactor, setTaAcidFactor] = useState<string>('0.064'); // Citric Acid anhydrous = 0.064
  const [taSampleBrix, setTaSampleBrix] = useState<string>('12.5');

  const ACID_FACTORS = [
    { label: 'Citric Acid Anhydrous (Citrus / Soft Drinks / Jams) — Factor 0.064', val: '0.064' },
    { label: 'Citric Acid Monohydrate (Beverages) — Factor 0.070', val: '0.070' },
    { label: 'Lactic Acid (Milk, Yogurt, Curd, Fermented Foods) — Factor 0.090', val: '0.090' },
    { label: 'Malic Acid (Apple, Peach, Pear, Apricot Juice) — Factor 0.067', val: '0.067' },
    { label: 'Tartaric Acid (Grape Juice & Tamarind) — Factor 0.075', val: '0.075' },
    { label: 'Acetic Acid (Vinegar, Pickles, Ketchup, Mayonnaise) — Factor 0.060', val: '0.060' },
    { label: 'Oleic Acid (Free Fatty Acids / FFA in Edible Oils) — Factor 0.282', val: '0.282' }
  ];

  const taResult = useMemo(() => {
    const w = Math.max(0.1, Number(taSampleWeightG) || 10);
    const v = Math.max(0, Number(taNaohMl) || 0);
    const n = Math.max(0.001, Number(taNaohNormality) || 0.1);
    const eq = Math.max(0.01, Number(taAcidFactor) || 0.064);
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
    // Specific gravity at 20°C approximation from °Brix: SG = 1 / (1 - (Brix / 261.3))
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

  return (
    <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 sm:p-6 shadow-xs space-y-5">
      <div className="border-b border-[#D2DEEA] pb-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1673B8] text-white flex items-center justify-center shrink-0">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
              Lab &amp; Formula Calculator
            </h2>
            <p className="text-xs text-[#4A5568] font-medium">
              Sanitizer PPM Dilution, Titratable Acidity (% TA), Brix:Acid Ratio &amp; Food Unit Converter
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-[#F0F6FC] p-1 rounded-xl border border-[#D2DEEA]">
          {[
            { id: 'ppm' as const, label: 'Sanitizer PPM Dilution' },
            { id: 'acidity' as const, label: 'Titratable Acidity & Brix:Acid' },
            { id: 'converter' as const, label: 'Temp, PPM & Brix Converter' }
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

      {subMode === 'ppm' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Sanitizer / Chemical Type
              </label>
              <select
                value={sanitizerType}
                onChange={(e) => {
                  setSanitizerType(e.target.value);
                  if (e.target.value.includes('5.25')) setStockStrengthPct('5.25');
                  else if (e.target.value.includes('12%')) setStockStrengthPct('12');
                  else if (e.target.value.includes('15%')) setStockStrengthPct('15');
                  else if (e.target.value.includes('10%')) setStockStrengthPct('10');
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              >
                <option value="Household Bleach (5.25% NaOCl)">Household Bleach (5.25% NaOCl)</option>
                <option value="Industrial Liquid Chlorine (12% NaOCl)">Industrial Liquid Chlorine (12% NaOCl)</option>
                <option value="Peracetic Acid / PAA (15%)">Peracetic Acid / PAA (15%)</option>
                <option value="Quaternary Ammonium / QAC (10%)">Quaternary Ammonium / QAC (10%)</option>
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
              Exact Dosing Prescription for {waterVolumeLiters} Liters @ {targetPpm} PPM
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[11px] font-bold text-[#4A5568]">
                  Add Stock Chemical (mL)
                </div>
                <div className="text-2xl font-extrabold text-[#1673B8] mt-0.5 font-mono">
                  {ppmResult.stockMlRequired} mL
                </div>
                <div className="text-[11px] text-[#4A5568] mt-0.5">
                  ({ppmResult.stockLitersRequired} Liters total)
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[11px] font-bold text-[#4A5568]">
                  Dosing Rate per 1 Liter Water
                </div>
                <div className="text-2xl font-extrabold text-[#1A2138] mt-0.5 font-mono">
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
          </div>
        </div>
      )}

      {subMode === 'acidity' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
                Select Predominant Organic Acid (meq Factor)
              </label>
              <select
                value={taAcidFactor}
                onChange={(e) => setTaAcidFactor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
              >
                {ACID_FACTORS.map((af) => (
                  <option key={af.val} value={af.val}>
                    {af.label}
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

          <div className="p-4 rounded-2xl bg-[#F0F6FC] border-2 border-[#1673B8] grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-[#D2DEEA]">
              <div className="text-[11px] font-bold text-[#4A5568]">
                Titratable Acidity (% w/w or % w/v)
              </div>
              <div className="text-2xl font-extrabold text-[#1673B8] mt-0.5 font-mono">
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
              <div className="text-2xl font-extrabold text-[#1A2138] mt-0.5 font-mono">
                {taResult.brixAcidRatio} : 1
              </div>
              <div className="text-[11px] text-[#4A5568] mt-0.5">
                {taResult.brixAcidRatio >= 12 && taResult.brixAcidRatio <= 22
                  ? 'Balanced sensory sweetness-to-tartness ratio for beverages/juices'
                  : 'Check product sensory spec (Typical juices: 12:1 to 22:1)'}
              </div>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

// ============================================================================
// 2. PEARSON SQUARE & BATCH STANDARDIZATION / CORRECTION CALCULATOR
//    (BEVERAGE / JUICE BRIX + ACIDITY + WATER CORRECTOR & DAIRY FAT/SNF STANDARDIZER)
// ============================================================================
export const PearsonSquareBatchTool: React.FC = () => {
  const [industryMode, setIndustryMode] = useState<'beverage' | 'dairy' | 'classic'>('beverage');

  // MODE 1: BEVERAGE / JUICE / SYRUP BATCH CORRECTION (Current Out-of-Spec Batch -> Exact Water, Sugar & Acid to Add)
  const [bevBatchKg, setBevBatchKg] = useState<string>('500');
  const [bevCurrentBrix, setBevCurrentBrix] = useState<string>('10.2');
  const [bevTargetBrix, setBevTargetBrix] = useState<string>('13.0');
  const [bevCurrentAcid, setBevCurrentAcid] = useState<string>('0.18');
  const [bevTargetAcid, setBevTargetAcid] = useState<string>('0.28');
  const [bevSugarSourceBrix, setBevSugarSourceBrix] = useState<string>('100'); // 100% crystalline sugar or 65% syrup

  const beverageCorrection = useMemo(() => {
    const M0 = Math.max(1, Number(bevBatchKg) || 500);
    const B0 = Math.max(0, Number(bevCurrentBrix) || 0);
    const Bt = Math.max(0.1, Number(bevTargetBrix) || 13);
    const A0 = Math.max(0, Number(bevCurrentAcid) || 0);
    const At = Math.max(0.01, Number(bevTargetAcid) || 0.25);
    const Bs = Math.max(Bt + 1, Number(bevSugarSourceBrix) || 100);

    // Current solids (kg) and current acid (kg) in batch M0
    const currentSolidsKg = M0 * (B0 / 100);
    const currentAcidKg = M0 * (A0 / 100);

    // Determine minimum final batch mass needed so we never have to remove water, sugar, or acid:
    // 1) Final mass must be >= M0
    // 2) If currentAcidKg > M_final * (At/100), we need M_final >= currentAcidKg / (At/100)
    // 3) If currentSolidsKg > M_final * (Bt/100), we need M_final >= currentSolidsKg / (Bt/100)
    const minMassForAcid = At > 0 ? currentAcidKg / (At / 100) : M0;
    const minMassForBrix = Bt > 0 ? currentSolidsKg / (Bt / 100) : M0;

    // Solve simultaneous mass balance when adding S kg of Sugar Source (Brix Bs), C kg of Anhydrous Citric Acid (100% solids), and W kg of Water (0% solids):
    // Target equations for final mass Mf = M0 + S + C + W:
    // Acid balance: currentAcidKg + C = Mf * (At / 100)  => C = Mf*(At/100) - currentAcidKg
    // Brix/Solids balance: currentSolidsKg + S*(Bs/100) + C = Mf * (Bt / 100)
    // Water >= 0 means Mf >= M0 + S + C

    // First check minimum Mf assuming W = 0:
    // If W = 0, Mf = M0 + S + C.
    // Substitute C = Mf*(At/100) - currentAcidKg and S = [Mf*(Bt/100) - currentSolidsKg - C] / (Bs/100):
    const bsFrac = Bs / 100;
    const btFrac = Bt / 100;
    const atFrac = At / 100;

    // With W = 0: Mf - M0 = C + [Mf*btFrac - currentSolidsKg - C] / bsFrac
    // Multiply by bsFrac: bsFrac*(Mf - M0) = bsFrac*C + Mf*btFrac - currentSolidsKg - C
    // Let's compute Mf_noWater directly:
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

    return {
      brixStatus,
      acidStatus,
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
    bevSugarSourceBrix
  ]);

  // MODE 2: DAIRY MILK STANDARDIZATION (Current Milk Batch -> Target Fat % & SNF %)
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
    const Scream = (100 - Fcream) * 0.09; // SNF in cream ~3.5 - 5.4%

    let addSkimKg = 0;
    let addCreamKg = 0;
    let addSmpKg = 0;
    let addWaterKg = 0;

    // Step 1: Adjust Fat using Skim Milk (if F0 > Ft) or Cream (if F0 < Ft)
    if (F0 > Ft && Ft > Fskim) {
      // Pearson Square with Skim Milk: Skim needed per part of M0 = (F0 - Ft) / (Ft - Fskim)
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

    // Step 2: If SNF is still below target St, calculate Skim Milk Powder (SMP, 96% SNF) to add
    if (currentSnfPct < St) {
      addSmpKg =
        (intermediateMass * (St - currentSnfPct)) / (96 - St);
    } else if (currentSnfPct > St + 0.15 && F0 > Ft) {
      // Water needed if both Fat and SNF were too high
      addWaterKg =
        (intermediateMass * (currentSnfPct - St)) / St;
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

  // MODE 3: CLASSIC 2-INGREDIENT PEARSON SQUARE
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

  return (
    <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 sm:p-6 shadow-xs space-y-5">
      <div className="border-b border-[#D2DEEA] pb-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1A2138] text-white flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
              Pearson Square &amp; Batch Standardization Calculator
            </h2>
            <p className="text-xs text-[#4A5568] font-medium">
              Compare Current Sample vs. Required Spec — Get Exact Water, Sugar, Acid, Cream or Skim Milk to Add
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-[#F0F6FC] p-1 rounded-xl border border-[#D2DEEA]">
          {[
            { id: 'beverage' as const, label: 'Juice & Beverage Batch Corrector' },
            { id: 'dairy' as const, label: 'Dairy Fat & SNF Standardizer' },
            { id: 'classic' as const, label: 'Classic Pearson Square' }
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setIndustryMode(m.id)}
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

      {/* MODE 1: JUICE & BEVERAGE BATCH CORRECTOR */}
      {industryMode === 'beverage' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box A: Current Out-of-Spec Batch Details */}
            <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
              <div className="text-xs font-extrabold text-[#1A2138] uppercase tracking-wider border-b border-[#D2DEEA] pb-2">
                1. Current Batch / Lab Sample Details (Out-of-Spec)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
              </div>
              <div className="text-[11px] font-bold text-[#4A5568]">
                Current Brix:Acid Ratio: <span className="text-[#1A2138] font-extrabold">{beverageCorrection.currentRatio} : 1</span>
              </div>
            </div>

            {/* Box B: Required Target Product Specification */}
            <div className="p-4 rounded-2xl bg-[#EBF4FC] border border-[#1673B8]/40 space-y-3">
              <div className="text-xs font-extrabold text-[#105E9A] uppercase tracking-wider border-b border-[#D2DEEA] pb-2">
                2. Required Target Product Specification
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
              <div className="text-[11px] font-bold text-[#105E9A]">
                Target Brix:Acid Ratio: <span className="font-extrabold">{beverageCorrection.targetRatio} : 1</span> (100 = Dry Sugar, 65 = 65°Bx Syrup)
              </div>
            </div>
          </div>

          {/* Box C: Exact Correction Prescription */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#1A2138] text-white space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-2.5">
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-sky-300">
                  Batch Standardization Prescription (Add to Current {bevBatchKg} L/kg Batch)
                </div>
                <div className="text-xs text-slate-200 mt-0.5">
                  Brix Status: <strong>{beverageCorrection.brixStatus}</strong> · Acidity Status: <strong>{beverageCorrection.acidStatus}</strong>
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
                  ({beverageCorrection.addAcidGrams.toLocaleString()} grams)
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
                  Verified Output: {beverageCorrection.verifiedBrix}°Bx &amp; {beverageCorrection.verifiedAcid}% Acid
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: DAIRY FAT & SNF STANDARDIZATION */}
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

          <div className="p-4 rounded-2xl bg-[#1A2138] text-white space-y-3">
            <div className="text-xs font-extrabold text-sky-300 uppercase tracking-wider">
              Dairy Standardization Prescription (To Achieve {dairyTargetFat}% Fat &amp; {dairyTargetSnf}% SNF)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] text-sky-200 font-bold">Add Skim Milk</div>
                <div className="text-lg font-extrabold font-mono mt-0.5">
                  + {dairyCorrection.addSkimKg} kg
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] text-sky-200 font-bold">Add Cream ({creamFat}%)</div>
                <div className="text-lg font-extrabold font-mono mt-0.5">
                  + {dairyCorrection.addCreamKg} kg
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] text-sky-200 font-bold">Add Skim Milk Powder (SMP)</div>
                <div className="text-lg font-extrabold text-amber-300 font-mono mt-0.5">
                  + {dairyCorrection.addSmpKg} kg
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/10 border border-white/15">
                <div className="text-[11px] text-sky-200 font-bold">Final Standardized Milk</div>
                <div className="text-lg font-extrabold text-emerald-300 font-mono mt-0.5">
                  {dairyCorrection.finalMass} kg
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: CLASSIC 2-STREAM PEARSON SQUARE */}
      {industryMode === 'classic' && (
        <div className="space-y-4">
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
              Target concentration ({psTargetVal}%) must lie between Ingredient A ({psHighVal}%) and Ingredient B ({psLowVal}%).
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#F0F6FC] border-2 border-[#1673B8] grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[11px] font-bold text-[#4A5568]">
                  Ingredient A ({psHighVal}%) Required
                </div>
                <div className="text-2xl font-extrabold text-[#1673B8] font-mono mt-0.5">
                  {classicPearson.highAmount} kg/L
                </div>
                <div className="text-[11px] text-[#4A5568] mt-0.5">
                  {classicPearson.highParts} parts ({classicPearson.highPct}% of batch)
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-[#D2DEEA]">
                <div className="text-[11px] font-bold text-[#4A5568]">
                  Ingredient B ({psLowVal}%) Required
                </div>
                <div className="text-2xl font-extrabold text-[#1A2138] font-mono mt-0.5">
                  {classicPearson.lowAmount} kg/L
                </div>
                <div className="text-[11px] text-[#4A5568] mt-0.5">
                  {classicPearson.lowParts} parts ({classicPearson.lowPct}% of batch)
                </div>
              </div>
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

export const LabSolutionMolarityTool: React.FC = () => {
  const [selectedReagentIdx, setSelectedReagentIdx] = useState<number>(0);
  const [mw, setMw] = useState<string>('40.0');
  const [nFactor, setNFactor] = useState<string>('1');
  const [concMode, setConcMode] = useState<'N' | 'M'>('N');
  const [targetConc, setTargetConc] = useState<string>('0.1');
  const [targetVolMl, setTargetVolMl] = useState<string>('1000');
  const [purityPct, setPurityPct] = useState<string>('99');

  // Stock liquid dilution (C1V1 = C2V2)
  const [c1, setC1] = useState<string>('1.0');
  const [c2, setC2] = useState<string>('0.1');
  const [v2Ml, setV2Ml] = useState<string>('500');

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

  return (
    <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 sm:p-6 shadow-xs space-y-5">
      <div className="border-b border-[#D2DEEA] pb-3.5 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#1673B8] text-white flex items-center justify-center shrink-0">
          <FlaskConical className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
            Lab Solution &amp; Molarity / Normality Calculator
          </h2>
          <p className="text-xs text-[#4A5568] font-medium">
            Analytical Reagent Preparation (Grams to Weigh) &amp; Stock Dilution Formula (C1 × V1 = C2 × V2)
          </p>
        </div>
      </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
              Select Food Lab Chemical / Reagent (Auto-Fills Molecular Weight &amp; Valency Factor)
            </label>
            <select
              value={selectedReagentIdx}
              onChange={(e) => {
                const idx = Number(e.target.value);
                setSelectedReagentIdx(idx);
                const r = LAB_REAGENTS[idx];
                if (r) {
                  setMw(String(r.mw));
                  setNFactor(String(r.nFactor));
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
            >
              {LAB_REAGENTS.map((r, i) => (
                <option key={r.name} value={i}>
                  {r.name} — Molecular Wt: {r.mw} g/mol (Valency Factor = {r.nFactor})
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
      </div>
    </div>
  );
};

// ============================================================================
// 4. MOISTURE, ASH & PROXIMATE ANALYSIS % CALCULATOR
// ============================================================================
export const MoistureAshYieldTool: React.FC = () => {
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

  return (
    <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 sm:p-6 shadow-xs space-y-5">
      <div className="border-b border-[#D2DEEA] pb-3.5 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#1A2138] text-white flex items-center justify-center shrink-0">
          <Beaker className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
            Moisture, Ash &amp; Proximate Analysis % Calculator
          </h2>
          <p className="text-xs text-[#4A5568] font-medium">
            Gravimetric Oven Moisture %, Total Solids / Dry Matter %, Muffle Furnace Ash % &amp; Kjeldahl Crude Protein %
          </p>
        </div>
      </div>

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
    </div>
  );
};

// ============================================================================
// 5. PRODUCTION FLOOR & LINE WORKERS TOOL (PROCESS YIELD %, WASTAGE, LINE OEE & LABOR)
// ============================================================================
export const ProductionFloorWorkersTool: React.FC = () => {
  // Yield & Wastage
  const [rawInputKg, setRawInputKg] = useState<string>('1200');
  const [trimmedPreppedKg, setTrimmedPreppedKg] = useState<string>('1050');
  const [finalPackedKg, setFinalPackedKg] = useState<string>('990');
  const [rawCostPerKg, setRawCostPerKg] = useState<string>('220');

  // Shift Line Efficiency, OEE & Workers Productivity
  const [lineSpeedPerMin, setLineSpeedPerMin] = useState<string>('60');
  const [shiftHours, setShiftHours] = useState<string>('8');
  const [plannedBreakMins, setPlannedBreakMins] = useState<string>('30');
  const [unplannedDowntimeMins, setUnplannedDowntimeMins] = useState<string>('25');
  const [actualProducedPacks, setActualProducedPacks] = useState<string>('23500');
  const [rejectedDamagedPacks, setRejectedDamagedPacks] = useState<string>('320');
  const [workersCount, setWorkersCount] = useState<string>('12');

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

  const lineStats = useMemo(() => {
    const speed = Math.max(1, Number(lineSpeedPerMin) || 60);
    const totalShiftMins = Math.max(30, (Number(shiftHours) || 8) * 60);
    const plannedMins = Math.max(0, Number(plannedBreakMins) || 0);
    const downtimeMins = Math.max(0, Number(unplannedDowntimeMins) || 0);
    const actualTotal = Math.max(0, Number(actualProducedPacks) || 0);
    const rejects = Math.max(0, Number(rejectedDamagedPacks) || 0);
    const workers = Math.max(1, Number(workersCount) || 1);

    const plannedProductionMins = Math.max(1, totalShiftMins - plannedMins);
    const operatingMins = Math.max(1, plannedProductionMins - downtimeMins);
    const availabilityPct = (operatingMins / plannedProductionMins) * 100;

    const theoreticalMaxAtOperating = operatingMins * speed;
    const performancePct =
      theoreticalMaxAtOperating > 0
        ? (actualTotal / theoreticalMaxAtOperating) * 100
        : 0;

    const goodPacks = Math.max(0, actualTotal - rejects);
    const qualityPct = actualTotal > 0 ? (goodPacks / actualTotal) * 100 : 100;

    const oeePct =
      (availabilityPct / 100) *
      (performancePct / 100) *
      (qualityPct / 100) *
      100;

    const packsPerWorkerShift = goodPacks / workers;
    const packsPerWorkerHour =
      packsPerWorkerShift / Math.max(1, Number(shiftHours) || 8);

    return {
      operatingMins,
      goodPacks,
      availabilityPct: Number(Math.min(100, availabilityPct).toFixed(1)),
      performancePct: Number(Math.min(100, performancePct).toFixed(1)),
      qualityPct: Number(Math.min(100, qualityPct).toFixed(2)),
      oeePct: Number(Math.min(100, oeePct).toFixed(1)),
      packsPerWorkerShift: Math.round(packsPerWorkerShift),
      packsPerWorkerHour: Math.round(packsPerWorkerHour)
    };
  }, [
    lineSpeedPerMin,
    shiftHours,
    plannedBreakMins,
    unplannedDowntimeMins,
    actualProducedPacks,
    rejectedDamagedPacks,
    workersCount
  ]);

  return (
    <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 sm:p-6 shadow-xs space-y-5">
      <div className="border-b border-[#D2DEEA] pb-3.5 flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-[#1673B8] text-white flex items-center justify-center shrink-0">
          <Factory className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
            Production Floor, Process Yield &amp; Line Workers Calculator
          </h2>
          <p className="text-xs text-[#4A5568] font-medium">
            Raw-to-Packed Process Yield %, Trim/Wastage Loss, Shift OEE &amp; Worker Output Efficiency
          </p>
        </div>
      </div>

      {/* 1. PROCESS YIELD & WASTAGE */}
      <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
        <div className="text-xs font-extrabold text-[#1673B8] uppercase tracking-wider">
          1. Batch Process Yield %, Peeling/Trim Loss &amp; Cost Impact
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

      {/* 2. SHIFT LINE OEE & WORKER OUTPUT */}
      <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
        <div className="text-xs font-extrabold text-[#1673B8] uppercase tracking-wider">
          2. Packaging / Processing Line OEE &amp; Workers Productivity
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          <div>
            <label className="block text-[10.5px] font-extrabold text-[#1A2138] mb-1">
              Speed (Packs/min)
            </label>
            <input
              type="number"
              value={lineSpeedPerMin}
              onChange={(e) => setLineSpeedPerMin(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
            />
          </div>
          <div>
            <label className="block text-[10.5px] font-extrabold text-[#1A2138] mb-1">
              Shift (Hours)
            </label>
            <input
              type="number"
              value={shiftHours}
              onChange={(e) => setShiftHours(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
            />
          </div>
          <div>
            <label className="block text-[10.5px] font-extrabold text-[#1A2138] mb-1">
              Break (Mins)
            </label>
            <input
              type="number"
              value={plannedBreakMins}
              onChange={(e) => setPlannedBreakMins(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
            />
          </div>
          <div>
            <label className="block text-[10.5px] font-extrabold text-[#1A2138] mb-1">
              Downtime (Mins)
            </label>
            <input
              type="number"
              value={unplannedDowntimeMins}
              onChange={(e) => setUnplannedDowntimeMins(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
            />
          </div>
          <div>
            <label className="block text-[10.5px] font-extrabold text-[#1A2138] mb-1">
              Total Produced
            </label>
            <input
              type="number"
              value={actualProducedPacks}
              onChange={(e) => setActualProducedPacks(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
            />
          </div>
          <div>
            <label className="block text-[10.5px] font-extrabold text-[#1A2138] mb-1">
              Rejected Packs
            </label>
            <input
              type="number"
              value={rejectedDamagedPacks}
              onChange={(e) => setRejectedDamagedPacks(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
            />
          </div>
          <div>
            <label className="block text-[10.5px] font-extrabold text-[#1A2138] mb-1">
              Line Workers
            </label>
            <input
              type="number"
              value={workersCount}
              onChange={(e) => setWorkersCount(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#1A2138] text-white grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div>
            <div className="text-[10.5px] text-sky-200 font-bold">Overall Line OEE</div>
            <div className="text-xl font-extrabold text-amber-300 font-mono">
              {lineStats.oeePct}%
            </div>
          </div>
          <div>
            <div className="text-[10.5px] text-sky-200 font-bold">Availability</div>
            <div className="text-base font-extrabold font-mono">
              {lineStats.availabilityPct}% ({lineStats.operatingMins}m)
            </div>
          </div>
          <div>
            <div className="text-[10.5px] text-sky-200 font-bold">Speed Performance</div>
            <div className="text-base font-extrabold font-mono">
              {lineStats.performancePct}%
            </div>
          </div>
          <div>
            <div className="text-[10.5px] text-sky-200 font-bold">First-Pass Quality</div>
            <div className="text-base font-extrabold text-emerald-300 font-mono">
              {lineStats.qualityPct}%
            </div>
          </div>
          <div>
            <div className="text-[10.5px] text-sky-200 font-bold">Worker Productivity</div>
            <div className="text-sm font-extrabold font-mono">
              {lineStats.packsPerWorkerHour} packs/worker/hr
            </div>
          </div>
        </div>
      </div>
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

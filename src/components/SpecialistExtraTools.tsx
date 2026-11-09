import React, { useState, useMemo } from 'react';
import {
  Beaker,
  BookOpen,
  Calculator,
  Check,
  Copy,
  Factory,
  FileText,
  FlaskConical,
  Mail,
  Percent,
  Plus,
  RefreshCw,
  Scale,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2
} from 'lucide-react';
import { HubUser } from '../types/hub';
import { E_NUMBERS_DATABASE, ENumberAdditive } from '../data/eNumbersData';

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
                Normality of NaOH ($N$)
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
            Analytical Reagent Preparation (Grams to Weigh) &amp; Stock Dilution ($C_1V_1 = C_2V_2$)
          </p>
        </div>
      </div>

      {/* SECTION 1: SOLID REAGENT TO MOLAR / NORMAL SOLUTION */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1673B8]">
          1. Prepare Molar ($M$) or Normal ($N$) Solution from Solid Reagent
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
              Select Food Lab Chemical / Reagent (Auto-Fills MW &amp; Valency $n$)
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
                  {r.name} — MW: {r.mw} g/mol (n = {r.nFactor})
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
              Molecular Wt (g/mol)
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
              Valency Factor ($n$)
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
              Desired {concMode} ({concMode === 'N' ? 'eq/L' : 'mol/L'})
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
              Exact Mass to Weigh on Balance
            </div>
            <div className="text-2xl font-extrabold text-amber-300 font-mono mt-0.5">
              {solidCalc.actualGramsToWeigh} g
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">
              (Pure 100% basis: {solidCalc.pureGrams} g)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/10 border border-white/15">
            <div className="text-[11px] text-sky-200 font-bold">
              Equivalent Weight &amp; Strength
            </div>
            <div className="text-sm font-extrabold text-white font-mono mt-1">
              Eq. Wt = {solidCalc.eqWeight} g/eq
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">
              {solidCalc.equivNormality} N = {solidCalc.equivMolarity} M
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/10 border border-white/15">
            <div className="text-[11px] text-sky-200 font-bold">
              Lab Preparation Protocol
            </div>
            <div className="text-[11px] text-slate-200 mt-1 leading-snug">
              Weigh <strong>{solidCalc.actualGramsToWeigh} g</strong>, dissolve in ~{Math.round(Number(targetVolMl) * 0.6)} mL distilled water, cool to 20°C, and make up volume to <strong>{targetVolMl} mL</strong> in a volumetric flask.
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: C1V1 = C2V2 LIQUID DILUTION */}
      <div className="pt-3 border-t border-[#D2DEEA] space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1673B8]">
          2. Stock Solution Dilution Calculator ($C_1V_1 = C_2V_2$)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
              Stock Concentration ($C_1$ in N, M, or %)
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
              Desired Concentration ($C_2$)
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
              Desired Final Volume ($V_2$ in mL)
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
            <span className="font-bold text-[#4A5568]">Pipette Stock Solution ($V_1$): </span>
            <span className="text-base font-extrabold text-[#1673B8] font-mono">
              {dilutionCalc.v1Ml} mL
            </span>
          </div>
          <div>
            <span className="font-bold text-[#4A5568]">Add Distilled Water: </span>
            <span className="text-base font-extrabold text-[#1A2138] font-mono">
              + {dilutionCalc.waterToAddMl} mL
            </span>
          </div>
          <div className="font-bold text-[#105E9A]">
            Total Final Volume = {v2Ml} mL
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
  const [kProteinFactor, setKProteinFactor] = useState<string>('6.25');

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
    const pf = Math.max(1, Number(kProteinFactor) || 6.25);

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
    kProteinFactor
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
            Gravimetric Oven Moisture %, Dry Matter %, Muffle Furnace Total Ash % &amp; Kjeldahl Crude Protein %
          </p>
        </div>
      </div>

      {/* 1. MOISTURE & TOTAL SOLIDS */}
      <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
        <div className="text-xs font-extrabold text-[#1673B8] uppercase tracking-wider">
          1. Moisture &amp; Dry Matter (Total Solids) %
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
              Empty Dish Weight $W_1$ (g)
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
              Dish + Wet Sample $W_2$ (g)
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
              Dish + Dried Sample $W_3$ (g)
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
            <div className="text-[10.5px] font-bold text-[#4A5568]">Moisture (Wet Basis)</div>
            <div className="text-lg font-extrabold text-[#1673B8] font-mono">
              {moistureCalc.moistureWetBasis}%
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
            <div className="text-[10.5px] font-bold text-[#4A5568]">Total Solids / Dry Matter</div>
            <div className="text-lg font-extrabold text-[#1A2138] font-mono">
              {moistureCalc.totalSolidsPct}%
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
            <div className="text-[10.5px] font-bold text-[#4A5568]">Moisture (Dry Basis)</div>
            <div className="text-lg font-extrabold text-[#1A2138] font-mono">
              {moistureCalc.moistureDryBasis}%
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
            <div className="text-[10.5px] font-bold text-[#4A5568]">Sample / Water Loss</div>
            <div className="text-xs font-extrabold text-[#4A5568] font-mono mt-1">
              {moistureCalc.wetSampleG}g / -{moistureCalc.waterLossG}g
            </div>
          </div>
        </div>
      </div>

      {/* 2. TOTAL ASH % */}
      <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
        <div className="text-xs font-extrabold text-[#1673B8] uppercase tracking-wider">
          2. Total Ash % (Muffle Furnace @ 550°C)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
              Empty Crucible $W_1$ (g)
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
              Crucible + Sample $W_2$ (g)
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
              Crucible + Ash $W_3$ (g)
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
            <div className="text-[10.5px] font-bold text-[#4A5568]">Net Ash Residue</div>
            <div className="text-sm font-extrabold text-[#4A5568] font-mono mt-1">
              {ashCalc.ashG} g (from {ashCalc.sampleG} g)
            </div>
          </div>
        </div>
      </div>

      {/* 3. KJELDAHL CRUDE PROTEIN % */}
      <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
        <div className="text-xs font-extrabold text-[#1673B8] uppercase tracking-wider">
          3. Kjeldahl Nitrogen &amp; Crude Protein % Calculator
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <div>
            <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
              Sample Wt (g)
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
              Sample Titre (mL)
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
              Blank Titre (mL)
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
              Acid Normality ($N$)
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
              N Factor
            </label>
            <select
              value={kProteinFactor}
              onChange={(e) => setKProteinFactor(e.target.value)}
              className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
            >
              <option value="6.25">6.25 (Meat/General)</option>
              <option value="6.38">6.38 (Milk &amp; Dairy)</option>
              <option value="5.70">5.70 (Wheat Flour)</option>
              <option value="5.71">5.71 (Soybean)</option>
              <option value="5.95">5.95 (Rice)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
            <div className="text-[10.5px] font-bold text-[#4A5568]">Total Nitrogen (% N)</div>
            <div className="text-lg font-extrabold text-[#1A2138] font-mono">
              {kjeldahlCalc.nitrogenPct}%
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white border border-[#D2DEEA]">
            <div className="text-[10.5px] font-bold text-[#4A5568]">
              Crude Protein (% N × {kProteinFactor})
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
  const [jobTitle, setJobTitle] = useState<string>('Quality Assurance (QA/QC) Officer');
  const [companyName, setCompanyName] = useState<string>('');
  const [hrEmail, setHrEmail] = useState<string>('');
  const [experienceTone, setExperienceTone] = useState<'experienced' | 'fresh' | 'lead'>('experienced');
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
    const cleanJob = jobTitle.trim() || 'Food Safety & Quality Specialist';
    const cleanComp = companyName.trim() || 'your esteemed organization';
    const compLabelForSubject = companyName.trim() ? ` — ${companyName.trim()}` : '';

    const subject = `Application for ${cleanJob}${compLabelForSubject} — ${applicantName} (${applicantQualification})`;

    const introParagraph =
      experienceTone === 'fresh'
        ? `I am writing to express my strong interest in the ${cleanJob} position at ${cleanComp}. I hold a degree in ${applicantQualification} and have developed a strong foundation in food analysis, HACCP, GMP compliance, and quality control procedures.`
        : experienceTone === 'lead'
        ? `I am writing to apply for the senior role of ${cleanJob} at ${cleanComp}. With an academic background in ${applicantQualification} and proven leadership as a ${applicantCurrentRole}, I bring comprehensive expertise in GFSI standards, ISO 22000/FSSC 22000 auditing, and zero-non-conformance plant operations.`
        : `I am writing to formally apply for the position of ${cleanJob} at ${cleanComp}. Holding a qualification in ${applicantQualification} and working as a ${applicantCurrentRole}, I bring practical expertise in ${applicantExperienceSummary}.`;

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

Subject: Formal Application for the Post of ${cleanJob}

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
    experienceTone,
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
              Auto-personalized from your Profile ({applicantName}) — Enter Job Title &amp; Send in 1 Click
            </p>
          </div>
        </div>
      </div>

      {/* QUICK JOB TITLE PICKER + INPUTS */}
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {[
            'Quality Assurance (QA/QC) Officer',
            'Food Safety & Hygiene Officer',
            'Production Supervisor',
            'R&D Food Technologist',
            'Microbiologist / Lab Analyst',
            'Management Trainee (MTO) - Food Science'
          ].map((presetTitle) => (
            <button
              key={presetTitle}
              type="button"
              onClick={() => setJobTitle(presetTitle)}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold cursor-pointer border ${
                jobTitle === presetTitle
                  ? 'bg-[#1673B8] text-white border-[#1673B8]'
                  : 'bg-[#F0F6FC] text-[#1A2138] border-[#D2DEEA]'
              }`}
            >
              {presetTitle}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
              Target Job Title *
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., QA Officer / Food Technologist"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
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
              placeholder="e.g., Nestlé / Engro Foods / PepsiCo"
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
              Experience Level / Tone
            </label>
            <select
              value={experienceTone}
              onChange={(e) =>
                setExperienceTone(e.target.value as 'experienced' | 'fresh' | 'lead')
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-bold text-[#1A2138]"
            >
              <option value="experienced">Experienced Professional</option>
              <option value="fresh">Fresh Graduate / Internship</option>
              <option value="lead">Senior / Manager / Lead Auditor</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
              Optional Extra Note / Achievement to Include
            </label>
            <input
              type="text"
              value={customHighlight}
              onChange={(e) => setCustomHighlight(e.target.value)}
              placeholder="e.g., I am immediately available and certified in ISO 22000 Lead Auditing."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F6FC] border border-[#94B8D7] text-xs font-semibold text-[#1A2138]"
            />
          </div>
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
// 8. CITATION & REFERENCE GENERATOR (PAKISTANI HEC JOURNALS + INTERNATIONAL FORMATS + BULK PASTE BOX)
// ============================================================================
export type CitationStyleId =
  | 'pjas'
  | 'pjn'
  | 'japs'
  | 'pjsir'
  | 'apa7'
  | 'harvard'
  | 'elsevier_foodchem'
  | 'ift_jfs'
  | 'jds'
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

const CITATION_STYLES: Array<{
  id: CitationStyleId;
  label: string;
  region: 'Pakistan HEC Journals' | 'International Journals & Styles';
  examplePreview: string;
}> = [
  {
    id: 'pjas',
    label: 'Pakistan Journal of Agricultural Sciences (PJAS)',
    region: 'Pakistan HEC Journals',
    examplePreview: 'Khan, M.A., S. Ahmad and T. Mahmood. 2025. Quality evaluation of mango pulp during storage. Pak. J. Agri. Sci. 62:112-118.'
  },
  {
    id: 'pjn',
    label: 'Pakistan Journal of Nutrition (PJN)',
    region: 'Pakistan HEC Journals',
    examplePreview: 'Khan, M.A., S. Ahmad and T. Mahmood, 2025. Quality evaluation of mango pulp during storage. Pak. J. Nutr., 24: 112-118.'
  },
  {
    id: 'japs',
    label: 'Journal of Animal and Plant Sciences (JAPS - Pakistan)',
    region: 'Pakistan HEC Journals',
    examplePreview: 'Khan, M.A., S. Ahmad and T. Mahmood (2025). Quality evaluation of mango pulp during storage. J. Anim. Plant Sci. 35(2): 112-118.'
  },
  {
    id: 'pjsir',
    label: 'Pak. J. Scientific & Industrial Research (PJSIR)',
    region: 'Pakistan HEC Journals',
    examplePreview: 'Khan, M.A., Ahmad, S., Mahmood, T. 2025. Quality evaluation of mango pulp during storage. Pak. J. Sci. Ind. Res. Ser. B: Biol. Sci., 68(1): 112-118.'
  },
  {
    id: 'apa7',
    label: 'APA 7th Edition (Standard University & Thesis Format)',
    region: 'International Journals & Styles',
    examplePreview: 'Khan, M. A., Ahmad, S., & Mahmood, T. (2025). Quality evaluation of mango pulp during storage. Journal of Food Science and Technology, 62(2), 112–118. https://doi.org/10.xxxx'
  },
  {
    id: 'elsevier_foodchem',
    label: 'Elsevier — Food Chemistry / LWT - Food Science & Technology',
    region: 'International Journals & Styles',
    examplePreview: 'Khan, M. A., Ahmad, S., & Mahmood, T. (2025). Quality evaluation of mango pulp during storage. Food Chemistry, 410, 112–118.'
  },
  {
    id: 'ift_jfs',
    label: 'Journal of Food Science (IFT / Wiley Style)',
    region: 'International Journals & Styles',
    examplePreview: 'Khan, M. A., Ahmad, S., & Mahmood, T. (2025). Quality evaluation of mango pulp during storage. Journal of Food Science, 90(2), 112–118.'
  },
  {
    id: 'jds',
    label: 'Journal of Dairy Science (JDS)',
    region: 'International Journals & Styles',
    examplePreview: 'Khan, M. A., S. Ahmad, and T. Mahmood. 2025. Quality evaluation of mango pulp during storage. J. Dairy Sci. 108:112–118.'
  },
  {
    id: 'harvard',
    label: 'Harvard Referencing Style',
    region: 'International Journals & Styles',
    examplePreview: "Khan, M.A., Ahmad, S. and Mahmood, T., 2025. 'Quality evaluation of mango pulp during storage', Journal of Food Protection, 62(2), pp. 112-118."
  },
  {
    id: 'ieee_vancouver',
    label: 'Vancouver / IEEE Numbered Style [1]',
    region: 'International Journals & Styles',
    examplePreview: '[1] M. A. Khan, S. Ahmad, and T. Mahmood, "Quality evaluation of mango pulp during storage," J. Food Sci., vol. 62, no. 2, pp. 112-118, 2025.'
  },
  {
    id: 'custom_pattern',
    label: 'Custom Sample Pattern (Match Any Journal Template)',
    region: 'International Journals & Styles',
    examplePreview: '{AUTHORS} ({YEAR}). {TITLE}. {JOURNAL}, {VOLUME}({ISSUE}): {PAGES}.'
  }
];

function parseRawReferenceLine(rawLine: string): ParsedReference {
  const clean = rawLine
    .trim()
    .replace(/^\[\d+\]\s*/, '')
    .replace(/^\d+\.\s*/, '');

  // Extract Year (e.g. 1990 - 2029)
  const yearMatch = clean.match(/\b(19\d{2}|20\d{2}[a-z]?)\b/);
  const year = yearMatch ? yearMatch[1] : '2025';

  // Extract DOI if present
  const doiMatch = clean.match(/(?:https?:\/\/doi\.org\/|doi:\s*)(10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+)/i);
  const doi = doiMatch ? doiMatch[1] : '';

  // Extract Pages (e.g. 112-118 or pp. 45-52 or e12345)
  const pagesMatch = clean.match(/(?:pp?\.\s*)?(\d{1,5}\s*[–-]\s*\d{1,5})/);
  const pages = pagesMatch ? pagesMatch[1].replace(/\s+/g, '') : '101-108';

  // Extract Volume & Issue e.g. 62(2): or 62(2),
  const volIssueMatch = clean.match(/\b(\d{1,4})\s*\((\d{1,3})\)/);
  const volOnlyMatch = clean.match(/,\s*(\d{1,4})\s*[,:]\s*\d{1,5}\s*[–-]/);
  const volume = volIssueMatch ? volIssueMatch[1] : volOnlyMatch ? volOnlyMatch[1] : '15';
  const issue = volIssueMatch ? volIssueMatch[2] : '1';

  // Split around year to get Authors (before year) and Title + Journal (after year)
  let authors = 'Khan, M.A., S. Ahmad';
  let remainder = clean;
  if (yearMatch && typeof yearMatch.index === 'number') {
    const beforeYear = clean.slice(0, yearMatch.index).replace(/[().\s,]+$/, '').trim();
    if (beforeYear.length > 2) {
      authors = beforeYear;
    }
    remainder = clean
      .slice(yearMatch.index + yearMatch[0].length)
      .replace(/^[().\s,:;]+/, '')
      .trim();
  }

  // Remove DOI and volume/pages tail from remainder to isolate Title and Journal
  const tailCleaned = remainder
    .replace(/(?:https?:\/\/doi\.org\/|doi:\s*)10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+/gi, '')
    .replace(/\b\d{1,4}\s*\(\d{1,3}\)\s*[,:]?\s*(?:pp?\.\s*)?\d{1,5}\s*[–-]\s*\d{1,5}.*$/, '')
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

export const CitationReferenceGeneratorTool: React.FC = () => {
  const [selectedStyle, setSelectedStyle] = useState<CitationStyleId>('pjas');
  const [customPattern, setCustomPattern] = useState<string>(
    '{AUTHORS} ({YEAR}). {TITLE}. {JOURNAL}, {VOLUME}({ISSUE}): {PAGES}.'
  );
  const [sortAlphabetically, setSortAlphabetically] = useState<boolean>(true);
  const [copiedRefs, setCopiedRefs] = useState<boolean>(false);

  // Bulk Paste Box State (Pre-loaded with 3 realistic food science references so the user can test immediately)
  const [bulkRawText, setBulkRawText] = useState<string>(
    `Khan, M.A., S. Ahmad and T. Mahmood (2024). Effect of potassium sorbate and citric acid on shelf stability of Chaunsa mango pulp. Pakistan Journal of Agricultural Sciences, 61(2), 145-152.\ncodex, A. & FAO (2023). General principles of food hygiene CXC 1-1969. Food Control, 148(1), 210-218.\nHussain, S., M. I. Anjum and A. Rehman. 2025. Physicochemical and microbiological quality of raw buffalo milk in Punjab. Journal of Animal and Plant Sciences. 35(1): 55-62.`
  );

  // Manual Single Reference Builder State
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
    }.${manDoi.trim() ? ` https://doi.org/${manDoi.trim().replace(/^https?:\/\/doi\.org\//i, '')}` : ''}`;

    setBulkRawText((prev) => (prev.trim() ? `${prev.trim()}\n${newLine}` : newLine));
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
    if (sortAlphabetically && selectedStyle !== 'ieee_vancouver') {
      parsedList.sort((a, b) => a.authors.localeCompare(b.authors));
    }

    return parsedList.map((ref, idx) =>
      formatReferenceEntry(ref, selectedStyle, idx, customPattern)
    );
  }, [bulkRawText, selectedStyle, sortAlphabetically, customPattern]);

  const activeStyleMeta = CITATION_STYLES.find((s) => s.id === selectedStyle);

  const handleCopyAllBibliography = () => {
    const text = formattedResults.map((r) => r.bibliography).join('\n\n');
    navigator.clipboard?.writeText(text);
    setCopiedRefs(true);
    setTimeout(() => setCopiedRefs(false), 2500);
  };

  return (
    <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 sm:p-6 shadow-xs space-y-5">
      <div className="border-b border-[#D2DEEA] pb-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#1A2138] text-white flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
              Citation &amp; Reference Generator (Pakistan HEC &amp; International Journals)
            </h2>
            <p className="text-xs text-[#4A5568] font-medium">
              Select Any Pakistani or International Journal Format — Paste All References in One Box or Add Manually
            </p>
          </div>
        </div>
      </div>

      {/* STEP 1: JOURNAL / CITATION FORMAT SELECTOR */}
      <div className="p-4 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-extrabold text-[#1A2138] mb-1">
              1. Select Target Pakistani HEC or International Journal Style *
            </label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value as CitationStyleId)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#1673B8] text-xs font-extrabold text-[#1A2138]"
            >
              <optgroup label="🇵🇰 Pakistan HEC Recognized Journals">
                {CITATION_STYLES.filter((s) => s.region === 'Pakistan HEC Journals').map(
                  (s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  )
                )}
              </optgroup>
              <optgroup label="🌍 International Food Science & Academic Styles">
                {CITATION_STYLES.filter(
                  (s) => s.region === 'International Journals & Styles'
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
            {activeStyleMeta?.examplePreview}
          </div>
        )}
      </div>

      {/* STEP 2: BULK PASTE BOX + CONVERTED OUTPUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: 1-Box Bulk Reference Input */}
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

        {/* Right: Formatted Bibliography Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#1673B8]">
              3. Formatted References ({formattedResults.length}) — Ready for Thesis / Paper:
            </span>
            <button
              type="button"
              onClick={handleCopyAllBibliography}
              className="px-3 py-1 rounded-lg bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
            >
              {copiedRefs ? (
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
                    In-Text Citation: <span className="font-mono">{item.inText}</span>
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
  );
};

import React, { useMemo, useState } from 'react';
import { jsPDF } from 'jspdf';
import {
  Check,
  CheckCircle2,
  Copy,
  Crown,
  Download,
  FileSpreadsheet,
  FileText,
  Flame,
  Lock,
  Scale,
  Search,
  ShieldCheck,
  Thermometer,
  Droplets
} from 'lucide-react';
import {
  FOOD_AUTHORITY_LIMITS,
  FoodAuthorityBody,
  FoodCommodityCategory,
  NUTRITION_LABEL_PRESETS,
  QA_QC_TEMPLATES_VAULT,
  QaQcTemplateDocument
} from '../data/foodSafetyReferenceData';
import { HubUser } from '../types/hub';

interface PaidFeatureProps {
  user: HubUser;
  isUserPaid: boolean;
  hasExpiredPremium: boolean;
  onOpenPremiumModal: () => void;
}

type LabelStandard = 'FDA' | 'GCC_SFDA' | 'PSQCA';

// ============================================================================
// TOOL A: NUTRITION FACTS LABEL GENERATOR (FDA / GCC-SFDA / PSQCA)
// ============================================================================
export const NutritionLabelGeneratorTool: React.FC<PaidFeatureProps> = ({
  isUserPaid,
  hasExpiredPremium,
  user,
  onOpenPremiumModal
}) => {
  const canExport = Boolean((isUserPaid && !hasExpiredPremium) || user.isAdmin);
  const [standard, setStandard] = useState<LabelStandard>('FDA');
  const [productName, setProductName] = useState('Mango Fruit Nectar (Ready to Drink)');
  const [servingSizeLabel, setServingSizeLabel] = useState('1 Carton (250 mL)');
  const [servingWeightG, setServingWeightG] = useState(250);
  const [servingsPerContainer, setServingsPerContainer] = useState('1');
  const [calories, setCalories] = useState(120);
  const [totalFatG, setTotalFatG] = useState(0);
  const [saturatedFatG, setSaturatedFatG] = useState(0);
  const [transFatG, setTransFatG] = useState(0);
  const [cholesterolMg, setCholesterolMg] = useState(0);
  const [sodiumMg, setSodiumMg] = useState(25);
  const [totalCarbG, setTotalCarbG] = useState(29);
  const [dietaryFiberG, setDietaryFiberG] = useState(1);
  const [totalSugarsG, setTotalSugarsG] = useState(26);
  const [addedSugarsG, setAddedSugarsG] = useState(18);
  const [proteinG, setProteinG] = useState(0.5);
  const [vitaminDMcg, setVitaminDMcg] = useState(0);
  const [calciumMg, setCalciumMg] = useState(15);
  const [ironMg, setIronMg] = useState(0.4);
  const [potassiumMg, setPotassiumMg] = useState(140);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const loadPreset = (presetId: string) => {
    const p = NUTRITION_LABEL_PRESETS.find((item) => item.id === presetId);
    if (!p) return;
    setProductName(p.label);
    setServingSizeLabel(p.servingSizeLabel);
    setServingWeightG(p.servingWeightG);
    setServingsPerContainer(p.servingsPerContainer);
    setCalories(p.calories);
    setTotalFatG(p.totalFatG);
    setSaturatedFatG(p.saturatedFatG);
    setTransFatG(p.transFatG);
    setCholesterolMg(p.cholesterolMg);
    setSodiumMg(p.sodiumMg);
    setTotalCarbG(p.totalCarbG);
    setDietaryFiberG(p.dietaryFiberG);
    setTotalSugarsG(p.totalSugarsG);
    setAddedSugarsG(p.addedSugarsG);
    setProteinG(p.proteinG);
    setVitaminDMcg(p.vitaminDMcg);
    setCalciumMg(p.calciumMg);
    setIronMg(p.ironMg);
    setPotassiumMg(p.potassiumMg);
  };

  // FDA 2020 Reference Daily Values (2,000 kcal diet)
  const dv = useMemo(() => {
    const pct = (val: number, ref: number) =>
      ref > 0 ? Math.round((val / ref) * 100) : 0;
    return {
      totalFat: pct(totalFatG, 78),
      satFat: pct(saturatedFatG, 20),
      cholesterol: pct(cholesterolMg, 300),
      sodium: pct(sodiumMg, 2300),
      totalCarb: pct(totalCarbG, 275),
      fiber: pct(dietaryFiberG, 28),
      addedSugars: pct(addedSugarsG, 50),
      protein: pct(proteinG, 50),
      vitD: pct(vitaminDMcg, 20),
      calcium: pct(calciumMg, 1300),
      iron: pct(ironMg, 18),
      potassium: pct(potassiumMg, 4700)
    };
  }, [
    totalFatG,
    saturatedFatG,
    cholesterolMg,
    sodiumMg,
    totalCarbG,
    dietaryFiberG,
    addedSugarsG,
    proteinG,
    vitaminDMcg,
    calciumMg,
    ironMg,
    potassiumMg
  ]);

  // Per 100g / 100mL conversion for GCC/SFDA & PSQCA mandatory declaration
  const per100 = useMemo(() => {
    const factor = servingWeightG > 0 ? 100 / servingWeightG : 1;
    const round1 = (v: number) => Math.round(v * factor * 10) / 10;
    return {
      kcal: Math.round(calories * factor),
      kj: Math.round(calories * 4.184 * factor),
      fat: round1(totalFatG),
      satFat: round1(saturatedFatG),
      transFat: round1(transFatG),
      carb: round1(totalCarbG),
      sugars: round1(totalSugarsG),
      fiber: round1(dietaryFiberG),
      protein: round1(proteinG),
      saltG: Math.round(((sodiumMg * 2.5) / 1000) * factor * 100) / 100,
      sodiumMg: Math.round(sodiumMg * factor)
    };
  }, [
    servingWeightG,
    calories,
    totalFatG,
    saturatedFatG,
    transFatG,
    totalCarbG,
    totalSugarsG,
    dietaryFiberG,
    proteinG,
    sodiumMg
  ]);

  // GCC / GSO 2233 Traffic-Light Classification per 100g
  const trafficLight = useMemo(() => {
    const classify = (val: number, lowMax: number, highMin: number) => {
      if (val <= lowMax) return { level: 'Low', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      if (val > highMin) return { level: 'High', color: 'bg-rose-100 text-rose-900 border-rose-300' };
      return { level: 'Medium', color: 'bg-amber-100 text-amber-900 border-amber-300' };
    };
    return {
      fat: classify(per100.fat, 3.0, 17.5),
      satFat: classify(per100.satFat, 1.5, 5.0),
      sugars: classify(per100.sugars, 5.0, 22.5),
      salt: classify(per100.saltG, 0.3, 1.5)
    };
  }, [per100]);

  const handleDownloadLabelPdf = () => {
    if (!canExport) {
      onOpenPremiumModal();
      return;
    }
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    pdf.setFillColor(22, 115, 184);
    pdf.rect(0, 0, 210, 26, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('FOOD SCIENCE PORTAL — PACKAGING NUTRITION SPECIFICATION', 14, 12);
    pdf.setFontSize(9.5);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `Regulatory Format: ${standard === 'FDA' ? 'US FDA 21 CFR 101.9' : standard === 'GCC_SFDA' ? 'GCC / SFDA GSO 2233 + Traffic Light' : 'PSQCA / PFA Mandatory Labeling'} · Product: ${productName}`,
      14,
      19.5
    );

    // Draw Classic Nutrition Facts Panel Box on Left
    pdf.setTextColor(15, 23, 42);
    pdf.setDrawColor(15, 23, 42);
    pdf.setLineWidth(0.7);
    pdf.rect(14, 34, 88, 148);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(17);
    pdf.text('Nutrition Facts', 18, 43);
    pdf.setLineWidth(0.3);
    pdf.line(18, 46, 98, 46);

    pdf.setFontSize(9.5);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`${servingsPerContainer} servings per container`, 18, 52);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Serving size: ${servingSizeLabel}`, 18, 57);
    pdf.setLineWidth(1.8);
    pdf.line(18, 60, 98, 60);

    pdf.setFontSize(8.5);
    pdf.text('Amount per serving', 18, 65);
    pdf.setFontSize(15);
    pdf.text(`Calories`, 18, 73);
    pdf.text(`${calories}`, 96, 73, { align: 'right' });
    pdf.setLineWidth(1.2);
    pdf.line(18, 76, 98, 76);

    pdf.setFontSize(8.5);
    pdf.text('% Daily Value*', 96, 81, { align: 'right' });

    const rows: Array<[string, string, boolean]> = [
      [`Total Fat ${totalFatG}g`, `${dv.totalFat}%`, true],
      [`  Saturated Fat ${saturatedFatG}g`, `${dv.satFat}%`, false],
      [`  Trans Fat ${transFatG}g`, '', false],
      [`Cholesterol ${cholesterolMg}mg`, `${dv.cholesterol}%`, true],
      [`Sodium ${sodiumMg}mg`, `${dv.sodium}%`, true],
      [`Total Carbohydrate ${totalCarbG}g`, `${dv.totalCarb}%`, true],
      [`  Dietary Fiber ${dietaryFiberG}g`, `${dv.fiber}%`, false],
      [`  Total Sugars ${totalSugarsG}g`, '', false],
      [`    Includes ${addedSugarsG}g Added Sugars`, `${dv.addedSugars}%`, false],
      [`Protein ${proteinG}g`, `${dv.protein}%`, true]
    ];

    let y = 86;
    pdf.setLineWidth(0.2);
    rows.forEach(([label, pctStr, bold]) => {
      pdf.line(18, y - 3.6, 98, y - 3.6);
      pdf.setFont('helvetica', bold ? 'bold' : 'normal');
      pdf.setFontSize(8.5);
      pdf.text(label, 18, y);
      if (pctStr) {
        pdf.setFont('helvetica', 'bold');
        pdf.text(pctStr, 96, y, { align: 'right' });
      }
      y += 6.2;
    });

    pdf.setLineWidth(1.2);
    pdf.line(18, y - 2, 98, y - 2);
    y += 3.5;

    const microRows: Array<[string, string]> = [
      [`Vitamin D ${vitaminDMcg}mcg`, `${dv.vitD}%`],
      [`Calcium ${calciumMg}mg`, `${dv.calcium}%`],
      [`Iron ${ironMg}mg`, `${dv.iron}%`],
      [`Potassium ${potassiumMg}mg`, `${dv.potassium}%`]
    ];
    microRows.forEach(([label, pctStr]) => {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.text(label, 18, y);
      pdf.text(pctStr, 96, y, { align: 'right' });
      y += 5.5;
    });

    // Right Column: Per 100g/mL GCC & PSQCA Table
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(22, 115, 184);
    pdf.text('Per 100 g / 100 mL Declaration (GCC / PSQCA)', 110, 40);
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    const col2Lines = [
      `Energy: ${per100.kcal} kcal (${per100.kj} kJ)`,
      `Total Fat: ${per100.fat} g  [${trafficLight.fat.level}]`,
      `Saturated Fat: ${per100.satFat} g  [${trafficLight.satFat.level}]`,
      `Trans Fat: ${per100.transFat} g (Target <= 2g/100g fat)`,
      `Total Carbohydrate: ${per100.carb} g`,
      `Total Sugars: ${per100.sugars} g  [${trafficLight.sugars.level}]`,
      `Dietary Fiber: ${per100.fiber} g`,
      `Protein: ${per100.protein} g`,
      `Sodium: ${per100.sodiumMg} mg (Salt eq: ${per100.saltG} g [${trafficLight.salt.level}])`
    ];
    let ry = 49;
    col2Lines.forEach((line) => {
      pdf.text(`• ${line}`, 110, ry);
      ry += 7;
    });

    pdf.setFontSize(8.5);
    pdf.setTextColor(80, 95, 115);
    pdf.text(
      `Generated via Food Science Portal · QA/Regulatory Artwork Check · ${new Date().toISOString().slice(0, 10)}`,
      14,
      200
    );

    pdf.save(`Nutrition-Label-${productName.replace(/[^a-zA-Z0-9]+/g, '-').slice(0, 32)}.pdf`);
    setStatusMsg('Official Nutrition Facts Label Specification PDF downloaded.');
    setTimeout(() => setStatusMsg(null), 3500);
  };

  return (
    <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#D2DEEA] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#1673B8]">
            <Scale className="w-4 h-4" />
            <span>Regulatory Packaging &amp; Labeling Tool</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[#1A2138]">
            Nutrition Facts Label Generator (FDA / GCC-SFDA / PSQCA)
          </h2>
          <p className="text-xs text-[#5A6C84] max-w-2xl">
            Generate accurate packaging Nutrition Facts tables with % Daily Value, automatic Per-100 g/mL energy &amp; nutrient conversion, and GCC Traffic-Light front-of-pack checks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['FDA', 'GCC_SFDA', 'PSQCA'] as LabelStandard[]).map((std) => (
            <button
              key={std}
              type="button"
              onClick={() => setStandard(std)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-colors ${
                standard === std
                  ? 'bg-[#1673B8] text-white'
                  : 'bg-[#F0F6FC] text-[#1A2138] border border-[#D2DEEA] hover:bg-[#E1EEF9]'
              }`}
            >
              {std === 'FDA' ? 'US FDA (2020)' : std === 'GCC_SFDA' ? 'GCC / SFDA GSO' : 'PSQCA / PFA'}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-extrabold text-[#1A2138]">Load Sample Product:</span>
        {NUTRITION_LABEL_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => loadPreset(p.id)}
            className="px-2.5 py-1.5 rounded-xl bg-[#F0F6FC] hover:bg-[#DCE9F6] border border-[#D2DEEA] text-[#105E9A] text-[11px] font-bold cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-7 bg-[#F8FAFC] border border-[#D2DEEA] rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                Product Name (for Spec Sheet)
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-bold text-[#1A2138]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                Serving Size Label
              </label>
              <input
                type="text"
                value={servingSizeLabel}
                onChange={(e) => setServingSizeLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Serving Wt (g/mL)
                </label>
                <input
                  type="number"
                  min={1}
                  value={servingWeightG}
                  onChange={(e) => setServingWeightG(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-bold font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Servings / Pack
                </label>
                <input
                  type="text"
                  value={servingsPerContainer}
                  onChange={(e) => setServingsPerContainer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-bold font-mono tabular-nums"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#D2DEEA]">
            {[
              { label: 'Calories (kcal)', val: calories, set: setCalories, step: 1 },
              { label: 'Total Fat (g)', val: totalFatG, set: setTotalFatG, step: 0.1 },
              { label: 'Sat. Fat (g)', val: saturatedFatG, set: setSaturatedFatG, step: 0.1 },
              { label: 'Trans Fat (g)', val: transFatG, set: setTransFatG, step: 0.1 },
              { label: 'Cholesterol (mg)', val: cholesterolMg, set: setCholesterolMg, step: 1 },
              { label: 'Sodium (mg)', val: sodiumMg, set: setSodiumMg, step: 1 },
              { label: 'Total Carb (g)', val: totalCarbG, set: setTotalCarbG, step: 0.1 },
              { label: 'Dietary Fiber (g)', val: dietaryFiberG, set: setDietaryFiberG, step: 0.1 },
              { label: 'Total Sugars (g)', val: totalSugarsG, set: setTotalSugarsG, step: 0.1 },
              { label: 'Added Sugars (g)', val: addedSugarsG, set: setAddedSugarsG, step: 0.1 },
              { label: 'Protein (g)', val: proteinG, set: setProteinG, step: 0.1 },
              { label: 'Vitamin D (mcg)', val: vitaminDMcg, set: setVitaminDMcg, step: 0.1 },
              { label: 'Calcium (mg)', val: calciumMg, set: setCalciumMg, step: 1 },
              { label: 'Iron (mg)', val: ironMg, set: setIronMg, step: 0.1 },
              { label: 'Potassium (mg)', val: potassiumMg, set: setPotassiumMg, step: 1 }
            ].map((field) => (
              <div key={field.label}>
                <label className="block text-[10.5px] font-extrabold text-[#5A6C84] mb-1">
                  {field.label}
                </label>
                <input
                  type="number"
                  min={0}
                  step={field.step}
                  value={field.val}
                  onChange={(e) => field.set(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-2.5 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-bold font-mono tabular-nums text-[#1A2138]"
                />
              </div>
            ))}
          </div>

          {/* GCC Front-of-Pack Traffic Light Analysis */}
          <div className="rounded-xl bg-white border border-[#D2DEEA] p-3.5 space-y-2">
            <div className="text-[11px] font-extrabold text-[#1A2138]">
              GCC / SFDA Front-of-Pack Nutrient Thresholds (Per 100 g / mL)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className={`p-2 rounded-xl border text-center ${trafficLight.fat.color}`}>
                <div className="text-[10px] font-bold">Total Fat</div>
                <div className="font-black font-mono tabular-nums">{per100.fat} g</div>
                <div className="text-[10px] font-extrabold">{trafficLight.fat.level}</div>
              </div>
              <div className={`p-2 rounded-xl border text-center ${trafficLight.satFat.color}`}>
                <div className="text-[10px] font-bold">Sat. Fat</div>
                <div className="font-black font-mono tabular-nums">{per100.satFat} g</div>
                <div className="text-[10px] font-extrabold">{trafficLight.satFat.level}</div>
              </div>
              <div className={`p-2 rounded-xl border text-center ${trafficLight.sugars.color}`}>
                <div className="text-[10px] font-bold">Sugars</div>
                <div className="font-black font-mono tabular-nums">{per100.sugars} g</div>
                <div className="text-[10px] font-extrabold">{trafficLight.sugars.level}</div>
              </div>
              <div className={`p-2 rounded-xl border text-center ${trafficLight.salt.color}`}>
                <div className="text-[10px] font-bold">Salt Equiv.</div>
                <div className="font-black font-mono tabular-nums">{per100.saltG} g</div>
                <div className="text-[10px] font-extrabold">{trafficLight.salt.level}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Packaging Label Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border-[2.5px] border-[#0C182D] p-4 font-sans text-[#0C182D] shadow-sm max-w-[360px] mx-auto">
            <div className="text-[26px] font-black leading-none tracking-tight border-b border-[#0C182D] pb-1">
              {standard === 'GCC_SFDA'
                ? 'Nutrition Information / الحقائق التغذوية'
                : 'Nutrition Facts'}
            </div>
            <div className="text-xs font-medium pt-1">
              {servingsPerContainer} servings per container
            </div>
            <div className="flex items-baseline justify-between text-sm font-black border-b-[8px] border-[#0C182D] pb-1.5">
              <span>Serving size</span>
              <span className="tabular-nums">{servingSizeLabel}</span>
            </div>

            <div className="flex items-end justify-between border-b-[5px] border-[#0C182D] py-1.5">
              <div>
                <div className="text-[11px] font-extrabold">Amount per serving</div>
                <div className="text-xl font-black leading-none">Calories</div>
              </div>
              <div className="text-3xl font-black tabular-nums leading-none">{calories}</div>
            </div>

            <div className="flex justify-between text-[11px] font-black border-b border-[#0C182D] py-1">
              <span>{standard === 'FDA' ? '' : `Per 100g: ${per100.kcal} kcal (${per100.kj} kJ)`}</span>
              <span>% Daily Value*</span>
            </div>

            <div className="divide-y divide-[#0C182D]/60 text-xs">
              <div className="flex justify-between py-1">
                <span>
                  <strong className="font-black">Total Fat</strong>{' '}
                  <span className="tabular-nums">{totalFatG}g</span>
                </span>
                <span className="font-black tabular-nums">{dv.totalFat}%</span>
              </div>
              <div className="flex justify-between py-1 pl-4">
                <span>
                  Saturated Fat <span className="tabular-nums">{saturatedFatG}g</span>
                </span>
                <span className="font-black tabular-nums">{dv.satFat}%</span>
              </div>
              <div className="flex justify-between py-1 pl-4">
                <span>
                  <em>Trans</em> Fat <span className="tabular-nums">{transFatG}g</span>
                </span>
                <span className="text-[10px] text-slate-600">
                  {per100.fat > 0 && (per100.transFat / per100.fat) * 100 <= 2
                    ? 'iTFA Compliant'
                    : ''}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>
                  <strong className="font-black">Cholesterol</strong>{' '}
                  <span className="tabular-nums">{cholesterolMg}mg</span>
                </span>
                <span className="font-black tabular-nums">{dv.cholesterol}%</span>
              </div>
              <div className="flex justify-between py-1">
                <span>
                  <strong className="font-black">Sodium</strong>{' '}
                  <span className="tabular-nums">{sodiumMg}mg</span>
                </span>
                <span className="font-black tabular-nums">{dv.sodium}%</span>
              </div>
              <div className="flex justify-between py-1">
                <span>
                  <strong className="font-black">Total Carbohydrate</strong>{' '}
                  <span className="tabular-nums">{totalCarbG}g</span>
                </span>
                <span className="font-black tabular-nums">{dv.totalCarb}%</span>
              </div>
              <div className="flex justify-between py-1 pl-4">
                <span>
                  Dietary Fiber <span className="tabular-nums">{dietaryFiberG}g</span>
                </span>
                <span className="font-black tabular-nums">{dv.fiber}%</span>
              </div>
              <div className="flex justify-between py-1 pl-4">
                <span>
                  Total Sugars <span className="tabular-nums">{totalSugarsG}g</span>
                </span>
                <span />
              </div>
              <div className="flex justify-between py-1 pl-8">
                <span>
                  Includes <span className="tabular-nums">{addedSugarsG}g</span> Added Sugars
                </span>
                <span className="font-black tabular-nums">{dv.addedSugars}%</span>
              </div>
              <div className="flex justify-between py-1 border-b-[8px] border-[#0C182D]">
                <span>
                  <strong className="font-black">Protein</strong>{' '}
                  <span className="tabular-nums">{proteinG}g</span>
                </span>
                <span className="font-black tabular-nums">{dv.protein}%</span>
              </div>
            </div>

            <div className="divide-y divide-[#0C182D]/60 text-xs">
              <div className="flex justify-between py-1">
                <span>Vitamin D {vitaminDMcg}mcg</span>
                <span className="font-bold tabular-nums">{dv.vitD}%</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Calcium {calciumMg}mg</span>
                <span className="font-bold tabular-nums">{dv.calcium}%</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Iron {ironMg}mg</span>
                <span className="font-bold tabular-nums">{dv.iron}%</span>
              </div>
              <div className="flex justify-between py-1 border-b-[4px] border-[#0C182D]">
                <span>Potassium {potassiumMg}mg</span>
                <span className="font-bold tabular-nums">{dv.potassium}%</span>
              </div>
            </div>

            <p className="text-[9.5px] leading-snug text-slate-700 pt-1.5">
              * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
            </p>
          </div>

          <div className="max-w-[360px] mx-auto space-y-2">
            <button
              type="button"
              onClick={handleDownloadLabelPdf}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              {canExport ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>
                {canExport
                  ? 'Download Artwork Spec Sheet (PDF)'
                  : 'Unlock PDF Artwork Spec Sheet (Paid)'}
              </span>
            </button>
            {statusMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold text-center">
                {statusMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TOOL B: THERMAL PROCESSING (F0 / PASTEURIZATION) & WATER ACTIVITY CALCULATOR
// ============================================================================
export const ThermalAndWaterActivityTool: React.FC<PaidFeatureProps> = ({
  isUserPaid,
  hasExpiredPremium,
  user,
  onOpenPremiumModal
}) => {
  const canExport = Boolean((isUserPaid && !hasExpiredPremium) || user.isAdmin);
  const [subMode, setSubMode] = useState<'thermal' | 'aw'>('thermal');

  // Thermal F0 & Pasteurization State
  const [processType, setProcessType] = useState<'sterilization' | 'pasteurization'>('sterilization');
  const [tempC, setTempC] = useState(121.1);
  const [holdingMins, setHoldingMins] = useState(12);
  const [zValue, setZValue] = useState(10);
  const [dRefValue, setDRefValue] = useState(0.21); // C. botulinum D121.1 = 0.21 min

  // Water Activity State
  const [measuredAw, setMeasuredAw] = useState(0.84);
  const [productMoisturePct, setProductMoisturePct] = useState(18);
  const [equilibriumRhPct, setEquilibriumRhPct] = useState(84);
  const [soluteSugarPct, setSoluteSugarPct] = useState(32);
  const [soluteSaltPct, setSoluteSaltPct] = useState(2.5);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const thermalMetrics = useMemo(() => {
    const tRef = processType === 'sterilization' ? 121.1 : 60.0;
    const effectiveZ = Math.max(1, zValue);
    const lethalRate = Math.pow(10, (tempC - tRef) / effectiveZ);
    const fOrPu = lethalRate * Math.max(0, holdingMins);
    const logReduction = dRefValue > 0 ? fOrPu / dRefValue : 0;
    const is12DCompliant = processType === 'sterilization' ? logReduction >= 12 : logReduction >= 6;
    return {
      tRef,
      lethalRate,
      fOrPu,
      logReduction,
      is12DCompliant
    };
  }, [processType, tempC, holdingMins, zValue, dRefValue]);

  const awMetrics = useMemo(() => {
    const aw = Math.min(1, Math.max(0.05, measuredAw));
    const canGrowBacteria = aw >= 0.90;
    const canGrowStaphAerobic = aw >= 0.85;
    const canGrowYeasts = aw >= 0.80;
    const canGrowMolds = aw >= 0.70;
    const canGrowXerophilicMolds = aw >= 0.61;

    // Ross / Raoult approximate binary water activity estimate from % salt + % sucrose in aqueous phase
    const waterMass = Math.max(5, 100 - soluteSugarPct - soluteSaltPct);
    const molesWater = waterMass / 18.015;
    const molesSucrose = soluteSugarPct / 342.3;
    const molesNaClDissociated = (soluteSaltPct / 58.44) * 1.85;
    const estimatedMixAw = Math.min(
      0.999,
      Math.max(0.4, molesWater / (molesWater + molesSucrose + molesNaClDissociated))
    );

    let shelfCategory = 'Microbiologically Stable (Dry / Intermediate Moisture)';
    let badgeTone = 'bg-emerald-100 text-emerald-900 border-emerald-300';
    if (aw >= 0.91) {
      shelfCategory = 'High-Risk Perishable (Pathogens & Bacteria Active — Cold Chain / Retort Required)';
      badgeTone = 'bg-rose-100 text-rose-900 border-rose-300';
    } else if (aw >= 0.85) {
      shelfCategory = 'Critical Boundary (Staphylococcus aureus & Yeast Risk — Hurdle Control Needed)';
      badgeTone = 'bg-amber-100 text-amber-900 border-amber-300';
    } else if (aw >= 0.61) {
      shelfCategory = 'Intermediate Moisture Food (Mold & Yeast Spoilage Control via Sorbate/Barrier)';
      badgeTone = 'bg-sky-100 text-sky-900 border-sky-300';
    }

    return {
      aw,
      canGrowBacteria,
      canGrowStaphAerobic,
      canGrowYeasts,
      canGrowMolds,
      canGrowXerophilicMolds,
      estimatedMixAw,
      shelfCategory,
      badgeTone
    };
  }, [measuredAw, soluteSugarPct, soluteSaltPct]);

  const handleDownloadThermalAwPdf = () => {
    if (!canExport) {
      onOpenPremiumModal();
      return;
    }
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    pdf.setFillColor(26, 33, 56);
    pdf.rect(0, 0, 210, 26, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('THERMAL LETHALITY (F0/PU) & WATER ACTIVITY LAB REPORT', 14, 12);
    pdf.setFontSize(9.5);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Prepared by: ${user.name || 'Food Specialist'} · Date: ${new Date().toISOString().slice(0, 10)}`, 14, 19.5);

    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11.5);
    pdf.text('1. Thermal Processing Lethality Summary', 14, 38);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    const thermalLines = [
      `Process Mode: ${processType === 'sterilization' ? 'Commercial Sterilization (T_ref = 121.1°C)' : 'Pasteurization Units (T_ref = 60.0°C)'}`,
      `Core Process Temperature: ${tempC.toFixed(1)} °C · Holding Time: ${holdingMins.toFixed(2)} min`,
      `Thermal Resistance Parameters: z-value = ${zValue.toFixed(1)} °C · D_ref = ${dRefValue.toFixed(3)} min`,
      `Instantaneous Lethal Rate (L): ${thermalMetrics.lethalRate.toFixed(4)}`,
      `Cumulative Process Value (${processType === 'sterilization' ? 'F0' : 'PU'}): ${thermalMetrics.fOrPu.toFixed(2)} min`,
      `Log Reduction Achieved: ${thermalMetrics.logReduction.toFixed(2)} log10 (${thermalMetrics.is12DCompliant ? 'MEETS TARGET' : 'BELOW TARGET'})`
    ];
    let y = 46;
    thermalLines.forEach((l) => {
      pdf.text(`• ${l}`, 16, y);
      y += 7;
    });

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11.5);
    pdf.text('2. Water Activity (aw) & Microbial Stability Analysis', 14, y + 6);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    y += 14;
    const awLines = [
      `Measured Water Activity (aw): ${awMetrics.aw.toFixed(3)} (ERH = ${equilibriumRhPct}%, Moisture = ${productMoisturePct}%)`,
      `Stability Assessment: ${awMetrics.shelfCategory}`,
      `Pathogenic Bacteria Growth (>=0.90): ${awMetrics.canGrowBacteria ? 'POSSIBLE' : 'INHIBITED'}`,
      `S. aureus Growth (>=0.85): ${awMetrics.canGrowStaphAerobic ? 'POSSIBLE' : 'INHIBITED'}`,
      `Mold & Yeast Growth (>=0.70 / 0.80): ${awMetrics.canGrowMolds ? 'POSSIBLE' : 'INHIBITED'}`,
      `Formulation Model Estimate (Sucrose ${soluteSugarPct}% + NaCl ${soluteSaltPct}%): aw ≈ ${awMetrics.estimatedMixAw.toFixed(3)}`
    ];
    awLines.forEach((l) => {
      pdf.text(`• ${l}`, 16, y);
      y += 7;
    });

    pdf.save(`Thermal-F0-and-aw-Lab-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
    setStatusMsg('Thermal F0 & Water Activity Validation PDF downloaded.');
    setTimeout(() => setStatusMsg(null), 3500);
  };

  return (
    <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#D2DEEA] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#1673B8]">
            <Thermometer className="w-4 h-4" />
            <span>Process Validation &amp; Hurdle Technology</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[#1A2138]">
            Thermal Processing (F₀ / Pasteurization) &amp; Water Activity (a_w) Calculator
          </h2>
          <p className="text-xs text-[#5A6C84]">
            Validate retort F₀ lethality, 12D Clostridium botulinum commercial sterility, beverage Pasteurization Units (PU), and Water Activity (a_w) microbial growth hurdles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubMode('thermal')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer ${
              subMode === 'thermal'
                ? 'bg-[#1673B8] text-white'
                : 'bg-[#F0F6FC] text-[#1A2138] border border-[#D2DEEA]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Thermal (F₀ / PU)</span>
          </button>
          <button
            type="button"
            onClick={() => setSubMode('aw')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer ${
              subMode === 'aw'
                ? 'bg-[#1673B8] text-white'
                : 'bg-[#F0F6FC] text-[#1A2138] border border-[#D2DEEA]'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Water Activity (a_w)</span>
          </button>
        </div>
      </div>

      {subMode === 'thermal' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 bg-[#F8FAFC] border border-[#D2DEEA] rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setProcessType('sterilization');
                  setTempC(121.1);
                  setHoldingMins(12);
                  setZValue(10);
                  setDRefValue(0.21);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer ${
                  processType === 'sterilization'
                    ? 'bg-[#1A2138] text-white'
                    : 'bg-white border border-[#D2DEEA] text-[#1A2138]'
                }`}
              >
                Retort Sterilization (F₀ · 121.1°C)
              </button>
              <button
                type="button"
                onClick={() => {
                  setProcessType('pasteurization');
                  setTempC(72.0);
                  setHoldingMins(0.5);
                  setZValue(7.0);
                  setDRefValue(0.15);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer ${
                  processType === 'pasteurization'
                    ? 'bg-[#1A2138] text-white'
                    : 'bg-white border border-[#D2DEEA] text-[#1A2138]'
                }`}
              >
                Pasteurization Units (PU · 60°C)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Product Core Temperature (°C)
                </label>
                <input
                  type="number"
                  step={0.1}
                  value={tempC}
                  onChange={(e) => setTempC(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-bold font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Effective Holding Time (minutes)
                </label>
                <input
                  type="number"
                  step={0.1}
                  min={0}
                  value={holdingMins}
                  onChange={(e) => setHoldingMins(Math.max(0, Number(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-bold font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  z-Value (°C)
                </label>
                <input
                  type="number"
                  step={0.5}
                  min={1}
                  value={zValue}
                  onChange={(e) => setZValue(Math.max(1, Number(e.target.value) || 10))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-bold font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Target Organism D_ref (min)
                </label>
                <input
                  type="number"
                  step={0.01}
                  min={0.01}
                  value={dRefValue}
                  onChange={(e) => setDRefValue(Math.max(0.01, Number(e.target.value) || 0.21))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-bold font-mono tabular-nums"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#D2DEEA] text-[11px] text-[#5A6C84] space-y-1">
              <div className="font-extrabold text-[#1A2138]">Scientific Formula Applied</div>
              <div className="font-mono text-[#105E9A]">
                L = 10^((T − T_ref) / z) · {processType === 'sterilization' ? 'F₀' : 'PU'} = L × t · Log Reduction = F / D_ref
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] p-4">
                <div className="text-[11px] font-bold text-[#5A6C84]">Lethal Rate (L)</div>
                <div className="text-xl font-black text-[#1A2138] font-mono tabular-nums mt-1">
                  {thermalMetrics.lethalRate.toFixed(3)}
                </div>
                <div className="text-[10.5px] text-[#5A6C84] mt-0.5">
                  Ref: {thermalMetrics.tRef}°C
                </div>
              </div>
              <div className="rounded-2xl bg-[#1673B8] text-white p-4">
                <div className="text-[11px] font-bold text-sky-100">
                  {processType === 'sterilization' ? 'F₀ Lethality Value' : 'Pasteurization Units'}
                </div>
                <div className="text-2xl font-black font-mono tabular-nums mt-1">
                  {thermalMetrics.fOrPu.toFixed(2)} min
                </div>
                <div className="text-[10.5px] text-sky-100 mt-0.5">
                  Equivalent min at {thermalMetrics.tRef}°C
                </div>
              </div>
              <div className="rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] p-4">
                <div className="text-[11px] font-bold text-[#5A6C84]">Log₁₀ Reduction</div>
                <div className="text-xl font-black text-[#1A2138] font-mono tabular-nums mt-1">
                  {thermalMetrics.logReduction.toFixed(1)} D
                </div>
                <div className="text-[10.5px] text-[#1673B8] font-bold mt-0.5">
                  {thermalMetrics.is12DCompliant
                    ? processType === 'sterilization'
                      ? '≥ 12D Commercial Sterility Met'
                      : '≥ 6D Pasteurization Met'
                    : 'Below Target Lethality'}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#D2DEEA] p-4 bg-[#F8FAFC] text-xs space-y-2">
              <div className="font-extrabold text-[#1A2138]">
                Industrial Thermal Benchmark Reference
              </div>
              <p className="text-[#5A6C84] leading-relaxed">
                • <strong>Low-Acid Canned Foods (pH &gt; 4.6):</strong> Minimum 12D reduction of <em>C. botulinum</em> (F₀ ≥ 3.0 min minimum safety; 6.0–12.0 min typical commercial canned meats/vegetables for thermophiles).
              </p>
              <p className="text-[#5A6C84] leading-relaxed">
                • <strong>Beer / Beverage Tunnel Pasteurization:</strong> Typical target 15–30 PU at 60°C (z = 6.94°C). Dairy HTST requires ≥ 72°C for 15 s.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-6 bg-[#F8FAFC] border border-[#D2DEEA] rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Measured Water Activity (a_w)
                </label>
                <input
                  type="number"
                  min={0.05}
                  max={1.0}
                  step={0.01}
                  value={measuredAw}
                  onChange={(e) => {
                    const v = Math.min(1, Math.max(0.05, Number(e.target.value) || 0.5));
                    setMeasuredAw(v);
                    setEquilibriumRhPct(Math.round(v * 100));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-bold font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Total Moisture Content (%)
                </label>
                <input
                  type="number"
                  min={0}
                  max={99}
                  step={0.5}
                  value={productMoisturePct}
                  onChange={(e) => setProductMoisturePct(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-bold font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Formulation Sugar / Humectant (% w/w)
                </label>
                <input
                  type="number"
                  min={0}
                  max={80}
                  step={0.5}
                  value={soluteSugarPct}
                  onChange={(e) => setSoluteSugarPct(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-bold font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Formulation Salt NaCl (% w/w)
                </label>
                <input
                  type="number"
                  min={0}
                  max={25}
                  step={0.1}
                  value={soluteSaltPct}
                  onChange={(e) => setSoluteSaltPct(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-bold font-mono tabular-nums"
                />
              </div>
            </div>

            <div className={`p-3.5 rounded-xl border text-xs font-bold ${awMetrics.badgeTone}`}>
              {awMetrics.shelfCategory}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#1673B8] text-white p-4">
                <div className="text-[11px] font-bold text-sky-100">Water Activity / ERH</div>
                <div className="text-2xl font-black font-mono tabular-nums mt-1">
                  {awMetrics.aw.toFixed(2)} ({equilibriumRhPct}% ERH)
                </div>
              </div>
              <div className="rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] p-4">
                <div className="text-[11px] font-bold text-[#5A6C84]">Solute Formula Est. a_w</div>
                <div className="text-2xl font-black text-[#1A2138] font-mono tabular-nums mt-1">
                  {awMetrics.estimatedMixAw.toFixed(3)}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#D2DEEA] bg-[#F8FAFC] p-4 space-y-2 text-xs">
              <div className="font-extrabold text-[#1A2138]">Microbial Growth Threshold Matrix</div>
              {[
                { label: 'Most Pathogenic Bacteria (Salmonella, E. coli) ≥ 0.91', active: awMetrics.canGrowBacteria },
                { label: 'Staphylococcus aureus (Aerobic) ≥ 0.85', active: awMetrics.canGrowStaphAerobic },
                { label: 'Osmophilic Yeasts ≥ 0.80', active: awMetrics.canGrowYeasts },
                { label: 'Mycotoxigenic Molds (Aspergillus) ≥ 0.75–0.70', active: awMetrics.canGrowMolds },
                { label: 'Xerophilic Molds ≥ 0.61 (Shelf-Stable Cut-off ≤ 0.60)', active: awMetrics.canGrowXerophilicMolds }
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-2 py-1 border-b border-slate-200/70 last:border-0">
                  <span className="text-[#1A2138] font-semibold">{row.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                      row.active ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {row.active ? 'Can Grow' : 'Inhibited'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#D2DEEA]">
        <p className="text-xs text-[#5A6C84]">
          Export an official QA Lab Validation Sheet for audit binders &amp; HACCP verification records.
        </p>
        <button
          type="button"
          onClick={handleDownloadThermalAwPdf}
          className="px-4 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-2 cursor-pointer"
        >
          {canExport ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          <span>{canExport ? 'Download Thermal & a_w PDF Report' : 'Unlock PDF Report (Paid)'}</span>
        </button>
      </div>
      {statusMsg && (
        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold text-center">
          {statusMsg}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// TOOL C: READY-TO-USE QA/QC & AUDIT DOCUMENT TEMPLATES VAULT (PAID EXCLUSIVE)
// ============================================================================
export const QaQcTemplatesVaultTool: React.FC<PaidFeatureProps> = ({
  isUserPaid,
  hasExpiredPremium,
  user,
  onOpenPremiumModal
}) => {
  const isUnlocked = Boolean((isUserPaid && !hasExpiredPremium) || user.isAdmin);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [facilityName, setFacilityName] = useState(user.company || 'Al-Meezan Food Processing Industries');
  const [qaLeadName, setQaLeadName] = useState(user.name || 'QA/QC Manager');
  const [selectedDoc, setSelectedDoc] = useState<QaQcTemplateDocument>(QA_QC_TEMPLATES_VAULT[0]);
  const [toast, setToast] = useState<string | null>(null);

  const filteredDocs = useMemo(() => {
    if (selectedCategory === 'All') return QA_QC_TEMPLATES_VAULT;
    return QA_QC_TEMPLATES_VAULT.filter((d) => d.category === selectedCategory);
  }, [selectedCategory]);

  const handleDownloadPdfTemplate = (docItem: QaQcTemplateDocument) => {
    if (!isUnlocked) {
      onOpenPremiumModal();
      return;
    }
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    pdf.setFillColor(26, 33, 56);
    pdf.rect(0, 0, 297, 24, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.text(`${docItem.code} — ${docItem.title.toUpperCase()}`, 12, 10.5);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `Facility: ${facilityName}  |  Prepared By: ${qaLeadName}  |  Standard: ${docItem.standardBadge}  |  ${docItem.revision}`,
      12,
      18
    );

    const colWidth = 273 / docItem.columns.length;
    let y = 33;

    // Table Header
    pdf.setFillColor(22, 115, 184);
    pdf.rect(12, y - 5, 273, 10, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    docItem.columns.forEach((col, i) => {
      const wrapped = pdf.splitTextToSize(col, colWidth - 3);
      pdf.text(wrapped[0] || col, 13.5 + i * colWidth, y + 1);
    });

    y += 9;
    pdf.setTextColor(20, 28, 45);
    pdf.setFont('helvetica', 'normal');
    docItem.sampleRows.forEach((row) => {
      const cellLines = row.map((cell) => pdf.splitTextToSize(cell, colWidth - 3));
      const maxLines = Math.max(...cellLines.map((l) => l.length), 2);
      const rowHeight = Math.max(12, maxLines * 4.2 + 4);
      pdf.setDrawColor(210, 222, 234);
      pdf.rect(12, y - 3, 273, rowHeight);
      cellLines.forEach((lines, i) => {
        if (i > 0) pdf.line(12 + i * colWidth, y - 3, 12 + i * colWidth, y - 3 + rowHeight);
        pdf.text(lines, 13.5 + i * colWidth, y + 1.5);
      });
      y += rowHeight;
    });

    // Blank Write-In Rows for Plant Floor Printing
    for (let b = 0; b < 3; b += 1) {
      if (y + 12 > 185) break;
      pdf.rect(12, y - 3, 273, 11);
      for (let i = 1; i < docItem.columns.length; i += 1) {
        pdf.line(12 + i * colWidth, y - 3, 12 + i * colWidth, y + 8);
      }
      y += 11;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.5);
    pdf.text('Audit Verification Notes & Guidance:', 12, Math.min(190, y + 4));
    pdf.setFont('helvetica', 'normal');
    docItem.auditGuidance.slice(0, 2).forEach((g, idx) => {
      pdf.text(`• ${g}`, 12, Math.min(195 + idx * 4.5, 203));
    });

    pdf.save(`${docItem.code}-${facilityName.replace(/[^a-zA-Z0-9]+/g, '-').slice(0, 24)}.pdf`);
    setToast(`Downloaded controlled PDF form: ${docItem.code}`);
    setTimeout(() => setToast(null), 3500);
  };

  const handleDownloadCsvTemplate = (docItem: QaQcTemplateDocument) => {
    if (!isUnlocked) {
      onOpenPremiumModal();
      return;
    }
    const escapeCsv = (cell: string) => `"${(cell || '').replace(/"/g, '""')}"`;
    const metaHeader = [
      `"Document Code","${docItem.code}","Title","${docItem.title}"`,
      `"Facility","${facilityName}","QA Lead","${qaLeadName}"`,
      ''
    ];
    const tableLines = [
      docItem.columns.map(escapeCsv).join(','),
      ...docItem.sampleRows.map((r) => r.map(escapeCsv).join(','))
    ];
    const blob = new Blob([[...metaHeader, ...tableLines].join('\n')], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docItem.code}-Spreadsheet-Template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToast(`Downloaded editable Excel/CSV template: ${docItem.code}`);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#D2DEEA] pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-amber-700">
            <Crown className="w-4 h-4 text-amber-500" />
            <span>Paid Member Exclusive Audit Kit</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[#1A2138]">
            Ready-to-Use QA/QC &amp; Audit Document Templates Vault
          </h2>
          <p className="text-xs text-[#5A6C84] max-w-2xl">
            Download audit-ready HACCP plans, SSOP pre-op logs, Allergen control matrices, FSSC v7 checklists, and PFA/PSQCA inspection forms pre-branded with your facility name.
          </p>
        </div>

        {!isUnlocked && (
          <button
            type="button"
            onClick={onOpenPremiumModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1A2138] to-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>Unlock All Vault Downloads</span>
          </button>
        )}
      </div>

      {/* Facility Personalization Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F0F6FC] border border-[#D2DEEA] rounded-2xl p-4">
        <div>
          <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
            Company / Plant Name (Printed on Document Header)
          </label>
          <input
            type="text"
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-bold text-[#1A2138]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
            Prepared By / QA Lead Name
          </label>
          <input
            type="text"
            value={qaLeadName}
            onChange={(e) => setQaLeadName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white border border-[#D2DEEA] text-xs font-bold text-[#1A2138]"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {['All', 'HACCP & Food Safety', 'Sanitation & PRP', 'Supplier & Audit', 'Regulatory Inspection'].map(
          (cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1673B8] text-white'
                  : 'bg-[#F8FAFC] border border-[#D2DEEA] text-[#1A2138] hover:bg-[#F0F6FC]'
              }`}
            >
              {cat}
            </button>
          )
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Document List */}
        <div className="lg:col-span-5 space-y-2.5">
          {filteredDocs.map((docItem) => {
            const active = selectedDoc.id === docItem.id;
            return (
              <button
                key={docItem.id}
                type="button"
                onClick={() => setSelectedDoc(docItem)}
                className={`w-full text-left p-4 rounded-2xl border transition cursor-pointer space-y-1 ${
                  active
                    ? 'bg-[#F0F6FC] border-2 border-[#1673B8]'
                    : 'bg-white border-[#D2DEEA] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[10.5px] font-extrabold text-[#1673B8]">
                  <span className="font-mono">{docItem.code}</span>
                  <span>{docItem.revision}</span>
                </div>
                <div className="text-sm font-black text-[#1A2138] leading-snug">
                  {docItem.title}
                </div>
                <div className="text-[11px] text-[#5A6C84]">{docItem.standardBadge}</div>
              </button>
            );
          })}
        </div>

        {/* Live Document Preview + Download */}
        <div className="lg:col-span-7 bg-[#F8FAFC] border border-[#D2DEEA] rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#D2DEEA] pb-3">
            <div>
              <span className="text-[11px] font-mono font-black text-[#1673B8]">
                {selectedDoc.code} · {selectedDoc.standardBadge}
              </span>
              <h3 className="text-base font-black text-[#1A2138] mt-0.5">
                {selectedDoc.title}
              </h3>
              <p className="text-xs text-[#5A6C84] mt-1">{selectedDoc.summary}</p>
            </div>
          </div>

          {/* Preview Table */}
          <div className="overflow-x-auto rounded-xl border border-[#D2DEEA] bg-white">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="bg-[#1A2138] text-white">
                  {selectedDoc.columns.map((col) => (
                    <th key={col} className="p-2.5 font-extrabold border-r border-white/15 last:border-0">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D2DEEA]">
                {(isUnlocked ? selectedDoc.sampleRows : selectedDoc.sampleRows.slice(0, 1)).map(
                  (row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#F0F6FC]">
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="p-2.5 text-[#1A2138] font-medium border-r border-[#D2DEEA] last:border-0 align-top"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
            {!isUnlocked && (
              <div className="p-3 bg-amber-50 border-t border-amber-200 text-xs font-bold text-amber-900 flex items-center justify-between gap-2">
                <span>Preview limited to Row 1. Upgrade to Paid Membership to view full SOP tables and download printable PDF/Excel files.</span>
                <button
                  type="button"
                  onClick={onOpenPremiumModal}
                  className="px-3 py-1.5 rounded-lg bg-[#1A2138] text-white text-[11px] font-extrabold shrink-0 cursor-pointer"
                >
                  Unlock Now
                </button>
              </div>
            )}
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="font-extrabold text-[#1A2138]">Auditor Verification Tips:</div>
            <ul className="space-y-1 text-[#5A6C84]">
              {selectedDoc.auditGuidance.map((tip) => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2.5 pt-2 border-t border-[#D2DEEA]">
            <button
              type="button"
              onClick={() => handleDownloadPdfTemplate(selectedDoc)}
              className="flex-1 min-w-[180px] py-2.5 px-4 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {isUnlocked ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>
                {isUnlocked ? 'Download Controlled PDF Form' : 'Paid Exclusive — Unlock PDF'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleDownloadCsvTemplate(selectedDoc)}
              className="flex-1 min-w-[180px] py-2.5 px-4 rounded-xl bg-white hover:bg-[#F0F6FC] border border-[#1673B8] text-[#1673B8] text-xs font-extrabold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {isUnlocked ? (
                <FileSpreadsheet className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <span>
                {isUnlocked ? 'Download Excel / CSV Sheet' : 'Paid Exclusive — Unlock CSV'}
              </span>
            </button>
          </div>
          {toast && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold text-center">
              {toast}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TOOL D: FOOD AUTHORITY LIMITS QUICK LOOKUP (PFA / PSQCA / SFDA / CODEX)
// ============================================================================
export const FoodAuthorityLimitsLookupTool: React.FC = () => {
  const [query, setQuery] = useState('');
  const [authorityFilter, setAuthorityFilter] = useState<'All' | FoodAuthorityBody>('All');
  const [categoryFilter, setCategoryFilter] = useState<'All' | FoodCommodityCategory>('All');
  const [copiedLimitId, setCopiedLimitId] = useState<string | null>(null);

  const categories = useMemo<Array<'All' | FoodCommodityCategory>>(
    () => [
      'All',
      'Dairy & Milk',
      'Edible Oils & Ghee',
      'Drinking & Bottled Water',
      'Spices, Grains & Mycotoxins',
      'Beverages & Juices',
      'Meat, Poultry & Seafood',
      'Bakery, Flour & Sugar'
    ],
    []
  );

  const filteredLimits = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FOOD_AUTHORITY_LIMITS.filter((item) => {
      if (authorityFilter !== 'All' && item.authority !== authorityFilter) return false;
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        item.product.toLowerCase().includes(q) ||
        item.parameter.toLowerCase().includes(q) ||
        item.limitValue.toLowerCase().includes(q) ||
        item.authority.toLowerCase().includes(q) ||
        item.clauseRef.toLowerCase().includes(q) ||
        item.complianceNote.toLowerCase().includes(q)
      );
    });
  }, [query, authorityFilter, categoryFilter]);

  const handleCopyRecord = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLimitId(id);
      setTimeout(() => setCopiedLimitId(null), 2000);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <div className="bg-white border border-[#D2DEEA] rounded-[24px] p-5 sm:p-6 shadow-xs space-y-5">
      <div className="border-b border-[#D2DEEA] pb-4 space-y-1">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#1673B8]">
          <ShieldCheck className="w-4 h-4" />
          <span>Statutory Standards &amp; Critical Limits Reference</span>
        </div>
        <h2 className="text-lg sm:text-xl font-black text-[#1A2138]">
          Food Authority Limits Quick Lookup (PFA / PSQCA / SFDA / Codex)
        </h2>
        <p className="text-xs text-[#5A6C84] max-w-3xl">
          Instant plant-floor &amp; laboratory lookup of statutory MRLs, microbiological criteria, fat/SNF standards, mycotoxin ceilings, and official analytical methods across Punjab Food Authority, PSQCA, GCC SFDA/GSO, and Codex Alimentarius.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search parameter, food, or standard (e.g. Aflatoxin, Peroxide, TDS, Fat, Bromate)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8] focus:bg-white"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={authorityFilter}
            onChange={(e) => setAuthorityFilter(e.target.value as 'All' | FoodAuthorityBody)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs font-extrabold text-[#1A2138]"
          >
            <option value="All">All Authorities (PFA / PSQCA / SFDA / Codex)</option>
            <option value="PFA">PFA (Punjab Food Authority)</option>
            <option value="PSQCA">PSQCA (Pakistan Standards)</option>
            <option value="SFDA / GSO">SFDA / GSO (GCC Export)</option>
            <option value="Codex">Codex Alimentarius</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as 'All' | FoodCommodityCategory)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#D2DEEA] text-xs font-extrabold text-[#1A2138]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Food Categories' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs font-bold text-[#5A6C84]">
        <span>Showing {filteredLimits.length} statutory parameters</span>
        <span>Works offline once Factory Floor Pack is saved</span>
      </div>

      {/* Limits Grid */}
      {filteredLimits.length === 0 ? (
        <div className="p-8 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] text-center space-y-2">
          <FileText className="w-8 h-8 text-[#1673B8] mx-auto opacity-70" />
          <p className="text-sm font-black text-[#1A2138]">No matching limits found</p>
          <p className="text-xs text-[#5A6C84]">
            Try searching broader terms like Milk, Aflatoxin, Water, Peroxide, Trans Fat, or Salmonella.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredLimits.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[#D2DEEA] bg-[#F8FAFC] hover:border-[#1673B8]/60 p-4 flex flex-col justify-between gap-3 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold text-[#1673B8]">
                    {item.authority} · {item.category}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyRecord(
                        `${item.authority} | ${item.product} | ${item.parameter}: ${item.limitValue} (${item.unit}) | Method: ${item.testMethod} | Ref: ${item.clauseRef}`,
                        item.id
                      )
                    }
                    className="px-2 py-1 rounded-lg bg-white border border-[#D2DEEA] text-[10.5px] font-bold text-[#1A2138] hover:text-[#1673B8] inline-flex items-center gap-1 cursor-pointer"
                  >
                    {copiedLimitId === item.id ? (
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

                <div>
                  <h3 className="text-sm font-black text-[#1A2138]">{item.product}</h3>
                  <p className="text-xs font-bold text-[#105E9A] mt-0.5">{item.parameter}</p>
                </div>

                <div className="rounded-xl bg-white border border-[#D2DEEA] p-2.5 flex items-baseline justify-between gap-2">
                  <span className="text-[11px] font-bold text-[#5A6C84]">
                    {item.limitType} Limit:
                  </span>
                  <span className="text-xs sm:text-sm font-black text-[#1A2138] font-mono tabular-nums text-right">
                    {item.limitValue} <span className="text-[10.5px] text-[#5A6C84]">({item.unit})</span>
                  </span>
                </div>

                <p className="text-[11px] text-[#5A6C84] leading-relaxed">{item.complianceNote}</p>
              </div>

              <div className="pt-2 border-t border-[#D2DEEA] flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-semibold text-[#5A6C84]">
                <span>Method: <strong className="text-[#1A2138]">{item.testMethod}</strong></span>
                <span>{item.clauseRef}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo, useRef } from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  Calendar,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  Crown,
  Download,
  Droplets,
  FileText,
  Flame,
  Hash,
  Heart,
  History,
  Info,
  Leaf,
  Lock,
  MessageSquare,
  Phone,
  Plus,
  RotateCcw,
  Ruler,
  Scale,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Trash2,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  X
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  HubUser,
  NutritionPatientRecord,
  NutritionPatientVisitEntry,
  UserToolsData
} from '../types/hub';
import {
  ActivityLevelOption,
  calculateSuiteNutritionIndexes,
  ConditionFoodCard,
  DEFAULT_SUITE_ONBOARDING,
  DOCTOR_DISCLAIMER_BANNER,
  DOCTOR_DISCLAIMER_CHAT,
  DOCTOR_DISCLAIMER_SHORT,
  GenderOption,
  generateDietitianAnswer,
  getHealthConditionRecommendations,
  GoalOption,
  SuiteComputedIndexes,
  SuiteOnboardingProfile
} from '../data/nutritionSuiteData';
import { jsPDF } from 'jspdf';
import { drawPdfBrandLogo, drawPdfUserPhoto } from '../lib/pdfBranding';

interface NutritionSuiteToolProps {
  user: HubUser;
  isUserPaid: boolean;
  hasExpiredPremium: boolean;
  toolsData: UserToolsData;
  onSaveToolsData: (updatedToolsData: UserToolsData) => Promise<void>;
  onOpenPremiumModal: () => void;
}

interface ChatMessageItem {
  id: string;
  sender: 'user' | 'dietitian';
  text: string;
  time: string;
}

type NutritionMainTab = 'assessment' | 'directory';
type DirectoryTimeFilter = 'all' | 'day' | 'week' | 'month';

/**
 * Generates a clean, memorable Unique Patient / Report ID (e.g. FSP-PT-1042)
 */
function generateNextPatientCode(existingRecords: NutritionPatientRecord[]): string {
  const baseNum = 1001 + existingRecords.length;
  const randomSuffix = Math.floor(10 + Math.random() * 89);
  const candidate = `FSP-PT-${baseNum}`;
  const exists = existingRecords.some(
    (r) => (r.patientCode || '').toUpperCase() === candidate
  );
  return exists ? `FSP-PT-${baseNum}-${randomSuffix}` : candidate;
}

/**
 * Enhanced Conversational AI Dietitian Chatbot Answer Generator
 */
function getDietitianChatbotReply(
  rawQuestion: string,
  profile: SuiteOnboardingProfile,
  indexes: SuiteComputedIndexes
): string {
  const q = rawQuestion.trim().toLowerCase();

  if (q.includes('diabetes') || q.includes('sugar') || q.includes('shugar') || q.includes('insulin')) {
    return `For Diabetes & Blood Sugar control:\n• Eat low-glycemic, high-fiber meals: pair 1 whole-wheat Chakki or Barley (Jau) Roti (80g) with Moong/Chana Daal, Palak (Spinach), Karela, or Grilled Chicken/Fish (120g).\n• Start lunch and dinner with a bowl of green cucumber & lettuce salad to slow glucose absorption.\n• Take 1/2 tsp soaked Methi seeds (fenugreek) or cinnamon water in the morning and walk 15–20 minutes after meals.\n• Avoid white bread, maida, white rice in excess, sugary chai, and cold drinks.\n\n${DOCTOR_DISCLAIMER_CHAT}`;
  }

  if (q.includes('bp') || q.includes('blood pressure') || q.includes('hypertension')) {
    return `For High Blood Pressure (Hypertension):\n• Follow the DASH plan: limit daily salt (sodium) to under 1 tsp (1,500mg) and never sprinkle raw salt on food.\n• Eat potassium & magnesium-rich foods daily: Spinach (Palak), Beetroot (Chukandar), Banana, Yogurt (Dahi), Coconut Water, and Oats.\n• Take 1 raw crushed garlic clove with water in the morning and include 5 walnuts + flaxseeds.\n• Avoid pickles (achar), papad, salted snacks, vanaspati ghee, and deep-fried foods.\n\n${DOCTOR_DISCLAIMER_CHAT}`;
  }

  if (q.includes('cholesterol') || q.includes('fatty liver') || q.includes('jigar') || q.includes('triglyceride')) {
    return `For High Cholesterol & Fatty Liver:\n• Start your morning with Rolled Oats or Barley (Jau) porridge topped with 1 tbsp ground Flaxseeds (Alsi) and 5 Walnuts — soluble fiber binds cholesterol in the gut.\n• Replace ghee/butter with 1–2 tsp Extra-Virgin Olive Oil or Canola/Mustard oil.\n• Include Grilled Fish (Omega-3), garlic, turmeric, green tea, and moong daal.\n• Completely stop sugary drinks, refined carbs (maida), and deep-fried foods. Reducing weight by 5–7% rapidly reverses fatty liver.\n\n${DOCTOR_DISCLAIMER_CHAT}`;
  }

  if (
    q.includes('acid') ||
    q.includes('gas') ||
    q.includes('bloat') ||
    q.includes('maida') ||
    q.includes('jalan') ||
    q.includes('heartburn') ||
    q.includes('gerd') ||
    q.includes('stomach')
  ) {
    return `For Acidity, Gas, Bloating & Stomach Relief:\n• Eat 4–5 smaller, light meals instead of heavy meals, and finish dinner at least 2.5 hours before sleeping.\n• Include soothing alkaline & probiotic foods: Cold Plain Yogurt (Dahi), Kachi Lassi, Banana, Boiled Moong Daal Khichdi, Bottle Gourd (Lauki), and Oatmeal.\n• Chew 1/2 tsp Fennel seeds (Saunf) + 1 Green Cardamom after meals.\n• Avoid spicy red chili curries, fried karahi/paratha, strong tea/coffee on an empty stomach, and carbonated sodas.\n\n${DOCTOR_DISCLAIMER_CHAT}`;
  }

  if (q.includes('uric') || q.includes('gout') || q.includes('joint') || q.includes('joron')) {
    return `For High Uric Acid & Joint Pain:\n• Drink 10–12 glasses of water daily, including 1 glass of fresh Lemon water (Vitamin C helps flush uric acid through the kidneys).\n• Eat low-purine alkaline foods: Lauki (Bottle Gourd), Tori, Kaddu, Cucumber, Apple, Cherries, Guava, Low-Fat Yogurt, Milk, and Egg Whites.\n• Strictly avoid Red Meat (Beef/Mutton), Organ Meats (Kaleji), Paye, seafood, and fructose-sweetened cold drinks.\n\n${DOCTOR_DISCLAIMER_CHAT}`;
  }

  if (q.includes('pcos') || q.includes('pcod') || q.includes('hormone') || q.includes('period')) {
    return `For PCOS & Hormonal Balance:\n• Focus on insulin sensitivity: eat 25–30g protein at breakfast (2 eggs, besan cheela, or Greek yogurt) to prevent insulin spikes.\n• Practice daily Seed Cycling: take 1 tbsp ground Flaxseeds (Alsi) + 1 tbsp Pumpkin/Chia seeds daily.\n• Drink 1–2 cups of Spearmint tea or Cinnamon tea daily.\n• Avoid white sugar, bakery items (maida), and cold drinks, and do 30 mins of daily brisk walking or strength training.\n\n${DOCTOR_DISCLAIMER_CHAT}`;
  }

  if (
    q.includes('anemia') ||
    q.includes('iron') ||
    q.includes('khoon') ||
    q.includes('hb') ||
    q.includes('hemoglobin') ||
    q.includes('weak') ||
    q.includes('kamzor') ||
    q.includes('hair')
  ) {
    return `For Anemia (Iron Deficiency), Weakness & Hair Fall:\n• Pair iron-rich foods (Spinach/Palak, Beetroot, Pomegranate/Anaar, Kala Chana, Dates/Khajoor, Lean Meat, Eggs) with Vitamin C (squeeze fresh Lemon juice on meals or eat Guava/Orange) — this triples iron absorption.\n• IMPORTANT: Never drink Chai or Coffee with meals or within 60–90 minutes after eating, as tea tannins block 60% of iron absorption.\n\n${DOCTOR_DISCLAIMER_CHAT}`;
  }

  if (q.includes('thyroid') || q.includes('tsh')) {
    return `For Thyroid Health:\n• Keep a 45–60 minute gap after your morning thyroid medication before taking tea, milk, or breakfast.\n• Include Selenium, Zinc & Iodine-supportive foods: Eggs, Fish, Pumpkin Seeds, Walnuts, Yogurt, and Lentils.\n• Always cook cruciferous vegetables (cabbage, cauliflower, broccoli) thoroughly instead of eating them raw.\n\n${DOCTOR_DISCLAIMER_CHAT}`;
  }

  if (
    q.includes('weight loss') ||
    q.includes('lose weight') ||
    q.includes('wazan kam') ||
    q.includes('belly') ||
    q.includes('fat') ||
    q.includes('motapa')
  ) {
    return `For Healthy Weight & Belly Fat Loss (Based on your BMI ${indexes.bmi} — ${indexes.bmiStatus}):\n• Your daily calorie target is ${indexes.dailyCaloriesNeeded} kcal/day with ${indexes.targetProteinG}g Protein.\n• Breakfast: 2 Boiled Eggs or Oats Bowl. Lunch: 1 Whole-Wheat Roti + Grilled Chicken/Daal + Big Green Salad. Snack: Green Tea + 7 Almonds/Roasted Chana. Dinner: Grilled Fish/Tikka or Paneer with Steamed Vegetables.\n• Drink ${profile.dailyWaterGoalGlasses}+ glasses of water (1 glass 20 mins before meals) and eliminate all liquid sugar.\n\n${DOCTOR_DISCLAIMER_CHAT}`;
  }

  if (
    q.includes('weight gain') ||
    q.includes('gain weight') ||
    q.includes('wazan barh') ||
    q.includes('muscle') ||
    q.includes('underweight')
  ) {
    return `For Healthy Weight & Muscle Gain:\n• Aim for a clean calorie surplus (${indexes.dailyCaloriesNeeded + 350} kcal/day) with ${indexes.targetProteinG}g protein.\n• Take 1 daily High-Calorie Smoothie: 1 cup Milk + 1 Banana + 3 Dates (Khajoor) + 1.5 tbsp Peanut Butter + 1/2 cup Oats + 6 Almonds (~550 kcal).\n• Include Eggs, Chicken, Fish, Paneer, Chickpeas, Sweet Potato, and Brown Rice in your daily meals.\n\n${DOCTOR_DISCLAIMER_CHAT}`;
  }

  const baseAnswer = generateDietitianAnswer(rawQuestion, profile, indexes);
  return `Regarding "${rawQuestion}":\n• Prioritize anti-inflammatory whole foods: fresh leafy greens, seasonal vegetables, lean proteins (${indexes.targetProteinG}g/day target), and complex high-fiber grains.\n• Stay well-hydrated with ${profile.dailyWaterGoalGlasses}–10 glasses of water daily and avoid ultra-processed foods, refined sugar, and deep-fried oils.\n• ${baseAnswer}`;
}

/**
 * Helper icon for Recommended / Avoided food cards
 */
const ConditionFoodIcon: React.FC<{
  iconType: ConditionFoodCard['iconType'];
  isRecommended: boolean;
}> = ({ iconType, isRecommended }) => {
  const colorClass = isRecommended ? 'text-[#1673B8]' : 'text-[#B91C1C]';
  const bgClass = isRecommended ? 'bg-[#D6E8F8]' : 'bg-[#FECACA]/70';

  return (
    <div
      className={`w-10 h-10 rounded-xl ${bgClass} ${colorClass} flex items-center justify-center shrink-0 text-lg`}
    >
      {iconType === 'leaf' && '🌿'}
      {iconType === 'fish' && '🐟'}
      {iconType === 'bowl' && '🥣'}
      {iconType === 'grain' && '🌾'}
      {iconType === 'cereal' && '🥣'}
      {iconType === 'bread' && '🍞'}
      {iconType === 'fried' && '🍟'}
      {iconType === 'meat' && '🥩'}
    </div>
  );
};

/**
 * Pure helper to compute all clinical body composition & nutrition metrics for any person/patient.
 * Automatically falls back to smart clinical estimates if optional tape measurements are left blank!
 */
function computeCompleteClinicalMetrics(params: {
  age: number;
  gender: GenderOption;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activityLevel: ActivityLevelOption;
  goal: GoalOption;
  waterGlasses: number;
  waistCmOptional?: number;
  hipCmOptional?: number;
  neckCmOptional?: number;
  wristCmOptional?: number;
}) {
  const profileObj: SuiteOnboardingProfile = {
    ...DEFAULT_SUITE_ONBOARDING,
    age: params.age,
    gender: params.gender,
    heightCm: params.heightCm,
    weightKg: params.weightKg,
    targetWeightKg: params.targetWeightKg,
    activityLevel: params.activityLevel,
    goal: params.goal,
    dailyWaterGoalGlasses: 8,
    setupCompleted: true
  };

  const baseIndexes = calculateSuiteNutritionIndexes(
    profileObj,
    params.waterGlasses
  );

  const isFemale = params.gender === 'Female';
  const heightCm = Math.max(120, params.heightCm || 170);
  const heightM = heightCm / 100;
  const weightKg = Math.max(30, params.weightKg || 70);
  const age = Math.max(10, params.age || 28);

  const estWaistCm = Math.round(heightCm * (0.34 + baseIndexes.bmi * 0.0075));
  const estHipCm = Math.round(
    heightCm *
      (isFemale ? 0.42 + baseIndexes.bmi * 0.007 : 0.4 + baseIndexes.bmi * 0.006)
  );
  const estNeckCm = Math.round(
    (isFemale ? 31 : 36) + (baseIndexes.bmi - 22) * 0.25
  );
  const estWristCm = Number((heightCm / (isFemale ? 10.6 : 10.0)).toFixed(1));

  const hasCustomWaist =
    typeof params.waistCmOptional === 'number' && params.waistCmOptional > 35;
  const hasCustomHip =
    typeof params.hipCmOptional === 'number' && params.hipCmOptional > 40;
  const hasCustomNeck =
    typeof params.neckCmOptional === 'number' && params.neckCmOptional > 20;
  const hasCustomWrist =
    typeof params.wristCmOptional === 'number' && params.wristCmOptional > 10;

  const waistCm = hasCustomWaist ? params.waistCmOptional! : estWaistCm;
  const hipCm = hasCustomHip ? params.hipCmOptional! : estHipCm;
  const neckCm = hasCustomNeck ? params.neckCmOptional! : estNeckCm;
  const wristCm = hasCustomWrist ? params.wristCmOptional! : estWristCm;

  // 1. Body Fat %
  const deurenbergBf = Number(
    Math.max(
      5,
      Math.min(
        55,
        1.2 * baseIndexes.bmi + 0.23 * age - 10.8 * (isFemale ? 0 : 1) - 5.4
      )
    ).toFixed(1)
  );

  let navyBf = deurenbergBf;
  if (!isFemale && waistCm - neckCm > 10) {
    const calc =
      495 /
        (1.0324 -
          0.19077 * Math.log10(waistCm - neckCm) +
          0.15456 * Math.log10(heightCm)) -
      450;
    if (!Number.isNaN(calc) && Number.isFinite(calc)) {
      navyBf = Number(Math.max(4, Math.min(55, calc)).toFixed(1));
    }
  } else if (isFemale && waistCm + hipCm - neckCm > 20) {
    const calc =
      495 /
        (1.29579 -
          0.35004 * Math.log10(waistCm + hipCm - neckCm) +
          0.221 * Math.log10(heightCm)) -
      450;
    if (!Number.isNaN(calc) && Number.isFinite(calc)) {
      navyBf = Number(Math.max(8, Math.min(58, calc)).toFixed(1));
    }
  }

  const avgBodyFatPct = hasCustomWaist
    ? Number(((navyBf + deurenbergBf) / 2).toFixed(1))
    : deurenbergBf;

  let bodyFatCategory = 'Healthy / Fitness';
  let bodyFatBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (!isFemale) {
    if (avgBodyFatPct < 14) {
      bodyFatCategory = 'Athletic / Lean';
      bodyFatBadgeClass = 'bg-sky-100 text-sky-800 border-sky-300';
    } else if (avgBodyFatPct <= 18) {
      bodyFatCategory = 'Fitness / Optimal';
      bodyFatBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    } else if (avgBodyFatPct <= 24) {
      bodyFatCategory = 'Normal / Average';
      bodyFatBadgeClass = 'bg-blue-100 text-blue-800 border-blue-300';
    } else {
      bodyFatCategory = 'High Body Fat';
      bodyFatBadgeClass = 'bg-amber-100 text-amber-900 border-amber-300';
    }
  } else {
    if (avgBodyFatPct < 21) {
      bodyFatCategory = 'Athletic / Lean';
      bodyFatBadgeClass = 'bg-sky-100 text-sky-800 border-sky-300';
    } else if (avgBodyFatPct <= 25) {
      bodyFatCategory = 'Fitness / Optimal';
      bodyFatBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    } else if (avgBodyFatPct <= 31) {
      bodyFatCategory = 'Normal / Average';
      bodyFatBadgeClass = 'bg-blue-100 text-blue-800 border-blue-300';
    } else {
      bodyFatCategory = 'High Body Fat';
      bodyFatBadgeClass = 'bg-amber-100 text-amber-900 border-amber-300';
    }
  }

  // 2. Lean Body Mass (LBM), Fat Mass & FFMI
  const fatMassKg = Number(((weightKg * avgBodyFatPct) / 100).toFixed(1));
  const leanBodyMassKg = Number(Math.max(20, weightKg - fatMassKg).toFixed(1));
  const ffmi = Number((leanBodyMassKg / (heightM * heightM)).toFixed(1));

  // 3. WHR & WtHR
  const whr = Number((waistCm / Math.max(40, hipCm)).toFixed(2));
  const wthr = Number((waistCm / heightCm).toFixed(2));

  let visceralRiskLabel = 'Low Belly / Heart Risk';
  let visceralRiskBadge = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  const highWhrThreshold = isFemale ? 0.85 : 0.9;
  if (wthr >= 0.6 || whr > highWhrThreshold + 0.05) {
    visceralRiskLabel = 'High Central / Visceral Fat Risk';
    visceralRiskBadge = 'bg-red-100 text-red-800 border-red-300';
  } else if (wthr >= 0.5 || whr > highWhrThreshold) {
    visceralRiskLabel = 'Moderate Belly Fat Risk';
    visceralRiskBadge = 'bg-amber-100 text-amber-900 border-amber-300';
  }

  // 4. Frame Size & Ideal Body Weight Range
  const frameRatio = Number((heightCm / Math.max(10, wristCm)).toFixed(1));
  let frameSize: 'Small Frame' | 'Medium Frame' | 'Large Frame' = 'Medium Frame';
  if (!isFemale) {
    if (frameRatio > 10.4) frameSize = 'Small Frame';
    else if (frameRatio < 9.6) frameSize = 'Large Frame';
  } else {
    if (frameRatio > 11.0) frameSize = 'Small Frame';
    else if (frameRatio < 10.1) frameSize = 'Large Frame';
  }

  const inchesOver5Ft = Math.max(0, heightCm / 2.54 - 60);
  const devineIbw = Number(
    ((isFemale ? 45.5 : 50.0) + 2.3 * inchesOver5Ft).toFixed(1)
  );
  const robinsonIbw = Number(
    ((isFemale ? 49.0 : 52.0) + (isFemale ? 1.7 : 1.9) * inchesOver5Ft).toFixed(1)
  );
  const millerIbw = Number(
    ((isFemale ? 53.1 : 56.2) + (isFemale ? 1.36 : 1.41) * inchesOver5Ft).toFixed(1)
  );
  const hamwiIbw = Number(
    ((isFemale ? 45.5 : 48.0) + (isFemale ? 2.2 : 2.7) * inchesOver5Ft).toFixed(1)
  );
  const adjustedBodyWeightKg = Number(
    (devineIbw + 0.4 * Math.max(0, weightKg - devineIbw)).toFixed(1)
  );

  // 5. Metabolic Age & BMR
  const mifflinBmr = baseIndexes.bmrKcal;
  const harrisBenedictBmr = Math.round(
    isFemale
      ? 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age
      : 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age
  );
  const katchMcArdleBmr = Math.round(370 + 21.6 * leanBodyMassKg);

  const bmiDiff = baseIndexes.bmi - 21.8;
  const bfDiff = avgBodyFatPct - (isFemale ? 24 : 16);
  const metabolicAge = Math.round(
    Math.max(16, Math.min(85, age + bmiDiff * 0.75 + bfDiff * 0.35))
  );

  // 6. Total Body Water (TBW) & Body Surface Area (BSA)
  const tbwLiters = Number(
    (isFemale
      ? -2.097 + 0.1069 * heightCm + 0.2466 * weightKg
      : 2.447 - 0.09156 * age + 0.1074 * heightCm + 0.3362 * weightKg
    ).toFixed(1)
  );
  const tbwPct = Number(
    Math.min(72, Math.max(42, (tbwLiters / weightKg) * 100)).toFixed(1)
  );
  const bsaM2 = Number(Math.sqrt((heightCm * weightKg) / 3600).toFixed(2));

  // 7. Precision Hydration
  const activityWaterBonusL =
    params.activityLevel === 'Athlete'
      ? 1.0
      : params.activityLevel === 'Very Active'
      ? 0.7
      : params.activityLevel === 'Moderately Active'
      ? 0.4
      : 0.15;
  const precisionWaterLiters = Number(
    (weightKg * 0.035 + activityWaterBonusL).toFixed(2)
  );
  const precisionWaterGlasses = Math.max(
    6,
    Math.round((precisionWaterLiters * 1000) / 250)
  );

  // 8. Fiber, Sugar, Sat Fat & Daily Micronutrient RDAs
  const targetFiberG = Math.max(
    25,
    Math.round((baseIndexes.dailyCaloriesNeeded / 1000) * 14)
  );
  const maxFreeSugarG = Math.round((baseIndexes.dailyCaloriesNeeded * 0.05) / 4);
  const maxSaturatedFatG = Math.round((baseIndexes.dailyCaloriesNeeded * 0.07) / 9);
  const rdaIronMg = isFemale && age <= 50 ? 18 : 8;
  const rdaCalciumMg = age > 50 ? 1200 : 1000;
  const rdaVitDIU = age > 70 ? 800 : 600;
  const rdaVitB12Mcg = 2.4;
  const rdaZincMg = isFemale ? 8 : 11;
  const rdaFolateMcg = 400;
  const rdaPotassiumMg = isFemale ? 2600 : 3400;
  const rdaMagnesiumMg = isFemale ? 320 : 420;

  return {
    baseIndexes,
    waistCm: Number(waistCm.toFixed(1)),
    hipCm: Number(hipCm.toFixed(1)),
    neckCm: Number(neckCm.toFixed(1)),
    wristCm: Number(wristCm.toFixed(1)),
    usedEstimatedTape: !hasCustomWaist,
    navyBf,
    deurenbergBf,
    avgBodyFatPct,
    bodyFatCategory,
    bodyFatBadgeClass,
    fatMassKg,
    leanBodyMassKg,
    ffmi,
    whr,
    wthr,
    visceralRiskLabel,
    visceralRiskBadge,
    frameRatio,
    frameSize,
    devineIbw,
    robinsonIbw,
    millerIbw,
    hamwiIbw,
    adjustedBodyWeightKg,
    mifflinBmr,
    harrisBenedictBmr,
    katchMcArdleBmr,
    metabolicAge,
    tbwLiters,
    tbwPct,
    bsaM2,
    precisionWaterLiters,
    precisionWaterGlasses,
    targetFiberG,
    maxFreeSugarG,
    maxSaturatedFatG,
    rdaIronMg,
    rdaCalciumMg,
    rdaVitDIU,
    rdaVitB12Mcg,
    rdaZincMg,
    rdaFolateMcg,
    rdaPotassiumMg,
    rdaMagnesiumMg
  };
}

export const NutritionSuiteTool: React.FC<NutritionSuiteToolProps> = ({
  user,
  isUserPaid,
  toolsData,
  onSaveToolsData,
  onOpenPremiumModal
}) => {
  const savedNut = toolsData?.nutrition;
  const hasFullPaidAccess = Boolean(isUserPaid || user.isAdmin);

  // ==========================================================================
  // TOP-LEVEL 2 TABS FOR PAID MEMBERS:
  // Tab 1: 'assessment' (Patient Details & Visual Flow)
  // Tab 2: 'directory' (Patients Directory & Visit History — Day/Week/Month)
  // ==========================================================================
  const [activeMainTab, setActiveMainTab] =
    useState<NutritionMainTab>('assessment');

  // Saved Patients Directory State (Text-only storage for Paid Users)
  const [patientLogs, setPatientLogs] = useState<NutritionPatientRecord[]>(() =>
    (savedNut?.patientLogs || []).map((rec, idx) => ({
      ...rec,
      patientCode: rec.patientCode || `FSP-PT-${1001 + idx}`,
      updatedAtIso: rec.updatedAtIso || new Date().toISOString(),
      visitHistory:
        rec.visitHistory && rec.visitHistory.length > 0
          ? rec.visitHistory
          : [
              {
                visitId: `v-${rec.id}-1`,
                visitNumber: 1,
                visitDate: rec.savedAt || 'Initial Visit',
                visitIso: rec.updatedAtIso || new Date().toISOString(),
                weightKg: rec.weightKg,
                targetWeightKg: rec.targetWeightKg,
                bmi: rec.bmi,
                bmiStatus: rec.bmiStatus,
                bodyFatPct: rec.bodyFatPct,
                leanBodyMassKg: rec.leanBodyMassKg,
                dailyCaloriesNeeded: rec.dailyCaloriesNeeded,
                healthCondition: rec.healthCondition || '',
                prescriptionNotes: rec.prescriptionNotes || ''
              }
            ]
    }))
  );

  // ==========================================================================
  // UNIFIED INPUTS IN TAB 1 (STEP 1)
  // ==========================================================================
  const [patientCodeInput, setPatientCodeInput] = useState<string>(() =>
    generateNextPatientCode(savedNut?.patientLogs || [])
  );
  const [fullNameInput, setFullNameInput] = useState<string>(
    () => user.name || 'Food Specialist'
  );
  const [patientContactInput, setPatientContactInput] = useState<string>('');
  const [ageInput, setAgeInput] = useState<string>(() =>
    String(savedNut?.age ?? 28)
  );
  const [genderInput, setGenderInput] = useState<GenderOption>(() =>
    savedNut?.gender === 'female' ? 'Female' : 'Male'
  );
  const [heightUnit, setHeightUnit] = useState<'cm' | 'feet'>('cm');
  const [heightCmInput, setHeightCmInput] = useState<string>(() =>
    String(savedNut?.heightCm ?? 172)
  );
  const [heightFeetInput, setHeightFeetInput] = useState<string>('5');
  const [heightInchesInput, setHeightInchesInput] = useState<string>('8');
  const [weightKgInput, setWeightKgInput] = useState<string>(() =>
    String(savedNut?.weightKg ?? 74)
  );
  const [targetWeightKgInput, setTargetWeightKgInput] = useState<string>(() =>
    String(savedNut?.targetWeightKg ?? 68)
  );
  const [activityLevel, setActivityLevel] =
    useState<ActivityLevelOption>('Moderately Active');
  const [goal, setGoal] = useState<GoalOption>('Lose Weight');
  const [waterGoalInput, setWaterGoalInput] = useState<string>('8');

  // Optional Body Circumference Inputs inside Step 1 (Safe to leave blank!)
  const [circumferenceUnit, setCircumferenceUnit] = useState<'cm' | 'in'>('cm');
  const [waistInput, setWaistInput] = useState<string>('');
  const [hipInput, setHipInput] = useState<string>('');
  const [neckInput, setNeckInput] = useState<string>('');
  const [wristInput, setWristInput] = useState<string>('');

  // Nutritionist Prescription & Clinical Notes inside Step 1
  const [prescriptionNotesInput, setPrescriptionNotesInput] =
    useState<string>('');

  // Directory Search, Filter & Expanded History State (Tab 2)
  const [patientSearchQuery, setPatientSearchQuery] = useState<string>('');
  const [directoryTimeFilter, setDirectoryTimeFilter] =
    useState<DirectoryTimeFilter>('all');
  const [activeLoadedPatientId, setActiveLoadedPatientId] = useState<
    string | null
  >(null);
  const [expandedHistoryPatientId, setExpandedHistoryPatientId] = useState<
    string | null
  >(null);

  // Quick Lookup Input in Step 1 for Returning Patient (by Mobile or Patient ID)
  const [quickLookupQuery, setQuickLookupQuery] = useState<string>('');

  const step1Ref = useRef<HTMLDivElement | null>(null);

  // Derived numeric profile for live formulas
  const profile: SuiteOnboardingProfile = useMemo(() => {
    const parsedAge = Number(ageInput);
    const parsedHeightCm = Number(heightCmInput);
    const parsedFeet = Number(heightFeetInput);
    const parsedInches = Number(heightInchesInput);
    const parsedWeight = Number(weightKgInput);
    const parsedTargetWeight = Number(targetWeightKgInput);
    const parsedWaterGoal = Number(waterGoalInput);

    const effectiveHeightCm =
      heightUnit === 'feet'
        ? Math.round(
            ((!Number.isNaN(parsedFeet) && parsedFeet > 0 ? parsedFeet : 5) *
              12 +
              (!Number.isNaN(parsedInches) && parsedInches >= 0
                ? parsedInches
                : 8)) *
              2.54
          )
        : !Number.isNaN(parsedHeightCm) && parsedHeightCm > 0
        ? parsedHeightCm
        : 172;

    const effectiveWeightKg =
      !Number.isNaN(parsedWeight) && parsedWeight > 0 ? parsedWeight : 74;

    const defaultIdealTarget = Math.round(
      22 * Math.pow(effectiveHeightCm / 100, 2)
    );

    return {
      ...DEFAULT_SUITE_ONBOARDING,
      uid: user.uid,
      fullName: fullNameInput.trim() || user.name || 'Food Specialist',
      age: !Number.isNaN(parsedAge) && parsedAge > 0 ? parsedAge : 28,
      gender: genderInput,
      heightUnit,
      heightCm: effectiveHeightCm,
      heightFeet: !Number.isNaN(parsedFeet) ? parsedFeet : 5,
      heightInches: !Number.isNaN(parsedInches) ? parsedInches : 8,
      weightKg: effectiveWeightKg,
      targetWeightKg:
        !Number.isNaN(parsedTargetWeight) && parsedTargetWeight > 0
          ? parsedTargetWeight
          : defaultIdealTarget,
      activityLevel,
      goal,
      dailyWaterGoalGlasses:
        !Number.isNaN(parsedWaterGoal) && parsedWaterGoal > 0
          ? parsedWaterGoal
          : 8,
      setupCompleted: true
    };
  }, [
    user.uid,
    user.name,
    fullNameInput,
    ageInput,
    genderInput,
    heightUnit,
    heightCmInput,
    heightFeetInput,
    heightInchesInput,
    weightKgInput,
    targetWeightKgInput,
    activityLevel,
    goal,
    waterGoalInput
  ]);

  // Water glasses tracker
  const [waterGlasses, setWaterGlasses] = useState<number>(
    () => toolsData?.nutrition?.waterGlassesToday ?? 6
  );

  // Weight History
  const [weightLogs, setWeightLogs] = useState<
    { date: string; weightKg: number; bmi: number }[]
  >(() =>
    toolsData?.nutrition?.weightHistory?.length
      ? toolsData.nutrition.weightHistory
      : [
          { date: 'Week 1', weightKg: 76.0, bmi: 25.7 },
          { date: 'Week 2', weightKg: 75.2, bmi: 25.4 },
          { date: 'Week 3', weightKg: 74.5, bmi: 25.2 },
          {
            date: 'Today',
            weightKg: Number(toolsData?.nutrition?.weightKg || 74.0),
            bmi: 25.0
          }
        ]
  );

  // Nutrition Recommendation Condition Search State (Empty by default until user enters/selects an issue!)
  const [conditionQuery, setConditionQuery] = useState<string>('');
  const [activeCondition, setActiveCondition] = useState<string>('');

  // AI Dietitian Chatbot State
  const initialWelcomeMessage = useMemo<ChatMessageItem>(
    () => ({
      id: 'welcome-msg',
      sender: 'dietitian',
      text: `Assalam-o-Alaikum ${
        user.name || 'Specialist'
      }! I am your AI Nutrition & Dietitian Assistant. Enter any health or nutrition issue below (e.g., Diabetes, High BP, Cholesterol, Acidity, Uric Acid, PCOS, Anemia, Weight Loss, or Weight Gain) and I will give you the recommended dietary solution. ${DOCTOR_DISCLAIMER_CHAT}`,
      time: 'Just now'
    }),
    [user.name]
  );

  const [chatMessages, setChatMessages] = useState<ChatMessageItem[]>(() => [
    initialWelcomeMessage
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const chatSectionRef = useRef<HTMLDivElement | null>(null);

  // Save notification banner
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Convert optional tape inputs to cm (or undefined if left blank by user)
  const parsedOptionalTapeCm = useMemo(() => {
    const parseOpt = (raw: string): number | undefined => {
      const trimmed = raw.trim();
      if (!trimmed) return undefined;
      const val = Number(trimmed);
      if (Number.isNaN(val) || val <= 0) return undefined;
      return circumferenceUnit === 'in'
        ? Number((val * 2.54).toFixed(1))
        : Number(val.toFixed(1));
    };
    return {
      waistCm: parseOpt(waistInput),
      hipCm: parseOpt(hipInput),
      neckCm: parseOpt(neckInput),
      wristCm: parseOpt(wristInput)
    };
  }, [circumferenceUnit, waistInput, hipInput, neckInput, wristInput]);

  // Live Calculated BMI, BMR, TDEE, Ideal Weight, Macros & Complete Clinical Metrics
  const clinicalReport = useMemo(
    () =>
      computeCompleteClinicalMetrics({
        age: profile.age,
        gender: profile.gender,
        heightCm: profile.heightCm,
        weightKg: profile.weightKg,
        targetWeightKg: profile.targetWeightKg,
        activityLevel: profile.activityLevel,
        goal: profile.goal,
        waterGlasses,
        waistCmOptional: parsedOptionalTapeCm.waistCm,
        hipCmOptional: parsedOptionalTapeCm.hipCm,
        neckCmOptional: parsedOptionalTapeCm.neckCm,
        wristCmOptional: parsedOptionalTapeCm.wristCm
      }),
    [profile, waterGlasses, parsedOptionalTapeCm]
  );

  const indexes = clinicalReport.baseIndexes;

  // Currently loaded patient object (if updating a returning patient)
  const activeLoadedPatient = useMemo(
    () =>
      activeLoadedPatientId
        ? patientLogs.find((p) => p.id === activeLoadedPatientId) || null
        : null,
    [activeLoadedPatientId, patientLogs]
  );

  // Weight Advice Logic
  const weightGuidance = useMemo(() => {
    const diffFromIdeal = Number(
      (profile.weightKg - indexes.idealWeightKg).toFixed(1)
    );
    const diffFromTarget = Number(
      (profile.weightKg - profile.targetWeightKg).toFixed(1)
    );

    if (indexes.bmi < 18.5 || diffFromIdeal < -2) {
      const kgToGain = Math.abs(diffFromIdeal).toFixed(1);
      return {
        actionType: 'GAIN WEIGHT',
        badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
        headline: `Recommended to GAIN approx. ${kgToGain} kg to reach Healthy Ideal Weight (${indexes.idealWeightKg} kg).`,
        detail: `Current BMI is ${indexes.bmi} (${indexes.bmiStatus}). Aim for ${indexes.dailyCaloriesNeeded} kcal/day with ${indexes.targetProteinG}g protein and strength exercises to build lean weight safely.`
      };
    }

    if (indexes.bmi >= 25 || diffFromIdeal > 2) {
      const kgToLose = Math.max(0.5, diffFromIdeal).toFixed(1);
      return {
        actionType: 'REDUCE WEIGHT',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        headline: `Recommended to REDUCE approx. ${kgToLose} kg to reach Healthy Ideal Weight (${indexes.idealWeightKg} kg).`,
        detail: `Current BMI is ${indexes.bmi} (${indexes.bmiStatus}). Follow a daily target of ${indexes.dailyCaloriesNeeded} kcal/day, ${indexes.targetProteinG}g protein, and ${clinicalReport.precisionWaterGlasses} glasses of water to steadily reach ${profile.targetWeightKg} kg.`
      };
    }

    return {
      actionType: 'HEALTHY WEIGHT — MAINTAIN',
      badgeBg: 'bg-[#EBF4FC] text-[#1A2138] border-[#BBD6EE]',
      headline: `Great job! Weight (${profile.weightKg} kg) is in the Healthy Normal BMI range (${indexes.bmi}).`,
      detail:
        diffFromTarget !== 0
          ? `Only ${Math.abs(diffFromTarget).toFixed(1)} kg away from target weight of ${profile.targetWeightKg} kg. Maintain ${indexes.dailyCaloriesNeeded} kcal/day.`
          : `Maintain balanced diet of ${indexes.dailyCaloriesNeeded} kcal/day and ${clinicalReport.precisionWaterGlasses} glasses of water daily.`
    };
  }, [
    profile.weightKg,
    profile.targetWeightKg,
    indexes,
    clinicalReport.precisionWaterGlasses
  ]);

  // Health Condition Food Recommendation Data
  const conditionRecommendation = useMemo(
    () => getHealthConditionRecommendations(activeCondition),
    [activeCondition]
  );

  // ==========================================================================
  // DAY-WISE, WEEK-WISE & MONTH-WISE PATIENT DIRECTORY ANALYTICS & FILTERING
  // ==========================================================================
  const directoryStatsAndFiltered = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;

    let dayCount = 0;
    let weekCount = 0;
    let monthCount = 0;

    const getRecordTimestamp = (rec: NutritionPatientRecord): number => {
      if (rec.updatedAtIso) {
        const t = new Date(rec.updatedAtIso).getTime();
        if (!Number.isNaN(t)) return t;
      }
      if (rec.savedAt) {
        const t = new Date(rec.savedAt).getTime();
        if (!Number.isNaN(t)) return t;
      }
      return now.getTime();
    };

    patientLogs.forEach((rec) => {
      const ts = getRecordTimestamp(rec);
      if (ts >= startOfToday) dayCount += 1;
      if (ts >= sevenDaysAgo) weekCount += 1;
      if (ts >= thirtyDaysAgo) monthCount += 1;
    });

    const q = patientSearchQuery.trim().toLowerCase();

    const filtered = patientLogs.filter((rec) => {
      const ts = getRecordTimestamp(rec);
      if (directoryTimeFilter === 'day' && ts < startOfToday) return false;
      if (directoryTimeFilter === 'week' && ts < sevenDaysAgo) return false;
      if (directoryTimeFilter === 'month' && ts < thirtyDaysAgo) return false;

      if (!q) return true;
      return (
        (rec.patientCode || '').toLowerCase().includes(q) ||
        (rec.patientContact || '').toLowerCase().includes(q) ||
        rec.patientName.toLowerCase().includes(q) ||
        (rec.healthCondition || '').toLowerCase().includes(q) ||
        rec.id.toLowerCase().includes(q)
      );
    });

    return {
      dayCount,
      weekCount,
      monthCount,
      totalCount: patientLogs.length,
      filtered
    };
  }, [patientLogs, patientSearchQuery, directoryTimeFilter]);

  // Send message to AI Dietitian Chatbot
  const handleSendChatMessage = (customText?: string) => {
    const questionText = (customText ?? chatInput).trim();
    if (!questionText) return;

    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const userMsg: ChatMessageItem = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: questionText,
      time: nowTime
    };

    const replyText = getDietitianChatbotReply(questionText, profile, indexes);

    const botMsg: ChatMessageItem = {
      id: `b-${Date.now() + 1}`,
      sender: 'dietitian',
      text: replyText,
      time: nowTime
    };

    setChatMessages((prev) => [...prev, userMsg, botMsg]);
    if (!customText) {
      setChatInput('');
    }
  };

  // Clear AI Dietitian Chat History
  const handleClearChat = () => {
    setChatMessages([
      {
        ...initialWelcomeMessage,
        id: `welcome-${Date.now()}`,
        time: 'Chat Cleared'
      }
    ]);
    setChatInput('');
  };

  // Save Personal Health & Nutrition Tracker Data
  const handleSaveHealthTracker = async () => {
    const todayLabel = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    const updatedHistory = [
      ...weightLogs.slice(-5),
      {
        date: todayLabel,
        weightKg: Number(profile.weightKg),
        bmi: indexes.bmi
      }
    ];
    setWeightLogs(updatedHistory);

    const updatedToolsData: UserToolsData = {
      ...toolsData,
      nutrition: {
        ...toolsData.nutrition,
        age: Number(profile.age),
        gender: profile.gender === 'Female' ? 'female' : 'male',
        heightCm: Number(profile.heightCm),
        weightKg: Number(profile.weightKg),
        targetWeightKg: Number(profile.targetWeightKg),
        waterGlassesToday: waterGlasses,
        weightHistory: updatedHistory,
        patientLogs,
        updatedAt: new Date().toISOString()
      }
    };

    try {
      await onSaveToolsData(updatedToolsData);
      if (user?.uid) {
        await setDoc(
          doc(db, 'users', user.uid, 'nutritionProfile', 'main'),
          {
            ...profile,
            waterGlasses,
            bmi: indexes.bmi,
            bmiStatus: indexes.bmiStatus,
            dailyCaloriesNeeded: indexes.dailyCaloriesNeeded,
            patientLogs,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      }
    } catch {
      // Local state updates seamlessly
    }

    setSaveSuccessMsg('Health & Nutrition Report data has been saved!');
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // ==========================================================================
  // PAID MEMBER HOSPITAL-GRADE PATIENT SAVE & FOLLOW-UP VISIT HISTORY UPDATER
  // Automatically matches returning patients by Loaded ID, Patient Code, or Mobile No.!
  // ==========================================================================
  const handleSavePatientRecord = async () => {
    if (!hasFullPaidAccess) {
      onOpenPremiumModal();
      return;
    }

    const patientNameClean = fullNameInput.trim() || 'Patient';
    const cleanContact = patientContactInput.trim();
    const cleanCode =
      patientCodeInput.trim().toUpperCase() ||
      generateNextPatientCode(patientLogs);
    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    // Check if returning patient already exists by activeLoadedPatientId, Patient ID Code, or Mobile Number
    const existingIdx = patientLogs.findIndex((p) => {
      if (activeLoadedPatientId && p.id === activeLoadedPatientId) return true;
      if (
        cleanCode &&
        (p.patientCode || '').toUpperCase() === cleanCode.toUpperCase()
      ) {
        return true;
      }
      if (
        cleanContact.length >= 7 &&
        (p.patientContact || '').replace(/\s+/g, '') ===
          cleanContact.replace(/\s+/g, '')
      ) {
        return true;
      }
      return false;
    });

    const existingRecord = existingIdx >= 0 ? patientLogs[existingIdx] : null;
    const recordId = existingRecord ? existingRecord.id : `pat-${Date.now()}`;
    const finalPatientCode = existingRecord
      ? existingRecord.patientCode || cleanCode
      : cleanCode;

    const prevVisits: NutritionPatientVisitEntry[] =
      existingRecord?.visitHistory && existingRecord.visitHistory.length > 0
        ? existingRecord.visitHistory
        : existingRecord
        ? [
            {
              visitId: `v-${existingRecord.id}-1`,
              visitNumber: 1,
              visitDate: existingRecord.savedAt || formattedDate,
              visitIso: existingRecord.updatedAtIso || nowIso,
              weightKg: existingRecord.weightKg,
              targetWeightKg: existingRecord.targetWeightKg,
              bmi: existingRecord.bmi,
              bmiStatus: existingRecord.bmiStatus,
              bodyFatPct: existingRecord.bodyFatPct,
              leanBodyMassKg: existingRecord.leanBodyMassKg,
              dailyCaloriesNeeded: existingRecord.dailyCaloriesNeeded,
              healthCondition: existingRecord.healthCondition || '',
              prescriptionNotes: existingRecord.prescriptionNotes || ''
            }
          ]
        : [];

    const newVisitEntry: NutritionPatientVisitEntry = {
      visitId: `v-${Date.now()}`,
      visitNumber: prevVisits.length + 1,
      visitDate: formattedDate,
      visitIso: nowIso,
      weightKg: profile.weightKg,
      targetWeightKg: profile.targetWeightKg,
      bmi: indexes.bmi,
      bmiStatus: indexes.bmiStatus,
      bodyFatPct: clinicalReport.avgBodyFatPct,
      leanBodyMassKg: clinicalReport.leanBodyMassKg,
      dailyCaloriesNeeded: indexes.dailyCaloriesNeeded,
      healthCondition: activeCondition.trim(),
      prescriptionNotes: prescriptionNotesInput.trim()
    };

    const updatedVisitHistory = [...prevVisits, newVisitEntry].slice(-30);

    const newRecord: NutritionPatientRecord = {
      id: recordId,
      patientCode: finalPatientCode,
      patientName: patientNameClean,
      patientContact: cleanContact,
      age: profile.age,
      gender: profile.gender,
      heightCm: profile.heightCm,
      weightKg: profile.weightKg,
      targetWeightKg: profile.targetWeightKg,
      activityLevel: profile.activityLevel,
      goal: profile.goal,
      waterGlasses,
      ...(parsedOptionalTapeCm.waistCm
        ? { waistCm: parsedOptionalTapeCm.waistCm }
        : {}),
      ...(parsedOptionalTapeCm.hipCm
        ? { hipCm: parsedOptionalTapeCm.hipCm }
        : {}),
      ...(parsedOptionalTapeCm.neckCm
        ? { neckCm: parsedOptionalTapeCm.neckCm }
        : {}),
      ...(parsedOptionalTapeCm.wristCm
        ? { wristCm: parsedOptionalTapeCm.wristCm }
        : {}),
      healthCondition: activeCondition.trim(),
      prescriptionNotes: prescriptionNotesInput.trim(),
      bmi: indexes.bmi,
      bmiStatus: indexes.bmiStatus,
      bodyFatPct: clinicalReport.avgBodyFatPct,
      leanBodyMassKg: clinicalReport.leanBodyMassKg,
      dailyCaloriesNeeded: indexes.dailyCaloriesNeeded,
      savedAt: formattedDate,
      updatedAtIso: nowIso,
      visitHistory: updatedVisitHistory
    };

    let updatedPatients: NutritionPatientRecord[];
    if (existingIdx >= 0) {
      updatedPatients = patientLogs.map((p, idx) =>
        idx === existingIdx ? newRecord : p
      );
    } else {
      updatedPatients = [newRecord, ...patientLogs].slice(0, 150);
    }

    setPatientLogs(updatedPatients);
    setActiveLoadedPatientId(recordId);
    setPatientCodeInput(finalPatientCode);

    const updatedToolsData: UserToolsData = {
      ...toolsData,
      nutrition: {
        ...toolsData.nutrition,
        patientLogs: updatedPatients,
        updatedAt: nowIso
      }
    };

    try {
      await onSaveToolsData(updatedToolsData);
      if (user?.uid) {
        await setDoc(
          doc(db, 'users', user.uid, 'nutritionProfile', 'main'),
          {
            patientLogs: updatedPatients,
            updatedAt: nowIso
          },
          { merge: true }
        );
      }
    } catch {
      // Local state updates seamlessly
    }

    setSaveSuccessMsg(
      existingRecord
        ? `Returning Patient "${patientNameClean}" (${finalPatientCode}) updated — Visit #${newVisitEntry.visitNumber} added to Patient History!`
        : `New Patient "${patientNameClean}" saved with Unique ID ${finalPatientCode} (Visit #1 logged in Patients Directory)!`
    );
    setTimeout(() => setSaveSuccessMsg(null), 4500);
  };

  // Load any saved patient from the directory back into Tab 1 for Follow-Up / 2nd Visit
  const handleLoadPatientFromDirectory = (rec: NutritionPatientRecord) => {
    setActiveLoadedPatientId(rec.id);
    setPatientCodeInput(rec.patientCode || `FSP-PT-1001`);
    setFullNameInput(rec.patientName);
    setPatientContactInput(rec.patientContact || '');
    setAgeInput(String(rec.age));
    setGenderInput(rec.gender);
    setHeightUnit('cm');
    setHeightCmInput(String(rec.heightCm));
    setWeightKgInput(String(rec.weightKg));
    setTargetWeightKgInput(String(rec.targetWeightKg));
    setActivityLevel(
      (rec.activityLevel as ActivityLevelOption) || 'Moderately Active'
    );
    setGoal((rec.goal as GoalOption) || 'Lose Weight');
    setWaterGlasses(rec.waterGlasses || 8);
    setCircumferenceUnit('cm');
    setWaistInput(rec.waistCm ? String(rec.waistCm) : '');
    setHipInput(rec.hipCm ? String(rec.hipCm) : '');
    setNeckInput(rec.neckCm ? String(rec.neckCm) : '');
    setWristInput(rec.wristCm ? String(rec.wristCm) : '');
    setConditionQuery(rec.healthCondition || '');
    setActiveCondition(rec.healthCondition || '');
    setPrescriptionNotesInput(rec.prescriptionNotes || '');

    setActiveMainTab('assessment');
    setSaveSuccessMsg(
      `Loaded Returning Patient "${rec.patientName}" (ID: ${
        rec.patientCode || rec.id
      }) — Enter new weight/notes and click Save to log Visit #${
        (rec.visitHistory?.length || 1) + 1
      }!`
    );
    setTimeout(() => setSaveSuccessMsg(null), 4500);
    setTimeout(() => {
      step1Ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  // Quick Find Returning Patient in Step 1 by Mobile No. or Unique Patient ID
  const handleQuickLookupReturningPatient = () => {
    const q = quickLookupQuery.trim().toLowerCase();
    if (!q) return;
    const matched = patientLogs.find(
      (p) =>
        (p.patientCode || '').toLowerCase() === q ||
        (p.patientCode || '').toLowerCase().includes(q) ||
        (p.patientContact || '').replace(/\s+/g, '').includes(q.replace(/\s+/g, '')) ||
        p.patientName.toLowerCase().includes(q)
    );
    if (matched) {
      handleLoadPatientFromDirectory(matched);
      setQuickLookupQuery('');
    } else {
      setSaveSuccessMsg(
        `No saved patient found matching "${quickLookupQuery}". Check the Patients Directory tab.`
      );
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    }
  };

  // Clear form to log a brand-new patient
  const handleStartNewPatient = () => {
    const nextCode = generateNextPatientCode(patientLogs);
    setActiveLoadedPatientId(null);
    setPatientCodeInput(nextCode);
    setFullNameInput('');
    setPatientContactInput('');
    setAgeInput('28');
    setGenderInput('Male');
    setHeightUnit('cm');
    setHeightCmInput('170');
    setWeightKgInput('72');
    setTargetWeightKgInput('66');
    setWaistInput('');
    setHipInput('');
    setNeckInput('');
    setWristInput('');
    setConditionQuery('');
    setActiveCondition('');
    setPrescriptionNotesInput('');
    setSaveSuccessMsg(`Form cleared for New Patient (Assigned ID: ${nextCode}).`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  // Delete a patient record from the directory
  const handleDeletePatientRecord = async (recordId: string) => {
    const updatedPatients = patientLogs.filter((p) => p.id !== recordId);
    setPatientLogs(updatedPatients);
    if (activeLoadedPatientId === recordId) {
      setActiveLoadedPatientId(null);
    }

    const updatedToolsData: UserToolsData = {
      ...toolsData,
      nutrition: {
        ...toolsData.nutrition,
        patientLogs: updatedPatients,
        updatedAt: new Date().toISOString()
      }
    };

    try {
      await onSaveToolsData(updatedToolsData);
      if (user?.uid) {
        await setDoc(
          doc(db, 'users', user.uid, 'nutritionProfile', 'main'),
          {
            patientLogs: updatedPatients,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      }
    } catch {
      // Local state updates seamlessly
    }
  };

  // ==========================================================================
  // GENERATE & DOWNLOAD PDF REPORT (RESTRICTED TO PAID MEMBERS)
  // Includes Unique Patient ID, Mobile Number, Body Composition, Prescription & Visit History!
  // ==========================================================================
  const generatePdfForPersonOrPatient = (
    customPatient?: NutritionPatientRecord
  ) => {
    if (!hasFullPaidAccess) {
      onOpenPremiumModal();
      return;
    }

    const targetCode = customPatient
      ? customPatient.patientCode || 'FSP-PT-1001'
      : patientCodeInput.trim() || 'FSP-PT-1001';
    const targetName = customPatient
      ? customPatient.patientName
      : profile.fullName || user.name || 'Food Specialist';
    const targetContact = customPatient
      ? customPatient.patientContact || ''
      : patientContactInput.trim();
    const targetAge = customPatient ? customPatient.age : profile.age;
    const targetGender = customPatient ? customPatient.gender : profile.gender;
    const targetHeightCm = customPatient
      ? customPatient.heightCm
      : profile.heightCm;
    const targetWeightKg = customPatient
      ? customPatient.weightKg
      : profile.weightKg;
    const targetGoalWeightKg = customPatient
      ? customPatient.targetWeightKg
      : profile.targetWeightKg;
    const targetActivity = (customPatient
      ? customPatient.activityLevel
      : profile.activityLevel) as ActivityLevelOption;
    const targetGoal = (customPatient
      ? customPatient.goal
      : profile.goal) as GoalOption;
    const targetWater = customPatient
      ? customPatient.waterGlasses
      : waterGlasses;
    const rawCondition = (
      customPatient ? customPatient.healthCondition || '' : activeCondition
    ).trim();
    const targetCondition =
      rawCondition.toLowerCase() === 'general wellness' ? '' : rawCondition;
    const targetPrescription = customPatient
      ? customPatient.prescriptionNotes
      : prescriptionNotesInput.trim();
    const targetVisits = customPatient
      ? customPatient.visitHistory || []
      : activeLoadedPatient?.visitHistory || [];

    const calc = computeCompleteClinicalMetrics({
      age: targetAge,
      gender: targetGender,
      heightCm: targetHeightCm,
      weightKg: targetWeightKg,
      targetWeightKg: targetGoalWeightKg,
      activityLevel: targetActivity,
      goal: targetGoal,
      waterGlasses: targetWater,
      waistCmOptional: customPatient
        ? customPatient.waistCm
        : parsedOptionalTapeCm.waistCm,
      hipCmOptional: customPatient
        ? customPatient.hipCm
        : parsedOptionalTapeCm.hipCm,
      neckCmOptional: customPatient
        ? customPatient.neckCm
        : parsedOptionalTapeCm.neckCm,
      wristCmOptional: customPatient
        ? customPatient.wristCm
        : parsedOptionalTapeCm.wristCm
    });

    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();

    // Top Header Banner
    pdf.setFillColor(22, 115, 184);
    pdf.rect(0, 0, pageW, 42, 'F');

    // Left: Food Science Portal Logo
    drawPdfBrandLogo(pdf, 12, 8, 26, {
      borderColor: [255, 255, 255],
      bgFill: [255, 255, 255],
      roundedRadius: 3.5
    });

    // Right: User / Nutritionist Profile Picture
    drawPdfUserPhoto(
      pdf,
      user.profilePicUrl,
      user.name || targetName,
      pageW - 36,
      9,
      24,
      {
        borderColor: [220, 233, 246],
        fallbackBgColor: [16, 94, 154],
        fallbackTextColor: [255, 255, 255]
      }
    );

    const textX = 41;
    pdf.setTextColor(220, 233, 246);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.text(
      `Food Science Portal  •  Patient ID: ${targetCode}`,
      textX,
      12
    );

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(13);
    pdf.text('CLINICAL BODY COMPOSITION & NUTRITION REPORT', textX, 19);

    pdf.setFontSize(8.8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `Patient: ${targetName}${
        targetContact ? ` | Mobile: ${targetContact}` : ''
      } | Consultant: ${user.name || 'Specialist'} | Date: ${new Date().toLocaleDateString()}`,
      textX,
      26
    );
    pdf.text(
      `Age: ${targetAge} yrs | Gender: ${targetGender} | Height: ${targetHeightCm} cm | Weight: ${targetWeightKg} kg | Target: ${targetGoalWeightKg} kg`,
      textX,
      32.5
    );
    pdf.text(
      `Follow-Up Search Key: Use Patient ID "${targetCode}" or Mobile "${
        targetContact || 'N/A'
      }" on next visit`,
      textX,
      38.5
    );

    let y = 48;
    pdf.setTextColor(26, 33, 56);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10.5);
    pdf.text('1. BMI, WEIGHT GOAL & DAILY CALORIE SUMMARY', 14, y);
    y += 4.5;

    pdf.setFillColor(240, 246, 252);
    pdf.setDrawColor(187, 214, 238);
    pdf.roundedRect(14, y, pageW - 28, 23, 3, 3, 'FD');
    pdf.setFontSize(9);
    pdf.text(
      `BMI Score: ${calc.baseIndexes.bmi} kg/m2 (${calc.baseIndexes.bmiStatus})   |   Healthy Ideal Weight: ${calc.baseIndexes.idealWeightKg} kg   |   Health Score: ${calc.baseIndexes.healthScore}/100`,
      18,
      y + 6.5
    );
    pdf.text(
      `BMR (Resting Burn): ${calc.baseIndexes.bmrKcal} kcal/day   |   TDEE (Active Burn): ${calc.baseIndexes.tdeeKcal} kcal/day`,
      18,
      y + 13
    );
    pdf.text(
      `Daily Target: ${calc.baseIndexes.dailyCaloriesNeeded} kcal/day (Protein: ${calc.baseIndexes.targetProteinG}g | Carbs: ${calc.baseIndexes.targetCarbsG}g | Fat: ${calc.baseIndexes.targetFatG}g | Fiber: ${calc.targetFiberG}g)`,
      18,
      y + 19.5
    );

    y += 29;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10.5);
    pdf.text(
      '2. COMPLETE BODY COMPOSITION, METABOLIC & MICRONUTRIENT METRICS',
      14,
      y
    );
    y += 4.5;

    pdf.setFillColor(244, 248, 253);
    pdf.setDrawColor(210, 222, 234);
    pdf.roundedRect(14, y, pageW - 28, 39, 3, 3, 'FD');
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.6);
    pdf.text(
      `• Body Fat %: ${calc.avgBodyFatPct}% (${calc.bodyFatCategory})   |   Lean Muscle Mass (LBM): ${calc.leanBodyMassKg} kg   |   Fat Mass: ${calc.fatMassKg} kg   |   FFMI: ${calc.ffmi} kg/m2`,
      18,
      y + 6.5
    );
    pdf.text(
      `• Waist-to-Hip Ratio (WHR): ${calc.whr}   |   Waist-to-Height Ratio (WtHR): ${calc.wthr} (${calc.visceralRiskLabel})`,
      18,
      y + 12.8
    );
    pdf.text(
      `• Body Frame: ${calc.frameSize}   |   Ideal Weight Range (Devine / Robinson / Miller / Hamwi): ${calc.devineIbw} / ${calc.robinsonIbw} / ${calc.millerIbw} / ${calc.hamwiIbw} kg`,
      18,
      y + 19
    );
    pdf.text(
      `• Metabolic Age: ${calc.metabolicAge} yrs   |   Total Body Water (TBW): ${calc.tbwLiters} L (${calc.tbwPct}%)   |   Body Surface Area (BSA): ${calc.bsaM2} m2`,
      18,
      y + 25.2
    );
    pdf.text(
      `• Daily Water Target: ${calc.precisionWaterLiters} Liters (${calc.precisionWaterGlasses} glasses)   |   Max Free Sugar: <${calc.maxFreeSugarG}g/day   |   Max Sat. Fat: <${calc.maxSaturatedFatG}g/day`,
      18,
      y + 31.4
    );
    pdf.text(
      `• Daily Vitamins & Minerals RDA: Iron ${calc.rdaIronMg}mg | Calcium ${calc.rdaCalciumMg}mg | Vit D3 ${calc.rdaVitDIU} IU | Vit B12 ${calc.rdaVitB12Mcg}mcg | Zinc ${calc.rdaZincMg}mg | Folate ${calc.rdaFolateMcg}mcg`,
      18,
      y + 37.2
    );

    y += 45;

    let sectionNumber = 3;

    // 3. Nutritionist / Clinical Prescription Section (if provided)
    if (targetPrescription) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10.5);
      pdf.text(
        `${sectionNumber}. NUTRITIONIST PRESCRIPTION & CLINICAL DIET PLAN`,
        14,
        y
      );
      sectionNumber += 1;
      y += 4.5;

      const prescLines = pdf.splitTextToSize(targetPrescription, pageW - 36);
      const boxH = Math.min(42, Math.max(16, prescLines.length * 4.3 + 6));
      pdf.setFillColor(235, 244, 252);
      pdf.setDrawColor(22, 115, 184);
      pdf.roundedRect(14, y, pageW - 28, boxH, 3, 3, 'FD');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.8);
      pdf.text(prescLines.slice(0, 8), 18, y + 5.8);
      y += boxH + 5.5;
    }

    // 4. Patient Visit History Summary (if patient has recorded visits)
    if (targetVisits.length > 0 && y < 245) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10.5);
      pdf.text(
        `${sectionNumber}. PATIENT VISIT & FOLLOW-UP HISTORY (${targetVisits.length} VISITS)`,
        14,
        y
      );
      sectionNumber += 1;
      y += 4.5;

      const recentVisits = targetVisits.slice(-4);
      const histBoxH = recentVisits.length * 5.2 + 5;
      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(210, 222, 234);
      pdf.roundedRect(14, y, pageW - 28, histBoxH, 2.5, 2.5, 'FD');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.4);

      recentVisits.forEach((v, idx) => {
        pdf.text(
          `Visit #${v.visitNumber} (${v.visitDate}): Weight ${v.weightKg} kg | BMI ${v.bmi} (${v.bmiStatus}) | Body Fat ${v.bodyFatPct}% | Target ${v.dailyCaloriesNeeded} kcal${
            v.healthCondition ? ` | Focus: ${v.healthCondition}` : ''
          }`,
          18,
          y + 5 + idx * 5
        );
      });
      y += histBoxH + 5.5;
    }

    // 5. Condition Food Guide (ONLY included in PDF when user explicitly entered a health condition/issue!)
    if (targetCondition && y < 255) {
      const condRec = getHealthConditionRecommendations(targetCondition);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10.5);
      pdf.text(
        `${sectionNumber}. NUTRITION RECOMMENDATION FOR: ${targetCondition.toUpperCase()}`,
        14,
        y
      );
      y += 4.8;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.6);
      const summaryLines = pdf.splitTextToSize(
        condRec.summaryAdvice,
        pageW - 32
      );
      pdf.text(summaryLines, 16, y);
      y += summaryLines.length * 4 + 2;

      pdf.setFont('helvetica', 'bold');
      pdf.text('Recommended Foods:', 16, y);
      y += 4;
      pdf.setFont('helvetica', 'normal');
      condRec.recommendedFoods.forEach((f) => {
        if (y < 274) {
          pdf.text(`• ${f.name} — ${f.shortNote}`, 18, y);
          y += 4;
        }
      });

      y += 1.5;
      if (y < 276) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Foods to Avoid:', 16, y);
        y += 4;
        pdf.setFont('helvetica', 'normal');
        condRec.foodsToAvoid.forEach((f) => {
          if (y < 282) {
            pdf.text(`• ${f.name} — ${f.shortNote}`, 18, y);
            y += 4;
          }
        });
      }
    }

    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(DOCTOR_DISCLAIMER_BANNER, 14, 287);

    pdf.save(
      `${targetCode}_${targetName.replace(/\s+/g, '_')}_Nutrition_Report.pdf`
    );
  };

  // BMI Pointer position (0 to 100%)
  const bmiPointerPct = useMemo(() => {
    const clamped = Math.max(14, Math.min(38, indexes.bmi));
    return Math.round(((clamped - 14) / (38 - 14)) * 100);
  }, [indexes.bmi]);

  // ==========================================================================
  // TIER 1: FREE USER INTERFACE
  // Free users ONLY see Basic BMI Calculator + Daily Calorie Target, Protein, Carbs & Healthy Fats!
  // They cannot download PDFs or access the Hospital Patient Directory & Full Clinical Tool.
  // ==========================================================================
  if (!hasFullPaidAccess) {
    return (
      <div className="space-y-5 pb-8">
        {/* Free User Top Header */}
        <div className="bg-gradient-to-r from-[#1A2138] via-[#105E9A] to-[#1673B8] rounded-[24px] p-4 sm:p-5 text-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[#DCE9F6] text-[10.5px] font-extrabold uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5" />
                Basic BMI &amp; Daily Macro Calculator (Free Member View)
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold mt-1">
                Basic BMI Index &amp; Daily Calorie / Macro Calculator
              </h2>
              <p className="text-xs text-[#EBF4FC] mt-0.5">
                Calculate your Body Mass Index (BMI), Daily Calorie Target, Daily Protein, Daily Carbs &amp; Healthy Fats.
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenPremiumModal}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#1A2138] text-xs font-extrabold inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade for Full Clinical &amp; Hospital Patient Suite</span>
            </button>
          </div>
        </div>

        {/* Basic Body Details Input Card for Free Users */}
        <div className="bg-white border-[1.5px] border-[#D2DEEA] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-4">
          <div className="border-b border-[#E4EDF7] pb-3">
            <h3 className="text-sm sm:text-base font-extrabold text-[#1A2138]">
              Enter Your Basic Body Details
            </h3>
            <p className="text-[11px] text-[#5A6C84]">
              Your BMI Index, Daily Calorie Target, Protein, Carbs &amp; Healthy Fats update automatically below
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                Age (Years)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={ageInput}
                onChange={(e) =>
                  setAgeInput(e.target.value.replace(/[^0-9]/g, ''))
                }
                placeholder="e.g. 28"
                className="w-full px-3 py-2.5 rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs sm:text-sm font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                Gender
              </label>
              <select
                value={genderInput}
                onChange={(e) => setGenderInput(e.target.value as GenderOption)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs sm:text-sm font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-extrabold text-[#1A2138]">
                  Height ({heightUnit === 'cm' ? 'cm' : 'ft / in'})
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setHeightUnit((u) => (u === 'cm' ? 'feet' : 'cm'))
                  }
                  className="text-[10px] font-extrabold text-[#1673B8] underline cursor-pointer"
                >
                  Switch to {heightUnit === 'cm' ? 'Feet/Inches' : 'cm'}
                </button>
              </div>
              {heightUnit === 'cm' ? (
                <input
                  type="text"
                  inputMode="decimal"
                  value={heightCmInput}
                  onChange={(e) =>
                    setHeightCmInput(e.target.value.replace(/[^0-9.]/g, ''))
                  }
                  placeholder="e.g. 172"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs sm:text-sm font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                />
              ) : (
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={heightFeetInput}
                    onChange={(e) =>
                      setHeightFeetInput(e.target.value.replace(/[^0-9]/g, ''))
                    }
                    placeholder="Feet (5)"
                    className="w-full px-2.5 py-2.5 rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs font-bold text-[#1A2138]"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={heightInchesInput}
                    onChange={(e) =>
                      setHeightInchesInput(
                        e.target.value.replace(/[^0-9]/g, '')
                      )
                    }
                    placeholder="Inches (8)"
                    className="w-full px-2.5 py-2.5 rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs font-bold text-[#1A2138]"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                Current Weight (kg)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={weightKgInput}
                onChange={(e) =>
                  setWeightKgInput(e.target.value.replace(/[^0-9.]/g, ''))
                }
                placeholder="e.g. 74"
                className="w-full px-3 py-2.5 rounded-xl border-2 border-[#1673B8] bg-[#F0F6FC] text-xs sm:text-sm font-extrabold text-[#1A2138] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) =>
                  setActivityLevel(e.target.value as ActivityLevelOption)
                }
                className="w-full px-3 py-2.5 rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs sm:text-sm font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
              >
                <option value="Sedentary">Sedentary (Desk Job)</option>
                <option value="Lightly Active">Lightly Active (1–2 days/wk)</option>
                <option value="Moderately Active">Moderately Active (3–5 days/wk)</option>
                <option value="Very Active">Very Active (Daily Exercise)</option>
                <option value="Athlete">Athlete (Intense Training)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                Primary Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as GoalOption)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs sm:text-sm font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
              >
                <option value="Lose Weight">Lose Weight</option>
                <option value="Maintain Weight">Maintain Healthy Weight</option>
                <option value="Gain Weight">Gain Weight</option>
                <option value="Gain Muscle">Build Muscle</option>
              </select>
            </div>
          </div>
        </div>

        {/* Basic BMI Result & 4 Daily Macros Card for Free Users */}
        <div className="bg-white border-[1.5px] border-[#D2DEEA] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-4">
          <h3 className="text-sm sm:text-base font-extrabold text-[#1A2138] border-b border-[#E4EDF7] pb-2.5">
            Your Basic BMI Index &amp; Daily Macro Targets
          </h3>

          <div className="p-4 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#5A6C84] uppercase">
                  Your Body Mass Index (BMI)
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-extrabold text-[#1A2138]">
                    {indexes.bmi}
                  </span>
                  <span className="text-xs font-bold text-[#5A6C84]">kg/m²</span>
                </div>
              </div>
              <span
                className="px-3 py-1 rounded-full text-xs font-extrabold"
                style={{
                  backgroundColor: indexes.bmiBadgeBg,
                  color: indexes.bmiBadgeText
                }}
              >
                {indexes.bmiStatus}
              </span>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="relative h-3.5 w-full rounded-full overflow-hidden flex">
                <div className="w-1/4 bg-sky-400" />
                <div className="w-1/4 bg-[#1673B8]" />
                <div className="w-1/4 bg-amber-500" />
                <div className="w-1/4 bg-red-500" />
                <div
                  className="absolute top-0 bottom-0 w-1.5 bg-[#1A2138] border border-white rounded-full shadow-md"
                  style={{ left: `calc(${bmiPointerPct}% - 3px)` }}
                />
              </div>
              <div className="grid grid-cols-4 text-[10px] font-bold text-[#5A6C84] text-center">
                <span>Under (&lt;18.5)</span>
                <span className="text-[#1673B8] font-extrabold">
                  Normal (18.5–24.9)
                </span>
                <span>Over (25–29.9)</span>
                <span>Obese (30+)</span>
              </div>
            </div>
          </div>

          {/* ONLY 4 BASIC MACRO CARDS FOR FREE USERS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#EBF4FC] border border-[#BBD6EE]">
              <div className="text-[10.5px] font-bold text-[#105E9A] uppercase">
                Daily Calorie Target
              </div>
              <div className="text-xl font-extrabold text-[#1A2138] mt-1">
                {indexes.dailyCaloriesNeeded} kcal
              </div>
              <div className="text-[10px] font-bold text-[#1673B8]">
                For: {profile.goal}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA]">
              <div className="text-[10.5px] font-bold text-[#5A6C84] uppercase">
                Daily Protein
              </div>
              <div className="text-xl font-extrabold text-[#1A2138] mt-1">
                {indexes.targetProteinG} g
              </div>
              <div className="text-[10px] text-[#1673B8] font-bold">
                Muscle &amp; Repair
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA]">
              <div className="text-[10.5px] font-bold text-[#5A6C84] uppercase">
                Daily Carbs
              </div>
              <div className="text-xl font-extrabold text-[#1A2138] mt-1">
                {indexes.targetCarbsG} g
              </div>
              <div className="text-[10px] text-[#5A6C84] font-semibold">
                Daily Energy
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA]">
              <div className="text-[10.5px] font-bold text-[#5A6C84] uppercase">
                Healthy Fats
              </div>
              <div className="text-xl font-extrabold text-[#1A2138] mt-1">
                {indexes.targetFatG} g
              </div>
              <div className="text-[10px] text-[#5A6C84] font-semibold">
                Hormone Balance
              </div>
            </div>
          </div>
        </div>

        {/* Locked Paid Nutritionist & Hospital Patient Suite Upgrade Card */}
        <div className="bg-gradient-to-br from-[#1A2138] to-[#105E9A] rounded-[24px] p-5 sm:p-6 text-white shadow-md space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-[11px] font-extrabold uppercase">
                <Lock className="w-3.5 h-3.5" />
                Paid Member Exclusive • Full Clinical &amp; Hospital Nutritionist Suite
              </span>
              <h3 className="text-base sm:text-lg font-extrabold">
                Unlock Full Clinical Body Composition, Hospital Patient Directory &amp; PDF Reports
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                Free members only have access to Basic BMI &amp; Daily Macros. Upgrade to Paid Membership to unlock the complete Nutritionist &amp; Hospital Management Suite:
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenPremiumModal}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-[#1A2138] text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 shadow-md cursor-pointer shrink-0"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade to Paid Member</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-white/10 border border-white/15">
              <div className="font-extrabold text-amber-200">
                1. Hospital Patient Directory
              </div>
              <p className="text-[11px] text-blue-100 mt-0.5">
                Save unlimited patients with Unique Patient ID &amp; Mobile search, follow-up visit history, and Day / Week / Month logs.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/10 border border-white/15">
              <div className="font-extrabold text-amber-200">
                2. Full Clinical Body Factors
              </div>
              <p className="text-[11px] text-blue-100 mt-0.5">
                Body Fat %, Lean Muscle Mass, Visceral Risk (WHR/WtHR), Frame Size, Metabolic Age, TBW, BSA &amp; Daily Vitamin RDAs.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/10 border border-white/15">
              <div className="font-extrabold text-amber-200">
                3. Prescription &amp; PDF Reports
              </div>
              <p className="text-[11px] text-blue-100 mt-0.5">
                Write patient prescriptions, get Condition Food Guides, chat with the AI Dietitian, and download branded PDF Reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // TIER 2: PAID MEMBER FULL CLINICAL & HOSPITAL PATIENT SUITE (WITH 2 TABS)
  // ==========================================================================
  return (
    <div className="space-y-5 pb-8">
      {/* =====================================================================
          TOP HEADER BANNER + 2-TAB SWITCHER FOR PAID MEMBERS
         ===================================================================== */}
      <div className="bg-gradient-to-r from-[#1A2138] via-[#105E9A] to-[#1673B8] rounded-[24px] p-4 sm:p-5 text-white shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[#DCE9F6] text-[10.5px] font-extrabold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              Full Clinical Nutrition &amp; Hospital Patient Management Suite
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold mt-1">
              Clinical Body Composition, Patient Prescription &amp; Hospital Directory
            </h2>
            <p className="text-xs text-[#EBF4FC] mt-0.5">
              Use Tab 1 to enter patient details &amp; view their full visual report, or switch to Tab 2 to search returning patients by Mobile No. / Patient ID and manage Day, Week &amp; Month records.
            </p>
          </div>
        </div>

        {/* TWO MAIN TABS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-white/10 p-1.5 rounded-2xl border border-white/20">
          <button
            type="button"
            onClick={() => setActiveMainTab('assessment')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeMainTab === 'assessment'
                ? 'bg-white text-[#1A2138] shadow-sm'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Activity className="w-4 h-4 text-[#1673B8]" />
            <span>Tab 1: Patient Details &amp; Visual Report</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMainTab('directory')}
            className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeMainTab === 'directory'
                ? 'bg-white text-[#1A2138] shadow-sm'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4 text-[#1673B8]" />
            <span>
              Tab 2: Patients Directory &amp; History ({patientLogs.length})
            </span>
          </button>
        </div>
      </div>

      {/* SAVE CONFIRMATION BANNER */}
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-[#EBF4FC] border border-[#BBD6EE] text-[#1A2138] text-xs font-extrabold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#1673B8] shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessMsg(null)}
            className="text-xs font-bold underline cursor-pointer text-[#1673B8]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* =====================================================================
          TAB 1: PATIENT DETAILS, VISUAL FLOW, PRESCRIPTION & AI DIETITIAN
         ===================================================================== */}
      {activeMainTab === 'assessment' && (
        <div className="space-y-5">
          {/* STEP 1: UNIFIED PATIENT DETAILS, OPTIONAL TAPE & PRESCRIPTION */}
          <div
            ref={step1Ref}
            className="bg-white border-[1.5px] border-[#D2DEEA] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4EDF7] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EBF4FC] text-[#1673B8] flex items-center justify-center font-extrabold text-sm">
                  1
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-extrabold text-[#1A2138]">
                      Step 1: Enter Patient / Person Details &amp; Prescription
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EBF4FC] border border-[#BBD6EE] text-[#105E9A] text-[10.5px] font-extrabold">
                      Patient ID: {patientCodeInput}
                    </span>
                    {activeLoadedPatient && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10.5px] font-extrabold">
                        Returning Patient (Visit #
                        {(activeLoadedPatient.visitHistory?.length || 1) + 1})
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#5A6C84]">
                    Enter all details here once — if you leave any optional field blank, the full visual report below still generates automatically
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMainTab('directory')}
                  className="px-3 py-1.5 rounded-xl bg-[#F0F6FC] hover:bg-[#EBF4FC] border border-[#D2DEEA] text-[#1A2138] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-[#1673B8]" />
                  <span>Find Returning Patient</span>
                </button>
                <button
                  type="button"
                  onClick={handleStartNewPatient}
                  className="px-3 py-1.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Patient</span>
                </button>
              </div>
            </div>

            {/* Quick Returning Patient Lookup Bar (Search by Mobile No. or Report ID right inside Step 1) */}
            {patientLogs.length > 0 && (
              <div className="p-3 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="text-xs font-extrabold text-[#1A2138] flex items-center gap-1.5">
                  <History className="w-4 h-4 text-[#1673B8] shrink-0" />
                  <span>
                    Returning Patient? Enter Mobile No. or Report ID (e.g.{' '}
                    {patientLogs[0]?.patientCode || 'FSP-PT-1001'}) to load &amp; update their record:
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={quickLookupQuery}
                    onChange={(e) => setQuickLookupQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleQuickLookupReturningPatient();
                      }
                    }}
                    placeholder="Mobile No. or ID (e.g. FSP-PT-1001)"
                    className="px-3 py-1.5 rounded-xl border border-[#D2DEEA] bg-white text-xs font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                  />
                  <button
                    type="button"
                    onClick={handleQuickLookupReturningPatient}
                    className="px-3.5 py-1.5 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold cursor-pointer shrink-0"
                  >
                    Load Patient
                  </button>
                </div>
              </div>
            )}

            {/* Main Body Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              {/* Patient / Person Name */}
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Patient / Person Name
                </label>
                <input
                  type="text"
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  placeholder="Enter patient name"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs sm:text-sm font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                />
              </div>

              {/* Patient Mobile Number */}
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Patient Mobile Number
                </label>
                <input
                  type="text"
                  value={patientContactInput}
                  onChange={(e) => setPatientContactInput(e.target.value)}
                  placeholder="e.g. 0300-1234567"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs sm:text-sm font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                />
              </div>

              {/* Unique Patient ID / Report ID */}
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Unique Patient / Report ID
                </label>
                <input
                  type="text"
                  value={patientCodeInput}
                  onChange={(e) => setPatientCodeInput(e.target.value)}
                  placeholder="e.g. FSP-PT-1001"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D2DEEA] bg-[#EBF4FC] text-xs sm:text-sm font-extrabold text-[#105E9A] focus:outline-none focus:border-[#1673B8]"
                />
              </div>

              {/* Age (Years) */}
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Age (Years)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={ageInput}
                  onChange={(e) =>
                    setAgeInput(e.target.value.replace(/[^0-9]/g, ''))
                  }
                  placeholder="e.g. 28"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs sm:text-sm font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Gender
                </label>
                <select
                  value={genderInput}
                  onChange={(e) =>
                    setGenderInput(e.target.value as GenderOption)
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs sm:text-sm font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Height (cm or feet/inches) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-extrabold text-[#1A2138]">
                    Height ({heightUnit === 'cm' ? 'cm' : 'ft / in'})
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setHeightUnit((u) => (u === 'cm' ? 'feet' : 'cm'))
                    }
                    className="text-[10px] font-extrabold text-[#1673B8] underline cursor-pointer"
                  >
                    Switch to {heightUnit === 'cm' ? 'Feet/Inches' : 'cm'}
                  </button>
                </div>

                {heightUnit === 'cm' ? (
                  <input
                    type="text"
                    inputMode="decimal"
                    value={heightCmInput}
                    onChange={(e) =>
                      setHeightCmInput(e.target.value.replace(/[^0-9.]/g, ''))
                    }
                    placeholder="e.g. 172"
                    className="w-full px-3 py-2.5 rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs sm:text-sm font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={heightFeetInput}
                      onChange={(e) =>
                        setHeightFeetInput(
                          e.target.value.replace(/[^0-9]/g, '')
                        )
                      }
                      placeholder="Feet (5)"
                      className="w-full px-2.5 py-2.5 rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={heightInchesInput}
                      onChange={(e) =>
                        setHeightInchesInput(
                          e.target.value.replace(/[^0-9]/g, '')
                        )
                      }
                      placeholder="Inches (8)"
                      className="w-full px-2.5 py-2.5 rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                    />
                  </div>
                )}
              </div>

              {/* Current Weight (kg) */}
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Current Weight (kg)
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={weightKgInput}
                  onChange={(e) =>
                    setWeightKgInput(e.target.value.replace(/[^0-9.]/g, ''))
                  }
                  placeholder="e.g. 74"
                  className="w-full px-3 py-2.5 rounded-xl border-2 border-[#1673B8] bg-[#F0F6FC] text-xs sm:text-sm font-extrabold text-[#1A2138] focus:outline-none"
                />
              </div>

              {/* Target Weight (kg) */}
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Target Weight (kg){' '}
                  <span className="text-[10px] font-normal text-[#5A6C84]">
                    (Optional)
                  </span>
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={targetWeightKgInput}
                  onChange={(e) =>
                    setTargetWeightKgInput(
                      e.target.value.replace(/[^0-9.]/g, '')
                    )
                  }
                  placeholder="e.g. 68"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs sm:text-sm font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                />
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Activity Level
                </label>
                <select
                  value={activityLevel}
                  onChange={(e) =>
                    setActivityLevel(e.target.value as ActivityLevelOption)
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs sm:text-sm font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                >
                  <option value="Sedentary">Sedentary (Desk Job)</option>
                  <option value="Lightly Active">
                    Lightly Active (1–2 days/wk)
                  </option>
                  <option value="Moderately Active">
                    Moderately Active (3–5 days/wk)
                  </option>
                  <option value="Very Active">
                    Very Active (Daily Exercise)
                  </option>
                  <option value="Athlete">Athlete (Intense Training)</option>
                </select>
              </div>

              {/* Primary Goal */}
              <div>
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Primary Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value as GoalOption)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs sm:text-sm font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                >
                  <option value="Lose Weight">Lose Weight (Fat Loss)</option>
                  <option value="Maintain Weight">
                    Maintain Healthy Weight
                  </option>
                  <option value="Gain Weight">Gain Weight</option>
                  <option value="Gain Muscle">Build Muscle &amp; Strength</option>
                  <option value="Improve Health">
                    General Health &amp; Energy
                  </option>
                </select>
              </div>

              {/* Patient Health Condition / Focus (Optional) */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-extrabold text-[#1A2138] mb-1">
                  Health Condition / Clinical Issue (Optional)
                </label>
                <input
                  type="text"
                  value={conditionQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    setConditionQuery(val);
                    setActiveCondition(val.trim());
                  }}
                  placeholder="Leave blank if none, or type e.g. Diabetes, PCOS, High BP, Cholesterol"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs sm:text-sm font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                />
              </div>
            </div>

            {/* OPTIONAL BODY MEASUREMENTS IN STEP 1 (Safe to leave blank!) */}
            <div className="p-3.5 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA] space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-[#1673B8]" />
                  <span className="text-xs font-extrabold text-[#1A2138]">
                    Optional Body Measurements (Skip if not measured — Report calculates automatically)
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-[#D2DEEA]">
                  <span className="text-[10px] font-bold text-[#5A6C84] mr-1">
                    Unit:
                  </span>
                  <button
                    type="button"
                    onClick={() => setCircumferenceUnit('cm')}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-extrabold cursor-pointer ${
                      circumferenceUnit === 'cm'
                        ? 'bg-[#1673B8] text-white'
                        : 'text-[#1A2138]'
                    }`}
                  >
                    cm
                  </button>
                  <button
                    type="button"
                    onClick={() => setCircumferenceUnit('in')}
                    className={`px-2 py-0.5 rounded text-[10.5px] font-extrabold cursor-pointer ${
                      circumferenceUnit === 'in'
                        ? 'bg-[#1673B8] text-white'
                        : 'text-[#1A2138]'
                    }`}
                  >
                    inches
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10.5px] font-bold text-[#5A6C84] mb-1">
                    Waist ({circumferenceUnit}) — Optional
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={waistInput}
                    onChange={(e) =>
                      setWaistInput(e.target.value.replace(/[^0-9.]/g, ''))
                    }
                    placeholder="Optional"
                    className="w-full px-3 py-2 rounded-xl border border-[#D2DEEA] bg-white text-xs font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-[#5A6C84] mb-1">
                    Hip ({circumferenceUnit}) — Optional
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={hipInput}
                    onChange={(e) =>
                      setHipInput(e.target.value.replace(/[^0-9.]/g, ''))
                    }
                    placeholder="Optional"
                    className="w-full px-3 py-2 rounded-xl border border-[#D2DEEA] bg-white text-xs font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-[#5A6C84] mb-1">
                    Neck ({circumferenceUnit}) — Optional
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={neckInput}
                    onChange={(e) =>
                      setNeckInput(e.target.value.replace(/[^0-9.]/g, ''))
                    }
                    placeholder="Optional"
                    className="w-full px-3 py-2 rounded-xl border border-[#D2DEEA] bg-white text-xs font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                  />
                </div>

                <div>
                  <label className="block text-[10.5px] font-bold text-[#5A6C84] mb-1">
                    Wrist ({circumferenceUnit}) — Optional
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={wristInput}
                    onChange={(e) =>
                      setWristInput(e.target.value.replace(/[^0-9.]/g, ''))
                    }
                    placeholder="Optional"
                    className="w-full px-3 py-2 rounded-xl border border-[#D2DEEA] bg-white text-xs font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                  />
                </div>
              </div>
            </div>

            {/* Daily Water Tracker Row */}
            <div className="p-3.5 rounded-2xl bg-[#F0F6FC] border border-[#D2DEEA] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EBF4FC] text-[#1673B8] flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#1A2138]">
                    Daily Water Intake Tracker: {waterGlasses} /{' '}
                    {clinicalReport.precisionWaterGlasses} Glasses (
                    {waterGlasses * 250} ml)
                  </div>
                  <div className="text-[11px] text-[#5A6C84]">
                    Recommended for {profile.weightKg} kg body weight:{' '}
                    <strong>
                      {clinicalReport.precisionWaterLiters} Liters/day (
                      {clinicalReport.precisionWaterGlasses} glasses)
                    </strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWaterGlasses((w) => Math.max(0, w - 1))}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#D2DEEA] text-[#1A2138] text-xs font-extrabold cursor-pointer hover:bg-[#F4F8FD]"
                >
                  - 1 Glass
                </button>
                <button
                  type="button"
                  onClick={() => setWaterGlasses((w) => Math.min(20, w + 1))}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold cursor-pointer"
                >
                  + 1 Glass Water
                </button>
              </div>
            </div>

            {/* NUTRITIONIST PATIENT PRESCRIPTION & CLINICAL NOTES (Cleanly integrated — no "Paid Member" badge clutter) */}
            <div className="p-4 rounded-2xl bg-[#EBF4FC]/65 border border-[#BBD6EE] space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-[#1673B8]" />
                  <span className="text-xs sm:text-sm font-extrabold text-[#1A2138]">
                    Nutritionist Patient Prescription &amp; Clinical Notes
                  </span>
                </div>
                <span className="text-[10.5px] font-semibold text-[#5A6C84]">
                  Saved with patient visit history &amp; printed on PDF Report
                </span>
              </div>

              <textarea
                rows={3}
                value={prescriptionNotesInput}
                onChange={(e) => setPrescriptionNotesInput(e.target.value)}
                placeholder="Write prescribed diet plan, meal schedule, supplements, or clinical instructions for this patient (e.g. Morning: 1 cup Oats + Chia seeds; Lunch: 1 Barley Roti + Grilled Chicken + Salad; Follow-up in 14 days)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D2DEEA] bg-white text-xs sm:text-sm font-semibold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
              />
            </div>

            {/* Save Buttons Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleSavePatientRecord}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
              >
                <Users className="w-4 h-4 text-[#60A5FA]" />
                <span>
                  {activeLoadedPatient
                    ? `Update Patient (${patientCodeInput}) & Log Visit #${
                        (activeLoadedPatient.visitHistory?.length || 1) + 1
                      }`
                    : `Save Patient (${patientCodeInput}) to Directory`}
                </span>
              </button>

              <button
                type="button"
                onClick={handleSaveHealthTracker}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Save as My Personal Nutrition Profile</span>
              </button>
            </div>
          </div>

          {/* =====================================================================
              STEP 2: COMPLETE VISUAL BODY ASSESSMENT & CLINICAL NUTRITION REPORT
             ===================================================================== */}
          <div className="bg-white border-[1.5px] border-[#D2DEEA] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4EDF7] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EBF4FC] text-[#1673B8] flex items-center justify-center font-extrabold text-sm">
                  2
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-extrabold text-[#1A2138]">
                      Step 2: Visual Body Assessment &amp; Clinical Report for{' '}
                      <span className="text-[#1673B8]">{profile.fullName}</span>
                    </h3>
                    <span className="px-2 py-0.5 rounded-lg bg-[#F0F6FC] border border-[#D2DEEA] text-[10.5px] font-extrabold text-[#105E9A]">
                      ID: {patientCodeInput}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5A6C84]">
                    Live visual flow showing BMI, Weight Progress, Body Fat %, Lean Muscle, Visceral Risk, Ideal Weight &amp; Daily Vitamins
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => generatePdfForPersonOrPatient()}
                className="px-3.5 py-2 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>Download Patient PDF Report</span>
              </button>
            </div>

            {/* Returning Patient Visit History Progress Banner (if multiple visits exist) */}
            {activeLoadedPatient &&
              activeLoadedPatient.visitHistory &&
              activeLoadedPatient.visitHistory.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="font-extrabold text-emerald-950 flex items-center gap-2">
                    <History className="w-4 h-4 text-emerald-700" />
                    <span>
                      Patient Visit History ({activeLoadedPatient.patientCode}):{' '}
                      {activeLoadedPatient.visitHistory.length} Recorded Visit(s)
                      • 1st Visit Weight:{' '}
                      {activeLoadedPatient.visitHistory[0].weightKg} kg (BMI{' '}
                      {activeLoadedPatient.visitHistory[0].bmi}) → Current:{' '}
                      {profile.weightKg} kg (BMI {indexes.bmi})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedHistoryPatientId(activeLoadedPatient.id);
                      setActiveMainTab('directory');
                    }}
                    className="text-xs font-extrabold text-emerald-800 underline cursor-pointer"
                  >
                    View Full History in Tab 2
                  </button>
                </div>
              )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: BMI Gauge & Scale Bar */}
              <div className="p-4 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#5A6C84] uppercase">
                      Body Mass Index (BMI)
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-3xl font-extrabold text-[#1A2138]">
                        {indexes.bmi}
                      </span>
                      <span className="text-xs font-bold text-[#5A6C84]">
                        kg/m²
                      </span>
                    </div>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-extrabold"
                    style={{
                      backgroundColor: indexes.bmiBadgeBg,
                      color: indexes.bmiBadgeText
                    }}
                  >
                    {indexes.bmiStatus}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="relative h-3.5 w-full rounded-full overflow-hidden flex">
                    <div
                      className="w-1/4 bg-sky-400"
                      title="Underweight <18.5"
                    />
                    <div
                      className="w-1/4 bg-[#1673B8]"
                      title="Normal 18.5–24.9"
                    />
                    <div
                      className="w-1/4 bg-amber-500"
                      title="Overweight 25–29.9"
                    />
                    <div className="w-1/4 bg-red-500" title="Obese 30+" />
                    <div
                      className="absolute top-0 bottom-0 w-1.5 bg-[#1A2138] border border-white rounded-full shadow-md"
                      style={{ left: `calc(${bmiPointerPct}% - 3px)` }}
                    />
                  </div>
                  <div className="grid grid-cols-4 text-[10px] font-bold text-[#5A6C84] text-center">
                    <span>Under (&lt;18.5)</span>
                    <span className="text-[#1673B8] font-extrabold">
                      Normal (18.5–24.9)
                    </span>
                    <span>Over (25–29.9)</span>
                    <span>Obese (30+)</span>
                  </div>
                </div>

                <div
                  className={`p-3 rounded-xl border text-xs space-y-1 ${weightGuidance.badgeBg}`}
                >
                  <div className="font-extrabold flex items-center gap-1.5">
                    {weightGuidance.actionType === 'REDUCE WEIGHT' ? (
                      <TrendingDown className="w-4 h-4 shrink-0" />
                    ) : (
                      <TrendingUp className="w-4 h-4 shrink-0" />
                    )}
                    <span>{weightGuidance.headline}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed opacity-90">
                    {weightGuidance.detail}
                  </p>
                </div>
              </div>

              {/* Right: Visual Weight Progress & Goal Comparison Graph */}
              <div className="p-4 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA] space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#1A2138]">
                      Weight Progress &amp; Ideal Weight Comparison
                    </h4>
                    <p className="text-[11px] text-[#5A6C84]">
                      Current: <strong>{profile.weightKg} kg</strong> • Ideal
                      Weight: <strong>{indexes.idealWeightKg} kg</strong> •
                      Target: <strong>{profile.targetWeightKg} kg</strong>
                    </p>
                  </div>
                  <Scale className="w-5 h-5 text-[#1673B8]" />
                </div>

                <div className="space-y-2.5 my-auto py-1">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-[#1A2138]">Current Weight</span>
                      <span className="text-[#1A2138] font-extrabold">
                        {profile.weightKg} kg (BMI {indexes.bmi})
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#1A2138]"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((profile.weightKg / 120) * 100)
                          )}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-[#1673B8]">
                        Healthy Ideal Weight (For {profile.heightCm} cm)
                      </span>
                      <span className="text-[#1673B8] font-extrabold">
                        {indexes.idealWeightKg} kg (BMI 22.0)
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#1673B8]"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((indexes.idealWeightKg / 120) * 100)
                          )}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-amber-700">Target Weight</span>
                      <span className="text-amber-800 font-extrabold">
                        {profile.targetWeightKg} kg
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((profile.targetWeightKg / 120) * 100)
                          )}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-[#5A6C84] font-semibold pt-1 border-t border-[#D2DEEA] flex items-center justify-between">
                  <span>
                    Health Score: {indexes.healthScore}/100 (
                    {indexes.healthScoreLabel})
                  </span>
                  <span>Body Fat: {clinicalReport.avgBodyFatPct}%</span>
                </div>
              </div>
            </div>

            {/* Daily Calorie & Macro Targets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <div className="p-3 rounded-2xl bg-[#EBF4FC] border border-[#BBD6EE]">
                <div className="text-[10px] font-bold text-[#105E9A] uppercase">
                  Daily Calorie Target
                </div>
                <div className="text-lg font-extrabold text-[#1A2138] mt-0.5">
                  {indexes.dailyCaloriesNeeded} kcal
                </div>
                <div className="text-[10px] font-bold text-[#1673B8]">
                  Goal: {profile.goal}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA]">
                <div className="text-[10px] font-bold text-[#5A6C84] uppercase">
                  Daily Protein
                </div>
                <div className="text-lg font-extrabold text-[#1A2138] mt-0.5">
                  {indexes.targetProteinG} g
                </div>
                <div className="text-[10px] text-[#1673B8] font-bold">
                  Muscle &amp; Repair
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA]">
                <div className="text-[10px] font-bold text-[#5A6C84] uppercase">
                  Daily Carbs
                </div>
                <div className="text-lg font-extrabold text-[#1A2138] mt-0.5">
                  {indexes.targetCarbsG} g
                </div>
                <div className="text-[10px] text-[#5A6C84] font-semibold">
                  Daily Energy
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA]">
                <div className="text-[10px] font-bold text-[#5A6C84] uppercase">
                  Healthy Fats
                </div>
                <div className="text-lg font-extrabold text-[#1A2138] mt-0.5">
                  {indexes.targetFatG} g
                </div>
                <div className="text-[10px] text-[#5A6C84] font-semibold">
                  Hormone Balance
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA] col-span-2 sm:col-span-1">
                <div className="text-[10px] font-bold text-[#5A6C84] uppercase">
                  BMR / TDEE
                </div>
                <div className="text-sm font-extrabold text-[#1A2138] mt-1">
                  {indexes.bmrKcal} / {indexes.tdeeKcal} kcal
                </div>
                <div className="text-[10px] text-[#1673B8] font-bold">
                  Rest / Active Burn
                </div>
              </div>
            </div>

            {/* 6-CARD CLINICAL BODY COMPOSITION SUMMARY (BEYOND BMI) */}
            <div className="pt-2 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-xs sm:text-sm font-extrabold text-[#1A2138] flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#1673B8]" />
                  <span>
                    Detailed Body Composition &amp; Metabolic Factors (Beyond BMI)
                  </span>
                </h4>
                {clinicalReport.usedEstimatedTape && (
                  <span className="text-[10.5px] font-semibold text-[#5A6C84]">
                    Calculated automatically from Age, Gender, Height &amp; Weight
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* 1. Body Fat % */}
                <div className="p-3.5 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-extrabold text-[#105E9A] uppercase">
                      1. Body Fat Percentage
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${clinicalReport.bodyFatBadgeClass}`}
                    >
                      {clinicalReport.bodyFatCategory}
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-[#1A2138]">
                    {clinicalReport.avgBodyFatPct}%
                  </div>
                  <div className="text-[11px] text-[#5A6C84]">
                    Fat Weight: <strong>{clinicalReport.fatMassKg} kg</strong> of
                    total body weight
                  </div>
                </div>

                {/* 2. Lean Muscle Mass (LBM) & FFMI */}
                <div className="p-3.5 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-extrabold text-[#105E9A] uppercase">
                      2. Lean Muscle &amp; Bone Mass
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#EBF4FC] text-[#1673B8] text-[10px] font-extrabold">
                      FFMI: {clinicalReport.ffmi} kg/m²
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-[#1A2138]">
                    {clinicalReport.leanBodyMassKg} kg
                  </div>
                  <div className="text-[11px] text-[#5A6C84]">
                    Lean Tissue:{' '}
                    <strong>
                      {(100 - clinicalReport.avgBodyFatPct).toFixed(1)}%
                    </strong>{' '}
                    (Muscles, Bones &amp; Organs)
                  </div>
                </div>

                {/* 3. Belly Fat & Heart Risk (WHR & WtHR) */}
                <div className="p-3.5 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-extrabold text-[#105E9A] uppercase">
                      3. Waist &amp; Heart Risk
                    </span>
                    <ShieldAlert className="w-4 h-4 text-[#1673B8]" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-[#1A2138]">
                      WHR: {clinicalReport.whr}
                    </span>
                    <span className="text-xs text-[#5A6C84]">•</span>
                    <span className="text-xl font-extrabold text-[#1673B8]">
                      WtHR: {clinicalReport.wthr}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-lg text-[10.5px] font-extrabold border ${clinicalReport.visceralRiskBadge}`}
                    >
                      {clinicalReport.visceralRiskLabel}
                    </span>
                  </div>
                </div>

                {/* 4. Body Frame & Clinical Ideal Weight Range */}
                <div className="p-3.5 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-extrabold text-[#105E9A] uppercase">
                      4. Frame &amp; Ideal Weight Range
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#EBF4FC] text-[#105E9A] text-[10px] font-extrabold">
                      {clinicalReport.frameSize}
                    </span>
                  </div>
                  <div className="text-lg font-extrabold text-[#1A2138]">
                    {clinicalReport.devineIbw} – {clinicalReport.millerIbw} kg
                  </div>
                  <div className="text-[11px] text-[#5A6C84]">
                    Devine: {clinicalReport.devineIbw}kg • Robinson:{' '}
                    {clinicalReport.robinsonIbw}kg • AdjBW:{' '}
                    <strong>{clinicalReport.adjustedBodyWeightKg}kg</strong>
                  </div>
                </div>

                {/* 5. Metabolic Age & Multi-Formula BMR */}
                <div className="p-3.5 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-extrabold text-[#105E9A] uppercase">
                      5. Metabolic Age &amp; BMR
                    </span>
                    <Flame className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-[#1A2138]">
                    {clinicalReport.metabolicAge} Years{' '}
                    <span className="text-xs font-bold text-[#5A6C84]">
                      (Actual: {profile.age} yrs)
                    </span>
                  </div>
                  <div className="text-[11px] text-[#5A6C84]">
                    Mifflin BMR: <strong>{clinicalReport.mifflinBmr}</strong> •
                    Harris-Benedict:{' '}
                    <strong>{clinicalReport.harrisBenedictBmr}</strong> kcal
                  </div>
                </div>

                {/* 6. Total Body Water (TBW), BSA & Daily Water Target */}
                <div className="p-3.5 rounded-2xl bg-[#F4F8FD] border border-[#D2DEEA] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-extrabold text-[#105E9A] uppercase">
                      6. Body Water (TBW) &amp; BSA
                    </span>
                    <Droplets className="w-4 h-4 text-[#1673B8]" />
                  </div>
                  <div className="text-xl font-extrabold text-[#1A2138]">
                    {clinicalReport.tbwLiters} L ({clinicalReport.tbwPct}%){' '}
                    <span className="text-xs font-bold text-[#1673B8]">
                      • BSA: {clinicalReport.bsaM2} m²
                    </span>
                  </div>
                  <div className="text-[11px] text-[#5A6C84]">
                    Daily Water Need:{' '}
                    <strong>
                      {clinicalReport.precisionWaterLiters} L (
                      {clinicalReport.precisionWaterGlasses} glasses/day)
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Fiber, Sugar Limit & Essential Vitamins / Minerals RDA Row */}
            <div className="p-3.5 rounded-2xl bg-[#EBF4FC]/60 border border-[#BBD6EE] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#1A2138] flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#1673B8]" />
                  <span>
                    Daily Fiber, Sugar Limit &amp; Essential Vitamins / Minerals Target (For Age {profile.age}, {profile.gender})
                  </span>
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-9 gap-2 text-center">
                <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                  <div className="text-[9.5px] font-bold text-[#5A6C84] uppercase">
                    Fiber
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-emerald-700">
                    {clinicalReport.targetFiberG} g/d
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                  <div className="text-[9.5px] font-bold text-[#5A6C84] uppercase">
                    Max Sugar
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-red-700">
                    &lt;{clinicalReport.maxFreeSugarG} g/d
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                  <div className="text-[9.5px] font-bold text-[#5A6C84] uppercase">
                    Sat. Fat
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-amber-700">
                    &lt;{clinicalReport.maxSaturatedFatG} g/d
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                  <div className="text-[9.5px] font-bold text-[#5A6C84] uppercase">
                    Iron
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-[#1A2138]">
                    {clinicalReport.rdaIronMg} mg
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                  <div className="text-[9.5px] font-bold text-[#5A6C84] uppercase">
                    Calcium
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-[#1A2138]">
                    {clinicalReport.rdaCalciumMg} mg
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                  <div className="text-[9.5px] font-bold text-[#5A6C84] uppercase">
                    Vit D3
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-[#1A2138]">
                    {clinicalReport.rdaVitDIU} IU
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                  <div className="text-[9.5px] font-bold text-[#5A6C84] uppercase">
                    Vit B12
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-[#1A2138]">
                    {clinicalReport.rdaVitB12Mcg} mcg
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                  <div className="text-[9.5px] font-bold text-[#5A6C84] uppercase">
                    Zinc
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-[#1A2138]">
                    {clinicalReport.rdaZincMg} mg
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white border border-[#D2DEEA]">
                  <div className="text-[9.5px] font-bold text-[#5A6C84] uppercase">
                    Folate
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-[#1A2138]">
                    {clinicalReport.rdaFolateMcg} mcg
                  </div>
                </div>
              </div>
            </div>

            {/* Display Active Prescription Box in Report if Entered */}
            {prescriptionNotesInput.trim() && (
              <div className="p-4 rounded-2xl bg-[#EBF4FC] border-2 border-[#1673B8] space-y-1.5">
                <div className="text-xs font-extrabold text-[#105E9A] uppercase flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#1673B8]" />
                  <span>
                    Prescribed Diet &amp; Clinical Notes for {profile.fullName}{' '}
                    ({patientCodeInput})
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#1A2138] whitespace-pre-line leading-relaxed">
                  {prescriptionNotesInput}
                </p>
              </div>
            )}
          </div>

          {/* =====================================================================
              STEP 3: NUTRITION RECOMMENDATION (ONLY SHOWS WHEN CONDITION ENTERED)
             ===================================================================== */}
          <div className="bg-white border-[1.5px] border-[#D2DEEA] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4EDF7] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EBF4FC] text-[#1673B8] flex items-center justify-center font-extrabold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#1A2138]">
                    Nutrition Recommendation
                  </h3>
                  <p className="text-[11px] text-[#5A6C84]">
                    Enter any health issue below only if you want Condition-Specific Recommended Foods &amp; Foods to Avoid
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-[#5A6C84] absolute left-3.5" />
                <input
                  type="text"
                  value={conditionQuery}
                  onChange={(e) => {
                    const val = e.target.value;
                    setConditionQuery(val);
                    setActiveCondition(val.trim());
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setActiveCondition(conditionQuery.trim());
                    }
                  }}
                  placeholder="Enter a health issue here (e.g. Diabetes, High BP, Cholesterol, PCOS, Acidity) to view & include in PDF..."
                  className="w-full pl-10 pr-10 py-3 rounded-2xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs sm:text-sm font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
                />
                {conditionQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setConditionQuery('');
                      setActiveCondition('');
                    }}
                    className="absolute right-3.5 text-[#5A6C84] hover:text-[#1A2138] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                {[
                  'Diabetes',
                  'High Blood Pressure',
                  'Cholesterol',
                  'PCOS',
                  'Thyroid',
                  'Heart Disease',
                  'Acidity',
                  'Anemia'
                ].map((cond) => (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => {
                      if (
                        activeCondition.toLowerCase() === cond.toLowerCase()
                      ) {
                        setConditionQuery('');
                        setActiveCondition('');
                      } else {
                        setConditionQuery(cond);
                        setActiveCondition(cond);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-[11px] font-extrabold cursor-pointer transition-colors ${
                      activeCondition.toLowerCase() === cond.toLowerCase()
                        ? 'bg-[#1673B8] text-white'
                        : 'bg-[#F0F6FC] text-[#1A2138] border border-[#D2DEEA] hover:border-[#1673B8]'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            {activeCondition.trim() ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="px-3 py-1 rounded-full bg-[#EBF4FC] text-[#105E9A] text-[11px] font-extrabold inline-flex items-center gap-1">
                    <span>
                      Personalized for {conditionRecommendation.conditionName}
                    </span>
                    <Sparkles className="w-3 h-3 text-[#1673B8]" />
                  </span>
                  <span className="text-[11px] font-semibold text-[#5A6C84]">
                    {conditionRecommendation.updatedLabel}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm sm:text-base font-extrabold text-[#1A2138] flex items-center gap-1.5">
                    <span>Personalized Recommendation</span>
                    <Sparkles className="w-4 h-4 text-[#1673B8]" />
                  </h4>
                  <div className="p-4 rounded-2xl bg-[#EBF4FC] border border-[#BBD6EE] text-xs sm:text-sm font-semibold text-[#1A2138] leading-relaxed">
                    {conditionRecommendation.summaryAdvice}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-sm sm:text-base font-extrabold text-[#1A2138] flex items-center gap-1.5">
                    <span>Recommended Foods</span>
                    <Leaf className="w-4 h-4 text-[#1673B8]" />
                  </h4>
                  <div className="space-y-2.5">
                    {conditionRecommendation.recommendedFoods.map((f) => (
                      <div
                        key={f.name}
                        className="p-3.5 rounded-2xl bg-[#EBF4FC] border border-[#BBD6EE] flex items-start gap-3"
                      >
                        <ConditionFoodIcon
                          iconType={f.iconType}
                          isRecommended={true}
                        />
                        <div className="space-y-0.5">
                          <div className="text-sm sm:text-base font-extrabold text-[#1A2138]">
                            {f.name}
                          </div>
                          <div className="text-xs font-bold text-[#105E9A]">
                            • {f.shortNote}
                          </div>
                          <div className="text-[11px] text-[#5A6C84] flex items-center gap-1 pt-0.5">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span>{DOCTOR_DISCLAIMER_SHORT}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-sm sm:text-base font-extrabold text-[#1A2138] flex items-center gap-1.5">
                    <span>Foods to Avoid</span>
                    <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                  </h4>
                  <div className="space-y-2.5">
                    {conditionRecommendation.foodsToAvoid.map((f) => (
                      <div
                        key={f.name}
                        className="p-3.5 rounded-2xl bg-[#FECACA]/85 border border-[#F87171] flex items-start gap-3"
                      >
                        <ConditionFoodIcon
                          iconType={f.iconType}
                          isRecommended={false}
                        />
                        <div className="space-y-0.5">
                          <div className="text-sm sm:text-base font-extrabold text-[#7F1D1D]">
                            {f.name}
                          </div>
                          <div className="text-xs font-bold text-[#991B1B]">
                            • {f.shortNote}
                          </div>
                          <div className="text-[11px] text-[#991B1B]/90 flex items-center gap-1 pt-0.5">
                            <Info className="w-3.5 h-3.5 shrink-0" />
                            <span>{DOCTOR_DISCLAIMER_SHORT}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-[#F4F8FD] border border-dashed border-[#D2DEEA] text-center space-y-1">
                <div className="text-xs sm:text-sm font-extrabold text-[#1A2138]">
                  No Health Condition or Issue Entered
                </div>
                <p className="text-[11px] text-[#5A6C84]">
                  Type any health issue in the box above (or click a condition tag) only if you want{' '}
                  <strong>Recommended Foods</strong> &amp;{' '}
                  <strong>Foods to Avoid</strong> shown here and included in your PDF report.
                </p>
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-[#EBF4FC] border border-[#BBD6EE] text-xs font-bold text-[#1A2138] flex items-center gap-2.5">
              <span className="text-base font-extrabold text-[#1673B8]">➕</span>
              <span>{DOCTOR_DISCLAIMER_BANNER}</span>
            </div>

            <button
              type="button"
              onClick={() =>
                chatSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
              }
              className="w-full py-3.5 px-5 rounded-2xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-sm sm:text-base font-extrabold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
            >
              <Sparkles className="w-5 h-5 text-blue-100" />
              <span>AI Dietitian — Chat</span>
            </button>
          </div>

          {/* =====================================================================
              STEP 4: AI DIETITIAN CHATBOT WITH "CLEAR CHAT" OPTION
             ===================================================================== */}
          <div
            ref={chatSectionRef}
            className="bg-white border-[1.5px] border-[#D2DEEA] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4EDF7] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#1673B8] text-white flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#1A2138] flex items-center gap-1.5">
                    <span>AI Dietitian — Chat</span>
                    <Sparkles className="w-4 h-4 text-[#1673B8]" />
                  </h3>
                  <p className="text-[11px] text-[#5A6C84]">
                    Enter any nutrition issue or question below to get an instant answer
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClearChat}
                className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Chat</span>
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {[
                'Diabetes diet plan',
                'High Blood Pressure (BP)',
                'Cholesterol & Fatty Liver',
                'Acidity, Gas & Stomach',
                'Weight Loss Plan',
                'Weight Gain Plan',
                'PCOS Diet',
                'Uric Acid Issue',
                'Anemia / Iron Deficiency',
                'Can I eat Biryani?'
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSendChatMessage(chip)}
                  className="px-3 py-1.5 rounded-full bg-[#F0F6FC] hover:bg-[#EBF4FC] border border-[#D2DEEA] text-[#1A2138] text-[11px] font-extrabold whitespace-nowrap cursor-pointer transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="bg-[#F4F8FD] border border-[#D2DEEA] rounded-2xl p-3.5 sm:p-4 space-y-3 max-h-96 overflow-y-auto">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-3.5 space-y-1.5 ${
                      msg.sender === 'user'
                        ? 'bg-[#1673B8] text-white'
                        : 'bg-white border border-[#D2DEEA] text-[#1A2138] shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] font-bold opacity-80">
                      <span className="inline-flex items-center gap-1">
                        {msg.sender === 'user' ? (
                          <>
                            <User className="w-3 h-3" />
                            <span>{profile.fullName}</span>
                          </>
                        ) : (
                          <>
                            <Bot className="w-3.5 h-3.5 text-[#1673B8]" />
                            <span className="text-[#1673B8] font-extrabold">
                              AI Dietitian
                            </span>
                          </>
                        )}
                      </span>
                      <span>{msg.time}</span>
                    </div>

                    <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-medium">
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendChatMessage();
                  }
                }}
                placeholder="Type your nutrition issue or question here (e.g. Diabetes, Acidity, Weight Loss, BP)..."
                className="flex-1 px-4 py-3 rounded-2xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs sm:text-sm font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
              />
              <button
                type="button"
                onClick={() => handleSendChatMessage()}
                className="px-4 sm:px-5 py-3 rounded-2xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs sm:text-sm font-extrabold inline-flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
              {chatMessages.length > 1 && (
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Clear Chat"
                  className="px-3 py-3 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* BOTTOM REPORT DOWNLOAD SECTION */}
          <div className="bg-white border-[1.5px] border-[#D2DEEA] rounded-[24px] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-[#1A2138]">
                Download Complete Clinical Nutrition &amp; Prescription Report (PDF)
              </h4>
              <p className="text-[11px] sm:text-xs text-[#5A6C84]">
                Includes Unique Patient ID ({patientCodeInput}), Mobile No., BMI, Body Fat %, Lean Mass, Vitamins &amp; Prescription.
              </p>
            </div>

            <button
              type="button"
              onClick={() => generatePdfForPersonOrPatient()}
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs sm:text-sm font-extrabold inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors shrink-0"
            >
              <Download className="w-4 h-4 text-[#60A5FA]" />
              <span>Download Full Nutrition Report (PDF)</span>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: HOSPITAL-STYLE PATIENTS DIRECTORY & VISIT HISTORY
          (Search by Mobile No. or Unique Patient ID • Day, Week & Month Wise)
         ===================================================================== */}
      {activeMainTab === 'directory' && (
        <div className="space-y-5">
          <div className="bg-white border-[1.5px] border-[#D2DEEA] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E4EDF7] pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1A2138] text-white flex items-center justify-center font-extrabold text-sm shrink-0">
                  <Users className="w-5 h-5 text-[#60A5FA]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#1A2138]">
                    Hospital Patients Directory &amp; Follow-Up History Log
                  </h3>
                  <p className="text-[11px] text-[#5A6C84]">
                    Search any returning patient by Mobile Number, Unique Report ID (e.g. FSP-PT-1001), or Name — organized Day-wise, Week-wise &amp; Month-wise
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  handleStartNewPatient();
                  setActiveMainTab('assessment');
                }}
                className="px-4 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Patient in Tab 1</span>
              </button>
            </div>

            {/* Day-wise, Week-wise, Month-wise & All Filter Tabs + Summary Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => setDirectoryTimeFilter('all')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  directoryTimeFilter === 'all'
                    ? 'bg-[#1A2138] text-white border-[#1A2138]'
                    : 'bg-[#F4F8FD] text-[#1A2138] border-[#D2DEEA] hover:border-[#1673B8]'
                }`}
              >
                <div className="text-[10.5px] font-bold uppercase opacity-80 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>All Patients</span>
                </div>
                <div className="text-xl font-extrabold mt-0.5">
                  {directoryStatsAndFiltered.totalCount}
                </div>
                <div className="text-[10px] opacity-80">Total Directory</div>
              </button>

              <button
                type="button"
                onClick={() => setDirectoryTimeFilter('day')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  directoryTimeFilter === 'day'
                    ? 'bg-[#1673B8] text-white border-[#1673B8]'
                    : 'bg-[#F4F8FD] text-[#1A2138] border-[#D2DEEA] hover:border-[#1673B8]'
                }`}
              >
                <div className="text-[10.5px] font-bold uppercase opacity-80 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Day-Wise (Today)</span>
                </div>
                <div className="text-xl font-extrabold mt-0.5">
                  {directoryStatsAndFiltered.dayCount}
                </div>
                <div className="text-[10px] opacity-80">Logged Today</div>
              </button>

              <button
                type="button"
                onClick={() => setDirectoryTimeFilter('week')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  directoryTimeFilter === 'week'
                    ? 'bg-[#1673B8] text-white border-[#1673B8]'
                    : 'bg-[#F4F8FD] text-[#1A2138] border-[#D2DEEA] hover:border-[#1673B8]'
                }`}
              >
                <div className="text-[10.5px] font-bold uppercase opacity-80 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Week-Wise (7 Days)</span>
                </div>
                <div className="text-xl font-extrabold mt-0.5">
                  {directoryStatsAndFiltered.weekCount}
                </div>
                <div className="text-[10px] opacity-80">Last 7 Days</div>
              </button>

              <button
                type="button"
                onClick={() => setDirectoryTimeFilter('month')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  directoryTimeFilter === 'month'
                    ? 'bg-[#1673B8] text-white border-[#1673B8]'
                    : 'bg-[#F4F8FD] text-[#1A2138] border-[#D2DEEA] hover:border-[#1673B8]'
                }`}
              >
                <div className="text-[10.5px] font-bold uppercase opacity-80 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Month-Wise (30 Days)</span>
                </div>
                <div className="text-xl font-extrabold mt-0.5">
                  {directoryStatsAndFiltered.monthCount}
                </div>
                <div className="text-[10px] opacity-80">Last 30 Days</div>
              </button>
            </div>

            {/* Search Bar by Unique Patient ID, Mobile Number, or Name */}
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#5A6C84] absolute left-3.5" />
              <input
                type="text"
                value={patientSearchQuery}
                onChange={(e) => setPatientSearchQuery(e.target.value)}
                placeholder="Search returning patient by Unique ID (e.g. FSP-PT-1001), Mobile No. (e.g. 0300...), Patient Name, or Condition..."
                className="w-full pl-10 pr-10 py-3 rounded-2xl border border-[#D2DEEA] bg-[#F4F8FD] text-xs sm:text-sm font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
              />
              {patientSearchQuery && (
                <button
                  type="button"
                  onClick={() => setPatientSearchQuery('')}
                  className="absolute right-3.5 text-[#5A6C84] hover:text-[#1A2138] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Patient Directory Records List */}
            {directoryStatsAndFiltered.filtered.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#F4F8FD] border border-dashed border-[#D2DEEA] text-center space-y-2">
                <div className="text-sm font-extrabold text-[#1A2138]">
                  {patientLogs.length === 0
                    ? 'No Patients Logged in Your Directory Yet'
                    : 'No Matching Patient Found for This Filter'}
                </div>
                <p className="text-xs text-[#5A6C84] max-w-lg mx-auto">
                  Switch to <strong>Tab 1: Patient Details &amp; Visual Report</strong>, enter your patient&apos;s details, mobile number, and prescription, and click{' '}
                  <strong>&ldquo;Save Patient to Directory&rdquo;</strong>.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {directoryStatsAndFiltered.filtered.map((pat) => {
                  const visits = pat.visitHistory || [];
                  const firstVisit = visits.length > 0 ? visits[0] : null;
                  const weightDiff =
                    firstVisit && visits.length > 1
                      ? Number((pat.weightKg - firstVisit.weightKg).toFixed(1))
                      : null;
                  const isHistoryOpen = expandedHistoryPatientId === pat.id;

                  return (
                    <div
                      key={pat.id}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${
                        activeLoadedPatientId === pat.id
                          ? 'bg-[#EBF4FC]/70 border-2 border-[#1673B8]'
                          : 'bg-[#F4F8FD] border-[#D2DEEA]'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Unique Patient ID Badge */}
                            <span className="px-2.5 py-0.5 rounded-lg bg-[#1A2138] text-white text-[11px] font-extrabold inline-flex items-center gap-1">
                              <Hash className="w-3 h-3 text-[#60A5FA]" />
                              <span>{pat.patientCode || 'FSP-PT-1001'}</span>
                            </span>

                            <span className="text-sm sm:text-base font-extrabold text-[#1A2138]">
                              {pat.patientName}
                            </span>

                            {pat.patientContact && (
                              <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#D2DEEA] text-[11px] font-bold text-[#105E9A] inline-flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                <span>{pat.patientContact}</span>
                              </span>
                            )}

                            <span className="px-2.5 py-0.5 rounded-full bg-[#EBF4FC] border border-[#BBD6EE] text-[10.5px] font-extrabold text-[#1673B8]">
                              {visits.length || 1} Visit
                              {(visits.length || 1) > 1 ? 's' : ''} Logged
                            </span>

                            <span className="text-[11px] font-semibold text-[#5A6C84]">
                              • Last Updated: {pat.savedAt}
                            </span>
                          </div>

                          <div className="text-xs text-[#1A2138] font-semibold flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span>
                              Age: <strong>{pat.age}y</strong> ({pat.gender})
                            </span>
                            <span>•</span>
                            <span>
                              Height: <strong>{pat.heightCm} cm</strong>
                            </span>
                            <span>•</span>
                            <span>
                              Latest Weight: <strong>{pat.weightKg} kg</strong>{' '}
                              (Target: {pat.targetWeightKg} kg)
                            </span>
                            {weightDiff !== null && (
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10.5px] font-extrabold ${
                                  weightDiff <= 0
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {weightDiff > 0
                                  ? `+${weightDiff} kg`
                                  : `${weightDiff} kg`}{' '}
                                since Visit #1
                              </span>
                            )}
                            <span>•</span>
                            <span>
                              BMI:{' '}
                              <strong className="text-[#1673B8]">
                                {pat.bmi} ({pat.bmiStatus})
                              </strong>
                            </span>
                            <span>•</span>
                            <span>
                              Body Fat: <strong>{pat.bodyFatPct}%</strong>
                            </span>
                            {pat.healthCondition && (
                              <>
                                <span>•</span>
                                <span className="text-[#105E9A] font-extrabold">
                                  Issue: {pat.healthCondition}
                                </span>
                              </>
                            )}
                          </div>

                          {pat.prescriptionNotes && (
                            <div className="text-xs text-[#1A2138] bg-white px-3 py-2 rounded-xl border border-[#D2DEEA]">
                              <strong className="text-[#1673B8]">
                                Latest Prescription:
                              </strong>{' '}
                              {pat.prescriptionNotes}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleLoadPatientFromDirectory(pat)}
                            className="px-3.5 py-2 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Follow-Up / Update in Tab 1</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setExpandedHistoryPatientId((prev) =>
                                prev === pat.id ? null : pat.id
                              )
                            }
                            className="px-3 py-2 rounded-xl bg-white hover:bg-[#EBF4FC] border border-[#D2DEEA] text-[#1A2138] text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <History className="w-3.5 h-3.5 text-[#1673B8]" />
                            <span>
                              {isHistoryOpen
                                ? 'Hide History'
                                : `Visit History (${visits.length || 1})`}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => generatePdfForPersonOrPatient(pat)}
                            className="px-3 py-2 rounded-xl bg-[#1A2138] hover:bg-[#1673B8] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            <Download className="w-3.5 h-3.5 text-[#60A5FA]" />
                            <span>Download PDF</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeletePatientRecord(pat.id)}
                            title="Delete Patient Record"
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* EXPANDABLE CHRONOLOGICAL VISIT HISTORY TIMELINE */}
                      {isHistoryOpen && visits.length > 0 && (
                        <div className="pt-3 border-t border-[#D2DEEA] space-y-2">
                          <div className="text-xs font-extrabold text-[#105E9A] flex items-center gap-1.5">
                            <History className="w-4 h-4 text-[#1673B8]" />
                            <span>
                              Complete Visit-by-Visit History for{' '}
                              {pat.patientName} ({pat.patientCode})
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-2">
                            {visits.map((v) => (
                              <div
                                key={v.visitId}
                                className="p-3 rounded-xl bg-white border border-[#D2DEEA] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                              >
                                <div className="space-y-0.5">
                                  <div className="font-extrabold text-[#1A2138] flex items-center gap-2 flex-wrap">
                                    <span className="px-2 py-0.5 rounded bg-[#EBF4FC] text-[#1673B8] text-[10.5px]">
                                      Visit #{v.visitNumber}
                                    </span>
                                    <span>Date: {v.visitDate}</span>
                                    <span>•</span>
                                    <span>
                                      Weight: <strong>{v.weightKg} kg</strong>
                                    </span>
                                    <span>•</span>
                                    <span>
                                      BMI:{' '}
                                      <strong>
                                        {v.bmi} ({v.bmiStatus})
                                      </strong>
                                    </span>
                                    <span>•</span>
                                    <span>Body Fat: {v.bodyFatPct}%</span>
                                    <span>•</span>
                                    <span>
                                      Target: {v.dailyCaloriesNeeded} kcal/day
                                    </span>
                                  </div>
                                  {(v.healthCondition ||
                                    v.prescriptionNotes) && (
                                    <div className="text-[11px] text-[#5A6C84] pt-0.5">
                                      {v.healthCondition && (
                                        <span className="mr-3">
                                          <strong>Condition:</strong>{' '}
                                          {v.healthCondition}
                                        </span>
                                      )}
                                      {v.prescriptionNotes && (
                                        <span>
                                          <strong>Prescription:</strong>{' '}
                                          {v.prescriptionNotes}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

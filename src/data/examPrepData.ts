import {
  ExamMcqItem,
  ExamPrepSet,
  EXAM_SETS_1_TO_3
} from './examPrepSets1To3';
import { EXAM_SETS_4_TO_5 } from './examPrepSets4To5';
import {
  DailyMealPlanItem,
  NutritionProfileData,
  UserToolsData
} from '../types/hub';

export type { ExamMcqItem, ExamPrepSet };

export const EXAM_PREP_SETS: ExamPrepSet[] = [
  ...EXAM_SETS_1_TO_3,
  ...EXAM_SETS_4_TO_5
];

export interface QuickFoodPreset {
  name: string;
  portion: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatsG: number;
  defaultMeal: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

export const QUICK_FOOD_PRESETS: QuickFoodPreset[] = [
  {
    name: '2 Boiled Eggs + 1 Whole Wheat Brown Bread',
    portion: '2 eggs + 1 slice',
    calories: 230,
    proteinG: 16,
    carbsG: 14,
    fatsG: 11,
    defaultMeal: 'Breakfast'
  },
  {
    name: 'Oatmeal Porridge with Skim Milk & Almonds',
    portion: '1 bowl (250g)',
    calories: 295,
    proteinG: 13,
    carbsG: 42,
    fatsG: 8,
    defaultMeal: 'Breakfast'
  },
  {
    name: 'Whole Wheat Chapati / Roti (Home-made)',
    portion: '1 medium roti (45g)',
    calories: 120,
    proteinG: 4,
    carbsG: 24,
    fatsG: 1,
    defaultMeal: 'Lunch'
  },
  {
    name: 'Grilled / Tikka Chicken Breast + Fresh Salad',
    portion: '180g chicken + bowl salad',
    calories: 310,
    proteinG: 44,
    carbsG: 8,
    fatsG: 9,
    defaultMeal: 'Lunch'
  },
  {
    name: 'Daal Chawal (Lentil Curry + Boiled Rice)',
    portion: '1 plate (300g)',
    calories: 380,
    proteinG: 15,
    carbsG: 64,
    fatsG: 6,
    defaultMeal: 'Lunch'
  },
  {
    name: 'Chicken Karahi / Curry (Low Oil) + 1 Roti',
    portion: '150g curry + 1 roti',
    calories: 410,
    proteinG: 32,
    carbsG: 28,
    fatsG: 18,
    defaultMeal: 'Dinner'
  },
  {
    name: 'Baked / Grilled Fish Fillet + Steamed Vegetables',
    portion: '200g fish + veggies',
    calories: 285,
    proteinG: 38,
    carbsG: 10,
    fatsG: 10,
    defaultMeal: 'Dinner'
  },
  {
    name: 'Low-Fat Plain Yogurt (Dahi) + Chia Seeds',
    portion: '1 cup (200g)',
    calories: 150,
    proteinG: 11,
    carbsG: 12,
    fatsG: 5,
    defaultMeal: 'Snack'
  },
  {
    name: 'Roasted Chana (Chickpeas) + Green Tea',
    portion: '50g handful + 1 cup',
    calories: 180,
    proteinG: 10,
    carbsG: 27,
    fatsG: 3,
    defaultMeal: 'Snack'
  },
  {
    name: 'Fresh Apple + 10 Raw Almonds',
    portion: '1 medium apple + 10 almonds',
    calories: 165,
    proteinG: 4,
    carbsG: 25,
    fatsG: 6,
    defaultMeal: 'Snack'
  },
  {
    name: 'Banana + Peanut Butter Protein Shake',
    portion: '1 glass (350 mL)',
    calories: 390,
    proteinG: 24,
    carbsG: 46,
    fatsG: 12,
    defaultMeal: 'Snack'
  },
  {
    name: 'Boiled Chickpea & Kidney Bean Chaat Salad',
    portion: '1 bowl (220g)',
    calories: 260,
    proteinG: 14,
    carbsG: 42,
    fatsG: 4,
    defaultMeal: 'Lunch'
  }
];

export const PRESET_MEAL_PLANS: Record<
  'lose' | 'maintain' | 'gain',
  DailyMealPlanItem[]
> = {
  lose: [
    {
      id: 'mp-lose-1',
      day: 'Day 1 — Fat Loss & High Protein',
      breakfast: '2 Boiled Eggs + 1 Slice Bran Bread + Unsweetened Green Tea',
      breakfastKcal: 240,
      lunch: '150g Grilled Chicken Tikka Breast + 1 Small Whole Wheat Roti + Cucumber Salad',
      lunchKcal: 420,
      snack: '1 Medium Apple + 8 Raw Almonds + Black Coffee / Green Tea',
      snackKcal: 160,
      dinner: '180g Steamed/Grilled Fish or Daal Soup + Sautéed Broccoli & Salad',
      dinnerKcal: 360
    },
    {
      id: 'mp-lose-2',
      day: 'Day 2 — Metabolic Deficit Plan',
      breakfast: 'Oats Porridge in Skim Milk (40g oats) + 1 tsp Chia Seeds',
      breakfastKcal: 260,
      lunch: '1 Bowl Boiled Chickpea & Red Bean Salad + 100g Low-Fat Yogurt (Raita)',
      lunchKcal: 390,
      snack: '40g Roasted Black Chana + Lemon Mint Water',
      snackKcal: 150,
      dinner: '150g Low-Oil Chicken Shorba + Mixed Green Salad (No White Rice)',
      dinnerKcal: 370
    },
    {
      id: 'mp-lose-3',
      day: 'Day 3 — Balanced Calorie Control',
      breakfast: '2-Egg Vegetable Omelette (1 tsp Olive Oil) + 1 Multi-grain Toast',
      breakfastKcal: 270,
      lunch: '1 Bowl Yellow Moong Daal + 1 Whole Wheat Chapati + Fresh Kachumber Salad',
      lunchKcal: 410,
      snack: '1 Cup Low-Fat Dahi (Yogurt) with Roasted Cumin & Flaxseeds',
      snackKcal: 140,
      dinner: '160g Grilled Chicken/Beef Seekh Kabab (Air-fried) + Mint Chutney & Salad',
      dinnerKcal: 380
    }
  ],
  maintain: [
    {
      id: 'mp-maint-1',
      day: 'Day 1 — Balanced Wellness Maintenance',
      breakfast: '2 Whole Eggs + 1 Whole Wheat Paratha (Light Olive Oil) + Tea',
      breakfastKcal: 420,
      lunch: '150g Chicken Curry + 1.5 Whole Wheat Rotis + Fresh Yogurt Salad',
      lunchKcal: 620,
      snack: '1 Mixed Fruit Bowl + 12 Almonds & Walnuts',
      snackKcal: 240,
      dinner: '1 Plate Daal Chawal (Brown/Basmati Rice) + Grilled Fish/Chicken Piece',
      dinnerKcal: 560
    },
    {
      id: 'mp-maint-2',
      day: 'Day 2 — Active Specialist Nutrition',
      breakfast: '1 Bowl Oats with Milk, 1 Banana, Honey & Mixed Nuts',
      breakfastKcal: 440,
      lunch: '200g Grilled Chicken + 1 Cup Boiled Rice + Mixed Vegetable Curry',
      lunchKcal: 610,
      snack: 'Roasted Chana + 1 Cup Low-Fat Yogurt Smoothie',
      snackKcal: 250,
      dinner: '1.5 Whole Wheat Chapatis + Palak Paneer / Chicken Palak + Salad',
      dinnerKcal: 540
    }
  ],
  gain: [
    {
      id: 'mp-gain-1',
      day: 'Day 1 — Lean Muscle & Healthy Weight Gain',
      breakfast: '3 Whole Eggs Omelette + 2 Whole Wheat Parathas/Toasts + Peanut Butter + Milk',
      breakfastKcal: 680,
      lunch: '200g Chicken/Mutton Curry + 2 Whole Wheat Rotis + 1 Cup Boiled Rice + Yogurt',
      lunchKcal: 850,
      snack: 'Banana + 2 tbsp Peanut Butter + Milk + Dates & Almonds Shake',
      snackKcal: 490,
      dinner: '200g Grilled Fish/Chicken + 1.5 Chapatis + Lentil Daal + Olive Oil Salad',
      dinnerKcal: 720
    },
    {
      id: 'mp-gain-2',
      day: 'Day 2 — High-Calorie Nutrient Surplus',
      breakfast: 'Large Bowl Oats in Full-Cream Milk + 2 Boiled Eggs + Handful Walnuts & Dates',
      breakfastKcal: 660,
      lunch: 'Chicken Biryani / Pulao (350g) + Shami Kabab + Raita & Salad',
      lunchKcal: 860,
      snack: 'Sweet Potato / Chickpea Chaat + Mango/Banana Milkshake',
      snackKcal: 470,
      dinner: '180g Beef/Chicken Karahi + 2 Whole Wheat Chapatis + Warm Milk at Bedtime',
      dinnerKcal: 740
    }
  ]
};

export const DEFAULT_USER_TOOLS_DATA: UserToolsData = {
  nutrition: {
    age: 27,
    gender: 'male',
    heightCm: 172,
    weightKg: 76,
    targetWeightKg: 68,
    activityLevel: 'moderate',
    goalType: 'lose',
    waterGlassesToday: 6,
    mealLogs: [
      {
        id: 'log-init-1',
        date: new Date().toISOString().slice(0, 10),
        mealType: 'Breakfast',
        foodName: '2 Boiled Eggs + 1 Whole Wheat Brown Bread',
        portion: '2 eggs + 1 slice',
        calories: 230,
        proteinG: 16,
        carbsG: 14,
        fatsG: 11
      },
      {
        id: 'log-init-2',
        date: new Date().toISOString().slice(0, 10),
        mealType: 'Lunch',
        foodName: 'Grilled Chicken Breast + 1 Whole Wheat Roti & Salad',
        portion: '180g + 1 roti',
        calories: 430,
        proteinG: 48,
        carbsG: 32,
        fatsG: 10
      }
    ],
    mealPlans: PRESET_MEAL_PLANS.lose,
    weightHistory: [
      { date: 'Week 1', weightKg: 78.5, bmi: 26.5 },
      { date: 'Week 2', weightKg: 77.8, bmi: 26.3 },
      { date: 'Week 3', weightKg: 76.9, bmi: 26.0 },
      { date: 'Today', weightKg: 76.0, bmi: 25.7 }
    ],
    updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
  },
  examAttempts: [],
  masteredInterviewIds: [],
  bookmarkedInterviewIds: [],
  lastActiveTool: 'nutrition',
  updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
};

export interface ComputedNutritionMetrics {
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal Healthy Weight' | 'Overweight' | 'Obese';
  bmiColorHex: string;
  healthyMinKg: number;
  healthyMaxKg: number;
  idealMidKg: number;
  weightAction: 'REDUCE WEIGHT' | 'GAIN WEIGHT' | 'MAINTAIN WEIGHT';
  kgDifferenceToHealthy: number;
  kgDifferenceToTarget: number;
  recommendationHeadline: string;
  recommendationDetail: string;
  bmrKcal: number;
  tdeeKcal: number;
  dailyTargetKcal: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatsG: number;
  consumedKcal: number;
  consumedProteinG: number;
  consumedCarbsG: number;
  consumedFatsG: number;
}

export function computeNutritionMetrics(
  n: NutritionProfileData
): ComputedNutritionMetrics {
  const heightM = Math.max(1.2, (n.heightCm || 170) / 100);
  const weightKg = Math.max(30, n.weightKg || 70);
  const age = Math.max(15, n.age || 27);
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  const healthyMinKg = Number((18.5 * heightM * heightM).toFixed(1));
  const healthyMaxKg = Number((24.9 * heightM * heightM).toFixed(1));
  const idealMidKg = Number((22.0 * heightM * heightM).toFixed(1));
  const targetWeightKg = Math.max(35, n.targetWeightKg || idealMidKg);

  let bmiCategory: ComputedNutritionMetrics['bmiCategory'] =
    'Normal Healthy Weight';
  let bmiColorHex = '#0E9F6E';

  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColorHex = '#D97706';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    bmiCategory = 'Normal Healthy Weight';
    bmiColorHex = '#0E9F6E';
  } else if (bmi >= 25.0 && bmi <= 29.9) {
    bmiCategory = 'Overweight';
    bmiColorHex = '#EA580C';
  } else {
    bmiCategory = 'Obese';
    bmiColorHex = '#DC2626';
  }

  let weightAction: ComputedNutritionMetrics['weightAction'] =
    'MAINTAIN WEIGHT';
  let kgDifferenceToHealthy = 0;
  let recommendationHeadline = '';
  let recommendationDetail = '';

  if (bmi > 24.9) {
    weightAction = 'REDUCE WEIGHT';
    kgDifferenceToHealthy = Number((weightKg - healthyMaxKg).toFixed(1));
    const kgToIdeal = Number((weightKg - idealMidKg).toFixed(1));
    const weeksEstimate = Math.max(2, Math.ceil(kgToIdeal / 0.5));
    recommendationHeadline = `Reduce ${kgDifferenceToHealthy} kg to ${kgToIdeal} kg (Target Healthy Weight: ${healthyMinKg}–${healthyMaxKg} kg)`;
    recommendationDetail = `Your current BMI is ${bmi} (${bmiCategory}). To enter the WHO Healthy BMI range (18.5–24.9), reduce at least ${kgDifferenceToHealthy} kg (or ${kgToIdeal} kg to reach optimal BMI 22.0 at ${idealMidKg} kg) over ~${weeksEstimate} weeks using a 500 kcal/day calorie deficit.`;
  } else if (bmi < 18.5) {
    weightAction = 'GAIN WEIGHT';
    kgDifferenceToHealthy = Number((healthyMinKg - weightKg).toFixed(1));
    const kgToIdeal = Number((idealMidKg - weightKg).toFixed(1));
    const weeksEstimate = Math.max(2, Math.ceil(kgToIdeal / 0.4));
    recommendationHeadline = `Gain ${kgDifferenceToHealthy} kg to ${kgToIdeal} kg (Target Healthy Weight: ${healthyMinKg}–${healthyMaxKg} kg)`;
    recommendationDetail = `Your current BMI is ${bmi} (${bmiCategory}). To reach the WHO Healthy BMI threshold (18.5), gain at least ${kgDifferenceToHealthy} kg (or ${kgToIdeal} kg for optimal BMI 22.0 at ${idealMidKg} kg) over ~${weeksEstimate} weeks with a +400 kcal/day high-protein surplus.`;
  } else {
    if (weightKg > targetWeightKg + 1) {
      weightAction = 'REDUCE WEIGHT';
      const diff = Number((weightKg - targetWeightKg).toFixed(1));
      recommendationHeadline = `Healthy BMI (${bmi}) — Reduce ${diff} kg to reach your personal goal (${targetWeightKg} kg)`;
      recommendationDetail = `Your BMI (${bmi}) is already within the WHO Normal Healthy Weight range (${healthyMinKg}–${healthyMaxKg} kg). A mild 300–400 kcal/day deficit will tone you down to your ${targetWeightKg} kg target.`;
    } else if (weightKg < targetWeightKg - 1) {
      weightAction = 'GAIN WEIGHT';
      const diff = Number((targetWeightKg - weightKg).toFixed(1));
      recommendationHeadline = `Healthy BMI (${bmi}) — Gain ${diff} kg of lean mass to reach your goal (${targetWeightKg} kg)`;
      recommendationDetail = `Your BMI (${bmi}) is in the WHO Normal Healthy Weight range (${healthyMinKg}–${healthyMaxKg} kg). Add +350 kcal/day with 1.8g protein/kg to build lean muscle to ${targetWeightKg} kg.`;
    } else {
      weightAction = 'MAINTAIN WEIGHT';
      recommendationHeadline = `Optimal Healthy Weight (${weightKg} kg • BMI ${bmi}) — Maintain Current Weight`;
      recommendationDetail = `Congratulations! Your current weight (${weightKg} kg) and BMI (${bmi}) sit squarely inside the WHO Healthy Range (${healthyMinKg}–${healthyMaxKg} kg). Maintain balanced calories at your TDEE.`;
    }
  }

  // Mifflin-St Jeor Equation for BMR
  const baseBmr =
    10 * weightKg +
    6.25 * (n.heightCm || 170) -
    5 * age +
    (n.gender === 'female' ? -161 : 5);
  const bmrKcal = Math.round(Math.max(1000, baseBmr));

  const activityMultipliers: Record<
    NutritionProfileData['activityLevel'],
    number
  > = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    athlete: 1.9
  };
  const tdeeKcal = Math.round(
    bmrKcal * (activityMultipliers[n.activityLevel] || 1.55)
  );

  let dailyTargetKcal = tdeeKcal;
  if (weightAction === 'REDUCE WEIGHT') {
    dailyTargetKcal = Math.max(1250, tdeeKcal - 500);
  } else if (weightAction === 'GAIN WEIGHT') {
    dailyTargetKcal = tdeeKcal + 400;
  }

  // Macro targets: 30% Protein, 45% Carbs, 25% Fats
  const targetProteinG = Math.round((dailyTargetKcal * 0.3) / 4);
  const targetCarbsG = Math.round((dailyTargetKcal * 0.45) / 4);
  const targetFatsG = Math.round((dailyTargetKcal * 0.25) / 9);

  const consumedKcal = (n.mealLogs || []).reduce(
    (sum, m) => sum + (Number(m.calories) || 0),
    0
  );
  const consumedProteinG = (n.mealLogs || []).reduce(
    (sum, m) => sum + (Number(m.proteinG) || 0),
    0
  );
  const consumedCarbsG = (n.mealLogs || []).reduce(
    (sum, m) => sum + (Number(m.carbsG) || 0),
    0
  );
  const consumedFatsG = (n.mealLogs || []).reduce(
    (sum, m) => sum + (Number(m.fatsG) || 0),
    0
  );

  return {
    bmi,
    bmiCategory,
    bmiColorHex,
    healthyMinKg,
    healthyMaxKg,
    idealMidKg,
    weightAction,
    kgDifferenceToHealthy,
    kgDifferenceToTarget: Number(Math.abs(weightKg - targetWeightKg).toFixed(1)),
    recommendationHeadline,
    recommendationDetail,
    bmrKcal,
    tdeeKcal,
    dailyTargetKcal,
    targetProteinG,
    targetCarbsG,
    targetFatsG,
    consumedKcal,
    consumedProteinG,
    consumedCarbsG,
    consumedFatsG
  };
}

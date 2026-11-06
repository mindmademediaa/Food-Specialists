export const DOCTOR_DISCLAIMER_SHORT = 'Please ask your doctor before consuming';
export const DOCTOR_DISCLAIMER_BANNER =
  'Doctor Disclaimer: This is general nutrition information, not medical advice. Consult your healthcare provider for personalized guidance.';
export const DOCTOR_DISCLAIMER_CHAT =
  'Disclaimer: Please consult your doctor before making any dietary changes.';

export type GenderOption = 'Male' | 'Female' | 'Other';
export type ActivityLevelOption =
  | 'Sedentary'
  | 'Lightly Active'
  | 'Moderately Active'
  | 'Very Active'
  | 'Athlete';
export type GoalOption =
  | 'Lose Weight'
  | 'Maintain Weight'
  | 'Gain Weight'
  | 'Gain Muscle'
  | 'Improve Health';
export type DietPreferenceOption =
  | 'Normal'
  | 'Vegetarian'
  | 'Vegan'
  | 'Halal'
  | 'Keto'
  | 'Low Carb'
  | 'High Protein'
  | 'Desi';

export interface SuiteOnboardingProfile {
  uid: string;
  fullName: string;
  age: number;
  gender: GenderOption;
  heightUnit: 'cm' | 'feet';
  heightCm: number;
  heightFeet: number;
  heightInches: number;
  weightKg: number;
  targetWeightKg: number;
  waistCm: number;
  activityLevel: ActivityLevelOption;
  goal: GoalOption;
  dietPreference: DietPreferenceOption;
  allergies: string[];
  healthConditions: string[];
  customHealthCondition: string;
  dailyWaterGoalGlasses: number;
  sleepHours: number;
  waterReminderEvery2Hours: boolean;
  setupCompleted: boolean;
  freeBmiCalculatedCount: number;
  freeHealthSearchCount: number;
  savedRecipeIds: string[];
  streakDays: number;
  updatedAt: string;
}

export interface SuiteComputedIndexes {
  bmi: number;
  bmiStatus: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  bmiColorHex: string;
  bmiBadgeBg: string;
  bmiBadgeText: string;
  healthScore: number;
  healthScoreLabel: 'Great' | 'Good' | 'Fair' | 'Needs Care';
  bmrKcal: number;
  tdeeKcal: number;
  idealWeightKg: number;
  bodyFatPct: number;
  visceralFatLevel: number;
  visceralFatStatus: 'Low' | 'Normal' | 'High';
  dailyCaloriesNeeded: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatG: number;
}

export interface MealFoodEntry {
  id: string;
  name: string;
  grams: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  disclaimer: string;
}

export interface DayMealPlanData {
  dayKey: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  dateNumber: string;
  fullDateLabel: string;
  breakfast: MealFoodEntry[];
  lunch: MealFoodEntry[];
  dinner: MealFoodEntry[];
  snack: MealFoodEntry[];
}

export interface GroceryItem {
  id: string;
  name: string;
  totalGrams: number;
  category: string;
  checked: boolean;
}

export interface SuiteRecipeItem {
  id: string;
  title: string;
  category: 'Desi' | 'Pakistani' | 'Chinese' | 'Italian' | 'Continental' | 'Healthy';
  imageUrl: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  cookTimeMin: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isVeg: boolean;
  ingredients: { item: string; grams: number }[];
  instructions: string[];
  healthBenefits: string[];
  disclaimer: string;
  createdByUid?: string;
  authorName?: string;
}

export interface ConditionFoodCard {
  name: string;
  iconType: 'leaf' | 'fish' | 'bowl' | 'grain' | 'cereal' | 'bread' | 'fried' | 'meat';
  shortNote: string;
  caloriesPer100g: number;
  disclaimer: string;
}

export interface HealthConditionRecommendationData {
  conditionName: string;
  summaryAdvice: string;
  recommendedFoods: ConditionFoodCard[];
  foodsToAvoid: ConditionFoodCard[];
  updatedLabel: string;
}

export interface SupplementGuideItem {
  id: string;
  name: string;
  dosageNote: string;
  bestTimeToTake: string;
  keyBenefit: string;
  naturalFoodSources: string[];
  disclaimer: string;
}

export const ALLERGY_OPTIONS = [
  'Peanuts',
  'Gluten',
  'Dairy',
  'Eggs',
  'Seafood',
  'Nuts',
  'None'
];

export const HEALTH_CONDITION_PRESETS = [
  'Diabetes',
  'High Blood Pressure',
  'Cholesterol',
  'PCOS',
  'Thyroid',
  'Heart Disease',
  'Acidity',
  'Anemia',
  'None'
];

export const DEFAULT_SUITE_ONBOARDING: SuiteOnboardingProfile = {
  uid: '',
  fullName: 'Food Specialist',
  age: 28,
  gender: 'Male',
  heightUnit: 'cm',
  heightCm: 172,
  heightFeet: 5,
  heightInches: 8,
  weightKg: 71.6,
  targetWeightKg: 68,
  waistCm: 82,
  activityLevel: 'Lightly Active',
  goal: 'Lose Weight',
  dietPreference: 'Desi',
  allergies: ['None'],
  healthConditions: ['None'],
  customHealthCondition: '',
  dailyWaterGoalGlasses: 8,
  sleepHours: 7.5,
  waterReminderEvery2Hours: true,
  setupCompleted: false,
  freeBmiCalculatedCount: 0,
  freeHealthSearchCount: 0,
  savedRecipeIds: ['desi-biryani', 'desi-karahi'],
  streakDays: 5,
  updatedAt: new Date().toISOString()
};

// ============================================================================
// PART 2: EXACT MATHEMATICAL FORMULAS FOR NUTRITION DASHBOARD
// ============================================================================
export function calculateSuiteNutritionIndexes(
  profile: SuiteOnboardingProfile,
  currentWaterGlasses = 6
): SuiteComputedIndexes {
  const heightCm =
    profile.heightUnit === 'feet'
      ? Math.round((profile.heightFeet * 12 + profile.heightInches) * 2.54)
      : Math.max(120, Math.min(230, Number(profile.heightCm) || 172));
  const heightM = heightCm / 100;
  const weightKg = Math.max(30, Math.min(250, Number(profile.weightKg) || 71.6));
  const age = Math.max(14, Math.min(95, Number(profile.age) || 28));
  const waistCm = Math.max(55, Math.min(160, Number(profile.waistCm) || 82));

  // 1. BMI = Weight (kg) / (Height (m))^2
  const rawBmi = weightKg / (heightM * heightM);
  const bmi = Number(rawBmi.toFixed(1));

  let bmiStatus: SuiteComputedIndexes['bmiStatus'] = 'Normal';
  let bmiColorHex = '#16A34A'; // Normal Green
  let bmiBadgeBg = '#BBF7D0';
  let bmiBadgeText = '#14532D';

  if (bmi < 18.5) {
    bmiStatus = 'Underweight';
    bmiColorHex = '#2563EB'; // Blue
    bmiBadgeBg = '#DBEAFE';
    bmiBadgeText = '#1E3A8A';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    bmiStatus = 'Normal';
    bmiColorHex = '#16A34A'; // Green
    bmiBadgeBg = '#BBF7D0';
    bmiBadgeText = '#14532D';
  } else if (bmi >= 25 && bmi <= 29.9) {
    bmiStatus = 'Overweight';
    bmiColorHex = '#EA580C'; // Orange
    bmiBadgeBg = '#FFEDD5';
    bmiBadgeText = '#9A3412';
  } else {
    bmiStatus = 'Obese';
    bmiColorHex = '#DC2626'; // Red
    bmiBadgeBg = '#FEE2E2';
    bmiBadgeText = '#991B1B';
  }

  // 2. BMR (Mifflin-St Jeor)
  // Men: 10 * weight + 6.25 * height - 5 * age + 5
  // Women: 10 * weight + 6.25 * height - 5 * age - 161
  const isFemale = profile.gender === 'Female';
  const bmrRaw = isFemale
    ? 10 * weightKg + 6.25 * heightCm - 5 * age - 161
    : 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  const bmrKcal = Math.round(bmrRaw);

  // 3. TDEE = BMR * Activity Multiplier (1.2, 1.375, 1.55, 1.725, 1.9)
  const multiplierMap: Record<ActivityLevelOption, number> = {
    Sedentary: 1.2,
    'Lightly Active': 1.375,
    'Moderately Active': 1.55,
    'Very Active': 1.725,
    Athlete: 1.9
  };
  const mult = multiplierMap[profile.activityLevel] || 1.375;
  const tdeeKcal = Math.round(bmrKcal * mult);

  // 4. Ideal Weight (Devine Formula)
  // Men: 50 + 2.3 * (height in inches - 60)
  // Women: 45.5 + 2.3 * (height in inches - 60)
  const heightInches = heightCm / 2.54;
  const inchesOver60 = Math.max(-5, heightInches - 60);
  const idealRaw = isFemale
    ? 45.5 + 2.3 * inchesOver60
    : 50 + 2.3 * inchesOver60;
  const idealWeightKg = Math.round(Math.max(42, idealRaw));

  // 5. Body Fat % Estimate
  // Men: 1.20 * BMI + 0.23 * Age - 16.2
  // Women: 1.20 * BMI + 0.23 * Age - 5.4
  const bodyFatRaw = isFemale
    ? 1.2 * bmi + 0.23 * age - 5.4
    : 1.2 * bmi + 0.23 * age - 16.2;
  const bodyFatPct = Number(Math.max(6, Math.min(52, bodyFatRaw)).toFixed(1));

  // 6. Visceral Fat Level from BMI + Waist cm
  const waistToHeight = waistCm / heightCm;
  const visceralRaw = Math.round((bmi - 18) * 0.45 + (waistToHeight - 0.42) * 35 + 3);
  const visceralFatLevel = Math.max(2, Math.min(20, visceralRaw));
  const visceralFatStatus: SuiteComputedIndexes['visceralFatStatus'] =
    visceralFatLevel <= 9 ? 'Low' : visceralFatLevel <= 14 ? 'Normal' : 'High';

  // 7. Daily Calories Needed:
  // Lose = TDEE - 500, Maintain = TDEE, Gain = TDEE + 300, Muscle = TDEE + 200
  let dailyCaloriesNeeded = tdeeKcal;
  if (profile.goal === 'Lose Weight') {
    dailyCaloriesNeeded = Math.max(1200, tdeeKcal - 500);
  } else if (profile.goal === 'Gain Weight') {
    dailyCaloriesNeeded = tdeeKcal + 300;
  } else if (profile.goal === 'Gain Muscle') {
    dailyCaloriesNeeded = tdeeKcal + 200;
  }

  // 8. Macros Breakdown:
  // Protein: Lose 1.6g/kg, Maintain 1.2g/kg, Muscle 2.0g/kg
  // Carbs: 50% of calories / 4
  // Fat: 28% of calories / 9
  let proteinPerKg = 1.4;
  if (profile.goal === 'Lose Weight') proteinPerKg = 1.6;
  else if (profile.goal === 'Maintain Weight' || profile.goal === 'Improve Health')
    proteinPerKg = 1.2;
  else if (profile.goal === 'Gain Muscle' || profile.goal === 'Gain Weight')
    proteinPerKg = 2.0;

  const targetProteinG = Math.round(weightKg * proteinPerKg);
  const targetCarbsG = Math.round((dailyCaloriesNeeded * 0.5) / 4);
  const targetFatG = Math.round((dailyCaloriesNeeded * 0.28) / 9);

  // 9. Health Score (0 to 100):
  // BMI 30%, Activity 20%, Water 15%, Sleep 15%, Diet Quality 20%
  let bmiPts = 30;
  if (bmiStatus === 'Normal') bmiPts = 28;
  else if (bmiStatus === 'Overweight' || bmiStatus === 'Underweight') bmiPts = 21;
  else bmiPts = 14;

  const activityPtsMap: Record<ActivityLevelOption, number> = {
    Sedentary: 11,
    'Lightly Active': 15,
    'Moderately Active': 18,
    'Very Active': 20,
    Athlete: 20
  };
  const activityPts = activityPtsMap[profile.activityLevel] || 16;

  const waterGoal = Math.max(6, profile.dailyWaterGoalGlasses || 8);
  const waterRatio = Math.min(1, currentWaterGlasses / waterGoal);
  const waterPts = Math.round(waterRatio * 15);

  const sleep = Number(profile.sleepHours) || 7.5;
  const sleepPts = sleep >= 7 && sleep <= 8.5 ? 15 : sleep >= 6 ? 12 : 8;

  const dietPts =
    profile.dietPreference === 'Low Carb' ||
    profile.dietPreference === 'High Protein' ||
    profile.dietPreference === 'Vegetarian'
      ? 19
      : 17;

  const healthScore = Math.max(
    40,
    Math.min(99, bmiPts + activityPts + waterPts + sleepPts + dietPts)
  );
  const healthScoreLabel: SuiteComputedIndexes['healthScoreLabel'] =
    healthScore >= 80
      ? 'Great'
      : healthScore >= 68
      ? 'Good'
      : healthScore >= 55
      ? 'Fair'
      : 'Needs Care';

  return {
    bmi,
    bmiStatus,
    bmiColorHex,
    bmiBadgeBg,
    bmiBadgeText,
    healthScore,
    healthScoreLabel,
    bmrKcal,
    tdeeKcal,
    idealWeightKg,
    bodyFatPct,
    visceralFatLevel,
    visceralFatStatus,
    dailyCaloriesNeeded,
    targetProteinG,
    targetCarbsG,
    targetFatG
  };
}

// ============================================================================
// PART 3: 7-DAY AI MEAL PLAN GENERATOR (WITH GRAMS, CALORIES & SWAP ALTERNATIVES)
// ============================================================================
export function generate7DayMealPlan(
  profile: SuiteOnboardingProfile
): DayMealPlanData[] {
  const isVeg =
    profile.dietPreference === 'Vegetarian' || profile.dietPreference === 'Vegan';
  const isLowCarb =
    profile.dietPreference === 'Keto' || profile.dietPreference === 'Low Carb';

  const days: { key: DayMealPlanData['dayKey']; dateNum: string; label: string }[] = [
    { key: 'Mon', dateNum: '14', label: 'Mon, Oct 14' },
    { key: 'Tue', dateNum: '15', label: 'Tue, Oct 15' },
    { key: 'Wed', dateNum: '16', label: 'Wed, Oct 16' },
    { key: 'Thu', dateNum: '17', label: 'Thu, Oct 17' },
    { key: 'Fri', dateNum: '18', label: 'Fri, Oct 18' },
    { key: 'Sat', dateNum: '19', label: 'Sat, Oct 19' },
    { key: 'Sun', dateNum: '20', label: 'Sun, Oct 20' }
  ];

  const templates = [
    // Day 1 (Mon - Matches Image 4 Reference Exactly!)
    {
      breakfast: [
        {
          id: 'b-1',
          name: 'Overnight Oats',
          grams: 200,
          calories: 320,
          proteinG: 14,
          carbsG: 52,
          fatG: 7,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        },
        {
          id: 'b-2',
          name: 'Banana',
          grams: 100,
          calories: 90,
          proteinG: 1,
          carbsG: 23,
          fatG: 0,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      lunch: [
        {
          id: 'l-1',
          name: '1 Whole Wheat Roti',
          grams: 80,
          calories: 120,
          proteinG: 4,
          carbsG: 24,
          fatG: 1,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        },
        {
          id: 'l-2',
          name: 'Tarka Daal (Lentils)',
          grams: 150,
          calories: 180,
          proteinG: 12,
          carbsG: 26,
          fatG: 4,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        },
        {
          id: 'l-3',
          name: 'Fresh Kachumar Salad',
          grams: 60,
          calories: 40,
          proteinG: 1,
          carbsG: 7,
          fatG: 0,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      dinner: [
        {
          id: 'd-1',
          name: isVeg ? 'Grilled Paneer Tikka' : 'Grilled Chicken Breast',
          grams: 120,
          calories: 260,
          proteinG: isVeg ? 22 : 34,
          carbsG: 6,
          fatG: 11,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        },
        {
          id: 'd-2',
          name: 'Roasted Vegetables',
          grams: 100,
          calories: 90,
          proteinG: 3,
          carbsG: 14,
          fatG: 3,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      snack: [
        {
          id: 's-1',
          name: 'Greek Yogurt / Dahi',
          grams: 100,
          calories: 100,
          proteinG: 10,
          carbsG: 6,
          fatG: 4,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        },
        {
          id: 's-2',
          name: 'Raw Almonds (Badam)',
          grams: 15,
          calories: 90,
          proteinG: 3,
          carbsG: 3,
          fatG: 8,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ]
    },
    // Day 2 (Tue)
    {
      breakfast: [
        {
          id: 'b-3',
          name: isVeg ? 'Besan Chilla (Gram Pancake)' : '2 Boiled Eggs + Omelette',
          grams: 130,
          calories: 220,
          proteinG: 15,
          carbsG: 12,
          fatG: 11,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        },
        {
          id: 'b-4',
          name: isLowCarb ? 'Sliced Avocado' : 'Multigrain Toast',
          grams: 70,
          calories: 150,
          proteinG: 4,
          carbsG: 18,
          fatG: 6,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      lunch: [
        {
          id: 'l-4',
          name: isVeg ? 'Palak Paneer Bowl' : 'Desi Chicken Karahi (Less Oil)',
          grams: 180,
          calories: 290,
          proteinG: 26,
          carbsG: 10,
          fatG: 15,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        },
        {
          id: 'l-5',
          name: '1 Chakki Roti',
          grams: 80,
          calories: 120,
          proteinG: 4,
          carbsG: 24,
          fatG: 1,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      dinner: [
        {
          id: 'd-3',
          name: 'Chana Masala (Chickpea Curry)',
          grams: 160,
          calories: 230,
          proteinG: 13,
          carbsG: 32,
          fatG: 6,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        },
        {
          id: 'd-4',
          name: 'Cucumber & Mint Raita',
          grams: 90,
          calories: 70,
          proteinG: 4,
          carbsG: 5,
          fatG: 3,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      snack: [
        {
          id: 's-3',
          name: 'Fresh Apple Slices',
          grams: 150,
          calories: 80,
          proteinG: 0,
          carbsG: 21,
          fatG: 0,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        },
        {
          id: 's-4',
          name: 'Roasted Chana (Bhuna Chana)',
          grams: 30,
          calories: 110,
          proteinG: 6,
          carbsG: 17,
          fatG: 2,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ]
    },
    // Day 3 (Wed)
    {
      breakfast: [
        {
          id: 'b-5',
          name: 'Oats Porridge with Chia Seeds',
          grams: 220,
          calories: 290,
          proteinG: 12,
          carbsG: 44,
          fatG: 7,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        },
        {
          id: 'b-6',
          name: 'Walnuts (Akhrot)',
          grams: 15,
          calories: 98,
          proteinG: 2,
          carbsG: 2,
          fatG: 9,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      lunch: [
        {
          id: 'l-6',
          name: isVeg ? 'Vegetable Biryani (Portion)' : 'Chicken Biryani (Portion)',
          grams: 220,
          calories: 410,
          proteinG: isVeg ? 11 : 22,
          carbsG: 48,
          fatG: 12,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        },
        {
          id: 'l-7',
          name: 'Green Salad Bowl',
          grams: 80,
          calories: 35,
          proteinG: 1,
          carbsG: 6,
          fatG: 0,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      dinner: [
        {
          id: 'd-5',
          name: isVeg ? 'Moong Daal Khichdi' : 'Chicken Tikka (Charcoal Grilled)',
          grams: 150,
          calories: 250,
          proteinG: 28,
          carbsG: 8,
          fatG: 9,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        },
        {
          id: 'd-6',
          name: 'Steamed Broccoli & Carrots',
          grams: 110,
          calories: 65,
          proteinG: 3,
          carbsG: 11,
          fatG: 1,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      snack: [
        {
          id: 's-5',
          name: 'Green Tea + 2 Whole Wheat Biscuits',
          grams: 180,
          calories: 110,
          proteinG: 2,
          carbsG: 16,
          fatG: 4,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ]
    },
    // Day 4 (Thu)
    {
      breakfast: [
        {
          id: 'b-7',
          name: 'Avocado & Egg / Paneer Toast',
          grams: 140,
          calories: 310,
          proteinG: 15,
          carbsG: 26,
          fatG: 15,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        },
        {
          id: 'b-8',
          name: 'Low-Sugar Chai / Black Coffee',
          grams: 150,
          calories: 60,
          proteinG: 2,
          carbsG: 7,
          fatG: 2,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      lunch: [
        {
          id: 'l-8',
          name: 'Daal Makhani (Light Cream)',
          grams: 170,
          calories: 240,
          proteinG: 13,
          carbsG: 28,
          fatG: 8,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        },
        {
          id: 'l-9',
          name: 'Steamed Brown Rice',
          grams: 120,
          calories: 140,
          proteinG: 3,
          carbsG: 29,
          fatG: 1,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      dinner: [
        {
          id: 'd-7',
          name: isVeg ? 'Bhindi Masala + 1 Roti' : 'Chapli Kebab (Air-Fried) + Salad',
          grams: 160,
          calories: 320,
          proteinG: 24,
          carbsG: 18,
          fatG: 14,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      snack: [
        {
          id: 's-6',
          name: 'Mixed Seeds & Guava (Amrood)',
          grams: 130,
          calories: 140,
          proteinG: 4,
          carbsG: 18,
          fatG: 5,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ]
    },
    // Day 5 (Fri)
    {
      breakfast: [
        {
          id: 'b-9',
          name: 'Berry & Protein Smoothie Bowl',
          grams: 250,
          calories: 330,
          proteinG: 20,
          carbsG: 42,
          fatG: 8,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      lunch: [
        {
          id: 'l-10',
          name: isVeg ? 'Aloo Gobi Masala + 1 Roti' : 'Keema Matar + 1 Whole Wheat Roti',
          grams: 230,
          calories: 390,
          proteinG: 25,
          carbsG: 34,
          fatG: 14,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        },
        {
          id: 'l-11',
          name: 'Fresh Lemon & Onion Salad',
          grams: 70,
          calories: 30,
          proteinG: 1,
          carbsG: 6,
          fatG: 0,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      dinner: [
        {
          id: 'd-8',
          name: 'Hot & Sour Vegetable / Chicken Soup',
          grams: 240,
          calories: 190,
          proteinG: 16,
          carbsG: 18,
          fatG: 5,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        },
        {
          id: 'd-9',
          name: 'Stir-Fry Vegetables & Tofu/Chicken',
          grams: 130,
          calories: 170,
          proteinG: 15,
          carbsG: 12,
          fatG: 6,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      snack: [
        {
          id: 's-7',
          name: 'Dates (2 Khajoor) + 6 Almonds',
          grams: 45,
          calories: 135,
          proteinG: 3,
          carbsG: 22,
          fatG: 4,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ]
    },
    // Day 6 (Sat)
    {
      breakfast: [
        {
          id: 'b-10',
          name: isVeg ? 'Aloo Paratha (Light Olive Oil) + Dahi' : '2 Shami Kebabs + 1 Whole Wheat Paratha',
          grams: 190,
          calories: 370,
          proteinG: 19,
          carbsG: 36,
          fatG: 14,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      lunch: [
        {
          id: 'l-12',
          name: 'Quinoa & Chickpea Mediterranean Bowl',
          grams: 220,
          calories: 360,
          proteinG: 16,
          carbsG: 48,
          fatG: 10,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      dinner: [
        {
          id: 'd-10',
          name: isVeg ? 'Saag + 1 Makki ki Roti' : 'Grilled Fish / Chicken Steak + Veggies',
          grams: 210,
          calories: 340,
          proteinG: 29,
          carbsG: 20,
          fatG: 13,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      snack: [
        {
          id: 's-8',
          name: 'Pomegranate Bowl (Anaar)',
          grams: 120,
          calories: 105,
          proteinG: 2,
          carbsG: 24,
          fatG: 1,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ]
    },
    // Day 7 (Sun)
    {
      breakfast: [
        {
          id: 'b-11',
          name: 'High-Protein Omelette / Moong Sprouts Bowl',
          grams: 180,
          calories: 295,
          proteinG: 21,
          carbsG: 18,
          fatG: 13,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      lunch: [
        {
          id: 'l-13',
          name: isVeg ? 'Royal Vegetable Haleem' : 'Pakistani Daleem / Haleem (Lean Meat)',
          grams: 220,
          calories: 380,
          proteinG: 24,
          carbsG: 42,
          fatG: 11,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      dinner: [
        {
          id: 'd-11',
          name: isVeg ? 'Caesar Salad with Grilled Paneer' : 'Caesar Salad with Grilled Chicken',
          grams: 200,
          calories: 310,
          proteinG: 26,
          carbsG: 14,
          fatG: 15,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ],
      snack: [
        {
          id: 's-9',
          name: 'Greek Yogurt with Honey & Flaxseeds',
          grams: 130,
          calories: 145,
          proteinG: 11,
          carbsG: 14,
          fatG: 4,
          disclaimer: DOCTOR_DISCLAIMER_SHORT
        }
      ]
    }
  ];

  return days.map((d, idx) => {
    const t = templates[idx % templates.length];
    return {
      dayKey: d.key,
      dateNumber: d.dateNum,
      fullDateLabel: d.label,
      breakfast: t.breakfast.map((x) => ({ ...x, id: `${d.key}-${x.id}` })),
      lunch: t.lunch.map((x) => ({ ...x, id: `${d.key}-${x.id}` })),
      dinner: t.dinner.map((x) => ({ ...x, id: `${d.key}-${x.id}` })),
      snack: t.snack.map((x) => ({ ...x, id: `${d.key}-${x.id}` }))
    };
  });
}

export const SWAP_MEAL_ALTERNATIVES: Record<
  'breakfast' | 'lunch' | 'dinner' | 'snack',
  MealFoodEntry[][]
> = {
  breakfast: [
    [
      {
        id: 'swap-b1',
        name: '2 Boiled Eggs + Whole Wheat Toast',
        grams: 140,
        calories: 280,
        proteinG: 17,
        carbsG: 22,
        fatG: 11,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        id: 'swap-b2',
        name: 'Green Tea (Unsweetened)',
        grams: 150,
        calories: 5,
        proteinG: 0,
        carbsG: 1,
        fatG: 0,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ],
    [
      {
        id: 'swap-b3',
        name: 'Chia Seed Pudding with Berries',
        grams: 190,
        calories: 295,
        proteinG: 11,
        carbsG: 34,
        fatG: 11,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ]
  ],
  lunch: [
    [
      {
        id: 'swap-l1',
        name: 'Chicken Tikka Breast + 1 Chapati',
        grams: 200,
        calories: 360,
        proteinG: 34,
        carbsG: 26,
        fatG: 9,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        id: 'swap-l2',
        name: 'Mint Yogurt Raita',
        grams: 60,
        calories: 45,
        proteinG: 3,
        carbsG: 4,
        fatG: 2,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ],
    [
      {
        id: 'swap-l3',
        name: 'Palak Paneer + Brown Rice',
        grams: 220,
        calories: 375,
        proteinG: 19,
        carbsG: 35,
        fatG: 14,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ]
  ],
  dinner: [
    [
      {
        id: 'swap-d1',
        name: 'Baked Salmon / Rohu Fish Fillet',
        grams: 140,
        calories: 270,
        proteinG: 30,
        carbsG: 2,
        fatG: 14,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        id: 'swap-d2',
        name: 'Steamed Green Beans & Carrots',
        grams: 100,
        calories: 70,
        proteinG: 2,
        carbsG: 12,
        fatG: 1,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ],
    [
      {
        id: 'swap-d3',
        name: 'Chicken Manchurian (Light Sauce) + Veggies',
        grams: 200,
        calories: 320,
        proteinG: 24,
        carbsG: 28,
        fatG: 10,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ]
  ],
  snack: [
    [
      {
        id: 'swap-s1',
        name: 'Roasted Makhana (Fox Nuts)',
        grams: 40,
        calories: 140,
        proteinG: 4,
        carbsG: 24,
        fatG: 3,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ],
    [
      {
        id: 'swap-s2',
        name: 'Fresh Apple + 1 tbsp Peanut Butter',
        grams: 135,
        calories: 175,
        proteinG: 5,
        carbsG: 21,
        fatG: 8,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ]
  ]
};

// ============================================================================
// PART 4: 44 PRE-LOADED AUTHENTIC RECIPES (DESI, PAKISTANI, CHINESE, ITALIAN, CONTINENTAL, HEALTHY)
// ============================================================================
export const PRELOADED_44_RECIPES: SuiteRecipeItem[] = [
  // --- DESI & PAKISTANI (24 RECIPES) ---
  {
    id: 'desi-biryani',
    title: 'Chicken Biryani',
    category: 'Desi',
    imageUrl:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    calories: 420,
    proteinG: 24,
    carbsG: 45,
    fatG: 13,
    fiberG: 4,
    cookTimeMin: 40,
    difficulty: 'Medium',
    isVeg: false,
    ingredients: [
      { item: 'Basmati Rice (soaked)', grams: 120 },
      { item: 'Skinless Chicken Breast/Thigh', grams: 140 },
      { item: 'Low-Fat Yogurt (Dahi)', grams: 60 },
      { item: 'Onions, Tomatoes, Mint & Biryani Spices', grams: 90 },
      { item: 'Olive / Canola Oil', grams: 12 }
    ],
    instructions: [
      'Marinate chicken with yogurt, ginger-garlic paste, fresh mint, and aromatic biryani spices for 25 minutes.',
      'Par-boil long-grain basmati rice to 75% doneness with whole cardamom, cloves, and bay leaf.',
      'Layer spiced chicken curry with par-boiled rice, top with saffron milk and coriander, and steam (dum) on low heat for 15 minutes.'
    ],
    healthBenefits: [
      'High bioavailable protein from lean chicken supports muscle repair.',
      'Probiotic yogurt marinade aids digestion and reduces oil requirement.'
    ],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'desi-karahi',
    title: 'Chicken Karahi',
    category: 'Pakistani',
    imageUrl:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    calories: 380,
    proteinG: 28,
    carbsG: 12,
    fatG: 18,
    fiberG: 3,
    cookTimeMin: 25,
    difficulty: 'Easy',
    isVeg: false,
    ingredients: [
      { item: 'Bone-in / Boneless Chicken', grams: 180 },
      { item: 'Fresh Vine Tomatoes', grams: 140 },
      { item: 'Ginger Juliennes, Garlic & Green Chilies', grams: 35 },
      { item: 'Crushed Coriander, Cumin & Black Pepper', grams: 10 },
      { item: 'Heart-Healthy Cooking Oil', grams: 15 }
    ],
    instructions: [
      'Sear chicken pieces with crushed garlic and ginger in a wok (karahi) over medium-high heat.',
      'Add halved tomatoes, cover for 8 minutes, then peel off tomato skins and mash into a rich gravy.',
      'Season with freshly crushed black pepper, roasted cumin, and garnish with ginger juliennes and green chilies.'
    ],
    healthBenefits: [
      'Rich in lycopene and Vitamin C from fresh tomatoes.',
      'Low-carbohydrate, high-protein traditional Pakistani entrée.'
    ],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'chinese-manchurian',
    title: 'Chicken Manchurian',
    category: 'Chinese',
    imageUrl:
      'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80',
    calories: 320,
    proteinG: 22,
    carbsG: 36,
    fatG: 9,
    fiberG: 3,
    cookTimeMin: 20,
    difficulty: 'Easy',
    isVeg: false,
    ingredients: [
      { item: 'Diced Chicken Breast', grams: 150 },
      { item: 'Bell Peppers, Spring Onions & Garlic', grams: 80 },
      { item: 'Tomato Puree & Low-Sodium Soy Sauce', grams: 50 },
      { item: 'Cornstarch Slurry & Sesame Seeds', grams: 15 }
    ],
    instructions: [
      'Pan-sear lightly coated chicken cubes in a non-stick wok until golden.',
      'Sauté minced garlic, ginger, and crunchy bell peppers on high flame.',
      'Pour in tomato-soy glaze, simmer for 3 minutes until glossy, and garnish with spring onions.'
    ],
    healthBenefits: [
      'Pan-seared instead of deep-fried to cut saturated fat by 60%.',
      'Packed with antioxidants from colorful bell peppers and garlic.'
    ],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'italian-alfredo',
    title: 'Pasta Alfredo',
    category: 'Italian',
    imageUrl:
      'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80',
    calories: 540,
    proteinG: 18,
    carbsG: 52,
    fatG: 22,
    fiberG: 5,
    cookTimeMin: 20,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Durum Wheat Fettuccine Pasta', grams: 110 },
      { item: 'Low-Fat Milk & Greek Yogurt Cream Base', grams: 100 },
      { item: 'Grated Parmesan Cheese', grams: 25 },
      { item: 'Garlic, Parsley & Olive Oil', grams: 20 }
    ],
    instructions: [
      'Boil fettuccine pasta in salted water until al dente and reserve 1/4 cup pasta water.',
      'Sauté minced garlic in olive oil, whisk in warm milk-yogurt base and parmesan until velvety.',
      'Toss pasta in the sauce and top with fresh parsley and cracked black pepper.'
    ],
    healthBenefits: [
      'Provides sustained complex carbohydrates and calcium.',
      'Lighter yogurt-milk emulsion lowers heavy cream cholesterol.'
    ],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'pak-mutton-biryani',
    title: 'Mutton Biryani',
    category: 'Pakistani',
    imageUrl:
      'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
    calories: 490,
    proteinG: 27,
    carbsG: 46,
    fatG: 18,
    fiberG: 3,
    cookTimeMin: 55,
    difficulty: 'Hard',
    isVeg: false,
    ingredients: [
      { item: 'Lean Mutton Pieces', grams: 150 },
      { item: 'Aged Basmati Rice', grams: 120 },
      { item: 'Yogurt, Onions & Whole Garam Masala', grams: 80 }
    ],
    instructions: [
      'Tenderize lean mutton with ginger, garlic, yogurt, and whole spices until soft.',
      'Layer with par-boiled aromatic basmati rice, mint leaves, and saffron, then steam for 20 minutes.'
    ],
    healthBenefits: ['Rich source of heme iron, Vitamin B12, and zinc.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'desi-veg-biryani',
    title: 'Vegetable Biryani',
    category: 'Desi',
    imageUrl:
      'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?auto=format&fit=crop&w=600&q=80',
    calories: 340,
    proteinG: 10,
    carbsG: 54,
    fatG: 8,
    fiberG: 7,
    cookTimeMin: 35,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Basmati Rice', grams: 120 },
      { item: 'Carrots, Peas, Cauliflower & Green Beans', grams: 150 },
      { item: 'Yogurt & Biryani Spices', grams: 50 }
    ],
    instructions: [
      'Sauté seasonal vegetables with cumin, ginger, and yogurt masala.',
      'Layer with fragrant basmati rice and fresh mint and cook on dum for 12 minutes.'
    ],
    healthBenefits: ['High dietary fiber supports gut health and satiety.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'pak-mutton-karahi',
    title: 'Mutton Karahi',
    category: 'Pakistani',
    imageUrl:
      'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=600&q=80',
    calories: 440,
    proteinG: 30,
    carbsG: 10,
    fatG: 24,
    fiberG: 2,
    cookTimeMin: 45,
    difficulty: 'Medium',
    isVeg: false,
    ingredients: [
      { item: 'Lean Mutton', grams: 170 },
      { item: 'Fresh Tomatoes & Green Chilies', grams: 130 },
      { item: 'Ginger, Garlic & Black Pepper', grams: 25 }
    ],
    instructions: [
      'Simmer mutton with garlic and water until tender, then add fresh tomatoes and reduce on high flame.',
      'Finish with freshly crushed black pepper, coriander seeds, and ginger strips.'
    ],
    healthBenefits: ['High protein and iron for stamina and muscle recovery.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'pak-nihari',
    title: 'Lean Beef / Chicken Nihari',
    category: 'Pakistani',
    imageUrl:
      'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80',
    calories: 430,
    proteinG: 32,
    carbsG: 18,
    fatG: 20,
    fiberG: 2,
    cookTimeMin: 50,
    difficulty: 'Hard',
    isVeg: false,
    ingredients: [
      { item: 'Lean Shank Meat / Chicken', grams: 170 },
      { item: 'Whole Wheat Flour Slurry', grams: 25 },
      { item: 'Fennel, Dry Ginger (Sonth) & Nihari Spices', grams: 15 }
    ],
    instructions: [
      'Slow-braise lean meat with aromatic fennel, dry ginger, and cardamom.',
      'Thicken gently with roasted whole-wheat flour slurry and garnish with lemon, ginger, and green chilies.'
    ],
    healthBenefits: ['Rich in collagen, iron, and warming digestive spices.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'pak-haleem',
    title: 'Shahi Daleem / Haleem',
    category: 'Pakistani',
    imageUrl:
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    calories: 390,
    proteinG: 26,
    carbsG: 42,
    fatG: 11,
    fiberG: 8,
    cookTimeMin: 45,
    difficulty: 'Medium',
    isVeg: false,
    ingredients: [
      { item: 'Mixed Lentils (Chana, Masoor, Moong, Mash)', grams: 90 },
      { item: 'Cracked Wheat (Daliya) & Oats', grams: 40 },
      { item: 'Shredded Lean Chicken / Beef', grams: 110 }
    ],
    instructions: [
      'Boil lentils and cracked wheat until creamy, blend with shredded spiced meat, and top with lemon and ginger.'
    ],
    healthBenefits: ['Complete amino acid profile with high soluble fiber.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'pak-paya',
    title: 'Traditional Trotters (Paya Soup)',
    category: 'Pakistani',
    imageUrl:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80',
    calories: 360,
    proteinG: 25,
    carbsG: 8,
    fatG: 22,
    fiberG: 1,
    cookTimeMin: 60,
    difficulty: 'Hard',
    isVeg: false,
    ingredients: [
      { item: 'Cleaned Mutton / Beef Trotters', grams: 200 },
      { item: 'Onions, Garlic, Cinnamon & Black Cardamom', grams: 60 }
    ],
    instructions: [
      'Slow-simmer trotters with garlic, onions, and whole spices to extract a collagen-rich broth; skim excess fat before serving.'
    ],
    healthBenefits: ['Natural collagen and glucosamine support joint health.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'desi-daal-chawal',
    title: 'Daal Chawal (Comfort Bowl)',
    category: 'Desi',
    imageUrl:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
    calories: 350,
    proteinG: 14,
    carbsG: 56,
    fatG: 7,
    fiberG: 7,
    cookTimeMin: 25,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Yellow Moong & Masoor Daal', grams: 140 },
      { item: 'Steamed Basmati / Brown Rice', grams: 130 },
      { item: 'Garlic & Cumin Tarka in 1 tsp Olive Oil', grams: 15 }
    ],
    instructions: [
      'Simmer yellow lentils with turmeric and garlic until velvety, finish with cumin tarka, and serve over steamed rice.'
    ],
    healthBenefits: ['Light on digestion and forms a complete plant protein.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'desi-daal-makhani',
    title: 'Daal Makhani',
    category: 'Desi',
    imageUrl:
      'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?auto=format&fit=crop&w=600&q=80',
    calories: 330,
    proteinG: 15,
    carbsG: 40,
    fatG: 11,
    fiberG: 8,
    cookTimeMin: 35,
    difficulty: 'Medium',
    isVeg: true,
    ingredients: [
      { item: 'Whole Black Lentils (Sabut Urad) & Rajma', grams: 160 },
      { item: 'Tomato Puree, Ginger & Light Yogurt Cream', grams: 70 }
    ],
    instructions: [
      'Slow-simmer soaked black lentils and kidney beans with tomato puree and fenugreek leaves.'
    ],
    healthBenefits: ['High in folate, iron, and slow-digesting complex carbs.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'desi-chana-masala',
    title: 'Lahori Chana Masala',
    category: 'Desi',
    imageUrl:
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
    calories: 290,
    proteinG: 14,
    carbsG: 42,
    fatG: 7,
    fiberG: 9,
    cookTimeMin: 25,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Boiled White Chickpeas (Kabuli Chana)', grams: 160 },
      { item: 'Onion-Tomato Gravy & Roasted Cumin', grams: 80 }
    ],
    instructions: [
      'Simmer boiled chickpeas in spiced tomato-onion masala and garnish with coriander and lemon juice.'
    ],
    healthBenefits: ['Low glycemic index helps stabilize blood glucose levels.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'desi-palak-paneer',
    title: 'Palak Paneer',
    category: 'Desi',
    imageUrl:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    calories: 320,
    proteinG: 18,
    carbsG: 14,
    fatG: 20,
    fiberG: 5,
    cookTimeMin: 25,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Fresh Spinach Leaves (Blanched)', grams: 180 },
      { item: 'Cottage Cheese (Paneer) Cubes', grams: 100 }
    ],
    instructions: [
      'Blend blanched spinach with green chilies and simmer gently with lightly seared paneer cubes and garlic.'
    ],
    healthBenefits: ['Loaded with iron, calcium, Vitamin K, and protein.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'desi-aloo-gobi',
    title: 'Aloo Gobi Masala',
    category: 'Desi',
    imageUrl:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
    calories: 240,
    proteinG: 6,
    carbsG: 34,
    fatG: 8,
    fiberG: 6,
    cookTimeMin: 20,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Cauliflower Florets (Gobi)', grams: 150 },
      { item: 'Diced Potatoes (Aloo) & Turmeric', grams: 90 }
    ],
    instructions: [
      'Steam-sauté cauliflower and potatoes with cumin, turmeric, ginger, and tomatoes until tender.'
    ],
    healthBenefits: ['Rich in Vitamin C, choline, and anti-inflammatory curcumin.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'desi-bhindi-masala',
    title: 'Bhindi Masala (Okra Stir-Fry)',
    category: 'Desi',
    imageUrl:
      'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    calories: 210,
    proteinG: 5,
    carbsG: 22,
    fatG: 10,
    fiberG: 6,
    cookTimeMin: 20,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Fresh Ladyfinger / Okra (Bhindi)', grams: 170 },
      { item: 'Sliced Onions, Tomatoes & Amchoor', grams: 80 }
    ],
    instructions: [
      'Sauté dry-wiped sliced okra with onions, tomatoes, coriander powder, and tangy mango powder.'
    ],
    healthBenefits: ['Soluble mucilage fiber in okra supports blood sugar balance.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'pak-seekh-kebab',
    title: 'Grilled Seekh Kebab',
    category: 'Pakistani',
    imageUrl:
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80',
    calories: 280,
    proteinG: 29,
    carbsG: 6,
    fatG: 15,
    fiberG: 1,
    cookTimeMin: 20,
    difficulty: 'Medium',
    isVeg: false,
    ingredients: [
      { item: 'Lean Minced Chicken / Beef', grams: 160 },
      { item: 'Minced Onion, Coriander, Mint & Spices', grams: 40 }
    ],
    instructions: [
      'Mix lean mince with herbs and roasted gram flour, thread onto skewers, and grill over charcoal or air-fry.'
    ],
    healthBenefits: ['High-protein, low-carb keto-friendly grilled dish.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'pak-chapli-kebab',
    title: 'Peshawari Chapli Kebab (Light)',
    category: 'Pakistani',
    imageUrl:
      'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80',
    calories: 330,
    proteinG: 26,
    carbsG: 9,
    fatG: 20,
    fiberG: 2,
    cookTimeMin: 20,
    difficulty: 'Easy',
    isVeg: false,
    ingredients: [
      { item: 'Lean Beef / Chicken Mince', grams: 150 },
      { item: 'Crushed Coriander, Pomegranate Seeds (Anardana) & Tomato', grams: 45 }
    ],
    instructions: [
      'Shape spiced mince patties with a tomato slice in the center and pan-sear in minimal olive oil.'
    ],
    healthBenefits: ['Packed with protein and digestive pomegranate seeds.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'pak-shami-kebab',
    title: 'Shami Kebab (Chicken & Chana Daal)',
    category: 'Pakistani',
    imageUrl:
      'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80',
    calories: 250,
    proteinG: 21,
    carbsG: 18,
    fatG: 9,
    fiberG: 4,
    cookTimeMin: 30,
    difficulty: 'Medium',
    isVeg: false,
    ingredients: [
      { item: 'Shredded Chicken Breast', grams: 110 },
      { item: 'Boiled Chana Daal & Egg Wash', grams: 80 }
    ],
    instructions: [
      'Boil chicken and chana daal with whole spices, grind into smooth patties, and shallow-sear on a non-stick tawa.'
    ],
    healthBenefits: ['Balanced combination of lean poultry protein and lentil fiber.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'pak-chicken-tikka',
    title: 'Charcoal Chicken Tikka',
    category: 'Pakistani',
    imageUrl:
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80',
    calories: 260,
    proteinG: 35,
    carbsG: 5,
    fatG: 9,
    fiberG: 1,
    cookTimeMin: 25,
    difficulty: 'Easy',
    isVeg: false,
    ingredients: [
      { item: 'Chicken Breast / Quarter Piece', grams: 180 },
      { item: 'Yogurt, Lemon Juice & Tikka Masala', grams: 45 }
    ],
    instructions: [
      'Marinate chicken in spiced yogurt and lemon juice, then grill or bake at 200°C for 22 minutes.'
    ],
    healthBenefits: ['Ultra-lean, high-protein meal ideal for fat loss and diabetes.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'pak-malai-boti',
    title: 'Chicken Malai Boti',
    category: 'Pakistani',
    imageUrl:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
    calories: 310,
    proteinG: 29,
    carbsG: 6,
    fatG: 18,
    fiberG: 1,
    cookTimeMin: 25,
    difficulty: 'Easy',
    isVeg: false,
    ingredients: [
      { item: 'Boneless Chicken Cubes', grams: 160 },
      { item: 'Greek Yogurt, White Pepper & Garlic Paste', grams: 50 }
    ],
    instructions: [
      'Marinate boneless chicken in creamy Greek yogurt and white pepper, skewer, and grill until juicy.'
    ],
    healthBenefits: ['Mild spices make it gentle for sensitive stomachs and acidity.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'pak-chicken-handi',
    title: 'Mughlai Chicken Handi',
    category: 'Pakistani',
    imageUrl:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    calories: 390,
    proteinG: 27,
    carbsG: 14,
    fatG: 23,
    fiberG: 2,
    cookTimeMin: 30,
    difficulty: 'Medium',
    isVeg: false,
    ingredients: [
      { item: 'Boneless Chicken Cubes', grams: 160 },
      { item: 'Tomato-Yogurt Gravy & Kasuri Methi', grams: 90 }
    ],
    instructions: [
      'Cook boneless chicken in a clay pot or pan with tomato-yogurt gravy and dried fenugreek leaves.'
    ],
    healthBenefits: ['Rich in protein and B-vitamins.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'pak-keema-matar',
    title: 'Keema Matar (Mince & Peas)',
    category: 'Pakistani',
    imageUrl:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
    calories: 350,
    proteinG: 28,
    carbsG: 16,
    fatG: 18,
    fiberG: 5,
    cookTimeMin: 30,
    difficulty: 'Easy',
    isVeg: false,
    ingredients: [
      { item: 'Lean Chicken / Beef Mince', grams: 150 },
      { item: 'Green Peas (Matar) & Onion-Tomato Masala', grams: 100 }
    ],
    instructions: [
      'Brown lean mince with ginger-garlic and simmer with sweet green peas and garam masala.'
    ],
    healthBenefits: ['Combines high animal protein with fiber-rich green peas.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'desi-saag-makki',
    title: 'Sarson ka Saag & Makki ki Roti',
    category: 'Desi',
    imageUrl:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    calories: 360,
    proteinG: 11,
    carbsG: 48,
    fatG: 13,
    fiberG: 8,
    cookTimeMin: 40,
    difficulty: 'Medium',
    isVeg: true,
    ingredients: [
      { item: 'Mustard Greens (Sarson) & Spinach', grams: 200 },
      { item: 'Maize Flour Flatbread (Makki ki Roti)', grams: 80 }
    ],
    instructions: [
      'Slow-cook mustard greens and spinach with ginger and maize meal, and serve with warm gluten-free makki roti.'
    ],
    healthBenefits: ['Naturally gluten-free and rich in iron, folate, and lutein.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'desi-pakora',
    title: 'Air-Fried Vegetable Pakora',
    category: 'Desi',
    imageUrl:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    calories: 220,
    proteinG: 8,
    carbsG: 28,
    fatG: 8,
    fiberG: 5,
    cookTimeMin: 15,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Chickpea Flour (Besan)', grams: 60 },
      { item: 'Spinach, Onion & Potato Juliennes', grams: 90 }
    ],
    instructions: [
      'Coat vegetables in spiced chickpea batter and air-fry at 190°C for 12 minutes until crisp.'
    ],
    healthBenefits: ['Uses chickpea flour for lower glycemic impact and 70% less oil.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'desi-samosa',
    title: 'Baked Whole-Wheat Samosa',
    category: 'Desi',
    imageUrl:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    calories: 240,
    proteinG: 7,
    carbsG: 34,
    fatG: 8,
    fiberG: 4,
    cookTimeMin: 25,
    difficulty: 'Medium',
    isVeg: true,
    ingredients: [
      { item: 'Whole Wheat Pastry Wrapper', grams: 50 },
      { item: 'Spiced Potato & Green Pea Filling', grams: 90 }
    ],
    instructions: [
      'Fill whole-wheat cones with roasted cumin potato-pea mash and bake until golden brown.'
    ],
    healthBenefits: ['Baked instead of deep-fried to avoid trans fats.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'pak-halwa-puri',
    title: 'Portion-Controlled Halwa Puri & Chana',
    category: 'Pakistani',
    imageUrl:
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
    calories: 520,
    proteinG: 13,
    carbsG: 64,
    fatG: 22,
    fiberG: 6,
    cookTimeMin: 30,
    difficulty: 'Medium',
    isVeg: true,
    ingredients: [
      { item: '1 Whole-Wheat Puff Puri + Chickpea Curry', grams: 160 },
      { item: 'Semolina (Sooji) Halwa with Almonds', grams: 60 }
    ],
    instructions: [
      'Pair 1 light whole-wheat puri with protein-rich Lahori chana and a small spoon of cardamom semolina halwa.'
    ],
    healthBenefits: ['Portion-controlled weekend treat balanced with chickpea protein.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'desi-kheer',
    title: 'Badami Rice Kheer (Low Sugar)',
    category: 'Desi',
    imageUrl:
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    calories: 230,
    proteinG: 8,
    carbsG: 32,
    fatG: 7,
    fiberG: 1,
    cookTimeMin: 35,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Low-Fat Milk & Crushed Basmati Rice', grams: 180 },
      { item: 'Sliced Almonds, Pistachios & Cardamom', grams: 20 }
    ],
    instructions: [
      'Slow-simmer milk with crushed rice and green cardamom, sweeten lightly, and garnish with almonds.'
    ],
    healthBenefits: ['Good source of dairy calcium and healthy nut fats.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'desi-gajar-halwa',
    title: 'Gajar ka Halwa (Carrot Pudding)',
    category: 'Desi',
    imageUrl:
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80',
    calories: 260,
    proteinG: 7,
    carbsG: 34,
    fatG: 10,
    fiberG: 4,
    cookTimeMin: 35,
    difficulty: 'Medium',
    isVeg: true,
    ingredients: [
      { item: 'Grated Red Winter Carrots', grams: 180 },
      { item: 'Reduced Milk (Khoya) & Walnuts', grams: 45 }
    ],
    instructions: [
      'Cook grated red carrots in milk with cardamom and top with toasted walnuts and almonds.'
    ],
    healthBenefits: ['Rich in beta-carotene (Vitamin A) for eye and skin health.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'pak-zarda',
    title: 'Saffron Meethe Chawal (Zarda)',
    category: 'Pakistani',
    imageUrl:
      'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    calories: 290,
    proteinG: 5,
    carbsG: 48,
    fatG: 8,
    fiberG: 2,
    cookTimeMin: 30,
    difficulty: 'Medium',
    isVeg: true,
    ingredients: [
      { item: 'Saffron Basmati Rice', grams: 120 },
      { item: 'Almonds, Raisins & Cloves', grams: 25 }
    ],
    instructions: [
      'Steam saffron-infused rice with cardamom and dry fruits in a measured small portion.'
    ],
    healthBenefits: ['Quick energy booster with antioxidant saffron threads.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },

  // --- CHINESE (7 MORE RECIPES) ---
  {
    id: 'chinese-fried-rice',
    title: 'Egg & Vegetable Fried Rice',
    category: 'Chinese',
    imageUrl:
      'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80',
    calories: 340,
    proteinG: 14,
    carbsG: 48,
    fatG: 9,
    fiberG: 4,
    cookTimeMin: 15,
    difficulty: 'Easy',
    isVeg: false,
    ingredients: [
      { item: 'Chilled Steamed Rice', grams: 140 },
      { item: '2 Scrambled Eggs, Carrots, Peas & Spring Onion', grams: 110 }
    ],
    instructions: [
      'Wok-toss vegetables and scrambled eggs with rice, sesame oil, and low-sodium soy sauce.'
    ],
    healthBenefits: ['Balanced macro profile with colorful vegetable micronutrients.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'chinese-chowmein',
    title: 'Chicken & Vegetable Chowmein',
    category: 'Chinese',
    imageUrl:
      'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80',
    calories: 370,
    proteinG: 21,
    carbsG: 46,
    fatG: 10,
    fiberG: 4,
    cookTimeMin: 20,
    difficulty: 'Easy',
    isVeg: false,
    ingredients: [
      { item: 'Whole-Wheat Hakka Noodles', grams: 120 },
      { item: 'Chicken Strips, Cabbage & Capsicum', grams: 130 }
    ],
    instructions: [
      'Stir-fry chicken strips and crunchy julienned vegetables with boiled noodles on high heat.'
    ],
    healthBenefits: ['High-protein stir-fry loaded with cruciferous cabbage fiber.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'chinese-hot-sour-soup',
    title: 'Hot and Sour Soup',
    category: 'Chinese',
    imageUrl:
      'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80',
    calories: 180,
    proteinG: 16,
    carbsG: 16,
    fatG: 5,
    fiberG: 2,
    cookTimeMin: 18,
    difficulty: 'Easy',
    isVeg: false,
    ingredients: [
      { item: 'Shredded Chicken, Tofu & Wood Ear Mushrooms', grams: 140 },
      { item: 'Chicken Broth, Vinegar & Egg Ribbon', grams: 180 }
    ],
    instructions: [
      'Simmer broth with mushrooms, shredded chicken, and bamboo shoots; swirl in beaten egg and rice vinegar.'
    ],
    healthBenefits: ['Low-calorie, high-satiety soup ideal for weight loss dinners.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'chinese-spring-rolls',
    title: 'Baked Vegetable Spring Rolls',
    category: 'Chinese',
    imageUrl:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    calories: 210,
    proteinG: 6,
    carbsG: 30,
    fatG: 7,
    fiberG: 4,
    cookTimeMin: 20,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Thin Rice Paper / Wheat Wrappers', grams: 50 },
      { item: 'Shredded Cabbage, Carrots & Bean Sprouts', grams: 110 }
    ],
    instructions: [
      'Wrap stir-fried crunchy vegetables in thin sheets, brush with sesame oil, and bake until crisp.'
    ],
    healthBenefits: ['Light, crunchy appetizer with minimal oil.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'chinese-sweet-sour',
    title: 'Sweet and Sour Chicken',
    category: 'Chinese',
    imageUrl:
      'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80',
    calories: 350,
    proteinG: 23,
    carbsG: 39,
    fatG: 10,
    fiberG: 3,
    cookTimeMin: 22,
    difficulty: 'Easy',
    isVeg: false,
    ingredients: [
      { item: 'Chicken Breast Cubes', grams: 150 },
      { item: 'Pineapple Chunks, Bell Peppers & Onions', grams: 100 }
    ],
    instructions: [
      'Sear chicken pieces and toss with pineapple chunks, bell peppers, and tangy tomato-vinegar glaze.'
    ],
    healthBenefits: ['Bromelain enzyme in pineapple aids protein digestion.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'chinese-kung-pao',
    title: 'Kung Pao Chicken',
    category: 'Chinese',
    imageUrl:
      'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80',
    calories: 360,
    proteinG: 27,
    carbsG: 20,
    fatG: 18,
    fiberG: 3,
    cookTimeMin: 20,
    difficulty: 'Medium',
    isVeg: false,
    ingredients: [
      { item: 'Diced Chicken Breast', grams: 160 },
      { item: 'Roasted Peanuts, Dried Chilies & Zucchini', grams: 60 }
    ],
    instructions: [
      'Stir-fry chicken with Sichuan aromatics, zucchini, and crunchy roasted peanuts.'
    ],
    healthBenefits: ['High protein with heart-healthy monounsaturated fats.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'chinese-chili-dry',
    title: 'Chicken Chili Dry',
    category: 'Chinese',
    imageUrl:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    calories: 310,
    proteinG: 29,
    carbsG: 14,
    fatG: 14,
    fiberG: 2,
    cookTimeMin: 18,
    difficulty: 'Easy',
    isVeg: false,
    ingredients: [
      { item: 'Sliced Lean Chicken Strips', grams: 160 },
      { item: 'Green Chilies, Ginger Juliennes & Oyster Sauce', grams: 50 }
    ],
    instructions: [
      'Flash-fry lean chicken strips with ginger juliennes, green chilies, and savory oyster-soy sauce.'
    ],
    healthBenefits: ['High-protein, low-carb stir-fry with metabolism-boosting capsaicin.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },

  // --- ITALIAN & CONTINENTAL (8 MORE RECIPES) ---
  {
    id: 'italian-bolognese',
    title: 'Spaghetti Bolognese (Lean Meat)',
    category: 'Italian',
    imageUrl:
      'https://images.unsplash.com/photo-1622973536968-3ead9e780960?auto=format&fit=crop&w=600&q=80',
    calories: 460,
    proteinG: 26,
    carbsG: 50,
    fatG: 14,
    fiberG: 6,
    cookTimeMin: 25,
    difficulty: 'Easy',
    isVeg: false,
    ingredients: [
      { item: 'Whole-Wheat Spaghetti', grams: 110 },
      { item: 'Lean Minced Beef/Chicken & Herb Tomato Ragù', grams: 160 }
    ],
    instructions: [
      'Simmer lean mince with crushed tomatoes, oregano, basil, and garlic, and serve over whole-wheat spaghetti.'
    ],
    healthBenefits: ['High protein and lycopene-rich Italian tomato sauce.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'italian-margherita',
    title: 'Thin-Crust Margherita Pizza',
    category: 'Italian',
    imageUrl:
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    calories: 440,
    proteinG: 19,
    carbsG: 48,
    fatG: 16,
    fiberG: 4,
    cookTimeMin: 20,
    difficulty: 'Medium',
    isVeg: true,
    ingredients: [
      { item: 'Thin Whole-Wheat Pizza Base', grams: 110 },
      { item: 'Fresh Mozzarella, San Marzano Tomato & Basil', grams: 100 }
    ],
    instructions: [
      'Top thin whole-wheat crust with crushed tomatoes, fresh mozzarella, and basil leaves; bake at 220°C for 12 minutes.'
    ],
    healthBenefits: ['Portion-controlled thin crust provides calcium and antioxidants.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'italian-lasagna',
    title: 'High-Protein Chicken & Spinach Lasagna',
    category: 'Italian',
    imageUrl:
      'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?auto=format&fit=crop&w=600&q=80',
    calories: 480,
    proteinG: 31,
    carbsG: 42,
    fatG: 18,
    fiberG: 5,
    cookTimeMin: 40,
    difficulty: 'Hard',
    isVeg: false,
    ingredients: [
      { item: 'Lasagna Sheets', grams: 90 },
      { item: 'Lean Chicken Mince, Spinach & Ricotta Cheese', grams: 180 }
    ],
    instructions: [
      'Layer lasagna sheets with lean chicken marinara, wilted spinach, and light ricotta; bake until bubbly.'
    ],
    healthBenefits: ['Complete meal packing 31g protein with iron-rich spinach.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'italian-garlic-bread',
    title: 'Herb & Olive Oil Garlic Bread',
    category: 'Italian',
    imageUrl:
      'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=600&q=80',
    calories: 220,
    proteinG: 6,
    carbsG: 28,
    fatG: 9,
    fiberG: 3,
    cookTimeMin: 10,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Artisan Multigrain Baguette Slices', grams: 75 },
      { item: 'Roasted Garlic, Extra-Virgin Olive Oil & Parsley', grams: 20 }
    ],
    instructions: [
      'Brush multigrain bread with roasted garlic paste and olive oil; toast for 7 minutes until crisp.'
    ],
    healthBenefits: ['Uses heart-healthy extra-virgin olive oil and allicin-rich garlic.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'continental-caesar-salad',
    title: 'Grilled Chicken Caesar Salad',
    category: 'Continental',
    imageUrl:
      'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=600&q=80',
    calories: 310,
    proteinG: 28,
    carbsG: 14,
    fatG: 14,
    fiberG: 4,
    cookTimeMin: 15,
    difficulty: 'Easy',
    isVeg: false,
    ingredients: [
      { item: 'Romaine Lettuce & Grilled Chicken Strips', grams: 180 },
      { item: 'Yogurt Caesar Dressing, Parmesan & Croutons', grams: 45 }
    ],
    instructions: [
      'Toss crisp romaine lettuce with warm grilled chicken breast, light yogurt-caesar dressing, and shaved parmesan.'
    ],
    healthBenefits: ['Low-calorie, high-protein lunch ideal for blood sugar control.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'continental-chicken-steak',
    title: 'Grilled Chicken Steak with Veggies',
    category: 'Continental',
    imageUrl:
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80',
    calories: 380,
    proteinG: 38,
    carbsG: 18,
    fatG: 14,
    fiberG: 5,
    cookTimeMin: 25,
    difficulty: 'Medium',
    isVeg: false,
    ingredients: [
      { item: 'Herb-Marinated Chicken Breast Fillet', grams: 180 },
      { item: 'Steamed Broccoli, Carrots & Peppercorn Jus', grams: 130 }
    ],
    instructions: [
      'Sear herb-marinated chicken breast on a cast-iron grill pan and serve with steamed vegetables and light pepper sauce.'
    ],
    healthBenefits: ['Delivers 38g of lean protein for muscle building and fat loss.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'continental-mashed-potatoes',
    title: 'Creamy Olive-Oil Mashed Potatoes',
    category: 'Continental',
    imageUrl:
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    calories: 230,
    proteinG: 5,
    carbsG: 34,
    fatG: 8,
    fiberG: 4,
    cookTimeMin: 20,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Boiled Potatoes', grams: 160 },
      { item: 'Warm Skim Milk, Olive Oil & Chives', grams: 40 }
    ],
    instructions: [
      'Mash boiled potatoes with warm milk, roasted garlic, and a drizzle of olive oil; garnish with fresh chives.'
    ],
    healthBenefits: ['High in potassium to support healthy blood pressure.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'continental-club-sandwich',
    title: 'Multigrain Chicken Club Sandwich',
    category: 'Continental',
    imageUrl:
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    calories: 410,
    proteinG: 27,
    carbsG: 38,
    fatG: 15,
    fiberG: 5,
    cookTimeMin: 15,
    difficulty: 'Easy',
    isVeg: false,
    ingredients: [
      { item: '3 Slices Toasted Multigrain Bread', grams: 90 },
      { item: 'Grilled Chicken, Boiled Egg, Lettuce & Tomato', grams: 140 }
    ],
    instructions: [
      'Layer toasted multigrain bread with grilled chicken breast, sliced boiled egg, tomato, cucumber, and mustard-yogurt spread.'
    ],
    healthBenefits: ['High-fiber multigrain bread keeps energy steady for hours.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },

  // --- HEALTHY SUPERFOOD BOWLS (5 RECIPES) ---
  {
    id: 'healthy-quinoa-bowl',
    title: 'Mediterranean Quinoa Power Bowl',
    category: 'Healthy',
    imageUrl:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    calories: 340,
    proteinG: 15,
    carbsG: 44,
    fatG: 11,
    fiberG: 8,
    cookTimeMin: 20,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Cooked Tri-Color Quinoa', grams: 130 },
      { item: 'Chickpeas, Cucumber, Cherry Tomatoes & Olive Oil', grams: 120 }
    ],
    instructions: [
      'Fluff cooked quinoa and top with roasted chickpeas, diced cucumber, tomatoes, and lemon-olive dressing.'
    ],
    healthBenefits: ['Complete plant protein with all 9 essential amino acids.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'healthy-smoothie-bowl',
    title: 'Antioxidant Berry Smoothie Bowl',
    category: 'Healthy',
    imageUrl:
      'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80',
    calories: 290,
    proteinG: 16,
    carbsG: 38,
    fatG: 8,
    fiberG: 7,
    cookTimeMin: 10,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Greek Yogurt, Mixed Berries & Half Banana', grams: 190 },
      { item: 'Chia Seeds, Almonds & Pumpkin Seeds', grams: 25 }
    ],
    instructions: [
      'Blend Greek yogurt and frozen berries until thick, pour into a bowl, and top with chia seeds and sliced almonds.'
    ],
    healthBenefits: ['Rich in probiotics, omega-3s, and polyphenols.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'healthy-avocado-toast',
    title: 'Poached Egg & Avocado Sourdough Toast',
    category: 'Healthy',
    imageUrl:
      'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    calories: 310,
    proteinG: 14,
    carbsG: 26,
    fatG: 16,
    fiberG: 6,
    cookTimeMin: 10,
    difficulty: 'Easy',
    isVeg: false,
    ingredients: [
      { item: 'Whole-Grain Sourdough Slice', grams: 65 },
      { item: 'Mashed Hass Avocado & 1 Poached Egg', grams: 110 }
    ],
    instructions: [
      'Spread mashed lemon-seasoned avocado over toasted sourdough and crown with a poached egg and chili flakes.'
    ],
    healthBenefits: ['Heart-healthy monounsaturated fats support HDL cholesterol.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'healthy-oats-porridge',
    title: 'Cinnamon & Almond Oats Porridge',
    category: 'Healthy',
    imageUrl:
      'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=600&q=80',
    calories: 280,
    proteinG: 12,
    carbsG: 42,
    fatG: 7,
    fiberG: 6,
    cookTimeMin: 10,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Rolled Oats & Skim Milk', grams: 190 },
      { item: 'Ceylon Cinnamon, Apple & Crushed Almonds', grams: 45 }
    ],
    instructions: [
      'Simmer rolled oats in milk with cinnamon until creamy and top with diced apple and almonds.'
    ],
    healthBenefits: ['Beta-glucan soluble fiber actively lowers LDL cholesterol.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'healthy-greek-salad',
    title: 'Mediterranean Greek Feta Salad',
    category: 'Healthy',
    imageUrl:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    calories: 230,
    proteinG: 9,
    carbsG: 14,
    fatG: 15,
    fiberG: 4,
    cookTimeMin: 10,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Cucumber, Tomatoes, Bell Peppers & Red Onion', grams: 180 },
      { item: 'Feta Cheese, Kalamata Olives & Oregano Olive Oil', grams: 55 }
    ],
    instructions: [
      'Combine crisp diced vegetables with olives and feta cubes; drizzle with extra-virgin olive oil and lemon.'
    ],
    healthBenefits: ['Low-glycemic, hydrating salad rich in antioxidants.'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  }
];

// ============================================================================
// PART 5: HEALTH CONDITION RECOMMENDED & AVOID FOODS (MATCHING IMAGE 3)
// Supports preset conditions AND any custom condition typed by the user!
// ============================================================================
export const HEALTH_CONDITION_DATABASE: Record<
  string,
  HealthConditionRecommendationData
> = {
  diabetes: {
    conditionName: 'Diabetes',
    summaryAdvice:
      'Keep blood sugar stable with low glycemic, high fiber foods. Focus on balanced portions, regular meals, and stay hydrated. Aim for protein + fiber at each meal to help maintain steady energy.',
    updatedLabel: 'Updated Oct 2024',
    recommendedFoods: [
      {
        name: 'Leafy Greens (Palak, Methi, Kale)',
        iconType: 'leaf',
        shortNote: 'High in fiber, helps regulate blood sugar',
        caloriesPer100g: 25,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Grilled Salmon / Rohu Fish',
        iconType: 'fish',
        shortNote: 'Rich in omega-3s, supports heart health',
        caloriesPer100g: 206,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Lentils (Moong & Masoor Daal)',
        iconType: 'bowl',
        shortNote: 'Low GI, sustained energy & protein',
        caloriesPer100g: 116,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Bitter Gourd (Karela) & Jamun',
        iconType: 'leaf',
        shortNote: 'Natural plant compounds support insulin sensitivity',
        caloriesPer100g: 34,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ],
    foodsToAvoid: [
      {
        name: 'Sugary Cereals & Mithai',
        iconType: 'cereal',
        shortNote: 'High sugar spikes blood glucose rapidly',
        caloriesPer100g: 380,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'White Bread & Maida Naan',
        iconType: 'bread',
        shortNote: 'Refined carbs cause rapid sugar increase',
        caloriesPer100g: 265,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Fried Foods (Pakora, Samosa, Fries)',
        iconType: 'fried',
        shortNote: 'High in unhealthy fats, may increase insulin resistance',
        caloriesPer100g: 312,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ]
  },
  'high blood pressure': {
    conditionName: 'High Blood Pressure',
    summaryAdvice:
      'Follow a DASH-style low-sodium, high-potassium diet. Reduce table salt, pickles, and processed meats while increasing fresh vegetables, banana, spinach, and omega-3 rich foods.',
    updatedLabel: 'Updated Oct 2024',
    recommendedFoods: [
      {
        name: 'Spinach & Beetroot (Chukandar)',
        iconType: 'leaf',
        shortNote: 'Natural nitrates help relax blood vessels & lower BP',
        caloriesPer100g: 43,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Bananas & Coconut Water',
        iconType: 'bowl',
        shortNote: 'High potassium flushes excess sodium from the body',
        caloriesPer100g: 89,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Oats & Flaxseeds (Alsi)',
        iconType: 'grain',
        shortNote: 'Soluble fiber supports healthy arterial pressure',
        caloriesPer100g: 150,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ],
    foodsToAvoid: [
      {
        name: 'Salty Pickles (Achar) & Papad',
        iconType: 'fried',
        shortNote: 'Excess sodium directly elevates blood pressure',
        caloriesPer100g: 180,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Canned & Processed Meats',
        iconType: 'meat',
        shortNote: 'High hidden sodium and preservatives strain arteries',
        caloriesPer100g: 290,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Deep-Fried Salty Snacks & Chips',
        iconType: 'cereal',
        shortNote: 'Trans fats and salt increase hypertension risk',
        caloriesPer100g: 510,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ]
  },
  cholesterol: {
    conditionName: 'Cholesterol',
    summaryAdvice:
      'Focus on soluble fiber (beta-glucan in oats, lentils) and healthy omega-3 fats (walnuts, fish, olive oil) to lower LDL bad cholesterol and raise HDL protective cholesterol.',
    updatedLabel: 'Updated Oct 2024',
    recommendedFoods: [
      {
        name: 'Oats Porridge & Barley (Jau)',
        iconType: 'grain',
        shortNote: 'Beta-glucan fiber binds and reduces LDL cholesterol',
        caloriesPer100g: 140,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Walnuts (Akhrot) & Almonds',
        iconType: 'bowl',
        shortNote: 'Plant sterols and omega-3s protect blood vessels',
        caloriesPer100g: 580,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Grilled Fatty Fish & Olive Oil',
        iconType: 'fish',
        shortNote: 'Boosts HDL good cholesterol and lowers triglycerides',
        caloriesPer100g: 200,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ],
    foodsToAvoid: [
      {
        name: 'Vanaspati Ghee & Bakery Pastries',
        iconType: 'bread',
        shortNote: 'Trans fats sharply raise LDL cholesterol & plaque risk',
        caloriesPer100g: 450,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Fatty Red Meat & Organ Meats',
        iconType: 'meat',
        shortNote: 'High saturated fat increases serum cholesterol',
        caloriesPer100g: 330,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Deep-Fried Fast Food',
        iconType: 'fried',
        shortNote: 'Oxidized frying oils damage cardiovascular health',
        caloriesPer100g: 360,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ]
  },
  pcos: {
    conditionName: 'PCOS (Polycystic Ovary Syndrome)',
    summaryAdvice:
      'Manage insulin resistance and hormonal balance with anti-inflammatory whole foods, high-protein meals, spearmint tea, flaxseeds, and low-glycemic complex carbohydrates.',
    updatedLabel: 'Updated Oct 2024',
    recommendedFoods: [
      {
        name: 'Flaxseeds (Alsi) & Chia Seeds',
        iconType: 'grain',
        shortNote: 'Lignans help balance excess androgen hormones naturally',
        caloriesPer100g: 486,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Leafy Greens & Cruciferous Veggies',
        iconType: 'leaf',
        shortNote: 'Supports estrogen metabolism and reduces inflammation',
        caloriesPer100g: 35,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Lean Chicken, Eggs & Lentils',
        iconType: 'bowl',
        shortNote: 'High protein stabilizes insulin and curbs sugar cravings',
        caloriesPer100g: 165,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ],
    foodsToAvoid: [
      {
        name: 'Sugary Drinks, Sodas & Desserts',
        iconType: 'cereal',
        shortNote: 'Spikes insulin which worsens ovarian androgen levels',
        caloriesPer100g: 390,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Refined White Flour (Maida, Naan, Pasta)',
        iconType: 'bread',
        shortNote: 'Triggers rapid glucose spikes and weight gain',
        caloriesPer100g: 270,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Processed & Deep-Fried Foods',
        iconType: 'fried',
        shortNote: 'Increases systemic inflammation and hormone imbalance',
        caloriesPer100g: 340,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ]
  },
  thyroid: {
    conditionName: 'Thyroid Health',
    summaryAdvice:
      'Support optimal thyroid hormone synthesis (T3 & T4) with selenium, zinc, iodine-balanced whole foods, and anti-inflammatory protein while cooking goitrogenic vegetables thoroughly.',
    updatedLabel: 'Updated Oct 2024',
    recommendedFoods: [
      {
        name: 'Eggs, Fish & Brazil Nuts / Seeds',
        iconType: 'fish',
        shortNote: 'Rich in selenium & iodine needed for T4 to T3 conversion',
        caloriesPer100g: 185,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Cooked Spinach, Berries & Yogurt',
        iconType: 'bowl',
        shortNote: 'Provides antioxidants, probiotics, and B-vitamins',
        caloriesPer100g: 95,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Lentils, Chickpeas & Pumpkin Seeds',
        iconType: 'grain',
        shortNote: 'High in zinc and iron which support thyroid metabolism',
        caloriesPer100g: 140,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ],
    foodsToAvoid: [
      {
        name: 'Uncooked Raw Cabbage / Kale in Excess',
        iconType: 'leaf',
        shortNote: 'Raw goitrogens can interfere with iodine uptake',
        caloriesPer100g: 30,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Highly Processed Soy & Junk Foods',
        iconType: 'fried',
        shortNote: 'May hinder thyroid medication absorption if taken close together',
        caloriesPer100g: 310,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Refined Sugar & Excess Caffeine',
        iconType: 'cereal',
        shortNote: 'Aggravates fatigue, cortisol spikes, and weight retention',
        caloriesPer100g: 370,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ]
  },
  'heart disease': {
    conditionName: 'Heart Disease',
    summaryAdvice:
      'Prioritize a cardioprotective Mediterranean & healthy Desi diet rich in omega-3 fatty acids, leafy greens, oats, berries, and olive oil while eliminating trans fats and excess sodium.',
    updatedLabel: 'Updated Oct 2024',
    recommendedFoods: [
      {
        name: 'Grilled Fish (Salmon, Sardines, Rohu)',
        iconType: 'fish',
        shortNote: 'Omega-3 EPA/DHA reduces arterial inflammation',
        caloriesPer100g: 205,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Leafy Greens, Tomatoes & Garlic',
        iconType: 'leaf',
        shortNote: 'Allicin and lycopene support healthy vascular tone',
        caloriesPer100g: 32,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Oats, Lentils & Walnuts',
        iconType: 'bowl',
        shortNote: 'Lowers LDL cholesterol and improves endothelial health',
        caloriesPer100g: 155,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ],
    foodsToAvoid: [
      {
        name: 'Deep-Fried Pakoras, Samosas & Parathas',
        iconType: 'fried',
        shortNote: 'Saturated and trans fats accelerate coronary plaque',
        caloriesPer100g: 350,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'High-Sodium Processed Foods & Pickles',
        iconType: 'cereal',
        shortNote: 'Raises blood volume and cardiac workload',
        caloriesPer100g: 260,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Sugary Beverages & White Bakery Items',
        iconType: 'bread',
        shortNote: 'Increases triglycerides and metabolic strain',
        caloriesPer100g: 340,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ]
  },
  acidity: {
    conditionName: 'Acidity & GERD (Reflux)',
    summaryAdvice:
      'Eat smaller, frequent alkaline-friendly meals. Avoid lying down within 2 hours after dinner, and choose soothing foods like yogurt, oats, bananas, and fennel (saunf).',
    updatedLabel: 'Updated Oct 2024',
    recommendedFoods: [
      {
        name: 'Cold Yogurt (Dahi) & Buttermilk (Lassi)',
        iconType: 'bowl',
        shortNote: 'Natural probiotics soothe stomach lining & neutralize acid',
        caloriesPer100g: 65,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Oatmeal, Bananas & Sweet Melon',
        iconType: 'grain',
        shortNote: 'Alkaline, high-fiber foods absorb excess gastric acid',
        caloriesPer100g: 95,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Boiled Moong Daal Khichdi & Fennel Water',
        iconType: 'leaf',
        shortNote: 'Gentle on digestion and prevents esophageal reflux',
        caloriesPer100g: 120,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ],
    foodsToAvoid: [
      {
        name: 'Heavy Spicy Karahi, Red Chili & Nihari',
        iconType: 'fried',
        shortNote: 'Capsaicin and heavy oil irritate gastric mucosa',
        caloriesPer100g: 340,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Strong Chai, Coffee & Carbonated Sodas',
        iconType: 'cereal',
        shortNote: 'Relaxes lower esophageal sphincter causing acid reflux',
        caloriesPer100g: 110,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Late-Night Fried Fast Food & Citrus',
        iconType: 'bread',
        shortNote: 'Delays stomach emptying and triggers nocturnal heartburn',
        caloriesPer100g: 310,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ]
  },
  anemia: {
    conditionName: 'Anemia (Iron Deficiency)',
    summaryAdvice:
      'Boost hemoglobin stores by pairing iron-rich foods (spinach, lentils, beetroot, lean meat, dates) with Vitamin C (lemon, guava, orange) to maximize iron absorption, and avoid tea/coffee right after meals.',
    updatedLabel: 'Updated Oct 2024',
    recommendedFoods: [
      {
        name: 'Spinach (Palak), Beetroot & Pomegranate',
        iconType: 'leaf',
        shortNote: 'Rich in non-heme iron, folate, and blood-building nutrients',
        caloriesPer100g: 55,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Lean Meat, Liver (Kaleji) & Eggs',
        iconType: 'fish',
        shortNote: 'Highly bioavailable heme iron & Vitamin B12',
        caloriesPer100g: 190,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Black Chickpeas (Kala Chana), Dates & Lemon',
        iconType: 'bowl',
        shortNote: 'Vitamin C in lemon triples plant-iron absorption',
        caloriesPer100g: 165,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ],
    foodsToAvoid: [
      {
        name: 'Chai or Coffee Immediately With Meals',
        iconType: 'cereal',
        shortNote: 'Tannins and polyphenols block up to 60% of iron absorption',
        caloriesPer100g: 70,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'High-Calcium Supplements At Same Time as Iron',
        iconType: 'bread',
        shortNote: 'Calcium competes with iron for intestinal absorption',
        caloriesPer100g: 120,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Nutrient-Poor Junk Food & Soda',
        iconType: 'fried',
        shortNote: 'Displaces iron-dense whole foods from your daily diet',
        caloriesPer100g: 340,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ]
  }
};

export function getHealthConditionRecommendations(
  query: string
): HealthConditionRecommendationData {
  const clean = (query || 'Diabetes').trim();
  const lower = clean.toLowerCase();

  for (const [key, data] of Object.entries(HEALTH_CONDITION_DATABASE)) {
    if (lower.includes(key) || key.includes(lower)) {
      return data;
    }
  }
  if (lower.includes('bp') || lower.includes('blood pressure') || lower.includes('hypertension')) {
    return HEALTH_CONDITION_DATABASE['high blood pressure'];
  }
  if (lower.includes('sugar') || lower.includes('diabetic')) {
    return HEALTH_CONDITION_DATABASE.diabetes;
  }
  if (lower.includes('acid') || lower.includes('gerd') || lower.includes('ulcer') || lower.includes('stomach')) {
    return HEALTH_CONDITION_DATABASE.acidity;
  }
  if (lower.includes('iron') || lower.includes('hb') || lower.includes('hemoglobin')) {
    return HEALTH_CONDITION_DATABASE.anemia;
  }
  if (lower.includes('heart') || lower.includes('cardiac')) {
    return HEALTH_CONDITION_DATABASE['heart disease'];
  }

  // Dynamic personalized fallback for ANY custom condition typed by the user (e.g., Uric Acid, Fatty Liver, Kidney Stones, Migraine, IBS, etc.)
  return {
    conditionName: clean,
    summaryAdvice: `For ${clean}, focus on anti-inflammatory whole foods, adequate hydration (8+ glasses daily), lean proteins, and high-fiber vegetables while minimizing ultra-processed foods, refined sugars, and excess trans fats.`,
    updatedLabel: 'Updated Oct 2024',
    recommendedFoods: [
      {
        name: 'Fresh Leafy Greens & Steamed Vegetables',
        iconType: 'leaf',
        shortNote: `Rich in antioxidants & micronutrients supportive for ${clean}`,
        caloriesPer100g: 32,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Grilled Fish / Lean Protein & Yogurt',
        iconType: 'fish',
        shortNote: 'Provides anti-inflammatory omega-3s & tissue repair amino acids',
        caloriesPer100g: 165,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Yellow Moong Lentils & Whole Oats',
        iconType: 'bowl',
        shortNote: 'Easy-to-digest soluble fiber for steady metabolic balance',
        caloriesPer100g: 125,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ],
    foodsToAvoid: [
      {
        name: 'Refined Sugar, Sodas & Confectionery',
        iconType: 'cereal',
        shortNote: `Triggers systemic inflammation and worsens ${clean} symptoms`,
        caloriesPer100g: 385,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'White Flour (Maida) & Bakery Products',
        iconType: 'bread',
        shortNote: 'Low fiber and high glycemic load strain metabolism',
        caloriesPer100g: 280,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      },
      {
        name: 'Deep-Fried Fast Food & Hydrogenated Oils',
        iconType: 'fried',
        shortNote: 'High trans fats and sodium aggravate chronic conditions',
        caloriesPer100g: 350,
        disclaimer: DOCTOR_DISCLAIMER_SHORT
      }
    ]
  };
}

// ============================================================================
// PART 6: DESI & GLOBAL FOOD DATABASE + SUPPLEMENTS GUIDE + AI DIETITIAN QA
// ============================================================================
export const DESI_FOOD_LOG_DATABASE: {
  name: string;
  grams: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  barcode: string;
}[] = [
  { name: '1 Whole Wheat Roti (Chapati)', grams: 80, calories: 120, proteinG: 4, carbsG: 24, fatG: 1, barcode: '89610001' },
  { name: '1 Tandoori Naan', grams: 110, calories: 260, proteinG: 7, carbsG: 50, fatG: 4, barcode: '89610002' },
  { name: 'Chicken Biryani (1 Plate)', grams: 250, calories: 420, proteinG: 24, carbsG: 45, fatG: 13, barcode: '89610003' },
  { name: 'Tarka Daal (1 Bowl)', grams: 150, calories: 180, proteinG: 12, carbsG: 26, fatG: 4, barcode: '89610004' },
  { name: 'Doodh Patti Chai (1 Cup)', grams: 180, calories: 110, proteinG: 4, carbsG: 14, fatG: 4, barcode: '89610005' },
  { name: 'Chicken Karahi (1 Serving)', grams: 180, calories: 380, proteinG: 28, carbsG: 12, fatG: 18, barcode: '89610006' },
  { name: '2 Boiled Eggs', grams: 100, calories: 155, proteinG: 13, carbsG: 1, fatG: 11, barcode: '89610007' },
  { name: 'Sada Paratha (1 Medium)', grams: 95, calories: 250, proteinG: 5, carbsG: 32, fatG: 11, barcode: '89610008' },
  { name: 'Chicken Tikka Breast (Grilled)', grams: 160, calories: 240, proteinG: 34, carbsG: 4, fatG: 8, barcode: '89610009' },
  { name: 'Chana Masala (1 Bowl)', grams: 160, calories: 240, proteinG: 13, carbsG: 34, fatG: 6, barcode: '89610010' },
  { name: 'Greek Yogurt / Dahi (1 Bowl)', grams: 120, calories: 100, proteinG: 10, carbsG: 6, fatG: 4, barcode: '89610011' },
  { name: 'Overnight Oats with Banana', grams: 220, calories: 340, proteinG: 13, carbsG: 56, fatG: 6, barcode: '89610012' }
];

export const SUPPLEMENTS_GUIDE_DATA: SupplementGuideItem[] = [
  {
    id: 'supp-vitd',
    name: 'Vitamin D3 + K2',
    dosageNote: '1,000 – 2,000 IU daily (or as prescribed after blood test)',
    bestTimeToTake: 'With Breakfast or Lunch (requires healthy dietary fat for absorption)',
    keyBenefit: 'Supports bone density, calcium absorption, immunity, and mood balance.',
    naturalFoodSources: ['Morning Sunlight (15 mins)', 'Egg Yolks', 'Salmon / Fatty Fish', 'Fortified Milk'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'supp-iron',
    name: 'Iron (Ferrous Bisglycinate)',
    dosageNote: 'For low ferritin/anemia as guided by CBC & ferritin lab test',
    bestTimeToTake: 'Empty stomach or with Lemon/Vitamin C (Avoid Chai/Coffee for 2 hours)',
    keyBenefit: 'Essential for hemoglobin synthesis, oxygen transport, and preventing fatigue.',
    naturalFoodSources: ['Spinach (Palak)', 'Black Chickpeas (Kala Chana)', 'Beetroot & Pomegranate', 'Lean Meat'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'supp-calcium',
    name: 'Calcium Citrate',
    dosageNote: '500 mg per dose (do not combine at the exact same hour as Iron)',
    bestTimeToTake: 'With Dinner or Post-Meal',
    keyBenefit: 'Strengthens bones, teeth, muscle contraction, and nerve signaling.',
    naturalFoodSources: ['Yogurt (Dahi)', 'Paneer & Milk', 'Sesame Seeds (Til)', 'Ragi & Almonds'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'supp-omega3',
    name: 'Omega-3 Fish Oil / Flaxseed Oil (EPA & DHA)',
    dosageNote: '1,000 mg daily providing combined EPA + DHA',
    bestTimeToTake: 'With Lunch or Dinner',
    keyBenefit: 'Lowers triglycerides, supports heart & brain health, and reduces joint inflammation.',
    naturalFoodSources: ['Salmon & Rohu Fish', 'Walnuts (Akhrot)', 'Chia Seeds', 'Flaxseeds (Alsi)'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'supp-b12',
    name: 'Vitamin B12 (Methylcobalamin)',
    dosageNote: 'Especially important for vegetarians or metformin users',
    bestTimeToTake: 'Morning with Breakfast',
    keyBenefit: 'Supports nerve health, red blood cell formation, and cellular energy.',
    naturalFoodSources: ['Eggs', 'Dairy Milk & Yogurt', 'Fish & Poultry', 'Nutritional Yeast'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  },
  {
    id: 'supp-magnesium',
    name: 'Magnesium Glycinate',
    dosageNote: '200 – 350 mg elemental magnesium',
    bestTimeToTake: '30–45 minutes before bedtime',
    keyBenefit: 'Promotes deep sleep quality, relieves muscle cramps, and regulates blood sugar.',
    naturalFoodSources: ['Pumpkin Seeds', 'Spinach', 'Almonds', 'Dark Chocolate & Black Beans'],
    disclaimer: DOCTOR_DISCLAIMER_SHORT
  }
];

export function generateDietitianAnswer(
  question: string,
  profile: SuiteOnboardingProfile,
  indexes: SuiteComputedIndexes
): string {
  const q = question.toLowerCase();

  if (q.includes('diabetes') || q.includes('sugar')) {
    return `For Diabetes management, prioritize low-glycemic, high-fiber meals: pair 1 whole-wheat Chakki Roti (80g) with Moong/Chana Daal (150g), Palak (Spinach), or Grilled Chicken/Fish (120g), and start lunch/dinner with a bowl of green cucumber salad. Avoid white naan, sugary chai, and fried snacks. ${DOCTOR_DISCLAIMER_CHAT}`;
  }

  if (q.includes('biryani')) {
    return `Yes, Chicken or Vegetable Biryani can fit into a healthy diet if portion-controlled! Limit your serving to 200g–220g (approx. 380–420 kcal), use skinless chicken breast and 1 tbsp olive oil, pair it with 80g cucumber-mint raita and a green salad, and eat it at lunch rather than late at night. ${DOCTOR_DISCLAIMER_CHAT}`;
  }

  if (q.includes('weight loss') || q.includes('lose weight') || q.includes('wazan')) {
    return `Based on your current BMI of ${indexes.bmi} (${indexes.bmiStatus}) and TDEE of ${indexes.tdeeKcal} kcal, aim for ${indexes.dailyCaloriesNeeded} kcal/day with ${indexes.targetProteinG}g protein. Eat 2 eggs or overnight oats for breakfast, 1 roti + daal/grilled chicken + salad for lunch, roasted chana/almonds for snack, and grilled tikka/fish with steamed vegetables for dinner, plus ${profile.dailyWaterGoalGlasses} glasses of water daily. ${DOCTOR_DISCLAIMER_CHAT}`;
  }

  if (q.includes('pcos') || q.includes('hormone')) {
    return `For PCOS, focus on improving insulin sensitivity: include 1 tbsp ground flaxseeds (alsi) + chia seeds daily, eat 25–30g protein per meal (eggs, chicken, lentils, paneer), drink spearmint or green tea, and avoid refined flour (maida) and sugary drinks. ${DOCTOR_DISCLAIMER_CHAT}`;
  }

  if (q.includes('blood pressure') || q.includes('bp') || q.includes('cholesterol')) {
    return `For Blood Pressure & Cholesterol, follow a low-sodium, high-fiber plan: start your morning with Oats Porridge + 5 Walnuts, include spinach, beetroot, garlic, and grilled fish in meals, keep salt under 1 tsp/day, and avoid pickles (achar), vanaspati ghee, and deep-fried items. ${DOCTOR_DISCLAIMER_CHAT}`;
  }

  return `For your goal (${profile.goal}) and ${profile.dietPreference} preference, your daily target is ${indexes.dailyCaloriesNeeded} kcal (${indexes.targetProteinG}g Protein, ${indexes.targetCarbsG}g Carbs, ${indexes.targetFatG}g Fat). Focus on whole grains, lean proteins, seasonal vegetables, and ${profile.dailyWaterGoalGlasses} glasses of water per day. ${DOCTOR_DISCLAIMER_CHAT}`;
}

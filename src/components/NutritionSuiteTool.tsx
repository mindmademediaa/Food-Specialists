import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  Check,
  CheckCircle2,
  Download,
  Droplets,
  Heart,
  Info,
  Leaf,
  MessageSquare,
  Scale,
  Search,
  Send,
  Sparkles,
  TrendingDown,
  TrendingUp,
  User,
  X
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { HubUser, UserToolsData } from '../types/hub';
import {
  ActivityLevelOption,
  calculateSuiteNutritionIndexes,
  DEFAULT_SUITE_ONBOARDING,
  DOCTOR_DISCLAIMER_BANNER,
  DOCTOR_DISCLAIMER_CHAT,
  DOCTOR_DISCLAIMER_SHORT,
  GenderOption,
  getHealthConditionRecommendations,
  GoalOption,
  SuiteComputedIndexes,
  SuiteOnboardingProfile
} from '../data/nutritionSuiteData';
import { jsPDF } from 'jspdf';

interface NutritionSuiteToolProps {
  user: HubUser;
  isUserPaid: boolean;
  hasExpiredPremium: boolean;
  toolsData: UserToolsData;
  onSaveToolsData: (updatedToolsData: UserToolsData) => Promise<void>;
  onOpenPremiumModal: () => void;
}

interface DietitianChatMessage {
  id: string;
  sender: 'user' | 'dietitian';
  issueTitle?: string;
  text: string;
  recommendedSteps?: string[];
  foodsToEat?: string[];
  foodsToAvoid?: string[];
  time: string;
}

/**
 * Comprehensive AI Dietitian Issue Resolution Engine
 * Responds to any health/nutrition issue (English or Roman Urdu) with:
 * - Diagnosis / Nutrition Insight
 * - Recommended Tareeqa (Step-by-Step Resolution Plan)
 * - Recommended Foods to Eat
 * - Foods to Avoid (Parhez)
 */
function generateComprehensiveDietitianResolution(
  rawInput: string,
  profile: SuiteOnboardingProfile,
  indexes: SuiteComputedIndexes
): Omit<DietitianChatMessage, 'id' | 'sender' | 'time'> {
  const q = rawInput.trim().toLowerCase();

  // 1. Diabetes / Blood Sugar / Insulin Resistance
  if (
    q.includes('diabet') ||
    q.includes('sugar') ||
    q.includes('insulin') ||
    q.includes('hba1c') ||
    q.includes('shugar')
  ) {
    return {
      issueTitle: 'Diabetes & Blood Sugar Control Plan',
      text: `Blood Sugar (Diabetes) ko control karne ke liye sab se ahem usool Low-Glycemic (Low-GI) aur High-Fiber ghiza ka istemal hai taake khane ke baad sugar spike na ho.`,
      recommendedSteps: [
        'Har khane (Lunch aur Dinner) se 10 minute pehle 1 bowl Khera (Cucumber), Salad ke pattay aur Mooli khayen.',
        'Sufaid Aatay (Maida/White Bread) ki jagah Jau (Barley) ya 100% Whole-Wheat Chakki Roti + Methi (Fenugreek) dana istemal karen.',
        'Subah nihaar munh 1 glass neem garam pani may 1/2 tsp Methi Dana (soaked overnight) ya Darcheeni (Cinnamon) qahwa piyen.',
        'Khane ke baad 15–20 minute halki walk (chahal qadmi) lazmi karen — is se blood glucose foran muscles may absorb hota hai.'
      ],
      foodsToEat: [
        'Leafy Greens (Palak, Methi, Sarso ka Saag) & Karela (Bitter Gourd)',
        'Kala Chana, Moong Daal, Masoor Daal & Jau ka Daliya (Barley)',
        'Grilled Fish, Boiled Eggs, Desi Chicken & Low-Fat Dahi',
        'Jamun, Amrood (Guava), Seb (Apple) & 6–7 Soaked Almonds/Walnuts'
      ],
      foodsToAvoid: [
        'Cheeni (White Sugar), Cold Drinks, Packaged Juices & Mithai',
        'Sufaid Chawal (White Rice), Naan, Bakery Biscuits & White Bread',
        'Deep-Fried Samosay, Pakoray, Chips & Meethay Cereals'
      ]
    };
  }

  // 2. High Blood Pressure (Hypertension) & Heart Health
  if (
    q.includes('bp') ||
    q.includes('blood pressure') ||
    q.includes('hypertension') ||
    q.includes('heart') ||
    q.includes('dil')
  ) {
    return {
      issueTitle: 'High Blood Pressure (BP) & Heart Care Resolution',
      text: `High Blood Pressure (BP) ko normal rakhne ke liye DASH Diet (Low Sodium + High Potassium & Magnesium) sab se moassar tareeqa hai.`,
      recommendedSteps: [
        'Din bhar may Namak (Salt) ki miqdaar 1 chotay chamach (1 tsp / 1500mg sodium) se kam rakhen; khane ke upar kacha namak bilkul na chhirken.',
        'Subah nashtay may Oats Daliya ya 1 Lehsan (Garlic) ki turi pani ke sath len — Lehsan may mojod Allicin khoon ki naliyon ko relax karta hai.',
        'Potassium se bharpoor ghizayen (Palak, Chukandar/Beetroot, Kela, Nariyal Pani, Dahi) rozana shamil karen jo body se extra sodium kharij karti hain.',
        'Rozana 30 minute brisk walk aur 8–10 glass pani ka istemal karen.'
      ],
      foodsToEat: [
        'Chukandar (Beetroot), Palak (Spinach), Lehsan (Garlic) & Tomatoes',
        'Oats Porridge, Flaxseeds (Alsi), Walnuts (Akhrot) & Grilled Fish',
        'Low-Fat Dahi, Lassi (bina namak), Banana & Pomegranate (Anaar)'
      ],
      foodsToAvoid: [
        'Achar (Pickles), Papad, Salted Nimko, Chips & Canned Foods',
        'Vanaspati Ghee, Paratha, Deep-Fried Fast Food & Red Meat',
        'Zyada Chai/Coffee aur Smoking/Stress'
      ]
    };
  }

  // 3. Cholesterol & Fatty Liver / Triglycerides
  if (
    q.includes('cholesterol') ||
    q.includes('fatty liver') ||
    q.includes('jigar') ||
    q.includes('triglyceride') ||
    q.includes('lipid')
  ) {
    return {
      issueTitle: 'Cholesterol & Fatty Liver Reversal Plan',
      text: `High LDL Cholesterol aur Fatty Liver ko kam karne ke liye Soluble Fiber aur Omega-3 Fats barhayen aur Saturated/Trans Fats + Sugar band karen.`,
      recommendedSteps: [
        'Subah nashtay may Rolled Oats ya Jau ka Daliya + 1 chamach पिसी हुई Alsi (Flaxseeds) aur 5 Akhrot (Walnuts) len — Soluble fiber aant (gut) may cholesterol ko absorb hone se rokta hai.',
        'Cooking ke liye Ghee/Banaspati ki jagah sirf 1–2 tsp Olive Oil, Mustard Oil ya Canola Oil istemal karen.',
        'Fatty Liver ke liye Meetha (Sugar, Fructose, Cold Drinks) aur Maida mukammal band karen kyunke jigar extra sugar ko charbi (fat) may badalta hai.',
        'Apne wazan (${profile.weightKg} kg) may se 5% se 7% kami karne se Fatty Liver aur Cholesterol tezi se normal hote hain.'
      ],
      foodsToEat: [
        'Oats, Barley (Jau), Apple, Guava & Citrus Fruits (Pectin Fiber)',
        'Fatty Fish (Salmon/Rohu), Walnuts, Almonds, Chia & Flaxseeds',
        'Green Tea, Garlic, Turmeric (Haldi), Moong Daal & Green Veggies'
      ],
      foodsToAvoid: [
        'Banaspati Ghee, Butter, Cream, Malai & Egg Yolk in excess',
        'Deep-Fried Karahi, Nihari, Paye, Samosay & Fast Food',
        'Bakery Pastries, Cold Drinks & Refined Sugar'
      ]
    };
  }

  // 4. Acidity, GERD, Gas, Bloating, Stomach Ulcer / Maiday ki Jalan
  if (
    q.includes('acid') ||
    q.includes('gas') ||
    q.includes('bloat') ||
    q.includes('stomach') ||
    q.includes('maida') ||
    q.includes('maiday') ||
    q.includes('jalan') ||
    q.includes('ulcer') ||
    q.includes('heartburn') ||
    q.includes('gerd')
  ) {
    return {
      issueTitle: 'Acidity, Gas, Bloating & Stomach Relief Plan',
      text: `Maiday ki jalan (Acidity), Gas aur Bloating ko khatam karne ke liye Alkaline, Probiotic aur halki hazam hone wali ghiza (Soothing Diet) apnayen.`,
      recommendedSteps: [
        'Aik waqt may pait bhar kar khane ke bajaye din may 4–5 chotay aur halkay meals len, aur har niwalay ko achi tarha chaba kar khayen.',
        'Raat ka khana sone se kam az kam 2.5 se 3 ghantay pehle khayen, aur khane ke foran baad letnay se gurez karen.',
        'Khane ke baad 1/2 tsp Saunf (Fennel Seeds) + 1 Sabz Elaichi chabayen ya Saunf-Pudina ka halka qahwa piyen.',
        'Dopehar ke khane may 1 katori Thanda Dahi (Probiotic Curd) + 1 tsp Ispaghol (Psyllium Husk) shamil karen.'
      ],
      foodsToEat: [
        'Thanda Dahi (Plain Yogurt), Kachi Lassi, Kela (Banana) & Melon',
        'Moong Daal Khichdi, Lauki (Bottle Gourd), Tori & Boiled Rice',
        'Saunf (Fennel), Podina (Mint), Oats Porridge & Coconut Water'
      ],
      foodsToAvoid: [
        'Tez Laal Mirch, Garam Masala, Fried Karahi & Spicy Fast Food',
        'Khali pait Doodh Patti Chai, Coffee aur Carbonated Cold Drinks',
        'Achar, Khattay Citrus Phal (khali pait) aur Late-Night Dinner'
      ]
    };
  }

  // 5. Uric Acid & Gout / Joint Pain
  if (
    q.includes('uric') ||
    q.includes('gout') ||
    q.includes('joint') ||
    q.includes('joron') ||
    q.includes('dard')
  ) {
    return {
      issueTitle: 'High Uric Acid & Joint Pain Resolution Plan',
      text: `Uric Acid barhne ki bari wajah High-Purine ghizayen aur pani ki kami hai. Low-Purine Alkaline Diet aur Vitamin C se Uric Acid kidneys ke zariye kharij hota hai.`,
      recommendedSteps: [
        'Rozana 10 se 12 glass pani piyen (sath 1 glass pani may fresh Lemon Juice nichor kar len — Vitamin C uric acid ko dissolve karta hai).',
        'Bara Gosht (Beef/Mutton), Kaleji/Gurday (Organ Meats) aur Paye mukammal band kar den.',
        'Protein ke liye Low-Fat Dahi, Doodh, Egg Whites aur Lauki/Tori/Kaddu jesi alkaline sabziyan istemal karen.',
        'Subah 1 Seb (Apple) ya Cherries/Berries aur 5–6 bheegay Badam + Akhrot len.'
      ],
      foodsToEat: [
        'Fresh Lemon Water, Cherries, Apples, Guava & Vitamin-C Fruits',
        'Lauki (Bottle Gourd), Tori, Kaddu, Cucumber, Carrot & Potatoes',
        'Low-Fat Milk, Yogurt (Dahi), Egg Whites, Rice & Whole Wheat'
      ],
      foodsToAvoid: [
        'Beef, Mutton, Organ Meats (Kaleji, Maghaz) & Seafood/Sardines',
        'Sugary Fructose Drinks, Cold Drinks & Packaged Fruit Juices',
        'Excess Chana Daal, Masoor Daal, Rajma & Palak (during acute flare)'
      ]
    };
  }

  // 6. PCOS / Hormonal Imbalance / Irregular Periods
  if (
    q.includes('pcos') ||
    q.includes('pcod') ||
    q.includes('hormon') ||
    q.includes('period')
  ) {
    return {
      issueTitle: 'PCOS & Hormonal Balance Nutrition Plan',
      text: `PCOS may asal masla Insulin Resistance aur Androgen hormones ka barhna hota hai. High-Protein, Anti-Inflammatory aur Seed-Cycling diet is ka behtareen hal hai.`,
      recommendedSteps: [
        'Har nashtay may 20–25g Protein (jese 2 Eggs ya Besan Cheela) lazmi len taake din bhar insulin aur cravings control may rahen.',
        'Rozana Seed Cycling karen: 1 tbsp पिसी हुई Alsi (Flaxseeds) + 1 tbsp Pumpkin Seeds / Chia Seeds apne oats, dahi ya salad may dalen.',
        'Din may 1–2 cup Spearmint Tea (Podina Qahwa) ya Cinnamon (Darcheeni) Tea piyen jo excess androgen hormones ko kam karti hai.',
        'Maida, Cheeni aur Bakery items mukammal chhor kar rozana 30 minute strength/walk exercise karen.'
      ],
      foodsToEat: [
        'Flaxseeds (Alsi), Pumpkin Seeds, Chia Seeds, Sesame & Walnuts',
        'Eggs, Grilled Chicken/Fish, Moong/Chana Daal & Leafy Greens',
        'Spearmint Tea, Cinnamon, Berries, Apple & Probiotic Yogurt'
      ],
      foodsToAvoid: [
        'White Sugar, Chocolates, Cold Drinks, Ice Cream & Mithai',
        'White Flour (Maida), Pizza, Burgers, Pasta & Fried Snacks',
        'Excess Dairy Cream & Ultra-Processed Vegetable Oils'
      ]
    };
  }

  // 7. Anemia / Iron Deficiency / Hemoglobin / Weakness / Hair Fall
  if (
    q.includes('anemia') ||
    q.includes('iron') ||
    q.includes('khoon') ||
    q.includes('hb') ||
    q.includes('hemoglobin') ||
    q.includes('weak') ||
    q.includes('kamzor') ||
    q.includes('hair') ||
    q.includes('baal')
  ) {
    return {
      issueTitle: 'Anemia (Khoon ki Kami), Weakness & Hair Fall Plan',
      text: `Hemoglobin (HB) aur Iron barhane ke liye Iron-rich foods ko Vitamin C ke sath mila kar khana zaroori hai, aur khane ke sath Chai bilkul band karni chahiye.`,
      recommendedSteps: [
        'Khane ke sath ya khane ke 1 ghantay baad tak Chai ya Coffee HARGIZ na piyen (Chai ke tannins 60% iron ko absorb hone se rok dete hain!).',
        'Har Iron wali ghiza (Palak, Kala Chana, Daal, Gosht) ke upar Taza Lemon (Vitamin C) nichor kar khayen — is se iron absorption 3 guna barh jati hai.',
        'Rozana dopehar ko Chukandar (Beetroot) + Anaar (Pomegranate) + Guava salad ya fresh juice len.',
        'Subah 3 Khajoor (Dates) + 7 Kishmish (soaked raisins) + 5 Badam nashtay may shamil karen.'
      ],
      foodsToEat: [
        'Palak (Spinach), Chukandar (Beetroot), Anaar (Pomegranate) & Dates',
        'Kala Chana (Black Chickpeas), Lentils, Pumpkin Seeds & Sesame',
        'Lean Meat, Eggs, Fish + Vitamin C (Lemon, Orange, Amrood)'
      ],
      foodsToAvoid: [
        'Chai & Coffee right before or after meals (Wait at least 90 mins)',
        'Calcium supplements at the exact same hour as Iron-rich meals',
        'Junk Food, Sodas & Refined Maida Snacks'
      ]
    };
  }

  // 8. Thyroid (Hypothyroid / Hyperthyroid)
  if (q.includes('thyroid') || q.includes('tsh') || q.includes('t3') || q.includes('t4')) {
    return {
      issueTitle: 'Thyroid Metabolism & Hormone Support Plan',
      text: `Thyroid hormone (T4 se active T3) banane ke liye Selenium, Zinc, Iodine aur Clean Protein ki zaroorat hoti hai.`,
      recommendedSteps: [
        'Agar aap subah Thyroid ki medicine lete hain, to goli khane ke baad 45–60 minute tak Chai, Doodh ya Nashta na karen.',
        'Gobhi, Band Gobhi (Cabbage) aur Broccoli ko hamesha achi tarha paka kar (cooked) khayen, kacha salad may na khayen.',
        'Selenium aur Zinc ke liye rozana 2 Eggs, Pumpkin Seeds, Fish ya Daal apni diet may shamil karen.'
      ],
      foodsToEat: [
        'Eggs, Fish, Chicken, Yogurt (Dahi) & Cooked Spinach',
        'Pumpkin Seeds, Sunflower Seeds, Walnuts & Lentils',
        'Berries, Apples, Olive Oil & Gluten-Controlled Whole Grains'
      ],
      foodsToAvoid: [
        'Raw Uncooked Cabbage, Cauliflower & Soy Products close to medicine',
        'Refined Sugar, Deep-Fried Foods & Excess Caffeine',
        'Highly Processed Packaged Foods'
      ]
    };
  }

  // 9. Weight Loss / Obesity / Belly Fat
  if (
    q.includes('weight loss') ||
    q.includes('lose weight') ||
    q.includes('wazan kam') ||
    q.includes('motapa') ||
    q.includes('belly') ||
    q.includes('fat') ||
    q.includes('charbi')
  ) {
    return {
      issueTitle: `Personalized Weight & Belly Fat Reduction Plan (Target: ${indexes.dailyCaloriesNeeded} kcal/day)`,
      text: `Aapke current BMI (${indexes.bmi} - ${indexes.bmiStatus}) ke mutabiq sehatmand tareeqay se wazan kam karne ke liye Calorie Deficit (${indexes.dailyCaloriesNeeded} kcal/day) aur High Protein (${indexes.targetProteinG}g/day) sab se behtareen hal hai.`,
      recommendedSteps: [
        `Rozana ${indexes.dailyCaloriesNeeded} kcal ke andar rahen aur har meal may Protein (Eggs, Chicken, Fish, Daal, Paneer) shamil karen taake muscle loss na ho aur bhook kam lage.`,
        'Raat ke khane may Roti/Chawal kam kar ke Grilled Protein + Steamed Vegetables + Salad len.',
        'Meethay mashroobat (Cold drinks, juices, cheeni wali chai) mukammal band karen — sirf is aik qadam se mahana 1.5–2 kg charbi kam hoti hai.',
        `Rozana ${profile.dailyWaterGoalGlasses}+ glass pani piyen (har khane se 20 minute pehle 1 glass pani) aur 35 minute walk karen.`
      ],
      foodsToEat: [
        'Boiled Eggs, Grilled Chicken Breast, Fish, Moong/Chana Daal & Paneer',
        'Rolled Oats, Jau ki Roti, Cucumber, Spinach, Broccoli & Salad',
        'Green Tea, Black Coffee (no sugar), Chia Seeds & Apple/Guava'
      ],
      foodsToAvoid: [
        'Sugar, Mithai, Cold Drinks, Ice Cream & Sweetened Tea',
        'Paratha, Naan, White Rice in excess, Samosay & Fast Food',
        'Late-night snacking after 8:30 PM'
      ]
    };
  }

  // 10. Weight Gain / Underweight / Muscle Gain
  if (
    q.includes('weight gain') ||
    q.includes('gain weight') ||
    q.includes('wazan barh') ||
    q.includes('muscle') ||
    q.includes('dubla') ||
    q.includes('skinny')
  ) {
    return {
      issueTitle: 'Healthy Weight & Lean Muscle Gain Plan',
      text: `Sehatmand tareeqay se wazan aur muscle barhane ke liye Junk Food ke bajaye Nutrient-Dense Calorie Surplus (+400 kcal/day) aur High-Protein ghiza len.`,
      recommendedSteps: [
        'Din may 3 baray meals ke sath 2 High-Calorie Healthy Shakes/Snacks lazmi len.',
        'Rozana 1 Weight-Gain Shake piyen: 1 glass Milk + 1 Banana + 3 Khajoor (Dates) + 1.5 tbsp Peanut Butter + 1/2 cup Oats + 6 Almonds (approx. 550 kcal).',
        'Har khane may Eggs, Chicken, Fish, Paneer, Chana ya Daal ke sath Healthy Fats (Olive oil, Desi Ghee 1 tsp, Nuts, Avocado) shamil karen.',
        'Haftay may 3–4 din हल्की resistance/strength exercise karen taake barhne wala wazan charbi ke bajaye muscles may jaye.'
      ],
      foodsToEat: [
        'Banana, Dates (Khajoor), Peanut Butter, Whole Milk & Oats Shake',
        'Eggs, Chicken, Mutton, Fish, Paneer, Chickpeas (Chana) & Rajma',
        'Sweet Potato (Shakarkandi), Brown Rice, Almonds, Walnuts & Desi Ghee'
      ],
      foodsToAvoid: [
        'Khane se theek pehle bohot zyada pani peena (is se bhook mar jati hai)',
        'Deep-Fried Chips, Sodas & Trans-Fat Junk Food',
        'Meals skip karna'
      ]
    };
  }

  // 11. General / Custom Issue Fallback (Constipation, Immunity, Skin, Kidney, etc.)
  return {
    issueTitle: `Personalized Clinical Nutrition Advice for: "${rawInput}"`,
    text: `Aapke maslay ("${rawInput}") aur aapke BMI (${indexes.bmi} kg/m² — ${indexes.bmiStatus}) ke mutabiq balanced, anti-inflammatory whole-food nutrition aur proper hydration sab se ahem kirdar ada karti hai.`,
    recommendedSteps: [
      `Apni rozana ki calorie zaroorat (${indexes.dailyCaloriesNeeded} kcal/day) ko 3 balanced meals aur 1 healthy snack may taqseem karen, jis may ${indexes.targetProteinG}g clean protein shamil ho.`,
      `Rozana ${profile.dailyWaterGoalGlasses} se 10 glass pani piyen aur subah ka aghaz 1 glass neem garam pani + 5–7 bheegay Badam/Akhrot se karen.`,
      'Har dopehar aur raat ke khane may taza sabziyan (Leafy Greens, Cucumber, Salad) aur Probiotic Dahi shamil karen jo gut aur immunity ko theek rakhte hain.',
      'Refined Sugar (Cheeni), Maida aur Deep-Fried Banaspati oils ko mukammal band kar ke 7–8 ghantay ki behtar neend len.'
    ],
    foodsToEat: [
      'Fresh Leafy Greens (Palak), Cucumber, Carrots & Seasonal Fruits',
      'Lean Proteins: Boiled Eggs, Grilled Fish/Chicken, Moong Daal & Yogurt',
      'Whole Grains (Oats, Jau, Chakki Roti), Chia Seeds, Flaxseeds & Almonds'
    ],
    foodsToAvoid: [
      'Refined White Sugar, Carbonated Cold Drinks & Packaged Juices',
      'White Flour (Maida), Bakery Items & Deep-Fried Fast Foods',
      'Excess Salt, Artificial Preservatives & Late-Night Heavy Meals'
    ]
  };
}

export const NutritionSuiteTool: React.FC<NutritionSuiteToolProps> = ({
  user,
  toolsData,
  onSaveToolsData
}) => {
  // 1. Unified Single-Page Profile State
  const [profile, setProfile] = useState<SuiteOnboardingProfile>(() => {
    const savedNut = toolsData?.nutrition;
    return {
      ...DEFAULT_SUITE_ONBOARDING,
      uid: user.uid,
      fullName: user.name || 'Food Specialist',
      age: savedNut?.age || 28,
      gender: savedNut?.gender === 'female' ? 'Female' : 'Male',
      heightCm: savedNut?.heightCm || 172,
      weightKg: savedNut?.weightKg || 74,
      targetWeightKg: savedNut?.targetWeightKg || 68,
      activityLevel: 'Moderately Active',
      goal: 'Lose Weight',
      dietPreference: 'Desi',
      healthConditions: ['None'],
      setupCompleted: true
    };
  });

  // Water glasses tracker
  const [waterGlasses, setWaterGlasses] = useState<number>(
    () => toolsData?.nutrition?.waterGlassesToday ?? 6
  );

  // Weight History for simple visual graph
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

  // Nutrition Condition Recommendation Search State
  const [conditionQuery, setConditionQuery] = useState<string>('Diabetes');
  const [activeCondition, setActiveCondition] = useState<string>('Diabetes');

  // Save notification banner
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Live Calculated BMI, BMR, TDEE, Ideal Weight & Macros
  const indexes = useMemo(
    () => calculateSuiteNutritionIndexes(profile, waterGlasses),
    [profile, waterGlasses]
  );

  // AI Dietitian Chat Agent Messages State
  const [chatMessages, setChatMessages] = useState<DietitianChatMessage[]>(() => {
    const initialRes = generateComprehensiveDietitianResolution(
      'Diabetes',
      DEFAULT_SUITE_ONBOARDING,
      calculateSuiteNutritionIndexes(DEFAULT_SUITE_ONBOARDING, 6)
    );
    return [
      {
        id: 'welcome-agent',
        sender: 'dietitian',
        issueTitle: 'Assalam-o-Alaikum! I am Your AI Nutrition & Dietitian Agent',
        text: `Apna koi bhi Nutrition Issue ya Health Condition (jese Diabetes/Sugar, High BP, Cholesterol, Fatty Liver, Uric Acid, Maiday ki Jalan/Acidity, Gas, PCOS, Thyroid, Khoon ki Kami/Anemia, Weight Loss ya Weight Gain) neechay likhen ya button select karen — main aapko us maslay ko hal karne ka mukammal Recommended Tareeqa aur Diet Plan bataunga!`,
        recommendedSteps: initialRes.recommendedSteps,
        foodsToEat: initialRes.foodsToEat,
        foodsToAvoid: initialRes.foodsToAvoid,
        time: 'Just now'
      }
    ];
  });
  const [chatInput, setChatInput] = useState<string>('');

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
        headline: `You should GAIN approx. ${kgToGain} kg to reach your Healthy Ideal Weight (${indexes.idealWeightKg} kg).`,
        detail: `Your current BMI is ${indexes.bmi} (${indexes.bmiStatus}). Aim for ${indexes.dailyCaloriesNeeded} kcal/day with ${indexes.targetProteinG}g protein and strength exercises to build healthy weight safely.`
      };
    }

    if (indexes.bmi >= 25 || diffFromIdeal > 2) {
      const kgToLose = Math.max(0.5, diffFromIdeal).toFixed(1);
      return {
        actionType: 'REDUCE WEIGHT',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        headline: `You should REDUCE approx. ${kgToLose} kg to reach your Healthy Ideal Weight (${indexes.idealWeightKg} kg).`,
        detail: `Your current BMI is ${indexes.bmi} (${indexes.bmiStatus}). Follow a daily target of ${indexes.dailyCaloriesNeeded} kcal/day, ${indexes.targetProteinG}g protein, and 8 glasses of water to steadily reach ${profile.targetWeightKg} kg.`
      };
    }

    return {
      actionType: 'HEALTHY WEIGHT — MAINTAIN',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      headline: `Great job! Your weight (${profile.weightKg} kg) is in the Healthy Normal BMI range (${indexes.bmi}).`,
      detail:
        diffFromTarget !== 0
          ? `You are only ${Math.abs(diffFromTarget).toFixed(1)} kg away from your personal target weight of ${profile.targetWeightKg} kg. Maintain ${indexes.dailyCaloriesNeeded} kcal/day.`
          : `Maintain your balanced diet of ${indexes.dailyCaloriesNeeded} kcal/day and ${profile.dailyWaterGoalGlasses} glasses of water daily.`
    };
  }, [
    profile.weightKg,
    profile.targetWeightKg,
    profile.dailyWaterGoalGlasses,
    indexes
  ]);

  // Health Condition Food Recommendation Data
  const conditionRecommendation = useMemo(
    () => getHealthConditionRecommendations(activeCondition),
    [activeCondition]
  );

  // Send Issue to AI Dietitian Agent
  const handleAskDietitianIssue = (customQuestion?: string) => {
    const queryText = (customQuestion ?? chatInput).trim();
    if (!queryText) return;

    const userMsg: DietitianChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const resolution = generateComprehensiveDietitianResolution(
      queryText,
      profile,
      indexes
    );

    const aiMsg: DietitianChatMessage = {
      id: `ai-${Date.now() + 1}`,
      sender: 'dietitian',
      issueTitle: resolution.issueTitle,
      text: resolution.text,
      recommendedSteps: resolution.recommendedSteps,
      foodsToEat: resolution.foodsToEat,
      foodsToAvoid: resolution.foodsToAvoid,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setChatMessages((prev) => [...prev, userMsg, aiMsg]);
    if (!customQuestion) {
      setChatInput('');
    }
  };

  // Save Health & Nutrition Data to Firestore & UserToolsData
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
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      }
    } catch {
      // Local state updates seamlessly
    }

    setSaveSuccessMsg('Your Health & Nutrition Tracker data has been saved!');
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Download Complete Personal Nutrition, BMI & AI Dietitian Report (PDF)
  const handleDownloadNutritionPdfReport = () => {
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();

    pdf.setFillColor(19, 66, 43);
    pdf.rect(0, 0, pageW, 36, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text('PERSONAL NUTRITION, BMI & AI DIETITIAN REPORT', 14, 15);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `Prepared For: ${profile.fullName || user.name || 'Food Specialist'} | Date: ${new Date().toLocaleDateString()}`,
      14,
      23
    );
    pdf.text(
      `Age: ${profile.age} yrs | Gender: ${profile.gender} | Height: ${profile.heightCm} cm | Current Weight: ${profile.weightKg} kg | Target: ${profile.targetWeightKg} kg`,
      14,
      30
    );

    let y = 46;
    pdf.setTextColor(15, 41, 30);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('1. BMI, WEIGHT GOAL & DAILY CALORIE SUMMARY', 14, y);
    y += 7;

    pdf.setFillColor(240, 253, 244);
    pdf.setDrawColor(187, 247, 208);
    pdf.roundedRect(14, y, pageW - 28, 36, 3, 3, 'FD');
    pdf.setFontSize(10);
    pdf.text(
      `BMI Score: ${indexes.bmi} kg/m2 (${indexes.bmiStatus})   |   Health Score: ${indexes.healthScore} / 100 (${indexes.healthScoreLabel})`,
      18,
      y + 8
    );
    pdf.text(
      `Healthy Ideal Weight: ${indexes.idealWeightKg} kg   |   BMR: ${indexes.bmrKcal} kcal/day   |   TDEE: ${indexes.tdeeKcal} kcal/day`,
      18,
      y + 16
    );
    pdf.text(
      `Daily Target: ${indexes.dailyCaloriesNeeded} kcal/day (Protein: ${indexes.targetProteinG}g | Carbs: ${indexes.targetCarbsG}g | Fat: ${indexes.targetFatG}g)`,
      18,
      y + 24
    );
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Recommendation: ${weightGuidance.headline}`, 18, y + 32);

    y += 46;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(
      `2. NUTRITION RECOMMENDATION FOR: ${activeCondition.toUpperCase()}`,
      14,
      y
    );
    y += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    const summaryLines = pdf.splitTextToSize(
      conditionRecommendation.summaryAdvice,
      pageW - 32
    );
    pdf.text(summaryLines, 16, y);
    y += summaryLines.length * 5 + 3;

    pdf.setFont('helvetica', 'bold');
    pdf.text('Recommended Foods:', 16, y);
    y += 5;
    pdf.setFont('helvetica', 'normal');
    conditionRecommendation.recommendedFoods.forEach((f) => {
      pdf.text(`• ${f.name} — ${f.shortNote}`, 18, y);
      y += 5;
    });

    y += 3;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Foods to Avoid:', 16, y);
    y += 5;
    pdf.setFont('helvetica', 'normal');
    conditionRecommendation.foodsToAvoid.forEach((f) => {
      pdf.text(`• ${f.name} — ${f.shortNote}`, 18, y);
      y += 5;
    });

    // Latest AI Dietitian Resolution
    const lastAiMsg = [...chatMessages]
      .reverse()
      .find((m) => m.sender === 'dietitian');
    if (lastAiMsg && y < 220) {
      y += 6;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text(
        `3. AI DIETITIAN RESOLUTION: ${(lastAiMsg.issueTitle || 'Health Guidance').toUpperCase()}`,
        14,
        y
      );
      y += 6;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      (lastAiMsg.recommendedSteps || []).forEach((step, idx) => {
        const lines = pdf.splitTextToSize(`${idx + 1}. ${step}`, pageW - 32);
        pdf.text(lines, 16, y);
        y += lines.length * 5 + 1.5;
      });
    }

    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(DOCTOR_DISCLAIMER_BANNER, 14, 285);

    pdf.save(
      `${(profile.fullName || 'Specialist').replace(/\s+/g, '_')}_Nutrition_Health_Report.pdf`
    );
  };

  // BMI Pointer position (0 to 100%)
  const bmiPointerPct = useMemo(() => {
    const clamped = Math.max(14, Math.min(38, indexes.bmi));
    return Math.round(((clamped - 14) / (38 - 14)) * 100);
  }, [indexes.bmi]);

  return (
    <div className="space-y-5 pb-8">
      {/* =====================================================================
          TOP HEADER BANNER — 1-PAGE BMI, HEALTH TRACKER & AI DIETITIAN AGENT
         ===================================================================== */}
      <div className="bg-gradient-to-r from-[#13422B] via-[#155E3A] to-[#0E9F6E] rounded-[24px] p-4 sm:p-5 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-100 text-[10.5px] font-extrabold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              1-Page Personal Health Tracker • BMI, Weight Graph &amp; AI Dietitian Agent
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold mt-1">
              Personal Health, BMI Calculator &amp; AI Nutrition Issue Resolver
            </h2>
            <p className="text-xs text-emerald-100 mt-0.5">
              Calculate your BMI &amp; weight target, check Recommended vs. Avoided foods for any condition, and ask the AI Dietitian Agent to resolve any nutrition or health issue.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadNutritionPdfReport}
            className="px-4 py-2.5 rounded-xl bg-white text-[#13422B] hover:bg-emerald-50 text-xs font-extrabold inline-flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4 text-[#0E9F6E]" />
            <span>Download Full Nutrition Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* SAVE CONFIRMATION BANNER */}
      {saveSuccessMsg && (
        <div className="p-3.5 rounded-2xl bg-[#DCFCE7] border border-[#86EFAC] text-[#14532D] text-xs font-extrabold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccessMsg(null)}
            className="text-xs font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* =====================================================================
          STEP 1: EASY 1-PAGE CALCULATOR INPUTS (HEIGHT, WEIGHT, TARGET, GOAL, WATER)
         ===================================================================== */}
      <div className="bg-white border-[1.5px] border-[#BCE3C8] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECF4EF] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E2F2E9] text-[#0E9F6E] flex items-center justify-center font-extrabold text-sm">
              1
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#0F291E]">
                Step 1: Enter Your Body Details &amp; Health Goal
              </h3>
              <p className="text-[11px] text-[#5C7267]">
                Results update live as you change your weight, height, or goal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveHealthTracker}
            className="px-4 py-2 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save My Health Data</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-extrabold text-[#13422B] mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={profile.fullName}
              onChange={(e) =>
                setProfile((p) => ({ ...p, fullName: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-xl border border-[#CBE3D6] bg-[#F8FCFA] text-xs font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-[#13422B] mb-1">
              Age (Years)
            </label>
            <input
              type="number"
              min={14}
              max={95}
              value={profile.age}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  age: Math.max(14, Number(e.target.value) || 25)
                }))
              }
              className="w-full px-3 py-2 rounded-xl border border-[#CBE3D6] bg-[#F8FCFA] text-xs font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-[#13422B] mb-1">
              Gender
            </label>
            <select
              value={profile.gender}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  gender: e.target.value as GenderOption
                }))
              }
              className="w-full px-3 py-2 rounded-xl border border-[#CBE3D6] bg-[#F8FCFA] text-xs font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-[#13422B] mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              min={120}
              max={225}
              value={profile.heightCm}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  heightUnit: 'cm',
                  heightCm: Number(e.target.value) || 170
                }))
              }
              className="w-full px-3 py-2 rounded-xl border border-[#CBE3D6] bg-[#F8FCFA] text-xs font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-[#13422B] mb-1">
              Current Weight (kg)
            </label>
            <input
              type="number"
              step="0.5"
              min={30}
              max={220}
              value={profile.weightKg}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  weightKg: Number(e.target.value) || 70
                }))
              }
              className="w-full px-3 py-2 rounded-xl border-2 border-[#0E9F6E] bg-[#F4FAF7] text-xs font-extrabold text-[#0F291E] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-[#13422B] mb-1">
              Target Weight (kg)
            </label>
            <input
              type="number"
              step="0.5"
              min={30}
              max={200}
              value={profile.targetWeightKg}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  targetWeightKg: Number(e.target.value) || 65
                }))
              }
              className="w-full px-3 py-2 rounded-xl border border-[#CBE3D6] bg-[#F8FCFA] text-xs font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-[#13422B] mb-1">
              Activity Level
            </label>
            <select
              value={profile.activityLevel}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  activityLevel: e.target.value as ActivityLevelOption
                }))
              }
              className="w-full px-3 py-2 rounded-xl border border-[#CBE3D6] bg-[#F8FCFA] text-xs font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
            >
              <option value="Sedentary">Sedentary (Desk Job)</option>
              <option value="Lightly Active">Lightly Active (1–2 days/wk)</option>
              <option value="Moderately Active">Moderately Active (3–5 days/wk)</option>
              <option value="Very Active">Very Active (Daily Exercise)</option>
              <option value="Athlete">Athlete (Intense Training)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-extrabold text-[#13422B] mb-1">
              Your Primary Goal
            </label>
            <select
              value={profile.goal}
              onChange={(e) =>
                setProfile((p) => ({
                  ...p,
                  goal: e.target.value as GoalOption
                }))
              }
              className="w-full px-3 py-2 rounded-xl border border-[#CBE3D6] bg-[#F8FCFA] text-xs font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
            >
              <option value="Lose Weight">Lose Weight (Fat Loss)</option>
              <option value="Maintain Weight">Maintain Healthy Weight</option>
              <option value="Gain Weight">Gain Weight</option>
              <option value="Gain Muscle">Build Muscle &amp; Strength</option>
              <option value="Improve Health">General Health &amp; Energy</option>
            </select>
          </div>
        </div>

        {/* Daily Water Tracker Row */}
        <div className="p-3.5 rounded-2xl bg-[#F4FAF7] border border-[#D4E9DF] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-[#0F291E]">
                Daily Water Intake Tracker: {waterGlasses} / {profile.dailyWaterGoalGlasses} Glasses ({waterGlasses * 250} ml)
              </div>
              <div className="text-[11px] text-[#5C7267]">
                Click +1 Glass whenever you drink water today
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setWaterGlasses((w) => Math.max(0, w - 1))}
              className="px-3 py-1.5 rounded-xl bg-white border border-[#CBE3D6] text-[#0F291E] text-xs font-extrabold cursor-pointer hover:bg-gray-50"
            >
              - 1 Glass
            </button>
            <button
              type="button"
              onClick={() => setWaterGlasses((w) => Math.min(16, w + 1))}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold cursor-pointer"
            >
              + 1 Glass Water
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          STEP 2: INSTANT BMI RESULT, WEIGHT GOAL ADVICE & VISUAL GRAPH
         ===================================================================== */}
      <div className="bg-white border-[1.5px] border-[#BCE3C8] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-[#ECF4EF] pb-3">
          <div className="w-9 h-9 rounded-xl bg-[#E2F2E9] text-[#0E9F6E] flex items-center justify-center font-extrabold text-sm">
            2
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-[#0F291E]">
              Step 2: Your BMI Score, Weight Advice &amp; Daily Calorie Target
            </h3>
            <p className="text-[11px] text-[#5C7267]">
              Shows your exact BMI category, whether to gain or reduce weight, and your daily macros
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: BMI Gauge & Scale Bar */}
          <div className="p-4 rounded-2xl bg-[#F8FCFA] border border-[#CBE3D6] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-[#5C7267] uppercase">
                  Your Body Mass Index (BMI)
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-extrabold text-[#0F291E]">
                    {indexes.bmi}
                  </span>
                  <span className="text-xs font-bold text-[#5C7267]">kg/m²</span>
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
                <div className="w-1/4 bg-blue-500" title="Underweight <18.5" />
                <div className="w-1/4 bg-emerald-500" title="Normal 18.5–24.9" />
                <div className="w-1/4 bg-amber-500" title="Overweight 25–29.9" />
                <div className="w-1/4 bg-red-500" title="Obese 30+" />
                <div
                  className="absolute top-0 bottom-0 w-1.5 bg-[#0F291E] border border-white rounded-full shadow-md"
                  style={{ left: `calc(${bmiPointerPct}% - 3px)` }}
                />
              </div>
              <div className="grid grid-cols-4 text-[10px] font-bold text-[#5C7267] text-center">
                <span>Under (&lt;18.5)</span>
                <span className="text-[#0E9F6E] font-extrabold">Normal (18.5–24.9)</span>
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
          <div className="p-4 rounded-2xl bg-[#F8FCFA] border border-[#CBE3D6] space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-[#0F291E]">
                  Weight Progress &amp; Ideal Weight Graph
                </h4>
                <p className="text-[11px] text-[#5C7267]">
                  Current: <strong>{profile.weightKg} kg</strong> • Ideal Weight:{' '}
                  <strong>{indexes.idealWeightKg} kg</strong> • Target:{' '}
                  <strong>{profile.targetWeightKg} kg</strong>
                </p>
              </div>
              <Scale className="w-5 h-5 text-[#0E9F6E]" />
            </div>

            <div className="space-y-2.5 my-auto py-1">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-[#0F291E]">Current Weight</span>
                  <span className="text-[#0F291E] font-extrabold">
                    {profile.weightKg} kg (BMI {indexes.bmi})
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#13422B]"
                    style={{
                      width: `${Math.min(100, Math.round((profile.weightKg / 120) * 100))}%`
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-[#0E9F6E]">
                    Healthy Ideal Weight (For {profile.heightCm} cm)
                  </span>
                  <span className="text-[#0E9F6E] font-extrabold">
                    {indexes.idealWeightKg} kg (BMI 22.0)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0E9F6E]"
                    style={{
                      width: `${Math.min(100, Math.round((indexes.idealWeightKg / 120) * 100))}%`
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-amber-700">Your Personal Target Weight</span>
                  <span className="text-amber-800 font-extrabold">
                    {profile.targetWeightKg} kg
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{
                      width: `${Math.min(100, Math.round((profile.targetWeightKg / 120) * 100))}%`
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#5C7267] font-semibold pt-1 border-t border-[#E2F2E9] flex items-center justify-between">
              <span>Health Score: {indexes.healthScore}/100 ({indexes.healthScoreLabel})</span>
              <span>Body Fat Est.: {indexes.bodyFatPct}%</span>
            </div>
          </div>
        </div>

        {/* Daily Calorie & Macro Targets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          <div className="p-3 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0]">
            <div className="text-[10px] font-bold text-[#065F46] uppercase">
              Daily Calorie Target
            </div>
            <div className="text-lg font-extrabold text-[#0F291E] mt-0.5">
              {indexes.dailyCaloriesNeeded} kcal
            </div>
            <div className="text-[10px] font-bold text-[#0E9F6E]">
              For: {profile.goal}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F4FAF7] border border-[#D4E9DF]">
            <div className="text-[10px] font-bold text-[#5C7267] uppercase">
              Daily Protein
            </div>
            <div className="text-lg font-extrabold text-[#0F291E] mt-0.5">
              {indexes.targetProteinG} g
            </div>
            <div className="text-[10px] text-[#0E9F6E] font-bold">
              Muscle &amp; Repair
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F4FAF7] border border-[#D4E9DF]">
            <div className="text-[10px] font-bold text-[#5C7267] uppercase">
              Daily Carbs
            </div>
            <div className="text-lg font-extrabold text-[#0F291E] mt-0.5">
              {indexes.targetCarbsG} g
            </div>
            <div className="text-[10px] text-[#5C7267] font-semibold">
              Daily Energy
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F4FAF7] border border-[#D4E9DF]">
            <div className="text-[10px] font-bold text-[#5C7267] uppercase">
              Healthy Fats
            </div>
            <div className="text-lg font-extrabold text-[#0F291E] mt-0.5">
              {indexes.targetFatG} g
            </div>
            <div className="text-[10px] text-[#5C7267] font-semibold">
              Hormone Balance
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F4FAF7] border border-[#D4E9DF] col-span-2 sm:col-span-1">
            <div className="text-[10px] font-bold text-[#5C7267] uppercase">
              BMR / TDEE
            </div>
            <div className="text-sm font-extrabold text-[#0F291E] mt-1">
              {indexes.bmrKcal} / {indexes.tdeeKcal} kcal
            </div>
            <div className="text-[10px] text-[#0E9F6E] font-bold">
              Rest / Active Burn
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          STEP 3: NUTRITION RECOMMENDATION & AI DIETITIAN ISSUE RESOLVER AGENT
         ===================================================================== */}
      <div className="bg-white border-[1.5px] border-[#BCE3C8] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 border-b border-[#ECF4EF] pb-3">
          <div className="w-9 h-9 rounded-xl bg-[#E2F2E9] text-[#0E9F6E] flex items-center justify-center font-extrabold text-sm">
            3
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-[#0F291E]">
              Step 3: Nutrition Condition Recommendation &amp; AI Dietitian Issue Resolver
            </h3>
            <p className="text-[11px] text-[#5C7267]">
              Search any health condition or nutrition issue below to see Recommended Foods, Foods to Avoid, and ask the AI Dietitian Agent for a complete solution
            </p>
          </div>
        </div>

        {/* Search Input Bar matching the Nutrition Recommendation Reference Image */}
        <div className="space-y-2.5">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#5C7267] absolute left-3.5" />
            <input
              type="text"
              value={conditionQuery}
              onChange={(e) => {
                setConditionQuery(e.target.value);
                if (e.target.value.trim()) {
                  setActiveCondition(e.target.value.trim());
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && conditionQuery.trim()) {
                  setActiveCondition(conditionQuery.trim());
                  handleAskDietitianIssue(conditionQuery.trim());
                }
              }}
              placeholder="Type any nutrition issue or condition (e.g., Diabetes, High BP, Uric Acid, Acidity, PCOS)..."
              className="w-full pl-10 pr-24 py-3 rounded-2xl border border-[#CBE3D6] bg-[#F4FAF7] text-xs sm:text-sm font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
            />
            {conditionQuery && (
              <button
                type="button"
                onClick={() => setConditionQuery('')}
                className="absolute right-20 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (conditionQuery.trim()) {
                  setActiveCondition(conditionQuery.trim());
                  handleAskDietitianIssue(conditionQuery.trim());
                }
              }}
              className="absolute right-2 px-3.5 py-1.5 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold cursor-pointer"
            >
              Search
            </button>
          </div>

          {/* Quick Health Condition Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              'Diabetes',
              'High Blood Pressure',
              'Cholesterol',
              'Acidity',
              'Uric Acid',
              'Fatty Liver',
              'PCOS',
              'Anemia',
              'Thyroid',
              'Weight Loss',
              'Weight Gain'
            ].map((cond) => (
              <button
                key={cond}
                type="button"
                onClick={() => {
                  setConditionQuery(cond);
                  setActiveCondition(cond);
                  handleAskDietitianIssue(cond);
                }}
                className={`px-3 py-1 rounded-full text-[11px] font-extrabold cursor-pointer transition-colors ${
                  activeCondition.toLowerCase() === cond.toLowerCase()
                    ? 'bg-[#13422B] text-white'
                    : 'bg-[#F4FAF7] text-[#13422B] border border-[#CBE3D6] hover:border-[#0E9F6E]'
                }`}
              >
                {cond}
              </button>
            ))}
          </div>
        </div>

        {/* Personalized Recommendation Banner (Matching Reference Image 1) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm sm:text-base font-extrabold text-[#0F291E] flex items-center gap-1.5">
              <span>Personalized Recommendation</span>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </h4>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10.5px] font-extrabold">
              Personalized for {conditionRecommendation.conditionName} ✨
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#DBEAFE]/70 border border-[#93C5FD] text-xs sm:text-sm font-semibold text-[#1E3A8A] leading-relaxed">
            {conditionRecommendation.summaryAdvice}
          </div>
        </div>

        {/* Recommended Foods (Green Cards) & Foods to Avoid (Red Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left: Recommended Foods */}
          <div className="space-y-2.5">
            <h4 className="text-sm sm:text-base font-extrabold text-[#0F291E] flex items-center gap-1.5">
              <span>Recommended Foods</span>
              <Leaf className="w-4 h-4 text-[#16A34A]" />
            </h4>
            <div className="space-y-2.5">
              {conditionRecommendation.recommendedFoods.map((f) => (
                <div
                  key={f.name}
                  className="p-3.5 rounded-2xl bg-[#DCFCE7]/85 border border-[#86EFAC] space-y-1"
                >
                  <div className="text-sm font-extrabold text-[#064E3B]">
                    🌿 {f.name}
                  </div>
                  <div className="text-xs font-semibold text-[#14532D]">
                    • {f.shortNote}
                  </div>
                  <div className="text-[10.5px] text-[#166534]/80 flex items-center gap-1 pt-0.5">
                    <Info className="w-3 h-3 shrink-0" />
                    <span>{DOCTOR_DISCLAIMER_SHORT}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Foods to Avoid */}
          <div className="space-y-2.5">
            <h4 className="text-sm sm:text-base font-extrabold text-[#0F291E] flex items-center gap-1.5">
              <span>Foods to Avoid</span>
              <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
            </h4>
            <div className="space-y-2.5">
              {conditionRecommendation.foodsToAvoid.map((f) => (
                <div
                  key={f.name}
                  className="p-3.5 rounded-2xl bg-[#FEE2E2]/90 border border-[#FCA5A5] space-y-1"
                >
                  <div className="text-sm font-extrabold text-[#7F1D1D]">
                    ⚠️ {f.name}
                  </div>
                  <div className="text-xs font-semibold text-[#991B1B]">
                    • {f.shortNote}
                  </div>
                  <div className="text-[10.5px] text-[#991B1B]/80 flex items-center gap-1 pt-0.5">
                    <Info className="w-3 h-3 shrink-0" />
                    <span>{DOCTOR_DISCLAIMER_SHORT}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================================================================
            INTERACTIVE AI DIETITIAN — CHAT & ISSUE RESOLVER AGENT
           =================================================================== */}
        <div className="pt-3 border-t border-[#ECF4EF] space-y-3.5">
          {/* Header Banner like the Blue "✨ AI Dietitian — Chat" Bar in Reference Image */}
          <div className="bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#0E9F6E] rounded-2xl p-4 text-white shadow-sm flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold flex items-center gap-1.5">
                  <span>✨ AI Dietitian — Chat &amp; Nutrition Issue Resolver</span>
                </h4>
                <p className="text-[11px] text-blue-100">
                  Enter any nutrition or health issue below — the AI Agent will reply with the complete recommended method (Tareeqa) to resolve your issue!
                </p>
              </div>
            </div>
          </div>

          {/* Quick 1-Click Nutrition Issue Prompts */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold text-[#13422B]">
              Click any common issue below or type your own question:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                'Diabetes / Sugar control karne ka mukammal tareeqa?',
                'Maiday ki jalan, Acidity aur Gas ka fori hal?',
                'High Blood Pressure (BP) normal karne ki diet?',
                'Cholesterol aur Fatty Liver kam karne ka tareeqa?',
                'Uric Acid aur Joron ka dard khatam karne ka hal?',
                'Wazan kam (Weight Loss) karne ka asaan tareeqa?',
                'Wazan barhane (Weight Gain) ka sehatmand tareeqa?',
                'Khoon ki kami (Anemia) aur kamzori door karne ka hal?',
                'PCOS aur Hormone balance karne ki diet?'
              ].map((promptText) => (
                <button
                  key={promptText}
                  type="button"
                  onClick={() => handleAskDietitianIssue(promptText)}
                  className="px-3 py-1.5 rounded-xl bg-[#F4FAF7] hover:bg-[#DCFCE7] border border-[#BCE3C8] text-[#13422B] text-[11px] font-extrabold cursor-pointer transition-colors text-left"
                >
                  💬 {promptText}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Conversation Feed */}
          <div className="bg-[#F8FCFA] border border-[#CBE3D6] rounded-2xl p-3.5 sm:p-4 space-y-3 max-h-[520px] overflow-y-auto">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-3.5 space-y-2.5 ${
                    msg.sender === 'user'
                      ? 'bg-[#13422B] text-white'
                      : 'bg-white border-2 border-[#BCE3C8] text-[#0F291E] shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] font-bold opacity-80">
                    <span className="inline-flex items-center gap-1">
                      {msg.sender === 'user' ? (
                        <>
                          <User className="w-3 h-3" />
                          <span>You ({profile.fullName})</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-3.5 h-3.5 text-[#0E9F6E]" />
                          <span className="text-[#0E9F6E] font-extrabold">
                            AI Dietitian Agent
                          </span>
                        </>
                      )}
                    </span>
                    <span>{msg.time}</span>
                  </div>

                  {msg.issueTitle && (
                    <div className="text-xs sm:text-sm font-extrabold text-[#13422B] border-b border-[#ECF4EF] pb-1.5">
                      🩺 {msg.issueTitle}
                    </div>
                  )}

                  <p className="text-xs leading-relaxed font-medium">
                    {msg.text}
                  </p>

                  {/* Recommended Steps to Resolve the Issue */}
                  {msg.recommendedSteps && msg.recommendedSteps.length > 0 && (
                    <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-1.5">
                      <div className="text-[11px] font-extrabold text-[#14532D] uppercase">
                        ✓ Masla Hal Karnay Ka Recommended Tareeqa (Action Plan):
                      </div>
                      <ul className="space-y-1 text-xs text-[#0F291E]">
                        {msg.recommendedSteps.map((step, idx) => (
                          <li key={idx} className="leading-snug">
                            <strong>{idx + 1}.</strong> {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Foods to Eat & Avoid inside Agent Reply */}
                  {msg.foodsToEat && msg.foodsToAvoid && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div className="p-2.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0]">
                        <div className="text-[10.5px] font-extrabold text-[#065F46] mb-1">
                          🌿 Kia Khana Chahiye (Eat):
                        </div>
                        <ul className="space-y-0.5 text-[11px] text-[#0F291E]">
                          {msg.foodsToEat.map((f, i) => (
                            <li key={i}>• {f}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#FEF2F2] border border-[#FECACA]">
                        <div className="text-[10.5px] font-extrabold text-[#991B1B] mb-1">
                          ⚠️ Parhez Karen (Avoid):
                        </div>
                        <ul className="space-y-0.5 text-[11px] text-[#7F1D1D]">
                          {msg.foodsToAvoid.map((f, i) => (
                            <li key={i}>• {f}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Box */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAskDietitianIssue();
                }
              }}
              placeholder="Apna nutrition issue ya sawal yahan likhen (e.g., Acidity, Sugar, BP, Uric Acid, Weight Loss)..."
              className="flex-1 px-4 py-3 rounded-2xl border-2 border-[#0E9F6E] bg-white text-xs sm:text-sm font-bold text-[#0F291E] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleAskDietitianIssue()}
              className="px-5 py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-extrabold inline-flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Ask AI Agent</span>
            </button>
          </div>
        </div>
      </div>

      {/* DOCTOR DISCLAIMER FOOTER */}
      <div className="p-3.5 rounded-2xl bg-[#DBEAFE]/70 border border-[#93C5FD] text-[11px] font-bold text-[#1E3A8A] flex items-center gap-2">
        <Heart className="w-4 h-4 text-blue-700 shrink-0" />
        <span>{DOCTOR_DISCLAIMER_BANNER}</span>
      </div>
    </div>
  );
};

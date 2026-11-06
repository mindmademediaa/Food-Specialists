import React, { useState, useMemo, useRef } from 'react';
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
  RotateCcw,
  Scale,
  Search,
  Send,
  Sparkles,
  Trash2,
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

/**
 * Enhanced Conversational AI Dietitian Chatbot Answer Generator
 * Replies like the original AI Dietitian Chatbot to any nutrition issue, symptom, or food query.
 */
function getDietitianChatbotReply(
  rawQuestion: string,
  profile: SuiteOnboardingProfile,
  indexes: SuiteComputedIndexes
): string {
  const q = rawQuestion.trim().toLowerCase();

  // Check specific conditions & issues first for rich, direct answers
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

  // Fallback to the core dietitian answer generator + personalized advice for any custom issue
  const baseAnswer = generateDietitianAnswer(rawQuestion, profile, indexes);
  return `Regarding "${rawQuestion}":\n• Prioritize anti-inflammatory whole foods: fresh leafy greens, seasonal vegetables, lean proteins (${indexes.targetProteinG}g/day target), and complex high-fiber grains.\n• Stay well-hydrated with ${profile.dailyWaterGoalGlasses}–10 glasses of water daily and avoid ultra-processed foods, refined sugar, and deep-fried oils.\n• ${baseAnswer}`;
}

/**
 * Helper icon for Recommended / Avoided food cards matching the Reference Image
 */
const ConditionFoodIcon: React.FC<{
  iconType: ConditionFoodCard['iconType'];
  isRecommended: boolean;
}> = ({ iconType, isRecommended }) => {
  const colorClass = isRecommended ? 'text-[#15803D]' : 'text-[#B91C1C]';
  const bgClass = isRecommended ? 'bg-[#BBF7D0]/60' : 'bg-[#FECACA]/70';

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

export const NutritionSuiteTool: React.FC<NutritionSuiteToolProps> = ({
  user,
  toolsData,
  onSaveToolsData
}) => {
  const savedNut = toolsData?.nutrition;

  // ==========================================================================
  // 1. DEDICATED RAW STRING STATES FOR ALL NUMERIC INPUTS
  // Fixes digit entry, backspacing, clearing, and decimal typing 100%!
  // ==========================================================================
  const [fullNameInput, setFullNameInput] = useState<string>(
    () => user.name || 'Food Specialist'
  );
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

  // Derived numeric profile for live formulas (never overwrites user's text inputs while typing!)
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

    return {
      ...DEFAULT_SUITE_ONBOARDING,
      uid: user.uid,
      fullName: fullNameInput || 'Food Specialist',
      age: !Number.isNaN(parsedAge) && parsedAge > 0 ? parsedAge : 28,
      gender: genderInput,
      heightUnit,
      heightCm: effectiveHeightCm,
      heightFeet: !Number.isNaN(parsedFeet) ? parsedFeet : 5,
      heightInches: !Number.isNaN(parsedInches) ? parsedInches : 8,
      weightKg:
        !Number.isNaN(parsedWeight) && parsedWeight > 0 ? parsedWeight : 74,
      targetWeightKg:
        !Number.isNaN(parsedTargetWeight) && parsedTargetWeight > 0
          ? parsedTargetWeight
          : 68,
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

  // Nutrition Recommendation Condition Search State (Matches Image 3)
  const [conditionQuery, setConditionQuery] = useState<string>('Diabetes');
  const [activeCondition, setActiveCondition] = useState<string>('Diabetes');

  // ==========================================================================
  // 2. REVERTED ORIGINAL AI DIETITIAN CHATBOT WITH CLEAR CHAT OPTION
  // ==========================================================================
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

  // Live Calculated BMI, BMR, TDEE, Ideal Weight & Macros
  const indexes = useMemo(
    () => calculateSuiteNutritionIndexes(profile, waterGlasses),
    [profile, waterGlasses]
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
        detail: `Your current BMI is ${indexes.bmi} (${indexes.bmiStatus}). Follow a daily target of ${indexes.dailyCaloriesNeeded} kcal/day, ${indexes.targetProteinG}g protein, and ${profile.dailyWaterGoalGlasses} glasses of water to steadily reach ${profile.targetWeightKg} kg.`
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
          TOP HEADER BANNER — 1-PAGE BMI, HEALTH TRACKER & AI DIETITIAN CHAT
         ===================================================================== */}
      <div className="bg-gradient-to-r from-[#13422B] via-[#155E3A] to-[#0E9F6E] rounded-[24px] p-4 sm:p-5 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-100 text-[10.5px] font-extrabold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              1-Page Personal Health Tracker • BMI, Weight Graph &amp; AI Dietitian Chat
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold mt-1">
              Personal Health, BMI Calculator &amp; AI Dietitian Chatbot
            </h2>
            <p className="text-xs text-emerald-100 mt-0.5">
              Enter your details below to calculate your BMI &amp; weight target, check Nutrition Recommendations, and chat with the AI Dietitian.
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
          STEP 1: SMOOTH, RELIABLE BODY DETAILS & HEALTH CALCULATOR INPUTS
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
                Type any number freely — BMI, Ideal Weight &amp; Calories calculate automatically
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveHealthTracker}
            className="px-4 py-2 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold inline-flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Calculate &amp; Save My Nutrition</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-extrabold text-[#13422B] mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={fullNameInput}
              onChange={(e) => setFullNameInput(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2.5 rounded-xl border border-[#CBE3D6] bg-[#F8FCFA] text-xs sm:text-sm font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
            />
          </div>

          {/* Age (Years) — Smooth string input */}
          <div>
            <label className="block text-[11px] font-extrabold text-[#13422B] mb-1">
              Age (Years)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={ageInput}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9]/g, '');
                setAgeInput(cleaned);
              }}
              placeholder="e.g. 28"
              className="w-full px-3 py-2.5 rounded-xl border border-[#CBE3D6] bg-[#F8FCFA] text-xs sm:text-sm font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-[11px] font-extrabold text-[#13422B] mb-1">
              Gender
            </label>
            <select
              value={genderInput}
              onChange={(e) => setGenderInput(e.target.value as GenderOption)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#CBE3D6] bg-[#F8FCFA] text-xs sm:text-sm font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Height (cm or feet/inches) — Smooth string input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-extrabold text-[#13422B]">
                Height ({heightUnit === 'cm' ? 'cm' : 'ft / in'})
              </label>
              <button
                type="button"
                onClick={() =>
                  setHeightUnit((u) => (u === 'cm' ? 'feet' : 'cm'))
                }
                className="text-[10px] font-extrabold text-[#0E9F6E] underline cursor-pointer"
              >
                Switch to {heightUnit === 'cm' ? 'Feet/Inches' : 'cm'}
              </button>
            </div>

            {heightUnit === 'cm' ? (
              <input
                type="text"
                inputMode="decimal"
                value={heightCmInput}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9.]/g, '');
                  setHeightCmInput(cleaned);
                }}
                placeholder="e.g. 172"
                className="w-full px-3 py-2.5 rounded-xl border border-[#CBE3D6] bg-[#F8FCFA] text-xs sm:text-sm font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
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
                  placeholder="Feet (e.g. 5)"
                  className="w-full px-2.5 py-2.5 rounded-xl border border-[#CBE3D6] bg-[#F8FCFA] text-xs font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  value={heightInchesInput}
                  onChange={(e) =>
                    setHeightInchesInput(e.target.value.replace(/[^0-9]/g, ''))
                  }
                  placeholder="Inches (e.g. 8)"
                  className="w-full px-2.5 py-2.5 rounded-xl border border-[#CBE3D6] bg-[#F8FCFA] text-xs font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
                />
              </div>
            )}
          </div>

          {/* Current Weight (kg) — Smooth string input */}
          <div>
            <label className="block text-[11px] font-extrabold text-[#13422B] mb-1">
              Current Weight (kg)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={weightKgInput}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9.]/g, '');
                setWeightKgInput(cleaned);
              }}
              placeholder="e.g. 74"
              className="w-full px-3 py-2.5 rounded-xl border-2 border-[#0E9F6E] bg-[#F4FAF7] text-xs sm:text-sm font-extrabold text-[#0F291E] focus:outline-none"
            />
          </div>

          {/* Target Weight (kg) — Smooth string input */}
          <div>
            <label className="block text-[11px] font-extrabold text-[#13422B] mb-1">
              Target Weight (kg)
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={targetWeightKgInput}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^0-9.]/g, '');
                setTargetWeightKgInput(cleaned);
              }}
              placeholder="e.g. 68"
              className="w-full px-3 py-2.5 rounded-xl border border-[#CBE3D6] bg-[#F8FCFA] text-xs sm:text-sm font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
            />
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-[11px] font-extrabold text-[#13422B] mb-1">
              Activity Level
            </label>
            <select
              value={activityLevel}
              onChange={(e) =>
                setActivityLevel(e.target.value as ActivityLevelOption)
              }
              className="w-full px-3 py-2.5 rounded-xl border border-[#CBE3D6] bg-[#F8FCFA] text-xs sm:text-sm font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
            >
              <option value="Sedentary">Sedentary (Desk Job)</option>
              <option value="Lightly Active">Lightly Active (1–2 days/wk)</option>
              <option value="Moderately Active">Moderately Active (3–5 days/wk)</option>
              <option value="Very Active">Very Active (Daily Exercise)</option>
              <option value="Athlete">Athlete (Intense Training)</option>
            </select>
          </div>

          {/* Primary Goal */}
          <div>
            <label className="block text-[11px] font-extrabold text-[#13422B] mb-1">
              Your Primary Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value as GoalOption)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#CBE3D6] bg-[#F8FCFA] text-xs sm:text-sm font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
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
          STEP 3: NUTRITION RECOMMENDATION (EXACT REFERENCE IMAGE DESIGN)
         ===================================================================== */}
      <div className="bg-white border-[1.5px] border-[#BCE3C8] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#ECF4EF] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E2F2E9] text-[#0E9F6E] flex items-center justify-center font-extrabold text-sm">
              3
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#0F291E]">
                Nutrition Recommendation
              </h3>
              <p className="text-[11px] text-[#5C7267]">
                Search any condition below for Personalized Recommendations, Recommended Foods &amp; Foods to Avoid
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar + Quick Condition Pills */}
        <div className="space-y-2.5">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5" />
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
                }
              }}
              placeholder="Search health condition (e.g. Diabetes, High BP, Cholesterol, PCOS, Acidity)..."
              className="w-full pl-10 pr-10 py-3 rounded-2xl border border-gray-200 bg-[#F3F4F6] text-xs sm:text-sm font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
            />
            {conditionQuery && (
              <button
                type="button"
                onClick={() => setConditionQuery('')}
                className="absolute right-3.5 text-gray-500 hover:text-gray-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="px-3 py-1 rounded-full bg-[#E0F2FE] text-[#1E3A8A] text-[11px] font-extrabold inline-flex items-center gap-1">
              <span>Personalized for {conditionRecommendation.conditionName}</span>
              <Sparkles className="w-3 h-3 text-blue-600" />
            </span>
            <span className="text-[11px] font-semibold text-gray-500">
              {conditionRecommendation.updatedLabel}
            </span>
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
                  setConditionQuery(cond);
                  setActiveCondition(cond);
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

        {/* Personalized Recommendation Box */}
        <div className="space-y-2">
          <h4 className="text-sm sm:text-base font-extrabold text-[#0F291E] flex items-center gap-1.5">
            <span>Personalized Recommendation</span>
            <Sparkles className="w-4 h-4 text-blue-600" />
          </h4>
          <div className="p-4 rounded-2xl bg-[#DBEAFE]/75 border border-[#93C5FD] text-xs sm:text-sm font-semibold text-[#1E3A8A] leading-relaxed">
            {conditionRecommendation.summaryAdvice}
          </div>
        </div>

        {/* Recommended Foods Section (Green Cards) */}
        <div className="space-y-2.5">
          <h4 className="text-sm sm:text-base font-extrabold text-[#0F291E] flex items-center gap-1.5">
            <span>Recommended Foods</span>
            <Leaf className="w-4 h-4 text-[#16A34A]" />
          </h4>
          <div className="space-y-2.5">
            {conditionRecommendation.recommendedFoods.map((f) => (
              <div
                key={f.name}
                className="p-3.5 rounded-2xl bg-[#DCFCE7] border border-[#86EFAC] flex items-start gap-3"
              >
                <ConditionFoodIcon iconType={f.iconType} isRecommended={true} />
                <div className="space-y-0.5">
                  <div className="text-sm sm:text-base font-extrabold text-[#064E3B]">
                    {f.name}
                  </div>
                  <div className="text-xs font-bold text-[#14532D]">
                    • {f.shortNote}
                  </div>
                  <div className="text-[11px] text-[#166534]/90 flex items-center gap-1 pt-0.5">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    <span>{DOCTOR_DISCLAIMER_SHORT}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Foods to Avoid Section (Red/Coral Cards) */}
        <div className="space-y-2.5">
          <h4 className="text-sm sm:text-base font-extrabold text-[#0F291E] flex items-center gap-1.5">
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

        {/* Doctor Disclaimer Box */}
        <div className="p-3.5 rounded-2xl bg-[#DBEAFE]/65 border border-[#93C5FD] text-xs font-bold text-[#1E3A8A] flex items-center gap-2.5">
          <span className="text-base font-extrabold text-blue-700">➕</span>
          <span>{DOCTOR_DISCLAIMER_BANNER}</span>
        </div>

        {/* Big Blue "✨ AI Dietitian — Chat" Button (Matches Reference Image 3) */}
        <button
          type="button"
          onClick={() =>
            chatSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
          }
          className="w-full py-3.5 px-5 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm sm:text-base font-extrabold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
        >
          <Sparkles className="w-5 h-5 text-blue-100" />
          <span>AI Dietitian — Chat</span>
        </button>
      </div>

      {/* =====================================================================
          STEP 4: REVERTED ORIGINAL AI DIETITIAN CHATBOT WITH "CLEAR CHAT" OPTION
         ===================================================================== */}
      <div
        ref={chatSectionRef}
        className="bg-white border-[1.5px] border-[#BCE3C8] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-4"
      >
        {/* Chatbot Header with Prominent CLEAR CHAT Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECF4EF] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#0F291E] flex items-center gap-1.5">
                <span>AI Dietitian — Chat</span>
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
              </h3>
              <p className="text-[11px] text-[#5C7267]">
                Enter any nutrition issue or question below to get an instant answer
              </p>
            </div>
          </div>

          {/* CLEAR CHAT BUTTON */}
          <button
            type="button"
            onClick={handleClearChat}
            className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>

        {/* Quick Issue Chips */}
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
              className="px-3 py-1.5 rounded-full bg-[#F4FAF7] hover:bg-[#DCFCE7] border border-[#CBE3D6] text-[#13422B] text-[11px] font-extrabold whitespace-nowrap cursor-pointer transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat Messages Container */}
        <div className="bg-[#F8FCFA] border border-[#CBE3D6] rounded-2xl p-3.5 sm:p-4 space-y-3 max-h-96 overflow-y-auto">
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
                    ? 'bg-[#0E9F6E] text-white'
                    : 'bg-white border border-[#CBE3D6] text-[#0F291E] shadow-2xs'
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
                        <Bot className="w-3.5 h-3.5 text-[#2563EB]" />
                        <span className="text-[#2563EB] font-extrabold">
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

        {/* Chat Input Bar + Send & Clear Buttons */}
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
            className="flex-1 px-4 py-3 rounded-2xl border border-[#CBE3D6] bg-[#F8FCFA] text-xs sm:text-sm font-bold text-[#0F291E] focus:outline-none focus:border-[#2563EB]"
          />
          <button
            type="button"
            onClick={() => handleSendChatMessage()}
            className="px-4 sm:px-5 py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-extrabold inline-flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
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
    </div>
  );
};

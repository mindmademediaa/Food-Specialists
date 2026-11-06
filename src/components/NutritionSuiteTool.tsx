import React, { useState, useMemo, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Bell,
  Bookmark,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Crown,
  Download,
  Droplets,
  Edit3,
  Filter,
  Flame,
  Heart,
  Home,
  Info,
  Leaf,
  Lock,
  MessageSquare,
  Pill,
  Plus,
  QrCode,
  RefreshCw,
  Scale,
  Search,
  Send,
  Share2,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Timer,
  Trash2,
  TrendingDown,
  TrendingUp,
  User,
  Utensils,
  X
} from 'lucide-react';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { HubUser, NutritionProfileData, UserToolsData } from '../types/hub';
import {
  ALLERGY_OPTIONS,
  ActivityLevelOption,
   calculateSuiteNutritionIndexes,
  DayMealPlanData,
  DEFAULT_SUITE_ONBOARDING,
  DESI_FOOD_LOG_DATABASE,
  DietPreferenceOption,
  DOCTOR_DISCLAIMER_BANNER,
  DOCTOR_DISCLAIMER_CHAT,
  DOCTOR_DISCLAIMER_SHORT,
  GenderOption,
  generate7DayMealPlan,
  generateDietitianAnswer,
  getHealthConditionRecommendations,
  GoalOption,
  GroceryItem,
  HEALTH_CONDITION_PRESETS,
  MealFoodEntry,
  PRELOADED_44_RECIPES,
  SuiteOnboardingProfile,
  SuiteRecipeItem,
  SUPPLEMENTS_GUIDE_DATA,
  SWAP_MEAL_ALTERNATIVES
} from '../data/nutritionSuiteData';
import { jsPDF } from 'jspdf';

export type NutritionSubRoute =
  | 'setup'
  | 'dashboard'
  | 'meal-plan'
  | 'recipes'
  | 'health'
  | 'stats-foodlog'
  | 'dietitian-chat';

interface NutritionSuiteToolProps {
  user: HubUser;
  isUserPaid: boolean;
  hasExpiredPremium: boolean;
  toolsData: UserToolsData;
  onSaveToolsData: (updatedToolsData: UserToolsData) => Promise<void>;
  onOpenPremiumModal: () => void;
}

export const NutritionSuiteTool: React.FC<NutritionSuiteToolProps> = ({
  user,
  isUserPaid,
  hasExpiredPremium,
  toolsData,
  onSaveToolsData,
  onOpenPremiumModal
}) => {
  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Initialize onboarding profile from existing user/toolsData
  const [profile, setProfile] = useState<SuiteOnboardingProfile>(() => {
    const savedNut = toolsData?.nutrition;
    return {
      ...DEFAULT_SUITE_ONBOARDING,
      uid: user.uid,
      fullName: user.name || 'Food Specialist',
      age: savedNut?.age || 28,
      gender: savedNut?.gender === 'female' ? 'Female' : 'Male',
      heightCm: savedNut?.heightCm || 172,
      weightKg: savedNut?.weightKg || 71.6,
      targetWeightKg: savedNut?.targetWeightKg || 68,
      setupCompleted: Boolean(savedNut?.updatedAt)
    };
  });

  // Sub-route state: if user hasn't set up profile yet, show 'setup' or 'dashboard' with toggle
  const [subRoute, setSubRoute] = useState<NutritionSubRoute>(() =>
    toolsData?.nutrition?.updatedAt ? 'dashboard' : 'setup'
  );

  // Water intake state (0–8+ glasses)
  const [waterGlasses, setWaterGlasses] = useState<number>(
    () => toolsData?.nutrition?.waterGlassesToday ?? 6
  );

  // Weight 30-day history
  const [weightLogs, setWeightLogs] = useState<
    { date: string; weightKg: number; bmi: number }[]
  >(() =>
    toolsData?.nutrition?.weightHistory?.length
      ? toolsData.nutrition.weightHistory
      : [
          { date: 'Day 1', weightKg: 74.0, bmi: 25.0 },
          { date: 'Day 7', weightKg: 73.4, bmi: 24.8 },
          { date: 'Day 14', weightKg: 72.8, bmi: 24.6 },
          { date: 'Day 21', weightKg: 72.1, bmi: 24.4 },
          { date: 'Today', weightKg: 71.6, bmi: 24.2 }
        ]
  );
  const [newWeightInput, setNewWeightInput] = useState<string>(
    String(profile.weightKg)
  );

  // 7-Day Meal Plan State
  const [weekMealPlan, setWeekMealPlan] = useState<DayMealPlanData[]>(() =>
    generate7DayMealPlan(profile)
  );
  const [selectedDayKey, setSelectedDayKey] =
    useState<DayMealPlanData['dayKey']>('Mon');
  const [showGroceryModal, setShowGroceryModal] = useState<boolean>(false);
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);

  // Custom Food Add / Edit inside Meal Plan
  const [addingToMealSection, setAddingToMealSection] = useState<
    'breakfast' | 'lunch' | 'dinner' | 'snack' | null
  >(null);
  const [customMealFoodName, setCustomMealFoodName] = useState<string>('');
  const [customMealGrams, setCustomMealGrams] = useState<string>('150');
  const [customMealCalories, setCustomMealCalories] = useState<string>('220');
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingGramsVal, setEditingGramsVal] = useState<string>('100');

  // Recipes Section State (44 Preloaded + Community Recipes)
  const [communityRecipes, setCommunityRecipes] = useState<SuiteRecipeItem[]>(
    []
  );
  const [recipeCategory, setRecipeCategory] = useState<
    'All' | 'Desi' | 'Pakistani' | 'Chinese' | 'Italian' | 'Continental' | 'Healthy' | 'Saved'
  >('Desi');
  const [recipeSearch, setRecipeSearch] = useState<string>('');
  const [showRecipeFilters, setShowRecipeFilters] = useState<boolean>(false);
  const [calorieFilter, setCalorieFilter] = useState<
    'all' | 'low' | 'medium' | 'high'
  >('all');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [timeFilter, setTimeFilter] = useState<
    'all' | 'under20' | '20to40' | 'over40'
  >('all');
  const [selectedRecipeModal, setSelectedRecipeModal] =
    useState<SuiteRecipeItem | null>(null);
  const [showSubmitRecipeModal, setShowSubmitRecipeModal] =
    useState<boolean>(false);
  const [newRecipeTitle, setNewRecipeTitle] = useState<string>('');
  const [newRecipeCategory, setNewRecipeCategory] =
    useState<SuiteRecipeItem['category']>('Desi');
  const [newRecipeCalories, setNewRecipeCalories] = useState<string>('320');
  const [newRecipeProtein, setNewRecipeProtein] = useState<string>('20');
  const [newRecipeCarbs, setNewRecipeCarbs] = useState<string>('32');
  const [newRecipeTime, setNewRecipeTime] = useState<string>('25');
  const [newRecipeIngredientsText, setNewRecipeIngredientsText] =
    useState<string>('Chicken Breast 150g, Yogurt 50g, Spices 10g');
  const [newRecipeStepsText, setNewRecipeStepsText] = useState<string>(
    'Marinate chicken for 20 mins. Grill until golden and serve hot.'
  );

  // Health Condition Recommended Food State (Image 3)
  const [healthQueryInput, setHealthQueryInput] = useState<string>('Diabetes');
  const [activeHealthCondition, setActiveHealthCondition] =
    useState<string>('Diabetes');

  // AI Dietitian Chat State
  const [chatMessages, setChatMessages] = useState<
    { id: string; sender: 'user' | 'dietitian'; text: string; time: string }[]
  >([
    {
      id: 'welcome-msg',
      sender: 'dietitian',
      text: `Assalam-o-Alaikum ${
        user.name || 'Specialist'
      }! I am your AI Nutrition & Dietitian Assistant. Ask me anything about Diabetes, Weight Loss, PCOS, Blood Pressure, or Desi foods like Biryani & Roti. ${DOCTOR_DISCLAIMER_CHAT}`,
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  // Food Log Calorie Tracker & Barcode Scanner + Intermittent Fasting 16:8 Timer
  const [foodSearchQuery, setFoodSearchQuery] = useState<string>('');
  const [todayLoggedFoods, setTodayLoggedFoods] = useState<MealFoodEntry[]>([
    {
      id: 'log-1',
      name: 'Overnight Oats & Banana',
      grams: 250,
      calories: 360,
      proteinG: 14,
      carbsG: 58,
      fatG: 7,
      disclaimer: DOCTOR_DISCLAIMER_SHORT
    },
    {
      id: 'log-2',
      name: '1 Whole Wheat Roti + Tarka Daal',
      grams: 230,
      calories: 300,
      proteinG: 16,
      carbsG: 50,
      fatG: 5,
      disclaimer: DOCTOR_DISCLAIMER_SHORT
    }
  ]);
  const [showBarcodeModal, setShowBarcodeModal] = useState<boolean>(false);
  const [barcodeInput, setBarcodeInput] = useState<string>('89610003');
  const [fastingActive, setFastingActive] = useState<boolean>(false);
  const [fastingElapsedHours, setFastingElapsedHours] =
    useState<number>(11.5);

  // Toast / Status Banner + Free Limit Paywall Modal
  const [toastBanner, setToastBanner] = useState<string | null>(null);
  const [paywallReason, setPaywallReason] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastBanner(msg);
    setTimeout(() => {
      setToastBanner((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  // Load saved Firestore `users/{uid}/nutritionProfile/main` and community recipes on mount
  useEffect(() => {
    let isMounted = true;
    async function loadFirestoreNutrition() {
      if (!user?.uid) return;
      try {
        const profSnap = await getDoc(
          doc(db, 'users', user.uid, 'nutritionProfile', 'main')
        );
        if (profSnap.exists() && isMounted) {
          const data = profSnap.data() as Partial<SuiteOnboardingProfile>;
          setProfile((prev) => ({
            ...prev,
            ...data,
            uid: user.uid,
            setupCompleted: true
          }));
          if (data.setupCompleted) {
            setSubRoute((curr) => (curr === 'setup' ? 'dashboard' : curr));
          }
        }
      } catch {
        // Fallback to local state silently
      }

      try {
        const recSnap = await getDocs(collection(db, 'recipes'));
        if (!recSnap.empty && isMounted) {
          const loaded: SuiteRecipeItem[] = [];
          recSnap.forEach((d) => {
            const r = d.data() as SuiteRecipeItem;
            if (r && r.id && r.title) loaded.push(r);
          });
          setCommunityRecipes(loaded);
        }
      } catch {
        // Ignore if empty
      }
    }
    loadFirestoreNutrition();
    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  // Calculate allPart 2 Dashboard indexes dynamically
  const indexes = useMemo(
    () => calculateSuiteNutritionIndexes(profile, waterGlasses),
    [profile, waterGlasses]
  );

  // Sync with parent `toolsData.nutrition` + Firestore `users/{uid}/nutritionProfile/main`
  const persistNutritionEverywhere = async (
    nextProfile: SuiteOnboardingProfile,
    nextWater = waterGlasses,
    nextWeights = weightLogs
  ) => {
    const comp = calculateSuiteNutritionIndexes(nextProfile, nextWater);
    // 1. Save to Firestore `users/{uid}/nutritionProfile/main`
    if (user?.uid) {
      try {
        await setDoc(
          doc(db, 'users', user.uid, 'nutritionProfile', 'main'),
          {
            ...nextProfile,
            uid: user.uid,
            bmi: comp.bmi,
            bmrKcal: comp.bmrKcal,
            tdeeKcal: comp.tdeeKcal,
            healthScore: comp.healthScore,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      } catch {
        // Ignore transient write errors
      }
    }

    // 2. Sync with User Profile Control Panel (`toolsData.nutrition`)
    const legacyNut: NutritionProfileData = {
      ...(toolsData.nutrition || {}),
      age: nextProfile.age,
      gender: nextProfile.gender === 'Female' ? 'female' : 'male',
      heightCm:
        nextProfile.heightUnit === 'feet'
          ? Math.round(
              (nextProfile.heightFeet * 12 + nextProfile.heightInches) * 2.54
            )
          : nextProfile.heightCm,
      weightKg: nextProfile.weightKg,
      targetWeightKg: nextProfile.targetWeightKg,
      activityLevel:
        nextProfile.activityLevel === 'Sedentary'
          ? 'sedentary'
          : nextProfile.activityLevel === 'Lightly Active'
          ? 'light'
          : nextProfile.activityLevel === 'Moderately Active'
          ? 'moderate'
          : nextProfile.activityLevel === 'Very Active'
          ? 'active'
          : 'athlete',
      goalType:
        nextProfile.goal === 'Lose Weight'
          ? 'lose'
          : nextProfile.goal === 'Gain Weight' ||
            nextProfile.goal === 'Gain Muscle'
          ? 'gain'
          : 'maintain',
      waterGlassesToday: nextWater,
      weightHistory: nextWeights,
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    };

    await onSaveToolsData({
      ...toolsData,
      nutrition: legacyNut,
      lastActiveTool: 'nutrition',
      updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
    });
  };

  // ============================================================================
  // PART 7: FREE VS PREMIUM GATEKEEPER
  // ============================================================================
  const triggerPremiumLock = (featureDesc: string) => {
    setPaywallReason(featureDesc);
  };

  // Save Onboarding Form (Part 1)
  const handleSaveOnboardingSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUserPaid && profile.freeBmiCalculatedCount >= 1) {
      triggerPremiumLock(
        'Free users can calculate BMI & Health Score 1 time. Upgrade to Paid Premium for unlimited recalculations & tracking!'
      );
      return;
    }

    const updatedProfile: SuiteOnboardingProfile = {
      ...profile,
      uid: user.uid,
      setupCompleted: true,
      freeBmiCalculatedCount: (profile.freeBmiCalculatedCount || 0) + 1,
      updatedAt: new Date().toISOString()
    };
    setProfile(updatedProfile);
    const freshPlan = generate7DayMealPlan(updatedProfile);
    setWeekMealPlan(freshPlan);
    if (
      updatedProfile.healthConditions.length > 0 &&
      updatedProfile.healthConditions[0] !== 'None'
    ) {
      setActiveHealthCondition(updatedProfile.healthConditions[0]);
      setHealthQueryInput(updatedProfile.healthConditions[0]);
    } else if (updatedProfile.customHealthCondition.trim()) {
      setActiveHealthCondition(updatedProfile.customHealthCondition.trim());
      setHealthQueryInput(updatedProfile.customHealthCondition.trim());
    }

    await persistNutritionEverywhere(updatedProfile);
    setSubRoute('dashboard');
    showToast(
      'Nutrition Profile Calculated & Saved to Firestore (users/uid/nutritionProfile)!'
    );
  };

  // Water Intake + Add Glass (Part 2)
  const handleAddWaterGlass = async () => {
    const nextWater = Math.min(16, waterGlasses + 1);
    setWaterGlasses(nextWater);
    if (user?.uid) {
      try {
        await setDoc(
          doc(db, 'users', user.uid, 'waterLogs', todayIso),
          {
            uid: user.uid,
            date: todayIso,
            glasses: nextWater,
            goalGlasses: profile.dailyWaterGoalGlasses || 8,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      } catch {
        // Ignore
      }
    }
    await persistNutritionEverywhere(profile, nextWater, weightLogs);
    showToast(
      `Water Intake Updated: ${nextWater} / ${
        profile.dailyWaterGoalGlasses || 8
      } glasses logged!`
    );
  };

  // Log Daily Weight (Part 2)
  const handleLogDailyWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUserPaid && weightLogs.length >= 6) {
      triggerPremiumLock(
        'Unlimited 30-Day Weight Progress Logging is a Paid Premium feature.'
      );
      return;
    }
    const w = Number(newWeightInput);
    if (!w || w < 30 || w > 240) return;
    const hCm =
      profile.heightUnit === 'feet'
        ? (profile.heightFeet * 12 + profile.heightInches) * 2.54
        : profile.heightCm || 172;
    const hM = hCm / 100;
    const newBmi = Number((w / (hM * hM)).toFixed(1));
    const label = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    const nextLogs = [
      ...weightLogs.slice(-29),
      { date: label, weightKg: w, bmi: newBmi }
    ];
    const nextProf = {
      ...profile,
      weightKg: w,
      streakDays: (profile.streakDays || 5) + 1
    };
    setWeightLogs(nextLogs);
    setProfile(nextProf);
    await persistNutritionEverywhere(nextProf, waterGlasses, nextLogs);
    showToast(`Logged ${w} kg (BMI ${newBmi}) on 30-Day Weight Progress Chart!`);
  };

  // Current Selected Day Meal Plan (Part 3)
  const currentDayPlan = useMemo(
    () =>
      weekMealPlan.find((d) => d.dayKey === selectedDayKey) || weekMealPlan[0],
    [weekMealPlan, selectedDayKey]
  );

  const currentDayTotals = useMemo(() => {
    const allItems = [
      ...currentDayPlan.breakfast,
      ...currentDayPlan.lunch,
      ...currentDayPlan.dinner,
      ...currentDayPlan.snack
    ];
    return allItems.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        proteinG: acc.proteinG + item.proteinG,
        carbsG: acc.carbsG + item.carbsG,
        fatG: acc.fatG + item.fatG
      }),
      { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
    );
  }, [currentDayPlan]);

  const saveMealPlanToFirestore = async (updatedWeek: DayMealPlanData[]) => {
    if (!user?.uid) return;
    try {
      await setDoc(
        doc(db, 'users', user.uid, 'mealPlans', todayIso),
        {
          uid: user.uid,
          date: todayIso,
          weekPlan: updatedWeek,
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      );
    } catch {
      // Ignore
    }
  };

  // Swap Meal Handler (Part 3)
  const handleSwapMeal = async () => {
    if (!isUserPaid) {
      triggerPremiumLock(
        'AI Meal Swapping & 7-Day Custom Meal Plans require Paid Premium Membership.'
      );
      return;
    }
    const randomIdx = Math.floor(Math.random() * 2);
    const updatedWeek = weekMealPlan.map((d) => {
      if (d.dayKey !== selectedDayKey) return d;
      return {
        ...d,
        breakfast: SWAP_MEAL_ALTERNATIVES.breakfast[randomIdx],
        lunch: SWAP_MEAL_ALTERNATIVES.lunch[randomIdx],
        dinner: SWAP_MEAL_ALTERNATIVES.dinner[randomIdx],
        snack: SWAP_MEAL_ALTERNATIVES.snack[randomIdx]
      };
    });
    setWeekMealPlan(updatedWeek);
    await saveMealPlanToFirestore(updatedWeek);
    showToast(
      `Swapped ${selectedDayKey}'s meals with similar-calorie healthy alternatives!`
    );
  };

  // Generate New AI Plan (Part 3)
  const handleRegenerateAiPlan = async () => {
    if (!isUserPaid) {
      triggerPremiumLock(
        'Generating a full 7-Day AI Meal Plan is a Paid Premium feature.'
      );
      return;
    }
    const base = generate7DayMealPlan(profile);
    // Rotate templates so user sees fresh combinations immediately
    const rotated = base.map((d, i) => {
      const donor = base[(i + 1) % base.length];
      return {
        ...d,
        breakfast: donor.breakfast,
        lunch: donor.lunch,
        dinner: donor.dinner,
        snack: donor.snack
      };
    });
    setWeekMealPlan(rotated);
    await saveMealPlanToFirestore(rotated);
    showToast('Generated a brand-new 7-Day AI Meal Plan tailored to your Goal!');
  };

  // Build Grocery List from Week Plan (Part 3)
  const handleOpenGroceryList = () => {
    if (!isUserPaid) {
      triggerPremiumLock(
        'Auto-Generated Weekly Grocery List is a Paid Premium feature.'
      );
      return;
    }
    const map = new Map<string, number>();
    weekMealPlan.forEach((day) => {
      [...day.breakfast, ...day.lunch, ...day.dinner, ...day.snack].forEach(
        (item) => {
          map.set(item.name, (map.get(item.name) || 0) + item.grams);
        }
      );
    });
    const list: GroceryItem[] = Array.from(map.entries()).map(
      ([name, totalGrams], idx) => ({
        id: `groc-${idx}`,
        name,
        totalGrams,
        category: 'Weekly Plan Ingredient',
        checked: false
      })
    );
    setGroceryList(list);
    setShowGroceryModal(true);
  };

  // Add Custom Food to Meal Plan Section (Part 3)
  const handleAddCustomFoodToMealPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingToMealSection || !customMealFoodName.trim()) return;
    const g = Math.max(10, Number(customMealGrams) || 100);
    const cal = Math.max(10, Number(customMealCalories) || 150);
    const newEntry: MealFoodEntry = {
      id: `custom-${Date.now()}`,
      name: customMealFoodName.trim(),
      grams: g,
      calories: cal,
      proteinG: Math.round((cal * 0.25) / 4),
      carbsG: Math.round((cal * 0.45) / 4),
      fatG: Math.round((cal * 0.3) / 9),
      disclaimer: DOCTOR_DISCLAIMER_SHORT
    };
    const updatedWeek = weekMealPlan.map((d) => {
      if (d.dayKey !== selectedDayKey) return d;
      return {
        ...d,
        [addingToMealSection]: [...d[addingToMealSection], newEntry]
      };
    });
    setWeekMealPlan(updatedWeek);
    setCustomMealFoodName('');
    setAddingToMealSection(null);
    await saveMealPlanToFirestore(updatedWeek);
    showToast(`Added "${newEntry.name} · ${newEntry.grams}g · ${newEntry.calories} kcal" to ${selectedDayKey}!`);
  };

  // Delete or Edit Grams of Meal Item (Part 3)
  const handleDeleteMealPlanItem = async (
    section: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    itemId: string
  ) => {
    const updatedWeek = weekMealPlan.map((d) => {
      if (d.dayKey !== selectedDayKey) return d;
      return {
        ...d,
        [section]: d[section].filter((x) => x.id !== itemId)
      };
    });
    setWeekMealPlan(updatedWeek);
    await saveMealPlanToFirestore(updatedWeek);
  };

  const handleSaveEditedGrams = async (
    section: 'breakfast' | 'lunch' | 'dinner' | 'snack',
    item: MealFoodEntry
  ) => {
    const newG = Math.max(10, Number(editingGramsVal) || item.grams);
    const ratio = newG / Math.max(1, item.grams);
    const updatedWeek = weekMealPlan.map((d) => {
      if (d.dayKey !== selectedDayKey) return d;
      return {
        ...d,
        [section]: d[section].map((x) =>
          x.id === item.id
            ? {
                ...x,
                grams: newG,
                calories: Math.round(x.calories * ratio),
                proteinG: Math.round(x.proteinG * ratio),
                carbsG: Math.round(x.carbsG * ratio),
                fatG: Math.round(x.fatG * ratio)
              }
            : x
        )
      };
    });
    setWeekMealPlan(updatedWeek);
    setEditingEntryId(null);
    await saveMealPlanToFirestore(updatedWeek);
    showToast(`Updated portion to ${newG}g!`);
  };

  // Recipes Filtering & Actions (Part 4)
  const allCombinedRecipes = useMemo(() => {
    const map = new Map<string, SuiteRecipeItem>();
    PRELOADED_44_RECIPES.forEach((r) => map.set(r.id, r));
    communityRecipes.forEach((r) => map.set(r.id, r));
    return Array.from(map.values());
  }, [communityRecipes]);

  const filteredRecipes = useMemo(() => {
    return allCombinedRecipes.filter((r) => {
      if (recipeCategory === 'Saved') {
        if (!profile.savedRecipeIds.includes(r.id)) return false;
      } else if (recipeCategory !== 'All' && r.category !== recipeCategory) {
        return false;
      }
      if (recipeSearch.trim()) {
        const q = recipeSearch.toLowerCase();
        const inTitle = r.title.toLowerCase().includes(q);
        const inIng = r.ingredients.some((i) =>
          i.item.toLowerCase().includes(q)
        );
        if (!inTitle && !inIng) return false;
      }
      if (calorieFilter === 'low' && r.calories >= 300) return false;
      if (
        calorieFilter === 'medium' &&
        (r.calories < 300 || r.calories > 500)
      )
        return false;
      if (calorieFilter === 'high' && r.calories <= 500) return false;

      if (vegFilter === 'veg' && !r.isVeg) return false;
      if (vegFilter === 'nonveg' && r.isVeg) return false;

      if (timeFilter === 'under20' && r.cookTimeMin >= 20) return false;
      if (
        timeFilter === '20to40' &&
        (r.cookTimeMin < 20 || r.cookTimeMin > 40)
      )
        return false;
      if (timeFilter === 'over40' && r.cookTimeMin <= 40) return false;

      return true;
    });
  }, [
    allCombinedRecipes,
    recipeCategory,
    recipeSearch,
    calorieFilter,
    vegFilter,
    timeFilter,
    profile.savedRecipeIds
  ]);

  const handleToggleSaveRecipe = async (recipeId: string) => {
    const exists = profile.savedRecipeIds.includes(recipeId);
    const nextSaved = exists
      ? profile.savedRecipeIds.filter((id) => id !== recipeId)
      : [...profile.savedRecipeIds, recipeId];
    const nextProf = { ...profile, savedRecipeIds: nextSaved };
    setProfile(nextProf);
    await persistNutritionEverywhere(nextProf);
    showToast(
      exists ? 'Removed recipe from Favorites.' : 'Recipe saved to Favorites!'
    );
  };

  const handleAddRecipeToMealPlan = async (recipe: SuiteRecipeItem) => {
    const totalGrams = recipe.ingredients.reduce((s, i) => s + i.grams, 0) || 220;
    const entry: MealFoodEntry = {
      id: `rec-meal-${Date.now()}`,
      name: recipe.title,
      grams: totalGrams,
      calories: recipe.calories,
      proteinG: recipe.proteinG,
      carbsG: recipe.carbsG,
      fatG: recipe.fatG,
      disclaimer: DOCTOR_DISCLAIMER_SHORT
    };
    const updatedWeek = weekMealPlan.map((d) => {
      if (d.dayKey !== selectedDayKey) return d;
      return {
        ...d,
        lunch: [...d.lunch, entry]
      };
    });
    setWeekMealPlan(updatedWeek);
    await saveMealPlanToFirestore(updatedWeek);
    showToast(
      `Added "${recipe.title}" (${totalGrams}g • ${recipe.calories} kcal) to ${selectedDayKey}'s Lunch Plan!`
    );
  };

  const handleSubmitCommunityRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipeTitle.trim()) return;
    const newRec: SuiteRecipeItem = {
      id: `comm-${Date.now()}`,
      title: newRecipeTitle.trim(),
      category: newRecipeCategory,
      imageUrl:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      calories: Math.max(50, Number(newRecipeCalories) || 320),
      proteinG: Math.max(2, Number(newRecipeProtein) || 18),
      carbsG: Math.max(5, Number(newRecipeCarbs) || 30),
      fatG: 12,
      fiberG: 5,
      cookTimeMin: Math.max(5, Number(newRecipeTime) || 25),
      difficulty: 'Easy',
      isVeg: false,
      ingredients: newRecipeIngredientsText.split(',').map((seg) => ({
        item: seg.trim() || 'Fresh Ingredient',
        grams: 100
      })),
      instructions: newRecipeStepsText
        .split('.')
        .map((s) => s.trim())
        .filter(Boolean),
      healthBenefits: [
        'Community verified balanced recipe with wholesome ingredients.'
      ],
      disclaimer: DOCTOR_DISCLAIMER_SHORT,
      createdByUid: user.uid,
      authorName: user.name || 'Food Specialist'
    };

    try {
      await setDoc(doc(db, 'recipes', newRec.id), newRec);
    } catch {
      // Ignore
    }
    setCommunityRecipes((prev) => [newRec, ...prev]);
    setShowSubmitRecipeModal(false);
    setNewRecipeTitle('');
    showToast(`Published "${newRec.title}" to Community Recipes!`);
  };

  // Health Condition Search Handler (Part 5)
  const currentHealthData = useMemo(
    () => getHealthConditionRecommendations(activeHealthCondition),
    [activeHealthCondition]
  );

  const handleSearchHealthCondition = async (
    e?: React.FormEvent,
    presetCond?: string
  ) => {
    if (e) e.preventDefault();
    const target = (presetCond ?? healthQueryInput).trim();
    if (!target) return;

    if (!isUserPaid && profile.freeHealthSearchCount >= 1) {
      triggerPremiumLock(
        'Free users can search 1 Health Condition. Upgrade to Paid Premium for unlimited Health Condition Food Recommendations!'
      );
      return;
    }

    setActiveHealthCondition(target);
    setHealthQueryInput(target);
    const nextProf = {
      ...profile,
      freeHealthSearchCount: (profile.freeHealthSearchCount || 0) + 1
    };
    setProfile(nextProf);

    if (user?.uid) {
      try {
        await setDoc(
          doc(db, 'users', user.uid, 'healthRecommendations', 'latest'),
          {
            uid: user.uid,
            conditionName: target,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
      } catch {
        // Ignore
      }
    }
  };

  // AI Dietitian Chat Send Handler (Part 5 & 6)
  const handleSendDietitianMessage = (
    e?: React.FormEvent,
    quickQuestion?: string
  ) => {
    if (e) e.preventDefault();
    const questionText = (quickQuestion ?? chatInput).trim();
    if (!questionText) return;

    if (!isUserPaid && chatMessages.length >= 3) {
      triggerPremiumLock(
        'Unlimited AI Dietitian Chat is a Paid Premium feature. Upgrade to ask unlimited nutrition questions!'
      );
      return;
    }

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user' as const,
      text: questionText,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    const replyText = generateDietitianAnswer(questionText, profile, indexes);
    const botMsg = {
      id: `b-${Date.now() + 1}`,
      sender: 'dietitian' as const,
      text: replyText,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setChatMessages((prev) => [...prev, userMsg, botMsg]);
    if (!quickQuestion) setChatInput('');
  };

  // Weekly Report PDF Download (Part 6)
  const handleDownloadWeeklyNutritionPdf = () => {
    if (!isUserPaid) {
      triggerPremiumLock(
        'Downloading the Weekly Personalized Nutrition PDF Report requires Paid Premium Membership.'
      );
      return;
    }
    const pdf = new jsPDF();
    pdf.setFillColor(19, 66, 43);
    pdf.rect(0, 0, 210, 36, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.text('WEEKLY NUTRITION & HEALTH REPORT', 14, 16);
    pdf.setFontSize(10);
    pdf.text(
      `Prepared For: ${profile.fullName || user.name} | Goal: ${
        profile.goal
      } | Diet: ${profile.dietPreference}`,
      14,
      25
    );
    pdf.text(
      `Generated on: ${new Date().toLocaleDateString()} | Developed by Food Specialist`,
      14,
      31
    );

    pdf.setTextColor(15, 41, 30);
    pdf.setFontSize(12);
    pdf.text('1. Body Composition & Metabolic Indexes', 14, 48);
    pdf.setFontSize(10);
    pdf.text(
      `• BMI: ${indexes.bmi} (${indexes.bmiStatus})   |   Health Score: ${indexes.healthScore}/100 (${indexes.healthScoreLabel})`,
      16,
      56
    );
    pdf.text(
      `• Current Weight: ${profile.weightKg} kg   |   Target Weight: ${profile.targetWeightKg} kg   |   Ideal Weight (Devine): ${indexes.idealWeightKg} kg`,
      16,
      63
    );
    pdf.text(
      `• BMR (Mifflin-St Jeor): ${indexes.bmrKcal} kcal/day   |   TDEE: ${indexes.tdeeKcal} kcal/day`,
      16,
      70
    );
    pdf.text(
      `• Body Fat Estimate: ${indexes.bodyFatPct}%   |   Visceral Fat Level: ${indexes.visceralFatLevel} (${indexes.visceralFatStatus})`,
      16,
      77
    );
    pdf.text(
      `• Daily Calorie Target: ${indexes.dailyCaloriesNeeded} kcal   |   Water Intake: ${waterGlasses}/${profile.dailyWaterGoalGlasses} glasses`,
      16,
      84
    );
    pdf.text(
      `• Daily Macros Target: Protein ${indexes.targetProteinG}g  •  Carbs ${indexes.targetCarbsG}g  •  Fat ${indexes.targetFatG}g`,
      16,
      91
    );

    pdf.setFontSize(12);
    pdf.text(
      `2. Today's Meal Plan (${currentDayPlan.fullDateLabel} — ${currentDayTotals.calories} kcal)`,
      14,
      105
    );
    pdf.setFontSize(9.5);
    let y = 113;
    (
      [
        ['Breakfast (8:00 AM)', currentDayPlan.breakfast],
        ['Lunch (12:30 PM)', currentDayPlan.lunch],
        ['Dinner (7:30 PM)', currentDayPlan.dinner],
        ['Snack (4:00 PM)', currentDayPlan.snack]
      ] as const
    ).forEach(([label, list]) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(label, 16, y);
      y += 5;
      pdf.setFont('helvetica', 'normal');
      list.forEach((item) => {
        pdf.text(
          `   - ${item.name} • ${item.grams}g • ${item.calories} kcal (${item.disclaimer})`,
          18,
          y
        );
        y += 5;
      });
      y += 2;
    });

    pdf.setFontSize(9);
    pdf.setTextColor(180, 40, 40);
    pdf.text(DOCTOR_DISCLAIMER_BANNER, 14, Math.min(282, y + 8));

    pdf.save(
      `${(profile.fullName || 'Specialist').replace(/\s+/g, '_')}_Weekly_Nutrition_Report.pdf`
    );
    showToast('Downloaded Weekly Nutrition Report PDF!');
  };

  // Calculate BMI Gauge pointer angle (-90 deg to +90 deg across BMI 14 to 36)
  const bmiGaugeAngle = useMemo(() => {
    const clamped = Math.max(14, Math.min(36, indexes.bmi));
    return ((clamped - 14) / 22) * 180 - 90;
  }, [indexes.bmi]);

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-8">
      {/* TOAST BANNER */}
      {toastBanner && (
        <div className="p-3.5 rounded-2xl bg-[#14532D] text-white text-xs font-extrabold flex items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{toastBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastBanner(null)}
            className="text-emerald-200 hover:text-white underline text-[11px] cursor-pointer"
          >
            Close
          </button>
        </div>
      )}

      {/* PART 7: FREE VS PREMIUM LOCK MODAL */}
      {paywallReason && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#16A34A] rounded-[28px] max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center shrink-0">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase">
                    {hasExpiredPremium
                      ? 'Membership Expired'
                      : 'Upgrade to Paid Premium'}
                  </span>
                  <h3 className="text-base font-extrabold text-[#0F291E] mt-0.5">
                    Unlock Full Nutrition Suite
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPaywallReason(null)}
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#86EFAC] text-xs text-[#14532D] font-bold leading-relaxed">
              🔒 {paywallReason}
            </div>

            <div className="text-xs text-gray-600 space-y-1">
              <div className="font-extrabold text-[#0F291E]">
                Paid Premium Includes:
              </div>
              <div>✓ Unlimited BMI, BMR, TDEE &amp; 30-Day Weight Tracking</div>
              <div>✓ Full 7-Day AI Meal Plan + Meal Swaps + Grocery List</div>
              <div>✓ All 44+ Desi, Pakistani, Chinese, Italian &amp; Healthy Recipes</div>
              <div>✓ Unlimited Health Condition Search &amp; AI Dietitian Chat</div>
              <div>✓ Weekly PDF Nutrition Report &amp; 16:8 Fasting Timer</div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setPaywallReason(null);
                  onOpenPremiumModal();
                }}
                className="w-full py-3.5 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Crown className="w-4 h-4 text-amber-200" />
                <span>Upgrade to Premium Now</span>
              </button>
              <button
                type="button"
                onClick={() => setPaywallReason(null)}
                className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold cursor-pointer"
              >
                Continue Free Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP QUICK SUB-NAVIGATION PILLS FOR ALL 7 NUTRITION SCREENS */}
      <div className="bg-white border border-[#D1FAE5] rounded-[22px] p-2.5 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Dashboard (BMI)', icon: Home },
          { id: 'meal-plan', label: 'Meal Plan', icon: Calendar },
          { id: 'recipes', label: 'Recipes (44+)', icon: Utensils },
          { id: 'health', label: 'Health Conditions', icon: Heart },
          { id: 'dietitian-chat', label: 'AI Dietitian', icon: Sparkles },
          { id: 'stats-foodlog', label: 'Food Log & Fasting', icon: Activity },
          { id: 'setup', label: 'Setup Profile', icon: User }
        ].map((tab) => {
          const IconComp = tab.icon;
          const active = subRoute === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubRoute(tab.id as NutritionSubRoute)}
              className={`px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                active
                  ? 'bg-[#15803D] text-white shadow-xs'
                  : 'bg-[#F0FDF4] text-[#14532D] hover:bg-[#DCFCE7]'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          PART 1: ONBOARDING USER DETAILS FORM (/nutrition/setup)
         ===================================================================== */}
      {subRoute === 'setup' && (
        <form
          onSubmit={handleSaveOnboardingSetup}
          className="bg-white border border-[#BBF7D0] rounded-[28px] p-5 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[10px] font-extrabold uppercase">
                Part 1 • Onboarding Profile (/nutrition/setup)
              </span>
              <h2 className="text-lg font-extrabold text-[#0F291E] mt-1">
                Personalize Your Nutrition &amp; Health Plan
              </h2>
              <p className="text-xs text-gray-500">
                Complete your profile to calculate BMI, Health Score, BMR, TDEE,
                Macros &amp; 7-Day Meal Plan
              </p>
            </div>
            {profile.setupCompleted && (
              <button
                type="button"
                onClick={() => setSubRoute('dashboard')}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-[#15803D] text-xs font-extrabold cursor-pointer"
              >
                Dashboard →
              </button>
            )}
          </div>

          {/* Basic Info: Full Name, Age, Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-extrabold text-[#14532D] mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profile.fullName}
                onChange={(e) =>
                  setProfile({ ...profile, fullName: e.target.value })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs font-bold text-[#0F291E]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#14532D] mb-1">
                Age (Years)
              </label>
              <input
                type="number"
                min={14}
                max={95}
                required
                value={profile.age}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    age: Number(e.target.value) || 28
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs font-bold text-[#0F291E]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#14532D] mb-1">
                Gender
              </label>
              <select
                value={profile.gender}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    gender: e.target.value as GenderOption
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs font-bold text-[#0F291E]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Height (cm or feet), Weight (kg), Target Weight (kg), Waist (cm) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-extrabold text-[#14532D]">
                  Height ({profile.heightUnit})
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      heightUnit: profile.heightUnit === 'cm' ? 'feet' : 'cm'
                    })
                  }
                  className="text-[10px] font-extrabold text-[#16A34A] underline cursor-pointer"
                >
                  Use {profile.heightUnit === 'cm' ? 'feet' : 'cm'}
                </button>
              </div>
              {profile.heightUnit === 'cm' ? (
                <input
                  type="number"
                  min={120}
                  max={230}
                  value={profile.heightCm}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      heightCm: Number(e.target.value) || 172
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs font-bold text-[#0F291E]"
                />
              ) : (
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="number"
                    min={4}
                    max={7}
                    value={profile.heightFeet}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        heightFeet: Number(e.target.value) || 5
                      })
                    }
                    placeholder="Ft"
                    className="w-full px-2 py-2.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs font-bold"
                  />
                  <input
                    type="number"
                    min={0}
                    max={11}
                    value={profile.heightInches}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        heightInches: Number(e.target.value) || 8
                      })
                    }
                    placeholder="In"
                    className="w-full px-2 py-2.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs font-bold"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#14532D] mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min={30}
                max={240}
                value={profile.weightKg}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    weightKg: Number(e.target.value) || 71.6
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs font-bold text-[#0F291E]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#14532D] mb-1">
                Target Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min={35}
                max={200}
                value={profile.targetWeightKg}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    targetWeightKg: Number(e.target.value) || 68
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs font-bold text-[#0F291E]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#14532D] mb-1">
                Waist (cm)
              </label>
              <input
                type="number"
                min={55}
                max={160}
                value={profile.waistCm}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    waistCm: Number(e.target.value) || 82
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs font-bold text-[#0F291E]"
              />
            </div>
          </div>

          {/* Activity Level, Goal, Diet Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-[#14532D] mb-1">
                Activity Level
              </label>
              <select
                value={profile.activityLevel}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    activityLevel: e.target.value as ActivityLevelOption
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs font-bold text-[#0F291E]"
              >
                <option value="Sedentary">Sedentary</option>
                <option value="Lightly Active">Lightly Active</option>
                <option value="Moderately Active">Moderately Active</option>
                <option value="Very Active">Very Active</option>
                <option value="Athlete">Athlete</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#14532D] mb-1">
                Primary Goal
              </label>
              <select
                value={profile.goal}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    goal: e.target.value as GoalOption
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs font-bold text-[#0F291E]"
              >
                <option value="Lose Weight">Lose Weight</option>
                <option value="Maintain Weight">Maintain Weight</option>
                <option value="Gain Weight">Gain Weight</option>
                <option value="Gain Muscle">Gain Muscle</option>
                <option value="Improve Health">Improve Health</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#14532D] mb-1">
                Diet Preference
              </label>
              <select
                value={profile.dietPreference}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    dietPreference: e.target.value as DietPreferenceOption
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs font-bold text-[#0F291E]"
              >
                <option value="Normal">Normal</option>
                <option value="Desi">Desi</option>
                <option value="Halal">Halal</option>
                <option value="High Protein">High Protein</option>
                <option value="Low Carb">Low Carb</option>
                <option value="Keto">Keto</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>
          </div>

          {/* Allergies Multi-Select Pills */}
          <div>
            <label className="block text-xs font-extrabold text-[#14532D] mb-1.5">
              Allergies (Tap all that apply)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ALLERGY_OPTIONS.map((allergy) => {
                const selected = profile.allergies.includes(allergy);
                return (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() => {
                      if (allergy === 'None') {
                        setProfile({ ...profile, allergies: ['None'] });
                      } else {
                        const withoutNone = profile.allergies.filter(
                          (a) => a !== 'None'
                        );
                        const next = selected
                          ? withoutNone.filter((a) => a !== allergy)
                          : [...withoutNone, allergy];
                        setProfile({
                          ...profile,
                          allergies: next.length ? next : ['None']
                        });
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#15803D] text-white border-[#15803D]'
                        : 'bg-[#F0FDF4] text-[#14532D] border-[#BBF7D0]'
                    }`}
                  >
                    {allergy}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Health Conditions Multi-Select + Custom Condition Text Field */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-[#14532D]">
              Health Conditions (Select or type your own condition below)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {HEALTH_CONDITION_PRESETS.map((cond) => {
                const selected = profile.healthConditions.includes(cond);
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => {
                      if (cond === 'None') {
                        setProfile({ ...profile, healthConditions: ['None'] });
                      } else {
                        const withoutNone = profile.healthConditions.filter(
                          (c) => c !== 'None'
                        );
                        const next = selected
                          ? withoutNone.filter((c) => c !== cond)
                          : [...withoutNone, cond];
                        setProfile({
                          ...profile,
                          healthConditions: next.length ? next : ['None']
                        });
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      selected
                        ? 'bg-[#15803D] text-white border-[#15803D]'
                        : 'bg-[#F0FDF4] text-[#14532D] border-[#BBF7D0]'
                    }`}
                  >
                    {cond}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              value={profile.customHealthCondition}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  customHealthCondition: e.target.value
                })
              }
              placeholder="Type your own condition (e.g. Uric Acid, Fatty Liver, IBS, Migraine...)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs font-bold text-[#0F291E]"
            />
          </div>

          {/* Daily Water Goal & Sleep Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-[#14532D] mb-1">
                Daily Water Goal (Glasses)
              </label>
              <input
                type="number"
                min={4}
                max={16}
                value={profile.dailyWaterGoalGlasses}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    dailyWaterGoalGlasses: Number(e.target.value) || 8
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs font-bold text-[#0F291E]"
              />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-[#14532D] mb-1">
                Sleep Hours (Per Night)
              </label>
              <input
                type="number"
                step="0.5"
                min={3}
                max={12}
                value={profile.sleepHours}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    sleepHours: Number(e.target.value) || 7.5
                  })
                }
                className="w-full px-3 py-2.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs font-bold text-[#0F291E]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Calculate My Nutrition</span>
          </button>
        </form>
      )}

      {/* =====================================================================
          PART 2: NUTRITION DASHBOARD (/nutrition — EXACT DESIGN OF IMAGE 1)
         ===================================================================== */}
      {subRoute === 'dashboard' && (
        <div className="bg-[#F9FBF9] border border-[#E2E8F0] rounded-[32px] p-4 sm:p-6 shadow-md space-y-5">
          {/* Top Header: Nutrition Dashboard + Date + Bell + Avatar */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-2xl sm:text-[26px] font-extrabold text-[#0F291E] tracking-tight">
                Nutrition Dashboard
              </h2>
              <p className="text-xs font-medium text-gray-500 mt-0.5">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })}{' '}
                • Updated 8:42 AM
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const next = !profile.waterReminderEvery2Hours;
                  setProfile({ ...profile, waterReminderEvery2Hours: next });
                  showToast(
                    next
                      ? '2-Hour Water Intake Reminder Enabled!'
                      : 'Water Intake Reminder Paused.'
                  );
                }}
                title="Toggle 2-Hour Water Reminder"
                className={`w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer transition-colors ${
                  profile.waterReminderEvery2Hours
                    ? 'bg-emerald-50 border-[#16A34A] text-[#16A34A]'
                    : 'bg-white border-gray-200 text-gray-500'
                }`}
              >
                <Bell className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setSubRoute('setup')}
                title="Edit Nutrition Setup Profile"
                className="w-10 h-10 rounded-full bg-[#BBF7D0] text-[#15803D] flex items-center justify-center font-extrabold cursor-pointer"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* BIG BMI GAUGE + CIRCULAR HEALTH SCORE RING (MATCHING IMAGE 1) */}
          <div className="bg-white rounded-[28px] p-4 sm:p-5 shadow-xs border border-emerald-100/80">
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4">
              {/* Big Semi-Circular BMI Gauge */}
              <div className="sm:col-span-8 flex flex-col items-center justify-center relative pt-2">
                <svg viewBox="0 0 240 135" className="w-64 sm:w-72 h-36">
                  {/* Background Track Arc */}
                  <path
                    d="M 24 120 A 96 96 0 0 1 216 120"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                  {/* Active Green/Status Arc */}
                  <path
                    d="M 24 120 A 96 96 0 0 1 196 62"
                    fill="none"
                    stroke={indexes.bmiColorHex}
                    strokeWidth="18"
                    strokeLinecap="round"
                  />
                  {/* Gauge Pointer Needle */}
                  <g transform={`translate(120, 118) rotate(${bmiGaugeAngle})`}>
                    <line
                      x1="0"
                      y1="-32"
                      x2="0"
                      y2="-96"
                      stroke="#4B5563"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </g>
                </svg>
                <div className="-mt-12 text-center">
                  <div className="text-4xl sm:text-5xl font-extrabold text-[#0F291E] tracking-tight">
                    {indexes.bmi}
                  </div>
                  <span
                    className="inline-block mt-1.5 px-5 py-1 rounded-full text-xs font-extrabold"
                    style={{
                      backgroundColor: indexes.bmiBadgeBg,
                      color: indexes.bmiBadgeText
                    }}
                  >
                    {indexes.bmiStatus}
                  </span>
                </div>

                {/* BMI Scale Bar with Pointer */}
                <div className="w-full max-w-xs mt-3 space-y-1">
                  <div className="flex justify-between text-[9.5px] font-bold text-gray-500">
                    <span className="text-blue-600">&lt;18.5 Blue</span>
                    <span className="text-emerald-600">18.5–24.9 Green</span>
                    <span className="text-orange-600">25–29.9 Orange</span>
                    <span className="text-red-600">30+ Red</span>
                  </div>
                  <div className="relative h-2 rounded-full overflow-hidden flex">
                    <div className="w-1/4 bg-blue-500" />
                    <div className="w-1/4 bg-[#16A34A]" />
                    <div className="w-1/4 bg-orange-500" />
                    <div className="w-1/4 bg-red-500" />
                    <div
                      className="absolute -top-0.5 bottom-0 w-2 h-3 bg-[#0F291E] border border-white rounded-full"
                      style={{
                        left: `${Math.min(
                          95,
                          Math.max(4, ((indexes.bmi - 14) / 22) * 100)
                        )}%`
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Circular Health Score Ring (0–100) */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center">
                <div className="text-xs font-bold text-gray-700 mb-1.5">
                  Health Score
                </div>
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg viewBox="0 0 110 110" className="w-28 h-28">
                    <circle
                      cx="55"
                      cy="55"
                      r="44"
                      fill="none"
                      stroke="#DCFCE7"
                      strokeWidth="8"
                    />
                    <circle
                      cx="55"
                      cy="55"
                      r="44"
                      fill="none"
                      stroke="#16A34A"
                      strokeWidth="8"
                      strokeDasharray={`${(indexes.healthScore / 100) * 276} 276`}
                      strokeLinecap="round"
                      transform="rotate(-90 55 55)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-[#0F291E]">
                      {indexes.healthScore}
                    </span>
                    <span className="text-xs font-bold text-[#16A34A]">
                      {indexes.healthScoreLabel}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-gray-400 mt-1">
                  🔥 {profile.streakDays || 5}-Day Logging Streak
                </span>
              </div>
            </div>
          </div>

          {/* 6 INDEX CARDS IN 2x3 GRID (BMR, TDEE, IDEAL WEIGHT, BODY FAT %, VISCERAL FAT, DAILY CALORIES) */}
          <div className="grid grid-cols-2 gap-3">
            {/* BMR */}
            <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F291E] flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500">BMR</div>
                <div className="text-base sm:text-lg font-extrabold text-[#0F291E]">
                  {indexes.bmrKcal.toLocaleString()}{' '}
                  <span className="text-xs font-semibold">kcal</span>
                </div>
              </div>
            </div>

            {/* TDEE */}
            <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F291E] flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500">TDEE</div>
                <div className="text-base sm:text-lg font-extrabold text-[#0F291E]">
                  {indexes.tdeeKcal.toLocaleString()}{' '}
                  <span className="text-xs font-semibold">kcal</span>
                </div>
              </div>
            </div>

            {/* Ideal Weight (Devine) */}
            <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F291E] flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500">
                  Ideal Weight
                </div>
                <div className="text-base sm:text-lg font-extrabold text-[#0F291E]">
                  {indexes.idealWeightKg}{' '}
                  <span className="text-xs font-semibold">kg</span>
                </div>
              </div>
            </div>

            {/* Body Fat % */}
            <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F291E] flex items-center justify-center font-extrabold text-lg shrink-0">
                %
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500">
                  Body Fat
                </div>
                <div className="text-base sm:text-lg font-extrabold text-[#0F291E]">
                  {indexes.bodyFatPct}%
                </div>
              </div>
            </div>

            {/* Visceral Fat */}
            <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F291E] flex items-center justify-center shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-500">
                  Visceral Fat
                </div>
                <div className="text-base sm:text-lg font-extrabold text-[#0F291E]">
                  {indexes.visceralFatLevel} •{' '}
                  <span className="font-semibold text-sm">
                    {indexes.visceralFatStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Daily Calories Needed */}
            <div className="bg-white rounded-2xl p-3.5 shadow-xs border border-gray-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F291E] flex items-center justify-center shrink-0">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-500">
                    Daily Target
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-[#0F291E]">
                    {indexes.dailyCaloriesNeeded}{' '}
                    <span className="text-xs font-semibold">kcal</span>
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#BBF7D0] text-[#14532D] text-[10px] font-extrabold">
                Healthy
              </span>
            </div>
          </div>

          {/* WATER INTAKE TRACKER CARD (0–8 GLASSES WITH DROPLETS + ADD GLASS) */}
          <div className="bg-white rounded-[24px] p-4 sm:p-5 shadow-xs border border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-[#16A34A]" />
                <h3 className="text-base font-extrabold text-[#0F291E]">
                  Water Intake
                </h3>
              </div>
              <span className="text-sm font-bold text-[#16A34A]">
                {waterGlasses} / {profile.dailyWaterGoalGlasses || 8} glasses
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2.5">
                {Array.from({
                  length: Math.max(8, profile.dailyWaterGoalGlasses || 8)
                }).map((_, idx) => {
                  const filled = idx < waterGlasses;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setWaterGlasses(idx + 1)}
                      className="cursor-pointer transition-transform hover:scale-110"
                      title={`Set water to ${idx + 1} glasses`}
                    >
                      <svg viewBox="0 0 28 36" className="w-7 h-9">
                        <path
                          d="M14 2 C14 2 3 16 3 24 C3 30.2 7.9 34 14 34 C20.1 34 25 30.2 25 24 C25 16 14 2 14 2 Z"
                          fill={filled ? '#16A34A' : 'none'}
                          stroke={filled ? '#16A34A' : '#6B7280'}
                          strokeWidth="2"
                        />
                      </svg>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleAddWaterGlass}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-[#DCFCE7] text-[#15803D] text-xs font-extrabold cursor-pointer transition-colors"
              >
                + Add Glass
              </button>
            </div>
          </div>

          {/* MACROS BREAKDOWN (PROTEIN, CARBS, FAT + VIEW DETAILED PLAN BUTTON) */}
          <div className="space-y-3.5">
            <div>
              <h3 className="text-lg font-extrabold text-[#0F291E]">Macros</h3>
              <p className="text-xs font-medium text-gray-500">
                Daily Calories {indexes.dailyCaloriesNeeded.toLocaleString()} •{' '}
                {profile.goal} Goal
              </p>
            </div>

            <div className="space-y-3">
              {/* Protein */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-extrabold text-[#0F291E]">
                  <span>🥩 Protein</span>
                  <span>
                    {currentDayTotals.proteinG}g / {indexes.targetProteinG}g
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-orange-400"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (currentDayTotals.proteinG /
                            Math.max(1, indexes.targetProteinG)) *
                            100
                        )
                      )}%`
                    }}
                  />
                </div>
              </div>

              {/* Carbs */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-extrabold text-[#0F291E]">
                  <span>🌾 Carbs</span>
                  <span>
                    {currentDayTotals.carbsG}g / {indexes.targetCarbsG}g
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (currentDayTotals.carbsG /
                            Math.max(1, indexes.targetCarbsG)) *
                            100
                        )
                      )}%`
                    }}
                  />
                </div>
              </div>

              {/* Fat */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-extrabold text-[#0F291E]">
                  <span>🥑 Fat</span>
                  <span>
                    {currentDayTotals.fatG}g / {indexes.targetFatG}g
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#16A34A]"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (currentDayTotals.fatG /
                            Math.max(1, indexes.targetFatG)) *
                            100
                        )
                      )}%`
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSubRoute('meal-plan')}
              className="w-full py-4 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>View Detailed Plan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 30-DAY WEIGHT PROGRESS LINE CHART + DAILY WEIGHT LOGGER */}
          <div className="bg-white rounded-[24px] p-4 shadow-xs border border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-[#0F291E]">
                  Weight Progress Chart (Last 30 Days)
                </h4>
                <p className="text-[11px] text-gray-500">
                  Current: {profile.weightKg} kg • Target:{' '}
                  {profile.targetWeightKg} kg
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadWeeklyNutritionPdf}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#15803D] text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Weekly PDF</span>
              </button>
            </div>

            {(() => {
              const allW = [
                ...weightLogs.map((w) => w.weightKg),
                profile.targetWeightKg
              ];
              const minW = Math.floor(Math.min(...allW) - 2);
              const maxW = Math.ceil(Math.max(...allW) + 2);
              const range = Math.max(4, maxW - minW);
              const svgW = 360;
              const svgH = 110;
              const pts = weightLogs
                .map((item, idx) => {
                  const x =
                    24 +
                    (idx / Math.max(1, weightLogs.length - 1)) * (svgW - 48);
                  const y =
                    16 + (1 - (item.weightKg - minW) / range) * (svgH - 36);
                  return `${x},${y}`;
                })
                .join(' ');

              return (
                <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-28">
                  <polyline
                    fill="none"
                    stroke="#16A34A"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pts}
                  />
                  {weightLogs.map((item, idx) => {
                    const x =
                      24 +
                      (idx / Math.max(1, weightLogs.length - 1)) * (svgW - 48);
                    const y =
                      16 + (1 - (item.weightKg - minW) / range) * (svgH - 36);
                    return (
                      <g key={`${item.date}-${idx}`}>
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#15803D"
                          stroke="#fff"
                          strokeWidth="1.5"
                        />
                        <text
                          x={x}
                          y={y - 6}
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="bold"
                          fill="#0F291E"
                        >
                          {item.weightKg}kg
                        </text>
                        <text
                          x={x}
                          y={svgH - 4}
                          textAnchor="middle"
                          fontSize="7.5"
                          fill="#6B7280"
                        >
                          {item.date}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              );
            })()}

            <form
              onSubmit={handleLogDailyWeight}
              className="flex items-center gap-2 pt-1"
            >
              <input
                type="number"
                step="0.1"
                value={newWeightInput}
                onChange={(e) => setNewWeightInput(e.target.value)}
                placeholder="Today's weight (kg)"
                className="flex-1 px-3 py-2 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs font-bold"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#15803D] text-white text-xs font-extrabold cursor-pointer"
              >
                + Log Weight
              </button>
            </form>
          </div>

          {/* BOTTOM NAV BAR INSIDE NUTRITION SUITE (HOME, STATS, FOOD, PROFILE — MATCHING IMAGE 1) */}
          <div className="bg-white rounded-2xl p-2.5 border border-gray-100 flex items-center justify-around">
            <button
              type="button"
              onClick={() => setSubRoute('dashboard')}
              className="flex flex-col items-center gap-0.5 text-[#16A34A] font-extrabold text-[11px] cursor-pointer"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button
              type="button"
              onClick={() => setSubRoute('stats-foodlog')}
              className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-[#16A34A] font-bold text-[11px] cursor-pointer"
            >
              <Activity className="w-5 h-5" />
              <span>Stats</span>
            </button>
            <button
              type="button"
              onClick={() => setSubRoute('recipes')}
              className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-[#16A34A] font-bold text-[11px] cursor-pointer"
            >
              <Utensils className="w-5 h-5" />
              <span>Food</span>
            </button>
            <button
              type="button"
              onClick={() => setSubRoute('setup')}
              className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-[#16A34A] font-bold text-[11px] cursor-pointer"
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          PART 3: MEAL PLANNING (/nutrition/meal-plan — EXACT DESIGN OF IMAGE 4)
         ===================================================================== */}
      {subRoute === 'meal-plan' && (
        <div className="bg-[#F9FBF9] border border-[#E2E8F0] rounded-[32px] p-4 sm:p-6 shadow-md space-y-4">
          {/* Top Header: Back + Meal Plan + AI Sparkle Button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSubRoute('dashboard')}
              className="w-10 h-10 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-extrabold text-[#0F291E]">
              Meal Plan
            </h2>
            <button
              type="button"
              onClick={handleRegenerateAiPlan}
              title="Generate New AI Meal Plan"
              className="w-10 h-10 rounded-full border-2 border-[#16A34A] text-[#16A34A] bg-white flex items-center justify-center cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
            </button>
          </div>

          {/* AI Badge */}
          <div className="flex justify-center">
            <span className="px-3.5 py-1 rounded-full bg-[#E6F4EA] border border-[#A7F3D0] text-[#14532D] text-xs font-bold inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>AI Generated Meal Plan • Oct 14–20, 2024</span>
            </span>
          </div>

          {/* Week Calendar Mon–Sun (Free user gets Mon unlocked; Tue–Sun show Lock for Free user) */}
          <div className="grid grid-cols-7 gap-1.5">
            {weekMealPlan.map((d, idx) => {
              const isSelected = d.dayKey === selectedDayKey;
              const isLockedForFree = !isUserPaid && idx > 0;
              return (
                <button
                  key={d.dayKey}
                  type="button"
                  onClick={() => {
                    if (isLockedForFree) {
                      triggerPremiumLock(
                        'Free users can view 1 Day Meal Plan (Mon). Upgrade to Paid Premium for the Full 7-Day AI Meal Plan!'
                      );
                      return;
                    }
                    setSelectedDayKey(d.dayKey);
                  }}
                  className={`py-2.5 px-1 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-[#16A34A] text-white border-[#16A34A] shadow-sm'
                      : 'bg-white text-[#0F291E] border-[#BBF7D0] hover:bg-emerald-50'
                  }`}
                >
                  <span className="text-[11px] font-bold">{d.dayKey}</span>
                  <span className="text-base font-extrabold leading-tight mt-0.5">
                    {d.dateNumber}
                  </span>
                  {isLockedForFree ? (
                    <Lock className="w-3 h-3 text-amber-600 mt-0.5" />
                  ) : (
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1 ${
                        isSelected ? 'bg-white' : 'bg-[#16A34A]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Daily Summary Header + Green Progress Bar */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-[#0F291E]">
                Today • {currentDayPlan.fullDateLabel}
              </h3>
              <span className="px-3 py-1 rounded-full bg-[#BBF7D0] text-[#14532D] text-xs font-extrabold">
                {currentDayTotals.calories.toLocaleString()} /{' '}
                {indexes.dailyCaloriesNeeded.toLocaleString()} kcal
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#D1FAE5] overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#15803D] to-[#22C55E]"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round(
                      (currentDayTotals.calories /
                        Math.max(1, indexes.dailyCaloriesNeeded)) *
                        100
                    )
                  )}%`
                }}
              />
            </div>
          </div>

          {/* 3 Macro Cards: Protein, Carbs, Fat (Matching Image 4) */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#E6F4EA] border border-[#BBF7D0] text-center space-y-0.5">
              <div className="text-xs font-bold text-[#14532D]">🥩 Protein</div>
              <div className="text-sm sm:text-base font-extrabold text-[#0F291E]">
                {currentDayTotals.proteinG}g / {indexes.targetProteinG}g
              </div>
              <div className="text-[11px] font-semibold text-gray-600">
                {Math.min(
                  100,
                  Math.round(
                    (currentDayTotals.proteinG /
                      Math.max(1, indexes.targetProteinG)) *
                      100
                  )
                )}
                %
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#E6F4EA] border border-[#BBF7D0] text-center space-y-0.5">
              <div className="text-xs font-bold text-[#14532D]">🥦 Carbs</div>
              <div className="text-sm sm:text-base font-extrabold text-[#0F291E]">
                {currentDayTotals.carbsG}g / {indexes.targetCarbsG}g
              </div>
              <div className="text-[11px] font-semibold text-gray-600">
                {Math.min(
                  100,
                  Math.round(
                    (currentDayTotals.carbsG /
                      Math.max(1, indexes.targetCarbsG)) *
                      100
                  )
                )}
                %
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#E6F4EA] border border-[#BBF7D0] text-center space-y-0.5">
              <div className="text-xs font-bold text-[#14532D]">🥑 Fat</div>
              <div className="text-sm sm:text-base font-extrabold text-[#0F291E]">
                {currentDayTotals.fatG}g / {indexes.targetFatG}g
              </div>
              <div className="text-[11px] font-semibold text-gray-600">
                {Math.min(
                  100,
                  Math.round(
                    (currentDayTotals.fatG / Math.max(1, indexes.targetFatG)) *
                      100
                  )
                )}
                %
              </div>
            </div>
          </div>

          {/* Meals for Today (4 Sections: Breakfast 8:00 AM, Lunch 12:30 PM, Dinner 7:30 PM, Snack 4:00 PM) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-[#0F291E]">
                Meals for Today
              </h3>
              <button
                type="button"
                onClick={handleRegenerateAiPlan}
                className="text-xs font-extrabold text-[#16A34A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Generate New AI Plan</span>
              </button>
            </div>

            {(
              [
                {
                  key: 'breakfast',
                  title: 'Breakfast',
                  time: '8:00 AM',
                  items: currentDayPlan.breakfast
                },
                {
                  key: 'lunch',
                  title: 'Lunch',
                  time: '12:30 PM',
                  items: currentDayPlan.lunch
                },
                {
                  key: 'dinner',
                  title: 'Dinner',
                  time: '7:30 PM',
                  items: currentDayPlan.dinner
                },
                {
                  key: 'snack',
                  title: 'Snack',
                  time: '4:00 PM',
                  items: currentDayPlan.snack
                }
              ] as const
            ).map((sec) => {
              const secKcal = sec.items.reduce((s, i) => s + i.calories, 0);
              return (
                <div
                  key={sec.key}
                  className="bg-white rounded-[22px] p-4 shadow-xs border border-gray-100 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#E6F4EA] border border-[#86EFAC] text-[#15803D] flex items-center justify-center shrink-0">
                        <Sun className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-base font-extrabold text-[#0F291E]">
                          {sec.title} •{' '}
                          <span className="font-bold">{secKcal} kcal</span>
                        </div>
                        <div className="text-[11px] font-semibold text-gray-500">
                          • {sec.time}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAddingToMealSection(sec.key)}
                      className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#15803D] text-[11px] font-extrabold cursor-pointer"
                    >
                      + Add Food
                    </button>
                  </div>

                  {/* Food Items with Name, Quantity in Grams, Calories & Doctor Disclaimer */}
                  <div className="space-y-2 pl-1">
                    {sec.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-xl bg-[#F9FBF9] border border-emerald-100/90 flex items-start justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <div className="text-xs sm:text-sm font-bold text-[#0F291E]">
                            • {item.name} •{' '}
                            <span className="text-[#15803D] font-extrabold">
                              {item.grams}g
                            </span>{' '}
                            •{' '}
                            <span className="font-extrabold">
                              {item.calories} kcal
                            </span>
                          </div>
                          <div className="text-[10.5px] font-semibold text-emerald-800/80 flex items-center gap-1">
                            <Info className="w-3 h-3 shrink-0" />
                            <span>{item.disclaimer}</span>
                          </div>

                          {editingEntryId === item.id && (
                            <div className="flex items-center gap-1.5 pt-1">
                              <input
                                type="number"
                                min={10}
                                max={1000}
                                value={editingGramsVal}
                                onChange={(e) =>
                                  setEditingGramsVal(e.target.value)
                                }
                                className="w-20 px-2 py-1 rounded-lg bg-white border border-emerald-400 text-xs font-bold"
                              />
                              <span className="text-[11px] font-bold">g</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleSaveEditedGrams(sec.key, item)
                                }
                                className="px-2.5 py-1 rounded-lg bg-[#16A34A] text-white text-[10.5px] font-extrabold cursor-pointer"
                              >
                                Save
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingEntryId(
                                editingEntryId === item.id ? null : item.id
                              );
                              setEditingGramsVal(String(item.grams));
                            }}
                            title="Edit Quantity (Grams)"
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-emerald-50 hover:text-[#15803D] cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteMealPlanItem(sec.key, item.id)
                            }
                            title="Delete Item"
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Inline Custom Food Form for this Meal Section */}
                  {addingToMealSection === sec.key && (
                    <form
                      onSubmit={handleAddCustomFoodToMealPlan}
                      className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2"
                    >
                      <div className="text-xs font-extrabold text-[#14532D]">
                        Add Custom Food to {sec.title}:
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          required
                          value={customMealFoodName}
                          onChange={(e) =>
                            setCustomMealFoodName(e.target.value)
                          }
                          placeholder="Food Name"
                          className="col-span-3 sm:col-span-1 px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-xs font-bold"
                        />
                        <input
                          type="number"
                          required
                          value={customMealGrams}
                          onChange={(e) => setCustomMealGrams(e.target.value)}
                          placeholder="Grams (g)"
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-xs font-bold"
                        />
                        <input
                          type="number"
                          required
                          value={customMealCalories}
                          onChange={(e) =>
                            setCustomMealCalories(e.target.value)
                          }
                          placeholder="Calories (kcal)"
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-xs font-bold"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-lg bg-[#16A34A] text-white text-xs font-extrabold cursor-pointer"
                        >
                          Add Item
                        </button>
                        <button
                          type="button"
                          onClick={() => setAddingToMealSection(null)}
                          className="px-3 py-1.5 rounded-lg bg-white text-gray-600 text-xs font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Action Buttons: Grocery List & Swap Meal (Matching Image 4) */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleOpenGroceryList}
              className="py-3.5 px-4 rounded-2xl bg-white border-2 border-[#16A34A] text-[#15803D] font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-emerald-50"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Grocery List</span>
            </button>
            <button
              type="button"
              onClick={handleSwapMeal}
              className="py-3.5 px-4 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Swap Meal</span>
            </button>
          </div>

          {/* GROCERY LIST MODAL */}
          {showGroceryModal && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="bg-white rounded-[28px] max-w-md w-full p-5 max-h-[82vh] overflow-y-auto space-y-3 shadow-2xl">
                <div className="flex items-center justify-between border-b pb-2.5">
                  <div>
                    <h4 className="text-base font-extrabold text-[#0F291E]">
                      🛒 Weekly Auto-Generated Grocery List
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Tap items to check/uncheck as you shop
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowGroceryModal(false)}
                    className="p-1.5 rounded-full bg-gray-100 text-gray-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {groceryList.map((g) => (
                    <label
                      key={g.id}
                      className="p-2.5 rounded-xl bg-[#F0FDF4] border border-emerald-200 flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={g.checked}
                          onChange={() =>
                            setGroceryList((prev) =>
                              prev.map((x) =>
                                x.id === g.id
                                  ? { ...x, checked: !x.checked }
                                  : x
                              )
                            )
                          }
                          className="w-4 h-4 accent-[#16A34A]"
                        />
                        <span
                          className={`text-xs font-bold ${
                            g.checked
                              ? 'line-through text-gray-400'
                              : 'text-[#0F291E]'
                          }`}
                        >
                          {g.name}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-[#15803D]">
                        {g.totalGrams}g
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          PART 4: RECIPES SECTION (/nutrition/recipes — EXACT DESIGN OF IMAGE 2)
         ===================================================================== */}
      {subRoute === 'recipes' && (
        <div className="bg-[#F9FBF9] border border-[#E2E8F0] rounded-[32px] p-4 sm:p-6 shadow-md space-y-4">
          {/* Top Header: Recipes + Avatar + Filter Icon */}
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-extrabold text-[#0F291E]">Recipes</h2>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowSubmitRecipeModal(true)}
                className="px-3 py-1.5 rounded-full bg-[#E6F4EA] border border-[#86EFAC] text-[#15803D] text-xs font-extrabold cursor-pointer"
              >
                + Add Recipe
              </button>
              <button
                type="button"
                onClick={() => setSubRoute('setup')}
                className="w-10 h-10 rounded-full border-2 border-[#16A34A] text-[#16A34A] flex items-center justify-center cursor-pointer"
              >
                <User className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setShowRecipeFilters((v) => !v)}
                className="p-2 rounded-xl bg-white border border-gray-200 text-[#15803D] cursor-pointer"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Tabs: Desi, Pakistani, Chinese, Italian, Continental, Healthy, All, Saved */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {(
              [
                'Desi',
                'Pakistani',
                'Chinese',
                'Italian',
                'Continental',
                'Healthy',
                'All',
                'Saved'
              ] as const
            ).map((cat) => {
              const active = recipeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setRecipeCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap cursor-pointer transition-all ${
                    active
                      ? 'bg-[#15803D] text-white shadow-xs'
                      : 'bg-gray-200/80 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#16A34A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={recipeSearch}
              onChange={(e) => setRecipeSearch(e.target.value)}
              placeholder="Search recipes, ingredients..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#EFEFEF] text-xs font-bold text-[#0F291E] placeholder:text-gray-500 focus:outline-hidden"
            />
          </div>

          {/* Collapsible Filters (Calories, Veg/Non-Veg, Time) */}
          {showRecipeFilters && (
            <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 grid grid-cols-3 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 mb-1">
                  By Calories
                </label>
                <select
                  value={calorieFilter}
                  onChange={(e) =>
                    setCalorieFilter(
                      e.target.value as 'all' | 'low' | 'medium' | 'high'
                    )
                  }
                  className="w-full p-1.5 rounded-lg bg-[#F0FDF4] border border-emerald-200 font-bold"
                >
                  <option value="all">All Calories</option>
                  <option value="low">Low (&lt;300)</option>
                  <option value="medium">Medium (300–500)</option>
                  <option value="high">High (&gt;500)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 mb-1">
                  Diet Type
                </label>
                <select
                  value={vegFilter}
                  onChange={(e) =>
                    setVegFilter(e.target.value as 'all' | 'veg' | 'nonveg')
                  }
                  className="w-full p-1.5 rounded-lg bg-[#F0FDF4] border border-emerald-200 font-bold"
                >
                  <option value="all">Veg &amp; Non-Veg</option>
                  <option value="veg">Veg Only</option>
                  <option value="nonveg">Non-Veg Only</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-gray-500 mb-1">
                  Cook Time
                </label>
                <select
                  value={timeFilter}
                  onChange={(e) =>
                    setTimeFilter(
                      e.target.value as 'all' | 'under20' | '20to40' | 'over40'
                    )
                  }
                  className="w-full p-1.5 rounded-lg bg-[#F0FDF4] border border-emerald-200 font-bold"
                >
                  <option value="all">Any Time</option>
                  <option value="under20">&lt; 20 min</option>
                  <option value="20to40">20–40 min</option>
                  <option value="over40">40+ min</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-[#0F291E]">
              Popular Picks ({filteredRecipes.length} Recipes)
            </h3>
            {!isUserPaid && (
              <span className="text-[11px] font-extrabold text-amber-700">
                Free Preview: First 5 Unlocked
              </span>
            )}
          </div>

          {/* Recipe Cards List (Matching Image 2 Layout) */}
          <div className="space-y-3.5">
            {filteredRecipes.map((rec, index) => {
              const isSaved = profile.savedRecipeIds.includes(rec.id);
              const isLockedForFree = !isUserPaid && index >= 5;

              return (
                <div
                  key={rec.id}
                  className="bg-white rounded-[24px] p-3.5 shadow-xs border border-gray-100 space-y-3"
                >
                  <div
                    onClick={() => {
                      if (isLockedForFree) {
                        triggerPremiumLock(
                          'Free users can access 5 Recipes. Upgrade to Paid Premium to unlock all 44+ Desi, Pakistani, Chinese, Italian & Healthy Recipes!'
                        );
                        return;
                      }
                      setSelectedRecipeModal(rec);
                    }}
                    className="flex items-center gap-3.5 cursor-pointer"
                  >
                    <img
                      src={rec.imageUrl}
                      alt={rec.title}
                      loading="lazy"
                      className="w-28 h-24 sm:w-32 sm:h-28 rounded-2xl object-cover shrink-0 bg-gray-100"
                    />
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-base sm:text-lg font-extrabold text-[#0F291E] truncate">
                          {rec.title}
                        </h4>
                        {isLockedForFree && (
                          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#0F291E]">
                          🔥 {rec.calories} kcal
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#0F291E]">
                          💪 Protein {rec.proteinG}g
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#0F291E]">
                          🌾 Carbs {rec.carbsG}g
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-500">
                        <span>🕒 {rec.cookTimeMin} min</span>
                        <span>📶 {rec.difficulty}</span>
                        <span
                          className={
                            rec.isVeg ? 'text-emerald-700' : 'text-amber-700'
                          }
                        >
                          • {rec.isVeg ? 'Veg' : 'Non-Veg'}
                        </span>
                      </div>

                      <div className="text-[10px] font-semibold text-emerald-800 flex items-center gap-1">
                        <Info className="w-3 h-3 shrink-0" />
                        <span>{rec.disclaimer}</span>
                      </div>
                    </div>
                  </div>

                  {/* Save + Add to Meal Plan Buttons (Matching Image 2) */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleToggleSaveRecipe(rec.id)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSaved
                          ? 'bg-emerald-50 border-[#16A34A] text-[#15803D]'
                          : 'bg-white border-[#15803D] text-[#15803D]'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (isLockedForFree) {
                          triggerPremiumLock(
                            'Upgrade to Paid Premium to unlock all 44+ Recipes & 1-Tap Meal Plan additions!'
                          );
                          return;
                        }
                        handleAddRecipeToMealPlan(rec);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Meal Plan</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RECIPE DETAIL MODAL */}
          {selectedRecipeModal && (
            <div className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4">
              <div className="bg-white rounded-[28px] max-w-lg w-full max-h-[86vh] overflow-y-auto p-5 space-y-4 shadow-2xl">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#15803D] text-[10px] font-extrabold uppercase">
                      {selectedRecipeModal.category} •{' '}
                      {selectedRecipeModal.isVeg ? 'Vegetarian' : 'Non-Veg'}
                    </span>
                    <h3 className="text-xl font-extrabold text-[#0F291E] mt-1">
                      {selectedRecipeModal.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedRecipeModal(null)}
                    className="p-1.5 rounded-full bg-gray-100 text-gray-600 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <img
                  src={selectedRecipeModal.imageUrl}
                  alt={selectedRecipeModal.title}
                  className="w-full h-48 rounded-2xl object-cover"
                />

                {/* Nutrition Per Serving */}
                <div className="grid grid-cols-5 gap-1.5 text-center">
                  <div className="p-2 rounded-xl bg-[#F0FDF4] border border-emerald-200">
                    <div className="text-[10px] font-bold text-gray-500">
                      Calories
                    </div>
                    <div className="text-xs font-extrabold text-[#0F291E]">
                      {selectedRecipeModal.calories}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F0FDF4] border border-emerald-200">
                    <div className="text-[10px] font-bold text-gray-500">
                      Protein
                    </div>
                    <div className="text-xs font-extrabold text-[#0F291E]">
                      {selectedRecipeModal.proteinG}g
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F0FDF4] border border-emerald-200">
                    <div className="text-[10px] font-bold text-gray-500">
                      Carbs
                    </div>
                    <div className="text-xs font-extrabold text-[#0F291E]">
                      {selectedRecipeModal.carbsG}g
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F0FDF4] border border-emerald-200">
                    <div className="text-[10px] font-bold text-gray-500">
                      Fat
                    </div>
                    <div className="text-xs font-extrabold text-[#0F291E]">
                      {selectedRecipeModal.fatG}g
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F0FDF4] border border-emerald-200">
                    <div className="text-[10px] font-bold text-gray-500">
                      Fiber
                    </div>
                    <div className="text-xs font-extrabold text-[#0F291E]">
                      {selectedRecipeModal.fiberG}g
                    </div>
                  </div>
                </div>

                {/* Ingredients with Grams */}
                <div>
                  <h4 className="text-xs font-extrabold text-[#14532D] uppercase mb-1.5">
                    Full Ingredients List (with Grams)
                  </h4>
                  <div className="space-y-1">
                    {selectedRecipeModal.ingredients.map((ing, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-xs py-1 border-b border-gray-100"
                      >
                        <span className="font-semibold text-[#0F291E]">
                          • {ing.item}
                        </span>
                        <span className="font-extrabold text-[#15803D]">
                          {ing.grams}g
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step-by-Step Instructions */}
                <div>
                  <h4 className="text-xs font-extrabold text-[#14532D] uppercase mb-1.5">
                    Step-by-Step Instructions
                  </h4>
                  <ol className="space-y-1.5 text-xs text-gray-700 list-decimal pl-4">
                    {selectedRecipeModal.instructions.map((st, i) => (
                      <li key={i} className="leading-relaxed">
                        {st}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Health Benefits & Doctor Disclaimer */}
                <div className="p-3 rounded-2xl bg-[#F0FDF4] border border-emerald-200 space-y-1">
                  <div className="text-xs font-extrabold text-[#14532D]">
                    Health Benefits:
                  </div>
                  {selectedRecipeModal.healthBenefits.map((hb, i) => (
                    <div key={i} className="text-xs text-[#0F291E]">
                      ✓ {hb}
                    </div>
                  ))}
                  <div className="text-[11px] font-extrabold text-amber-800 pt-1">
                    ⓘ {selectedRecipeModal.disclaimer}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleAddRecipeToMealPlan(selectedRecipeModal);
                    setSelectedRecipeModal(null);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-[#15803D] text-white font-extrabold text-sm cursor-pointer"
                >
                  + Add to Today&apos;s Meal Plan
                </button>
              </div>
            </div>
          )}

          {/* SUBMIT COMMUNITY RECIPE MODAL */}
          {showSubmitRecipeModal && (
            <div className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4">
              <form
                onSubmit={handleSubmitCommunityRecipe}
                className="bg-white rounded-[28px] max-w-md w-full p-5 space-y-3 shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-[#0F291E]">
                    Submit Community Recipe
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowSubmitRecipeModal(false)}
                    className="p-1 rounded-full bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newRecipeTitle}
                  onChange={(e) => setNewRecipeTitle(e.target.value)}
                  placeholder="Recipe Title (e.g. Multani Sohan Dish / Healthy Tikka)"
                  className="w-full px-3 py-2 rounded-xl bg-[#F0FDF4] border border-emerald-300 text-xs font-bold"
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newRecipeCategory}
                    onChange={(e) =>
                      setNewRecipeCategory(
                        e.target.value as SuiteRecipeItem['category']
                      )
                    }
                    className="px-3 py-2 rounded-xl bg-[#F0FDF4] border border-emerald-300 text-xs font-bold"
                  >
                    <option value="Desi">Desi</option>
                    <option value="Pakistani">Pakistani</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Italian">Italian</option>
                    <option value="Continental">Continental</option>
                    <option value="Healthy">Healthy</option>
                  </select>
                  <input
                    type="number"
                    value={newRecipeCalories}
                    onChange={(e) => setNewRecipeCalories(e.target.value)}
                    placeholder="Calories (kcal)"
                    className="px-3 py-2 rounded-xl bg-[#F0FDF4] border border-emerald-300 text-xs font-bold"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={newRecipeProtein}
                    onChange={(e) => setNewRecipeProtein(e.target.value)}
                    placeholder="Protein (g)"
                    className="px-2.5 py-2 rounded-xl bg-[#F0FDF4] border border-emerald-300 text-xs font-bold"
                  />
                  <input
                    type="number"
                    value={newRecipeCarbs}
                    onChange={(e) => setNewRecipeCarbs(e.target.value)}
                    placeholder="Carbs (g)"
                    className="px-2.5 py-2 rounded-xl bg-[#F0FDF4] border border-emerald-300 text-xs font-bold"
                  />
                  <input
                    type="number"
                    value={newRecipeTime}
                    onChange={(e) => setNewRecipeTime(e.target.value)}
                    placeholder="Time (min)"
                    className="px-2.5 py-2 rounded-xl bg-[#F0FDF4] border border-emerald-300 text-xs font-bold"
                  />
                </div>
                <textarea
                  rows={2}
                  value={newRecipeIngredientsText}
                  onChange={(e) => setNewRecipeIngredientsText(e.target.value)}
                  placeholder="Ingredients with grams (comma separated)"
                  className="w-full px-3 py-2 rounded-xl bg-[#F0FDF4] border border-emerald-300 text-xs font-bold"
                />
                <textarea
                  rows={2}
                  value={newRecipeStepsText}
                  onChange={(e) => setNewRecipeStepsText(e.target.value)}
                  placeholder="Cooking instructions"
                  className="w-full px-3 py-2 rounded-xl bg-[#F0FDF4] border border-emerald-300 text-xs font-bold"
                />
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#15803D] text-white text-xs font-extrabold cursor-pointer"
                >
                  Publish Recipe
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          PART 5: HEALTH CONDITION RECOMMENDED FOOD (/nutrition/health — EXACT DESIGN OF IMAGE 3)
         ===================================================================== */}
      {subRoute === 'health' && (
        <div className="bg-[#FAF8F5] border border-[#E2E8F0] rounded-[32px] p-4 sm:p-6 shadow-md space-y-4">
          {/* Top Bar: Back + Nutrition Recommendation + Share */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setSubRoute('dashboard')}
              className="p-2 rounded-full hover:bg-gray-200/60 text-[#0F291E] cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0F291E]">
              Nutrition Recommendation
            </h2>
            <button
              type="button"
              onClick={() =>
                showToast(
                  `Saved ${currentHealthData.conditionName} recommendations to your profile!`
                )
              }
              className="p-2 rounded-full hover:bg-gray-200/60 text-[#0F291E] cursor-pointer"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input: Type ANY Health Condition (Matching Image 3) */}
          <form onSubmit={(e) => handleSearchHealthCondition(e)} className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={healthQueryInput}
                onChange={(e) => setHealthQueryInput(e.target.value)}
                placeholder="Type your health issue e.g. Diabetes, Blood Pressure, PCOS, Acidity..."
                className="w-full pl-10 pr-20 py-3 rounded-2xl bg-[#EFECE6] text-sm font-bold text-[#0F291E] focus:outline-hidden"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-[#15803D] text-white text-xs font-extrabold cursor-pointer"
              >
                Search
              </button>
            </div>

            {/* Quick Condition Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
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
                  onClick={() => handleSearchHealthCondition(undefined, cond)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap cursor-pointer ${
                    activeHealthCondition.toLowerCase() === cond.toLowerCase()
                      ? 'bg-[#1D4ED8] text-white'
                      : 'bg-white border border-gray-200 text-gray-700'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </form>

          {/* Personalized Badge */}
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-[#E0E7FF] text-[#1E3A8A] font-bold inline-flex items-center gap-1">
              <span>Personalized for {currentHealthData.conditionName}</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            </span>
            <span className="text-gray-500 font-medium">
              {currentHealthData.updatedLabel}
            </span>
          </div>

          {/* Personalized Recommendation Blue Info Box (Matching Image 3) */}
          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-extrabold text-[#0F291E] flex items-center gap-1.5">
              <span>Personalized Recommendation</span>
              <Sparkles className="w-4 h-4 text-blue-600" />
            </h3>
            <div className="p-4 rounded-2xl bg-[#D8E2F8] border border-[#93C5FD] text-xs sm:text-sm font-medium text-[#0F172A] leading-relaxed">
              {currentHealthData.summaryAdvice}
            </div>
          </div>

          {/* SECTION A: RECOMMENDED FOODS (GREEN CARDS WITH DOCTOR DISCLAIMER ON EVERY CARD) */}
          <div className="space-y-2.5">
            <h3 className="text-base sm:text-lg font-extrabold text-[#0F291E] flex items-center gap-1.5">
              <span>Recommended Foods</span>
              <Leaf className="w-4 h-4 text-[#16A34A]" />
            </h3>

            {currentHealthData.recommendedFoods.map((food, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#CBE4C3] border border-[#86EFAC] flex items-start gap-3.5 shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-white/60 text-[#14532D] flex items-center justify-center shrink-0 font-extrabold text-lg">
                  {food.iconType === 'fish'
                    ? '🐟'
                    : food.iconType === 'bowl'
                    ? '🍲'
                    : '🌿'}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-base font-extrabold text-[#0F291E]">
                      {food.name}
                    </h4>
                    <span className="text-[11px] font-bold text-[#14532D]">
                      ({food.caloriesPer100g} kcal/100g)
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#14532D]">
                    • {food.shortNote}
                  </p>
                  <p className="text-[11px] font-medium text-[#1E3A2F] flex items-center gap-1 pt-0.5">
                    <span>ⓘ {food.disclaimer}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* SECTION B: FOODS TO AVOID (RED CARDS WITH DOCTOR DISCLAIMER ON EVERY CARD) */}
          <div className="space-y-2.5">
            <h3 className="text-base sm:text-lg font-extrabold text-[#0F291E] flex items-center gap-1.5">
              <span>Foods to Avoid</span>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </h3>

            {currentHealthData.foodsToAvoid.map((food, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#F28B82] border border-[#EF4444] flex items-start gap-3.5 shadow-2xs"
              >
                <div className="w-10 h-10 rounded-xl bg-white/50 text-[#7F1D1D] flex items-center justify-center shrink-0 font-extrabold text-lg">
                  {food.iconType === 'bread'
                    ? '🍞'
                    : food.iconType === 'fried'
                    ? '🍟'
                    : '🧁'}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-base font-extrabold text-[#450A0A]">
                    {food.name}
                  </h4>
                  <p className="text-xs font-bold text-[#450A0A]">
                    • {food.shortNote}
                  </p>
                  <p className="text-[11px] font-medium text-[#450A0A] flex items-center gap-1 pt-0.5">
                    <span>ⓘ {food.disclaimer}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* BOTTOM BIG DOCTOR DISCLAIMER BANNER (MATCHING IMAGE 3) */}
          <div className="p-3.5 rounded-2xl bg-[#C7D7F4] border border-[#93C5FD] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-extrabold text-lg shrink-0">
              +
            </div>
            <p className="text-xs font-bold text-[#0F172A] leading-snug">
              {DOCTOR_DISCLAIMER_BANNER}
            </p>
          </div>

          {/* BOTTOM BUTTON: AI DIETITIAN — CHAT (MATCHING IMAGE 3) */}
          <button
            type="button"
            onClick={() => setSubRoute('dietitian-chat')}
            className="w-full py-4 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-base shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            <span>AI Dietitian — Chat</span>
          </button>
        </div>
      )}

      {/* =====================================================================
          PART 5B & 6: AI DIETITIAN INTERACTIVE CHAT
         ===================================================================== */}
      {subRoute === 'dietitian-chat' && (
        <div className="bg-white border border-[#BBF7D0] rounded-[28px] p-4 sm:p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setSubRoute('health')}
                className="p-2 rounded-full bg-emerald-50 text-[#15803D] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="text-base font-extrabold text-[#0F291E]">
                  ✨ AI Dietitian — Interactive Nutrition Chat
                </h3>
                <p className="text-[11px] text-gray-500">
                  Ask about Diabetes, Weight Loss, PCOS, Biryani, Roti, or Meal
                  Plans
                </p>
              </div>
            </div>
          </div>

          {/* Quick Prompt Chips */}
          <div className="flex flex-wrap gap-1.5">
            {[
              'What should I eat in Diabetes?',
              'What to eat for weight loss?',
              'Is Biryani healthy?',
              'Diet plan for PCOS',
              'Foods for High Blood Pressure'
            ].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSendDietitianMessage(undefined, q)}
                className="px-3 py-1.5 rounded-full bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#86EFAC] text-[#14532D] text-[11px] font-bold cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Messages Thread */}
          <div className="space-y-3 max-h-96 overflow-y-auto p-2 bg-[#F9FBF9] rounded-2xl border border-emerald-100">
            {chatMessages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed font-medium ${
                    m.sender === 'user'
                      ? 'bg-[#15803D] text-white rounded-br-none'
                      : 'bg-white border border-emerald-200 text-[#0F291E] rounded-bl-none shadow-2xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-0.5 px-1">
                  {m.time}
                </span>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => handleSendDietitianMessage(e)}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask AI Dietitian (e.g. What should I eat in Diabetes?)..."
              className="flex-1 px-4 py-3 rounded-2xl bg-[#F0FDF4] border border-[#86EFAC] text-xs font-bold text-[#0F291E]"
            />
            <button
              type="submit"
              className="px-4 py-3 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      )}

      {/* =====================================================================
          PART 6: EXTRA PRO FEATURES (FOOD LOG, BARCODE SCANNER, 16:8 FASTING TIMER, SUPPLEMENTS GUIDE)
         ===================================================================== */}
      {subRoute === 'stats-foodlog' && (
        <div className="space-y-4">
          {/* 1. DESI FOOD LOG CALORIE TRACKER + BARCODE SCANNER */}
          <div className="bg-white border border-[#BBF7D0] rounded-[28px] p-4 sm:p-5 shadow-sm space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-[#0F291E]">
                  1. Desi Food Log Calorie Tracker &amp; Barcode Scanner
                </h3>
                <p className="text-xs text-gray-500">
                  Search Roti, Naan, Biryani, Daal, Chai or scan food barcode
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBarcodeModal(true)}
                className="px-3 py-2 rounded-xl bg-[#15803D] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Scan Barcode</span>
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={foodSearchQuery}
                onChange={(e) => setFoodSearchQuery(e.target.value)}
                placeholder="Search Desi Foods (Roti, Naan, Biryani, Daal, Chai, Paratha)..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#F0FDF4] border border-emerald-200 text-xs font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DESI_FOOD_LOG_DATABASE.filter(
                (f) =>
                  !foodSearchQuery.trim() ||
                  f.name.toLowerCase().includes(foodSearchQuery.toLowerCase())
              ).map((food) => (
                <div
                  key={food.barcode}
                  className="p-2.5 rounded-xl bg-[#F9FBF9] border border-emerald-100 flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-xs font-extrabold text-[#0F291E]">
                      {food.name}
                    </div>
                    <div className="text-[11px] font-semibold text-[#15803D]">
                      {food.grams}g • {food.calories} kcal • P:{food.proteinG}g
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      const entry: MealFoodEntry = {
                        id: `flog-${Date.now()}`,
                        name: food.name,
                        grams: food.grams,
                        calories: food.calories,
                        proteinG: food.proteinG,
                        carbsG: food.carbsG,
                        fatG: food.fatG,
                        disclaimer: DOCTOR_DISCLAIMER_SHORT
                      };
                      const next = [entry, ...todayLoggedFoods];
                      setTodayLoggedFoods(next);
                      if (user?.uid) {
                        try {
                          await setDoc(
                            doc(db, 'users', user.uid, 'foodLogs', todayIso),
                            {
                              uid: user.uid,
                              date: todayIso,
                              items: next,
                              updatedAt: new Date().toISOString()
                            },
                            { merge: true }
                          );
                        } catch {
                          // Ignore
                        }
                      }
                      showToast(
                        `Logged "${food.name}" (${food.grams}g • ${food.calories} kcal)!`
                      );
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-[#16A34A] text-white text-[11px] font-extrabold cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>

            {/* Today's Logged Foods */}
            <div className="pt-2 border-t border-emerald-100 space-y-1.5">
              <div className="text-xs font-extrabold text-[#14532D]">
                Today&apos;s Logged Foods (
                {todayLoggedFoods.reduce((s, i) => s + i.calories, 0)} kcal):
              </div>
              {todayLoggedFoods.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-emerald-50/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-extrabold text-[#0F291E]">
                      {item.name}
                    </span>{' '}
                    • {item.grams}g •{' '}
                    <span className="font-extrabold text-[#15803D]">
                      {item.calories} kcal
                    </span>
                    <div className="text-[10px] text-gray-500">
                      ⓘ {item.disclaimer}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setTodayLoggedFoods((prev) =>
                        prev.filter((x) => x.id !== item.id)
                      )
                    }
                    className="text-red-500 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 2. INTERMITTENT FASTING TIMER (16:8 PROTOCOL) */}
          <div className="bg-white border border-[#BBF7D0] rounded-[28px] p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#15803D] flex items-center justify-center">
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0F291E]">
                    2. Intermittent Fasting Timer (16:8 Protocol)
                  </h3>
                  <p className="text-xs text-gray-500">
                    16 Hours Fasting Window • 8 Hours Eating Window
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  fastingActive
                    ? 'bg-emerald-100 text-[#15803D]'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {fastingActive ? 'Fasting Active' : 'Ready'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-emerald-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-[#14532D]">
                  Elapsed Fasting Time
                </div>
                <div className="text-2xl font-extrabold text-[#0F291E]">
                  {fastingElapsedHours} hrs / 16.0 hrs
                </div>
                <div className="text-[11px] font-semibold text-gray-600">
                  Fat-burning ketosis zone starts after 12 hours
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!isUserPaid) {
                      triggerPremiumLock(
                        '16:8 Intermittent Fasting Tracker is a Paid Premium feature.'
                      );
                      return;
                    }
                    setFastingActive((v) => !v);
                    showToast(
                      !fastingActive
                        ? '16:8 Fasting Timer Started!'
                        : '16:8 Fasting Timer Paused.'
                    );
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#16A34A] text-white text-xs font-extrabold cursor-pointer"
                >
                  {fastingActive ? 'Stop Fast' : 'Start 16:8 Fast'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFastingElapsedHours((h) =>
                      Number(Math.min(16, h + 0.5).toFixed(1))
                    )
                  }
                  className="px-3 py-2.5 rounded-xl bg-white border border-emerald-300 text-[#15803D] text-xs font-extrabold cursor-pointer"
                >
                  +0.5h
                </button>
              </div>
            </div>
          </div>

          {/* 3. SUPPLEMENTS GUIDE (VITAMIN D, IRON, CALCIUM, OMEGA-3, B12, MAGNESIUM) */}
          <div className="bg-white border border-[#BBF7D0] rounded-[28px] p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-[#16A34A]" />
              <div>
                <h3 className="text-base font-extrabold text-[#0F291E]">
                  3. Essential Supplements &amp; Natural Sources Guide
                </h3>
                <p className="text-xs text-gray-500">
                  Vitamin D, Iron, Calcium, Omega-3, B12 &amp; Magnesium timing
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUPPLEMENTS_GUIDE_DATA.map((supp) => (
                <div
                  key={supp.id}
                  className="p-3.5 rounded-2xl bg-[#F9FBF9] border border-emerald-200 space-y-1.5"
                >
                  <div className="text-sm font-extrabold text-[#0F291E]">
                    💊 {supp.name}
                  </div>
                  <div className="text-[11px] font-bold text-[#15803D]">
                    🕒 Best Time: {supp.bestTimeToTake}
                  </div>
                  <p className="text-xs text-gray-600 leading-snug">
                    {supp.keyBenefit}
                  </p>
                  <div className="text-[11px] font-semibold text-gray-700">
                    <strong>Natural Foods:</strong>{' '}
                    {supp.naturalFoodSources.join(', ')}
                  </div>
                  <div className="text-[10px] font-bold text-amber-800">
                    ⓘ {supp.disclaimer}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BARCODE SCANNER MODAL */}
          {showBarcodeModal && (
            <div className="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4">
              <div className="bg-white rounded-[28px] max-w-sm w-full p-5 space-y-3 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-[#0F291E]">
                    📷 Food Barcode Scanner
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowBarcodeModal(false)}
                    className="p-1 rounded-full bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Enter or scan a Pakistani / International food barcode (e.g.
                  89610001 for Roti, 89610003 for Biryani):
                </p>
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F0FDF4] border border-emerald-300 text-xs font-bold"
                />
                <button
                  type="button"
                  onClick={() => {
                    const match =
                      DESI_FOOD_LOG_DATABASE.find(
                        (b) => b.barcode === barcodeInput.trim()
                      ) || DESI_FOOD_LOG_DATABASE[0];
                    setTodayLoggedFoods((prev) => [
                      {
                        id: `scan-${Date.now()}`,
                        name: match.name,
                        grams: match.grams,
                        calories: match.calories,
                        proteinG: match.proteinG,
                        carbsG: match.carbsG,
                        fatG: match.fatG,
                        disclaimer: DOCTOR_DISCLAIMER_SHORT
                      },
                      ...prev
                    ]);
                    setShowBarcodeModal(false);
                    showToast(
                      `Scanned Barcode ${match.barcode}: Added "${match.name}" (${match.calories} kcal)!`
                    );
                  }}
                  className="w-full py-3 rounded-xl bg-[#16A34A] text-white text-xs font-extrabold cursor-pointer"
                >
                  Scan &amp; Add to Today&apos;s Log
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

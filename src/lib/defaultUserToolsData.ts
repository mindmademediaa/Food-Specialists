import { DailyMealPlanItem, UserToolsData } from '../types/hub';

const DEFAULT_LOSE_MEAL_PLANS: DailyMealPlanItem[] = [
  {
    id: 'mp-lose-1',
    day: 'Day 1 — High-Protein Fat Loss',
    breakfast: '2 Boiled Eggs + 1 Whole Wheat Brown Bread + Unsweetened Green Tea',
    breakfastKcal: 245,
    lunch: '180g Grilled Chicken Breast + Fresh Cucumber-Tomato Salad + 1 Small Roti',
    lunchKcal: 430,
    snack: '1 Medium Apple + 8 Raw Almonds',
    snackKcal: 155,
    dinner: '1 Bowl Masoor Daal Soup + Steamed Broccoli & Carrots + 120g Baked Fish',
    dinnerKcal: 390
  },
  {
    id: 'mp-lose-2',
    day: 'Day 2 — Clean Low-GI Metabolic Day',
    breakfast: '1 Bowl Rolled Oats in Skim Milk + Chia Seeds + Cinnamon',
    breakfastKcal: 290,
    lunch: '1 Cup Boiled Chana Chaat with Lemon, Onion & Low-Fat Yogurt',
    lunchKcal: 360,
    snack: '1 Cup Roasted Black Chickpeas + Mint Lemon Water',
    snackKcal: 165,
    dinner: '150g Chicken Tikka Boti + 1 Bowl Mixed Green Salad + 1/2 Roti',
    dinnerKcal: 385
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
];

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
    mealPlans: DEFAULT_LOSE_MEAL_PLANS,
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

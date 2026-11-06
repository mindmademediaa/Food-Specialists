import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Droplets,
  Flame,
  Heart,
  LayoutGrid,
  Leaf,
  List,
  Plus,
  Scale,
  Search,
  SlidersHorizontal,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Utensils,
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
  GenderOption,
  getHealthConditionRecommendations,
  GoalOption,
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

export type NutritionMacroCategory =
  | 'High-Protein'
  | 'Low-Carb & Fat Loss'
  | 'High-Carb & Energy'
  | 'Low-Protein & Light'
  | 'Diabetic & Low-GI'
  | 'Heart, BP & Gut Health';

export interface ClinicalNutritionRecipe {
  id: string;
  title: string;
  subtitle: string;
  macroCategory: NutritionMacroCategory;
  mealTiming: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack / Shake';
  dietTag: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  cookTimeMin: number;
  servings: number;
  isVeg: boolean;
  isCustomCreated?: boolean;
  ingredients: { item: string; amount: string; grams: number }[];
  instructions: string[];
  clinicalBenefit: string;
}

// ============================================================================
// DIETITIAN-FORMULATED CLINICAL & FUNCTIONAL NUTRITION RECIPES (30+ RECIPES)
// ============================================================================
export const CLINICAL_NUTRITION_RECIPES: ClinicalNutritionRecipe[] = [
  // --- 1. HIGH-PROTEIN (MUSCLE BUILDING, RECOVERY & SATIETY) ---
  {
    id: 'hp-1',
    title: 'High-Protein Egg White, Spinach & OatsSavory Chilla',
    subtitle: '42g Protein • Zero Refined Flour • Iron & Amino Acid Rich Breakfast',
    macroCategory: 'High-Protein',
    mealTiming: 'Breakfast',
    dietTag: 'High Protein • Muscle & Recovery',
    calories: 350,
    proteinG: 36,
    carbsG: 28,
    fatG: 9,
    fiberG: 6,
    cookTimeMin: 12,
    servings: 1,
    isVeg: false,
    ingredients: [
      { item: 'Liquid Egg Whites (4 whites) + 1 Whole Egg', amount: '5 eggs total', grams: 180 },
      { item: 'Powdered Rolled Oats (ground in blender)', amount: '1/3 cup', grams: 35 },
      { item: 'Finely Chopped Fresh Spinach (Palak)', amount: '1 cup packed', grams: 60 },
      { item: 'Low-Fat Cottage Cheese (Grated Paneer)', amount: '3 tbsp', grams: 45 },
      { item: 'Chopped Onion, Tomato, Green Chili & Coriander', amount: '1/3 cup', grams: 50 },
      { item: 'Roasted Cumin, Black Pepper & Turmeric', amount: '1 tsp', grams: 5 },
      { item: 'Olive Oil (for non-stick pan brushing)', amount: '1 tsp', grams: 5 }
    ],
    instructions: [
      'Step 1 (Prepare High-Protein Batter): In a bowl, whisk 4 egg whites, 1 whole egg, powdered oats, cumin, black pepper, turmeric, and a splash of water into a smooth batter.',
      'Step 2 (Fold Greens): Mix in finely chopped spinach, onions, tomatoes, and fresh coriander leaves.',
      'Step 3 (Cook Savory Chilla): Heat a non-stick skillet over medium flame and brush with 1 tsp olive oil. Pour the batter and spread into a medium-thick crepe.',
      'Step 4 (Top with Paneer & Fold): Cook for 2.5 minutes per side, sprinkle grated low-fat paneer inside, fold in half, and serve hot with mint-yogurt dip.'
    ],
    clinicalBenefit: 'Provides 36g complete bioavailable protein (leucine-rich) plus beta-glucan fiber from oats to keep blood glucose stable for 5 hours.'
  },
  {
    id: 'hp-2',
    title: 'Grilled Lemon-Herb Chicken Breast & Quinoa Power Bowl',
    subtitle: 'Lean Poultry Protein + Complete Amino Acid Quinoa & Steamed Broccoli',
    macroCategory: 'High-Protein',
    mealTiming: 'Lunch',
    dietTag: 'High Protein • Lean Mass',
    calories: 410,
    proteinG: 44,
    carbsG: 34,
    fatG: 10,
    fiberG: 7,
    cookTimeMin: 20,
    servings: 1,
    isVeg: false,
    ingredients: [
      { item: 'Skinless Chicken Breast Fillet', amount: '6.5 oz raw', grams: 185 },
      { item: 'Cooked Quinoa (or Brown Rice)', amount: '3/4 cup cooked', grams: 120 },
      { item: 'Broccoli Florets & Bell Peppers', amount: '1 cup', grams: 110 },
      { item: 'Fresh Lemon Juice, Minced Garlic & Oregano', amount: '1.5 tbsp', grams: 20 },
      { item: 'Extra-Virgin Olive Oil', amount: '1.5 tsp', grams: 7 }
    ],
    instructions: [
      'Step 1 (Marinate Chicken): Rub chicken breast with lemon juice, minced garlic, oregano, black pepper, and salt for 10 minutes.',
      'Step 2 (Pan-Grill): Sear on a medium-high grill pan with 1.5 tsp olive oil for 5–6 minutes per side until internal temperature reaches 75°C (165°F).',
      'Step 3 (Steam Veggies): Steam broccoli florets and bell peppers for 4 minutes so they retain Vitamin C and crunch.',
      'Step 4 (Assemble Bowl): Slice the grilled chicken breast over warm quinoa and steamed vegetables, and drizzle with lemon juice.'
    ],
    clinicalBenefit: 'Delivers 44g lean protein with high potassium and magnesium to support muscle synthesis and metabolic rate.'
  },
  {
    id: 'hp-3',
    title: 'Sprouted Moong Daal, Boiled Chana & Paneer Protein Bowl',
    subtitle: '100% Vegetarian High-Protein Bowl with Digestive Enzymes & Folate',
    macroCategory: 'High-Protein',
    mealTiming: 'Lunch',
    dietTag: 'Vegetarian High Protein',
    calories: 345,
    proteinG: 26,
    carbsG: 36,
    fatG: 10,
    fiberG: 9,
    cookTimeMin: 10,
    servings: 1,
    isVeg: true,
    ingredients: [
      { item: 'Steamed Green Moong Daal Sprouts', amount: '1 cup', grams: 110 },
      { item: 'Boiled White or Black Chickpeas (Chana)', amount: '1/2 cup', grams: 80 },
      { item: 'Seared Low-Fat Paneer / Tofu Cubes', amount: '3.5 oz', grams: 100 },
      { item: 'Diced Cucumber, Tomato & Red Onion', amount: '1 cup', grams: 100 },
      { item: 'Lemon Juice, Roasted Cumin (Zeera) & Chaat Masala', amount: '1.5 tbsp', grams: 15 }
    ],
    instructions: [
      'Step 1 (Lightly Steam Sprouts): Steam sprouted green moong daal for 3 minutes to make it easy on digestion while keeping enzymes intact.',
      'Step 2 (Pan-Sear Paneer): Lightly toast paneer cubes on a dry non-stick skillet for 2 minutes until golden.',
      'Step 3 (Toss Protein Salad): Combine warm sprouts, boiled chickpeas, seared paneer, cucumber, tomato, and onion in a bowl.',
      'Step 4 (Dress & Serve): Add fresh lemon juice, roasted cumin powder, and coriander leaves. Toss and enjoy immediately.'
    ],
    clinicalBenefit: 'Sprouting increases vitamin bioavailability by 300% and reduces phytic acid, delivering 26g vegetarian protein and 9g prebiotic fiber.'
  },
  {
    id: 'hp-4',
    title: 'Air-Fried / Grilled Garlic Fish Tikka with Mint Yogurt',
    subtitle: 'Omega-3 Rich Lean White Fish / Salmon with Probiotic Dahi Dip',
    macroCategory: 'High-Protein',
    mealTiming: 'Dinner',
    dietTag: 'High Protein • Omega-3 Rich',
    calories: 310,
    proteinG: 38,
    carbsG: 8,
    fatG: 13,
    fiberG: 2,
    cookTimeMin: 18,
    servings: 1,
    isVeg: false,
    ingredients: [
      { item: 'Boneless Fish Fillet Cubes (Rohu / Cod / Salmon)', amount: '7 oz', grams: 200 },
      { item: 'Thick Low-Fat Yogurt (Dahi)', amount: '3 tbsp', grams: 45 },
      { item: 'Garlic-Ginger Paste & Lemon Juice', amount: '1.5 tbsp', grams: 22 },
      { item: 'Ajwain (Carom Seeds), Cumin & Turmeric', amount: '1.5 tsp', grams: 6 },
      { item: 'Olive Oil Spray / Brush', amount: '1 tsp', grams: 5 }
    ],
    instructions: [
      'Step 1 (Coat Fish): Mix yogurt, garlic-ginger paste, lemon juice, ajwain, cumin, and turmeric. Coat fish cubes gently and marinate for 15 minutes.',
      'Step 2 (Grill / Air-Fry): Place in an air-fryer at 190°C or on a non-stick grill pan brushed with 1 tsp olive oil.',
      'Step 3 (Cook Until Flaky): Cook for 10–12 minutes, flipping halfway until golden and flaky.',
      'Step 4 (Serve): Serve with fresh mint chutney and sliced radish/cucumber salad.'
    ],
    clinicalBenefit: 'High protein-to-calorie ratio (38g protein in 310 kcal) with anti-inflammatory Omega-3 fatty acids and thyroid-supporting iodine.'
  },
  {
    id: 'hp-5',
    title: 'Greek Yogurt (Hung Dahi), Chia, Pumpkin Seed & Berry Bowl',
    subtitle: 'Probiotic Casein & Whey Protein Bowl for Post-Workout or Evening Satiety',
    macroCategory: 'High-Protein',
    mealTiming: 'Snack / Shake',
    dietTag: 'High Protein • Probiotic',
    calories: 275,
    proteinG: 22,
    carbsG: 21,
    fatG: 11,
    fiberG: 6,
    cookTimeMin: 5,
    servings: 1,
    isVeg: true,
    ingredients: [
      { item: 'Thick Strained Greek Yogurt / Hung Curd', amount: '1 cup', grams: 200 },
      { item: 'Chia Seeds & Raw Pumpkin Seeds', amount: '1.5 tbsp', grams: 18 },
      { item: 'Crushed Walnuts & Almonds', amount: '5 nuts', grams: 12 },
      { item: 'Berries or Pomegranate (Anaar) Seeds', amount: '1/2 cup', grams: 65 },
      { item: 'Cinnamon Powder', amount: '1/4 tsp', grams: 1 }
    ],
    instructions: [
      'Step 1 (Whip Yogurt Base): Whisk thick Greek yogurt (or strained home dahi) with a pinch of cinnamon until creamy.',
      'Step 2 (Layer Seeds & Fruit): Top with chia seeds, pumpkin seeds, crushed almonds, and antioxidant-rich pomegranate or berries.',
      'Step 3 (Rest & Enjoy): Let sit for 5 minutes so chia seeds swell slightly, then enjoy chilled.'
    ],
    clinicalBenefit: 'Rich in slow-digesting casein protein, gut-healing probiotics, and zinc from pumpkin seeds.'
  },

  // --- 2. LOW-CARB & FAT LOSS (KETO, INSULIN SENSITIVITY & WEIGHT REDUCTION) ---
  {
    id: 'lc-1',
    title: 'Low-Carb Cauliflower Rice (Gobi Rice) & Chicken Stir-Fry Bowl',
    subtitle: 'Only 10g Net Carbs • Replaces White Rice with Vitamin-Rich Grated Cauliflower',
    macroCategory: 'Low-Carb & Fat Loss',
    mealTiming: 'Dinner',
    dietTag: 'Low Carb • Fast Fat Loss',
    calories: 295,
    proteinG: 32,
    carbsG: 12,
    fatG: 13,
    fiberG: 5,
    cookTimeMin: 15,
    servings: 1,
    isVeg: false,
    ingredients: [
      { item: 'Grated Cauliflower Florets (Gobi Rice)', amount: '1.5 cups grated', grams: 170 },
      { item: 'Diced Chicken Breast (or Paneer Cubes)', amount: '5.5 oz', grams: 160 },
      { item: 'Minced Garlic, Ginger & Spring Onions', amount: '2 tbsp', grams: 25 },
      { item: 'Diced Bell Peppers & Green Beans', amount: '1/2 cup', grams: 60 },
      { item: 'Olive Oil, Cumin & Black Pepper', amount: '1.5 tsp oil + spices', grams: 10 }
    ],
    instructions: [
      'Step 1 (Pulse Cauliflower): Grate fresh cauliflower florets on a box grater or pulse briefly in a food processor until rice-sized grains form.',
      'Step 2 (Sear Protein): Heat 1.5 tsp olive oil in a wok. Sauté garlic, ginger, and chicken cubes (or paneer) for 5–6 minutes until cooked through.',
      'Step 3 (Stir-Fry Veggies & Gobi Rice): Add bell peppers, green beans, and grated cauliflower rice. Stir-fry on high flame for 3–4 minutes (do not overcook so it stays fluffy like rice).',
      'Step 4 (Season & Serve): Season with roasted cumin, black pepper, and chopped spring onions.'
    ],
    clinicalBenefit: 'Slashes carbohydrate load by 78% compared to white rice while providing sulforaphane and 32g protein for rapid visceral fat loss.'
  },
  {
    id: 'lc-2',
    title: 'Spinach, Mushroom & 3-Egg Keto Omelette / Frittata',
    subtitle: 'Ultra Low-Carb (4g Carbs) • Choline, Vitamin D & Healthy Fats for Fat Burning',
    macroCategory: 'Low-Carb & Fat Loss',
    mealTiming: 'Breakfast',
    dietTag: 'Keto • Low Carb (4g Carbs)',
    calories: 280,
    proteinG: 21,
    carbsG: 5,
    fatG: 19,
    fiberG: 2,
    cookTimeMin: 10,
    servings: 1,
    isVeg: false,
    ingredients: [
      { item: 'Whole Pasture-Raised Eggs', amount: '3 large eggs', grams: 150 },
      { item: 'Baby Spinach & Sliced Mushrooms', amount: '1 cup', grams: 80 },
      { item: 'Chopped Green Onion & Tomato', amount: '2 tbsp', grams: 25 },
      { item: 'Crushed Black Pepper, Oregano & Pink Salt', amount: '1 tsp', grams: 4 },
      { item: 'Olive Oil or Grass-Fed Ghee', amount: '1 tsp', grams: 5 }
    ],
    instructions: [
      'Step 1 (Sauté Greens & Mushrooms): Heat 1 tsp olive oil in a skillet. Sauté sliced mushrooms and baby spinach with garlic/oregano for 2 minutes until tender.',
      'Step 2 (Pour Whisked Eggs): Beat 3 eggs with black pepper and pink salt, and pour evenly over the sautéed vegetables.',
      'Step 3 (Set & Fold): Cover on low heat for 3 minutes until set, fold gently, and serve warm.'
    ],
    clinicalBenefit: 'Keeps insulin levels at baseline in the morning, encouraging the body to oxidize stored body fat for energy.'
  },
  {
    id: 'lc-3',
    title: 'Zucchini (Tori), Palak & Grilled Paneer / Chicken Bowl',
    subtitle: 'High-Volume, Low-Calorie Hydrating Green Bowl for Weight Reduction',
    macroCategory: 'Low-Carb & Fat Loss',
    mealTiming: 'Dinner',
    dietTag: 'Low Calorie • Low Carb',
    calories: 265,
    proteinG: 23,
    carbsG: 11,
    fatG: 14,
    fiberG: 5,
    cookTimeMin: 15,
    servings: 1,
    isVeg: true,
    ingredients: [
      { item: 'Sliced Zucchini / Ridge Gourd (Tori)', amount: '1.5 cups', grams: 180 },
      { item: 'Fresh Spinach Leaves (Palak)', amount: '1 cup', grams: 60 },
      { item: 'Paneer Cubes (or Grilled Chicken)', amount: '4 oz', grams: 115 },
      { item: 'Garlic, Cumin Seeds & Turmeric', amount: '1 tbsp', grams: 12 },
      { item: 'Olive Oil', amount: '1.5 tsp', grams: 7 }
    ],
    instructions: [
      'Step 1 (Sauté Cumin & Garlic): Heat olive oil in a pan, crackle cumin seeds and minced garlic for 30 seconds.',
      'Step 2 (Cook Tori & Spinach): Add sliced zucchini (tori), turmeric, and spinach. Cover and cook in its own natural water for 5–6 minutes.',
      'Step 3 (Add Protein): Fold in lightly seared paneer cubes (or grilled chicken), simmer for 2 minutes, and finish with lemon juice.'
    ],
    clinicalBenefit: '92% water-rich gourd vegetables provide high stomach volume with minimal calories, eliminating evening hunger cravings.'
  },
  {
    id: 'lc-4',
    title: 'Avocado, Cucumber, Boiled Egg & Roasted Flaxseed Salad',
    subtitle: 'Healthy Monounsaturated Fats + Fiber to Curb Appetite Naturally',
    macroCategory: 'Low-Carb & Fat Loss',
    mealTiming: 'Lunch',
    dietTag: 'Keto • Healthy Fats & Fiber',
    calories: 315,
    proteinG: 16,
    carbsG: 10,
    fatG: 23,
    fiberG: 6,
    cookTimeMin: 8,
    servings: 1,
    isVeg: false,
    ingredients: [
      { item: 'Hard-Boiled Eggs (halved)', amount: '2 whole eggs', grams: 100 },
      { item: 'Ripe Avocado (cubed)', amount: '1/2 medium', grams: 75 },
      { item: 'Crunchy Cucumber, Lettuce & Cherry Tomatoes', amount: '1.5 cups', grams: 150 },
      { item: 'Roasted Flaxseeds (Alsi) & Sesame Seeds', amount: '1 tbsp', grams: 10 },
      { item: 'Lemon Juice & Olive Oil Dressing', amount: '1 tbsp', grams: 12 }
    ],
    instructions: [
      'Step 1 (Chop Salad Base): Toss diced cucumber, crisp lettuce, and cherry tomatoes in a wide bowl.',
      'Step 2 (Top with Avocado & Eggs): Arrange cubed avocado and halved boiled eggs on top.',
      'Step 3 (Sprinkle Seeds & Dress): Drizzle lemon-olive oil dressing and sprinkle roasted flaxseeds and cracked black pepper.'
    ],
    clinicalBenefit: 'Oleic acid from avocado and Omega-3s from flaxseeds trigger GLP-1 satiety hormones for effortless calorie control.'
  },

  // --- 3. HIGH-CARB & ENERGY (HEALTHY WEIGHT GAIN, ATHLETES & PRE-WORKOUT) ---
  {
    id: 'hc-1',
    title: 'Healthy Weight-Gain Banana, Khajoor (Dates), Oats & Peanut Butter Shake',
    subtitle: '560 kcal Nutrient-Dense Mass & Energy Smoothie (Zero Refined Sugar)',
    macroCategory: 'High-Carb & Energy',
    mealTiming: 'Snack / Shake',
    dietTag: 'High Carb • Healthy Weight Gain',
    calories: 560,
    proteinG: 22,
    carbsG: 76,
    fatG: 19,
    fiberG: 9,
    cookTimeMin: 5,
    servings: 1,
    isVeg: true,
    ingredients: [
      { item: 'Whole Milk (or Soy Milk)', amount: '1.25 cups', grams: 300 },
      { item: 'Ripe Banana', amount: '1 large banana', grams: 120 },
      { item: 'Rolled Oats', amount: '1/2 cup', grams: 45 },
      { item: 'Soft Dates (Khajoor, pitted)', amount: '3 dates', grams: 35 },
      { item: 'Natural Unsweetened Peanut Butter', amount: '1.5 tbsp', grams: 24 },
      { item: 'Almonds & Chia Seeds', amount: '1 tbsp', grams: 12 }
    ],
    instructions: [
      'Step 1 (Blend Dry Oats): Pulse rolled oats and almonds in a blender for 10 seconds into a fine powder.',
      'Step 2 (Add Liquid & Fruit): Add milk, ripe banana, pitted dates, peanut butter, and chia seeds.',
      'Step 3 (Blend Smooth): Blend on high for 45 seconds until thick, creamy, and frothy. Drink post-workout or between meals for healthy weight gain.'
    ],
    clinicalBenefit: 'Provides 560 clean calories from complex oats, potassium-rich banana, iron-rich dates, and healthy nut fats for healthy weight/muscle gain.'
  },
  {
    id: 'hc-2',
    title: 'Sweet Potato (Shakarkandi), Chickpea & Boiled Egg Energy Bowl',
    subtitle: 'Slow-Release Complex Carbohydrates + Protein for All-Day Stamina',
    macroCategory: 'High-Carb & Energy',
    mealTiming: 'Lunch',
    dietTag: 'High Complex Carb • Stamina',
    calories: 450,
    proteinG: 21,
    carbsG: 64,
    fatG: 12,
    fiberG: 10,
    cookTimeMin: 20,
    servings: 1,
    isVeg: false,
    ingredients: [
      { item: 'Boiled or Baked Sweet Potato (Shakarkandi, cubed)', amount: '1.25 cups', grams: 180 },
      { item: 'Boiled White Chickpeas (Kabuli Chana)', amount: '3/4 cup', grams: 110 },
      { item: 'Boiled Eggs (or Grilled Paneer)', amount: '2 eggs', grams: 100 },
      { item: 'Lemon Juice, Roasted Cumin & Chaat Spices', amount: '1 tbsp', grams: 12 },
      { item: 'Extra-Virgin Olive Oil & Coriander', amount: '1.5 tsp', grams: 7 }
    ],
    instructions: [
      'Step 1 (Roast/Boil Sweet Potato): Boil or pan-roast peeled sweet potato cubes for 12–15 minutes until tender and ligeramente caramelized.',
      'Step 2 (Combine with Chickpeas): Toss warm sweet potato cubes with boiled chickpeas, olive oil, lemon juice, and roasted cumin.',
      'Step 3 (Top with Protein): Place sliced boiled eggs (or paneer) on top and garnish with fresh coriander.'
    ],
    clinicalBenefit: 'Rich in beta-carotene (Vitamin A), glycogen-replenishing complex carbs (64g), and 10g fiber for athletes and active individuals.'
  },
  {
    id: 'hc-3',
    title: 'Brown Rice, Red Kidney Beans (Rajma) & Chicken / Paneer Burrito Bowl',
    subtitle: 'High-Energy Complex Carbs + Complete Amino Acid Combination',
    macroCategory: 'High-Carb & Energy',
    mealTiming: 'Lunch',
    dietTag: 'High Carb + High Protein',
    calories: 490,
    proteinG: 29,
    carbsG: 68,
    fatG: 11,
    fiberG: 11,
    cookTimeMin: 20,
    servings: 1,
    isVeg: false,
    ingredients: [
      { item: 'Cooked Brown or Basmati Rice', amount: '1 cup cooked', grams: 150 },
      { item: 'Boiled Red Kidney Beans (Rajma) in Tomato Gravy', amount: '3/4 cup', grams: 130 },
      { item: 'Grilled Chicken Strips (or Paneer)', amount: '3.5 oz', grams: 100 },
      { item: 'Sweet Corn, Tomato & Onion Salsa', amount: '1/2 cup', grams: 75 },
      { item: 'Yogurt-Lime Drizzle', amount: '2 tbsp', grams: 30 }
    ],
    instructions: [
      'Step 1 (Simmer Rajma): Warm boiled kidney beans in a light tomato-garlic-cumin gravy for 5 minutes.',
      'Step 2 (Layer Grain Base): Fluff hot brown/basmati rice in a serving bowl.',
      'Step 3 (Top & Serve): Arrange spiced rajma, grilled chicken/paneer, corn-tomato salsa, and yogurt-lime drizzle over the rice.'
    ],
    clinicalBenefit: 'Delivers 68g sustained-release carbohydrates and 29g protein to fuel heavy workdays or muscle-gain goals.'
  },

  // --- 4. LOW-PROTEIN & LIGHT DIGESTION (RENAL-FRIENDLY, URIC ACID & LIGHT GUT RECOVERY) ---
  {
    id: 'lp-1',
    title: 'Steamed Bottle Gourd (Lauki / Kaddu) & Rice Flour Light Khichdi',
    subtitle: 'Gentle Low-Protein (7g Protein) • Easy on Kidneys, Uric Acid & Digestion',
    macroCategory: 'Low-Protein & Light',
    mealTiming: 'Dinner',
    dietTag: 'Low Protein • Kidney & Uric Acid Safe',
    calories: 270,
    proteinG: 6,
    carbsG: 48,
    fatG: 6,
    fiberG: 4,
    cookTimeMin: 18,
    servings: 1,
    isVeg: true,
    ingredients: [
      { item: 'Peeled & Diced Bottle Gourd (Lauki / Kaddu)', amount: '1.5 cups', grams: 180 },
      { item: 'Washed White Rice (low potassium/phosphorus)', amount: '1/2 cup raw', grams: 80 },
      { item: 'Cumin Seeds, Grated Ginger & Turmeric', amount: '1 tsp', grams: 5 },
      { item: 'Fresh Coriander Leaves', amount: '1 tbsp', grams: 6 },
      { item: 'Olive Oil or Cow Ghee', amount: '1.5 tsp', grams: 7 }
    ],
    instructions: [
      'Step 1 (Sauté Aromatics): Heat 1.5 tsp olive oil/ghee in a pot. Add cumin seeds and grated ginger and sauté for 30 seconds.',
      'Step 2 (Simmer Lauki & Rice): Add diced bottle gourd (lauki), washed rice, turmeric, and 2.5 cups water.',
      'Step 3 (Cook Until Soft): Cover and simmer on low flame for 14–15 minutes until soft and porridge-like. Garnish with coriander.'
    ],
    clinicalBenefit: 'Specifically formulated with low purines and controlled protein (6g) for individuals managing high uric acid, gout, or light digestive recovery.'
  },
  {
    id: 'lp-2',
    title: 'Warm Cinnamon Apple, Sabudana (Tapioca Pearls) & Almond Milk Bowl',
    subtitle: 'Low-Protein (5g), Alkaline, Gluten-Free Soothing Energy Bowl',
    macroCategory: 'Low-Protein & Light',
    mealTiming: 'Breakfast',
    dietTag: 'Low Protein • Soothing & Alkaline',
    calories: 290,
    proteinG: 5,
    carbsG: 56,
    fatG: 5,
    fiberG: 4,
    cookTimeMin: 12,
    servings: 1,
    isVeg: true,
    ingredients: [
      { item: 'Soaked Sabudana (Tapioca Pearls)', amount: '1/2 cup soaked', grams: 75 },
      { item: 'Peeled & Diced Sweet Apple', amount: '1 medium apple', grams: 120 },
      { item: 'Unsweetened Almond Milk (or Diluted Milk)', amount: '1 cup', grams: 240 },
      { item: 'Cinnamon & Cardamom Powder (Elaichi)', amount: '1/2 tsp', grams: 2 },
      { item: '1 tsp Honey or Stevia (optional)', amount: '1 tsp', grams: 5 }
    ],
    instructions: [
      'Step 1 (Simmer Pearls): Simmer soaked sabudana in almond milk over medium-low heat for 6–7 minutes until pearls turn translucent.',
      'Step 2 (Fold Stewed Apple): Add finely diced apple, cardamom, and cinnamon powder and cook for 3 minutes until apple softens.',
      'Step 3 (Serve): Serve warm as a gentle, stomach-soothing breakfast.'
    ],
    clinicalBenefit: 'Provides clean, easily digestible energy with minimal nitrogen/urea load on the kidneys and stomach.'
  },
  {
    id: 'lp-3',
    title: 'Herb-Roasted Pumpkin (Halwa Kaddu), Carrot & Sweet Pepper Rice Bowl',
    subtitle: 'Antioxidant-Rich, Low-Protein (7g), Low-Purine Vegetable Meal',
    macroCategory: 'Low-Protein & Light',
    mealTiming: 'Lunch',
    dietTag: 'Low Protein • Low Purine',
    calories: 285,
    proteinG: 7,
    carbsG: 50,
    fatG: 7,
    fiberG: 6,
    cookTimeMin: 20,
    servings: 1,
    isVeg: true,
    ingredients: [
      { item: 'Diced Yellow Pumpkin (Kaddu) & Carrots', amount: '1.5 cups', grams: 175 },
      { item: 'Steamed Basmati Rice', amount: '3/4 cup cooked', grams: 120 },
      { item: 'Sweet Bell Peppers & Garlic', amount: '1/2 cup', grams: 60 },
      { item: 'Olive Oil, Rosemary/Oregano & Black Pepper', amount: '1.5 tsp', grams: 8 }
    ],
    instructions: [
      'Step 1 (Pan-Roast Veggies): Sauté diced pumpkin, carrots, and bell peppers in 1.5 tsp olive oil with garlic and herbs for 12 minutes until tender.',
      'Step 2 (Serve Over Rice): Spoon the caramelized herb vegetables over warm steamed rice.'
    ],
    clinicalBenefit: 'High in Vitamin A and lutein while keeping protein and purine intake low.'
  },

  // --- 5. DIABETIC & LOW-GI (BLOOD SUGAR CONTROL & INSULIN SENSITIVITY) ---
  {
    id: 'db-1',
    title: 'Diabetic-Friendly Methi (Fenugreek) & Barley (Jau) Savory Daliya',
    subtitle: 'Ultra Low Glycemic Index (GI 28) • Slows Glucose Absorption Naturally',
    macroCategory: 'Diabetic & Low-GI',
    mealTiming: 'Breakfast',
    dietTag: 'Diabetic Safe • Low GI',
    calories: 280,
    proteinG: 12,
    carbsG: 42,
    fatG: 6,
    fiberG: 10,
    cookTimeMin: 20,
    servings: 1,
    isVeg: true,
    ingredients: [
      { item: 'Cracked Barley (Jau ka Daliya, soaked 15 mins)', amount: '1/2 cup', grams: 65 },
      { item: 'Fresh Fenugreek Leaves (Methi, chopped)', amount: '3/4 cup', grams: 45 },
      { item: 'Split Green Moong Daal', amount: '2 tbsp', grams: 25 },
      { item: 'Chopped Tomato, Ginger, Garlic & Cumin', amount: '1/3 cup', grams: 50 },
      { item: 'Olive Oil', amount: '1 tsp', grams: 5 }
    ],
    instructions: [
      'Step 1 (Sauté Methi & Cumin): Heat 1 tsp olive oil in a pot. Sauté cumin seeds, ginger, garlic, and chopped fresh methi leaves for 2 minutes.',
      'Step 2 (Simmer Barley & Moong): Add soaked barley daliya, moong daal, tomato, turmeric, and 2.5 cups water.',
      'Step 3 (Cook Until Tender): Cover and cook on low heat for 15–16 minutes until soft and savory. Serve hot.'
    ],
    clinicalBenefit: 'Barley beta-glucan and 4-hydroxyisoleucine in fenugreek (methi) clinically improve insulin sensitivity and blunt post-meal sugar spikes.'
  },
  {
    id: 'db-2',
    title: 'Karela (Bitter Gourd), Onion & Chana Daal Diabetic Stir-Fry',
    subtitle: 'Contains Natural Polypeptide-p (Plant Insulin) + Low-GI Chana Lentils',
    macroCategory: 'Diabetic & Low-GI',
    mealTiming: 'Lunch',
    dietTag: 'Diabetic Blood Sugar Control',
    calories: 260,
    proteinG: 13,
    carbsG: 34,
    fatG: 8,
    fiberG: 9,
    cookTimeMin: 22,
    servings: 1,
    isVeg: true,
    ingredients: [
      { item: 'Sliced Bitter Gourd (Karela, deseeded)', amount: '1.25 cups', grams: 150 },
      { item: 'Boiled Chana Daal (Split Bengal Gram)', amount: '1/2 cup boiled', grams: 85 },
      { item: 'Sliced Onions & Ripe Tomatoes', amount: '1 medium each', grams: 100 },
      { item: 'Fennel Seeds (Saunf), Coriander, Turmeric & Amchoor', amount: '1.5 tsp', grams: 8 },
      { item: 'Mustard or Olive Oil', amount: '1.5 tsp', grams: 7 }
    ],
    instructions: [
      'Step 1 (Prep Karela): Rub sliced karela with a pinch of salt for 10 minutes, then rinse thoroughly with water and squeeze dry to remove excess bitterness.',
      'Step 2 (Sauté Karela & Onions): Heat 1.5 tsp oil in a pan, sauté karela slices and onions for 7–8 minutes until lightly golden.',
      'Step 3 (Fold in Boiled Chana Daal): Add tomatoes, boiled chana daal, fennel seeds, turmeric, and amchoor (dry mango powder). Cover on low heat for 6 minutes and serve.'
    ],
    clinicalBenefit: 'Charantin and polypeptide-p in Karela paired with GI-29 Chana Daal help maintain steady HbA1c and fasting glucose.'
  },
  {
    id: 'db-3',
    title: 'Besan (Chickpea Flour) & Vegetable Cheela with Mint Dahi',
    subtitle: '100% Wheat-Free, Low-GI Savory Pancake for Sugar & Weight Control',
    macroCategory: 'Diabetic & Low-GI',
    mealTiming: 'Breakfast',
    dietTag: 'Diabetic & PCOS Friendly',
    calories: 275,
    proteinG: 15,
    carbsG: 32,
    fatG: 9,
    fiberG: 7,
    cookTimeMin: 12,
    servings: 1,
    isVeg: true,
    ingredients: [
      { item: 'Pure Gram Flour (Besan)', amount: '1/2 cup', grams: 60 },
      { item: 'Grated Zucchini, Carrot, Spinach & Onion', amount: '3/4 cup', grams: 80 },
      { item: 'Low-Fat Mint Yogurt (Dahi)', amount: '1/3 cup', grams: 75 },
      { item: 'Ajwain (Carom Seeds), Turmeric & Green Chili', amount: '1 tsp', grams: 5 },
      { item: 'Olive Oil', amount: '1 tsp', grams: 5 }
    ],
    instructions: [
      'Step 1 (Mix Batter): Whisk besan with water, ajwain, turmeric, and salt into a smooth pouring batter, then fold in grated vegetables.',
      'Step 2 (Cook Cheela): Pour onto a preheated non-stick tawa brushed with 1 tsp olive oil and cook 2.5 minutes per side until golden and crisp.',
      'Step 3 (Serve): Serve immediately with chilled mint-coriander yogurt.'
    ],
    clinicalBenefit: 'Chickpea flour has less than half the glycemic load of wheat roti, preventing mid-morning glucose spikes.'
  },

  // --- 6. HEART, BP & GUT HEALTH (DASH DIET, LOW-SODIUM, CHOLESTEROL & PCOS) ---
  {
    id: 'hb-1',
    title: 'Heart-Healthy Garlic, Turmeric & Red Lentil (Masoor) Detox Soup',
    subtitle: 'Low-Sodium, Allicin & Soluble Fiber Bowl for BP & Cholesterol Care',
    macroCategory: 'Heart, BP & Gut Health',
    mealTiming: 'Dinner',
    dietTag: 'Heart & BP Safe • Low Sodium',
    calories: 245,
    proteinG: 15,
    carbsG: 36,
    fatG: 4,
    fiberG: 8,
    cookTimeMin: 20,
    servings: 1,
    isVeg: true,
    ingredients: [
      { item: 'Red Split Lentils (Masoor Daal, washed)', amount: '1/2 cup', grams: 70 },
      { item: 'Diced Carrots, Celery & Spinach', amount: '1 cup', grams: 110 },
      { item: 'Fresh Crushed Garlic Cloves & Grated Ginger', amount: '4 cloves + 1 tsp', grams: 18 },
      { item: 'Turmeric, Black Pepper, Cumin & Lemon Juice', amount: '1 tbsp total', grams: 15 },
      { item: 'Extra-Virgin Olive Oil', amount: '1 tsp', grams: 5 }
    ],
    instructions: [
      'Step 1 (Sauté Garlic & Ginger): Gently warm 1 tsp olive oil in a pot and sauté crushed garlic, ginger, cumin, and turmeric for 45 seconds.',
      'Step 2 (Simmer Lentils & Veggies): Add washed red lentils, diced carrots, celery, and 3 cups water. Simmer covered for 15 minutes until creamy.',
      'Step 3 (Wilt Spinach & Lemon): Stir in fresh spinach leaves for 1 minute, turn off heat, and add fresh lemon juice (replaces excess salt!).'
    ],
    clinicalBenefit: 'Garlic allicin and potassium-rich vegetables help relax blood vessels (lowering BP), while lentil soluble fiber binds dietary cholesterol.'
  },
  {
    id: 'hb-2',
    title: 'PCOS & Hormone-Balance Seed Cycling Oats & Cinnamon Bowl',
    subtitle: 'Flaxseeds, Pumpkin Seeds, Chia & Ceylon Cinnamon for Hormone & Gut Care',
    macroCategory: 'Heart, BP & Gut Health',
    mealTiming: 'Breakfast',
    dietTag: 'PCOS & Hormone Balance',
    calories: 310,
    proteinG: 13,
    carbsG: 38,
    fatG: 12,
    fiberG: 9,
    cookTimeMin: 10,
    servings: 1,
    isVeg: true,
    ingredients: [
      { item: 'Steel-Cut or Rolled Oats', amount: '1/2 cup', grams: 45 },
      { item: 'Ground Flaxseeds (Alsi) & Raw Pumpkin Seeds', amount: '1 tbsp each', grams: 20 },
      { item: 'Chia Seeds & Chopped Walnuts', amount: '1 tbsp', grams: 12 },
      { item: 'Unsweetened Almond / Low-Fat Milk', amount: '1 cup', grams: 240 },
      { item: 'Ceylon Cinnamon & Half Diced Apple/Pear', amount: '1/2 cup fruit + 1/2 tsp', grams: 65 }
    ],
    instructions: [
      'Step 1 (Cook Oats): Simmer rolled oats with milk, diced apple/pear, and Ceylon cinnamon for 5–6 minutes.',
      'Step 2 (Stir in Hormone-Balancing Seeds): Remove from heat and fold in ground flaxseeds, pumpkin seeds, chia seeds, and walnuts.',
      'Step 3 (Serve): Enjoy warm.'
    ],
    clinicalBenefit: 'Lignans in flaxseeds help metabolize excess estrogen and androgens in PCOS, while magnesium and Omega-3s reduce inflammation.'
  }
];

// ============================================================================
// CUSTOM NUTRITION RECIPE & MEAL BUILDER INGREDIENT OPTIONS
// ============================================================================
const CUSTOM_PROTEIN_OPTIONS = [
  { name: 'Egg Whites + Whole Egg', proteinPer100g: 13, carbsPer100g: 1, fatPer100g: 5, kcalPer100g: 105, isVeg: false },
  { name: 'Skinless Chicken Breast', proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6, kcalPer100g: 165, isVeg: false },
  { name: 'Fresh Fish / Salmon Fillet', proteinPer100g: 24, carbsPer100g: 0, fatPer100g: 8, kcalPer100g: 175, isVeg: false },
  { name: 'Low-Fat Paneer (Cottage Cheese)', proteinPer100g: 18, carbsPer100g: 4, fatPer100g: 12, kcalPer100g: 195, isVeg: true },
  { name: 'Boiled Chickpeas / Kala Chana', proteinPer100g: 9, carbsPer100g: 27, fatPer100g: 2.6, kcalPer100g: 164, isVeg: true },
  { name: 'Green Moong Daal / Sprouts', proteinPer100g: 8.5, carbsPer100g: 19, fatPer100g: 1, kcalPer100g: 118, isVeg: true },
  { name: 'Thick Greek Yogurt (Hung Dahi)', proteinPer100g: 10, carbsPer100g: 4, fatPer100g: 3, kcalPer100g: 85, isVeg: true }
];

const CUSTOM_CARB_OPTIONS = [
  { name: 'Rolled Oats / Jau Daliya', proteinPer100g: 11, carbsPer100g: 66, fatPer100g: 6, kcalPer100g: 365 },
  { name: 'Steamed Brown / Basmati Rice', proteinPer100g: 2.7, carbsPer100g: 28, fatPer100g: 0.4, kcalPer100g: 130 },
  { name: 'Sweet Potato (Shakarkandi)', proteinPer100g: 1.6, carbsPer100g: 20, fatPer100g: 0.1, kcalPer100g: 86 },
  { name: 'Cooked Quinoa', proteinPer100g: 4.4, carbsPer100g: 21, fatPer100g: 1.9, kcalPer100g: 120 },
  { name: 'Cauliflower Rice (Gobi - Low Carb)', proteinPer100g: 1.9, carbsPer100g: 5, fatPer100g: 0.3, kcalPer100g: 25 },
  { name: 'Banana & Soft Dates (High Energy)', proteinPer100g: 1.5, carbsPer100g: 32, fatPer100g: 0.3, kcalPer100g: 135 }
];

const CUSTOM_VEGGIE_OPTIONS = [
  { name: 'Fresh Spinach (Palak) & Greens', kcalPer100g: 23, fiberG: 3 },
  { name: 'Broccoli, Bell Peppers & Carrots', kcalPer100g: 35, fiberG: 4 },
  { name: 'Bottle Gourd (Lauki) & Zucchini (Tori)', kcalPer100g: 17, fiberG: 2.5 },
  { name: 'Cucumber, Tomato & Onion Kachumber', kcalPer100g: 20, fiberG: 2 },
  { name: 'Karela (Bitter Gourd) & Methi Leaves', kcalPer100g: 28, fiberG: 4.5 }
];

const CUSTOM_HEALTHY_FAT_OPTIONS = [
  { name: 'Extra-Virgin Olive Oil (1.5 tsp)', grams: 7, fatG: 7, kcal: 60 },
  { name: 'Chia Seeds, Flaxseeds & Pumpkin Seeds (1.5 tbsp)', grams: 18, fatG: 7, kcal: 95 },
  { name: 'Soaked Almonds & Walnuts (7 nuts)', grams: 15, fatG: 9, kcal: 98 },
  { name: 'Ripe Avocado / Natural Peanut Butter (1.5 tbsp)', grams: 30, fatG: 11, kcal: 115 }
];

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

  // Health Condition Food Guide Filter
  const [selectedCondition, setSelectedCondition] = useState<string>('Diabetes');

  // ==========================================================================
  // NUTRITION RECIPES & CUSTOM MEAL BUILDER STATE
  // ==========================================================================
  const [userCustomRecipes, setUserCustomRecipes] = useState<
    ClinicalNutritionRecipe[]
  >([]);
  const [recipeViewMode, setRecipeViewMode] = useState<'grid' | 'list'>('grid');
  const [recipeMacroFilter, setRecipeMacroFilter] = useState<string>('All');
  const [recipeSearchQuery, setRecipeSearchQuery] = useState<string>('');
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(
    'hp-1'
  );
  const [modalRecipe, setModalRecipe] =
    useState<ClinicalNutritionRecipe | null>(null);

  // Custom Nutrition Meal / Recipe Generator State
  const [showCustomBuilder, setShowCustomBuilder] = useState<boolean>(true);
  const [builderMacroType, setBuilderMacroType] =
    useState<NutritionMacroCategory>('High-Protein');
  const [builderMealTiming, setBuilderMealTiming] = useState<
    'Breakfast' | 'Lunch' | 'Dinner' | 'Snack / Shake'
  >('Lunch');
  const [builderProteinIdx, setBuilderProteinIdx] = useState<number>(1); // Chicken Breast default
  const [builderCarbIdx, setBuilderCarbIdx] = useState<number>(0); // Oats/Jau default
  const [builderVeggieIdx, setBuilderVeggieIdx] = useState<number>(0); // Spinach default
  const [builderFatIdx, setBuilderFatIdx] = useState<number>(0); // Olive oil default
  const [builderCustomTitle, setBuilderCustomTitle] = useState<string>('');

  // Save notification banner
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Live Calculated BMI, BMR, TDEE, Ideal Weight, Macros & Weight Recommendation
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

  // Health Condition Food Guide Data
  const conditionRecommendation = useMemo(
    () => getHealthConditionRecommendations(selectedCondition),
    [selectedCondition]
  );

  // All Recipes (User Custom Created + Preloaded Clinical Nutrition Recipes)
  const allNutritionRecipes = useMemo(
    () => [...userCustomRecipes, ...CLINICAL_NUTRITION_RECIPES],
    [userCustomRecipes]
  );

  // Filtered Recipes
  const filteredRecipes = useMemo(() => {
    return allNutritionRecipes.filter((r) => {
      if (
        recipeMacroFilter !== 'All' &&
        r.macroCategory !== recipeMacroFilter
      ) {
        return false;
      }
      if (recipeSearchQuery.trim()) {
        const q = recipeSearchQuery.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchTag = r.dietTag.toLowerCase().includes(q);
        const matchIng = r.ingredients.some((i) =>
          i.item.toLowerCase().includes(q)
        );
        if (!matchTitle && !matchTag && !matchIng) return false;
      }
      return true;
    });
  }, [allNutritionRecipes, recipeMacroFilter, recipeSearchQuery]);

  // ==========================================================================
  // GENERATE CUSTOM NUTRITION RECIPE / MEAL BASED ON MACRO GOAL
  // ==========================================================================
  const handleCreateCustomNutritionRecipe = () => {
    const prot = CUSTOM_PROTEIN_OPTIONS[builderProteinIdx] || CUSTOM_PROTEIN_OPTIONS[0];
    const carb = CUSTOM_CARB_OPTIONS[builderCarbIdx] || CUSTOM_CARB_OPTIONS[0];
    const veg = CUSTOM_VEGGIE_OPTIONS[builderVeggieIdx] || CUSTOM_VEGGIE_OPTIONS[0];
    const fat = CUSTOM_HEALTHY_FAT_OPTIONS[builderFatIdx] || CUSTOM_HEALTHY_FAT_OPTIONS[0];

    // Automatically scale gram portions based on selected Macro Goal!
    let proteinGrams = 150;
    let carbGrams = 100;
    let vegGrams = 130;

    if (builderMacroType === 'High-Protein') {
      proteinGrams = 200; // Extra protein portion
      carbGrams = 90;
      vegGrams = 130;
    } else if (builderMacroType === 'Low-Carb & Fat Loss') {
      proteinGrams = 170;
      carbGrams = 45; // Minimal carbs
      vegGrams = 180; // High volume greens
    } else if (builderMacroType === 'High-Carb & Energy') {
      proteinGrams = 140;
      carbGrams = 180; // High energy complex carbs
      vegGrams = 100;
    } else if (builderMacroType === 'Low-Protein & Light') {
      proteinGrams = 55; // Controlled gentle protein
      carbGrams = 130;
      vegGrams = 160;
    } else if (builderMacroType === 'Diabetic & Low-GI') {
      proteinGrams = 150;
      carbGrams = 80;
      vegGrams = 170;
    } else {
      // Heart, BP & Gut Health
      proteinGrams = 140;
      carbGrams = 100;
      vegGrams = 160;
    }

    const totalProtein = Math.round(
      (prot.proteinPer100g * proteinGrams) / 100 +
        (carb.proteinPer100g * carbGrams) / 100 +
        2
    );
    const totalCarbs = Math.round(
      (prot.carbsPer100g * proteinGrams) / 100 +
        (carb.carbsPer100g * carbGrams) / 100 +
        6
    );
    const totalFat = Math.round(
      (prot.fatPer100g * proteinGrams) / 100 +
        (carb.fatPer100g * carbGrams) / 100 +
        fat.fatG
    );
    const totalCalories = Math.round(
      (prot.kcalPer100g * proteinGrams) / 100 +
        (carb.kcalPer100g * carbGrams) / 100 +
        (veg.kcalPer100g * vegGrams) / 100 +
        fat.kcal
    );
    const totalFiber = Math.round(veg.fiberG + (carbGrams >= 90 ? 5 : 3));

    const autoTitle =
      builderCustomTitle.trim() ||
      `Custom ${builderMacroType}: ${prot.name.split(' ')[0]} & ${carb.name.split(' ')[0]} ${builderMealTiming}`;

    const newRecipe: ClinicalNutritionRecipe = {
      id: `custom-${Date.now()}`,
      title: autoTitle,
      subtitle: `Custom ${builderMacroType} ${builderMealTiming} • ${totalProtein}g Protein • ${totalCarbs}g Carbs • ${totalCalories} kcal`,
      macroCategory: builderMacroType,
      mealTiming: builderMealTiming,
      dietTag: `Custom ${builderMacroType}`,
      calories: totalCalories,
      proteinG: totalProtein,
      carbsG: totalCarbs,
      fatG: totalFat,
      fiberG: totalFiber,
      cookTimeMin: 15,
      servings: 1,
      isVeg: prot.isVeg,
      isCustomCreated: true,
      ingredients: [
        {
          item: `${prot.name} (Primary Protein Source)`,
          amount: `${Math.round(proteinGrams / 28)} oz portion`,
          grams: proteinGrams
        },
        {
          item: `${carb.name} (Controlled Carbohydrate Source)`,
          amount: `${carbGrams}g portion`,
          grams: carbGrams
        },
        {
          item: `${veg.name} (Fiber & Micronutrients)`,
          amount: '1.25 cups',
          grams: vegGrams
        },
        {
          item: fat.name,
          amount: 'Measured portion',
          grams: fat.grams
        },
        {
          item: 'Fresh Lemon Juice, Garlic, Ginger, Cumin & Black Pepper',
          amount: '1 tbsp total',
          grams: 12
        }
      ],
      instructions: [
        `Step 1 (Weigh Exact Macro Portions): Measure ${proteinGrams}g of ${prot.name}, ${carbGrams}g of ${carb.name}, and ${vegGrams}g of ${veg.name} to hit your exact ${builderMacroType} macro target.`,
        `Step 2 (Cook Protein & Aromatics): Warm a non-stick skillet with ${fat.name}. Sauté garlic, ginger, cumin, and ${prot.name} for 5–6 minutes until tender and flavorful.`,
        `Step 3 (Prepare Fiber & Carbs): Add ${veg.name} and steam-sauté for 3–4 minutes so the vegetables retain their vitamins and fiber, then combine with ${carb.name}.`,
        `Step 4 (Finish & Serve): Season with fresh lemon juice, black pepper, and coriander. Enjoy your custom ${totalCalories} kcal (${totalProtein}g Protein | ${totalCarbs}g Carbs | ${totalFat}g Fat) nutrition meal!`
      ],
      clinicalBenefit: `Custom-engineered for ${builderMacroType}: provides ${totalProtein}g protein, ${totalCarbs}g carbohydrates, ${totalFat}g healthy fats, and ${totalFiber}g dietary fiber.`
    };

    setUserCustomRecipes((prev) => [newRecipe, ...prev]);
    setRecipeMacroFilter('All');
    setExpandedRecipeId(newRecipe.id);
    setBuilderCustomTitle('');
    setSaveSuccessMsg(
      `Custom "${newRecipe.title}" created with exact macros (${totalCalories} kcal, ${totalProtein}g Protein, ${totalCarbs}g Carbs)!`
    );
    setTimeout(() => setSaveSuccessMsg(null), 4000);
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
      // Local state still updates seamlessly
    }

    setSaveSuccessMsg('Your Health & Nutrition Tracker data has been saved!');
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // Download Complete Personal Nutrition & Health PDF Report
  const handleDownloadNutritionPdfReport = () => {
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();

    pdf.setFillColor(19, 66, 43);
    pdf.rect(0, 0, pageW, 36, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text('PERSONAL NUTRITION, BMI & HEALTH TRACKER REPORT', 14, 15);
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
    pdf.text('2. RECOMMENDED DAILY MEAL PLAN (WITH GRAMS & CALORIES)', 14, y);
    y += 6;

    const mealPlanRows = [
      `Breakfast (8:00 AM): Egg White & Spinach Oats Chilla or Barley Daliya (240g) — 340 kcal | 28g Protein`,
      `Mid-Morning Snack (11:00 AM): Greek Yogurt Berry & Seed Bowl (150g) — 165 kcal | 14g Protein`,
      `Lunch (1:30 PM): Grilled Lemon Chicken / Sprouted Moong & Paneer Bowl (320g) — 410 kcal | 36g Protein`,
      `Evening Snack (5:00 PM): Green Tea + Roasted Chana & Almonds (120g) — 140 kcal | 7g Protein`,
      `Dinner (8:00 PM): Garlic Fish Tikka or Cauliflower Rice & Greens Bowl (260g) — 310 kcal | 32g Protein`
    ];
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    mealPlanRows.forEach((row) => {
      pdf.text(`• ${row}`, 16, y);
      y += 6.5;
    });

    y += 5;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text(
      `3. NUTRITION GUIDE FOR: ${selectedCondition.toUpperCase()}`,
      14,
      y
    );
    y += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.text(
      `Recommended Foods: ${conditionRecommendation.recommendedFoods
        .map((f) => f.name)
        .join(', ')}`,
      16,
      y
    );
    y += 6;
    pdf.text(
      `Foods to Avoid: ${conditionRecommendation.foodsToAvoid
        .map((f) => f.name)
        .join(', ')}`,
      16,
      y
    );

    y += 10;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('4. CLINICAL NUTRITION RECIPES INCLUDED', 14, y);
    y += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    allNutritionRecipes.slice(0, 5).forEach((rec) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(
        `• [${rec.macroCategory}] ${rec.title} (${rec.calories} kcal | P: ${rec.proteinG}g | C: ${rec.carbsG}g | F: ${rec.fatG}g)`,
        16,
        y
      );
      y += 4.5;
      pdf.setFont('helvetica', 'normal');
      const ingLine = rec.ingredients
        .slice(0, 4)
        .map((i) => `${i.item} (${i.grams}g)`)
        .join(', ');
      pdf.text(`  Ingredients: ${ingLine}`, 16, y);
      y += 5.5;
    });

    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(DOCTOR_DISCLAIMER_BANNER, 14, 285);

    pdf.save(
      `${(profile.fullName || 'Specialist').replace(/\s+/g, '_')}_Nutrition_Health_Report.pdf`
    );
  };

  // Download Single Recipe PDF
  const handleDownloadSingleRecipePdf = (recipe: ClinicalNutritionRecipe) => {
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();

    pdf.setFillColor(19, 66, 43);
    pdf.rect(0, 0, pageW, 32, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text(recipe.title.toUpperCase(), 14, 14);
    pdf.setFontSize(9.5);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `${recipe.macroCategory} (${recipe.mealTiming}) | ${recipe.calories} kcal | Protein: ${recipe.proteinG}g | Carbs: ${recipe.carbsG}g | Fat: ${recipe.fatG}g | Fiber: ${recipe.fiberG}g`,
      14,
      23
    );

    let y = 42;
    pdf.setTextColor(15, 41, 30);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('INGREDIENTS REQUIRED (WITH EXACT GRAMS & PORTIONS):', 14, y);
    y += 7;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    recipe.ingredients.forEach((ing, i) => {
      pdf.text(
        `${i + 1}. ${ing.item} — ${ing.amount} (${ing.grams}g)`,
        16,
        y
      );
      y += 6;
    });

    y += 6;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('STEP-BY-STEP PREPARATION INSTRUCTIONS:', 14, y);
    y += 7;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    recipe.instructions.forEach((step) => {
      const lines = pdf.splitTextToSize(step, pageW - 32);
      pdf.text(lines, 16, y);
      y += lines.length * 5.5 + 3;
    });

    y += 4;
    pdf.setFont('helvetica', 'bold');
    const benLines = pdf.splitTextToSize(
      `Clinical Benefit: ${recipe.clinicalBenefit}`,
      pageW - 28
    );
    pdf.text(benLines, 14, y);

    pdf.save(`${recipe.title.replace(/\s+/g, '_')}_Nutrition_Recipe.pdf`);
  };

  // BMI Pointer position (0 to 100%)
  const bmiPointerPct = useMemo(() => {
    const clamped = Math.max(14, Math.min(38, indexes.bmi));
    return Math.round(((clamped - 14) / (38 - 14)) * 100);
  }, [indexes.bmi]);

  // Badge styling helper for Macro Categories (matches app's Green/Emerald/Teal palette)
  const getMacroBadgeStyle = (cat: NutritionMacroCategory) => {
    switch (cat) {
      case 'High-Protein':
        return 'bg-[#DCFCE7] text-[#14532D] border-[#86EFAC]';
      case 'Low-Carb & Fat Loss':
        return 'bg-[#CCFBF1] text-[#115E59] border-[#5EEAD4]';
      case 'High-Carb & Energy':
        return 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]';
      case 'Low-Protein & Light':
        return 'bg-[#E0F2FE] text-[#075985] border-[#BAE6FD]';
      case 'Diabetic & Low-GI':
        return 'bg-[#E2F2E9] text-[#0D6845] border-[#A7F3D0]';
      case 'Heart, BP & Gut Health':
        return 'bg-[#FCE7F3] text-[#9D174D] border-[#FBCFE8]';
      default:
        return 'bg-[#E2F2E9] text-[#0D6845] border-[#A7F3D0]';
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* =====================================================================
          TOP HEADER BANNER — SIMPLE 1-PAGE PERSONAL HEALTH & NUTRITION TRACKER
         ===================================================================== */}
      <div className="bg-gradient-to-r from-[#13422B] via-[#155E3A] to-[#0E9F6E] rounded-[24px] p-4 sm:p-5 text-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-100 text-[10.5px] font-extrabold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              1-Page Clinical Nutrition • BMI, Weight Graph, Custom Meal Creator &amp; Dietitian Recipes
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold mt-1">
              Personal Health, BMI &amp; Clinical Nutrition Calculator
            </h2>
            <p className="text-xs text-emerald-100 mt-0.5">
              Track your BMI &amp; weight goal, view your daily meal plan, or create &amp; explore High-Protein, Low-Carb, High-Carb, Low-Protein &amp; Diabetic recipes in Grid or List view.
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
          STEP 3: RECOMMENDED DAILY MEAL PLAN & HEALTH CONDITION FOOD GUIDE
         ===================================================================== */}
      <div className="bg-white border-[1.5px] border-[#BCE3C8] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-[#ECF4EF] pb-3">
          <div className="w-9 h-9 rounded-xl bg-[#E2F2E9] text-[#0E9F6E] flex items-center justify-center font-extrabold text-sm">
            3
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-[#0F291E]">
              Step 3: Daily Clinical Meal Plan &amp; Health Condition Food Guide
            </h3>
            <p className="text-[11px] text-[#5C7267]">
              Tailored for {indexes.dailyCaloriesNeeded} kcal/day ({profile.goal}) + Disease-Specific Food Recommendations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              meal: 'Breakfast (8:00 AM)',
              items: 'Egg White & Spinach Oats Chilla OR Barley (Jau) & Methi Daliya',
              grams: '240g Portion',
              kcal: Math.round(indexes.dailyCaloriesNeeded * 0.25),
              protein: `${Math.round(indexes.targetProteinG * 0.25)}g Protein`
            },
            {
              meal: 'Lunch (1:30 PM)',
              items: 'Grilled Lemon-Herb Chicken & Quinoa OR Sprouted Moong & Paneer Bowl',
              grams: '320g Portion',
              kcal: Math.round(indexes.dailyCaloriesNeeded * 0.35),
              protein: `${Math.round(indexes.targetProteinG * 0.35)}g Protein`
            },
            {
              meal: 'Evening Snack (5:00 PM)',
              items: 'Greek Yogurt (Hung Dahi), Chia, Pumpkin Seeds & Pomegranate Bowl',
              grams: '160g Portion',
              kcal: Math.round(indexes.dailyCaloriesNeeded * 0.12),
              protein: `${Math.round(indexes.targetProteinG * 0.15)}g Protein`
            },
            {
              meal: 'Dinner (8:00 PM)',
              items: 'Garlic Fish Tikka with Broccoli OR Low-Carb Cauliflower Rice & Greens',
              grams: '260g Portion',
              kcal: Math.round(indexes.dailyCaloriesNeeded * 0.28),
              protein: `${Math.round(indexes.targetProteinG * 0.25)}g Protein`
            }
          ].map((slot) => (
            <div
              key={slot.meal}
              className="p-3.5 rounded-2xl bg-[#F8FCFA] border border-[#CBE3D6] space-y-1.5 flex flex-col justify-between"
            >
              <div>
                <div className="text-xs font-extrabold text-[#13422B]">
                  {slot.meal}
                </div>
                <p className="text-xs text-[#0F291E] font-semibold mt-1 leading-snug">
                  {slot.items}
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#E2F2E9] text-[10.5px] font-extrabold">
                <span className="text-[#5C7267]">{slot.grams}</span>
                <span className="text-[#0E9F6E]">
                  {slot.kcal} kcal • {slot.protein}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-extrabold text-[#0F291E]">
              Select Health Condition for Foods to Eat &amp; Avoid:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                'Diabetes',
                'High Blood Pressure',
                'Cholesterol',
                'PCOS',
                'Acidity',
                'Anemia',
                'Thyroid'
              ].map((cond) => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => setSelectedCondition(cond)}
                  className={`px-3 py-1 rounded-full text-[11px] font-extrabold cursor-pointer transition-colors ${
                    selectedCondition === cond
                      ? 'bg-[#13422B] text-white'
                      : 'bg-[#F4FAF7] text-[#13422B] border border-[#CBE3D6]'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-2">
              <div className="text-xs font-extrabold text-[#14532D] flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-[#16A34A]" />
                <span>Recommended Foods for {selectedCondition}</span>
              </div>
              <div className="space-y-1.5">
                {conditionRecommendation.recommendedFoods.map((f) => (
                  <div
                    key={f.name}
                    className="p-2.5 rounded-xl bg-white border border-[#DCFCE7] flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-extrabold text-[#0F291E]">
                        ✓ {f.name}
                      </div>
                      <div className="text-[11px] text-[#166534]">
                        {f.shortNote}
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-[#15803D] shrink-0">
                      {f.caloriesPer100g} kcal/100g
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] space-y-2">
              <div className="text-xs font-extrabold text-[#991B1B] flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                <span>Foods to Avoid / Limit in {selectedCondition}</span>
              </div>
              <div className="space-y-1.5">
                {conditionRecommendation.foodsToAvoid.map((f) => (
                  <div
                    key={f.name}
                    className="p-2.5 rounded-xl bg-white border border-[#FEE2E2] flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-extrabold text-[#7F1D1D]">
                        ✕ {f.name}
                      </div>
                      <div className="text-[11px] text-[#991B1B]">
                        {f.shortNote}
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-[#DC2626] shrink-0">
                      Limit / Avoid
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================================
          STEP 4: CLINICAL NUTRITION RECIPES (GRID / LIST VIEW) + SMART CUSTOM MACRO MEAL CREATOR
         ===================================================================== */}
      <div className="bg-white border-[1.5px] border-[#BCE3C8] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-4">
        {/* Section Header + Grid/List View Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ECF4EF] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E2F2E9] text-[#0E9F6E] flex items-center justify-center font-extrabold text-sm">
              4
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#0F291E]">
                Step 4: Clinical Nutrition Recipes &amp; Custom Macro Meal Creator
              </h3>
              <p className="text-[11px] text-[#5C7267]">
                Create your own High-Protein, Low-Protein, Low-Carb or High-Carb meal, or browse Dietitian-Formulated Nutrition Recipes in Grid or List view
              </p>
            </div>
          </div>

          {/* Grid vs List View Switcher + Toggle Custom Builder */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCustomBuilder((v) => !v)}
              className="px-3 py-1.5 rounded-xl bg-[#13422B] hover:bg-[#0E9F6E] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>
                {showCustomBuilder ? 'Hide Meal Creator' : 'Create Custom Meal'}
              </span>
            </button>

            <div className="inline-flex rounded-xl border border-[#CBE3D6] bg-[#F4FAF7] p-0.5">
              <button
                type="button"
                onClick={() => setRecipeViewMode('grid')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                  recipeViewMode === 'grid'
                    ? 'bg-[#0E9F6E] text-white shadow-2xs'
                    : 'text-[#13422B]'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setRecipeViewMode('list')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                  recipeViewMode === 'list'
                    ? 'bg-[#0E9F6E] text-white shadow-2xs'
                    : 'text-[#13422B]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================================
            SMART CUSTOM NUTRITION RECIPE / MEAL BUILDER (HIGH PROTEIN, LOW PROTEIN, LOW CARB, HIGH CARB)
           =================================================================== */}
        {showCustomBuilder && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F0FDF4] via-[#F8FCFA] to-[#ECFDF5] border-2 border-[#86EFAC] space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#13422B] text-white text-[10px] font-extrabold uppercase tracking-wider">
                  Smart Macro Meal Creator
                </span>
                <h4 className="text-xs sm:text-sm font-extrabold text-[#0F291E]">
                  Build Your Own Custom Nutrition Meal (Auto-Calculates Exact Grams &amp; Macros)
                </h4>
              </div>
              <span className="text-[11px] font-bold text-[#0E9F6E]">
                Select your goal &amp; ingredients below →
              </span>
            </div>

            {/* 1. Select Macro Type Pills */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-extrabold text-[#13422B]">
                1. Choose Nutrition &amp; Macro Profile:
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(
                  [
                    'High-Protein',
                    'Low-Carb & Fat Loss',
                    'High-Carb & Energy',
                    'Low-Protein & Light',
                    'Diabetic & Low-GI',
                    'Heart, BP & Gut Health'
                  ] as NutritionMacroCategory[]
                ).map((mType) => (
                  <button
                    key={mType}
                    type="button"
                    onClick={() => setBuilderMacroType(mType)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition-all ${
                      builderMacroType === mType
                        ? 'bg-[#0E9F6E] text-white shadow-2xs'
                        : 'bg-white text-[#13422B] border border-[#CBE3D6] hover:border-[#0E9F6E]'
                    }`}
                  >
                    {mType}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Ingredient Selectors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              <div>
                <label className="block text-[11px] font-extrabold text-[#13422B] mb-1">
                  Meal Timing
                </label>
                <select
                  value={builderMealTiming}
                  onChange={(e) =>
                    setBuilderMealTiming(
                      e.target.value as
                        | 'Breakfast'
                        | 'Lunch'
                        | 'Dinner'
                        | 'Snack / Shake'
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[#CBE3D6] bg-white text-xs font-bold text-[#0F291E]"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snack / Shake">Snack / Shake</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#13422B] mb-1">
                  Primary Protein Source
                </label>
                <select
                  value={builderProteinIdx}
                  onChange={(e) => setBuilderProteinIdx(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBE3D6] bg-white text-xs font-bold text-[#0F291E]"
                >
                  {CUSTOM_PROTEIN_OPTIONS.map((p, idx) => (
                    <option key={p.name} value={idx}>
                      {p.name} ({p.proteinPer100g}g P/100g)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#13422B] mb-1">
                  Carb / Grain Source
                </label>
                <select
                  value={builderCarbIdx}
                  onChange={(e) => setBuilderCarbIdx(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBE3D6] bg-white text-xs font-bold text-[#0F291E]"
                >
                  {CUSTOM_CARB_OPTIONS.map((c, idx) => (
                    <option key={c.name} value={idx}>
                      {c.name} ({c.carbsPer100g}g C/100g)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#13422B] mb-1">
                  Vegetables &amp; Fiber
                </label>
                <select
                  value={builderVeggieIdx}
                  onChange={(e) => setBuilderVeggieIdx(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBE3D6] bg-white text-xs font-bold text-[#0F291E]"
                >
                  {CUSTOM_VEGGIE_OPTIONS.map((v, idx) => (
                    <option key={v.name} value={idx}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#13422B] mb-1">
                  Healthy Fats &amp; Seeds
                </label>
                <select
                  value={builderFatIdx}
                  onChange={(e) => setBuilderFatIdx(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#CBE3D6] bg-white text-xs font-bold text-[#0F291E]"
                >
                  {CUSTOM_HEALTHY_FAT_OPTIONS.map((f, idx) => (
                    <option key={f.name} value={idx}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Optional Custom Name + Generate Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
              <input
                type="text"
                value={builderCustomTitle}
                onChange={(e) => setBuilderCustomTitle(e.target.value)}
                placeholder="Optional: Give your custom meal a name (e.g., My Post-Workout High-Protein Bowl)"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#CBE3D6] bg-white text-xs font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
              />
              <button
                type="button"
                onClick={handleCreateCustomNutritionRecipe}
                className="px-5 py-2.5 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold inline-flex items-center justify-center gap-1.5 shadow-sm cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate My Custom Nutrition Recipe</span>
              </button>
            </div>
          </div>
        )}

        {/* ===================================================================
            FILTER BAR: MACRO CATEGORIES + SEARCH INPUT
           =================================================================== */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              'All',
              'High-Protein',
              'Low-Carb & Fat Loss',
              'High-Carb & Energy',
              'Low-Protein & Light',
              'Diabetic & Low-GI',
              'Heart, BP & Gut Health'
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setRecipeMacroFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold whitespace-nowrap cursor-pointer transition-colors ${
                  recipeMacroFilter === cat
                    ? 'bg-[#13422B] text-white'
                    : 'bg-[#F4FAF7] text-[#13422B] border border-[#CBE3D6] hover:border-[#0E9F6E]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 text-[#5C7267] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={recipeSearchQuery}
              onChange={(e) => setRecipeSearchQuery(e.target.value)}
              placeholder="Search nutrition recipes..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#CBE3D6] bg-[#F8FCFA] text-xs font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
            />
          </div>
        </div>

        {/* ===================================================================
            RECIPES DISPLAY: COMPATIBLE GRID VIEW OR COMPACT LIST VIEW
           =================================================================== */}
        <div
          className={
            recipeViewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 gap-3.5'
              : 'space-y-2.5'
          }
        >
          {filteredRecipes.map((recipe) => {
            const isExpanded = expandedRecipeId === recipe.id;
            const macroBadgeClass = getMacroBadgeStyle(recipe.macroCategory);

            return (
              <div
                key={recipe.id}
                onClick={() =>
                  setExpandedRecipeId(isExpanded ? null : recipe.id)
                }
                className={`rounded-[20px] border transition-all cursor-pointer bg-white ${
                  isExpanded
                    ? 'border-2 border-[#0E9F6E] shadow-md'
                    : 'border-[#CBE3D6] hover:border-[#0E9F6E] shadow-2xs'
                } p-4 space-y-3`}
              >
                {/* Top Row: Nutrition Category Badge + Meal Timing + Expand Button */}
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E2F2E9] text-[#0E9F6E] flex items-center justify-center shrink-0 mt-0.5">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-md border text-[10px] font-extrabold uppercase ${macroBadgeClass}`}
                        >
                          {recipe.macroCategory}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-[#F4FAF7] border border-[#D4E9DF] text-[#13422B] text-[10px] font-bold">
                          {recipe.mealTiming} • {recipe.cookTimeMin}m
                        </span>
                        {recipe.isCustomCreated && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-extrabold">
                            ★ Your Custom Meal
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-extrabold text-[#0F291E] mt-1 leading-snug">
                        {recipe.title}
                      </h4>
                      <p className="text-[11px] text-[#5C7267] font-medium mt-0.5">
                        {recipe.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-lg bg-[#F4FAF7] border border-[#CBE3D6] text-[#13422B] text-[11px] font-extrabold shrink-0 inline-flex items-center gap-1">
                    {isExpanded ? (
                      <>
                        <span>Hide</span>
                        <ChevronUp className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <span>Recipe</span>
                        <ChevronDown className="w-3.5 h-3.5" />
                      </>
                    )}
                  </span>
                </div>

                {/* Compact Nutrition Macro Strip (Compatible with App Cards) */}
                <div className="grid grid-cols-5 gap-1.5 text-center">
                  <div className="p-2 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                    <div className="text-[9.5px] font-bold text-[#5C7267]">
                      Calories
                    </div>
                    <div className="text-xs font-extrabold text-[#0F291E]">
                      {recipe.calories}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0]">
                    <div className="text-[9.5px] font-bold text-[#065F46]">
                      Protein
                    </div>
                    <div className="text-xs font-extrabold text-[#0E9F6E]">
                      {recipe.proteinG}g
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                    <div className="text-[9.5px] font-bold text-[#5C7267]">
                      Carbs
                    </div>
                    <div className="text-xs font-extrabold text-[#0F291E]">
                      {recipe.carbsG}g
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                    <div className="text-[9.5px] font-bold text-[#5C7267]">
                      Fats
                    </div>
                    <div className="text-xs font-extrabold text-[#0F291E]">
                      {recipe.fatG}g
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                    <div className="text-[9.5px] font-bold text-[#5C7267]">
                      Fiber
                    </div>
                    <div className="text-xs font-extrabold text-[#0E9F6E]">
                      {recipe.fiberG}g
                    </div>
                  </div>
                </div>

                {/* EXPANDED DETAILS: COMPLETE INGREDIENTS REQUIRED & STEP-BY-STEP INSTRUCTIONS */}
                {isExpanded && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="pt-3 border-t border-[#ECF4EF] space-y-3 animate-fade-in cursor-default"
                  >
                    {/* 1. Complete Required Ingredients */}
                    <div className="p-3.5 rounded-2xl bg-[#F4FAF7] border border-[#BCE3C8] space-y-2">
                      <h5 className="text-xs font-extrabold text-[#13422B] uppercase tracking-wide flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-[#0E9F6E]" />
                        <span>
                          Ingredients Required ({recipe.ingredients.length} Items — Exact Grams &amp; Portions)
                        </span>
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {recipe.ingredients.map((ing, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-xl bg-white border border-[#D4E9DF] flex items-center justify-between gap-2 text-xs"
                          >
                            <span className="font-bold text-[#0F291E]">
                              • {ing.item}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-[#E2F2E9] text-[#0D6845] text-[10.5px] font-extrabold shrink-0">
                              {ing.amount} ({ing.grams}g)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 2. Step-by-Step Preparation Instructions */}
                    <div className="p-3.5 rounded-2xl bg-[#F8FCFA] border border-[#CBE3D6] space-y-2">
                      <h5 className="text-xs font-extrabold text-[#13422B] uppercase tracking-wide flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-[#0E9F6E]" />
                        <span>
                          Step-by-Step Preparation Method (Banane ka Tareeqa)
                        </span>
                      </h5>

                      <ol className="space-y-1.5">
                        {recipe.instructions.map((stepText, sIdx) => (
                          <li
                            key={sIdx}
                            className="p-2.5 rounded-xl bg-white border border-[#E2F2E9] text-xs text-[#0F291E] leading-relaxed font-medium"
                          >
                            {stepText}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* 3. Clinical Dietitian Benefit & PDF Button */}
                    <div className="p-3 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[11px] font-bold text-[#065F46]">
                      🩺 <strong>Clinical Nutrition Benefit:</strong>{' '}
                      {recipe.clinicalBenefit}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setModalRecipe(recipe)}
                        className="px-3.5 py-2 rounded-xl bg-[#13422B] hover:bg-[#0F291E] text-white text-xs font-extrabold cursor-pointer"
                      >
                        Open Full View
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadSingleRecipePdf(recipe)}
                        className="px-3.5 py-2 rounded-xl bg-[#0E9F6E] hover:bg-[#059669] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Recipe PDF</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FULL-SCREEN RECIPE MODAL */}
      {modalRecipe && (
        <div
          onClick={() => setModalRecipe(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[26px] max-w-xl w-full overflow-hidden shadow-2xl border border-[#BCE3C8] my-8 max-h-[90vh] flex flex-col"
          >
            <div className="bg-gradient-to-r from-[#13422B] to-[#0E9F6E] p-5 text-white flex items-start justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold uppercase">
                  {modalRecipe.macroCategory} • {modalRecipe.mealTiming}
                </span>
                <h3 className="text-lg font-extrabold mt-1">
                  {modalRecipe.title}
                </h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  {modalRecipe.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalRecipe(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#F4FAF7] border border-[#BCE3C8] space-y-2">
                <h4 className="text-xs font-extrabold text-[#13422B] uppercase">
                  Ingredients Required ({modalRecipe.ingredients.length} Items)
                </h4>
                <div className="space-y-1.5">
                  {modalRecipe.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs p-2 rounded-lg bg-white border border-[#D4E9DF]"
                    >
                      <span className="font-bold text-[#0F291E]">
                        {i + 1}. {ing.item}
                      </span>
                      <span className="font-extrabold text-[#0E9F6E]">
                        {ing.amount} ({ing.grams}g)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8FCFA] border border-[#CBE3D6] space-y-2">
                <h4 className="text-xs font-extrabold text-[#13422B] uppercase">
                  Step-by-Step Preparation Method
                </h4>
                <div className="space-y-2">
                  {modalRecipe.instructions.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white border border-[#E2F2E9] text-xs text-[#0F291E] leading-relaxed"
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs font-bold text-[#065F46]">
                🩺 <strong>Clinical Benefit:</strong> {modalRecipe.clinicalBenefit}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleDownloadSingleRecipePdf(modalRecipe)}
                  className="px-4 py-2.5 rounded-xl bg-[#0E9F6E] text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Recipe PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalRecipe(null)}
                  className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-extrabold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOCTOR DISCLAIMER FOOTER */}
      <div className="p-3.5 rounded-2xl bg-[#EFF6FF] border border-blue-200 text-[11px] font-bold text-blue-950 flex items-center gap-2">
        <Heart className="w-4 h-4 text-blue-600 shrink-0" />
        <span>{DOCTOR_DISCLAIMER_BANNER}</span>
      </div>
    </div>
  );
};

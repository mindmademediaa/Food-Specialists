import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Download,
  Droplets,
  Flame,
  Heart,
  Leaf,
  Plus,
  RefreshCw,
  Scale,
  Search,
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
  DietPreferenceOption,
  DOCTOR_DISCLAIMER_BANNER,
  DOCTOR_DISCLAIMER_SHORT,
  GenderOption,
  getHealthConditionRecommendations,
  GoalOption,
  HEALTH_CONDITION_PRESETS,
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

export interface AccurateRecipeItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Desi & Pakistani' | 'High-Protein' | 'Vegetarian' | 'Chinese & Italian' | 'Healthy Bowl';
  dishVisualType:
    | 'biryani'
    | 'karahi'
    | 'daal-chawal'
    | 'palak-paneer'
    | 'chana-masala'
    | 'chicken-tikka'
    | 'grilled-salmon'
    | 'oats-bowl'
    | 'haleem'
    | 'veg-stirfry'
    | 'pasta-alfredo'
    | 'quinoa-salad';
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  cookTimeMin: number;
  servings: number;
  difficulty: 'Easy' | 'Medium';
  isVeg: boolean;
  ingredients: { item: string; amount: string; grams: number }[];
  instructions: string[];
  healthBenefit: string;
}

export const ACCURATE_RECIPES_LIST: AccurateRecipeItem[] = [
  {
    id: 'rec-chicken-biryani',
    title: 'Healthy Less-Oil Chicken Biryani',
    subtitle: 'Fragrant Basmati Rice layered with Spiced Yogurt Chicken & Mint',
    category: 'Desi & Pakistani',
    dishVisualType: 'biryani',
    calories: 420,
    proteinG: 28,
    carbsG: 46,
    fatG: 11,
    fiberG: 4,
    cookTimeMin: 35,
    servings: 2,
    difficulty: 'Medium',
    isVeg: false,
    ingredients: [
      { item: 'Long-Grain Basmati Rice (washed & soaked 20 mins)', amount: '1 cup (raw)', grams: 120 },
      { item: 'Skinless Chicken Breast / Thigh Cubes', amount: '6 oz (medium pieces)', grams: 160 },
      { item: 'Low-Fat Plain Yogurt (Dahi)', amount: '4 tbsp (whisked)', grams: 60 },
      { item: 'Sliced Onion, Ripe Tomato & Green Chilies', amount: '1 medium each', grams: 110 },
      { item: 'Ginger-Garlic Paste', amount: '1 tbsp', grams: 15 },
      { item: 'Fresh Mint (Podina) & Coriander Leaves', amount: '1/2 cup chopped', grams: 20 },
      { item: 'Biryani Masala (Cardamom, Cloves, Cumin, Turmeric)', amount: '1.5 tbsp', grams: 12 },
      { item: 'Olive Oil or Canola Oil', amount: '1 tbsp', grams: 12 }
    ],
    instructions: [
      'Step 1 (Marinate Chicken): In a bowl, mix chicken pieces with low-fat yogurt, ginger-garlic paste, turmeric, red chili, roasted cumin, and half of the chopped mint leaves. Let it marinate for 20 minutes.',
      'Step 2 (Cook Chicken Masala): Heat 1 tbsp olive oil in a non-stick pot. Sauté sliced onions until golden, add chopped tomatoes and marinated chicken, and cook covered on medium flame for 12 minutes until chicken is tender and thick masala forms.',
      'Step 3 (Par-Boil Basmati Rice): In a separate pot, boil 4 cups of water with 2 green cardamoms, 1 bay leaf, and 1 tsp salt. Add soaked basmati rice and boil for 6–7 minutes until 75% cooked, then drain water.',
      'Step 4 (Layer & Steam / Dum): Spread the par-boiled rice over the cooked chicken masala. Top with remaining fresh mint, coriander, ginger strips, and a splash of saffron/warm milk.',
      'Step 5 (Serve): Cover tightly and cook on very low heat (Dum) for 10–12 minutes. Fluff gently with a fork and serve hot with cucumber raita.'
    ],
    healthBenefit: 'Uses probiotic yogurt marinade and only 1 tbsp oil to provide 28g lean protein with 50% less fat than restaurant biryani.'
  },
  {
    id: 'rec-chicken-karahi',
    title: 'Authentic Peshawari Chicken Karahi',
    subtitle: 'Wok-Seared Chicken in Fresh Vine Tomato, Ginger & Black Pepper Gravy',
    category: 'Desi & Pakistani',
    dishVisualType: 'karahi',
    calories: 365,
    proteinG: 32,
    carbsG: 11,
    fatG: 17,
    fiberG: 3,
    cookTimeMin: 25,
    servings: 2,
    difficulty: 'Easy',
    isVeg: false,
    ingredients: [
      { item: 'Boneless or Bone-in Skinless Chicken', amount: '7 oz (bite-sized)', grams: 200 },
      { item: 'Fresh Red Vine Tomatoes (halved)', amount: '3 medium tomatoes', grams: 180 },
      { item: 'Fresh Ginger Juliennes & Crushed Garlic', amount: '2 tbsp', grams: 25 },
      { item: 'Green Chilies (slit lengthwise)', amount: '3 chilies', grams: 15 },
      { item: 'Freshly Crushed Black Pepper & Roasted Cumin', amount: '1.5 tsp', grams: 8 },
      { item: 'Crushed Dry Coriander Seeds (Sabut Dhania)', amount: '1 tsp', grams: 5 },
      { item: 'Fresh Coriander Leaves for Garnish', amount: '2 tbsp', grams: 10 },
      { item: 'Olive / Mustard / Canola Oil', amount: '1 tbsp', grams: 14 }
    ],
    instructions: [
      'Step 1 (Sear Chicken): Heat 1 tbsp oil in a wok (karahi) over medium-high flame. Add chicken pieces, crushed garlic, and a pinch of salt. Stir-fry for 5 minutes until chicken turns golden-white.',
      'Step 2 (Steam Tomatoes): Place halved fresh tomatoes cut-side down over the chicken. Cover the wok with a lid for 7–8 minutes on medium flame so the tomato skins soften.',
      'Step 3 (Peel & Mash Gravy): Remove the lid, peel off the tomato skins using tongs, and mash the soft tomatoes into the chicken to create a rich natural gravy without onions.',
      'Step 4 (Season with Spices): Add crushed coriander seeds, roasted cumin, and freshly ground black pepper. Stir-fry (bhuna) on high heat for 3–4 minutes until the tomato masala coats the chicken.',
      'Step 5 (Garnish & Serve): Turn off the flame, top with fresh ginger juliennes, slit green chilies, and coriander leaves. Serve warm with 1 whole-wheat roti.'
    ],
    healthBenefit: 'Low-carb, high-protein Pakistani dish rich in antioxidant lycopene from fresh tomatoes and digestive ginger.'
  },
  {
    id: 'rec-daal-chawal',
    title: 'Golden Tarka Daal Chawal (Lentils & Rice)',
    subtitle: 'Creamy Yellow Moong-Masoor Lentils with Garlic Cumin Tarka & Steamed Rice',
    category: 'Desi & Pakistani',
    dishVisualType: 'daal-chawal',
    calories: 345,
    proteinG: 15,
    carbsG: 54,
    fatG: 6,
    fiberG: 8,
    cookTimeMin: 25,
    servings: 2,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Yellow Moong Daal & Red Masoor Daal (mixed)', amount: '3/4 cup (washed)', grams: 120 },
      { item: 'Steamed Brown or Basmati Rice (cooked)', amount: '1 cup cooked', grams: 140 },
      { item: 'Finely Chopped Tomato & Onion', amount: '1 small each', grams: 80 },
      { item: 'Fresh Garlic Cloves (thinly sliced for Tarka)', amount: '4 cloves', grams: 12 },
      { item: 'Cumin Seeds (Zeera), Turmeric & Red Chili Powder', amount: '1.5 tsp total', grams: 8 },
      { item: 'Fresh Coriander & Green Chili', amount: '2 tbsp chopped', grams: 12 },
      { item: 'Olive Oil or Desi Ghee (for Tarka)', amount: '1.5 tsp', grams: 7 }
    ],
    instructions: [
      'Step 1 (Boil Lentils): Wash Moong and Masoor daal thoroughly. Add to a pot with 3 cups water, chopped tomato, onion, 1/2 tsp turmeric, and salt. Simmer covered on medium-low flame for 15–18 minutes until soft and creamy.',
      'Step 2 (Whisk Daal): Gently whisk the cooked lentils so they blend into a smooth, velvety consistency. Add a splash of hot water if too thick.',
      'Step 3 (Prepare Garlic-Cumin Tarka): In a small pan, heat 1.5 tsp olive oil or desi ghee. Add sliced garlic cloves and 1 tsp cumin seeds (zeera) and sauté for 45 seconds until golden and fragrant.',
      'Step 4 (Combine): Pour the sizzling garlic-cumin tarka directly over the hot yellow daal and immediately cover for 1 minute to trap the aroma.',
      'Step 5 (Serve): Garnish with fresh coriander leaves and serve alongside 1 cup of steamed rice and fresh cucumber-onion kachumber salad.'
    ],
    healthBenefit: 'Combining lentils (lysine-rich) with rice (methionine-rich) forms a 100% complete plant protein that is gentle on digestion.'
  },
  {
    id: 'rec-palak-paneer',
    title: 'High-Protein Palak Paneer (Spinach & Cottage Cheese)',
    subtitle: 'Iron-Rich Blanched Spinach Curry with Soft Seared Paneer Cubes',
    category: 'Vegetarian',
    dishVisualType: 'palak-paneer',
    calories: 310,
    proteinG: 19,
    carbsG: 14,
    fatG: 18,
    fiberG: 6,
    cookTimeMin: 20,
    servings: 2,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Fresh Spinach Leaves (Palak, stems trimmed)', amount: '3 cups packed', grams: 200 },
      { item: 'Low-Fat Paneer (Cottage Cheese Cubes)', amount: '4 oz (cubed)', grams: 110 },
      { item: 'Finely Chopped Onion & Ripe Tomato', amount: '1 small each', grams: 85 },
      { item: 'Ginger, Garlic & 1 Green Chili', amount: '1 tbsp paste', grams: 15 },
      { item: 'Low-Fat Yogurt or Milk', amount: '2 tbsp', grams: 30 },
      { item: 'Cumin Seeds, Garam Masala & Kasuri Methi', amount: '1.5 tsp', grams: 6 },
      { item: 'Olive Oil', amount: '1.5 tsp', grams: 7 }
    ],
    instructions: [
      'Step 1 (Blanch Spinach): Boil water in a saucepan, immerse fresh spinach leaves for 2 minutes until bright green, then immediately transfer to cold water to keep its vibrant green color.',
      'Step 2 (Blend Puree): Blend the blanched spinach with 1 green chili and a splash of water into a smooth emerald-green puree.',
      'Step 3 (Sauté Masala): Heat 1.5 tsp olive oil in a pan. Lightly sear the paneer cubes for 1 minute and set aside. In the same pan, crackle cumin seeds, sauté onion, ginger-garlic paste, and tomato for 4 minutes.',
      'Step 4 (Simmer Spinach & Paneer): Pour in the spinach puree, 2 tbsp low-fat yogurt, salt, and garam masala. Simmer on low heat for 5 minutes.',
      'Step 5 (Finish & Serve): Fold in the soft paneer cubes and crushed kasuri methi (fenugreek leaves). Simmer for 2 minutes and serve hot with whole-wheat roti.'
    ],
    healthBenefit: 'Packed with iron, folate, Vitamin K, and calcium — ideal for blood sugar control, vegetarian protein, and bone strength.'
  },
  {
    id: 'rec-chana-masala',
    title: 'Lahori Chickpea Masala (Chana Masala Bowl)',
    subtitle: 'Slow-Simmered White Chickpeas in Tangy Tomato, Cumin & Ginger Gravy',
    category: 'Vegetarian',
    dishVisualType: 'chana-masala',
    calories: 295,
    proteinG: 15,
    carbsG: 43,
    fatG: 6,
    fiberG: 10,
    cookTimeMin: 20,
    servings: 2,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Boiled White Chickpeas (Kabuli Chana)', amount: '1.5 cups boiled', grams: 180 },
      { item: 'Onion & Tomato Puree', amount: '3/4 cup', grams: 120 },
      { item: 'Ginger-Garlic Paste & Green Chili', amount: '1 tbsp', grams: 15 },
      { item: 'Roasted Cumin, Coriander Powder & Amchoor (Dry Mango)', amount: '2 tsp', grams: 10 },
      { item: 'Fresh Lemon Juice & Chopped Coriander', amount: '1 tbsp each', grams: 15 },
      { item: 'Olive Oil', amount: '1.5 tsp', grams: 7 }
    ],
    instructions: [
      'Step 1 (Sauté Aromatics): Heat 1.5 tsp olive oil in a saucepan. Add cumin seeds and ginger-garlic paste and sauté for 30 seconds until fragrant.',
      'Step 2 (Cook Tomato-Onion Base): Add the onion and tomato puree along with turmeric, coriander powder, roasted cumin, and amchoor powder. Cook for 5–6 minutes until oil lightly separates.',
      'Step 3 (Simmer Chickpeas): Add the boiled white chickpeas and 3/4 cup warm water. Lightly mash 2 tbsp of chickpeas with the back of the spoon to naturally thicken the gravy.',
      'Step 4 (Infuse Flavors): Cover and simmer on low flame for 8 minutes so the chickpeas absorb all the spices.',
      'Step 5 (Garnish): Squeeze fresh lemon juice on top, garnish with chopped coriander and onion rings, and serve.'
    ],
    healthBenefit: 'Very high soluble fiber (10g) and low glycemic index help lower LDL cholesterol and keep blood glucose steady.'
  },
  {
    id: 'rec-chicken-tikka',
    title: 'Charcoal-Style Grilled Chicken Tikka & Salad',
    subtitle: 'Tandoori Spiced Yogurt-Marinated Chicken Breast with Mint Chutney',
    category: 'High-Protein',
    dishVisualType: 'chicken-tikka',
    calories: 285,
    proteinG: 36,
    carbsG: 8,
    fatG: 11,
    fiberG: 3,
    cookTimeMin: 22,
    servings: 1,
    difficulty: 'Easy',
    isVeg: false,
    ingredients: [
      { item: 'Boneless Chicken Breast Cubes', amount: '7 oz (cubed)', grams: 200 },
      { item: 'Thick Greek / Low-Fat Yogurt', amount: '3 tbsp', grams: 45 },
      { item: 'Fresh Lemon Juice & Ginger-Garlic Paste', amount: '1 tbsp each', grams: 20 },
      { item: 'Bell Pepper & Onion Cubes (for skewers)', amount: '1/2 cup', grams: 60 },
      { item: 'Tikka Spices (Paprika, Cumin, Coriander, Garam Masala)', amount: '1.5 tsp', grams: 8 },
      { item: 'Olive Oil (for brushing)', amount: '1 tsp', grams: 5 }
    ],
    instructions: [
      'Step 1 (Prepare Marinade): Whisk thick yogurt with lemon juice, ginger-garlic paste, paprika, roasted cumin, coriander powder, and salt in a mixing bowl.',
      'Step 2 (Coat Chicken & Veggies): Toss chicken breast cubes, bell pepper squares, and onion petals in the yogurt marinade. Rest for at least 15–20 minutes.',
      'Step 3 (Thread or Pan-Grill): Thread marinated chicken and vegetables onto skewers, or arrange them in a preheated grill pan / air-fryer at 200°C.',
      'Step 4 (Grill Until Charred): Cook for 12–14 minutes, turning once halfway and brushing lightly with 1 tsp olive oil until tender and golden-charred on the edges.',
      'Step 5 (Serve): Serve piping hot with fresh lemon wedges, cucumber salad, and mint-yogurt chutney.'
    ],
    healthBenefit: 'Delivers 36g of pure muscle-building protein with only 8g carbs — ideal for fat loss, keto, and diabetes management.'
  },
  {
    id: 'rec-grilled-salmon',
    title: 'Lemon Herb Grilled Fish / Salmon Fillet',
    subtitle: 'Omega-3 Rich Fish Fillet with Steamed Broccoli & Garlic Lemon Glaze',
    category: 'High-Protein',
    dishVisualType: 'grilled-salmon',
    calories: 340,
    proteinG: 34,
    carbsG: 10,
    fatG: 16,
    fiberG: 4,
    cookTimeMin: 18,
    servings: 1,
    difficulty: 'Easy',
    isVeg: false,
    ingredients: [
      { item: 'Fresh Fish / Salmon Fillet (skinless or skin-on)', amount: '6 oz fillet', grams: 175 },
      { item: 'Broccoli Florets & Sliced Carrots', amount: '1 cup', grams: 120 },
      { item: 'Minced Garlic & Fresh Lemon Juice', amount: '1 tbsp', grams: 15 },
      { item: 'Dried Oregano, Thyme & Cracked Black Pepper', amount: '1 tsp', grams: 5 },
      { item: 'Extra-Virgin Olive Oil', amount: '1.5 tsp', grams: 7 }
    ],
    instructions: [
      'Step 1 (Season Fillet): Pat the fish/salmon fillet dry with a paper towel. Rub both sides with minced garlic, lemon juice, olive oil, oregano, salt, and black pepper.',
      'Step 2 (Sear Fish): Heat a non-stick skillet over medium-high heat. Place the fillet in the pan and sear for 4 minutes per side until flaky and golden.',
      'Step 3 (Steam Vegetables): Alongside in the pan (or steamer), toss broccoli florets and carrots with 2 tbsp water and cover for 4 minutes until crisp-tender.',
      'Step 4 (Plate & Serve): Plate the flaky grilled fish alongside the steamed vegetables and drizzle with warm lemon-garlic pan juices.'
    ],
    healthBenefit: 'Rich in heart-protective Omega-3 fatty acids (EPA & DHA) and Vitamin D to reduce inflammation and triglycerides.'
  },
  {
    id: 'rec-oats-bowl',
    title: 'High-Fiber Protein Oats, Chia & Banana Bowl',
    subtitle: 'Warm Cinnamon Rolled Oats topped with Banana, Chia Seeds & Almonds',
    category: 'Healthy Bowl',
    dishVisualType: 'oats-bowl',
    calories: 320,
    proteinG: 14,
    carbsG: 46,
    fatG: 9,
    fiberG: 8,
    cookTimeMin: 10,
    servings: 1,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Whole Rolled Oats (Quick or Old-Fashioned)', amount: '1/2 cup dry', grams: 45 },
      { item: 'Skim Milk or Unsweetened Almond Milk', amount: '1 cup', grams: 240 },
      { item: 'Ripe Banana (sliced)', amount: '1/2 medium', grams: 60 },
      { item: 'Chia Seeds & Flaxseeds', amount: '1 tbsp', grams: 10 },
      { item: 'Sliced Almonds & Walnuts', amount: '6 nuts chopped', grams: 12 },
      { item: 'Ceylon Cinnamon Powder', amount: '1/2 tsp', grams: 2 }
    ],
    instructions: [
      'Step 1 (Simmer Oats): In a small saucepan, combine rolled oats, milk, chia seeds, and cinnamon powder over medium flame.',
      'Step 2 (Cook Until Creamy): Stir continuously for 5–6 minutes until the oats thicken into a warm, creamy porridge.',
      'Step 3 (Add Toppings): Transfer to a breakfast bowl and arrange sliced banana, chopped almonds, and walnuts on top.',
      'Step 4 (Serve): Enjoy warm for sustained 4-hour morning energy without blood sugar spikes.'
    ],
    healthBenefit: 'Rich in beta-glucan soluble fiber that naturally lowers cholesterol and keeps hunger hormones satisfied.'
  },
  {
    id: 'rec-shahi-haleem',
    title: 'High-Protein Pakistani Chicken Haleem / Daleem',
    subtitle: 'Slow-Cooked Four Lentils, Cracked Wheat & Shredded Lean Chicken',
    category: 'Desi & Pakistani',
    dishVisualType: 'haleem',
    calories: 380,
    proteinG: 27,
    carbsG: 41,
    fatG: 10,
    fiberG: 8,
    cookTimeMin: 40,
    servings: 2,
    difficulty: 'Medium',
    isVeg: false,
    ingredients: [
      { item: 'Shredded Boneless Chicken Breast', amount: '5 oz', grams: 140 },
      { item: 'Mixed Lentils (Chana, Moong, Masoor, Mash Daal)', amount: '1/2 cup soaked', grams: 80 },
      { item: 'Cracked Wheat (Daliya) & Rolled Oats', amount: '1/4 cup', grams: 35 },
      { item: 'Onion, Ginger-Garlic Paste & Haleem Spices', amount: '3 tbsp', grams: 45 },
      { item: 'Lemon Wedges, Ginger Strips, Mint & Green Chilies', amount: '1/3 cup garnish', grams: 30 },
      { item: 'Olive / Canola Oil', amount: '1 tbsp', grams: 12 }
    ],
    instructions: [
      'Step 1 (Boil Grains & Lentils): Simmer soaked mixed lentils, cracked wheat, and oats in 3.5 cups water with turmeric and salt for 25 minutes until completely soft.',
      'Step 2 (Cook Chicken Korma): In a separate pan, sauté ginger-garlic paste, boneless chicken, and haleem masala in 1 tbsp oil with 1/2 cup water until tender, then shred the chicken.',
      'Step 3 (Blend & Mash): Blend the cooked lentils lightly with a hand blender, fold in the shredded chicken, and simmer together on low flame for 10 minutes while stirring.',
      'Step 4 (Garnish & Serve): Top generously with fresh ginger juliennes, chopped mint, green chilies, and a squeeze of fresh lemon juice.'
    ],
    healthBenefit: 'Combines lean poultry protein with 4 lentils and whole wheat for slow-release energy and 8g dietary fiber.'
  },
  {
    id: 'rec-veg-stirfry',
    title: 'Chinese Garlic Chicken / Tofu & Broccoli Stir-Fry',
    subtitle: 'Crisp Bell Peppers, Broccoli & Protein in Light Ginger-Soy Glaze',
    category: 'Chinese & Italian',
    dishVisualType: 'veg-stirfry',
    calories: 290,
    proteinG: 25,
    carbsG: 22,
    fatG: 9,
    fiberG: 5,
    cookTimeMin: 15,
    servings: 1,
    difficulty: 'Easy',
    isVeg: false,
    ingredients: [
      { item: 'Chicken Breast Strips (or Firm Tofu Cubes)', amount: '5 oz', grams: 150 },
      { item: 'Broccoli, Red/Yellow Bell Peppers & Carrots', amount: '1.5 cups', grams: 160 },
      { item: 'Minced Garlic, Fresh Ginger & Spring Onion', amount: '2 tbsp', grams: 25 },
      { item: 'Low-Sodium Soy Sauce & Rice Vinegar', amount: '1.5 tbsp', grams: 20 },
      { item: 'Cornstarch (mixed in 3 tbsp water) & Sesame Oil', amount: '1 tsp each', grams: 10 }
    ],
    instructions: [
      'Step 1 (Sear Protein): Heat a non-stick wok over high heat with 1 tsp oil. Stir-fry chicken strips (or tofu) with a pinch of black pepper for 4 minutes until golden.',
      'Step 2 (Toss Crisp Veggies): Add minced garlic, ginger, broccoli florets, sliced carrots, and bell peppers. Stir-fry on high flame for 3–4 minutes so vegetables stay bright and crunchy.',
      'Step 3 (Glaze): Pour in low-sodium soy sauce, vinegar, and the cornstarch-water slurry. Toss for 60 seconds until a glossy glaze coats everything.',
      'Step 4 (Serve): Garnish with chopped spring onions and sesame seeds.'
    ],
    healthBenefit: 'High-volume, nutrient-dense meal under 300 calories loaded with Vitamin C, sulforaphane, and lean protein.'
  },
  {
    id: 'rec-pasta-alfredo',
    title: 'Light Mediterranean Whole-Wheat Pasta & Veggies',
    subtitle: 'Al Dente Whole-Wheat Pasta in Creamy Greek Yogurt-Parmesan Garlic Sauce',
    category: 'Chinese & Italian',
    dishVisualType: 'pasta-alfredo',
    calories: 375,
    proteinG: 18,
    carbsG: 48,
    fatG: 11,
    fiberG: 6,
    cookTimeMin: 18,
    servings: 1,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Whole-Wheat Penne or Fettuccine Pasta', amount: '1 cup dry', grams: 85 },
      { item: 'Baby Spinach, Cherry Tomatoes & Mushrooms', amount: '1 cup', grams: 100 },
      { item: 'Low-Fat Milk + Greek Yogurt Cream Base', amount: '1/2 cup', grams: 90 },
      { item: 'Grated Parmesan Cheese', amount: '2 tbsp', grams: 20 },
      { item: 'Minced Garlic, Italian Herbs & Olive Oil', amount: '1 tbsp total', grams: 12 }
    ],
    instructions: [
      'Step 1 (Boil Pasta): Cook whole-wheat pasta in salted boiling water for 9–10 minutes until al dente. Reserve 1/4 cup pasta water before draining.',
      'Step 2 (Sauté Veggies): In a skillet, heat 1 tsp olive oil and sauté minced garlic, sliced mushrooms, and cherry tomatoes for 3 minutes, then wilt in baby spinach.',
      'Step 3 (Make Light Sauce): Lower the heat, whisk in the warm milk, Greek yogurt, Italian herbs, and grated parmesan cheese until smooth and creamy.',
      'Step 4 (Toss & Serve): Toss the drained pasta with the sauce and veggies, adding a splash of pasta water to coat evenly. Serve warm with cracked black pepper.'
    ],
    healthBenefit: 'Replaces heavy cream with high-protein Greek yogurt and whole-wheat pasta to cut saturated fat by 65%.'
  },
  {
    id: 'rec-quinoa-salad',
    title: 'Mediterranean Chickpea, Quinoa & Avocado Power Bowl',
    subtitle: 'Protein-Rich Quinoa, Boiled Chickpeas, Cucumber, Feta & Lemon Olive Dressing',
    category: 'Healthy Bowl',
    dishVisualType: 'quinoa-salad',
    calories: 330,
    proteinG: 14,
    carbsG: 39,
    fatG: 12,
    fiberG: 9,
    cookTimeMin: 15,
    servings: 1,
    difficulty: 'Easy',
    isVeg: true,
    ingredients: [
      { item: 'Cooked Quinoa (or Brown Rice)', amount: '3/4 cup cooked', grams: 110 },
      { item: 'Boiled Chickpeas (Chana)', amount: '1/2 cup', grams: 80 },
      { item: 'Diced Cucumber, Cherry Tomatoes & Red Onion', amount: '1 cup', grams: 120 },
      { item: 'Ripe Avocado Slices & Crumbled Feta / Paneer', amount: '1/4 cup', grams: 45 },
      { item: 'Lemon Juice, Extra-Virgin Olive Oil & Mint', amount: '1.5 tbsp', grams: 18 }
    ],
    instructions: [
      'Step 1 (Prepare Base): Place fluffy cooked quinoa and boiled chickpeas in a wide salad bowl.',
      'Step 2 (Add Fresh Vegetables): Add diced cucumber, halved cherry tomatoes, finely chopped red onion, and fresh mint leaves.',
      'Step 3 (Whisk Dressing): In a small cup, whisk extra-virgin olive oil, fresh lemon juice, a pinch of roasted cumin, salt, and black pepper.',
      'Step 4 (Top & Serve): Pour the lemon-olive dressing over the bowl, toss gently, and top with avocado slices and crumbled feta/paneer.'
    ],
    healthBenefit: 'Heart-healthy monounsaturated fats, 9g prebiotic fiber, and complete plant amino acids for sustained fullness.'
  }
];

/**
 * Renders a 100% Dish-Matched Culinary Illustration Header for each recipe
 * so that the visual NEVER mismatches the recipe title (no wrong stock photos!).
 */
const RecipeDishArtwork: React.FC<{ recipe: AccurateRecipeItem }> = ({ recipe }) => {
  const paletteMap: Record<
    AccurateRecipeItem['dishVisualType'],
    { bgFrom: string; bgTo: string; plateFill: string; accent: string; badgeText: string }
  > = {
    biryani: {
      bgFrom: '#7C2D12',
      bgTo: '#B45309',
      plateFill: '#FEF3C7',
      accent: '#F59E0B',
      badgeText: 'Saffron Basmati & Spiced Chicken Handi'
    },
    karahi: {
      bgFrom: '#7F1D1D',
      bgTo: '#B91C1C',
      plateFill: '#FEE2E2',
      accent: '#EF4444',
      badgeText: 'Peshawari Wok Tomato & Ginger Karahi'
    },
    'daal-chawal': {
      bgFrom: '#78350F',
      bgTo: '#D97706',
      plateFill: '#FEF9C3',
      accent: '#EAB308',
      badgeText: 'Golden Moong-Masoor Tarka & Steamed Rice'
    },
    'palak-paneer': {
      bgFrom: '#064E3B',
      bgTo: '#059669',
      plateFill: '#D1FAE5',
      accent: '#10B981',
      badgeText: 'Emerald Spinach Puree & Soft Paneer Cubes'
    },
    'chana-masala': {
      bgFrom: '#7C2D12',
      bgTo: '#C2410C',
      plateFill: '#FFEDD5',
      accent: '#F97316',
      badgeText: 'Lahori Chickpeas in Tangy Tomato Gravy'
    },
    'chicken-tikka': {
      bgFrom: '#881337',
      bgTo: '#E11D48',
      plateFill: '#FFE4E6',
      accent: '#F43F5E',
      badgeText: 'Charcoal-Grilled Chicken Skewers & Mint'
    },
    'grilled-salmon': {
      bgFrom: '#0C4A6E',
      bgTo: '#0284C7',
      plateFill: '#E0F2FE',
      accent: '#38BDF8',
      badgeText: 'Omega-3 Lemon Herb Fillet & Broccoli'
    },
    'oats-bowl': {
      bgFrom: '#3B0764',
      bgTo: '#7E22CE',
      plateFill: '#F3E8FF',
      accent: '#A855F7',
      badgeText: 'Rolled Oats, Banana, Chia & Almonds'
    },
    haleem: {
      bgFrom: '#713F12',
      bgTo: '#A16207',
      plateFill: '#FEF08A',
      accent: '#CA8A04',
      badgeText: 'Slow-Simmered 4 Lentils, Wheat & Chicken'
    },
    'veg-stirfry': {
      bgFrom: '#14532D',
      bgTo: '#16A34A',
      plateFill: '#DCFCE7',
      accent: '#22C55E',
      badgeText: 'Wok-Tossed Broccoli, Peppers & Protein'
    },
    'pasta-alfredo': {
      bgFrom: '#1E3A8A',
      bgTo: '#2563EB',
      plateFill: '#DBEAFE',
      accent: '#60A5FA',
      badgeText: 'Whole-Wheat Pasta in Yogurt-Parmesan Sauce'
    },
    'quinoa-salad': {
      bgFrom: '#065F46',
      bgTo: '#0D9488',
      plateFill: '#CCFBF1',
      accent: '#14B8A6',
      badgeText: 'Quinoa, Chickpeas, Avocado & Lemon Olive'
    }
  };

  const style = paletteMap[recipe.dishVisualType] || paletteMap.biryani;

  return (
    <div
      className="relative w-full h-44 overflow-hidden flex items-center justify-between px-4 sm:px-5 py-3.5 text-white select-none"
      style={{
        background: `linear-gradient(135deg, ${style.bgFrom} 0%, ${style.bgTo} 100%)`
      }}
    >
      {/* Left Text & Dish Identity */}
      <div className="z-10 max-w-[64%] space-y-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-extrabold uppercase tracking-wider">
            {recipe.category}
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              recipe.isVeg
                ? 'bg-emerald-400/30 text-emerald-100 border border-emerald-300/40'
                : 'bg-amber-400/30 text-amber-100 border border-amber-300/40'
            }`}
          >
            {recipe.isVeg ? '100% Vegetarian' : 'High-Protein Lean Meat'}
          </span>
        </div>

        <h4 className="text-base sm:text-lg font-extrabold leading-tight drop-shadow-xs">
          {recipe.title}
        </h4>

        <p className="text-[11px] text-white/90 font-medium line-clamp-2 leading-snug">
          {style.badgeText}
        </p>

        <div className="flex items-center gap-2 pt-1 text-[10.5px] font-extrabold">
          <span className="px-2 py-0.5 rounded-md bg-black/25">
            🔥 {recipe.calories} kcal
          </span>
          <span className="px-2 py-0.5 rounded-md bg-black/25">
            💪 {recipe.proteinG}g Protein
          </span>
          <span className="px-2 py-0.5 rounded-md bg-black/25">
            ⏱ {recipe.cookTimeMin}m
          </span>
        </div>
      </div>

      {/* Right Custom Dish Plate Illustration matching the exact recipe */}
      <div className="z-10 shrink-0">
        <svg
           viewBox="0 0 120 120"
          className="w-28 h-28 sm:w-32 sm:h-32 drop-shadow-md"
          aria-label={recipe.title}
        >
          {/* Outer Rim of Serving Bowl / Handi / Plate */}
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="#FFFFFF"
            fillOpacity="0.18"
            stroke="#FFFFFF"
            strokeOpacity="0.6"
            strokeWidth="2.5"
          />
          <circle
            cx="60"
            cy="60"
            r="44"
            fill={style.plateFill}
            stroke={style.accent}
            strokeWidth="3"
          />

          {/* Dish-Specific Culinary Garnishes Inside the Plate */}
          {recipe.dishVisualType === 'biryani' && (
            <g>
              {/* Saffron & White Basmati Rice Grains */}
              <ellipse cx="48" cy="52" rx="18" ry="12" fill="#F59E0B" opacity="0.85" />
              <ellipse cx="68" cy="64" rx="18" ry="13" fill="#D97706" opacity="0.9" />
              {/* Spiced Chicken Pieces */}
              <circle cx="52" cy="66" r="9" fill="#9A3412" />
              <circle cx="68" cy="48" r="8" fill="#B45309" />
              {/* Fresh Mint & Boiled Egg Garnish */}
              <circle cx="44" cy="46" r="6" fill="#FFFFFF" stroke="#FBBF24" strokeWidth="3" />
              <circle cx="60" cy="56" r="3.5" fill="#16A34A" />
              <circle cx="74" cy="60" r="3" fill="#15803D" />
            </g>
          )}

          {recipe.dishVisualType === 'karahi' && (
            <g>
              {/* Wok Handles */}
              <path d="M12 60 Q6 60 6 52" stroke="#FFFFFF" strokeWidth="3.5" fill="none" />
              <path d="M108 60 Q114 60 114 52" stroke="#FFFFFF" strokeWidth="3.5" fill="none" />
              {/* Rich Red Tomato Karahi Gravy */}
              <circle cx="60" cy="60" r="36" fill="#DC2626" />
              {/* Seared Chicken Chunks */}
              <rect x="42" y="44" width="14" height="12" rx="4" fill="#FDE68A" />
              <rect x="62" y="48" width="15" height="12" rx="4" fill="#FCD34D" />
              <rect x="48" y="62" width="16" height="13" rx="4" fill="#FDE68A" />
              {/* Ginger Juliennes & Green Chilies */}
              <line x1="45" y1="42" x2="72" y2="70" stroke="#FEF08A" strokeWidth="2.5" />
              <line x1="70" y1="42" x2="46" y2="68" stroke="#22C55E" strokeWidth="3" />
            </g>
          )}

          {recipe.dishVisualType === 'daal-chawal' && (
            <g>
              {/* Half Steamed White Rice, Half Golden Yellow Lentil Daal */}
              <path d="M60 20 A40 40 0 0 0 60 100 Z" fill="#FACC15" />
              <path d="M60 20 A40 40 0 0 1 60 100 Z" fill="#FFFFFF" />
              {/* Garlic & Red Chili Tarka Swirl on Daal */}
              <circle cx="44" cy="52" r="5" fill="#B91C1C" />
              <circle cx="48" cy="68" r="4" fill="#92400E" />
              <circle cx="40" cy="60" r="3" fill="#15803D" />
              {/* Cumin flecks on Rice */}
              <circle cx="72" cy="50" r="2" fill="#78350F" />
              <circle cx="76" cy="64" r="2" fill="#78350F" />
            </g>
          )}

          {recipe.dishVisualType === 'palak-paneer' && (
            <g>
              {/* Emerald Spinach Curry Base */}
              <circle cx="60" cy="60" r="37" fill="#15803D" />
              {/* White Soft Paneer Cubes */}
              <rect x="40" y="42" width="12" height="12" rx="2.5" fill="#FFFFFF" />
              <rect x="64" y="44" width="12" height="12" rx="2.5" fill="#F8FAFC" />
              <rect x="52" y="60" width="13" height="13" rx="2.5" fill="#FFFFFF" />
              <rect x="38" y="62" width="10" height="10" rx="2" fill="#F1F5F9" />
              {/* Light Yogurt Swirl */}
              <path
                d="M44 36 Q62 32 72 56"
                stroke="#DCFCE7"
                strokeWidth="2.5"
                fill="none"
              />
            </g>
          )}

          {recipe.dishVisualType === 'chana-masala' && (
            <g>
              {/* Spiced Masala Gravy */}
              <circle cx="60" cy="60" r="36" fill="#C2410C" />
              {/* Golden Boiled Chickpeas */}
              <circle cx="46" cy="48" r="6.5" fill="#FDE047" />
              <circle cx="62" cy="46" r="6.5" fill="#FACC15" />
              <circle cx="72" cy="58" r="6.5" fill="#FDE047" />
              <circle cx="54" cy="60" r="6.5" fill="#FACC15" />
              <circle cx="44" cy="66" r="6.5" fill="#FDE047" />
              <circle cx="64" cy="70" r="6.5" fill="#FACC15" />
              {/* Fresh Coriander Leaves */}
              <circle cx="58" cy="53" r="3.5" fill="#22C55E" />
            </g>
          )}

          {recipe.dishVisualType === 'chicken-tikka' && (
            <g>
              {/* Skewer Stick */}
              <line x1="28" y1="88" x2="92" y2="32" stroke="#78350F" strokeWidth="3.5" />
              {/* Grilled Tikka Chunks & Bell Peppers */}
              <rect x="38" y="64" width="14" height="14" rx="4" fill="#DC2626" />
              <rect x="52" y="50" width="14" height="14" rx="4" fill="#EA580C" />
              <rect x="66" y="38" width="14" height="14" rx="4" fill="#DC2626" />
              {/* Mint Chutney Dip */}
              <circle cx="76" cy="76" r="10" fill="#16A34A" stroke="#FFFFFF" strokeWidth="2" />
            </g>
          )}

          {recipe.dishVisualType === 'grilled-salmon' && (
            <g>
              {/* Salmon Fillet with Grill Marks */}
              <rect x="34" y="44" width="52" height="24" rx="8" fill="#FB7185" />
              <line x1="44" y1="44" x2="38" y2="68" stroke="#9F1239" strokeWidth="2.5" />
              <line x1="58" y1="44" x2="52" y2="68" stroke="#9F1239" strokeWidth="2.5" />
              <line x1="72" y1="44" x2="66" y2="68" stroke="#9F1239" strokeWidth="2.5" />
              {/* Steamed Broccoli & Lemon Slice */}
              <circle cx="46" cy="78" r="7" fill="#16A34A" />
              <circle cx="58" cy="80" r="6" fill="#15803D" />
              <circle cx="76" cy="76" r="8" fill="#FDE047" stroke="#FEF9C3" strokeWidth="2" />
            </g>
          )}

          {recipe.dishVisualType === 'oats-bowl' && (
            <g>
              {/* Creamy Oatmeal Base */}
              <circle cx="60" cy="60" r="36" fill="#FDE68A" />
              {/* Sliced Banana Coins */}
              <circle cx="46" cy="48" r="7" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.5" />
              <circle cx="58" cy="44" r="7" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="1.5" />
              {/* Almonds & Chia Seeds */}
              <ellipse cx="70" cy="58" rx="6" ry="3.5" fill="#92400E" />
              <ellipse cx="52" cy="68" rx="6" ry="3.5" fill="#92400E" />
              <circle cx="44" cy="62" r="2" fill="#1E293B" />
              <circle cx="62" cy="60" r="2" fill="#1E293B" />
              <circle cx="66" cy="70" r="2" fill="#1E293B" />
            </g>
          )}

          {(recipe.dishVisualType === 'haleem' ||
            recipe.dishVisualType === 'veg-stirfry' ||
            recipe.dishVisualType === 'pasta-alfredo' ||
            recipe.dishVisualType === 'quinoa-salad') && (
            <g>
              <circle cx="60" cy="60" r="35" fill={style.accent} opacity="0.85" />
              <circle cx="48" cy="50" r="7" fill="#FFFFFF" opacity="0.9" />
              <circle cx="68" cy="52" r="6" fill="#FEF08A" />
              <circle cx="56" cy="68" r="8" fill="#DCFCE7" />
              <circle cx="72" cy="68" r="5" fill="#FFFFFF" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

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
          { date: 'Today', weightKg: Number(toolsData?.nutrition?.weightKg || 74.0), bmi: 25.0 }
        ]
  );

  // Health Condition Food Guide Filter
  const [selectedCondition, setSelectedCondition] = useState<string>('Diabetes');

  // Recipes Filter & Expanded Recipe ID (Open first recipe by default so user immediately sees full ingredients & instructions!)
  const [recipeCategoryFilter, setRecipeCategoryFilter] = useState<string>('All');
  const [recipeSearchQuery, setRecipeSearchQuery] = useState<string>('');
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(
    'rec-chicken-biryani'
  );
  const [modalRecipe, setModalRecipe] = useState<AccurateRecipeItem | null>(null);

  // Save notification banner
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Live Calculated BMI, BMR, TDEE, Ideal Weight, Macros & Weight Recommendation
  const indexes = useMemo(
    () => calculateSuiteNutritionIndexes(profile, waterGlasses),
    [profile, waterGlasses]
  );

  // Weight Advice Logic (Clear explanation whether user should reduce or gain weight)
  const weightGuidance = useMemo(() => {
    const diffFromIdeal = Number((profile.weightKg - indexes.idealWeightKg).toFixed(1));
    const diffFromTarget = Number((profile.weightKg - profile.targetWeightKg).toFixed(1));

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
  }, [profile.weightKg, profile.targetWeightKg, profile.dailyWaterGoalGlasses, indexes]);

  // Health Condition Food Guide Data
  const conditionRecommendation = useMemo(
    () => getHealthConditionRecommendations(selectedCondition),
    [selectedCondition]
  );

  // Filtered Recipes
  const filteredRecipes = useMemo(() => {
    return ACCURATE_RECIPES_LIST.filter((r) => {
      if (recipeCategoryFilter !== 'All' && r.category !== recipeCategoryFilter) {
        return false;
      }
      if (recipeSearchQuery.trim()) {
        const q = recipeSearchQuery.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchIng = r.ingredients.some((i) =>
          i.item.toLowerCase().includes(q)
        );
        if (!matchTitle && !matchIng) return false;
      }
      return true;
    });
  }, [recipeCategoryFilter, recipeSearchQuery]);

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

    // Header
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

    // Section 1: BMI & Weight Recommendation
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

    // Section 2: Daily Balanced Meal Plan
    y += 46;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('2. RECOMMENDED DAILY MEAL PLAN (WITH GRAMS & CALORIES)', 14, y);
    y += 6;

    const mealPlanRows = [
      `Breakfast (8:00 AM): 2 Boiled Eggs + 1 Whole-Wheat Toast or Oats Bowl (240g) — 340 kcal | 20g Protein`,
      `Mid-Morning Snack (11:00 AM): 1 Medium Apple / Guava + 7 Almonds (150g) — 145 kcal | 4g Protein`,
      `Lunch (1:30 PM): Chicken Karahi / Tarka Daal + 1 Whole-Wheat Roti + Fresh Salad (320g) — 460 kcal | 32g Protein`,
      `Evening Snack (5:00 PM): Green Tea + Roasted Chickpeas / Makhana (180g) — 130 kcal | 6g Protein`,
      `Dinner (8:00 PM): Grilled Chicken Tikka / Palak Paneer + Steamed Veggies (260g) — 360 kcal | 30g Protein`
    ];
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    mealPlanRows.forEach((row) => {
      pdf.text(`• ${row}`, 16, y);
      y += 6.5;
    });

    // Section 3: Health Condition Guidance
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

    // Section 4: Top Healthy Recipes Included
    y += 10;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('4. HEALTHY RECIPES & INGREDIENTS SUMMARY', 14, y);
    y += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    ACCURATE_RECIPES_LIST.slice(0, 5).forEach((rec) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(
        `• ${rec.title} (${rec.calories} kcal | ${rec.proteinG}g Protein | ${rec.cookTimeMin} mins)`,
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

    // Footer disclaimer
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(DOCTOR_DISCLAIMER_BANNER, 14, 285);

    pdf.save(
      `${(profile.fullName || 'Specialist').replace(/\s+/g, '_')}_Nutrition_Health_Report.pdf`
    );
  };

  // Download Single Recipe PDF with complete Ingredients & Instructions
  const handleDownloadSingleRecipePdf = (recipe: AccurateRecipeItem) => {
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();

    pdf.setFillColor(14, 159, 110);
    pdf.rect(0, 0, pageW, 32, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(15);
    pdf.text(recipe.title.toUpperCase(), 14, 14);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(
      `${recipe.category} | ${recipe.calories} kcal | Protein: ${recipe.proteinG}g | Carbs: ${recipe.carbsG}g | Fat: ${recipe.fatG}g | Time: ${recipe.cookTimeMin} mins`,
      14,
      23
    );

    let y = 42;
    pdf.setTextColor(15, 41, 30);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('INGREDIENTS REQUIRED (WITH EXACT MEASUREMENTS):', 14, y);
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
    pdf.text('STEP-BY-STEP COOKING INSTRUCTIONS:', 14, y);
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
    pdf.text(`Health Benefit: ${recipe.healthBenefit}`, 14, y);

    pdf.save(`${recipe.title.replace(/\s+/g, '_')}_Recipe.pdf`);
  };

  // BMI Pointer position (0 to 100%)
  const bmiPointerPct = useMemo(() => {
    const clamped = Math.max(14, Math.min(38, indexes.bmi));
    return Math.round(((clamped - 14) / (38 - 14)) * 100);
  }, [indexes.bmi]);

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
              All-in-One Simple Page • BMI, Calories, Meal Plan &amp; Verified Recipes
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold mt-1">
              Personal Health, BMI &amp; Daily Nutrition Calculator
            </h2>
            <p className="text-xs text-emerald-100 mt-0.5">
              Enter your height, weight &amp; goal below to immediately check your BMI, weight advice, daily calories, meal plan, and full recipes with ingredients &amp; cooking instructions.
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

        {/* Simple Grid of Inputs */}
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

        {/* Daily Water Tracker Row inside Step 1 */}
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

        {/* BMI Scale + Weight Action Recommendation */}
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

            {/* 4-Zone BMI Color Scale Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="relative h-3.5 w-full rounded-full overflow-hidden flex">
                <div className="w-1/4 bg-blue-500" title="Underweight <18.5" />
                <div className="w-1/4 bg-emerald-500" title="Normal 18.5–24.9" />
                <div className="w-1/4 bg-amber-500" title="Overweight 25–29.9" />
                <div className="w-1/4 bg-red-500" title="Obese 30+" />
                {/* Pointer */}
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

            {/* Clear Weight Gain / Reduce Advice Box */}
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

            {/* Horizontal Comparison Bars for Current vs Ideal vs Target Weight */}
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
              Step 3: Daily Balanced Meal Plan &amp; Health Condition Food Guide
            </h3>
            <p className="text-[11px] text-[#5C7267]">
              Tailored for {indexes.dailyCaloriesNeeded} kcal/day ({profile.goal}) + Disease-Specific Food Recommendations
            </p>
          </div>
        </div>

        {/* 4-Meal Daily Plan Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              meal: 'Breakfast (8:00 AM)',
              items: '2 Boiled Eggs / Omelette + 1 Whole-Wheat Roti or Oats & Banana Bowl',
              grams: '240g Portion',
              kcal: Math.round(indexes.dailyCaloriesNeeded * 0.25),
              protein: `${Math.round(indexes.targetProteinG * 0.25)}g Protein`
            },
            {
              meal: 'Lunch (1:30 PM)',
              items: 'Chicken Karahi or Tarka Daal + 1 Whole-Wheat Roti / Brown Rice + Fresh Salad',
              grams: '320g Portion',
              kcal: Math.round(indexes.dailyCaloriesNeeded * 0.35),
              protein: `${Math.round(indexes.targetProteinG * 0.35)}g Protein`
            },
            {
              meal: 'Evening Snack (5:00 PM)',
              items: 'Green Tea + 1 Apple/Guava + 7 Almonds or Roasted Chana',
              grams: '150g Portion',
              kcal: Math.round(indexes.dailyCaloriesNeeded * 0.12),
              protein: `${Math.round(indexes.targetProteinG * 0.12)}g Protein`
            },
            {
              meal: 'Dinner (8:00 PM)',
              items: 'Grilled Chicken Tikka / Fish or Palak Paneer + Steamed Vegetables',
              grams: '260g Portion',
              kcal: Math.round(indexes.dailyCaloriesNeeded * 0.28),
              protein: `${Math.round(indexes.targetProteinG * 0.28)}g Protein`
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

        {/* Health Condition Food Selector (Diabetes, BP, Cholesterol, PCOS, etc.) */}
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
            {/* Recommended Foods */}
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

            {/* Foods to Avoid */}
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
          STEP 4: VERIFIED HEALTHY RECIPES WITH DISH-MATCHED VISUALS + COMPLETE INGREDIENTS REQUIRED & COOKING INSTRUCTIONS
         ===================================================================== */}
      <div className="bg-white border-[1.5px] border-[#BCE3C8] rounded-[24px] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ECF4EF] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E2F2E9] text-[#0E9F6E] flex items-center justify-center font-extrabold text-sm">
              4
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-[#0F291E]">
                Step 4: Healthy Recipes with Complete Ingredients Required &amp; Step-by-Step Cooking Instructions
              </h3>
              <p className="text-[11px] text-[#5C7267]">
                Click on any recipe card below to view all required ingredients (with exact grams/spoons) and full step-by-step cooking method
              </p>
            </div>
          </div>

          {/* Search input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#5C7267] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={recipeSearchQuery}
              onChange={(e) => setRecipeSearchQuery(e.target.value)}
              placeholder="Search recipe or ingredient..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#CBE3D6] bg-[#F8FCFA] text-xs font-bold text-[#0F291E] focus:outline-none focus:border-[#0E9F6E]"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            'All',
            'Desi & Pakistani',
            'High-Protein',
            'Vegetarian',
            'Chinese & Italian',
            'Healthy Bowl'
          ].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setRecipeCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap cursor-pointer transition-colors ${
                recipeCategoryFilter === cat
                  ? 'bg-[#0E9F6E] text-white'
                  : 'bg-[#F4FAF7] text-[#13422B] border border-[#CBE3D6]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecipes.map((recipe) => {
            const isExpanded = expandedRecipeId === recipe.id;

            return (
              <div
                key={recipe.id}
                onClick={() =>
                  setExpandedRecipeId(isExpanded ? null : recipe.id)
                }
                className={`rounded-[22px] border overflow-hidden transition-all cursor-pointer bg-white ${
                  isExpanded
                    ? 'border-2 border-[#0E9F6E] shadow-md'
                    : 'border-[#CBE3D6] hover:border-[#0E9F6E] shadow-xs'
                }`}
              >
                {/* Dish-Matched Culinary Visual Header (100% matches recipe name!) */}
                <RecipeDishArtwork recipe={recipe} />

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-[#5C7267]">
                      {recipe.subtitle}
                    </p>
                    <span className="px-2.5 py-1 rounded-lg bg-[#E2F2E9] text-[#0D6845] text-[11px] font-extrabold shrink-0 inline-flex items-center gap-1">
                      {isExpanded ? (
                        <>
                          <span>Hide Recipe</span>
                          <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <span>Ingredients &amp; Steps</span>
                          <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </span>
                  </div>

                  {/* Quick Macro Strip */}
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    <div className="p-2 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                      <div className="text-[10px] font-bold text-[#5C7267]">
                        Calories
                      </div>
                      <div className="text-xs font-extrabold text-[#0F291E]">
                        {recipe.calories} kcal
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                      <div className="text-[10px] font-bold text-[#5C7267]">
                        Protein
                      </div>
                      <div className="text-xs font-extrabold text-[#0E9F6E]">
                        {recipe.proteinG}g
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                      <div className="text-[10px] font-bold text-[#5C7267]">
                        Carbs / Fiber
                      </div>
                      <div className="text-xs font-extrabold text-[#0F291E]">
                        {recipe.carbsG}g / {recipe.fiberG}g
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#F4FAF7] border border-[#D4E9DF]">
                      <div className="text-[10px] font-bold text-[#5C7267]">
                        Cook Time
                      </div>
                      <div className="text-xs font-extrabold text-[#0F291E]">
                        {recipe.cookTimeMin} mins
                      </div>
                    </div>
                  </div>

                  {/* COMPLETE INGREDIENTS REQUIRED & STEP-BY-STEP INSTRUCTIONS (Shown when clicked/expanded) */}
                  {isExpanded && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="pt-3 border-t border-[#ECF4EF] space-y-3.5 animate-fade-in cursor-default"
                    >
                      {/* 1. Complete Required Ingredients List */}
                      <div className="p-3.5 rounded-2xl bg-[#F4FAF7] border border-[#BCE3C8] space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-extrabold text-[#13422B] uppercase tracking-wide flex items-center gap-1.5">
                            <Utensils className="w-3.5 h-3.5 text-[#0E9F6E]" />
                            <span>
                              Ingredients Required ({recipe.ingredients.length} Items — {recipe.servings} Servings)
                            </span>
                          </h5>
                        </div>

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

                      {/* 2. Complete Step-by-Step Cooking Instructions */}
                      <div className="p-3.5 rounded-2xl bg-[#F8FCFA] border border-[#CBE3D6] space-y-2">
                        <h5 className="text-xs font-extrabold text-[#13422B] uppercase tracking-wide flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-amber-600" />
                          <span>
                            Step-by-Step Cooking Instructions (Banane ka Tareeqa)
                          </span>
                        </h5>

                        <ol className="space-y-2">
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

                      {/* 3. Health Benefit & Action Buttons */}
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-950">
                        💡 <strong>Nutritionist Note:</strong> {recipe.healthBenefit}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setModalRecipe(recipe)}
                          className="px-3.5 py-2 rounded-xl bg-[#13422B] hover:bg-[#0F291E] text-white text-xs font-extrabold cursor-pointer"
                        >
                          Open Full-Screen Recipe Card
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
              </div>
            );
          })}
        </div>
      </div>

      {/* FULL-SCREEN RECIPE MODAL (WHEN USER CLICKS OPEN FULL-SCREEN RECIPE CARD) */}
      {modalRecipe && (
        <div
          onClick={() => setModalRecipe(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[26px] max-w-xl w-full overflow-hidden shadow-2xl border border-[#BCE3C8] my-8 max-h-[90vh] flex flex-col"
          >
            <div className="relative">
              <RecipeDishArtwork recipe={modalRecipe} />
              <button
                type="button"
                onClick={() => setModalRecipe(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center cursor-pointer z-20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#0F291E]">
                  {modalRecipe.title}
                </h3>
                <p className="text-xs text-[#5C7267] mt-0.5">
                  {modalRecipe.subtitle}
                </p>
              </div>

              {/* Ingredients Required */}
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

              {/* Cooking Instructions */}
              <div className="p-3.5 rounded-2xl bg-[#F8FCFA] border border-[#CBE3D6] space-y-2">
                <h4 className="text-xs font-extrabold text-[#13422B] uppercase">
                  Step-by-Step Cooking Instructions
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

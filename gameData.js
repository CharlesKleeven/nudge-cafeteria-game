export const FOOD_ITEMS = [
  {
    id: 'apple',
    name: 'Apple',
    healthValue: 95,
    emoji: '🍎',
    basePopularity: 40
  },
  {
    id: 'pizza',
    name: 'Pizza',
    healthValue: 25,
    emoji: '🍕',
    basePopularity: 85
  },
  {
    id: 'salad',
    name: 'Salad',
    healthValue: 100,
    emoji: '🥗',
    basePopularity: 25
  },
  {
    id: 'sandwich',
    name: 'Sandwich',
    healthValue: 60,
    emoji: '🥪',
    basePopularity: 70
  },
  {
    id: 'smoothie',
    name: 'Smoothie',
    healthValue: 90,
    emoji: '🥤',
    basePopularity: 35
  },
  {
    id: 'cookies',
    name: 'Cookies',
    healthValue: 5,
    emoji: '🍪',
    basePopularity: 95
  }
];

// Simple position multipliers - this is the core nudge concept
export const POSITION_MULTIPLIERS = [
  10.0, // 1st position: 900% boost
  5.0,  // 2nd position: 400% boost
  2.5,  // 3rd position: 150% boost
  1.0,  // 4th position: no change
  0.2,  // 5th position: 80% penalty
  0.02  // 6th position: 98% penalty
];

export const DEFAULT_FOOD_ORDER = [
  'pizza', 'cookies', 'sandwich', 'smoothie', 'apple', 'salad'
];

export const TARGET_HEALTH_SCORE = 90;
export const STUDENT_COUNT = 100;
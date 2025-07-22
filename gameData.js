// Expanded food pool with health-focused items
export const ALL_FOOD_ITEMS = [
  // Very Healthy (80-100)
  {
    id: 'salad',
    name: 'Salad',
    healthValue: 100,
    emoji: '🥗',
    basePopularity: 25
  },
  {
    id: 'apple',
    name: 'Apple',
    healthValue: 95,
    emoji: '🍎',
    basePopularity: 40
  },
  {
    id: 'smoothie',
    name: 'Smoothie',
    healthValue: 90,
    emoji: '🥤',
    basePopularity: 35
  },
  {
    id: 'falafel',
    name: 'Falafel',
    healthValue: 85,
    emoji: '🧆',
    basePopularity: 60
  },
  {
    id: 'yogurt',
    name: 'Yogurt',
    healthValue: 80,
    emoji: '🥛',
    basePopularity: 45
  },
  
  // Moderately Healthy (50-79)
  {
    id: 'soup',
    name: 'Soup',
    healthValue: 70,
    emoji: '🍲',
    basePopularity: 55
  },
  {
    id: 'sandwich',
    name: 'Sandwich',
    healthValue: 60,
    emoji: '🥪',
    basePopularity: 70
  },
  {
    id: 'wrap',
    name: 'Wrap',
    healthValue: 65,
    emoji: '🌯',
    basePopularity: 65
  },
  
  // Unhealthy (20-49)
  {
    id: 'burger',
    name: 'Burger',
    healthValue: 30,
    emoji: '🍔',
    basePopularity: 80
  },
  {
    id: 'pizza',
    name: 'Pizza',
    healthValue: 25,
    emoji: '🍕',
    basePopularity: 85
  },
  {
    id: 'chips',
    name: 'Chips',
    healthValue: 20,
    emoji: '🍟',
    basePopularity: 75
  },
  {
    id: 'soda',
    name: 'Soda',
    healthValue: 10,
    emoji: '🧃',
    basePopularity: 70
  },
  
  // Very Unhealthy (5-19)
  {
    id: 'candy',
    name: 'Candy',
    healthValue: 5,
    emoji: '🍬',
    basePopularity: 90
  },
  {
    id: 'cookies',
    name: 'Cookies',
    healthValue: 8,
    emoji: '🍪',
    basePopularity: 95
  },
  {
    id: 'donuts',
    name: 'Donuts',
    healthValue: 10,
    emoji: '🍩',
    basePopularity: 92
  },
  {
    id: 'energy_drink',
    name: 'Energy Drink',
    healthValue: 5,
    emoji: '⚡',
    basePopularity: 65
  }
];

// Position multipliers for different lineup sizes - this is the core nudge concept
export const POSITION_MULTIPLIERS = {
  3: [2.2, 1.0, 0.7],  // 3 items: moderate first position effect
  4: [2.0, 1.4, 1.0, 0.7],  // 4 items: graduated effects  
  5: [2.0, 1.5, 1.0, 0.8, 0.6]  // 5 items: more moderate range
};

// Helper function to get multipliers for current day lineup
export const getPositionMultipliers = (lineupLength) => {
  return POSITION_MULTIPLIERS[lineupLength] || POSITION_MULTIPLIERS[5];
};

// Initial starting lineup for 5-day challenge - balanced mix requiring strategy
// Health values: Pizza(25), Burger(30), Sandwich(60), Smoothie(90), Apple(95)
export const STARTING_FOOD_ORDER = ['pizza', 'burger', 'sandwich', 'smoothie', 'apple'];

export const TARGET_HEALTH_SCORE = 90;
export const STUDENT_COUNT = 100;
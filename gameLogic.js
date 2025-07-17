import { FOOD_ITEMS, POSITION_MULTIPLIERS, STUDENT_COUNT } from './gameData';

// Core nudge concept: Position dramatically influences choice
export const simulateChoices = (foodOrder) => {
  const results = foodOrder.map((foodId, position) => {
    const food = FOOD_ITEMS.find(f => f.id === foodId);
    
    // Apply position multiplier to base popularity
    const adjustedPopularity = food.basePopularity * POSITION_MULTIPLIERS[position];
    
    // Calculate how many students (out of 100) would choose this item
    const choiceRate = Math.min(100, Math.max(5, adjustedPopularity)) / 100;
    const studentsWhoChose = Math.round(STUDENT_COUNT * choiceRate);
    
    // Make the visual choice rates more dramatic for better UX
    let displayChoiceRate = Math.round(choiceRate * 100);
    if (position === 0) displayChoiceRate = Math.min(95, displayChoiceRate * 1.2); // First position gets visual boost
    if (position === 5) displayChoiceRate = Math.max(3, displayChoiceRate * 0.5); // Last position gets visual penalty
    
    return {
      foodId,
      position: position + 1,
      food,
      basePopularity: food.basePopularity,
      positionMultiplier: POSITION_MULTIPLIERS[position],
      adjustedPopularity: Math.round(adjustedPopularity),
      studentsWhoChose,
      choiceRate: displayChoiceRate
    };
  });
  
  return results;
};

export const calculateHealthScore = (results) => {
  let totalHealthPoints = 0;
  let totalChoices = 0;
  
  results.forEach(result => {
    totalHealthPoints += result.food.healthValue * result.studentsWhoChose;
    totalChoices += result.studentsWhoChose;
  });
  
  let baseScore = totalChoices > 0 ? Math.round(totalHealthPoints / totalChoices) : 0;
  
  // Enhance the dramatic effect - amplify differences from the middle (50)
  const middle = 50;
  const difference = baseScore - middle;
  const amplified = middle + (difference * 1.8); // 1.8x amplification
  
  // Clamp between 5 and 98 for dramatic range
  return Math.max(5, Math.min(98, Math.round(amplified)));
};

export const generateInsights = (results) => {
  const insights = [];
  
  // Find the biggest position effects
  const sortedByPosition = [...results].sort((a, b) => a.position - b.position);
  const first = sortedByPosition[0];
  const last = sortedByPosition[sortedByPosition.length - 1];
  
  insights.push({
    type: 'position_effect',
    text: `Position #1 (${first.food.name}) was chosen by ${first.choiceRate}% of students vs Position #6 (${last.food.name}) at ${last.choiceRate}%`,
    icon: '•'
  });
  
  // Find items that moved significantly
  const movedItems = results.filter(r => 
    Math.abs(r.adjustedPopularity - r.basePopularity) > 20
  );
  
  if (movedItems.length > 0) {
    const bestMove = movedItems.reduce((best, current) => 
      (current.adjustedPopularity - current.basePopularity) > 
      (best.adjustedPopularity - best.basePopularity) ? current : best
    );
    
    insights.push({
      type: 'placement_win',
      text: `${bestMove.food.name} got a ${Math.round(bestMove.positionMultiplier * 100 - 100)}% boost from being in position #${bestMove.position}`,
      icon: '•'
    });
  }
  
  return insights;
};

export const checkWinCondition = (healthScore, target) => {
  return healthScore >= target;
};

// Compare two arrangements to show nudge effect
export const compareArrangements = (oldOrder, newOrder) => {
  const oldResults = simulateChoices(oldOrder);
  const newResults = simulateChoices(newOrder);
  
  const oldHealth = calculateHealthScore(oldResults);
  const newHealth = calculateHealthScore(newResults);
  
  const changes = [];
  
  newOrder.forEach((foodId, newPos) => {
    const oldPos = oldOrder.indexOf(foodId);
    if (oldPos !== newPos) {
      const oldResult = oldResults[oldPos];
      const newResult = newResults[newPos];
      
      changes.push({
        foodId,
        food: FOOD_ITEMS.find(f => f.id === foodId),
        oldPosition: oldPos + 1,
        newPosition: newPos + 1,
        oldChoiceRate: oldResult.choiceRate,
        newChoiceRate: newResult.choiceRate,
        change: newResult.choiceRate - oldResult.choiceRate
      });
    }
  });
  
  return {
    oldHealth,
    newHealth,
    healthChange: newHealth - oldHealth,
    changes: changes.filter(c => Math.abs(c.change) > 5) // Only show significant changes
  };
};
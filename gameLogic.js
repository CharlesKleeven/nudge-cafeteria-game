import { ALL_FOOD_ITEMS, getPositionMultipliers, STUDENT_COUNT } from './gameData';

// Core nudge concept: Position dramatically influences choice
export const simulateChoices = (foodOrder, day = 0) => {
  const positionMultipliers = getPositionMultipliers(foodOrder.length);
  
  const results = foodOrder.map((foodId, position) => {
    const food = ALL_FOOD_ITEMS.find(f => f.id === foodId);
    
    // Apply position multiplier to base popularity
    const adjustedPopularity = food.basePopularity * positionMultipliers[position];
    
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
      positionMultiplier: positionMultipliers[position],
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

// Removed happiness score calculation - focusing only on health

export const generateInsights = (results, day = 0) => {
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
  
  // Health-focused insight
  const healthyItems = results.filter(r => r.food.healthValue >= 70);
  const unhealthyItems = results.filter(r => r.food.healthValue < 30);
  
  if (healthyItems.length > 0 && unhealthyItems.length > 0) {
    const bestHealthyPosition = Math.min(...healthyItems.map(r => r.position));
    const bestUnhealthyPosition = Math.min(...unhealthyItems.map(r => r.position));
    
    if (bestHealthyPosition < bestUnhealthyPosition) {
      insights.push({
        type: 'health_strategy',
        text: `Healthy options are in front positions`,
        icon: '•'
      });
    } else {
      insights.push({
        type: 'health_warning',
        text: `Unhealthy items are in prime positions`,
        icon: '•'
      });
    }
  }
  
  // Day-specific insights for later days
  if (day >= 3) {
    const veryUnhealthy = results.filter(r => r.food.healthValue <= 10);
    if (veryUnhealthy.length > 0) {
      insights.push({
        type: 'challenge',
        text: `You have ${veryUnhealthy.length} very unhealthy items in the lineup`,
        icon: '•'
      });
    }
  }
  
  return insights;
};

export const checkWinCondition = (healthScore, target) => {
  return healthScore >= target;
};

// Calculate optimal and worst possible health scores for a given food lineup
export const calculateOptimalAndWorstHealth = (foodOrder) => {
  // Optimal: arrange by health value descending (healthiest first)
  const optimalOrder = [...foodOrder].sort((a, b) => {
    const healthA = ALL_FOOD_ITEMS.find(f => f.id === a).healthValue;
    const healthB = ALL_FOOD_ITEMS.find(f => f.id === b).healthValue;
    return healthB - healthA;
  });
  
  // Worst: arrange by health value ascending (least healthy first)  
  const worstOrder = [...foodOrder].sort((a, b) => {
    const healthA = ALL_FOOD_ITEMS.find(f => f.id === a).healthValue;
    const healthB = ALL_FOOD_ITEMS.find(f => f.id === b).healthValue;
    return healthA - healthB;
  });
  
  const optimalResults = simulateChoices(optimalOrder);
  const worstResults = simulateChoices(worstOrder);
  
  return {
    optimal: calculateHealthScore(optimalResults),
    worst: calculateHealthScore(worstResults),
    optimalOrder,
    worstOrder
  };
};

// Calculate satisfaction level based on player performance vs optimal
export const calculateSatisfactionLevel = (playerScore, optimalScore, worstScore) => {
  const range = optimalScore - worstScore;
  if (range === 0) {
    return { level: 'Good', description: 'All arrangements perform similarly.' };
  }
  
  const playerPosition = (playerScore - worstScore) / range;
  
  // More balanced thresholds with student-behavior focused descriptions
  if (playerPosition >= 0.85) {
    return { level: 'Excellent', description: 'Students picked mostly healthy options!' };
  } else if (playerPosition >= 0.65) {
    return { level: 'Good', description: 'Students made healthier choices.' };
  } else if (playerPosition >= 0.35) {
    return { level: 'Fair', description: 'Students chose some unhealthy options.' };
  } else {
    return { level: 'Poor', description: 'Students tended to pick the unhealthiest options.' };
  }
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

// Smart food replacement system - adaptive variety and learning
export const generateNextDayFoods = (currentFoodOrder) => {
  const currentResults = simulateChoices(currentFoodOrder);
  const currentScore = calculateHealthScore(currentResults);
  
  // Strategy based on current performance and day:
  // Days 1-3: More lenient, focus on learning
  // Days 4+: Can be more challenging but ensure it stays winnable
  
  let targetReplacement = null;
  const day = Math.floor(Math.random() * 100) + 1; // We don't have day here, so use score-based logic only
  
  if (currentScore < 70) {
    // Player struggling - help them
    targetReplacement = findHelpfulReplacement(currentFoodOrder);
  } else if (currentScore >= 95) {
    // Player doing exceptionally well - moderate challenge only
    targetReplacement = findModerateChallengeReplacement(currentFoodOrder);
  } else if (currentScore >= 90) {
    // Player doing well - small challenge
    targetReplacement = findSmallChallengeReplacement(currentFoodOrder);
  } else {
    // Player doing okay - make a moderate change for variety
    targetReplacement = findModerateReplacement(currentFoodOrder);
  }
  
  if (targetReplacement) {
    const newOrder = [...currentFoodOrder];
    newOrder[targetReplacement.position] = targetReplacement.newFoodId;
    
    // Safety check: ensure the new lineup is still winnable with optimal placement
    const optimalOrder = [...newOrder].sort((a, b) => {
      const healthA = ALL_FOOD_ITEMS.find(f => f.id === a).healthValue;
      const healthB = ALL_FOOD_ITEMS.find(f => f.id === b).healthValue;
      return healthB - healthA; // Sort by health descending
    });
    
    const testResults = simulateChoices(optimalOrder);
    const testScore = calculateHealthScore(testResults);
    
    // If optimal arrangement can't win, don't make this change
    if (testScore < 90) {
      return {
        newOrder: currentFoodOrder,
        changes: { removed: [], added: [] }
      };
    }
    
    return {
      newOrder,
      changes: {
        removed: [ALL_FOOD_ITEMS.find(f => f.id === targetReplacement.oldFoodId)],
        added: [ALL_FOOD_ITEMS.find(f => f.id === targetReplacement.newFoodId)]
      }
    };
  }
  
  // No replacement found - keep current lineup
  return {
    newOrder: currentFoodOrder,
    changes: { removed: [], added: [] }
  };
};

// Helper: Replace worst item with something better (help struggling players)
function findHelpfulReplacement(currentOrder) {
  const sortedByHealth = currentOrder
    .map((id, pos) => ({ id, pos, health: ALL_FOOD_ITEMS.find(f => f.id === id).healthValue }))
    .sort((a, b) => a.health - b.health);
  
  const worstItem = sortedByHealth[0];
  
  // Find better options
  const betterOptions = ALL_FOOD_ITEMS.filter(f => 
    f.healthValue > worstItem.health &&
    f.healthValue <= 80 && // More generous help
    !currentOrder.includes(f.id)
  );
  
  if (betterOptions.length > 0) {
    const replacement = betterOptions[Math.floor(Math.random() * betterOptions.length)];
    return {
      position: worstItem.pos,
      oldFoodId: worstItem.id,
      newFoodId: replacement.id
    };
  }
  
  return null;
}

// Helper: Replace good item with moderate item (moderate challenge)
function findModerateReplacement(currentOrder) {
  const healthyItems = currentOrder
    .map((id, pos) => ({ id, pos, health: ALL_FOOD_ITEMS.find(f => f.id === id).healthValue }))
    .filter(item => item.health >= 70);
  
  if (healthyItems.length === 0) return null;
  
  const targetItem = healthyItems[Math.floor(Math.random() * healthyItems.length)];
  
  // Find moderate replacements (40-69 health)
  const moderateOptions = ALL_FOOD_ITEMS.filter(f => 
    f.healthValue >= 40 &&
    f.healthValue < 70 &&
    !currentOrder.includes(f.id)
  );
  
  if (moderateOptions.length > 0) {
    const replacement = moderateOptions[Math.floor(Math.random() * moderateOptions.length)];
    return {
      position: targetItem.pos,
      oldFoodId: targetItem.id,
      newFoodId: replacement.id
    };
  }
  
  return null;
}

// Helper: Small challenge - replace a good item with moderate item
function findSmallChallengeReplacement(currentOrder) {
  const goodItems = currentOrder
    .map((id, pos) => ({ id, pos, health: ALL_FOOD_ITEMS.find(f => f.id === id).healthValue }))
    .filter(item => item.health >= 80); // Only target very healthy items
  
  if (goodItems.length === 0) return null;
  
  const targetItem = goodItems[Math.floor(Math.random() * goodItems.length)];
  
  // Replace with moderate options (50-75 health) - still very winnable
  const moderateOptions = ALL_FOOD_ITEMS.filter(f => 
    f.healthValue >= 50 &&
    f.healthValue <= 75 &&
    f.healthValue < targetItem.health &&
    !currentOrder.includes(f.id)
  );
  
  if (moderateOptions.length > 0) {
    const replacement = moderateOptions[Math.floor(Math.random() * moderateOptions.length)];
    return {
      position: targetItem.pos,
      oldFoodId: targetItem.id,
      newFoodId: replacement.id
    };
  }
  
  return null;
}

// Helper: Moderate challenge - replace good item with okay item
function findModerateChallengeReplacement(currentOrder) {
  const veryGoodItems = currentOrder
    .map((id, pos) => ({ id, pos, health: ALL_FOOD_ITEMS.find(f => f.id === id).healthValue }))
    .filter(item => item.health >= 85); // Only target the very best items
  
  if (veryGoodItems.length === 0) return null;
  
  const targetItem = veryGoodItems[Math.floor(Math.random() * veryGoodItems.length)];
  
  // Replace with okay options (40-70 health) - still winnable with good strategy
  const okayOptions = ALL_FOOD_ITEMS.filter(f => 
    f.healthValue >= 40 &&
    f.healthValue <= 70 &&
    f.healthValue < targetItem.health &&
    !currentOrder.includes(f.id)
  );
  
  if (okayOptions.length > 0) {
    const replacement = okayOptions[Math.floor(Math.random() * okayOptions.length)];
    return {
      position: targetItem.pos,
      oldFoodId: targetItem.id,
      newFoodId: replacement.id
    };
  }
  
  return null;
}

// Helper function to get all possible replacement combinations
function getAllReplacementCombinations(currentOrder, numReplacements) {
  const combinations = [];
  const positions = currentOrder.map((_, i) => i);
  
  if (numReplacements === 1) {
    // Single replacements
    for (let i = 0; i < currentOrder.length; i++) {
      const currentFood = ALL_FOOD_ITEMS.find(f => f.id === currentOrder[i]);
      // Try replacing with different foods (not necessarily worse)
      const replacementOptions = ALL_FOOD_ITEMS.filter(f => 
        f.id !== currentOrder[i] && 
        !currentOrder.includes(f.id) // Don't duplicate existing foods
      );
      
      for (const replacementFood of replacementOptions) {
        combinations.push([{
          position: i,
          oldFoodId: currentOrder[i],
          newFoodId: replacementFood.id
        }]);
      }
    }
  } else if (numReplacements === 2) {
    // Double replacements
    for (let i = 0; i < currentOrder.length; i++) {
      for (let j = i + 1; j < currentOrder.length; j++) {
        const currentFood1 = ALL_FOOD_ITEMS.find(f => f.id === currentOrder[i]);
        const currentFood2 = ALL_FOOD_ITEMS.find(f => f.id === currentOrder[j]);
        
        const replacementOptions1 = ALL_FOOD_ITEMS.filter(f => 
          f.id !== currentOrder[i] && 
          !currentOrder.includes(f.id)
        );
        
        const replacementOptions2 = ALL_FOOD_ITEMS.filter(f => 
          f.id !== currentOrder[j] && 
          !currentOrder.includes(f.id)
        );
        
        for (const replacement1 of replacementOptions1) {
          for (const replacement2 of replacementOptions2) {
            if (replacement1.id !== replacement2.id) { // Don't use same replacement food twice
              combinations.push([
                { position: i, oldFoodId: currentOrder[i], newFoodId: replacement1.id },
                { position: j, oldFoodId: currentOrder[j], newFoodId: replacement2.id }
              ]);
            }
          }
        }
      }
    }
  }
  
  return combinations;
}
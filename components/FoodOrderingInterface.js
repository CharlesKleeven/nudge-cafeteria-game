import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ALL_FOOD_ITEMS } from '../gameData';

const FoodOrderingInterface = ({ foodOrder, onOrderChange, disabled = false, day = 1 }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  // Reset selection when day changes
  useEffect(() => {
    setSelectedItems([]);
  }, [day]);

  const getFoodItemData = (foodId) => {
    return ALL_FOOD_ITEMS.find(item => item.id === foodId);
  };

  const handleItemPress = (index) => {
    if (disabled) return;

    const isSelected = selectedItems.includes(index);

    if (isSelected) {
      // Deselect the item
      setSelectedItems(selectedItems.filter(i => i !== index));
    } else {
      if (selectedItems.length === 0) {
        // Select first item
        setSelectedItems([index]);
      } else if (selectedItems.length === 1) {
        // Select second item and swap
        const firstIndex = selectedItems[0];
        const secondIndex = index;

        // Swap items
        const newOrder = [...foodOrder];
        [newOrder[firstIndex], newOrder[secondIndex]] = [newOrder[secondIndex], newOrder[firstIndex]];
        onOrderChange(newOrder);

        // Clear selection for next swap
        setSelectedItems([]);
      }
    }
  };

  const renderLineItem = (foodId, index) => {
    const foodData = getFoodItemData(foodId);
    const isSelected = selectedItems.includes(index);

    return (
      <TouchableOpacity
        key={`${foodId}-${index}`}
        style={[
          styles.lineItem,
          isSelected && styles.lineItemSelected,
          disabled && styles.lineItemDisabled
        ]}
        onPress={() => handleItemPress(index)}
        disabled={disabled}
        activeOpacity={disabled ? 1 : 0.9}
      >
        <View style={styles.positionIndicator}>
          <Text style={styles.positionNumber}>{index + 1}</Text>
        </View>
        
        <View style={styles.foodContent}>
          <Text style={styles.foodEmoji}>{foodData.emoji}</Text>
          <Text style={styles.foodName}>{foodData.name}</Text>
          
          <View style={styles.statsContainer}>
            <Text style={styles.statText}>Health: {foodData.healthValue}</Text>
            <Text style={styles.statText}>Appeal: {foodData.basePopularity}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <Text style={styles.title}>Arrange Food Line</Text>
        <Text style={styles.subtitle}>
          {disabled 
            ? 'Current arrangement' 
            : 'Tap two items to swap positions'}
        </Text>
      </View>

      <View style={styles.foodLineSection}>
        <View style={styles.cafeteriaLine}>
          {foodOrder.map((foodId, index) => renderLineItem(foodId, index))}
        </View>
        
        <View style={styles.flowIndicator}>
          <Text style={styles.flowText}>Students walk from 1 to 5 in order</Text>
        </View>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <Text style={styles.legendLabel}>Health:</Text>
          <Text style={styles.legendText}>Nutritional value</Text>
        </View>
        <View style={styles.legendItem}>
          <Text style={styles.legendLabel}>Appeal:</Text>
          <Text style={styles.legendText}>Student preference</Text>
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingVertical: 24,
    paddingHorizontal: 20,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6c757d',
    fontWeight: '400',
  },
  foodLineSection: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  flowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 250,
  },
  gameWrapper: {
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
  },
  horizontalFlowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 16,
    marginVertical: 8,
  },
  flowIndicator: {
    alignItems: 'center',
    marginVertical: 12,
  },
  flowIndicatorLeft: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 90,
    paddingVertical: 8,
  },
  flowIndicatorRight: {
    alignItems: 'center',
    marginLeft: 20,
    minWidth: 90,
    paddingVertical: 8,
  },
  flowIndicatorBelow: {
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 8,
  },
  flowText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  flowArrow: {
    fontSize: 20,
    color: '#007bff',
    fontWeight: 'bold',
  },
  cafeteriaLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  lineItem: {
    flex: 1,
    maxWidth: 150,
    minWidth: 90,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 10,
    minHeight: 130,
    position: 'relative',
  },
  lineItemDisabled: {
    opacity: 0.7,
  },
  lineContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineContentSelected: {
    backgroundColor: 'transparent',
  },
  lineItemSelected: {
    borderColor: '#4a90e2',
    borderWidth: 2,
    backgroundColor: '#f0f8ff',
    transform: [{ scale: 1.02 }],
  },
  positionIndicator: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: '#4a90e2',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionNumber: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  foodContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  foodEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  foodName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 8,
  },
  statsContainer: {
    width: '100%',
    gap: 4,
  },
  statText: {
    fontSize: 11,
    color: '#6c757d',
    textAlign: 'center',
    fontWeight: '500',
  },
  flowIndicator: {
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  flowText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
  },
  legendText: {
    fontSize: 12,
    color: '#6c757d',
  },
});

export default FoodOrderingInterface;

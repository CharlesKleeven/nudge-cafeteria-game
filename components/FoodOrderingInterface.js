import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { FOOD_ITEMS } from '../gameData';

const FoodOrderingInterface = ({ foodOrder, onOrderChange, disabled = false }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const getFoodItemData = (foodId) => {
    return FOOD_ITEMS.find(item => item.id === foodId);
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

        // Clear selection
        setSelectedItems([]);
      }
    }
  };

  const renderGridItem = (foodId, index) => {
    const foodData = getFoodItemData(foodId);
    const isSelected = selectedItems.includes(index);

    return (
      <TouchableOpacity
        key={`${foodId}-${index}`}
        style={[
          styles.gridItem,
          isSelected && styles.gridItemSelected,
          disabled && styles.gridItemDisabled
        ]}
        onPress={() => handleItemPress(index)}
        disabled={disabled}
        activeOpacity={disabled ? 1 : 0.7}
      >
        <View style={[styles.gridContent, isSelected && styles.gridContentSelected]}>
          <Text style={styles.gridEmoji}>{foodData.emoji}</Text>
          <Text style={styles.gridName}>{foodData.name}</Text>
          <Text style={styles.gridStats}>
            Health: {foodData.healthValue}
          </Text>
          <Text style={styles.gridStats}>
            Popularity: {foodData.basePopularity}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cafeteria Layout</Text>
      <Text style={styles.subtitle}>
        {disabled ? 'Current arrangement' : 'Tap two items to swap their positions'}
      </Text>

      <View style={styles.flowContainer}>
        <View style={styles.gameWrapper}>
          <View style={styles.gridContainer}>
            <View style={styles.studentFlow}>
              <Text style={styles.studentFlowText}>Students</Text>
              <Text style={styles.studentFlowArrow}>↓</Text>
              <Text style={styles.studentFlowArrow}>↓</Text>
              <Text style={styles.studentFlowArrow}>↓</Text>
            </View>

            <View style={styles.grid}>
              {foodOrder.map((foodId, index) => renderGridItem(foodId, index))}
            </View>
          </View>
        </View>
      </View>

      {disabled && (
        <View style={styles.disabledOverlay}>
          <Text style={styles.disabledText}>Viewing current arrangement</Text>
        </View>
      )}

      {/* Selection feedback */}
      {selectedItems.length > 0 && (
        <View style={styles.selectionFeedback}>
          <Text style={styles.selectionText}>
            {selectedItems.length === 1 ? 'Now tap another item to swap' : 'Swapping items...'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    padding: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    color: '#7f8c8d',
  },
  flowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 250,
  },
  gameWrapper: {
    width: '100%',
    maxWidth: 450,
    alignSelf: 'center',
  },
  flowIndicator: {
    alignItems: 'center',
    marginVertical: 8,
  },
  flowText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
  },
  flowArrow: {
    fontSize: 20,
    color: '#007bff',
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '100%',
  },
  studentFlow: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    marginRight: 12,
    flexShrink: 0,
  },
  studentFlowText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  studentFlowArrow: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    flex: 1,
    maxWidth: '100%',
  },
  gridItem: {
    width: '45%',
    aspectRatio: 0.75,
    backgroundColor: '#fff',
    margin: '2.5%',
    borderRadius: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#e9ecef',
    padding: 10,
  },
  gridItemDisabled: {
    opacity: 0.7,
  },
  gridContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContentSelected: {
    backgroundColor: 'transparent',
  },
  gridEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  gridName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 6,
  },
  gridStats: {
    fontSize: 11,
    color: '#6c757d',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 14,
    marginBottom: 2,
  },
  gridItemSelected: {
    borderColor: '#007bff',
    borderWidth: 3,
    backgroundColor: '#f0f8ff',
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(248, 249, 250, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  selectionFeedback: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 123, 255, 0.9)',
    padding: 10,
    borderRadius: 8,
    zIndex: 1001,
  },
  selectionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default FoodOrderingInterface;


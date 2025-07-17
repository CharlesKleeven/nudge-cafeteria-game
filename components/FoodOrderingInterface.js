import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { FOOD_ITEMS } from '../gameData';

const FoodOrderingInterface = ({ foodOrder, onOrderChange, disabled = false }) => {
  const getFoodItemData = (foodId) => {
    return FOOD_ITEMS.find(item => item.id === foodId);
  };

  const moveItem = (fromIndex, toIndex) => {
    if (disabled) return;

    const newOrder = [...foodOrder];
    const [removed] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, removed);
    onOrderChange(newOrder);
  };

  const moveUp = (index) => {
    if (index > 0) {
      moveItem(index, index - 1);
    }
  };

  const moveDown = (index) => {
    if (index < foodOrder.length - 1) {
      moveItem(index, index + 1);
    }
  };

  const renderFoodItem = (foodId, index) => {
    const foodData = getFoodItemData(foodId);
    const canMoveUp = index > 0 && !disabled;
    const canMoveDown = index < foodOrder.length - 1 && !disabled;

    return (
      <View key={foodId} style={styles.foodItem}>
        <View style={styles.positionIndicator}>
          <Text style={styles.positionNumber}>#{index + 1}</Text>
        </View>

        <View style={styles.foodContent}>
          <Text style={styles.foodEmoji}>{foodData.emoji}</Text>
          <View style={styles.foodInfo}>
            <Text style={styles.foodName}>{foodData.name}</Text>
            <Text style={styles.foodStats}>
              Health: {foodData.healthValue} | Popularity: {foodData.basePopularity}
            </Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, !canMoveUp && styles.controlButtonDisabled]}
            onPress={() => moveUp(index)}
            disabled={!canMoveUp}
          >
            <Text style={[styles.controlButtonText, !canMoveUp && styles.controlButtonTextDisabled]}>
              ↑
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, !canMoveDown && styles.controlButtonDisabled]}
            onPress={() => moveDown(index)}
            disabled={!canMoveDown}
          >
            <Text style={[styles.controlButtonText, !canMoveDown && styles.controlButtonTextDisabled]}>
              ↓
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cafeteria Line Order</Text>
      <Text style={styles.subtitle}>
        {disabled ? 'Current arrangement' : 'Use ↑↓ arrows to reorder'}
      </Text>

      <ScrollView style={styles.foodList} showsVerticalScrollIndicator={false}>
        {foodOrder.map((foodId, index) => renderFoodItem(foodId, index))}
      </ScrollView>

      {disabled && (
        <View style={styles.disabledOverlay}>
          <Text style={styles.disabledText}>Viewing current arrangement</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#7f8c8d',
  },
  foodList: {
    flex: 1,
  },
  foodItem: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  positionIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  positionNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  foodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  foodEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 4,
  },
  foodStats: {
    fontSize: 13,
    color: '#6c757d',
    fontWeight: '500',
  },
  controls: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 16,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#28a745',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  controlButtonDisabled: {
    backgroundColor: '#e9ecef',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  controlButtonTextDisabled: {
    color: '#adb5bd',
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
  disabledText: {
    fontSize: 18,
    color: '#6c757d',
    fontWeight: '600',
  },
});

export default FoodOrderingInterface;
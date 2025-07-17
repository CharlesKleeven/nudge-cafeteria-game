import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SimpleResultsView = ({ results, healthScore, insights, comparison, target }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Results</Text>
      
      {/* Health Score - Big and Clear */}
      <View style={styles.healthContainer}>
        <Text style={styles.healthLabel}>Average Health Score</Text>
        <Text style={[
          styles.healthScore,
          { color: healthScore >= target ? '#28a745' : '#dc3545' }
        ]}>
          {healthScore}/100
        </Text>
        <Text style={styles.healthTarget}>Target: {target}+</Text>
      </View>

      {/* Position Effects - Visual Bar Chart */}
      <View style={styles.positionContainer}>
        <Text style={styles.sectionTitle}>Position Effects</Text>
        <Text style={styles.sectionSubtitle}>How placement influences student choices</Text>
        
        {results.map((result, index) => (
          <View key={result.foodId} style={styles.positionRow}>
            <View style={styles.positionInfo}>
              <Text style={styles.positionEmoji}>{result.food.emoji}</Text>
              <Text style={styles.positionNumber}>#{result.position}</Text>
            </View>
            
            <View style={styles.barContainer}>
              <View 
                style={[
                  styles.bar,
                  { 
                    width: `${result.choiceRate}%`,
                    backgroundColor: result.food.healthValue > 60 ? '#28a745' : '#dc3545'
                  }
                ]}
              />
              <Text style={styles.barLabel}>{result.choiceRate}% chose this</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Key Insights */}
      <View style={styles.insightsContainer}>
        <Text style={styles.sectionTitle}>Key Insights</Text>
        {insights.map((insight, index) => (
          <View key={index} style={styles.insightRow}>
            <Text style={styles.insightIcon}>{insight.icon}</Text>
            <Text style={styles.insightText}>{insight.text}</Text>
          </View>
        ))}
      </View>

      {/* Comparison if available */}
      {comparison && (
        <View style={styles.comparisonContainer}>
          <Text style={styles.sectionTitle}>
            Your Changes
          </Text>
          <Text style={styles.comparisonHealth}>
            Health Score: {comparison.oldHealth} → {comparison.newHealth} 
            <Text style={[
              styles.comparisonChange,
              { color: comparison.healthChange > 0 ? '#28a745' : comparison.healthChange < 0 ? '#dc3545' : '#6c757d' }
            ]}>
              {comparison.healthChange > 0 ? '+' : comparison.healthChange < 0 ? '' : '+'}{comparison.healthChange}
            </Text>
          </Text>
          
          {comparison.changes.map((change, index) => (
            <Text key={index} style={styles.changeText}>
              • {change.food.name}: {change.oldChoiceRate}% → {change.newChoiceRate}% 
              <Text style={[
                styles.changeNumber,
                { color: change.change > 0 ? '#28a745' : change.change < 0 ? '#dc3545' : '#6c757d' }
              ]}>
                ({change.change > 0 ? '+' : change.change < 0 ? '' : '+'}{change.change}%)
              </Text>
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 24,
  },
  healthContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  healthLabel: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
  },
  healthScore: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  healthTarget: {
    fontSize: 14,
    color: '#6c757d',
  },
  positionContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
  },
  positionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  positionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
  },
  positionEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  positionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  barContainer: {
    flex: 1,
    marginLeft: 16,
  },
  bar: {
    height: 24,
    borderRadius: 12,
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  insightsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  insightText: {
    fontSize: 15,
    color: '#495057',
    flex: 1,
    lineHeight: 20,
  },
  comparisonContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  comparisonHealth: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 12,
    fontWeight: '600',
  },
  comparisonChange: {
    fontWeight: 'bold',
  },
  changeText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  changeNumber: {
    fontWeight: 'bold',
  },
});

export default SimpleResultsView;
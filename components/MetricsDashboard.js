import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GAME_THRESHOLDS } from '../gameData';

const MetricsDashboard = ({ metrics, day }) => {
  const getMetricColor = (value, target, isWaste = false) => {
    if (isWaste) {
      return value <= target ? '#4CAF50' : value <= target * 1.5 ? '#FF9800' : '#f44336';
    }
    return value >= target ? '#4CAF50' : value >= target * 0.8 ? '#FF9800' : '#f44336';
  };

  const getMetricStatus = (value, target, isWaste = false) => {
    if (isWaste) {
      return value <= target ? 'Great!' : value <= target * 1.5 ? 'OK' : 'Poor';
    }
    return value >= target ? 'Great!' : value >= target * 0.8 ? 'OK' : 'Poor';
  };

  const renderMetricCard = (title, value, target, unit = '', isWaste = false) => {
    const color = getMetricColor(value, target, isWaste);
    const status = getMetricStatus(value, target, isWaste);
    
    return (
      <View style={[styles.metricCard, { borderLeftColor: color }]}>
        <Text style={styles.metricTitle}>{title}</Text>
        <View style={styles.metricContent}>
          <Text style={[styles.metricValue, { color }]}>
            {value}{unit}
          </Text>
          <Text style={styles.metricTarget}>
            Target: {isWaste ? '≤' : '≥'}{target}{unit}
          </Text>
        </View>
        <Text style={[styles.metricStatus, { color }]}>{status}</Text>
      </View>
    );
  };

  const allTargetsMet = 
    metrics.health >= GAME_THRESHOLDS.HEALTH_TARGET &&
    metrics.satisfaction >= GAME_THRESHOLDS.SATISFACTION_TARGET &&
    metrics.waste <= GAME_THRESHOLDS.WASTE_LIMIT;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Day {day} Results</Text>
      
      <View style={styles.metricsGrid}>
        {renderMetricCard(
          'Health Score',
          metrics.health,
          GAME_THRESHOLDS.HEALTH_TARGET
        )}
        
        {renderMetricCard(
          'Satisfaction',
          metrics.satisfaction,
          GAME_THRESHOLDS.SATISFACTION_TARGET
        )}
        
        {renderMetricCard(
          'Food Waste',
          metrics.waste,
          GAME_THRESHOLDS.WASTE_LIMIT,
          '%',
          true
        )}
      </View>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <Text style={styles.summaryText}>
          {metrics.studentCount} students went through the line today.
        </Text>
        
        {day === 5 && (
          <View style={[
            styles.finalResult,
            { backgroundColor: allTargetsMet ? '#E8F5E8' : '#FFE8E8' }
          ]}>
            <Text style={[
              styles.finalResultText,
              { color: allTargetsMet ? '#2E7D32' : '#C62828' }
            ]}>
              {allTargetsMet ? 
                '🎉 Success! You\'ve turned the cafeteria around!' :
                '😔 Not quite there yet. Keep trying!'
              }
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#2c3e50',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    width: '48%',
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  metricTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6c757d',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricContent: {
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  metricTarget: {
    fontSize: 13,
    color: '#adb5bd',
    fontWeight: '500',
  },
  metricStatus: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 18,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#2c3e50',
  },
  summaryText: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 12,
    lineHeight: 22,
  },
  finalResult: {
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    borderWidth: 2,
  },
  finalResultText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default MetricsDashboard;
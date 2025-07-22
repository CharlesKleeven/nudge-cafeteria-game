import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SimpleResultsView = ({ results, healthScore, insights, isFirstDay = false, day = 0, dailySatisfactionLevels = [], currentSatisfaction = null }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Day {day} Results</Text>
      
      {/* Weekly Progress Tracker */}
      {dailySatisfactionLevels.length > 0 && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressTitle}>Week Progress</Text>
          <View style={styles.dailyScoresRow}>
            {Array.from({ length: 5 }, (_, i) => {
              const satisfaction = dailySatisfactionLevels[i];
              const isCurrentDay = i === day - 1;
              const isCompleted = satisfaction !== undefined;
              
              const getSatisfactionColor = (level) => {
                switch (level) {
                  case 'Excellent': return '#2e7d32';
                  case 'Good': return '#4a90e2';
                  case 'Fair': return '#ff8c00';
                  case 'Poor': return '#d32f2f';
                  default: return '#94a3b8';
                }
              };
              
              const getSatisfactionBgColor = (level) => {
                switch (level) {
                  case 'Excellent': return '#e8f5e9';
                  case 'Good': return '#e3f2fd';
                  case 'Fair': return '#fff3e0';
                  case 'Poor': return '#ffebee';
                  default: return '#f8f9fa';
                }
              };
              
              return (
                <View key={i} style={[
                  styles.dayScore,
                  isCurrentDay && styles.currentDayScore,
                  isCompleted && { backgroundColor: getSatisfactionBgColor(satisfaction.level) },
                ]}>
                  <Text style={styles.dayLabel}>Day {i + 1}</Text>
                  <Text style={[
                    styles.satisfactionValue,
                    { color: isCompleted ? getSatisfactionColor(satisfaction.level) : '#6c757d' }
                  ]}>
                    {isCompleted ? satisfaction.level : '-'}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Satisfaction Level */}
      {currentSatisfaction && (
        <View style={styles.healthScoreContainer}>
          <Text style={styles.scoreLabel}>Performance</Text>
          <Text style={[
            styles.bigSatisfactionValue,
            { color: currentSatisfaction.level === 'Excellent' ? '#2e7d32' : 
                     currentSatisfaction.level === 'Good' ? '#4a90e2' :
                     currentSatisfaction.level === 'Fair' ? '#ff8c00' : '#d32f2f' }
          ]}>
            {currentSatisfaction.level}
          </Text>
          <Text style={styles.satisfactionText}>
            {currentSatisfaction.description}
          </Text>
          <Text style={styles.rawScoreText}>
            Health Score: {healthScore}
          </Text>
        </View>
      )}

      {/* Student Selection Results */}
      <View style={styles.positionContainer}>
        <Text style={styles.sectionTitle}>What Students Chose</Text>
        <Text style={styles.sectionSubtitle}>
          {isFirstDay ? 'Observation results:' : 'Student choices:'}
        </Text>

        {results
          .sort((a, b) => a.food.name.localeCompare(b.food.name))
          .map((result) => {
            return (
              <View key={result.foodId} style={styles.positionRow}>
                <View style={styles.positionInfo}>
                  <Text style={styles.positionEmoji}>{result.food.emoji}</Text>
                  <Text style={styles.positionName}>{result.food.name}</Text>
                </View>

                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        width: `${result.choiceRate}%`,
                        backgroundColor: '#e67e22'
                      }
                    ]}
                  />
                  <Text style={styles.barLabel}>{result.choiceRate}%</Text>
                </View>
              </View>
            );
          })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingHorizontal: 16,
    backgroundColor: '#fafafa',
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 32,
  },
  healthScoreContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
    fontWeight: '600',
  },
  bigScoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bigSatisfactionValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  satisfactionText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 8,
  },
  rawScoreText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
  },
  satisfactionValue: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 12,
  },
  positionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 20,
  },
  positionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 44,
  },
  positionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
    minWidth: 100,
    flexShrink: 0,
  },
  positionEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  positionName: {
    fontSize: 14,
    color: '#495057',
    marginRight: 6,
  },
  healthValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  barContainer: {
    flex: 1,
    marginLeft: 16,
    minWidth: 0,
  },
  bar: {
    height: 24,
    borderRadius: 12,
    marginBottom: 4,
    minWidth: 20,
    maxWidth: '100%',
  },
  barLabel: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  satisfactionText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  dailyScoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 4,
  },
  dayScore: {
    flex: 1,
    minWidth: 55,
    alignItems: 'center',
    padding: 6,
    marginHorizontal: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  currentDayScore: {
    borderColor: '#4a90e2',
    borderWidth: 2,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 3,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  successScore: {
    color: '#28a745',
  },
  failScore: {
    color: '#dc3545',
  },
  averageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    textAlign: 'center',
  },
});

export default SimpleResultsView;
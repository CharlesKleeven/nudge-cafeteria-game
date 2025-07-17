import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FOOD_ITEMS } from '../gameData';

const StudentChoiceVisualizer = ({ dayResults, foodOrder }) => {
  if (!dayResults || dayResults.length === 0) {
    return null;
  }

  const getFoodEmoji = (foodId) => {
    return FOOD_ITEMS.find(f => f.id === foodId)?.emoji || '🍽️';
  };

  const renderStudentTray = (result) => {
    const student = result.student;
    const choices = result.choices;
    
    return (
      <View key={student.id} style={styles.studentCard}>
        <View style={styles.studentHeader}>
          <Text style={styles.studentName}>{student.name}</Text>
          <Text style={styles.studentTraits}>
            {student.timeConstraint > 0.7 ? '⏱️' : ''}
            {student.hungerLevel > 0.8 ? '🍽️' : ''}
            {student.socialInfluence > 0.6 ? '👥' : ''}
          </Text>
        </View>
        
        <View style={styles.choicesContainer}>
          <Text style={styles.choicesTitle}>Choices made:</Text>
          <View style={styles.choicesGrid}>
            {choices.map((choice, index) => (
              <View 
                key={`${choice.foodId}-${index}`}
                style={[
                  styles.choiceItem,
                  { 
                    backgroundColor: choice.taken ? '#e8f5e8' : '#fff3cd',
                    borderColor: choice.taken ? '#28a745' : '#ffc107'
                  }
                ]}
              >
                <Text style={styles.choiceEmoji}>{getFoodEmoji(choice.foodId)}</Text>
                <Text style={styles.choicePosition}>#{index + 1}</Text>
                <Text style={styles.choiceStatus}>
                  {choice.taken ? '✓' : '✗'}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.trayContainer}>
          <Text style={styles.trayTitle}>Final Tray:</Text>
          <View style={styles.tray}>
            {result.trayItems.map((item, index) => (
              <View key={`${item.foodId}-${index}`} style={styles.trayItem}>
                <Text style={styles.trayEmoji}>{getFoodEmoji(item.foodId)}</Text>
              </View>
            ))}
            {result.trayItems.length === 0 && (
              <Text style={styles.emptyTray}>No items taken</Text>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderPositionAnalysis = () => {
    const positionStats = foodOrder.map((foodId, position) => {
      const takeRate = dayResults.filter(result => 
        result.choices[position]?.taken
      ).length / dayResults.length;
      
      return {
        foodId,
        position: position + 1,
        takeRate: Math.round(takeRate * 100),
        emoji: getFoodEmoji(foodId)
      };
    });

    return (
      <View style={styles.positionAnalysis}>
        <Text style={styles.analysisTitle}>Position Effects (Take Rates)</Text>
        <Text style={styles.analysisSubtitle}>
          This shows how position influences student choices
        </Text>
        <View style={styles.positionGrid}>
          {positionStats.map((stat) => (
            <View key={stat.foodId} style={styles.positionCard}>
              <Text style={styles.positionEmoji}>{stat.emoji}</Text>
              <Text style={styles.positionNumber}>#{stat.position}</Text>
              <Text style={styles.positionRate}>{stat.takeRate}%</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Student Choice Analysis</Text>
      
      {renderPositionAnalysis()}
      
      <Text style={styles.sectionTitle}>Individual Student Decisions</Text>
      {dayResults.map(renderStudentTray)}
      
      <View style={styles.insightBox}>
        <Text style={styles.insightTitle}>💡 Key Insight</Text>
        <Text style={styles.insightText}>
          Notice how position #1 and #2 have higher take rates regardless of what food is there. 
          This demonstrates the core nudge principle: placement influences behavior more than individual preferences.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  positionAnalysis: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  analysisTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  analysisSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
  },
  positionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  positionCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    width: '30%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  positionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  positionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 4,
  },
  positionRate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    marginTop: 8,
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  studentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  studentTraits: {
    fontSize: 16,
  },
  choicesContainer: {
    marginBottom: 16,
  },
  choicesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  choicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  choiceItem: {
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    width: '15%',
    alignItems: 'center',
    borderWidth: 1,
  },
  choiceEmoji: {
    fontSize: 16,
    marginBottom: 2,
  },
  choicePosition: {
    fontSize: 10,
    color: '#6c757d',
    marginBottom: 2,
  },
  choiceStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  trayContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
  },
  trayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  tray: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trayItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  trayEmoji: {
    fontSize: 20,
  },
  emptyTray: {
    fontSize: 14,
    color: '#6c757d',
    fontStyle: 'italic',
  },
  insightBox: {
    backgroundColor: '#fff3cd',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 15,
    color: '#856404',
    lineHeight: 22,
  },
});

export default StudentChoiceVisualizer;
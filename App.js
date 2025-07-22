import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import FoodOrderingInterface from './components/FoodOrderingInterface';
import SimpleResultsView from './components/SimpleResultsView';
import IntroScene from './components/IntroScene';
import OutroScene from './components/OutroScene';
import { 
  TARGET_HEALTH_SCORE, 
  STARTING_FOOD_ORDER
} from './gameData';
import {
  simulateChoices,
  calculateHealthScore,
  generateInsights,
  calculateOptimalAndWorstHealth,
  calculateSatisfactionLevel
} from './gameLogic';

export default function App() {
  const [gameState, setGameState] = useState('menu');
  const [currentDay, setCurrentDay] = useState(1);
  const [currentOrder, setCurrentOrder] = useState([...STARTING_FOOD_ORDER]);
  const [results, setResults] = useState(null);
  const [healthScore, setHealthScore] = useState(0);
  const [insights, setInsights] = useState([]);
  const [dailySatisfactionLevels, setDailySatisfactionLevels] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentSatisfaction, setCurrentSatisfaction] = useState(null);

  // Get the pre-designed food lineup for each day
  const getDayFoodLineup = (day) => {
    const dayLineups = {
      1: ['pizza', 'apple', 'salad'], // 3 items: unhealthy, healthy, very healthy
      2: ['burger', 'sandwich', 'smoothie', 'apple'], // 4 items: adds complexity
      3: ['pizza', 'wrap', 'soup', 'smoothie', 'salad'], // 5 items: balanced challenge
      4: ['chips', 'sandwich', 'falafel', 'apple', 'salad'], // 5 items: bit harder
      5: ['burger', 'wrap', 'soup', 'smoothie', 'apple'] // 5 items: final challenge
    };
    
    return dayLineups[day] || dayLineups[1];
  };


  const startGame = () => {
    setGameState('intro');
  };

  const startActualGame = () => {
    setGameState('playing');
    setCurrentDay(1);
    const day1Lineup = getDayFoodLineup(1);
    setCurrentOrder([...day1Lineup]);
    setResults(null);
    setHealthScore(0);
    setInsights([]);
    setDailySatisfactionLevels([]);
    setGameCompleted(false);
    setCurrentSatisfaction(null);
  };

  const showFinalOutro = () => {
    setGameState('final-outro');
  };

  const completeFinalOutro = () => {
    setGameState('menu');
  };

  const runSimulation = (order) => {
    const simulationResults = simulateChoices(order, currentDay);
    const health = calculateHealthScore(simulationResults);
    const gameInsights = generateInsights(simulationResults, currentDay);

    // Calculate satisfaction level based on optimal vs worst possible arrangement
    const { optimal, worst } = calculateOptimalAndWorstHealth(order);
    const satisfaction = calculateSatisfactionLevel(health, optimal, worst);

    setResults(simulationResults);
    setHealthScore(health);
    setInsights(gameInsights);
    setCurrentSatisfaction(satisfaction);

    // Add this day's satisfaction to the tracking array
    const newDailySatisfactionLevels = [...dailySatisfactionLevels, satisfaction];
    setDailySatisfactionLevels(newDailySatisfactionLevels);

    // Check if we've completed all 5 days
    if (currentDay >= 5) {
      setGameCompleted(true);
    }

    setGameState('results');
  };

  const nextDay = () => {
    if (currentDay >= 5) return; // Don't go beyond day 5
    
    const newDay = currentDay + 1;
    
    // Get the pre-designed food lineup for the next day
    const nextDayOrder = getDayFoodLineup(newDay);
    
    setCurrentOrder(nextDayOrder);
    setCurrentDay(newDay);
    setGameState('playing');
  };

  const finishAttempt = () => {
    runSimulation(currentOrder);
  };

  const renderMenu = () => (
    <View style={styles.menuContainer}>
      <View style={styles.menuContent}>
        <Text style={styles.gameTitle}>Cafeteria Manager</Text>
        <Text style={styles.gameSubtitle}>Get students eating healthier</Text>
        
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>Begin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGame = () => (
    <ScrollView
      style={styles.gameContainer}
      contentContainerStyle={styles.gameScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.attemptTitle}>Day {currentDay}</Text>
      </View>

      <View style={styles.gameSection}>
        <FoodOrderingInterface
          foodOrder={currentOrder}
          onOrderChange={setCurrentOrder}
          disabled={false}
          day={currentDay}
        />
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.testButton} onPress={finishAttempt}>
          <Text style={styles.buttonText}>
            Open for Lunch
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderResults = () => (
    <ScrollView style={styles.resultsContainer}>
      <SimpleResultsView
        results={results}
        healthScore={healthScore}
        insights={insights}
        healthTarget={TARGET_HEALTH_SCORE}
        isFirstDay={false}
        day={currentDay}
        dailySatisfactionLevels={dailySatisfactionLevels}
        currentSatisfaction={currentSatisfaction}
        gameCompleted={gameCompleted}
      />

      <View style={styles.actionContainer}>
        {gameCompleted ? (
          <View style={styles.finalResultsContainer}>
            <TouchableOpacity style={styles.seeResultsButton} onPress={showFinalOutro}>
              <Text style={styles.buttonText}>See Results</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.tryAgainContainer}>
            <TouchableOpacity style={styles.tryAgainButton} onPress={nextDay}>
              <Text style={styles.buttonText}>
                {currentDay < 5 ? 'Next Day' : 'Complete Challenge'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={() => setGameState('menu')}>
              <Text style={styles.menuButtonText}>Go Back to Menu</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {gameState === 'menu' && renderMenu()}
      {gameState === 'intro' && <IntroScene onComplete={startActualGame} />}
      {gameState === 'playing' && renderGame()}
      {gameState === 'results' && renderResults()}
      {gameState === 'final-outro' && <OutroScene onComplete={completeFinalOutro} dailySatisfactionLevels={dailySatisfactionLevels} />}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    width: '100%',
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    width: '100%',
  },
  menuContent: {
    alignItems: 'center',
    maxWidth: 500,
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  gameTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  gameSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },

  startButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 32,
    minWidth: 200,
    maxWidth: 300,
    width: '80%',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  menuButtonText: {
    color: '#5b6472',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  gameContainer: {
    flex: 1,
    paddingTop: 10,
    width: '100%',
  },
  gameScrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingHorizontal: 8,
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 16,
  },
  attemptTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  gameSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  controlsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 28,
  },
  resultsContainer: {
    flex: 1,
    paddingTop: 10,
    width: '100%',
  },
  actionContainer: {
    padding: 24,
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 28,
    marginBottom: 12,
    minWidth: 200,
  },
  seeResultsButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 32,
    minWidth: 200,
    alignItems: 'center',
  },
  tryAgainContainer: {
    alignItems: 'center',
    width: '100%',
  },
  tryAgainButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 28,
    marginBottom: 12,
  },
  menuButton: {
    backgroundColor: '#fafafa',
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#8fa1b9',
  },
  finalResultsContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
});
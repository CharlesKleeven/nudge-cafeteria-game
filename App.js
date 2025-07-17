import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import FoodOrderingInterface from './components/FoodOrderingInterface';
import SimpleResultsView from './components/SimpleResultsView';
import { DEFAULT_FOOD_ORDER, TARGET_HEALTH_SCORE } from './gameData';
import { 
  simulateChoices, 
  calculateHealthScore, 
  generateInsights,
  compareArrangements
} from './gameLogic';

export default function App() {
  const [gameState, setGameState] = useState('menu');
  const [attempt, setAttempt] = useState(1);
  const [currentOrder, setCurrentOrder] = useState([...DEFAULT_FOOD_ORDER]);
  const [results, setResults] = useState(null);
  const [healthScore, setHealthScore] = useState(0);
  const [insights, setInsights] = useState([]);
  const [comparison, setComparison] = useState(null);
  const [lastOrder, setLastOrder] = useState([...DEFAULT_FOOD_ORDER]);
  const [hasWon, setHasWon] = useState(false);

  const startGame = () => {
    setGameState('playing');
    setAttempt(1);
    setCurrentOrder([...DEFAULT_FOOD_ORDER]);
    setResults(null);
    setHealthScore(0);
    setInsights([]);
    setComparison(null);
    setLastOrder([...DEFAULT_FOOD_ORDER]);
    setHasWon(false);
    
    // Show baseline results immediately
    runSimulation([...DEFAULT_FOOD_ORDER]);
  };

  const runSimulation = (order) => {
    const simulationResults = simulateChoices(order);
    const health = calculateHealthScore(simulationResults);
    const gameInsights = generateInsights(simulationResults);
    
    // Compare with previous attempt if not the first
    let comp = null;
    if (attempt > 1) {
      comp = compareArrangements(lastOrder, order);
    }
    
    setResults(simulationResults);
    setHealthScore(health);
    setInsights(gameInsights);
    setComparison(comp);
    
    // Check if they just won for the first time
    if (health >= TARGET_HEALTH_SCORE && !hasWon) {
      setHasWon(true);
    }
    
    setGameState('results');
  };

  const tryAgain = () => {
    setLastOrder([...currentOrder]);
    setAttempt(attempt + 1);
    setGameState('playing');
    setComparison(null);
  };

  const finishAttempt = () => {
    runSimulation(currentOrder);
  };

  const continueExperimenting = () => {
    // Stay in the game but allow continued experimentation
    setGameState('playing');
  };

  const renderMenu = () => (
    <ScrollView contentContainerStyle={styles.menuScrollContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.menuContainer}>
        <Text style={styles.gameTitle}>Nudge</Text>
        <Text style={styles.gameSubtitle}>The Power of Placement</Text>
        
        <View style={styles.conceptContainer}>
          <Text style={styles.conceptTitle}>Core Concept</Text>
          <Text style={styles.conceptText}>
            Position influences behavior more than personal preferences. 
            This simple principle can dramatically change outcomes.
          </Text>
        </View>
        
        <View style={styles.challengeContainer}>
          <Text style={styles.challengeTitle}>Your Challenge</Text>
          <Text style={styles.challengeText}>
            Rearrange 6 food items to achieve a health score of {TARGET_HEALTH_SCORE}+
          </Text>
          <Text style={styles.challengeText}>
            You can only change the ORDER - not the items themselves.
          </Text>
        </View>
        
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.buttonText}>Start Learning</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderGame = () => (
    <View style={styles.gameContainer}>
      <View style={styles.header}>
        <Text style={styles.attemptTitle}>Attempt #{attempt}</Text>
        <Text style={styles.headerSubtitle}>
          {attempt === 1 ? 'This is the current arrangement' : 'Drag to rearrange the food items'}
        </Text>
        <Text style={styles.goalText}>Goal: Health Score {TARGET_HEALTH_SCORE}+</Text>
      </View>
      
      <FoodOrderingInterface 
        foodOrder={currentOrder}
        onOrderChange={setCurrentOrder}
        disabled={attempt === 1}
      />
      
      {attempt === 1 && (
        <View style={styles.baselineContainer}>
          <Text style={styles.baselineText}>
            Let's see how the current arrangement performs...
          </Text>
          <TouchableOpacity style={styles.simulateButton} onPress={() => runSimulation(currentOrder)}>
            <Text style={styles.buttonText}>See Results</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {attempt > 1 && (
        <View style={styles.controlsContainer}>
          <TouchableOpacity style={styles.testButton} onPress={finishAttempt}>
            <Text style={styles.buttonText}>Test This Arrangement</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderResults = () => (
    <ScrollView style={styles.resultsContainer}>
      <SimpleResultsView 
        results={results}
        healthScore={healthScore}
        insights={insights}
        comparison={comparison}
        target={TARGET_HEALTH_SCORE}
      />
      
      <View style={styles.actionContainer}>
        {healthScore >= TARGET_HEALTH_SCORE ? (
          <View style={styles.successContainer}>
            <Text style={styles.successTitle}>Success!</Text>
            <Text style={styles.successMessage}>
              You reached the target health score of {TARGET_HEALTH_SCORE}+ in {attempt} attempts!
            </Text>
            <View style={styles.successButtons}>
              <TouchableOpacity style={styles.successButton} onPress={continueExperimenting}>
                <Text style={styles.buttonText}>Keep Experimenting</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.successButton} onPress={startGame}>
                <Text style={styles.buttonText}>Play Again</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuButton} onPress={() => setGameState('menu')}>
                <Text style={styles.buttonText}>Main Menu</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.tryAgainContainer}>
            <TouchableOpacity style={styles.tryAgainButton} onPress={tryAgain}>
              <Text style={styles.buttonText}>Try Again (Need {TARGET_HEALTH_SCORE}+)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton} onPress={() => setGameState('menu')}>
              <Text style={styles.buttonText}>Main Menu</Text>
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
      {gameState === 'playing' && renderGame()}
      {gameState === 'results' && renderResults()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  menuScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  menuContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingVertical: 40,
  },
  gameTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  gameSubtitle: {
    fontSize: 18,
    color: '#6c757d',
    marginBottom: 32,
  },
  conceptContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2196f3',
    maxWidth: 400,
    width: '100%',
  },
  conceptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565c0',
    marginBottom: 12,
  },
  conceptText: {
    fontSize: 15,
    color: '#1565c0',
    lineHeight: 22,
  },
  challengeContainer: {
    backgroundColor: '#fff3e0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#ff9800',
    maxWidth: 400,
    width: '100%',
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef6c00',
    marginBottom: 12,
  },
  challengeText: {
    fontSize: 15,
    color: '#ef6c00',
    lineHeight: 22,
    marginBottom: 8,
  },
  startButton: {
    backgroundColor: '#28a745',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  gameContainer: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  attemptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  goalText: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: '600',
  },
  baselineContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  baselineText: {
    fontSize: 16,
    color: '#495057',
    textAlign: 'center',
    marginBottom: 16,
  },
  simulateButton: {
    backgroundColor: '#007bff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  controlsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsContainer: {
    flex: 1,
    paddingTop: 50,
  },
  actionContainer: {
    padding: 24,
    alignItems: 'center',
  },
  successContainer: {
    backgroundColor: '#d4edda',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c3e6cb',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#155724',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: '#155724',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  successButtons: {
    width: '100%',
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 200,
  },
  tryAgainContainer: {
    alignItems: 'center',
    width: '100%',
  },
  tryAgainButton: {
    backgroundColor: '#007bff',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  menuButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
});
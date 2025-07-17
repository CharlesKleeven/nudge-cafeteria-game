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

        {/* <View style={styles.conceptContainer}>
          <Text style={styles.conceptTitle}>Core Concept</Text>
          <Text style={styles.conceptText}>
            The way things are arranged can sometimes affect what people choose,
            even if all the options are the same.
          </Text>
        </View> */}

        <View style={styles.challengeContainer}>
          <Text style={styles.challengeTitle}>Your Challenge</Text>
          <Text style={styles.challengeText}>
            You're the new school cafeteria manager.
          </Text>
          <Text style={styles.challengeText}>
            Parents are complaining, and the school board expects better.
          </Text>
          <Text style={styles.challengeText}>
            You can’t change what’s being served, but you can
            rearrange the order to improve student health.
          </Text>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.buttonText}>Start Learning</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderGame = () => (
    <ScrollView
      style={styles.gameContainer}
      contentContainerStyle={styles.gameScrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.attemptTitle}>Day {attempt - 1}</Text>
        <Text style={styles.headerSubtitle}>
          {attempt === 1 ? 'Observing the current cafeteria line setup' : 'Rearrange the food items to improve health scores'}
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
          <View style={styles.observationBanner}>
            <Text style={styles.observationTitle}>OBSERVATION DAY</Text>
            <Text style={styles.observationSubtitle}>Today you're just watching and learning how students currently choose</Text>
          </View>
          <Text style={styles.baselineText}>
            It's your first day as cafeteria manager.
          </Text>
          <Text style={styles.baselineSubtext}>
            The lunch rush is about to begin. You want to observe how students choose their food with the current setup...
          </Text>
          <TouchableOpacity style={styles.simulateButton} onPress={() => runSimulation(currentOrder)}>
            <Text style={styles.buttonText}>Watch the Lunch Rush</Text>
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
    </ScrollView>
  );

  const renderResults = () => (
    <ScrollView style={styles.resultsContainer}>
      <SimpleResultsView
        results={results}
        healthScore={healthScore}
        insights={insights}
        comparison={comparison}
        target={TARGET_HEALTH_SCORE}
        isFirstDay={attempt === 1}
      />

      <View style={styles.actionContainer}>
        {healthScore >= TARGET_HEALTH_SCORE ? (
          <View style={styles.successContainer}>
            <Text style={styles.successTitle}>Success!</Text>
            <Text style={styles.successMessage}>
              You reached the target health score of {TARGET_HEALTH_SCORE}+ on Day {attempt - 1}!
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
              <Text style={styles.buttonText}>
                {attempt === 1 ? 'Got it - Ready for Day 1' : `Day ${attempt} - Try New Arrangement`}
              </Text>
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
    backgroundColor: '#f4f6f8',
  },
  menuScrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
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
    color: '#1a1a1a',
    marginBottom: 8,
  },
  gameSubtitle: {
    fontSize: 18,
    color: '#4f4f4f',
    marginBottom: 32,
  },
  conceptContainer: {
    backgroundColor: '#e6f2ff', // softer blue background
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1976d2', // deep blue border
    maxWidth: 400,
    width: '100%',
  },
  conceptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d47a1', // navy blue text
    marginBottom: 12,
  },
  conceptText: {
    fontSize: 15,
    color: '#1a355e', // stronger blue-gray for better contrast
    lineHeight: 22,
  },

  challengeContainer: {
    backgroundColor: '#fff3e0', // warmer but softer cream
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#fb8c00', // deep amber border
    maxWidth: 400,
    width: '100%',
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#c14503ff', // strong amber/orange title
    marginBottom: 12,
  },
  challengeText: {
    fontSize: 15,
    color: '#614633ff', // warm dark brown for contrast and readability
    lineHeight: 22,
    marginBottom: 8,
  },

  startButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  gameContainer: {
    flex: 1,
    paddingTop: 20,
  },
  gameScrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dcdcdc',
  },
  attemptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#4f4f4f',
    marginBottom: 8,
  },
  goalText: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: '600',
  },
  baselineContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  baselineText: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  baselineSubtext: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  simulateButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  controlsContainer: {
    padding: 16,
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultsContainer: {
    flex: 1,
    paddingTop: 20,
  },
  actionContainer: {
    padding: 24,
    alignItems: 'center',
  },
  successContainer: {
    backgroundColor: '#e8f5e9',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c8e6c9',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: '#1b5e20',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  successButtons: {
    width: '100%',
    alignItems: 'center',
  },
  successButton: {
    backgroundColor: '#388e3c',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 200,
  },
  tryAgainContainer: {
    alignItems: 'center',
    width: '100%',
  },
  tryAgainButton: {
    backgroundColor: '#1565c0',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuButton: {
    backgroundColor: '#455a64',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  observationBanner: {
    backgroundColor: '#1976d2',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 0,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  observationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  observationSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
  },
});
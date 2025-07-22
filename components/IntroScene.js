import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const IntroScene = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    "Parents are complaining about poor nutrition at lunch.",
    "You're the new cafeteria manager.\n\nYou can't change what foods are served, but you can rearrange them.",
    "The school board is watching.\n\nYou have 5 days."
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.stepText}>{steps[currentStep]}</Text>
        
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentStep < steps.length - 1 ? 'Next' : 'Start Day 1'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.progress}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index <= currentStep && styles.dotActive
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 500,
    width: '100%',
    paddingHorizontal: 20,
  },
  stepText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
    paddingHorizontal: 16,
  },
  nextButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 18,
    paddingHorizontal: 36,
    borderRadius: 28,
    marginBottom: 30,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#2e7d32',
  },
});

export default IntroScene;
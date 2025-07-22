# Cafeteria Manager - Choice Architecture Game

An interactive educational game that teaches the principles of "nudging" and choice architecture through cafeteria management. 

Based on concepts from "Nudge" by Thaler & Sunstein.

## Learning Objective

Players learn how small changes in the arrangement and presentation of options can dramatically influence decision-making without restricting choice. 

The core insight: **position influences behavior more than preferences**.

## Game Overview

You're a new cafeteria manager facing parent complaints about poor student nutrition. 

You can't change what foods are served, but you can rearrange them. 

Through 5 days of experimentation, discover the power of choice architecture.

### Game Flow

1. **Intro Scene** - Story setup and context

2. **5-Day Challenge** - Arrange food items and observe student choices

3. **Performance Tracking** - Real-time feedback with colored indicators

4. **Outro Scene** - Performance-based narrative conclusion with learning reinforcement

## Architecture

### Core Files
- **`App.js`** - Main application with game state management and UI rendering
- **`gameData.js`** - Food items, position multipliers, and game constants
- **`gameLogic.js`** - Simulation engine and scoring algorithms

### Components
- **`IntroScene.js`** - Tutorial/story introduction
- **`FoodOrderingInterface.js`** - Interactive food arrangement with tap-to-swap
- **`SimpleResultsView.js`** - Results visualization with performance indicators
- **`OutroScene.js`** - Performance-based story conclusion

### Game Mechanics

**Position Multipliers** - The core nudge concept:
```javascript
POSITION_MULTIPLIERS = {
  3: [2.2, 1.0, 0.7],        // 3 items: Strong first position effect
  4: [2.0, 1.4, 1.0, 0.7],   // 4 items: Graduated effects  
  5: [2.0, 1.5, 1.0, 0.8, 0.6] // 5 items: Balanced range
}
```

**Performance Tracking**:
- **Excellent** (Green) - Outstanding nutrition improvement
- **Good** (Blue) - Solid progress 
- **Fair** (Orange) - Some improvement
- **Poor** (Red) - Needs work

## Development

### Prerequisites
- Node.js and npm
- Expo CLI

### Getting Started
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platforms
npm run android  # Android emulator/device
npm run ios      # iOS simulator/device
npm run web      # Web browser
```

### Platform Support
- **Mobile**: React Native (iOS/Android)
- **Web**: Expo Web
- **Responsive**: Optimized for mobile-first with web compatibility

## Design Philosophy

### Educational Principles
- **Learning by Doing** - Experience choice architecture firsthand
- **Safe Failure** - Experiment without real-world consequences  
- **Discovery over Instruction** - Players discover insights through gameplay
- **Emotional Engagement** - Story creates stakes that make lessons memorable

### UI Design
- **Clean & Minimal** - Focus on core interactions
- **Human-Centered** - Avoid "AI-looking" or corporate aesthetics
- **Mobile-Optimized** - Touch-friendly interactions with responsive design
- **Visual Hierarchy** - Clear progression and feedback systems

## Learning Outcomes

Players understand that:
- Small environmental changes create large behavioral shifts
- Position matters more than individual preferences in choice scenarios
- They are "choice architects" who influence outcomes through design
- "Nudging" shapes behavior without restricting freedom

## Success Metrics

The game succeeds when players:
1. Discover position effects through experimentation
2. Experience the responsibility of being a choice architect
3. Understand that arrangement influences choice without coercion
4. Feel motivated to apply these insights to real-world scenarios

## Technical Notes

- Built with Expo SDK ~53.0.17 and React Native 0.79.5
- Uses touch-friendly select-and-swap interactions (drag/drop removed for web compatibility)
- Optimized performance with minimal re-renders
- Clean codebase with no redundant styling or unused features

---

*An educational game exploring the intersection of behavioral economics, choice architecture, and user experience design.*
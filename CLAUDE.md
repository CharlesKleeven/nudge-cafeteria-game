# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context: Interactive Learning Game Development

### Company Mission & Expectations
You're working on a 1-week paid trial (30 hours total) for Serious Magic, a company that creates educational games and interactions. Your goal is to transform concepts from nonfiction books into interactive learning experiences.

### Core Design Philosophy
- **Educational First**: Games should teach through interaction, not passive consumption
- **Learning Through Experience**: Players should discover concepts themselves, not be told them
- **Failure as Teaching**: Players must be able to fail safely to truly learn
- **Simple Mechanics**: Focus on core interactions over complex visuals or physics
- **Mobile-Ready**: Final implementation will be in React/React Native

### Design Principles (Critical Guidelines)
1. **Don't Try to Teach Everything** - Use games only when they help teach better than explanation
2. **To Learn, You Must Take Risks** - If you can't fail, you can't learn
3. **Player Discovery** - Players should discover the idea, not be told it
4. **Core Mechanic = Lesson** - The main gameplay action should BE the learning objective
5. **Think, Don't Click** - Avoid hiding learning behind busy work or flashy elements

### Current Project: "Nudge" by Thaler & Sunstein
**Core Concept**: Choice Architecture - how the arrangement/presentation of options influences decisions without restricting choice.

**Book Context**: The famous "cafeteria story" where a food service director (Carolyn) discovers that simply rearranging food placement dramatically changes what students choose to eat, without removing any options.

### Success Criteria
- Players should understand that small changes in context can greatly influence choices
- The core mechanic (arranging food) should directly teach choice architecture
- Players should experience the power and responsibility of being a "choice architect"
- The game should feel substantive and repayable, not shallow

## Development Commands

### Running the Application
- `npm start` - Start Expo development server
- `npm run android` - Run on Android emulator/device
- `npm run ios` - Run on iOS simulator/device  
- `npm run web` - Run web version in browser

## Architecture

### Core Game Files
- `App.js` - Main application with game state management and UI rendering
- `gameData.js` - Static game data (food items, position multipliers, targets)
- `gameLogic.js` - Core simulation logic and score calculations

### Components
- `components/FoodOrderingInterface.js` - Select-and-swap food arrangement interface
- `components/SimpleResultsView.js` - Results visualization with bar charts
- `components/IntroScene.js` - Tutorial/introduction screen

### Data Structure
- Food items have `id`, `name`, `emoji`, `healthValue`, and `basePopularity`
- Game state tracks: `gameState`, `attempt`, `currentOrder`, `results`, scores, and win status
- Results include position effects, choice rates, and generated insights

### Behavioral Economics Core
The entire game is built around demonstrating that **position influences behavior more than preferences**. The `POSITION_MULTIPLIERS` array implements this core concept - dramatically boosting items in early positions while penalizing later positions.

## Platform Notes
- Built with Expo (~53.0.17) and React Native (0.79.5)
- Compatible with mobile and web platforms
- Uses touch-friendly select-and-swap interactions
- Optimized for mobile-first experience with scrollable views
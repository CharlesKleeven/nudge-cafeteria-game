# Nudge: The Power of Placement

**Genre:** Educational mobile game  
**Platform:** React Native  
**Target Audience:** Students, educators, behavioral economics enthusiasts

## Game Design Document

### **Concept Summary**
Players discover how simple placement changes behavior more than personal preferences. The game teaches the core principle from behavioral economics: position influences choice, demonstrating that small structural changes can dramatically shift outcomes without restricting options.

### **Core Learning Objective**
- Understand that placement influences behavior more than individual preferences
- Experience how small changes in arrangement create significant behavioral shifts
- Learn that you don't need to restrict choices to change outcomes
- Grasp the fundamental "nudge" concept from behavioral economics

### **Narrative Framing**
You are a cafeteria manager trying to improve student nutrition. Parents are complaining about unhealthy eating habits. You can't change what's served, but you can change the order of presentation. Your challenge: achieve a health score of 70+ by rearranging 6 food items.

### **Core Mechanics**

**Input:**
- Drag-and-drop to reorder 6 food items
- Single interaction: arrangement only

**Simulation:**
- Position multipliers affect choice rates:
  - Position #1: 100% boost
  - Position #2: 50% boost  
  - Position #3: 20% boost
  - Position #4: No change
  - Position #5: 20% penalty
  - Position #6: 40% penalty
- 100 simulated students make choices based on adjusted popularity

**Output:**
- Visual bar chart showing choice rates by position
- Health score calculation (target: 70+)
- Before/after comparisons between attempts
- Clear insights about position effects

### **Game Flow**

1. **Attempt #1 (Baseline)**
   - Player sees default arrangement (unhealthy items first)
   - Cannot modify - must observe results
   - Poor health score demonstrates the problem

2. **Subsequent Attempts**
   - Player can drag-and-drop to reorder items
   - Test arrangements to see immediate results
   - Compare with previous attempts
   - Iterate until target achieved

3. **Success**
   - Achieve health score of 70+
   - See attempt count and celebrate learning

### **Key Design Principles**

**Educational First:**
- Single, clear concept: position influences behavior
- Immediate visual feedback through bar charts
- Active experimentation drives learning

**Simple Mechanics:**
- One interaction: drag to reorder
- Clear objective: reach health score 70+
- No complex systems or hidden variables

**Cognitive Engagement:**
- Visual representation of choice rates
- Comparison between attempts
- Insights that explain the "why" behind results

**Mobile Optimized:**
- Touch-friendly drag-and-drop
- Scrollable results view
- Large, clear buttons

### **Food Items**
- 🍎 Apple (Health: 95, Popularity: 40)
- 🍕 Pizza (Health: 25, Popularity: 85)
- 🥗 Salad (Health: 100, Popularity: 25)
- 🥪 Sandwich (Health: 60, Popularity: 70)
- 🥤 Smoothie (Health: 90, Popularity: 35)
- 🍪 Cookies (Health: 5, Popularity: 95)

### **Why This Works**
- **Aligned mechanic and concept**: The game IS about placement
- **Structured discovery**: Players must experiment to understand the pattern
- **Clear feedback**: Visual bars show exactly how position affects choice
- **Realistic application**: Based on real cafeteria studies
- **Measurable outcome**: Concrete health score target

### **Learning Outcomes**
Players will understand:
1. Position #1 dramatically increases selection regardless of item type
2. Even popular items suffer when placed in later positions
3. Small arrangement changes create large behavioral shifts
4. You can influence outcomes without restricting choices
5. The fundamental principle behind "nudging" in behavioral economics

### **Development Notes**
- Built in React Native for mobile deployment
- Simple state management - no complex data structures
- Lightweight interactions suitable for touch screens
- Visual feedback prioritized over complex animations
- Educational effectiveness over entertainment complexity

---

*This game demonstrates the core insight from Thaler and Sunstein's "Nudge": small changes in choice architecture can have profound effects on behavior, all without restricting anyone's options.*
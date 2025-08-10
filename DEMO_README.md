# 🎮 Naffles Games Demo

## Quick Start (No Installation Required)

### Option 1: Standalone HTML Demo
Simply open `demo-standalone.html` in your web browser:

```bash
# Navigate to the frontend directory
cd naffles-frontend

# Open the demo file in your default browser
start demo-standalone.html  # Windows
open demo-standalone.html   # macOS
xdg-open demo-standalone.html # Linux
```

**Features:**
- ✅ No installation required
- ✅ Works offline
- ✅ Mock API simulation
- ✅ All 3 games included
- ✅ Responsive design
- ✅ Real-time results tracking

### Option 2: Full Next.js Demo (Requires Installation)
If you want to run the full Next.js application:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit the demo pages:
# http://localhost:3000/demo
# http://localhost:3000/games-demo
# http://localhost:3000/games/iframe/blackjack
# http://localhost:3000/games/iframe/coin-toss
# http://localhost:3000/games/iframe/rps
```

## 🎯 Demo Features

### 🃏 Blackjack
- **Crypto-themed table**: Dark gradient with crypto patterns
- **Interactive cards**: Realistic card animations and dealing
- **Betting chips**: ETH, BTC, SOL, MATIC themed chips
- **Game actions**: Hit, Stand, Double, Split buttons
- **Mock VRF**: Simulated fair randomness

### 🪙 Coin Toss
- **Moon animation**: Coin flies toward realistic moon
- **Starry background**: Twinkling stars with CSS animations
- **Pepe vs Bitcoin**: Heads (🐸) vs Tails (₿)
- **Physics simulation**: Bouncing landing animation
- **Visual feedback**: Winner highlighting and glow effects

### ✊ Rock Paper Scissors
- **Countdown timer**: 30-second selection timer
- **Gesture animations**: Animated hand movements
- **Auto-selection**: Random choice if time runs out
- **Result explanations**: Detailed win/lose explanations
- **Visual indicators**: Color-coded results

## 🔧 Technical Implementation

### Mock API System
```javascript
// Simulates VRF randomness
const mockAPI = new MockGameAPI();

// Rate limiting (10 requests/minute)
mockAPI.checkRateLimit();

// Network delay simulation (300-1000ms)
await mockAPI.simulateDelay();

// Realistic game outcomes
const result = await mockAPI.mockCoinToss('heads');
```

### Responsive Design
- **Mobile-first**: Touch-friendly buttons (48px minimum)
- **Breakpoints**: Mobile, tablet, desktop layouts
- **Performance**: Optimized animations based on device
- **Accessibility**: Reduced motion support

### Game State Management
- **Real-time updates**: Live game state tracking
- **Result history**: Last 10 game results stored
- **Error handling**: Rate limiting and network errors
- **Reset functionality**: Clean slate for testing

## 🚀 Demo Instructions

### Getting Started
1. Open `demo-standalone.html` in any modern web browser
2. Click on any game card (Blackjack, Coin Toss, RPS)
3. Follow the on-screen instructions for each game
4. View results in the results panel below

### Game Controls

#### Blackjack
- Click "Hit" to get another card
- Click "Stand" to keep current hand
- Click "Double" to double bet and get one card
- Chips are visual only (no real betting)

#### Coin Toss
- Choose "HEADS" (Pepe) or "TAILS" (Bitcoin)
- Watch the coin animation fly to the moon
- See the bouncing landing animation
- Results show immediately after landing

#### Rock Paper Scissors
- Select Rock (✊), Paper (✋), or Scissors (✌️)
- 30-second countdown timer
- Auto-selection if time runs out
- Detailed result explanations

### Demo Controls
- **Reset Demo**: Clears all results and resets games
- **Mock API**: Always active (green indicator)
- **Rate Limiting**: 10 games per minute simulation

## 🎨 Visual Features

### Crypto Theming
- **Color Palette**: Naffles brand colors (aqua, sponge, purple)
- **Typography**: Bebas Neue for headings, Roboto for body
- **Icons**: Crypto-themed emojis and symbols
- **Gradients**: Modern gradient backgrounds

### Animations
- **Framer Motion**: Smooth component transitions
- **CSS Animations**: Card flips, coin spins, gesture movements
- **Hover Effects**: Interactive button states
- **Loading States**: Skeleton screens and progress indicators

### Responsive Elements
- **Cards**: Scale based on screen size
- **Buttons**: Touch-friendly on mobile
- **Layout**: Grid system adapts to viewport
- **Typography**: Responsive font sizes

## 🔍 Testing Scenarios

### Rate Limiting
1. Play games rapidly (>10 times/minute)
2. Observe rate limit error message
3. Wait 1 minute or click "Reset Demo"

### Game Outcomes
- **Blackjack**: ~60% win rate for demo purposes
- **Coin Toss**: True 50/50 probability
- **RPS**: Fair 33% win/draw/lose distribution

### Responsive Testing
1. Resize browser window
2. Test on mobile device
3. Check touch interactions
4. Verify animations scale properly

## 📱 Browser Compatibility

### Supported Browsers
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Required Features
- ES6+ JavaScript support
- CSS Grid and Flexbox
- CSS Animations and Transitions
- Local Storage (for results)

## 🛠️ Development Notes

### File Structure
```
naffles-frontend/
├── demo-standalone.html     # Complete standalone demo
├── src/
│   ├── components/GameSection/Games/
│   │   ├── BlackjackGame.tsx
│   │   ├── CoinTossGame.tsx
│   │   ├── RockPaperScissorsGame.tsx
│   │   ├── GameShowcase.tsx
│   │   └── ...
│   ├── utils/
│   │   ├── mockGameAPI.ts
│   │   ├── gameAssetManager.ts
│   │   └── ...
│   └── app/
│       ├── demo/page.tsx
│       ├── games-demo/page.tsx
│       └── games/iframe/
└── DEMO_README.md
```

### Mock API Endpoints
- `POST /game/demo/cointoss` → `mockAPI.mockCoinToss()`
- `POST /game/demo/rock-paper-scissors` → `mockAPI.mockRPS()`
- `POST /game/demo/blackjack` → `mockAPI.mockBlackjack()`

### Customization
The standalone demo can be easily customized:
- Colors: Update CSS custom properties
- Games: Modify game logic functions
- Animations: Adjust CSS keyframes
- Layout: Change HTML structure

## 🎉 Demo Highlights

### What Works
- ✅ All 3 games fully functional
- ✅ Realistic game outcomes
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Error handling
- ✅ Rate limiting simulation
- ✅ Results tracking

### Mock Features
- 🎲 VRF randomness simulation
- ⏱️ Network delay simulation
- 🚫 Rate limiting (10 req/min)
- 📊 Realistic win/lose distributions
- 💾 Local result storage

This demo showcases the complete Naffles gaming experience without requiring any backend infrastructure!
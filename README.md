/InvestmentGame
│
├── index.html
│   └─ Main HTML file. Loads CSS and JS, defines all game elements (setup, game area, popup, podium).
│
├── /css
│   ├── base.css
│   │   └─ Global styles: body, container, buttons, hidden elements, basic colors.
│   ├── ui-popup.css
│   │   └─ Styles for popup windows, graph canvas, and popup buttons.
│   ├── ui-trade.css
│   │   └─ Stock table, info bar, buy/sell toggle, and trade buttons.
│   ├── ui-podium.css
│   │   └─ Podium layout, colors, and block styling for winners.
│   └── animations.css
│       └─ Background gradient animation, podium entry animations, and general CSS keyframes.
│
├── /js
│   ├── gameLogic.js
│   │   └─ Core game logic: player turns, stock price calculations, buying/selling, tracking money/history.
│   ├── ui-setup.js
│   │   └─ UI for player setup: player count, names, game mode selection.
│   ├── ui-trade.js
│   │   └─ UI for trading: rendering stock table, trade buttons, trade mode toggle, updating info bar.
│   ├── ui-popup.js
│   │   └─ Popup functionality: showing/hiding popups, drawing graphs, stock/player info popups.
│   ├── ui-podium.js
│   │   └─ Podium display: showing winners, scores, celebration, confetti, resetting podium.
│   ├── animations.js
│   │   └─ Optional JS animations or enhancements (if any beyond CSS animations).
│   └── main.js
│       └─ Entry point: initializes the game when DOM is loaded.
│
├── /assets
│   └─ (Optional) Images, icons, or audio assets used in the game.
│
└── README.md
    └─ Documentation of the project (you can paste this structure here!).

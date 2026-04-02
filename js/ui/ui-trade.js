// ===== UI TRADE =====

// Toggle buy/sell mode
let tradeMode = "buy"; // default
const buySellToggleContainer = document.getElementById("buySellToggle");

function renderTradeToggle() {
  buySellToggleContainer.innerHTML = `
    <button id="buyBtn" class="${tradeMode==='buy'?'active':''}">Buy</button>
    <button id="sellBtn" class="${tradeMode==='sell'?'active':''}">Sell</button>
  `;

  document.getElementById("buyBtn").onclick = () => {
    tradeMode = "buy";
    renderTradeToggle();
    renderStockTable();
  };
  document.getElementById("sellBtn").onclick = () => {
    tradeMode = "sell";
    renderTradeToggle();
    renderStockTable();
  };
}

// Render stock table
function renderStockTable() {
  const tbody = document.querySelector("#stockTable tbody");
  tbody.innerHTML = "";

  stocks.forEach(stock => {
    const row = document.createElement("tr");

    // Owned for current player
    const owned = stock.owned[players[currentPlayer]] || 0;

    row.innerHTML = `
      <td>${stock.name}</td>
      <td>${stock.price.toFixed(2)}</td>
      <td>${(stock.history[stock.history.length-1]-stock.history[stock.history.length-2] || 0).toFixed(2)}</td>
      <td>${owned}</td>
      <td>
        <div class="tradeButtons">
          ${[1,5,10,20,100].map(qty => `<button onclick="${tradeMode}Stock('${stock.name}',${qty})">${tradeMode==='buy'?'Buy':'Sell'} ${qty}</button>`).join('')}
        </div>
      </td>
    `;

    tbody.appendChild(row);
  });
}

// Buy/Sell helper functions
window.buyStock = function(stockName, qty) {
  const stock = stocks.find(s=>s.name===stockName);
  if(!stock) return;
  const player = players[currentPlayer];
  const totalCost = stock.price * qty;

  if(player.money < totalCost) {
    popup("Not enough money!");
    return;
  }

  player.money -= totalCost;
  stock.owned[player] = (stock.owned[player]||0) + qty;
  stock.totalSpent[player] = (stock.totalSpent[player]||0) + totalCost;
  renderStockTable();
  renderInfo();
};

window.sellStock = function(stockName, qty) {
  const stock = stocks.find(s=>s.name===stockName);
  if(!stock) return;
  const player = players[currentPlayer];
  const owned = stock.owned[player] || 0;

  if(owned < qty) {
    popup("Not enough stocks to sell!");
    return;
  }

  stock.owned[player] -= qty;
  const profit = stock.price * qty;
  player.money += profit;
  renderStockTable();
  renderInfo();
};

// Initialize UI
renderTradeToggle();

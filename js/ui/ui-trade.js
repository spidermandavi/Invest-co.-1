// ===== TRADE MODE TOGGLE =====
let tradeMode = "buy";

function setTradeMode(mode){
  tradeMode = mode;
  const toggleContainer = document.getElementById("buySellToggle");
  if(!toggleContainer) return;

  toggleContainer.innerHTML = `
    <button class="${mode==='buy'?'active':'inactive'}" onclick="setTradeMode('buy')">BUY</button>
    <button class="${mode==='sell'?'active':'inactive'}" onclick="setTradeMode('sell')">SELL</button>
  `;
  renderStockTable();
}

// ===== TRADE FUNCTION =====
function trade(stockIndex, amount){
  const stock = stocks[stockIndex];
  if(tradeMode==="buy") buy(stockIndex,amount);
  else{
    let sellAmount = Math.min(amount,stock.owned[currentPlayer]);
    if(sellAmount>0) sell(stockIndex,sellAmount);
    else popup("You don't own enough shares to sell this amount.");
  }
  renderStockTable();
}

// ===== STOCK TABLE =====
function renderStockTable(){
  const tbody = document.querySelector("#stockTable tbody");
  tbody.innerHTML = "";

  stocks.forEach((s,i)=>{
    const change = s.change ?? 0;
    const changeClass = change>0?"green":change<0?"red":"neutral";

    const btnColor = tradeMode==="buy"?"#4caf50":"#f44336";
    const sign = tradeMode==="buy"?"+":"-";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td onclick="toggleInfo(${i})" style="cursor:pointer;text-decoration:underline;">${s.name}</td>
      <td>$${s.price.toFixed(2)}</td>
      <td class="${changeClass}">${change.toFixed(2)}</td>
      <td>${s.owned[currentPlayer]}</td>
      <td>
        ${[1,5,10,20,100].map(n=>`<button style="background:${btnColor};color:#fff;" onclick="trade(${i},${n})">${sign}${n}</button>`).join("")}
      </td>
    `;
    tbody.appendChild(row);
  });
}

// ===== MAIN.JS =====
document.addEventListener("DOMContentLoaded", () => {
console.log("Game Ready");

// Generate initial player inputs
const playerCountSelect = document.getElementById("playerCount");
if(playerCountSelect){
const event = new Event("change");
playerCountSelect.dispatchEvent(event);
}

// ===== OVERRIDE END TURN (WITH GLOBAL FIX) =====
const originalEndTurn = endTurn;
function newEndTurn(){
const oldPrices = stocks.map(s => s.price);

```
originalEndTurn();

// Animate price changes (only if elements exist)
stocks.forEach((s, i) => {
  const el = document.getElementById(`price${i}`);
  if(!el) return;

  const change = s.price - oldPrices[i];
  if(typeof animateNumber === "function"){
    animateNumber(el, oldPrices[i], s.price, 700);
  }
  if(typeof flashChange === "function"){
    flashChange(el, change > 0);
  }
});
```

}
endTurn = newEndTurn;
window.endTurn = newEndTurn; // 🔥 CRITICAL

// ===== DIVIDENDS OVERRIDE =====
const originalApplyDividends = applyDividends;
function newApplyDividends(){
originalApplyDividends();

```
players.forEach((p, pi)=>{
  let totalDiv = 0;

  stocks.forEach(s=>{
    const owned = s.owned[pi];
    if(!owned) return;

    let value = owned * s.price;
    let rate = 0;

    if(owned>=2000) rate=0.2;
    else if(owned>=1000) rate=0.1;
    else if(owned>=500) rate=0.075;
    else if(owned>=100) rate=0.05;
    else if(owned>=50) rate=0.025;
    else if(owned>10) rate=0.005;

    totalDiv += value * rate;
  });

  if(totalDiv > 0){
    const playerEl = document.getElementById(`player${pi}`);
    if(playerEl && typeof floatingText === "function"){
      floatingText(playerEl, `+$${totalDiv.toFixed(2)}`, true);
    }
  }
});
```

}
applyDividends = newApplyDividends;
window.applyDividends = newApplyDividends; // 🔥

// ===== RANDOM EVENT OVERRIDE =====
const originalRandomEvent = randomEvent;
function newRandomEvent(){
const beforeMoney = players.map(p => p.money);

```
originalRandomEvent();

players.forEach((p, pi)=>{
  const diff = p.money - beforeMoney[pi];

  if(diff !== 0){
    const playerEl = document.getElementById(`player${pi}`);
    if(playerEl && typeof floatingText === "function"){
      floatingText(
        playerEl,
        `${diff>0?'+':'-'}$${Math.abs(diff)}`,
        diff > 0
      );
    }
  }
});
```

}
randomEvent = newRandomEvent;
window.randomEvent = newRandomEvent; // 🔥

});

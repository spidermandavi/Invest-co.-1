// ===== PLAYER INPUT GENERATOR =====
document.getElementById("playerCount").addEventListener("change", ()=>{
  const count = Number(document.getElementById("playerCount").value);
  const container = document.getElementById("playerNamesContainer");
  container.innerHTML = "";
  for(let i=0;i<count;i++){
    const div = document.createElement("div");
    div.innerHTML = `<label>Player ${i+1} Name: <input id="playerName${i}" placeholder="Player ${i+1}"/></label>`;
    container.appendChild(div);
  }
});

// ===== PLAYER INFO =====
function showPlayerInfo(playerIndex){
  const p = players[playerIndex];
  let total = p.money;
  let stockDetails = "";

  stocks.forEach(s=>{
    total += s.owned[playerIndex]*s.price;
    if(s.owned[playerIndex]>0){
      const avg = (s.totalSpent[playerIndex]/s.owned[playerIndex]).toFixed(2);
      const value = (s.owned[playerIndex]*s.price).toFixed(2);
      stockDetails += `${s.name}: ${s.owned[playerIndex]} shares, avg $${avg}, current $${value}<br>`;
    }
  });

  const lastWorth = p.history[p.history.length-1];
  const changePercent = (((total-lastWorth)/lastWorth)*100).toFixed(2);

  popup(`<b>${p.name}</b><br><br>Total Worth: $${total.toFixed(2)}<br>Change: ${changePercent}%<br><br><b>Stocks:</b><br>${stockDetails||"None"}<br><br><b>Worth History:</b>`);
  setTimeout(()=>drawGraph(p.history,p.color),50);
});

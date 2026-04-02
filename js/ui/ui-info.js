// ===== INFO BAR =====

function renderInfo() {
  const infoBar = document.getElementById("infoBar");
  if (!infoBar) return;

  const player = players[currentPlayer];
  const playerColor = player.color;
  const nameColor = isColorDark(playerColor) ? "#fff" : playerColor;

  infoBar.innerHTML = `
    Turn ${turn} | 
    <span style="color:${nameColor}">${player.name}</span> | 
    Money: $${player.money.toFixed(2)} 
    <button id="infoBtn">Info</button>
  `;

  infoBar.style.background = playerColor;

  document.getElementById("infoBtn").onclick = () => showPlayerInfo(currentPlayer);
}

// ===== PLAYER INFO POPUP =====
function showPlayerInfo(playerIndex) {
  const player = players[playerIndex];
  let html = `<b>${player.name}</b><br>Money: $${player.money.toFixed(2)}<br>Stocks:<br>`;

  stocks.forEach(s => {
    const owned = s.owned[playerIndex] || 0;
    if (owned > 0) html += `${s.name}: ${owned} shares<br>`;
  });

  popup(html);
}

// ===== HELPER =====
function isColorDark(color) {
  let c = color.replace("#","");
  if(c.length === 3) c = c.split("").map(x => x+x).join("");
  const r = parseInt(c.substr(0,2),16);
  const g = parseInt(c.substr(2,2),16);
  const b = parseInt(c.substr(4,2),16);
  const brightness = (r*299 + g*587 + b*114)/1000;
  return brightness < 140;
}

// Make global
window.renderInfo = renderInfo;
window.showPlayerInfo = showPlayerInfo;

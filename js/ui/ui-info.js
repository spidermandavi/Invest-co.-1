// ===== INFO BAR =====
function renderInfoBar() {
  const infoBar = document.getElementById("infoBar");
  if (!infoBar || !players || players.length === 0) return;

  const player = players[currentPlayer];
  const playerColor = player.color;
  const nameColor = isColorDark(playerColor) ? "#ffffff" : playerColor;

  infoBar.innerHTML = `
    Turn ${turn} | <span style="color:${nameColor}">${player.name}</span> | Money: $${player.money.toFixed(2)}
    <button id="infoBtn" style="margin-left:20px;">Info</button>
  `;
  infoBar.style.background = playerColor;

  const btn = document.getElementById("infoBtn");
  if (btn) btn.onclick = () => showPlayerInfo(currentPlayer);
}

// ===== SHOW PLAYER INFO POPUP =====
function showPlayerInfo(index) {
  if (!players || !players[index]) return;
  const p = players[index];
  let html = `<b>${p.name} Info</b><br>`;
  html += `Money: $${p.money.toFixed(2)}<br>`;
  html += `Stocks Owned:<br>`;

  stocks.forEach(s => {
    const owned = s.owned?.[index] || 0;
    if (owned > 0) html += `${s.name}: ${owned} shares ($${s.price.toFixed(2)} each)<br>`;
  });

  html += '<canvas id="graphCanvas" style="width:100%;height:200px;"></canvas><br><button id="popupOk">OK</button>';
  popup(html);

  // Draw player's history
  setTimeout(() => {
    const canvas = document.getElementById("graphCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const padding = 40;
    const w = canvas.clientWidth - padding * 2;
    const h = canvas.clientHeight - padding * 2;

    const history = p.history;
    const max = Math.max(...history);
    const min = Math.min(...history);

    // Draw axes
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + h);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding, padding + h);
    ctx.lineTo(padding + w, padding + h);
    ctx.stroke();

    // Y labels
    ctx.fillStyle = "#aaa";
    ctx.font = "12px Arial";
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      const value = min + (i / steps) * (max - min);
      const y = padding + h - (i / steps) * h;
      ctx.fillText(value.toFixed(0), 2, y + 3);

      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + w, y);
      ctx.stroke();
    }

    // Draw history line
    ctx.strokeStyle = player.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    history.forEach((val, i) => {
      const x = padding + (i / (history.length - 1)) * w;
      const y = padding + h - ((val - min) / (max - min)) * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }, 50);
}

// ===== COLOR HELPER =====
function isColorDark(color) {
  let c = color.replace("#", "");
  if (c.length === 3) c = c.split("").map(x => x + x).join("");
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 140;
}

// ===== INFO BUTTON FOR COMPARISON =====
function showAllPlayersComparison() {
  let html = "<b>Player Worth Comparison</b><br><br>";
  players.forEach((p, i) => {
    let total = p.money;
    stocks.forEach(s => total += (s.owned[i] || 0) * s.price);
    html += `${p.name}: $${total.toFixed(2)}<br>`;
  });
  html += '<canvas id="graphCanvas" style="width:100%;height:250px;"></canvas><br><button id="popupOk">OK</button>';
  popup(html);

  // Draw combined graph
  setTimeout(() => {
    const canvas = document.getElementById("graphCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const padding = 40;
    const w = canvas.clientWidth - padding * 2;
    const h = canvas.clientHeight - padding * 2;

    // Find global min/max
    let min = Infinity, max = -Infinity;
    players.forEach((p) => p.history.forEach(v => { if(v>max) max=v; if(v<min) min=v; }));
    if(max===min){ max+=1; min-=1; }

    // Draw axes
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(padding, padding + h);
    ctx.lineTo(padding + w, padding + h);
    ctx.stroke();

    const colors = ["#4caf50","#f44336","#2196f3","#ff9800","#9c27b0","#00bcd4"];
    players.forEach((p, pi) => {
      ctx.strokeStyle = colors[pi % colors.length];
      ctx.lineWidth = 2;
      ctx.beginPath();
      p.history.forEach((val,i) => {
        const x = padding + (i/(p.history.length-1))*w;
        const y = padding + h - ((val-min)/(max-min))*h;
        if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      });
      ctx.stroke();
    });
  },50);
}

// ===== GLOBAL =====
window.renderInfoBar = renderInfoBar;
window.showPlayerInfo = showPlayerInfo;
window.showAllPlayersComparison = showAllPlayersComparison;
window.isColorDark = isColorDark;

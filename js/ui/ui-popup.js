// ===== POPUP =====
function popup(html) {
  const popupEl = document.getElementById("popup");
  const popupContent = document.getElementById("popupContent");

  popupContent.innerHTML = html + '<canvas id="graphCanvas" style="width:100%;height:200px;"></canvas><br><button id="popupOk">OK</button>';
  popupEl.classList.remove("hidden");

  document.getElementById("popupOk").onclick = () => {
    popupEl.classList.add("hidden");
  };
}

// ===== CONFIRM END GAME =====
function confirmEndGame() {
  const popupHtml = `
    <b>Are you sure you want to end the game?</b><br><br>
    <button onclick="endGame(true)">Yes, End Game</button>
    <button onclick="document.getElementById('popup').classList.add('hidden')">Cancel</button>
  `;
  popup(popupHtml);
}

// ===== COMPARE ALL PLAYERS BUTTON =====
document.querySelector(".infoContainer button").onclick = () => {
  // Build popup HTML
  let html = "<b>Player Worth Comparison</b><br><br>";
  players.forEach((p, i) => {
    let totalWorth = p.money;
    stocks.forEach(s => totalWorth += s.owned[i] * s.price);
    html += `${p.name}: $${totalWorth.toFixed(2)}<br>`;
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

    // Find global min/max across all players
    let max = -Infinity, min = Infinity;
    players.forEach(p => p.history.forEach(val => {
      if (val > max) max = val;
      if (val < min) min = val;
    }));
    if (max === min) { max += 1; min -= 1; }

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

    // Player colors
    const colors = ["#4caf50", "#f44336", "#2196f3", "#ff9800", "#9c27b0", "#00bcd4"];

    // Animate each player's history
    players.forEach((p, pi) => {
      let progress = 0;
      function animate() {
        ctx.strokeStyle = colors[pi % colors.length];
        ctx.lineWidth = 2;
        ctx.beginPath();
        const maxIndex = Math.floor(progress * (p.history.length - 1));
        for (let i = 0; i <= maxIndex; i++) {
          const x = padding + (i / (p.history.length - 1)) * w;
          const y = padding + h - ((p.history[i] - min) / (max - min)) * h;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        progress += 0.04;
        if (progress <= 1) requestAnimationFrame(animate);
      }
      animate();
    });

  }, 50);
};

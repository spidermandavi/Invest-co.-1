// ===== PODIUM =====
function showPodium(scores) {
  const gameEl = document.getElementById("game");
  const podiumEl = document.getElementById("podium");
  if (!gameEl || !podiumEl) return;

  gameEl.classList.add("hidden");
  podiumEl.classList.remove("hidden");

  document.getElementById("firstPlace").innerText = scores[0]?.name || "";
  document.getElementById("secondPlace").innerText = scores[1]?.name || "";
  document.getElementById("thirdPlace").innerText = scores[2]?.name || "";

  const msg = scores.map(s => `${s.name}: Earned $${s.earned.toFixed(2)} | Total $${s.total.toFixed(2)}`).join("<br>");
  popup(`<b>Game Over!</b><br>Winner: ${scores[0]?.name || ""}<br><br>${msg}`);

  launchConfetti();
}

// ===== RESET PODIUM =====
function resetPodium() {
  resetGame();
  const podiumEl = document.getElementById("podium");
  if (podiumEl) podiumEl.classList.add("hidden");
}

// ===== CONFETTI =====
function launchConfetti() {
  const confettiContainer = document.createElement("div");
  confettiContainer.style.position = "fixed";
  confettiContainer.style.top = "0";
  confettiContainer.style.left = "0";
  confettiContainer.style.width = "100%";
  confettiContainer.style.height = "100%";
  confettiContainer.style.pointerEvents = "none";
  confettiContainer.style.overflow = "hidden";
  confettiContainer.style.zIndex = "2000";
  document.body.appendChild(confettiContainer);

  const colors = ["#FFD700", "#C0C0C0", "#CD7F32", "#f44336", "#4caf50", "#2196f3"];
  const total = 150;

  for (let i = 0; i < total; i++) {
    const conf = document.createElement("div");
    const size = Math.random() * 8 + 4;
    conf.style.position = "absolute";
    conf.style.width = conf.style.height = size + "px";
    conf.style.background = colors[Math.floor(Math.random() * colors.length)];
    conf.style.left = Math.random() * window.innerWidth + "px";
    conf.style.top = "-10px";
    conf.style.opacity = Math.random() + 0.5;
    conf.style.transform = `rotate(${Math.random() * 360}deg)`;
    conf.style.borderRadius = "50%";
    conf.style.transition = `transform 3s ease, top 3s ease, opacity 3s ease`;
    confettiContainer.appendChild(conf);

    setTimeout(() => {
      conf.style.top = window.innerHeight + "px";
      conf.style.transform = `rotate(${Math.random() * 720}deg)`;
      conf.style.opacity = 0;
    }, 50);
  }

  // Remove container after animation
  setTimeout(() => document.body.removeChild(confettiContainer), 3500);
}

// Make global
window.showPodium = showPodium;
window.resetPodium = resetPodium;
window.launchConfetti = launchConfetti;

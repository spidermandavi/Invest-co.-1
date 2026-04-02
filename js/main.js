// ===== MAIN.JS =====
document.addEventListener("DOMContentLoaded", () => {
  console.log("Game Ready");

  // Trigger initial player setup (populate input fields, etc.)
  const playerCountSelect = document.getElementById("playerCount");
  const event = new Event("change");
  playerCountSelect.dispatchEvent(event);
});

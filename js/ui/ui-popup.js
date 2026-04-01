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

function confirmEndGame() {
  const popupHtml = `
    <b>Are you sure you want to end the game?</b><br><br>
    <button onclick="endGame(true)">Yes, End Game</button>
    <button onclick="document.getElementById('popup').classList.add('hidden')">Cancel</button>
  `;
  popup(popupHtml);
}

// ===== INFO BAR =====
function renderInfoBar(){
  const infoBar = document.getElementById("infoBar");
  const playerColor = players[currentPlayer].color;
  const nameColor = isColorDark(playerColor) ? "#ffffff" : playerColor;

  infoBar.innerHTML = `
    Turn ${turn} | <span style="color:${nameColor}">${players[currentPlayer].name}</span> | Money: $${players[currentPlayer].money.toFixed(2)}
    <button id="infoBtn" style="margin-left:20px;">Info</button>
  `;
  infoBar.style.background = playerColor;
  document.getElementById("infoBtn").onclick = ()=>showPlayerInfo(currentPlayer);
}

// ===== HELPER =====
function isColorDark(color){
  let c = color.replace("#","");
  if(c.length===3) c=c.split("").map(x=>x+x).join("");
  const r=parseInt(c.substr(0,2),16);
  const g=parseInt(c.substr(2,2),16);
  const b=parseInt(c.substr(4,2),16);
  const brightness = (r*299+g*587+b*114)/1000;
  return brightness<140;
}

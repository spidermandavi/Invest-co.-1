// ===== GAME STATE =====
let players = [];
let currentPlayer = 0;
let turn = 1;
let actionTracker = {};

let gameMode = "turns";
let modeValue = 20;

let stocks = [
  { name: "CDJ", price: 10, volatility: 0.20, owned: {}, totalSpent: {}, desc: "Clothing company, medium risk.", history: [10] },
  { name: "Panda & Co.", price: 10, volatility: 0.12, owned: {}, totalSpent: {}, desc: "Stable bank.", history: [10] },
  { name: "GRAY-BOX", price: 10, volatility: 0.10, owned: {}, totalSpent: {}, desc: "Safe insurance.", history: [10] },
  { name: "BA", price: 10, volatility: 0.40, owned: {}, totalSpent: {}, desc: "Very volatile sports brand.", history: [10] },
  { name: "SEED", price: 10, volatility: 0.25, owned: {}, totalSpent: {}, desc: "Agriculture, event-driven.", history: [10] },
  { name: "EXTRA FRESH", price: 10, volatility: 0.20, owned: {}, totalSpent: {}, desc: "Food, steady growth.", history: [10] },
  { name: "CodeForU", price: 10, volatility: 0.20, owned: {}, totalSpent: {}, desc: "Tech, medium risk.", history: [10] },
  { name: "KEPL3", price: 8.21, volatility: 0.20, owned: {}, totalSpent: {}, desc: "Machinery, medium risk.", history: [10] },
  { name: "KLBN4", price: 3.94, volatility: 0.10, owned: {}, totalSpent: {}, desc: "Paper, low risk.", history: [10] },
  { name: "ALUP4", price: 10.99, volatility: 0.12, owned: {}, totalSpent: {}, desc: "Energy, low risk.", history: [10] },
  { name: "SAPR4", price: 8.51, volatility: 0.15, owned: {}, totalSpent: {}, desc: "Water, low medium risk", history: [10] },
  { name: "TASA4", price: 4.88, volatility: 0.35, owned: {}, totalSpent: {}, desc: "Guns, high volatility", history: [10] },
  { name: "POMO4", price: 6.20, volatility: 0.15, owned: {}, totalSpent: {}, desc: "Buses, low medium risk.", history: [10] },
  { name: "GRND3", price: 4.74, volatility: 0.10, owned: {}, totalSpent: {}, desc: "Shoes, low risk.", history: [10] },
  { name: "ROMI3", price: 7.15, volatility: 0.08, owned: {}, totalSpent: {}, desc: "Machinery, low risk", history: [10] },
  { name: "SOJA3", price: 7.13, volatility: 0.40, owned: {}, totalSpent: {}, desc: "Seeds, high volatility.", history: [10] },
  { name: "FIQE3", price: 7.01, volatility: 0.25, owned: {}, totalSpent: {}, desc: "Internet, medium risk.", history: [10] },
  { name: "BBSE3", price: 34.81, volatility: 0.15, owned: {}, totalSpent: {}, desc: "Insurance, low medium risk.", history: [10] },
  { name: "CXSE3", price: 18.35, volatility: 0.15, owned: {}, totalSpent: {}, desc: "Insurance, low medium risk.", history: [10] },
  { name: "BRBI11", price: 19.50, volatility: 0.28, owned: {}, totalSpent: {}, desc: "Investment Bank, medium risk.", history: [10] },
  { name: "BMGB4", price: 5, volatility: 0.17, owned: {}, totalSpent: {}, desc: "Bank, low medium risk.", history: [10] },
  { name: "CMIN3", price: 4.95, volatility: 0.30, owned: {}, totalSpent: {}, desc: "Mining, high medium risk.", history: [10] },
  { name: "IFCM3", price: 1, volatility: 0.35, owned: {}, totalSpent: {}, desc: "E-Commerce, low high risk.", history: [10] },
  { name: "PETR3", price: 53.91, volatility: 0.50, owned: {}, totalSpent: {}, desc: "Petrolium, ultra high risk.", history: [10] },
  { name: "PRIO3", price: 66.21, volatility: 0.50, owned: {}, totalSpent: {}, desc: "Petrolium, ultra high risk.", history: [10] }
];

let playerColors = ["#ff4c4c","#4caf50","#2196f3","#ff9800"];

// ===== GAME FUNCTIONS =====
function startGame() {
  const count = Number(document.getElementById("playerCount").value);
  gameMode = document.getElementById("gameMode").value;
  modeValue = Number(document.getElementById("modeValue").value) || 20;

  players = [];
  for (let i = 0; i < count; i++) {
    const nameInput = document.getElementById(`playerName${i}`);
    const name = nameInput && nameInput.value ? nameInput.value : `Player ${i+1}`;
    players.push({ money:1000, name, color:playerColors[i]||"#fff", history:[1000] });
  }

  stocks.forEach(s=>{
    s.history=[s.price];
    players.forEach((_,i)=>{
      s.owned[i]=0;
      s.totalSpent[i]=0;
    });
  });

  document.getElementById("setup").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");

  currentPlayer = 0;
  turn = 1;
  resetTurn();

  setTradeMode("buy");
  renderStockTable();
  renderInfoBar();
}

function resetTurn(){ actionTracker = {}; }

function buy(i,amount){
  if(actionTracker[i]==="sell") return popup("Cannot buy and sell same stock in one turn!");
  const s=stocks[i];
  const cost=s.price*amount;
  if(players[currentPlayer].money<cost) return popup("Not enough money");
  players[currentPlayer].money-=cost;
  s.owned[currentPlayer]+=amount;
  s.totalSpent[currentPlayer]+=cost;
  actionTracker[i]="buy";
  updatePlayerHistory(currentPlayer);
  renderStockTable();
  renderInfoBar();
}

function sell(i,amount=1){
  if(actionTracker[i]==="buy") return popup("Cannot buy and sell same stock in one turn!");
  const s=stocks[i];
  const ownedAmount=Math.min(amount,s.owned[currentPlayer]);
  if(ownedAmount<=0) return popup("No stocks to sell");
  s.owned[currentPlayer]-=ownedAmount;
  players[currentPlayer].money+=s.price*ownedAmount;
  const avg=s.totalSpent[currentPlayer]/(s.owned[currentPlayer]+ownedAmount);
  s.totalSpent[currentPlayer]-=avg*ownedAmount;
  actionTracker[i]="sell";
  updatePlayerHistory(currentPlayer);
  renderStockTable();
  renderInfoBar();
}

function updatePlayerHistory(pi){
  let total=players[pi].money;
  stocks.forEach(s=>total+=s.owned[pi]*s.price);
  players[pi].history.push(total);
}

function endTurn(){
  currentPlayer++;
  if(currentPlayer>=players.length){
    currentPlayer=0;
    turn++;
    updateMarket();
    applyDividends();
    randomEvent();
    players.forEach((p,i)=>updatePlayerHistory(i));
  }
  resetTurn();
  if(players[currentPlayer].money<0) forceSell();
  checkWin();
  renderStockTable();
  renderInfoBar();
}

function updateMarket(){
  stocks.forEach(s=>{
    const change=(Math.random()*2-1)*s.volatility*s.price;
    s.price=Math.max(1, Math.min(500,s.price+change));
    s.change=change;
    s.history.push(s.price);
  });
}

function applyDividends(){
  players.forEach((p,pi)=>{
    stocks.forEach(s=>{
      const owned=s.owned[pi];
      let rate=0;
      if(owned>=2000) rate=0.2;
      else if(owned>=1000) rate=0.1;
      else if(owned>=500) rate=0.075;
      else if(owned>=100) rate=0.05;
      else if(owned>=50) rate=0.025;
      else if(owned>10) rate=0.01;
      p.money+=owned*s.price*rate;
    });
  });
}

function flashPlayer(index,color="#ffff00",duration=800){
  const el=document.getElementById(`player${index}`);
  if(!el) return;
  const oldBg=el.style.backgroundColor;
  el.style.backgroundColor=color;
  setTimeout(()=>el.style.backgroundColor=oldBg||"",duration);
}

function randomEvent(){
  if(turn<10) return;
  if(Math.random()>0.2) return;
  const events=[
    {text:"Crashed car", value:-300, weight:1},
    {text:"Gift", value:200, weight:3},
    {text:"Repairs", value:-100, weight:2},
    {text:"Clothes", value:-50, weight:4},
    {text:"Phone broken", value:-240, weight:2},
    {text:"Birthday", value:75, weight:3},
    {text:"Furniture", value:-300, weight:1},
    {text:"Flowers", value:-20, weight:5},
    {text:"Tax return", value:150, weight:3}
  ];
  let weighted=[];
  events.forEach(e=>{for(let w=0;w<e.weight;w++) weighted.push(e)});
  const i=Math.floor(Math.random()*players.length);
  const player=players[i];
  const e=weighted[Math.floor(Math.random()*weighted.length)];
  player.money+=e.value;
  flashPlayer(i,e.value>=0?"#4caf50":"#ff4c4c",1000);
  popup(`Event for ${player.name}: ${e.text}\n${e.value>=0?"+":""}$${e.value}`);
}

function checkWin(){
  if(gameMode==="turns"&&turn>modeValue) return endGame(true);
  if(gameMode==="money"&&players.some(p=>p.money>=modeValue)) return endGame(true);
}

function endGame(force=false){
  if(force){
    const scores=players.map((p,i)=>{
      let total=p.money;
      stocks.forEach(s=>total+=s.owned[i]*s.price);
      return {total, earned: total-1000, name:p.name, color:p.color, history:p.history};
    });
    scores.sort((a,b)=>b.total-a.total);
    showPodium(scores);
  } else resetGame();
}

function resetGame(){
  document.getElementById("setup").classList.remove("hidden");
  document.getElementById("game").classList.add("hidden");
  players=[]; currentPlayer=0; turn=1; actionTracker={};
}

function forceSell(){
  const p=players[currentPlayer];
  const totalStocks=stocks.reduce((acc,s)=>acc+s.owned[currentPlayer],0);
  if(totalStocks===0) return;
  popup(`${p.name} has negative money! Selling stocks to cover debt.`);
  stocks.forEach((s,i)=>{
    while(s.owned[currentPlayer]>0&&p.money<0) sell(i,1);
  });
}

// ===== GLOBAL =====
window.startGame=startGame;
window.endTurn=endTurn;
window.endGame=endGame;
window.resetGame=resetGame;

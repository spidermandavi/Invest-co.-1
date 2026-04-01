// ===== GRAPH DRAWER =====
function drawGraph(data, color = "#4caf50") {
  const canvas = document.getElementById("graphCanvas");
  if (!canvas || !data || data.length < 2) return;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  ctx.setTransform(1,0,0,1,0,0);
  ctx.scale(dpr,dpr);

  const padding = 40;
  const w = canvas.clientWidth - padding*2;
  const h = canvas.clientHeight - padding*2;

  let max = Math.max(...data);
  let min = Math.min(...data);
  if(max===min){ max+=1; min-=1; }

  // axes
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, padding+h);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(padding, padding+h);
  ctx.lineTo(padding+w, padding+h);
  ctx.stroke();

  // y labels
  ctx.fillStyle = "#aaa";
  ctx.font = "12px Arial";
  const steps = 4;
  for(let i=0;i<=steps;i++){
    const value = min + (i/steps)*(max-min);
    const y = padding+h-(i/steps)*h;
    ctx.fillText(value.toFixed(0), 2, y+3);

    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(padding+w, y);
    ctx.stroke();
  }

  // animated line
  let progress = 0;
  function animate(){
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const maxIndex = Math.floor(progress*(data.length-1));
    for(let i=0;i<=maxIndex;i++){
      const x = padding + (i/(data.length-1))*w;
      const y = padding + h - ((data[i]-min)/(max-min))*h;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
    progress += 0.04;
    if(progress<=1) requestAnimationFrame(animate);
  }
  animate();
}

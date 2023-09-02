importScripts("https://cdn.jsdelivr.net/gh/0-harshit-0/Utility-HTML5Canvas@master/src/vector.min.js", "shapes.js");

let scoreCtx, scoreShape;
const starStore = new Array();

// ======================= stars classes =========================

class Stars {
  constructor(x, y, vx, vy, radius) {
    this.pos = new Vector2D(x, y);
    this.vel = new Vector2D(vx, vy);
    this.r = radius;
    this.color = "rgb(255, 255, 255)";
  }
  draw() {
    scoreShape.ellipse({x: this.pos.x, y: this.pos.y, radius: this.r});
    scoreShape.fill({color: this.color});
  }
  move() {
    this.pos = Vector2D.add(this.pos, this.vel);
    this.draw();
  }
}


function statsBar(canvasWidth, canvasHeight, ship) {
  //life
  if (lifeMeter > ship.life) {
    lifeMeter--;
  }
  scoreShape.line({x: 10, y: 10, x1: lifeMeter, y1: 10, cap: 'round'});
  scoreShape.stroke({color: "rgba(0, 250, 250, 1)", width: 10});

  if (ship.life < 10) {
    cancelAnimationFrame(inter);
    ship.life = 100;
    alert("RIP Captain...");
    location.assign("/");
  }

  //elixir
  //elixirMeter = Vector2D.constrain(elixirMeter, 0, ship.elixir*10);

  if (elixirMeter < ship.elixir) {
    elixirMeter++;
  }
  scoreShape.line({x: canvasWidth/2+10, y: 10, x1: canvasWidth/2+10 + elixirMeter, y1: 10, cap: 'round'});
  scoreShape.stroke({color: "rgba(0, 250, 0, 1)", width: 10}); 

  if (ship.elixir > 100) {
    ship.super = true;
    elixirMeter = 0;
    ship.elixir = 0;

    // super only last for 5 seconds
    setTimeout(()=> {
      ship.super = false;
    }, 5000);
  }
  
}
function scoreCount(canvasWidth, canvasHeight) {
  let size = 30;
  scoreCtx.fillStyle = "rgb(250, 250, 0)";
  scoreCtx.font = `${size}px arial`;

  scoreCtx.fillText(`${score}`, canvasWidth/2 - size/2, canvasHeight-size);

  if (score >= 50) {
    cancelAnimationFrame(inter);
    alert("congratulation captain you did it...");
    location.assign("/");
  }
}
function createStars(canvasWidth, canvasHeight) {
  for (let i = 0; i < 1000; i++) {
    let radius = Math.random();
    let x = Math.random() * (canvasWidth - radius * 2);
    let y = Math.random() * (canvasHeight - radius * 2);
    let dx = (Math.random() - 0.5) / 5;
    let dy = (Math.random() - 0.5) / 5;
    starStore.push(new Stars(x, y, dx, dy, radius));
  }
}
function scoreAnimation(canvasWidth, canvasHeight, ship) {
  scoreCtx.clearRect(0, 0, canvasWidth, canvasHeight);

  //statsBar(canvasWidth, canvasHeight, ship);
  //scoreCount(canvasWidth, canvasHeight);
  //console.log(score)

  for (let k = starStore.length-1; k >= 0; k--) {
    starStore[k].move();

    if (starStore[k].pos.y >= canvasHeight || starStore[k].pos.y < 0 ||
      starStore[k].pos.x >= canvasWidth || starStore[k].pos.x <= 0) {
      starStore.splice(k, 1);
    }
  }
}

onmessage = (evt) => {
  let canvas = evt.data.canvas;
  scoreCtx = canvas.getContext("2d");
  scoreShape = new Shapes({canvas, context: scoreCtx});

  let {canvasWidth, canvasHeight, ship} = evt.data;
  
  createStars(canvasWidth, canvasHeight);
  function render(time) {
    scoreAnimation(canvasWidth, canvasHeight, ship);
    requestAnimationFrame(render);
  }
  render()
};

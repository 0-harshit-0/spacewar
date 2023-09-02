importScripts("https://cdn.jsdelivr.net/gh/0-harshit-0/Utility-HTML5Canvas@master/src/vector.min.js", "shapes.js");


const colorPalette = ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)", "rgb(255, 255, 0)", "rgb(0, 255, 255)", "rgb(255, 0, 255)"];
let config, ship, center, invaderCtx, invaderShape, invade = true;
const invaderStore = new Array();


// ===================== invaders classes ========================

class Invaders {
  constructor(x, y, life, mass, damage, speed, elixir, color) {
    this.life = life;
    this.m = mass;
    this.speed = speed;
    this.elixir = elixir;

    this.pos = new Vector2D(x, y);
    this.dir = new Vector2D();
    this.vel = new Vector2D();

    this.damage = damage;

    this.c = color;
  }
  draw(theta) {
    invaderShape.polygon({x: this.pos.x, y: this.pos.y, length: this.life, faces: this.m, rotation: theta});
    invaderShape.fill({color: this.c});
  }
  move() {
    this.dir = Vector2D.sub(center, this.pos);
    this.vel = Vector2D.limit(this.speed, this.dir);
    this.pos = Vector2D.add(this.pos, this.vel);

    let theta = Math.atan2(this.vel.y, this.vel.x);
    this.draw(theta);
  }
}

class SmartInvaders extends Invaders {
  constructor(x, y, life, mass, damage, speed, elixir, color) {
    super(x, y, life, mass, damage, speed, elixir, color);

    this.vel = new Vector2D(2*(Math.random()-0.5), 2*(Math.random()-0.5));
    this.acc = new Vector2D();
  }
  static attract(mouse, p, g) {
    let dir = Vector2D.sub(mouse.pos, p.pos);
    let d = Vector2D.magnitude(dir);
    d = Vector2D.constrain(d, 5, 10);
    dir = Vector2D.normalize(dir);
    let force = (g * p.m * mouse.m) / (d * d);
    dir = Vector2D.mul(dir, force);

    return Vector2D.div(dir, mouse.m);
  }
  move() {
    this.acc = SmartInvaders.attract(ship, this, 0.15);
    this.vel = Vector2D.add(this.acc, this.vel);
    this.vel = Vector2D.limit(2, this.vel);

    this.pos = Vector2D.add(this.pos, this.vel);

    let theta = Math.atan2(this.vel.y, this.vel.x);
    this.draw(theta);
  }
}




function createInvaders(canvasWidth, canvasHeight, gameMode) {
  let ic = config.invaders.type;

  let dis = Math.floor(Math.max(canvasWidth, canvasHeight));
  let theta = Math.random() * 360;
  let xp = Math.floor((canvasWidth/2)+(Math.cos(theta*Math.PI/180) * dis));
  let yp = Math.floor((canvasHeight/2)+(Math.sin(theta*Math.PI/180) * dis));
  let radii = Math.floor(Math.random() * (canvasWidth+canvasHeight)/100)+10;
  let colour = colorPalette[Math.floor(Math.random() * colorPalette.length)];
  
  //x, y, life, mass, damage, speed, color
  invaderStore.push(new Invaders(xp, yp, radii, ic["1"].mass, ic["1"].damage, ic["1"].speed, ic["1"].elixir, colour));
  if (gameMode != "easy") {
    invaderStore.push(new SmartInvaders(xp, yp, radii, ic["1"].mass, ic["1"].damage, ic["1"].speed, ic["1"].elixir, colour));
  }
}

function invaderAnimation(canvasWidth, canvasHeight, gameMode) {
  //invaderCtx.fillStyle = "rgba(0, 0, 0, 0.05)";
  //invaderCtx.fillRect(0, 0, canvasWidth, canvasHeight);
  invaderCtx.clearRect(0, 0, canvasWidth, canvasHeight);

  if (invade) {
    invade = false;
    createInvaders(canvasWidth, canvasHeight, gameMode);

    setTimeout(()=> {
      invade = true;
    }, config.invaders.invaderTime);
  }

  for(let i = invaderStore.length-1; i >= 0; i--) {
    let x = invaderStore[i];

    if (x.life >= 10) {
      x.move();
    }else {
      //score++;
      ship.elixir += x.elixir;
      invaderStore.splice(i, 1);
    }

    // if distance of invader and ship(+ radius*2) is 0 then *crashed*
    if (Vector2D.distance(x.pos, ship.pos) <= ship.r*2) {
      ship.life -= x.damage;
      invaderStore.splice(i, 1);
    }
  }
}


onmessage = (evt) => {
  let canvas = evt.data.canvas;
  invaderCtx = canvas.getContext("2d");
  invaderShape = new Shapes({canvas, context: invaderCtx});

  let {canvasWidth, canvasHeight, gameMode} = evt.data;
  config = evt.data.config;
  ship = evt.data.ship;
  center = evt.data.center;

  function render(time) {
    invaderAnimation(canvasWidth, canvasHeight, gameMode);
    requestAnimationFrame(render);
  }
  render()
};

// reloadTime: milliseconds
const playerWorker = new Worker("player.js");
const invadersWorker = new Worker("invaders.js");
const starsWorker = new Worker("stars.js");

const playerCanvas = document.querySelector("#players");
//const playerCtx = playerCanvas.getContext("2d");
//const playerShape = new Shapes({canvas: playerCanvas, context: playerCtx});

const bulletCanvas = document.querySelector("#bullets");
const bulletCtx = bulletCanvas.getContext("2d");
const bulletShape = new Shapes({canvas: bulletCanvas, context: bulletCtx});
const bulletsStore = new Array();
const particleArray = new Array();

const invaderCanvas = document.querySelector('#invaders');
//const invaderCtx = invaderCanvas.getContext('2d');
//const invaderShape = new Shapes({canvas: invaderCanvas, context: invaderCtx});

const scoreCanvas = document.querySelector("#scores");
//const scoreCtx = scoreCanvas.getContext("2d");
//const scoreShape = new Shapes({canvas: scoreCanvas, context: scoreCtx});

const pausedTemplate = document.querySelector("#paused-template");


let offScreen, config, inter, gameMode;

// player canvas
let ship, lifeMeter = 0, elixirMeter = 0, score = 0;

//bullet canvas
let golistore, superGolistore;

// invader canvas
let invade = true;


//=============================== bullet classes =================================

class Bullets {
  constructor(direction, speed, life) {
    this.life = life;
    this.speed = speed;

    this.pos = center;
    this.vel = Vector2D.mul(direction, this.speed);

    this.r = 2;
    this.c = "white";
  }
  draw() {
    bulletShape.ellipse({x: this.pos.x, y: this.pos.y, radius: this.r});
    bulletShape.fill({color: this.c});
  }
  moveBullet() {
    this.pos = Vector2D.add(this.pos, this.vel);
    this.life--;

    this.draw();
  }
}
class AssaultBullets extends Bullets {
  constructor(direction, speed, life, dmg, penetrate=0) {
    super(direction, speed, life);
    
    this.damage = dmg;
    this.penetrate = penetrate;
  }
}
class MachineBullets extends Bullets {
  constructor(direction, speed, life, dmg, penetrate=0) {
    super(direction, speed, life);

    //this.life = Math.floor(Math.min(canvas.width, canvas.height)/25);
    this.damage = dmg;
    this.penetrate = penetrate;
  }
}
class SniperBullets extends Bullets {
  constructor(direction, speed, life, dmg, penetrate=0) {
    super(direction, speed, life);

    //this.life = Math.floor(Math.min(canvas.width, canvas.height)/10);
    this.damage = dmg;
    this.penetrate = penetrate;
  }
}

// bullet dies or hits the target, it releases particles
class Particles {
  constructor(x, y, color) {
    this.pos = new Vector2D(x, y);
    this.vel = new Vector2D(Math.random() - 0.5, Math.random() - 0.5);

    this.r = 1;
    this.life = 40;
    this.c = color;
  }
  draw() {
    bulletShape.ellipse({x: this.pos.x, y: this.pos.y, radius: this.r});
    bulletShape.fill({color: this.c});
  }
  move() {
    this.pos = Vector2D.add(this.pos, this.vel);
    this.life--;

    this.draw();
  }
}

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


/* ================ functions =================== */
function bulletAnimation() {
  //bulletCtx.setTransform(1, 0, 0, 1, 0, 0);
  bulletCtx.clearRect(0, 0, canvasWidth, canvasHeight);

  if (fire && ship.reload) {
    ship.fire();
  }

  for(let i = bulletsStore.length-1; i >= 0; i--) {
    let x = bulletsStore[i];
    x.moveBullet();

    // check if bullet is dead or not before collision
    if (x.life) {
      for (let j = invaderStore.length-1; j >= 0; j--) {
        let d = Vector2D.distance(x.pos, invaderStore[j].pos);

        //d - life - 2 because life is radius of invader and 2 is the radius of bullet
        if (d - invaderStore[j].life - 2 <= 0) {
          // invader sustained some damage, so subtract that..
          invaderStore[j].life -= x.damage;
          x.life = 0;
        }
      }
    }

    // if bullet is dead then delete that bullet and create particles in place
    if (!x.life) {
      let deadBullet = bulletsStore.splice(i, 1)[0];

      for (let p = 0; p < 10; p++) {
        particleArray.push(new Particles(deadBullet.pos.x, deadBullet.pos.y, deadBullet.c));
      }
    }
  }

  // animate the particles
  for (let i = particleArray.length-1; i >= 0; i--) {
    let x = particleArray[i];

    if(x.life) {
      x.move();
    }else {
      particleArray.splice(particleArray.indexOf(x), 1);
    }
  }
}




function startAnimationFrames() {
  bulletAnimation();

  inter = requestAnimationFrame(startAnimationFrames);
}

async function startGame(shipId) {
  let sc = config.ship;

  switch(shipId) {
    case '1':
      //mass, radius, color, life
      ship = new Assault(sc.mass, sc.radius, sc.color, sc.type[shipId][gameMode].life, sc.type[shipId][gameMode].reloadTime);

      golistore = (v) => {
        bulletsStore.push(new AssaultBullets(v, sc.type[shipId].bullet.speed, sc.type[shipId].bullet.life, sc.type[shipId].bullet.damage));
      }
      superGolistore = (v) => {
        bulletsStore.push(new AssaultBullets(Vector2D.mul(v, -1), sc.type[shipId].bullet.speed, sc.type[shipId].bullet.life, sc.type[shipId].bullet.damage));
      }
      break;
    case '2':
      ship = new MachineGun(sc.mass, sc.radius, sc.color, sc.type[shipId][gameMode].life, sc.type[shipId][gameMode].reloadTime);

      golistore = (v) => {
        bulletsStore.push(new MachineBullets(v, sc.type[shipId].bullet.speed, sc.type[shipId].bullet.life, sc.type[shipId].bullet.damage));
      }
      superGolistore = (v) => {
        bulletsStore.push(new MachineBullets(v, sc.type[shipId].bullet.speed*2, sc.type[shipId].bullet.life, sc.type[shipId].bullet.damage));
      }
      break;
    case '3':
      ship = new Sniper(sc.mass, sc.radius, sc.color, sc.type[shipId][gameMode].life, sc.type[shipId][gameMode].reloadTime);

      golistore = (v) => {
        bulletsStore.push(new SniperBullets(v, sc.type[shipId].bullet.speed, sc.type[shipId].bullet.life, sc.type[shipId].bullet.damage));
      }
      superGolistore = (v) => {
        bulletsStore.push(new SniperBullets(v, sc.type[shipId].bullet.speed, sc.type[shipId].bullet.life, sc.type[shipId].bullet.damage, 100));
      }
      break;
    case "default":
      location.assign("/")
      break;
  }

  startAnimationFrames();
}

function pauseGame() {
  if (inter) {
    cancelAnimationFrame(inter);
    inter = false;

    let clone = pausedTemplate.content.cloneNode(true);
    document.body.appendChild(clone);
  }else {
    document.querySelector("#paused").remove();

    startAnimationFrames();
  }
}


onload = async () => {
  let res = await fetch("/config.json");
  config = await res.json();

  let uri = await new URL(location.href);
  gameMode = uri.searchParams.get("mode");
  let shipId = uri.searchParams.get("ship");
  startGame(shipId);

  let offScreenData = {canvas: offScreen, canvasWidth, canvasHeight, config, shipId, ship, gameMode, center};

  offScreen = playerCanvas.transferControlToOffscreen();
  invadersWorker.postMessage(offScreenData, [offScreen]);

  offScreen = invaderCanvas.transferControlToOffscreen();
  invadersWorker.postMessage(offScreenData, [offScreen]);

  offScreen = scoreCanvas.transferControlToOffscreen();
  starsWorker.postMessage(offScreenData, [offScreen]);
}
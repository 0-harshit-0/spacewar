// reloadTime: milliseconds

// =============== variables ======================
let config, inter, gameMode;

// player canvas
let ship;

//bullet canvas
let golistore, superGolistore;

// invader canvas
let invade = true, invderIntervalId;

// score canvas
let lifeMeter = 0, elixirMeter = 0, score = 0;
let starStore = new Array();

// ===================== player ship classes ===========================

class Shooter {
  constructor(mass, radius, color, life, reloadTime) {
    this.pos = center;
    this.theta = 0;

    this.m = mass;
    this.r = radius;

    this.life = life;
    this.elixir = 0;

    this.c = color;

    this.reload = true;
    this.super = false;
    this.reloadTime = reloadTime;

    lifeMeter = life;
  }
  drawBase() {
    playerShape.ellipse({x: this.pos.x, y: this.pos.y, radius: this.r});
    playerShape.fill({color: this.c});
  }
  fire() {
    this.reload = false;

    let dir = Vector2D.normalize(Vector2D.sub(mouse, this.pos));
    //let life = Math.floor(Math.min(bulletCanvas.width, bulletCanvas.height)/13);

    if (this.super) {
      superGolistore(dir);
    }else {
      golistore(dir);
    }

    setTimeout(()=> {
      this.reload = true;
    }, this.reloadTime);
  }
}
// turrents
class Assault extends Shooter {
  constructor(mass, radius, color, life, reloadTime) {
    super(mass, radius, color, life, reloadTime);

    this.posp = new Vector2D();
  }
  drawTurrent() {
    playerShape.ellipse({x: this.posp.x, y: this.posp.y, xRadius: this.r*1.7, yRadius: this.r/2, rotation: this.theta});
    playerShape.fill({color: this.c});
  }
  moveTurrent() {
    let dir = Vector2D.sub(mouse, this.pos);
    this.theta = Math.atan2(dir.y, dir.x);
    dir = Vector2D.mul(Vector2D.normalize(dir), this.r * 0.5);
    this.posp = Vector2D.add(this.pos, dir);

    this.drawBase();
    this.drawTurrent();
  }
}
class MachineGun extends Shooter {
  constructor(mass, radius, color, life, reloadTime) {
    super(mass, radius, color, life, reloadTime);

    this.posp = new Vector2D();
  }
  drawTurrent() {
    playerShape.ellipse({x: this.posp.x, y: this.posp.y, xRadius: this.r*0.9, yRadius: this.r*0.9, endAngle: Math.PI, rotation: this.theta+(90*Math.PI/180)});
    playerShape.fill({color: this.c});
  }
  moveTurrent() {
    let dir = Vector2D.sub(mouse, center);
    this.theta = Math.atan2(dir.y, dir.x);
    dir = Vector2D.mul(Vector2D.normalize(dir), this.r * 1.6);
    this.posp = Vector2D.add(this.pos, dir);

    this.drawBase();
    this.drawTurrent();
  }
}
class Sniper extends Shooter {
  constructor(mass, radius, color, life, reloadTime) {
    super(mass, radius, color, life, reloadTime);

    this.posp = new Vector2D();
  }
  drawTurrent() {
    playerShape.ellipse({x: this.posp.x, y: this.posp.y, xRadius: this.r*1.7, yRadius: this.r/2, endAngle: Math.PI*2, rotation: this.theta});
    playerShape.fill({color: this.c});
    playerShape.ellipse({x: this.posp.x, y: this.posp.y, xRadius: this.r*0.9, yRadius: this.r*0.9, endAngle: Math.PI,  rotation: this.theta+(90*Math.PI/180)});
    playerShape.fill({color: this.c});
  }
  moveTurrent() {
    let dir = Vector2D.sub(center, mouse);
    this.theta = Math.atan2(dir.y, dir.x);
    dir = Vector2D.mul(Vector2D.normalize(dir), this.r * 1.1);
    this.posp = Vector2D.add(this.pos, dir);
    //this.posp = Vector2D.limit(100, this.posp);

    this.drawBase();
    this.drawTurrent();
  }
}

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

// ======================= stars classes =========================

class Stars {
  constructor(x, y, vx, vy, radius) {
    this.pos = new Vector2D(x, y);
    this.vel = new Vector2D(vx, vy);
    this.r = radius;
    this.color = "rgb(255, 255, 255)";
  }
  draw() {
    playerShape.ellipse({x: this.pos.x, y: this.pos.y, radius: this.r});
    playerShape.fill({color: this.color});
  }
  move() {
    this.pos = Vector2D.add(this.pos, this.vel);
    this.draw();
  }
}

/* ================ functions =================== */
function playerAnimation() {
  playerCtx.clearRect(0, 0, canvasWidth, canvasHeight);

  ship.moveTurrent();
}




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




function createInvaders() {
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

function invaderAnimation() {
  //invaderCtx.fillStyle = "rgba(0, 0, 0, 0.05)";
  //invaderCtx.fillRect(0, 0, canvasWidth, canvasHeight);
  invaderCtx.clearRect(0, 0, canvasWidth, canvasHeight);

  if (invade) {
    invade = false;
    createInvaders();

    setTimeout(()=> {
      invade = true;
    }, config.invaders.invaderTime);
  }

  for(let i = invaderStore.length-1; i >= 0; i--) {
    let x = invaderStore[i];

    if (x.life >= 10) {
      x.move();
    }else {
      score++;
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





function statsBar() {
  // make it more visible

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
function scoreCount() {
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

function scoreAnimation() {
  scoreCtx.clearRect(0, 0, canvasWidth, canvasHeight);

  statsBar();
  scoreCount();

  /*for (let k = starStore.length-1; k >= 0; k--) {
    starStore[k].move();

    if (starStore[k].pos.y >= canvasHeight || starStore[k].pos.y < 0 ||
        starStore[k].pos.x >= canvasWidth || starStore[k].pos.x <= 0) {
      starStore.splice(k, 1);
    }
  }*/
}





async function startGame(shipId) {
  let sc = config.ship;

  for (let i = 0; i < 1000; i++) {
    let radius = Math.random();
    let x = Math.random() * (canvasWidth - radius * 2);
    let y = Math.random() * (canvasHeight - radius * 2);
    let dx = (Math.random() - 0.5) / 5;
    let dy = (Math.random() - 0.5) / 5;
    starStore.push(new Stars(x, y, dx, dy, radius));
  }

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

  inter = setInterval(()=> {
    playerAnimation();
    bulletAnimation();
    invaderAnimation();
    scoreAnimation();
  });
}

function pauseGame() {
  if (inter) {
    clearInterval(inter);
    inter = false;

    let clone = pausedTemplate.content.cloneNode(true);
    document.body.appendChild(clone);
  }else {
    document.querySelector("#paused").remove();

    inter = setInterval(()=> {
      playerAnimation();
      bulletAnimation();
      invaderAnimation();
      scoreAnimation();
    });
  }
}

window.onload = async () => {
  let res = await fetch("../config.json");
  config = await res.json();

  let uri = await new URL(location.href);
  gameMode = uri.searchParams.get("mode");
  let shipId = uri.searchParams.get("ship");
  startGame(shipId);
}

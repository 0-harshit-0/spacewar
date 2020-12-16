/*let btn = document.querySelectorAll('input');
for (var i = 0; i < btn.length; i++) {
  btn[i].toggleAttribute("disabled");
}*/

let mouse = new Vector2D();
let mobile = false, fire = false;
(function detec() { 
     
    if (navigator.userAgent.match(/Android/i) 
        || navigator.userAgent.match(/webOS/i) 
        || navigator.userAgent.match(/iPhone/i)  
        || navigator.userAgent.match(/iPad/i)  
        || navigator.userAgent.match(/iPod/i) 
        || navigator.userAgent.match(/BlackBerry/i) 
        || navigator.userAgent.match(/Windows Phone/i)) { 
        
        addEventListener('touchstart', (e)=> {
          fire = true;
          ctx.setTransform(1,0,0,1,0,0);
          let bla = e.changedTouches[0];
          mouse.x = bla.clientX;
          mouse.y = bla.clientY;
        });
        addEventListener('touchend', ()=>{fire=false});
      
        addEventListener('touchmove', (e)=> {
          ctx.setTransform(1,0,0,1,0,0);
          let bla = e.changedTouches[0];
          mouse.x = bla.clientX;
          mouse.y = bla.clientY;
        });
    } else {
        //console.log(1)
        addEventListener("mousemove", e => {
          mouse.x = e.x;
          mouse.y = e.y;
        });
    }
})();


addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  bgcanvas.width = innerWidth;
  bgcanvas.height = innerHeight;

  invCanvas.width = innerWidth;
  invCanvas.height = innerHeight;

});

const colorP = [
  "rgb(255, 255, 255)",
  "rgb(0, 255, 255)",
  "rgb(250, 0, 0)",
  "rgb(0, 0, 255)",
  "rgb(0, 255, 0)",
  "rgb(255, 0, 255)"
];

const bgcanvas = document.querySelector("#back");
const bgctx = bgcanvas.getContext("2d");
let bs = new Shapes(bgctx);
bgcanvas.width = innerWidth;
bgcanvas.height = innerHeight;

let center = new Vector2D(innerWidth/2, innerHeight/2);
let lifemeter = bgcanvas.width/2-10, elixirMeter = 0, sup = false;
let score = 0, tempReload;

function scoreAndLife() {
  bgctx.fillStyle = "rgb(250, 250, 0)";
  let size = 30;
  bgctx.font = `${size}px arial`;
  bgctx.fillText(`${score}`, bgcanvas.width/2 - size/2, bgcanvas.height-size);
  //bgctx.fillText(`life: ${shoot.life}`, size, size*2);
}


class Shooter {
  constructor() {
    this.r = 10;
    this.pos = center;
    this.life = Math.floor(bgcanvas.width/2);
    this.elixir = 0;
    this.m = 2;
    this.reload = true;
  }
  lifeBar() {
    if (lifemeter > this.life) {
      lifemeter--;
    }
    bgctx.lineWidth = 10;
    bgctx.lineCap = "round";

    bs.line(10, 10, lifemeter, 10);
    bs.stroke("rgba(0, 200, 150, 1)");

    //elixir
    elixirMeter = Vector2D.constrain(elixirMeter, 0, this.elixir*10);   
    if (elixirMeter > bgcanvas.width/2-10) {
      sup = true;
      this.elixir = 0;
      elixirMeter = 0;
      setTimeout(()=> {
        reloadTime = tempReload;
        sup = false;
      }, 5000);
    }

    bs.line(bgcanvas.width/2+10, 10, bgcanvas.width/2+10 + elixirMeter++, 10);
    bs.stroke("rgba(0, 200, 0, 1)"); 
  }
  draw() {
    bs.circle(center.x, center.y, this.r);
    bs.fill("rgb(245, 240, 240)");
  }
}
class Assault extends Shooter {
  constructor() {
    super();
  }
  drawAttack() {
    bs.ellipse(this.posp.x, this.posp.y, this.r*1.7, this.r/2, 0, Math.PI*2, this.theta);
    bs.fill("rgba(250, 250, 250, 1)");
  }
  moveAttack() {
    let dir = Vector2D.sub(mouse, center);
    this.theta = Math.atan2(dir.y, dir.x);
    dir = Vector2D.mul(Vector2D.normalize(dir), this.r / 2);
    this.posp = Vector2D.add(this.pos, dir);

    this.drawAttack();
  }
}
class MachineGun extends Shooter {
  constructor() {
    super();
  }
  drawAttack() {
    bs.ellipse(this.posp.x, this.posp.y, this.r*0.9, this.r*0.9, 0, Math.PI, this.theta+(90*Math.PI/180));
    bs.fill("rgba(250, 250, 250, 1)");
  }
  moveAttack() {
    let dir = Vector2D.sub(mouse, center);
    this.theta = Math.atan2(dir.y, dir.x);
    dir = Vector2D.mul(Vector2D.normalize(dir), this.r * 1.6);
    this.posp = Vector2D.add(this.pos, dir);

    this.drawAttack();
  }
}
class Sniper extends Shooter {
  constructor() {
    super();
  }
  drawAttack() {
    bs.ellipse(this.posp.x, this.posp.y, this.r*1.7, this.r/2, 0, Math.PI*2, this.theta);
    bs.fill("rgba(250, 250, 250, 1)");
    bs.ellipse(this.posp.x, this.posp.y, this.r*0.9, this.r*0.9, 0, Math.PI, this.theta+(90*Math.PI/180));
    bs.fill("rgba(250, 250, 250, 1)");
  }
  moveAttack() {
    let dir = Vector2D.sub(mouse, center);
    this.theta = Math.atan2(dir.y, dir.x);
    dir = Vector2D.mul(Vector2D.normalize(dir), this.r * 1.1);
    this.posp = Vector2D.add(this.pos, dir);
    //this.posp = Vector2D.limit(100, this.posp);

    this.drawAttack();
  }
}


class Stars {
  constructor(x, y, vx, vy, radius) {
    this.pos = new Vector2D(x, y);
    this.vel = new Vector2D(vx, vy);
    this.r = radius;
    this.color = "rgb(255, 255, 255)";
  }
  draw() {
    bs.circle(this.pos.x, this.pos.y, this.r);
    bs.fill(this.color);
  }
  update() {
    this.pos = Vector2D.add(this.pos, this.vel);
    this.draw();
  }
}

let starStore = new Array();
let shoot = new Shooter();
(() => {
  for (let i = 0; i < 1000; i++) {
    let radius = Math.random();
    let x = Math.random() * (innerWidth - radius * 2);
    let y = Math.random() * (innerHeight - radius * 2);
    let dx = (Math.random() - 0.5) / 5;
    let dy = (Math.random() - 0.5) / 5;
    starStore.push(new Stars(x, y, dx, dy, radius));
  }
})();

function animatio() {
  //bgctx.fillStyle = 'rgba(0, 0, 0, 1)';
  //bgctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  bgctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  if (score >= 50) {
    cancelAnimationFrame(inter);
    score = 0;
    alert("congratulation captain you did it...");
    location.assign("https://0-harshit-0.github.io/spacewarfare/");
  }

  if (shoot.life > 10) {
    ship.moveAttack();
    shoot.draw();
    shoot.lifeBar();
    scoreAndLife();
  }else {
    cancelAnimationFrame(inter);
    alert("it's over captain...");
    shoot.life = 100;
    location.assign("https://0-harshit-0.github.io/spacewarfare/");
  }

  for (let k = 0; k < starStore.length; k++) {
    starStore[k].update();
    if (starStore[k].pos.y >= bgcanvas.height || starStore[k].pos.y < 0 ||
        starStore[k].pos.x >= bgcanvas.width || starStore[k].pos.x <= 0) {
      starStore.splice(k, 1);
    }
  }

  requestAnimationFrame(animatio);
}

//================================================================

const canvas = document.querySelector("#front");
const ctx = canvas.getContext("2d");
let s = new Shapes(ctx);
canvas.width = innerWidth;
canvas.height = innerHeight;


class Bullets {
  constructor(velocity) {
    this.pos = new Vector2D(canvas.width / 2, canvas.height / 2);
    this.vel = velocity;
    this.r = 2;//this.power;
    this.c = "white";
  }
  draw() {
    s.circle(this.pos.x, this.pos.y, this.r);
    s.fill(this.c);
    this.pos = Vector2D.add(this.pos, this.vel);
    this.life--;
  }
}
class AssaultBullets extends Bullets {
  constructor(velocity) {
    super(velocity);
    this.life = Math.floor(Math.min(canvas.width, canvas.height)/13);
    this.power = 4;
  }
  draw() {
    super.draw();
  }
}
class MachineBullets extends Bullets {
  constructor(velocity) {
    super(velocity);
    this.life = Math.floor(Math.min(canvas.width, canvas.height)/25);
    this.power = 1;
  }
  draw() {
    super.draw();
  }
}
class SniperBullets extends Bullets {
  constructor(velocity) {
    let temp = Vector2D.mul(velocity, 2);
    super(temp);
    this.life = Math.floor(Math.min(canvas.width, canvas.height)/10);
    this.power = 10000;
  }
  draw() {
    super.draw();
  }
}

class Particles {
  constructor(x, y, radius, color) {
    this.pos = new Vector2D(x, y);
    this.vel = new Vector2D(Math.random() - 0.5, Math.random() - 0.5);
    this.r = radius;
    this.c = color;
    this.life = 40;
  }
  draw() {
    s.circle(this.pos.x, this.pos.y, this.r);
    s.fill(this.c);
  }
  move() {
    this.draw();
    this.pos = Vector2D.add(this.pos, this.vel);
    this.life--;
  }
}
// invaders start

class Invaders {
  constructor(x, y, radius, color) {
    this.pos = new Vector2D(x, y);
    this.vel = new Vector2D();
    this.life = radius;
    this.power = 20;
    this.c = color;
    this.m = 5;
  }
  draw() {
    this.theta = Math.atan2(this.vel.y, this.vel.x);
    invS.complex(this.life, this.pos.x, this.pos.y, this.m, this.theta);
    invS.fill(this.c);
  }
  move() {
    this.vel = Vector2D.sub(center, this.pos);
    this.vel = Vector2D.limit(1.5, this.vel);
    this.pos = Vector2D.add(this.pos, this.vel);
  }
}

let bulletsStore = new Queues();
let store = new Array();
let particle = new Array();
let inter,invderInter, golistore, reloadTime, superGolistore;
const timer = 1200;

function create() {
  let dis = Math.floor(Math.max(canvas.width, canvas.height));
  let theta = Math.random() * 360;
  let xp = Math.cos(theta*Math.PI/180) * dis;
  let yp = Math.sin(theta*Math.PI/180) * dis;
  let radii = Math.floor(Math.random() * (canvas.width+canvas.height)/100)+10;
  let colour = colorP[Math.floor(Math.random() * colorP.length)];
  store.push(new Invaders(Math.floor(canvas.width/2+xp), Math.floor(canvas.height/2+yp), radii, colour));
}

//bullets maker===================================
function bulletEvent(mouse) {
  
  if (shoot.reload) {
    shoot.reload = false;
    let acc = Vector2D.normalize(Vector2D.sub(mouse, center));
    let velocity = Vector2D.mul(acc, 5);
    if (sup) {
      superGolistore(velocity);
    }
    golistore(velocity);
    setTimeout(()=> {
      shoot.reload = true;
    }, reloadTime);
  }
}

addEventListener("keypress", e => {
  if (shoot.reload && (e.key == 'q' || e.key == 'Q')) {
    bulletEvent(mouse);
  }
});

function animation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (fire) {
    bulletEvent(mouse);
  }

  if (bulletsStore.s) {
    bulletsStore.queuearray.forEach(x => {
      if (x.life) {
        x.draw();
      }else {
        let temp = bulletsStore.pop();
        for (let p = 0; p < 10; p++) {
          particle.push(new Particles(temp.pos.x, temp.pos.y, 1, temp.c));
        }
      }
    });
  }

  //collision
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  for (let i = 0; i < store.length; i++) {
    for (let j = 0; j < bulletsStore.s; j++) {
      let d = Vector2D.distance(bulletsStore.queuearray[j].pos, store[i].pos);
      if (d - store[i].life - 2 <= 0) {
        let temp = bulletsStore.pop();
        for (let p = 0; p < 10; p++) {
          particle.push(new Particles(temp.pos.x, temp.pos.y, 1, store[i].c));
        }
        store[i].life -= temp.power;
      }
    }
  }
  particle.forEach(x => {
    if(x.life) {
      x.move();
    }else {
      particle.splice(particle.indexOf(x), 1);
    }
  });

  inter = requestAnimationFrame(animation);
}

//invaders canvas
let invCanvas = document.querySelector('#invaders');
let invCtx = invCanvas.getContext('2d');
invCanvas.width = innerWidth;
invCanvas.height = innerHeight;
let invS = new Shapes(invCtx);

function animati() {
  invCtx.fillStyle = "rgba(0, 0, 0, 0.05)";
  invCtx.fillRect(0, 0, invCanvas.width, invCanvas.height);

  store.forEach(x => {
    if (x.life >= 10) {
      x.draw();
      x.move();
    }else {
      score++;
      shoot.elixir += x.power;
      store.splice(store.indexOf(x), 1);
    }

    if (Vector2D.distance(x.pos, center) <= shoot.r*2) {
      shoot.life -= x.power;
      store.splice(store.indexOf(x), 1);
    }
  });

  requestAnimationFrame(animati);
}

let heading = document.querySelector('#txt');
let container = document.querySelector('#container');
let ship;
function startGame(shipNo) {
  heading.style.display = 'none';
  container.style.display = 'none';

  switch(shipNo) {
    case '1':
      ship = new Assault();
      reloadTime = 300;
      tempReload = reloadTime;
      golistore = (v) => {
        bulletsStore.push(new AssaultBullets(v));
      }
      superGolistore = (v) => {
        bulletsStore.push(new AssaultBullets(Vector2D.mul(v, -1)));
      }
      break;
    case '2':
      ship = new MachineGun();
      reloadTime = 100;
      tempReload = reloadTime;
      golistore = (v) => {
        bulletsStore.push(new MachineBullets(v));
      }
      superGolistore = (v) => {
        bulletsStore.push(new MachineBullets(Vector2D.mul(v, 2)));
      }
      break;
    case '3':
      ship = new Sniper();
      reloadTime = 600;
      tempReload = reloadTime;
      golistore = (v) => {
        bulletsStore.push(new SniperBullets(v));
      }
      superGolistore = (v) => {
        reloadTime = 300;
      }
      break;
  }
  
  invderInter = setInterval(create, timer);

  
  animatio();
  animation();
  animati();
}
function bulletEvent(mouse) {
  
  if (shoot.reload) {
    shoot.reload = false;
    let temp = new Vector2D(mouse.x, mouse.y);
    let acc = Vector2D.normalize(Vector2D.sub(temp, center));
    let velocity = Vector2D.mul(acc, 5);
    golistore(velocity);
    setTimeout(()=> {
      shoot.reload = true;
    }, reloadTime);
  }
}



var mobile = false;
(function detec() { 
     
    if (navigator.userAgent.match(/Android/i) 
        || navigator.userAgent.match(/webOS/i) 
        || navigator.userAgent.match(/iPhone/i)  
        || navigator.userAgent.match(/iPad/i)  
        || navigator.userAgent.match(/iPod/i) 
        || navigator.userAgent.match(/BlackBerry/i) 
        || navigator.userAgent.match(/Windows Phone/i)) { 
        
        addEventListener('touchstart', (e)=> {
          ctx.setTransform(1,0,0,1,0,0);
          let bla = e.changedTouches[0];
          mouse.x = bla.clientX;
          mouse.y = bla.clientY;
          bulletEvent(mouse);
        });
        addEventListener('touchmove', (e)=> {
          ctx.setTransform(1,0,0,1,0,0);
          let bla = e.changedTouches[0];
          mouse.x = bla.clientX;
          mouse.y = bla.clientY;
          bulletEvent(mouse);
        });
    } else {
        //console.log(1)
        addEventListener("mousemove", e => {
          mouse.x = e.x;
          mouse.y = e.y;
        });
    }
})();

var colorP = [
  "rgb(255, 255, 255)",
  "rgb(0, 255, 255)",
  "rgb(250, 0, 0)",
  "rgb(0, 0, 255)",
  "rgb(0, 255, 0)",
  "rgb(255, 0, 255)"
];

const bgcanvas = document.querySelector("#back");
const bgctx = bgcanvas.getContext("2d");
bgcanvas.width = innerWidth;
bgcanvas.height = innerHeight;

let mouse = new Vector2D();

let bs = new Shapes(bgctx);
let center = new Vector2D(innerWidth / 2, innerHeight / 2);
let lifemeter = bgcanvas.width / 2, e = 0;
let score = 0;

class Shooter {
  constructor() {
    this.r = 10;
    this.pos = center;
    this.life = Math.floor(bgcanvas.width / 2 - 15);
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
    bs.line(bgcanvas.width / 2, 10, bgcanvas.width / 2 + e++, 10);
    bs.stroke("rgba(0, 200, 0, 1)");
    e = Vector2D.constrain(e, 0, this.elixir);

    if (e > bgcanvas.width / 2) {
      this.elixir = 0;
      e = 0;
    }
  }
  move() {
    this.draw();
  }
  draw() {
    //console.log(this.pos);

    bs.circle(center.x, center.y, this.r);
    bs.fill("rgb(245, 240, 240)");
  }
}
class Assault extends Shooter {
  constructor() {
    super();
  }
  drawAttack() {
    bgctx.save(); 
    bs.ellipse(this.posp.x, this.posp.y, this.r*1.7, this.r/2, 0, Math.PI*2, this.theta);
    bs.fill("rgba(250, 250, 250, 1)");
    bgctx.closePath();
    bgctx.restore();
  }
  moveAttack() {
    let dir = Vector2D.sub(mouse, center);
    this.theta = Math.atan2(dir.y, dir.x);
    dir = Vector2D.mul(Vector2D.normalize(dir), this.r / 2);
    this.posp = Vector2D.add(this.pos, dir);
    //this.posp = Vector2D.limit(100, this.posp);

    this.drawAttack();
  }
}
class MachineGun extends Shooter {
  constructor() {
    super();
  }
  drawAttack() {
    bgctx.save();
    bs.ellipse(this.posp.x, this.posp.y, this.r*0.9, this.r*0.9, 0, Math.PI, this.theta+(90*Math.PI/180));
    bs.fill("rgba(250, 250, 250, 1)");
    bgctx.closePath();
    bgctx.restore();
  }
  moveAttack() {
    let dir = Vector2D.sub(mouse, center);
    this.theta = Math.atan2(dir.y, dir.x);
    dir = Vector2D.mul(Vector2D.normalize(dir), this.r * 1.6);
    this.posp = Vector2D.add(this.pos, dir);
    //this.posp = Vector2D.limit(100, this.posp);

    this.drawAttack();
  }
}
class Sniper extends Shooter {
  constructor() {
    super();
  }
  drawAttack() {
    bgctx.save();
    bgctx.beginPath();
    bs.ellipse(this.posp.x, this.posp.y, this.r*1.7, this.r/2, 0, Math.PI*2, this.theta);
    bs.fill("rgba(250, 250, 250, 1)");
    bs.ellipse(this.posp.x, this.posp.y, this.r*0.9, this.r*0.9, 0, Math.PI, this.theta+(90*Math.PI/180));
    bs.fill("rgba(250, 250, 250, 1)");
    bgctx.closePath();
    bgctx.restore();
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
function scoreAndLife() {
  bgctx.fillStyle = "rgb(250, 250, 0)";
  let size = 30;
  bgctx.font = size + "px" + " arial";
  bgctx.fillText(
    `${score}`,
    bgcanvas.width / 2 - size / 2,
    bgcanvas.height - size
  );
  //bgctx.fillText(`life: ${shoot.life}`, size, size*2);
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

let carray = new Array();
(() => {
  for (var i = 0; i < 1000; i++) {
    var radius = Math.random();
    var x = Math.random() * (innerWidth - radius * 2);
    var y = Math.random() * (innerHeight - radius * 2);
    var dx = (Math.random() - 0.5) / 5;
    var dy = (Math.random() - 0.5) / 5;
    carray.push(new Stars(x, y, dx, dy, radius));
  }
})();

let shoot = new Shooter();

function animatio() {
  //bgctx.fillStyle = 'rgba(0, 0, 0, 1)';
  //bgctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  bgctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  if (score >= 100) {
    cancelAnimationFrame(inter);
    score = 0;
    alert("congratulation captain you did it...");
    location.assign("https://spacewars.glitch.me/");
  }

  if (shoot.life >= 1) {
    ship.moveAttack();
    shoot.draw();
    shoot.lifeBar();
    scoreAndLife();
  }else if (shoot.life <= 0) {
    cancelAnimationFrame(inter);
    shoot.life = 100;
    alert("it's over captain...");
    location.assign("https://spacewars.glitch.me/");
  }

  for (var k = 0; k < carray.length; k++) {
    carray[k].update();
    if (
      carray[k].pos.y >= bgcanvas.height ||
      carray[k].pos.y < 0 ||
      carray[k].pos.x >= bgcanvas.width ||
      carray[k].pos.x <= 0
    ) {
      carray.splice(k, 1);
    }
  }

  requestAnimationFrame(animatio);
}

//================================================================

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
let s = new Shapes(ctx);

class Bullets {
  constructor(velocity) {
    this.pos = new Vector2D(canvas.width / 2, canvas.height / 2);
    this.vel = velocity;
    this.r = 2;//this.power;
    this.c = "white";
    //console.log(mouse)
  }
  draw() {
    s.circle(this.pos.x, this.pos.y, this.r);
    s.stroke(this.c);
    this.pos = Vector2D.add(this.pos, this.vel);
    this.life--;
  }
}
class AssaultBullets extends Bullets {
  constructor(velocity) {
    super(velocity);
    this.life = 50;
    this.power = 4;
  }
  draw() {
    super.draw();
  }
}
class MachineBullets extends Bullets {
  constructor(velocity) {
    super(velocity);
    this.life = 30;
    this.power = 2;
  }
  draw() {
    super.draw();
  }
}
class SniperBullets extends Bullets {
  constructor(velocity) {
    super(velocity);
    this.life = 70;
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
    //this.
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
    //this.r = radius;
    this.life = radius;
    this.power = 20;
    this.c = color;
    this.m = 4;
    //this.
  }
  draw() {
    //console.log(this.pos);
    s.circle(this.pos.x, this.pos.y, this.life);
    s.fill(this.c);
  }
  move() {
    this.vel = Vector2D.sub(center, this.pos);
    this.vel = Vector2D.limit(1.5, this.vel);
    this.pos = Vector2D.add(this.pos, this.vel);
  }
}

let bulletsStore = new Array();
let store = new Array();
let particle = new Array();
let inter,invderInter,timer = 1200;
let golistore, reloadTime;

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

addEventListener("keypress", e => {

  if (shoot.reload && (e.key == 'q' || e.key == 'Q')) {
    shoot.reload = false;
    let temp = new Vector2D(mouse.x, mouse.y);
    let acc = Vector2D.normalize(Vector2D.sub(temp, center));
    let velocity = Vector2D.mul(acc, 5);
    golistore(velocity);
    setTimeout(()=> {
      shoot.reload = true;
    }, reloadTime);
  }
  
});

function animation() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (fire) {
    bulletEvent(mouse);
  }

  if (bulletsStore.length) {
    bulletsStore.forEach(x => {
      if (x.life) {
        x.draw();
        //x.collision();
      } else {
        for (var p = 0; p < 10; p++) {
          particle.push(new Particles(x.pos.x, x.pos.y, 1, x.c));
        }
        bulletsStore.splice(bulletsStore.indexOf(x), 1);
      }
    });
  }

  store.forEach(x => {
    if (x.life >= 10) {
      x.draw();
      x.move();
    } else {
      score++;
      shoot.elixir += x.life * 2;
      store.splice(store.indexOf(x), 1);
    }

    if (Vector2D.distance(x.pos, center) <= shoot.r*2) {
      shoot.life -= x.power;
      store.splice(store.indexOf(x), 1);
    }
  });

  //collision
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  for (var i = 0; i < store.length; i++) {
    for (var j = 0; j < bulletsStore.length; j++) {
      let d = Vector2D.distance(bulletsStore[j].pos, store[i].pos);
      if (d - store[i].life - 2 <= 0) {
        for (var p = 0; p < 10; p++) {
          particle.push(
            new Particles(
              bulletsStore[j].pos.x,
              bulletsStore[j].pos.y,
              1,
              store[i].c
            )
          );
        }
        //console.log(1)
        store[i].life -= bulletsStore[j].power;
        bulletsStore.splice(j, 1);
        //break;
      }
    }
  }
  particle.forEach(x => {
    if (x.life) {
      x.move();
    } else {
      particle.splice(particle.indexOf(x), 1);
    }
  });

  inter = requestAnimationFrame(animation);
}

let shipNo = prompt('ship no.');
let ship;
switch(shipNo) {
  case '1':
    ship = new Assault();
    reloadTime = 300;
    golistore = (v) => {
      bulletsStore.push(new AssaultBullets(v));
    }
    break;
  case '2':
    ship = new MachineGun();
    reloadTime = 100;
    golistore = (v) => {
      bulletsStore.push(new MachineBullets(v));
    }
    break;
  case '3':
    ship = new Sniper();
    reloadTime = 1000;
    golistore = (v) => {
      bulletsStore.push(new SniperBullets(v));
    }
    break;
}

invderInter = setInterval(create, timer);

animatio();
animation();

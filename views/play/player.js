let playerCtx, playerShape;

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

function playerAnimation(canvasWidth, canvasHeight, ship) {
  playerCtx.clearRect(0, 0, canvasWidth, canvasHeight);

  ship.moveTurrent();
}

onmessage = (evt) => {
  let canvas = evt.data.canvas;
  playerCtx = canvas.getContext("2d");
  playerShape = new Shapes({canvas, context: playerCtx});

  let {canvasWidth, canvasHeight, ship} = evt.data;
  
  createStars(canvasWidth, canvasHeight);
  function render(time) {
    playerAnimation(canvasWidth, canvasHeight, ship);

    requestAnimationFrame(render);
  }
  render()
};

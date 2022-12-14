let mouse = new Vector2D();
let fire = false;
// events for firing..
if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i)  
    || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) 
    || navigator.userAgent.match(/Windows Phone/i)) { 
    
  addEventListener('touchstart', (e)=> {
    fire = true;
    let bla = e.changedTouches[0];
    mouse.x = bla.clientX;
    mouse.y = bla.clientY;
  });
  addEventListener('touchend', ()=>{fire=false});

  addEventListener('touchmove', (e)=> {
    //ctx.setTransform(1,0,0,1,0,0);
    let bla = e.changedTouches[0];
    mouse.x = bla.clientX;
    mouse.y = bla.clientY;
  });
} else {
  addEventListener("mousemove", e => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  addEventListener("mousedown", e=> {
    fire = true;
  });
  addEventListener("mouseup", e=> {
    fire = false;
  });
  addEventListener("keydown", e => {
    if (e.key == 'q' || e.key == 'Q') {
      fire = true;
    }
  });
  addEventListener("keyup", e => {
    if (e.key == 'q' || e.key == 'Q') {
      fire = false;
    }
  });
}


// screen resize events...
let timeout = false;
let canvasWidth = innerWidth, canvasHeight = innerHeight;
let center = new Vector2D(canvasWidth/2, canvasHeight/2);

function getDimensions() {
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;

  playerCanvas.width = canvasWidth;
  playerCanvas.height = canvasHeight;

  bulletCanvas.width = canvasWidth;
  bulletCanvas.height = canvasHeight;

  invaderCanvas.width = canvasWidth;
  invaderCanvas.height = canvasHeight;

  scoreCanvas.width = canvasWidth;
  scoreCanvas.height = canvasHeight;

  center = new Vector2D(canvasWidth/2, canvasHeight/2);
}
addEventListener('resize', function(e) {  //debounce
  clearTimeout(timeout);
  timeout = setTimeout(getDimensions, 500);
});

getDimensions();
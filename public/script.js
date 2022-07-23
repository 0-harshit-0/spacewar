
const heading = document.querySelector("#h");
const back = document.querySelector("#backBtn");
const rand = document.querySelector("#randBtn");
const des = document.querySelector("#about");
const lvls = document.querySelector("#levelContainer");
const mds = document.querySelectorAll(".modes");
const shipCont = document.querySelector("#container");
let mode = 0;

for(let i = 0; i < mds.length; i++) {
	mds[i].onclick = () => {
    mode = i+1;
    
		des.style.display = "none";
		lvls.style.display = "none";
		mds.forEach(y => {
			y.style.display = "none";
		});

		heading.innerHTML = "Select your ship";
		shipCont.style.display = "flex";
		back.style.visibility = "visible";
		rand.style.visibility = "visible";
	}
}

function goto(ship) {
  switch(mode) {
    case 1:      
      location.assign(`/play?mode=easy&ship=${ship}`);
      break;
    case 2:
      location.assign(`/play?mode=medium&ship=${ship}`);
      break;
    case 3:
      location.assign(`/play?mode=hard&ship=${ship}`);
      break;
    default:
      location.assign("/");
      break;
  }
}
//canvas========================

const bgcanvas = document.querySelector('#canvas');
const bgctx = bgcanvas.getContext('2d');
let s = new Shapes(bgctx);

let timeout = false;
bgcanvas.width = innerWidth;
bgcanvas.height = innerHeight;
function getDimensions() {
	bgcanvas.width = innerWidth;
	bgcanvas.height = innerHeight;
	main()
}
addEventListener('resize', function(e) {  //debounce
	clearTimeout(timeout);
	timeout = setTimeout(getDimensions, 500);
});



class Circle {
	constructor(x, y, vx, vy, radius) {
		this.pos = new Vector2D(x, y);
		this.vel = new Vector2D(vx, vy);
		this.r = radius;
		this.color = "rgb(255, 255, 255)";
	}
	draw() {
		s.circle(this.pos.x, this.pos.y, this.r);
		s.fill('white');

	}
	update() {
		this.pos = Vector2D.add(this.pos, this.vel);
		this.draw();
	}
}

function animatio(arr) {
	bgctx.clearRect(0, 0, innerWidth, innerHeight);

	for (var k = 0; k < arr.length; k++){
		let z = arr[k];
		z.update();
		if (z.pos.y >= bgcanvas.height || z.pos.y < 0 || z.pos.x >= bgcanvas.width || z.pos.x <= 0) {
			arr.splice(k, 1);
		}
	}

	frameID = requestAnimationFrame(()=> {animatio(arr)});
}

function main() {
	let carray = new Array(), frameID = null;

	for (var i = 0; i < 1000; i++) {
		var radius = Math.random()/2;
		var x = Math.random() * (innerWidth - radius * 2);
		var y = Math.random() * (innerHeight - radius * 2);
		var dx = (Math.random()-0.5)/5;
		var dy = (Math.random()-0.5)/5;
		carray.push(new Circle(x, y, dx, dy, radius));
	}

	if (frameID != null) {
		cancelAnimationFrame(frameID);
		frameID = null;
	}

	animatio(carray);
}
main();

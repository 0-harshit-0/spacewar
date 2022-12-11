const heading = document.querySelector("#h");
const wrap = document.querySelector(".wrap");
const modes = document.querySelectorAll(".modes");

const shipContainerTemplate = document.querySelector("#shipContainer");

const backBtn = document.querySelector("#backBtn");
const randBtn = document.querySelector("#randBtn");

let mode = 0;

for(let i = 0; i < modes.length; i++) {
	modes[i].addEventListener("click", (e)=> {
    mode = e.target.ariaLabel;

    heading.innerHTML = "Select your ship";
    wrap.innerHTML = '';

    const clone = shipContainerTemplate.content.cloneNode(true);
    wrap.appendChild(clone);

    backBtn.style.visibility = "visible";
    randBtn.style.visibility = "visible";
	});
}

function goto(ship) {
  location.assign(`/play?mode=${mode}&ship=${ship}`);
}

backBtn.addEventListener("click", ()=> {
	location.reload();
});
randBtn.addEventListener("click", ()=> {
	goto(Math.floor(Math.random()*modes.length)+1);
});
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
		s.ellipse("", this.pos.x, this.pos.y, this.r);
		s.fill("", 'white');

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

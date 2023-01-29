const heading = document.querySelector("#h");
const wrap = document.querySelector(".wrap");
const modes = document.querySelectorAll(".modes");

const shipContainerTemplate = document.querySelector("#ship-container-template");

const backBtn = document.querySelector("#back-btn");
const randBtn = document.querySelector("#rand-btn");

let mode = 0;

for(let i = 0; i < modes.length; i++) {
	modes[i].addEventListener("click", (e)=> {
    mode = e.target.ariaLabel;

    heading.innerHTML = "Select your ship";

    backBtn.style.visibility = "visible";
    randBtn.style.visibility = "visible";
    wrap.innerHTML = '';

    fetch("/config.json").then(async res => {
    	const config = await res.json();

    	const clone = shipContainerTemplate.content.cloneNode(true);
    	wrap.appendChild(clone);
			const ships = wrap.querySelectorAll(".ships");

    	ships.forEach(z => {
    		z.querySelector('[aria-label="damage"]').innerText = config.ship.type[z.ariaLabel].bullet.damage;
    		z.querySelector('[aria-label="range"]').innerText = config.ship.type[z.ariaLabel].bullet.life;
    		z.querySelector('[aria-label="reloadTime"]').innerText = config.ship.type[z.ariaLabel][mode].reloadTime+"ms";
    	});
    });
    
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
const bgCanvas = document.querySelector('#canvas');
const bgCtx = bgCanvas.getContext('2d');
let frameID = null;

let timeout = false;
function getDimensions() {
	bgCanvas.width = innerWidth;
	bgCanvas.height = innerHeight;
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
		bgCtx.beginPath();
		bgCtx.fillStyle = "white";
		bgCtx.arc(this.pos.x, this.pos.y, this.r, 0, 2*Math.PI)
		bgCtx.fill();
		bgCtx.closePath();
	}
	update() {
		this.pos = Vector2D.add(this.pos, this.vel);
		this.draw();
	}
}

function animation(arr) {
	bgCtx.clearRect(0, 0, canvas.width, canvas.height);

	for (var k = arr.length-1; k >= 0; k--){
		let z = arr[k];

		if (z.pos.y >= bgCanvas.height || z.pos.y < 0 || z.pos.x >= bgCanvas.width || z.pos.x <= 0) {
			arr.splice(k, 1);
		}else {
			z.update();
		}
	}

	frameID = requestAnimationFrame(()=> {animation(arr)});
}

function main() {
	let tempArray = new Array();

	for (var i = 0; i < 1000; i++) {
		var radius = Math.random()/2;
		var x = Math.random() * (canvas.width - radius * 2);
		var y = Math.random() * (canvas.height - radius * 2);
		var dx = (Math.random()-0.5)/5;
		var dy = (Math.random()-0.5)/5;
		tempArray.push(new Circle(x, y, dx, dy, radius));
	}

	if (frameID != null) {
		cancelAnimationFrame(frameID);
		frameID = null;
	}

	animation(tempArray);
}
getDimensions();

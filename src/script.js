
let customOption = document.querySelector('#about');
let cOption = false;


//canvas========================

const bgcanvas = document.querySelector('#canvas');
const bgctx = bgcanvas.getContext('2d');
bgcanvas.width = innerWidth;
bgcanvas.height = innerHeight;

let s = new Shapes(bgctx);

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

let carray = new Array();
(() => {
	for (var i = 0; i < 2000; i++){
		var radius = Math.random();
		var x = Math.random() * (innerWidth - radius * 2);
		var y = Math.random() * (innerHeight - radius * 2);
		var dx = (Math.random()-0.5)/5;
		var dy = (Math.random()-0.5)/5;
		carray.push(new Circle(x, y, dx, dy, radius));
	}
})();


(function animatio(){
	bgctx.fillStyle = 'black';
	bgctx.fillRect(0, 0, innerWidth, innerHeight);

	for (var k = 0; k < carray.length; k++){
		carray[k].update();
		if (carray[k].pos.y >= bgcanvas.height || carray[k].pos.y < 0 || carray[k].pos.x >= bgcanvas.width || carray[k].pos.x <= 0) {
			carray.splice(k, 1);
		}
	}

	requestAnimationFrame(animatio);
})();
//animatio();

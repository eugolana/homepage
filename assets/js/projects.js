myCanvas = document.getElementById("projectsBackgroundCanvas");
width = myCanvas.width;
height = myCanvas.height;

var rect = new Rectangle(new Point(0,0), new Size(width, height));
backRect = new Path.Rectangle(rect);
backRect.fillColor = "#111112";


// cloud vars
var blocksize = 32;
var threshold = 0.64;
var cloudFrames = 1;
// perlin setup
var seed = Math.random();
var pn = new Perlin(seed);
var a = get_perlin(height, width ,blocksize, pn, 0);

var Clouds = function( width, height, blocksize, threshold) {
  this.width = width;
  this.height = height;
  this.blocksize = blocksize;
  this.threshold = threshold;
  this.clouds = [];
}

Clouds.prototype.initialize = function(){
  var shapes = [];
  for (var i = -1; i < this.width/this.blocksize ; i++) {
    var row = [];
    for (var ii = -1; ii < this.height/this.blocksize ; ii++) {
      var rect = new Rectangle( [i * this.blocksize, ii * this.blocksize], [this.blocksize * 2, this.blocksize * 2]);
      var path = new Path.Rectangle(rect, this.blocksize/4);
      row.push(path);
    }
    shapes.push(row);
  }
  this.clouds =  shapes;
}

Clouds.prototype.run = function(a){
  for (var i = 0; i < a.length; i++) {
    for (var ii = 0; ii < a[0].length; ii++) {
      if (a[i][ii] >= this.threshold) {
        this.clouds[i][ii].opacity =  (a[i][ii] /3 );
        this.clouds[i][ii].fillColor = new Color(255,255,255)
      } else {
        this.clouds[i][ii].opacity = 0;
      }
    }
  }
}


var clouds = new Clouds(width, height, blocksize, threshold);
clouds.initialize();

var Star = function(pos, color, size) {
	this.pos = pos;
	this.star = new Group();
  h_rect = new Rectangle(pos - new Point(size  , 0), new Size(size * 2, size * 0.25));
  v_rect = new Rectangle(pos- new Point(0, size  ), new Size(size * 0.25,size * 2))
  h_el = new Path.Ellipse(h_rect)	
  v_el = new Path.Ellipse(v_rect)
  h_el.opacity = 0.7;
  v_el.opacity = 0.7
  c = new Path.Circle(pos, size)
  c2 = new Path.Circle(pos, size * 2)
  c.opacity = 0.1
  c2.opacity = 0.05
  this.star.addChild(h_el)
  this.star.addChild(v_el)
  this.star.addChild(c)
  this.star.addChild(c2)
  this.star.fillColor = color;
}

Star.prototype.draw = function() {
	if (this.star.visible && Math.random() > 0.95) {
		this.star.visible = false;
	}
	if (!this.star.visible && Math.random() > 0.75) {
		this.star.visible = true;
	}
}

var stars = []
for (var i = 0; i < 100; i++) {
	stars.push(new Star(new Point(Math.random() * width, Math.random() * height), '#FFFFFF', 1 + Math.random() * 2))
}


var Flyer = function(pos, color) {
	this.speedMult = 0.7 + Math.random() * 0.6;
  this.pos = pos;
  this.color = color;
  this.bug = new Group();
  rect = new Rectangle(pos, new Size(10, 4));
  circle = new Path.Ellipse(rect)
  circle.fillColor = color;
  // circle.strokeColor = '#222222'
  // circle.strokeWidth = 1;
  glower = new Group();
  glower.addChild(new Path.Circle(pos, 2))
  glower.addChild(new Path.Circle(pos, 4))
  glower.addChild(new Path.Circle(pos, 8))
  glower.addChild(new Path.Circle(pos, 16))
  // glower.addChild(new Path.Circle(pos + new Point(10, 0), 12))
  glower.fillColor = '#FFCC22'
  glower.children[0].opacity = 1;
  glower.children[1].opacity = 0.4
  glower.children[2].opacity = 0.1;
  glower.children[3].opacity = 0.05;
  wings = new Group();
  wings.addChild(new Path.Circle(pos + new Point(5,-2), 4));
  wings.addChild(new Path.Circle(pos + new Point(5,6), 4));
  wings.fillColor = 'white'
  wings.strokeColor = '#222222'
  wings.opacity = 0.3;
  this.bug.addChild(circle)
  this.bug.addChild(wings)
  this.bug.addChild(glower)
  this.wings = wings
  this.movement = new Point(1,0)
}



Flyer.prototype.move = function(target, amount) {
  target_traj = (target - this.pos).normalize(1);
  random_traj = new Point({length: 0.8, angle: Math.random() * 360})
  new_traj = (target_traj + random_traj + this.movement * 2).normalize(amount * this.speedMult);
  this.bug.rotate(new_traj.angle - this.movement.angle)
  this.pos += new_traj
  this.bug.translate(new_traj)
  this.movement = new_traj
  if (this.pos.x < 0) {
    this.pos.x = width;
    this.bug.translate(new Point(width, 0))
  }
  if (this.pos.x > width) {
    this.pos.x = 0;
    this.bug.translate(new Point(-width, 0))
  }
  if (this.pos.y < 0) {
    this.pos.y = height;
    this.bug.translate(new Point(0, height))
  }
  if (this.pos.y > height) {
    this.pos.y = 0;
    this.bug.translate(new Point(0, - height))
  }
  // flicker wings
  if (this.wings.visible && Math.random() > 0.05) {
    this.wings.visible = false;
  } else {
    if (!this.wings.visible&& Math.random() > 0.1) {
      this.wings.visible = true;
    }
  }
}

Flyer.prototype.flock = function(flyers,  mouse) {
  forces = new Point(0,0);
  for (var i = 0; i < flyers.length; i++) {
    v = flyers[i].pos - this.pos;
    // if (Math.random() > 0.99) { console.log('v: ');console.log(v)}
    if ( v.length >= 40){
    	forces += new Point({angle: v.angle, length: 2})
    } else {
	    if (40 > v.length > 0) {
	    	forces += new Point({angle: v.angle - 180, length: 6})
	    }
    }
  }

	v = mouse - this.pos;
	forces += new Point({angle:   v.angle, length:  12})

  return forces.normalize(4);
}

flyers = []
for (var i = 0; i < 12; i++) {
  flyers.push(new Flyer(new Point(Math.random() * width, height/2 + Math.random() * height * 0.5), {hue: 60, saturation: 1, brightness: 0.0}))

}


var mousePoint = new Point(width/2, 0)
onMouseMove = function(event) {
  mousePoint = event.point
  // console.log(mousePoint)
}

n = 0

function onFrame() {
  for (var i = 0; i < stars.length; i++) {
  	stars[i].draw();
  }
	if (n% cloudFrames == 0){
    a = get_perlin(width, height, blocksize, pn, n/10);
    clouds.run(a);
  }
	for (var i = 0; i < flyers.length; i++) {
    flyer = flyers[i];
    // should eit to prevent it following not-yet born flowers
    attraction = flyer.flock(flyers, mouse= mousePoint);
    flyer.move(flyer.pos + attraction  , 5)
    flyer.bug.bringToFront();
	}
	n += 1;
}


function get_perlin(width, height, blocksize, pn, offset) {
  // This function needs to be generalised
  // produces pseudo-harmonic perlin noise
  a = [];
  for (var i = 0; i <= width / blocksize; i ++) {
    a[i] = [];
    for (var ii = 0; ii <= height / blocksize; ii ++) {
      nn = pn.noise((i + offset/5)/20, (ii + offset/35)/20, offset/100) * 0.5;
      nn += pn.noise((i + offset/10)/20, (ii + offset/70)/20, offset/200) * 0.25;
      nn += pn.noise((i + offset/20)/20, (ii + offset/140)/20, offset/400) * 0.25;
      a[i][ii] = nn;
    }
  }
  return a;
}

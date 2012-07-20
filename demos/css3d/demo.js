
var stage = document.createElement("div");
$(stage).addClass("stage");
$("#demo").append(stage);
var TRANSFORM = Modernizr.prefixed("transform");
var TRANSITION = Modernizr.prefixed("transition");

// load the c64 pixel font and use it to render a string to pixel coordinates
pxxl("../../fonts/c64.bdf", "Cubes!", function (pixels) {
  var shape = new Shape(stage);
  var cubes = [];

  // create a cube for each pixel in the text
  for (var p=0 ; p<pixels.length ; p++) {
    var pixel = pixels[p];
    var cube = new Cube(shape, { size: 24, x: pixel.x, y: pixel.y });
    cubes.push(cube);
  }

  // start with all cubes randomized
  explode(cubes);

  // kick-off animation just slightly after the page has loaded
  setTimeout(function () {

    // enable continuous rotation around y axis
    shape.el.classList.add("rotate-y");

    // start animation loop
    animate(cubes);
  },400);
});

// alternate between randomly position cubes and cubes making letter
// just set the transformation once every couple of seconds.
// css transitions will do the rest
function animate(cubes) {
  makeLetters(cubes);
  setTimeout(function() {
    explode(cubes);
    setTimeout(function() { animate(cubes); }, 3000);
  }, 6000);
}

// return a random number between [-factor/2,factor/2]
function r(factor) { return (Math.random()-0.5) * factor; };

function transition(prop, duration, timingFunc)
{
  // see: http://modernizr.com/docs/#prefixed
  var prefixed = Modernizr.prefixed(prop),
    hyphenated = prefixed.replace(/([A-Z])/g, function(str,m1){ 
      return '-' + m1.toLowerCase();
    }).replace(/^ms-/,'-ms-');
  return hyphenated + " " + duration + " " + timingFunc;
}

// returns a transformation string
function translate3d(x,y,z) { return "translate3d("+x+"px,"+y+"px,"+z+"px)";}

function rotateX(a) { return "rotateX("+a+"deg)"; }
function rotateY(a) { return "rotateY("+a+"deg)"; }

function rotate3d(x,y,z,a) { return "rotate3d("+x+","+y+","+z+","+a+"deg)"; }

// represents a particular side of a cube.
// creates a DOM element with 3d perspective enabled
// depending on which side, it is transformed to face
// either the left,right,top,bottom,front or back of the cube
function Side(cube, which, options) {
  this.el = document.createElement("div");
  this.el.classList.add("shape");

  this.el.style.width = this.el.style.height = options.size + "px";
  var h = 250 + (Math.random()-0.5) * 100;
  this.el.style.backgroundColor = "hsla("+h+",100%,50%,0.5)";
  this.el.style.border = "1px solid black";
  cube.el.appendChild(this.el);

  var t = 0.5* options.size;

  switch(which)
  {
    case "front":
      this.el.style[TRANSFORM] = translate3d(0,0,t);
      break;
    case "right":
      this.el.style[TRANSFORM] = translate3d(t,0,0) + rotateY(90);
      break;
    case "top":
      this.el.style[TRANSFORM] = translate3d(0,t,0) + rotateX(-90);
      break;
    case "back":
      this.el.style[TRANSFORM] = translate3d(0,0,-t) + rotateX(180);
      break;
    case "left":
      this.el.style[TRANSFORM] = translate3d(-t,0,0) + rotateY(-90);
      break;
    case "bottom":
      this.el.style[TRANSFORM] = translate3d(0,-t,0) + rotateX(90);
      break;
  }
}

// represents a 3d cube. creates a DOM element which has 6 childs,
// 1 for each side of the cube
function Cube(shape, options) {

  this.el = document.createElement("div");
  this.el.classList.add("shape");

  this.size = options.size;
  this.x = options.x;
  this.y = options.y;

  this.el.style.width = this.el.style.height = options.size + "px";



  new Side(this, "front", options);
  new Side(this, "left", options);
  new Side(this, "right", options);

  new Side(this, "top", options);
  new Side(this, "bottom", options);
  new Side(this, "back", options);

  shape.el.appendChild(this.el);
}

Cube.prototype.translate3d = function (x,y,z) {
  this.el.style[TRANSFORM] = translate3d(x,y,z);
}

// a container for cubes. creates a DOM element with 3d perspective enabled
function Shape(stage) {
  this.el = document.createElement("div");
  this.el.classList.add("shape");
  stage.appendChild(this.el);
}

// put the cubes back in their position forming letters
function makeLetters(cubes) {
  for (var p=0 ; p<cubes.length ; p++) {

    var cube = cubes[p];
    var dx = -4*6;
    var dy = -4;

    var x = cube.size * (dx+cube.x);
    var y = cube.size * (dy+cube.y);
    cube.el.style[TRANSITION] = transition("transform", "2s", "ease-in"); //"-webkit-transform 2s ease-in";
    cube.translate3d(x,y,0);
  }
}

// transform cubes to random locations
function explode(cubes) {
  for (var p=0 ; p<cubes.length ; p++) {

    var cube = cubes[p];

    cube.el.style[TRANSITION] = transition("transform", "2s", "ease-out"); //"-webkit-transform 2s ease-out";
    cube.el.style[TRANSFORM] = translate3d(r(1000), r(1000), r(1000))
      + rotate3d(r(2), r(2), r(2), 180);
  }
}

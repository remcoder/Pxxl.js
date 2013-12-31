/*
  Original fireworks effect by Paul Lewis (aerotwist) for CreativeJS.
  see: http://creativejs.com/2011/12/day-7-fireworks

  Text effect made using Pxxl.js by Remco Veldkamp (http://remcoder.github.com/Pxxl.js/) 
  and the good ol' C64 bitmap font ;)
*/

var Fireworks = (function() {

  // declare the variables we need
  var particles = window.particles = [],
      mainCanvas = null,
      mainContext = null,
      fireworkCanvas = null,
      fireworkContext = null,
      viewportWidth = 0,
      viewportHeight = 0;

  /**
   * Create DOM elements and get your game on
   */
  function initialize() {

    // start by measuring the viewport
    onWindowResize();

    // create a canvas for the fireworks
    mainCanvas = document.createElement('canvas');
    mainContext = mainCanvas.getContext('2d');

    // and another one for, like, an off screen buffer
    // because that's rad n all
    fireworkCanvas = document.createElement('canvas');
    fireworkContext = fireworkCanvas.getContext('2d');

    // set up the colours for the fireworks
    createFireworkPalette(12);

    // set the dimensions on the canvas
    setMainCanvasDimensions();

    // add the canvas in
    document.body.appendChild(mainCanvas);
    document.addEventListener('mouseup', createFirework, true);
    document.addEventListener('touchend', createFirework, true);

    // and now we set off
    update();
  }

  /**
   * Pass through function to create a
   * new firework on touch / click
   */
  function createFirework() {
    createParticle();
  }

  /**
   * Creates a block of colours for the
   * fireworks to use as their colouring
   */
  function createFireworkPalette(gridSize) {

    var size = gridSize * 10;
    fireworkCanvas.width = size;
    fireworkCanvas.height = size;
    fireworkContext.globalCompositeOperation = 'source-over';

    // create 100 blocks which cycle through
    // the rainbow... HSL is teh r0xx0rz
    for(var c = 0; c < 100; c++) {

      var marker = (c * gridSize);
      var gridX = marker % size;
      var gridY = Math.floor(marker / size) * gridSize;

      fireworkContext.fillStyle = "hsl(" + Math.round(c * 3.6) + ",100%,60%)";
      fireworkContext.fillRect(gridX, gridY, gridSize, gridSize);
      fireworkContext.drawImage(
        Library.bigGlow,
        gridX,
        gridY);
    }
  }

  /**
   * Update the canvas based on the
   * detected viewport size
   */
  function setMainCanvasDimensions() {
    mainCanvas.width = viewportWidth;
    mainCanvas.height = viewportHeight;
  }

  /**
   * The main loop where everything happens
   */
  function update() {
    clearContext();
    requestAnimFrame(update);
    drawFireworks();
  }

  /**
   * Clears out the canvas with semi transparent
   * black. The bonus of this is the trails effect we get
   */
  function clearContext() {
    mainContext.fillStyle = "rgba(0,0,0,0.2)";
    mainContext.fillRect(0, 0, viewportWidth, viewportHeight);
  }

  /**
   * Passes over all particles particles
   * and draws them
   */
  function drawFireworks() {
    var a = particles.length;

    while(a--) {
      var firework = particles[a];

      // if the update comes back as true
      // then our firework should explode
      if(firework.update()) {

        // kill off the firework, replace it
        // with the particles for the exploded version
        particles.splice(a, 1);

        // if the firework isn't using physics
        // then we know we can safely(!) explode it... yeah.
        if(!firework.usePhysics) {
          FireworkExplosions.text(firework);
        }
      }

      // clean up particles outside window
      if (firework.pos.y > innerHeight || firework.pos.x < 0 || firework.pos.x > innerWidth)
        particles.splice(a, 1);

      // pass the canvas context and the firework
      // colours to the
      firework.render(mainContext, fireworkCanvas);
    }
  }

  /**
   * Creates a new particle / firework
   */
  function createParticle(pos, target, vel, color, usePhysics) {

    pos = pos || {};
    target = target || {};
    vel = vel || {};

    particles.push(
      new Particle(
        // position
        {
          x: pos.x || viewportWidth * 0.5,
          y: pos.y || viewportHeight + 10
        },

        // target
        {
          y: target.y || 150 + Math.random() * 100
        },

        // velocity
        {
          x: vel.x || Math.random() * 3 - 1.5,
          y: vel.y || 0
        },

        color || Math.floor(Math.random() * 100) * 12,

        usePhysics)
    );
  }

  /**
   * Callback for window resizing -
   * sets the viewport dimensions
   */
  function onWindowResize() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
  }

  // declare an API
  return {
    initialize: initialize,
    createParticle: createParticle
  };

})();

/**
 * Represents a single point, so the firework being fired up
 * into the air, or a point in the exploded firework
 */
var Particle = function(pos, target, vel, marker, usePhysics) {

  // properties for animation
  // and colouring
  this.GRAVITY  = 0.06;
  this.alpha    = 1;
  this.easing   = Math.random() * 0.02;
  this.fade     = Math.random() * 0.1 + 0.003;
  this.gridX    = marker % 120;
  this.gridY    = Math.floor(marker / 120) * 12;
  this.color    = marker;

  this.pos = {
    x: pos.x || 0,
    y: pos.y || 0
  };

  this.vel = {
    x: vel.x || 0,
    y: vel.y || 0
  };

  this.lastPos = {
    x: this.pos.x,
    y: this.pos.y
  };

  this.target = {
    y: target.y || 0
  };

  this.usePhysics = usePhysics || false;

};

/**
 * Functions that we'd rather like to be
 * available to all our particles, such
 * as updating and rendering
 */
Particle.prototype = {

  update: function() {

    this.lastPos.x = this.pos.x;
    this.lastPos.y = this.pos.y;

    if(this.usePhysics) {
      this.vel.y += this.GRAVITY;
      this.pos.y += this.vel.y;

      // since this value will drop below
      // zero we'll occasionally see flicker,
      // ... just like in real life! Woo! xD
      this.alpha -= this.fade;
    } else {

      var distance = (this.target.y - this.pos.y);

      // ease the position
      this.pos.y += distance * (0.03 + this.easing);

      // cap to 1
      this.alpha = Math.min(distance * distance * 0.00005, 1);
    }

    this.pos.x += this.vel.x;

    return (this.alpha < 0.005);
  },

  render: function(context, fireworkCanvas) {

    var x = Math.round(this.pos.x),
        y = Math.round(this.pos.y),
        xVel = (x - this.lastPos.x) * -5,
        yVel = (y - this.lastPos.y) * -5;

    context.save();
    context.globalCompositeOperation = 'lighter';
    context.globalAlpha = Math.random() * this.alpha;

    // draw the line from where we were to where
    // we are now
    context.fillStyle = "rgba(255,255,255,0.3)";
    context.beginPath();
    context.moveTo(this.pos.x, this.pos.y);
    context.lineTo(this.pos.x + 1.5, this.pos.y);
    context.lineTo(this.pos.x + xVel, this.pos.y + yVel);
    context.lineTo(this.pos.x - 1.5, this.pos.y);
    context.closePath();
    context.fill();

    // draw in the images
    context.drawImage(fireworkCanvas,
      this.gridX, this.gridY, 12, 12,
      x - 6, y - 6, 12, 12);
    context.drawImage(Library.smallGlow, x - 3, y - 3);

    context.restore();
  }

};

/**
 * Stores references to the images that
 * we want to reference later on
 */
var Library = {
  bigGlow: document.getElementById('big-glow'),
  smallGlow: document.getElementById('small-glow')
};

/**
 * Stores a collection of functions that
 * we can use for the firework explosions. Always
 * takes a firework (Particle) as its parameter
 */
var FireworkExplosions = {

 
  text: function(firework) {
    var text = strings[window.count];
    var glyphs = [];

    for (var t=0 ; t<text.length ; t++)
    {
      var pixels = window.font.getPixels(text[t]);
      glyphs.push(pixels);
    }

    var delay = 0;
    for (var g=0; g<glyphs.length ; g++)
    {
      delay += 200 + Math.random() * 200;
      this.glyphDelayed(firework, glyphs, g, delay);
    }
    window.count++;
    window.count %= strings.length;
  },

  glyphDelayed : function(firework, glyphs, g, delay) {
    var _this = this;
      setTimeout(function() {
        _this.glyph(firework, glyphs, g);
      }, delay);
  },

  glyph: function(firework, glyphs, g) {
    var pixels = glyphs[g];

    var rx = Math.random() * 10;
    var ry = Math.random() * 6;
    var color = Math.floor(Math.random() * 100) * 12;

    for(var p=0 ; p<pixels.length ; p++)
    {
      var pixel = pixels[p];
      var px = rx + (g * 16 + pixel.x) - glyphs.length * 8 + 1;
      var py = ry + pixel.y - 8;
      var d = Math.sqrt(px * px + py * py);

      for (var i=0 ; i<4 ; i++)
      {
        var randomVelocity = 1 + Math.random() * 4;

        Fireworks.createParticle(
          {
            x: firework.pos.x + px * 15 + Math.random() * 3,
            y: firework.pos.y + py * 15 + Math.random() * 3
          },
          null,
          {
            x: (pixel.x-8)/8 * randomVelocity, //Math.cos(randomAngle) * randomVelocity,
            y: (pixel.y-10)/8 * randomVelocity //Math.sin(randomAngle) * randomVelocity
          },  
          color, //firework.color,
          true);
      }
    }
  }
};

function fireworksGenerator() {
  Fireworks.createParticle();
  setTimeout(fireworksGenerator, 3000);
}

// wait for images to be loaded
window.onload = function() {
  Font.Load("fonts/c64d.bdf", function(font) {
    window.font = font;
    window.strings = [
      "happy",
      "new",
      "year",
      "best",
      "wishes",
      "for", 
      "2014",
      "make",
      "things",
      "not",
      "war"
    ];
    window.count = 0;
    Fireworks.initialize();

    fireworksGenerator();    
  });
};

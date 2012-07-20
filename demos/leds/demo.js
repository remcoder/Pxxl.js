function rgba(r,g,b,a) {
  return "rgba("+ ~~r +","+ ~~g +","+ ~~b +"," + a +")";
}

function led(px,py,alpha) {
  ctx.fillStyle = rgba(255,0,0,alpha);
  var x = dx + px * size;
  if (x < 0) x+= width;
  var y = dy + py * size;
  ctx.beginPath();
  ctx.arc(x*1.2, y*1.4, size/2, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
}

var text = "leds are cool";
var canvas = document.createElement("canvas");
$("#demo").append(canvas);
var ctx = canvas.getContext('2d');
var size = 30;
var width = ~~(text.length * 8 * size * 1.2);
var dx = innerWidth;
var dy = -40 +(innerHeight - size*8*1.4) /2;

pxxl("../../fonts/c64.bdf", text , function (pixels) {
    pixels = pixels.sort(function(p1,p2){ return p2.x-p1.x; });
    console.log("font loaded");
    canvas.width = innerWidth;
    canvas.height = innerHeight; //;
    ctx.fillStyle = "red";
    

    setInterval(function() {
      //ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.clearRect(0,0,canvas.width, canvas.height);

      ctx.fillStyle = "red";
      for (var i=0 ; i<pixels.length ; i++)
      {
        //console.log("pixel",p);
        var p = pixels[i];

        led(p.x,p.y,0.8);
        led(p.x+1,p.y,0.3); // afterglow 1
        led(p.x+2,p.y,0.1); // afterglow 1
      }
      dx-=size;
      if (dx < -width) dx = 0;
    }, 100);
});
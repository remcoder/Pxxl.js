pxxl('../../fonts/c64d.bdf', 'hello world', function (pixels) {
  var canvas = document.createElement("canvas");
  canvas.width=900;
  canvas.height=80;
  $("#demo").append(canvas);
  var ctx = canvas.getContext('2d');

  setInterval(function() {
    // loop through the pixels and also keep track of a counter
    for (var p=0,count =0 ; p<pixels.length ; p++,count++) {
      var pixel = pixels[p],
        x = pixel.x * 5,
        y = pixel.y * 5;
      
      // compute the hue based on the counter + the current time 
      // to make the colors cycle
      var hue = count + new Date()/10; 

      ctx.fillStyle = "hsl("+ hue%360 +",100%,50%)";
      ctx.fillRect(x,y,4,4);
    }
  },100);
});
(function() {
  
  var Circles = Font.Styles["circles"] = my.Class(Font.BaseStyle, {
    constructor: function(ctx, font)  {
      Circles.Super.call(this, ctx, font);
    },
  
    drawPixels: function(pixels, options) {
      var ctx = this.ctx;
      var fill = options.fill;
      //var stroke = options.stroke;

      var size = 1;
    
      for (var p=0 ; p<pixels.length ; p++) {
        var px = size/2 + pixels[p].x;
        var py = size/2 + pixels[p].y;

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.arc(px, py, size/2, 0, 2*Math.PI);
        ctx.fill();
        //if (options.fill) ctx.fillRect(px,py,1,1);
        //if (options.stroke) ctx.strokeRect(px,py,1,1);
      }
    }
  });

})();

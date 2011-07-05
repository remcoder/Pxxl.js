(function() {
  
var BaseRenderer = Font.BaseStyle = Font.Styles["squares"] = my.Class({
  constructor: function(ctx, font)  {
    this.ctx = ctx;
    this.font = font;
  },
  
  fillText : function(text, x,y, options) {
     //console.log(text, x,y, maxWidth);
     var ctx = this.ctx;
     var font = this.font;
     var hspacing = font.FONTBOUNDINGBOX[0];

     var fill = options.fill;
     var stroke = options.stroke;
     var pixels = [];
     
     if (fill) ctx.fillStyle = fill;
     if (stroke) ctx.strokeStyle = stroke;

     for( var t=0 ; t<text.length ; t++) // characters in a string x
     {
       var chr = text.charCodeAt(t);
       var glyph = font.glyphs[chr];

       var bitmap = glyph.bitmap;
       var dx = x+t * hspacing; 
       var dy = font.defaultHeight() - glyph.height(); // some glyphs have fewer rows

       for ( var r=0 ; r<bitmap.length ; r++) // pixelrows in a glyph y
       {
         var row = bitmap[r];

         for (var b=0 ; b<row.length ; b++) // bytes in a row x
         {
           var byt = row[b];

           var offset = b*8; //consecutieve bytes are drawn next to each other
           var bit = 256;

           while (bit >>>= 1) // bits in a byte x
           {  
             if (byt & bit)
             {
               var px = dx+offset;
               var py = dy+y+r;
              
                pixels.push({x:px, y:py, row:r, column:offset });
             }
             offset++;
           } 
         }
       }   
     }
    
    console.log('# pixels: ', pixels.length);
    this.drawPixels(pixels, options);
   },

   drawPixels: function(pixels,options) {
     var ctx = this.ctx;
     for (var p=0 ; p<pixels.length ; p++) {
       var px = pixels[p].x;
       var py = pixels[p].y;
     
       if (options.fill) ctx.fillRect(px,py,1,1);
       if (options.stroke) ctx.strokeRect(px,py,1,1);
    }
   }
});

})();
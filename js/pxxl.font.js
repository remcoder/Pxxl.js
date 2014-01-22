function Font(version, comments, properties, glyphs) {
  this.version = version;
  this.comments = comments;
  this.properties = properties;
  this.glyphs = glyphs;
  //console.log(glyphs);
  //console.log("BDF version " + this.version);
  // if (comments && comments.length)
  //   console.log(comments.join(""));
};

Font.prototype = {

  size: function() {
    return this.SIZE[0];
  },

  getGlyph: function(character) {
    var c = character.charCodeAt(0);

    return this.glyphs[c];
  },

  defaultWidth: function () {
    return this.FONTBOUNDINGBOX[0];
  },

  defaultHeight: function () {
    return this.FONTBOUNDINGBOX[1];
  },

  bit: function(text, row, column ) {
    var t = ~~(column / 8);
    if (t < 0 || t > text.length-1) return false;
    var c = text.charCodeAt(t);

    //console.log(t);
    var g = this.glyphs[c];
    if (g)
      return g.bit(row , column % 8);
    else
      return false;
  },

  getPixels : function(text) {
    //console.log(text, x,y, maxWidth);
    var ctx = this.ctx;
    var hspacing = this.FONTBOUNDINGBOX[0];

    var pixels = [];


    for( var t=0 ; t<text.length ; t++) // characters in a string x
    {
     var chr = text.charCodeAt(t);
     var glyph = this.glyphs[chr];

     var bitmap = glyph.bitmap;
     var dx = t * hspacing;
     var dy = this.defaultHeight() - glyph.height(); // some glyphs have fewer rows

     for ( var r=0 ; r<bitmap.length ; r++) // pixelrows in a glyph y
     {
       var row = bitmap[r];

       for (var b=0 ; b<row.length ; b++) // bytes in a row x
       {
         var byt = row[b];

         var offset = b*8; //consecutive bytes are drawn next to each other
         var bit = 256;

         while (bit >>>= 1) // bits in a byte
         {
           if (byt & bit)
           {
             var px = dx+offset;
             var py = dy+r;

              pixels.push({x:px, y:py, row:r, column:offset });
           }
           offset++;
         }
       }
     }
    }

    return pixels;
  }
};
 
module.exports = Font;

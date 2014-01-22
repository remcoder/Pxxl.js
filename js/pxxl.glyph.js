function Glyph(name, bitmap) {
  //console.log("Glyph", name, bitmap);
  this.name = name;
  this.bitmap = bitmap;
};

Glyph.prototype = {

  set: function (x,y,value) {
    var bit = 1 << this.width() - x - 1;
    var byt = ~~(bit/256);
    bit %= (byt+1) * 256;

    //console.log(this.bitmap);

    if (value)
      this.bitmap[y][byt] |= bit;
    else
      this.bitmap[y][byt] &= ~bit;

    //console.log(this.bitmap);
  },

  get: function (x,y) {
    var bit = 1 << this.width() - x - 1;
    var byt = ~~(bit/256);
    bit %= (byt+1) * 256;

    var result = this.bitmap[y][byt] & bit;
    //console.log("x:"+x, "y:"+y, "bit:"+bit, "byte:"+byte, "value:"+result );
    return !!result;
  },

  width: function () {
    return this.BBX[0];
  },

  height: function () {
    return this.BBX[1];
  },

  toString: function() {
    var result = "";
    for (var y=0 ; y<this.bitmap.length ; y++)
    {
      for (var x=0 ; x<this.width() ; x++)
      {
        result += this.get(x,y) ? "*" : " ";
      }
      result += "/n";
    }

    return result;
  }
};

module.exports = Glyph;

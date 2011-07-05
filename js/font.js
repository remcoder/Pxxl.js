var Font = function(version, comments, properties, glyphs) {
  this.version = version;
  this.comments = comments;
  this.properties = properties;
  this.glyphs = glyphs;
  //console.log(glyphs);
  //console.log("BDF version " + this.version);
  if (comments && comments.length)
    console.log(comments.join(""));
}

Font.ParseJSON = function (obj)
{
  var f = new Font(obj.version, obj.comments, obj.properties, {});
  //console.log(f);
  for (var k in obj)
  {
    if (obj.hasOwnProperty(k) && k != "glyphs")
      f[k] = obj[k];
  }
  
  f.glyphs = {};
  for (var g in obj.glyphs)
  {
    //console.log(g);
    if (obj.glyphs.hasOwnProperty(g))
      f.glyphs[g] = Font.Glyph.ParseJSON(obj.glyphs[g]);
  }
  return f;
}

Font.prototype = {  
  size: function() {
    return this.SIZE[0];
  },
  
  getGlyph: function(character)
  {
    var c = character.charCodeAt(0);

    return this.glyphs[c];
  },
  
  drawString: function(text, x, y, ctx) {
    for( var t=0 ; t<text.length ; t++)
    {
      var c = text.charCodeAt(t);

      //console.log(t);
      var g = this.glyphs[c];
      g.draw(ctx, x+t * 8,y);
    }
  },
  
  defaultWidth: function () 
  {
    return this.FONTBOUNDINGBOX[0];
  },
  
  defaultHeight: function () 
  {
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
  }
}


Font.Styles = {};
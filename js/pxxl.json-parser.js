Pxxl.Glyph.ParseJSON = function (obj) {

  var g = new Pxxl.Glyph(obj.name, obj.bitmap);

  // shallow copy
  for (var k in obj) {
    if (obj.hasOwnProperty(k))
      g[k] = obj[k];
  }
  //console.log("glyph", g.toString());
  return g;
};

Pxxl.Font.ParseJSON = function (obj) {
  var f = new Pxxl.Font(obj.version, obj.comments, obj.properties, {});
  //console.log(f);
  for (var k in obj) {
    if (obj.hasOwnProperty(k) && k != "glyphs")
      f[k] = obj[k];
  }

  f.glyphs = {};
  for (var g in obj.glyphs) {
    //console.log(g);
    if (obj.glyphs.hasOwnProperty(g))
      f.glyphs[g] = Pxxl.Glyph.ParseJSON(obj.glyphs[g]);
  }
  return f;
};
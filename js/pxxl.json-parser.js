Pxxl.Glyph.ParseJSON = function (obj) {

  var g = new Pxxl.Glyph(obj.name, obj.bitmap);

  // shallow copy
  for (var k in obj) {
    if (obj.hasOwnProperty(k))
      g[k] = obj[k];
  }
  return g;
};

Pxxl.Font.ParseJSON = function (obj) {
  var f = new Pxxl.Font(obj.version, obj.comments, obj.properties, {});
  for (var k in obj) {
    if (obj.hasOwnProperty(k) && k != "glyphs")
      f[k] = obj[k];
  }

  f.glyphs = {};
  for (var g in obj.glyphs) {
    if (obj.glyphs.hasOwnProperty(g))
      f.glyphs[g] = Pxxl.Glyph.ParseJSON(obj.glyphs[g]);
  }
  return f;
};
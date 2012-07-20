function pxxl(fontUrl, text, draw) {
  Pxxl.LoadFont(fontUrl, function(font) {
    var pixels = font.getPixels(text);
    draw(pixels, font);
  });
}

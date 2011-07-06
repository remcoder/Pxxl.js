function Pxxl(options)
{
  var text = options.text;
  var rendererType = options.renderer;
  var scale = options.scale;

  Font.Load(options.font, function(font) {
    var before = new Date;
    var renderTime;
    
    // prepare canvas
    var canvas = document.getElementById(options.elementId);
    var ctx = canvas.getContext('2d');

    ctx.clearRect(0,0, canvas.width, canvas.height);
    canvas.height = font.FONTBOUNDINGBOX[1] * scale + Math.abs(options.Yoffset || 1) * scale;
    canvas.width = font.FONTBOUNDINGBOX[0] * text.length * scale + Math.abs(options.Xoffset || 1) * scale;
    
    // set scaling modifier for future drawing operations. this way we can conveniently draw pixel-for-pixel.
    ctx.scale(scale, scale);
    ctx.lineWidth = 1/scale;
    ctx.clearRect(0,0, canvas.width, canvas.height);

    var renderer = new Font.Styles[options.style](ctx, font);

    var tx = options.Xoffset < 0 ? -options.Xoffset : 0;
    var ty = options.Yoffset < 0 ? -options.Yoffset : 0;
    renderer.fillText(text,tx,ty, options);
    // renderTime = new Date - before
    // console.log("render time:", renderTime + "ms", (renderTime / text.length).toFixed(2) + "ms/char");
  });
}
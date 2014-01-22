var parse = require("./pxxl.bdf-parser.js");
var fs = require("fs");

function pxxl(file, text, draw) {
	console.log("loading", file);
	fs.readFile(file, { encoding: 'ascii'}, function (err, data) {
	  if (err) throw err;
	  //console.log("loaded", data);

	  console.log("parsing..");
	  var font = parse(data);

	  console.log("calculating pixels..");
	  var pixels = font.getPixels(text);

	  console.log("drawing..");
	  draw(text, pixels, font);
	});
}

module.exports = pxxl;
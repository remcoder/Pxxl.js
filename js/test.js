var pxxl = require("./utils.js");

pxxl('../fonts/c64.bdf', 'Hello World', function(text, pixels, font) {
	var buffer = [];
	//console.log(pixels);

	for(var line=0 ; line<8; line++)
		buffer.push(new Array(text.length*8).join("."));

	for (var i=0 ; i<pixels.length ; i++)
	{
		var p = pixels[i];
		// console.log(typeof buffer[p.y]);
		// console.log(buffer[p.y][p.x]);
		var tmp=buffer[p.y].split("");
		tmp.splice(p.x,1,"#");

		buffer[p.y] = tmp.join("");
	}
	
	for(var line=0 ; line<8; line++)
		console.log(buffer[line]);

});

var pxxl = require("./utils.js");

// ascii art demo
pxxl('../fonts/c64.bdf', 'Hello World', function(text, pixels, font) {

	// initialize buffer, 8 columns wide for each character
	var buffer = [];
	for(var line=0 ; line<8; line++)
		buffer.push(new Array(text.length*8).join("."));

	// draw pixels to buffer
	for (var i=0 ; i<pixels.length ; i++)
	{
		var p = pixels[i];

		// for every pixel, replace a character in the buffer
		var tmp=buffer[p.y].split("");
		tmp.splice(p.x,1,"#");
		buffer[p.y] = tmp.join("");
	}
	
	// write buffer to screen
	for(var line=0 ; line<8; line++)
		console.log(buffer[line]);
});

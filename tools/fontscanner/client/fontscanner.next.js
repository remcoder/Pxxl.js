
var fontFile = new Deps.Dependency();

var dummy = new Image();
var fontFileLoaded = false;
dummy.onerror = () => { 
	fontFile.changed();
	fontFileLoaded = true;
};
dummy.src = 'BigDots.woff'

Meteor.startup(function() {
	var ascii = _.range(33, 127)
      .map( code => String.fromCharCode(code) ).join("");
     Session.set('text', "a");
})

Template.scanner.events({
	'change input[name=text]' : function(evt) {
		Session.set('text', evt.currentTarget.value);
	},
	'keyup input[name=text]' : function(evt) {
		Session.set('text', evt.currentTarget.value);
	}
})

Template.scanner.helpers({
  'color' : function() {
  	return Session.get('color')
  },
  'text' : function() {
  	return Session.get('text')
  },
  'glyphs' : function() {
  	// return ['$', 'M'];
  	return (Session.get('text') || "").split("");
    return _.range(33, 127)
      .map( code => String.fromCharCode(code) );
  }
});  

var pixels = Blaze.ReactiveVar([]);

Template.glyph.helpers({
	encoding : function () { return this.charCodeAt(0); },
	bytes : function () { 

		return pixels.get().map(row => {
			var left = row.slice(0,8);
			var right = row.slice(8);

			var bit = 128;
			var resultLeft = 0;
			for(var i=0 ; i<8 ; i++) {
				if( left[i] )
					resultLeft |= bit;
				bit >>>= 1;
			}

			var bit = 128;
			var resultRight = 0;
			for(var i=0 ; i<8 ; i++) {
				if( right[i] )
					resultRight |= bit;
				bit >>>= 1;
			}

			return _.str.pad(resultLeft.toString(16).toUpperCase(),2,"0") + 
				_.str.pad(resultRight.toString(16).toUpperCase(),2,"0");
		});
	}
});



Template.glyph.rendered = function ()  {
	var canvas = this.find('canvas');
	var svg = this.find('svg');
	var pre = this.find('pre');
	var ctx=canvas.getContext("2d");

	ctx.fillStyle = "#ddd";
	for(var y=0 ; y<16 ; y++)
	for(var x=0 ; x<16 ; x++)
		if( (x+y) % 2 )
			ctx.fillRect(x*16,y*16,14,16);
	
	ctx.font="normal 256px BigDots";
	ctx.fillStyle = "rgba(0,0,0,1)";
	
	this.autorun(() => { 	// create reactive context
		fontFile.depend();  // ensure the reactive code is run again when the fontFile dep changes
		if (fontFileLoaded) {
			Meteor.setTimeout(()=> {
				ctx.fillText(this.data.split("") ,0, 256-16*3 - 2);
				var pixelData = scan(canvas);
				pixels.set(pixelData);
				build(svg, pixels);
			},0);
		}
		// console.log('autorun')
	})
}

function scan(canvas) {
	var ctx=canvas.getContext("2d");
	var glyph = [];

	for(var y=0 ; y<256 ; y+=16) {
		var row = [];
		glyph.push(row);
		for(var x=0 ; x<256 ; x+=16) {
			var cx=x+7, cy=y+7;
			var data = ctx.getImageData(cx, cy, 1,1).data;

			if (data[0] == 0 && data[3] > 0) {
				ctx.fillStyle = "rgba(255,0,0,0.5)";
				ctx.fillRect(x,y,16,16);
				row.push(1);
			}else{
				row.push(0);
			}
		}
	}
	return glyph;
}

function makeSVG(tag, attrs) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}

function build(svg, pixels) {
	// console.log(svg);
	$(svg).empty();
	var glyph = pixels.get();

	for(var y=0 ; y<16 ; y++)
	for(var x=0 ; x<16 ; x++) {

		if( (x+y) % 2 ) {
			var rect = makeSVG('rect', {x: x*16, y: y*16, width: 16, height: 16, fill: '#ddd'});
			$(svg).append(rect);
		}

		if (glyph[y][x])
		{
			var cx=x*16+8, cy=y*16+8;
			var circle= makeSVG('circle', {cx: cx, cy: cy, r:8, fill: '#000'});
			$(svg).append(circle);
		}
	}	
}



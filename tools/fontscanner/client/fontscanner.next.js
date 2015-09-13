
var fontFile = new Deps.Dependency();

var dummy = new Image();
var fontFileLoaded = false;
var characters = _.range(33, 127)
      .map( code => String.fromCharCode(code) );

var pixelWidth = 12.3,
		pixelHeight = 12.3;


dummy.onerror = () => {
	fontFile.changed();
	fontFileLoaded = true;
};
dummy.src = 'StitchWarrior.ttf'

Meteor.startup(function() {
	var ascii = _.range(33, 127)
      .map( code => String.fromCharCode(code) ).join("");
     Session.set('text', ascii);
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
    return characters;
  },
  bdfGlyph : function() {
		if (!pixels[this]) console.log('no pixels[this]',this);
		//return pixels && pixels[this] && pixels[this].get().bdfCode;
		return null
	}
});

var pixels = {};

function bytes(char) {
	// console.log(char);
	if (!pixels[char] || !pixels[char].get().pixelData) return [];
	return pixels[char].get().pixelData.map(row => {
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

characters.forEach(function(c) {
	pixels[c] = new Blaze.ReactiveVar([]);
})

function bdfCode (char) {
	var encoding = char.charCodeAt(0);
	var output= 'STARTCHAR C00{{encoding}}\nENCODING {{encoding}}\nSWIDTH 666 0\nDWIDTH 16 0\nBBX 16 16 0 -2\nBITMAP\n{{bytes}}\nENDCHAR'
		.replace('{{encoding}}', encoding)
		.replace('{{encoding}}', encoding)
		.replace('{{bytes}}', bytes(char).join('\n'));
	return output;
}


Template.glyph.helpers({
	encoding : function () { return this.charCodeAt(0); },
	bytes : function () {

		return bytes(this);
	}
});



Template.glyph.rendered = function ()  {
	var canvas = this.find('canvas');
	var svg = this.find('svg');
	var pre = this.find('pre');
	var ctx = canvas.getContext("2d");
	var char = this.data;
	ctx.fillStyle = "#ddd";
	for(var y=0 ; y<16 ; y++)
	for(var x=0 ; x<16 ; x++)
		if( (x+y) % 2 )
			ctx.fillRect(x*pixelWidth,y*pixelHeight, pixelWidth, pixelHeight);

	ctx.font="normal 256px 'StitchWarrior'";
	ctx.fillStyle = "rgba(0,0,0,1)";

	this.autorun(() => { 	// create reactive context
		fontFile.depend();  // ensure the reactive code is run again when the fontFile dep changes
		if (fontFileLoaded) {
			Meteor.setTimeout(()=> {
				ctx.fillText(this.data.split("") ,0, 256-pixelHeight*3 + 3 );
				var pixelData = scan(canvas);
				pixels[char].set( {
					pixelData : pixelData,
					bdfCode : bdfCode(char)
				});
				build(svg, pixelData);
			},0);
		}
		// console.log('autorun')
	})
}

function scan(canvas) {
	var ctx=canvas.getContext("2d");
	var glyph = [];

	for(var y=0 ; y<256 ; y+=pixelHeight) {
		var row = [];
		glyph.push(row);
		for(var x=0 ; x<256 ; x+=pixelWidth) {
			var cx=x+Math.round(pixelWidth/2), cy=y+Math.round(pixelHeight/2);
			var data = ctx.getImageData(cx, cy, 1,1).data;

			if (data[0] == 0 && data[3] > 0) {
				ctx.fillStyle = "rgba(255,0,0,0.5)";
				ctx.fillRect(x,y, pixelWidth, pixelHeight);
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

function build(svg, pixelData) {
	// console.log(svg);
	$(svg).empty();

	for(var y=0 ; y<16 ; y++)
	for(var x=0 ; x<16 ; x++) {

		if( (x+y) % 2 ) {
			var rect = makeSVG('rect', {x: x*16, y: y*16, width: 16, height: 16, fill: '#ddd'});
			$(svg).append(rect);
		}

		if (pixelData[y][x])
		{
			var cx=x*16+8, cy=y*16+8;
			var circle= makeSVG('circle', {cx: cx, cy: cy, r:8, fill: 'cyan'});
			$(svg).append(circle);
		}
	}
}



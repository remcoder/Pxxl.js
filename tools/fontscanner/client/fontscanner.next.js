
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
    return _.range(33, 127)
      .map( code => String.fromCharCode(code) );
  }
});  

Template.glyph.rendered = function ()  {
	var canvas = this.find('canvas');
	var svg = this.find('svg');
	var ctx=canvas.getContext("2d");

	ctx.fillStyle = "#ddd";
	for(var y=0 ; y<16 ; y++)
	for(var x=0 ; x<16 ; x++)
		if( (x+y) % 2 )
			ctx.fillRect(x*16,y*16,16,16);
	

	ctx.font="normal 256px BigDots";
	ctx.fillStyle = "black"	;
	this.autorun(() => {
		fontFile.depend();
		if (fontFileLoaded) {
			Meteor.setTimeout(()=> {
				ctx.fillText(this.data.split("") ,0, 256-16*3 - 2);
				var glyph = scan(canvas);
				// console.log(glyph);
				build(svg, glyph);
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

			if (data[0] == 0 && data[3] == 255) {
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

function build(svg, glyph) {
	// console.log(svg);
	$(svg).empty();

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


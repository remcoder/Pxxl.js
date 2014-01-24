var jsparse = require("../lib/jsparse.js");
var PxxlFont = require("./pxxl.font.js");
var PxxlGlyph = require("./pxxl.glyph.js");





var ch = jsparse.ch;
var range = jsparse.range;
var choice = jsparse.choice;
var repeat = jsparse.repeat;
var sequence = jsparse.sequence;
var action = jsparse.action;
var join_action = jsparse.join_action;
var token = jsparse.token;
var ps = jsparse.ps;
var repeat1 = jsparse.repeat1;
var repeat0 = jsparse.repeat0;
var butnot = jsparse.butnot;
var optional = jsparse.optional;



var EXCLAMATION_MARK = ch("!");
var AT = ch("@");
var HASH = ch("#");
var DOLLAR = ch("$");
var PERCENT = ch("%");
var CARET = ch("^");
var AMPERSAND = ch("&");
var ASTERISK = ch("*");
var LEFT_PARENTHESIS = ch("(");
var RIGHT_PARENTHESIS = ch(")");
var MINUS = ch("-");
var UNDERSCORE = ch("_");
var PLUS = ch("+");
var EQUALS = ch("=");
var LEFT_ACCOLADE = ch("{");
var RIGHT_ACCOLADE = ch("}");
var LEFT_BRACKET = ch("[");
var RIGHT_BRACKET = ch("]");
var COLON = ch(":");
var SEMICOLON = ch(";");
var QUOTE = ch("'");
var DOUBLE_QUOTE = ch('"');
var PIPE  = ch("|");
var BACKSLASH  = ch("\\");
var TILDE  = ch("~");
var BACKTICK = ch("`");
var COMMA = ch(",");
var PERIOD = ch(".");
var LESS_THAN = ch("<");
var GREATER_THAN = ch(">");
var QUESTION_MARK = ch("?");
var SLASH = ch("/");

var SpecialChar = choice(EXCLAMATION_MARK, AT, HASH, DOLLAR, PERCENT, CARET, AMPERSAND, ASTERISK, LEFT_PARENTHESIS, RIGHT_PARENTHESIS, MINUS, UNDERSCORE, PLUS, EQUALS, LEFT_ACCOLADE, RIGHT_ACCOLADE, LEFT_BRACKET, RIGHT_BRACKET, COLON, SEMICOLON, QUOTE, DOUBLE_QUOTE, PIPE, BACKSLASH, TILDE, BACKTICK, COMMA, PERIOD, LESS_THAN, GREATER_THAN, QUESTION_MARK, SLASH);

var Digit = range("0","9");
var LowerCase = range("a", "z");
var UpperCase = range("A", "Z");

var CR = ch('\r');
var LF = ch('\n');
var CRLF = sequence(CR, LF);
var LINE_END = choice(CRLF,CR,LF);

var Space = ch(' ');
var Tab = ch("\t");

var Alpha = choice(LowerCase, UpperCase);
var AlphaNum = choice(Alpha, Digit);
var NoSpaceChar = choice(AlphaNum, SpecialChar);
var Char = choice(NoSpaceChar, Space);
var Spaces = flatten(repeat1(Space));
var Text = flatten(repeat1(Char));

var EOL = sequence(repeat0(Space), LINE_END);

var QUOTED_STRING = pick(1, sequence(DOUBLE_QUOTE, flatten(repeat1(butnot(Char, DOUBLE_QUOTE))), DOUBLE_QUOTE));

var HexDigit =  choice(range("a", "f"), range("A", "F"), Digit);
var Byte = action(flatten(sequence(HexDigit,HexDigit)), function(s) { return parseInt(s, 16); });
var ByteArray = repeat1(Byte);
var Natural = flatten(repeat1(Digit));

var NegativeNumber = flatten(sequence(MINUS, Natural));
var Integer = action(choice(Natural, NegativeNumber), parseInt);
//var Word = flatten(repeat1(Alpha));

//var PropName = flatten(sequence(Alpha, flatten(repeat0(choice(Alpha, UNDERSCORE)))));
var PropName = flatten(repeat1(choice(Alpha, UNDERSCORE)));
var Prop1 = action(sequence(PropName, repeat1(pick(1,sequence(Spaces, Integer)))), MakeProp1);
var Prop2 = action(sequence(PropName, Spaces, QUOTED_STRING), MakeProp2);
var Prop3 = action(sequence(PropName, Spaces, flatten(repeat1(NoSpaceChar))), MakeProp2);
var ENDPROPERTIES = token("ENDPROPERTIES");
var Prop = trace(choice(Prop1, Prop2, Prop3, ENDPROPERTIES), "prop");
var PropRow = pick(0, sequence(Prop, EOL));

var BitmapRow = pick(0,sequence( ByteArray, EOL ));
var BITMAP = token("BITMAP");
var BitmapStart = sequence(BITMAP, EOL);
var Bitmap = trace(pick(1, sequence(BitmapStart, repeat0( BitmapRow ))), "bitmap");

var STARTCHAR = token("STARTCHAR");
var ENDCHAR = token("ENDCHAR");
var GlyphStart = trace(pick(2, sequence(STARTCHAR, Space, Text, EOL)), "glyphstart");
var GlyphEnd = sequence(ENDCHAR, EOL);
var Glyph = trace(action(sequence(GlyphStart, repeat0(PropRow), Bitmap, GlyphEnd), MakeGlyph), "glyph");

//var Glyph = action(_Glyph, function(ast) { console.log(ast)} );

var STARTFONT = token("STARTFONT");
var ENDFONT = token("ENDFONT");
var Version = flatten(sequence(Natural, PERIOD, Natural));
var FontStart = trace(pick(2, sequence( STARTFONT, Spaces, Version, EOL )), "fontstart");
var FontEnd = trace(sequence( ENDFONT, optional(EOL)), "fontend"); // EOL optional for now
var COMMENT = token("COMMENT");
var Comment = pick(2, sequence(COMMENT, optional(Space), optional(Text)));
var CommentRow = trace(pick(0, sequence(Comment, EOL)), "comment");


var BDF = action(sequence( repeat0(CommentRow), FontStart, repeat0(CommentRow), repeat0(butnot(PropRow, GlyphStart)), repeat0(Glyph), FontEnd), MakeFont); // empty container is allowed

// input: sequence( FontStart, repeat0(CommentRow), repeat0(butnot(PropRow, GlyphStart)), repeat0(Glyph), FontEnd)
function MakeFont(ast) {
  var formatVersion = ast[1];
  var comments = ast[0].concat(ast[2]);
  var properties = ast[3];
  var glyphs = PropertyList2Hash(ast[4]);
  var f = new PxxlFont(formatVersion, comments, properties, glyphs);
  return PropertyBagMixin(f, properties);
}

// input: sequence(GlyphStart, repeat0(PropRow), Bitmap, GlyphEnd
function MakeGlyph(ast) {
  var name = ast[0];
  var properties = ast[1];
  var bitmap = ast[2];
  
  var g =  new PxxlGlyph(name, bitmap);
  //console.log("glyph", g.toString());
  g = PropertyBagMixin(g, properties);
  return { name: g["ENCODING"], value :g};
}

function PropertyBagMixin(obj, proplist) {
  for( var i=0 ; i<proplist.length ; i++ ) {
    var prop = proplist[i];

    // WATCH OUT! possibly overwriting pre-existing properties!
    obj[prop.name] = prop.value
  }

  return obj;
}

function PropertyList2Hash(proplist) {
  var hash = {};

  for( var i=0 ; i<proplist.length ; i++ ) {
    var prop = proplist[i];

    // WATCH OUT! possibly overwriting pre-existing properties!
    hash[prop.name] = prop.value
  }

  return hash;
}

function MakeProp1(ast) {
  var value = ast[1];
  var name = ast[0];

  if (name == "ENCODING" || name == "CHARS")
    value = value[0];

  return { name: name, value: value };
}

function MakeProp2(ast) {
  return { name: ast[0], value: ast[2] };
}

function flatten(p) {
  return join_action(p, "");
}

function pick(i, p) {
  return action(p, function(ast) { return ast[i]; });
}

function trace(p, label) {
  var traceon = false;//Pxxl.trace;
  var traceall = false; //Pxxl.traceall;

  if (!traceon) return p;

  return function(state) {
    try {
      var result = p(state);
    } catch (err) {
      var error  =1;
    }
    if (error || !result.ast) {
      var matched = state.input.substring(0,state.index);
      var lines = matched.split("\n");
      //lines[lines.length-1]
      console.error(label, "failed at line", lines.length, state);
    }
    if (!error && result.ast && traceall)
      console.log(label, "matches", result.matched, "\nAST:", result.ast);

    return result;
  }
}

function pre(input) {
  var lines = input.split("\n");
  for (var l=lines.length-1 ; l>=0 ; l--) {
    var line = ltrim(lines[l]);

    if (line == "")
      lines.splice(l, 1);
    else
      lines[l] = line;
  }

  return lines.join("\n");
}

function ltrim(stringToTrim) {
	return stringToTrim.replace(/^\s+/,"");
}

function parseBDF (input, trace, traceall) {
  //Pxxl.trace = trace;
  //Pxxl.traceall = traceall;

  input = pre(input);
  var state = ps(input);
  var before = +new Date;
  var result = BDF(state);
  var time = +new Date - before;

  if (result.ast) {
    //console.log("parsing took: " + time + "ms");
    return result.ast;
  }

  throw new Error("Unable to parse font!");
}

// export oLFy single function
module.exports = parseBDF


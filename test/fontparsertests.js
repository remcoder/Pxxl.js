(function() {

var full = assertFullyParsed;
var part = assertParseMatched;
var fail = assertParseFailed;

function FontParserTests() {
    full("DOUBLE_QUOTE", '"');
      full("Digit", '3');
      full("NEWLINE", '\n');
      full("EOL", '\n');
      fail("Space", '');
      full("Space", ' ');
      fail("Spaces", '');
      full("Spaces", ' ');
      full("Spaces", '  ');
      full("LowerCase", 'a');
      fail("UpperCase", 'a');
      fail("LowerCase", 'A');
      full("UpperCase", 'A');
      full("LowerCase", 'a');
      
      full("repeat1(SpecialChar)", "!@#$%^&*())-_=+");
      full("repeat1(SpecialChar)", "[{]};:'|,<.>/?");
      part("repeat1(SpecialChar)", "*2", "*");
      
      full("BACKSLASH", "\\");
      full("DOUBLE_QUOTE", "\"");
      full("repeat1(SpecialChar)", "\\\"");
      
      for ( var h=0 ; h<16 ; h++ )    
        full("HexDigit", h.toString(16));  
      
      for ( var h=0 ; h<16 ; h++ )    
        full("HexDigit", h.toString(16).toUpperCase());
      
      part("HexDigit", (16).toString(16), "1");
      
      for (var l=0 ; l<26 ; l++)
      {
        var charcode = "a".charCodeAt(0) + l;
        if (charcode <= "f".charCodeAt(0))
          full("HexDigit", String.fromCharCode(charcode) );
        else
          fail("HexDigit", String.fromCharCode(charcode) );
      }
      
      for (var l=0 ; l<26 ; l++)
      {
        var charcode = "A".charCodeAt(0) + l;
        if (charcode <= "F".charCodeAt(0))
          full("HexDigit", String.fromCharCode(charcode) );
        else
          fail("HexDigit", String.fromCharCode(charcode) );
      }
      
      // for ( var h=0 ; h<256 ; h++ )    
      //        full("Byte", h.toString(16));  
      //      
      //      for ( var h=0 ; h<256 ; h++ )    
      //        full("Byte", h.toString(16).toUpperCase());
      //          
      //      for (var l=0 ; l<26 ; l++)
      //      {
      //        var charcode = "a".charCodeAt(0) + l;
      //        if (charcode <= "f".charCodeAt(0))
      //          full("Byte", String.fromCharCode(charcode) );
      //        else
      //          fail("Byte", String.fromCharCode(charcode) );
      //      }
      //      
      //      for (var l=0 ; l<26 ; l++)
      //      {
      //        var charcode = "A".charCodeAt(0) + l;
      //        if (charcode <= "F".charCodeAt(0))
      //          full("Byte", String.fromCharCode(charcode) );
      //        else
      //          fail("Byte", String.fromCharCode(charcode) );
      //      }
      
      // full("Word", "aap");
      // full("Word", "noot");
      // full("Word", "mies");
      // fail("Word", "0mies");
      // fail("Word", "-mies");
      // part("Word", "aa0p", "aa");
      
      // full("Word" , "SIZE");
      full("sequence(PropName,Spaces,Natural)" , "SIZE 16");
      full("Prop1" , "SIZE 16 72 72");
      full("Prop1" , "STARTPROPERTIES 18");
      full("MINUS", "-");
      full("Natural", "1");
      fail("Natural", "-1");
      full("Integer", "1");
      full("Integer", "-1");
      
      full("Natural", "11");
      fail("Natural", "-11");
      full("Integer", "11");
      full("Integer", "-11");
      
      full("Prop1", "FONTBOUNDINGBOX 8 16 0 -2");
      full("sequence(DOUBLE_QUOTE, repeat1(butnot(NoSpaceChar, DOUBLE_QUOTE)), DOUBLE_QUOTE)", '"hoi"')
      full("Text", 'ETL');
      full("QUOTED_STRING", '"ETL"');
      full("QUOTED_STRING", '"Portions copyright 1991,1993,1998 clySmic Software."');
      full("Prop2", 'FOUNDRY "ETL"');
      full("PropName", 'CHARSET_REGISTRY');
      full("Prop2", 'CHARSET_REGISTRY "ISO8859"');
      
      full("Prop2", 'COPYRIGHT "Portions copyright 1991,1993,1998 clySmic Software."');
      full("Prop2", 'FONT "-clySmic-Tektite-Medium-R-Normal--15-140-75-75-C-90-ISO8859-1"');
      
      full("Prop", "FONTBOUNDINGBOX 8 16 0 -2");
      fail("PropRow", "FONTBOUNDINGBOX 8 16 0 -2", "FONTBOUNDINGBOX 8 16 0 -2");
      full("Prop", 'FOUNDRY "ETL"');
      full("Prop", 'CHARSET_REGISTRY "ISO8859"');
      full("Prop", 'COPYRIGHT "Portions copyright 1991,1993,1998 clySmic Software."');
      full("Prop", 'FONT "-clySmic-Tektite-Medium-R-Normal--15-140-75-75-C-90-ISO8859-1"');
      full("Prop", 'FONT -ETL-Fixed-Medium-R-Normal--16-160-72-72-C-80-ISO8859-1');
      
      

      fail("BitmapRow", "a");
      fail("BitmapRow", "1a-");
      full("BitmapRow", "a1\n");
      fail("BitmapRow", "ff");
      full("BitmapRow", "ff\n");
      full("BitmapRow", "00\n");
      full("BitmapRow", "1e234a\n");
      fail("BitmapRow", "-3\n");
      
      fail("BitmapRow", "app\n");
      fail("BitmapRow", "1.0\n", "1");
      
      full( "Bitmap", "BITMAP\n" +
            "00\n" +
            "00\n"+
            "18\n"+
            "08\n");
      
      fail( "Bitmap", " BITMAP\n" +
            "00\n" +
            "00\n"+
            "18\n"+
            "08\n");
      
      fail( "Bitmap", "BITMAP\n" +
            "x0\n" +
            "00\n"+
            "18\n"+
            "08\n", "BITMAP");
    
      fail( "Bitmap", "BITMAP\n" +
            "x0\n" +
            "00\n"+
            "18\n"+
            "08", "BITMAP");
      
      full("GlyphStart", 
      "STARTCHAR U+0041\n");
      
      full("Glyph",
      "STARTCHAR ASTERISK\n" +
      "ENCODING 42\n" +
      "SWIDTH 500 0\n" +
      "DWIDTH 8 0\n" +
      "BBX 8 16 0 -2\n" +
      "BITMAP\n" +
      "00\n" +
      "49\n" +
      "2a\n" +
      "1c\n" +
      "2a\n" +
      "ENDCHAR\n");
      
      full("Glyph",
      "STARTCHAR A\n" +
      "ENCODING 65\n" +
      "SWIDTH 617 0\n" +
      "DWIDTH 9 0\n" +
      "BBX 9 15 0 -3\n" +
      "BITMAP\n" +
      "0000\n" +
      "0c00\n" +
      "1200\n" +
      "7180\n" +
      "6180\n" +
      "ENDCHAR\n");
      
      full("Glyph",
      "STARTCHAR 0x0000\n" +
      "ENCODING 0\n" +
      "SWIDTH 576 0\n" +
      "DWIDTH 6 0\n" +
      "BBX 6 13 0 -4\n" +
      "BITMAP\n" +
      "00\n" +
      "ENDCHAR\n");
      
      full("Version" ,"2.1");
      full("FontStart" ,"STARTFONT 2.1\n");
      full("BDF" ,"STARTFONT 2.1\nENDFONT\n");
      
      full("BDF" ,
      "STARTFONT 2.1\n" + 
      "FONTBOUNDINGBOX 8 16 0 -2\n" +
      "ENDFONT\n");
      
      part("repeat0(butnot(PropRow, GlyphStart))" ,
      "FONTBOUNDINGBOX 8 16 0 -2\n" +
      "STARTCHAR A\n", "FONTBOUNDINGBOX 8 16 0 -2\n");
      
    
    
      full("Glyph" , 
      "STARTCHAR A\n" +
      "ENCODING 65\n" +
      "SWIDTH 617 0\n" +
      "DWIDTH 9 0\n" +
      "BBX 9 15 0 -3\n" +
      "BITMAP\n" +
      "0000\n" +
      "0c00\n" +
      "1200\n" +
      "7180\n" +
      "6180\n" +
      "ENDCHAR\n");
    
    
      full("Bitmap" ,
      "BITMAP\n" +
      "0000\n");
      
      full("Glyph" ,
      "STARTCHAR A\n" +
      "BITMAP\n" +
      "0000\n" +
      "ENDCHAR\n");
      
      full("BDF" ,
      "STARTFONT 2.1\n" + 
      "STARTCHAR A\n" +
      "BITMAP\n" +
      "0000\n" +
      "ENDCHAR\n" +
      "ENDFONT\n");
      
      full("Comment", "COMMENT You can use, copy, modify, distribute this file for free.");    
      full("Comment",  "COMMENT 92.12.01 created by Takahashi N. <ntakahas@etl.go.jp>");
      
      full("GlyphStart" , "STARTCHAR SMALL LETTER y WITH DIAERESIS\n");
      full("PropRow" , "ENCODING 255\n");
      full("PropRow", "BBX 8 16 0 -2\n");
      full("GlyphEnd", "ENDCHAR\n");
      full("FontEnd", "ENDFONT\n");
      
      full("Glyph", "STARTCHAR SMALL LETTER y WITH DIAERESIS\n" +
      "ENCODING 255\n" +
      "SWIDTH 500 0\n" + 
      "DWIDTH 8 0\n" +
      "BBX 8 16 0 -2\n" +
      "BITMAP\n" +
      "00\n" +
      "ENDCHAR\n");

    // fails! 
     full("sequence( FontStart, repeat0(CommentRow), repeat0(PropRow), repeat0(Glyph), FontEnd)", "STARTFONT 2.1\n" +
     "STARTCHAR SMALL LETTER y WITH DIAERESIS\n" +
     "ENCODING 255\n" +
     "SWIDTH 500 0\n" + 
     "DWIDTH 8 0\n" +
     "BBX 8 16 0 -2\n" +
     "BITMAP\n" +
     "00\n" +
     "ENDCHAR\n" +
     "ENDFONT\n");    
}

function isflat (p, input, expected) {
  var result = eval(p)(ps(input)).ast;
  assertEqual(p + " not flat: expected " + expected + " but got: " + result, result , expected )
}

function compare(x, y) {
   if (x === y) {//For reference types:returns true if x and y points to same object
       return true;
   }
   if (x.length != y.length) {
       return false;
   }
   for (key in x) {
       if (x[key] !== y[key]) {//!== So that the the values are not converted while comparison
           return false;
       }
   }
   return true;
}


function assertArraysEqual(msg, arr1, arr2) {
  if (compare(arr1, arr2) )
    passed.push(msg);
  else
    failed.push(msg);
}
function ast (p, input, expected) {
  var result = eval(p)(ps(input)).ast;
  assertArraysEqual("expected " + p + "('" + input + "') --> " + expected + " but got: " + result, result , expected )
}

function AstProccessorTests() { 
  isflat("Spaces", "  ", "  ");
  isflat("Text", "hoi", "hoi");
  isflat("Text", "remco.veldkamp@xs4all.nl", "remco.veldkamp@xs4all.nl");
  isflat("Text", "94.09.14 modified by Takahashi N. <ntakahas@etl.go.jp>", "94.09.14 modified by Takahashi N. <ntakahas@etl.go.jp>");
  isflat("Natural", "123", "123");
  isflat("NegativeNumber", "-12", "-12");

  ast("Integer", "-123", -123);
  ast("Byte", "a2", 162);
  
  ast("BitmapRow", "ff\n", [255]);
  ast("BitmapRow", "ff00\n", [255,0]);
  
  // fails because we shouldn't compare array's like this
  // ast("Bitmap", "BITMAP\n" +
  //   "00\n" + 
  //   "ff\n", [0,255]);
}


 time(function() { 
   console.warn("testing BDF font parser"); 
   runTests(FontParserTests);
   console.warn("testing BDF ast processor");
   runTests(AstProccessorTests);
 });
 
})();
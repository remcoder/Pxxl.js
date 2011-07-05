import sys,os, glob, commands

TARGET=sys.argv[1]

files = ["LICENSE.txt", "../lib/jsparse.js", "../lib/my.class.min.js", "js/font.js", "js/font.glyph.js", "js/font.loader.js", "js/parser.js",  "js/styles/squares.js", "js/styles/blocks.js", "js/styles/circles.js"]

JS = " ".join(["--js ../" + filename for filename in files ])

# more externs:  http://code.google.com/p/closure-compiler/source/browse/#svn/trunk/contrib/externs
externs = ["jquery-1.6.js"]

EXTERNS=" ".join(["--externs externs/" + filename for filename in externs])

# options:
#
# ADVANCED_OPTIMIZATIONS
# SIMPLE_OPTIMIZATIONS
# WHITESPACE_ONLY
# --debug true
# --formatting PRETTY_PRINT

cmd = "java -jar compiler.jar %s --compilation_level WHITESPACE_ONLY %s --summary_detail_level 0 --debug false --warning_level VERBOSE --js_output_file %s " % (EXTERNS, JS, TARGET)

print cmd


if os.path.exists(TARGET):
  os.remove(TARGET)
  
os.system(cmd)

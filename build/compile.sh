echo compiling with Google Closure..
TARGET=pxxl-0.2.min.js
python compile.py $TARGET
wc -c $TARGET
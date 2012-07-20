var Pxxl = Pxxl || {};

(function() {
  // FIXME: determine type based on mimetype and/or extension
  var LoadFont = function LoadFont(url, callback) {
    if(url.indexOf("json") > -1 )
      $.getJSON(url, function(data) {
        callback(Pxxl.Font.ParseJSON(data));
      });
    else
      $.get(url, function(data) {
        callback(Pxxl.Font.ParseBDF(data));
      }, 'text');
  };

  // memoization funcion for use with callbacks
  function memoize2(f) {
    var cache = {};

    return function (arg, callback) {
      var cached = cache[arg];

      if (typeof cached !== 'undefined')
      {
        //console.log('cache hit: ', arg);
        return callback(cached);
      }
      else
      {
        //console.log('cache miss:', arg);
        return f(arg, function(result) {
          cache[arg] = result;
          return callback(result);
        });
      }
    }
  }

  Pxxl.LoadFont = memoize2(LoadFont);

})();

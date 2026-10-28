;(function() {
  //from: http://www.quirksmode.org/js/xmlhttp.html
  function sendRequest(url,callback,postData) {
      var req = createXMLHTTPObject();
      if (!req) return;
      var method = (postData) ? "POST" : "GET";
      req.open(method,url,true);
      if (postData)
          req.setRequestHeader('Content-type','application/x-www-form-urlencoded');
      req.onreadystatechange = function () {
          if (req.readyState != 4) return;
          if (req.status != 200 && req.status != 304) {
              return;
          }
          callback(req);
      }
      if (req.readyState == 4) return;
      req.send(postData);
  }

  var XMLHttpFactories = [
      function () {return new XMLHttpRequest()},
      function () {return new ActiveXObject("Msxml2.XMLHTTP")},
      function () {return new ActiveXObject("Msxml3.XMLHTTP")},
      function () {return new ActiveXObject("Microsoft.XMLHTTP")}
  ];

  function createXMLHTTPObject() {
      var xmlhttp = false;
      for (var i=0;i<XMLHttpFactories.length;i++) {
          try {
              xmlhttp = XMLHttpFactories[i]();
          }
          catch (e) {
              continue;
          }
          break;
      }
      return xmlhttp;
  }


  function LoadFont(url, callback) {
    // FIXME: determine type based on mimetype and/or extension
    sendRequest(url,function(req) {
      callback(Pxxl.Font.ParseBDF(req.responseText));
    });
  };

  // memoization funcion for use with callbacks
  function memoize2(f) {
    var cache = {};

    return function (arg, callback) {
      var cached = cache[arg];

      if (typeof cached !== 'undefined') {
        return callback(cached);
      }
      else {
        return f(arg, function(result) {
          cache[arg] = result;
          return callback(result);
        });
      }
    };
  }

  Pxxl.LoadFont = memoize2(LoadFont);

})();

var fs = require('fs')
  , path = require('path')
  , config = require('./config');


// helpers/combiners
function memoize (fn) {
  var cache = {}, key;
  return function () {
    key = arguments[0] + (arguments[1] || '.all');
    if (cache[key]) {
      return cache[key];
    } else {
      return (cache[key] = fn.apply(this, arguments));
    }
  };
}

// method definitions
// ------------------
//
// fetchFiles
// ----------
var fetchFiles = function (basePath, extname) {

  var nFiles = [];

  if (extname && extname[0] !== '.') {
    extname = '.' + extname;
  }

  (function loop (fpath) {
    fs.readdirSync(fpath).forEach(function (p) {
      pp = path.join(fpath, p)
      var extMatch = extname ? path.extname(p) === extname : true
      if (fs.lstatSync(pp).isDirectory()) {
        loop(pp);
      } else if ((p[0] !== '.' || p[1] !== '.') && extMatch) {
        nFiles.push(pp);
      }
    });
  })(basePath);

  return nFiles;
};


// API
module.exports.fetchFiles = memoize(fetchFiles);



var paths = require('./paths')
	, path = require('path')
	,	fs = require('fs');

module.exports = {
	"deps": [
		path.join(paths.libDir, '/jquery/jquery.js'),
		path.join(paths.libDir, '/angular/angular.js'),
		path.join(paths.libDir, '/angular-animate/angular-animate.js'),
		path.join(paths.libDir, '/angular-cookies/angular-cookies.js'),
		path.join(paths.libDir, '/angular-resource/angular-resource.js'),
		path.join(paths.libDir, '/angular-route/angular-route.js'),
		path.join(paths.libDir, '/angular-bootstrap/ui-bootstrap-tpls.js'),
		path.join(paths.libDir, '/greensock-js/src/uncompressed/TweenMax.js'),
		path.join(paths.libDir, '/sass-bootstrap/dist/js/bootstrap.js'),
		path.join(paths.libDir, '/underscore/underscore.js')
  ],
	"deps_min": [
		path.join(paths.libDir, '/jquery/jquery.min.js'),
		path.join(paths.libDir, '/angular/angular.min.js'),
		path.join(paths.libDir, '/angular-animate/angular-animate.min.js'),
		path.join(paths.libDir, '/angular-cookies/angular-cookies.min.js'),
		path.join(paths.libDir, '/angular-resource/angular-resource.min.js'),
		path.join(paths.libDir, '/angular-route/angular-route.min.js'),
		path.join(paths.libDir, '/angular-bootstrap/ui-bootstrap-tpls.min.js'),
		path.join(paths.libDir, '/greensock-js/src/minified/TweenMax.min.js'),
		path.join(paths.libDir, '/sass-bootstrap/dist/js/bootstrap.min.js'),
		path.join(paths.libDir, '/underscore/underscore.min.js')
  ],
  "angular": filesByExt(paths.angularDir, '.js'),
  "server": filesByExt(paths.serverDir, '.js'),
  "css": filesByExt(paths.cssDir + '/tmp', '.css'),
	"fonts": filesByExt(paths.fontsDir)
}

function filesByExt (basePath, extname) {
	files = [];
	if (extname) {
		extname = extname[0] === '.' ? extname : '.' + extname;
	}
	(function loop (fpath) {
		fs.readdirSync(fpath).forEach(function (p) {
			pp = path.join(fpath, p)
			extMatch = extname ? path.extname(p) === extname : true
			if (fs.lstatSync(pp).isDirectory()) {
				loop(pp);
			} else if ((p[0] !== '.' || p[1] !== '.') && extMatch) {
				files.push(pp);
			}
		});
	})(basePath);
	return files;
}
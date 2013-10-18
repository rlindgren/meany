var paths = require('./paths')
  , path = require('path')
  , fetch = require('./utils').fetchFiles;

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
  "angular":     fetch(paths.angularDir, '.js'),
  "server":      fetch(paths.serverDir, '.js'),
  "css":         fetch(paths.cssDir + '/tmp', '.css'),
  "fonts":       fetch(paths.fontsDir),
  "sass":        fetch(paths.sassDir, '.scss'),
  "jade":        fetch(paths.jadeDir, '.jade'),
  "serverSpecs": fetch(paths.serverSpecsDir, '.js')
}
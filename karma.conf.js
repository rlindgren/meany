// Karma configuration
// Generated on Mon Sep 23 2013 15:36:20 GMT-0400 (EDT)
var paths = require('./paths');

module.exports = function(config) {
  config.set({

	// base path, that will be used to resolve files and exclude
	basePath: '.',


	// frameworks to use
	frameworks: ['jasmine'],


	// list of files / patterns to load in the browser
	files: [
		paths.libDir + '/angular/angular.js',
		paths.libDir + '/angular-mocks/angular-mocks.js',
		paths.angularDir + '/app.js',
	  paths.ngServicesDir + '/*.js',
	  paths.ngModelsDir + '/*.js',
	  paths.ngControllersDir + '/*.js',
	  paths.ngFiltersDir + '/*.js',
	  paths.ngDirectivesDir + '/*.js',
	  paths.clientSpecsDir + '/unit/**/*.js'
	],


	// list of files to exclude
	exclude: [

	],


	// test results reporter to use
	// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
	reporters: ['dots'],


	// web server port
	port: 9877,


	// enable / disable colors in the output (reporters and logs)
	colors: true,


	// level of logging
	// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
	logLevel: config.LOG_INFO,


	// enable / disable watching file and executing tests whenever any file changes
	autoWatch: false,


	// Start these browsers, currently available:
	// - Chrome
	// - ChromeCanary
	// - Firefox
	// - Opera
	// - Safari (only Mac)
	// - PhantomJS
	// - IE (only Windows)
	browsers: ['Chrome'],

	plugins: [
	  'karma-jasmine',
    'karma-chrome-launcher',
	  'karma-phantomjs-launcher'
	],

	// If browser does not capture in given timeout [ms], kill it
	captureTimeout: 60000,


	// Continuous Integration mode
	// if true, it capture browsers, run tests and exit
	singleRun: true
  });
};

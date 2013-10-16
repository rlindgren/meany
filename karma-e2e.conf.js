// Karma configuration
// Generated on Mon Sep 23 2013 15:21:32 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

	// base path, that will be used to resolve files and exclude
	basePath: '.',

	urlRoot: '/_karma_/',

	// frameworks to use
	frameworks: ['jasmine', 'ng-scenario'],


	// list of spec files / patterns to load in the browser
	files: [
	  'app/client/specs/e2e/*Spec.js'
	],

	// url proxy to root of app
	proxies : {
    '/': 'http://localhost:3000/'
  },

	// list of files to exclude
	exclude: [

	],


	// test results reporter to use
	// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
	reporters: ['progress'],


	// web server port
	port: 9876,


	// enable / disable colors in the output (reporters and logs)
	colors: true,


	// level of logging
	// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
	logLevel: config.LOG_INFO,


	// enable / disable watching file and executing tests whenever any file changes
	autoWatch: true,


	// Start these browsers, currently available:
	// - Chrome
	// - ChromeCanary
	// - Firefox
	// - Opera
	// - Safari (only Mac)
	// - PhantomJS
	// - IE (only Windows)
	browsers: ['Chrome', 'PhantomJS'],

	plugins: [
	  'karma-jasmine',
	  'karma-chrome-launcher',
	  'karma-firefox-launcher',
	  'karma-phantomjs-launcher',
	  'karma-ng-scenario'
	],


	// If browser does not capture in given timeout [ms], kill it
	captureTimeout: 60000,


	// Continuous Integration mode
	// if true, it capture browsers, run tests and exit
	singleRun: true
  });
};

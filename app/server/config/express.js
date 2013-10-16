var express = require('express')
	,	mongoStore = require('connect-mongo')(express)
	, middleware = require('../middleware');

module.exports = function(app, passport, config) {
	app.set('showStackError', true);

	app.use(express.logger('tiny'));

	// call before express.static
	app.use(express.compress({
		filter: function(req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	// set views path, template engine and default layout
	app.set('views', config.paths.viewsDir);
	app.set('view engine', 'jade');

	app.enable("jsonp callback");

	// call before session()
	app.use(express.cookieParser());

	// bodyParser call before methodOverride
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	// express/mongo session storage
	app.use(express.session({
		secret: config.db._sessionsecret,
		store: new mongoStore({
			url: config.db.address,
			collection: 'sessions'
		})
	}));

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	// router before static
	app.use(app.router);

	// set favicon and static directory
	app.use(express.favicon());
	app.use(express.static(config.paths.publicDir));


	// send status 500, unless error, then send 404
	app.use(function (err, req, res, next) {

		if (err) return next();

		console.error(err.stack); // log the error
		res.status(500).render('500', {
			error: err.stack
		});
	});

	// Assume 404 since no middleware responded
	app.use(function (req, res, next) {
		res.render('index');
	});
};
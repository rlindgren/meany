exports = module.exports = function (app, passport, io, config) {

	// connect to the database
	require( 'mongoose' ).connect(config.db.address);


	var paths = config.paths;


	// load model schemas and validations
	require(paths.modelsDir)(config);

	// load Passport authentication strategies
	require(paths.server.passport)(passport, config);

	// load Express config and connect middleware
	require(paths.server.express)(app, passport, config);

	// load routes prior to server config
	require(paths.routesDir)(app, passport, config);

	// load server-side socket listeners/emitters
	require(paths.socketsDir)(io);



};
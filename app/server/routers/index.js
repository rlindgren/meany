
module.exports = function (app, passport, config) {

	// API
	require('./auth')(app, passport, config);
	require('./users')(app, passport, config);

	// home path
	require('./app')(app);

};
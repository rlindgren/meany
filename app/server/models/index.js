// load model schemas
module.exports = function (config) {
	var model, models = config.paths.models;

	for (model in models) {
		require(models[model]);
	}
};
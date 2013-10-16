describe('global server config', function () {
	var config = require('../config');

	it('should have a "paths" object', function () {
		expect(config.paths).toBeTruthy();
	});

});
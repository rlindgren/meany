describe('app paths object', function () {

	var paths = require('../config').paths;

	describe('all paths should be valid paths', function () {
		var fs = require('fs');
		function pathsExist (paths) {
			if (typeof paths === 'object') {
				for (var key in paths) {
					pathsExist(paths[key]);
				}
			}
			if (typeof paths === 'string') {
				var p = paths.split('/');
				p = p.slice(5, p.length).join('/') || 'root';
				it(p + ' should exist', function () {
					expect(fs.existsSync(paths)).toBeTruthy();
				});
			}
		}
		pathsExist(paths);
	});
});
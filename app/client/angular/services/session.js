angular.module('meany.state').factory("Session", function () {

	// App specific information
	return {
		user: {
			access: 'guest'
		}
	};

});
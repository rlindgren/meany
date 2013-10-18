var $router;

angular.module('meany.router')

.config(['$routeProvider', function $routeProviderRef ($routeProvider) {
	$router = $routeProvider;
}])

.factory('Router', ['$route', '$location', 'routeAuthenticator', function Router ($route, $location, routeAuthenticator) {

	/**
	 * `addRoute` procedure for adding a single route to `$route.routes`.
	 *
	 * This function also supplies the route with all necessary authentication
	 * outfittings, in accordance with the access-levels granted when defining
	 * routes in `routes.js`.
	 */
	var addRoute = function addRoute () {
		var path        = arguments[0]
			,	routeConfig = arguments[1] || {}
			,	access      = arguments[2] || void 0;

		if (!arguments.length || arguments.length < 2) {
			throw new Error('Function signature doesn\'t match arguments structure.');
		}
		if (access) {
			if (routeConfig.resolve) {
				routeConfig.resolve = _.extend(routeConfig.resolve, { Access: routeAuthenticator });
			} else {
				routeConfig.resolve = { Access: routeAuthenticator };
			}
			if (routeConfig.controller) {
				routeConfig.controller.$inject += ['Access'];
			} else {
				routeConfig.controller = ['Access', function (Access) {}];
			}
			routeConfig = _.extend(routeConfig, {access: access});
		}
		$router.when(path, routeConfig);
	};

	/**
	 * The exposed `Router` module object
	 *
	 * API: Router#when, Router#otherwise, Router#end
	 */
	return {
		when: function when () {
			var self = this;
			if ((arguments[0] && typeof arguments[0] === 'string') || arguments[0] === null) {
				addRoute.apply(self, arguments);
			} else if (arguments[0][0] && typeof arguments[0][0] === 'string') {
				addRoute.apply(self, arguments[0]);
			} else if (arguments[0][0][0] && typeof arguments[0][0][0] === 'string') {
				arguments[0].forEach(function (route) {
					addRoute.apply(self, route);
				});
			} else {
				throw new Error('Function signature doesn\'t match arguments structure.');
			}
			return this;
		},

		otherwise: function otherwise (routeObj) {
			this.when(null, routeObj);
			return this;
		},

		end: function end () {
			if ($router) { $router = null; }
			$route.current = $route.routes[$location.path()];
			$route.reload();
		}
	};
}]);
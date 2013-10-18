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
	var addRoute = function addRoute (path, routeConfig, access) {
		routeConfig = routeConfig || {}
		access = access || void 0;

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
			routeConfig = _.extend(routeConfig, { access: access });
		}
		$router.when(path, routeConfig);
	};

	/**
	 * The exposed `Router` module object
	 *
	 * API: Router#when, Router#otherwise, Router#end
	 */
	return {
		when: function when (path, routeConfig, access) {
			var self = this;
			if ((path && typeof path === 'string') || path === null) {
				addRoute.apply(self, arguments);
			} else if (path[0] && typeof path[0] === 'string') {
				addRoute.apply(self, path);
			} else if (path[0][0] && typeof path[0][0] === 'string') {
				path.forEach(function (route) {
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
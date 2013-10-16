'use strict';
// Source: /Users/lindgrenryan/stack/meany/app/client/angular/app.js
angular.module('meany', [
	'ngCookies', 'ngResource', 'ngAnimate',
	'meany.routes', 'meany.io', 'meany.state', 'meany.auth'
]);
angular.module('meany.state', []);
angular.module('meany.routes', ['ngRoute']);
angular.module('meany.io', []);
angular.module('meany.auth', []);
// Source: /Users/lindgrenryan/stack/meany/app/client/angular/config.js
// Setting HTML5 Location Mode
angular.module('meany')

.config(['$locationProvider', '$logProvider', function ($locationProvider, $logProvider) {
  $locationProvider.html5Mode(true).hashPrefix("!");
}]);


// Source: /Users/lindgrenryan/stack/meany/app/client/angular/controllers/authCtrl.js
angular.module('meany.auth').controller('authCtrl', ['$scope', 'Auth', function ($scope, Auth) {

	$scope.user = {};
	$scope.message = 'Log in for awesomeness!';

	$scope.signup = function () { Auth.signup($scope.user); };
	$scope.signin = function () { Auth.signin($scope.user); };

}]);
// Source: /Users/lindgrenryan/stack/meany/app/client/angular/controllers/headerCtrl.js
angular.module('meany').controller('headerCtrl', [
	'$scope', '$location', 'Session', 'Auth', 'App',
function ($scope, $location, Session, Auth, App) {

	$scope.session = Session;
	$scope.appName = App.name;

	$scope.menu = [{
		"title": "Home",
		"link": "/home"
	}];

	$scope.init = function init () { };
	$scope.signout = function () { Auth.signout(); };

	$scope.isSelected = function isSelected (item) {
		if ($location.path() === item.link) { return "active"; } return "";
	};

}]);
// Source: /Users/lindgrenryan/stack/meany/app/client/angular/controllers/indexCtrl.js
angular.module('meany')

.controller('indexCtrl', ['$scope', function ($scope) {

}]);
// Source: /Users/lindgrenryan/stack/meany/app/client/angular/directives/errorAlert.js
angular.module('meany.auth').directive('errorAlert', function () {
	return {
		restrict: 'E',
		replace: false,
		template: '<p class="margin-none"><strong>{{errmsg}}</strong>{{err}}</p>',
		controller: ['$scope', 'Session', function ($scope, Session) {
			$scope.session = Session;
			$scope.errmsg = '';
			$scope.err    = '';
			$scope.$on('$routeChangeError', function (event, curr, prev, rejection) {
				$scope.errmsg = 'Access denied: ';
				$scope.err    = '"' + curr.originalPath + '" path restricted to <' +
					(typeof curr.access === 'object' ? curr.access.join(', ') : curr.access) + '> access only.';
			});
			$scope.$on('Auth:loginFailed', function (error, response) {
				$scope.errmsg = response.data.message + " " || 'Authentication failed: ';
				$scope.err    = response.data.errors.Error  || 'Access denied.';
			});
			$scope.$on('$routeChangeSuccess', function () {
				$scope.errmsg = '';
				$scope.err    = '';
			});
		}]
	};
});
// Source: /Users/lindgrenryan/stack/meany/app/client/angular/filters/index.js

// Source: /Users/lindgrenryan/stack/meany/app/client/angular/init.js

$(document).ready(function() {
  // Fixes facebook redirect bug (?)
  if (window.location.hash === "#_=_") window.location.hash = "";

  // Start 'er up
  angular.bootstrap(document, ['meany']);
});
// Source: /Users/lindgrenryan/stack/meany/app/client/angular/routes.js


angular.module('meany.routes')

.run(['Auth', 'Router', '$q', function (Auth, Router, $q) {
  // restore user session to client or create anonymous guest profile
  Auth.restoreSession()

  // load routes, optional permissions are 3rd argument (type: Array)
  .then(function () {
    Router.when([
      [
        '/',
        { templateUrl: 'views/index.html',
          controller: 'indexCtrl' },
        ['guest', 'user', 'admin']
      ],
      [
        '/home',
        { templateUrl: 'views/home.html',
          controller: 'indexCtrl' },
        ['user', 'admin']
      ],
      [
        '/signup',
        { templateUrl: 'views/signup.html',
          controller: 'authCtrl' },
        ['guest']
      ],
      [
        '/signin',
        { templateUrl: 'views/signin.html',
          controller: 'authCtrl' },
        ['guest']
      ]
    ])
    .otherwise({ redirectTo: '/' })
    .end(); // must call `end()` after defining routes
  });
}]);
// Source: /Users/lindgrenryan/stack/meany/app/client/angular/run.js
/**
 * Authentication Module - Run-time User Retrieval
 */

// Source: /Users/lindgrenryan/stack/meany/app/client/angular/services/app.js
angular.module('meany').factory("App", function () {

	// App specific information
	return {
		name: "meany",
		version: "0.0.8",
		locale: "us_EN"
	};

});
// Source: /Users/lindgrenryan/stack/meany/app/client/angular/services/auth.js
angular.module('meany.auth')

.config(['$httpProvider', function ($httpProvider) {
	$httpProvider.interceptors.push(['$rootScope', '$q', function ($rootScope, $q) {
		return {
			'responseError': function responseError (resp) {
				var deferred = $q.defer();
				if (resp.status === 401) {
					$rootScope.$broadcast('Auth:loginFailed', resp);
					deferred.reject(resp);
				} else {
					deferred.resolve(resp);
				}
				return deferred.promise;
			}
		};
	}]);
}])

.factory('Auth', [
	'$q', '$http', '$cookieStore', '$location', 'Session',
function ($q, $http, $cookieStore, $location, Session) {
	return {
		signup: function (userObject) {
			var self = this;
			var deferred = $q.defer();
			$http.post('/api/users', userObject)
			.then(function (response) { self._restoreState(response); });
			return deferred.promise;
		},

		signin: function (credentials) {
			var self = this;
			var deferred = $q.defer();
			$http.post('/auth/signin', credentials)
			.then(function (response) { self._restoreState(response); });
			return deferred.promise;
		},

		signout: function () {
			var self = this;
			var deferred = $q.defer();
			$http.get('/auth/signout')
			.then(function (response) { self._restoreState(response); });
			return deferred.promise;
		},

		restoreSession: function () {
			var self = this;
			var deferred = $q.defer();
			$http.get('/auth/user').then(function (response) {
				self._setCurrentUser(response, deferred);
			});
			return deferred.promise;
		},

		/**
		 * restore state after authentication action and redirect to index path ('/')
		 * @param  {Object} data [Server response object]
		 * @return void
		 */
		_restoreState: function (response) {
			if (!response.data.errors) {
				$cookieStore.put('user', response.data.user);
				Session.user = response.data.user;
				$location.path('/');
			}
		},

		/**
		 * sets Session and cookie user
		 * @param {Object} serverResponse [Object returned from server]
		 * @return void
		 */
		_setCurrentUser: function (s, deferred) {
			// `Session.user`'s state is known until this method is called in `routes.js`.
			// This happens during the `run` phase of app init or app state restore.
			var u = $cookieStore.get('user') || Session.user;
			if (u.username && s.data.user.username && u.username === s.data.user.username) {
				Session.user = u;
			} else {
				$cookieStore.put('user', s.data.user);
				Session.user = s.data.user;
			}
			deferred.resolve();
		}

	};
}]);




// Source: /Users/lindgrenryan/stack/meany/app/client/angular/services/models/user.js
angular.module('meany').factory('User', ['$resource', function ($resource) {
	return $resource('/api/users/:userId',
		{ id: '@_id' }, {
			update: { method: 'PUT' }

		}
	);
}]);
// Source: /Users/lindgrenryan/stack/meany/app/client/angular/services/router.js
var $router;

angular.module('meany.routes')

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
}])

/**
 * Authenticates routes during `resolve` phase,
 * rejecting failures & resolving successes
 */
.factory('routeAuthenticator', function () {
	return ['$q', '$route', 'Session', function ($q, $route, Session) {
		var deferred = $q.defer();
		if ($route.current.access.indexOf(Session.user.access) > -1) {
			deferred.resolve();
		} else { deferred.reject(); }
		return deferred.promise;
	}];
});
// Source: /Users/lindgrenryan/stack/meany/app/client/angular/services/session.js
angular.module('meany.state').factory("Session", function () {

	// App specific information
	return {
		user: {
			access: 'guest'
		}
	};

});
// Source: /Users/lindgrenryan/stack/meany/app/client/angular/services/socket.js
angular.module('meany.io').factory('Socket', ['$rootScope', function ($rootScope) {

	var socket = io.connect('http://localhost:3000');

	return {
		on: function (eventName, callback) {
			socket.on(eventName, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			});
		}
	};
}]);
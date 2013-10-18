'use strict';
// Source: /Users/lindgrenryan/stack/meany/app/client/angular/app.js
angular.module('meany', [
	'ngCookies', 'ngResource', 'ngAnimate',
	'meany.router', 'meany.io', 'meany.state', 'meany.auth'
]);
angular.module('meany.state', []);
angular.module('meany.router', ['ngRoute']);
angular.module('meany.io', []);
angular.module('meany.auth', []);
// Source: /Users/lindgrenryan/stack/meany/app/client/angular/config.js
// Setting HTML5 Location Mode
angular.module('meany')

.config(['$locationProvider', '$logProvider', function ($locationProvider, $logProvider) {
  $locationProvider.html5Mode(true).hashPrefix("!");
}]);


// Source: /Users/lindgrenryan/stack/meany/app/client/angular/controllers/authCtrl.js
angular.module('meany.auth').controller('authCtrl', [
	'$scope', 'Auth', 'Session', function ($scope, Auth, Session) {

	$scope.user = {};
	$scope.message = 'Log in for awesomeness!';

	$scope.signup = function () { Auth.signup($scope.user, Session); };
	$scope.signin = function () { Auth.signin($scope.user, Session); };

}]);
// Source: /Users/lindgrenryan/stack/meany/app/client/angular/controllers/headerCtrl.js
angular.module('meany').controller('headerCtrl', [
	'$scope', '$location', 'Auth', 'Session', 'App',
function ($scope, $location, Auth, Session, App) {

	$scope.session = Session;
	$scope.appName = App.name;

	$scope.menu = [{
		"title": "Home",
		"link": "/home"
	}];

	$scope.init = function init () { };
	$scope.signout = function () { Auth.signout(Session); };

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
		template: '<p class="margin-none alert-error"><strong>{{error.message}}</strong>{{error.reason}}</p>',
		link: function (scope, el, attrs) {

			// Basic error object
			scope.error = {
				message: '',
				reason: ''
			};

			/**
			 * Define a bunch of listeners to trigger the alert.
			 * Also, define one listener to clear the alert on successful actions.
			 */
			scope.$on('$routeChangeError', function (event, curr, prev, rejection) {
				scope.error.message = 'Access denied: ';
				scope.error.reason  = '"' + curr.originalPath + '" path restricted to <' +
					(typeof curr.access === 'object' ? curr.access.join(', ') : curr.access) + '> access only.';
			});

			scope.$on('Auth:loginFailed', function (error, response) {
				scope.error.message = response.error.message + " " || 'Authentication failed: ';
				scope.error.reason  = response.error.reason  || 'Access denied.';
			});

			scope.$on('$routeChangeSuccess', function () {
				scope.error = {};
			});
		}
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


angular.module('meany.router')

.run(['Auth', 'Router', 'Session', function (Auth, Router, Session) {

  // reset the session with custom session object (returns a promise object)
  Auth.restoreSession(Session)

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
					$rootScope.$broadcast('Auth:loginFailed', resp.data);
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
	'$q', '$http', '$cookieStore', '$location', 'AuthAccess',
function ($q, $http, $cookieStore, $location, AuthAccess) {
	/**
	 * restore state after authentication action and redirect to index path ('/')
	 * @param  {Object} data [Server response object]
	 * @return void
	 */
	function _restoreState (response, sessionService) {
		if (!response.data.error) {
			if (sessionService) sessionService.user = response.data.user;
			$cookieStore.put('user', response.data.user);
			AuthAccess.set(response.data.user);
			$location.path('/');
		}
	}

	/**
	 * sets AuthAccess and cookie user
	 * @param {Object} serverResponse [Object returned from server]
	 * @return void
	 */
	function _setCurrentUser (s, sessionService, deferred) {
		// `AuthAccess.user`'s state is known until this method is called in `routes.js`.
		// This happens during the `run` phase of app init or app state restore.
		var u = $cookieStore.get('user') || (sessionService && sessionService.user) || AuthAccess.get();
		if (u.username && s.data.user.username && u.username === s.data.user.username) {
			if (sessionService) sessionService.user = u;
			AuthAccess.set(u);
		} else {
			$cookieStore.put('user', s.data.user);
			if (sessionService) sessionService.user = s.data.user;
		}
		console.log('_setCurrentUser', sessionService);
		deferred.resolve();
	}

	return {

		signup: function (userObject, sessionService) {
			var deferred = $q.defer();
			$http.post('/api/users', userObject)
			.then(function (response) {
				if (sessionService) _restoreState(response, sessionService);
				else _restoreState(response);
			});
			return deferred.promise;
		},

		signin: function (credentials, sessionService) {
			var deferred = $q.defer();
			$http.post('/auth/signin', credentials)
			.then(function (response) {
				if (sessionService) _restoreState(response, sessionService);
				else _restoreState(response);
			});
			return deferred.promise;
		},

		signout: function (sessionService) {
			var deferred = $q.defer();
			$http.get('/auth/signout')
			.then(function (response) {
				if (sessionService) _restoreState(response, sessionService);
				else _restoreState(response);
			});
			return deferred.promise;
		},

		restoreSession: function (sessionService) {
			var deferred = $q.defer();
			$http.get('/auth/user')
			.then(function (response) {
				if (sessionService) _setCurrentUser(response, sessionService, deferred);
				else _setCurrentUser(response, null, deferred);
			});
			return deferred.promise;
		}

	};

}])

.factory('AuthAccess', function () {
	var user = { access: 'guest' };
	return {
		set: function (val) {
			user.access = val.access || 'guest';
		},
		get: function () {
			return user;
		},
		getAccess: function () {
			return user.access;
		}
	};
});



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

angular.module('meany.router')

.config(['$routeProvider', function $routeProviderRef ($routeProvider) {
	$router = $routeProvider; // gets reset back to null at the end of route instantiation
}])

.factory('Router', [
	'$route', '$location', '$injector',
function Router ($route, $location, $injector) {

	/**
	 * Authenticates routes during `resolve` phase,
	 * rejecting failures & resolving successes
	 */
	function routeAuthenticator ($q, $route) {
		var deferred = $q.defer();
		if (arguments[2]) {
			if ($route.current.access.indexOf(arguments[2].getAccess()) > -1) {
				deferred.resolve();
			} else {
				deferred.reject();
			}
		} else {
			deferred.resolve();
		}
		return deferred.promise;
	}

	if ($injector.has('AuthAccess')) {
		routeAuthenticator.$inject = ['$q', '$route', 'AuthAccess'];
	} else {
		routeAuthenticator.$inject = ['$q', '$route'];
	}

	/**
	 * `addRoute` procedure for adding a single route to `$route.routes`.
	 *
	 * This function also supplies the route with all necessary authentication
	 * outfittings, in accordance with the access-levels granted when defining
	 * routes in `routes.js`.
	 */
	var addRoute = function addRoute (path, routeConfig, access) {
		routeConfig = routeConfig || {};
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
			$router = null;
			return this;
		},

		end: function end () {
			if ($router) { $router = null; }
			$route.current = $route.routes[$location.path()];
			$route.reload();
		}
	};
}]);
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
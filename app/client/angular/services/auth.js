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
	/**
	 * restore state after authentication action and redirect to index path ('/')
	 * @param  {Object} data [Server response object]
	 * @return void
	 */
	var _restoreState = function _restoreState (response) {
		if (!response.data.errors) {
			$cookieStore.put('user', response.data.user);
			Session.user = response.data.user;
			$location.path('/');
		}
	};

	/**
	 * sets Session and cookie user
	 * @param {Object} serverResponse [Object returned from server]
	 * @return void
	 */
	var _setCurrentUser = function _setCurrentUser (s, deferred) {
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
	};

	return {

		signup: function (userObject) {
			var deferred = $q.defer();
			$http.post('/api/users', userObject)
			.then(function (response) { _restoreState(response); });
			return deferred.promise;
		},

		signin: function (credentials) {
			var deferred = $q.defer();
			$http.post('/auth/signin', credentials)
			.then(function (response) { _restoreState(response); });
			return deferred.promise;
		},

		signout: function () {
			var deferred = $q.defer();
			$http.get('/auth/signout')
			.then(function (response) { _restoreState(response); });
			return deferred.promise;
		},

		restoreSession: function () {
			var deferred = $q.defer();
			$http.get('/auth/user')
			.then(function (response) { _setCurrentUser(response, deferred); });
			return deferred.promise;
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



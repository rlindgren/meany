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
	'$q', '$http', '$cookieStore', '$location', 'AuthAccess',
function ($q, $http, $cookieStore, $location, AuthAccess) {
	/**
	 * restore state after authentication action and redirect to index path ('/')
	 * @param  {Object} data [Server response object]
	 * @return void
	 */
	function _restoreState (response, sessionService) {
		if (!response.data.errors) {
			if (sessionService) sessionService.user = response.data.user;
			$cookieStore.put('user', response.data.user);
			AuthAccess.set(response.data.user);
			$location.path('/');
		}
	};

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



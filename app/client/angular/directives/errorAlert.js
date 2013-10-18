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
angular.module('meany.auth').directive('errorAlert', function () {
	return {
		restrict: 'E',
		replace: false,
		template: '<p class="margin-none alert-error"><strong>{{errmsg}}</strong>{{err}}</p>',
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
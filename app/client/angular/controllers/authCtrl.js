angular.module('meany.auth').controller('authCtrl', [
	'$scope', 'Auth', 'Session', function ($scope, Auth, Session) {

	$scope.user = {};
	$scope.message = 'Log in for awesomeness!';

	$scope.signup = function () { Auth.signup($scope.user, Session); };
	$scope.signin = function () { Auth.signin($scope.user, Session); };

}]);
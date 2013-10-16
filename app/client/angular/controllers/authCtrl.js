angular.module('meany.auth').controller('authCtrl', ['$scope', 'Auth', function ($scope, Auth) {

	$scope.user = {};
	$scope.message = 'Log in for awesomeness!';

	$scope.signup = function () { Auth.signup($scope.user); };
	$scope.signin = function () { Auth.signin($scope.user); };

}]);
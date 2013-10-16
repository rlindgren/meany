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
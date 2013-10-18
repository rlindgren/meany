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
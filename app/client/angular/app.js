angular.module('meany', [
	'ngCookies', 'ngResource', 'ngAnimate',
	'meany.router', 'meany.io', 'meany.state', 'meany.auth'
]);
angular.module('meany.state', []);
angular.module('meany.router', ['ngRoute']);
angular.module('meany.io', []);
angular.module('meany.auth', []);
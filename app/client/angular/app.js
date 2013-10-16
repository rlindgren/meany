angular.module('meany', [
	'ngCookies', 'ngResource', 'ngAnimate',
	'meany.routes', 'meany.io', 'meany.state', 'meany.auth'
]);
angular.module('meany.state', []);
angular.module('meany.routes', ['ngRoute']);
angular.module('meany.io', []);
angular.module('meany.auth', []);
angular.module('meany').factory('User', ['$resource', function ($resource) {
	return $resource('/api/users/:userId',
		{ id: '@_id' }, {
			update: { method: 'PUT' }

		}
	);
}]);
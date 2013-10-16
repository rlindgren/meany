// Setting HTML5 Location Mode
angular.module('meany')

.config(['$locationProvider', '$logProvider', function ($locationProvider, $logProvider) {
  $locationProvider.html5Mode(true).hashPrefix("!");
}]);


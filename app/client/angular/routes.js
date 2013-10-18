

angular.module('meany.router')

.run(['Auth', 'Router', function (Auth, Router) {
  // restore user session to client or create anonymous guest profile
  Auth.restoreSession()

  // load routes, optional permissions are 3rd argument (type: Array)
  .then(function () {
    Router.when([
      [
        '/',
        { templateUrl: 'views/index.html',
          controller: 'indexCtrl' },
        ['guest', 'user', 'admin']
      ],
      [
        '/home',
        { templateUrl: 'views/home.html',
          controller: 'indexCtrl' },
        ['user', 'admin']
      ],
      [
        '/signup',
        { templateUrl: 'views/signup.html',
          controller: 'authCtrl' },
        ['guest']
      ],
      [
        '/signin',
        { templateUrl: 'views/signin.html',
          controller: 'authCtrl' },
        ['guest']
      ]
    ])
    .otherwise({ redirectTo: '/' })
    .end(); // must call `end()` after defining routes
  });
}]);
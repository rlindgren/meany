

angular.module('meany.router')

.run(['Auth', 'Router', 'Session', function (Auth, Router, Session) {

  // reset the session with custom session object (returns a promise object)
  Auth.restoreSession(Session)

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
var path = require('path')
  , join = path.join
  , root = path.resolve('./')
  , app = join(root, 'app')
  , pub = join(root, 'public')
  , server = join(app, 'server')
  , client = join(app, 'client');

module.exports = {

  // DIRECTORY PATHS
  rootDir:               root,
  appDir:                app,

  serverDir:             server,
  serverBootstrapDir:    join(server, 'config'),
  serverSpecsDir:        join(server, 'specs'),
  modelsDir:             join(server, 'models'),
  viewsDir:              join(server, 'views'),
  routesDir:             join(server, 'routers'),
  middlewareDir:         join(server, 'middleware'),
  socketsDir:            join(server, 'sockets'),
  mailersDir:            join(server, 'mailers'),
  routeMiddlewareDir:    join(server, 'routers/middleware'),

  clientDir:             client,
  clientSpecsDir:        join(client, 'specs'),
  jadeDir:               join(client, 'jade'),
  sassDir:               join(client, 'sass'),
  libDir:                join(client, 'lib'),
  angularDir:            join(client, 'angular'),
  ngControllersDir:      join(client, 'angular/controllers'),
  ngDirectivesDir:       join(client, 'angular/directives'),
  ngFiltersDir:          join(client, 'angular/filters'),
  ngServicesDir:         join(client, 'angular/services'),
  ngModelsDir:           join(client, 'angular/services/models'),

  publicDir:             pub,
  cssDir:                join(pub, 'css'),
  imgDir:                join(pub, 'img'),
  fontsDir:              join(pub, 'fonts'),
  depsDir:               join(pub, 'lib'),
  htmlDir:               join(pub, 'views'),
  jsDir:                 join(pub, 'js'),


  // FILE PATHS
  models: {
    user:                join(server, 'models/user.js')
  },

  routers: {
    app:                 join(server, 'routers/app.js'),
    users:               join(server, 'routers/users.js'),
    auth:                join(server, 'routers/auth.js')
  },

  middleware:            join(server, 'middleware'),
  routeMiddleware:       join(server, 'routers/middleware'),
  sockets:               join(server, 'sockets'),

  mailers: {

  },

  server: {
    express:             join(server, 'config/express.js'),
    passport:            join(server, 'config/passport.js'),
    db:                  join(server, 'config/db.js'),
    social:              join(server, 'config/social.js'),
    bootstrap:           join(server, 'config')
  }

};
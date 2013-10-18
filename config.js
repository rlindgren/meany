// import and merge all config files
var env = process.env.NODE_ENV || 'development'
  , fs = require('fs')
  , path = require('path')
  , uu = require('underscore')
  , paths = require('./paths')
  , pkg = JSON.parse(fs.readFileSync('package.json'))
  , db = require(path.join(paths.serverBootstrapDir, '/db'))[env]
  , social = require(path.join(paths.serverBootstrapDir, '/social'))[env];

// expose the complete config object
module.exports = {
  name: pkg.name,
  version: pkg.version,
  env: env,
  paths: paths,
  db: db,
  social: social
};
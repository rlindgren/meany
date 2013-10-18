var User = require('../models/user')
  , Q = require('q')
  , passport = require('passport');

// Authentication Router
exports = module.exports = function (app, passport) {

  // Local auth
  app.post('/auth/signin', localAuth, errorCallback);
  app.get('/auth/user', exports.getCurrentUser, errorCallback);
  app.get('/auth/signout', exports.signout, errorCallback);

  // Facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_about_me']
  }));
  app.get('/auth/facebook/callback', passport.authenticate('facebook'), errorCallback);

  // Github oauth routes
  app.get('/auth/github', passport.authenticate('github'));
  app.get('/auth/github/callback', passport.authenticate('github'), errorCallback);

  // Twitter oauth routes
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback', passport.authenticate('twitter'), errorCallback);

  // Google oauth routes
  app.get('/auth/google', passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.google.com/m8/feeds'
    ]
  }));
  app.get('/auth/google/callback', passport.authenticate('google'), errorCallback);
};

function localAuth (req, res, next) {
  if (req.user) {
    return next(new Error('There is already a user logged in. Please logout first.'));
  }
  passport.authenticate('local', function(err, user, info) {
    if (err)   return next(err);
    if (!user) return res.jsonp(401, info);
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.jsonp({
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          access: user.access
        },
        message: "Hello there, " + user.name + "!"
      });
    });
  })(req, res, next);
}

// Auth callback
function errorCallback (err, req, res, next) {
  if (err) res.jsonp(401, err);
}

exports.signout = function (req, res) {
  req.logout();
  res.jsonp({
    user: {
      access: 'guest'
    },
    message: "User successfully logged out."
  });
};

exports.getCurrentUser = function (req, res) {
  console.log('getCurrentUser hit.', req.user);
  if (req.user) {
    var user = {
      user: {
        id: req.user._id,
        username: req.user.username,
        name: req.user.name,
        access: req.user.access
      }
    };
    return res.jsonp(user);
  }
  console.log('sending json response for getCurrentUser');
  res.jsonp({
    user: {
      access: 'guest'
    },
    message: "User session inactive. Please login."
  });
};
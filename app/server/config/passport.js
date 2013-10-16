var LocalStrategy = require('passport-local').Strategy
	,	TwitterStrategy = require('passport-twitter').Strategy
	,	FacebookStrategy = require('passport-facebook').Strategy
	,	GitHubStrategy = require('passport-github').Strategy
	,	GoogleStrategy = require('passport-google-oauth').Strategy
	,	mongoose = require('mongoose')
	,	User = mongoose.model('User')
	, uu = require('underscore')
	, Q = require('q');


module.exports = function (passport, config) {
	// serialize sessions
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findOne({
			_id: id
		}, function (err, user) {
			done(err, user);
		});
	});

	// local strategy
	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	function (email, password, done) {
		User.findOne({ email: email }, function (err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, {
					errors: {
						Error: 'User not found.'
					},
					message: 'Authentication failed.'
				});
			}
			if (!user.authenticate(password)) {
				return done(null, false, {
					errors: {
						Error: 'Invalid password.'
					},
					message: 'Authentication failed.'
				});
			}
			return done(null, user);
		});
	}));

	// twitter strategy
	passport.use(new TwitterStrategy({
		consumerKey: config.social.twitter.clientID,
		consumerSecret: config.social.twitter.clientSecret,
		callbackURL: config.social.twitter.callbackURL,
		passReqToCallback: true
	},
	function (req, token, tokenSecret, profile, done) {
		if (!req.user) {
				User.findOne({
					'facebook.id': profile.id
				}, function (err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						user = new User({
							name: profile.displayName,
							username: profile.username,
							email: profile.emails[0].value,
							provider: 'facebook',
							facebook: profile._json
						});
						user.save(function (err) {
							if (err) console.log(err);
							return done(err, user);
						});
					} else {
						return done(err, user);
					}
				});
			}
			if (req.user.facebook) {
				return done(null, req.user);
			} else {
				User.findOne(req.user._id, function (err, user) {
					user.facebook = profile._json;
					user.save(function (err) {
						if (err) { console.log(err); }
						return done(null, user);
					});
				});
			}
		}
	));

	// facebook strategy
	passport.use(new FacebookStrategy({
			clientID: config.social.facebook.clientID,
			clientSecret: config.social.facebook.clientSecret,
			callbackURL: config.social.facebook.callbackURL,
			passReqToCallback: true
		},
		function (req, accessToken, refreshToken, profile, done) {
			if (!req.user) {
				User.findOne({
					'facebook.id': profile.id
				}, function (err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						user = new User({
							name: profile.displayName,
							username: profile.username,
							email: profile.emails[0].value,
							provider: 'facebook',
							facebook: profile._json
						});
						user.save(function (err) {
							if (err) console.log(err);
							return done(err, user);
						});
					} else {
						return done(err, user);
					}
				});
			}
			if (req.user.facebook) {
				return done(null, req.user);
			} else {
				User.findOne(req.user._id, function (err, user) {
					user.facebook = profile._json;
					user.save(function (err) {
						if (err) { console.log(err); }
						return done(null, user);
					});
				});
			}
		}
	));

	// github strategy
	passport.use(new GitHubStrategy({
			clientID: config.social.github.clientID,
			clientSecret: config.social.github.clientSecret,
			callbackURL: config.social.github.callbackURL,
			passReqToCallback: true
		},
		function (req, accessToken, refreshToken, profile, done) {
			if (!req.user) {
				User.findOne({
					'github.id': profile.id
				}, function (err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						user = new User({
							name: profile.displayName,
							username: profile.username,
							email: profile.emails[0].value,
							provider: 'github',
							github: profile._json
						});
						user.save(function (err) {
							if (err) console.log(err);
							return done(err, user);
						});
					} else {
						return done(err, user);
					}
				});
			}
			if (req.user.github) {
				return done(null, req.user);
			} else {
				User.findOne(req.user._id, function (err, user) {
					user.github = profile._json;
					user.save(function (err) {
						if (err) { console.log(err); }
						return done(null, user);
					});
				});
			}
		}
	));

	// google strategy
	passport.use(new GoogleStrategy({
			consumerKey: config.social.google.clientID,
			consumerSecret: config.social.google.clientSecret,
			callbackURL: config.social.google.callbackURL,
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			if (!req.user) {
				User.findOne({
					'google.id': profile.id
				}, function (err, user) {
					if (err) {
						return done(err);
					}
					if (!user) {
						user = new User({
							name: profile.displayName,
							username: profile.username,
							email: profile.emails[0].value,
							provider: 'google',
							google: profile._json
						});
						user.save(function (err) {
							if (err) console.log(err);
							return done(err, user);
						});
					} else {
						return done(err, user);
					}
				});
			}
			if (req.user.google) {
				return done(null, req.user);
			} else {
				User.findOne(req.user._id, function (err, user) {
					user.google = profile._json;
					user.save(function (err) {
						if (err) { console.log(err); }
						return done(null, user);
					});
				});
			}
		}
	));
};
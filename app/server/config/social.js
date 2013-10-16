module.exports = {
	development: {
		facebook: {
			clientID:     "APP_ID",
			clientSecret: "APP_SECRET",
			callbackURL:  "http://localhost:3000/auth/facebook/callback"
		},
		twitter: {
			clientID:     "CONSUMER_KEY",
			clientSecret: "CONSUMER_SECRET",
			callbackURL:  "http://localhost:3000/auth/twitter/callback"
		},
		github: {
			clientID:      'APP_ID',
			clientSecret:  'APP_SECRET',
			callbackURL:   'http://localhost:3000/auth/github/callback'
		},
		google: {
			clientID:      "APP_ID",
			clientSecret:  "APP_SECRET",
			callbackURL:   "http://localhost:3000/auth/google/callback"
		}
	},
	test: {
		facebook: {
			clientID:      "APP_ID",
			clientSecret:  "APP_SECRET",
			callbackURL:   "http://localhost:3000/auth/facebook/callback"
		},
		twitter: {
			clientID:      "CONSUMER_KEY",
			clientSecret:  "CONSUMER_SECRET",
			callbackURL:   "http://localhost:3000/auth/twitter/callback"
		},
		github: {
			clientID:      'APP_ID',
			clientSecret:  'APP_SECRET',
			callbackURL:   'http://localhost:3000/auth/github/callback'
		},
		google: {
			clientID:      "APP_ID",
			clientSecret:  "APP_SECRET",
			callbackURL:   "http://localhost:3000/auth/google/callback"
		}
	},
	production: {
		facebook: {
			clientID:      "APP_ID",
			clientSecret:  "APP_SECRET",
			callbackURL:   "http://localhost:3000/auth/facebook/callback"
		},
		twitter: {
			clientID:      "CONSUMER_KEY",
			clientSecret:  "CONSUMER_SECRET",
			callbackURL:   "http://localhost:3000/auth/twitter/callback"
		},
		github: {
			clientID:      'APP_ID',
			clientSecret:  'APP_SECRET',
			callbackURL:   'http://localhost:3000/auth/github/callback'
		},
		google: {
			clientID:      "APP_ID",
			clientSecret:  "APP_SECRET",
			callbackURL:   "http://localhost:3000/auth/google/callback"
		}
	}
};
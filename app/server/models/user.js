// Module dependencies
var mongoose = require('mongoose')
	,	Schema = mongoose.Schema
	,	crypto = require('crypto')
	,	_ = require('underscore');

var authTypes = ['github', 'twitter', 'facebook', 'google'];

// User Schema
var UserSchema = new Schema({
	name: { type: String, required: true },
	given_name: String,
	family_name: String,
	middle_name: String,
	avatar: String,
	username: { type: String, required: true },
	usernamei: { type: String, unique: true },
	email: { type: [String], required: true , set: lower, unique: true },
	provider: { type: String, default: 'local' },
	access: { type: String, default: 'user' },
	hashed_password: String,
	salt: String,
	created: { type: Date, default: Date.now },
	facebook: {},
	twitter: {},
	github: {},
	google: {}
});

// Setters
function lower (value) { return value.toLowerCase(); }

// Virtuals
UserSchema.virtual('password').set(function (password) {
	if (authTypes.indexOf(this.provider) === -1) {
		if (password && password.length > 7) {
			this._password = password;
			this.salt = this.makeSalt();
			this.hashed_password = this.encryptPassword(password);
		} else {
			throw Error('Password length must be >= 8.');
		}
	}
}).get(function() { return this._password; });

// model methods
UserSchema.methods = {
	// user authenticated? (returns bool)
	authenticate: function (plainText) {
		return this.encryptPassword(plainText) === this.hashed_password;
	},

	makeSalt: function () {
		return Math.round((new Date().valueOf() * Math.random())) + '';
	},

	// returns encrypted password
	encryptPassword: function (password) {
		if (!password) return '';
		return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
	}
};

var User = mongoose.model('User', UserSchema);

//pre-save hook
UserSchema.pre('save', true, function (next, done) {
	if (!this.isNew) { return done(); }
	if (authTypes.indexOf(this.provider) === -1) {
		User.find({
			username: new RegExp("^" + this.username.toLowerCase() + "$", "i")
		}).exec(function (err, user) {
			if (user && user.length) {
				done(new Error('Username is already registered.'));
			} else {
				done();
			}
		});
	}
	next();
});


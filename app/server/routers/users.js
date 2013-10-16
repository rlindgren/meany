var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , uu = require('underscore')
  , Q = require('q');


exports = module.exports = function (app, passport, config) {

  app.post('/api/users/index', index);
  app.get('/api/users/me', me);
  app.post('/api/users', create, errors);
  app.post('/api/users/:id/edit', edit, errors);
  app.get('/api/users/:id', show);
  app.del('/api/users/:id', destroy, errors);

};

/**
 * Index
 */
function index (req, res) {
  User.find().exec(function (err, users) {
    console.log(err);
    if (err) return res.jsonp(err);
    res.jsonp(users);
  });
}

/**
 * Create, save and login (if successful), else throw errors to `errors`
 */
function create (req, res, next) {
  if (req.user) {
    return next(new Error('There is already a user logged in. Please logout first.'));
  }
  __save(req).then(function (user) {
    console.log(user.username + ' saved.');
    __login(req, res, user, next);
  }, function (err) {
    next(err);
  });
}
// save user promise
function __save (req) {
  var deferred = Q.defer();
  var user = new User(req.body);
  user.save(function (err) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(user);
    }
  });
  return deferred.promise;
}
// login user promise
function __login (req, res, user, next) {
  req.logIn(user, function (err) {
    if (err) return next(err);
    console.log(user.username + ' logged in.');
    res.jsonp({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        access: user.access
      },
      message: "Welcome aboard, " + user.name + "!"
    });
  });
}

/**
 * Me
 */
function me (req, res) {
  res.jsonp(req.user);
}

/**
 * Edit
 */
function edit (req, res) {
  var user = req.user;
  user = uu.extend(user, req.body);

  user.save(function (err) {
    res.jsonp(user);
  });
}

/**
 * Show
 */
function show (req, res, next, id) {
  User.findOne({id: id}).exec(function (err, user) {
    if (err) return next(err);
    if (!user) return next('User ' + id + ' not found.');
    res.jsonp(user);
  });
}

/**
 * Destroy
 */
function destroy (req, res) {

}

/**
 * Error handler
 */
function errors (err, req, res, next) {
  if (err) {
    console.log(formatErrors(err));
    res.jsonp(401, formatErrors(err));
  }
}

function formatErrors(err) {
  var errObj = {}
    , message = 'Validation failed.';
  if (err.name === 'ValidationError') {
    for (var k in err.errors) {
      errObj[k + 'Error'] = err.errors[k].type + ' field.';
    }
    return { errors: errObj, message: message };
  }
  if (err.name === 'MongoError') {
    var field = err.err.match(/\$(.*)_/)[1];
    errObj.Error = field[0].toUpperCase() + field.slice(1) + ' is already registered.';
    return { errors: errObj, message: message };
  }
  errObj[err.name] = err.message;
  return { errors: errObj, message: message };
}
// functions.js
var bcrypt = require('bcryptjs'),
    Q = require('q'),
    config = require('./config.js'), //config file contains all tokens and other private info
    db = config.db,
    mongoose = require('mongoose'),
    User = require('./models/user.js').User; //config.db holds Orchestrate token

mongoose.connect('mongodb://localhost/clipsgg');

//used in local-signup strategy
exports.localReg = function (username, password, passwordConfirm) {
  var deferred = Q.defer();
  var hash = bcrypt.hashSync(password, 8);
  var newUser = new User ({
    "username": username,
    "password": hash
  });

  User.find({ username: username }, function (err, user) {
    if (err) {
      console.error(err);
      deferred.reject(new Error(err));
    }

    if (user[0]) {
      console.log('username already exists');
      deferred.resolve(false); //username already exists
    }
    else {
        console.log('Username is free for use');
        debugger;
        newUser.save(function (err, user) {
          if (err) {
            console.log("USER ADD FAIL:" + err);
            deferred.reject(new Error(err));
          }
          else {
            console.log("USER: " + user);
            deferred.resolve(user);
          }
        });
      }
  });

  return deferred.promise;
};

//check if user exists
    //if user exists check if passwords match (use bcrypt.compareSync(password, hash); // true where 'hash' is password in DB)
      //if password matches take into website
  //if user doesn't exist or password doesn't match tell them it failed
exports.localAuth = function (username, password) {
  var deferred = Q.defer();

  User.find({ username: username }, function (err, user) {
    if (err) {
      console.error(err);
      deferred.reject(new Error(err));
    }

    if (user[0]) {
      console.log("FOUND USER");
      var hash = user[0].password;
      if (bcrypt.compareSync(password, hash)) {
        deferred.resolve(user[0]);
      }
      else {
        console.log("PASSWORDS NOT MATCH");
        deferred.resolve(false);
      }
    }
    else {
      console.log("COULD NOT FIND USER IN DB FOR SIGNIN");
      deferred.resolve(false);
    }
  });

  return deferred.promise;
};
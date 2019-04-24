'user strict'
const express = require('express');
const bodyParser = require('body-parser');
const coreUserRoutes = require('./coreUser/routes');
const userDonationRoutes = require('./userDonation/routes');
const eventRoutes = require('./events/routes');
const passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , JwtStrategy = require('passport-jwt').Strategy
  , ExtractJwt = require('passport-jwt').ExtractJwt;
const cors = require('cors');
const config = require('./config');

const User = require('./coreUser/user');

// initialize our express app
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

var originsWhitelist = [
  'http://localhost:4200',
];

var corsOptions = {
  origin: function(origin, callback){
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
  },
  credentials:true
};

app.use(cors(corsOptions));


// authentication with passportjs
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('local login');
    User.findOne({ username: username }).select("+password").exec(function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'No such user exists' });
      }
      if (!user.verifyPassword(password)) {
        console.log("Password is incorrect");
        return done(null, false, { message: 'Incorrect password.' });
      }
      console.log("Login success!", user);
      return done(null, user);
    });
  }
));

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secret;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  console.log("jwt", jwt_payload);
  User.findOne({_id: jwt_payload.id}, function(err, user) {
      if (err) {
          console.log("jwt login failed", err);
          return done(err, false);
      }
      if (user) {
          return done(null, user);
      } else {
          return done(null, false);
      }
  });
}));


// Routes
app.use("/", coreUserRoutes);
app.use("/donations", userDonationRoutes);
app.use("/events", eventRoutes);

// Mongodb Models
require('./coreUser/user');
require('./events/event');
require('./userDonation/donation');


// mongodb config
var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/ngo';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

User.findOne({username: config.superusername}, (err, user) => {
  if(!user) {
    User.create({username: config.superusername, password: "tobehashed", userType: 'admin'}, (err, user) => {
      if (err) console.error(err);
      user.updatePassword(config.superpassword);
    });
  }
});

let port = 5678;
app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});

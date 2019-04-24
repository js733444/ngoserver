const router = require('express').Router();
const User = require('./user');
const passport= require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');

router.post('/login',
  function(req, res, next) {
    console.log('user login: ', req.body)
    passport.authenticate('local', function(err, user, info) {
        if (user) {
            var token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 // 24 hours
                });

            res.status(200).send({
                _id: user._id,
                auth: true, 
                token: token, 
                username: user.username, 
                userType: user.userType,
                userDetail: user.userDetail
            });
        }else {
            res.status(400).send({ auth: false });
        }
      })(req, res, next);
  });

//Assumes using body parser
router.get('/users', passport.authenticate('jwt'), (req, res, next) => {
    if (req.user){
        User.find({}, function(err, users){
            if (err) next(err);
            res.send(users);
        });
    }else {
        res.send(401, "Only logged in user allowed to list users");
    }
});

router.post('/users', passport.authenticate('jwt'), (req, res, next) => {
    var body = req.body;
    console.log("post body", body);
    User.customCreate(body, (err, user) => {
        if (err) next(err);
        res.send(user);
    });
});

router.get('/users/:id', passport.authenticate('jwt'), (req, res, next) => {
    var id = req.params.id;
    //updatePassword calls save() already]
    User.findById(id, (err, user) => {
        if (err) next(err);
        if (user) res.send(user)
        else res.status(404).send("Not Found");
    });
});

router.put('/users/:id', passport.authenticate('jwt'), (req, res, next) => {
    var body = req.body;
    var id = req.params.id;
    //updatePassword calls save() already
    console.log("put user", body);
    User.customFindByIdAndUpdate(id, body, (err, user) => {
        if (err) next(err);
        res.send(user);
    });
});

router.delete('/users/:id', passport.authenticate('jwt'), (req, res, next) => {
    var id = req.params.id;
    User.findByIdAndDelete(id, (err, user)=> {
        if (err) next(err);
        res.send(user);
    });
});

module.exports = router;
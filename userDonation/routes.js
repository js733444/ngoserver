const router = require('express').Router();
const passport = require('passport');
const Donation = require('./donation');
const isAdminOr403 = require('../passportConf');
const mongoose = require('mongoose')


// Boyder Parse is enabled globally and thus not required to be called by router
// User Details can be populated by selecting foreign key through users, and hense route not required.

// /user-donation/*
router.post('', passport.authenticate('jwt'), function(req,res,next){
    if (isAdminOr403){
        Donation.create(req.body,function(err,donation){
            if(err) return next(err);
            res.json(donation);
        });
    }
});

// GET ALL
router.get('', passport.authenticate('jwt'), function(req,res,next){
    if (isAdminOr403){
        Donation.find({}).populate('user').populate('event').exec(function(err, donation) {
            if(err) return next(err);
            res.json(donation)
        });
    }
});

// GET BY ID
router.get('/:id', passport.authenticate('jwt'), function(req,res,next){
    if (isAdminOr403){
        Donation.findById(req.params.id, function(err,donation) {
            if(err) return next(err);
            res.json(donation)
        });
    }
});

// UPDATE
router.put('/:id', passport.authenticate('jwt'), function(req,res,next){
    if (isAdminOr403){
        Donation.findByIdAndUpdate(req.params.id, req.body, {new:true}, function(err,donation) {
            if(err) return next(err);
            res.json(donation)
        });
    }
});

// DELETE
router.delete('/:id', passport.authenticate('jwt'), function(req,res,next){
    if (isAdminOr403){
        Donation.findByIdAndRemove(req.params.id, req.body, function(err,donation) {
            if(err) return next(err);
            res.json(donation);
        });
    }
});

router.post('/checkout', passport.authenticate('jwt'), function(req, res, next){
    if (req.user){
        let suspicious = false;
        var today = new Date();
        for (let d of req.body){
            if (!req.user._id.equals(d.user)){
                suspicious = true;         
                break;
            }
            d.date = today;
        }
        if (suspicious){
            res.status(400).send("suspicious request");
        }else{
            response = [];

            req.body.forEach(d => {
                Donation.create(req.body,function(err,donation){
                    if(err) return next(err);
                    response.push(donation);
                });
            });
            res.send(response);
        }
    }
});

module.exports=router;
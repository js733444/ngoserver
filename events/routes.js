"use strict";
const router = require('express').Router();
// RENAME THIS
const Event = require('./event');
const passport = require('passport');
const isAdminOr403 = require('../passportConf');

// Assumes using body parser
// events/&=*


router.post('', passport.authenticate('jwt'), function(req,res,next){
    if (isAdminOr403(req, res)) {
        Event.create(req.body,function(err,event){
            if(err) return next(err);
            res.json(event);
        });
    }
});

// GET ALL
router.get('', function(req,res,next){
    Event.find(function(err, event) {
        if(err) return next(err);
        res.json(event);
    });
});

// GET BY ID
router.get('/:id', passport.authenticate('jwt'), function(req,res,next){
    if (isAdminOr403(req, res)) {
        Event.findById(req.params.id, function(err,event) {
            if(err) return next(err);
            res.json(event);
        });
    }
});

// UPDATE
router.put('/:id', passport.authenticate('jwt'), function(req,res,next){
    if (isAdminOr403(req, res)) {
        Event.findByIdAndUpdate(req.params.id, req.body, {new:true}, function(err,event) {
            if(err) return next(err);
            res.json(event);
        });
    }
});

// DELETE
router.delete('/:id', passport.authenticate('jwt'), function(req,res,next){
    if (isAdminOr403(req, res)) {
        Event.findByIdAndRemove(req.params.id, req.body, function(err,event) {
            if(err) return next(err);
            res.json(event);
        });
    }
});

module.exports=router;
var express = require('express');
var User = require('../models/User');
var Post = require('../models/Post');
var router = express.Router();

router.get('/', function (req, res) {
    User.find({'_id': {$in: req.session.user.friendRequests}}, function (err, users) {
        if (err)
            throw err;
        res.render('friendRequests', {users: users, me: req.session.user});
    });
});

router.post('/', function (req, res) {
    User.findById(req.body.id, function (err, user) {
        if (err)
            throw err;
        else if (!user)
            res.redirect('/home');
        else {
            user.friendRequests.push(req.session.user._id);
            user.save(function () {
                res.redirect('/profile/' + req.body.id);
            });
        }
    })
});

router.post('/accept', function (req, res) {
    User.findById(req.session.user._id, function (err, user) {
        if (err)
            throw err;
        else if (!user)
            res.redirect('/home');
        else {
            user.friendIds.push(req.body.id);
            user.friendRequests.splice(user.friendRequests.indexOf(req.body.id), 1);
            req.session.user = user;
            user.save();
        }
    });
    User.findById(req.body.id, function (err, user) {
        if (err)
            throw err;
        else if (!user)
            res.redirect('/home');
        else {
            user.friendIds.push(req.session.user._id);
            user.save(function () {
                res.redirect('/friendRequests');
            });
        }
    });
});

router.post('/delete', function (req, res) {
    User.findById(req.session.user._id, function (err, user) {
        if (err)
            throw err;
        else if (!user)
            res.redirect('/home');
        else {
            user.friendRequests.splice(user.friendRequests.indexOf(req.body.id), 1);
            req.session.user = user;
            user.save(function () {
                res.redirect('/friendRequests');
            });
        }
    });
});


module.exports = router;

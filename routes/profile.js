var express = require('express');
var User = require('../models/User');
var Post = require('../models/Post');
var router = express.Router();

/* GET home page. */

router.get('/friends', function (req, res) {
    User.find({'_id': {$in: req.session.user.friendIds}}, function (err, users) {
        if (err)
            throw err;
        res.render('friends', {users: users, me: req.session.user});
    });
});


router.get('/:id', function (req, res) {
    if (req.params.id == req.session.user._id) {
        res.redirect('/myProfile');
        return;
    }
    User.findById(req.params.id, function (err, user) {
        if (err)
            throw err;
        else if (!user)
            res.redirect('/home');
        else {
            user.myFriend = user.friendIds.indexOf(req.session.user._id) != -1;
            user.pending = user.friendRequests.indexOf(req.session.user._id) != -1;
            user.requested = req.session.user.friendRequests.indexOf(user._id.toString()) != -1;
            Post.find({_userId: user._id}, function (err, posts) {
                if (err)
                    throw err;
                else {
                    res.render('profile', {user: user, posts: posts, myProfile: false, me: req.session.user});
                }
            });
        }
    })
});

module.exports = router;

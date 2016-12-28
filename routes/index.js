var express = require('express');
var async = require('async');
var User = require('../models/User');
var Post = require('../models/Post');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    if (req.session.isLoggedIn)
        res.redirect('/home');
    res.render('index', {err: null, info: null});
});

router.get('/home', function (req, res) {
    if (req.session.isLoggedIn)
        res.redirect('/newsFeed');
    else res.redirect('/');
});

router.get('/myProfile', function (req, res) {
    var userPosts;
    async.parallel([function (done) {
        User.findById(req.session.user._id, function (err, user) {
            req.session.user = user;
            done();
        });

    }, function (done) {
        Post.find({_userId: req.session.user._id}, function (err, posts) {
            userPosts = posts;
            done();
        });

    }], function () {
        res.render('profile', {
            user: req.session.user,
            me: req.session.user,
            posts: userPosts,
            myProfile: true
        });
    });
});

router.get('/newsFeed', function (req, res) {
    Post.find({}, function (err, posts) {
        if (err)
            throw err;
        for (var i = 0; i < posts.length; i++) {
            if (posts[i].isPublic || posts[i]._userId == req.session.user._id || req.session.user.friendIds.indexOf(posts[i]._userId.toString()) != -1)
                posts[i].visible = true;
        }
        posts = posts.filter(function (post) {
            return post.visible;
        });
        res.render('newsFeed', {me: req.session.user, posts: posts});
    });
});

router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;

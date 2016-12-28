var express = require('express');
var Post = require('../models/Post');
var upload = require('../helpers/post-uploader');
var router = express.Router();

/* GET home page. */
router.post('/', function (req, res) {
    Post.findById(req.body.postId, function (err, post) {
        if (err)
            throw err;
        else {
            post.isPublic = req.body.isPublic;
            post.body = req.body.body;
            if (req.body.postPicture != '')
                post.hasPic = true;
            post.save(function (err) {
                if (err)
                    throw err;
                else
                    res.redirect('/home');
            });
        }
    });
});

router.post('/upload', function (req, res) {
    var newPost = new Post();
    newPost._userId = req.session.user._id;
    newPost._userNickName = req.session.user.nickName;
    newPost.body = 'Awaiting post body..';
    newPost.save(function (err, post) {
        if (err)
            throw err;
        else {
            req.session.post = {};
            req.session.post._id = post._id;
            upload(req, res, function (err) {
                if (err)
                    console.log(err);
                else {
                    res.send(post._id);
                    req.session.post = null;
                }
            });
        }
    });
});

module.exports = router;

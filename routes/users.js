var express = require('express');
var User = require('../models/User');
var upload = require('../helpers/profile-uploader');
var router = express.Router();
/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.post('/', function (req, res) {
    User.find({email: req.body.email}, function (err, users) {
        if (users.length != 0) {
            res.render('index', {
                err: "Registration unsuccessful. There's already an account linked to this email address.",
                info: null
            });
        }
        else {
            var newUser = new User();
            newUser.firstName = req.body.firstName;
            newUser.lastName = req.body.lastName;
            newUser.nickName = req.body.nickName;
            newUser.password = req.body.password;
            newUser.email = req.body.email;
            newUser.save(function (err, user) {
                if (err) {
                    res.render('index', {
                        err: "Registration unsuccessful.",
                        info: null
                    });
                }
                else {
                    res.render('index', {
                        err: null,
                        info: "Registration completed successfully! Now login using your email and password."
                    });
                }
            });
        }
    });
});

router.post('/login', function (req, res) {
    User.find({email: req.body.email, password: req.body.password}, function (err, users) {
        if (err) {
            res.render('index', {
                err: "Error happened during login. Please try again later.",
                info: null
            });
        }
        else if (users.length == 0) {
            res.render('index', {
                err: "Invalid email/password combination.",
                info: null
            });
        }
        else {
            req.session.isLoggedIn = true;
            req.session.user = users[0];
            res.redirect('/home');
        }
    });
});

router.get('/:id', function (req, res) {
    res.json({id: req.params.id});
});

router.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err)
            console.log(err);
        else
            User.findById(req.session.user._id, function (err, user) {
                if (err)
                    throw err;
                user.hasPic = true;
                req.session.user = user;
                user.save();
            });
    });
});

router.post('/edit', function (req, res) {
    User.findById(req.session.user._id, function (err, user) {
        if (err)
            throw err;
        else {
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            if (req.body.company != '')
                user.company = req.body.company;
            if (req.body.homeTown != '')
                user.homeTown = req.body.homeTown;
            if (req.body.phoneNumbers != '')
                user.phoneNumbers = req.body.phoneNumbers.split(',').filter(function (str) {
                    return str != '';
                });
            if (req.body.about != '')
                user.about = req.body.about;
            user.maritalStatus = req.body.maritalStatus;
            user.gender = req.body.gender;
            user.nickName = req.body.nickName;
            if (req.body.birthday != '')
                user.birthDay = req.body.birthday;

            req.session.user = user;
            user.save(function (err) {
                if (err)
                    throw err;
                res.redirect('/myProfile');
            });
        }
    })
});

module.exports = router;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var index = require('./routes/index');
var users = require('./routes/users');
var profile = require('./routes/profile');
var posts = require('./routes/posts');
var friendRequests = require('./routes/friendRequests');
mongoose.connect('mongodb://admin:admin@ds141368.mlab.com:41368/crowd-hub');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.info('\t\t\t\t   MongoDB Connected.');
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({secret: 'crowdhubsecretkey'}));
app.use(express.static(path.join(__dirname, 'public')));


//user authentication
app.use(function (req, res, next) {
    if ((req.path != '/' && req.path != '/users/login' && req.path != '/users') && !req.session.isLoggedIn)
        res.redirect('/');
    else
        next();
});


app.use('/', index);
app.use('/users', users);
app.use('/profile', profile);
app.use('/posts', posts);
app.use('/friendRequests', friendRequests);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

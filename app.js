require('dotenv').config()

// modules
var express = require ('express');
var session = require ('express-session');
var cookie = require ('cookie-parser');
var path = require ('path');
var ejs= require ('ejs');
var multer = require('multer');
var path = require ('path');
var async = require ('async');
var nodmailer = require ('nodemailer');
var crypto = require ('crypto');
var cryptr = require ('cryptr');
var expressValidator = require ('express-validator');
var sweetalert = require('sweetalert2');
var port = process.env.PORT;
var bodyParser = require ('body-parser');
var hl = require('handy-log');
var app = express();
var passport = require('passport');
var cookieSession = require('cookie-session')

// file modules
var landing = require ('./controllers/landing');
var signup = require ('./controllers/signup');
var signup_google = require('./controllers/signup_google');
var login_google = require('./controllers/login_google');
var signup_facebook = require('./controllers/signup_facebook');
var login_facebook = require('./controllers/login_facebook');
var verification = require('./controllers/verification');
var profile_update = require('./controllers/updateProfile');
var login = require ('./controllers/login');
var eligibilityTest = require('./controllers/eligibilityTest');
// view engine
app.set('view engine', 'ejs');

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());

// middlewares
app.use(express.static('./public'));
// app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
//app.use(expressValidator());
app.use(cookie());
app.use(session({
    cookieName: "session",
    secret: process.env.SESSION_SECRET_LETTER,
    //duration: 30 * 60 * 1000,
    //activeDuration: 5 * 60 * 1000,
    resave: true,
    saveUninitialized: true
}));


var server =app.listen(port , function(){

    hl.rainbow('App Running');
});

app.use ('/', landing);
app.use('/signup', signup);
app.use('/activate', verification);
app.use('/profile-update', profile_update);
app.use('/login', login);
app.use('/signup-google', signup_google);
app.use('/login-google', login_google);
app.use('/signup-facebook', signup_facebook);
app.use('/login-facebook', login_facebook);
app.use('/eligibility-test', eligibilityTest);
app.use('/login-facebook', login_facebook);
// app.get('/activate/:id', function(req,res){
//     let {id} = req.params;
//     res.render('email_activate.ejs', {id});
// });

app.get('/emailSearch', function(req,res){
    res.render('emailSearch.ejs');
});

app.get('/KYC', function(req,res){
    res.render('KYC.ejs');
});

app.get('/changeForgotPassword', function(req,res){
    res.render('changeForgotPassword.ejs');
});
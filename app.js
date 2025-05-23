require('dotenv').config()

// modules
var express = require('express');
var session = require('express-session');
var cookie = require('cookie-parser');
var path = require('path');
var ejs = require('ejs');
var multer = require('multer');
var path = require('path');
var async = require('async');
var nodmailer = require('nodemailer');
var crypto = require('crypto');
var cryptr = require('cryptr');
var expressValidator = require('express-validator');
var sweetalert = require('sweetalert2');
var port = process.env.PORT;
var bodyParser = require('body-parser');
//var hl = require('handy-log');
var app = express();
var passport = require('passport');
var cookieSession = require('cookie-session')
var box = require('./models/mapbox');
var db = require('./models/db_controller');

// file modules
var landing = require('./controllers/landing');
var signup = require('./controllers/signup');
var signup_google = require('./controllers/signup_google');
var login_google = require('./controllers/login_google');
var signup_facebook = require('./controllers/signup_facebook');
var login_facebook = require('./controllers/login_facebook');
var verification = require('./controllers/verification');
var profile_update = require('./controllers/updateProfile');
var login = require('./controllers/login');
var eligibilityTest = require('./controllers/eligibilityTest');
var resetPassword = require('./controllers/resetPassword');
var KYC = require('./controllers/KYC');
var address = require('./controllers/address');
var mapquery = require('./controllers/mapquery');
var org = require('./controllers/showOrg');
var donor = require('./controllers/showDonor');
var newRequest = require('./controllers/newRequest');
var dashboard = require('./controllers/dashboard');
var myProfile = require('./controllers/myProfile');
var viewRequest = require('./controllers/viewRequest');
var resolveRequest = require('./controllers/requestResolve');
var changePassword = require('./controllers/changePassword');
var contactUs = require('./controllers/contactUs');
var requestFeed = require('./controllers/requestFeed');
var viewProfile = require('./controllers/viewProfile');
var signout = require('./controllers/signout');
var newDonation = require('./controllers/newDonation');
var eligibilityReport = require('./controllers/eligibilityReport');
var viewDonation = require('./controllers/viewDonation');
var respondTOrequest = require('./controllers/respondTOrequest');
var notificationResolve = require('./controllers/notificationResolve');
var statsForHome = require('./controllers/stats');


// view engine
app.set('view engine', 'ejs');

// middlewares
app.use(express.static('./public'));
app.use('/profile', express.static('profile'));
// app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(expressValidator());
app.use(cookie());
app.use(session({
    cookieName: "session",
    secret: process.env.SESSION_SECRET_LETTER,
    //duration: 30 * 60 * 1000,
    //activeDuration: 5 * 60 * 1000,
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {maxAge: 1000*60*60*10}
}));

// Initializes passport and passport sessions
app.use(passport.initialize());
app.use(passport.session());


var server = app.listen(port, function () {

    console.log('App Running');
});

app.use('/', landing);
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
app.use('/reset-password', resetPassword);
app.use('/KYC', KYC);
app.use('/address', address);
app.use('/map-box', mapquery);
app.use('/show-org', org);
app.use('/show-donor', donor);
app.use('/new-request', newRequest);
app.use('/dashboard', dashboard);
app.use('/my-profile', myProfile);
app.use('/request/view', viewRequest);
app.use('/request/resolve', resolveRequest);
app.use('/change-password', changePassword);
app.use('/contact-us', contactUs);
app.use('/request-feed', requestFeed);
app.use('/view-profile', viewProfile);
app.use('/signout', signout);
app.use('/add-new-donation', newDonation);
app.use('/view/eligibility-report', eligibilityReport);
app.use('/view/donation', viewDonation);
app.use('/request/respond', respondTOrequest);
app.use('/notification-resolve', notificationResolve);
app.use('/stats-for-home', statsForHome);

//localhost:3940/new-request
// app.get('/new-request', function(req,res){
//     res.render('newRequest.ejs');
// });

// app.get('/activate/:id', function(req,res){
//     let {id} = req.params;
//     res.render('email_activate.ejs', {id});
// });

//localhost:3940/search-donor
app.get('/search-donor', function (req, res) {
    db.NotificationUpdateDynamically(req, res)
        .then(result => {
            res.render('searchDonor.ejs', { navbar: req.session.navbar_info, notifications: req.session.notifications });
        })

});

//localhost:3940//search-org
app.get('/search-org', function (req, res) {
    if(req.query.forall == 'yes') {
        res.render('searchOrg.ejs');
    }
    else {
        db.NotificationUpdateDynamically(req, res)
        .then(result => {
            res.render('searchOrg.ejs', { navbar: req.session.navbar_info, notifications: req.session.notifications });
        })
    }
});

//localhost:3940/home
// app.get('/home', function (req, res) {
//     res.render('home.ejs');
// });

app.get('/mapbox', function (req, res) {
    // console.log(req.query);
    // box.reverseGeocoder(req.query.latitude, req.query.longitude);
    // box.reverseGeocoder(23.21271883828553, 89.79110255783338);
});


//localhost:3940/org-input
app.get('/org-input', function (req, res) {
    db.getDivisions()
        .then(result => {
            if (result.length > 0) {
                let div_result = result;
                res.render('orgInput.ejs', { divisions: div_result });
            }
        })
});

app.post('/org-input', function (req, res) {
    // console.log(req.body);
    db.setOrgInput(req.body, function (insert_id) {
        res.send("Hospital with ID: " + insert_id + " insertion successfull");
    })
});

// app.get('/request-feed', function(req,res){
//     res.render('requestFeed.ejs');
// });

// app.get('/view-profile', function(req,res){
//     res.render('viewProfile.ejs');
// });

// app.get('/change-password', function(req,res){
//     res.render('changePassword.ejs');
// });

// localhost:3940/add-new-donation
// app.get('/add-new-donation', function(req,res){
//     res.render('addNewDonation.ejs', {navbar: req.session.navbar_info});
// });

// app.get('/contact-us', function(req,res){
//     res.render('contactUs.ejs');
// });

app.get('/test-page', function (req, res) {
    res.render('test.ejs');
});


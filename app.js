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
var expressValidator = require ('express-validator');
var sweetalert = require('sweetalert2');
var port = process.env.PORT;
var bodyParser = require ('body-parser');
var hl = require('handy-log');
var app = express();

// file modules
var landing = require ('./controllers/landing');
var signup = require ('./controllers/signup');
var verification = require('./controllers/verification');
var profile_update = require('./controllers/updateProfile');
var login = require ('./controllers/login');
// view engine
app.set('view engine', 'ejs');

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
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
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
// app.get('/activate/:id', function(req,res){
//     let {id} = req.params;
//     res.render('email_activate.ejs', {id});
// });

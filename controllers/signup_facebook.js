var express = require ('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require ('../models/db_controller');
var mail = require('../models/mail');
var mysql = require('mysql');
var hl = require('handy-log');
const { body, check, validationResult } = require('express-validator');
const { array } = require('prop-types');
const passport = require('passport');
require('./passport-setup');

router.use(bodyParser.urlencoded({extended : true}));
router.use(bodyParser.json());

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

// Auth Routes
router.get('/', passport.authenticate('facebook', { scope : 'email' }));

router.get('/callback', passport.authenticate('facebook', {
    successRedirect : '/signup-facebook/good',
    failureRedirect : '/signup-facebook/failed'
}));
// passport.authenticate('google', { failureRedirect: '/signup-google/failed' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/signup-google/good');
//     //res.render('profile.ejs',{name:req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value});
//   }
// );

router.get('/failed', (req, res) => res.send('You Failed to log in!'));

router.get('/good', (req, res) =>{
    //console.log("profile");
    var user = req.session.passport.user;
    //console.log(user);
    //res.send("Hello World");
    //console.log(req.user.displayName);
    res.render('profile.ejs',{name:user.displayName, pic:user.photos[0].value, email:user.emails[0].value});
})

router.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})


module.exports = router;
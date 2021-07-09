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
router.get('/', passport.authenticate('facebook-signup', { scope : 'email' }));

router.get('/callback', passport.authenticate('facebook-signup', {
    successRedirect : '/signup-facebook/good',
    failureRedirect : '/signup-facebook/failed'
}));

router.get('/failed', (req, res) => res.send('You Failed to log in!'));

router.get('/good', (req, res) =>{
    //console.log("profile");
    var user = req.session.passport.user;
    //console.log(user);
    db.EmailCheck(user.emails[0].value)
    .then(result =>{
        if(result[0].emailCount == 1) {
            res.render('signup', {alert: [{msg: 'Email already exists'}]});
        }
        else{
        let newUser = {
            f_name: user.name.givenName,
            l_name: user.name.familyName,
            email: user.emails[0].value,
            joined: new Date(),
            provider: "facebook"
            }
            db.signup(newUser, function(insert_id, f_name){
                res.render('message.ejs', {alert_type: 'success', message: `Your email is verified`, type:'verification'});
            })
        }
    })
})

router.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})


module.exports = router;
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
router.get('/', passport.authenticate('google-login', { scope: ['profile', 'email'] }));

router.get('/callback', passport.authenticate('google-login', { failureRedirect: '/login-google/failed' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/login-google/good');
    //res.render('profile.ejs',{name:req.user.displayName,pic:req.user.photos[0].value,email:req.user.emails[0].value});
  }
);

router.get('/failed', (req, res) => res.send('You Failed to log in!'));

router.get('/good', (req, res) =>{

    //console.log("profile");
    var user = req.session.passport.user;
    //console.log(user);
    db.EmailCheck(user.emails[0].value)
    .then(result =>{
        if(result[0].emailCount == 0) {
            res.render('login', {alert: [{msg: 'Email doesn\'t exists'}]});
        }
        else{
            req.session.email = user.emails[0].value;
            db.getuserid(user.emails[0].value)
            .then(result => {
                //console.log(result[0].id);
                db.isEmailVerified(result[0].id)
                .then(result => {
                    if(result[0].email_verified === 'yes' && result[0].profile_build === 'yes'){
                  
                  
                        // Dashboard
                        res.send("Dash Board");



                    }
                    else if(result[0].email_verified === "yes" && result[0].profile_build === "no"){


                        // Profile Build
                        res.send("Profile Build");
                    }
                    else{
                        res.render('message.ejs', {alert_type: 'danger', message: `Please verify your email`, type:'mail'})
                    }
                })
            .catch(me =>{
              hl.error(me)
              res.render('message.ejs', {alert_type: 'danger', message: `Error!Try again later`, type:'mail'})
            })
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
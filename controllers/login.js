var express = require ('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require ('../models/db_controller');
var mail = require('../models/mail');
var mysql = require('mysql');
var hl = require('handy-log');
const { body, check, validationResult } = require('express-validator');
const { array } = require('prop-types');

router.use(bodyParser.urlencoded({extended : true}));
router.use(bodyParser.json());

router.get('/', function(req,res){
  if(req.session.loggedin === true) {
    db.getuserid(req.session.email)
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
          res.send("<h1>Home Page</h1><br><span>Under Progress....</span>");
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
    .catch(me =>{
      hl.error(me)
      res.render('message.ejs', {alert_type: 'danger', message: `Error!Try again later`, type:'mail'})
    })
  }
  else{
      res.render('login.ejs');
    }
});

router.post('/', [check('email', 'Email is empty').notEmpty(),
check('email', 'Email is invalid').isEmail(),
check('password', 'Password field is empty').notEmpty(),
body('email').custom(value => {
    return db.direct_query('SELECT COUNT(*) as emailCount FROM users WHERE email = ?', [value])
    .then(value => {
        if(value[0].emailCount == 0) {
            return Promise.reject("E-mail doesn't exist");
        }
    });
  })], function(req,res){
    
    var email = req.body.email;
    var password = req.body.password;
    var session = req.session;
    //console.log(email, password, confirm_password, fname, lname, session);

    let errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      //console.log(errors);
      const alert = errors.array();
      res.render('login', {alert});
    }
    else {
      let User = {
      email: req.body.email,
      password
      }
      db.credentialCheck(User)
      .then(result =>{
        if(result === false) {
          res.render('login', {alert: [{msg: 'Your Password is wrong'}]});
        }
        else{
          req.session.email = User.email;
          //req.session.loggedin = true;
          if(req.body.remember){
            req.session.loggedin = true;
            req.session.cookie.maxAge = 2628000000;
          }
          db.getuserid(User.email)
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
                res.send("<h1>Home Page</h1><br><span>Under Progress....</span>");
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
    .catch(me =>{
      hl.error(me)
      res.render('message.ejs', {alert_type: 'danger', message: `Error!Try again later`, type:'mail'})
    })
  }      
})

module.exports = router;
var express = require ('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require ('../models/db_controller');
var mail = require('../models/mail');
var mysql = require('mysql');
var hl = require('handy-log');
const { body, check, validationResult } = require('express-validator');



router.use(bodyParser.urlencoded({extended : true}));
router.use(bodyParser.json());

router.get('/', function(req,res){
    res.render('signup.ejs');
});


// Sign Up Form Validation
router.post('/', [check('email', 'Email is empty').notEmpty(),
check('email', 'Email is invalid').isEmail(),
check('password', 'Password field is empty').notEmpty(),
check('confirm_password', 'Confirm Password field is empty').notEmpty(),
body('confirm_password').custom((value, { req }) => {

    if (value !== req.body.password) {
      throw new Error('Confirm Password does not match password');
    }

    // Indicates the success of this synchronous custom validator
    return true;
  }),
  body('email').custom(value => {
    return db.direct_query('SELECT COUNT(*) as emailCount FROM users WHERE email = ?', [value])
    .then(value => {
        if(value[0].emailCount == 1) {
            return Promise.reject('E-mail already in use');
        }
    });
  })], function(req,res){
    
    var email = req.body.email;
    var password = req.body.password;
    var confirm_password = req.body.confirm_password;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var session = req.session;
    //console.log(email, password, confirm_password, fname, lname, session);

    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        //console.log(errors);
        const alert = errors.array();
        res.render('signup', {alert});
    }
    else {
      let newUser = {
      f_name: req.body.fname,
      l_name: req.body.lname,
      email: req.body.email,
      password,
      joined: new Date()
      }
      db.signup(newUser, function(insert_id, f_name){
        //console.log(insert_id);
        let url = `http://localhost:${process.env.PORT}/activate/${insert_id}`
        let options = {
          to: email,
          subject: "Activate your GLEAM App account",
          html: `<span>Hello, <b>${f_name}</b> <br>You received this message because you created an account on GLEAM App.<span><br><span>Click on button below to activate your account and explore.</span><br><br><a href='${url}' style='border: 1px solid #1b9be9; font-weight: 600; color: #fff; border-radius: 3px; cursor: pointer; outline: none; background: #1b9be9; padding: 4px 15px; display: inline-block; text-decoration: none;'>Activate</a>`
        }
        mail(options)
          .then(m =>{
            hl.success(m)
            session.id = insert_id
            session.email = email
            session.email_verified = "no"
            //res.json({ mssg: `Hello, ${session.email}!!`, success: true })
            res.render('message.ejs', {alert_type: 'success', message: `A verification mail has been sent to this email: <b>${email}</b>`, type:'mail'})
          })
          .catch(me =>{
            hl.error(me)
            res.render('message.ejs', {alert_type: 'danger', message: `Error sending mail!`, type:'mail'})
          })
      });
    }
  }        
);


module.exports = router;
var express = require ('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require ('../models/db_controller');
var mail = require('../models/mail');
var mysql = require('mysql');
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
check('repeat_password', 'Password field is empty').notEmpty(),
body('repeat_password').custom((value, { req }) => {

    if (value !== req.body.password) {
      throw new Error('Repeat Password does not match password');
    }

    // Indicates the success of this synchronous custom validator
    return true;
  }),
  body('email').custom(value => {
    return db.query('SELECT COUNT(*) as emailCount FROM users WHERE email = ?', [value])
    .then(value => {
        if(value[0].emailCount == 1) {
            return Promise.reject('E-mail already in use');
        }
    });
  })], function(req,res){
    
    var email = req.body.email;
    var password = req.body.password;
    var repeat_password = req.body.repeat_password;
    //console.log(email, password, repeat_password);

    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        //console.log(errors);
        const alert = errors.array();
        res.render('signup.ejs', {alert});
    }
    else {
                let newUser = {
                    email: req.body.email,
                    password,
                    joined: new Date().getTime()
                }
                db.signup(newUser);
    }

});

module.exports = router;
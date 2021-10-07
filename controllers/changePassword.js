var express = require ('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require ('../models/db_controller');
var mail = require('../models/mail');
var mysql = require('mysql');
var hl = require('handy-log');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(process.env.SECURITY_KEY);

const { body, check, validationResult } = require('express-validator');
const { nextTick } = require('async');



router.use(bodyParser.urlencoded({extended : true}));
router.use(bodyParser.json());

router.get('/', function(req,res){
    if(req.session.email)
    {
        let is_changable = 'yes';
        req.session.is_password_changable = is_changable;
        return db.direct_query('SELECT provider FROM users WHERE email = ?', [req.session.email])
            .then(result => {
                if(result[0].provider !== 'self') {
                    is_changable = 'no';
                    req.session.is_password_changable = is_changable;
                    res.render('changePassword.ejs', {is_changable});
                }
                else {
                    res.render('changePassword.ejs', {is_changable});
                }
            })
    }
    else {
        res.render('message.ejs', { alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type: 'verification' });
    }
    
});


router.post('/', [check('password', 'Password field is empty').notEmpty(),
check('confirm_password', 'Confirm Password field is empty').notEmpty(),
check('old_password', 'Old Password field is empty').notEmpty(),
body('confirm_password').custom((value, { req }) => {
    // console.log(value);
    if (value !== req.body.password) {
      throw new Error('Confirm Password does not match with Password');
    }

    // Indicates the success of this synchronous custom validator
    return true;
}),
body('old_password').custom((value, {req}) => {
    // console.log(req.body.password, id);
    // console.log(value);

    return db.oldPassCheckByEmail(value, req.session.email)
    .then(result => {
        // console.log(result);
        if(result === false) {
            return Promise.reject('Your old password doesn\'t match');      
        }
        // else if(result === 'undefined') {
        //     return Promise.reject('Your old password doesn\'t match');
        // }
    })
}),
body('password').custom((value, {req}) => {
    // console.log(req.body.password, id);
    // console.log(value, 'pass-body');

    return db.oldPassCheckByEmail(value, req.session.email)
    .then(result => {
        if(result == true) {
            return Promise.reject('Your enterd password is violating the rule. Please change it.');        
        }
        else if(result === 'undefined') {
            return Promise.reject('User doesn\'t exist');
        }
    })
    // return db.direct_query('SELECT password, provider FROM users WHERE id = ?', [id])
    // .then(result => {
    //     let error;
    //     if(result[0].password !== null && result[0].provider === 'self') {
    //         db.comparePassword(value, result[0].password)
    //         .then(result => {
    //             console.log(result);
    //             if(result == true) {
                    
    //                 throw 'You can\'t use your old password';
    //             }
    //         })
    //         .catch(me =>{
    //             console.log(me);
    //             hl.error(me)
    //             return Promise.reject(me);
    //         })
    //     }
    //     else{
    //         return Promise.reject('User doesn\'t exist');
    //     }
    // });
})], function(req,res){
    // let {encrypted_id} = req.params;
    // let id = cryptr.decrypt(encrypted_id);

    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        //console.log(errors);
        const alert = errors.array();
        res.render('changePassword', {alert, is_changable: req.session.is_password_changable});
    }
    else
    {
        db.resetPasswordByEmail(req.body.password, req.session.email)
        .then(result => {
            // console.log(result);
            if(result.changedRows === 1) {
                res.redirect('/dashboard');
            }
            else
            {
                res.render('message.ejs', {alert_type: 'danger', message: `Error!Try again later`, type:'mail'})
            }
        });
    }

});
module.exports = router;
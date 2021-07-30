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



router.use(bodyParser.urlencoded({extended : true}));
router.use(bodyParser.json());

router.get('/', function(req,res){
    res.render('emailSearch.ejs');
});

router.post('/', [check('email', 'Email is empty').notEmpty(),
check('email', 'Email is invalid').isEmail(),
body('email').custom((value, { req }) => {
    return db.direct_query('SELECT COUNT(*) as emailCount FROM users WHERE email = ?', [value])
    .then(value => {
        if(value[0].emailCount == 0) {
            return Promise.reject('E-mail is not in use');
        }
        else if(value[0].emailCount == 1) {
            return db.direct_query('SELECT provider FROM users WHERE email = ?', [req.body.email])
            .then(result => {
                if(result[0].provider !== 'self') {
                    return Promise.reject('You are not self registered');
                }
            })
        }
    });
})], function(req, res){
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        //console.log(errors);
        const alert = errors.array();
        res.render('emailSearch', {alert});
    }
    else {
        db.getuserid(req.body.email)
        .then(result => {
            var encrypted_id = cryptr.encrypt(result[0].id);
            let url = `http://localhost:${process.env.PORT}/reset-password/confidential/${encrypted_id}`
            let options = {
                to: req.body.email,
                subject: "Reset Password Link of  your GLEAM App account",
                html:   `<span>Hello, <b>${result[0].first_name}</b> <br>You received this message because you have requested to reset your <b>GLEAM App</b> account's password.</span>
                        <br><span>Click on the button below to reset your account's password.</span><br><br>
                        <a href='${url}' style='border: 1px solid #1b9be9; font-weight: 600; color: #fff; border-radius: 3px; cursor: pointer; outline: none; background: #1b9be9; padding: 4px 15px; display: inline-block; text-decoration: none;'>Reset Password</a>
                        <br><br><span><strong>Don't share the mail with others</strong></span><br>
                        <br><span>If you haven't requested to change the password, kindly ignore it.</span><br>`
            }
            mail(options)
            .then(m =>{
                hl.success(m)
                //res.json({ mssg: `Hello, ${session.email}!!`, success: true })
                res.render('message.ejs', {alert_type: 'success', message: `Password Reset Link has been sent to your email.`, type:'mail'})
            })
            .catch(me =>{
                hl.error(me)
                res.render('message.ejs', {alert_type: 'danger', message: `Error sending mail!`, type:'mail'})
            })
        })
        .catch(me =>{
            hl.error(me);
            res.render('message.ejs', {alert_type: 'danger', message: `Error! Try again later`, type:'mail'});
        })
    }
});

router.get('/confidential/:encrypted_id', function(req,res){
    let {encrypted_id} = req.params;
    let id = cryptr.decrypt(encrypted_id);

    res.render('resetPassword.ejs');
});

router.post('/confidential/:encrypted_id', [check('password', 'Password field is empty').notEmpty(),
check('confirm_password', 'Confirm Password field is empty').notEmpty(),
body('confirm_password').custom((value, { req }) => {

    if (value !== req.body.password) {
      throw new Error('Confirm Password does not match with Password');
    }

    // Indicates the success of this synchronous custom validator
    return true;
}),
body('password').custom((value, {req}) => {
    let {encrypted_id} = req.params;
    let id = cryptr.decrypt(encrypted_id);
    // console.log(req.body.password, id);

    return db.oldPassCheck(value, id)
    .then(result => {
        if(result == true) {
            return Promise.reject('You can\'t use your old password');        
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
    let {encrypted_id} = req.params;
    let id = cryptr.decrypt(encrypted_id);

    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        //console.log(errors);
        const alert = errors.array();
        res.render('resetPassword', {alert});
    }
    else
    {
        db.resetPassword(req.body.password, id)
        .then(result => {
            // console.log(result);
            if(result.changedRows === 1) {
                res.render('message.ejs', {alert_type: 'success', message: `Your password has been changed succesfully`, type:'verification'});
            }
            else
            {
                res.render('message.ejs', {alert_type: 'danger', message: `Error!Try again later`, type:'mail'})
            }
        });
    }

});
module.exports = router;
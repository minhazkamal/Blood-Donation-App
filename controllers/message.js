var express = require ('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require ('../models/db_controller');
var mail = require('../models/mail');
var mysql = require('mysql');
var hl = require('handy-log');
const { body, check, validationResult } = require('express-validator');
const session = require('express-session');



router.use(bodyParser.urlencoded({extended : true}));
router.use(bodyParser.json());

//var user_id;

router.get('/:id', function(req,res){
    let {id} = req.params;
    db.isEmailVerified([id], function (err, result, fields){
        if (err) throw err;

        if(result[0].email_verified == "yes") res.send("Email is already verified");
        else {
            db.verify_email([id], function (err, result, fields) {
                if(err) throw err;
                else
                {
                    req.session.name = 'Hello' + id;
                    //user_id = id;
                    res.render('verification.ejs', {id, link: `/profile-update/${id}`});
                }
            })
        }
    });
});

// router.post('/:id', function(req,res){
//     let {id} = req.params;
//     let user_id = id;
//     let session = req.session.name;
//     res.send(`email_activate.ejs ${user_id} ${session}`);
// });

module.exports = router;
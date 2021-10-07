var express = require ('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require ('../models/db_controller');
var mail = require('../models/mail');
var mysql = require('mysql');
var hl = require('handy-log');
const { body, check, validationResult } = require('express-validator');
const session = require('express-session');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(process.env.SECURITY_KEY);



router.use(bodyParser.urlencoded({extended : true}));
router.use(bodyParser.json());

//var user_id;

router.get('/:encrypted_id', function(req,res){
    //console.log('Email Verification');
    let {encrypted_id} = req.params;
    let id = cryptr.decrypt(encrypted_id);
    //console.log(id);
    db.resolveRequestById(id)
    .then(result =>{
        res.redirect('/my-profile?tab=request');
    })
        
});

// router.post('/:id', function(req,res){
//     let {id} = req.params;
//     let user_id = id;
//     let session = req.session.name;
//     res.send(`email_activate.ejs ${user_id} ${session}`);
// });

module.exports = router;
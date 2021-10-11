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

router.get('/', function(req,res){
    if(req.session.email) {
        delete req.session;
        res.redirect('/login');
    }
    else {
        res.render('message.ejs', { alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type: 'verification' });
    }
});

// router.post('/:id', function(req,res){
//     let {id} = req.params;
//     let user_id = id;
//     let session = req.session.name;
//     res.send(`email_activate.ejs ${user_id} ${session}`);
// });

module.exports = router;
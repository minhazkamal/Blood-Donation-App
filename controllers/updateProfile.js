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
    if(req.session.email)
    {
        db.getDivisions()
        .then(result => {
            if(result.length>0)
            {
                let div_result = result;
                db.getuserid(req.session.email)
                .then(result => {
                    res.render('updateProfile.ejs', {f_name: result[0].first_name, l_name: result[0].last_name, email: result[0].email, divisions: div_result});
                })
            }
        })
    }
    else{
        res.render('message.ejs', {alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type:'verification'});
    }
});

router.post('/', function(req,res){
    console.log(req.body.email);
});

module.exports = router;
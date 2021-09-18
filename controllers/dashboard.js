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


router.get('/', function(req,res){
    // req.session.email = 'minhaz.kamal9900@gmail.com';
    if(req.session.email)
    {
        var user_status = {
            eligibility: '',
            active: '',
            name: '',
        }
        db.getuserid(req.session.email)
        .then(result => {
            user_status.name = result[0].first_name;
            user_status.eligibility = result[0].eligibility_test;
            db.getActiveStatusById(result[0].id)
            .then(result => {
                user_status.active = result[0].status;
                req.session.temp_user_status = user_status;
                res.render('dashboard', {user_status});
            })
        })
    }
    else {
        res.render('message.ejs', { alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type: 'verification' });
    }
    
});

router.get('/update-active', function(req, res){
    let value = req.query.value;
    // console.log(req.session.email, value);
    db.updateActiveStatus(req.session.email, value)
    .then(result => {
        // console.log(result);
        res.json(result);
    })
})


module.exports = router;
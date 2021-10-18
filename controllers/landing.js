var mysql = require('mysql');
var express = require('express');
var cookie = require('cookie-parser');
var db = require('../models/db_controller');
var router = express.Router();


router.get('/', function (req, res) {
    if (req.session.email != undefined) {
        db.NotificationUpdateDynamically(req, res)
            .then(result => {
                res.render('home.ejs', { email: req.session.email, navbar: req.session.navbar_info, notifications: req.session.notifications});
            })
    }
    else{
        res.render('home.ejs', {email: 'undefined'});
    } 
});



module.exports = router;
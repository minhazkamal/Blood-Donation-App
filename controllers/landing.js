var mysql =require('mysql');
var express = require ('express');
var cookie = require ('cookie-parser');
var db = require ('../models/db_controller');
var router = express.Router();


router.get('/',function(req,res){
    res.render('landing.ejs');
});

router.get('/',function(req,res){
    res.render('signup.ejs');
});

router.get('/',function(req,res){
    res.render('login.ejs');
});

router.get('/about',function(req,res){
    res.redirect ('https://www.facebook.com/minhaz.kamal9900');
});



module.exports = router;
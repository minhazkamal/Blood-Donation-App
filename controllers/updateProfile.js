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
    res.render('login.ejs');
});

module.exports = router;
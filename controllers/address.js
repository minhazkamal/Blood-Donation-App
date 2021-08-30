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

router.get('/districts', function(req,res){
    let div_id = req.query.division_id;
    db.getDistrictsByDiv(div_id)
    .then(result => {
        if(result.length>0)
        {
            // console.log(result);
            res.json(result);
        }
    })
    // res.render('updateProfile.ejs', {f_name: 'Minhaz', l_name: 'Kamal', email: 'minhaz.kamal9900@gmail.com'});
});

router.get('/upazillas', function(req,res){
    let dist_id = req.query.district_id;
    db.getUpazillasByDist(dist_id)
    .then(result => {
        if(result.length>0)
        {
            // console.log(result);
            res.json(result);
        }
    })
    // res.render('updateProfile.ejs', {f_name: 'Minhaz', l_name: 'Kamal', email: 'minhaz.kamal9900@gmail.com'});
});

router.get('/get-org-details', function(req,res){
    let id = req.query.id;
    db.getOrgNameAndDetails(id)
    .then(result => {
        if(result.length>0)
        {
            // console.log(result);
            res.json(result);
        }
    })
    // res.render('updateProfile.ejs', {f_name: 'Minhaz', l_name: 'Kamal', email: 'minhaz.kamal9900@gmail.com'});
});

module.exports = router;
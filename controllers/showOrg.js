var express = require ('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require ('../models/db_controller');
var mail = require('../models/mail');
var box = require('../models/mapbox');
var mysql = require('mysql');
var hl = require('handy-log');
const { body, check, validationResult } = require('express-validator');

router.use(bodyParser.urlencoded({extended : true}));
router.use(bodyParser.json());

router.get('/details', function(req,res){
    db.getOrgInfo()
    .then(result => {
        var org = {
            type: 'FeatureCollection',
            features: []
        };

        for(var i=0; i<result.length; i++)
        {
            var Prop_Obj = { 
                contact: result[i].contact, 
                title: result[i].name, 
                address: result[i].details 
            };
            // var property = JSON.stringify(Prop_Obj);

            var geo_Obj = {
                type: 'Point', 
                coordinates: [result[i].lat, result[i].lon]
            };
            // var geo = JSON.stringify(geo_Obj);

            var feat_Obj = {
                type: 'Feature', 
                geometry: geo_Obj, 
                properties: Prop_Obj
            };
            // var feature = JSON.stringify(feat_Obj);

            org.features.push(feat_Obj);
        }

        // console.log(org);
        res.json(org);
    })
});

router.get('/owner-details', function(req, res){
    // req.session.email = 'minhaz.kamal9900@gmail.com';
    if (req.session.email) {
        db.getUserAddress(req.session.email)
        .then(result => {
            var coord = {
                lat: result[0].lat,
                lon: result[0].lon
            }
            res.json(coord);
        })
    }
    else {
        res.render('message.ejs', { alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type: 'verification' });
    }
})

module.exports = router;
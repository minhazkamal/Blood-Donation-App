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

router.get('/forward', function(req,res){
    // box.forwardGeocoder('311, West Shewrapara, Mirpur, Dhaka, Dhaka')
});

router.get('/reverse', function(req,res){
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;
    let address = {
        division: null,
        district: null,
        upazilla: null
    }
    box.reverseGeocoder(latitude, longitude)
    .then(response =>{
        // console.log(response);
        for(var i=0; i<response.features.length; i++)
        {
          if(response.features[i].id.includes('region'))
          {
            // console.log("Division: ", response.features[i].text);
            address.division = response.features[i].text;
          }
          if(response.features[i].id.includes('district'))
          {
            // console.log("District: ", response.features[i].text);
            address.district = response.features[i].text;
          }
          if(response.features[i].id.includes('locality'))
          {
            // console.log("Upazilla: ", response.features[i].text);
            address.upazilla = response.features[i].text;
          }  
        }
        
        if(address.division)
        {
            // console.log(address);
            db.getDivId(address.division)
            .then(result => {
                address.division = result[0].id;
                if(address.district)
                {
                    db.getDistId(address.district, address.division)
                    .then(result => {
                        if(result.length>0) address.district = result[0].id;
                        else address.district = null;
                        if(address.upazilla && address.district !== null)
                        {
                            db.getUpazillaId(address.upazilla, address.district)
                            .then(result => {
                                if(result.length>0) address.upazilla = result[0].id;
                                else address.upazilla = null;
                                // console.log(address)
                                res.json(address)
                            })  
                        }
                    })
                }
                  
            })
            .catch(me => {
                hl.error(me);
            })
            
        }
        // console.log(address);
        // res.json(address)
    })

});

module.exports = router;
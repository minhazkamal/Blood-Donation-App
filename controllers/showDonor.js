var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../models/db_controller');
var mail = require('../models/mail');
var box = require('../models/mapbox');
var mysql = require('mysql');
var hl = require('handy-log');
const { body, check, validationResult } = require('express-validator');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(process.env.SECURITY_KEY);

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/details', function (req, res) {
    // req.session.email = 'minhaz.kamal9900@gmail.com';
    db.getAllDiv()
        .then(result => {
            var div = result;
            db.getAllDist()
                .then(result => {
                    var dist = result;
                    db.getAllUpazilla()
                        .then(result => {
                            var upazilla = result;
                            db.getUserAllInfoExceptMine(req.session.email)
                                .then(result => {
                                    // console.log(div);
                                    // console.log(dist);
                                    // console.log(upazilla[518], upazilla[519], upazilla[520]);
                                    // console.log(result);
                                    var user = {
                                        type: 'FeatureCollection',
                                        features: []
                                    };

                                    for (var i = 0; i < result.length; i++) {
                                        var Prop_Obj = {
                                            user_id: cryptr.encrypt(result[i].id),
                                            contact: result[i].contact,
                                            name: result[i].first_name + ' ' + result[i].last_name,
                                            address: result[i].house + ', ' + result[i].street + ', ' + upazilla.find(item => item.id === result[i].upazilla).name + ', ' + dist[result[i].district - 1].name + ', ' + div[result[i].division - 1].name,
                                            bg: result[i].BG,
                                            gender: result[i].gender
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

                                        user.features.push(feat_Obj);
                                    }

                                    // console.log(user);
                                    res.json(user);
                                })

                        })
                })
        })
});

router.get('/owner-details', function (req, res) {
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
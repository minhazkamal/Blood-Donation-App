var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../models/db_controller');
var mail = require('../models/mail');
var mysql = require('mysql');
var hl = require('handy-log');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(process.env.SECURITY_KEY);
var fs = require('fs');
var path = require('path');
var multer = require('multer');
const { body, check, validationResult } = require('express-validator');
var mapbox = require('../models/mapbox');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
// router.use(multer().none());

function mysql2JsDate(str) {
    var g = str;
    // console.log(g);
    return new Date(g.getTime() - (g.getTimezoneOffset() * 60000));
}

function mysql2JsLocal(str) {
    var g = mysql2JsDate(str).toISOString().split(/[- : T]/);
    var dob = g[2] + '/' + g[1] + '/' + g[0];
    return dob;
}

function yesORno(b) {
    if (b == 'yes') return 0;
    else return 1;
}

function calculateEligibilityScore(report) {
    var total = 0;
    total += yesORno(report[0].asthma);
    total += yesORno(report[0].high_bp);
    total += yesORno(report[0].cancer);
    total += yesORno(report[0].diabetes);
    total += yesORno(report[0].heart_disease);
    total += yesORno(report[0].hepatitis);
    total += yesORno(report[0].anemia);
    total += yesORno(report[0].tuberculosis);
    total += 2 - parseInt(report[0].smoke);
    total += 2 - parseInt(report[0].drinking);
    total += 2 - parseInt(report[0].depression);

    return Math.floor((total * 10) / 14);
}

router.get('/', function (req, res) {
    if(req.session.email)
    {
        db.getDivisions()
        .then(results => {
            let div_result = results;
            // console.log(results);
            res.render('requestFeed.ejs', { divisions: div_result, navbar: req.session.navbar_info });
        })
    }
    else {
        res.render('message.ejs', { alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type: 'verification' });
    }
    
});

router.get('/list', function (req, res) {
    const offset = req.query.offset;
    // req.session.email = 'minhaz.kamal9900@gmail.com';
    if(req.session.email) {
    db.getuserid(req.session.email)
        .then(result => {
            var myId = result[0].id;
            
            db.getRequestsByOffset(offset)
                .then(result => {
                    // console.log(result);
                    var request = [];
                    for (var i = 0; i < result.length; i++) {
                        var each_request = {
                            request_id: cryptr.encrypt(result[i].id),
                            post_by_id: cryptr.encrypt(result[i].post_by),
                            pt_name: result[i].patient,
                            bg: result[i].BG,
                            quantity: result[i].quantity,
                            contact: result[i].contact,
                            place: result[i].orgname + ', ' + result[i].orgdetails,
                            requirement: result[i].requirement,
                            complication: result[i].complication,
                            approx_date: mysql2JsLocal(result[i].approx_date),
                            responder_id: myId,
                            posted_by_name: result[i].first_name + ' ' + result[i].last_name,
                            profile_photo: result[i].photo,
                            responder: 'others'
                        }

                        if(result[i].post_by == myId) each_request.responder = 'self';

                        request.push(each_request);
                    }

                    // console.log(request);
                    res.json(request);
                })
        })
    }
        else {
            res.render('message.ejs', { alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type: 'verification' });
        }

})

module.exports = router;
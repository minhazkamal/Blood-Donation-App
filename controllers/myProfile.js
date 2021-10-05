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
    //console.log(g);
    return new Date(g.getTime() - (g.getTimezoneOffset() * 60000));
}

function mysql2JsLocal(str) {
    var g = mysql2JsDate(str).toISOString().split(/[- : T]/);
    var dob = g[2] + '/' + g[1] + '/' + g[0];
    return dob;
}

function yesORno(b) {
    if (b=='yes') return 0;
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

    return Math.floor((total*10)/14);
}

router.get('/', function (req, res) {
    var tab = req.query.tab;
    // console.log(tab);
    req.session.email = 'minhaz.kamal9900@gmail.com';
    let user = {
        fullname: '',
        contact: '',
        email: '',
        dob: '',
        bg: '',
        gender: '',
        address: '',
        eligibility_score: '',
        requests_count: '',
        donated: '',
        img: '',
        editLink: ''
    }
    if (req.session.email) {
        db.getUserAllInfo(req.session.email)
            .then(result => {
                user.fullname = result[0].first_name + ' ' + result[0].last_name;
                user.contact = '+88 ' + result[0].contact;
                user.email = req.session.email;
                user.dob = mysql2JsLocal(result[0].dob);
                user.bg = result[0].BG;
                user.gender = result[0].gender;
                user.address = result[0].house + ', ' + result[0].street + ', ';
                // user.editLink = '/edit/'+result[0].id;
                user.editLink = '/profile-update';

                let address = {
                    division: result[0].division,
                    district: result[0].district,
                    upazilla: result[0].upazilla
                }

                db.getProfilePic(result[0].id)
                    .then(result1 => {
                        user.img = `/profile/` + result1[0].profile_picture;
                        db.getLocationNamesByIds(address)
                            .then(result2 => {
                                user.address += result2[0].upazilla + ', ' + result2[0].district + ', ' + result2[0].division
                                db.countBloodRequests(req.session.email)
                                    .then(result3 => {
                                        user.requests_count = result3[0].total_requests;
                                        db.getEligibilityReport(req.session.email)
                                        .then(result4 => {
                                            user.eligibility_score = calculateEligibilityScore(result4);

                                            db.getRequestByPoster(req.session.email)
                                            .then(result5 => {
                                                var request = [];

                                                for(var i=0; i<result5.length; i++)
                                                {
                                                    // console.log(i);
                                                    var eachrequest = {
                                                        id: cryptr.encrypt(result5[i].id),
                                                        serialID: i+1,
                                                        patient: result5[i].patient,
                                                        location: result5[i].orgname +', '+ result5[i].orgdetails,
                                                        date: mysql2JsLocal(result5[i].date),
                                                        bg: result5[i].bg,
                                                        quantity: result5[i].quantity
                                                    }

                                                    request.push(eachrequest);
                                                    // console.log(eachrequest);
                                                    // console.log(request);
                                                }

                                                res.render('myProfile.ejs', { user, tab, request });
                                            })
                                            // console.log(user);
                                            // res.render('myProfile.ejs', { user, tab });
                                        })                                        
                                    })

                            })
                    })
            })

    }
    else {
        res.render('message.ejs', { alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type: 'verification' });
    }
});

module.exports = router;
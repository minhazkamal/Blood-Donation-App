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

function calculate_age(dob) {
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

router.get('/', function (req, res) {
    var tab = req.query.tab;
    // console.log(tab);
    // req.session.email = 'minhaz.kamal9900@gmail.com';
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
        editLink: '',
        profession: '',
    }
    if (req.session.email) {
        db.getUserAllInfo(req.session.email)
            .then(result => {
                let myId = result[0].id;
                let myBG = result[0].BG;
                user.fullname = result[0].first_name + ' ' + result[0].last_name;
                user.contact = '+88 ' + result[0].contact;
                user.email = req.session.email;
                user.dob = mysql2JsLocal(result[0].dob);
                user.bg = result[0].BG;
                user.gender = result[0].gender;
                user.address = result[0].house + ', ' + result[0].street + ', ';
                // user.editLink = '/edit/'+result[0].id;
                user.editLink = '/profile-update';
                user.profession = result[0].profession;
                user.age = calculate_age(result[0].dob);

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
                                        if (result3) user.requests_count = result3[0].total_requests;
                                        else user.requests_count = 0;
                                        // user.requests_count = result3[0].total_requests;
                                        db.getEligibilityReport(req.session.email)
                                            .then(result4 => {
                                                if (result4.length > 0) user.eligibility_score = calculateEligibilityScore(result4);
                                                else user.eligibility_score = 0;
                                                db.getRequestByPoster(req.session.email)
                                                    .then(result5 => {
                                                        var request = [];

                                                        for (var i = 0; i < result5.length; i++) {
                                                            // console.log(i);
                                                            var eachrequest = {
                                                                id: cryptr.encrypt(result5[i].id),
                                                                serialID: i + 1,
                                                                patient: result5[i].patient,
                                                                location: result5[i].orgname + ', ' + result5[i].orgdetails,
                                                                date: mysql2JsLocal(result5[i].date),
                                                                bg: result5[i].bg,
                                                                quantity: result5[i].quantity,
                                                                resolved: result5[i].resolved
                                                            }

                                                            request.push(eachrequest);
                                                            // console.log(eachrequest);
                                                            // console.log(request);
                                                        }
                                                        db.countTotalDonation(req.session.email)
                                                            .then(result6 => {
                                                                if (result6.length > 0) user.donated = result6[0].total_donation;
                                                                else user.donated = 0;

                                                                db.getDonationByDonor(req.session.email)
                                                                    .then(result7 => {
                                                                        var donation = [];

                                                                        for (var i = 0; i < result7.length; i++) {
                                                                            // console.log(i);
                                                                            var eachdonation = {
                                                                                donation_id: cryptr.encrypt(result7[i].donation_id),
                                                                                serialID: i + 1,
                                                                                patient: result7[i].patient,
                                                                                location: result7[i].orgname + ', ' + result7[i].orgdetails,
                                                                                date: mysql2JsLocal(result7[i].date),
                                                                            }

                                                                            donation.push(eachdonation);
                                                                            // console.log(eachrequest);
                                                                            // console.log(request);
                                                                        }

                                                                        db.getRequestByResponder(myId)
                                                                            .then(result8 => {
                                                                                // console.log(result8);
                                                                                var response = [];

                                                                                for (var i = 0; i < result8.length; i++) {
                                                                                    // console.log(i);
                                                                                    var eachresponse = {
                                                                                        request_id: cryptr.encrypt(result8[i].id),
                                                                                        serialID: i + 1,
                                                                                        patient: result8[i].patient,
                                                                                        location: result8[i].orgname + ', ' + result8[i].orgdetails,
                                                                                        patient_bg: result8[i].bg,
                                                                                        requester_bg: result8[i].user_bg,
                                                                                        user_bg: myBG
                                                                                    }

                                                                                    response.push(eachresponse);
                                                                                    // console.log(eachrequest);
                                                                                    // console.log(request);
                                                                                }
                                                                                // console.log(response);
                                                                                res.render('myProfile.ejs', { user, tab, request, navbar: req.session.navbar_info, donation, response });
                                                                            })

                                                                    })


                                                            })
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
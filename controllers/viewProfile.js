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

function calculate_age(dob) { 
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms); 
  
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

router.get('/:encrypted_id/', function (req, res) {
    var responder = req.query.respond;
    let { encrypted_id } = req.params;
    let id = cryptr.decrypt(encrypted_id);
    // console.log(id);
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
        responder: 'no',
        age: '',
        profession: ''
    }
    if(responder) user.responder='yes';
    //req.session.email='minhazkamal@iut-dhaka.edu';
    if (req.session.email) {
        db.getuserinfobyid(id)
            .then(result => {
                user.id = encrypted_id;
                user.fullname = result[0].first_name + ' ' + result[0].last_name;
                user.contact = '+88 ' + result[0].contact;
                user.email = result[0].email;
                user.dob = mysql2JsLocal(result[0].dob);
                user.bg = result[0].BG;
                user.gender = result[0].gender;
                user.address = result[0].house + ', ' + result[0].street + ', ';
                user.age = calculate_age(result[0].dob);
                user.profession = result[0].profession;
                // user.editLink = '/edit/'+result[0].id;
                // user.editLink = '/profile-update';

                let address = {
                    division: result[0].division,
                    district: result[0].district,
                    upazilla: result[0].upazilla
                }

                db.getProfilePic(id)
                    .then(result1 => {
                        user.img = `/profile/` + result1[0].profile_picture;
                        db.getLocationNamesByIds(address)
                            .then(result2 => {
                                user.address += result2[0].upazilla + ', ' + result2[0].district + ', ' + result2[0].division
                                db.countBloodRequests(user.email)
                                    .then(result3 => {
                                        if(result3) user.requests_count = result3[0].total_requests;
                                        else user.requests_count = 0;
                                        // user.requests_count = result3[0].total_requests;
                                        db.getEligibilityReport(user.email)
                                        .then(result4 => {
                                            if(result4.length>0) user.eligibility_score = calculateEligibilityScore(result4);
                                            else user.eligibility_score = 0;

                                            db.countTotalDonation(user.email)
                                            .then(result5 => {
                                                if(result5) user.donated = result5[0].total_donation;
                                                else user.donated = 0;
                                                db.NotificationUpdateDynamically(req, res)
                                .then(result => {
                                    res.render('viewProfile.ejs', { user, navbar: req.session.navbar_info, notifications: req.session.notifications });
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
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../models/db_controller');
var mail = require('../models/mail');
var mysql = require('mysql');
var hl = require('handy-log');
const { body, check, validationResult } = require('express-validator');
const session = require('express-session');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.get('/', function (req, res) {
    var eligibility_parameters = {
        test: '',
        asthma: '',
        high_bp: '',
        cancer: '',
        diabetes: '',
        heart_disease: '',
        hepatitis: '',
        anemia: '',
        tuberculosis: '',
        smoke: '',
        drinking: '',
        depression: '',
        dob: '',
        last_donation: ''
    }
    // req.session.email = 'minhaz.kamal9900@gmail.com'
    if (req.session.email) {
        db.getuserid(req.session.email)
            .then(result_id => {
                db.getDOB(req.session.email)
                    .then(result => {

                        result[0].dob.setTime(result[0].dob.getTime() - result[0].dob.getTimezoneOffset() * 60 * 1000);
                        eligibility_parameters.dob = result[0].dob.toISOString();
                        eligibility_parameters.dob = (eligibility_parameters.dob.substring(0, 10));

                        if (result_id[0].eligibility_test == 'yes') {
                            db.getEligibilityReport(req.session.email)
                                .then(result => {
                                    eligibility_parameters.test = 'yes';
                                    eligibility_parameters.asthma = result[0].asthma;
                                    eligibility_parameters.high_bp = result[0].high_bp;
                                    eligibility_parameters.cancer = result[0].cancer;
                                    eligibility_parameters.diabetes = result[0].diabetes;
                                    eligibility_parameters.heart_disease = result[0].heart_disease;
                                    eligibility_parameters.hepatitis = result[0].hepatitis;
                                    eligibility_parameters.anemia = result[0].anemia;
                                    eligibility_parameters.tuberculosis = result[0].tuberculosis;
                                    eligibility_parameters.smoke = result[0].smoke;
                                    eligibility_parameters.drinking = result[0].drinking;
                                    eligibility_parameters.depression = result[0].depression;

                                    if (result[0].last_donation != null) {
                                        result[0].last_donation.setTime(result[0].last_donation.getTime() - result[0].last_donation.getTimezoneOffset() * 60 * 1000);
                                        eligibility_parameters.last_donation = result[0].last_donation.toISOString();
                                        eligibility_parameters.last_donation = (eligibility_parameters.last_donation.substring(0, 10));
                                    }

                                    // console.log(eligibility_parameters);
                                    req.session.temp_eligibility = eligibility_parameters;
                                    res.render('eligibilityTest.ejs', { user: eligibility_parameters, navbar: req.session.navbar_info });
                                })
                        }
                        else {
                            eligibility_parameters.test = 'no';
                            req.session.temp_eligibility = eligibility_parameters;

                            // console.log(eligibility_parameters);
                            res.render('eligibilityTest.ejs', { user: eligibility_parameters, navbar: req.session.navbar_info });
                        }
                    })
            })
    }
    else {
        res.render('message.ejs', { alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type: 'verification' });
    }
    // res.render('eligibilityTest');
});

router.post('/', function (req, res) {
    var elg = {
        id: '',
        asthma: req.body.asthma,
        high_bp: req.body.highbp,
        cancer: req.body.cancer,
        diabetes: req.body.diabetes,
        heart_disease: req.body.HeartDisease,
        hepatitis: req.body.Hepatitis,
        anemia: req.body.anemia,
        tuberculosis: req.body.Tuberculosis,
        smoke: req.body.smoke,
        drinking: req.body.drinking,
        depression: req.body.depression,
        last_donation: req.body.last_donation
    }
    if (req.session.email) {
        db.getuserid(req.session.email)
            .then(result => {
                elg.id = result[0].id;
                if (elg.last_donation == '') elg.last_donation = null;
                else {
                    let last_donation_date = new Date(elg.last_donation);
                    var last_donation_date_timePortion = (last_donation_date.getTime() - last_donation_date.getTimezoneOffset() * 60 * 1000) % (3600 * 1000 * 24);
                    var last_donation_date_dateonly = new Date(last_donation_date - last_donation_date_timePortion);

                    elg.last_donation = last_donation_date_dateonly;
                }
                db.setEligibilityReport(elg, result[0].eligibility_test)
                    .then(result => {
                        db.updateEligibilityStatus(elg.id, 'yes')
                            .then(result => {
                                res.redirect('/dashboard');
                            })
                    })
            })
    }
    else {
        res.render('message.ejs', { alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type: 'verification' });
    }
    // console.log(req.body);
});

// router.post('/:id', function(req,res){
//     let {id} = req.params;
//     let user_id = id;
//     let session = req.session.name;
//     res.send(`email_activate.ejs ${user_id} ${session}`);
// });

module.exports = router;
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
const { request } = require('express');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
// router.use(multer().none());


// const validateDonation = (value, { req }) => {

//     // let temp_donation = new Date(value);
//     // console.log(temp_donation);
//     // console.log(value);
//     db.checkValidDonationDate(value, req.session.email)
//     .then(result => {
//         // console.log(result);
//         if(result[0].donate_count > 0) return Promise.reject('Your given date is not valid. You can\'t donate within 3 months.');
//     });


// }

function mysql2JsDate(str) {
    var g = str;
    //console.log(g);
    return new Date(g.getTime() - (g.getTimezoneOffset() * 60000));
}

function minDateCalculation(str) {
    str.setFullYear(str.getFullYear() + 18);
    var g = mysql2JsDate(str).toISOString().split(/[- : T]/);
    var dob = g[0] + '-' + g[1] + '-' + g[2];
    return dob;
}

function maxDateCalculation(str) {
    var g = mysql2JsDate(str).toISOString().split(/[- : T]/);
    var dob = g[0] + '-' + g[1] + '-' + g[2];
    return dob;
}

router.get('/', function (req, res) {
    var encrypted_req_id = req.query.eri;
    // req.session.email = 'minhaz.kamal9900@gmail.com';
    if (req.session.email) {
        if (encrypted_req_id) {
            const req_id = cryptr.decrypt(encrypted_req_id);
            db.getDivisions()
                .then(result => {
                    let div_result = result;
                    db.getUserAllInfo(req.session.email)
                        .then(result => {
                            const minDate = minDateCalculation(result[0].dob);
                            const maxDate = maxDateCalculation(new Date());
                            let myId = result[0].id;
                            db.getRequestById(req_id)
                                .then(result => {
                                    // console.log(result);
                                    let user = {
                                        type: 'error',
                                        donor_id: myId,
                                        pt_name: result[0].patient,
                                        pt_cp: result[0].contact_person,
                                        pt_contact: result[0].contact,
                                        division: '',
                                        district: '',
                                        upazilla: '',
                                        house: '',
                                        street: '',
                                        complication: result[0].complication,
                                        org: result[0].organization_id,
                                        self_check: '',
                                        org_location: '',
                                        lat: '',
                                        lon: '',
                                    }
                                    req.session.temp_user = user;
                                    req.session.temp_user.minDate = minDate;
                                    req.session.temp_user.maxDate = maxDate;
                                    req.session.div_results = div_result;
                                    res.render('addNewDonation.ejs', { navbar: req.session.navbar_info, divisions: div_result, minDate, maxDate, user });
                                })
                        })
                })
        }
        else {
            db.getDivisions()
                .then(result => {
                    let div_result = result;
                    db.getUserAllInfo(req.session.email)
                        .then(result => {
                            const minDate = minDateCalculation(result[0].dob);
                            const maxDate = maxDateCalculation(new Date());
                            let user = {
                                type: 'first',
                                donor_id: result[0].id,
                                pt_name: '',
                                pt_cp: '',
                                pt_contact: '',
                                division: '',
                                district: '',
                                upazilla: '',
                                house: '',
                                street: '',
                                complication: '',
                                org: '',
                                self_check: '',
                                org_location: '',
                                lat: '',
                                lon: '',
                            }
                            req.session.temp_user = user;
                            req.session.temp_user.minDate = minDate;
                            req.session.temp_user.maxDate = maxDate;
                            req.session.div_results = div_result;
                            res.render('addNewDonation.ejs', { navbar: req.session.navbar_info, divisions: div_result, minDate, maxDate });

                        })
                })
        }
    }
    else {
        res.render('message.ejs', { alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type: 'verification' });
    }
});


router.post('/', [
    // check('donation').custom(validateDonation)
    // check('division', 'Division field is empty').notEmpty(),
    // check('district', 'District field is empty').notEmpty(),
    // check('upazilla', 'Upazilla field is empty').notEmpty(),
    body('donation').custom((value, { req }) => {
        return db.direct_query("SELECT COUNT(*) as donate_count FROM donation WHERE donor_id = (SELECT id FROM users WHERE email = ?) AND donation_date BETWEEN DATE_ADD(?, INTERVAL -3 MONTH) AND DATE_ADD(?, INTERVAL 3 MONTH)", [req.session.email, value, value])
            .then(value => {
                if (value[0].donate_count > 0) {
                    return Promise.reject('Your given date is not valid. You can\'t donate within 3 months.');
                }
            });
    })],
    function (req, res) {
        var encrypted_req_id = req.query.eri;
        var request_id = cryptr.decrypt(encrypted_req_id);
        let errors = validationResult(req)

        req.session.temp_user.pt_cp = req.body.cp_name;
        req.session.temp_user.pt_contact = req.body.cp_contact;
        req.session.temp_user.pt_name = req.body.pt_name;
        req.session.temp_user.quantity = req.body.quantity;
        if (req.body.self_request == 'yes') req.session.temp_user.self_check = req.body.self_request;
        else req.session.temp_user.self_check = 'no';
        req.session.temp_user.org = req.body.org;
        req.session.temp_user.complication = req.body.complication;

        if (req.body.org == '0') {
            if (req.body.current_location == 'yes') {
                req.session.temp_user.org_location = req.body.current_location;
                req.session.temp_user.lat = req.body.lat;
                req.session.temp_user.lon = req.body.lon;
            }
            else {
                req.session.temp_user.org_location = 'no';
                req.session.temp_user.lat = '';
                req.session.temp_user.lon = '';
            }

            req.session.temp_user.division = req.body.division;
            req.session.temp_user.district = req.body.district;
            req.session.temp_user.upazilla = req.body.upazilla;
        }
        else {
            req.session.temp_user.division = '';
            req.session.temp_user.district = '';
            req.session.temp_user.upazilla = '';
        }

        req.session.temp_user.house = req.body.organization_name;
        req.session.temp_user.street = req.body.street;

        if (!errors.isEmpty()) {
            //console.log(errors);
            const alert = errors.array();

            req.session.temp_user.type = 'error';

            res.render('addNewDonation', { user: req.session.temp_user, alert, divisions: req.session.div_results, navbar: req.session.navbar_info, minDate: req.session.temp_user.minDate, maxDate: req.session.temp_user.maxDate });
        }
        else {
            // console.log(req.body);
            let donation_date = new Date(req.body.donation);
            var donation_date_timePortion = (donation_date.getTime() - donation_date.getTimezoneOffset() * 60 * 1000) % (3600 * 1000 * 24);
            var donation_date_dateonly = new Date(donation_date - donation_date_timePortion);

            req.session.temp_user.approx_date = donation_date_dateonly;

            var organization = {
                name: req.body.organization_name,
                mobile: '',
                street: req.body.street,
                longitude: req.body.lon,
                latitude: req.body.lat,
                division: req.body.division,
                district: req.body.district,
                upazilla: req.body.upazilla
            }

            var address = {
                division: req.body.division,
                district: req.body.district,
                upazilla: req.body.upazilla
            }


            if (req.body.org == '0') {
                db.getLocationNamesByIds(address)
                    .then(result => {
                        var location = organization.name + ', ' + organization.street + ', ' + result[0].upazilla + ', '
                            + result[0].district + ', ' + result[0].division;
                        mapbox.forwardGeocoder(location)
                            .then(result => {
                                if (organization.latitude == '' || organization.longitude == '') {
                                    organization.latitude = result.geometry.coordinates[0];
                                    organization.longitude = result.geometry.coordinates[1];
                                }

                                // console.log(organization);


                                db.setOrgInput(organization, function (insert_id) {
                                    // console.log(req.session.temp_user);
                                    req.session.temp_user.org = insert_id;
                                    db.setNewDonation(req.session.temp_user)
                                        .then(result => {
                                            if(encrypted_req_id) {
                                                db.updateResolveOfRespondToRequest(request_id, req.session.email)
                                                .then(result => {

                                                })
                                            }
                                        })
                                        .then(result => {
                                            res.redirect('/my-profile?tab=donation');
                                        })
                                })

                            })

                    })
            }
            else {
                // console.log(req.session.email);

                db.setNewDonation(req.session.temp_user)
                    .then(result => {
                        if(encrypted_req_id) {
                            db.updateResolveOfRespondToRequest(request_id, req.session.email)
                            .then(result => {

                            })
                        }
                    })
                    .then(result => {
                        res.redirect('/my-profile?tab=donation');
                    })

            }
        }

        // console.log("Hello");
        // console.log(req.body.latitude);
        // delete req.session.temp_user;
        // delete req.session.div_results;
    });


router.get('/all-org', function (req, res) {
    db.getOrgInfo()
        .then(result => {
            res.json(result);
        })
})
module.exports = router;
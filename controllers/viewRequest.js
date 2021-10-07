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

const validateDonation = (value, { req }) => {

    // console.log(value);
    if (value != '') {

        // const [year, month, day] = value.split('-');
        let temp_donation = new Date(value);
        // temp_donation.setTime(temp_donation.getTime() - temp_donation.getTimezoneOffset() * 60 * 1000);

        var today = new Date();
        // today.setTime(today.getTime() - today.getTimezoneOffset() * 60 * 1000);

        var today_timePortion = (today.getTime() - today.getTimezoneOffset() * 60 * 1000) % (3600 * 1000 * 24);
        var temp_donation_timePortion = (temp_donation.getTime() - temp_donation.getTimezoneOffset() * 60 * 1000) % (3600 * 1000 * 24);


        var temp_donation_dateonly = new Date(temp_donation - temp_donation_timePortion);
        var today_dateonly = new Date(today - today_timePortion);

        // console.log(temp_donation_dateonly);
        // console.log(today_dateonly);

        if (temp_donation_dateonly < today_dateonly) {
            // console.log('YES!!!');
            throw new Error('You can\'t set a previous date');
        }

        // var age = today.getFullYear() - year;
        // var m = today.getMonth() - month;
        // if (m < 0 || (m === 0 && today.getDate() < day)) {
        //     age--;
        // }
        // if (age < 18) {
        //     throw new Error('Your age must be greater than 18');
        // }
    }
    else throw new Error('Approx Donation Date is empty');

    // }
    // else
    // {
    //     throw new Error('Date of Birth is not valid');
    // }
    return true;
}

function mysql2JsDate(str) {
    var g = str;
    // console.log(g);
    return new Date(g.getTime() - (g.getTimezoneOffset() * 60000));
}

function mysql2JsLocal(str) {
    var g = mysql2JsDate(str).toISOString().split(/[- : T]/);
    var dob = g[0] + '-' + g[1] + '-' + g[2];
    return dob;
}


router.get('/:encrypted_id', function (req, res) {
    // req.session.email = 'minhaz.kamal9900@gmail.com';
    let {encrypted_id} = req.params;
    let id = cryptr.decrypt(encrypted_id);
    if (req.session.email) {
        db.getDivisions()
            .then(result => {
                let div_result = result;
                db.getAllFromRequests(id)
                    .then(result => {
                        let user = {
                            type: 'view',
                            request_id: result[0].id,
                            post_by: result[0].post_by,
                            patient: result[0].patient,
                            cp: result[0].contact_person,
                            contact: result[0].contact,
                            approx_donation: mysql2JsLocal(result[0].approx_donation_date),
                            bg: result[0].BG,
                            complication: result[0].complication,
                            requirements: result[0].requirements,
                            quantity: result[0].quantity,
                            org_id: result[0].organization_id,
                            org_details: result[0].org_address_details,
                            posted_on: mysql2JsLocal(result[0].posted_on),
                            is_updateable: 'no',
                            resolved: result[0].resolved,
                            encrypted_requestId: cryptr.encrypt(result[0].id)
                        }
                        req.session.temp_user = user;
                        req.session.div_results = div_result;
                        db.getuserinfobyid(result[0].post_by)
                        .then(result2 => {
                            // console.log(result2);
                            // console.log(req.session.email);
                            if(result2[0].email == req.session.email) {
                                if(user.resolved == 'no') user.is_updateable = 'yes';
                                user.post_by = result2[0].first_name + ' ' + result2[0].last_name;
                            }
                            res.render('viewRequest.ejs', { user, divisions: div_result });
                        })
                    })
            })
    }
    else {
        res.render('message.ejs', { alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type: 'verification' });
    }
});


router.post('/', [
    check('approx_donation', 'Date of Birth is Empty').notEmpty(),
    check('approx_donation').custom(validateDonation),
    check('blood_group', 'Blood Group field is empty').notEmpty(),
    // check('division', 'Division field is empty').notEmpty(),
    // check('district', 'District field is empty').notEmpty(),
    // check('upazilla', 'Upazilla field is empty').notEmpty(),
],
    function (req, res) {
        let errors = validationResult(req)

        req.session.temp_user.cp = req.body.cp_name;
        req.session.temp_user.cp_contact = req.body.cp_contact;
        req.session.temp_user.pt_bg = req.body.blood_group;
        req.session.temp_user.patient = req.body.pt_name;
        req.session.temp_user.quantity = req.body.quantity;
        req.session.temp_user.org_details = req.body.orgAddressDetails;
        if (req.body.self_request == 'yes') req.session.temp_user.self_check = req.body.self_request;
        else req.session.temp_user.self_check = 'no';
        req.session.temp_user.org = req.body.org;
        req.session.temp_user.complication = req.body.complication;
        req.session.temp_user.requirements = req.body.requirements;

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

            res.render('newRequest', { user: req.session.temp_user, alert, divisions: req.session.div_results });
        }
        else {
            let donation_date = new Date(req.body.approx_donation);
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


            let posted_on = new Date();
            posted_on.setHours(posted_on.getHours() + 6);

            req.session.temp_user.posted_on = posted_on.toISOString().slice(0, 19).replace('T', ' ');

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
                                    req.session.temp_user.org = insert_id;
                                    db.setNewRequest(req.session.temp_user)
                                        .then(result => {
                                            res.send("Request FEED");
                                        })
                                })

                            })

                    })
            }
            else {
                db.setNewRequest(req.session.temp_user)
                    .then(result => {
                        res.send("Request FEED");
                    })
            }
        }

        // console.log("Hello");
        // console.log(req.body.latitude);
        delete req.session.temp_user;
        delete req.session.div_results;
    });


router.get('/all-org', function (req, res) {
    db.getOrgInfo()
        .then(result => {
            res.json(result);
        })
})
module.exports = router;
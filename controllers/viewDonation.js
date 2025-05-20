var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../models/db_controller');
var mail = require('../models/mail');
var mysql = require('mysql');
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

function mysql2JsDate(str) {
    var g = str;
    return new Date(g.getTime() - (g.getTimezoneOffset() * 60000));
}
function mysql2Local(str) {
    var g = mysql2JsDate(str).toISOString().split(/[- : T]/);
    return g[0] + '-' + g[1] + '-' + g[2];
}

function minDateCalculation(str) {
    str.setFullYear(str.getFullYear() + 18);
    var g = mysql2JsDate(str).toISOString().split(/[- : T]/);
    return g[0] + '-' + g[1] + '-' + g[2];
}

function maxDateCalculation(str) {
    var g = mysql2JsDate(str).toISOString().split(/[- : T]/);
    return g[0] + '-' + g[1] + '-' + g[2];
}

router.get('/:encrypted_id', function (req, res) {
    let { encrypted_id } = req.params;
    let donation_id = cryptr.decrypt(encrypted_id);
    if (req.session.email) {
        let user = {
            type: 'view',
            pt_name: '',
            pt_contact_person: '',
            pt_contact: '',
            donor_id: '',
            donation_date: '',
            org_id: '',
            pt_complication: '',
            is_update_attempted: 'no',
            division: '',
            district: '',
            upazilla: '',
            house: '',
            street: '',
            self_check: '',
            org_location: '',
            lat: '',
            lon: '',
        }

        db.getDivisions()
            .then(result => {
                let div_result = result;
                db.getAllFromDonation(donation_id)
                    .then(result => {
                        user.pt_name = result[0].pt_name;
                        user.pt_contact_person = result[0].pt_contact_person;
                        user.pt_contact = result[0].pt_contact;
                        user.donor_id = result[0].donor_id;
                        user.donation_date = mysql2Local(result[0].donation_date);
                        user.org_id = result[0].org_id;
                        user.pt_complication = result[0].pt_complication;

                        req.session.temp_user = user;
                        req.session.div_results = div_result;
                        db.NotificationUpdateDynamically(req, res)
                            .then(() => {
                                res.render('viewDonation.ejs', { user, divisions: div_result, navbar: req.session.navbar_info, notifications: req.session.notifications });
                            });
                    });
            });
    } else {
        res.render('message.ejs', { alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type: 'verification' });
    }
});

router.post('/:encrypted_id', [], function (req, res) {
    let { encrypted_id } = req.params;
    let donation_id = cryptr.decrypt(encrypted_id);

    let errors = validationResult(req);

    req.session.temp_user.pt_contact_person = req.body.cp_name;
    req.session.temp_user.pt_contact = req.body.cp_contact;
    req.session.temp_user.pt_name = req.body.pt_name;
    req.session.temp_user.quantity = req.body.quantity;
    req.session.temp_user.self_check = req.body.self_request === 'yes' ? 'yes' : 'no';
    req.session.temp_user.org = req.body.org;
    req.session.temp_user.complication = req.body.complication;
    req.session.temp_user.is_update_attempted = 'yes';

    if (req.body.org === '0') {
        req.session.temp_user.org_location = req.body.current_location === 'yes' ? 'yes' : 'no';
        req.session.temp_user.lat = req.body.lat;
        req.session.temp_user.lon = req.body.lon;
        req.session.temp_user.division = req.body.division;
        req.session.temp_user.district = req.body.district;
        req.session.temp_user.upazilla = req.body.upazilla;
    } else {
        req.session.temp_user.division = '';
        req.session.temp_user.district = '';
        req.session.temp_user.upazilla = '';
    }

    req.session.temp_user.house = req.body.organization_name;
    req.session.temp_user.street = req.body.street;

    if (!errors.isEmpty()) {
        const alert = errors.array();
        req.session.temp_user.type = 'error';
        db.NotificationUpdateDynamically(req, res)
            .then(() => {
                res.render('viewDonation', { user: req.session.temp_user, alert, divisions: req.session.div_results, navbar: req.session.navbar_info, notifications: req.session.notifications });
            });
    } else {
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
        };

        var address = {
            division: req.body.division,
            district: req.body.district,
            upazilla: req.body.upazilla
        };

        if (req.body.org === '0') {
            db.getLocationNamesByIds(address)
                .then(result => {
                    var location = `${organization.name}, ${organization.street}, ${result[0].upazilla}, ${result[0].district}, ${result[0].division}`;
                    mapbox.forwardGeocoder(location)
                        .then(result => {
                            if (!organization.latitude || !organization.longitude) {
                                organization.latitude = result.geometry.coordinates[0];
                                organization.longitude = result.geometry.coordinates[1];
                            }

                            db.setOrgInput(organization, function (insert_id) {
                                req.session.temp_user.org = insert_id;
                                db.updateDonation(req.session.temp_user, donation_id)
                                    .then(() => {
                                        res.redirect('/my-profile?tab=donation');
                                    });
                            });
                        });
                });
        } else {
            db.updateDonation(req.session.temp_user, donation_id)
                .then(() => {
                    res.redirect('/my-profile?tab=donation');
                });
        }
    }
});

router.get('/all-org', function (req, res) {
    db.getOrgInfo()
        .then(result => {
            res.json(result);
        });
});

module.exports = router;

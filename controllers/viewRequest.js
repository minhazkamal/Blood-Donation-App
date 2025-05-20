const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const mail = require('../models/mail');
const mapbox = require('../models/mapbox');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECURITY_KEY);
const { body, check, validationResult } = require('express-validator');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

function validateDonation(value) {
    if (!value) throw new Error('Approx Donation Date is empty');

    const today = new Date();
    const temp_donation = new Date(value);

    const todayTime = today.setHours(0, 0, 0, 0);
    const donationTime = temp_donation.setHours(0, 0, 0, 0);

    if (donationTime < todayTime) {
        throw new Error('You can\'t set a previous date');
    }

    return true;
}

function mysql2JsDate(str) {
    return new Date(str.getTime() - str.getTimezoneOffset() * 60000);
}

function mysql2JsLocal(str) {
    const [y, m, d] = mysql2JsDate(str).toISOString().split('T')[0].split('-');
    return `${y}-${m}-${d}`;
}

// GET - Load the view request page
router.get('/:encrypted_id', (req, res) => {
    const { encrypted_id } = req.params;
    const id = cryptr.decrypt(encrypted_id);

    if (!req.session.email) {
        return res.render('message.ejs', {
            alert_type: 'danger',
            message: `Your session has timed out. Please log in again.`,
            type: 'verification'
        });
    }

    db.getDivisions().then(div_result => {
        db.getAllFromRequests(id).then(result => {
            const requestData = result[0];
            const user = {
                type: 'view',
                request_id: requestData.id,
                post_by: requestData.post_by,
                post_by_id: requestData.post_by,
                patient: requestData.patient,
                cp: requestData.contact_person,
                contact: requestData.contact,
                approx_donation: mysql2JsLocal(requestData.approx_donation_date),
                bg: requestData.BG,
                complication: requestData.complication,
                requirements: requestData.requirements,
                quantity: requestData.quantity,
                org_id: requestData.organization_id,
                org_details: requestData.org_address_details,
                posted_on: mysql2JsLocal(requestData.posted_on),
                is_updateable: 'no',
                resolved: requestData.resolved,
                encrypted_requestId: cryptr.encrypt(requestData.id),
                is_update_attempted: 'no'
            };

            req.session.temp_user = user;
            req.session.div_results = div_result;

            db.getuserinfobyid(requestData.post_by).then(userinfo => {
                if (userinfo[0].email === req.session.email && requestData.resolved === 'no') {
                    user.is_updateable = 'yes';
                }

                user.post_by = `${userinfo[0].first_name} ${userinfo[0].last_name}`;

                db.NotificationUpdateDynamically(req, res).then(() => {
                    res.render('viewRequest.ejs', {
                        user,
                        divisions: div_result,
                        navbar: req.session.navbar_info,
                        notifications: req.session.notifications
                    });
                });
            });
        });
    });
});

// POST - Update the request
router.post('/:encrypted_id', [
    check('approx_donation').notEmpty().withMessage('Date of Birth is Empty').bail().custom(validateDonation),
    check('blood_group', 'Blood Group field is empty').notEmpty()
], (req, res) => {
    const { encrypted_id } = req.params;
    const id = cryptr.decrypt(encrypted_id);

    const errors = validationResult(req);
    const sess = req.session;
    const input = req.body;

    sess.temp_user = {
        ...sess.temp_user,
        cp: input.cp_name,
        cp_contact: input.cp_contact,
        pt_bg: input.blood_group,
        patient: input.pt_name,
        quantity: input.quantity,
        org_details: input.orgAddressDetails,
        self_check: input.self_request === 'yes' ? 'yes' : 'no',
        org_id: input.org,
        complication: input.complication,
        requirements: input.requirements,
        is_update_attempted: 'yes',
        house: input.organization_name,
        street: input.street,
        org_location: input.current_location === 'yes' ? 'yes' : 'no',
        lat: input.current_location === 'yes' ? input.lat : '',
        lon: input.current_location === 'yes' ? input.lon : '',
        division: input.org === '0' ? input.division : '',
        district: input.org === '0' ? input.district : '',
        upazilla: input.org === '0' ? input.upazilla : ''
    };

    if (!errors.isEmpty()) {
        return db.NotificationUpdateDynamically(req, res).then(() => {
            res.render('viewRequest', {
                user: sess.temp_user,
                alert: errors.array(),
                divisions: sess.div_results,
                navbar: sess.navbar_info,
                notifications: sess.notifications
            });
        });
    }

    const donation_date = new Date(input.approx_donation);
    const timeTrim = donation_date.getTime() - (donation_date.getTimezoneOffset() * 60000) % (3600 * 1000 * 24);
    sess.temp_user.approx_date = new Date(donation_date - timeTrim);
    sess.temp_user.posted_on = new Date(new Date().setHours(new Date().getHours() + 6))
        .toISOString().slice(0, 19).replace('T', ' ');

    const organization = {
        name: input.organization_name,
        mobile: '',
        street: input.street,
        longitude: input.lon,
        latitude: input.lat,
        division: input.division,
        district: input.district,
        upazilla: input.upazilla
    };

    if (input.org === '0') {
        db.getLocationNamesByIds({
            division: input.division,
            district: input.district,
            upazilla: input.upazilla
        }).then(locResult => {
            const fullLocation = `${organization.name}, ${organization.street}, ${locResult[0].upazilla}, ${locResult[0].district}, ${locResult[0].division}`;
            mapbox.forwardGeocoder(fullLocation).then(coord => {
                if (!organization.latitude || !organization.longitude) {
                    organization.latitude = coord.geometry.coordinates[0];
                    organization.longitude = coord.geometry.coordinates[1];
                }

                db.setOrgInput(organization, insert_id => {
                    sess.temp_user.org = insert_id;
                    db.updateRequestById(sess.temp_user, id).then(() => {
                        res.redirect('/my-profile?tab=request');
                    });
                });
            });
        });
    } else {
        db.updateRequestById(sess.temp_user, id).then(() => {
            res.redirect('/my-profile?tab=request');
        });
    }

    delete sess.temp_user;
    delete sess.div_results;
});

// GET - Return all organization info as JSON
router.get('/all-org', (req, res) => {
    db.getOrgInfo().then(result => res.json(result));
});

module.exports = router;

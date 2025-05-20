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

function mysql2JsDate(str) {
    return new Date(str.getTime() - (str.getTimezoneOffset() * 60000));
}

function formatDateToISO(date) {
    const [year, month, day] = mysql2JsDate(date).toISOString().split('T')[0].split('-');
    return `${year}-${month}-${day}`;
}

router.get('/', async (req, res) => {
    if (!req.session.email) {
        return res.render('message.ejs', {
            alert_type: 'danger',
            message: `Your session has timed out. Please log in again.`,
            type: 'verification'
        });
    }

    const encrypted_req_id = req.query.eri;
    const divisions = await db.getDivisions();
    const userInfo = await db.getUserAllInfo(req.session.email);

    const minDate = formatDateToISO(new Date(userInfo[0].dob.setFullYear(userInfo[0].dob.getFullYear() + 18)));
    const maxDate = formatDateToISO(new Date());
    req.session.eligibility_report = userInfo[0].eligibility_test;

    const userData = {
        donor_id: userInfo[0].id,
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
        type: 'first',
        minDate,
        maxDate
    };

    if (encrypted_req_id) {
        const req_id = cryptr.decrypt(encrypted_req_id);
        const requestInfo = await db.getRequestById(req_id);
        Object.assign(userData, {
            pt_name: requestInfo[0].patient,
            pt_cp: requestInfo[0].contact_person,
            pt_contact: requestInfo[0].contact,
            complication: requestInfo[0].complication,
            org: requestInfo[0].organization_id,
            type: 'error'
        });
    }

    req.session.temp_user = userData;
    req.session.div_results = divisions;

    const navbar = await db.NotificationUpdateDynamically(req, res);
    res.render('addNewDonation.ejs', {
        user: userData,
        divisions,
        minDate,
        maxDate,
        navbar: req.session.navbar_info,
        notifications: req.session.notifications
    });
});

router.post('/', [
    body('donation').custom(async (value, { req }) => {
        const result = await db.direct_query(
            `SELECT COUNT(*) as donate_count
             FROM donation
             WHERE donor_id = (SELECT id FROM users WHERE email = ?)
             AND donation_date BETWEEN DATE_ADD(?, INTERVAL -3 MONTH) AND DATE_ADD(?, INTERVAL 3 MONTH)`,
            [req.session.email, value, value]
        );
        if (result[0].donate_count > 0) {
            throw new Error('You can\'t donate within 3 months of your last donation.');
        }
        return true;
    })
], async (req, res) => {
    const errors = validationResult(req);
    const encrypted_req_id = req.query.eri;
    const request_id = encrypted_req_id ? cryptr.decrypt(encrypted_req_id) : null;
    const user = req.session.temp_user;

    Object.assign(user, {
        pt_cp: req.body.cp_name,
        pt_contact: req.body.cp_contact,
        pt_name: req.body.pt_name,
        quantity: req.body.quantity,
        complication: req.body.complication,
        self_check: req.body.self_request === 'yes' ? 'yes' : 'no',
        org: req.body.org,
        org_location: req.body.current_location === 'yes' ? 'yes' : 'no',
        lat: req.body.lat || '',
        lon: req.body.lon || '',
        division: req.body.division || '',
        district: req.body.district || '',
        upazilla: req.body.upazilla || '',
        house: req.body.organization_name,
        street: req.body.street,
        approx_date: new Date(req.body.donation)
    });

    if (!errors.isEmpty()) {
        const alert = errors.array();
        user.type = 'error';
        await db.NotificationUpdateDynamically(req, res);
        return res.render('addNewDonation', {
            user,
            alert,
            divisions: req.session.div_results,
            navbar: req.session.navbar_info,
            minDate: user.minDate,
            maxDate: user.maxDate,
            notifications: req.session.notifications
        });
    }

    if (req.session.eligibility_report === 'no') {
        const alert = [{ msg: 'You must complete the eligibility test to add your donation.' }];
        user.type = 'error';
        await db.NotificationUpdateDynamically(req, res);
        return res.render('addNewDonation', {
            user,
            alert,
            divisions: req.session.div_results,
            navbar: req.session.navbar_info,
            minDate: user.minDate,
            maxDate: user.maxDate,
            notifications: req.session.notifications
        });
    }

    // Proceed with organization creation if new
    if (user.org === '0') {
        const locationData = await db.getLocationNamesByIds({
            division: user.division,
            district: user.district,
            upazilla: user.upazilla
        });

        const locationString = `${user.house}, ${user.street}, ${locationData[0].upazilla}, ${locationData[0].district}, ${locationData[0].division}`;
        const geo = await mapbox.forwardGeocoder(locationString);

        if (!user.lat || !user.lon) {
            user.lat = geo.geometry.coordinates[0];
            user.lon = geo.geometry.coordinates[1];
        }

        const orgId = await new Promise(resolve => {
            db.setOrgInput({
                name: user.house,
                street: user.street,
                mobile: '',
                division: user.division,
                district: user.district,
                upazilla: user.upazilla,
                latitude: user.lat,
                longitude: user.lon
            }, resolve);
        });

        user.org = orgId;
    }

    await db.setNewDonation(user);
    if (request_id) await db.updateResolveOfRespondToRequest(request_id, req.session.email);

    res.redirect('/my-profile?tab=donation');
});

router.get('/all-org', async (req, res) => {
    const result = await db.getOrgInfo();
    res.json(result);
});

module.exports = router;

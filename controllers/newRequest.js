const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const mapbox = require('../models/mapbox');
const { body, check, validationResult } = require('express-validator');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const validateDonation = (value) => {
    if (!value) throw new Error('Approx Donation Date is empty');

    const donationDate = new Date(value);
    const today = new Date();

    const todayOnly = new Date(today.setHours(0, 0, 0, 0));
    const donationOnly = new Date(donationDate.setHours(0, 0, 0, 0));

    if (donationOnly < todayOnly) throw new Error('You can\'t set a previous date');

    return true;
};

// GET request to render donation form
router.get('/', async (req, res) => {
    if (!req.session.email) {
        return res.render('message.ejs', {
            alert_type: 'danger',
            message: `Your session has timed out. Please log in again.`,
            type: 'verification'
        });
    }

    try {
        const div_result = await db.getDivisions();
        const [userData] = await db.getUserAllInfo(req.session.email);

        const user = {
            type: 'first',
            id: userData.id,
            name: `${userData.first_name} ${userData.last_name}`,
            bg: userData.BG,
            contact: userData.contact,
            cp: `${userData.first_name} ${userData.last_name}`,
            cp_contact: userData.contact,
            pt_bg: userData.BG,
            division: '',
            district: '',
            upazilla: '',
            house: '',
            street: '',
            patient: '',
            quantity: '',
            complication: '',
            org_details: '',
            org: '',
            self_check: '',
            org_location: '',
            lat: '',
            lon: '',
            requirements: '',
            posted_on: ''
        };

        req.session.temp_user = user;
        req.session.div_results = div_result;

        const result = await db.NotificationUpdateDynamically(req, res);
        res.render('newRequest.ejs', {
            user,
            divisions: div_result,
            navbar: req.session.navbar_info,
            notifications: req.session.notifications
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// POST request to handle donation form submission
router.post('/', [
    check('approx_donation').notEmpty().withMessage('Date of Birth is Empty').bail().custom(validateDonation),
    check('blood_group', 'Blood Group field is empty').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    const u = req.session.temp_user;

    u.cp = req.body.cp_name;
    u.cp_contact = req.body.cp_contact;
    u.pt_bg = req.body.blood_group;
    u.patient = req.body.pt_name;
    u.quantity = req.body.quantity;
    u.complication = req.body.complication;
    u.requirements = req.body.requirements;
    u.org_details = req.body.orgAddressDetails;
    u.self_check = req.body.self_request === 'yes' ? 'yes' : 'no';
    u.org = req.body.org;
    u.house = req.body.organization_name;
    u.street = req.body.street;

    if (req.body.org === '0') {
        u.division = req.body.division;
        u.district = req.body.district;
        u.upazilla = req.body.upazilla;
        u.org_location = req.body.current_location === 'yes' ? 'yes' : 'no';
        u.lat = req.body.lat;
        u.lon = req.body.lon;
    } else {
        u.division = '';
        u.district = '';
        u.upazilla = '';
        u.org_location = 'no';
        u.lat = '';
        u.lon = '';
    }

    if (!errors.isEmpty()) {
        const alert = errors.array();
        u.type = 'error';
        await db.NotificationUpdateDynamically(req, res);
        return res.render('newRequest', {
            user: u,
            alert,
            divisions: req.session.div_results,
            navbar: req.session.navbar_info,
            notifications: req.session.notifications
        });
    }

    try {
        const approxDonation = new Date(req.body.approx_donation);
        approxDonation.setHours(0, 0, 0, 0);
        u.approx_date = approxDonation;

        const postedOn = new Date();
        postedOn.setHours(postedOn.getHours() + 6);
        u.posted_on = postedOn.toISOString().slice(0, 19).replace('T', ' ');

        if (req.body.org === '0') {
            const address = {
                division: req.body.division,
                district: req.body.district,
                upazilla: req.body.upazilla
            };

            const locationNames = await db.getLocationNamesByIds(address);
            const locationString = `${req.body.organization_name}, ${req.body.street}, ${locationNames[0].upazilla}, ${locationNames[0].district}, ${locationNames[0].division}`;

            const geo = await mapbox.forwardGeocoder(locationString);

            if (!u.lat || !u.lon) {
                u.lat = geo.geometry.coordinates[1];
                u.lon = geo.geometry.coordinates[0];
            }

            const org = {
                name: req.body.organization_name,
                mobile: '',
                street: req.body.street,
                longitude: u.lon,
                latitude: u.lat,
                division: req.body.division,
                district: req.body.district,
                upazilla: req.body.upazilla
            };

            db.setOrgInput(org, async function (insert_id) {
                u.org = insert_id;
                await db.setNewRequest(u);
                res.redirect('/my-profile?tab=request');
            });
        } else {
            await db.setNewRequest(u);
            res.redirect('/my-profile?tab=request');
        }
    } catch (error) {
        console.error(error.message);
        res.render('message.ejs', {
            alert_type: 'danger',
            message: `Error! Try again later.`,
            type: 'mail'
        });
    }
});

// GET /all-org - for fetching all organization info
router.get('/all-org', async (req, res) => {
    try {
        const result = await db.getOrgInfo();
        res.json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Could not fetch organizations" });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECURITY_KEY);

// Middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Utility Functions
function mysql2JsDate(str) {
    return new Date(str.getTime() - (str.getTimezoneOffset() * 60000));
}

function mysql2JsLocal(str) {
    const [year, month, day] = mysql2JsDate(str).toISOString().split(/[- : T]/);
    return `${day}/${month}/${year}`;
}

function yesORno(val) {
    return val === 'yes' ? 0 : 1;
}

function calculateEligibilityScore(report) {
    let total = 0;
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
    return Math.floor((total * 10) / 14) || 0;
}

function calculateAge(dob) {
    const diff = Date.now() - dob.getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
}

// Route: View User Profile by Encrypted ID
router.get('/:encrypted_id', async (req, res) => {
    if (!req.session.email) {
        return res.render('message.ejs', {
            alert_type: 'danger',
            message: 'Your session has timed out. Please log in again.',
            type: 'verification'
        });
    }

    const { encrypted_id } = req.params;
    const responder = req.query.respond === 'yes' ? 'yes' : 'no';
    const id = cryptr.decrypt(encrypted_id);

    try {
        const [basic] = await db.getuserinfobyid(id);
        const [{ profile_picture }] = await db.getProfilePic(id);
        const [location] = await db.getLocationNamesByIds({
            division: basic.division,
            district: basic.district,
            upazilla: basic.upazilla
        });

        const [{ total_requests = 0 } = {}] = await db.countBloodRequests(basic.email);
        const [eligibilityReport = {}] = await db.getEligibilityReport(basic.email);
        const [{ total_donation = 0 } = {}] = await db.countTotalDonation(basic.email);

        const user = {
            id: encrypted_id,
            fullname: `${basic.first_name} ${basic.last_name}`,
            contact: `+88 ${basic.contact}`,
            email: basic.email,
            dob: mysql2JsLocal(basic.dob),
            bg: basic.BG,
            gender: basic.gender,
            profession: basic.profession,
            address: `${basic.house}, ${basic.street}, ${location.upazilla}, ${location.district}, ${location.division}`,
            age: calculateAge(basic.dob),
            img: `/profile/${profile_picture}`,
            requests_count: total_requests,
            eligibility_score: eligibilityReport ? calculateEligibilityScore([eligibilityReport]) : 0,
            donated: total_donation,
            responder
        };

        await db.NotificationUpdateDynamically(req, res);
        res.render('viewProfile.ejs', {
            user,
            navbar: req.session.navbar_info,
            notifications: req.session.notifications
        });

    } catch (error) {
        console.error(error);
        res.render('message.ejs', {
            alert_type: 'danger',
            message: 'Error fetching profile details. Please try again later.',
            type: 'error'
        });
    }
});

module.exports = router;

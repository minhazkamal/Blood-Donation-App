const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const mail = require('../models/mail');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECURITY_KEY);
const { check, body, validationResult } = require('express-validator');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

function mysql2JsDate(str) {
    return new Date(str.getTime() - str.getTimezoneOffset() * 60000);
}

function mysql2JsLocal(str) {
    const g = mysql2JsDate(str).toISOString().split(/[- : T]/);
    return `${g[2]}/${g[1]}/${g[0]}`;
}

function yesORno(b) {
    return b === 'yes' ? 0 : 1;
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
    return Math.floor((total * 10) / 14);
}

function calculate_age(dob) {
    const diff_ms = Date.now() - dob.getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}

router.get('/', function (req, res) {
    const tab = req.query.tab;

    const user = {
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
        editLink: '/profile-update',
        profession: '',
    };

    if (!req.session.email) {
        return res.render('message.ejs', {
            alert_type: 'danger',
            message: `Your session has timed out. Please log in again.`,
            type: 'verification'
        });
    }

    db.getUserAllInfo(req.session.email)
        .then(result => {
            const myId = result[0].id;
            const myBG = result[0].BG;

            Object.assign(user, {
                fullname: `${result[0].first_name} ${result[0].last_name}`,
                contact: `+88 ${result[0].contact}`,
                email: req.session.email,
                dob: mysql2JsLocal(result[0].dob),
                bg: result[0].BG,
                gender: result[0].gender,
                address: `${result[0].house}, ${result[0].street}, `,
                profession: result[0].profession,
                age: calculate_age(result[0].dob)
            });

            const address = {
                division: result[0].division,
                district: result[0].district,
                upazilla: result[0].upazilla
            };

            db.getProfilePic(myId)
                .then(result1 => {
                    user.img = `/profile/${result1[0].profile_picture}`;
                    db.getLocationNamesByIds(address)
                        .then(result2 => {
                            user.address += `${result2[0].upazilla}, ${result2[0].district}, ${result2[0].division}`;
                            db.countBloodRequests(req.session.email)
                                .then(result3 => {
                                    user.requests_count = result3?.[0]?.total_requests || 0;
                                    db.getEligibilityReport(req.session.email)
                                        .then(result4 => {
                                            user.eligibility_score = result4.length > 0 ? calculateEligibilityScore(result4) : 0;
                                            db.getRequestByPoster(req.session.email)
                                                .then(result5 => {
                                                    const request = result5.map((item, i) => ({
                                                        id: cryptr.encrypt(item.id),
                                                        serialID: i + 1,
                                                        patient: item.patient,
                                                        location: `${item.orgname}, ${item.orgdetails}`,
                                                        date: mysql2JsLocal(item.date),
                                                        bg: item.bg,
                                                        quantity: item.quantity,
                                                        resolved: item.resolved
                                                    }));

                                                    db.countTotalDonation(req.session.email)
                                                        .then(result6 => {
                                                            user.donated = result6?.[0]?.total_donation || 0;
                                                            db.getDonationByDonor(req.session.email)
                                                                .then(result7 => {
                                                                    const donation = result7.map((item, i) => ({
                                                                        donation_id: cryptr.encrypt(item.donation_id),
                                                                        serialID: i + 1,
                                                                        patient: item.patient,
                                                                        location: `${item.orgname}, ${item.orgdetails}`,
                                                                        date: mysql2JsLocal(item.date)
                                                                    }));

                                                                    db.getRequestByResponder(myId)
                                                                        .then(result8 => {
                                                                            const response = result8.map((item, i) => ({
                                                                                request_id: cryptr.encrypt(item.id),
                                                                                serialID: i + 1,
                                                                                patient: item.patient,
                                                                                location: `${item.orgname}, ${item.orgdetails}`,
                                                                                patient_bg: item.bg,
                                                                                requester_bg: item.user_bg,
                                                                                user_bg: myBG
                                                                            }));

                                                                            db.NotificationUpdateDynamically(req, res)
                                                                                .then(() => {
                                                                                    res.render('myProfile.ejs', {
                                                                                        user,
                                                                                        tab,
                                                                                        request,
                                                                                        navbar: req.session.navbar_info,
                                                                                        donation,
                                                                                        response,
                                                                                        notifications: req.session.notifications
                                                                                    });
                                                                                });
                                                                        });
                                                                });
                                                        });
                                                });
                                        });
                                });
                        });
                });
        });
});

module.exports = router;

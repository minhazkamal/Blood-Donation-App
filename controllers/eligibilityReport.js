const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const mail = require('../models/mail');
//const hl = require('handy-log');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECURITY_KEY);

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/:encrypted_id', async (req, res) => {
    if (!req.session.email) {
        return res.render('message.ejs', {
            alert_type: 'danger',
            message: `Your session has timed out. Please log in again.`,
            type: 'verification'
        });
    }

    const { encrypted_id } = req.params;
    let user_id;

    try {
        user_id = cryptr.decrypt(encrypted_id);
    } catch (e) {
        return res.render('message.ejs', {
            alert_type: 'danger',
            message: `Invalid request.`,
            type: 'verification'
        });
    }

    try {
        const userInfo = await db.getuserinfobyid(user_id);
        if (userInfo.length === 0) {
            return res.render('message.ejs', {
                alert_type: 'danger',
                message: `User not found.`,
                type: 'verification'
            });
        }

        const user = userInfo[0];
        const eligibility_parameters = {
            username: user.first_name,
            test: user.eligibility_test,
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
            dob: new Date(user.dob.getTime() - user.dob.getTimezoneOffset() * 60000).toISOString().substring(0, 10),
            last_donation: ''
        };

        if (user.eligibility_test === 'yes') {
            const report = await db.getEligibilityReportById(user_id);
            if (report.length > 0) {
                const r = report[0];
                Object.assign(eligibility_parameters, {
                    asthma: r.asthma,
                    high_bp: r.high_bp,
                    cancer: r.cancer,
                    diabetes: r.diabetes,
                    heart_disease: r.heart_disease,
                    hepatitis: r.hepatitis,
                    anemia: r.anemia,
                    tuberculosis: r.tuberculosis,
                    smoke: r.smoke,
                    drinking: r.drinking,
                    depression: r.depression,
                    last_donation: r.last_donation
                        ? new Date(r.last_donation.getTime() - r.last_donation.getTimezoneOffset() * 60000).toISOString().substring(0, 10)
                        : ''
                });
            }
        }

        req.session.temp_eligibility = eligibility_parameters;

        await db.NotificationUpdateDynamically(req, res);

        res.render('eligibilityReport.ejs', {
            user: eligibility_parameters,
            navbar: req.session.navbar_info,
            notifications: req.session.notifications
        });

    } catch (error) {
        console.error(error);
        res.render('message.ejs', {
            alert_type: 'danger',
            message: `Something went wrong. Please try again later.`,
            type: 'verification'
        });
    }
});

module.exports = router;

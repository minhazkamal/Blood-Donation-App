const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECURITY_KEY);

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

function monthDiff(d1, d2) {
    let months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    months = Math.abs(months);
    return months <= 0 ? 0 : months;
}

// GET /dashboard
router.get('/', async (req, res) => {
    req.session.email= req.session.email || 'minhaz.kamal9900@gmail.com';
    if (!req.session.email) {
        return res.render('message.ejs', {
            alert_type: 'danger',
            message: `Your session has timed out. Please log in again.`,
            type: 'verification'
        });
    }

    try {
        const [userInfo] = await db.getuserid(req.session.email);

        const uid = userInfo.id;
        const user_status = {
            name: userInfo.first_name,
            eligibility: userInfo.eligibility_test,
            active: ''
        };

        const [eligibility] = await db.getEligibilityReport(req.session.email);
        if (eligibility?.last_donation) {
            if (monthDiff(new Date(), eligibility.last_donation) < 3) {
                user_status.eligibility = 'not_eligible';
            }
        }

        const [activeStatus] = await db.getActiveStatusById(uid);
        user_status.active = activeStatus.status;
        req.session.temp_user_status = user_status;

        const [profile] = await db.getNameAndPhoto(req.session.email);
        const navbar_info = {
            name: profile.first_name,
            photo: profile.profile_picture,
            notification_count: ''
        };
        req.session.navbar_info = navbar_info;

        await db.NotificationUpdateDynamically(req, res);
        return res.render('dashboard', {
            user_status,
            navbar: req.session.navbar_info,
            notifications: req.session.notifications
        });
    } catch (error) {
        console.error(error);
        res.render('message.ejs', {
            alert_type: 'danger',
            message: `Something went wrong. Try again later.`,
            type: 'mail'
        });
    }
});

// GET /dashboard/update-active
router.get('/update-active', async (req, res) => {
    const value = req.query.value;
    try {
        const result = await db.updateActiveStatus(req.session.email, value);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Update failed' });
    }
});

module.exports = router;

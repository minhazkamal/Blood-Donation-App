const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECURITY_KEY);
const { body, check, validationResult } = require('express-validator');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', async (req, res) => {
    if (!req.session.email) {
        return res.render('message.ejs', {
            alert_type: 'danger',
            message: `Your session has timed out. Please log in again.`,
            type: 'verification'
        });
    }

    let is_changable = 'yes';
    req.session.is_password_changable = is_changable;

    try {
        const result = await db.direct_query('SELECT provider FROM users WHERE email = ?', [req.session.email]);
        if (result[0].provider !== 'self') {
            is_changable = 'no';
            req.session.is_password_changable = is_changable;
        }

        await db.NotificationUpdateDynamically(req, res);
        res.render('changePassword.ejs', {
            is_changable,
            navbar: req.session.navbar_info,
            notifications: req.session.notifications
        });
    } catch (err) {
        res.render('message.ejs', {
            alert_type: 'danger',
            message: `Something went wrong. Please try again.`,
            type: 'mail'
        });
    }
});

router.post('/', [
    check('password', 'Password field is empty').notEmpty(),
    check('confirm_password', 'Confirm Password field is empty').notEmpty(),
    check('old_password', 'Old Password field is empty').notEmpty(),

    body('confirm_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Confirm Password does not match with Password');
        }
        return true;
    }),

    body('old_password').custom((value, { req }) => {
        return db.oldPassCheckByEmail(value, req.session.email).then(result => {
            if (!result) {
                return Promise.reject("Your old password doesn't match");
            }
        });
    }),

    body('password').custom((value, { req }) => {
        return db.oldPassCheckByEmail(value, req.session.email).then(result => {
            if (result === true) {
                return Promise.reject('Your entered password is violating the rule. Please change it.');
            } else if (result === 'undefined') {
                return Promise.reject('User doesn\'t exist');
            }
        });
    })
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const alert = errors.array();
        await db.NotificationUpdateDynamically(req, res);
        return res.render('changePassword.ejs', {
            alert,
            is_changable: req.session.is_password_changable,
            navbar: req.session.navbar_info,
            notifications: req.session.notifications
        });
    }

    try {
        const result = await db.resetPasswordByEmail(req.body.password, req.session.email);
        if (result.changedRows === 1) {
            res.redirect('/dashboard');
        } else {
            res.render('message.ejs', {
                alert_type: 'danger',
                message: `Error! Try again later`,
                type: 'mail'
            });
        }
    } catch (err) {
        res.render('message.ejs', {
            alert_type: 'danger',
            message: `Unexpected error occurred.`,
            type: 'mail'
        });
    }
});

module.exports = router;

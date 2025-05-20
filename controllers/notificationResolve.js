var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../models/db_controller');
var mail = require('../models/mail');
var mysql = require('mysql');
const { body, check, validationResult } = require('express-validator');
const session = require('express-session');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(process.env.SECURITY_KEY);

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', function (req, res) {
    var encrypted_notification_id = req.query.notificationID;
    var notification_id = cryptr.decrypt(encrypted_notification_id);
    var encrypted_profile_id = req.query.profileOf;
    var profile_id = cryptr.decrypt(encrypted_profile_id);

    if (req.session.email) {
        db.updateResolvedStatusInNotifactionByNotificationID(notification_id)
            .then(() => {
                res.redirect('/view-profile/' + encrypted_profile_id + '?respond=yes');
            });
    } else {
        res.render('message.ejs', {
            alert_type: 'danger',
            message: `Your session has timed out. Please log in again.`,
            type: 'verification'
        });
    }
});

module.exports = router;

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../models/db_controller');
var mail = require('../models/mail');
var mysql = require('mysql');
var hl = require('handy-log');
const { body, check, validationResult } = require('express-validator');
const session = require('express-session');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(process.env.SECURITY_KEY);

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    months = Math.abs(months);
    return months <= 0 ? 0 : months;
}

router.get('/', function (req, res) {
    // req.session.email = 'minhaz.kamal9900@gmail.com';
    if (req.session.email) {
        var navbar_info = {
            name: '',
            photo: '',
            notification_count: '',
        }

        var user_status = {
            eligibility: '',
            active: '',
            name: '',
        }
        db.getuserid(req.session.email)
            .then(result => {
                // console.log(result);
                const uid = result[0].id;
                user_status.name = result[0].first_name;
                user_status.eligibility = result[0].eligibility_test;
                db.getEligibilityReport(req.session.email)
                    .then(result => {
                        if (result.length > 0 && result[0].last_donation != null) {
                            if (monthDiff(new Date(), result[0].last_donation) < 3) user_status.eligibility = 'not_eligible';
                        }
                        db.getActiveStatusById(uid)
                            .then(result => {
                                user_status.active = result[0].status;
                                req.session.temp_user_status = user_status;
                                db.getNameAndPhoto(req.session.email)
                                    .then(result => {
                                        // console.log(result);
                                        navbar_info.name = result[0].first_name;
                                        navbar_info.photo = result[0].profile_picture;
                                        req.session.navbar_info = navbar_info;
                                        db.NotificationUpdateDynamically(req, res)
                                            .then(result => {
                                                res.render('dashboard', { user_status, navbar: req.session.navbar_info, notifications: req.session.notifications });
                                            })
                                        // db.countNotificationByEmail(req.session.email)
                                        //     .then(result => {
                                        //         navbar_info.notification_count = result[0].notification_count;

                                        //         req.session.navbar_info = navbar_info;
                                        //         db.getNotificationByUsersEmail(req.session.email)
                                        //             .then(result => {
                                        //                 // console.log(result);

                                        //                 var notification = [];

                                        //                 for (var i = 0; i < result.length; i++) {
                                        //                     // console.log(i);
                                        //                     var eachnotification = {
                                        //                         profile_of: cryptr.encrypt(result[i].profile_of),
                                        //                         name: result[i].first_name + ' ' + result[i].last_name,
                                        //                         resolved: result[i].resolved,
                                        //                         notification_id: cryptr.encrypt(result[i].notification_id)
                                        //                     }

                                        //                     notification.push(eachnotification);
                                        //                 }
                                        //                 req.session.notifications = notification;
                                        //                 // console.log(req.session.notifications);
                                        //                 res.render('dashboard', { user_status, navbar: req.session.navbar_info, notifications: req.session.notifications });
                                        //             })

                                        //     })

                                    })
                            })
                    })


            })
    }
    else {
        res.render('message.ejs', { alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type: 'verification' });
    }

});

router.get('/update-active', function (req, res) {
    let value = req.query.value;
    // console.log(req.session.email, value);
    db.updateActiveStatus(req.session.email, value)
        .then(result => {
            // console.log(result);
            res.json(result);
        })
})


module.exports = router;
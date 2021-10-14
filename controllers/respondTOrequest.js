var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../models/db_controller');
var mail = require('../models/mail');
var mysql = require('mysql');
var hl = require('handy-log');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(process.env.SECURITY_KEY);

const { body, check, validationResult } = require('express-validator');



router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', function (req, res) {
    let request_id = cryptr.decrypt(req.query.to);
    let responder_id = cryptr.decrypt(req.query.from);

    if (req.session.email) {
        db.newRespondToRequest(request_id, responder_id)
            .then(result => {
                db.getPosterByRequest_ID(request_id)
                    .then(result => {
                        var respond_id = cryptr.encrypt(responder_id);
                        let options = {
                            to: result[0].email,
                            subject: "Response on Your Requests",
                            html: `<span>Hello, <br>Someone has responded to your requests.</span><br><span>To know details about him, please click the link below:</span><br><br><a href='http://localhost:3940/view-profile/${respond_id}?respond=yes'>http://localhost:3940/view-profile/${respond_id}?respond=yes</a><br><br><span>Regards,</span><br><span>G L E A M Team</span>`
                        }
                        mail(options)
                            .then(m => {
                                hl.success(m)
                                //res.json({ mssg: `Hello, ${session.email}!!`, success: true })
                                // res.render('message.ejs', { alert_type: 'success', message: `We have recieved your message. Thanks for being with us.`, type: 'mail' })
                                db.newNotification(result[0].id, responder_id)
                                    .then(result => {
                                        res.redirect('/request-feed');
                                    })
                            })
                            .catch(me => {
                                hl.error(me)
                                res.render('message.ejs', { alert_type: 'danger', message: `Error sending mail!`, type: 'mail' })
                            })

                    })

            })
    }
    else {
        res.render('message.ejs', { alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type: 'verification' });
    }
});


module.exports = router;
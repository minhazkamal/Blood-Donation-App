const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const mail = require('../models/mail');
const { check, validationResult } = require('express-validator');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Contact Us form (GET)
router.get('/', (req, res) => {
    res.render('contactUs.ejs');
});

// Contact Us form (POST)
router.post(
  '/',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Valid email is required').isEmail(),
    check('phone', 'Phone number is required').notEmpty(),
    check('message', 'Message cannot be empty').notEmpty()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('contactUs.ejs', { alert: errors.array() });
    }

    const contactUs = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
      time: new Date()
    };

    db.contactUs(contactUs, function (insert_id) {
      const mailOptions = {
        to: contactUs.email,
        subject: "Received your Message",
        html: `
          <span>Hello, <b>${contactUs.name}</b>,<br>
          We have received your message for the GLEAM App.</span><br>
          <span>Your message is very important to us. We will get back to you shortly.</span><br><br>
          <span>Regards,</span><br>
          <span><b>G L E A M Team</b></span>
        `
      };

      mail(mailOptions)
        .then(() => {
          res.render('message.ejs', {
            alert_type: 'success',
            message: `We have received your message. Thanks for being with us.`,
            type: 'mail'
          });
        })
        .catch(() => {
          res.render('message.ejs', {
            alert_type: 'danger',
            message: `Error sending mail!`,
            type: 'mail'
          });
        });
    });
  }
);

module.exports = router;

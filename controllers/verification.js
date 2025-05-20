const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const mail = require('../models/mail');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECURITY_KEY);

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// 📩 Email Verification Route
router.get('/:encrypted_id', async (req, res) => {
  try {
    const { encrypted_id } = req.params;
    const id = cryptr.decrypt(encrypted_id);

    const result = await db.isEmailVerified([id]);

    if (result[0].email_verified === 'yes') {
      return res.render('message.ejs', {
        alert_type: 'warning',
        message: `Email is already verified`,
        type: 'verification',
      });
    }

    db.verify_email([id], (err, result) => {
      if (err) {
        console.error(err);
        return res.render('message.ejs', {
          alert_type: 'danger',
          message: `Something went wrong. Try again later.`,
          type: 'verification',
        });
      }

      return res.render('message.ejs', {
        alert_type: 'success',
        message: `Your email is verified`,
        type: 'verification',
      });
    });
  } catch (err) {
    console.error(err);
    res.render('message.ejs', {
      alert_type: 'danger',
      message: `Invalid or expired verification link.`,
      type: 'verification',
    });
  }
});

module.exports = router;

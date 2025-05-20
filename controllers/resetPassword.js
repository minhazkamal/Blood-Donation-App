const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const mail = require('../models/mail');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECURITY_KEY);
const { body, check, validationResult } = require('express-validator');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// 🔍 GET - Email Search Form
router.get('/', (req, res) => {
  res.render('emailSearch.ejs');
});

// 📩 POST - Handle Email Submission
router.post(
  '/',
  [
    check('email', 'Email is empty').notEmpty(),
    check('email', 'Email is invalid').isEmail(),
    body('email').custom((value, { req }) => {
      return db
        .direct_query('SELECT COUNT(*) as emailCount FROM users WHERE email = ?', [value])
        .then(result => {
          if (result[0].emailCount === 0) {
            return Promise.reject('E-mail is not in use');
          }
          return db
            .direct_query('SELECT provider FROM users WHERE email = ?', [value])
            .then(([user]) => {
              if (user.provider !== 'self') {
                return Promise.reject('You are not self registered');
              }
            });
        });
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('emailSearch', { alert: errors.array() });
    }

    db.getuserid(req.body.email)
      .then(([user]) => {
        const encrypted_id = cryptr.encrypt(user.id);
        const resetUrl = `http://localhost:${process.env.PORT}/reset-password/confidential/${encrypted_id}`;
        const mailOptions = {
          to: req.body.email,
          subject: 'Reset Password Link of your GLEAM App account',
          html: `
            <span>Hello, <b>${user.first_name}</b><br>You requested a password reset for your <b>GLEAM App</b> account.</span>
            <br><span>Click the button below to reset your password.</span><br><br>
            <a href='${resetUrl}' style='background: #1b9be9; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none;'>Reset Password</a>
            <br><br><strong>Do not share this email with others.</strong>
            <br>If you did not request a reset, please ignore this email.`,
        };

        return mail(mailOptions)
          .then(() => {
            console.log(`Reset password link sent to ${req.body.email}`);
            res.render('message.ejs', {
              alert_type: 'success',
              message: `Password reset link has been sent to your email.`,
              type: 'mail',
            });
          })
          .catch(err => {
            console.error(err);
            res.render('message.ejs', {
              alert_type: 'danger',
              message: `Error sending mail!`,
              type: 'mail',
            });
          });
      })
      .catch(err => {
        console.error(err);
        res.render('message.ejs', {
          alert_type: 'danger',
          message: `Error! Try again later`,
          type: 'mail',
        });
      });
  }
);

// 🔑 GET - Password Reset Form
router.get('/confidential/:encrypted_id', (req, res) => {
  res.render('resetPassword.ejs');
});

// 🔑 POST - Handle Password Reset
router.post(
  '/confidential/:encrypted_id',
  [
    check('password', 'Password field is empty').notEmpty(),
    check('confirm_password', 'Confirm Password field is empty').notEmpty(),
    body('confirm_password').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirm Password does not match with Password');
      }
      return true;
    }),
    body('password').custom((value, { req }) => {
      const id = cryptr.decrypt(req.params.encrypted_id);
      return db.oldPassCheck(value, id).then(result => {
        if (result === true) {
          return Promise.reject('You cannot reuse your old password.');
        } else if (result === 'undefined') {
          return Promise.reject("User doesn't exist");
        }
      });
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('resetPassword', { alert: errors.array() });
    }

    const id = cryptr.decrypt(req.params.encrypted_id);
    db.resetPassword(req.body.password, id)
      .then(result => {
        if (result.changedRows === 1) {
          res.render('message.ejs', {
            alert_type: 'success',
            message: `Your password has been changed successfully`,
            type: 'verification',
          });
        } else {
          res.render('message.ejs', {
            alert_type: 'danger',
            message: `Error! Try again later`,
            type: 'mail',
          });
        }
      })
      .catch(err => {
        console.error(err);
        res.render('message.ejs', {
          alert_type: 'danger',
          message: `Error! Try again later`,
          type: 'mail',
        });
      });
  }
);

module.exports = router;

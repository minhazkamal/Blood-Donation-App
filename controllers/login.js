const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const mail = require('../models/mail');
const { body, check, validationResult } = require('express-validator');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// 🔐 GET /login
router.get('/', (req, res) => {
  if (req.session.loggedin === true) {
    db.getuserid(req.session.email)
      .then(result => db.isEmailVerified(result[0].id))
      .then(result => {
        if (result[0].email_verified === 'yes' && result[0].profile_build === 'yes') {
          return res.redirect('/dashboard');
        } else if (result[0].profile_build === 'no') {
          return res.redirect('/KYC');
        } else {
          return res.render('message.ejs', {
            alert_type: 'danger',
            message: 'Please verify your email',
            type: 'mail',
          });
        }
      })
      .catch(err => {
        console.error(err);
        res.render('message.ejs', {
          alert_type: 'danger',
          message: 'Error! Try again later',
          type: 'mail',
        });
      });
  } else {
    res.render('login.ejs');
  }
});

// 🔐 POST /login
router.post(
  '/',
  [
    check('email', 'Email is empty').notEmpty(),
    check('email', 'Email is invalid').isEmail(),
    check('password', 'Password field is empty').notEmpty(),
    body('email').custom(email => {
      return db
        .direct_query('SELECT COUNT(*) as emailCount FROM users WHERE email = ?', [email])
        .then(result => {
          if (result[0].emailCount === 0) {
            return Promise.reject("E-mail doesn't exist");
          }
        });
    }),
  ],
  (req, res) => {
    const { email, password, remember } = req.body;
    const session = req.session;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('login', { alert: errors.array() });
    }

    const user = { email, password };

    db.credentialCheck(user)
      .then(valid => {
        if (!valid) {
          return res.render('login', { alert: [{ msg: 'Your password is wrong' }] });
        }

        session.email = user.email;
        if (remember === 'true') {
          session.loggedin = true;
          session.cookie.maxAge = 2628000000; // 1 month
        }

        return db.getuserid(user.email)
          .then(result => db.isEmailVerified(result[0].id))
          .then(result => {
            if (result[0].email_verified === 'yes' && result[0].profile_build === 'yes') {
              return res.redirect('/dashboard');
            } else if (result[0].profile_build === 'no') {
              return res.redirect('/KYC');
            } else {
              return res.render('message.ejs', {
                alert_type: 'danger',
                message: 'Please verify your email',
                type: 'mail',
              });
            }
          });
      })
      .catch(err => {
        console.error(err);
        res.render('message.ejs', {
          alert_type: 'danger',
          message: 'Error! Try again later',
          type: 'mail',
        });
      });
  }
);

module.exports = router;

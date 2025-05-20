const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const mail = require('../models/mail');
const passport = require('passport');

require('../models/passport-setup');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Optional: Protect route middleware
const isLoggedIn = (req, res, next) => {
  if (req.user) next();
  else res.sendStatus(401);
};

// 🔐 Step 1: Start Google OAuth Login
router.get('/', passport.authenticate('google-login', { scope: ['profile', 'email'] }));

// 🔐 Step 2: Callback after Google Authentication
router.get(
  '/callback',
  passport.authenticate('google-login', { failureRedirect: '/login-google/failed' }),
  (req, res) => {
    res.redirect('/login-google/good/');
  }
);

// ❌ Login Failed
router.get('/failed', (req, res) => res.send('You failed to log in!'));

// ✅ Login Success
router.get('/good/', async (req, res) => {
  try {
    const user = req.session?.passport?.user;

    if (!user || !user.emails || !user.emails[0]) {
      return res.render('message.ejs', {
        alert_type: 'danger',
        message: `Google login failed. Try again.`,
        type: 'mail',
      });
    }

    const email = user.emails[0].value;
    const result = await db.EmailCheck(email);

    if (result[0].emailCount === 0) {
      return res.render('login', { alert: [{ msg: "Email doesn't exist" }] });
    }

    req.session.email = email;

    const userData = await db.getuserid(email);
    const verification = await db.isEmailVerified(userData[0].id);

    if (verification[0].email_verified === 'yes' && verification[0].profile_build === 'yes') {
      res.redirect('/dashboard'); // ✅ All set
    } else if (verification[0].email_verified === 'yes' && verification[0].profile_build === 'no') {
      res.redirect('/KYC'); // 🔧 Needs profile completion
    } else {
      res.render('message.ejs', {
        alert_type: 'danger',
        message: 'Please verify your email.',
        type: 'mail',
      });
    }
  } catch (err) {
    console.error(err);
    res.render('message.ejs', {
      alert_type: 'danger',
      message: 'An unexpected error occurred. Please try again later.',
      type: 'mail',
    });
  }
});

// 🚪 Logout
router.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
});

module.exports = router;

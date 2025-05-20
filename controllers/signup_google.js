const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const mail = require('../models/mail'); // Still required if sending follow-up emails
//const hl = require('handy-log');
const passport = require('passport');

require('../models/passport-setup');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Optional middleware to protect routes
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};

// 🔐 Step 1: Start Google OAuth flow
router.get('/', passport.authenticate('google-signup', { scope: ['profile', 'email'] }));

// 🔐 Step 2: Callback after Google confirms authentication
router.get(
  '/callback',
  passport.authenticate('google-signup', { failureRedirect: '/signup-google/failed' }),
  function (req, res) {
    res.redirect('/signup-google/good');
  }
);

// ❌ OAuth failed
router.get('/failed', (req, res) => res.send('You Failed to log in!'));

// ✅ OAuth success
router.get('/good', async (req, res) => {
  try {
    const user = req.session?.passport?.user;

    if (!user || !user.emails || !user.emails[0]) {
      return res.render('message.ejs', {
        alert_type: 'danger',
        message: `User information not available from Google.`,
        type: 'verification',
      });
    }

    const email = user.emails[0].value;
    const existing = await db.EmailCheck(email);

    if (existing[0].emailCount === 1) {
      return res.render('signup', { alert: [{ msg: 'Email already exists' }] });
    }

    const newUser = {
      f_name: user.given_name,
      l_name: user.family_name,
      email,
      joined: new Date(),
      provider: 'google',
    };

    db.signup(newUser, function (insert_id, f_name) {
      res.render('message.ejs', {
        alert_type: 'success',
        message: `Your account is verified`,
        type: 'verification',
      });
    });
  } catch (error) {
    hl.error(error);
    res.render('message.ejs', {
      alert_type: 'danger',
      message: `Something went wrong during Google signup.`,
      type: 'verification',
    });
  }
});

// 🚪 Logout route
router.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
});

module.exports = router;

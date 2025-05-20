const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const mail = require('../models/mail'); // Optional if you send confirmation mails
const passport = require('passport');

require('../models/passport-setup');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Optional: Middleware to protect route
const isLoggedIn = (req, res, next) => {
  if (req.user) next();
  else res.sendStatus(401);
};

// 🔐 Start Facebook OAuth
router.get('/', passport.authenticate('facebook-signup', { scope: 'email' }));

// 🔐 Facebook callback
router.get(
  '/callback',
  passport.authenticate('facebook-signup', {
    successRedirect: '/signup-facebook/good',
    failureRedirect: '/signup-facebook/failed',
  })
);

// ❌ Failed login
router.get('/failed', (req, res) => res.send('You failed to log in!'));

// ✅ Successful signup
router.get('/good', async (req, res) => {
  try {
    const user = req.session?.passport?.user;

    if (!user || !user.emails || !user.emails[0]) {
      return res.render('message.ejs', {
        alert_type: 'danger',
        message: `Facebook login failed. Try again.`,
        type: 'verification',
      });
    }

    const email = user.emails[0].value;
    const result = await db.EmailCheck(email);

    if (result[0].emailCount === 1) {
      return res.render('signup', { alert: [{ msg: 'Email already exists' }] });
    }

    const newUser = {
      f_name: user.name.givenName,
      l_name: user.name.familyName,
      email,
      joined: new Date(),
      provider: 'facebook',
    };

    db.signup(newUser, (insert_id, f_name) => {
      res.render('message.ejs', {
        alert_type: 'success',
        message: 'Your account is verified',
        type: 'verification',
      });
    });
  } catch (err) {
    console.error(err);
    res.render('message.ejs', {
      alert_type: 'danger',
      message: 'Something went wrong during Facebook signup.',
      type: 'verification',
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

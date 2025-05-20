const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const mail = require('../models/mail');
const passport = require('passport');

require('../models/passport-setup');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Optional: Middleware for route protection
const isLoggedIn = (req, res, next) => {
  if (req.user) next();
  else res.sendStatus(401);
};

// 🔐 Start Facebook login
router.get('/', passport.authenticate('facebook-login', { scope: 'email' }));

// 🔁 Facebook callback
router.get(
  '/callback',
  passport.authenticate('facebook-login', {
    successRedirect: '/login-facebook/good',
    failureRedirect: '/login-facebook/failed',
  })
);

// ❌ Failed login
router.get('/failed', (req, res) => res.send('You failed to log in!'));

// ✅ Successful login
router.get('/good', async (req, res) => {
  try {
    const user = req.session?.passport?.user;

    if (!user || !user.emails || !user.emails[0]) {
      return res.render('message.ejs', {
        alert_type: 'danger',
        message: `Facebook login failed. Try again.`,
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
      return res.redirect('/dashboard');
    } else if (verification[0].email_verified === 'yes') {
      return res.redirect('/KYC');
    } else {
      return res.render('message.ejs', {
        alert_type: 'danger',
        message: 'Please verify your email',
        type: 'mail',
      });
    }
  } catch (error) {
    console.error(error);
    res.render('message.ejs', {
      alert_type: 'danger',
      message: 'Error! Try again later',
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

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { body, check, validationResult } = require('express-validator');

const db = require('../models/db_controller');
const mail = require('../models/mail');
//const hl = require('handy-log');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECURITY_KEY);

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', (req, res) => {
  res.render('signup.ejs');
});

// 🚀 Sign Up POST Route with Validation
router.post(
  '/',
  [
    check('email', 'Email is empty').notEmpty(),
    check('email', 'Email is invalid').isEmail(),
    check('password', 'Password field is empty').notEmpty(),
    check('confirm_password', 'Confirm Password field is empty').notEmpty(),
    body('confirm_password').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirm Password does not match with Password');
      }
      return true;
    }),
    body('email').custom(email => {
      return db
        .direct_query('SELECT COUNT(*) as emailCount FROM users WHERE email = ?', [email])
        .then(result => {
          if (result[0].emailCount == 1) {
            return Promise.reject('E-mail already in use');
          }
        });
    }),
  ],
  async (req, res) => {
    const { email, password, confirm_password, fname, lname } = req.body;
    const session = req.session;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('signup', { alert: errors.array() });
    }

    const newUser = {
      f_name: fname,
      l_name: lname,
      email,
      password,
      joined: new Date(),
      provider: 'self',
    };

    db.signup(newUser, (insert_id, f_name) => {
      const encryptedId = cryptr.encrypt(insert_id);
      const url = `http://localhost:${process.env.PORT}/activate/${encryptedId}`;

      const options = {
        to: email,
        subject: 'Activate your GLEAM App account',
        html: `
          <span>Hello, <b>${f_name}</b> <br>You received this message because you created an account on GLEAM App.</span><br>
          <span>Click on button below to activate your account and explore.</span><br><br>
          <a href='${url}' style='border: 1px solid #1b9be9; font-weight: 600; color: #fff; border-radius: 3px; cursor: pointer; background: #1b9be9; padding: 4px 15px; text-decoration: none;'>Activate</a>
        `,
      };

      mail(options)
        .then(() => {
          hl.success('Verification mail sent');
          session.id = insert_id;
          session.email = email;
          session.email_verified = 'no';
          res.render('message.ejs', {
            alert_type: 'success',
            message: `A verification mail has been sent to this email: <b>${email}</b>`,
            type: 'mail',
          });
        })
        .catch(err => {
          hl.error(err);
          res.render('message.ejs', {
            alert_type: 'danger',
            message: 'Error sending mail!',
            type: 'mail',
          });
        });
    });
  }
);

module.exports = router;

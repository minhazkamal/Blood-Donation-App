const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const mail = require('../models/mail');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECURITY_KEY);
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { verify } = require('../models/nid_verify');
const { check, body, validationResult } = require('express-validator');

// Middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subdir = file.fieldname === 'front_side' ? 'NID/front' : 'NID/back';
    fs.mkdirSync(subdir, { recursive: true });
    cb(null, subdir);
  },
  filename: (req, file, cb) => {
    db.getuserid(req.session.email)
      .then(result => {
        if (result.length > 0) {
          const encrypted_id = cryptr.encrypt(result[0].id);
          const filename = encrypted_id + path.extname(file.originalname);
          cb(null, filename);
        }
      })
      .catch(err => {
        console.error('User lookup failed:', err);
        cb(new Error('Session error. Try again.'));
      });
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/gif'
    ) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type for ${file.fieldname}. Only images allowed.`));
    }
  }
}).fields([
  { name: 'front_side', maxCount: 1 },
  { name: 'back_side', maxCount: 1 }
]);

// Validator Middleware
const validator = (req, res, next) => {
  try {
    const result = verify({}); // Add params if needed
    if (!result.isValid) {
      return res.render('message.ejs', {
        alert_type: 'danger',
        message: 'NID verification failed.',
        type: 'verification'
      });
    }

    upload(req, res, err => {
      if (err) {
        return res.render('KYC', { alert: [{ msg: err.message }] });
      }

      db.getuserid(req.session.email)
        .then(result => {
          if (!result.length) {
            return res.render('message.ejs', {
              alert_type: 'danger',
              message: 'Session expired. Please log in again.',
              type: 'verification'
            });
          }

          const id = result[0].id;
          const front = req.files?.front_side?.[0]?.filename;
          const back = req.files?.back_side?.[0]?.filename;

          db.getNID(id).then(existing => {
            if (existing.length > 0) {
              const prev = existing[0];
              try {
                if (prev.front) fs.unlinkSync(`./NID/front/${prev.front}`);
                if (prev.back) fs.unlinkSync(`./NID/back/${prev.back}`);
              } catch (unlinkErr) {
                console.warn('Failed to remove old files:', unlinkErr.message);
              }

              db.updateNID(front, back, id).then(result => {
                if (result.affectedRows === 1) return res.redirect('/profile-update');
                else throw new Error();
              });
            } else {
              db.setNID(front, back, id).then(result => {
                if (result.affectedRows === 1) return res.redirect('/profile-update');
                else throw new Error();
              });
            }
          }).catch(dbErr => {
            console.error(dbErr);
            res.render('message.ejs', {
              alert_type: 'danger',
              message: 'Error updating NID. Try again.',
              type: 'mail'
            });
          });
        });
    });
  } catch (err) {
    console.error('Validator error:', err.message);
    res.render('message.ejs', {
      alert_type: 'danger',
      message: 'Unexpected error. Try again.',
      type: 'mail'
    });
  }
};

// GET: KYC Form
router.get('/', (req, res) => {
  res.render('KYC.ejs');
});

// POST: KYC Submission
router.post('/', validator, (req, res) => {});

module.exports = router;

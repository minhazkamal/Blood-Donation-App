var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../models/db_controller');
var mail = require('../models/mail');
var mysql = require('mysql');
var hl = require('handy-log');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(process.env.SECURITY_KEY);
var fs = require('fs');
var path = require('path');
var multer = require('multer');
const { createWorker } = require('tesseract.js');
const tesseract = require('node-tesseract-ocr');
const { verify } = require('../models/nid_verify');

const config = {
  lang: 'eng',
  oem: 1,
  psm: 3
}

const { body, check, validationResult } = require('express-validator');
const { isBuffer } = require('util');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "front_side") {
      var path = 'NID/front';
      fs.mkdirSync(path, { recursive: true })
      return cb(null, path)
      // cb(null, 'NID/front')
    }
    else if (file.fieldname === "back_side") {
      var path = 'NID/back';
      fs.mkdirSync(path, { recursive: true })
      return cb(null, path)
      // cb(null, 'NID/back');
    }
  },
  filename: (req, file, cb) => {
    db.getuserid(req.session.email)
      .then(result => {
        if (result.length > 0) {
          const encrypted_id = cryptr.encrypt(result[0].id);
          //console.log(result[0].id, encrypted_id);
          if (file.fieldname === "front_side") {
            let file_name = encrypted_id + path.extname(file.originalname);
            cb(null, file_name);
          }
          else if (file.fieldname === "back_side") {
            let file_name = encrypted_id + path.extname(file.originalname);
            cb(null, file_name);
          }
        }
      })
      .catch(me => {
        hl.error(me)
        //res.render('message.ejs', {alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type:'verification'});
      })
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: (req, file, cb) => {
    checkFileType(req, file, cb);
  }
}).fields(
  [
    {
      name: 'front_side',
      maxCount: 1
    },
    {
      name: 'back_side', maxCount: 1
    },
  ]
);


function checkFileType(req, file, cb) {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/gif'
  ) { // check file type to be png, jpeg, or jpg
    cb(null, true);
  } else if (file.fieldname === 'front_side') {
    // req.fileValidationError = 'File type of Front Side must be .png/.jpg/.jpeg/.gif';
    cb(new Error("File format of Front side should be PNG,JPG,JPEG"), false);
  }
  else if (file.fieldname === 'back_side') {
    // req.fileValidationError = 'File type of Back Side must be .png/.jpg/.jpeg/.gif';
    cb(new Error("File format of Back side should be PNG,JPG,JPEG"), false); // else fails
  }
  else cb(null, false);
}

const validator = function (req, res, next) {
  // Do some validation and verification here
  try {
    // const result = verify({ nidNumber, fullName, dob });
    const result = {
      isValid: true,
    }
    if (result.isValid) {
      upload(req, res, (err) => {
        if (err) {
          res.render('KYC', { alert: [{ msg: err.message }] });
        }
        else {
          db.getuserid(req.session.email)
            .then(result => {
              let navbar_info = {
                name: result[0].first_name,
                photo: 'avatar.png',
                notification_count: ''
              }
              req.session.navbar_info = navbar_info;
              if (result.length > 0) {
                let id = result[0].id;
                db.getNID(result[0].id)
                  .then(result => {
                    // console.log(req.files.front_side[0].filename);
                    try {
                      if (result.length > 0) {
                        fs.unlink('./NID/front/' + result[0].front, (err) => {
                          if (err) throw err;
                        });
                        fs.unlink('./NID/back/' + result[0].back, (err) => {
                          if (err) throw err;
                        });
                        // console.log("Previous files are deleted.");

                        db.updateNID(req.files.front_side[0].filename, req.files.back_side[0].filename, id)
                          .then(result => {
                            if (result.affectedRows === 1) {
                              res.redirect('/profile-update');
                            }
                            else {
                              res.render('message.ejs', { alert_type: 'danger', message: `Error!Try again later`, type: 'mail' });
                            }
                          })
                      }
                      else {
                        db.setNID(req.files.front_side[0].filename, req.files.back_side[0].filename, id)
                          .then(result => {
                            // console.log(result.affectedRows);
                            if (result.affectedRows === 1) {
                              res.redirect('/profile-update');
                            }
                            else {
                              res.render('message.ejs', { alert_type: 'danger', message: `Error!Try again later`, type: 'mail' });
                            }
                          })
                      }
                    }
                    catch (error) {
                      console.log(error);
                    }
                  })
              }
              else {
                res.render('message.ejs', { alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type: 'verification' });
              }
            })
          // console.log(req.session.email);
          // res.redirect('/profile-update');
        }
      })
    }
  } catch (err) {
    console.error(err.message);
    res.render('message.ejs', { alert_type: 'danger', message: `Error!Try again later`, type: 'mail' });
  }
}

router.get('/', function (req, res) {
  res.render('KYC.ejs');
  // if (req.session.email) {
  //   res.render('KYC.ejs');
  // }
  // else {
  //   res.render('message.ejs', { alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type: 'verification' });
  // }

});


router.post('/', validator, function (req, res) {
});
module.exports = router;
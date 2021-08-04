var express = require('express');
var router = express.Router();
var multer = require('multer');
var bodyParser = require('body-parser');
var db = require('../models/db_controller');
var mail = require('../models/mail');
var mysql = require('mysql');
var hl = require('handy-log');
const { body, check, validationResult } = require('express-validator');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(multer().none());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        var path = '/profile';
        fs.mkdirSync(path, { recursive: true })
        return cb(null, path)

    },
    filename: (req, file, cb) => {
        db.getuserid(req.session.email)
            .then(result => {
                if (result.length > 0) {
                    const encrypted_id = cryptr.encrypt(result[0].id);
                    let file_name = encrypted_id + path.extname(file.originalname);
                    cb(null, file_name);
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
            name: 'update',
            maxCount: 1
        }
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
        upload(req, res, (err) => {
            if (err) {
                res.render('updateProfile', { alert: [{ msg: err.message }] });
            }
            else {
                db.getuserid(req.session.email)
                    .then(result => {
                        if (result.length > 0) {
                            let id = result[0].id;
                            db.getNID(result[0].id) // NID will be photo
                                .then(result => {
                                    // console.log(req.files.front_side[0].filename);
                                    try {
                                        if (result.length > 0) {
                                            fs.unlink('./profile' + result[0].front, (err) => { // front should be changed accordingly
                                                if (err) throw err;
                                            });
                                            // console.log("Previous files are deleted.");

                                            db.updateNID(req.files.front_side[0].filename, req.files.back_side[0].filename, id) // NID will  be photo
                                                .then(result => {
                                                    if (result.affectedRows === 1) {
                                                        res.redirect('/profile-update'); // Dashboard
                                                    }
                                                    else {
                                                        res.render('message.ejs', { alert_type: 'danger', message: `Error!Try again later`, type: 'mail' });
                                                    }
                                                })
                                        }
                                        else 
                                        {
                                            db.setNID(req.files.front_side[0].filename, req.files.back_side[0].filename, id)
                                            .then(result => {
                                                // console.log(result.affectedRows);
                                                if (result.affectedRows === 1) {
                                                    res.redirect('/profile-update'); // Dashboard
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
    } catch (err) {
        console.error(err.message);
        res.render('message.ejs', { alert_type: 'danger', message: `Error!Try again later`, type: 'mail' });
    }
}


router.get('/', function (req, res) {
    if (req.session.email) {
        db.getDivisions()
            .then(result => {
                if (result.length > 0) {
                    let div_result = result;
                    db.getuserid(req.session.email)
                        .then(result => {
                            let user = {
                                f_name: result[0].first_name,
                                l_name: result[0].last_name,
                                email: result[0].email,
                                profile_build: result[0].profile_build,
                                bg: ''
                            }
                            if (result[0].profile_build === 'no') {
                                res.render('updateProfile.ejs', { user, divisions: div_result });
                            }
                            else {
                                db.getProfile(result[0].id)
                                    .then(result => {
                                        user.bg = result[0].blood_group;
                                        res.render('updateProfile.ejs', { user, divisions: div_result });
                                    })
                            }
                        })
                }
            })
    }
    else {
        res.render('message.ejs', { alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type: 'verification' });
    }
});

router.post('/', function (req, res) {
    console.log(req.body);
});

module.exports = router;
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
const { body, check, validationResult } = require('express-validator');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
// router.use(multer().none());

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        var path = 'profile';
        fs.mkdirSync(path, { recursive: true })
        {
            return cb(null, path)
        }
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

let upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: (req, file, cb) => {
        checkFileType(req, file, cb);
    }
}).single('avatar');



function checkFileType(req, file, cb) {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/gif'
    ) { // check file type to be png, jpeg, or jpg
        cb(null, true);
    }
    else cb(new Error("File format of Back side should be PNG,JPG,JPEG"), false);
}

const validator = function (req, res, next) {
    // Do some validation and verification here
    try {
        upload(req, res, err => {
            if (err) {
                res.render('updateProfile', { alert: [{ msg: err.message }] });
            }
            else {
                let FILE;
                if(typeof req.file === 'undefined') FILE = 'avatar.png';
                else FILE = req.file.filename;
                db.getuserid(req.session.email)
                    .then(result => {
                        if (result.length > 0) {
                            let id = result[0].id;
                            db.getProfilePic(result[0].id) // NID will be photo
                                .then(result => {
                                    // console.log(req.files.front_side[0].filename);
                                    try {
                                        // console.log(result);
                                        if (result.length>0) {
                                            if(FILE === 'avatar.png')
                                            {
                                                fs.unlink('./profile/' + result[0].profile_picture, (err) => { 
                                                    if (err) throw err;
                                                });
                                            }
                                            // console.log("Previous files are deleted.");

                                            db.updateProfilePic(FILE, id)
                                                .then(result => {
                                                    if (result.affectedRows === 1) {
                                                        //res.redirect('/profile-update'); // Dashboard
                                                        next();
                                                    }
                                                    else {
                                                        res.render('message.ejs', { alert_type: 'danger', message: `Error!Try again later`, type: 'mail' });
                                                    }
                                                })
                                        }
                                        else 
                                        {
                                            // console.log(req.file);
                                            // console.log(req.files);
                                            db.setProfilePic(FILE, id)
                                            .then(result => {
                                                // console.log(result.affectedRows);
                                                if (result.affectedRows === 1) {
                                                    //res.send('Dashboard'); // Dashboard
                                                    next();
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

const validateDOB = (value, {req}) => {
    // let day = req.body.dob_day;
    // let month = req.body.dob_month;
    // let year = req.body.dob_year;
    const [year, month, day] = value.split('-');

    // console.log(year, month, day);
    // let dob = new Date(year, month-1, day);
    // console.log(dob);
    // console.log(dob.getDate());
    // console.log(dob.getMonth());
    // console.log(new Date());
    // if(dob.getFullYear() == year && dob.getMonth() == month-1 && dob.getDate() == day)
    // {
        // console.log(dob);
        var today = new Date();
        // var birthDate = new Date(dateString);
        var age = today.getFullYear() - year;
        var m = today.getMonth() - month;
        if (m < 0 || (m === 0 && today.getDate() < day)) 
        {
            age--;
        }
        if(age<18)
        {
            throw new Error('Your age must be greater than 18');
        }
        
    // }
    // else
    // {
    //     throw new Error('Date of Birth is not valid');
    // }
    return true;
}


router.get('/', function (req, res) {
    req.session.email = 'minhaz.kamal9900@gmail.com';
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
                            req.session.temp_user = user;
                            req.session.div_results = div_result;
                            // console.log(req.session.temp_user, req.session.div_results);
                            if (result[0].profile_build === 'no') {
                                res.render('updateProfile.ejs', { user, divisions: div_result });
                            }
                            else {
                                db.getProfile(result[0].id)
                                    .then(result => {
                                        user.bg = result[0].BG;
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

router.post('/', validator, [
    check('dob').custom(validateDOB),
    check('blood_group', 'Blood Group field is empty').notEmpty(),
    check('gender', 'Gender field is empty').notEmpty(),
    check('division', 'Division field is empty').notEmpty(),
    check('district', 'District field is empty').notEmpty(),
    check('upazilla', 'Upazilla field is empty').notEmpty(),
],
function (req, res) {
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        //console.log(errors);
        const alert = errors.array();
        res.render('updateProfile', {alert, user: req.session.temp_user, divisions: req.session.div_results});
    }
    else
    {
        // console.log(req.body);
        let temp_dob = new Date(req.body.dob);
        // console.log(temp_dob);
        temp_dob.setTime( temp_dob.getTime() - temp_dob.getTimezoneOffset()*60*1000 );
        // console.log(temp_dob);
        

        db.getuserid(req.session.email)
        .then(result => {
            if(result.length>0)
            {
                req.session.user_id = result[0].id;
                let profile = {
                    id: req.session.user_id,
                    contact: req.body.contact,
                    dob: temp_dob,
                    bg: req.body.blood_group,
                    gender: req.body.gender
                }
        
                let address = {
                    id: req.session.user_id,
                    house: req.body.house,
                    street: req.body.street,
                    division: req.body.division,
                    district: req.body.district,
                    upazilla: req.body.upazilla,
                    zipcode: req.body.zipcode,
                    lat: req.body.lat,
                    lon: req.body.lon
                }

                db.setUserProfile(profile)
                .then(result => {
                    // console.log(result);
                    db.setUserAddress(address)
                    .then(result => {
                        // console.log(result);
                        db.updateUsers(req.session.user_id, req.body.fname, req.body.lname, 'yes', 'yes')
                        .then(result => {

                            res.send("<h1>Eligibility Test</h1><br><span>Under Progress....</span>");
                            // console.log('insertion successfull');
                        })
                    })
                })
                .catch(me => {
                    console.log(me);
                    hl.error(me);
                    
                    res.render('message.ejs', { alert_type: 'danger', message: `Error!Try again later`, type: 'mail' });
                })
            }
        })
        .catch(me => {
            console.log(me);
            hl.error(me);
            
            res.render('message.ejs', { alert_type: 'danger', message: `Error!Try again later`, type: 'mail' });
        })

    }
    
    // console.log("Hello");
    // console.log(req.body.latitude);
    delete req.session.temp_user;
    delete req.session.div_results;
});

module.exports = router;
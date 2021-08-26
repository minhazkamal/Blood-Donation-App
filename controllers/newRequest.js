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
var mapbox = require('../models/mapbox');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
// router.use(multer().none());

const validateDonation = (value, { req }) => {

    // console.log(value);
    if (value != null) {
        const [year, month, day] = value.split('-');

        
        var today = new Date();

        var age = today.getFullYear() - year;
        var m = today.getMonth() - month;
        if (m < 0 || (m === 0 && today.getDate() < day)) {
            age--;
        }
        if (age < 18) {
            throw new Error('Your age must be greater than 18');
        }
    }
    else throw new Error('Date of Birth is empty');

    // }
    // else
    // {
    //     throw new Error('Date of Birth is not valid');
    // }
    return true;
}


router.get('/', function (req, res) {
    // req.session.email = 'minhaz.kamal9900@gmail.com';
    if (req.session.email || true) {
        db.getDivisions()
        .then(result => {
            res.render('newRequest.ejs', {divisions: result});
        })
    }
    else {
        res.render('message.ejs', { alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type: 'verification' });
    }
});


router.post('/', [
    check('dob', 'Date of Birth is Empty').notEmpty(),
    check('dob').custom(validateDonation),
    check('blood_group', 'Blood Group field is empty').notEmpty(),
    check('gender', 'Gender field is empty').notEmpty(),
    check('division', 'Division field is empty').notEmpty(),
    check('district', 'District field is empty').notEmpty(),
    check('upazilla', 'Upazilla field is empty').notEmpty(),
],
    function (req, res) {
        let errors = validationResult(req)

        // if (!errors.isEmpty()) {
        //     //console.log(errors);
        //     const alert = errors.array();
        //     let post_user = {
        //         f_name: req.body.fname,
        //         l_name: req.body.lname,
        //         email: req.body.email,
        //         profile_build: 'error',
        //         bg: req.body.blood_group,
        //         dob: req.body.dob,
        //         gender: req.body.gender,
        //         contact: req.body.contact,
        //         division: req.body.division,
        //         district: req.body.district,
        //         upazilla: req.body.upazilla,
        //         zipcode: req.body.zipcode,
        //         house: req.body.house,
        //         street: req.body.street
        //     }
        //     req.session.temp_user = post_user;
        //     // console.log(req.session.temp_user);
        //     res.render('updateProfile', { alert, user: req.session.temp_user, divisions: req.session.div_results });
        // }
        // else {

        // }
        console.log(req.body);
        // console.log("Hello");
        // console.log(req.body.latitude);
        delete req.session.temp_user;
        delete req.session.div_results;
    });

module.exports = router;
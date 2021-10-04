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

function mysql2JsDate(str) {
    var g = str;
    //console.log(g);
    return new Date(g.getTime() - (g.getTimezoneOffset() * 60000));
}

function mysql2JsLocal(str) {
    var g = mysql2JsDate(str).toISOString().split(/[- : T]/);
    var dob = g[2] +'/'+ g[1] + '/' + g[0];
    return dob;
}

router.get('/', function (req, res) {
    req.session.email = 'minhaz.kamal9900@gmail.com';
    let user = {
        fullname: '',
        contact: '',
        email: '',
        dob: '',
        bg: '',
        gender: '',
        address: '',
        eligibility_score: '',
        responded_requests: '',
        donated: '',
        img: '',
        editLink: ''
    }
    if (req.session.email) {
        db.getUserAllInfo(req.session.email)
        .then(result => {
            user.fullname = result[0].first_name + ' ' + result[0].last_name;
            user.contact = '+88 ' + result[0].contact;
            user.email = req.session.email;
            user.dob = mysql2JsLocal(result[0].dob);
            user.bg = result[0].BG;
            user.gender = result[0].gender;
            user.address = result[0].house + ', ' + result[0].street + ', ';
            user.editLink = '/edit/'+result[0].id;

            let address = {
                division: result[0].division,
                district: result[0].district,
                upazilla: result[0].upazilla
            }

            db.getProfilePic(result[0].id)
            .then(result1 => {
                user.img = `/profile/`+result1[0].profile_picture;
                db.getLocationNamesByIds(address)
                .then(result2 => {
                    user.address += result2[0].upazilla + ', ' + result2[0].district + ', ' + result2[0].division

                    // console.log(user);
                    res.render('myProfile.ejs', {user});
                })
            })
        })
        
    }
    else {
        res.render('message.ejs', { alert_type: 'danger', message: `Your session has timed out. Please log in again.`, type: 'verification' });
    }
});

module.exports = router;
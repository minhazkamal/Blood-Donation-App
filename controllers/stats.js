var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../models/db_controller');
var mail = require('../models/mail');
var box = require('../models/mapbox');
var mysql = require('mysql');
const { body, check, validationResult } = require('express-validator');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', function (req, res) {
    db.getStatsForHome()
        .then(result => {
            res.json(result[0]);
        });
});

module.exports = router;

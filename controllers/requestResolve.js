const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECURITY_KEY);

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Resolve the request using encrypted ID
router.get('/:encrypted_id', (req, res) => {
    const { encrypted_id } = req.params;
    const id = cryptr.decrypt(encrypted_id);

    db.resolveRequestById(id)
        .then(() => {
            res.redirect('/my-profile?tab=request');
        })
        .catch(() => {
            res.render('message.ejs', {
                alert_type: 'danger',
                message: 'Error resolving the request. Please try again later.',
                type: 'mail'
            });
        });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', (req, res) => {
    if (req.session.email) {
        req.session.destroy(err => {
            if (err) {
                return res.render('message.ejs', {
                    alert_type: 'danger',
                    message: 'Error during logout. Please try again.',
                    type: 'error'
                });
            }
            res.redirect('/login');
        });
    } else {
        res.render('message.ejs', {
            alert_type: 'danger',
            message: 'Your session has timed out. Please log in again.',
            type: 'verification'
        });
    }
});

module.exports = router;
 
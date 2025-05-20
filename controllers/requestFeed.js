const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECURITY_KEY);

// Middleware
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Utility Functions
function mysql2JsDate(str) {
  return new Date(str.getTime() - (str.getTimezoneOffset() * 60000));
}

function mysql2JsLocal(str) {
  const [year, month, day] = mysql2JsDate(str).toISOString().split(/[- : T]/);
  return `${day}/${month}/${year}`;
}

function yesORno(val) {
  return val === 'yes' ? 0 : 1;
}

function calculateEligibilityScore(report) {
  let total = 0;
  total += yesORno(report[0].asthma);
  total += yesORno(report[0].high_bp);
  total += yesORno(report[0].cancer);
  total += yesORno(report[0].diabetes);
  total += yesORno(report[0].heart_disease);
  total += yesORno(report[0].hepatitis);
  total += yesORno(report[0].anemia);
  total += yesORno(report[0].tuberculosis);
  total += 2 - parseInt(report[0].smoke);
  total += 2 - parseInt(report[0].drinking);
  total += 2 - parseInt(report[0].depression);
  return Math.floor((total * 10) / 14);
}

// GET: Request Feed Page
router.get('/', function (req, res) {
  if (!req.session.email) {
    return res.render('message.ejs', {
      alert_type: 'danger',
      message: `Your session has timed out. Please log in again.`,
      type: 'verification'
    });
  }

  db.getDivisions()
    .then(divisions => {
      db.NotificationUpdateDynamically(req, res)
        .then(() => {
          res.render('requestFeed.ejs', {
            divisions,
            navbar: req.session.navbar_info,
            notifications: req.session.notifications
          });
        });
    });
});

// GET: Request List (AJAX)
router.get('/list', function (req, res) {
  const { offset, bg, div, dist } = req.query;

  if (!req.session.email) {
    return res.render('message.ejs', {
      alert_type: 'danger',
      message: `Your session has timed out. Please log in again.`,
      type: 'verification'
    });
  }

  db.getuserid(req.session.email)
    .then(user => {
      const myId = user[0].id;

      db.getRequestsByOffset(offset, bg, div, dist, myId)
        .then(results => {
          const requestList = results.map((r, i) => ({
            request_id: cryptr.encrypt(r.id),
            post_by_id: cryptr.encrypt(r.post_by),
            pt_name: r.patient,
            bg: r.BG,
            quantity: r.quantity,
            contact: r.contact,
            place: `${r.orgname}, ${r.orgdetails}`,
            requirement: r.requirement,
            complication: r.complication,
            approx_date: mysql2JsLocal(r.approx_date),
            responder_id: cryptr.encrypt(myId),
            posted_by_name: `${r.first_name} ${r.last_name}`,
            profile_photo: r.photo,
            responder: r.post_by === myId ? 'self' : 'others'
          }));

          res.json(requestList);
        });
    });
});

module.exports = router;

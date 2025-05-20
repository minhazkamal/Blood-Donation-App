const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const mail = require('../models/mail');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// 🧾 GET: Eligibility Form
router.get('/', (req, res) => {
  if (!req.session.email) {
    return res.render('message.ejs', {
      alert_type: 'danger',
      message: `Your session has timed out. Please log in again.`,
      type: 'verification',
    });
  }

  const eligibility = {
    test: '',
    asthma: '',
    high_bp: '',
    cancer: '',
    diabetes: '',
    heart_disease: '',
    hepatitis: '',
    anemia: '',
    tuberculosis: '',
    smoke: '',
    drinking: '',
    depression: '',
    dob: '',
    last_donation: ''
  };

  db.getuserid(req.session.email)
    .then(([user]) => {
      db.getDOB(req.session.email)
        .then(([dobResult]) => {
          const dob = new Date(dobResult.dob);
          dob.setTime(dob.getTime() - dob.getTimezoneOffset() * 60 * 1000);
          eligibility.dob = dob.toISOString().substring(0, 10);

          if (user.eligibility_test === 'yes') {
            db.getEligibilityReport(req.session.email)
              .then(([report]) => {
                eligibility.test = 'yes';
                Object.assign(eligibility, report);

                if (report.last_donation) {
                  const last = new Date(report.last_donation);
                  last.setTime(last.getTime() - last.getTimezoneOffset() * 60 * 1000);
                  eligibility.last_donation = last.toISOString().substring(0, 10);
                }

                req.session.temp_eligibility = eligibility;
                return db.NotificationUpdateDynamically(req, res)
                  .then(() =>
                    res.render('eligibilityTest.ejs', {
                      user: eligibility,
                      navbar: req.session.navbar_info,
                      notifications: req.session.notifications
                    })
                  );
              });
          } else {
            eligibility.test = 'no';
            req.session.temp_eligibility = eligibility;
            db.NotificationUpdateDynamically(req, res)
              .then(() =>
                res.render('eligibilityTest.ejs', {
                  user: eligibility,
                  navbar: req.session.navbar_info,
                  notifications: req.session.notifications
                })
              );
          }
        });
    })
    .catch(err => {
      console.error(err);
      res.render('message.ejs', {
        alert_type: 'danger',
        message: `Error! Try again later.`,
        type: 'verification',
      });
    });
});

// ✅ POST: Save Eligibility Test
router.post('/', (req, res) => {
  if (!req.session.email) {
    return res.render('message.ejs', {
      alert_type: 'danger',
      message: `Your session has timed out. Please log in again.`,
      type: 'verification',
    });
  }

  const elg = {
    id: '',
    asthma: req.body.asthma,
    high_bp: req.body.highbp,
    cancer: req.body.cancer,
    diabetes: req.body.diabetes,
    heart_disease: req.body.HeartDisease,
    hepatitis: req.body.Hepatitis,
    anemia: req.body.anemia,
    tuberculosis: req.body.Tuberculosis,
    smoke: req.body.smoke,
    drinking: req.body.drinking,
    depression: req.body.depression,
    last_donation: req.body.last_donation || null,
  };

  if (elg.last_donation) {
    const raw = new Date(elg.last_donation);
    const offset = raw.getTimezoneOffset() * 60 * 1000;
    elg.last_donation = new Date(raw.getTime() - offset);
  }

  db.getuserid(req.session.email)
    .then(([user]) => {
      elg.id = user.id;
      return db.setEligibilityReport(elg, user.eligibility_test);
    })
    .then(() => db.updateEligibilityStatus(elg.id, 'yes'))
    .then(() => res.redirect('/dashboard'))
    .catch(err => {
      console.error(err);
      res.render('message.ejs', {
        alert_type: 'danger',
        message: `Error! Try again later.`,
        type: 'verification',
      });
    });
});

module.exports = router;

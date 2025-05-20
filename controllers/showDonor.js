const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECURITY_KEY);

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/**
 * GET /user-mapdata/details
 * Returns all active users (except the requester) with location info in GeoJSON format
 */
router.get('/details', async (req, res) => {
  if (!req.session.email) {
    return res.status(401).render('message.ejs', {
      alert_type: 'danger',
      message: `Your session has timed out. Please log in again.`,
      type: 'verification'
    });
  }

  try {
    const [divisions, districts, upazillas, users] = await Promise.all([
      db.getAllDiv(),
      db.getAllDist(),
      db.getAllUpazilla(),
      db.getUserAllInfoExceptMineWhoAreActive(req.session.email)
    ]);

    const geojson = {
      type: 'FeatureCollection',
      features: users.map(user => {
        const divisionName = divisions.find(d => d.id === user.division)?.name || '';
        const districtName = districts.find(d => d.id === user.district)?.name || '';
        const upazillaName = upazillas.find(u => u.id === user.upazilla)?.name || '';

        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [user.lat, user.lon]
          },
          properties: {
            user_id: cryptr.encrypt(user.id),
            contact: user.contact,
            name: `${user.first_name} ${user.last_name}`,
            address: `${user.house}, ${user.street}, ${upazillaName}, ${districtName}, ${divisionName}`,
            bg: user.BG,
            gender: user.gender
          }
        };
      })
    };

    res.json(geojson);
  } catch (error) {
    console.error('Error generating user map data:', error.message);
    res.status(500).json({ error: 'Failed to generate user map data' });
  }
});

/**
 * GET /user-mapdata/owner-details
 * Returns the lat/lon of the current session user
 */
router.get('/owner-details', async (req, res) => {
  if (!req.session.email) {
    return res.status(401).render('message.ejs', {
      alert_type: 'danger',
      message: `Your session has timed out. Please log in again.`,
      type: 'verification'
    });
  }

  try {
    const result = await db.getUserAddress(req.session.email);
    const { lat, lon } = result[0];
    res.json({ lat, lon });
  } catch (error) {
    console.error('Error fetching owner location:', error.message);
    res.status(500).json({ error: 'Failed to fetch user coordinates' });
  }
});

module.exports = router;

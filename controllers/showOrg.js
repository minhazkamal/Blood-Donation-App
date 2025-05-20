const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/**
 * GET /mapdata/details
 * Returns all organization locations in GeoJSON format
 */
router.get('/details', async (req, res) => {
  try {
    const results = await db.getOrgInfo();

    const geojson = {
      type: 'FeatureCollection',
      features: results.map(org => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [org.lat, org.lon]
        },
        properties: {
          contact: org.contact,
          title: org.name,
          address: org.details
        }
      }))
    };

    res.json(geojson);
  } catch (error) {
    console.error('Error fetching organization details:', error.message);
    res.status(500).json({ error: 'Unable to fetch organization details' });
  }
});

/**
 * GET /mapdata/owner-details
 * Returns user's current location coordinates from session
 */
router.get('/owner-details', async (req, res) => {
  try {
    if (!req.session.email) {
      return res.status(401).render('message.ejs', {
        alert_type: 'danger',
        message: `Your session has timed out. Please log in again.`,
        type: 'verification'
      });
    }

    const result = await db.getUserAddress(req.session.email);
    const userAddress = result[0];

    res.json({
      lat: userAddress.lat,
      lon: userAddress.lon
    });
  } catch (error) {
    console.error('Error fetching user location:', error.message);
    res.status(500).json({ error: 'Unable to fetch user location' });
  }
});

module.exports = router;

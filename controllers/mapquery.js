const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const box = require('../models/mapbox');
const { query, validationResult } = require('express-validator');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/**
 * GET /mapbox/forward
 * Hardcoded forward geocoding (used for testing)
 */
router.get('/forward', async (req, res) => {
  try {
    const result = await box.forwardGeocoder('311, West Shewrapara, Mirpur, Dhaka, Dhaka');
    res.json(result);
  } catch (error) {
    console.error('Forward geocode error:', error.message);
    res.status(500).json({ error: 'Forward geocoding failed' });
  }
});

/**
 * GET /mapbox/reverse?latitude=..&longitude=..
 */
router.get(
  '/reverse',
  [
    query('latitude', 'Latitude is required').notEmpty(),
    query('longitude', 'Longitude is required').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { latitude, longitude } = req.query;
    const address = {
      division: null,
      district: null,
      upazilla: null
    };

    try {
      const response = await box.reverseGeocoder(latitude, longitude);

      response.features.forEach(feature => {
        if (feature.id.includes('region')) address.division = feature.text;
        if (feature.id.includes('district')) address.district = feature.text;
        if (feature.id.includes('locality')) address.upazilla = feature.text;
      });

      if (!address.division) return res.json(address);

      const divisionResult = await db.getDivId(address.division);
      address.division = divisionResult[0]?.id || null;

      if (address.district && address.division !== null) {
        const districtResult = await db.getDistId(address.district, address.division);
        address.district = districtResult[0]?.id || null;

        if (address.upazilla && address.district !== null) {
          const upazillaResult = await db.getUpazillaId(address.upazilla, address.district);
          address.upazilla = upazillaResult[0]?.id || null;
        }
      }

      res.json(address);
    } catch (error) {
      console.error('Reverse geocode error:', error.message);
      res.status(500).json({ error: 'Reverse geocoding failed' });
    }
  }
);

module.exports = router;

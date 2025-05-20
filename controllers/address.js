const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../models/db_controller');
const { check, body, validationResult } = require('express-validator');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/**
 * GET districts by division ID
 * Example: /districts?division_id=3
 */
router.get('/districts', async (req, res) => {
  const { division_id } = req.query;

  if (!division_id) return res.status(400).json({ error: 'Missing division_id' });

  try {
    const result = await db.getDistrictsByDiv(division_id);
    res.json(result || []);
  } catch (err) {
    console.error('Error fetching districts:', err);
    res.status(500).json({ error: 'Failed to fetch districts' });
  }
});

/**
 * GET upazillas by district ID
 * Example: /upazillas?district_id=5
 */
router.get('/upazillas', async (req, res) => {
  const { district_id } = req.query;

  if (!district_id) return res.status(400).json({ error: 'Missing district_id' });

  try {
    const result = await db.getUpazillasByDist(district_id);
    res.json(result || []);
  } catch (err) {
    console.error('Error fetching upazillas:', err);
    res.status(500).json({ error: 'Failed to fetch upazillas' });
  }
});

/**
 * GET organization name and address details by ID
 * Example: /get-org-details?id=7
 */
router.get('/get-org-details', async (req, res) => {
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: 'Missing id' });

  try {
    const result = await db.getOrgNameAndDetails(id);
    res.json(result || []);
  } catch (err) {
    console.error('Error fetching organization details:', err);
    res.status(500).json({ error: 'Failed to fetch organization details' });
  }
});

module.exports = router;

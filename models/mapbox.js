require('dotenv').config();

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });

module.exports.forwardGeocoder = async function(location) {
  try {
    const response = await geocodingClient
      .forwardGeocode({
        query: location,
        countries: ['bd'],
        types: ['locality'],
      })
      .send();

    return response.body.features[0];
  } catch (err) {
    console.error('Forward Geocoding Error:', err.message);
  }
};

module.exports.reverseGeocoder = async function(latitude, longitude) {
  try {
    const response = await geocodingClient
      .reverseGeocode({
        query: [Number(longitude), Number(latitude)],
        types: ['locality', 'district', 'region'],
      })
      .send();

    return response.body;
  } catch (err) {
    console.error('Reverse Geocoding Error:', err.message);
  }
};

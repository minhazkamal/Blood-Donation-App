const axios = require('axios');

const verificationEndPoint = 'end_point';
const subscriptionKey = process.env.subscriptionKey;

async function verify({ nidNumber, fullName, dob }) {
  try {
    const { data } = await axios.post(
      verificationEndPoint,
      {}, // Empty body if required
      {
        headers: {
          'Content-Type': 'application/json',
          'Ocp-Apim-Subscription-Key': subscriptionKey
        },
        params: {
          national_id: nidNumber,
          person_dob: dob,
          person_fullname: fullName
        }
      }
    );

    let response = data;

    if (typeof response === 'string') {
      response = JSON.parse(response.replace(/'/g, '"'));
    }

    const isValid = response.passKyc && ['true', 'yes'].includes(String(response.passKyc).toLowerCase());

    return { nid: nidNumber, valid: isValid };
  } catch (error) {
    console.error('NID verification failed:', error.message);
    return { nid: nidNumber, valid: false, error: true };
  }
}

module.exports = { verify };

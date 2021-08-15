require('dotenv').config();
var request = require('request');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_ACCESS_TOKEN });

module.exports.forwardGeocoder = async function(location) {
	try {	
		let response = await geocodingClient
		  .forwardGeocode({
		    query: location,
        countries: ['bd'],
        types: ['locality'],
		  })
		  .send();
    // return new Promise((resolve, reject) => {
    //         err ? reject(err) : resolve(res)
    // })
		// console.log(response.body);
    return response.body.features[0];
    
	} catch(err) {
		console.log(err.message);
	}
}

module.exports.reverseGeocoder = async function(latitude, longitude) {
    try{
        // var url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`;

        // request({
        //     url: url,
        //     josn: true
        // }, function (error, response, body) {
        //     if (!error && response.statusCode === 200) {
        //         console.log(body) // Print the json response
        //     }
        // })
        let response = await geocodingClient
        .reverseGeocode({
            query: [Number(longitude), Number(latitude)],
            types: ['locality', 'district', 'region']
          })
        .send()
        
        return new Promise((resolve, reject) => {
          if(!response) reject(response);
          else resolve(response.body);
        })

    } catch(err) {
        console.log(err);
    }
}
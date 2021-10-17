# G L E A M
## A Blood Donation App
![Status](https://img.shields.io/badge/Status-Pending-orange)
![IDE](https://img.shields.io/badge/IDE-VSCode-blue)
![License](https://img.shields.io/badge/license-MIT-orange.svg)
![UI](https://img.shields.io/badge/UI-EJS-brightgreen)
![Database](https://img.shields.io/badge/Database-MySQL-blue)

In simple words, GLEAM is a blood donation application intended for users who want to find blood in times of need and also help others by donating. Reducing the time to find a precious bag of blood is the main goal. Along with this, the product aims for user convenience and usability. That is why it is implemented as a progressive web application. It facilitates autofill features to reduce time and keeps in touch with the users. The app basically focuses on the people of Bangladesh only.

## Installation

The app is currently hosted in localhost. If we are able to host it on the servers, we will provide the links in sha Allah.

* At first download the code from Github.

* Please create two folders in the project folder named 'profile' and 'NID'. Then open the project folder in your Visual Studio Code and open the terminal from VS Code. Then run the following commands into the terminal:

```
npm install
npm audit fix
```
* Then you have to create the database. Please import the 'database.sql' file from the project folder into your MySQL database.

* Then create a .env file containing the following information:
```
PORT=<YOUR_PORT_NUMBER>
MYSQL_HOST="<YOUR_MYSQL_HOSTNAME>"
MYSQL_USER="<YOUR_MYSQL_USERNAME>"
MYSQL_PASSWORD="<YOUR_MYSQL_PASSWORD>"
MYSQL_DATABASE="<YOUR_MYSQL_DATABASE_NAME>"
MAIL="<YOUR_EMAIL>" // From where the mail will be sent
MAIL_PASSWORD="<YOUR_EMAIL_PASSWORD>" // Password for your provided email ID
SESSION_SECRET_LETTER="<YOUR_SECRET_KEY>"
SECURITY_KEY = "<YOUR_SECURITY_KEY_FOR_ENCRYPTION>"
MAPBOX_ACCESS_TOKEN = '<YOUR_MAPBOX_API_TOKEN>'

// For google authentication you need the following from google console
GOOGLE_CLIENT_ID = <YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET = <YOUR_GOOGLE_CLIENT_SECRET>
CALLBACK_GOOGLE_URL_SIGNUP = http://localhost:3940/signup-google/callback
CALLBACK_GOOGLE_URL_LOGIN = http://localhost:3940/login-google/callback

// For Facebook authentication. You need to create a developer account on Facebook.
FACEBOOK_APP_ID = <YOUR_FACEBOOK_APP_ID>
FACEBOOK_APP_SECRET = <YOUR_FACEBOOK_APP_SECRET>
CALLBACK_FACEBOOK_URL_SIGNUP = http://localhost:3940/signup-facebook/callback
CALLBACK_FACEBOOK_URL_LOGIN = http://localhost:3940/login-facebook/callback
```

** Please remove the '//' lines in your .env file.

** You also need to update the Mapbox Access Token in the following file:

'views/searchDonor.ejs' in line number 427

'views/searchOrg.ejs' in line number 424

* Finally, you can run your server using the following command in the terminal: 
```
npm run dev
```

* Open your web browser and type 
```
localhost:<YOUR_PORT_NUMBER>
```
* Now you will be able to see the features.

## Contributors
[Minhaz Kamal](https://www.linkedin.com/in/minhazkamal/)

[Chowdhury Mohammad Abdullah](https://www.linkedin.com/in/chowdhury-mohammad-abdullah-a48473188/)

[Fairuz Shaiara](https://www.linkedin.com/in/fairuz-shaiara-1195861b1)

## Features
* **Sign Up and log in:** The product facilitates Sign up/ in with google authentication and Facebook authentication. Keeping in mind users might not want to link their emails and social accounts due to privacy concerns, the manual approach is also designed. Here some standards are also maintained for password security (i.e. mandatory combination criteria for the password, minimum length, and encrypted storage of passwords) 
* **KYC:** There is a dummy KYC (Know Your Customer) in the product. In the future, integrating API will make it fully functional. This will increase the integrity of the system.
* **Update profile:** Updating the profile with necessary information. Personal information is somewhat manually provided. For address, the system will fetch GPS data and autofill the respective fields.
* **Eligibility test:** For safety and assessment purposes, an eligibility test is given where information about comorbidities and lifestyles is recorded. Also, it records if any past donation had taken place within a 2 months time frame to warn the donor.
* **Search Donor:** Our registered active donors will be visible in a list. Also, their location will be shown on a map. This gives more situational awareness to our users. The list will be sorted according to the distance of Donors. So in case of need, a user can search for donors here and approach them if needed.
* **Search Organization:** This feature will be open for even unregistered users. It is due to 2 reasons. The first reason is to make the system useful to more groups of people. The second reason is, if someone gets any help from this feature, he/ she might be interested in using the full product. Like search donors, here also a map will be present and a list will be generated based on the distance. 
* **Post a Request for blood:** When a user needs blood, he/ she can post a request for it which will then be shown on a feed. Now from this feed, other users (active and eligible) can respond to a particular request. The author of the request will receive appropriate notification. 
* **Respond:** As mentioned earlier, responding will send a notification containing the contact details of the responder via email.
* **Request feed:** The feed is where the previous two functionalities take place.
* **Keeping track of Donation:** Users can add their responded donations and also donations that took part without responses to their profile.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

Star it if you liked the project. For any kind of feedback reach us through linked in (link added in the contributors part).

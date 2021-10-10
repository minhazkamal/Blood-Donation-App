var express = require ('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require ('../models/db_controller');
var mail = require('../models/mail');
var mysql = require('mysql');
var hl = require('handy-log');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(process.env.SECURITY_KEY);

const { body, check, validationResult } = require('express-validator');



router.use(bodyParser.urlencoded({extended : true}));
router.use(bodyParser.json());

router.get('/', function(req,res){
    res.render('contactUs.ejs');
});


// Sign Up Form Validation
router.post('/', function(req,res){
    
    var contactUs = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        message: req.body.message,
        time: new Date()
    }

      db.contactUs(contactUs, function(insert_id){
        //console.log(insert_id);
        // var encrypted_insert_id = cryptr.encrypt(insert_id);
        // let url = `http://localhost:${process.env.PORT}/activate/${encrypted_insert_id}`
        //console.log(url);
        let options = {
          to: contactUs.email,
          subject: "Recieved your Message",
          html: `<span>Hello, <b>${contactUs.name}</b> <br>We have received your message for GLEAM App.</span><br><span>Your message is very important to us. We will get back to you shortly.</span><br><br><span>Regards,</span><br><span>G L E A M Team</span>`
        }
        mail(options)
          .then(m =>{
            hl.success(m)
            //res.json({ mssg: `Hello, ${session.email}!!`, success: true })
            res.render('message.ejs', {alert_type: 'success', message: `We have recieved your message. Thanks for being with us.`, type:'mail'})
          })
          .catch(me =>{
            hl.error(me)
            res.render('message.ejs', {alert_type: 'danger', message: `Error sending mail!`, type:'mail'})
          })
      });
    }      
);


module.exports = router;
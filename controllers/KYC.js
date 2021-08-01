var express = require ('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require ('../models/db_controller');
var mail = require('../models/mail');
var mysql = require('mysql');
var hl = require('handy-log');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(process.env.SECURITY_KEY);
var fs = require('fs');
var path = require('path');
var multer = require('multer');
const {createWorker} = require('tesseract.js');
const tesseract = require('node-tesseract-ocr');

const config = {
  lang: 'eng',
  oem: 1,
  psm: 3
}

const { body, check, validationResult } = require('express-validator');

router.use(bodyParser.urlencoded({extended : true}));
router.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
      if(file.fieldname==="front_side")
      {
      cb(null, 'NID/front')
      }
     else if(file.fieldname==="back_side")
     {
         cb(null, 'NID/back');
     }
  },
  filename:(req,file,cb)=>{
      if(file.fieldname==="front_side"){
          cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
      }
    else if(file.fieldname==="back_side"){
      cb(null, file.fieldname+Date.now()+path.extname(file.originalname));
    }
  }
});

const upload = multer({
  storage: storage,
  limits: {
      fileSize: 1024 * 1024 * 10
  },
  fileFilter: (req, file, cb) => {
      checkFileType(req, file, cb);
  }
}).fields(
  [
      {
      name:'front_side',
      maxCount:1
      },
      {
      name:'back_side', maxCount:1
      },
  ]
);


function checkFileType(req, file, cb) {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'||
    file.mimetype==='image/gif'
  ) { // check file type to be png, jpeg, or jpg
    cb(null, true);
  } else if(file.fieldname === 'front_side') {
    // req.fileValidationError = 'File type of Front Side must be .png/.jpg/.jpeg/.gif';
    cb(new Error("File format of Front side should be PNG,JPG,JPEG"), false);
  }
  else if(file.fieldname === 'back_side') {
    // req.fileValidationError = 'File type of Back Side must be .png/.jpg/.jpeg/.gif';
    cb(new Error("File format of Back side should be PNG,JPG,JPEG"), false); // else fails
  }
  else cb(null, false);
}

router.get('/', function(req,res){
    res.render('KYC.ejs');
});


router.post('/', function(req,res){
  upload(req, res, (err) => {
    // console.log(req.fileValidationError);
    if (err) {
        //console.log(err.message);
        res.render('KYC', {alert: [{msg: err.message}]});   
    }
    // if (req.fileValidationError) {
    //   res.render('KYC', {alert: [{msg: req.fileValidationError}]});
    // }
    else {
      console.log(req.files);
      const front_image = req.files.front_side[0].path;
      const back_image = req.files.back_side[0].path;

      /* Tesseract implementation 
      tesseract
        .recognize(front_image, config)
        .then((text) => {
          console.log("Result: ", text);
        })
        .catch((error) => {
          console.log(error.message);
        })

      tesseract
        .recognize(back_image, config)
        .then((text) => {
          console.log("Result: ", text);
        })
        .catch((error) => {
          console.log(error.message);
        })
      
      */

        // res.redirect(`http://localhost:${process.env.PORT}/` + front_image);

      // console.log(front_image, back_image);
      console.log("Saved successfully");
    }
  })
  
    // if(req.files){
    //     console.log(res.files)

    //     console.log("files uploaded")
    // }  
});
module.exports = router;
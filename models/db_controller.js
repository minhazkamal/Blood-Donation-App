var mysql =require('mysql');
var express = require('express');
var router = express.Router();
var util = require('util');
var bcrypt = require('bcrypt-nodejs');

// con == db
var db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    charset: "utf8mb4"
});

db.connect(function(err){
    if(err){
        throw err;
        console.log('you are connected');

    }
});
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

module.exports.signup = function(user,callback) {
    bcrypt.hash(user.password, null, null, (error, hash) => {
        user.password = hash
        if(error) throw error;

    var query =  "INSERT INTO `users`(`email`,`password`,`joined`) VALUES (?, ?, ?)";
    db.query(query,[user.email, user.password, user.joined],callback);
    })
}

module.exports.query = (q, data) => {
    return new Promise((resolve, reject) => {
        db.query(q, data, (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.createUser = (user) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(user.password, null, null, (error, hash) => {
            user.password = hash
            db.query('INSERT INTO users SET ?', user, (err, res) => {
                err ? reject(err) : resolve(res)
            })
        })
    })
}

module.exports.comparePassword = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}
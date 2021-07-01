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
            var query =  "INSERT INTO `users`(`first_name`,`last_name`,`email`,`password`,`joined`) VALUES (?, ?, ?, ?, ?)";
            db.query(query,[user.f_name, user.l_name, user.email, user.password, user.joined], function(err, result, fields){
                if(err) throw err;
                else{
                    // console.log(result.insertId);
                    // console.log(user.f_name);
                    callback(result.insertId, user.f_name);
                }
                
            })
}

module.exports.getuserid = function (email){
    var query = "SELECT * from `users` where `email` = ?";
    // db.query(query,[email], (err, res) => {
    //     if(err) throw err;
    //     else{
    //         console.log(res[0].id);
    //         return res[0].id;
    //     }
    // })
    return new Promise((resolve, reject) => {
        db.query(query, [email], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
    //console.log(query);
}
module.exports.direct_query = (q, data) => {
    return new Promise((resolve, reject) => {
        db.query(q, data, (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.comparePassword = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, res) => {
            err ? reject(err) : resolve(res)
        });
    });
}

module.exports.isEmailVerified = function (id) {
    var query = "SELECT * from `users` where `id` = ?";
    return new Promise((resolve, reject) => {
        db.query(query, [id], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
    //console.log(query);
}

module.exports.verify_email = function (id,callback) {
    var query = "UPDATE `users`SET `email_verified`='yes' where `id` = ?";
    db.query(query,[id],callback, (err, res) => {
        err ? reject(err) : resolve (res)
    })
    //console.log(query);
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

module.exports.credentialCheck = function(user){
        var query =  "SELECT `password` from `users` where `email`=?";
        // db.query(query,[user.email], function(err, result, fields){
        //     if(err) throw err;
        //     if(user.password === result[0].password) return true;
        //     else return false; 
        // })
        return new Promise((resolve, reject) => {
            db.query(query, [user.email], (err, res) => {
                err ? reject(err) : resolve(res)
            })
        })
    }
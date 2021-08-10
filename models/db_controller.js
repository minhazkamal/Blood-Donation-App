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

    if(user.provider === "google" || user.provider === "facebook") {
        var query =  "INSERT INTO `users`(`first_name`,`last_name`,`email`,`email_verified`,`joined`,`provider`) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(query,[user.f_name, user.l_name, user.email, 'yes', user.joined, user.provider], function(err, result, fields){
            if(err) throw err;
            else{
                // console.log(result.insertId);
                // console.log(user.f_name);
                callback(result.insertId, user.f_name);
            }
                
        })
    }
    else {
        var query =  "INSERT INTO `users`(`first_name`,`last_name`,`email`,`password`,`joined`,`provider`) VALUES (?, ?, ?, ?, ?, ?)";
        bcrypt.hash(user.password, null, null, (error, hash) => {
            user.password = hash
            db.query(query,[user.f_name, user.l_name, user.email, user.password, user.joined, user.provider], function(err, result, fields){
                if(err) throw err;
                else{
                    //  console.log(result.insertId);
                    //  console.log(user.f_name);
                    callback(result.insertId, user.f_name);
                 }
                
            })
        })
        // db.query(query,[user.f_name, user.l_name, user.email, user.password, user.joined, user.provider], function(err, result, fields){
        //         if(err) throw err;
        //         else{
        //             // console.log(result.insertId);
        //             // console.log(user.f_name);
        //             callback(result.insertId, user.f_name);
        //         }
                
        //     })
    }
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

module.exports.EmailCheck = function (email) {
    var query = "SELECT COUNT(*) as emailCount FROM users WHERE email = ?";
    return new Promise((resolve, reject) => {
        db.query(query, [email], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
    //console.log(query);
}

module.exports.isEmailVerified = function (id) {
    //console.log('isEmailVerified?');
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



module.exports.resetPassword = (password, id) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, null, null, (error, hash) => {
            password = hash
            db.query('UPDATE users SET password = ? WHERE id = ?', [password, id], (err, res) => {
                err ? reject(err) : resolve(res)
            })
        })
    })
}

module.exports.credentialCheck = function(user){
        var query =  "SELECT `password`, `provider` from `users` where `email`=?";
        // db.query(query,[user.email], function(err, result, fields){
        //     if(err) throw err;
        //     if(user.password === result[0].password) return true;
        //     else return false; 
        // })
        return new Promise((resolve, reject) => {
            db.query(query, [user.email], (err, res) => {
                if(err) throw err;
            if(res[0].provider === 'self') {
                bcrypt.compare(user.password, res[0].password, (err, result) => {

                    // console.log(result);
                    err ? reject(err) : resolve(result)
                });
            }
            else{
                err ? reject(err) : resolve(false)
            }
        })
    })
}


module.exports.oldPassCheck = function(password, id){
    var query =  "SELECT `password`, `provider` from `users` where `id`=?";
    // db.query(query,[user.email], function(err, result, fields){
    //     if(err) throw err;
    //     if(user.password === result[0].password) return true;
    //     else return false; 
    // })
    return new Promise((resolve, reject) => {
        db.query(query, [id], (err, res) => {
            if(err) throw err;
        if(res[0].password !== null && res[0].provider === 'self') {
            bcrypt.compare(password, res[0].password, (err, result) => {

                // console.log(result);
                err ? reject(err) : resolve(result)
            });
        }
        else{
            err ? reject(err) : resolve('undefined')
        }
    })
})
}


module.exports.getNID = (id) => {
    return new Promise((resolve, reject) => {
            db.query('SELECT * FROM nid WHERE id = ?', [id], (err, res) => {
                err ? reject(err) : resolve(res)
            })
    })
}

module.exports.setNID = (front, back, id) => {
    return new Promise((resolve, reject) => {
            db.query('INSERT INTO nid VALUES (?, ?, ?)', [id, front, back], (err, res) => {
                err ? reject(err) : resolve(res)
            })
    })
}

module.exports.updateNID = (front, back, id) => {
    return new Promise((resolve, reject) => {
            db.query('UPDATE nid SET front = ?, back = ? WHERE id = ?', [front, back, id], (err, res) => {
                err ? reject(err) : resolve(res)
            })
    })
}

module.exports.getProfilePic = (id) => {
    return new Promise((resolve, reject) => {
            db.query('SELECT * FROM profile_picture WHERE id = ?', [id], (err, res) => {
                err ? reject(err) : resolve(res)
            })
    })
}

module.exports.setProfilePic = (pic, id) => {
    return new Promise((resolve, reject) => {
            db.query('INSERT INTO profile_picture VALUES (?, ?)', [id, pic], (err, res) => {
                err ? reject(err) : resolve(res)
            })
    })
}

module.exports.updateProfilePic = (pic, id) => {
    return new Promise((resolve, reject) => {
            db.query('UPDATE profile_picture SET profile_picture = ? WHERE id = ?', [pic, id], (err, res) => {
                err ? reject(err) : resolve(res)
            })
    })
}

module.exports.getDivisions = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM divisions ORDER BY name ASC', (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getDistrictsByDiv = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM districts WHERE division_id=? ORDER BY name ASC', [id], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getUpazillasByDist = (id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM upazillas WHERE district_id=? ORDER BY case name when 'Others' then 1 else 0 end, name ASC", [id], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.updateUsers = (id, f_name, l_name, nid_verified, profile_build) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE users SET first_name=?, last_name=?, nid_verified=?, profile_build=? WHERE id=?", [f_name, l_name, nid_verified, profile_build, id], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.setUserProfile = (profile) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO user_profile VALUES (?, ?, ?, ?, ?)", [profile.id, profile.contact, profile.dob, profile.bg, profile.gender], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getProfile = (id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM user_profile WHERE id=?", [id], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.setUserAddress = (address) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO user_address VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [address.id, address.house, address.street, address.division, address.district, address.upazilla, address.zipcode, address.lat, address.lon], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getDivId = (name) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * from divisions WHERE name like '%${name}%'`, (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getDistId = (name, id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * from districts WHERE name like '%${name}%' AND division_id=${id}`, (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getUpazillaId = (name, id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * from upazillas WHERE name like '%${name}%' AND district_id=${id}`, (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}
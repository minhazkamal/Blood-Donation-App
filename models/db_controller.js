var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var util = require('util');
var bcrypt = require('bcrypt-nodejs');
const { request } = require('express');
var Cryptr = require('cryptr');
var cryptr = new Cryptr(process.env.SECURITY_KEY);


// con == db
var db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    charset: "utf8mb4"
});

db.connect(function (err) {
    if (err) {
        throw err;
        console.log('you are connected');

    }
});

module.exports.signup = function (user, callback) {

    if (user.provider === "google" || user.provider === "facebook") {
        var query = "INSERT INTO `users`(`first_name`,`last_name`,`email`,`email_verified`,`joined`,`provider`) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(query, [user.f_name, user.l_name, user.email, 'yes', user.joined, user.provider], function (err, result, fields) {
            if (err) throw err;
            else {
                // console.log(result.insertId);
                // console.log(user.f_name);
                callback(result.insertId, user.f_name);
            }

        })
    }
    else {
        var query = "INSERT INTO `users`(`first_name`,`last_name`,`email`,`password`,`joined`,`provider`) VALUES (?, ?, ?, ?, ?, ?)";
        bcrypt.hash(user.password, null, null, (error, hash) => {
            user.password = hash
            db.query(query, [user.f_name, user.l_name, user.email, user.password, user.joined, user.provider], function (err, result, fields) {
                if (err) throw err;
                else {
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

module.exports.contactUs = function (user, callback) {

    var query = "INSERT INTO `contact_us`(`name`,`email`,`phone`,`message`,`time`) VALUES (?, ?, ?, ?, ?)";
    bcrypt.hash(user.password, null, null, (error, hash) => {
        user.password = hash
        db.query(query, [user.name, user.email, user.phone, user.message, user.time], function (err, result, fields) {
            if (err) throw err;
            else {
                //  console.log(result.insertId);
                //  console.log(user.f_name);
                callback(result.insertId);
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

module.exports.getuseridwithEligibilityReport = function (email) {
    var query = "SELECT * from `users` NATURAL JOIN `user_profile` NATURAL JOIN `user_address` NATURAL JOIN `eligibility_report` where `email` = ?";
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

module.exports.getuserid = function (email) {
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

module.exports.getuserinfobyid = function (id) {
    var query = "SELECT * from users NATURAL JOIN user_address NATURAL JOIN user_profile where users.id = ?";
    // db.query(query,[email], (err, res) => {
    //     if(err) throw err;
    //     else{
    //         console.log(res[0].id);
    //         return res[0].id;
    //     }
    // })
    return new Promise((resolve, reject) => {
        db.query(query, [id], (err, res) => {
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

module.exports.verify_email = function (id, callback) {
    var query = "UPDATE `users`SET `email_verified`='yes' where `id` = ?";
    db.query(query, [id], callback, (err, res) => {
        err ? reject(err) : resolve(res)
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

module.exports.resetPasswordByEmail = (password, email) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, null, null, (error, hash) => {
            password = hash
            db.query('UPDATE users SET password = ? WHERE email = ?', [password, email], (err, res) => {
                err ? reject(err) : resolve(res)
            })
        })
    })
}

module.exports.credentialCheck = function (user) {
    var query = "SELECT `password`, `provider` from `users` where `email`=?";
    // db.query(query,[user.email], function(err, result, fields){
    //     if(err) throw err;
    //     if(user.password === result[0].password) return true;
    //     else return false; 
    // })
    return new Promise((resolve, reject) => {
        db.query(query, [user.email], (err, res) => {
            if (err) throw err;
            if (res[0].provider === 'self') {
                bcrypt.compare(user.password, res[0].password, (err, result) => {

                    // console.log(result);
                    err ? reject(err) : resolve(result)
                });
            }
            else {
                err ? reject(err) : resolve(false)
            }
        })
    })
}


module.exports.oldPassCheck = function (password, id) {
    var query = "SELECT `password`, `provider` from `users` where `id`=?";
    // db.query(query,[user.email], function(err, result, fields){
    //     if(err) throw err;
    //     if(user.password === result[0].password) return true;
    //     else return false; 
    // })
    return new Promise((resolve, reject) => {
        db.query(query, [id], (err, res) => {
            if (err) throw err;
            if (res[0].password !== null && res[0].provider === 'self') {
                bcrypt.compare(password, res[0].password, (err, result) => {

                    // console.log(result);
                    err ? reject(err) : resolve(result)
                });
            }
            else {
                err ? reject(err) : resolve('undefined')
            }
        })
    })
}

module.exports.oldPassCheckByEmail = function (password, email) {
    var query = "SELECT `password`, `provider` from `users` WHERE email = ?";
    // db.query(query,[user.email], function(err, result, fields){
    //     if(err) throw err;
    //     if(user.password === result[0].password) return true;
    //     else return false; 
    // })
    return new Promise((resolve, reject) => {
        db.query(query, [email], (err, res) => {
            if (err) throw err;
            if (res[0].password !== null && res[0].provider === 'self') {
                bcrypt.compare(password, res[0].password, (err, result) => {

                    // console.log(result);
                    err ? reject(err) : resolve(result)
                });
            }
            else {
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
        db.query("INSERT INTO user_profile VALUES (?, ?, ?, ?, ?, ?)", [profile.id, profile.contact, profile.dob, profile.bg, profile.gender, profile.profession], (err, res) => {
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

module.exports.updateUserProfile = (profile) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE user_profile SET contact=?, dob=?, BG=?, gender=?, profession=? WHERE id=?", [profile.contact, profile.dob, profile.bg, profile.gender, profile.profession, profile.id], (err, res) => {
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

module.exports.getUserAddress = (email) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM user_address WHERE id = (SELECT id FROM users WHERE email = ?)", [email], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.updateUserAddress = (address) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE user_address SET house=?, street=?, division=?, district=?, upazilla=?, zipcode=?, lon=?, lat=? WHERE id=?", [address.house, address.street, address.division, address.district, address.upazilla, address.zipcode, address.lat, address.lon, address.id], (err, res) => {
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

module.exports.getDivName = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * from divisions WHERE id=${id}`, (err, res) => {
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

module.exports.getDistName = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * from districts WHERE id=${id}`, (err, res) => {
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

module.exports.getUpazillaName = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * from upazillas WHERE id=${id}`, (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.setOrgInput = (org, callback) => {
    let details = org.street;
    db.query(`SELECT * from upazillas WHERE id=${org.upazilla}`, (err, res) => {
        details += ", " + res[0].name;
        // console.log(details);
        db.query(`SELECT * from districts WHERE id=${org.district}`, (err, res) => {
            details += ", " + res[0].name;
            // console.log(details);
            db.query(`SELECT * from divisions WHERE id=${org.division}`, (err, res) => {
                details += ", " + res[0].name;
                // console.log(details);
                db.query("INSERT INTO `organizations`(`name`,`details`,`contact`,`lon`,`lat`, `division`, `district`, `upazilla`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [org.name, details, org.mobile, org.longitude, org.latitude, org.division, org.district, org.upazilla], (err, res) => {
                    if (err) throw err;
                    callback(res.insertId);
                })
            })
        })
    })

}

module.exports.getOrgInfo = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * from organizations ORDER BY name ASC`, (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getUserAllInfo = (email) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * from users NATURAL JOIN user_address NATURAL JOIN user_profile WHERE users.email = ?`, [email], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getUserAllInfoExceptMine = (email) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * from users NATURAL JOIN user_address NATURAL JOIN user_profile WHERE users.email != ?`, [email], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getUserAllInfoExceptMineWhoAreActive = (email) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * from users NATURAL JOIN user_address NATURAL JOIN user_profile NATURAL JOIN active_status WHERE users.email != ? AND active_status.status='yes'`, [email], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getAllDiv = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * from divisions`, (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getAllDist = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * from districts`, (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getAllUpazilla = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * from upazillas`, (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getLocationNamesByIds = (address) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT upazillas.name as upazilla, districts.name as district, divisions.name as division 
                    FROM divisions, districts, upazillas 
                    WHERE divisions.id = ? and districts.id = ? and upazillas.id = ?`, [address.division, address.district, address.upazilla], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.setNewRequest = (request) => {
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO `requests`(`post_by`,`patient`,`contact_person`,`contact`,`approx_donation_date`, `BG`, `complication`, `requirements`, `quantity`, `organization_id`, `org_address_details`, `posted_on`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [request.id, request.patient, request.cp, request.cp_contact, request.approx_date, request.pt_bg, request.complication, request.requirements, request.quantity, request.org, request.org_details, request.posted_on], (err, res) => {
                err ? reject(err) : resolve(res)
            })
    })
}

module.exports.updateRequestById = (request, id) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE `requests` SET `post_by`=?, `patient`=?, `contact_person`=?, `contact`=?, `approx_donation_date`=?, `BG`=?, `complication`=?, `requirements`=?, `quantity`=?, `organization_id`=?, `org_address_details`=?, `posted_on`=? WHERE `id`=?",
            [request.post_by_id, request.patient, request.cp, request.cp_contact, request.approx_date, request.pt_bg, request.complication, request.requirements, request.quantity, request.org_id, request.org_details, request.posted_on, id], (err, res) => {
                err ? reject(err) : resolve(res)
            })
    })
}

module.exports.getOrgNameAndDetails = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT name, details FROM organizations WHERE id=?`, [id], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.insertActiveStatus = (id, status) => {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO active_status VALUES (?, ?)`, [id, status], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getActiveStatusById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT status FROM active_status WHERE id=?`, [id], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.updateActiveStatus = (email, value) => {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE active_status SET status = ? WHERE id = (SELECT id FROM users WHERE email = ?)`, [value, email], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.setEligibilityReport = (elg, flag) => {
    if (flag == 'no') {
        return new Promise((resolve, reject) => {
            db.query(`INSERT INTO eligibility_report VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [elg.id, elg.asthma, elg.high_bp, elg.cancer, elg.diabetes, elg.heart_disease, elg.hepatitis, elg.anemia,
                elg.tuberculosis, elg.smoke, elg.drinking, elg.depression, elg.last_donation], (err, res) => {
                    err ? reject(err) : resolve(res)
                })
        })
    }
    else {
        return new Promise((resolve, reject) => {
            db.query(`UPDATE eligibility_report SET asthma = ?, high_bp = ?, cancer = ?, diabetes = ?, heart_disease = ?, 
            hepatitis = ?, anemia = ?, tuberculosis = ?, smoke = ?, drinking = ?, depression = ?, last_donation = ? WHERE id = ?`,
                [elg.asthma, elg.high_bp, elg.cancer, elg.diabetes, elg.heart_disease, elg.hepatitis, elg.anemia,
                elg.tuberculosis, elg.smoke, elg.drinking, elg.depression, elg.last_donation, elg.id], (err, res) => {
                    err ? reject(err) : resolve(res)
                })
        })
    }

}

module.exports.getEligibilityReport = (email) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM eligibility_report WHERE id = (SELECT id FROM users WHERE email = ?)", [email], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getEligibilityReportById = (id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM eligibility_report WHERE id = ?", [id], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getDOB = (email) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT dob FROM user_profile WHERE id = (SELECT id FROM users WHERE email = ?)", [email], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.updateEligibilityStatus = (id, value) => {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE users SET eligibility_test = ? WHERE id = ?`, [value, id], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.countBloodRequests = (email) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT SUM(quantity) as total_requests FROM requests WHERE post_by = (SELECT id FROM users WHERE email = ?)`, [email], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getRequestByPoster = (email) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT 
        r.id as id,
        r.patient as patient,
        o.name as orgname,
        o.details as orgdetails,
        r.approx_donation_date as date,
        r.BG as bg,
        r.quantity as quantity,
        r.resolved as resolved
        FROM requests r INNER JOIN organizations o ON r.organization_id = o.id WHERE r.post_by = (SELECT id FROM users WHERE email = ?) ORDER BY date DESC`, [email], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getAllFromRequests = (request_id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM requests WHERE id = ?", [request_id], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getAllFromDonation = (donation_id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM donation WHERE id = ?", [donation_id], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.resolveRequestById = (request_id) => {
    return new Promise((resolve, reject) => {
        db.query("UPDATE requests SET resolved='yes' WHERE id = ?", [request_id], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getRequestsByOffset = (offset, bg, div, dist, id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM (SELECT 
        r.id as id,
        r.post_by as post_by,
        r.patient as patient,
        r.contact as contact,
        r.BG as BG,
        r.quantity as quantity,
        o.name as orgname,
        o.details as orgdetails,
        r.approx_donation_date as approx_date,
        r.requirements as requirement,
        r.complication as complication,
        u.first_name as first_name,
        u.last_name as last_name,
        upp.profile_picture as photo
        FROM requests r INNER JOIN organizations o ON r.organization_id = o.id 
        INNER JOIN users u ON r.post_by = u.id
        INNER JOIN profile_picture upp ON r.post_by = upp.id
        WHERE r.id NOT IN (SELECT request_id FROM respond_to_request WHERE responder_id=${id}) AND r.resolved='no' AND (r.BG LIKE '${bg}' AND o.division LIKE '${div}' AND o.district LIKE '${dist}')) as feed_table 
        LIMIT 2 OFFSET ${offset}`, (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getNameAndPhoto = (email) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM users NATURAL JOIN profile_picture WHERE users.id = (SELECT id FROM users WHERE email = ?)", [email], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getRequestById = (req_id) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM requests WHERE id = ?", [req_id], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.setNewDonation = (donation) => {
    // console.log(donation);
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO `donation`(`donor_id`,`pt_name`,`pt_contact`,`pt_contact_person`,`pt_complication`, `donation_date`, `org_id`) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [donation.donor_id, donation.pt_name, donation.pt_contact, donation.pt_cp, donation.complication, donation.approx_date, donation.org], (err, res) => {
                err ? reject(err) : resolve(res)
            })
    })
}

module.exports.checkValidDonationDate = (date, email) => {
    return new Promise((resolve, reject) => {
        db.query("SELECT COUNT(*) as donate_count FROM donation WHERE donor_id = (SELECT id FROM users WHERE email = ?) AND donation_date BETWEEN DATE_ADD(?, INTERVAL -3 MONTH) AND DATE_ADD(?, INTERVAL 3 MONTH)", [email, date, date], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.countTotalDonation = (email) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(*) as total_donation FROM donation WHERE donor_id = (SELECT id FROM users WHERE email = ?)`, [email], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getDonationByDonor = (email) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT 
        d.pt_name as patient,
        o.name as orgname,
        o.details as orgdetails,
        d.donation_date as date,
        d.id as donation_id
        FROM donation d INNER JOIN organizations o ON d.org_id = o.id WHERE d.donor_id = (SELECT id FROM users WHERE email = ?) ORDER BY date DESC`, [email], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.updateDonation = (donation, id) => {
    // console.log(donation);
    return new Promise((resolve, reject) => {
        db.query("UPDATE `donation` SET `pt_name`=?, `pt_contact`=?, `pt_contact_person`=?, `pt_complication`=?, `org_id`=? WHERE id = ?",
            [donation.pt_name, donation.pt_contact, donation.pt_contact_person, donation.complication, donation.org, id], (err, res) => {
                err ? reject(err) : resolve(res)
            })
    })
}

module.exports.newRespondToRequest = (request_id, responder_id) => {
    // console.log(donation);
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO `respond_to_request`(`request_id`,`responder_id`) VALUES (?, ?)",
            [request_id, responder_id], (err, res) => {
                err ? reject(err) : resolve(res)
            })
    })
}

module.exports.getPosterByRequest_ID = (req_id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * from users NATURAL JOIN user_address NATURAL JOIN user_profile WHERE users.id = (SELECT post_by FROM requests WHERE id=?)`, [req_id], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.getRequestByResponder = (responder_id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT 
        r.id as id,
        r.patient as patient,
        o.name as orgname,
        o.details as orgdetails,
        r.approx_donation_date as date,
        r.BG as bg,
        up.BG as user_bg,
        r.quantity as quantity,
        r.resolved as resolved
        FROM requests r INNER JOIN organizations o ON r.organization_id = o.id
        INNER JOIN user_profile up ON r.post_by = up.id WHERE r.id IN (SELECT request_id FROM respond_to_request WHERE responder_id = ? AND resolved='no') ORDER BY date DESC`, [responder_id], (err, res) => {
            err ? reject(err) : resolve(res)
        })
    })
}

module.exports.updateResolveOfRespondToRequest = (request_id, responder_email) => {
    // console.log(donation);
    return new Promise((resolve, reject) => {
        db.query("UPDATE `respond_to_request` SET `resolved`='yes' WHERE request_id = ? AND responder_id=(SELECT id FROM users WHERE email=?)",
            [request_id, responder_email], (err, res) => {
                err ? reject(err) : resolve(res)
            })
    })
}

module.exports.newNotification = (notifications_for, profile_of) => {
    // console.log(donation);
    return new Promise((resolve, reject) => {
        db.query("INSERT INTO `notifications`(`notifications_for`,`profile_of`) VALUES (?, ?)",
            [notifications_for, profile_of], (err, res) => {
                err ? reject(err) : resolve(res)
            })
    })
}

function countNotificationByEmail(email) {
    // console.log(donation);
    return new Promise((resolve, reject) => {
        db.query("SELECT COUNT(*) as notification_count FROM notifications WHERE notifications_for = (SELECT id FROM users WHERE email=?) AND resolved='no'",
            [email], (err, res) => {
                err ? reject(err) : resolve(res)
            })
    })
}

module.exports.countNotificationByEmail;


function getNotificationByUsersEmail(email) {
    // console.log(donation);
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM notifications INNER JOIN users on notifications.profile_of = users.id WHERE notifications_for = (SELECT id FROM users WHERE email=?) ORDER BY resolved ASC",
            [email], (err, res) => {
                err ? reject(err) : resolve(res)
            })
    })
}

module.exports.getNotificationByUsersEmail;

module.exports.updateResolvedStatusInNotifactionByUserInfo = (notifications_for, profile_of) => {
    // console.log(donation);
    return new Promise((resolve, reject) => {
        db.query("UPDATE notifications SET resolved='yes' WHERE notifications_for = ? AND profile_of = ?",
            [notifications_for, profile_of], (err, res) => {
                err ? reject(err) : resolve(res)
            })
    })
}

module.exports.updateResolvedStatusInNotifactionByNotificationID = (notification_id) => {
    // console.log(donation);
    return new Promise((resolve, reject) => {
        db.query("UPDATE notifications SET resolved='yes' WHERE notification_id=?",
            [notification_id], (err, res) => {
                err ? reject(err) : resolve(res)
            })
    })
}

module.exports.NotificationUpdateDynamically = (req, res) => {
    return new Promise((resolve, reject) => {
        countNotificationByEmail(req.session.email)
            .then(result => {
                // console.log(result);
                req.session.navbar_info.notification_count = result[0].notification_count;


                getNotificationByUsersEmail(req.session.email)
                    .then(result => {
                        // console.log(result);

                        var notification = [];

                        for (var i = 0; i < result.length; i++) {
                            // console.log(i);
                            var eachnotification = {
                                profile_of: cryptr.encrypt(result[i].profile_of),
                                name: result[i].first_name + ' ' + result[i].last_name,
                                resolved: result[i].resolved,
                                notification_id: cryptr.encrypt(result[i].notification_id)
                            }

                            notification.push(eachnotification);
                        }
                        req.session.notifications = notification;
                        resolve('yes');
                        // console.log(req.session.notifications);
                        // res.render('dashboard', { user_status, navbar: req.session.navbar_info, notifications: req.session.notifications });
                    })

            })
    })

}
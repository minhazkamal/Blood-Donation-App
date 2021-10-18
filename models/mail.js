const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    host: "localhost",
    service: "gmail",
    auth: {
        user: process.env.MAIL,
        pass: process.env.MAIL_PASSWORD
    }
})

let mail = options => {
    //console.log('Mail!!!');
    return new Promise((resolve, reject) => {
        let o = Object.assign({}, {from: `"GLEAM App" <${process.env.MAIL}>`}, options )
        transporter.sendMail(o, (err, res) => {
            err ? reject(err) : resolve('Mail sent!!')
        })
    })
}

module.exports = mail
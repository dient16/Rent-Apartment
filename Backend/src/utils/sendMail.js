const nodemailer = require('nodemailer');
const to = require('await-to-js').default;

const sendMail = async ({ email, html, subject }) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_NAME, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let [error, info] = await to(
        transporter.sendMail({
            from: '"Rent Apartment" <no-relply@devcommunity.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: html, // html body
        }),
    );
    if (error) {
        throw error;
    }
    return info;
};

module.exports = sendMail;

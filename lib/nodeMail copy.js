'use strict'
require('dotenv').config();

const nodemailer = require("nodemailer");
const { google } = require("googleapis");

module.exports = async function(sendTo,urlToken,subjectUsr,htmBody) {
    
    
    const OAuth2 = google.auth.OAuth2;

    const oauth2Client = new OAuth2(
        process.env.EMAIL_CLIENT_ID, // ClientID
        process.env.EMAIL_CLIENT_SECRET, // Client Secret
        process.env.EMAIL_REDIRECT_URL // Redirect URL
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.EMAIL_REFRESH_TOKEN
    });
    const accessToken = oauth2Client.getAccessToken()


    const smtpTransport = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            type: process.env.EMAIL_AUTH_TYPE,
            user: process.env.EMAIL_USER, 
            clientId: process.env.EMAIL_CLIENT_ID,
            clientSecret: process.env.EMAIL_CLIENT_SECRET,
            refreshToken: process.env.EMAIL_REFRESH_TOKEN,
            accessToken: accessToken,
            tls: {
                rejectUnauthorized: false
            }
        }
    });

    // 
    const mailOptions = {
        from: process.env.EMAI_FROM,
        to: sendTo,
        subject: `Node.js Email with Secure OAuth  ${subjectUsr}` ,
        generateTextFromHTML: true,
        html: htmBody
    };

    smtpTransport.sendMail(mailOptions, (error, response) => {
       // error ? console.log(error) : console.log(response); 
        
        smtpTransport.close();
    });
};
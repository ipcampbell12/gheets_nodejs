const axios = require('axios');
const { generateConfig } = require('./utilities');
const nodemailer = require('nodemailer');
const MailComposer = require('nodemailer/lib/mail-composer');
const CONSTANTS = require('./constants');
const { google } = require('googleapis');
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, REFRESH_TOKEN } = require('../helper_functions/config')

require("dotenv").config();

const OAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

OAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(subject, message) {
    try {
        const accessToken = await OAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                ...CONSTANTS.auth,
                accessToken: accessToken
            },
        });



        const mailOptions = {
            from: "Ian, <ipcampbell12@gmail.com>",
            to: "ipropstcampb07@georgefox.edu",
            subject: subject,
            text: message
        };

        console.log(mailOptions)

        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (err) {
        console.log(err.message);

    };
};


module.exports = {
    sendMail: sendMail
}
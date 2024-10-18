const nodemailer = require("nodemailer");
const speakeasy = require('speakeasy');

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
        user: "yourcollabhub@gmail.com",
        pass: "obho yhlk qugc gibl",
    },
});


async function sendOTP(receiverEmail) {
    try {
        const secret = speakeasy.generateSecret({ length: 20 });
        const code = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32',
            step: 600 
        });

        const info = await transporter.sendMail({
            from: `CollabHub <yourcollabhub@gmail.com>`, 
            to: receiverEmail,
            subject: "Your CollabHub OTP Verification Code", 
            text: `Hello,\n\nYour OTP for CollabHub verification is: ${code}. This OTP is valid for 10 minutes. If you did not request this, please ignore this email.\n\nThank you!`, 
            html: `
                <p>Hello,</p>
                <p>Your OTP for <strong>CollabHub</strong> verification is: <strong>${code}</strong>. This OTP is valid for <strong>10 minutes</strong>.</p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Thank you!</p>
            `, 
        });

        console.log("OTP sent successfully to:", receiverEmail);
        return { code }; 
    } catch (error) {
        console.error("Error sending OTP:", error);
        throw error; 
    }
}

module.exports = { sendOTP };

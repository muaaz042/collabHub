const nodemailer = require("nodemailer");
const speakeasy = require('speakeasy');


// Configure the transporter with environment variables for security
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "yourcollabhub@gmail.com",
        pass: "obho yhlk qugc gibl",
    },
});

// Function to send OTP verification email
async function sendOTP(receiverEmail) {
    try {
        // Generate a secret key with a length of 20 characters
        const secret = speakeasy.generateSecret({ length: 20 });
        
        // Generate a TOTP code using the secret key
        const code = speakeasy.totp({
            secret: secret.base32,
            encoding: 'base32',
            step: 600 // OTP is valid for 600 seconds (10 minutes)
        });

        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: `CollabHub <yourcollabhub@gmail.com>`, // sender address
            to: receiverEmail, // recipient email
            subject: "Your CollabHub OTP Verification Code", // Subject line
            text: `Hello,\n\nYour OTP for CollabHub verification is: ${code}. This OTP is valid for 10 minutes. If you did not request this, please ignore this email.\n\nThank you!`, // plain text body
            html: `
                <p>Hello,</p>
                <p>Your OTP for <strong>CollabHub</strong> verification is: <strong>${code}</strong>. This OTP is valid for <strong>10 minutes</strong>.</p>
                <p>If you did not request this, please ignore this email.</p>
                <p>Thank you!</p>
            `, // HTML body
        });

        console.log("OTP sent successfully to:", receiverEmail); // Log the successful send
        return { code }; // Return the OTP code and secret for further verification
    } catch (error) {
        console.error("Error sending OTP:", error); // Log the error
        throw error; // Re-throw the error to be caught by the caller
    }
}

module.exports = { sendOTP };

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const userModel = require("../models/userModel")
const jwt = require('jsonwebtoken');

const crypto = require('crypto');
const nodemailer = require('nodemailer');

const { google } = require('googleapis');

require('dotenv').config();


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const MY_EMAIL = process.env.MY_EMAIL;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'USER', // Default role
            },
        });

        res.status(201).json({ message: 'User created successfully!', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Server error ${error}` });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate JWT

        const secret = process.env.JWT_SECRET;
        const token = jwt.sign({ userId: user.id, role: user.role }, secret, { expiresIn: '1h' });

        res.status(200).json({ message: 'Logged in successfully', token });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: `Server error ${err}` });
    }

}


// Step 1: Generate a Password Reset Token
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create a unique reset token (could also be stored in the DB if you prefer)
        const token = crypto.randomBytes(20).toString('hex');

        // Save the token in the user's record (optional but recommended)
        await prisma.user.update({
            where: { email },
            data: { resetToken: token, resetTokenExpiry: new Date(Date.now() + 3600000) }, // Token valid for 1 hour
        });

        // Send email with the reset link
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: MY_EMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        const mailOptions = {
            from: MY_EMAIL,
            to: email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password: http://localhost:3000/reset-password/${token}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending email' });
            }
            console.log(`Email sent: ${info.response}`);
            return res.status(200).json({ message: 'Check your email for instructions on resetting your password' });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: `Server error: ${err}` });
    }
};

// Step 2: Handle Password Reset Request
const resetPassword = async (req, res) => {
    const { token } = req.params;

    try {
        // Find the user with the reset token and check for expiry
        const user = await prisma.user.findFirst({
            where: { resetToken: token },
        });

        if (!user || user.resetTokenExpiry < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        // If valid, return a response to allow password input
        res.status(200).json({ message: 'Token is valid, please provide a new password' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: `Server error: ${err}` });
    }
};

// Step 3: Update User Password
const resetPasswordpost = async (req, res) => {
    const { token, password } = req.body;

    try {
        const user = await prisma.user.findFirst({
            where: { resetToken: token },
        });

        if (!user || user.resetTokenExpiry < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user's password and clear the reset token
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,         // Clear the reset token
                resetTokenExpiry: null,   // Clear the expiry
            },
        });

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: `Server error: ${err}` });
    }
};




const registerseller = async (req, res) => {
    const { password } = req.body;
    const userId = req.user?.id;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: 'SELLER' },
        });


        const secret = process.env.JWT_SECRET;
        const token = jwt.sign({ userId: updatedUser.id, role: updatedUser.role }, secret, { expiresIn: '1h' });

        res.status(200).json({ message: 'Successfully registered as seller', user: updatedUser, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};







module.exports = { signup, login, registerseller, forgotPassword, resetPassword, resetPasswordpost }; 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const {
            name,
            email,
            birthday,
            password
        } = req.body;

        // Validate input
        if (!name || !email || !birthday || !password) {
            return res.status(400).json({ msg: "All fields except Profile Picture URL are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User with this email already exists." });
        }

        // Hash the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // Generate OTP and expiration
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Get the picture path from the file uploaded
        const userPicturePath = req.file ? req.file.filename : null;

        // Create new user
        const newUser = new User({
            name,
            email,
            birthday,
            password: passwordHash,
            userPicturePath,
            voucher: 10, // Default voucher value
            admin: false, // Default admin value
            status: "pendingOTP", // Default status
            otp,
            otpExpiresAt,
        });

        const savedUser = await newUser.save();

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const verifyUrl = `${process.env.FRONTEND_URL}/verify-otp?userId=${savedUser._id}&otp=${otp}`;

        // Send OTP email
        await transporter.sendMail({
            from: '"Your App" <no-reply@yourapp.com>',
            to: email,
            subject: "Verify your account",
            text: `Your OTP is ${otp}. Link: ${verifyUrl}`,
            html: `<p>Your OTP is <b>${otp}</b>. Click <a href="${verifyUrl}">here</a> to verify.</p>`,
        });

        res.status(201).json(savedUser);
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: error.message });
    }
}


/*Register Admin*/
export const registerAdmin = async (req, res) => {
 try {
        const {
            name,
            email,
            birthday,
            password,
            userPicturePath,
        } = req.body;

        // Validate input
        if (!name || !email || !birthday || !password) {
            return res.status(400).json({ msg: "All fields except Profile Picture URL are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User with this email already exists." });
        }

        // Hash the password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        // Generate OTP and expiration
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
        const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Create new user
        const newUser = new User({
            name,
            email,
            birthday,
            password: passwordHash,
            userPicturePath,
            voucher: 0, 
            admin: true, // is admin value
            status: "pendingOTP", // Default status
            otp,
            otpExpiresAt,
        });

        const savedUser = await newUser.save();

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const verifyUrl = `${process.env.FRONTEND_URL}/verify-otp?userId=${savedUser._id}&otp=${otp}`;

        // Send OTP email
        await transporter.sendMail({
            from: '"Your App" <no-reply@yourapp.com>',
            to: email,
            subject: "Verify your account",
            text: `Your OTP is ${otp}. Link: ${verifyUrl}`,
            html: `<p>Your OTP is <b>${otp}</b>. Click <a href="${verifyUrl}">here</a> to verify.</p>`,
        });

        res.status(201).json(savedUser);
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: error.message });
    }
};



/* LOGIN USER */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist " });

        // Compare provided password with hashed password in MongoDB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials " });

        if (user.status !== "approved") {
            return res.status(403).json({ msg: "Account not yet approved" });
        }

        const token = jwt.sign(
            { id: user._id, admin: user.admin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Optional: set token expiration
        );
        const userSafe = { ...user._doc };
        delete userSafe.password;
        res.status(200).json({ token, user: userSafe });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/* VERIFY OTP */
export const verifyOtp = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ msg: "User not found" });
        if (user.status !== "pendingOTP") return res.status(400).json({ msg: "User already verified or not in OTP flow" });

        if (new Date() > user.otpExpiresAt) {
            // Delete user if OTP expired
            await User.findByIdAndDelete(userId);
            return res.status(400).json({ msg: "OTP expired, user deleted" });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ msg: "Invalid OTP" });
        }

        // OTP is correct, flip status to pending
        user.status = "pending";
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        res.status(200).json({ msg: "OTP verified. Awaiting admin approval." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/* FORGOT PASSWORD */
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User not found" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?userId=${user._id}&token=${token}`;

        await transporter.sendMail({
            from: '"Your App" <no-reply@yourapp.com>',
            to: email,
            subject: "Reset your password",
            text: `Click the link to reset your password: ${resetUrl}`,
            html: `<p>Click the link to reset your password: <a href="${resetUrl}">Reset Password</a></p>`,
        });

        res.status(200).json({ msg: "Reset link sent to your email" });
    } catch (error) {
        console.error("Error during forgot password:", error);
        res.status(500).json({ error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { userId, token, password } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.id !== userId) return res.status(400).json({ msg: "Invalid token" });

        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ msg: "User not found" });

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        user.password = passwordHash;
        await user.save();

        res.status(200).json({ msg: "Password reset successful" });
    } catch (error) {
        console.error("Error during reset password:", error);
        res.status(500).json({ error: error.message });
    }
};
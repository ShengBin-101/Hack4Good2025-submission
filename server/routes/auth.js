import express from 'express';
import { login, register, verifyOtp, forgotPassword, resetPassword , registerAdmin } from "../controllers/auth.js";

const router = express.Router();

router.post('/register', register);
router.post("/login", login); // will be prefixed with auth/ so it becomes auth/login later
router.post('/verify-otp', verifyOtp);
router.post('/register-admin', registerAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


export default router;
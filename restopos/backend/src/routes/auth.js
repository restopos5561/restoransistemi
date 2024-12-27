const express = require('express');
const router = express.Router();
const { validateLogin, validateRegister } = require('../validations/auth');
const { login, register, refreshToken, logout, forgotPassword, resetPassword } = require('../controllers/auth');
const { authenticateToken } = require('../middleware/auth');

// Kimlik doğrulama rotaları
router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);
router.post('/refresh-token', refreshToken);
router.post('/logout', authenticateToken, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router; 
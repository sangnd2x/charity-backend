const path = require('path');
const express = require('express');
const authController = require('../controller/auth');
const router = express.Router();
const jwtAuth = require('../middleware/jwtAuth');

// Verify user
router.get('/new-user/:userId', authController.verifyUser);

// POST  user change password
router.post('/edit-password', jwtAuth, authController.changePassword);

module.exports = router;
const path = require('path');
const express = require('express');
const authController = require('../controller/auth');
const adminController = require('../controller/admin');
const jwtAuth = require('../middleware/jwtAuth');

const router = express.Router();

// POST admin sign up 
router.post('/sign-up', authController.postAdminSignUp);

// POST admin sign in
router.post('/sign-in', authController.postAdminSignIn);

// POST admin add new charity
router.post('/new-charity', jwtAuth, adminController.postNewCharity);

// GET admin fetch charities
router.get('/charities', jwtAuth, adminController.adminFetchCharities);

// GET admin fetch edit charity
router.get('/edit-charity/:charityId', jwtAuth, adminController.adminGetEditCharity);

// POST admin post edit charity
router.post('/edit-charity', jwtAuth, adminController.adminPostEditCharity);

// GET admin delete charity
router.get('/delete-charity/:charityId', jwtAuth, adminController.adminDeleteCharity);

// GET  admin fetch users
router.get('/users', jwtAuth, adminController.adminFetchUsers);

// GET admin fetch donations
router.get('/donations', jwtAuth, adminController.adminFetchDonations);

// GET admin fetch searched charity
router.get('/search/charity/:charityName', jwtAuth, adminController.adminFetchSearchedCharity);

// GET admin fetch searched donation
router.get('/search/donation/:donorName', jwtAuth, adminController.adminFetchSearchedDonation);

// GET admin fetch searched user
router.get('/search/user/:username', jwtAuth, adminController.adminFetchSearchedUser);

module.exports = router;
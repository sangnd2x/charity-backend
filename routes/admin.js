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

// // POST admin post images 
// router.post('/images-upload', jwtAuth, adminController.uploadImages);

// POST admin add new charity
router.post('/new-charity', jwtAuth, adminController.postNewCharity);

// GET admin fetch charities
router.get('/charities', jwtAuth, adminController.adminFetchCharities);

// GET admin fetch edit charity
router.get('/edit-charity/:charityId', jwtAuth, adminController.adminGetEditCharity);

// POST admin post edit charity
router.post('/edit-charity', jwtAuth, adminController.adminPostEditCharity);

// GET admin delete charity
router.post('/delete-charity', jwtAuth, adminController.adminDeleteCharity);

// GET admin deactivate user
router.get('/user/deactivate/:userId', jwtAuth, adminController.adminDeactivateUser);

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

// POST admin forget password
router.post('/user/forget-password', adminController.adminForgetPassword);

// POST admin reset password
router.post('/user/reset-password', adminController.adminResetPassword);

// GET admin fetch user
router.get('/users/:userId', jwtAuth, adminController.adminFetchUser);

// POST admin edit info
router.post('/user/edit-info', jwtAuth, adminController.adminEditInfo);

module.exports = router;
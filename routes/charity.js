const path = require('path');
const express = require('express');
const charityController = require('../controller/charity');
const router = express.Router();

// Admin add charity
router.post('/new-charity', charityController.postNewCharity);

module.exports = router;
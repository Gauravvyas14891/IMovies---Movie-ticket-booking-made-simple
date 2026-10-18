const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const fetchUser = require('../middlewares/fetchUser');
const checkAdmin = require('../middlewares/checkAdmin');

router.get('/dashboard', fetchUser, checkAdmin, adminController.getDashboardStats);

module.exports = router;

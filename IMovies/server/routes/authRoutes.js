const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const fetchUser = require('../middlewares/fetchUser');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/admin/register', authController.registerAdmin);
router.post('/admin/login', authController.loginAdmin);
router.get('/me', fetchUser, authController.getMe);

module.exports = router;

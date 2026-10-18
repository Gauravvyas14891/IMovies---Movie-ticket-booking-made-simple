const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const fetchUser = require('../middlewares/fetchUser');

router.get('/', fetchUser, favoriteController.getMyFavorites);
router.post('/toggle', fetchUser, favoriteController.toggleFavorite);

module.exports = router;

const express = require('express');
const router = express.Router();
const showController = require('../controllers/showController');
const fetchUser = require('../middlewares/fetchUser');
const checkAdmin = require('../middlewares/checkAdmin');

router.get('/', showController.getAllShows);
router.get('/getmovieshows/:movieName', showController.getMovieShows);
router.post('/add', fetchUser, checkAdmin, showController.addShow);
router.delete('/:id', fetchUser, checkAdmin, showController.deleteShow);

module.exports = router;

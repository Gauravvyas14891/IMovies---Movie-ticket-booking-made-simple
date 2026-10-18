const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const fetchUser = require('../middlewares/fetchUser');
const checkAdmin = require('../middlewares/checkAdmin');

router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);
router.post('/add', fetchUser, checkAdmin, movieController.addMovie);
router.put('/:id', fetchUser, checkAdmin, movieController.updateMovie);
router.delete('/:id', fetchUser, checkAdmin, movieController.deleteMovie);

module.exports = router;

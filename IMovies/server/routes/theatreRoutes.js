const express = require('express');
const router = express.Router();
const theatreController = require('../controllers/theatreController');
const fetchUser = require('../middlewares/fetchUser');
const checkAdmin = require('../middlewares/checkAdmin');

router.get('/', theatreController.getAllTheatres);
router.post('/add', fetchUser, checkAdmin, theatreController.addTheatre);
router.delete('/:id', fetchUser, checkAdmin, theatreController.deleteTheatre);

module.exports = router;

const Favorite = require('../models/favoriteModel');

// Get user favorites
exports.getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ userEmail: req.user.email }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: favorites.length, data: favorites });
  } catch (error) {
    next(error);
  }
};

// Toggle favorite
exports.toggleFavorite = async (req, res, next) => {
  try {
    const { movieId, movieName, posterUrl } = req.body;
    const userEmail = req.user.email;

    const existing = await Favorite.findOne({ userEmail, movieId });
    if (existing) {
      await Favorite.deleteOne({ _id: existing._id });
      return res.status(200).json({ success: true, message: 'Removed from favorites.', isFavorite: false });
    }

    const favorite = await Favorite.create({
      userEmail,
      movieId,
      movieName,
      posterUrl: posterUrl || '',
    });

    res.status(201).json({ success: true, message: 'Added to favorites.', isFavorite: true, data: favorite });
  } catch (error) {
    next(error);
  }
};

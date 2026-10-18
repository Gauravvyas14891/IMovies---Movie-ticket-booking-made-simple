const Review = require('../models/reviewModel');

// Get reviews for a movie
exports.getMovieReviews = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const reviews = await Review.find({ movieId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    next(error);
  }
};

// Add review
exports.addReview = async (req, res, next) => {
  try {
    const { movieId, rating, comment } = req.body;
    const userEmail = req.user.email;
    const username = req.user.username || 'User';

    if (!movieId || !rating) {
      return res.status(400).json({ success: false, error: 'Movie ID and rating are required.' });
    }

    const review = await Review.create({
      movieId,
      userEmail,
      username,
      rating: Number(rating),
      comment: comment || '',
    });

    res.status(201).json({ success: true, message: 'Review added.', data: review });
  } catch (error) {
    next(error);
  }
};

// Delete review (Owner or Admin)
exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = req.user.role === 'ADMIN' ? { _id: id } : { _id: id, userEmail: req.user.email };

    const review = await Review.findOneAndDelete(query);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found or unauthorized.' });
    }

    res.status(200).json({ success: true, message: 'Review deleted.' });
  } catch (error) {
    next(error);
  }
};

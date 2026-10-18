const Movie = require('../models/movieModel');
const Show = require('../models/showModel');

// Get all movies
exports.getAllMovies = async (req, res, next) => {
  try {
    const { genre, language, search } = req.query;
    const filter = {};

    if (genre && genre !== 'All') {
      filter.genres = { $regex: new RegExp(genre, 'i') };
    }
    if (language) {
      filter.language = { $regex: new RegExp(language, 'i') };
    }
    if (search) {
      filter.movieName = { $regex: new RegExp(search, 'i') };
    }

    const movies = await Movie.find(filter).sort({ releaseDate: -1 });
    res.status(200).json({ success: true, count: movies.length, data: movies });
  } catch (error) {
    next(error);
  }
};

// Get single movie
exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findOne({
      $or: [{ _id: req.params.id }, { movieId: req.params.id }],
    });

    if (!movie) {
      return res.status(404).json({ success: false, error: 'Movie not found.' });
    }

    res.status(200).json({ success: true, data: movie });
  } catch (error) {
    next(error);
  }
};

// Add Movie (Admin)
exports.addMovie = async (req, res, next) => {
  try {
    const {
      movieName,
      description,
      genres,
      releaseDate,
      runtime,
      certification,
      trailerUrl,
      posterUrl,
      language,
    } = req.body;

    if (!movieName || !description || !genres || !releaseDate) {
      return res.status(400).json({ success: false, error: 'Mandatory movie details are required.' });
    }

    const genreList = Array.isArray(genres)
      ? genres
      : typeof genres === 'string'
      ? genres.split(',').map((g) => g.trim())
      : ['Action'];

    const movie = await Movie.create({
      movieName,
      description,
      genres: genreList,
      releaseDate: new Date(releaseDate),
      runtime: Number(runtime) || 120,
      certification: certification || 'UA',
      trailerUrl: trailerUrl || '',
      posterUrl: posterUrl || '',
      language: language || 'Hindi',
    });

    res.status(201).json({ success: true, message: 'Movie added successfully.', data: movie });
  } catch (error) {
    next(error);
  }
};

// Update Movie (Admin)
exports.updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { movieId: req.params.id }] },
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({ success: false, error: 'Movie not found.' });
    }

    res.status(200).json({ success: true, message: 'Movie updated successfully.', data: movie });
  } catch (error) {
    next(error);
  }
};

// Delete Movie (Admin)
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findOneAndDelete({
      $or: [{ _id: req.params.id }, { movieId: req.params.id }],
    });

    if (!movie) {
      return res.status(404).json({ success: false, error: 'Movie not found.' });
    }

    // Also remove associated shows safely
    await Show.deleteMany({ movieId: movie.movieId });

    res.status(200).json({ success: true, message: 'Movie deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');
const { startCleanupTask } = require('./utils/cleanupService');
const errorHandler = require('./middlewares/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const theatreRoutes = require('./routes/theatreRoutes');
const showRoutes = require('./routes/showRoutes');
const seatRoutes = require('./routes/seatRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB using MONGO_URI exclusively
connectDB();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'IMovies Backend API',
    port: PORT,
    database: 'Imovies',
    timestamp: new Date().toISOString(),
  });
});

// Centralized error handler
app.use(errorHandler);

// Start background lock cleanup service
startCleanupTask();

// Start HTTP Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🎬 IMovies Server listening on port ${PORT}`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🗄️  Database: ${process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Imovies'}`);
  console.log(`===============================================`);
});

module.exports = app;

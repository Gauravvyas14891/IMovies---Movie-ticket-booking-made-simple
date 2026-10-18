require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/movieModel');
const Theatre = require('../models/theatreModel');
const Show = require('../models/showModel');
const Seat = require('../models/seatModel');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Imovies');
    console.log('Connected to MongoDB for seeding...');

    await Movie.deleteMany({});
    await Theatre.deleteMany({});
    await Show.deleteMany({});
    await Seat.deleteMany({});

    console.log('Cleared existing movie, theatre, show, and seat collections.');

    // Seed Movies matching the screenshots exactly
    const movies = await Movie.insertMany([
      {
        movieName: 'Rrr',
        description: 'A tale of two legendary revolutionaries and their journey away from home before they began fighting for their country in the 1920s.',
        genres: ['Action', 'Drama', 'Historical'],
        releaseDate: new Date('2022-03-25'),
        runtime: 187,
        certification: 'UA',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BODUwNDNjMTctODUxNy00ZTA2LWIyYTEtMDc5Y2E5NjBmNTMzXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg',
        language: 'Telugu',
      },
      {
        movieName: 'Baahubali 2: the conclusion',
        description: 'When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events.',
        genres: ['Action', 'Drama', 'Fantasy'],
        releaseDate: new Date('2017-04-25'),
        runtime: 167,
        certification: 'UA',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BYzA4ZjBhMmQtNmU2My00OWE5LWI0OGQtZDBhODMzM2I0MjNmXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg',
        language: 'Telugu',
      },
      {
        movieName: 'Og',
        description: 'A ruthless gangster returns to Bombay after a decade of self-imposed exile to settle a score and reclaim his empire.',
        genres: ['Action', 'Thriller'],
        releaseDate: new Date('2025-09-25'),
        runtime: 155,
        certification: 'A',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BZTUwYjA0NGMtNDdhOS00NGJkLTk4ODktNWU2NGY3NjViM2I1XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg',
        language: 'Telugu',
      },
      {
        movieName: 'Rajasaab',
        description: 'A romantic horror comedy set in an ancestral estate where ancient secrets unravel amidst ghostly laughter and love.',
        genres: ['Comedy', 'Horror', 'Romantic'],
        releaseDate: new Date('2025-12-05'),
        runtime: 140,
        certification: 'UA',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BYmQ1ZDFlNTItMjEzMC00NWQ2LWIzYzMtMWFlMzYxYjVlYmU1XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg',
        language: 'Telugu',
      },
      {
        movieName: 'Toxic',
        description: 'A fairy tale for grown-ups. An underworld saga following a mysterious drifter caught between warring syndicates.',
        genres: ['Action', 'Thriller'],
        releaseDate: new Date('2025-10-01'),
        runtime: 160,
        certification: 'A',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BYTk4YTMzOGQtNjMyMC00ZTBkLTlmY2MtMTk3N2EzODk1MDExXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg',
        language: 'Kannada',
      },
      {
        movieName: 'Avatar: Fire and Ash',
        description: 'Jake Sully and Neytiri encounter a new, aggressive tribe of Na\'vi known as the Ash People who dwell around volcanic biomes.',
        genres: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi'],
        releaseDate: new Date('2025-09-30'),
        runtime: 190,
        certification: 'UA',
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BMDEzMmQwZjctZWU2My00MWNlLWE0NGItMDJlYjllNDQ1MDE2XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg',
        language: 'English',
      },
    ]);

    console.log(`Seeded ${movies.length} movies.`);

    // Seed Theatres matching screenshots
    const theatres = await Theatre.insertMany([
      {
        theatreName: 'Srinivasa',
        location: 'Kukatpally, Hyderabad',
        balconySeatPrice: 175,
        balconySeatCount: 40,
        middleSeatPrice: 130,
        middleSeatCount: 60,
        lowerSeatPrice: 100,
        lowerSeatCount: 50,
      },
      {
        theatreName: 'Gokul',
        location: 'Madhapur, Hyderabad',
        balconySeatPrice: 200,
        balconySeatCount: 40,
        middleSeatPrice: 150,
        middleSeatCount: 60,
        lowerSeatPrice: 120,
        lowerSeatCount: 50,
      },
    ]);

    console.log(`Seeded ${theatres.length} theatres.`);

    // Seed Shows matching screenshots
    const shows = await Show.insertMany([
      {
        adminEmail: 'admin@imovies.com',
        movieId: movies[2].movieId,
        movieName: 'Og',
        theatreName: 'Srinivasa',
        showdate: 'Sep 25, 2025',
        showtime: '2:00 PM',
        tickets: { Balcony: 175, Middle: 130, Lower: 100 },
      },
      {
        adminEmail: 'admin@imovies.com',
        movieId: movies[2].movieId,
        movieName: 'Og',
        theatreName: 'Srinivasa',
        showdate: 'Sep 25, 2025',
        showtime: '4:00 PM',
        tickets: { Balcony: 175, Middle: 130, Lower: 100 },
      },
      {
        adminEmail: 'admin@imovies.com',
        movieId: movies[2].movieId,
        movieName: 'Og',
        theatreName: 'Srinivasa',
        showdate: 'Sep 26, 2025',
        showtime: '9:00 PM',
        tickets: { Balcony: 175, Middle: 130, Lower: 100 },
      },
      {
        adminEmail: 'admin@imovies.com',
        movieId: movies[0].movieId,
        movieName: 'Rrr',
        theatreName: 'Gokul',
        showdate: 'Nov 14, 2025',
        showtime: '2:00 PM',
        tickets: { Balcony: 200, Middle: 150, Lower: 120 },
      },
    ]);

    console.log(`Seeded ${shows.length} shows.`);
    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();

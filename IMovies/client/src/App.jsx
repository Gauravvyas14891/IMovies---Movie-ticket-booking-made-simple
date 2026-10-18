/**
 * IMovies — Movie Ticket Booking Made Simple
 * Client Application matching the reference screenshots
 */

import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Home,
  Heart,
  User as UserIcon,
  Search,
  Info,
  Calendar,
  Film,
  PlusCircle,
  Clock,
  LogOut,
  Trash2,
  Video,
  CheckCircle2,
  QrCode,
  CreditCard,
  ChevronRight,
} from 'lucide-react';

const INITIAL_MOVIES = [
  {
    id: 'm1',
    movieName: 'Rrr',
    description: 'A tale of two legendary revolutionaries and their journey away from home in the 1920s.',
    genres: ['Action', 'Drama', 'Historical'],
    releaseDate: 'Mar 25, 2022',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BODUwNDNjMTctODUxNy00ZTA2LWIyYTEtMDc5Y2E5NjBmNTMzXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg',
  },
  {
    id: 'm2',
    movieName: 'Baahubali 2: the conclusion',
    description: 'When Shiva learns about his heritage, he begins to look for answers amidst grand royal conflicts.',
    genres: ['Action', 'Drama', 'Fantasy'],
    releaseDate: 'Apr 25, 2017',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYzA4ZjBhMmQtNmU2My00OWE5LWI0OGQtZDBhODMzM2I0MjNmXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg',
  },
  {
    id: 'm3',
    movieName: 'Og',
    description: 'A ruthless gangster returns to Bombay after a decade of self-imposed exile to settle a score.',
    genres: ['action thriller'],
    releaseDate: 'Sep 25, 2025',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZTUwYjA0NGMtNDdhOS00NGJkLTk4ODktNWU2NGY3NjViM2I1XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg',
  },
  {
    id: 'm4',
    movieName: 'Rajasaab',
    description: 'A romantic horror comedy set in an ancestral estate where ancient secrets unravel.',
    genres: ['Comedy', 'Horror', 'Romantic'],
    releaseDate: 'Dec 5, 2025',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYmQ1ZDFlNTItMjEzMC00NWQ2LWIzYzMtMWFlMzYxYjVlYmU1XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg',
  },
  {
    id: 'm5',
    movieName: 'Toxic',
    description: 'A fairy tale for grown-ups. An underworld saga following a mysterious drifter.',
    genres: ['Action', 'Thriller'],
    releaseDate: 'Oct 1, 2025',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYTk4YTMzOGQtNjMyMC00ZTBkLTlmY2MtMTk3N2EzODk1MDExXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg',
  },
  {
    id: 'm6',
    movieName: 'Avatar',
    description: 'Jake Sully and Neytiri encounter a new, aggressive tribe of Na\'vi known as the Ash People.',
    genres: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi'],
    releaseDate: 'Sep 30, 2025',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BMDEzMmQwZjctZWU2My00MWNlLWE0NGItMDJlYjllNDQ1MDE2XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg',
  },
];

const INITIAL_SHOWS = [
  {
    id: 'sh1',
    movieName: 'Og',
    theatreName: 'Srinivasa',
    showdate: 'Sep 25, 2025',
    showtime: '2:00 PM',
    tickets: { Balcony: 175, Middle: 130, Lower: 100 },
  },
  {
    id: 'sh2',
    movieName: 'Og',
    theatreName: 'Srinivasa',
    showdate: 'Sep 25, 2025',
    showtime: '4:00 PM',
    tickets: { Balcony: 175, Middle: 130, Lower: 100 },
  },
  {
    id: 'sh3',
    movieName: 'Og',
    theatreName: 'Srinivasa',
    showdate: 'Sep 26, 2025',
    showtime: '9:00 PM',
    tickets: { Balcony: 175, Middle: 130, Lower: 100 },
  },
  {
    id: 'sh4',
    movieName: 'G2',
    theatreName: 'Gokul',
    showdate: 'Nov 14, 2025',
    showtime: '2:00 PM',
    tickets: { Balcony: 200, Middle: 150, Lower: 120 },
  },
  {
    id: 'sh5',
    movieName: 'G2',
    theatreName: 'Gokul',
    showdate: 'Nov 14, 2025',
    showtime: '6:00 PM',
    tickets: { Balcony: 200, Middle: 150, Lower: 120 },
  },
  {
    id: 'sh6',
    movieName: 'The pride of bharat',
    theatreName: 'Gokul',
    showdate: 'Jan 2, 2026',
    showtime: '9:30 PM',
    tickets: { Balcony: 200, Middle: 150, Lower: 120 },
  },
];

const INITIAL_BOOKINGS = [
  {
    id: 'b1',
    bookingId: 'BK_101',
    userEmail: 'gvvdkumar@gmail.com',
    movieName: 'Og',
    theatreName: 'Srinivasa',
    showdate: 'Sep 26, 2025',
    showtime: '21:00',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZTUwYjA0NGMtNDdhOS00NGJkLTk4ODktNWU2NGY3NjViM2I1XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg',
    tier: 'Middle Seats',
    seats: ['261', '262'],
    totalPrice: 260,
    status: 'CONFIRMED',
    qrCode: 'IMOVIE:BK_101:OG:Srinivasa:261,262',
  },
  {
    id: 'b2',
    bookingId: 'BK_102',
    userEmail: 'gvvdkumar@gmail.com',
    movieName: 'Og',
    theatreName: 'Srinivasa',
    showdate: 'Sep 26, 2025',
    showtime: '21:00',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BZTUwYjA0NGMtNDdhOS00NGJkLTk4ODktNWU2NGY3NjViM2I1XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg',
    tier: 'Balcony Seats',
    seats: ['162'],
    totalPrice: 175,
    status: 'CONFIRMED',
    qrCode: 'IMOVIE:BK_102:OG:Srinivasa:162',
  },
  {
    id: 'b3',
    bookingId: 'BK_103',
    userEmail: 'gvvdkumar@gmail.com',
    movieName: 'The pride of bharat',
    theatreName: 'Gokul',
    showdate: 'Jan 2, 2026',
    showtime: '21:30',
    posterUrl: 'https://m.media-amazon.com/images/M/MV5BYzA4ZjBhMmQtNmU2My00OWE5LWI0OGQtZDBhODMzM2I0MjNmXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg',
    tier: 'Balcony Seats',
    seats: ['198'],
    totalPrice: 200,
    status: 'CONFIRMED',
    qrCode: 'IMOVIE:BK_103:PRIDE:Gokul:198',
  },
];

export default function App() {
  const [currentView, setCurrentView] = useState('movies');
  const [userRole, setUserRole] = useState('USER');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [isLightMode, setIsLightMode] = useState(false);

  const [movies, setMovies] = useState(INITIAL_MOVIES);
  const [shows, setShows] = useState(INITIAL_SHOWS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [favorites, setFavorites] = useState(['m1', 'm3']);

  const [toastMessage, setToastMessage] = useState(null);
  const [selectedMovieForBooking, setSelectedMovieForBooking] = useState(null);
  const [selectedShowForBooking, setSelectedShowForBooking] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTier, setSelectedTier] = useState('Middle');
  const [lockCountdown, setLockCountdown] = useState(600);
  const [isLocked, setIsLocked] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    let timer;
    if (isLocked && lockCountdown > 0) {
      timer = setInterval(() => {
        setLockCountdown((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setSelectedSeats([]);
            showToast('Temporary seat reservation expired.');
            return 600;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockCountdown]);

  return (
    <div className={`min-h-screen ${isLightMode ? 'bg-[#F1F5F9] text-[#0F172A]' : 'bg-[#1E293B] text-white'}`}>
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#E90B3C] text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header matching screenshots */}
      <header className="sticky top-0 z-40 bg-[#0F172A] border-b border-slate-800 px-6 py-3.5 flex items-center justify-between shadow-md">
        <div onClick={() => setCurrentView('movies')} className="cursor-pointer flex items-center gap-1 select-none">
          <span className="text-2xl font-black text-[#E90B3C]">i</span>
          <span className="text-2xl font-bold tracking-tight text-white">Movies</span>
        </div>

        {userRole === 'USER' && (
          <div className="hidden md:flex items-center bg-[#202A3D] rounded-md px-3.5 py-1.5 w-96 border border-slate-700/50">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-400 w-full"
            />
            <Info className="w-4 h-4 text-[#E90B3C]" />
          </div>
        )}

        <div className="flex items-center gap-5">
          <button onClick={() => setIsLightMode(!isLightMode)} className="text-slate-300 hover:text-white">
            {isLightMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {userRole === 'USER' ? (
            <>
              <button onClick={() => setCurrentView('movies')} className="text-slate-300 hover:text-white">
                <Home className="w-5 h-5" />
              </button>
              <button onClick={() => setCurrentView('favorites')} className="text-slate-300 hover:text-white">
                <Heart className="w-5 h-5" />
              </button>
              <button onClick={() => setCurrentView('bookings')} className="text-slate-300 hover:text-white">
                <UserIcon className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setCurrentView('movies')} className="text-slate-300 hover:text-white">
                <Home className="w-5 h-5" />
              </button>
              <button onClick={() => setCurrentView('adminMovies')} className="text-slate-300 hover:text-white">
                <Film className="w-5 h-5" />
              </button>
              <button onClick={() => setCurrentView('addMovie')} className="text-slate-300 hover:text-white">
                <PlusCircle className="w-5 h-5" />
              </button>
              <button onClick={() => setCurrentView('adminShows')} className="text-slate-300 hover:text-white">
                <Clock className="w-5 h-5" />
              </button>
            </>
          )}

          <button
            onClick={() => setUserRole(userRole === 'USER' ? 'ADMIN' : 'USER')}
            className="text-xs font-semibold px-2.5 py-1 rounded bg-[#202A3D] border border-slate-700"
          >
            {userRole === 'USER' ? 'Switch to Admin' : 'Switch to User'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'movies' && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Available <span className="text-[#E90B3C]">Movies</span>
              </h1>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="cursor-pointer group flex flex-col"
                  onClick={() => {
                    setSelectedMovieForBooking(movie);
                    setSelectedShowForBooking(shows.find((s) => s.movieName === movie.movieName) || shows[0]);
                    setCurrentView('seatSelection');
                  }}
                >
                  <div className="aspect-[3/4.2] w-full rounded-md overflow-hidden bg-[#0F172A] border border-slate-800 relative">
                    <img src={movie.posterUrl} alt={movie.movieName} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-white truncate">{movie.movieName}</h3>
                  <p className="text-xs text-slate-400">{movie.releaseDate}</p>
                  <div className="mt-2">
                    <span className="bg-[#3B151F] text-[#FF4D6D] border border-[#5C1D2E] text-[11px] px-2 py-0.5 rounded">
                      {movie.genres.join(', ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'bookings' && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Your <span className="text-[#E90B3C]">Bookings</span>
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-[#0F172A] border border-slate-800 rounded-lg p-4 flex gap-4">
                  <div className="w-32 aspect-[3/4.2] rounded overflow-hidden bg-slate-900 shrink-0">
                    <img src={booking.posterUrl} alt={booking.movieName} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-xs space-y-1.5 text-slate-300">
                    <p className="text-sm font-semibold text-white">Movie: {booking.movieName}</p>
                    <p>Theatre: {booking.theatreName}</p>
                    <p>Showdate: {booking.showdate}</p>
                    <p>showtime: {booking.showtime}</p>
                    <p>{booking.tier}: {booking.seats.join(', ')}</p>
                    <p className="text-sm font-bold text-white pt-1">Total Price: {booking.totalPrice}₹</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentView === 'seatSelection' && selectedMovieForBooking && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#0F172A] p-4 rounded-lg mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">{selectedMovieForBooking.movieName}</h2>
                <p className="text-xs text-slate-400">
                  {selectedShowForBooking?.theatreName} • {selectedShowForBooking?.showdate} ({selectedShowForBooking?.showtime})
                </p>
              </div>
              <button
                onClick={() => {
                  setIsLocked(true);
                  setCurrentView('checkout');
                }}
                disabled={selectedSeats.length === 0}
                className="bg-[#E90B3C] disabled:bg-slate-800 px-6 py-2 rounded text-xs font-semibold"
              >
                Proceed to Checkout ({selectedSeats.length} seats)
              </button>
            </div>

            <div className="bg-[#0F172A] p-8 rounded-xl text-center border border-slate-800">
              <div className="w-3/4 mx-auto h-1.5 bg-[#E90B3C] rounded-full mb-8 opacity-75"></div>
              <div className="flex flex-col gap-3 items-center">
                {['A', 'B', 'C', 'D'].map((row) => (
                  <div key={row} className="flex gap-2 items-center">
                    <span className="w-5 text-xs text-slate-500">{row}</span>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
                      const code = `${row}${num}`;
                      const isSel = selectedSeats.includes(code);
                      return (
                        <button
                          key={code}
                          onClick={() => {
                            if (isSel) setSelectedSeats(selectedSeats.filter((s) => s !== code));
                            else setSelectedSeats([...selectedSeats, code]);
                          }}
                          className={`w-7 h-7 rounded text-xs font-mono font-bold ${
                            isSel ? 'bg-[#E90B3C] text-white' : 'bg-[#202A3D] text-slate-300'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentView === 'checkout' && (
          <div className="max-w-md mx-auto bg-[#0F172A] p-8 rounded-xl border border-slate-800">
            <h2 className="text-xl font-bold mb-4">Complete Payment</h2>
            <div className="text-xs space-y-2 mb-6 text-slate-300">
              <p>Seats: {selectedSeats.join(', ')}</p>
              <p className="text-base font-bold text-white pt-2">Total Amount: ₹{selectedSeats.length * 150}</p>
            </div>
            <button
              onClick={() => {
                const newB = {
                  id: 'bk_' + Date.now(),
                  bookingId: 'BK_' + Math.floor(100 + Math.random() * 900),
                  userEmail: 'gvvdkumar@gmail.com',
                  movieName: selectedMovieForBooking?.movieName || 'Movie',
                  theatreName: selectedShowForBooking?.theatreName || 'Theatre',
                  showdate: selectedShowForBooking?.showdate || 'Today',
                  showtime: selectedShowForBooking?.showtime || '20:00',
                  posterUrl: selectedMovieForBooking?.posterUrl || '',
                  tier: 'Middle Seats',
                  seats: selectedSeats,
                  totalPrice: selectedSeats.length * 150,
                  status: 'CONFIRMED',
                  qrCode: 'QR_CODE_DATA',
                };
                setBookings([newB, ...bookings]);
                setSelectedSeats([]);
                setCurrentView('bookings');
                showToast('Payment successful! Booking confirmed.');
              }}
              className="w-full bg-[#E90B3C] py-2.5 rounded text-sm font-bold"
            >
              Pay & Confirm Ticket
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

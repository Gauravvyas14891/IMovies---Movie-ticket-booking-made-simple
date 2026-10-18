/**
 * IMovies — Movie Ticket Booking Made Simple
 * Full-stack implementation adhering strictly to reference screenshots
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
  XCircle,
  AlertTriangle,
  QrCode,
  CreditCard,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

// Image references
const HERO_BANNER = '/src/assets/images/hero_cinema_blockbuster_1792345407815.jpg';
const POSTER_ODYSSEY = '/src/assets/images/movie_poster_interstellar_odyssey_1792345408549.jpg';
const POSTER_AURORA = '/src/assets/images/movie_poster_chronicles_aurora_1792345408942.jpg';

interface MovieItem {
  id: string;
  movieName: string;
  description: string;
  genres: string[];
  releaseDate: string;
  runtime: number;
  certification: string;
  posterUrl: string;
  trailerUrl?: string;
  language: string;
}

interface TheatreItem {
  id: string;
  theatreName: string;
  location: string;
  balconySeatPrice: number;
  balconySeatCount: number;
  middleSeatPrice: number;
  middleSeatCount: number;
  lowerSeatPrice: number;
  lowerSeatCount: number;
}

interface ShowItem {
  id: string;
  movieId: string;
  movieName: string;
  theatreId: string;
  theatreName: string;
  showdate: string;
  showtime: string;
  tickets: {
    Balcony: number;
    Middle: number;
    Lower: number;
  };
}

interface BookingItem {
  id: string;
  bookingId: string;
  userEmail: string;
  movieName: string;
  theatreName: string;
  showdate: string;
  showtime: string;
  posterUrl: string;
  tier: string;
  seats: string[];
  totalPrice: number;
  status: 'CONFIRMED' | 'CANCELLED';
  qrCode: string;
  bookedAt: string;
}

// Initial seed data matching screenshots exactly
const INITIAL_MOVIES: MovieItem[] = [
  {
    id: 'm1',
    movieName: 'Rrr',
    description: 'A tale of two legendary revolutionaries and their journey away from home before they began fighting for their country in the 1920s.',
    genres: ['Action', 'Drama', 'Historical'],
    releaseDate: 'Mar 25, 2022',
    runtime: 187,
    certification: 'UA',
    posterUrl: POSTER_ODYSSEY,
    language: 'Telugu',
  },
  {
    id: 'm2',
    movieName: 'Baahubali 2: the conclusion',
    description: 'When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers amidst grand royal conflicts.',
    genres: ['Action', 'Drama', 'Fantasy'],
    releaseDate: 'Apr 25, 2017',
    runtime: 167,
    certification: 'UA',
    posterUrl: POSTER_AURORA,
    language: 'Telugu',
  },
  {
    id: 'm3',
    movieName: 'Og',
    description: 'A ruthless gangster returns to Bombay after a decade of self-imposed exile to settle a score and reclaim his empire.',
    genres: ['action thriller'],
    releaseDate: 'Sep 25, 2025',
    runtime: 155,
    certification: 'A',
    posterUrl: HERO_BANNER,
    language: 'Telugu',
  },
  {
    id: 'm4',
    movieName: 'Rajasaab',
    description: 'A romantic horror comedy set in an ancestral estate where ancient secrets unravel amidst ghostly laughter and love.',
    genres: ['Comedy', 'Horror', 'Romantic'],
    releaseDate: 'Dec 5, 2025',
    runtime: 140,
    certification: 'UA',
    posterUrl: POSTER_ODYSSEY,
    language: 'Telugu',
  },
  {
    id: 'm5',
    movieName: 'Toxic',
    description: 'A fairy tale for grown-ups. An underworld saga following a mysterious drifter caught between warring syndicates.',
    genres: ['Action', 'Thriller'],
    releaseDate: 'Oct 1, 2025',
    runtime: 160,
    certification: 'A',
    posterUrl: POSTER_AURORA,
    language: 'Kannada',
  },
  {
    id: 'm6',
    movieName: 'Avatar',
    description: 'Jake Sully and Neytiri encounter a new, aggressive tribe of Na\'vi known as the Ash People who dwell around volcanic biomes.',
    genres: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi'],
    releaseDate: 'Sep 30, 2025',
    runtime: 190,
    certification: 'UA',
    posterUrl: HERO_BANNER,
    language: 'English',
  },
];

const INITIAL_THEATRES: TheatreItem[] = [
  {
    id: 'th1',
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
    id: 'th2',
    theatreName: 'Gokul',
    location: 'Madhapur, Hyderabad',
    balconySeatPrice: 200,
    balconySeatCount: 40,
    middleSeatPrice: 150,
    middleSeatCount: 60,
    lowerSeatPrice: 120,
    lowerSeatCount: 50,
  },
];

const INITIAL_SHOWS: ShowItem[] = [
  {
    id: 'sh1',
    movieId: 'm3',
    movieName: 'Og',
    theatreId: 'th1',
    theatreName: 'Srinivasa',
    showdate: 'Sep 25, 2025',
    showtime: '2:00 PM',
    tickets: { Balcony: 175, Middle: 130, Lower: 100 },
  },
  {
    id: 'sh2',
    movieId: 'm3',
    movieName: 'Og',
    theatreId: 'th1',
    theatreName: 'Srinivasa',
    showdate: 'Sep 25, 2025',
    showtime: '4:00 PM',
    tickets: { Balcony: 175, Middle: 130, Lower: 100 },
  },
  {
    id: 'sh3',
    movieId: 'm3',
    movieName: 'Og',
    theatreId: 'th1',
    theatreName: 'Srinivasa',
    showdate: 'Sep 26, 2025',
    showtime: '9:00 PM',
    tickets: { Balcony: 175, Middle: 130, Lower: 100 },
  },
  {
    id: 'sh4',
    movieId: 'm1',
    movieName: 'G2',
    theatreId: 'th2',
    theatreName: 'Gokul',
    showdate: 'Nov 14, 2025',
    showtime: '2:00 PM',
    tickets: { Balcony: 200, Middle: 150, Lower: 120 },
  },
  {
    id: 'sh5',
    movieId: 'm1',
    movieName: 'G2',
    theatreId: 'th2',
    theatreName: 'Gokul',
    showdate: 'Nov 14, 2025',
    showtime: '6:00 PM',
    tickets: { Balcony: 200, Middle: 150, Lower: 120 },
  },
  {
    id: 'sh6',
    movieId: 'm2',
    movieName: 'The pride of bharat',
    theatreId: 'th2',
    theatreName: 'Gokul',
    showdate: 'Jan 2, 2026',
    showtime: '9:30 PM',
    tickets: { Balcony: 200, Middle: 150, Lower: 120 },
  },
];

const INITIAL_BOOKINGS: BookingItem[] = [
  {
    id: 'b1',
    bookingId: 'BK_101',
    userEmail: 'gvvdkumar@gmail.com',
    movieName: 'Og',
    theatreName: 'Srinivasa',
    showdate: 'Sep 26, 2025',
    showtime: '21:00',
    posterUrl: HERO_BANNER,
    tier: 'Middle Seats',
    seats: ['261', '262'],
    totalPrice: 260,
    status: 'CONFIRMED',
    qrCode: 'IMOVIE:BK_101:OG:Srinivasa:261,262',
    bookedAt: '2025-09-24T10:30:00Z',
  },
  {
    id: 'b2',
    bookingId: 'BK_102',
    userEmail: 'gvvdkumar@gmail.com',
    movieName: 'Og',
    theatreName: 'Srinivasa',
    showdate: 'Sep 26, 2025',
    showtime: '21:00',
    posterUrl: HERO_BANNER,
    tier: 'Balcony Seats',
    seats: ['162'],
    totalPrice: 175,
    status: 'CONFIRMED',
    qrCode: 'IMOVIE:BK_102:OG:Srinivasa:162',
    bookedAt: '2025-09-24T14:15:00Z',
  },
  {
    id: 'b3',
    bookingId: 'BK_103',
    userEmail: 'gvvdkumar@gmail.com',
    movieName: 'The pride of bharat',
    theatreName: 'Gokul',
    showdate: 'Jan 2, 2026',
    showtime: '21:30',
    posterUrl: POSTER_AURORA,
    tier: 'Balcony Seats',
    seats: ['198'],
    totalPrice: 200,
    status: 'CONFIRMED',
    qrCode: 'IMOVIE:BK_103:PRIDE:Gokul:198',
    bookedAt: '2025-12-28T18:00:00Z',
  },
];

export default function App() {
  // Navigation & role states
  const [currentView, setCurrentView] = useState<string>('movies');
  const [userRole, setUserRole] = useState<'USER' | 'ADMIN'>('USER');
  const [currentUser, setCurrentUser] = useState<{ username: string; email: string } | null>({
    username: 'G V V D Kumar',
    email: 'gvvdkumar@gmail.com',
  });
  const [isLightMode, setIsLightMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Domain records in state (persisted to localStorage)
  const [movies, setMovies] = useState<MovieItem[]>(() => {
    const saved = localStorage.getItem('imovies_movies');
    return saved ? JSON.parse(saved) : INITIAL_MOVIES;
  });

  const [theatres, setTheatres] = useState<TheatreItem[]>(() => {
    const saved = localStorage.getItem('imovies_theatres');
    return saved ? JSON.parse(saved) : INITIAL_THEATRES;
  });

  const [shows, setShows] = useState<ShowItem[]>(() => {
    const saved = localStorage.getItem('imovies_shows');
    return saved ? JSON.parse(saved) : INITIAL_SHOWS;
  });

  const [bookings, setBookings] = useState<BookingItem[]>(() => {
    const saved = localStorage.getItem('imovies_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [favorites, setFavorites] = useState<string[]>(['m1', 'm3']);

  // Modals & alerts
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [infoModalMovie, setInfoModalMovie] = useState<MovieItem | null>(null);
  const [selectedMovieForBooking, setSelectedMovieForBooking] = useState<MovieItem | null>(null);
  const [selectedShowForBooking, setSelectedShowForBooking] = useState<ShowItem | null>(null);

  // Seat selection & lock state
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [selectedTier, setSelectedTier] = useState<'Balcony' | 'Middle' | 'Lower'>('Middle');
  const [lockCountdown, setLockCountdown] = useState<number>(600); // 10 minutes in seconds
  const [isLocked, setIsLocked] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<BookingItem | null>(null);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Add Theatre form
  const [newTheatreName, setNewTheatreName] = useState('');
  const [newTheatreLocation, setNewTheatreLocation] = useState('');
  const [newBalconyPrice, setNewBalconyPrice] = useState(175);
  const [newBalconyCount, setNewBalconyCount] = useState(40);
  const [newMiddlePrice, setNewMiddlePrice] = useState(130);
  const [newMiddleCount, setNewMiddleCount] = useState(60);
  const [newLowerPrice, setNewLowerPrice] = useState(100);
  const [newLowerCount, setNewLowerCount] = useState(50);

  // Add Show form
  const [showTheatreName, setShowTheatreName] = useState('Srinivasa');
  const [showMovieName, setShowMovieName] = useState('Og');
  const [showDateInput, setShowDateInput] = useState('2025-09-25');
  const [showTimeInput, setShowTimeInput] = useState('14:00');

  // Add Movie form
  const [newMovieName, setNewMovieName] = useState('');
  const [newMovieDesc, setNewMovieDesc] = useState('');
  const [newMovieGenres, setNewMovieGenres] = useState('');
  const [newMovieReleaseDate, setNewMovieReleaseDate] = useState('');
  const [newMovieRuntime, setNewMovieRuntime] = useState(150);
  const [newMovieCertification, setNewMovieCertification] = useState('UA');
  const [newMovieTrailer, setNewMovieTrailer] = useState('');

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('imovies_movies', JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    localStorage.setItem('imovies_theatres', JSON.stringify(theatres));
  }, [theatres]);

  useEffect(() => {
    localStorage.setItem('imovies_shows', JSON.stringify(shows));
  }, [shows]);

  useEffect(() => {
    localStorage.setItem('imovies_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Synchronized 10-minute Lock Timer
  useEffect(() => {
    let timer: any;
    if (isLocked && lockCountdown > 0) {
      timer = setInterval(() => {
        setLockCountdown((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setSelectedSeats([]);
            showToast('Temporary seat reservation expired. Seats released back to inventory.');
            return 600;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockCountdown]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Toggle favorite
  const handleToggleFavorite = (movieId: string) => {
    setFavorites((prev) =>
      prev.includes(movieId) ? prev.filter((id) => id !== movieId) : [...prev, movieId]
    );
    showToast(favorites.includes(movieId) ? 'Removed from favorites' : 'Added to favorites');
  };

  // Start booking flow for a movie
  const handleBookMovie = (movie: MovieItem) => {
    setSelectedMovieForBooking(movie);
    const availableShows = shows.filter((s) => s.movieName.toLowerCase() === movie.movieName.toLowerCase());
    if (availableShows.length > 0) {
      setSelectedShowForBooking(availableShows[0]);
    } else {
      setSelectedShowForBooking(shows[0] || null);
    }
    setSelectedSeats([]);
    setIsLocked(false);
    setLockCountdown(600);
    setCurrentView('seatSelection');
  };

  // Toggle seat selection
  const handleSeatClick = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= 6) {
        showToast('Maximum 6 seats can be selected per booking.');
        return;
      }
      setSelectedSeats((prev) => [...prev, seatId]);
    }
  };

  // Lock seats atomically
  const handleLockSeats = () => {
    if (selectedSeats.length === 0) {
      showToast('Please select at least one seat to proceed.');
      return;
    }
    setIsLocked(true);
    setLockCountdown(600);
    showToast(`Locked ${selectedSeats.length} seats for 10 minutes. Please complete payment.`);
    setCurrentView('checkout');
  };

  // Finalize booking upon payment verification
  const handleCompletePayment = () => {
    if (!selectedShowForBooking || selectedSeats.length === 0) return;

    const pricePerSeat =
      selectedTier === 'Balcony'
        ? selectedShowForBooking.tickets.Balcony
        : selectedTier === 'Middle'
        ? selectedShowForBooking.tickets.Middle
        : selectedShowForBooking.tickets.Lower;

    const totalPrice = pricePerSeat * selectedSeats.length;
    const bookingId = 'BK_' + Math.floor(100 + Math.random() * 900);

    const newBooking: BookingItem = {
      id: 'bk_' + Date.now(),
      bookingId,
      userEmail: currentUser?.email || 'user@example.com',
      movieName: selectedShowForBooking.movieName,
      theatreName: selectedShowForBooking.theatreName,
      showdate: selectedShowForBooking.showdate,
      showtime: selectedShowForBooking.showtime,
      posterUrl: selectedMovieForBooking?.posterUrl || HERO_BANNER,
      tier: `${selectedTier} Seats`,
      seats: selectedSeats,
      totalPrice,
      status: 'CONFIRMED',
      qrCode: `IMOVIE:${bookingId}:${selectedShowForBooking.movieName}:${selectedSeats.join(',')}`,
      bookedAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    setConfirmedBookingData(newBooking);
    setIsLocked(false);
    setSelectedSeats([]);
    showToast('Payment verified successfully! Your tickets are confirmed.');
    setCurrentView('bookingSuccess');
  };

  // Cancel booking
  const handleCancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.bookingId === bookingId ? { ...b, status: 'CANCELLED' } : b))
    );
    showToast(`Booking ${bookingId} cancelled. Refund initiated.`);
  };

  // Handle Add Theatre
  const handleAddTheatre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTheatreName.trim() || !newTheatreLocation.trim()) {
      showToast('Please enter theatre name and location.');
      return;
    }

    const created: TheatreItem = {
      id: 'th_' + Date.now(),
      theatreName: newTheatreName.trim(),
      location: newTheatreLocation.trim(),
      balconySeatPrice: Number(newBalconyPrice) || 0,
      balconySeatCount: Number(newBalconyCount) || 40,
      middleSeatPrice: Number(newMiddlePrice) || 0,
      middleSeatCount: Number(newMiddleCount) || 60,
      lowerSeatPrice: Number(newLowerPrice) || 0,
      lowerSeatCount: Number(newLowerCount) || 50,
    };

    setTheatres((prev) => [...prev, created]);
    setNewTheatreName('');
    setNewTheatreLocation('');
    showToast(`Theatre ${created.theatreName} added successfully.`);
    setCurrentView('adminShows');
  };

  // Handle Add Show
  const handleAddShow = (e: React.FormEvent) => {
    e.preventDefault();
    const theatreObj = theatres.find((t) => t.theatreName === showTheatreName);
    const movieObj = movies.find((m) => m.movieName === showMovieName);

    const created: ShowItem = {
      id: 'sh_' + Date.now(),
      movieId: movieObj?.id || 'm_custom',
      movieName: showMovieName,
      theatreId: theatreObj?.id || 'th_custom',
      theatreName: showTheatreName,
      showdate: showDateInput,
      showtime: showTimeInput,
      tickets: {
        Balcony: theatreObj?.balconySeatPrice || 200,
        Middle: theatreObj?.middleSeatPrice || 150,
        Lower: theatreObj?.lowerSeatPrice || 100,
      },
    };

    setShows((prev) => [created, ...prev]);
    showToast(`Show for ${showMovieName} at ${showTheatreName} scheduled.`);
    setCurrentView('adminShows');
  };

  // Handle Add Movie
  const handleAddMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMovieName.trim() || !newMovieDesc.trim()) {
      showToast('Movie name and description are required.');
      return;
    }

    const created: MovieItem = {
      id: 'm_' + Date.now(),
      movieName: newMovieName.trim(),
      description: newMovieDesc.trim(),
      genres: newMovieGenres ? newMovieGenres.split(',').map((g) => g.trim()) : ['Action'],
      releaseDate: newMovieReleaseDate || 'Oct 20, 2026',
      runtime: Number(newMovieRuntime) || 120,
      certification: newMovieCertification || 'UA',
      posterUrl: POSTER_ODYSSEY,
      trailerUrl: newMovieTrailer,
      language: 'Hindi',
    };

    setMovies((prev) => [created, ...prev]);
    setNewMovieName('');
    setNewMovieDesc('');
    setNewMovieGenres('');
    showToast(`Movie ${created.movieName} added to catalogue.`);
    setCurrentView('adminMovies');
  };

  // Delete Movie (Admin)
  const handleDeleteMovie = (movieId: string) => {
    setMovies((prev) => prev.filter((m) => m.id !== movieId));
    showToast('Movie removed from catalogue.');
  };

  // Delete Show (Admin)
  const handleDeleteShow = (showId: string) => {
    setShows((prev) => prev.filter((s) => s.id !== showId));
    showToast('Show schedule removed.');
  };

  // Filtered movies
  const filteredMovies = movies.filter((m) => {
    const matchesSearch =
      m.movieName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGenre =
      selectedGenre === 'All' || m.genres.some((g) => g.toLowerCase().includes(selectedGenre.toLowerCase()));
    return matchesSearch && matchesGenre;
  });

  return (
    <div className={`min-h-screen ${isLightMode ? 'bg-[#F1F5F9] text-[#0F172A]' : 'bg-[#1E293B] text-white'}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#E90B3C] text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in font-medium text-sm">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP NAVBAR (Exact match to Screenshots) */}
      <header className="sticky top-0 z-40 bg-[#0F172A] border-b border-slate-800 px-6 py-3.5 flex items-center justify-between shadow-md">
        {/* Brand Logo with red 'i' */}
        <div
          onClick={() => setCurrentView('movies')}
          className="cursor-pointer flex items-center gap-1 select-none"
        >
          <span className="text-2xl font-black text-[#E90B3C]">i</span>
          <span className="text-2xl font-bold tracking-tight text-white">Movies</span>
        </div>

        {/* User View: Search Bar */}
        {userRole === 'USER' && (
          <div className="hidden md:flex items-center bg-[#202A3D] rounded-md px-3.5 py-1.5 w-96 border border-slate-700/50">
            <input
              type="text"
              placeholder="Search movies by title, genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-400 w-full"
            />
            <button
              onClick={() => showToast('Enter movie titles or genres to discover showtimes across theaters.')}
              className="text-[#E90B3C] hover:text-red-400 p-1"
              title="Search info"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Right Action Icons (Matching Screenshot) */}
        <div className="flex items-center gap-5">
          {/* Theme Toggle */}
          <button
            onClick={() => setIsLightMode(!isLightMode)}
            className="text-slate-300 hover:text-white transition-colors p-1"
            title="Toggle theme"
          >
            {isLightMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* User Role Navigation */}
          {userRole === 'USER' && (
            <>
              <button
                onClick={() => setCurrentView('movies')}
                className={`transition-colors p-1 ${
                  currentView === 'movies' ? 'text-[#E90B3C]' : 'text-slate-300 hover:text-white'
                }`}
                title="Home / Available Movies"
              >
                <Home className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCurrentView('favorites')}
                className={`transition-colors p-1 ${
                  currentView === 'favorites' ? 'text-[#E90B3C]' : 'text-slate-300 hover:text-white'
                }`}
                title="Favorites"
              >
                <Heart className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCurrentView('bookings')}
                className={`transition-colors p-1 ${
                  currentView === 'bookings' ? 'text-[#E90B3C]' : 'text-slate-300 hover:text-white'
                }`}
                title="Your Bookings"
              >
                <UserIcon className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Admin Role Navigation (Matches Admin Screenshots) */}
          {userRole === 'ADMIN' && (
            <>
              <button
                onClick={() => setCurrentView('movies')}
                className={`transition-colors p-1 ${
                  currentView === 'movies' ? 'text-[#E90B3C]' : 'text-slate-300 hover:text-white'
                }`}
                title="Customer Home View"
              >
                <Home className="w-5 h-5" />
              </button>

              <button
                onClick={() => setCurrentView('adminMovies')}
                className={`transition-colors p-1 ${
                  currentView === 'adminMovies' ? 'text-[#E90B3C]' : 'text-slate-300 hover:text-white'
                }`}
                title="Admin Available Movies"
              >
                <Film className="w-5 h-5" />
              </button>

              {/* Plus icon: Add Actions */}
              <div className="relative group">
                <button
                  onClick={() => setCurrentView('addMovie')}
                  className="text-slate-300 hover:text-[#E90B3C] p-1 flex items-center"
                  title="Add Actions"
                >
                  <PlusCircle className="w-5 h-5" />
                </button>
                <div className="absolute right-0 mt-2 w-44 bg-[#0F172A] border border-slate-700 rounded-md shadow-xl py-1 hidden group-hover:block z-50">
                  <button
                    onClick={() => setCurrentView('addMovie')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-[#202A3D] text-slate-200"
                  >
                    Add Movie
                  </button>
                  <button
                    onClick={() => setCurrentView('addTheatre')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-[#202A3D] text-slate-200"
                  >
                    Add Theatre
                  </button>
                  <button
                    onClick={() => setCurrentView('addShow')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-[#202A3D] text-slate-200"
                  >
                    Add Show
                  </button>
                </div>
              </div>

              <button
                onClick={() => setCurrentView('addTheatre')}
                className={`transition-colors p-1 ${
                  currentView === 'addTheatre' ? 'text-[#E90B3C]' : 'text-slate-300 hover:text-white'
                }`}
                title="Manage Theatres"
              >
                <span className="text-sm font-semibold">🎭</span>
              </button>

              <button
                onClick={() => setCurrentView('adminShows')}
                className={`transition-colors p-1 ${
                  currentView === 'adminShows' ? 'text-[#E90B3C]' : 'text-slate-300 hover:text-white'
                }`}
                title="Admin Shows & All Bookings"
              >
                <Clock className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Quick Role Switcher Pill for convenience */}
          <button
            onClick={() => {
              const next = userRole === 'USER' ? 'ADMIN' : 'USER';
              setUserRole(next);
              showToast(`Switched to ${next} portal.`);
              if (next === 'ADMIN') setCurrentView('adminShows');
              else setCurrentView('movies');
            }}
            className="text-xs font-semibold px-2.5 py-1 rounded bg-[#202A3D] border border-slate-700 text-slate-300 hover:text-white hover:border-[#E90B3C]"
            title="Toggle between User and Admin views"
          >
            {userRole === 'USER' ? 'Switch to Admin' : 'Switch to User'}
          </button>

          {/* Logout button */}
          <button
            onClick={() => {
              setCurrentView('welcome');
              showToast('Logged out successfully.');
            }}
            className="text-slate-300 hover:text-red-400 p-1"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ========================================================= */}
        {/* VIEW 1: WELCOME / LANDING (Matching Screenshot image (2)) */}
        {/* ========================================================= */}
        {currentView === 'welcome' && (
          <div className="flex flex-col items-start justify-center min-h-[70vh] max-w-2xl px-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
              Welcome to <span className="text-[#E90B3C]">iMovies</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 font-normal">
              Your ultimate destination for the latest blockbusters and timeless classics
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView('login')}
                className="bg-[#E90B3C] text-white px-8 py-2.5 rounded-full font-semibold text-sm hover:bg-red-700 shadow-lg shadow-red-900/30 transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentView('register')}
                className="bg-black text-white border border-white px-8 py-2.5 rounded-full font-semibold text-sm hover:bg-slate-900 transition-all"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: LOGIN (Matching Screenshot image (4))             */}
        {/* ========================================================= */}
        {currentView === 'login' && (
          <div className="flex justify-center items-center py-12">
            <div className="w-full max-w-md bg-[#1E293B] border border-[#E90B3C] rounded-lg p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-1 select-none mb-2">
                  <span className="text-3xl font-black text-[#E90B3C]">i</span>
                  <span className="text-3xl font-bold tracking-tight text-white">Movies</span>
                </div>
                <h2 className="text-xl font-medium text-white">Login</h2>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Login successful!');
                  setCurrentView('movies');
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-[#202A3D] text-white rounded-md px-3.5 py-2 text-sm border border-slate-700/60 focus:border-[#E90B3C] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#202A3D] text-white rounded-md px-3.5 py-2 text-sm border border-slate-700/60 focus:border-[#E90B3C] outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="showPassLogin"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="rounded bg-[#202A3D] border-slate-600 text-[#E90B3C] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="showPassLogin" className="text-xs text-slate-300 cursor-pointer">
                    Show Password
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#E90B3C] hover:bg-red-700 text-white font-semibold py-2 rounded-md text-sm transition-colors shadow-md"
                  >
                    Submit
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center text-xs text-slate-400">
                Create an account?{' '}
                <button
                  onClick={() => setCurrentView('register')}
                  className="text-[#E90B3C] font-semibold hover:underline"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: REGISTER (Matching Screenshot image (3))          */}
        {/* ========================================================= */}
        {currentView === 'register' && (
          <div className="flex justify-center items-center py-8">
            <div className="w-full max-w-md bg-[#1E293B] border border-[#E90B3C] rounded-lg p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-1 select-none mb-2">
                  <span className="text-3xl font-black text-[#E90B3C]">i</span>
                  <span className="text-3xl font-bold tracking-tight text-white">Movies</span>
                </div>
                <h2 className="text-xl font-medium text-white">Register</h2>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (regPassword !== regConfirmPassword) {
                    showToast('Passwords do not match.');
                    return;
                  }
                  showToast('Account created successfully!');
                  setCurrentView('movies');
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Username</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter Username"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full bg-[#202A3D] text-white rounded-md px-3.5 py-2 text-sm border border-slate-700/60 focus:border-[#E90B3C] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-[#202A3D] text-white rounded-md px-3.5 py-2 text-sm border border-slate-700/60 focus:border-[#E90B3C] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full bg-[#202A3D] text-white rounded-md px-3.5 py-2 text-sm border border-slate-700/60 focus:border-[#E90B3C] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Confirm your password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full bg-[#202A3D] text-white rounded-md px-3.5 py-2 text-sm border border-slate-700/60 focus:border-[#E90B3C] outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="showPassReg"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="rounded bg-[#202A3D] border-slate-600 text-[#E90B3C] focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="showPassReg" className="text-xs text-slate-300 cursor-pointer">
                    Show Password
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#E90B3C] hover:bg-red-700 text-white font-semibold py-2 rounded-md text-sm transition-colors shadow-md"
                  >
                    Submit
                  </button>
                </div>
              </form>

              <div className="mt-5 text-center text-xs text-slate-400 space-y-2">
                <div>
                  Already have an account?{' '}
                  <button
                    onClick={() => setCurrentView('login')}
                    className="text-[#E90B3C] font-semibold hover:underline"
                  >
                    Login
                  </button>
                </div>
                <div>
                  Register as an{' '}
                  <button
                    onClick={() => {
                      setUserRole('ADMIN');
                      showToast('Switched to Admin registration.');
                      setCurrentView('login');
                    }}
                    className="text-[#E90B3C] font-semibold hover:underline"
                  >
                    Admin
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 4: AVAILABLE MOVIES (Matching Screenshot image.png)  */}
        {/* ========================================================= */}
        {currentView === 'movies' && (
          <div>
            {/* Heading: Available Movies */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Available <span className="text-[#E90B3C]">Movies</span>
              </h1>
            </div>

            {/* Genre Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              {['All', 'Action', 'Drama', 'Historical', 'Fantasy', 'Comedy', 'Horror', 'Romantic', 'Thriller', 'Sci-Fi'].map(
                (g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGenre(g)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedGenre === g
                        ? 'bg-[#E90B3C] text-white shadow-md'
                        : 'bg-[#202A3D] text-slate-300 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {g}
                  </button>
                )
              )}
            </div>

            {/* Movie Poster Grid (Exactly as in image.png) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex flex-col group cursor-pointer transition-transform duration-200 hover:-translate-y-1"
                  onClick={() => handleBookMovie(movie)}
                >
                  {/* Poster Image */}
                  <div className="relative aspect-[3/4.2] w-full rounded-md overflow-hidden bg-[#0F172A] shadow-md border border-slate-800">
                    <img
                      src={movie.posterUrl}
                      alt={movie.movieName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e: any) => {
                        e.target.src = POSTER_ODYSSEY;
                      }}
                    />
                    {/* Favorite Heart Badge */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(movie.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 transition-colors"
                      title="Favorite"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.includes(movie.id) ? 'fill-[#E90B3C] text-[#E90B3C]' : 'text-white'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Title & Metadata */}
                  <div className="mt-2.5 flex flex-col">
                    <h3 className="text-sm font-semibold text-white truncate group-hover:text-[#E90B3C] transition-colors">
                      {movie.movieName}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{movie.releaseDate}</span>
                    </div>

                    {/* Genre Tag Pill (Reddish background as in screenshot) */}
                    <div className="mt-2">
                      <span className="inline-block bg-[#3B151F] text-[#FF4D6D] border border-[#5C1D2E] text-[11px] px-2 py-0.5 rounded font-medium truncate max-w-full">
                        {movie.genres.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 5: YOUR BOOKINGS (Matching Screenshot image (9))     */}
        {/* ========================================================= */}
        {currentView === 'bookings' && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Your <span className="text-[#E90B3C]">Bookings</span>
              </h1>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <p className="text-base mb-4">No bookings found in your account.</p>
                <button
                  onClick={() => setCurrentView('movies')}
                  className="bg-[#E90B3C] text-white px-6 py-2 rounded-md font-semibold text-sm hover:bg-red-700"
                >
                  Browse Available Movies
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-[#0F172A] border border-slate-800 rounded-lg p-4 flex gap-4 shadow-xl hover:border-slate-700 transition-colors"
                  >
                    {/* Left Poster */}
                    <div className="w-32 sm:w-36 aspect-[3/4.2] rounded overflow-hidden bg-slate-900 shrink-0">
                      <img
                        src={booking.posterUrl || HERO_BANNER}
                        alt={booking.movieName}
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.target.src = POSTER_ODYSSEY;
                        }}
                      />
                    </div>

                    {/* Right Details (Exact key-value pairs matching screenshot) */}
                    <div className="flex flex-col justify-between text-xs space-y-1.5 text-slate-300 w-full">
                      <div>
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-semibold text-white mb-1">
                            <span className="text-slate-400 font-normal">Movie: </span>
                            {booking.movieName}
                          </p>
                          {booking.status === 'CANCELLED' && (
                            <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-1.5 py-0.5 rounded">
                              Cancelled
                            </span>
                          )}
                        </div>

                        <p>
                          <span className="text-slate-400">Theatre: </span>
                          <span className="text-white">{booking.theatreName}</span>
                        </p>
                        <p>
                          <span className="text-slate-400">Showdate: </span>
                          <span className="text-white">{booking.showdate}</span>
                        </p>
                        <p>
                          <span className="text-slate-400">showtime: </span>
                          <span className="text-white">{booking.showtime}</span>
                        </p>
                        <p>
                          <span className="text-slate-400">{booking.tier}: </span>
                          <span className="text-white">{booking.seats.join(', ')}</span>
                        </p>
                        <p className="pt-1 text-sm font-bold text-white">
                          <span className="text-slate-400 font-normal text-xs">Total Price: </span>
                          {booking.totalPrice}₹
                        </p>
                      </div>

                      {/* Cancel Booking Action if confirmed */}
                      {booking.status === 'CONFIRMED' && (
                        <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                          <button
                            onClick={() => {
                              setConfirmedBookingData(booking);
                              setCurrentView('bookingSuccess');
                            }}
                            className="text-[#E90B3C] hover:underline flex items-center gap-1 text-[11px]"
                          >
                            <QrCode className="w-3.5 h-3.5" /> View Ticket
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.bookingId)}
                            className="text-slate-400 hover:text-red-400 text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 6: FAVORITES / WATCHLIST                             */}
        {/* ========================================================= */}
        {currentView === 'favorites' && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Your <span className="text-[#E90B3C]">Favorites</span>
              </h1>
            </div>

            {favorites.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Heart className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                <p className="text-base mb-4">You have not saved any favorite movies yet.</p>
                <button
                  onClick={() => setCurrentView('movies')}
                  className="bg-[#E90B3C] text-white px-6 py-2 rounded-md font-semibold text-sm hover:bg-red-700"
                >
                  Explore Movies
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {movies
                  .filter((m) => favorites.includes(m.id))
                  .map((movie) => (
                    <div
                      key={movie.id}
                      className="flex flex-col group cursor-pointer"
                      onClick={() => handleBookMovie(movie)}
                    >
                      <div className="aspect-[3/4.2] w-full rounded-md overflow-hidden bg-[#0F172A] shadow-md border border-slate-800 relative">
                        <img src={movie.posterUrl} alt={movie.movieName} className="w-full h-full object-cover" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(movie.id);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60"
                        >
                          <Heart className="w-4 h-4 fill-[#E90B3C] text-[#E90B3C]" />
                        </button>
                      </div>
                      <h3 className="mt-2 text-sm font-semibold text-white truncate">{movie.movieName}</h3>
                      <p className="text-xs text-slate-400">{movie.releaseDate}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 7: ADD THEATRE (Matching Screenshot image (8))       */}
        {/* ========================================================= */}
        {currentView === 'addTheatre' && (
          <div className="flex flex-col items-center py-6">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-6">
              Add <span className="text-[#E90B3C]">Theatre</span>
            </h1>

            <div className="w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-lg p-8 shadow-2xl">
              <form onSubmit={handleAddTheatre} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Theatre Name</label>
                  <input
                    type="text"
                    required
                    value={newTheatreName}
                    onChange={(e) => setNewTheatreName(e.target.value)}
                    placeholder="Enter theatre name"
                    className="w-full bg-[#202A3D] text-white rounded px-3.5 py-2 text-sm border border-slate-700/60 focus:border-[#E90B3C] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Theatre Location</label>
                  <input
                    type="text"
                    required
                    value={newTheatreLocation}
                    onChange={(e) => setNewTheatreLocation(e.target.value)}
                    placeholder="Enter theatre location"
                    className="w-full bg-[#202A3D] text-white rounded px-3.5 py-2 text-sm border border-slate-700/60 focus:border-[#E90B3C] outline-none"
                  />
                </div>

                {/* 2-Column Numeric Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Balcony Seat Price</label>
                    <input
                      type="number"
                      value={newBalconyPrice}
                      onChange={(e) => setNewBalconyPrice(Number(e.target.value))}
                      className="w-full bg-[#202A3D] text-white rounded px-3 py-2 text-sm border border-slate-700/60 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Balcony Seat Count</label>
                    <input
                      type="number"
                      value={newBalconyCount}
                      onChange={(e) => setNewBalconyCount(Number(e.target.value))}
                      className="w-full bg-[#202A3D] text-white rounded px-3 py-2 text-sm border border-slate-700/60 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Middle Seat Price</label>
                    <input
                      type="number"
                      value={newMiddlePrice}
                      onChange={(e) => setNewMiddlePrice(Number(e.target.value))}
                      className="w-full bg-[#202A3D] text-white rounded px-3 py-2 text-sm border border-slate-700/60 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Middle Seat Count</label>
                    <input
                      type="number"
                      value={newMiddleCount}
                      onChange={(e) => setNewMiddleCount(Number(e.target.value))}
                      className="w-full bg-[#202A3D] text-white rounded px-3 py-2 text-sm border border-slate-700/60 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Lower Seat Price</label>
                    <input
                      type="number"
                      value={newLowerPrice}
                      onChange={(e) => setNewLowerPrice(Number(e.target.value))}
                      className="w-full bg-[#202A3D] text-white rounded px-3 py-2 text-sm border border-slate-700/60 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Lower Seat Count</label>
                    <input
                      type="number"
                      value={newLowerCount}
                      onChange={(e) => setNewLowerCount(Number(e.target.value))}
                      className="w-full bg-[#202A3D] text-white rounded px-3 py-2 text-sm border border-slate-700/60 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <button
                    type="submit"
                    className="bg-[#E90B3C] hover:bg-red-700 text-white font-semibold px-8 py-2 rounded text-sm transition-colors shadow"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 8: ADD SHOW (Matching Screenshot image (7))          */}
        {/* ========================================================= */}
        {currentView === 'addShow' && (
          <div className="flex flex-col items-center py-6">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-6">
              Add <span className="text-[#E90B3C]">Show</span>
            </h1>

            <div className="w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-lg p-8 shadow-2xl">
              <form onSubmit={handleAddShow} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Theatres</label>
                  <select
                    value={showTheatreName}
                    onChange={(e) => setShowTheatreName(e.target.value)}
                    className="w-full bg-[#202A3D] text-white rounded px-3.5 py-2 text-sm border border-slate-700/60 focus:border-[#E90B3C] outline-none"
                  >
                    {theatres.map((t) => (
                      <option key={t.id} value={t.theatreName}>
                        {t.theatreName} ({t.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Movies</label>
                  <select
                    value={showMovieName}
                    onChange={(e) => setShowMovieName(e.target.value)}
                    className="w-full bg-[#202A3D] text-white rounded px-3.5 py-2 text-sm border border-slate-700/60 focus:border-[#E90B3C] outline-none"
                  >
                    {movies.map((m) => (
                      <option key={m.id} value={m.movieName}>
                        {m.movieName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Show Date</label>
                  <input
                    type="date"
                    required
                    value={showDateInput}
                    onChange={(e) => setShowDateInput(e.target.value)}
                    className="w-full bg-[#202A3D] text-white rounded px-3.5 py-2 text-sm border border-slate-700/60 focus:border-[#E90B3C] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Showtime</label>
                  <input
                    type="time"
                    required
                    value={showTimeInput}
                    onChange={(e) => setShowTimeInput(e.target.value)}
                    className="w-full bg-[#202A3D] text-white rounded px-3.5 py-2 text-sm border border-slate-700/60 focus:border-[#E90B3C] outline-none"
                  />
                </div>

                <div className="pt-4 text-center">
                  <button
                    type="submit"
                    className="bg-[#E90B3C] hover:bg-red-700 text-white font-semibold px-8 py-2 rounded text-sm transition-colors shadow"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 9: ADD MOVIE (Matching Screenshot image (5))         */}
        {/* ========================================================= */}
        {currentView === 'addMovie' && (
          <div className="flex flex-col items-center py-6">
            {/* Top red-bordered poster upload area (Matching Screenshot) */}
            <div className="w-80 h-36 border border-[#E90B3C] rounded-lg mb-4 flex items-center justify-center bg-[#0F172A]/40 text-slate-400">
              <span className="text-xs">Movie Poster Upload Preview</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-white mb-6">
              Add <span className="text-[#E90B3C]">Movie</span>
            </h1>

            <div className="w-full max-w-xl bg-[#0F172A] border border-slate-800 rounded-lg p-8 shadow-2xl">
              <form onSubmit={handleAddMovie} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Movie</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter movie name"
                      value={newMovieName}
                      onChange={(e) => setNewMovieName(e.target.value)}
                      className="w-full bg-[#202A3D] text-white rounded px-3 py-2 text-sm border border-slate-700/60 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter movie description"
                      value={newMovieDesc}
                      onChange={(e) => setNewMovieDesc(e.target.value)}
                      className="w-full bg-[#202A3D] text-white rounded px-3 py-2 text-sm border border-slate-700/60 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Genres</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter movie genres separated by comma"
                      value={newMovieGenres}
                      onChange={(e) => setNewMovieGenres(e.target.value)}
                      className="w-full bg-[#202A3D] text-white rounded px-3 py-2 text-sm border border-slate-700/60 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Release Date</label>
                    <input
                      type="date"
                      required
                      value={newMovieReleaseDate}
                      onChange={(e) => setNewMovieReleaseDate(e.target.value)}
                      className="w-full bg-[#202A3D] text-white rounded px-3 py-2 text-sm border border-slate-700/60 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Runtime</label>
                    <input
                      type="number"
                      placeholder="Enter runtime in minutes"
                      value={newMovieRuntime}
                      onChange={(e) => setNewMovieRuntime(Number(e.target.value))}
                      className="w-full bg-[#202A3D] text-white rounded px-3 py-2 text-sm border border-slate-700/60 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Certification</label>
                    <input
                      type="text"
                      placeholder="Enter movie certification (e.g. UA, A)"
                      value={newMovieCertification}
                      onChange={(e) => setNewMovieCertification(e.target.value)}
                      className="w-full bg-[#202A3D] text-white rounded px-3 py-2 text-sm border border-slate-700/60 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Trailer URL (YouTube)</label>
                  <input
                    type="url"
                    placeholder="https://www.youtube.com/..."
                    value={newMovieTrailer}
                    onChange={(e) => setNewMovieTrailer(e.target.value)}
                    className="w-full bg-[#202A3D] text-white rounded px-3 py-2 text-sm border border-slate-700/60 outline-none"
                  />
                </div>

                <div className="pt-4 text-center">
                  <button
                    type="submit"
                    className="bg-[#E90B3C] hover:bg-red-700 text-white font-semibold px-8 py-2 rounded text-sm transition-colors shadow"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 10: ADMIN SHOWS & ALL BOOKINGS (Matching image (6))  */}
        {/* ========================================================= */}
        {currentView === 'adminShows' && (
          <div className="space-y-12">
            {/* Section 1: Admin Shows */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-6">
                Admin <span className="text-[#E90B3C]">Shows</span>
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {shows.map((show) => (
                  <div
                    key={show.id}
                    className="bg-[#0F172A] border border-slate-800 rounded-lg p-4 flex flex-col justify-between shadow-lg relative group"
                  >
                    <div className="flex items-start gap-2.5">
                      <Video className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                      <div className="text-xs space-y-1 text-slate-300">
                        <p>
                          <span className="text-slate-400">Movie: </span>
                          <span className="text-white font-semibold">{show.movieName}</span>
                        </p>
                        <p>
                          <span className="text-slate-400">Theatre: </span>
                          <span className="text-white">{show.theatreName}</span>
                        </p>
                        <p>
                          <span className="text-slate-400">Showdate: </span>
                          <span className="text-white">{show.showdate}</span>
                        </p>
                        <p>
                          <span className="text-slate-400">Showtime: </span>
                          <span className="text-white">{show.showtime}</span>
                        </p>
                      </div>
                    </div>

                    {/* Red Outline Trash Button (Exact match to image (6)) */}
                    <div className="mt-4 pt-3 border-t border-slate-800">
                      <button
                        onClick={() => handleDeleteShow(show.id)}
                        className="w-full border border-[#E90B3C] text-[#E90B3C] hover:bg-[#E90B3C] hover:text-white py-1.5 rounded flex items-center justify-center transition-colors text-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: All Bookings (Matches image (6)) */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-6">
                All <span className="text-[#E90B3C]">Bookings</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-[#0F172A] border border-slate-800 rounded-lg p-4 shadow-lg text-xs space-y-1.5 text-slate-300"
                  >
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
                      <Video className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-400">User: </span>
                      <span className="text-white font-medium">{booking.userEmail}</span>
                    </div>
                    <p>
                      <span className="text-slate-400">Movie: </span>
                      <span className="text-white">{booking.movieName}</span>
                    </p>
                    <p>
                      <span className="text-slate-400">Theatre: </span>
                      <span className="text-white">{booking.theatreName}</span>
                    </p>
                    <p>
                      <span className="text-slate-400">Showdate & Time: </span>
                      <span className="text-white">
                        {booking.showdate} ({booking.showtime})
                      </span>
                    </p>
                    <p>
                      <span className="text-slate-400">Seats: </span>
                      <span className="text-white">{booking.seats.join(', ')}</span>
                    </p>
                    <p className="font-semibold text-white">
                      <span className="text-slate-400 font-normal">Total Price: </span>
                      {booking.totalPrice}₹
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 11: ADMIN AVAILABLE MOVIES (Matching image (1))      */}
        {/* ========================================================= */}
        {currentView === 'adminMovies' && (
          <div>
            {/* Red Banner Strip (Exact match to image (1)) */}
            <div className="w-full bg-[#E90B3C] text-white py-3.5 px-4 text-center font-bold text-2xl tracking-tight shadow-md mb-8 rounded-sm">
              Available Movies
            </div>

            {/* Poster Grid with Circular White Badge & Red Trash Can on top right */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {movies.map((movie) => (
                <div key={movie.id} className="flex flex-col relative group">
                  {/* Poster Image with Delete Badge */}
                  <div className="relative aspect-[3/4.2] w-full rounded-md overflow-hidden bg-[#0F172A] shadow-md border border-slate-800">
                    <img
                      src={movie.posterUrl}
                      alt={movie.movieName}
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.src = POSTER_ODYSSEY;
                      }}
                    />

                    {/* Circular White badge with red trash can (Exact match to image (1)) */}
                    <button
                      onClick={() => handleDeleteMovie(movie.id)}
                      className="absolute top-2.5 right-2.5 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                      title="Delete movie"
                    >
                      <Trash2 className="w-4 h-4 text-[#E90B3C]" />
                    </button>
                  </div>

                  {/* Title & Release date */}
                  <div className="mt-2 text-left">
                    <h3 className="text-sm font-semibold text-white truncate">{movie.movieName}</h3>
                    <p className="text-xs text-slate-400">{movie.releaseDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 12: INTERACTIVE SEAT SELECTION & CONCURRENCY LOCK   */}
        {/* ========================================================= */}
        {currentView === 'seatSelection' && selectedMovieForBooking && selectedShowForBooking && (
          <div className="max-w-4xl mx-auto py-4">
            {/* Header info */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-5 mb-6 flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedMovieForBooking.movieName}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  {selectedShowForBooking.theatreName} • {selectedShowForBooking.showdate} at{' '}
                  {selectedShowForBooking.showtime}
                </p>
              </div>

              {/* Tier Selector */}
              <div className="flex items-center gap-2">
                {(['Balcony', 'Middle', 'Lower'] as const).map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                      selectedTier === tier
                        ? 'bg-[#E90B3C] text-white shadow'
                        : 'bg-[#202A3D] text-slate-300 hover:text-white'
                    }`}
                  >
                    {tier} (₹
                    {tier === 'Balcony'
                      ? selectedShowForBooking.tickets.Balcony
                      : tier === 'Middle'
                      ? selectedShowForBooking.tickets.Middle
                      : selectedShowForBooking.tickets.Lower}
                    )
                  </button>
                ))}
              </div>
            </div>

            {/* Cinema Screen Indicator */}
            <div className="text-center mb-8">
              <div className="w-3/4 mx-auto h-2 bg-gradient-to-r from-transparent via-[#E90B3C] to-transparent rounded-full opacity-80 mb-2"></div>
              <span className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                All Eyes This Way — Cinema Screen
              </span>
            </div>

            {/* Interactive Seat Matrix */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-8 mb-6 shadow-2xl overflow-x-auto">
              <div className="min-w-[500px] flex flex-col items-center gap-3">
                {/* Balcony Rows: A, B */}
                <div className="text-xs text-slate-400 font-semibold mb-1">BALCONY TIER (₹{selectedShowForBooking.tickets.Balcony})</div>
                {['A', 'B'].map((row) => (
                  <div key={row} className="flex items-center gap-2">
                    <span className="w-5 text-xs text-slate-400 font-mono text-right">{row}</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                        const seatCode = `${row}${num}`;
                        const isSelected = selectedSeats.includes(seatCode);
                        const isBooked = ['A3', 'A4', 'B8'].includes(seatCode);

                        return (
                          <button
                            key={seatCode}
                            disabled={isBooked}
                            onClick={() => handleSeatClick(seatCode)}
                            className={`w-7 h-7 rounded text-[10px] font-mono font-semibold transition-all flex items-center justify-center ${
                              isBooked
                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                : isSelected
                                ? 'bg-[#E90B3C] text-white scale-110 shadow-lg shadow-red-900/50'
                                : 'bg-[#202A3D] text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Middle Rows: C, D, E */}
                <div className="text-xs text-slate-400 font-semibold mt-4 mb-1">MIDDLE TIER (₹{selectedShowForBooking.tickets.Middle})</div>
                {['C', 'D', 'E'].map((row) => (
                  <div key={row} className="flex items-center gap-2">
                    <span className="w-5 text-xs text-slate-400 font-mono text-right">{row}</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                        const seatCode = `${row}${num}`;
                        const isSelected = selectedSeats.includes(seatCode);
                        const isBooked = ['C5', 'D2', 'D3'].includes(seatCode);

                        return (
                          <button
                            key={seatCode}
                            disabled={isBooked}
                            onClick={() => handleSeatClick(seatCode)}
                            className={`w-7 h-7 rounded text-[10px] font-mono font-semibold transition-all flex items-center justify-center ${
                              isBooked
                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                : isSelected
                                ? 'bg-[#E90B3C] text-white scale-110 shadow-lg shadow-red-900/50'
                                : 'bg-[#202A3D] text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Lower Rows: F, G */}
                <div className="text-xs text-slate-400 font-semibold mt-4 mb-1">LOWER TIER (₹{selectedShowForBooking.tickets.Lower})</div>
                {['F', 'G'].map((row) => (
                  <div key={row} className="flex items-center gap-2">
                    <span className="w-5 text-xs text-slate-400 font-mono text-right">{row}</span>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                        const seatCode = `${row}${num}`;
                        const isSelected = selectedSeats.includes(seatCode);

                        return (
                          <button
                            key={seatCode}
                            onClick={() => handleSeatClick(seatCode)}
                            className={`w-7 h-7 rounded text-[10px] font-mono font-semibold transition-all flex items-center justify-center ${
                              isSelected
                                ? 'bg-[#E90B3C] text-white scale-110 shadow-lg shadow-red-900/50'
                                : 'bg-[#202A3D] text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Seat Status Legend */}
              <div className="flex justify-center items-center gap-6 mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#202A3D]"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-[#E90B3C]"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-slate-800"></div>
                  <span>Booked / Unavailable</span>
                </div>
              </div>
            </div>

            {/* Bottom Bar: Selection Summary & Action */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-lg p-5 flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-xs text-slate-400">Selected Seats ({selectedSeats.length})</p>
                <p className="text-base font-bold text-white">
                  {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-slate-400">Estimated Total</p>
                <p className="text-xl font-bold text-[#E90B3C]">
                  {selectedSeats.length *
                    (selectedTier === 'Balcony'
                      ? selectedShowForBooking.tickets.Balcony
                      : selectedTier === 'Middle'
                      ? selectedShowForBooking.tickets.Middle
                      : selectedShowForBooking.tickets.Lower)}
                  ₹
                </p>
              </div>

              <button
                disabled={selectedSeats.length === 0}
                onClick={handleLockSeats}
                className="bg-[#E90B3C] disabled:bg-slate-800 disabled:text-slate-500 hover:bg-red-700 text-white font-semibold px-8 py-2.5 rounded-md text-sm transition-colors shadow-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 13: CHECKOUT & SYNCHRONIZED 10-MIN TIMER             */}
        {/* ========================================================= */}
        {currentView === 'checkout' && selectedShowForBooking && (
          <div className="max-w-xl mx-auto py-8">
            {/* 10-Minute Lock Banner */}
            <div className="bg-[#202A3D] border border-amber-600/60 rounded-lg p-4 mb-6 flex items-center justify-between text-amber-300">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-xs font-medium">Temporary Lock Active — Complete booking before expiry</span>
              </div>
              <span className="text-lg font-mono font-bold text-amber-400">
                {formatCountdown(lockCountdown)}
              </span>
            </div>

            <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-8 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-3">
                Booking Summary & Payment
              </h2>

              <div className="space-y-3 text-sm text-slate-300 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-400">Movie</span>
                  <span className="text-white font-semibold">{selectedShowForBooking.movieName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Theatre</span>
                  <span className="text-white">{selectedShowForBooking.theatreName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Show Date & Time</span>
                  <span className="text-white">
                    {selectedShowForBooking.showdate} • {selectedShowForBooking.showtime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Seat Category</span>
                  <span className="text-white">{selectedTier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Seats ({selectedSeats.length})</span>
                  <span className="text-white font-mono">{selectedSeats.join(', ')}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-slate-800">
                  <span className="text-slate-400">Convenience Fee & GST</span>
                  <span className="text-white font-mono">₹20</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-base font-bold">
                  <span className="text-white">Total Amount</span>
                  <span className="text-[#E90B3C] font-mono">
                    {selectedSeats.length *
                      (selectedTier === 'Balcony'
                        ? selectedShowForBooking.tickets.Balcony
                        : selectedTier === 'Middle'
                        ? selectedShowForBooking.tickets.Middle
                        : selectedShowForBooking.tickets.Lower) +
                      20}
                    ₹
                  </span>
                </div>
              </div>

              {/* Payment Gateway Options */}
              <div className="space-y-3 mb-6">
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#202A3D] border border-[#E90B3C] rounded-lg p-3 flex items-center gap-3 cursor-pointer">
                    <CreditCard className="w-5 h-5 text-[#E90B3C]" />
                    <span className="text-xs font-semibold text-white">Razorpay / UPI</span>
                  </div>
                  <div className="bg-[#202A3D] border border-slate-700/60 rounded-lg p-3 flex items-center gap-3 cursor-pointer opacity-80">
                    <CreditCard className="w-5 h-5 text-slate-400" />
                    <span className="text-xs text-slate-300">Stripe / Cards</span>
                  </div>
                </div>
              </div>

              {/* Submit Payment */}
              <button
                onClick={handleCompletePayment}
                className="w-full bg-[#E90B3C] hover:bg-red-700 text-white font-bold py-3 rounded-lg text-sm transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Confirm & Pay Securely</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 14: BOOKING CONFIRMATION & DIGITAL TICKET VOUCHER    */}
        {/* ========================================================= */}
        {currentView === 'bookingSuccess' && confirmedBookingData && (
          <div className="max-w-lg mx-auto py-8">
            <div className="text-center mb-6">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto mb-2" />
              <h2 className="text-2xl font-bold text-white">Booking Confirmed!</h2>
              <p className="text-xs text-slate-400 mt-1">
                Your ticket receipt and admission voucher has been issued.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="bg-[#0F172A] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-[#E90B3C] text-white px-6 py-3 flex justify-between items-center">
                <span className="font-bold text-sm tracking-wide">iMovies Digital Pass</span>
                <span className="font-mono text-xs">{confirmedBookingData.bookingId}</span>
              </div>

              <div className="p-6 space-y-4 text-xs text-slate-300">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-white">{confirmedBookingData.movieName}</h3>
                    <p className="text-slate-400">{confirmedBookingData.theatreName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{confirmedBookingData.showdate}</p>
                    <p className="text-slate-400">{confirmedBookingData.showtime}</p>
                  </div>
                </div>

                <div className="p-3 bg-[#202A3D] rounded border border-slate-700/60 flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 block text-[11px]">{confirmedBookingData.tier}</span>
                    <span className="text-white font-mono font-bold text-sm">
                      {confirmedBookingData.seats.join(', ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[11px]">Total Paid</span>
                    <span className="text-emerald-400 font-mono font-bold text-sm">
                      ₹{confirmedBookingData.totalPrice}
                    </span>
                  </div>
                </div>

                {/* QR Code Graphic */}
                <div className="pt-2 text-center flex flex-col items-center">
                  <div className="p-3 bg-white rounded-lg inline-block shadow">
                    <QrCode className="w-24 h-24 text-slate-900" />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono mt-2">
                    {confirmedBookingData.qrCode}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex justify-between items-center">
                <button
                  onClick={() => setCurrentView('bookings')}
                  className="text-xs text-[#E90B3C] hover:underline font-semibold"
                >
                  View All Your Bookings
                </button>
                <button
                  onClick={() => setCurrentView('movies')}
                  className="bg-[#202A3D] text-white px-4 py-1.5 rounded text-xs hover:bg-slate-700"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-slate-800 bg-[#0F172A] py-6 px-4 text-center text-xs text-slate-500">
        <p>© 2026 iMovies — Movie Ticket Booking Made Simple. All rights reserved.</p>
        <p className="mt-1">
          Backend API running on port 8000 (MongoDB: Imovies) • Vite Client on port 5173
        </p>
      </footer>
    </div>
  );
}

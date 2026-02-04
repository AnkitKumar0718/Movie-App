import React, { useState, useEffect } from 'react';
import MovieSection from '../components/MovieSection';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Play, Info, Star, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const HomePage = () => {
    const [sections, setSections] = useState({
        trending: [],
        popular: [],
        topRated: []
    });
    const [heroMovies, setHeroMovies] = useState([]);
    const [heroIndex, setHeroIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleProtectedAction = (e, path) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login', { state: { from: { pathname: path } } });
        } else {
            navigate(path);
        }
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                const [trendingRes, popularRes, topRatedRes] = await Promise.all([
                    fetch(`${process.env.REACT_APP_TMDB_BASE_URL}/trending/movie/week?api_key=${process.env.REACT_APP_TMDB_API_KEY}`),
                    fetch(`${process.env.REACT_APP_TMDB_BASE_URL}/movie/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}`),
                    fetch(`${process.env.REACT_APP_TMDB_BASE_URL}/movie/top_rated?api_key=${process.env.REACT_APP_TMDB_API_KEY}`)
                ]);

                if (!trendingRes.ok || !popularRes.ok || !topRatedRes.ok) {
                    throw new Error('Failed to fetch some movie sections');
                }

                const [trendingData, popularData, topRatedData] = await Promise.all([
                    trendingRes.json(),
                    popularRes.json(),
                    topRatedRes.json()
                ]);

                setSections({
                    trending: trendingData.results,
                    popular: popularData.results,
                    topRated: topRatedData.results
                });

                // Pick first 5 trending movies for Hero Carousel
                if (trendingData.results.length > 0) {
                    setHeroMovies(trendingData.results.slice(0, 5));
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Auto-scroll Hero every 2 seconds
    useEffect(() => {
        if (heroMovies.length > 0) {
            const interval = setInterval(() => {
                setHeroIndex((prev) => (prev + 1) % heroMovies.length);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [heroMovies]);

    // Scroll to section based on URL path
    useEffect(() => {
        const path = location.pathname.split('/')[1];
        if (path) {
            const element = document.getElementById(path);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location.pathname, loading]);

    const handlePrev = () => {
        setHeroIndex((prev) => (prev === 0 ? heroMovies.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setHeroIndex((prev) => (prev + 1) % heroMovies.length);
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-l-4 border-blue-600 border-r-transparent border-b-transparent"></div>
            <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading AKmovie Experience</p>
        </div>
    );

    if (error) return (
        // ... (error UI same as before)
        <div className="bg-red-50 dark:bg-red-900/10 p-10 rounded-3xl border border-red-200 dark:border-red-800/50 text-center my-10 max-w-2xl mx-auto shadow-2xl">
            <div className="bg-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/50">
                <Info className="w-8 h-8 text-white" />
            </div>
            <p className="text-red-600 dark:text-red-400 text-2xl font-black mb-4 uppercase italic">Connection Refused</p>
            <p className="text-red-500 dark:text-red-500/70 font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-8 bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors">
                Retry Connection
            </button>
        </div>
    );

    const currentHero = heroMovies[heroIndex];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 -mt-8"
        >
            {/* Hero Section Carousel */}
            {currentHero && (
                <section className="relative h-[80vh] w-full overflow-hidden rounded-[2rem] shadow-2xl group/hero">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentHero.id}
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/original${currentHero.backdrop_path}`}
                                alt={currentHero.title}
                                className="w-full h-full object-cover transition-transform duration-[10s] group-hover/hero:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-3xl space-y-6">
                                <motion.div
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-4"
                                >
                                    <span className="px-4 py-1.5 bg-blue-600 text-white text-xs font-black rounded-full uppercase tracking-tighter shadow-lg shadow-blue-500/50">
                                        Trending Original
                                    </span>
                                    <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
                                        <Star className="w-5 h-5 fill-current" />
                                        {currentHero.vote_average?.toFixed(1)}
                                    </div>
                                </motion.div>

                                <motion.h1
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-5xl md:text-7xl font-black text-white leading-none uppercase tracking-tighter italic"
                                >
                                    {currentHero.title}
                                </motion.h1>

                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-lg text-gray-300 line-clamp-3 md:line-clamp-none max-w-xl font-medium leading-relaxed"
                                >
                                    {currentHero.overview}
                                </motion.p>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex flex-wrap gap-4 pt-4"
                                >
                                    <button
                                        onClick={(e) => handleProtectedAction(e, `/movie/${currentHero.id}`)}
                                        className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-xl"
                                    >
                                        <Play className="w-6 h-6 fill-current" /> Play Trailer
                                    </button>
                                    <button
                                        onClick={(e) => handleProtectedAction(e, `/movie/${currentHero.id}`)}
                                        className="flex items-center gap-3 bg-white/10 backdrop-blur-xl text-white border border-white/20 px-10 py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-white/20 transition-all duration-300"
                                    >
                                        <Info className="w-6 h-6" /> More Info
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Carousel Controls */}
                    <div className="absolute bottom-10 right-8 md:right-16 flex gap-4 z-30">
                        <button onClick={handlePrev}
                            className="p-3 rounded-2xl  backdrop-blur-xl border
                    border-white/20 text-white hover:bg-blue-600  transition-all hover:scale-110"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="p-3 rounded-2xl  backdrop-blur-xl border
                    border-white/20 text-white hover:bg-blue-600 transition-all hover:scale-110"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Indicators */}
                    <div className="absolute bottom-10 left-8 md:left-16 flex gap-2 z-30">
                        {heroMovies.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 transition-all duration-300 rounded-full ${i === heroIndex ? 'w-8 bg-blue-600' : 'w-4 bg-white/30'}`}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Movie Sections */}
            <div className="px-4 space-y-4 pt-10">
                <div id="trending">
                    <MovieSection title="Trending Now" movies={sections.trending} />
                </div>
                <div id="popular">
                    <MovieSection title="Global Hits" movies={sections.popular} />
                </div>
                <div id="topRated">
                    <MovieSection title="Critic Choice" movies={sections.topRated} />
                </div>
            </div>
        </motion.div>
    );
};

export default HomePage;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Calendar, Star, Clock, ArrowLeft, Heart, Film, Globe, DollarSign } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.REACT_APP_TMDB_BASE_URL}/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&append_to_response=videos,recommendations`);
                const data = await res.json();
                setMovie(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMovieDetails();
    }, [id]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-r-transparent border-b-transparent"></div>
        </div>
    );

    if (!movie) return <div className="text-center py-20 font-black uppercase text-2xl dark:text-white">Movie not found</div>;

    const isWishlisted = isInWishlist(movie.id);
    const trailer = movie.videos?.results?.find(v => v.type === 'Trailer' || v.type === 'Teaser');

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pb-20"
        >
            {/* Hero Backdrop */}
            <div className="relative h-[60vh] md:h-[75vh] w-full -mt-8 overflow-hidden rounded-b-[3rem] shadow-2xl">
                <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                <div className="absolute top-10 left-8 z-10">
                    <Link to="/" className="flex items-center gap-2 bg-black/40 backdrop-blur-xl text-white px-5 py-2.5 rounded-2xl font-bold border border-white/10 hover:bg-white/20 transition-all">
                        <ArrowLeft className="w-5 h-5" /> Back
                    </Link>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-screen-2xl mx-auto px-4 -mt-40 md:-mt-60 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Poster Card */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-full lg:w-1/3 shrink-0"
                    >
                        <div className="relative group">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full rounded-3xl shadow-2xl border-4 border-white/10 dark:border-slate-800/50"
                            />
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </motion.div>

                    {/* Details */}
                    <div className="flex-1 space-y-8 lg:pt-20">
                        <motion.div
                            initial={{ x: 30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-[0.9] uppercase tracking-tighter italic mb-4">
                                {movie.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-blue-600 dark:text-blue-400 font-bold italic opacity-80">
                                {movie.tagline}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-wrap gap-4"
                        >
                            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 rounded-xl font-black border border-yellow-500/20">
                                <Star className="w-4 h-4 fill-current" /> {movie.vote_average?.toFixed(1)}
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl font-bold border border-blue-500/20">
                                <Calendar className="w-4 h-4" /> {movie.release_date?.split('-')[0]}
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl font-bold border border-purple-500/20">
                                <Clock className="w-4 h-4" /> {movie.runtime}m
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl font-bold border border-green-500/20">
                                <Globe className="w-4 h-4" /> {movie.original_language?.toUpperCase()}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-4"
                        >
                            <h3 className="text-xl font-black uppercase tracking-wider text-gray-400 dark:text-slate-600 italic">Overview</h3>
                            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                {movie.overview}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-wrap gap-4 pt-6"
                        >
                            {trailer && (
                                <a
                                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-tighter hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/40"
                                >
                                    <Play className="w-6 h-6 fill-current" /> Watch Trailer
                                </a>
                            )}
                            <button
                                onClick={() => isWishlisted ? removeFromWishlist(movie.id) : addToWishlist(movie)}
                                className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-black uppercase tracking-tighter transition-all border-2 ${isWishlisted
                                    ? 'bg-red-500 border-red-500 text-white shadow-xl shadow-red-500/30'
                                    : 'bg-white/5 dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                                {isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="grid grid-cols-2 sm:grid-cols-4 gap-8 pt-10 border-t border-gray-100 dark:border-slate-800"
                        >
                            <div>
                                <p className="text-xs font-black uppercase text-gray-400 dark:text-slate-600 tracking-[0.2em] mb-2">Revenue</p>
                                <p className="text-2xl font-bold dark:text-white">${(movie.revenue / 1000000).toFixed(1)}M</p>
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase text-gray-400 dark:text-slate-600 tracking-[0.2em] mb-2">Budget</p>
                                <p className="text-2xl font-bold dark:text-white">${(movie.budget / 1000000).toFixed(1)}M</p>
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase text-gray-400 dark:text-slate-600 tracking-[0.2em] mb-2">Status</p>
                                <p className="text-2xl font-bold dark:text-white">{movie.status}</p>
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase text-gray-400 dark:text-slate-600 tracking-[0.2em] mb-2">Genres</p>
                                <div className="flex flex-wrap gap-1">
                                    {movie.genres?.slice(0, 2).map(g => (
                                        <span key={g.id} className="text-sm font-bold bg-blue-500/10 text-blue-600 py-1 px-2 rounded-lg">{g.name}</span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MovieDetails;

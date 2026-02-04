import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, Play, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';

const MovieCard = ({ movie }) => {
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isWishlisted = isInWishlist(movie.id);

    const handleProtectedAction = (e, callback, path = `/movie/${movie.id}`) => {
        e.stopPropagation();
        if (!user) {
            navigate('/login', { state: { from: { pathname: path } } });
        } else {
            if (callback) callback();
            else navigate(path);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={(e) => handleProtectedAction(e)}
            className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 cursor-pointer"
        >
            {/* Poster Image */}
            <div className="relative aspect-[2/3] overflow-hidden">
                <motion.img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />

                {/* Quality Tag */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-blue-600/90 backdrop-blur-md rounded-lg text-[10px] font-black text-white uppercase tracking-widest z-10">
                    HD
                </div>

                {/* Rating Overlay */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-xs font-bold text-yellow-500 z-10">
                    <Star className="w-3 h-3 fill-current" />
                    {movie.vote_average?.toFixed(1)}
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                    <motion.div
                        initial={{ scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                        className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/50"
                    >
                        <Play className="w-8 h-8 text-white fill-current translate-x-1" />
                    </motion.div>
                </div>

                {/* Bottom Fade */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1 gap-2">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-gray-800 dark:text-gray-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {movie.title}
                    </h3>
                    <button
                        onClick={(e) => handleProtectedAction(e, () => isWishlisted ? removeFromWishlist(movie.id) : addToWishlist(movie), location.pathname)}
                        className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <Heart className={`w-5 h-5 transition-all ${isWishlisted ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400 dark:text-gray-600 hover:text-red-400'}`} />
                    </button>
                </div>

                <div className="flex items-center gap-3 mt-auto">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                        {movie.release_date?.split('-')[0]}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-700" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                        {movie.original_language?.toUpperCase()}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default MovieCard;

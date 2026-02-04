import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import MovieCard from '../components/MovieCard';
import { HeartOff, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const WishlistPage = () => {
    const { wishlist } = useWishlist();

    if (wishlist.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full" />
                    <HeartOff className="w-24 h-24 text-gray-200 dark:text-slate-800 relative z-10" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Your Library is Empty</h2>
                    <p className="text-gray-500 dark:text-slate-500 font-medium max-w-sm mx-auto">
                        Curate your personal collection of cinematic masterpieces.
                    </p>
                </div>
                <Link
                    to="/"
                    className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-tighter transition-all shadow-xl shadow-blue-500/30"
                >
                    Explore Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </motion.div>
        );
    }

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-1.5 bg-red-500 rounded-full" />
                        <span className="text-sm font-black uppercase tracking-[0.3em] text-red-500">Personal Collection</span>
                    </div>
                    <h2 className="text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
                        My Wishlist
                    </h2>
                </div>
                <div className="px-6 py-2 bg-gray-100 dark:bg-slate-900 rounded-xl">
                    <span className="text-2xl font-black text-blue-600">{wishlist.length}</span>
                    <span className="ml-2 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-600">Items saved</span>
                </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {wishlist.map((movie) => (
                    <div key={movie.id}>
                        <MovieCard movie={movie} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WishlistPage;

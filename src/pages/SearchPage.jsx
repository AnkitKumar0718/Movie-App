import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { Search, Loader2, Film } from 'lucide-react';
import { motion } from 'framer-motion';

const SearchPage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q');

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;
            try {
                setLoading(true);
                const res = await fetch(`${process.env.REACT_APP_TMDB_BASE_URL}/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
                if (!res.ok) throw new Error('Search failed');
                const data = await res.json();
                setMovies(data.results);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    if (!query) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <Search className="w-16 h-16 text-gray-300 dark:text-slate-800" />
            <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter italic">Enter a movie title to search</h2>
        </div>
    );

    return (
        <div className="space-y-12">
            <header className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
                    <span className="text-sm font-black uppercase tracking-[0.3em] text-blue-600">Search Results</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
                    Showing for: <span className="text-blue-600">"{query}"</span>
                </h2>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Scanning Database...</p>
                </div>
            ) : movies.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
                >
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </motion.div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-6">
                    <Film className="w-16 h-16 text-gray-300 dark:text-slate-800" />
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter italic">No Matches Found</h3>
                        <p className="text-gray-500 dark:text-slate-500 font-medium">Try different keywords or check for spelling errors.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchPage;

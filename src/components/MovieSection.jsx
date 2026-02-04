import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const MovieSection = ({ title, movies }) => {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="py-12 group/section"
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-1.5 bg-blue-600 rounded-full" />
                    <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white uppercase italic">
                        {title}
                    </h2>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => scroll('left')}
                        className="p-3 rounded-xl bg-gray-100 dark:bg-slate-900 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-lg transition-all"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-3 rounded-xl bg-gray-100 dark:bg-slate-900 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-lg transition-all"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-8"
            >
                {movies?.map((movie) => (
                    <div key={movie.id} className="w-[280px] shrink-0">
                        <MovieCard movie={movie} />
                    </div>
                ))}
            </div>
        </motion.section>
    );
};

export default MovieSection;

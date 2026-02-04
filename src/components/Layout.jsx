import React from 'react';
import Navbar from './navbar';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden">
            <Navbar />
            <motion.main
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-screen-2xl mx-auto px-4 pt-28 pb-8"
            >
                {children}
            </motion.main>

            <footer className="py-20 border-t border-gray-100 dark:border-slate-900 mt-20">
                <div className="max-w-screen-2xl mx-auto px-4 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <div className="w-4 h-4 bg-white rounded-full" />
                        </div>
                        <span className="text-xl font-black tracking-tighter dark:text-white uppercase italic">AKmovie</span>
                    </div>
                    <p className="text-gray-400 dark:text-slate-600 font-bold text-sm tracking-widest uppercase">
                        Elevating your cinematic experience
                    </p>
                    <div className="flex gap-8 text-gray-400 dark:text-slate-700 text-xs font-black uppercase tracking-[0.3em]">
                        <span>Privacy</span>
                        <span>Terms</span>
                        <span>API</span>
                    </div>
                    <p className="text-gray-300 dark:text-slate-400 text-[16px] mt-4 font-bold">
                        © {new Date().getFullYear()} AKMOVIE STUDIOS. ALL RIGHTS RESERVED.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;

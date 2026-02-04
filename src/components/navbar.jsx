import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sun, Moon, Heart, Film, Menu, Search, X, LogOut, User } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';

const Navbar = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { wishlist } = useWishlist();
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const searchRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                if (!searchQuery) {
                    setIsSearchOpen(false);
                }
            }
        };

        if (isSearchOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSearchOpen, searchQuery]);

    // Close menu on route change
    React.useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleProtectedLink = (path) => {
        if (!user) {
            navigate('/login', { state: { from: { pathname: path } } });
        } else {
            navigate(path);
        }
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Trending', path: '/trending' },
        { name: 'Popular', path: '/popular' },
    ];

    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-800/50 transition-all duration-300">
                <div className="max-w-screen-2xl mx-auto px-4">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="shrink-0"
                        >
                            <Link to="/" className="flex items-center gap-3">
                                <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/30">
                                    <Film className="w-6 h-6 text-white" />
                                </div>
                                <span className="hidden sm:block text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent uppercase">
                                    AKmovie
                                </span>
                            </Link>
                        </motion.div>

                        {/* Right Section */}
                        <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end">
                            {/* Desktop Nav */}
                            <div className="hidden md:flex items-center gap-2">
                                {navLinks.map((link) => (
                                    <button
                                        key={link.path}
                                        onClick={() => navigate(link.path)}
                                        className={`relative px-4 py-2 rounded-lg text-sm font-bold tracking-wide transition-all duration-300 ${location.pathname === link.path
                                            ? 'text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100/50 dark:hover:bg-slate-800/50'
                                            }`}
                                    >
                                        {link.name}
                                    </button>
                                ))}
                            </div>

                            <div className="hidden md:block w-[1px] h-6 bg-gray-200 dark:bg-slate-800 mx-2" />

                            {/* Search Bar - Responsive Width */}
                            <div ref={searchRef} className="relative flex items-center">
                                <AnimatePresence>
                                    {isSearchOpen && (
                                        <motion.form
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{
                                                width: window.innerWidth < 640 ? 'calc(100vw - 120px)' : 240,
                                                opacity: 1
                                            }}
                                            exit={{ width: 0, opacity: 0 }}
                                            onSubmit={handleSearch}
                                            className="absolute right-0 flex items-center pr-10"
                                        >
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search..."
                                                className="w-full bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl py-2 pl-4 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white transition-all shadow-inner"
                                                autoFocus
                                            />
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                                <button
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                    className={`p-2.5 rounded-xl transition-all relative z-10 ${isSearchOpen ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                                >
                                    {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Action Icons */}
                            <div className="flex items-center gap-1 sm:gap-2">
                                <button
                                    onClick={() => handleProtectedLink('/wishlist')}
                                    className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                >
                                    <Heart className={`w-6 h-6 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                                    <AnimatePresence>
                                        {wishlist.length > 0 && (
                                            <motion.span
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900"
                                            >
                                                {wishlist.length}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </button>

                                <motion.button
                                    onClick={toggleTheme}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2.5 rounded-xl bg-gray-100 dark:bg-slate-900 text-gray-700 dark:text-gray-300 transition-all"
                                >
                                    {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
                                </motion.button>
                            </div>

                            {/* User Profile / Login */}
                            <div className="hidden sm:flex items-center gap-2 border-l border-gray-200 dark:border-slate-800 pl-4">
                                {user ? (
                                    <div className="flex items-center gap-3">
                                        <div className="hidden lg:block text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-600 leading-none mb-1">Account</p>
                                            <p className="text-xs font-bold dark:text-white truncate max-w-[100px]">{user.email}</p>
                                        </div>
                                        <motion.button
                                            onClick={logout}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <LogOut className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/30"
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                            >
                                {isMenuOpen ? <X className="w-6 h-6 text-blue-600" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[60] md:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[280px] bg-white dark:bg-slate-950 z-[70] md:hidden shadow-2xl border-l border-gray-100 dark:border-slate-800 p-6 pt-24"
                        >
                            <div className="flex flex-col gap-6">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-600 ml-4">Explore</p>
                                    {navLinks.map((link) => (
                                        <button
                                            key={link.path}
                                            onClick={() => navigate(link.path)}
                                            className={`w-full text-left px-4 py-3 rounded-2xl text-lg font-bold transition-all ${location.pathname === link.path
                                                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-900'
                                                }`}
                                        >
                                            {link.name}
                                        </button>
                                    ))}
                                </div>

                                <div className="h-[1px] bg-gray-100 dark:bg-slate-900 mx-4" />

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-600 ml-4">Profile</p>
                                    {user ? (
                                        <div className="px-4 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <p className="font-bold dark:text-white truncate text-sm">{user.email}</p>
                                            </div>
                                            <button
                                                onClick={logout}
                                                className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
                                            >
                                                <LogOut className="w-4 h-4" /> Logout
                                            </button>
                                        </div>
                                    ) : (
                                        <Link
                                            to="/login"
                                            className="block w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-center"
                                        >
                                            Login / Signup
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;

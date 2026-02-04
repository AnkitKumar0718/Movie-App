import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect to the page user was trying to access or home
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message.includes('auth/user-not-found')
                ? 'Account not found. Please sign up instead.'
                : 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-800"
            >
                <div className="p-8 md:p-12 space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <Link to="/" className="inline-flex items-center gap-2 mb-4 group justify-center">
                            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                                <Film className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent uppercase italic">
                                AKmovie
                            </span>
                        </Link>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">Welcome Back</h2>
                        <p className="text-gray-500 dark:text-slate-500 font-medium">Continue your cinematic journey</p>
                    </div>

                    {/* Error Alert */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold"
                            >
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email Address"
                                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600/50 dark:text-white transition-all font-medium"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-600/50 dark:text-white transition-all font-medium"
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Login <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="text-center">
                        <p className="text-gray-500 dark:text-slate-500 font-bold text-sm">
                            Don't have an account?
                            <Link to="/signup" className="text-blue-600 hover:underline ml-2 uppercase italic tracking-tighter">Sign Up Free</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;

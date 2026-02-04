import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MovieDetails from './pages/MovieDetails';
import WishlistPage from './pages/WishlistPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // Or a loading spinner

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <WishlistProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/trending" element={<HomePage />} />
                <Route path="/popular" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                  path="/movie/:id"
                  element={
                    <ProtectedRoute>
                      <MovieDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <WishlistPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Layout>
          </Router>
        </WishlistProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

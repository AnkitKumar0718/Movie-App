import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (movie) => {
        if (!wishlist.find((m) => m.id === movie.id)) {
            setWishlist([...wishlist, movie]);
        }
    };

    const removeFromWishlist = (movieId) => {
        setWishlist(wishlist.filter((m) => m.id !== movieId));
    };

    const isInWishlist = (movieId) => {
        return !!wishlist.find((m) => m.id === movieId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);

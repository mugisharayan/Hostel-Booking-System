import React, { useState, createContext, useEffect } from 'react';
import authService from '../../service/auth.service.js';
import userService from '../../service/user.service.js';
import favoriteService from '../../service/favorite.service.js';
import bookingService from '../../service/booking.service.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // On initial load, check for existing session
  useEffect(() => {
    const checkLoggedIn = () => {
      const authData = localStorage.getItem('auth');
      if (authData) {
        try {
          const userData = JSON.parse(authData);
          if (userData.token) {
            setUserProfile(userData);
            setIsAuthenticated(true);
            
            // Load user data in background (non-blocking)
            loadUserData().catch(console.error);
          }
        } catch (error) {
          console.error('Invalid auth data:', error);
          localStorage.removeItem('auth');
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Load user data from database
  const loadUserData = async () => {
    try {
      const [favs, bookings] = await Promise.all([
        favoriteService.getMyFavorites().catch(() => []),
        bookingService.getMyBookings().catch(() => [])
      ]);
      setFavorites(favs);
      setBookingHistory(bookings);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const login = async (email, password) => {
    const userData = await authService.login(email, password);
    setUserProfile(userData);
    setIsAuthenticated(true);
    
    // Load user data in background (non-blocking)
    loadUserData().catch(console.error);
    
    return userData;
  };

  const loginWithUserData = async (userData) => {
    setUserProfile(userData);
    setIsAuthenticated(true);
    localStorage.setItem('auth', JSON.stringify(userData));
    
    // Load user data in background (non-blocking)
    loadUserData().catch(console.error);
  };

  const logout = async () => {
    try {
      // Call logout API to invalidate token on server
      await authService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
    
    // Clear local state and storage
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
    setUserProfile(null);
    setIsAuthenticated(false);
    setFavorites([]);
    setBookingHistory([]);
  };

  const toggleFavorite = async (hostelId) => {
    try {
      const isAlreadyFavorited = favorites.some(fav => fav.hostel && fav.hostel._id === hostelId);

      if (isAlreadyFavorited) {
        await favoriteService.removeFavorite(hostelId);
        setFavorites(favorites.filter(fav => fav.hostel && fav.hostel._id !== hostelId));
      } else {
        const newFavorite = await favoriteService.addFavorite(hostelId);
        setFavorites([...favorites, newFavorite]);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      throw error;
    }
  };

  const isFavorited = (hostelId) => {
    return favorites.some(fav => fav.hostel && fav.hostel._id === hostelId);
  };

  const updateProfile = (updatedData) => {
    const newProfile = { ...userProfile, ...updatedData };
    setUserProfile(newProfile);
    localStorage.setItem('auth', JSON.stringify(newProfile));
  };

  const value = {
    userProfile,
    isAuthenticated,
    loading,
    login,
    loginWithUserData,
    logout,
    favorites,
    toggleFavorite,
    isFavorited,
    setUserProfile, // Exposing for profile updates
    setIsAuthenticated, // Exposing for direct auth state updates
    bookingHistory,
    setBookingHistory,
    loadUserData,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
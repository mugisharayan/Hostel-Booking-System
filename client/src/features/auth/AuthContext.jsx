import React, { useState, createContext, useEffect } from 'react';
import authService from '../../service/auth.service.js';
import favoriteService from '../../service/favorite.service.js';
import bookingService from '../../service/booking.service.js';
import {
  getStoredAuth,
  setStoredAuth,
  clearStoredAuth,
  isValidAuthData,
  handleAuthError,
  loadUserDataSafely
} from '../../utils/auth.utils.js';

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
      const authData = getStoredAuth();
      
      if (authData && isValidAuthData(authData)) {
        setUserProfile(authData);
        setIsAuthenticated(true);
        
        // Load user data in background (non-blocking)
        loadUserData().catch(error => handleAuthError(error, 'initial load'));
      }
      
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Load user data from database
  const loadUserData = async () => {
    const [favs, bookings] = await Promise.all([
      loadUserDataSafely(() => favoriteService.getMyFavorites()),
      loadUserDataSafely(() => bookingService.getMyBookings())
    ]);
    
    setFavorites(favs);
    setBookingHistory(bookings);
  };

  const login = async (email, password) => {
    try {
      const userData = await authService.login(email, password);
      setUserProfile(userData);
      setIsAuthenticated(true);
      setStoredAuth(userData);
      
      // Load user data in background (non-blocking)
      loadUserData().catch(error => handleAuthError(error, 'login'));
      
      return userData;
    } catch (error) {
      throw handleAuthError(error, 'login');
    }
  };

  const loginWithUserData = async (userData) => {
    setUserProfile(userData);
    setIsAuthenticated(true);
    setStoredAuth(userData);
    
    // Load user data in background (non-blocking)
    loadUserData().catch(error => handleAuthError(error, 'loginWithUserData'));
  };

  const logout = async () => {
    try {
      // Call logout API to invalidate token on server
      await authService.logout();
    } catch (error) {
      handleAuthError(error, 'logout API');
    }
    
    // Clear local state and storage
    clearStoredAuth();
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
    setStoredAuth(newProfile);
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
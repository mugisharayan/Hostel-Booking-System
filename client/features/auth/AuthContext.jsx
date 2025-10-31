import React, { useState, createContext, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // On initial load, check localStorage for existing session
  useEffect(() => {
    try {
      const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
      const storedBookings = JSON.parse(localStorage.getItem('bookingHistory'));
      const storedFavorites = JSON.parse(localStorage.getItem('bookMyHostelFavorites')) || [];

      if (storedProfile) {
        setUserProfile(storedProfile);
        setBookingHistory(storedBookings || []);
        setFavorites(storedFavorites);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
      localStorage.clear(); // Clear corrupted data
    }
  }, []);

  // This function would be called on successful login/booking
  const login = (profileData, bookingsData) => {
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    localStorage.setItem('bookingHistory', JSON.stringify(bookingsData));
    setUserProfile(profileData);
    setBookingHistory(bookingsData);
    setFavorites(JSON.parse(localStorage.getItem('bookMyHostelFavorites')) || []); // Load favorites on login
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.clear();
    setUserProfile(null);
    setBookingHistory([]);
    setIsAuthenticated(false);
    setFavorites([]);
  };

  const toggleFavorite = (hostel) => {
    let updatedFavorites = [];
    const isAlreadyFavorited = favorites.some(item => item.id === hostel.id);

    if (isAlreadyFavorited) {
      updatedFavorites = favorites.filter(item => item.id !== hostel.id);
    } else {
      updatedFavorites = [...favorites, hostel];
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('bookMyHostelFavorites', JSON.stringify(updatedFavorites));
  };

  const isFavorited = (hostelId) => {
    return favorites.some(item => item.id === hostelId);
  };

  const value = { userProfile, bookingHistory, isAuthenticated, login, logout, setBookingHistory, favorites, toggleFavorite, isFavorited };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
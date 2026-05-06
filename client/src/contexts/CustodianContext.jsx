import React, { createContext, useContext, useState, useEffect } from 'react';
import custodianService from '../service/custodian.service.js';

const CustodianContext = createContext();

export const useCustodian = () => {
  const context = useContext(CustodianContext);
  if (!context) {
    throw new Error('useCustodian must be used within a CustodianProvider');
  }
  return context;
};

export const CustodianProvider = ({ children }) => {
  const [hostelData, setHostelData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomStats, setRoomStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create new hostel
  const createHostel = async (hostelData) => {
    try {
      setLoading(true);
      const data = await custodianService.createHostel(hostelData);
      setHostelData(data?.data || data);
      setError(null);
      return data?.data || data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get my hostel
  const getMyHostel = async () => {
    try {
      setLoading(true);
      const data = await custodianService.getMyHostel();
      setHostelData(data?.data || data);
      setError(null);
      return data?.data || data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await custodianService.getDashboardData();
      if (data) {
        setHostelData(data.hostel);
        setAnalytics(data.analytics);
        setBookings(data.bookings || []);
        setPayments(data.payments || []);
        setRooms(data.rooms || []);
        setRoomStats(data.roomStats);
      }
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Load bookings
  const loadBookings = async () => {
    try {
      const data = await custodianService.getBookings();
      setBookings(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  // Load payments
  const loadPayments = async () => {
    try {
      const data = await custodianService.getPayments();
      setPayments(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  // Load rooms
  const loadRooms = async () => {
    try {
      const data = await custodianService.getRooms();
      setRooms(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  // Create room
  const createRoom = async (roomData) => {
    try {
      setLoading(true);
      const data = await custodianService.createRoom(roomData);
      setRooms(prev => [...prev, data]);
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update room
  const updateRoom = async (roomId, roomData) => {
    try {
      setLoading(true);
      const data = await custodianService.updateRoom(roomId, roomData);
      setRooms(prev => prev.map(room => room._id === roomId ? data : room));
      setError(null);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete room
  const deleteRoom = async (roomId) => {
    try {
      setLoading(true);
      await custodianService.deleteRoom(roomId);
      setRooms(prev => prev.filter(room => room._id !== roomId));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Expose context globally for cross-component access
  useEffect(() => {
    window.custodianContext = {
      loadRooms,
      loadDashboardData
    };
    return () => {
      delete window.custodianContext;
    };
  }, []);

  return (
    <CustodianContext.Provider value={{
      hostelData,
      analytics,
      bookings,
      payments,
      rooms,
      roomStats,
      loading,
      error,
      createHostel,
      getMyHostel,
      loadDashboardData,
      loadBookings,
      loadPayments,
      loadRooms,
      createRoom,
      updateRoom,
      deleteRoom,
      setHostelData,
      setAnalytics,
      setRooms
    }}>
      {children}
    </CustodianContext.Provider>
  );
};

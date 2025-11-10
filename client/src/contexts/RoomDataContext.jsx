import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../service/api.service.js';

const RoomDataContext = createContext();

export const useRoomData = () => {
  const context = useContext(RoomDataContext);
  if (!context) {
    throw new Error('useRoomData must be used within a RoomDataProvider');
  }
  return context;
};

export const RoomDataProvider = ({ children }) => {
  const [rooms, setRooms] = useState([
    { id: 'LM-101', status: 'Available', occupant: 'None', roomType: 'Single', occupancy: '0/1', occupantGender: 'None', hotel: 'Lyn Modern Hostel', block: 'A', floor: '1' },
    { id: 'LM-102', status: 'Partially Booked', occupant: 'John Doe', roomType: 'Double', occupancy: '1/2', occupantGender: 'Male', hotel: 'Lyn Modern Hostel', block: 'A', floor: '1' },
    { id: 'LM-103', status: 'Maintenance', occupant: 'None', roomType: 'Single', occupancy: '0/1', occupantGender: 'None', hotel: 'Lyn Modern Hostel', block: 'A', floor: '1', maintenanceStatus: 'Pending' },
    { id: 'LM-104', status: 'Booked', occupant: 'Bob Johnson', roomType: 'Single', occupancy: '1/1', occupantGender: 'Male', hotel: 'Lyn Modern Hostel', block: 'A', floor: '1' },
    { id: 'LM-105', status: 'Partially Available', occupant: 'Mike Johnson', roomType: 'Double', occupancy: '1/2', occupantGender: 'Male', hotel: 'Lyn Modern Hostel', block: 'A', floor: '1' },
    { id: 'LM-201', status: 'Available', occupant: 'None', roomType: 'Single', occupancy: '0/1', occupantGender: 'None', hotel: 'Lyn Modern Hostel', block: 'A', floor: '2' },
    { id: 'LM-202', status: 'Available', occupant: 'None', roomType: 'Double', occupancy: '0/2', occupantGender: 'None', hotel: 'Lyn Modern Hostel', block: 'A', floor: '2' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load rooms from database on mount
  useEffect(() => {
    const linkedHostel = localStorage.getItem('linkedHostel');
    if (linkedHostel) {
      loadRooms();
    }
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const linkedHostel = JSON.parse(localStorage.getItem('linkedHostel') || '{}');
      
      if (linkedHostel.name) {
        // Load rooms for specific hostel
        const response = await apiService.rooms.getByHostel(linkedHostel.id);
        setRooms(response.data || []);
      } else {
        // Load all rooms
        const response = await apiService.rooms.getAll();
        setRooms(response.data || []);
      }
      
      setError(null);
    } catch (err) {
      setError('Failed to load rooms');
      console.error('Error loading rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const addRoom = async (room) => {
    try {
      const linkedHostel = JSON.parse(localStorage.getItem('linkedHostel') || '{}');
      const roomData = {
        ...room,
        hotel: linkedHostel.name || 'Lyn Modern Hostel',
        hostelId: linkedHostel.id || 'lyn-modern-001'
      };
      
      // Save to database
      const response = await apiService.rooms.create(roomData);
      
      // Add to local state
      setRooms(prev => [...prev, response.data]);
      return true;
    } catch (error) {
      console.error('Error adding room:', error);
      return false;
    }
  };

  const updateRoom = async (roomId, updates) => {
    try {
      // Update in database
      await apiService.rooms.update(roomId, updates);
      
      // Update local state
      setRooms(prev => prev.map(room => 
        room.id === roomId ? { ...room, ...updates } : room
      ));
      return true;
    } catch (error) {
      console.error('Error updating room:', error);
      return false;
    }
  };

  const getRoomStats = () => {
    // Filter rooms by linked hostel
    const linkedHostel = JSON.parse(localStorage.getItem('linkedHostel') || '{}');
    const hostelRooms = linkedHostel.name ? rooms.filter(r => r.hotel === linkedHostel.name) : rooms;
    
    const total = hostelRooms.length;
    const available = hostelRooms.filter(r => r.status === 'Available').length;
    const booked = hostelRooms.filter(r => r.status === 'Booked').length;
    const maintenance = hostelRooms.filter(r => r.status === 'Maintenance').length;
    const partiallyBooked = hostelRooms.filter(r => r.status === 'Partially Booked').length;
    const partiallyAvailable = hostelRooms.filter(r => r.status === 'Partially Available').length;

    return {
      total,
      available,
      booked,
      maintenance,
      partiallyBooked,
      partiallyAvailable,
      occupancyRate: total > 0 ? Math.round(((booked + partiallyBooked + partiallyAvailable) / total) * 100) : 0
    };
  };

  const getRoomTypeStats = () => {
    const single = rooms.filter(r => r.roomType === 'Single').length;
    const double = rooms.filter(r => r.roomType === 'Double').length;
    return { single, double };
  };

  const getMaintenanceStats = () => {
    const maintenanceRooms = rooms.filter(r => r.status === 'Maintenance');
    const pending = maintenanceRooms.filter(r => r.maintenanceStatus === 'Pending').length;
    const inProgress = maintenanceRooms.filter(r => r.maintenanceStatus === 'In Progress').length;
    const resolved = maintenanceRooms.filter(r => r.maintenanceStatus === 'Resolved').length;
    
    return { pending, inProgress, resolved, total: maintenanceRooms.length };
  };

  // Filter rooms by linked hostel
  const getFilteredRooms = () => {
    const linkedHostel = JSON.parse(localStorage.getItem('linkedHostel') || '{}');
    return linkedHostel.name ? rooms.filter(r => r.hotel === linkedHostel.name) : rooms;
  };

  return (
    <RoomDataContext.Provider value={{
      rooms: getFilteredRooms(),
      setRooms,
      addRoom,
      updateRoom,
      getRoomStats,
      getRoomTypeStats,
      getMaintenanceStats,
      loadRooms,
      loading,
      error
    }}>
      {children}
    </RoomDataContext.Provider>
  );
};
// React Component - Advanced Hostel Search & Filter System
// File: client/src/features/hostels/HostelsPage.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { apiService } from '../../service/api.service';

const HostelsPage = () => {
  const [hostels, setHostels] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    location: 'all',
    college: 'all',
    maxPrice: 2000000,
    amenities: [],
  });

  // Load hostels from API
  const loadHostels = async () => {
    try {
      const response = await apiService.hostels.getAll();
      setHostels(response.data.map(hostel => [hostel._id, hostel]));
    } catch (err) {
      console.error('Failed to load hostels:', err);
    }
  };

  // College to location mapping for smart filtering
  const collegeLocationMap = {
    cocis: ['wandegeya', 'ldc'],
    cobams: ['kikumi kikumi', 'kikoni'],
    cedat: ['kikoni'],
    chuss: ['kikoni'],
    conas: ['kikoni', 'kikumi kikumi'],
    caes: ['kikoni', 'kikumi kikumi'],
  };

  // Advanced filtering logic with multiple criteria
  const filteredHostels = useMemo(() => {
    return hostels.filter(([, hostel]) => {
      // Price filtering - get lowest room price
      const lowestPrice = hostel.rooms?.length > 0 
        ? hostel.rooms.reduce((min, room) => 
            room.price < min ? room.price : min, Infinity)
        : 0;

      // Text search matching
      const nameMatch = hostel.name.toLowerCase()
        .includes(filters.searchTerm.toLowerCase());
      
      // Location filtering
      const locationMatch = filters.location === 'all' || 
        hostel.location.toLowerCase() === filters.location.toLowerCase();
      
      // College-based location filtering
      const collegeMatch = filters.college === 'all' || (() => {
        const collegeLocations = collegeLocationMap[filters.college] || [];
        return collegeLocations.some(location => 
          hostel.location.toLowerCase() === location.toLowerCase()
        );
      })();
      
      // Price range filtering
      const priceMatch = lowestPrice <= filters.maxPrice;
      
      // Amenities filtering - all selected amenities must be present
      const amenitiesMatch = filters.amenities.every(filterAmenity =>
        hostel.amenities?.some(hostelAmenity => 
          hostelAmenity.name.toLowerCase() === filterAmenity.toLowerCase()
        )
      );

      return nameMatch && locationMatch && collegeMatch && 
             priceMatch && amenitiesMatch;
    });
  }, [hostels, filters]);

  // Filter handlers
  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters(prev => ({ ...prev, [id]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <div className="hostels-page">
      {/* Search Input */}
      <input 
        type="search" 
        placeholder="Search hostels by name..." 
        value={filters.searchTerm} 
        onChange={handleSearchChange}
      />
      
      {/* Filter Controls */}
      <select id="location" value={filters.location} onChange={handleFilterChange}>
        <option value="all">All Locations</option>
        <option value="kikoni">Kikoni</option>
        <option value="wandegeya">Wandegeya</option>
      </select>

      <select id="college" value={filters.college} onChange={handleFilterChange}>
        <option value="all">All Colleges</option>
        <option value="cocis">CoCIS</option>
        <option value="cobams">CoBAMS</option>
      </select>

      <input 
        type="range" 
        id="maxPrice" 
        min="500000" 
        max="2000000" 
        value={filters.maxPrice} 
        onChange={handleFilterChange}
      />

      {/* Results Display */}
      <div className="hostels-grid">
        {filteredHostels.map(([id, hostel]) => (
          <HostelCard key={id} hostel={hostel} />
        ))}
      </div>
    </div>
  );
};

export default HostelsPage;
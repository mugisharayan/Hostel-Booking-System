// Hostel Management Service - Frontend Data Management (No Database)

class HostelManagementService {
  constructor() {
    this.hostels = JSON.parse(localStorage.getItem('registeredHostels')) || [];
    this.currentHostelId = localStorage.getItem('currentHostelId');
  }

  // Register a new hostel
  registerHostel(hostelData) {
    const newHostel = {
      id: Date.now().toString(),
      ...hostelData,
      createdAt: new Date().toISOString(),
      status: 'active',
      custodianId: 'current_custodian', // In real app, get from auth context
      stats: {
        totalRooms: this.calculateTotalRooms(hostelData.levels),
        occupiedRooms: 0,
        availableRooms: this.calculateTotalRooms(hostelData.levels),
        revenue: 0
      }
    };

    this.hostels.push(newHostel);
    this.saveToStorage();
    
    // Set as current hostel if it's the first one
    if (!this.currentHostelId) {
      this.setCurrentHostel(newHostel.id);
    }

    return newHostel;
  }

  // Get all hostels for current custodian
  getMyHostels() {
    return this.hostels.filter(hostel => hostel.custodianId === 'current_custodian');
  }

  // Get current hostel
  getCurrentHostel() {
    return this.hostels.find(hostel => hostel.id === this.currentHostelId);
  }

  // Set current hostel
  setCurrentHostel(hostelId) {
    this.currentHostelId = hostelId;
    localStorage.setItem('currentHostelId', hostelId);
  }

  // Update hostel information
  updateHostel(hostelId, updates) {
    const index = this.hostels.findIndex(h => h.id === hostelId);
    if (index !== -1) {
      this.hostels[index] = { ...this.hostels[index], ...updates };
      this.saveToStorage();
      return this.hostels[index];
    }
    return null;
  }

  // Add room type
  addRoomType(hostelId, roomType) {
    const hostel = this.hostels.find(h => h.id === hostelId);
    if (hostel) {
      hostel.roomTypes.push({ ...roomType, id: Date.now().toString() });
      this.saveToStorage();
      return roomType;
    }
    return null;
  }

  // Update room type
  updateRoomType(hostelId, roomTypeId, updates) {
    const hostel = this.hostels.find(h => h.id === hostelId);
    if (hostel) {
      const index = hostel.roomTypes.findIndex(rt => rt.id === roomTypeId);
      if (index !== -1) {
        hostel.roomTypes[index] = { ...hostel.roomTypes[index], ...updates };
        this.saveToStorage();
        return hostel.roomTypes[index];
      }
    }
    return null;
  }

  // Add level
  addLevel(hostelId, level) {
    const hostel = this.hostels.find(h => h.id === hostelId);
    if (hostel) {
      hostel.levels.push({ ...level, id: Date.now().toString() });
      this.saveToStorage();
      return level;
    }
    return null;
  }

  // Add room to level
  addRoom(hostelId, levelId, room) {
    const hostel = this.hostels.find(h => h.id === hostelId);
    if (hostel) {
      const level = hostel.levels.find(l => l.id === levelId);
      if (level) {
        level.rooms.push({ ...room, id: Date.now().toString() });
        this.updateHostelStats(hostelId);
        this.saveToStorage();
        return room;
      }
    }
    return null;
  }

  // Update room
  updateRoom(hostelId, levelId, roomId, updates) {
    const hostel = this.hostels.find(h => h.id === hostelId);
    if (hostel) {
      const level = hostel.levels.find(l => l.id === levelId);
      if (level) {
        const index = level.rooms.findIndex(r => r.id === roomId);
        if (index !== -1) {
          level.rooms[index] = { ...level.rooms[index], ...updates };
          this.updateHostelStats(hostelId);
          this.saveToStorage();
          return level.rooms[index];
        }
      }
    }
    return null;
  }

  // Get hostel for public display (for hostels page)
  getPublicHostelData(hostelId) {
    const hostel = this.hostels.find(h => h.id === hostelId);
    if (!hostel) return null;

    return {
      id: hostel.id,
      name: hostel.name,
      description: hostel.description,
      location: hostel.location,
      contact: hostel.contact,
      email: hostel.email,
      facilities: hostel.facilities,
      images: hostel.images.length > 0 ? hostel.images : [
        'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg',
        'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'
      ],
      roomTypes: hostel.roomTypes.map(rt => ({
        name: rt.name,
        price: rt.price,
        capacity: rt.capacity,
        amenities: rt.amenities || []
      })),
      stats: hostel.stats,
      rating: 4.5, // Default rating
      reviews: []
    };
  }

  // Get all public hostels (for hostels page)
  getAllPublicHostels() {
    return this.hostels
      .filter(hostel => hostel.status === 'active')
      .map(hostel => this.getPublicHostelData(hostel.id));
  }

  // Helper methods
  calculateTotalRooms(levels) {
    return levels.reduce((total, level) => total + (level.rooms?.length || 0), 0);
  }

  updateHostelStats(hostelId) {
    const hostel = this.hostels.find(h => h.id === hostelId);
    if (hostel) {
      const totalRooms = this.calculateTotalRooms(hostel.levels);
      const occupiedRooms = hostel.levels.reduce((total, level) => 
        total + (level.rooms?.filter(room => room.status === 'occupied').length || 0), 0
      );
      
      hostel.stats = {
        ...hostel.stats,
        totalRooms,
        occupiedRooms,
        availableRooms: totalRooms - occupiedRooms
      };
    }
  }

  saveToStorage() {
    localStorage.setItem('registeredHostels', JSON.stringify(this.hostels));
  }

  // Initialize with sample data if empty
  initializeSampleData() {
    if (this.hostels.length === 0) {
      const sampleHostel = {
        id: 'sample_hostel_1',
        name: 'University Heights Hostel',
        description: 'Modern student accommodation with excellent facilities',
        location: 'Makerere University Campus',
        contact: '+256 700 123456',
        email: 'info@universityheights.com',
        facilities: ['WiFi', 'Laundry', 'Kitchen', 'Study Room', 'Security'],
        images: [],
        roomTypes: [
          { id: '1', name: 'Single', price: 800000, capacity: 1, amenities: ['Bed', 'Desk', 'Wardrobe'] },
          { id: '2', name: 'Double', price: 1200000, capacity: 2, amenities: ['2 Beds', '2 Desks', 'Shared Wardrobe'] }
        ],
        levels: [
          {
            id: '1',
            name: 'Ground Floor',
            rooms: [
              { id: '1', number: 'A-101', type: 'Single', status: 'available' },
              { id: '2', number: 'A-102', type: 'Double', status: 'available' }
            ]
          }
        ],
        createdAt: new Date().toISOString(),
        status: 'active',
        custodianId: 'current_custodian',
        stats: { totalRooms: 2, occupiedRooms: 0, availableRooms: 2, revenue: 0 }
      };
      
      this.hostels.push(sampleHostel);
      this.saveToStorage();
      this.setCurrentHostel(sampleHostel.id);
    }
  }
}

export default new HostelManagementService();
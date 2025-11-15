import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { useCustodian } from '../../contexts/CustodianContext';
import custodianService from '../../service/custodian.service';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import '../../styles/modern-dashboard.css';
import '../../styles/mobile-responsive.css';
import '../../styles/custodian-modern.css';
import '../../styles/room-management-database.css';

const CustodianRoomManagementDatabasePage = () => {
  const navigate = useNavigate();
  const { userProfile } = useContext(AuthContext);
  const { rooms, roomStats, loadRooms, createRoom, updateRoom, deleteRoom, loading } = useCustodian();
  const [seeding, setSeeding] = useState(false);
  
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const custodianProfile = {
    fullName: userProfile?.name || 'Custodian',
    course: userProfile?.role || 'Custodian',
    profilePicture: userProfile?.profilePicture || 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  // Load rooms on component mount
  useEffect(() => {
    loadRooms();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const roomData = {
      roomNumber: formData.get('roomNumber'),
      floor: parseInt(formData.get('floor')),
      roomType: formData.get('roomType'),
      capacity: parseInt(formData.get('capacity')),
      price: parseFloat(formData.get('price')),
      amenities: formData.get('amenities').split(',').map(a => a.trim()).filter(a => a)
    };

    try {
      await createRoom(roomData);
      setIsCreateRoomModalOpen(false);
      e.target.reset();
    } catch (error) {
      alert('Failed to create room: ' + error.message);
    }
  };

  const handleEditRoom = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const roomData = {
      roomNumber: formData.get('roomNumber'),
      floor: parseInt(formData.get('floor')),
      roomType: formData.get('roomType'),
      capacity: parseInt(formData.get('capacity')),
      price: parseFloat(formData.get('price')),
      status: formData.get('status'),
      amenities: formData.get('amenities').split(',').map(a => a.trim()).filter(a => a)
    };

    try {
      await updateRoom(selectedRoom._id, roomData);
      setIsEditRoomModalOpen(false);
      setSelectedRoom(null);
    } catch (error) {
      alert('Failed to update room: ' + error.message);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await deleteRoom(roomId);
      } catch (error) {
        alert('Failed to delete room: ' + error.message);
      }
    }
  };

  const handleSeedRooms = async () => {
    try {
      setSeeding(true);
      await custodianService.seedRooms();
      await loadRooms(); // Reload rooms after seeding
      alert('Sample rooms created successfully!');
    } catch (error) {
      alert('Failed to seed rooms: ' + error.message);
    } finally {
      setSeeding(false);
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesFilter = filterBy === 'all' || room.status.toLowerCase().includes(filterBy.toLowerCase());
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.roomType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  return (
    <>
      <section className="custodian-hero">
        <div className="hero-content">
          <h1>Room <span className="dashboard-animated">Management</span></h1>
          <p>Manage your hostel rooms with real-time database integration</p>
        </div>
      </section>
      
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-layout">
            <DashboardSidebar
              user={custodianProfile}
              role="custodian"
              onLogout={() => setIsLogoutModalOpen(true)}
            />
            
            <div className="dashboard-content">
              <div className="modern-dashboard-container">
                {/* Room Statistics */}
                <div className="stats-grid-compact">
                  <div className="stat-card-compact blue">
                    <div className="stat-icon"><i className="fa-solid fa-door-open"></i></div>
                    <div className="stat-info">
                      <h3>{roomStats?.total || rooms.length}</h3>
                      <p>Total Rooms</p>
                      <div className="stat-trend">{roomStats?.available || 0} available</div>
                    </div>
                  </div>
                  <div className="stat-card-compact green">
                    <div className="stat-icon"><i className="fa-solid fa-bed"></i></div>
                    <div className="stat-info">
                      <h3>{roomStats?.occupied || 0}</h3>
                      <p>Occupied</p>
                      <div className="stat-trend">{roomStats?.occupancyRate || 0}% occupancy</div>
                    </div>
                  </div>
                  <div className="stat-card-compact orange">
                    <div className="stat-icon"><i className="fa-solid fa-tools"></i></div>
                    <div className="stat-info">
                      <h3>{roomStats?.maintenance || 0}</h3>
                      <p>Maintenance</p>
                      <div className="stat-trend">Needs attention</div>
                    </div>
                  </div>
                </div>

                {/* Room Management Header */}
                <div className="section-header">
                  <div className="header-left">
                    <h3><i className="fas fa-door-open"></i> Room Management</h3>
                    <p>Manage rooms with database integration</p>
                  </div>
                  <div className="header-right">
                    <div className="search-controls">
                      <input
                        type="text"
                        placeholder="Search rooms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                      />
                      <select
                        value={filterBy}
                        onChange={(e) => setFilterBy(e.target.value)}
                        className="filter-select"
                      >
                        <option value="all">All Rooms</option>
                        <option value="available">Available</option>
                        <option value="booked">Booked</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                    <div className="header-actions">
                      {rooms.length === 0 && (
                        <button
                          className="btn secondary"
                          onClick={handleSeedRooms}
                          disabled={seeding}
                        >
                          <i className={`fas ${seeding ? 'fa-spinner fa-spin' : 'fa-seedling'}`}></i> 
                          {seeding ? 'Creating...' : 'Seed Sample Rooms'}
                        </button>
                      )}
                      <button
                        className="btn primary"
                        onClick={() => setIsCreateRoomModalOpen(true)}
                      >
                        <i className="fas fa-plus"></i> Add Room
                      </button>
                    </div>
                  </div>
                </div>

                {/* Rooms Grid */}
                {loading ? (
                  <div className="loading-state">
                    <i className="fas fa-spinner fa-spin"></i>
                    <p>Loading rooms...</p>
                  </div>
                ) : (
                  <div className="rooms-grid">
                    {filteredRooms.length === 0 ? (
                      <div className="empty-state">
                        <i className="fas fa-door-open"></i>
                        <h4>No Rooms Found</h4>
                        <p>Create your first room to get started.</p>
                        <button
                          className="btn primary"
                          onClick={() => setIsCreateRoomModalOpen(true)}
                        >
                          <i className="fas fa-plus"></i> Create Room
                        </button>
                      </div>
                    ) : (
                      filteredRooms.map(room => (
                        <div key={room._id} className={`room-card status-${room.status.toLowerCase().replace(' ', '-')}`}>
                          <div className="room-header">
                            <div className="room-number">{room.roomNumber}</div>
                            <div className={`room-status status-${room.status.toLowerCase().replace(' ', '-')}`}>
                              {room.status}
                            </div>
                          </div>
                          
                          <div className="room-details">
                            <div className="detail-row">
                              <span className="label">Type:</span>
                              <span className="value">{room.roomType}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">Floor:</span>
                              <span className="value">{room.floor}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">Capacity:</span>
                              <span className="value">{room.currentOccupants}/{room.capacity}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">Price:</span>
                              <span className="value">UGX {room.price?.toLocaleString()}</span>
                            </div>
                          </div>

                          {room.amenities && room.amenities.length > 0 && (
                            <div className="room-amenities">
                              {room.amenities.slice(0, 3).map((amenity, index) => (
                                <span key={index} className="amenity-tag">{amenity}</span>
                              ))}
                              {room.amenities.length > 3 && (
                                <span className="amenity-tag">+{room.amenities.length - 3} more</span>
                              )}
                            </div>
                          )}

                          <div className="room-actions">
                            <button
                              className="btn-icon edit"
                              onClick={() => {
                                setSelectedRoom(room);
                                setIsEditRoomModalOpen(true);
                              }}
                              title="Edit Room"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="btn-icon delete"
                              onClick={() => handleDeleteRoom(room._id)}
                              title="Delete Room"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create Room Modal */}
      {isCreateRoomModalOpen && (
        <div className="modal-overlay is-visible">
          <div className="modal-content">
            <div className="modal-header">
              <h3><i className="fas fa-plus"></i> Create New Room</h3>
              <button className="close-btn" onClick={() => setIsCreateRoomModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleCreateRoom}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Room Number</label>
                  <input type="text" name="roomNumber" required />
                </div>
                <div className="form-group">
                  <label>Floor</label>
                  <input type="number" name="floor" min="1" required />
                </div>
                <div className="form-group">
                  <label>Room Type</label>
                  <select name="roomType" required>
                    <option value="">Select Type</option>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Triple">Triple</option>
                    <option value="Shared">Shared</option>
                    <option value="Private">Private</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input type="number" name="capacity" min="1" required />
                </div>
                <div className="form-group">
                  <label>Price (UGX)</label>
                  <input type="number" name="price" min="0" required />
                </div>
                <div className="form-group full-width">
                  <label>Amenities (comma-separated)</label>
                  <input type="text" name="amenities" placeholder="WiFi, AC, Private Bathroom" />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn secondary" onClick={() => setIsCreateRoomModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  <i className="fas fa-plus"></i> Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {isEditRoomModalOpen && selectedRoom && (
        <div className="modal-overlay is-visible">
          <div className="modal-content">
            <div className="modal-header">
              <h3><i className="fas fa-edit"></i> Edit Room {selectedRoom.roomNumber}</h3>
              <button className="close-btn" onClick={() => setIsEditRoomModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleEditRoom}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Room Number</label>
                  <input type="text" name="roomNumber" defaultValue={selectedRoom.roomNumber} required />
                </div>
                <div className="form-group">
                  <label>Floor</label>
                  <input type="number" name="floor" min="1" defaultValue={selectedRoom.floor} required />
                </div>
                <div className="form-group">
                  <label>Room Type</label>
                  <select name="roomType" defaultValue={selectedRoom.roomType} required>
                    <option value="Single">Single</option>
                    <option value="Double">Double</option>
                    <option value="Triple">Triple</option>
                    <option value="Shared">Shared</option>
                    <option value="Private">Private</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input type="number" name="capacity" min="1" defaultValue={selectedRoom.capacity} required />
                </div>
                <div className="form-group">
                  <label>Price (UGX)</label>
                  <input type="number" name="price" min="0" defaultValue={selectedRoom.price} required />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" defaultValue={selectedRoom.status} required>
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Partially Booked">Partially Booked</option>
                    <option value="Partially Available">Partially Available</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Amenities (comma-separated)</label>
                  <input 
                    type="text" 
                    name="amenities" 
                    defaultValue={selectedRoom.amenities?.join(', ') || ''} 
                    placeholder="WiFi, AC, Private Bathroom" 
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn secondary" onClick={() => setIsEditRoomModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  <i className="fas fa-save"></i> Update Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default CustodianRoomManagementDatabasePage;
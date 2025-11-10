import React, { useState } from 'react';

const RoomLevelManager = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('levels');
  const [levels, setLevels] = useState([
    { id: 1, name: 'Ground Floor', rooms: [
      { id: 1, number: 'A-101', type: 'Single', status: 'occupied', student: 'John Doe' },
      { id: 2, number: 'A-102', type: 'Double', status: 'available', student: null }
    ]},
    { id: 2, name: 'First Floor', rooms: [
      { id: 3, number: 'A-201', type: 'Single', status: 'maintenance', student: null }
    ]}
  ]);
  
  const [roomTypes, setRoomTypes] = useState([
    { id: 1, name: 'Single', price: 800000, capacity: 1, amenities: ['Bed', 'Desk', 'Wardrobe'] },
    { id: 2, name: 'Double', price: 1200000, capacity: 2, amenities: ['2 Beds', '2 Desks', 'Shared Wardrobe'] }
  ]);

  const addLevel = () => {
    const newLevel = {
      id: Date.now(),
      name: `Level ${levels.length + 1}`,
      rooms: []
    };
    setLevels([...levels, newLevel]);
  };

  const addRoom = (levelId) => {
    setLevels(levels.map(level => 
      level.id === levelId 
        ? { 
            ...level, 
            rooms: [...level.rooms, {
              id: Date.now(),
              number: `${level.name.charAt(0)}-${(level.rooms.length + 1).toString().padStart(3, '0')}`,
              type: roomTypes[0]?.name || '',
              status: 'available',
              student: null
            }]
          }
        : level
    ));
  };

  const updateRoom = (levelId, roomId, field, value) => {
    setLevels(levels.map(level => 
      level.id === levelId 
        ? {
            ...level,
            rooms: level.rooms.map(room => 
              room.id === roomId ? { ...room, [field]: value } : room
            )
          }
        : level
    ));
  };

  const deleteRoom = (levelId, roomId) => {
    setLevels(levels.map(level => 
      level.id === levelId 
        ? { ...level, rooms: level.rooms.filter(room => room.id !== roomId) }
        : level
    ));
  };

  const addRoomType = () => {
    const newRoomType = {
      id: Date.now(),
      name: 'New Room Type',
      price: 0,
      capacity: 1,
      amenities: []
    };
    setRoomTypes([...roomTypes, newRoomType]);
  };

  const updateRoomType = (id, field, value) => {
    setRoomTypes(roomTypes.map(rt => 
      rt.id === id ? { ...rt, [field]: value } : rt
    ));
  };

  const deleteRoomType = (id) => {
    setRoomTypes(roomTypes.filter(rt => rt.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '900px', height: '600px', background: 'white', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Room & Level Management</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>×</button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
          <button 
            onClick={() => setActiveTab('levels')}
            style={{ 
              flex: 1, 
              padding: '12px', 
              border: 'none', 
              background: activeTab === 'levels' ? '#0ea5e9' : 'white',
              color: activeTab === 'levels' ? 'white' : '#64748b',
              cursor: 'pointer'
            }}
          >
            Levels & Rooms
          </button>
          <button 
            onClick={() => setActiveTab('roomTypes')}
            style={{ 
              flex: 1, 
              padding: '12px', 
              border: 'none', 
              background: activeTab === 'roomTypes' ? '#0ea5e9' : 'white',
              color: activeTab === 'roomTypes' ? 'white' : '#64748b',
              cursor: 'pointer'
            }}
          >
            Room Types
          </button>
        </div>

        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {activeTab === 'levels' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4 style={{ margin: 0 }}>Levels & Rooms</h4>
                <button 
                  onClick={addLevel}
                  style={{ padding: '8px 16px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  <i className="fas fa-plus"></i> Add Level
                </button>
              </div>

              {levels.map(level => (
                <div key={level.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <input 
                      type="text" 
                      value={level.name}
                      onChange={(e) => setLevels(levels.map(l => l.id === level.id ? { ...l, name: e.target.value } : l))}
                      style={{ fontSize: '16px', fontWeight: 'bold', border: 'none', background: 'transparent', outline: 'none' }}
                    />
                    <button 
                      onClick={() => addRoom(level.id)}
                      style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      <i className="fas fa-plus"></i> Add Room
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                    {level.rooms.map(room => (
                      <div key={room.id} style={{ border: '1px solid #f1f5f9', borderRadius: '6px', padding: '12px', background: '#fafbfc' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <input 
                            type="text" 
                            value={room.number}
                            onChange={(e) => updateRoom(level.id, room.id, 'number', e.target.value)}
                            style={{ fontWeight: 'bold', border: 'none', background: 'transparent', fontSize: '14px' }}
                          />
                          <button 
                            onClick={() => deleteRoom(level.id, room.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                        
                        <div style={{ marginBottom: '8px' }}>
                          <select 
                            value={room.type}
                            onChange={(e) => updateRoom(level.id, room.id, 'type', e.target.value)}
                            style={{ width: '100%', padding: '4px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px' }}
                          >
                            <option value="">Select Type</option>
                            {roomTypes.map(rt => (
                              <option key={rt.id} value={rt.name}>{rt.name}</option>
                            ))}
                          </select>
                        </div>

                        <div style={{ marginBottom: '8px' }}>
                          <select 
                            value={room.status}
                            onChange={(e) => updateRoom(level.id, room.id, 'status', e.target.value)}
                            style={{ width: '100%', padding: '4px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px' }}
                          >
                            <option value="available">Available</option>
                            <option value="occupied">Occupied</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="reserved">Reserved</option>
                          </select>
                        </div>

                        {room.student && (
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            Student: {room.student}
                          </div>
                        )}

                        <div style={{ 
                          fontSize: '10px', 
                          padding: '2px 6px', 
                          borderRadius: '4px', 
                          textAlign: 'center',
                          marginTop: '4px',
                          background: room.status === 'available' ? '#dcfce7' : room.status === 'occupied' ? '#fee2e2' : '#fef3c7',
                          color: room.status === 'available' ? '#16a34a' : room.status === 'occupied' ? '#dc2626' : '#d97706'
                        }}>
                          {room.status.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'roomTypes' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4 style={{ margin: 0 }}>Room Types</h4>
                <button 
                  onClick={addRoomType}
                  style={{ padding: '8px 16px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  <i className="fas fa-plus"></i> Add Room Type
                </button>
              </div>

              {roomTypes.map(roomType => (
                <div key={roomType.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <input 
                      type="text" 
                      value={roomType.name}
                      onChange={(e) => updateRoomType(roomType.id, 'name', e.target.value)}
                      style={{ fontSize: '16px', fontWeight: 'bold', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '4px 8px' }}
                    />
                    <button 
                      onClick={() => deleteRoomType(roomType.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>Price (UGX)</label>
                      <input 
                        type="number" 
                        value={roomType.price}
                        onChange={(e) => updateRoomType(roomType.id, 'price', parseInt(e.target.value))}
                        style={{ width: '100%', padding: '6px', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>Capacity</label>
                      <input 
                        type="number" 
                        value={roomType.capacity}
                        onChange={(e) => updateRoomType(roomType.id, 'capacity', parseInt(e.target.value))}
                        style={{ width: '100%', padding: '6px', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', fontWeight: '500' }}>Amenities</label>
                    <input 
                      type="text" 
                      value={roomType.amenities.join(', ')}
                      onChange={(e) => updateRoomType(roomType.id, 'amenities', e.target.value.split(', '))}
                      placeholder="Bed, Desk, Wardrobe (comma separated)"
                      style={{ width: '100%', padding: '6px', border: '1px solid #e2e8f0', borderRadius: '4px' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomLevelManager;
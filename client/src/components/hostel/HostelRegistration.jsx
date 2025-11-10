import React, { useState } from 'react';

const HostelRegistration = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [hostelData, setHostelData] = useState({
    name: '', description: '', location: '', contact: '', email: '',
    facilities: [], images: [], roomTypes: [], levels: []
  });

  const availableFacilities = ['WiFi', 'Laundry', 'Kitchen', 'Study Room', 'Gym', 'Parking', 'Security', 'Cleaning Service'];

  const handleInputChange = (field, value) => {
    setHostelData(prev => ({ ...prev, [field]: value }));
  };

  const handleFacilityToggle = (facility) => {
    setHostelData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const addRoomType = () => {
    setHostelData(prev => ({
      ...prev,
      roomTypes: [...prev.roomTypes, { id: Date.now(), name: '', price: '', capacity: '' }]
    }));
  };

  const updateRoomType = (id, field, value) => {
    setHostelData(prev => ({
      ...prev,
      roomTypes: prev.roomTypes.map(rt => rt.id === id ? { ...rt, [field]: value } : rt)
    }));
  };

  const addLevel = () => {
    setHostelData(prev => ({
      ...prev,
      levels: [...prev.levels, { id: Date.now(), name: '', rooms: [] }]
    }));
  };

  const addRoomToLevel = (levelId) => {
    setHostelData(prev => ({
      ...prev,
      levels: prev.levels.map(level => 
        level.id === levelId 
          ? { ...level, rooms: [...level.rooms, { id: Date.now(), number: '', type: '' }] }
          : level
      )
    }));
  };

  const handleSubmit = () => {
    onSubmit(hostelData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '700px', maxHeight: '80vh', background: 'white', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0 }}>Register Your Hostel</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {currentStep === 1 && (
            <div>
              <h4>Basic Information</h4>
              <div style={{ display: 'grid', gap: '12px' }}>
                <input type="text" placeholder="Hostel Name" value={hostelData.name} onChange={(e) => handleInputChange('name', e.target.value)} style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                <textarea placeholder="Description" value={hostelData.description} onChange={(e) => handleInputChange('description', e.target.value)} rows="3" style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                <input type="text" placeholder="Location" value={hostelData.location} onChange={(e) => handleInputChange('location', e.target.value)} style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                <input type="tel" placeholder="Contact Phone" value={hostelData.contact} onChange={(e) => handleInputChange('contact', e.target.value)} style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                <input type="email" placeholder="Email" value={hostelData.email} onChange={(e) => handleInputChange('email', e.target.value)} style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h4>Facilities</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {availableFacilities.map(facility => (
                  <label key={facility} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" checked={hostelData.facilities.includes(facility)} onChange={() => handleFacilityToggle(facility)} />
                    <span>{facility}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h4>Room Types</h4>
                <button onClick={addRoomType} style={{ padding: '6px 12px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '6px' }}>Add Room Type</button>
              </div>
              {hostelData.roomTypes.map(roomType => (
                <div key={roomType.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <input type="text" placeholder="Name" value={roomType.name} onChange={(e) => updateRoomType(roomType.id, 'name', e.target.value)} style={{ padding: '6px', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
                  <input type="number" placeholder="Price" value={roomType.price} onChange={(e) => updateRoomType(roomType.id, 'price', e.target.value)} style={{ padding: '6px', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
                  <input type="number" placeholder="Capacity" value={roomType.capacity} onChange={(e) => updateRoomType(roomType.id, 'capacity', e.target.value)} style={{ padding: '6px', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h4>Levels & Rooms</h4>
                <button onClick={addLevel} style={{ padding: '6px 12px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '6px' }}>Add Level</button>
              </div>
              {hostelData.levels.map(level => (
                <div key={level.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input type="text" placeholder="Level name" value={level.name} onChange={(e) => setHostelData(prev => ({ ...prev, levels: prev.levels.map(l => l.id === level.id ? { ...l, name: e.target.value } : l) }))} style={{ flex: 1, padding: '6px', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
                    <button onClick={() => addRoomToLevel(level.id)} style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px' }}>Add Room</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {level.rooms.map(room => (
                      <div key={room.id} style={{ display: 'flex', gap: '4px' }}>
                        <input type="text" placeholder="Room #" value={room.number} onChange={(e) => setHostelData(prev => ({ ...prev, levels: prev.levels.map(l => l.id === level.id ? { ...l, rooms: l.rooms.map(r => r.id === room.id ? { ...r, number: e.target.value } : r) } : l) }))} style={{ flex: 1, padding: '4px', border: '1px solid #e2e8f0', borderRadius: '3px', fontSize: '12px' }} />
                        <select value={room.type} onChange={(e) => setHostelData(prev => ({ ...prev, levels: prev.levels.map(l => l.id === level.id ? { ...l, rooms: l.rooms.map(r => r.id === room.id ? { ...r, type: e.target.value } : r) } : l) }))} style={{ flex: 1, padding: '4px', border: '1px solid #e2e8f0', borderRadius: '3px', fontSize: '12px' }}>
                          <option value="">Type</option>
                          {hostelData.roomTypes.map(rt => <option key={rt.id} value={rt.name}>{rt.name}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))} disabled={currentStep === 1} style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer' }}>Previous</button>
          {currentStep < 4 ? (
            <button onClick={() => setCurrentStep(prev => Math.min(prev + 1, 4))} style={{ padding: '8px 16px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Next</button>
          ) : (
            <button onClick={handleSubmit} style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Register Hostel</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostelRegistration;
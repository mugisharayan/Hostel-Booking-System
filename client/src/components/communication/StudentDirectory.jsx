import React, { useState } from 'react';

const StudentDirectory = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBuilding, setFilterBuilding] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const students = [
    { id: 'ST001', name: 'Sarah Johnson', room: 'A-104', phone: '+256 700 123456', email: 'sarah.j@email.com', building: 'A', status: 'active', lastSeen: '2 hours ago' },
    { id: 'ST002', name: 'Michael Chen', room: 'B-205', phone: '+256 700 234567', email: 'michael.c@email.com', building: 'B', status: 'active', lastSeen: '1 day ago' },
    { id: 'ST003', name: 'Emma Wilson', room: 'C-301', phone: '+256 700 345678', email: 'emma.w@email.com', building: 'C', status: 'maintenance', lastSeen: '3 hours ago' }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         student.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBuilding = filterBuilding === 'all' || student.building === filterBuilding;
    return matchesSearch && matchesBuilding;
  });

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '800px', height: '600px', background: 'white', borderRadius: '12px', display: 'flex' }}>
        <div style={{ width: '300px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ margin: 0 }}><i className="fas fa-users"></i> Student Directory</h4>
              <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            </div>
            <input 
              type="text" 
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', marginBottom: '12px' }}
            />
            <select 
              value={filterBuilding} 
              onChange={(e) => setFilterBuilding(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
            >
              <option value="all">All Buildings</option>
              <option value="A">Building A</option>
              <option value="B">Building B</option>
              <option value="C">Building C</option>
            </select>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredStudents.map(student => (
              <div 
                key={student.id}
                onClick={() => setSelectedStudent(student)}
                style={{ 
                  padding: '12px 16px', 
                  borderBottom: '1px solid #f1f5f9', 
                  cursor: 'pointer',
                  background: selectedStudent?.id === student.id ? '#f8fafc' : 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '14px' }}>{student.name}</strong>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: student.status === 'active' ? '#dcfce7' : '#fef3c7', color: student.status === 'active' ? '#16a34a' : '#d97706' }}>
                    {student.status}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Room {student.room} • {student.id}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Last seen: {student.lastSeen}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedStudent ? (
            <>
              <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 8px 0' }}>{selectedStudent.name}</h4>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b' }}>
                  <span><i className="fas fa-id-card"></i> {selectedStudent.id}</span>
                  <span><i className="fas fa-door-open"></i> Room {selectedStudent.room}</span>
                  <span><i className="fas fa-building"></i> Building {selectedStudent.building}</span>
                </div>
              </div>
              
              <div style={{ flex: 1, padding: '20px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ margin: '0 0 12px 0' }}>Contact Information</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fas fa-envelope" style={{ width: '16px', color: '#64748b' }}></i>
                      <span style={{ fontSize: '14px' }}>{selectedStudent.email}</span>
                      <button style={{ padding: '4px 8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
                        Email
                      </button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <i className="fas fa-phone" style={{ width: '16px', color: '#64748b' }}></i>
                      <span style={{ fontSize: '14px' }}>{selectedStudent.phone}</span>
                      <button style={{ padding: '4px 8px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
                        Call
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ margin: '0 0 12px 0' }}>Quick Actions</h5>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button style={{ padding: '6px 12px', background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                      <i className="fas fa-comment"></i> Send Message
                    </button>
                    <button style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                      <i className="fas fa-dollar-sign"></i> Payment Status
                    </button>
                    <button style={{ padding: '6px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                      <i className="fas fa-wrench"></i> Maintenance
                    </button>
                  </div>
                </div>

                <div>
                  <h5 style={{ margin: '0 0 12px 0' }}>Recent Activity</h5>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>
                    <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '6px', marginBottom: '4px' }}>
                      Payment received - 2 days ago
                    </div>
                    <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '6px', marginBottom: '4px' }}>
                      Maintenance request submitted - 1 week ago
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', flexDirection: 'column' }}>
              <i className="fas fa-user-circle" style={{ fontSize: '48px', marginBottom: '16px' }}></i>
              <h3>Select a student</h3>
              <p>Choose a student from the directory to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDirectory;
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { useCustodian } from '../../contexts/CustodianContext';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import '../../styles/modern-dashboard.css';
import '../../styles/custodian-modern.css';
import '../../styles/students-modern.css';

const CustodianStudentsPage = () => {
  const navigate = useNavigate();
  const { userProfile } = useContext(AuthContext);
  const { rooms, loadRooms } = useCustodian();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isViewProfileModalOpen, setIsViewProfileModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [students, setStudents] = useState([]);

  const custodianProfile = {
    fullName: userProfile?.name || 'Custodian',
    course: userProfile?.role || 'Custodian',
    profilePicture: userProfile?.profilePicture || 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  // Load rooms and generate students from database
  useEffect(() => {
    loadRooms();
  }, []);

  // Generate students from database rooms
  useEffect(() => {
    if (rooms && rooms.length > 0) {
      const studentList = [];
      
      rooms.forEach((room) => {
        if (room.assignedStudents && room.assignedStudents.length > 0) {
          room.assignedStudents.forEach((student, index) => {
            studentList.push({
              id: `${room._id}-${index}`,
              name: student.name || 'Unknown Student',
              studentId: student.email?.split('@')[0] || `STU${Date.now()}`,
              room: room.roomNumber,
              status: room.currentOccupants > 0 ? 'Checked-in' : 'Booked',
              avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              contact: student.phone || 'N/A',
              email: student.email || 'N/A',
              course: 'Computer Science'
            });
          });
        }
      });
      
      setStudents(studentList);
    }
  }, [rooms]);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(studentSearchTerm.toLowerCase()) ||
    student.room.toString().toLowerCase().includes(studentSearchTerm.toLowerCase())
  );

  const handleAddStudent = (e) => {
    e.preventDefault();
    const form = e.target;
    const newStudent = {
      id: students.length + 1,
      name: form.fullName.value,
      studentId: form.studentId.value,
      room: form.roomAssignment.value || '-',
      status: 'Booked', // Default status for new student
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Placeholder
      contact: '', email: '', course: '' // Placeholder
    };
    setStudents(prev => [...prev, newStudent]);
    // showToast('Student added successfully!');
    setIsAddStudentModalOpen(false);
    form.reset();
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setIsViewProfileModalOpen(true);
  };

  const handleRemoveStudent = (idToRemove) => {
    // In a real app, this would involve a confirmation and backend call
    setStudents(prev => prev.filter(s => s.id !== idToRemove));
    // showToast('Student removed.');
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  return (
    <>
      <section className="custodian-hero">
        <div className="floating-icons">
          <i className="fa-solid fa-users floating-icon-1"></i>
          <i className="fa-solid fa-user-graduate floating-icon-2"></i>
          <i className="fa-solid fa-id-card floating-icon-3"></i>
          <i className="fa-solid fa-address-book floating-icon-4"></i>
          <i className="fa-solid fa-user-friends floating-icon-5"></i>
          <i className="fa-solid fa-user-check floating-icon-6"></i>
        </div>
        <div className="hero-content">
          <h1>Student <span className="dashboard-animated">Directory</span></h1>
          <p>Search and manage all registered students</p>
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
                {/* Student Stats */}
                <div className="stats-grid-modern">
                  <div className="stat-card-modern blue">
                    <div className="stat-icon"><i className="fa-solid fa-users"></i></div>
                    <div className="stat-info">
                      <h3>{students.length}</h3>
                      <p>Total Students</p>
                      <span className="stat-trend positive">Active residents</span>
                    </div>
                  </div>
                  <div className="stat-card-modern green">
                    <div className="stat-icon"><i className="fa-solid fa-user-check"></i></div>
                    <div className="stat-info">
                      <h3>{students.filter(s => s.status === 'Checked-in').length}</h3>
                      <p>Checked In</p>
                      <span className="stat-trend positive">Currently residing</span>
                    </div>
                  </div>
                  <div className="stat-card-modern orange">
                    <div className="stat-icon"><i className="fa-solid fa-calendar-check"></i></div>
                    <div className="stat-info">
                      <h3>{students.filter(s => s.status === 'Booked').length}</h3>
                      <p>Booked</p>
                      <span className="stat-trend positive">Pending check-in</span>
                    </div>
                  </div>
                  <div className="stat-card-modern purple">
                    <div className="stat-icon"><i className="fa-solid fa-door-open"></i></div>
                    <div className="stat-info">
                      <h3>{students.filter(s => s.status === 'Checked-out').length}</h3>
                      <p>Checked Out</p>
                      <span className="stat-trend negative">Recently departed</span>
                    </div>
                  </div>
                </div>

                {/* Students Management Header */}
                <div className="students-management-header">
                  <div className="header-info">
                    <h3><i className="fas fa-users"></i> Student Directory</h3>
                    <p>Manage and monitor all registered students</p>
                  </div>
                  <div className="header-actions">
                    <div className="search-wrapper-modern">
                      <i className="fas fa-search"></i>
                      <input
                        type="search"
                        placeholder="Search by name, ID, room..."
                        value={studentSearchTerm}
                        onChange={(e) => setStudentSearchTerm(e.target.value)}
                      />
                    </div>
                    <button className="btn primary" onClick={() => setIsAddStudentModalOpen(true)}>
                      <i className="fas fa-user-plus"></i> Add Student
                    </button>
                  </div>
                </div>

                {/* Students Grid */}
                <div className="students-section-modern">
                  <div className="students-grid-modern">
                    {filteredStudents.length === 0 ? (
                      <div className="empty-state">
                        <i className="fas fa-users"></i>
                        <h4>No Students Found</h4>
                        <p>No students match your search criteria.</p>
                      </div>
                    ) : (
                      filteredStudents.map(student => (
                        <div className="student-card-modern" key={student.id}>
                          <div className="student-card-header">
                            <div className="student-avatar">
                              <img src={student.avatar} alt={student.name} />
                              <div className={`status-dot ${student.status.toLowerCase().replace('-', '')}`}></div>
                            </div>
                            <div className="student-info">
                              <h5>{student.name}</h5>
                              <span className="student-id">{student.studentId}</span>
                            </div>
                            <div className="student-status">
                              <span className={`status-badge-modern ${student.status.toLowerCase().replace('-', '')}`}>
                                {student.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="student-details-modern">
                            <div className="detail-row">
                              <span className="label">Room</span>
                              <span className="value">{student.room}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">Contact</span>
                              <span className="value">{student.contact || 'N/A'}</span>
                            </div>
                            <div className="detail-row">
                              <span className="label">Course</span>
                              <span className="value">{student.course || 'N/A'}</span>
                            </div>
                          </div>
                          
                          <div className="student-actions-modern">
                            <button className="action-btn view" onClick={() => handleViewProfile(student)} title="View Profile">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button className="action-btn message" title="Send Message">
                              <i className="fas fa-paper-plane"></i>
                            </button>
                            <button className="action-btn remove" onClick={() => handleRemoveStudent(student.id)} title="Remove Student">
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />

      {/* Add Student Modal */}
      {isAddStudentModalOpen && (
        <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && setIsAddStudentModalOpen(false)}>
          <div className="modal-content animate-on-scroll">
            <button className="close-modal-btn" onClick={() => setIsAddStudentModalOpen(false)}>&times;</button>
            <h3>Add New Student</h3>
            <form id="addStudentForm" className="modal-form" onSubmit={handleAddStudent}>
              <div className="form-grid">
                <div className="form-group"><label>Full Name</label><input type="text" name="fullName" required /></div>
                <div className="form-group"><label aria-label="Student ID">Student ID</label><input type="text" name="studentId" required /></div>
              </div>
              <div className="form-group"><label aria-label="Email Address">Email Address</label><input type="email" name="email" required /></div>
              <div className="form-group"><label aria-label="Room Assignment">Room Assignment</label><input type="text" name="roomAssignment" placeholder="e.g., A-101" /></div>
              <div className="form-actions" style={{ marginTop: '20px' }}>
                <button type="submit" className="btn primary full-width">Add Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {isViewProfileModalOpen && selectedStudent && (
        <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && setIsViewProfileModalOpen(false)}>
          <div className="modal-content profile-modal-content animate-on-scroll">
            <button className="close-modal-btn" onClick={() => setIsViewProfileModalOpen(false)}>&times;</button>
            <div className="profile-modal-header">
              <img src={selectedStudent.avatar} alt={selectedStudent.name} />
              <div>
                <h3>{selectedStudent.name}</h3>
                <p>{selectedStudent.studentId}</p>
                <span className={`status-badge ${selectedStudent.status.toLowerCase().replace('-', '')}`}>{selectedStudent.status}</span>
              </div>
            </div>
            <div className="profile-modal-body">
              <div className="profile-tabs">
                <button className="tab-link active" data-tab="details">Details</button>
                <button className="tab-link" data-tab="bookings">Bookings</button>
                <button className="tab-link" data-tab="payments">Payments</button>
              </div>
              <div className="tab-content active" id="details-tab">
                <p><strong>Contact:</strong> {selectedStudent.contact || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedStudent.email || 'N/A'}</p>
                <p><strong>Course:</strong> {selectedStudent.course || 'N/A'}</p>
              </div>
              <div className="tab-content" id="bookings-tab" style={{ display: 'none' }}>
                <p><strong>Current:</strong> Muhika Hostel, Room B-12 (Aug 2024 - Dec 2024)</p>
                <p><strong>Previous:</strong> Nana Hostel, Room C-04 (Jan 2024 - May 2024)</p>
              </div>
              <div className="tab-content" id="payments-tab" style={{ display: 'none' }}>
                <p><strong>Aug 2024:</strong> UGX 850,000 (Paid)</p>
                <p><strong>Jan 2024:</strong> UGX 800,000 (Paid)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustodianStudentsPage;
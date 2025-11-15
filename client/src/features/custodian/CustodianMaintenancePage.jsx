import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { useRoomData } from '../../contexts/RoomDataContext';
import LogoutConfirmModal from '../../components/modals/LogoutConfirmModal';
import DashboardSidebar from '../dashboard/DashboardSidebar';
import custodianService from '../../service/custodian.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import '../../styles/modern-dashboard.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const CustodianMaintenancePage = () => {
  const navigate = useNavigate();
  const { userProfile } = useContext(AuthContext);
  const { rooms, getMaintenanceStats } = useRoomData();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null); // The ticket being updated
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const custodianProfile = {
    fullName: userProfile?.name || 'Custodian',
    course: userProfile?.role || 'Custodian',
    profilePicture: userProfile?.profilePicture || 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  };

  const [columns, setColumns] = useState({
    'new-requests': {
      name: 'New Requests',
      icon: 'fa-inbox',
      items: []
    },
    'in-progress': {
      name: 'In Progress',
      icon: 'fa-tasks',
      items: []
    },
    'resolved': {
      name: 'Resolved',
      icon: 'fa-check-circle',
      items: []
    }
  });

  // Load maintenance requests from database
  const loadMaintenanceRequests = async () => {
    setIsLoading(true);
    try {
      const requests = await custodianService.getMaintenanceRequests();
      
      const newColumns = {
        'new-requests': { ...columns['new-requests'], items: [] },
        'in-progress': { ...columns['in-progress'], items: [] },
        'resolved': { ...columns['resolved'], items: [] }
      };
      
      requests.forEach(request => {
        if (request.status === 'Pending') {
          newColumns['new-requests'].items.push(request);
        } else if (request.status === 'In Progress') {
          newColumns['in-progress'].items.push(request);
        } else if (request.status === 'Resolved') {
          newColumns['resolved'].items.push(request);
        }
      });
      
      setColumns(newColumns);
    } catch (error) {
      console.error('Failed to load maintenance requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMaintenanceRequests();
  }, []);

  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      // Reordering within the same column
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    } else {
      // Moving from one column to another - update status in database
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      // Map column ID to status
      const statusMap = {
        'new-requests': 'Pending',
        'in-progress': 'In Progress',
        'resolved': 'Resolved'
      };

      try {
        await custodianService.updateMaintenanceStatus(removed.id, statusMap[destination.droppableId]);
        
        setColumns({
          ...columns,
          [source.droppableId]: {
            ...sourceColumn,
            items: sourceItems
          },
          [destination.droppableId]: {
            ...destColumn,
            items: destItems
          }
        });
        
        // Reload rooms data to reflect status changes
        if (window.custodianContext?.loadRooms) {
          window.custodianContext.loadRooms();
        }
      } catch (error) {
        console.error('Failed to update status:', error);
        // Revert the change on error
        loadMaintenanceRequests();
      }
    }
  };

  const handleOpenUpdateStatusModal = (ticket) => {
    setActiveTicket(ticket);
    setIsUpdateStatusModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!activeTicket) return;

    const newStatusValue = e.target.ticketStatus.value;
    const statusMap = {
      'in-progress': 'In Progress',
      'resolved': 'Resolved'
    };

    setIsUpdating(true);
    try {
      await custodianService.updateMaintenanceStatus(activeTicket.id, statusMap[newStatusValue]);
      
      // Move ticket between states
      const newColumns = { ...columns };
      let sourceColId = null;

      // Find and remove the ticket from its current column
      for (const colId in newColumns) {
        const itemIndex = newColumns[colId].items.findIndex(item => item.id === activeTicket.id);
        if (itemIndex > -1) {
          sourceColId = colId;
          newColumns[colId].items.splice(itemIndex, 1);
          break;
        }
      }

      // Add the ticket to the new column
      if (sourceColId) {
        newColumns[newStatusValue].items.unshift(activeTicket);
        setColumns(newColumns);
      }
      
      // Reload rooms data to reflect status changes
      if (window.custodianContext?.loadRooms) {
        window.custodianContext.loadRooms();
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }

    setIsUpdateStatusModalOpen(false);
    setActiveTicket(null);
  };

  const handleCreateTicket = (e) => {
    e.preventDefault();
    const form = e.target;
    const newTicket = {
      id: Date.now().toString(),
      room: form.roomNumber.value,
      issue: form.issue.value,
      priority: form.priority.value,
      description: form.description.value,
      submittedBy: 'Custodian', // Assuming custodian creates it
      submittedOn: new Date().toLocaleDateString('en-GB'),
    };
    setColumns(prev => ({
      ...prev,
      'new-requests': {
        ...prev['new-requests'],
        items: [newTicket, ...prev['new-requests'].items]
      }
    }));
    // showToast('New ticket created!');
    setIsCreateTicketModalOpen(false);
    form.reset();
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    navigate('/');
  };

  const renderTicketCard = (ticket, provided) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className="maintenance-card"
    >
      <div className="maintenance-card-header">
        <h4>Room {ticket.room}: {ticket.issue}</h4>
        <span className={`priority-badge ${ticket.priority.toLowerCase()}`}>{ticket.priority}</span>
      </div>
      <p className="maintenance-description">{ticket.description}</p>
      <div className="maintenance-card-footer">
        <small>Submitted by <strong>{ticket.submittedBy}</strong></small>
        <button className="btn outline small update-status-btn" onClick={() => handleOpenUpdateStatusModal(ticket)}>Update</button>
      </div>
    </div>
  );

  return (
    <>
      <section className="custodian-hero">
        <div className="floating-icons">
          <i className="fa-solid fa-tools floating-icon-1"></i>
          <i className="fa-solid fa-wrench floating-icon-2"></i>
          <i className="fa-solid fa-screwdriver-wrench floating-icon-3"></i>
          <i className="fa-solid fa-hammer floating-icon-4"></i>
          <i className="fa-solid fa-clipboard-list floating-icon-5"></i>
          <i className="fa-solid fa-hard-hat floating-icon-6"></i>
        </div>
        <div className="hero-content">
          <h1>Issue <span className="dashboard-animated">Ticketing</span></h1>
          <p>Track and resolve all student complaints and maintenance requests</p>
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

            {/* Main Content */}
            <div className="dashboard-content">
              {isLoading ? (
                <LoadingSpinner size="large" text="Loading maintenance requests..." />
              ) : (
            <div className="dashboard-section">
              <div className="section-header">
                <h3>Ticket Board</h3>
                <div className="section-actions">
                  <button className="btn primary small" onClick={() => setIsCreateTicketModalOpen(true)}><i className="fas fa-plus"></i> Create Ticket</button>
                </div>
              </div>
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="maintenance-board">
                  {Object.entries(columns).map(([columnId, column]) => (
                    <div className="maintenance-column" key={columnId}>
                      <div className="column-header"><h4><i className={`fas ${column.icon}`}></i> {column.name}</h4></div>
                      <Droppable droppableId={columnId}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`ticket-list ${snapshot.isDraggingOver ? 'is-dragging-over' : ''}`}
                          >
                            {column.items.map((item, index) => (
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided) => renderTicketCard(item, provided)}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                            {column.items.length === 0 && <p className="muted" style={{ textAlign: 'center', padding: '10px' }}>No tickets here.</p>}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
                </div>
              </DragDropContext>
            </div>
              )}
          </div>
        </div>
      </div>
      </main>
      
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />

      {/* Create Ticket Modal */}
      {isCreateTicketModalOpen && (
        <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && setIsCreateTicketModalOpen(false)}>
          <div className="modal-content animate-on-scroll">
            <button className="close-modal-btn" onClick={() => setIsCreateTicketModalOpen(false)}>&times;</button>
            <h3>Create New Ticket</h3>
            <form className="modal-form" onSubmit={handleCreateTicket}>
              <div className="form-grid">
                <div className="form-group"><label aria-label="Room Number">Room Number</label><input type="text" name="roomNumber" placeholder="e.g., A-101" required /></div>
                <div className="form-group"><label aria-label="Priority">Priority</label><select name="priority" required><option>Low</option><option>Medium</option><option>High</option></select></div>
              </div>
              <div className="form-group">
                <label aria-label="Issue">Issue</label>
                <input type="text" name="issue" placeholder="e.g., Leaking Pipe" required />
              </div>
              <div className="form-group">
                <label aria-label="Description">Description</label>
                <textarea name="description" rows="3" placeholder="Provide a brief description of the issue."></textarea>
              </div>
              <div className="form-actions" style={{ marginTop: '20px' }}><button type="submit" className="btn primary full-width">Create Ticket</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {isUpdateStatusModalOpen && activeTicket && (
        <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && setIsUpdateStatusModalOpen(false)}>
          <div className="modal-content animate-on-scroll">
            <button className="close-modal-btn" onClick={() => setIsUpdateStatusModalOpen(false)}>&times;</button>
            <h3 id="updateModalTitle">Update Ticket Status</h3>
            <p className="muted">Change the status for ticket regarding "Room {activeTicket.room}: {activeTicket.issue}".</p>
            <form className="modal-form" onSubmit={handleUpdateStatus}>
              <div className="form-group">
                <label htmlFor="ticketStatus" aria-label="New Status">New Status</label>
                <select id="ticketStatus" name="ticketStatus" required>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="statusNotes" aria-label="Notes (Optional)">Notes (Optional)</label>
                <textarea id="statusNotes" name="statusNotes" rows="3" placeholder="e.g., Plumber has been contacted."></textarea>
              </div>
              <div className="form-actions" style={{ marginTop: '20px' }}>
                <button type="submit" className="btn primary full-width" disabled={isUpdating}>
                  <i className={`fas ${isUpdating ? 'fa-spinner fa-spin' : 'fa-check'}`}></i>
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CustodianMaintenancePage;
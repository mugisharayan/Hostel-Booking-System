// Local storage service for offline functionality
const localStorageService = {
  // Hostels
  getHostels: () => {
    const hostels = localStorage.getItem('hostels');
    return hostels ? JSON.parse(hostels) : [];
  },

  saveHostel: (hostel) => {
    const hostels = localStorageService.getHostels();
    const newHostel = {
      ...hostel,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      isActive: true
    };
    hostels.push(newHostel);
    localStorage.setItem('hostels', JSON.stringify(hostels));
    return newHostel;
  },

  getHostelById: (id) => {
    const hostels = localStorageService.getHostels();
    return hostels.find(h => h._id === id);
  },

  // Users
  getCurrentUser: () => {
    const auth = localStorage.getItem('auth');
    return auth ? JSON.parse(auth) : null;
  },

  // Dashboard data
  getDashboardData: () => {
    const user = localStorageService.getCurrentUser();
    const hostels = localStorageService.getHostels();
    const userHostel = hostels.find(h => h.custodian === user?.user?._id);
    
    return {
      hostel: userHostel,
      analytics: {
        totalRevenue: 0,
        monthlyRevenue: 0,
        totalBookings: 0,
        activeBookings: 0,
        pendingPayments: 0,
        pendingBookings: 0,
        occupancyRate: 0
      }
    };
  }
};

export default localStorageService;
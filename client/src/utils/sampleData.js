// Sample hostel data for testing
export const sampleHostels = [
  {
    _id: 'sample1',
    name: 'Makerere Heights Hostel',
    location: 'Kikoni',
    description: 'A modern hostel with excellent facilities near Makerere University. Perfect for students seeking comfort and convenience.',
    contact: '+256 700 123 456',
    images: [
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
      'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg'
    ],
    amenities: [
      { name: 'WiFi', icon: 'fa-wifi' },
      { name: 'Security', icon: 'fa-shield-alt' },
      { name: 'Kitchen', icon: 'fa-utensils' },
      { name: 'Laundry', icon: 'fa-tshirt' },
      { name: 'Study Room', icon: 'fa-book' }
    ],
    rooms: [
      { name: 'Single', price: 450000, description: 'Private single room with desk and wardrobe', icon: 'fa-bed' },
      { name: 'Double', price: 650000, description: 'Shared double room with two beds', icon: 'fa-bed' },
      { name: 'Studio', price: 800000, description: 'Self-contained studio apartment', icon: 'fa-home' }
    ],
    priceRange: { min: 450000, max: 800000 },
    totalRooms: 3,
    isActive: true,
    custodian: 'sample_custodian_1',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'sample2',
    name: 'University Gardens Hostel',
    location: 'Wandegeya',
    description: 'Affordable accommodation with great amenities. Close to campus with easy access to transport.',
    contact: '+256 700 987 654',
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'
    ],
    amenities: [
      { name: 'WiFi', icon: 'fa-wifi' },
      { name: 'Parking', icon: 'fa-car' },
      { name: 'Generator', icon: 'fa-bolt' },
      { name: 'CCTV', icon: 'fa-video' }
    ],
    rooms: [
      { name: 'Single', price: 350000, description: 'Cozy single room', icon: 'fa-bed' },
      { name: 'Shared', price: 250000, description: 'Shared room with 2 beds', icon: 'fa-users' }
    ],
    priceRange: { min: 250000, max: 350000 },
    totalRooms: 2,
    isActive: true,
    custodian: 'sample_custodian_2',
    createdAt: new Date().toISOString()
  }
];

// Initialize sample data if localStorage is empty
export const initializeSampleData = () => {
  const existingHostels = localStorage.getItem('hostels');
  if (!existingHostels || JSON.parse(existingHostels).length === 0) {
    localStorage.setItem('hostels', JSON.stringify(sampleHostels));
    console.log('Sample hostels initialized in localStorage');
  }
};
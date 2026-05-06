import React from 'react';
import localStorageService from '../../service/localStorage.service';

const TestButton = () => {
  const testHostelCreation = () => {
    const testHostel = {
      name: 'Test Hostel ' + Date.now(),
      location: 'Kikoni',
      description: 'Test hostel created from button',
      contact: '+256 700 000 000',
      amenities: [
        { name: 'WiFi', icon: 'fa-wifi' },
        { name: 'Security', icon: 'fa-shield-alt' }
      ],
      rooms: [
        { name: 'Single', price: 400000, description: 'Test room', icon: 'fa-bed' }
      ],
      priceRange: { min: 400000, max: 400000 },
      images: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg']
    };

    const saved = localStorageService.saveHostel(testHostel);
    alert('Test hostel created: ' + saved.name);
    
    // Refresh hostels if function exists
    if (window.refreshHostels) {
      window.refreshHostels();
    }
  };

  return (
    <button 
      onClick={testHostelCreation}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        padding: '10px 15px',
        background: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        zIndex: 1000
      }}
    >
      Test Create Hostel
    </button>
  );
};

export default TestButton;
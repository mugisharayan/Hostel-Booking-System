import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './HostelDetails.css';

const HostelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Sample hostel data - in a real app, this would be fetched from backend
  const hostelsData = {
    1: {
      id: 1,
      name: 'Sunshine Hostel',
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
      costPerNight: 25,
      gender: 'Mixed',
      rating: { average: 4.5, reviews: 120 },
      description: 'A bright and welcoming hostel located near campus. Features include free WiFi, study rooms, and a communal kitchen.',
      amenities: ['Free WiFi', 'Study Room', 'Kitchen', 'Laundry', '24/7 Security'],
      address: '123 University Ave, Campus District',
      availableRooms: 5
    },
    2: {
      id: 2,
      name: 'University Hall',
      imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      costPerNight: 30,
      gender: 'Female',
      rating: { average: 4.8, reviews: 95 },
      description: 'Modern female-only accommodation with excellent facilities and a supportive community atmosphere.',
      amenities: ['Free WiFi', 'Gym', 'Study Room', 'Kitchen', 'Recreation Room'],
      address: '456 College Road, Student Quarter',
      availableRooms: 3
    },
    3: {
      id: 3,
      name: 'Campus Lodge',
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      costPerNight: 20,
      gender: 'Male',
      rating: { average: 4.2, reviews: 78 },
      description: 'Affordable male accommodation within walking distance of campus. Perfect for students on a budget.',
      amenities: ['Free WiFi', 'Kitchen', 'Study Area', 'Parking'],
      address: '789 Student Street, Campus Area',
      availableRooms: 8
    }
  };

  const hostel = hostelsData[id];

  if (!hostel) {
    return (
      <div className="details-container">
        <div className="not-found">
          <h2>Hostel not found</h2>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="details-container">
      <button onClick={() => navigate('/')} className="back-button">
        ← Back to Hostels
      </button>

      <div className="details-content">
        <div className="details-image-section">
          <img
            src={hostel.imageUrl}
            alt={hostel.name}
            className="details-image"
          />
        </div>

        <div className="details-info">
          <h1 className="details-title">{hostel.name}</h1>

          <div className="details-meta">
            <span className="details-rating">
              ★ {hostel.rating.average} ({hostel.rating.reviews} reviews)
            </span>
            <span className="details-gender">{hostel.gender}</span>
          </div>

          <p className="details-description">{hostel.description}</p>

          <div className="details-section">
            <h3>Location</h3>
            <p>{hostel.address}</p>
          </div>

          <div className="details-section">
            <h3>Amenities</h3>
            <ul className="amenities-list">
              {hostel.amenities.map((amenity, index) => (
                <li key={index}>✓ {amenity}</li>
              ))}
            </ul>
          </div>

          <div className="details-booking">
            <div className="booking-info">
              <p className="price-label">Price per night</p>
              <p className="price-value">${hostel.costPerNight}</p>
              <p className="rooms-available">
                {hostel.availableRooms} rooms available
              </p>
            </div>
            <button className="book-button">Book Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelDetails;

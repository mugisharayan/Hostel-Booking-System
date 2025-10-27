import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  // Sample hostel data - in a real app, this would come from your backend
  const hostels = [
    {
      id: 1,
      name: 'Sunshine Hostel',
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
      costPerSemester: 800000,
      gender: 'Mixed',
      rating: { average: 4.5, reviews: 120 }
    },
    {
      id: 2,
      name: 'University Hall',
      imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400',
      costPerSemester: 1200000,
      gender: 'Female',
      rating: { average: 4.8, reviews: 95 }
    },
    {
      id: 3,
      name: 'Campus Lodge',
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      costPerSemester: 650000,
      gender: 'Male',
      rating: { average: 4.2, reviews: 78 }
    }
  ];

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Student Hostel Booking</h1>
        <p>Find your perfect home away from home</p>
        <Link to="/payment" className="payment-link">
          <button className="payment-button">Go to Payment</button>
        </Link>
         <Link to="/student/dashboard">
          <button>Go to My Dashboard</button>
        </Link>
      </header>

      <div className="hostels-grid">
        {hostels.map((hostel) => (
          <Link
            key={hostel.id}
            to={`/hostel/${hostel.id}`}
            className="hostel-card-link"
          >
            <div className="hostel-card">
              <img
                src={hostel.imageUrl}
                alt={hostel.name}
                className="hostel-image"
              />
              <div className="hostel-info">
                <h2 className="hostel-name">{hostel.name}</h2>
                <p className="hostel-cost">UGX {hostel.costPerSemester.toLocaleString()} / semester</p>
                <div className="hostel-meta">
                  <span className="hostel-gender">{hostel.gender}</span>
                  {hostel.rating && (
                    <span className="hostel-rating">
                      ★ {hostel.rating.average} ({hostel.rating.reviews})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;

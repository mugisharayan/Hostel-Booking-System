import { createBooking } from '../services/bookingService';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './HostelDetails.css';

const HostelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Real data to be fetched from backend
  const hostelsData = {
    1: {
      id: 1,
      name: 'Sunshine Hostel',
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800',
      costPerSemester: 800000,
      gender: 'Mixed',
      rating: { average: 4.5, reviews: 120 },
      description: 'A bright and welcoming hostel located near campus. Features include free WiFi, study rooms, and a communal kitchen.',
      amenities: ['Free WiFi', 'Study Room', 'Kitchen', 'Laundry', '24/7 Security'],
      address: '123 University Ave, Makerere',
      availableRooms: 5,
      coordinates: { lat: 0.3301, lng: 32.5713 } // Makerere University area
    },
    2: {
      id: 2,
      name: 'University Hall',
      imageUrl: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
      costPerSemester: 1200000,
      gender: 'Female',
      rating: { average: 4.8, reviews: 95 },
      description: 'Modern female-only accommodation with excellent facilities and a supportive community atmosphere.',
      amenities: ['Free WiFi', 'Gym', 'Study Room', 'Kitchen', 'Recreation Room'],
      address: '456 Wandegeya, Kampala',
      availableRooms: 3,
      coordinates: { lat: 0.3376, lng: 32.5731 } // Wandegeya area
    },
    3: {
      id: 3,
      name: 'Campus Lodge',
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      costPerSemester: 650000,
      gender: 'Male',
      rating: { average: 4.2, reviews: 78 },
      description: 'Affordable male accommodation within walking distance of campus. Perfect for students on a budget.',
      amenities: ['Free WiFi', 'Kitchen', 'Study Area', 'Parking'],
      address: '789 Kikoni, Kampala',
      availableRooms: 8,
      coordinates: { lat: 0.3352, lng: 32.5642 } // Kikoni area
    }
  };

  const handleBookNow = async () => {
    try {
      const bookingDetails = {
        // Add any other booking details you need to send to the backend
      };
      const newBooking = await createBooking(hostel.id, bookingDetails);
      navigate(`/payment/${newBooking.id}`);
    } catch (error) {
      console.error('Failed to create booking:', error);
      // Handle error appropriately, e.g., show an error message to the user
    }
  };

  // Google Maps configuration
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px'
  };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
  };

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

          <div className="details-section">
            <h3>Map Location</h3>
            <div className="map-container">
              <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={hostel.coordinates}
                  zoom={15}
                  options={mapOptions}
                >
                  <Marker
                    position={hostel.coordinates}
                    title={hostel.name}
                  />
                </GoogleMap>
              </LoadScript>
            </div>
          </div>

          <div className="details-booking">
            <div className="booking-info">
              <p className="price-label">Price per semester</p>
              <p className="price-value">UGX {hostel.costPerSemester.toLocaleString()}</p>
              <p className="rooms-available">
                {hostel.availableRooms} rooms available
              </p>
            </div>
            <button className="book-button" onClick={handleBookNow}>Book Now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostelDetails;

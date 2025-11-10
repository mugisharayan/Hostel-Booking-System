import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

const HostelCard = ({ hostelId, hostel }) => {
  const { isFavorited, toggleFavorite } = useContext(AuthContext);
  const isFav = isFavorited(hostelId);

  // Get the lowest price from rooms array
  const lowestPrice = hostel.rooms && hostel.rooms.length > 0
    ? Math.min(...hostel.rooms.map(room => room.price))
    : 0;

  // Get default image if no images provided
  const defaultImage = 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1';
  const hostelImage = hostel.images && hostel.images[0] ? hostel.images[0] : defaultImage;

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleFavorite(hostelId);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  return (
    <div className="modern-hostel-card">
      <div className="hostel-image-container">
        <img
          src={hostelImage}
          alt={hostel.name}
          className="hostel-image"
        />
        <div className="image-overlay">
          <button
            className={`favorite-btn ${isFav ? 'favorited' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <i className={`fa-${isFav ? 'solid' : 'regular'} fa-heart`}></i>
          </button>
          <div className="price-badge">
            {lowestPrice > 0 ? (
              <>
                <span className="price-from">From</span>
                <span className="price-amount">UGX {(lowestPrice / 1000).toFixed(0)}K</span>
              </>
            ) : (
              <span className="price-request">Contact</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="hostel-content">
        <div className="hostel-header">
          <h3 className="hostel-name">{hostel.name}</h3>
          <div className="location-info">
            <i className="fas fa-map-marker-alt"></i>
            <span>{hostel.location}</span>
          </div>
        </div>

        <div className="amenities-grid">
          {hostel.amenities && hostel.amenities.slice(0, 4).map((amenity, index) => (
            <div key={index} className="amenity-item" title={amenity.name}>
              <i className={`fas ${amenity.icon}`}></i>
              <span className="amenity-name">{amenity.name}</span>
            </div>
          ))}
          {hostel.amenities && hostel.amenities.length > 4 && (
            <div className="amenity-item more-amenities">
              <i className="fas fa-plus"></i>
              <span className="amenity-name">+{hostel.amenities.length - 4} more</span>
            </div>
          )}
        </div>

        <div className="room-info">
          <div className="room-count">
            <i className="fas fa-bed"></i>
            <span>{hostel.rooms ? hostel.rooms.length : 0} room types</span>
          </div>
          <div className="contact-info">
            <i className="fas fa-phone"></i>
            <span>{hostel.contact}</span>
          </div>
        </div>

        <div className="card-actions">
          <Link to={`/hostel/${hostelId}`} className="view-details-btn">
            <span>View Details</span>
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AuthContext } from '../auth/AuthContext';
import {
  formatPriceRange,
  getImageWithFallback,
  limitArray,
  getRemainingCount,
  createAsyncHandler,
  stopPropagation,
  createAriaLabel
} from '../../utils/component.utils.js';

// Constants
const MAX_AMENITIES_DISPLAY = 4;

// Helper functions
const getRoomPrices = (rooms) => {
  if (!rooms || !Array.isArray(rooms)) return [];
  return rooms.map(room => room.price).filter(price => price > 0);
};

const HostelCard = ({ hostelId, hostel }) => {
  const { isFavorited, toggleFavorite } = useContext(AuthContext);
  const isFav = isFavorited(hostelId);

  // Data processing
  const roomPrices = getRoomPrices(hostel.rooms);
  const priceDisplay = formatPriceRange(roomPrices);
  const hostelImage = getImageWithFallback(hostel.images, 'hostel');
  const displayAmenities = limitArray(hostel.amenities, MAX_AMENITIES_DISPLAY);
  const remainingAmenitiesCount = getRemainingCount(hostel.amenities, MAX_AMENITIES_DISPLAY);

  // Event handlers
  const handleFavoriteClick = stopPropagation(
    createAsyncHandler(
      () => toggleFavorite(hostelId),
      (error) => console.error('Failed to toggle favorite:', error)
    )
  );

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
            aria-label={createAriaLabel('favorites', hostel.name, isFav)}
          >
            <i className={`fa-${isFav ? 'solid' : 'regular'} fa-heart`}></i>
          </button>
          <div className="price-badge">
            {roomPrices.length > 0 ? (
              <>
                <span className="price-from">From</span>
                <span className="price-amount">{priceDisplay}</span>
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
          {displayAmenities.map((amenity, index) => (
            <div key={index} className="amenity-item" title={amenity.name}>
              <i className={`fas ${amenity.icon}`}></i>
              <span className="amenity-name">{amenity.name}</span>
            </div>
          ))}
          {remainingAmenitiesCount > 0 && (
            <div className="amenity-item more-amenities">
              <i className="fas fa-plus"></i>
              <span className="amenity-name">+{remainingAmenitiesCount} more</span>
            </div>
          )}
        </div>

        <div className="room-info">
          <div className="room-count">
            <i className="fas fa-bed"></i>
            <span>{hostel.rooms?.length || 0} room types</span>
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

HostelCard.propTypes = {
  hostelId: PropTypes.string.isRequired,
  hostel: PropTypes.shape({
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
    contact: PropTypes.string.isRequired,
    amenities: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    })),
    rooms: PropTypes.arrayOf(PropTypes.shape({
      price: PropTypes.number
    }))
  }).isRequired
};

export default HostelCard;

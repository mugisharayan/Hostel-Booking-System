import React, { useContext, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { logger } from '../../utils/logger';
import { handleError } from '../../utils/errorHandler';
import '../../styles/modern-hostel-card.css';

const HostelCard = React.memo(({ hostelId, hostel }) => {
  const { isFavorited, toggleFavorite } = useContext(AuthContext);
  const isFav = isFavorited(hostelId);

  // Memoize expensive calculations
  const lowestPrice = useMemo(() => {
    if (!hostel.rooms?.length) return 0;
    return Math.min(...hostel.rooms.map(room => room.price || 0));
  }, [hostel.rooms]);

  const defaultImage = 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1';
  const hostelImage = useMemo(() => 
    hostel.images?.[0] || defaultImage, 
    [hostel.images, defaultImage]
  );

  const handleImageError = useCallback((e) => {
    e.target.src = defaultImage;
    logger.warn('Image failed to load', { hostelId, originalSrc: e.target.src });
  }, [defaultImage, hostelId]);

  const handleFavoriteClick = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleFavorite(hostelId);
      logger.info('Favorite toggled', { hostelId, isFavorited: !isFav });
    } catch (error) {
      const { message } = handleError(error, 'Toggle favorite failed');
      // Could show toast notification here
    }
  }, [toggleFavorite, hostelId, isFav]);

  return (
    <div className="modern-hostel-card">
      <div className="hostel-image-container">
        <img
          src={hostelImage}
          alt={hostel.name}
          className="hostel-image"
          onError={handleImageError}
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

        <div className="amenities-cards">
          {hostel.amenities?.slice(0, 4).map((amenity, index) => {
            const amenityName = typeof amenity === 'string' ? amenity : amenity.name;
            
            return (
              <div key={`${hostelId}-amenity-${index}`} className="amenity-card">
                <span className="amenity-text">{amenityName}</span>
              </div>
            );
          })}
          {hostel.amenities?.length > 4 && (
            <div className="amenity-card more-amenities">
              <span className="amenity-text">+{hostel.amenities.length - 4} more</span>
            </div>
          )}
        </div>

        <div className="hostel-stats">
          <div className="room-count">
            <i className="fas fa-bed"></i>
            <span>{hostel.rooms ? hostel.rooms.length : 0} types</span>
          </div>
          <div className="contact-info">
            <i className="fas fa-phone"></i>
            <span>{hostel.contact?.slice(0, 8)}...</span>
          </div>
        </div>

        <div className="rating-info">
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <i key={`${hostelId}-star-${i}`} className={i < Math.round(hostel.averageRating || 0) ? 'fas fa-star' : 'far fa-star'}></i>
            ))}
          </div>
          <span className="rating-text">{(hostel.averageRating || 0).toFixed(1)} ({hostel.reviewCount || 0})</span>
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
});

HostelCard.displayName = 'HostelCard';

export default HostelCard;

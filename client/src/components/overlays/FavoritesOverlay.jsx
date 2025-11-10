import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../features/auth/AuthContext';

const FavoritesOverlay = ({ isOpen, onClose }) => {
  const { favorites, toggleFavorite } = useContext(AuthContext);

  const handleRemoveFavorite = async (hostelId) => {
    try {
      await toggleFavorite(hostelId);
    } catch (error) {
      alert('Failed to remove favorite');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cart-overlay is-visible" onClick={(e) => e.target.className.includes('cart-overlay') && onClose()}>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>Your Favorites</h3>
          <button className="close-cart-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="cart-body">
          {favorites.length === 0 ? (
            <p className="cart-empty-message">You haven't added any hostels to your favorites yet.</p>
          ) : (
            favorites.map(fav => {
              if (!fav.hostel) return null;
              const hostel = fav.hostel;
              const lowestPrice = hostel.rooms && hostel.rooms.length > 0 
                ? hostel.rooms.reduce((min, room) => (room.price < min ? room.price : min), Infinity)
                : 0;
              const defaultImage = (hostel.images && hostel.images.length > 0) ? hostel.images[0] : 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1';
              
              return (
                <div className="cart-item" data-id={hostel._id} key={fav._id}>
                  <img src={defaultImage} alt={hostel.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <h5>{hostel.name}</h5>
                    <p className="cart-item-price">UGX {lowestPrice.toLocaleString()}</p>
                    <div className="cart-item-actions">
                      <button className="remove-item-btn remove-favorite-btn" onClick={() => handleRemoveFavorite(hostel._id)}>Remove</button>
                    </div>
                  </div>
                </div>
              );
            }).filter(Boolean)
          )}
        </div>
        <div className="cart-footer">
          <Link to="/hostels" className="btn primary checkout-btn" onClick={onClose}>Explore Hostels</Link>
        </div>
      </div>
    </div>
  );
};

export default FavoritesOverlay;
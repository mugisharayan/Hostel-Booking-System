import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../../service/api.service';
import { AuthContext } from '../auth/AuthContext';
import reviewService from '../../service/review.service';
import '../../styles/hostel-detail-modern.css';
import '../../styles/hostel-detail-enhanced.css';

const HostelDetailPage = ({ onOpenAuthModal }) => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isFavorited, toggleFavorite } = useContext(AuthContext);
  
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    const loadHostel = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.hostels.getById(hostelId);
        setHostel(response.data);
      } catch (err) {
        console.error('Failed to load hostel:', err);
        setError(`Failed to load hostel details: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    const loadReviews = async () => {
      try {
        setReviewsLoading(true);
        const reviewsData = await reviewService.getHostelReviews(hostelId);
        setReviews(reviewsData);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };
    
    if (hostelId) {
      loadHostel();
      loadReviews();
    }
  }, [hostelId]);



  useEffect(() => {
    if (hostel && hostel.images && hostel.images.length > 1) {
      const interval = setInterval(() => {
        setActiveImageIndex((prev) => (prev + 1) % hostel.images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [hostel]);

  if (loading) {
    return (
      <main className="hostel-detail-page new-design">
        <div className="container">
          <div className="loading-message">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <h4>Loading Hostel Details...</h4>
            <p>Please wait while we fetch the hostel information.</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="hostel-detail-page new-design">
        <div className="container">
          <div className="error-message">
            <i className="fa-solid fa-exclamation-triangle"></i>
            <h4>Unable to Load Hostel</h4>
            <p>{error}</p>
            <div className="error-actions">
              <button className="btn primary" onClick={() => window.location.reload()}>Try Again</button>
              <Link to="/hostels" className="btn outline">Back to Hostels</Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!hostel) {
    return (
      <main className="hostel-detail-page new-design">
        <div className="container">
          <div className="error-message">
            <i className="fa-solid fa-search"></i>
            <h4>Hostel Not Found</h4>
            <p>The hostel you are looking for does not exist or the link is incorrect.</p>
            <Link to="/hostels" className="btn primary">Back to Hostels</Link>
          </div>
        </div>
      </main>
    );
  }

  const handleToggleFavorite = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!isAuthenticated) {
      onOpenAuthModal();
      return;
    }

    try {
      await toggleFavorite(hostelId);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      alert(error.message || 'Failed to update favorite');
    }
  };

  const openLightbox = (index) => {
    if (hostel.images && hostel.images.length > 0) {
      setCurrentImageIndex(index);
      setIsLightboxOpen(true);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const showNextImage = () => {
    if (hostel.images && hostel.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % hostel.images.length);
    }
  };

  const showPrevImage = () => {
    if (hostel.images && hostel.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + hostel.images.length) % hostel.images.length);
    }
  };

  const handleBookNow = (room) => {
    if (isAuthenticated) {
      const params = new URLSearchParams({
        hostel: hostel.name,
        room: room.name,
        price: room.price,
        image: hostel.images && hostel.images[0] ? hostel.images[0] : 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1',
      });
      navigate(`/booking?${params.toString()}`);
    } else {
      onOpenAuthModal();
    }
  };

  return (
    <>
      <main className="hostel-detail-page new-design">
        {/* Hero Section */}
        <section className="detail-hero-section">
          <div className="floating-home-icons">
            <i className="fa-solid fa-home floating-home-1"></i>
            <i className="fa-solid fa-home floating-home-2"></i>
            <i className="fa-solid fa-home floating-home-3"></i>
            <i className="fa-solid fa-home floating-home-4"></i>
            <i className="fa-solid fa-home floating-home-5"></i>
            <i className="fa-solid fa-home floating-home-6"></i>
          </div>
          <div className="detail-hero-container">
            <div className="detail-hero-content">
              <h1 className="detail-hero-title">
                {hostel.name.split(/(Hostel|hostel)/i).map((part, index) => 
                  /hostel/i.test(part) ? <span key={index} className="hostel-name-animated">{part}</span> : part
                )}
              </h1>
              <div className="detail-hero-meta">
                <span><i className="fa-solid fa-star"></i> {reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'} ({reviews.length} reviews)</span>
                <span className="separator-dot">·</span>
                <span><i className="fa-solid fa-map-marker-alt"></i> {hostel.location}, Makerere</span>
              </div>
              <div className="new-header-actions">
                <button className={`btn outline small ${isFavorited(hostelId) ? 'active' : ''}`} onClick={handleToggleFavorite}>
                  <i className={isFavorited(hostelId) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i> {isFavorited(hostelId) ? 'Favorited' : 'Favorite'}
                </button>
                <Link to="/hostels" className="back-btn">Back to Hostels</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="hero-section animate-on-scroll">
            <div className="fullwidth-gallery">
              <div className="main-display-image">
                <img key={activeImageIndex} src={hostel.images && hostel.images[activeImageIndex] ? hostel.images[activeImageIndex] : 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg'} alt={hostel.name} />
                <div className="gallery-overlay-gradient"></div>
                <div className="thumbnail-cards">
                  {hostel.images && hostel.images.map((imgSrc, index) => (
                    <div 
                      key={index}
                      className={`thumbnail-card ${index === activeImageIndex ? 'active' : ''}`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img src={imgSrc} alt={`${hostel.name} ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </section>

        <section className="about-amenities-section animate-on-scroll" style={{ transitionDelay: '100ms' }}>
          <div className="section-wrapper">
            <div className="about-content-wrapper">
              <div className="about-icon-box">
                <i className="fa-solid fa-building"></i>
              </div>
              <div className="about-text-content">
                <h2>About {hostel.name}</h2>
                <p className="about-text">{hostel.description || `${hostel.name} is a quality hostel located in ${hostel.location}, offering comfortable accommodation for students near Makerere University. Contact us at ${hostel.contact} for more information about our facilities and room options.`}</p>
                <div className="about-stats">
                  <div className="stat-item">
                    <i className="fa-solid fa-users"></i>
                    <div>
                      <strong>500+</strong>
                      <span>Students</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <i className="fa-solid fa-star"></i>
                    <div>
                      <strong>{reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}</strong>
                      <span>Rating</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <i className="fa-solid fa-shield-alt"></i>
                    <div>
                      <strong>24/7</strong>
                      <span>Security</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="amenities-divider"></div>
            
            <div className="amenities-content">
              <h3>What We Offer</h3>
              <div className="amenity-list">
                {hostel.amenities && hostel.amenities.map((amenity, index) => (
                  <div className="amenity-box" key={index}>
                    <i className={`fa-solid ${amenity.icon}`}></i>
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="amenities-divider"></div>
            
            <div className="pricing-content">
              <h3>Choose Your Room</h3>
              <div className="pricing-grid">
                {hostel.rooms && hostel.rooms.map((room, index) => (
                  <div className="pricing-card" key={index}>
                    <i className={`fa-solid ${room.icon || 'fa-bed'} pricing-icon`}></i>
                    <h3>{room.name}</h3>
                    <p>{room.description}</p>
                    <div className="pricing-card-price">
                      <strong>UGX {room.price.toLocaleString()}</strong>
                      <span>/ semester</span>
                    </div>
                    <button className="btn primary full-width" onClick={() => handleBookNow(room)}>
                      Book This Room
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="container">
          <section className="location-section animate-on-scroll" style={{ transitionDelay: '100ms' }}>
            <div className="location-content">
              <div className="location-info">
                <div className="location-icon">
                  <i className="fa-solid fa-map-marker-alt"></i>
                </div>
                <h2>Find Us Here</h2>
                <p className="location-description">Conveniently located near Makerere University, making your daily commute easy and stress-free.</p>
                <div className="location-details">
                  <div className="detail-item">
                    <i className="fa-solid fa-location-dot"></i>
                    <span>{hostel.location}, Makerere</span>
                  </div>
                  <div className="detail-item">
                    <i className="fa-solid fa-phone"></i>
                    <span>{hostel.contact}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fa-solid fa-walking"></i>
                    <span>5 min walk to campus</span>
                  </div>
                </div>
              </div>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.75342939951!2d32.56619241475336!3d0.3339234997695831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb6304295555%3A0x48315151187363d2!2sMakerere%20University!5e0!3m2!1sen!2sug!4v1678186439001!5m2!1sen!2sug"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </section>
        </div>

        <section className="review-action-section animate-on-scroll" style={{ transitionDelay: '400ms' }}>
            <h2>RATINGS AND REVIEWS</h2>
            <div className="review-box">
              <div className="review-summary-col">
                <div className="review-summary">
                  <div className="summary-total">
                    <div className="total-rating">{reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}</div>
                    <div className="total-stars">
                      {(() => {
                        const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
                        return [...Array(5)].map((_, i) => (
                          <i key={i} className={i < Math.round(avgRating) ? 'fa-solid fa-star' : 'fa-regular fa-star'}></i>
                        ));
                      })()}
                    </div>
                    <div className="total-reviews">{reviews.length} reviews</div>
                  </div>
                  <div className="summary-bars">
                    {(() => {
                      const ratingCounts = [0, 0, 0, 0, 0];
                      reviews.forEach(r => ratingCounts[r.rating - 1]++);
                      const total = reviews.length || 1;
                      return [5, 4, 3, 2, 1].map(star => {
                        const count = ratingCounts[star - 1];
                        const percentage = Math.round((count / total) * 100);
                        return (
                          <div className="bar-item" key={star}>
                            <span>{star} Star</span>
                            <div className="bar-container"><div className="bar" style={{ width: `${percentage}%` }}></div></div>
                            <span>{percentage}%</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
              <div className="reviews-list-col">
                {reviewsLoading ? (
                  <div style={{textAlign: 'center', padding: '40px'}}>
                    <i className="fa-solid fa-spinner fa-spin" style={{fontSize: '32px', color: '#0ea5e9'}}></i>
                    <p>Loading reviews...</p>
                  </div>
                ) : reviews.length === 0 ? (
                  <div style={{textAlign: 'center', padding: '40px'}}>
                    <i className="fa-solid fa-comment-slash" style={{fontSize: '48px', color: '#cbd5e1', marginBottom: '16px'}}></i>
                    <p style={{color: '#64748b'}}>No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <article className="review-card" key={review._id}>
                      <div className="review-card-header">
                        <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Reviewer avatar" />
                        <div className="review-author-info">
                          <h5>{review.student?.name || 'Anonymous'}</h5>
                          <small>Reviewed on {new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</small>
                        </div>
                        <div className="review-stars">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={i < review.rating ? 'fa-solid fa-star' : 'fa-regular fa-star'}></i>
                          ))}
                        </div>
                      </div>
                      <p className="review-text">"{review.comment}"</p>
                    </article>
                  ))
                )}
              </div>
            </div>

            <div className="action-buttons">
              <a href={`tel:${hostel.contact}`} className="contact-btn">CONTACT {hostel.contact}</a>
            </div>
        </section>
      </main>

      {/* IMAGE LIGHTBOX MODAL */}
      {isLightboxOpen && hostel.images && hostel.images.length > 0 && (
        <div className="lightbox-overlay is-visible" onClick={closeLightbox}>
          <button className="lightbox-close-btn" onClick={closeLightbox}>&times;</button>
          <button className="lightbox-nav-btn prev" onClick={(e) => { e.stopPropagation(); showPrevImage(); }}><i className="fa-solid fa-chevron-left"></i></button>
          <div className="lightbox-content">
            <img src={hostel.images[currentImageIndex]} alt="Lightbox image" />
          </div>
          <button className="lightbox-nav-btn next" onClick={(e) => { e.stopPropagation(); showNextImage(); }}><i className="fa-solid fa-chevron-right"></i></button>
        </div>
      )}
    </>
  );
};

export default HostelDetailPage;
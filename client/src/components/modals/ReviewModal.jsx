import React, { useState, useEffect } from 'react';
import reviewService from '../../service/review.service';

const ReviewModal = ({ isOpen, onClose, booking }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setRating(0);
      setHoverRating(0);
      setComment('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await reviewService.createReview({
        hostel: booking.hostel,
        booking: booking._id,
        rating,
        comment
      });
      onClose(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="modal-overlay is-visible" onClick={(e) => e.target.className.includes('modal-overlay') && onClose()}>
      <div className="modal-content animate-on-scroll">
        <button className="close-modal-btn" onClick={onClose}>&times;</button>
        <h3>Write a Review for <span id="reviewHostelName">{booking.hostelName}</span></h3>
        <p className="muted">Share your experience to help other students.</p>
        {error && <div style={{padding: '10px', background: '#fee', color: '#c00', borderRadius: '8px', marginBottom: '15px'}}>{error}</div>}
        <form className="rating-form modal-form" onSubmit={handleSubmit}>
          <div className="rating-group">
            <label>Overall Rating</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((value) => (
                <i
                  key={value}
                  className={(hoverRating || rating) >= value ? 'fa-solid fa-star' : 'fa-regular fa-star'}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(value)}
                  style={{cursor: 'pointer'}}
                ></i>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="reviewText">Your Review</label>
            <textarea
              id="reviewText"
              placeholder="Share details of your experience at this hostel..."
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-actions" style={{ marginTop: '20px' }}>
            <button type="submit" className="btn primary full-width" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
import React from 'react';

const HostelCard = ({ hostel }) => {
    // Destructure the required details from the hostel object
    const { name, imageUrl, costPerNight, gender, rating } = hostel;

    return (
        <div className="hostel-card">
            <img src={imageUrl} alt={name} className="hostel-card-thumbnail" />
            <div className="hostel-details">
                <h3 className="hostel-name">{name}</h3>
                <p className="hostel-cost">Cost: **${costPerNight}** / night</p>
                <p className="hostel-gender">Gender: {gender}</p>

                {/* Requirement: Display rating only for reviewed hostels */}
                {rating && rating.average > 0 ? (
                    <div className="hostel-rating">
                        {/* Assuming rating.average is 4.5 and rating.reviews is 120 */}
                        <span className="star-rating">★ {rating.average.toFixed(1)}</span>
                        <span className="review-count">({rating.reviews} reviews)</span>
                    </div>
                ) : (
                    <p className="no-rating">New Listing - Be the first to review!</p>
                )}

                <button className="book-now-button">Book Now</button>
            </div>
        </div>
    );
};

export default HostelCard;
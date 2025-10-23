import React from 'react';

const HostelCard = ({ hostel }) => {
    // Destructure the required details from the hostel object
    const { name, imageUrl, costPerSemester, gender, rating } = hostel;

        return (
                <div className="hostel-card image-overlay-card">
                        <div className="image-wrap">
                            <img src={imageUrl} alt={name} className="hostel-card-thumbnail" />
                            <div className="overlay">
                                <div className="overlay-content">
                                    <h3 className="hostel-name">{name}</h3>
                                    <p className="hostel-cost">UGX {costPerSemester.toLocaleString()}</p>
                                    <p className="hostel-gender">{gender}</p>
                                    {rating && rating.average > 0 ? (
                                        <div className="hostel-rating">★ {rating.average.toFixed(1)} ({rating.reviews})</div>
                                    ) : (
                                        <div className="no-rating">New Listing</div>
                                    )}

                                    <div className="overlay-actions">
                                        <a href={`/hostel/${name}`} className="btn-details">View</a>
                                        <a href="/booking" className="btn-book">Book Now</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
        );
};

export default HostelCard;
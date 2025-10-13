import React from 'react';

function PopularHostels() {
  return (
    <section id="hostels" className="popular-hostels">
      <h2>Popular Hostels</h2>
      <div className="hostel-grid">
        {/* Card 1 */}
        <div className="hostel-card">
          <img src="https://businessfocus.co.ug/wp-content/uploads/2022/02/Olympia-hostel.png" alt="Olympia Hostel" />
          <h3>Olympia Hostel</h3>
          <p>Known for its modern amenities and vibrant student community near Makerere University.</p>
          <div className="card-footer"><a href="#" className="btn-details">View Details</a></div>
        </div>
        {/* Card 2 */}
        <div className="hostel-card">
          <img src="https://businessfocus.co.ug/wp-content/uploads/2022/02/Nana-Hostel-Exterior-Photo-by-Fahad-Muganga-999x628.png" alt="Nana Hostel" />
          <h3>Nana Hostel</h3>
          <p>A popular choice for students, offering a comfortable and secure living environment in Kikoni.</p>
          <div className="card-footer"><a href="#" className="btn-details">View Details</a></div>
        </div>
        {/* Card 3 */}
        <div className="hostel-card">
          <img src="https://www.ugabox.com/images/business/directory/hostels/akamwesi-hostel/Akamwesi-Hostel-Nakawa-Aka-Hostel-Makerere-University-Business-School-MUBS-Victoria-University-Student-Hostel-Kampala-Uganda-01.JPG" alt="Akamwesi Hostel" />
          <h3>Akamwesi Hostel</h3>
          <p>Famous for its spacious rooms and excellent facilities, providing a home away from home.</p>
          <div className="card-footer"><a href="#" className="btn-details">View Details</a></div>
        </div>
        {/* Card 4 */}
        <div className="hostel-card">
          <img src="https://businessfocus.co.ug/wp-content/uploads/2022/02/Olympia-hostel.png" alt="Kare Hostels" />
          <h3>Kare Hostels</h3>
          <p>Offers a premium living experience with a focus on comfort and a conducive study environment.</p>
          <div className="card-footer"><a href="#" className="btn-details">View Details</a></div>
        </div>
        {/* Card 5 */}
        <div className="hostel-card">
          <img src="https://businessfocus.co.ug/wp-content/uploads/2022/02/Nana-Hostel-Exterior-Photo-by-Fahad-Muganga-999x628.png" alt="Dream World Hostel" />
          <h3>Dream World Hostel</h3>
          <p>A well-regarded hostel providing a safe and social atmosphere for students.</p>
          <div className="card-footer"><a href="#" className="btn-details">View Details</a></div>
        </div>
        {/* Card 6 */}
        <div className="hostel-card">
          <img src="https://businessfocus.co.ug/wp-content/uploads/2022/02/Nana-Hostel-Exterior-Photo-by-Fahad-Muganga-999x628.png" alt="God is Able Hostel" />
          <h3>God is Able Hostel</h3>
          <p>A long-standing favorite among students, known for its affordability and prime location.</p>
          <div className="card-footer"><a href="#" className="btn-details">View Details</a></div>
        </div>
      </div>
    </section>
  );
}

export default PopularHostels;

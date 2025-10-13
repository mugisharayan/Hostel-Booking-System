import React, { useState, useEffect } from 'react';

const slides = [
  'https://africau.edu/wp-content/themes/africau/images/rooms.jpg',
  'https://i.pinimg.com/600x315/f5/85/f2/f585f251f2fff48e568b0f67b2074c03.jpg',
  'https://businessfocus.co.ug/wp-content/uploads/2022/02/Nana-Hostel-Exterior-Photo-by-Fahad-Muganga-999x628.png',
  'https://t3.ftcdn.net/jpg/06/41/43/32/360_F_641433239_pACX3e2VvN6ZtGSAEIK65GLr8kbMZC32.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTv8KaYWo-7YgSr2zGNGz5kbjikvirarSl0SBnnIjCfbj9FZbnK6x8N5wLz_f8139zvcCA&usqp=CAU',
  'https://q-xx.bstatic.com/xdata/images/hotel/max1024x768/636629074.jpg?k=1acff90ab8b854c4cd28ddadecd27f6e1de7ffd4bee2d56154a2987f4c1b2e67&o=',
  'https://miro.medium.com/v2/resize:fit:1400/0*ED56y_XvY_nVoQ4V'
];

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hero-slideshow">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url('${slide}')` }}
          ></div>
        ))}
      </div>
      <div className="hero-content">
        <h1>Find Your Perfect Student Home</h1>
        <p>Browse the best verified hostels near campus. Safe, affordable, and convenient living starts here..</p>
        <a href="#hostels" className="btn">Find a Bed</a>
      </div>
    </section>
  );
}

export default Hero;

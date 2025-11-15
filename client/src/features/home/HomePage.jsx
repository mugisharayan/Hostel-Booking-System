import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HostelCard from '../hostels/HostelCard';
import { apiService } from '../../service/api.service';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const HomePage = () => {
  // State for slideshow
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    'https://endowment.mak.ac.ug/media/images/An_elevated_front_view_of_the_sun.2e16d0ba.fill-1200x630.jpg',
    'https://africau.edu/wp-content/themes/africau/images/rooms.jpg',
    'https://pbs.twimg.com/media/F0Q3IPWWYAAJapK?format=jpg&name=large',
    'https://miro.medium.com/v2/resize:fit:720/format:webp/0*ED56y_XvY_nVoQ4V',
    'https://media.istockphoto.com/id/1442481799/photo/hand-holding-house-keys.jpg?s=612x612&w=0&k=20&c=5cyT01_KEfkKzSSfLmI4Nvyvk9Ng5LUGVgl5kN7kpeY=',
    'https://pbs.twimg.com/media/GvdKdxeW4AASIML?format=jpg&name=medium',
  ];

  // State for contact form
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  
  // State for featured hostels
  const [featuredHostels, setFeaturedHostels] = useState([]);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [heroSlides.length]);

  // State for countdown timer (simplified)
  const [countdown, setCountdown] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  useEffect(() => {
    const countDownDate = new Date();
    countDownDate.setDate(countDownDate.getDate() + 3); // 3 days from now

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setCountdown({ days: 'EXPIRED', hours: '', minutes: '', seconds: '' });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCountdown({
          days: String(days).padStart(2, '0'),
          hours: String(hours).padStart(2, '0'),
          minutes: String(minutes).padStart(2, '0'),
          seconds: String(seconds).padStart(2, '0'),
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Testimonial Slider (simplified)
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const testimonials = [
    { quote: "Booking through this site was so easy! I found a great single room at Nana and didn't have to move around town. Highly recommend!", author: "Akule Robert", role: "Student", avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { quote: "As a first-year, I was worried about finding a safe place. The verified listings gave me peace of mind. I'm happy with my choice.", author: "Mugisha Rayan", role: "Student", avatar: "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { quote: "The detailed information and photos were super helpful. What you see is what you get. Made my decision so much easier!", author: "Martha Trisha", role: "Student", avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
    { quote: "I love that I could compare prices and amenities all in one place. Saved me a ton of time and I found a hostel within my budget.", author: "Aine Evans", role: "Student", avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" },
  ];

  useEffect(() => {
    const sliderInterval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(sliderInterval);
  }, [testimonials.length]);

  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToTestimonial = (index) => setTestimonialIndex(index);

  // Load featured hostels from MongoDB
  useEffect(() => {
    const loadFeaturedHostels = async () => {
      try {
        const response = await apiService.hostels.getAll();
        const hostelsData = response.data.slice(0, 4).map(hostel => [hostel._id, hostel]);
        setFeaturedHostels(hostelsData);
      } catch (err) {
        console.error('Failed to load featured hostels:', err);
        setFeaturedHostels([]);
      }
    };
    loadFeaturedHostels();
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    // In a real app, you'd show a toast notification here.
    // showToast('Message sent successfully!');
    alert('Thank you for your message! We will get back to you shortly.');
    setContactForm({ name: '', email: '', message: '' }); // Reset form
  };

  // Refs for scroll animations using our new hook
  const observerOptions = { threshold: 0.1, triggerOnce: true };
  const [introRef, isIntroVisible] = useIntersectionObserver(observerOptions);
  const [introTextRef, isIntroTextVisible] = useIntersectionObserver(observerOptions);
  const [dealImageRef, isDealImageVisible] = useIntersectionObserver(observerOptions);
  const [dealCardRef, isDealCardVisible] = useIntersectionObserver(observerOptions);
  const [benefitsRef, isBenefitsVisible] = useIntersectionObserver(observerOptions);
  const [benefitCardRef, isBenefitCardVisible] = useIntersectionObserver(observerOptions);
  const [benefitListRef, isBenefitListVisible] = useIntersectionObserver(observerOptions);
  const [howToRef, isHowToVisible] = useIntersectionObserver(observerOptions);
  const [productsRef, isProductsVisible] = useIntersectionObserver(observerOptions);
  const [testimonialsRef, isTestimonialsVisible] = useIntersectionObserver(observerOptions);
  const [faqRef, isFaqVisible] = useIntersectionObserver(observerOptions);
  const [contactRef, isContactVisible] = useIntersectionObserver(observerOptions);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-slideshow">
          {heroSlides.map((src, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url('${src}')` }}
            ></div>
          ))}
        </div>
        <div className="container hero-grid">
          <div className="hero-left">
            <p className="eyebrow">SECURE & CONVENIENT</p>
            <h1><span className="light">Find Your</span> <span className="bold">Perfect Hostel</span> <br />Near <span className="accent">Makerere</span></h1>
            <p className="lead">Discover, compare, and book the best student hostels around Makerere University. Your home away from home is just a few clicks away.</p>
            <div className="hero-ctas">
              <Link to="/hostels" className="btn primary">Search Hostels</Link>
              <a href="#contact" className="btn outline">Contact Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="scroller" data-speed="slow">
          <div className="scroller-inner">
            {/* Duplicated for seamless scroll effect */}
            {[...Array(2)].map((_, i) => (
              <React.Fragment key={i}>
                <div className="feature">
                  <div className="icon">✨</div>
                  <h4>Verified Listings</h4>
                  <p className="muted">Every hostel is checked for quality and safety.</p>
                </div>
                <div className="feature">
                  <div className="icon">🐰</div>
                  <h4>Easy Booking</h4>
                  <p className="muted">A simple and secure online booking process.</p>
                </div>
                <div className="feature">
                  <div className="icon">🏆</div>
                  <h4>Student Reviews</h4>
                  <p className="muted">Read honest reviews from fellow students.</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* HERO SECOND ROW */}
      <section className="section-intro">
        <div className="container">
          <div className="intro-grid">
            <div ref={introRef} className={`intro-image animate-on-scroll ${isIntroVisible ? 'is-visible' : ''}`}>
              <img src="https://dsuj2mkiosyd2.cloudfront.net/a360-rendering/160628/8597/c4dfe2c1/raasrendering-e13c9919-f597-4c76-a131-536b74947ebe.jpg?t=1486699286" alt="A group of happy students outside a modern hostel building" />
            </div>
            <div ref={introTextRef} className={`intro-text animate-on-scroll ${isIntroTextVisible ? 'is-visible' : ''}`} id="about" style={{ transitionDelay: '100ms' }}>
              <h2>Your Home <span className="accent">Away From Home</span></h2>
              <p>We understand that finding the right place to live is crucial for your success at university. Our mission is to simplify the process of finding safe, comfortable, and convenient housing for all Makerere University students.</p>
              <p>We partner with the best hostels to provide you with detailed information, transparent pricing, and a seamless booking experience, so you can focus on what matters most: your studies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DEAL OF THE DAY */}
      <section className="deal">
        <div className="container deal-grid">
          <div ref={dealImageRef} className={`deal-image animate-on-scroll ${isDealImageVisible ? 'is-visible' : ''}`}>
            <img src="https://i1.sndcdn.com/artworks-000118772753-c3oz0p-t500x500.jpg" alt="Exterior shot of Olympia Hostel" />
          </div>
          <div ref={dealCardRef} className={`deal-card animate-on-scroll ${isDealCardVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '100ms' }}>
            <h4>FEATURED HOSTEL</h4>
            <h2>OLYMPIA HOSTEL</h2>
            <div className="price">From UGX 1.2M / SEM</div>
            <p className="muted">Limited spots available for the upcoming semester!</p>
            <div className="countdown" id="countdown">
              <div><span id="days">{countdown.days}</span><small>Days</small></div>
              <div><span id="hours">{countdown.hours}</span><small>Hours</small></div>
              <div><span id="minutes">{countdown.minutes}</span><small>Minutes</small></div>
              <div><span id="seconds">{countdown.seconds}</span><small>Seconds</small></div>
            </div>
            <Link to="/hostel/olympia-hostel" className="btn primary">View Details</Link>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section ref={benefitsRef} className={`container benefits animate-on-scroll ${isBenefitsVisible ? 'is-visible' : ''}`}>
        <h3>Why Book <span className="accent">With Us?</span></h3>
        <p className="muted">We provide the best platform to secure your university accommodation with confidence and ease.</p>
        <div className="benefit-grid">
          <div ref={benefitCardRef} className={`benefit-card animate-on-scroll ${isBenefitCardVisible ? 'is-visible' : ''}`}>
            <img src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="A clean and modern hostel room interior" className="collage-img-1" />
            <img src="https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Students studying in a bright common area" className="collage-img-2" />
            <img src="https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="The modern exterior of a student hostel" className="collage-img-3" />
          </div>
          <div ref={benefitListRef} className={`benefit-list animate-on-scroll ${isBenefitListVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '100ms' }}>
            <ul>
              <li><strong>Wide Selection</strong> — The largest choice of hostels in Kikoni, Wandegeya, and more.</li>
              <li><strong>Detailed Info</strong> — See photos, amenities, rules, and prices all in one place.</li>
              <li><strong>Secure Payments</strong> — Book your spot with our safe and reliable payment system.</li>
              <li><strong>No Hidden Fees</strong> — The price you see is the price you pay.</li>
              <li><strong>Instant Confirmation</strong> — Get your booking confirmation immediately.</li>
              <li><strong>24/7 Support</strong> — Our team is here to help you anytime.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* HOW TO USE */}
      <section className="how-to">
        <div ref={howToRef} className={`container animate-on-scroll ${isHowToVisible ? 'is-visible' : ''}`}>
          <h3>How It <span className="accent">Works</span></h3>
          <p className="muted">Find your hostel in three simple steps.</p>
          <div className="how-grid">
            <div className={`how-card animate-on-scroll ${isHowToVisible ? 'is-visible' : ''}`}>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLDvRUzZD86wGEoqY7YMkRsiMQ0HbBMPvfMRvpAK4f9i0bB8s-bJ6YPUBKKq1lICs3ZZM&usqp=CAU" alt="A student using a laptop to search for hostels" className="how-card-img" />
              <h4>1. Search & Filter</h4>
              <p>Use our search tools to find hostels that match your budget and needs.</p>
            </div>
            <div className={`how-card animate-on-scroll ${isHowToVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '100ms' }}>
              <img src="https://suryapalace.com/assets/img/blogs/travelling-on-a-budget-vs-luxury-understanding-different-hotel-experience.jpg" alt="A student comparing options on a tablet" className="how-card-img" />
              <h4>2. Compare & Choose</h4>
              <p>Compare your options, read reviews, and select the perfect hostel for you.</p>
            </div>
            <div className={`how-card animate-on-scroll ${isHowToVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '200ms' }}>
              <img src="https://c8.alamy.com/comp/WJRTK8/book-now-touch-screen-showing-hotel-or-flights-reservation-WJRTK8.jpg" alt="A person making a secure online booking with a credit card" className="how-card-img" />
              <h4>3. Book & Secure</h4>
              <p>Book your room instantly and securely through our platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS GRID */}
      <section ref={productsRef} className={`container products animate-on-scroll ${isProductsVisible ? 'is-visible' : ''}`} id="products">
        <h3>Featured <span className="accent">Hostels</span></h3>
        <p className="muted">Check out some of the most popular hostels among students.</p>
        <div className="product-grid">
          {featuredHostels.length > 0 ? (
            featuredHostels.map(([id, hostel]) => (
              <HostelCard key={id} hostelId={id} hostel={hostel} />
            ))
          ) : (
            <div className="loading-featured">
              <p>Loading featured hostels...</p>
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section ref={testimonialsRef} className={`testimonials animate-on-scroll ${isTestimonialsVisible ? 'is-visible' : ''}`}>
        <div className="container">
          <h3>What <span className="accent">Students Say</span></h3>
          <p className="muted">Real stories from students who found their perfect home with us.</p>
          <div className="testimonial-stack-wrapper">
            <div className="testimonial-slider" style={{ transform: `translateX(-${testimonialIndex * 100 / testimonials.length}%)` }}>
              {testimonials.map((testimonial, index) => (
                <div className="testimonial-card" key={index}>
                  <p>"{testimonial.quote}"</p>
                  <div className="author">
                    <img src={testimonial.avatar} alt={`Happy customer ${testimonial.author}`} />
                    <div>
                      <strong>{testimonial.author}</strong>
                      <small className="muted">{testimonial.role}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="testimonial-nav">
            <button className="nav-arrow prev" onClick={handlePrevTestimonial}><i className="fas fa-chevron-left"></i></button>
            <div className="nav-dots">
              {testimonials.map((_, index) => (
                <button key={index} className={`dot ${index === testimonialIndex ? 'active' : ''}`} onClick={() => goToTestimonial(index)}></button>
              ))}
            </div>
            <button className="nav-arrow next" onClick={handleNextTestimonial}><i className="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </section>

      {/* BLOG (FAQs) */}
      <section ref={faqRef} className={`container blog animate-on-scroll ${isFaqVisible ? 'is-visible' : ''}`} id="faq">
        <h3>Frequently <span className="accent">Asked Questions</span></h3>
        <div className="blog-grid">
          <article className={`post animate-on-scroll ${isFaqVisible ? 'is-visible' : ''}`}>
            <img src="https://as2.ftcdn.net/jpg/02/39/20/75/1000_F_239207573_MDMCuWLFt2M1uEPgtThSbzpiCCXTPbFc.jpg" alt="A student looking thoughtfully at a laptop screen" className="post-image" />
            <div className="post-overlay">
              <h4>How do I book a room?</h4>
              <p className="muted">Find your desired hostel, select a room type, and click 'Book Now' to proceed with payment.</p>
              <Link to="#" className="btn outline small">Read More</Link>
            </div>
          </article>
          <article className={`post animate-on-scroll ${isFaqVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '100ms' }}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjT9VcQXwaDDVfKlid9_JIP1TQZrm83s2_6A&s" alt="A graphic of a padlock icon over a credit card, symbolizing secure payment" className="post-image" />
            <div className="post-overlay">
              <h4>Is my payment secure?</h4>
              <p className="muted">Yes, we use industry-standard encryption to protect your payment information.</p>
              <Link to="#" className="btn outline small">Read More</Link>
            </div>
          </article>
          <article className={`post animate-on-scroll ${isFaqVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '200ms' }}>
            <img src="https://t3.ftcdn.net/jpg/03/67/97/90/360_F_367979072_UdBgmIp2RuFgLsbruOMBVmruR6jCDqfX.jpg" alt="A person smiling at their phone, showing a booking confirmation email" className="post-image" />
            <div className="post-overlay">
              <h4>What happens after I book?</h4>
              <p className="muted">You will receive an instant booking confirmation via email with all the details.</p>
              <Link to="#" className="btn outline small">Read More</Link>
            </div>
          </article>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section ref={contactRef} id="contact" className={`contact-section-new animate-on-scroll ${isContactVisible ? 'is-visible' : ''}`}>
        <div className="container">
          <div className="contact-header-new">
            <h3>Ready to Find Your <span className="accent">Perfect Hostel?</span></h3>
            <p className="muted">Get in touch with us for personalized assistance or any questions about our platform.</p>
          </div>
          <div className="contact-cards-grid">
            <div className="contact-card">
              <div className="contact-card-icon">
                <i className="fa-solid fa-comments"></i>
              </div>
              <h4>Live Chat</h4>
              <p>Get instant answers to your questions</p>
              <button className="btn primary">Start Chat</button>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">
                <i className="fa-solid fa-phone"></i>
              </div>
              <h4>Call Us</h4>
              <p>Speak directly with our support team</p>
              <a href="tel:+256700000000" className="btn primary">+256 700 000 000</a>
            </div>
            <div className="contact-card">
              <div className="contact-card-icon">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <h4>Email Support</h4>
              <p>Send us a detailed message</p>
              <a href="mailto:info@bookmyhostel.com" className="btn primary">Send Email</a>
            </div>
          </div>
          <div className="contact-form-card">
            <div className="form-header">
              <h4>Send us a Message</h4>
              <p>Fill out the form below and we'll get back to you within 24 hours</p>
            </div>
            <form onSubmit={handleContactSubmit} className="modern-contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" name="name" placeholder="Enter your full name" required value={contactForm.name} onChange={handleContactChange} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" placeholder="Enter your email" required value={contactForm.email} onChange={handleContactChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea name="message" placeholder="Tell us how we can help you..." rows="4" required value={contactForm.message} onChange={handleContactChange}></textarea>
              </div>
              <button type="submit" className="btn primary submit-btn">
                <i className="fa-solid fa-paper-plane"></i>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
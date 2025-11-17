import React, { useEffect } from 'react';

const AboutPage = () => {
  // Animation on scroll logic (simplified for React)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <section className="about-hero-modern">
        <div className="floating-home-icons">
          <i className="fa-solid fa-home floating-home-1"></i>
          <i className="fa-solid fa-home floating-home-2"></i>
          <i className="fa-solid fa-home floating-home-3"></i>
          <i className="fa-solid fa-home floating-home-4"></i>
          <i className="fa-solid fa-home floating-home-5"></i>
          <i className="fa-solid fa-home floating-home-6"></i>
        </div>
        <div className="container about-hero-container">
          <h1 className="about-hero-title">From a Student Project to Your Trusted <span className="about-animated">Hostel</span> Finder</h1>
          <p className="about-hero-subtitle">Learn the story behind BookMyHostel and the team dedicated to simplifying your university journey.</p>
        </div>
      </section>

      <section className="about-fullwidth-section">
        <div className="container about-content">
        <div className="story-section-split animate-on-scroll">
          <div className="story-left">
            <div className="story-badge">
              <i className="fa-solid fa-book-open"></i>
              <span>Our Journey</span>
            </div>
            <h3>Our Story</h3>
            <p>BookMyHostel was born from a shared frustration. As five students from the College of Computing and Information Sciences (CoCIS) at Makerere University, we experienced firsthand the chaotic and time-consuming process of finding suitable accommodation each semester. We knew there had to be a better way.</p>
            <p>What started as a final-year project quickly evolved into a passion-driven mission: to create a centralized, trustworthy, and easy-to-use platform for every student. We combined our skills in software development, user experience design, and project management to build the solution we wished we had.</p>
            <div className="story-stats">
              <div className="stat-item">
                <h4>5</h4>
                <p>Founders</p>
              </div>
              <div className="stat-item">
                <h4>100+</h4>
                <p>Hostels</p>
              </div>
              <div className="stat-item">
                <h4>1000+</h4>
                <p>Students</p>
              </div>
            </div>
          </div>
          <div className="story-right">
            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=600&fit=crop" alt="African students collaborating on a project" />
          </div>
        </div>

        <div className="about-mission animate-on-scroll">
          <h3>Our Mission</h3>
          <p>Our mission is to empower students by providing a seamless and transparent platform to discover, compare, and book university accommodation. We aim to eliminate the stress of hostel hunting, so students can focus on their academic and personal growth from day one.</p>
        </div>
        </div>
      </section>

      <section className="team-section-modern">
        <div className="container">
          <h3 className="animate-on-scroll">Meet the Founders</h3>
          <p className="muted animate-on-scroll">The CoCIS students behind the platform.</p>
          <div className="team-grid">
            {/* Team Member 1 */}
            <div className="flip-card animate-on-scroll">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJjWCXQ3hTCwF3nrN6BkTG2My4bmD3zFl7Wg&s" alt="Akule Robert" />
                  <h4>Akule Robert</h4>
                </div>
                <div className="flip-card-back">
                  <h4>Akule Robert</h4>
                  <p className="role">Frontend Developer</p>
                  <p className="bio">Specializes in React and modern UI/UX design. Passionate about creating seamless user experiences.</p>
                </div>
              </div>
            </div>
            {/* Team Member 2 */}
            <div className="flip-card animate-on-scroll" style={{ transitionDelay: '100ms' }}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_RbO6ca2n325fkrRX5hvscVqk2PYj9dK_Hw&s" alt="Musime Martha Trisha" />
                  <h4>Musime Martha Trisha</h4>
                </div>
                <div className="flip-card-back">
                  <h4>Musime Martha Trisha</h4>
                  <p className="role">Frontend Developer</p>
                  <p className="bio">Expert in responsive design and CSS animations. Focuses on mobile-first development approaches.</p>
                </div>
              </div>
            </div>
            {/* Team Member 3 */}
            <div className="flip-card animate-on-scroll" style={{ transitionDelay: '200ms' }}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkudQJABnadVU_jc-Nq-Y6WoxWhm5-NUrHPw&s" alt="Mugisha Rayan" />
                  <h4>Mugisha Rayan</h4>
                </div>
                <div className="flip-card-back">
                  <h4>Mugisha Rayan</h4>
                  <p className="role">Backend Developer</p>
                  <p className="bio">Node.js and database expert. Ensures robust server architecture and data security.</p>
                </div>
              </div>
            </div>
            {/* Team Member 4 */}
            <div className="flip-card animate-on-scroll" style={{ transitionDelay: '300ms' }}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfW_1Okw8_6aN8ETUqBCO2HvzyGfXJJ5BlwA&s" alt="Ainebyona Evans" />
                  <h4>Ainebyona Evans</h4>
                </div>
                <div className="flip-card-back">
                  <h4>Ainebyona Evans</h4>
                  <p className="role">Backend Developer</p>
                  <p className="bio">Specializes in server optimization and scalable system design. MongoDB and Express.js expert.</p>
                </div>
              </div>
            </div>
            {/* Team Member 5 */}
            <div className="flip-card animate-on-scroll" style={{ transitionDelay: '400ms' }}>
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeWat_PBj0JC55q8YCkhJFe36PSOSBb2PjNw&s" alt="Ssessanga Nehemiah" />
                  <h4>Ssessanga Nehemiah</h4>
                </div>
                <div className="flip-card-back">
                  <h4>Ssessanga Nehemiah</h4>
                  <p className="role">API Integration</p>
                  <p className="bio">Connects frontend and backend seamlessly. Expert in RESTful APIs and third-party integrations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
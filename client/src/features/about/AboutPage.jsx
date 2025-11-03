

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
      <section className="about-hero">
        <div className="container">
          <h1 className="animate-on-scroll">From a Student Project to Your Trusted Hostel Finder</h1>
          <p className="lead animate-on-scroll" style={{ transitionDelay: '100ms' }}>Learn the story behind BookMyHostel and the team dedicated to simplifying your university journey.</p>
        </div>
      </section>

      <section className="container about-content">
        <div className="about-grid">
          <div className="about-text animate-on-scroll">
            <h3>Our Story</h3>
            <p>BookMyHostel was born from a shared frustration. As five students from the College of Computing and Information Sciences (CoCIS) at Makerere University, we experienced firsthand the chaotic and time-consuming process of finding suitable accommodation each semester. We knew there had to be a better way.</p>
            <p>What started as a final-year project quickly evolved into a passion-driven mission: to create a centralized, trustworthy, and easy-to-use platform for every student. We combined our skills in software development, user experience design, and project management to build the solution we wished we had.</p>
          </div>
          <div className="about-image animate-on-scroll" style={{ transitionDelay: '100ms' }}>
            <img src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="A group of students collaborating on a project" />
          </div>
        </div>

        <div className="about-mission animate-on-scroll">
          <h3>Our Mission</h3>
          <p>Our mission is to empower students by providing a seamless and transparent platform to discover, compare, and book university accommodation. We aim to eliminate the stress of hostel hunting, so students can focus on their academic and personal growth from day one.</p>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <h3 className="animate-on-scroll">Meet the Founders</h3>
          <p className="muted animate-on-scroll">The CoCIS students behind the platform.</p>
          <div className="team-grid">
            {/* Team Member 1 */}
            <div className="team-member-card animate-on-scroll">
              <img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Team Member 1" />
              <div className="team-member-info"><h4>Student Name 1</h4><p className="role">Lead Developer</p></div>
            </div>
            {/* Team Member 2 */}
            <div className="team-member-card animate-on-scroll" style={{ transitionDelay: '100ms' }}>
              <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Team Member 2" />
              <div className="team-member-info"><h4>Student Name 2</h4><p className="role">UX/UI Designer</p></div>
            </div>
            {/* Team Member 3 */}
            <div className="team-member-card animate-on-scroll" style={{ transitionDelay: '200ms' }}>
              <img src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Team Member 3" />
              <div className="team-member-info"><h4>Student Name 3</h4><p className="role">Project Manager</p></div>
            </div>
            {/* Team Member 4 */}
            <div className="team-member-card animate-on-scroll" style={{ transitionDelay: '300ms' }}>
              <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Team Member 4" />
              <div className="team-member-info"><h4>Student Name 4</h4><p className="role">Backend Engineer</p></div>
            </div>
            {/* Team Member 5 */}
            <div className="team-member-card animate-on-scroll" style={{ transitionDelay: '400ms' }}>
              <img src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" alt="Team Member 5" />
              <div className="team-member-info"><h4>Student Name 5</h4><p className="role">Marketing & Outreach</p></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;

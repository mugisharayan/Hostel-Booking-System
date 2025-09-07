import React from 'react';
import './SignUp.css';

function SignUp() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" required />
        </div>
        
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" required />
        </div>
        
        <div className="form-group">
          <label>Phone:</label>
          <input type="tel" name="phone" required />
        </div>
        
        <button type="submit" className="submit-btn">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUp;
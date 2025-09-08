import React from 'react';
import './SignUp.css';

function SignUp() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const studentData = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone')
    };

    try {
      const response = await fetch('/api/students/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Signup successful:', result);
        alert('Signup successful!');
      } else {
        console.error('Signup failed');
        alert('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error occurred. Please try again.');
    }
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

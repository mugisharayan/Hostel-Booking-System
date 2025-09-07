import React, { useState } from 'react';
import './App.css';
import SignUp from './components/SignUp';
import StudentPayment from './components/StudentPayment';

function App() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  if (showSignUp) {
    return (
      <div className="App">
        <SignUp />
      </div>
    );
  }

  if (showPayment) {
    return (
      <div className="App">
        <StudentPayment />
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Hello Worldz</h1>
      <button onClick={() => setShowSignUp(true)}>Sign Up</button>
      <button onClick={() => setShowPayment(true)} style={{ marginLeft: '10px' }}>Student Payment</button>
    </div>
  );
}

export default App;

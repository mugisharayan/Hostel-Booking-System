import React, { useState } from 'react';
import './App.css';
import SignUp from './components/SignUp';

function App() {
  const [showSignUp, setShowSignUp] = useState(false);

  if (showSignUp) {
    return (
      <div className="App">
        <SignUp />
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Hello Worldz</h1>
      <button onClick={() => setShowSignUp(true)}>Sign Up</button>
    </div>
  );
}

export default App;

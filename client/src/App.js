import React, { useState } from 'react';
import './App.css';
import StudentPayment from './views/components/StudentPayment';

function App() {
  const [showPayment, setShowPayment] = useState(false);

  if (showPayment) {
    return (
      <div className="App">
        <StudentPayment />
      </div>
    );
  }

  if (showLogin) {
    return (
      <div className="App">
       
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Hello Worldz</h1>
      <button onClick={() => setShowPayment(true)}>Student Payment</button>
    </div>
  );
}

export default App;

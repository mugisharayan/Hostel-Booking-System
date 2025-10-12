import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import HostelDetails from './components/HostelDetails';
import StudentPayment from './components/StudentPayment';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hostel/:id" element={<HostelDetails />} />
          <Route path="/payment" element={<StudentPayment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import React, { useEffect, useState } from 'react';
import HomePage from './pages/en/HomePage';
import JoinCompoundCalulatorPage from './pages/en/calculator/JointCompoundCalculatorPage';

function App() {
  return (
    <Router>  
      
      
       <Routes>
        <Route path="/" element={<HomePage />} />
      <Route path="/joint" element={<JoinCompoundCalulatorPage />} />

      </Routes>
      </Router>

  );
}

export default App;

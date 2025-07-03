import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Leaderboard from './components/Leaderboard';
import IndividualResult from './components/IndividualResult';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Leaderboard />} />
          <Route path="/result/:id" element={<IndividualResult />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
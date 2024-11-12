import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TicketForm from './components/TicketForm';
import TicketDashboard from './components/TicketDashboard';
import TicketResponse from './components/TicketResponse';

const App = () => {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tickets');
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TicketForm onTicketSubmit={fetchTickets} />} />
        <Route path="/dashboard" element={<TicketDashboard tickets={tickets} />} />
        <Route path="/ticket/:id" element={<TicketResponse />} />
      </Routes>
    </Router>
  );
};

export default App;

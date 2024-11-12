import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TicketDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch tickets from the server
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tickets');
        const data = await response.json();
        setTickets(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl font-semibold">Loading tickets...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-8">Ticket Dashboard</h2>

      {/* Table of Tickets */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              {/* <th className="py-3 px-6 text-left">Ticket ID</th> */}
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr key={ticket._id} className="border-t hover:bg-gray-50">
                  {/* <td className="py-3 px-6">{ticket._id}</td> */}
                  <td className="py-3 px-6">{ticket.name}</td>
                  <td className="py-3 px-6">{ticket.category}</td>
                  <td className="py-3 px-6">{ticket.description}</td>
                  <td className="py-3 px-6 flex space-x-2">
                    {/* <button
                      onClick={() => alert(`Viewing ticket: ${ticket._id}`)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                    >
                      View
                    </button> */}
                    <button
                      onClick={() => navigate(`/ticket/${ticket.name}`, { state: { description: ticket.description } })}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200"
                    >
                      Respond
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 px-6 text-gray-500">
                  No tickets available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketDashboard;

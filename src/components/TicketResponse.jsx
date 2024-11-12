import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const TicketResponse = () => {
  const { id } = useParams(); // Get ticket ID from URL
  const { state } = useLocation(); // Get the state passed from the previous page
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // New state for error messages

  // Destructure the description from state
  const ticketDescription = state?.description || 'No description available';

  // Add the ticket description as the first message (on the right side)
  useEffect(() => {
    const fetchAiResponse = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/ai-response/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: ticketDescription,
            top_k: 3,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get AI response');
        }

        const data = await response.json();

        // Ensure the AI response exists in the returned data
        if (!data.ai_response) {
          throw new Error('AI response is missing in the response data');
        }
         // Convert the AI response into bullet points (if response is a string)
         const bulletPoints = data.ai_response.split('**').map((point, index) => (
          <li key={index} className="mb-2">{point}</li>
        ));

        // Set the messages state with the ticket description and the AI response
        setMessages([
          { text: ticketDescription, sender: 'customer' }, // Customer's message (description) on the right
          { text: bulletPoints, sender: 'ai' }, // AI's response on the left
        ]);
      } catch (error) {
        console.error('Error fetching AI response:', error);
        setError('Failed to load AI response.');
      }
    };

    fetchAiResponse();
  }, [ticketDescription]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      // Add the new message from the agent
      const updatedMessages = [...messages, { text: newMessage, sender: 'agent' }];
      setMessages(updatedMessages);
      setNewMessage('');

      try {
        setLoading(true); // Set loading state to true while API call is in progress
        setError(null); // Reset any previous error

        // Make the API request to generate an AI response
        const response = await fetch('http://127.0.0.1:8000/ai-response/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: newMessage,
            top_k: 3,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get AI response');
        }

        const data = await response.json();

        // Ensure the AI response exists in the returned data
        if (!data.ai_response) {
          throw new Error('AI response is missing in the response data');
        }

        console.log('AI Response:', data);

        // Add the AI response as a new message (on the left side)
        setMessages([
          ...updatedMessages,
          { text: data.ai_response, sender: 'ai' },
        ]);
      } catch (error) {
        console.error('Error getting AI response:', error);
        setError('Error getting AI response.');
      } finally {
        setLoading(false); // Reset loading state
      }
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Respond to Ticket {id}</h2>

      {/* Show error message */}
      {error && (
        <div className="bg-red-200 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {/* Chat UI */}
      <div className="flex flex-col space-y-4 p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-scroll">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${message.sender === 'agent' || message.sender === 'ai' 
              ? 'bg-green-200 self-end' 
              : 'bg-gray-200 self-start'}`}
          >
            {message.text}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="flex space-x-2 mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          disabled={loading} // Disable the button while loading
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default TicketResponse;

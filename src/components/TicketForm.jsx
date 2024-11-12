import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

const TicketForm = ({ onTicketSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    category: '',
  });
  
  const [loading, setLoading] = useState(false); // To manage loading state
  const [success, setSuccess] = useState(false); // To track if the submission was successful
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Set loading to true when the form is submitted
    setSuccess(false); // Reset success before submitting

    try {
      const response = await fetch('http://localhost:5000/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onTicketSubmit();
        setFormData({ name: '', email: '', description: '', category: '' });
        setSuccess(true);  // Set success to true after successful submission
        setTimeout(() => {
          navigate('/dashboard');  // Redirect to dashboard after successful submission
        }, 1500);  // Delay before redirecting, you can adjust this time
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('Failed to submit ticket');
    } finally {
      setLoading(false); // Set loading to false once the request is finished
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-xl border border-gray-300">
      <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">Submit a Support Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
          />
        </div>

        {/* Description Textarea */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
            rows="4"
            placeholder="Describe your issue here..."
          />
        </div>

        {/* Category Select */}
        <div className="mb-4">
          <label className="block text-lg font-medium text-gray-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
          >
            <option value="">Select Category</option>
            <option value="Technical">Technical</option>
            <option value="Billing">Billing</option>
            <option value="Account">Account</option>
          </select>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-300"
            disabled={loading} // Disable button while loading
          >
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </div>
      </form>

      {/* Show Success Message */}
      {success && (
        <div className="mt-4 text-green-600 text-center">
          <p>Your ticket has been submitted successfully!</p>
        </div>
      )}

      {/* Show Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center mt-4">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-t-4 border-blue-600" />
        </div>
      )}
    </div>
  );
};

export default TicketForm;

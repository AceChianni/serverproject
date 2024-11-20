// app/page.js
'use client';

import { useState } from 'react';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show loading state

    try {
      const res = await fetch('/api/combine', {
        method: 'POST',
        body: JSON.stringify({ email, message }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      setResponse(data.message); // Display response from the server
    } catch (error) {
      setResponse('Error sending message. Please try again.');
    } finally {
      setIsLoading(false); // Hide loading state after request
    }
  };

  return (
    <div className="form-container">
      <h1>Send Us a Message</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Your Email:</label>
          <input
            id="email"
            className="input-field"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="message">Your Message:</label>
          <textarea
            id="message"
            className="input-field"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {response && (
        <p className={`response-message ${response.includes('Error') ? 'error' : ''}`}>
          {response}
        </p>
      )}
    </div>
  );
}

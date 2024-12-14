import React, { useState } from 'react';
import '../App.css';

const ContactForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [severity, setSeverity] = useState('low');
  const [prompt, setPrompt] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      action: 'create',
      table: 'error_logs',
      user_id: 0, //Placeholder for user ID
      error_message: `User Email: ${email}\nPrompt: ${prompt}`,
      severity_level: severity,
    };

    try {
      const response = await fetch('/api/db_query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error submitting the contact form');
      }

      setStatusMessage('Thank you for reaching out! Your message has been submitted.');
      setEmail('');
      setSeverity('low');
      setPrompt('');
    } catch {
      setStatusMessage('There was an issue submitting your message. Please try again.');
    }
  };

  return (
    <div className="contact-form-container">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Your email"
          />
        </div>
        <div className="form-group">
          <label>Importance:</label>
          <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="form-group">
          <label>Message:</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            placeholder="What's going on?"
          />
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
      {statusMessage && <p className="status-message">{statusMessage}</p>}
    </div>
  );
};

export default ContactForm;
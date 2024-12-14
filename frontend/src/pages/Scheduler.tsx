import React, { useState, useEffect } from 'react';
import CalendarComponent from '../components/Calendar';
import AppointmentFormComponent from '../components/AppointmentForm';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import './Appointments.css';

const Scheduler: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Retrieve the user ID from sessionStorage on component mount
  useEffect(() => {
    const user = sessionStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserId(userData.userId || null);
      } catch {
        console.error('Failed to parse user data from sessionStorage');
      }
    }
  }, []);

  const handleDateSelect = (date: Date) => setSelectedDate(date);

  const handleSubmit = async (formData: {
    pet_id: number;
    user_id: number;
    visit_date: string;
    visit_time: string;
  }) => {
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/create_visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        setMessage('Visit scheduled successfully!');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to schedule visit');
      }
    } catch (err) {
      console.error('Error scheduling visit:', err);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="scheduler-page">
      <Container className="appointments-container">
        <Row>
          <Col md={6}>
            <div className="calendar-section">
              <CalendarComponent onDateSelect={handleDateSelect} />
            </div>
          </Col>
          <Col md={6}>
            <div className="appointment-form-section">
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              <AppointmentFormComponent
                selectedDate={selectedDate}
                userId={userId || ''} // Pass userId to the form
                onSubmit={handleSubmit}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Scheduler;

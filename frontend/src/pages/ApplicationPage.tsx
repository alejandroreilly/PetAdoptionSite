import React, { useState } from 'react';
import ApplicationForm from '../components/ApplicationForm';
import ApplicationStatus from '../components/ApplicationStatus';

const ApplicationPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('pending');
  const [lastUpdated, setLastUpdated] = useState('');

  const handleFormSubmit = async (formData: string) => {
    const payload = {
      action: 'create',
      table: 'applications',
      user_id: 0, // Placeholder for user ID
      questionnaire: formData,
      status: 'pending',
      last_updated: new Date().toISOString(),
      comments: 'None',
    };

    try {
      const response = await fetch('/api/db_query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error submitting the application');
      }

      setSubmitted(true);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  return (
    <div className="application-page">
      {!submitted ? (
        <ApplicationForm onSubmit={handleFormSubmit} />
      ) : (
        <ApplicationStatus status={applicationStatus} lastUpdated={lastUpdated} />
      )}
    </div>
  );
};

export default ApplicationPage;
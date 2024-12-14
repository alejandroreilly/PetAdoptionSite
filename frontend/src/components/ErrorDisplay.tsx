import React from 'react';
import { Alert } from 'react-bootstrap';

interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <Alert variant="danger" className="mt-4">
      <strong>Error:</strong> {error}
    </Alert>
  );
};

export default ErrorDisplay;

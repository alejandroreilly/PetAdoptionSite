import React from 'react';
import { Card } from 'react-bootstrap';

interface ResponseDisplayProps {
  responseData: unknown;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ responseData }) => {
  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>Response</Card.Title>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', textAlign: 'left' }}>
          {JSON.stringify(responseData, null, 2)}
        </pre>
      </Card.Body>
    </Card>
  );
};

export default ResponseDisplay;

import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

interface QueryFormProps {
  onSubmit: (query: string) => void;
}

const QueryForm: React.FC<QueryFormProps> = ({ onSubmit }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(query);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="queryInput">
        <Form.Label>Query (JSON) <br /> </Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Enter your query as JSON, e.g. { "action": "create", "table": "pets", "name": "Buddy" }'
        />
      </Form.Group>
      < br/ >
      <Button variant="primary" type="submit" className="mt-3">
        Submit Query
      </Button>
    </Form>
  );
};

export default QueryForm;

import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

interface AppointmentFormComponentProps {
  selectedDate?: Date | null;
  userId?: number | null;
  onSubmit: (formData: { pet_id: number; user_id: number; visit_date: string; visit_time: string }) => void;
}

const AppointmentFormComponent: React.FC<AppointmentFormComponentProps> = ({
  onSubmit,
  selectedDate,
  userId, // userId provided by the parent component
}) => {
  const [petId, setPetId] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');
  const [localUserId, setLocalUserId] = useState(userId || ''); // Initialize with userId if provided
  const [petOptions, setPetOptions] = useState<{ pet_id: number; name: string; breed: string }[]>([]);

  // Update visitDate whenever selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      setVisitDate(formattedDate);
    }
  }, [selectedDate]);

  // Fetch pet options when the component mounts
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('/api/read_pets');
        const pets = await response.json();
        setPetOptions(pets); // Populate dropdown options
      } catch (err) {
        console.error("Error fetching pets:", err);
      }
    };

    fetchPets();
  }, []);

  // Generate time options (9:00 AM to 5:00 PM in 30-minute intervals)
  const generateTimeOptions = () => {
    const options = [];
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
      for (const minutes of [0, 30]) {
        const time = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
        options.push(time); // Add in HH:mm:ss format
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Validate input data
    if (!petId || !localUserId || !visitDate || !visitTime) {
      alert("All fields are required!");
      return;
    }

    const payload = {
      pet_id: petId, // Keep as string to match type
      user_id: localUserId, // Keep as string to match type
      visit_date: visitDate, // Use snake_case key as required
      visit_time: visitTime, // Use snake_case key as required
    };

    // Pass the payload to the parent component's onSubmit
    onSubmit(payload);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="petId" className="mb-3">
        <Form.Label>Pet</Form.Label>
        <Form.Select
          value={petId}
          onChange={(e) => setPetId(e.target.value)}
          required
        >
          <option value="" disabled>
            Select a pet
          </option>
          {petOptions.map((pet) => (
            <option key={pet.pet_id} value={pet.pet_id}>
              {pet.name} ({pet.breed})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="userId" className="mb-3">
        <Form.Label>User ID</Form.Label>
        <Form.Control
          type="text"
          value={localUserId}
          onChange={(e) => setLocalUserId(e.target.value)} // Allow manual override if needed
          readOnly={!!userId} // Make read-only if userId is provided by parent
          required
        />
      </Form.Group>

      <Form.Group controlId="visitDate" className="mb-3">
        <Form.Label>Visit Date</Form.Label>
        <Form.Control
          type="date"
          value={visitDate}
          onChange={(e) => setVisitDate(e.target.value)} // Update visitDate directly
          required
        />
      </Form.Group>

      <Form.Group controlId="visitTime" className="mb-3">
        <Form.Label>Visit Time</Form.Label>
        <Form.Select
          value={visitTime}
          onChange={(e) => setVisitTime(e.target.value)} // Update visitTime
          required
        >
          <option value="" disabled>
            Select a time
          </option>
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Button variant="primary" type="submit">
        Schedule Appointment
      </Button>
    </Form>
  );
};

export default AppointmentFormComponent;
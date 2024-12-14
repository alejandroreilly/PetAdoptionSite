import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import PetCard from '../components/PetCard';
import PetFilter from '../components/PetFilter';
import './PetList.css';

interface Pet {
  pet_id: number;
  user_id: number;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  status: string;
}

const PetList: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    species: string;
    breed: string;
    ageRange: string;
    status: string;
  }>({
    species: '',
    breed: '',
    ageRange: '',
    status: '',
  });

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('/api/read_pets');
        if (!response.ok) {
          throw new Error('Failed to fetch pets.');
        }
        const data = await response.json();
        setPets(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleFilterApply = (newFilters: {
    species: string;
    breed: string;
    ageRange: string;
    status: string;
  }) => {
    setFilters(newFilters);
  };

  const filteredPets = pets.filter((pet) => {
    const isAgeInRange = () => {
      if (!pet.age) return false; 
      switch (filters.ageRange) {
        case '<1':
          return pet.age < 1;
        case '0-5':
          return pet.age >= 0 && pet.age <= 5;
        case '5+':
          return pet.age > 5;
        default:
          return true;
      }
    };

    return (
      (filters.species === '' || pet.species.toLowerCase() === filters.species.toLowerCase()) &&
      (filters.breed === '' || (pet.breed ?? '').toLowerCase() === filters.breed.toLowerCase()) &&
      (filters.ageRange === '' || isAgeInRange()) &&
      (filters.status === '' || pet.status.toLowerCase() === filters.status.toLowerCase())
    );
  });

  if (loading) return <Spinner animation="border" variant="primary" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  console.log('Rendering PetFilter with filters:', filters);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 page-title">Every Pet Deserves a Loving Home,</h2>
      <h2 className = "text-center mb-4 page-title2">Adopt Today!</h2>

      <PetFilter onFilterApply={handleFilterApply} />

      <Row className="g-4 d-flex flex-wrap justify-content-center">
        {filteredPets.map((pet) => (
          <Col key={pet.pet_id} md={4} className="d-flex justify-content-center">
            <PetCard pet={pet} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default PetList;
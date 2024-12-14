import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

interface PetFilterProps {
  onFilterApply: (filters: {
    species: string;
    breed: string;
    ageRange: string;
    status: string;
  }) => void;
}

const PetFilter: React.FC<PetFilterProps> = ({ onFilterApply }) => {
  const [speciesOptions, setSpeciesOptions] = useState<string[]>([]);
  const [breedOptions, setBreedOptions] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);

  const [species, setSpecies] = useState<string>('');
  const [breed, setBreed] = useState<string>('');
  const [ageRange, setAgeRange] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch('/api/read_pets/options');
        if (!response.ok) {
          throw new Error('Failed to fetch filter options');
        }
        const data = await response.json();
        setSpeciesOptions(data.species || []);
        setStatusOptions(data.statuses || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchBreeds = async () => {
      if (!species) {
        setBreedOptions([]);
        setBreed('');
        return;
      }

      try {
        const response = await fetch(`/api/read_pets/breeds?species=${species}`);
        if (!response.ok) {
          throw new Error('Failed to fetch breeds');
        }
        const data = await response.json();
        setBreedOptions(data.breeds || []);
        setBreed('');
      } catch (error) {
        console.error(error);
        setBreedOptions([]);
      }
    };

    fetchBreeds();
  }, [species]);

  const handleApplyFilters = () => {
    onFilterApply({ species, breed, ageRange, status });
  };

  const handleClearFilters = () => {
    setSpecies('');
    setBreed('');
    setAgeRange('');
    setStatus('');
    setBreedOptions([]);
    onFilterApply({ species: '', breed: '', ageRange: '', status: '' });
  };

  return (
    <Form className="mb-4">
      <Row>
        <Col md={3}>
          <Form.Group controlId="filterSpecies">
            <Form.Label>Species</Form.Label>
            <Form.Select
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
            >
              <option value="">All Species</option>
              {speciesOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="filterBreed">
            <Form.Label>Breed</Form.Label>
            <Form.Select
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              disabled={!breedOptions.length}
            >
              <option value="">All Breeds</option>
              {breedOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="filterAgeRange">
            <Form.Label>Age Range</Form.Label>
            <Form.Select
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
            >
              <option value="">All Ages</option>
              <option value="<1">Less than 1 year</option>
              <option value="0-5">0-5 years</option>
              <option value="5+">5+ years</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group controlId="filterStatus">
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Button variant="primary" onClick={handleApplyFilters}>
            Update Search
          </Button>
          <Button variant="secondary" className="ms-2" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default PetFilter;
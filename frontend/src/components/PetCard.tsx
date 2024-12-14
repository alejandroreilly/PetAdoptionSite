import React from 'react';
import { Card } from 'react-bootstrap';
import '../pages/PetList.css'

interface Pet {
  pet_id: number;
  user_id: number;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  status: string;
}

interface PetCardProps {
  pet: Pet;
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  const imagePath = `../images/${pet.name}.jpeg`
  return (
    <Card className = "pet-card">
      <div className="pet-card-image">
        <img src={imagePath} alt={pet.name} className="pet-card-img" onError={(e) => {
          (e.target as HTMLImageElement).src = '../images/default.jpeg';
        }} />
      </div>
      <Card.Body>
        <Card.Title>{pet.name}</Card.Title>
        <Card.Text>
          <strong>Species:</strong> {pet.species}
          <br />
          <strong>Breed:</strong> {pet.breed ?? 'Unknown'}
          <br />
          <strong>Age:</strong> {pet.age !== null ? `${pet.age} years` : 'Unknown'}
          <br />
          <strong>Status:</strong> {pet.status}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default PetCard;
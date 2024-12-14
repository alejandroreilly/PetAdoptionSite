import React, { useState } from 'react';
import './ApplicationForm.css';

interface ApplicationFormProps {
  onSubmit: (formData: string) => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    question1: '',
    question2: '',
    question3: '',
    question4: '',
    question5: '',
    question6: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const combinedData = `
      Question 1: ${formData.question1}\n
      Question 2: ${formData.question2}\n
      Question 3: ${formData.question3}\n
      Question 4: ${formData.question4}\n
      Question 5: ${formData.question5}\n
      Question 6: ${formData.question6}
    `;
    onSubmit(combinedData.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="application-form">
      <h2>Adoption Application</h2>
      {[
        "What is your daily schedule? Please include work and hobbies.",
        "How many people share your household?",
        "Have you owned any animals previously?",
        "Do you own any other animals? If so, how many and what kinds?",
        "Where will your pet be kept during the day?",
        "Do you have a reference you can provide us with? If so, please list their name and number.",
      ].map((question, index) => (
        <div key={index} className="form-group">
          <label>{question}</label>
          <textarea
            name={`question${index + 1}`}
            value={formData[`question${index + 1}` as keyof typeof formData]}
            onChange={handleChange}
            required
          />
        </div>
      ))}
      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
};

export default ApplicationForm;
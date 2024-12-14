import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { Container } from 'react-bootstrap';
import LoginForm from '../components/LoginForm';

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (username: string, password: string) => {
    setError(null);
  
    try {
      const response = await fetch('/api/read_users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.status === 200) {
        const data = await response.json();
        console.log('Login successful:', data);
  
        // Save user data to sessionStorage, including user ID
        sessionStorage.setItem('user', JSON.stringify({ id: data.user_id }));

  
        alert('Login successful');
        navigate('/profile'); // Redirect to the profile page 
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('An unexpected error occurred');
    }
  };
  

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <h1>Login</h1>
      <LoginForm onLogin={handleLogin} error={error} />
    </Container>
  );
};

export default Login;
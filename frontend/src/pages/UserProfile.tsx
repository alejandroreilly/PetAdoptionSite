import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

interface UserProfileData {
  user_id: number;
  username: string;
  data?: string;
  location?: string;
  occupation?: string;
  bio?: string;
}

const UserProfile: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/read_users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'sampleUser',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        setUserProfile(data[0]);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="user-profile-page">
      <div className="main-profile-section">
        <div className="profile-picture">150 x 150</div>
        <div className="profile-info">
          <h2>{userProfile?.username || 'User'}</h2>
          <p>{userProfile?.location || 'Location'}</p>
          <p>{userProfile?.occupation || 'Occupation'}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <button
          className="dashboard-button"
          onClick={() => navigate('/user/application')}
        >
          Forms
        </button>
        <button
          className="dashboard-button"
          onClick={() => navigate('/contact')}
        >
          Support
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
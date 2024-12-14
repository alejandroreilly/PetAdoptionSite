import React from 'react';
import './ApplicationStatus.css';

interface ApplicationStatusProps {
  status: string;
  lastUpdated: string;
}

const ApplicationStatus: React.FC<ApplicationStatusProps> = ({ status, lastUpdated }) => {
  return (
    <div className="application-status">
      <div className="status-bar">
        <span className="status-text">Application: {status}</span>
        <span className="status-time">Last Updated: {lastUpdated}</span>
      </div>
    </div>
  );
};

export default ApplicationStatus;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/cards.css';

const ActionCard = ({ icon: Icon, title, description, action, path, color }) => {
  const navigate = useNavigate();

  return (
    <div className={`action-card action-card-${color}`}>
      <div className="card-icon">
        <Icon size={32} />
      </div>
      <h3 className="card-title">{title}</h3>
      <p className="card-description">{description}</p>
      <button className="card-button" onClick={() => navigate(path)}>
        {action}
        <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

export default ActionCard;
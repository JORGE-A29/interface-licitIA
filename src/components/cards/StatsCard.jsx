import React from 'react';
import '../styles/cards.css';

const StatsCard = ({ icon: Icon, label, value, change, color }) => {
  const isPositive = change !== undefined && change > 0;

  return (
    <div className={`stats-card stats-card-${color}`}>
      <div className="stats-icon">
        <Icon size={24} />
      </div>
      <div className="stats-content">
        <p className="stats-label">{label}</p>
        <div className="stats-value">
          <span className="value">{value}</span>
          {change !== undefined && (
            <span className={`change ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? '+' : ''}{change}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
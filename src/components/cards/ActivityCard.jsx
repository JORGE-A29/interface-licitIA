import React from 'react';
import '../styles/cards.css';

const ActivityCard = ({ activity }) => {
  const statusColors = {
    success: '#10b981',
    warning: '#f59e0b',
    pending: '#6366f1',
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="activity-card">
      <div className="activity-header">
        <div className="activity-status" style={{ backgroundColor: statusColors[activity.status] }} />
        <div className="activity-info">
          <h4 className="activity-title">{activity.title}</h4>
          <p className="activity-date">{formatDate(activity.date)}</p>
        </div>
      </div>
      <p className="activity-result">{activity.result}</p>
    </div>
  );
};

export default ActivityCard;

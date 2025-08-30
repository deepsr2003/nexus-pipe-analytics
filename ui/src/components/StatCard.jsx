import React from 'react';
import './StatCard.css'; // We'll create this CSS file next

const StatCard = ({ title, value, unit, isLoading }) => {
  return (
    <div className="stat-card">
      <h3 className="stat-title">{title}</h3>
      <p className="stat-value">
        {isLoading ? '...' : value}
        {unit && <span className="stat-unit">{unit}</span>}
      </p>
    </div>
  );
};

export default StatCard;

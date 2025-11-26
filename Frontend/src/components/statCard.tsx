import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-text">
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value}</p>
      </div>

      <div className="stat-icon">{icon}</div>
    </div>
  );
};

export default StatCard;

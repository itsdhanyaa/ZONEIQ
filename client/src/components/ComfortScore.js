import React from 'react';

const ComfortScore = ({ score }) => {
  const getScoreColor = (score) => {
    if (score >= 70) return '#27ae60';
    if (score >= 40) return '#f39c12';
    return '#e74c3c';
  };

  const getScoreLabel = (score) => {
    if (score >= 70) return 'Comfortable';
    if (score >= 40) return 'Moderate';
    return 'Crowded';
  };

  return (
    <div className="comfort-score">
      <h3>Comfort Score</h3>
      <div className="score" style={{ color: getScoreColor(score) }}>
        {score}/100
      </div>
      <p style={{ color: getScoreColor(score), fontWeight: 'bold' }}>
        {getScoreLabel(score)}
      </p>
    </div>
  );
};

export default ComfortScore;

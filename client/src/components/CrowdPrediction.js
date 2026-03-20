import React, { useState, useEffect } from 'react';
import { linearRegression, predict } from '../utils/linearRegression';

const CrowdPrediction = ({ historicalData }) => {
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    if (historicalData && historicalData.length >= 3) {
      const counts = historicalData.map(d => d.count);
      const model = linearRegression(counts);
      const nextPrediction = predict(model, counts.length);
      setPrediction(Math.max(0, Math.round(nextPrediction)));
    }
  }, [historicalData]);

  if (!prediction) return null;

  const maxCapacity = 100;
  const predictedOccupancy = (prediction / maxCapacity) * 100;
  const status = predictedOccupancy >= 90 ? 'critical' : predictedOccupancy >= 70 ? 'warning' : 'safe';

  return (
    <div className={`prediction-panel ${status}`}>
      <h3>📊 Predicted Next Count (Linear Regression)</h3>
      <p><strong>Predicted:</strong> {prediction} persons</p>
      <p><strong>Expected Occupancy:</strong> {predictedOccupancy.toFixed(1)}%</p>
      <p><strong>Trend:</strong> {status.toUpperCase()}</p>
    </div>
  );
};

export default CrowdPrediction;

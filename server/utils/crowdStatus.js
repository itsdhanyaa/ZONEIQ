exports.getCrowdStatus = (currentCrowd, maxCapacity) => {
  if (maxCapacity === 0) return { percentage: 0, status: 'Unknown' };
  const percentage = Math.min(100, (currentCrowd / maxCapacity) * 100);
  let status;
  if (percentage >= 90) status = 'Critical';
  else if (percentage >= 70) status = 'Warning';
  else status = 'Safe';
  return { percentage: parseFloat(percentage.toFixed(1)), status };
};

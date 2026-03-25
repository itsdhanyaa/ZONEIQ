exports.checkThreshold = (currentCount, maxCapacity) => {
  const percentage = (currentCount / maxCapacity) * 100;
  if (percentage >= 90) return 'critical';
  if (percentage >= 70) return 'warning';
  return 'safe';
};

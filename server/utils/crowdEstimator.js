const getTimeBasedValue = (maxCapacity) => {
  const hour = new Date().getHours();
  if (hour >= 17 && hour <= 20) return maxCapacity * 0.55; // Evening peak
  if (hour >= 10 && hour <= 13) return maxCapacity * 0.35; // Midday moderate
  if (hour >= 7 && hour <= 9)   return maxCapacity * 0.20; // Morning low-moderate
  return maxCapacity * 0.10;                                // Off hours low
};

const getExternalFactor = (maxCapacity) => {
  return Math.random() * maxCapacity * 0.05;
};

const getRandomFactor = () => Math.floor(Math.random() * 20);

exports.estimateCrowd = (maxCapacity) => {
  const base = getTimeBasedValue(maxCapacity);
  const random = getRandomFactor();
  const external = getExternalFactor(maxCapacity);
  return Math.min(maxCapacity, Math.round(base + random + external));
};

exports.getCrowdStatus = (currentCrowd, maxCapacity) => {
  if (maxCapacity === 0) return { percentage: 0, status: 'Unknown' };
  const percentage = Math.min(100, (currentCrowd / maxCapacity) * 100);
  let status;
  if (percentage >= 90) status = 'Critical';
  else if (percentage >= 70) status = 'Warning';
  else status = 'Safe';
  return { percentage: parseFloat(percentage.toFixed(1)), status };
};

exports.getBestTimeToVisit = () => {
  const hour = new Date().getHours();
  if (hour >= 17 && hour <= 20) return 'Best time: Early morning (6–9 AM) or late night (9 PM+)';
  if (hour >= 10 && hour <= 13) return 'Best time: Evening after 8 PM or early morning';
  return 'Now is a good time to visit!';
};

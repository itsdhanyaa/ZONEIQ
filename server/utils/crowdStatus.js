exports.getCrowdStatus = (currentCrowd, maxCapacity) => {
  if (maxCapacity === 0) {
    return { percentage: 0, status: 'Unknown' };
  }

  const percentage = Math.min(100, (currentCrowd / maxCapacity) * 100);
  let status;

  if (percentage < 40) {
    status = 'Free';
  } else if (percentage >= 40 && percentage <= 70) {
    status = 'Moderate';
  } else {
    status = 'Crowded';
  }

  return {
    percentage: percentage.toFixed(1),
    status
  };
};

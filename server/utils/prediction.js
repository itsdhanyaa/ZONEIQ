exports.predictCrowdLevel = (historicalData) => {
  if (historicalData.length < 2) return null;
  const counts = historicalData.map(d => d.count);
  const n = counts.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  
  counts.forEach((count, i) => {
    sumX += i;
    sumY += count;
    sumXY += i * count;
    sumX2 += i * i;
  });
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return slope * n + intercept;
};

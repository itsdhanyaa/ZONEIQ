export const linearRegression = (data) => {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: data[0] || 0 };

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

  data.forEach((point, i) => {
    sumX += i;
    sumY += point;
    sumXY += i * point;
    sumX2 += i * i;
  });

  const denom = (n * sumX2 - sumX * sumX);
  if (denom === 0) return { slope: 0, intercept: sumY / n };

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
};

export const predict = (model, x) => {
  return model.slope * x + model.intercept;
};

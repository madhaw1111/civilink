export const calculateRentalDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return (
    (end.getTime() - start.getTime()) /
      (1000 * 60 * 60 * 24) +
    1
  );
};



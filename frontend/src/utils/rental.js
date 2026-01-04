export const calculateRentalDays = (startDate, endDate) => {
  // Safety: missing dates
  if (!startDate || !endDate) return 1;

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Safety: invalid dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 1;
  }

  // If end date is before start date, fix it
  if (end < start) return 1;

  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  // Minimum 1 day rental
  return Math.max(diffDays + 1, 1);
};

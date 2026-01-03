import { calculateRentalDays } from "./utils/rental";

const days = calculateRentalDays(startDate, endDate);

const total =
  selectedVariant.dailyPrice *
  selectedQuantity *
  days;

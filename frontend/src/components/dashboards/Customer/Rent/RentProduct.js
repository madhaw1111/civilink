import { calculateRentalDays } from "./utils/rental";

const days = calculateRentalDays(startDate, endDate);

// ✅ Safe fallbacks
const price = Number(selectedVariant?.dailyPrice) || 0;
const quantity = Number(selectedQuantity) || 1;
const rentalDays = Number(days) || 1;

const total = price * quantity * rentalDays;

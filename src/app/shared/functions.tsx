import { MONTHS } from "./consts";
import { BudgetItem } from "./types";

export const getAnnualPlanned = (item: BudgetItem): number =>
  item.planned * item.paymentMonths.length;

export const getCorrectedYTD = (
  item: BudgetItem,
  monthsPassed: number,
): number => {
  let total = 0;
  for (let i = 1; i <= monthsPassed; i++) {
    if (item.paymentMonths.includes(i)) {
      const correction = item.corrections.find((c) => c.month === i);
      total += correction ? correction.amount : item.planned;
    }
  }
  return total;
};

export const getPlannedYTD = (
  item: BudgetItem,
  monthsPassed: number,
): number => {
  return (
    item.planned * item.paymentMonths.filter((m) => m <= monthsPassed).length
  );
};

export const getProjectedAnnual = (
  item: BudgetItem,
  monthsPassed: number,
): number => {
  const actualYTD = getCorrectedYTD(item, monthsPassed);
  const futurePlanned =
    item.paymentMonths.filter((m) => m > monthsPassed).length * item.planned;
  return actualYTD + futurePlanned;
};

export const getMonthlyEquivalent = (item: BudgetItem): number =>
  getAnnualPlanned(item) / 12;

export const formatPaymentMonths = (months: number[]): string => {
  if (months.length === 12) return "Jan - Dec";
  if (months.length === 1) return MONTHS[months[0] - 1];
  if (months.length === 0) return "N/A";
  const sorted = [...months].sort((a, b) => a - b);
  let isContiguous = true;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1] + 1) {
      isContiguous = false;
      break;
    }
  }
  if (isContiguous) {
    return `${MONTHS[sorted[0] - 1].substring(0, 3)} - ${MONTHS[sorted[sorted.length - 1] - 1].substring(0, 3)}`;
  }
  return sorted.map((m) => MONTHS[m - 1].substring(0, 3)).join(", ");
};

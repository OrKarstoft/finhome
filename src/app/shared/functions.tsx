import { MONTHS } from "./consts";
import { BudgetItem } from "./types";

// Simple caching for frequently called functions to avoid redundant calculations
const calculationCache = new Map<string, number>();

const getCacheKey = (item: BudgetItem, func: string, monthsPassed?: number): string => {
  return `${item.id}-${func}-${monthsPassed || 'all'}-${JSON.stringify(item.corrections)}`;
};

export const getAnnualPlanned = (item: BudgetItem): number => {
  const cacheKey = getCacheKey(item, 'annualPlanned');
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey)!;
  }
  
  const result = item.planned * item.paymentMonths.length;
  calculationCache.set(cacheKey, result);
  return result;
};

export const getCorrectedYTD = (
  item: BudgetItem,
  monthsPassed: number,
): number => {
  const cacheKey = getCacheKey(item, 'correctedYTD', monthsPassed);
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey)!;
  }
  
  let total = 0;
  for (let i = 1; i <= monthsPassed; i++) {
    if (item.paymentMonths.includes(i)) {
      const correction = item.corrections.find((c) => c.month === i);
      total += correction ? correction.amount : item.planned;
    }
  }
  
  calculationCache.set(cacheKey, total);
  return total;
};

export const getPlannedYTD = (
  item: BudgetItem,
  monthsPassed: number,
): number => {
  const cacheKey = getCacheKey(item, 'plannedYTD', monthsPassed);
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey)!;
  }
  
  const result = item.planned * item.paymentMonths.filter((m) => m <= monthsPassed).length;
  calculationCache.set(cacheKey, result);
  return result;
};

export const getProjectedAnnual = (
  item: BudgetItem,
  monthsPassed: number,
): number => {
  const cacheKey = getCacheKey(item, 'projectedAnnual', monthsPassed);
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey)!;
  }
  
  const actualYTD = getCorrectedYTD(item, monthsPassed);
  const futurePlanned =
    item.paymentMonths.filter((m) => m > monthsPassed).length * item.planned;
  const result = actualYTD + futurePlanned;
  
  calculationCache.set(cacheKey, result);
  return result;
};

export const getMonthlyEquivalent = (item: BudgetItem): number => {
  const cacheKey = getCacheKey(item, 'monthlyEquivalent');
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey)!;
  }
  
  const result = getAnnualPlanned(item) / 12;
  calculationCache.set(cacheKey, result);
  return result;
};

// Clear cache when needed (e.g., when budget data changes significantly)
export const clearCalculationCache = (): void => {
  calculationCache.clear();
};

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

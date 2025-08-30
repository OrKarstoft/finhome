export interface Correction {
  month: number;
  amount: number;
}

export interface BudgetItem {
  id: number;
  itemName: string;
  category: string;
  type: "income" | "expense";
  planned: number;
  paymentMonths: number[];
  corrections: Correction[];
  totalAmount?: number;
  amountPaidOff?: number;
}

export interface CategorySummary {
  name: string;
  type: "income" | "expense";
  monthlyEquivalent: number;
  totalAnnualPlanned: number;
  totalAnnualProjected: number;
  actual: number;
  plannedYTD: number;
}

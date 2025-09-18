"use client";

import React from "react";
import { BudgetItem } from "../../shared/types";
import ProgressBar from "../ProgressBar/ProgressBar";
import { Banknote } from "../../shared/icons";
import { getCorrectedYTD, getPlannedYTD } from "../../shared/functions";

interface LoanPayoffWidgetProps {
  budgetData: BudgetItem[];
  monthsPassed: number;
}

export default function LoanPayoffWidget({
  budgetData,
  monthsPassed,
}: LoanPayoffWidgetProps) {
  const loanItems = budgetData.filter((item) => item.category === "Loan");
  if (loanItems.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden dark-mode-transition">
      <h3 className="text-xl font-bold p-4 border-b dark:border-gray-700 flex items-center gap-2 text-blue-500">
        <Banknote className="w-6 h-6" /> Loan Payoff Progress
      </h3>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {loanItems.map((item) => {
          const plannedYTD = getPlannedYTD(item, monthsPassed);
          const actualYTD = getCorrectedYTD(item, monthsPassed);
          const difference = actualYTD - plannedYTD;
          const totalLoanAmount = item.totalAmount || 0;
          const totalPaid = (item.amountPaidOff || 0) + actualYTD;

          return (
            <li key={item.id} className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800 dark:text-white">
                  {item.itemName}
                </span>
                {difference > 0 && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Ahead by {difference.toLocaleString()} DKK
                  </span>
                )}
              </div>
              <ProgressBar
                value={totalPaid}
                total={totalLoanAmount}
                type="expense"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex justify-between">
                <span>Paid: {totalPaid.toLocaleString()} DKK</span>
                <span>Total: {totalLoanAmount.toLocaleString()} DKK</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

"use client";

import React, { useMemo, useContext, useCallback } from "react";
import { RootContext } from "./RootProvider";
import SummaryCards from "./components/SummaryCards/SummaryCards";
import SummaryTable from "./components/SummaryTable/SummaryTable";
import LoanPayoffWidget from "./components/LoanPayoffWidget/LoanPayoffWidget";
import {
  getAnnualPlanned,
  getCorrectedYTD,
  getMonthlyEquivalent,
  getPlannedYTD,
  getProjectedAnnual,
} from "./shared/functions";
import { CategorySummary } from "./shared/types";

export default function Home() {
  const context = useContext(RootContext);
  if (!context)
    throw new Error(
      "Context not found. Ensure Dashboard is wrapped in rootContext.Provider.",
    );

  const { budgetData, monthsPassed, setMonthsPassed } = context;

  // Memoize filtered data separately to avoid recalculating on every render
  const nonLoanItems = useMemo(() => {
    return budgetData.filter((x) => x.category !== "Loan");
  }, [budgetData]);

  // Memoize individual item calculations to avoid redundant work
  const itemCalculations = useMemo(() => {
    console.log("Calculating item-level data for", nonLoanItems.length, "items");
    const startTime = performance.now();
    
    const calculations = new Map();
    
    nonLoanItems.forEach((item) => {
      calculations.set(item.id, {
        monthlyEquivalent: getMonthlyEquivalent(item),
        totalAnnualPlanned: getAnnualPlanned(item),
        totalAnnualProjected: getProjectedAnnual(item, monthsPassed),
        actual: getCorrectedYTD(item, monthsPassed),
        plannedYTD: getPlannedYTD(item, monthsPassed),
      });
    });
    
    const endTime = performance.now();
    console.log(`Item calculations completed in ${endTime - startTime}ms`);
    return calculations;
  }, [nonLoanItems, monthsPassed]);

  // Aggregate the pre-calculated values into category summaries
  const summarizedData: CategorySummary[] = useMemo(() => {
    console.log("Aggregating category summaries");
    const startTime = performance.now();
    
    const summary: Record<string, CategorySummary> = {};
    
    nonLoanItems.forEach((item) => {
      const calc = itemCalculations.get(item.id);
      if (!calc) return;
      
      if (!summary[item.category]) {
        summary[item.category] = {
          name: item.category,
          type: item.type,
          monthlyEquivalent: 0,
          totalAnnualPlanned: 0,
          totalAnnualProjected: 0,
          actual: 0,
          plannedYTD: 0,
        };
      }
      
      summary[item.category].monthlyEquivalent += calc.monthlyEquivalent;
      summary[item.category].totalAnnualPlanned += calc.totalAnnualPlanned;
      summary[item.category].totalAnnualProjected += calc.totalAnnualProjected;
      summary[item.category].actual += calc.actual;
      summary[item.category].plannedYTD += calc.plannedYTD;
    });
    
    const endTime = performance.now();
    console.log(`Category aggregation completed in ${endTime - startTime}ms`);
    return Object.values(summary);
  }, [nonLoanItems, itemCalculations]);

  // Memoize the filtered data to avoid recalculating
  const incomeData = useMemo(() => 
    summarizedData.filter((item) => item.type === "income"), 
    [summarizedData]
  );
  
  const expenseData = useMemo(() => 
    summarizedData.filter((item) => item.type === "expense"), 
    [summarizedData]
  );

  // Memoize the months passed handler to prevent unnecessary re-renders
  const handleMonthsPassedChange = useCallback((value: number) => {
    setMonthsPassed(value);
  }, [setMonthsPassed]);

  return (
    <>
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Annual Budget Dashboard
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
          A high-level summary of your projected annual budget.
        </p>
      </header>
      <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md dark-mode-transition">
        <label
          htmlFor="months-slider"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Months Passed This Year:{" "}
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            {monthsPassed}
          </span>
        </label>
        <input
          id="months-slider"
          type="range"
          min="1"
          max="12"
          value={monthsPassed}
          onChange={(e) => handleMonthsPassedChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>Jan</span>
          <span>Jun</span>
          <span>Dec</span>
        </div>
      </div>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Financial Summary
        </h2>
        <SummaryCards budgetData={budgetData} monthsPassed={monthsPassed} />
      </section>
      <section className="space-y-8">
        <LoanPayoffWidget budgetData={budgetData} monthsPassed={monthsPassed} />
        <SummaryTable
          title="Income Categories"
          data={incomeData}
          monthsPassed={monthsPassed}
          type="income"
        />
        <SummaryTable
          title="Expense Categories"
          data={expenseData}
          monthsPassed={monthsPassed}
          type="expense"
        />
      </section>
    </>
  );
}

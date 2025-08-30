"use client";

import { useMemo, useContext } from "react";
import { rootContext } from "./layout";
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
  const context = useContext(rootContext);
  if (!context)
    throw new Error(
      "Context not found. Ensure Dashboard is wrapped in rootContext.Provider.",
    );

  const { budgetData, monthsPassed, setMonthsPassed } = context;

  const summarizedData: CategorySummary[] = useMemo(() => {
    const summary: Record<string, CategorySummary> = budgetData
      .filter((x) => x.category != "Loan")
      .reduce(
        (acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = {
              name: item.category,
              type: item.type,
              monthlyEquivalent: 0,
              totalAnnualPlanned: 0,
              totalAnnualProjected: 0,
              actual: 0,
              plannedYTD: 0,
            };
          }
          acc[item.category].monthlyEquivalent += getMonthlyEquivalent(item);
          acc[item.category].totalAnnualPlanned += getAnnualPlanned(item);
          acc[item.category].totalAnnualProjected += getProjectedAnnual(
            item,
            monthsPassed,
          );
          acc[item.category].actual += getCorrectedYTD(item, monthsPassed);
          acc[item.category].plannedYTD += getPlannedYTD(item, monthsPassed);
          return acc;
        },
        {} as Record<string, CategorySummary>,
      );
    return Object.values(summary);
  }, [budgetData, monthsPassed]);

  const incomeData = summarizedData.filter((item) => item.type === "income");
  const expenseData = summarizedData.filter((item) => item.type === "expense");

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
          onChange={(e) => setMonthsPassed(Number(e.target.value))}
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

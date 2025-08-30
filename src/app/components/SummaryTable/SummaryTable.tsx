"use client";

import React from "react";
import { CategorySummary } from "@/app/shared/types";
import ProgressBar from "../ProgressBar/ProgressBar";
import {
  Banknote,
  Car,
  Film,
  PiggyBank,
  Plus,
  Target,
  TrendingDown,
  TrendingUp,
  Utensils,
} from "@/app/shared/icons";
import Home from "@/app/page";
import { Repeat2 } from "lucide-react";

interface SummaryTableProps {
  title: string;
  data: CategorySummary[];
  monthsPassed: number;
  type: "income" | "expense";
}

export default function SummaryTable({ title, data, type }: SummaryTableProps) {
  const IconComponent = type === "income" ? TrendingUp : TrendingDown;
  const color = type === "income" ? "text-green-500" : "text-red-500";
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden dark-mode-transition">
      <h3
        className={`text-xl font-bold p-4 border-b dark:border-gray-700 flex items-center gap-2 ${color}`}
      >
        <IconComponent className="w-6 h-6" /> {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3">
                Category
              </th>
              <th scope="col" className="px-4 py-3">
                Avg. Monthly Planned
              </th>
              <th scope="col" className="px-4 py-3">
                Corrected (YTD)
              </th>
              <th scope="col" className="px-4 py-3">
                Projected (Annual)
              </th>
              <th scope="col" className="px-4 py-3">
                Progress (YTD)
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((cat) => (
              <CategoryRow key={cat.name} category={cat} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryRow({ category }: { category: CategorySummary }) {
  return (
    <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark-mode-transition">
      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white flex items-center gap-3">
        {getCategoryIcon(category.name)} {category.name}
      </td>
      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
        {Math.round(category.monthlyEquivalent).toLocaleString()} DKK
      </td>
      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
        {category.actual.toLocaleString()} DKK
      </td>
      <td className="px-4 py-3 font-semibold text-indigo-600 dark:text-indigo-400">
        {category.totalAnnualProjected.toLocaleString()} DKK
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <ProgressBar
            value={category.actual}
            total={category.plannedYTD}
            type={category.type}
          />
          <span className="text-xs text-gray-500 mt-1 text-center">
            {category.actual > category.plannedYTD ? "Over" : "On"} track
          </span>
        </div>
      </td>
    </tr>
  );
}
function getCategoryIcon(category: string): React.ReactElement {
  const icons: { [key: string]: React.ComponentType<{ className?: string }> } =
    {
      Salary: Banknote,
      Freelance: Plus,
      Housing: Home,
      Groceries: Utensils,
      Transportation: Car,
      Entertainment: Film,
      Savings: PiggyBank,
      Loan: Banknote,
      Subscriptions: Repeat2,
      default: Target,
    };
  const IconComponent = icons[category] || icons["default"];
  return <IconComponent />;
}

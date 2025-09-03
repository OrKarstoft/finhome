"use client";

import React, { useMemo, memo } from "react";
import { BudgetItem } from "../../shared/types";
import {
  getAnnualPlanned,
  getCorrectedYTD,
  getProjectedAnnual,
} from "../../shared/functions";

type SummaryCardsProps = {
  budgetData: BudgetItem[];
  monthsPassed: number;
};

const SummaryCards = memo(function SummaryCards({
  budgetData,
  monthsPassed,
}: SummaryCardsProps) {
  const summary = useMemo(() => {
    let originalPlanNet = 0;
    let projectedNet = 0;
    let actualNet = 0;

    budgetData.forEach((item) => {
      const sign = item.type === "income" ? 1 : -1;
      originalPlanNet += getAnnualPlanned(item) * sign;
      projectedNet += getProjectedAnnual(item, monthsPassed) * sign;
      actualNet += getCorrectedYTD(item, monthsPassed) * sign;
    });

    const variance = projectedNet - originalPlanNet;

    return { originalPlanNet, projectedNet, actualNet, variance };
  }, [budgetData, monthsPassed]);

  const SummaryCard: React.FC<{
    title: string;
    value: number;
    colorClass?: string;
  }> = ({ title, value, colorClass = "text-gray-800 dark:text-white" }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex-1 dark-mode-transition">
      <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
        {title}
      </h4>
      <p className={`text-3xl font-bold mt-2 ${colorClass}`}>
        {value.toLocaleString()} DKK
      </p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <SummaryCard
        title="Original Plan (Net)"
        value={summary.originalPlanNet}
        colorClass={
          summary.originalPlanNet >= 0 ? "text-green-500" : "text-red-500"
        }
      />
      <SummaryCard
        title="Projected Net (Corrected)"
        value={summary.projectedNet}
        colorClass={
          summary.projectedNet >= 0 ? "text-green-500" : "text-red-500"
        }
      />
      <SummaryCard
        title="Variance"
        value={summary.variance}
        colorClass={
          summary.variance > 0
            ? "text-green-500"
            : summary.variance < 0
              ? "text-red-500"
              : ""
        }
      />
      <SummaryCard
        title={`Actual Net (YTD)`}
        value={summary.actualNet}
        colorClass={summary.actualNet >= 0 ? "text-green-500" : "text-red-500"}
      />
    </div>
  );
});

export default SummaryCards;

"use client";

interface ProgressBarProps {
  value: number; // Current value (e.g., actual spending or income)
  total: number; // Total budget or target amount
  type: "income" | "expense"; // Type of progress bar (income or expense)
}

export default function ProgressBar({ value, total, type }: ProgressBarProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  let barColor = "bg-blue-500"; // Default: On Track

  if (type === "expense") {
    if (percentage < 95)
      barColor = "bg-green-500"; // Good: under budget
    else if (percentage > 105) barColor = "bg-red-500"; // Bad: over budget
  } else {
    // income
    if (percentage > 105)
      barColor = "bg-green-500"; // Good: over budget
    else if (percentage < 95) barColor = "bg-red-500"; // Bad: under budget
  }

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className={`${barColor} h-2.5 rounded-full`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      ></div>
    </div>
  );
}

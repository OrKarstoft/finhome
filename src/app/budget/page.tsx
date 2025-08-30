"use client";

import React from "react";
import { useState, useMemo, useContext } from "react";
import { Plus } from "lucide-react";
import { rootContext } from "../layout";
import Modal from "../components/Modal/Modal";
import ItemForm from "./components/ItemForm/ItemForm";
import { Edit } from "../shared/icons";
import { BudgetItem } from "../shared/types";
import { MONTHS } from "../shared/consts";
import {
  getProjectedAnnual,
  getCorrectedYTD,
  formatPaymentMonths,
} from "../shared/functions";

export default function Budget() {
  const context = useContext(rootContext);
  if (!context)
    throw new Error(
      "Context not found. Ensure Budget is wrapped in rootContext.Provider.",
    );

  const { budgetData, setBudgetData, monthsPassed } = context;

  const addBudgetItem = (item: BudgetItem) =>
    setBudgetData((prevData) => [...prevData, item]);
  const updateBudgetItem = (updatedItem: BudgetItem) =>
    setBudgetData((prevData) =>
      prevData.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    );
  const deleteBudgetItem = (itemId: number) =>
    setBudgetData((prevData) => prevData.filter((item) => item.id !== itemId));

  const [editingItem, setEditingItem] = useState<BudgetItem | {} | null>(null);
  const [viewType, setViewType] = useState("list");
  const existingCategories = useMemo(
    () => [
      "Loan",
      ...new Set(
        budgetData
          .map((item) => item.category)
          .filter((c) => c !== "Loan" && c !== "Salary"),
      ),
    ],
    [budgetData],
  );

  const handleSave = (itemToSave: BudgetItem) => {
    if ("id" in itemToSave && budgetData.some((i) => i.id === itemToSave.id)) {
      updateBudgetItem(itemToSave);
    } else {
      addBudgetItem(itemToSave);
    }
  };

  const sortedBudgetData = useMemo(() => {
    return [...budgetData].sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "income" ? -1 : 1;
      }
      if (a.type === "income") {
        return b.planned - a.planned;
      }
      if (a.type === "expense") {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });
  }, [budgetData]);

  return (
    <div>
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              Detailed Budget
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
              Manage all your individual income and expense items.
            </p>
          </div>
          <button
            onClick={() => setEditingItem({})}
            className="inline-flex items-center gap-2 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="w-5 h-5" /> Add New Item
          </button>
        </div>
        <div className="mt-4">
          <span className="isolate inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setViewType("list")}
              type="button"
              className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold transition-colors ${viewType === "list" ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50"}`}
            >
              List View
            </button>
            <button
              onClick={() => setViewType("monthly")}
              type="button"
              className={`relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold transition-colors ${viewType === "monthly" ? "bg-indigo-600 text-white" : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50"}`}
            >
              By Month
            </button>
          </span>
        </div>
      </header>

      {editingItem && (
        <Modal onClose={() => setEditingItem(null)}>
          <ItemForm
            item={editingItem as BudgetItem}
            onSave={handleSave}
            onDelete={deleteBudgetItem}
            onDone={() => setEditingItem(null)}
            existingCategories={existingCategories}
          />
        </Modal>
      )}

      {viewType === "list" ? (
        <ListView
          budgetData={sortedBudgetData}
          monthsPassed={monthsPassed}
          onEdit={(item) => setEditingItem(item)}
        />
      ) : (
        <MonthlyView budgetData={budgetData} monthsPassed={monthsPassed} />
      )}
    </div>
  );
}
const Tooltip: React.FC<{
  content: string;
  children: React.ReactElement;
}> = ({ content, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 left-1/2 -translate-x-1/2">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};
const ListView: React.FC<{
  budgetData: BudgetItem[];
  monthsPassed: number;
  onEdit: (item: BudgetItem) => void;
}> = ({ budgetData, monthsPassed, onEdit }) => (
  <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden dark-mode-transition">
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-4 py-3">
              Item Name
            </th>
            <th scope="col" className="px-4 py-3">
              Category
            </th>
            <th scope="col" className="px-4 py-3">
              Type
            </th>
            <th scope="col" className="px-4 py-3">
              Planned Amount
            </th>
            <th scope="col" className="px-4 py-3">
              Payment Months
            </th>
            <th scope="col" className="px-4 py-3">
              Corrected (YTD)
            </th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {budgetData.map((item) => (
            <tr
              key={item.id}
              className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark-mode-transition"
            >
              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                {item.itemName}
              </td>
              <td className="px-4 py-3">{item.category}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${item.type === "income" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"}`}
                >
                  {item.type}
                </span>
              </td>
              <td className="px-4 py-3">{item.planned.toLocaleString()} DKK</td>
              <td className="px-4 py-3 text-xs">
                {formatPaymentMonths(item.paymentMonths)}
              </td>
              <td className="px-4 py-3">
                <Tooltip
                  content={`Projected Annual: ${getProjectedAnnual(item, monthsPassed).toLocaleString()} DKK`}
                >
                  <span>
                    {getCorrectedYTD(item, monthsPassed).toLocaleString()} DKK
                  </span>
                </Tooltip>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(item)}
                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
const MonthlyView: React.FC<{
  budgetData: BudgetItem[];
  monthsPassed: number;
}> = ({ budgetData, monthsPassed }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {MONTHS.map((month, index) => {
      const monthIndex = index + 1;
      const itemsInMonth = budgetData.filter((item) =>
        item.paymentMonths.includes(monthIndex),
      );
      const income = itemsInMonth.reduce(
        (sum, i) =>
          sum +
          (i.type === "income"
            ? i.corrections.find((c) => c.month === monthIndex)?.amount ||
              i.planned
            : 0),
        0,
      );
      const expenses = itemsInMonth.reduce(
        (sum, i) =>
          sum +
          (i.type === "expense"
            ? i.corrections.find((c) => c.month === monthIndex)?.amount ||
              i.planned
            : 0),
        0,
      );
      const net = income - expenses;

      return (
        <div
          key={month}
          className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden dark-mode-transition ${monthIndex > monthsPassed ? "opacity-60" : ""}`}
        >
          <div className="p-4 border-b dark:border-gray-700">
            <h4 className="font-bold text-lg text-gray-800 dark:text-white text-center mb-2">
              {month}
            </h4>
            <div className="flex justify-around text-sm mt-1">
              <div className="text-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Income
                </span>
                <p className="text-green-500 font-medium">
                  +{income.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Expenses
                </span>
                <p className="text-red-500 font-medium">
                  -{expenses.toLocaleString()}
                </p>
              </div>
              <div className="text-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Net
                </span>
                <p
                  className={`font-bold ${net >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {net.toLocaleString()} DKK
                </p>
              </div>
            </div>
          </div>
          <ul className="p-4 space-y-2 text-sm">
            {itemsInMonth.length > 0 ? (
              itemsInMonth.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    {item.itemName}
                  </span>
                  <span
                    className={
                      item.type === "income" ? "text-green-500" : "text-red-500"
                    }
                  >
                    {item.type === "income" ? "+" : "-"}
                    {(
                      item.corrections.find((c) => c.month === monthIndex)
                        ?.amount || item.planned
                    ).toLocaleString()}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-gray-400 italic">No transactions.</li>
            )}
          </ul>
        </div>
      );
    })}
  </div>
);

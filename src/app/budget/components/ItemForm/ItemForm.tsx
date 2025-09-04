"use client";

import React, { useState, useEffect } from "react";
import { ConfirmationModal } from "../ConfirmationModal/ConfirmationModal";
import { BudgetItem, Correction } from "../../../shared/types";
import { MONTHS } from "../../../shared/consts";
import { Trash2 } from "lucide-react";

interface ItemFormProps {
  item: BudgetItem | null;
  onSave: (item: BudgetItem) => void;
  onDelete: (id: number) => void;
  onDone: () => void;
  existingCategories: string[];
}

export const ItemForm: React.FC<ItemFormProps> = ({
  item,
  onSave,
  onDelete,
  onDone,
  existingCategories,
}) => {
  const [formData, setFormData] = useState(() => {
    const defaultState = {
      itemName: "",
      planned: "",
      category: existingCategories[0] || "new",
      type: "expense" as "income" | "expense",
      paymentMonths: [] as number[],
      corrections: [] as Correction[],
      totalAmount: "",
      amountPaidOff: "",
    };

    if (!item) {
      return defaultState;
    }

    // Merge item props, ensuring fields bound to inputs are not undefined to prevent uncontrolled components
    return {
      ...defaultState,
      ...item,
      planned: item.planned ?? "",
      totalAmount: item.totalAmount ?? "",
      amountPaidOff: item.amountPaidOff ?? "",
    };
  });
  const [newCategory, setNewCategory] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditing = !!item;

  useEffect(() => {
    if (formData.category === "Loan") {
      setFormData((prev) => ({ ...prev, type: "expense" }));
    }
  }, [formData.category]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleMonthToggle = (monthIndex: number) =>
    setFormData((prev) => ({
      ...prev,
      paymentMonths: prev.paymentMonths.includes(monthIndex)
        ? prev.paymentMonths.filter((m) => m !== monthIndex)
        : [...prev.paymentMonths, monthIndex].sort((a, b) => a - b),
    }));
  const handleCorrectionChange = (month: number, amount: string) =>
    setFormData((prev) => ({
      ...prev,
      corrections: amount
        ? [
            ...prev.corrections.filter((c) => c.month !== month),
            { month, amount: Number(amount) },
          ]
        : prev.corrections.filter((c) => c.month !== month),
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory =
      formData.category === "new" ? newCategory : formData.category;
    if (
      !formData.itemName ||
      !formData.planned ||
      !finalCategory ||
      formData.paymentMonths.length === 0
    ) {
      alert(
        "Please fill out all required fields and select at least one payment month.",
      );
      return;
    }

    // Explicitly construct the object to be saved to ensure correct types and structure
    const submissionData: Omit<BudgetItem, "id"> & { id?: number } = {
      itemName: formData.itemName,
      category: finalCategory,
      type: formData.type,
      planned: Number(formData.planned),
      paymentMonths: formData.paymentMonths,
      corrections: formData.corrections,
    };

    if (formData.category === "Loan") {
      submissionData.totalAmount = Number(formData.totalAmount);
      submissionData.amountPaidOff = Number(formData.amountPaidOff);
    }

    if (isEditing && item?.id) {
      submissionData.id = item.id;
    } else {
      submissionData.id = Date.now();
    }

    onSave(submissionData as BudgetItem);
    onDone();
  };

  const handleDelete = () => {
    if (item && item.id) {
      onDelete(item.id);
      setShowDeleteConfirm(false);
      onDone();
    }
  };

  const inputClass =
    "mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2";

  return (
    <>
      {showDeleteConfirm && (
        <ConfirmationModal
          onConfirmAction={handleDelete}
          onCancelAction={() => setShowDeleteConfirm(false)}
          message="Are you sure you want to delete this item? This action cannot be undone."
        />
      )}
      <div className="dark-mode-transition">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {isEditing ? "Edit Item" : "Add New Item"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Item Name
              </label>
              <input
                type="text"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="e.g., Netflix"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount per Payment
              </label>
              <input
                type="number"
                name="planned"
                value={formData.planned}
                onChange={handleChange}
                placeholder="e.g., 99"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={inputClass}
                disabled={formData.category === "Loan"}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`block w-full rounded-none ${formData.category === "new" ? "rounded-l-md" : "rounded-md"} border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2`}
                >
                  {existingCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="new">-- Add New Category --</option>
                </select>
                {formData.category === "new" && (
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New Category Name"
                    className="block w-full rounded-r-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                  />
                )}
              </div>
            </div>
            {formData.category === "Loan" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total Loan Amount
                  </label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    placeholder="e.g., 237000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount Already Paid Off
                  </label>
                  <input
                    type="number"
                    name="amountPaidOff"
                    value={formData.amountPaidOff}
                    onChange={handleChange}
                    placeholder="e.g., 44400"
                    className={inputClass}
                  />
                </div>
              </>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Payment Months
            </label>
            <div className="mt-2 grid grid-cols-6 md:grid-cols-12 gap-2">
              {MONTHS.map((month, index) => (
                <div
                  key={month}
                  onClick={() => handleMonthToggle(index + 1)}
                  className={`text-center p-2 rounded-md cursor-pointer text-sm transition-colors ${formData.paymentMonths.includes(index + 1) ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"}`}
                >
                  {month.substring(0, 3)}
                </div>
              ))}
            </div>
          </div>
          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Corrections (Actual Amount)
              </label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.paymentMonths.map((monthIndex) => (
                  <div key={monthIndex}>
                    <label className="block text-xs text-gray-500">
                      {MONTHS[monthIndex - 1]}
                    </label>
                    <input
                      type="number"
                      placeholder={`Plan: ${formData.planned}`}
                      value={
                        formData.corrections.find((c) => c.month === monthIndex)
                          ?.amount || ""
                      }
                      onChange={(e) =>
                        handleCorrectionChange(monthIndex, e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-between items-center pt-4">
            <div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center gap-2 py-2 px-4 text-sm font-medium rounded-md text-red-600 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/50"
                >
                  <Trash2 className="w-4 h-4" /> Delete Item
                </button>
              )}
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onDone}
                className="py-2 px-4 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isEditing ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

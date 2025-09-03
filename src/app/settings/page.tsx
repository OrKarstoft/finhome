"use client";

import React, { useState, useMemo, useContext } from "react";
import { RootContext } from "../RootProvider";
import { ConfirmationModal } from "../budget/components/ConfirmationModal/ConfirmationModal";
import { Trash2 } from "lucide-react";

export default function Settings() {
  const context = useContext(RootContext);
  if (!context) throw new Error("Context not found");
  const { budgetData, setBudgetData, deleteCategory } = context;

  const [exportString, setExportString] = useState("");
  const [importString, setImportString] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const allCategories = useMemo(
    () =>
      ["Salary", "Loan", ...new Set(budgetData.map((i) => i.category))].filter(
        (value, index, self) => self.indexOf(value) === index && value,
      ),
    [budgetData],
  );

  const handleExport = () => {
    const jsonString = JSON.stringify(budgetData);
    const base64String = btoa(jsonString);
    setExportString(base64String);
    setMessage({ text: "Export string generated!", type: "success" });
  };

  const handleImport = () => {
    if (!importString) {
      setMessage({
        text: "Please paste your data string first.",
        type: "error",
      });
      return;
    }
    try {
      const jsonString = atob(importString);
      const importedData = JSON.parse(jsonString);
      if (
        Array.isArray(importedData) &&
        importedData.every((item) => "itemName" in item && "planned" in item)
      ) {
        setBudgetData(importedData);
        setMessage({ text: "Data imported successfully!", type: "success" });
      } else {
        throw new Error("Invalid data structure.");
      }
    } catch (error) {
      setMessage({
        text: "Error: Invalid or corrupt data string.",
        type: "error",
      });
      console.log(error);
    }
  };

  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = exportString;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      setMessage({ text: "Copied to clipboard!", type: "success" });
    } catch (error) {
      setMessage({ text: "Failed to copy.", type: "error" });
      console.log(error);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div>
      {categoryToDelete && (
        <ConfirmationModal
          onConfirmAction={() => {
            deleteCategory(categoryToDelete);
            setCategoryToDelete(null);
          }}
          onCancelAction={() => setCategoryToDelete(null)}
        />
      )}
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Settings
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">
          Import, export, and manage your budget data.
        </p>
      </header>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 dark-mode-transition">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
            Manage Categories
          </h2>
          <ul className="space-y-2">
            {allCategories.map((cat) => (
              <li
                key={cat}
                className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <span className="text-gray-700 dark:text-gray-200">{cat}</span>
                {!["Salary", "Loan"].includes(cat) && (
                  <button
                    onClick={() => setCategoryToDelete(cat)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 dark-mode-transition">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
            Export Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Generate a text string of your current budget data to save it
            locally or transfer to another device.
          </p>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Generate Export String
          </button>
          {exportString && (
            <div className="mt-4">
              <textarea
                readOnly
                value={exportString}
                className="w-full h-32 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
              <button
                onClick={copyToClipboard}
                className="mt-2 py-2 px-4 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 dark-mode-transition">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
            Import Data
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Paste your previously exported data string below to load it into the
            application. This will overwrite your current data.
          </p>
          <textarea
            value={importString}
            onChange={(e) => setImportString(e.target.value)}
            className="w-full h-32 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
            placeholder="Paste your Base64 data string here..."
          />
          <button
            onClick={handleImport}
            className="mt-2 py-2 px-4 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Load Data
          </button>
        </div>
      </div>
      {message.text && (
        <div
          className={`mt-4 p-3 rounded-md text-sm ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}

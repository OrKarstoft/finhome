"use client";

import React, { useEffect, useState, useCallback, createContext } from "react";
import { BudgetItem } from "./shared/types";

interface RootContextType {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  budgetData: BudgetItem[];
  setBudgetData: (data: BudgetItem[]) => void;
  addBudgetItem: (item: BudgetItem) => void;
  updateBudgetItem: (item: BudgetItem) => void;
  deleteBudgetItem: (id: number) => void;
  deleteCategory: (name: string) => void;
  monthsPassed: number;
  setMonthsPassed: (value: number) => void;
  showWelcome: boolean;
  setShowWelcome: (value: boolean) => void;
}

export const RootContext = createContext<RootContextType | null>(null);

export const RootProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [budgetData, setBudgetData] = useState<BudgetItem[]>([]);
  const [monthsPassed, setMonthsPassed] = useState(new Date().getMonth() + 1);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedFinHome");
    const savedData = localStorage.getItem("finHomeData");
    if (savedData) {
      setBudgetData(JSON.parse(savedData));
    } else if (!hasVisited) {
      setShowWelcome(true);
    }
  }, []);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedFinHome");
    if (budgetData.length > 0 || hasVisited) {
      localStorage.setItem("finHomeData", JSON.stringify(budgetData));
    }
  }, [budgetData]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const addBudgetItem = useCallback(
    (item: BudgetItem) => setBudgetData((prevData) => [...prevData, item]),
    [],
  );
  const updateBudgetItem = useCallback(
    (updatedItem: BudgetItem) =>
      setBudgetData((prevData) =>
        prevData.map((item) =>
          item.id === updatedItem.id ? updatedItem : item,
        ),
      ),
    [],
  );
  const deleteBudgetItem = useCallback(
    (itemId: number) =>
      setBudgetData((prevData) =>
        prevData.filter((item) => item.id !== itemId),
      ),
    [],
  );
  const deleteCategory = useCallback(
    (categoryName: string) =>
      setBudgetData((prevData) =>
        prevData.filter((item) => item.category !== categoryName),
      ),
    [],
  );

  const contextValue: RootContextType = {
    isDarkMode,
    setIsDarkMode,
    budgetData,
    setBudgetData,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
    deleteCategory,
    monthsPassed,
    setMonthsPassed,
    showWelcome,
    setShowWelcome,
  };

  return (
    <RootContext.Provider value={contextValue}>{children}</RootContext.Provider>
  );
};

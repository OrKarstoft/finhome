"use client";

import React, { useEffect, useState, createContext, startTransition } from "react";
import { BudgetItem } from "./shared/types";
import { templateForTwo } from "./shared/consts";
import { clearCalculationCache } from "./shared/functions";

interface RootContextType {
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  view: string;
  setView: (view: string) => void;
  budgetData: BudgetItem[];
  setBudgetData: (data: BudgetItem[]) => void;
  addBudgetItem: (item: BudgetItem) => void;
  updateBudgetItem: (item: BudgetItem) => void;
  deleteBudgetItem: (id: number) => void;
  deleteCategory: (name: string) => void;
  monthsPassed: number;
  setMonthsPassed: (value: number) => void;
  showWelcome: boolean;
  handleTemplateChoice: (choice: "blank" | "template") => void;
}

export const RootContext = createContext<RootContextType | null>(null);

export const RootProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [view, setView] = useState("dashboard");
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
    
    // Only save if there's data and it wasn't already saved by handleTemplateChoice
    if (budgetData.length > 0 && hasVisited) {
      const currentSavedData = localStorage.getItem("finHomeData");
      const currentData = JSON.stringify(budgetData);
      
      if (currentSavedData !== currentData) {
        localStorage.setItem("finHomeData", currentData);
      }
    }
  }, [budgetData]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const addBudgetItem = (item: BudgetItem) => {
    clearCalculationCache();
    setBudgetData((prevData) => [...prevData, item]);
  };
  const updateBudgetItem = (updatedItem: BudgetItem) => {
    clearCalculationCache();
    setBudgetData((prevData) =>
      prevData.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    );
  };
  const deleteBudgetItem = (itemId: number) => {
    clearCalculationCache();
    setBudgetData((prevData) => prevData.filter((item) => item.id !== itemId));
  };
  const deleteCategory = (categoryName: string) => {
    clearCalculationCache();
    setBudgetData((prevData) =>
      prevData.filter((item) => item.category !== categoryName),
    );
  };

  const handleTemplateChoice = (choice: "blank" | "template") => {
    // Close modal immediately for better UX
    setShowWelcome(false);
    localStorage.setItem("hasVisitedFinHome", "true");
    
    if (choice === "template") {
      // Save the template data to localStorage immediately to ensure persistence
      localStorage.setItem("finHomeData", JSON.stringify(templateForTwo));
      
      // Clear calculation cache before setting new data
      clearCalculationCache();
      
      // Use startTransition to defer the state update that triggers expensive calculations
      startTransition(() => {
        setBudgetData(templateForTwo);
      });
    } else {
      localStorage.setItem("finHomeData", JSON.stringify([]));
      clearCalculationCache();
      setBudgetData([]);
    }
  };

  const contextValue: RootContextType = {
    isDarkMode,
    setIsDarkMode,
    view,
    setView,
    budgetData,
    setBudgetData,
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
    deleteCategory,
    monthsPassed,
    setMonthsPassed,
    showWelcome,
    handleTemplateChoice,
  };

  return (
    <RootContext.Provider value={contextValue}>{children}</RootContext.Provider>
  );
};

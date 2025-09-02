"use client";

import React, { useEffect, useState, createContext, startTransition } from "react";
import { BudgetItem } from "./shared/types";
import { templateForTwo } from "./shared/consts";

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
    // Only save to localStorage if we have visited before or if we explicitly have budget data
    // This prevents saving during initial template load
    if (hasVisited && budgetData.length > 0) {
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

  const addBudgetItem = (item: BudgetItem) =>
    setBudgetData((prevData) => [...prevData, item]);
  const updateBudgetItem = (updatedItem: BudgetItem) =>
    setBudgetData((prevData) =>
      prevData.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    );
  const deleteBudgetItem = (itemId: number) =>
    setBudgetData((prevData) => prevData.filter((item) => item.id !== itemId));
  const deleteCategory = (categoryName: string) =>
    setBudgetData((prevData) =>
      prevData.filter((item) => item.category !== categoryName),
    );

  const handleTemplateChoice = (choice: "blank" | "template") => {
    setShowWelcome(false);
    localStorage.setItem("hasVisitedFinHome", "true");
    
    // Use setTimeout to defer the data update and localStorage save
    setTimeout(() => {
      if (choice === "template") {
        setBudgetData(templateForTwo);
      } else {
        setBudgetData([]);
      }
    }, 100);
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

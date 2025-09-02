"use client";

import React, { useEffect, useState, createContext, useMemo, useCallback, startTransition, useRef } from "react";
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
  const justSetTemplateRef = useRef(false);

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
    if (justSetTemplateRef.current) {
      localStorage.setItem("finHomeData", JSON.stringify(budgetData));
      justSetTemplateRef.current = false;
    } else {
      const hasVisited = localStorage.getItem("hasVisitedFinHome");
      if (hasVisited && budgetData.length > 0) {
        const savedData = localStorage.getItem("finHomeData");
        const currentSavedData = savedData ? JSON.parse(savedData) : [];
        // Only save if the data is actually different
        if (JSON.stringify(currentSavedData) !== JSON.stringify(budgetData)) {
          localStorage.setItem("finHomeData", JSON.stringify(budgetData));
        }
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

  // Memoize templateForTwo to prevent unnecessary re-renders
  const memoizedTemplateForTwo = useMemo(() => templateForTwo, []);

  const handleTemplateChoice = useCallback((choice: "blank" | "template") => {
    setShowWelcome(false);
    localStorage.setItem("hasVisitedFinHome", "true");
    
    // Use startTransition to make the state update non-blocking
    startTransition(() => {
      justSetTemplateRef.current = true;
      if (choice === "template") {
        setBudgetData(memoizedTemplateForTwo);
      } else {
        setBudgetData([]);
      }
    });
  }, [memoizedTemplateForTwo]);

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

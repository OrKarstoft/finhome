"use client";

import React, { useEffect, useState, createContext, useMemo, useCallback, startTransition } from "react";
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
  
  // Track when template data is being applied
  const [isSettingTemplate, setIsSettingTemplate] = useState(false);

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
    console.log("useEffect for saving data triggered, budgetData.length:", budgetData.length, "isSettingTemplate:", isSettingTemplate);
    const hasVisited = localStorage.getItem("hasVisitedFinHome");
    
    // Save data immediately if we're setting template data, or if there's data and the user has visited
    if (isSettingTemplate || (hasVisited && budgetData.length > 0)) {
      console.log("Saving data to localStorage");
      localStorage.setItem("finHomeData", JSON.stringify(budgetData));
      if (isSettingTemplate) {
        setIsSettingTemplate(false); // Reset the flag
      }
    } else {
      console.log("Not saving data - hasVisited:", hasVisited, "budgetData.length:", budgetData.length);
    }
  }, [budgetData, isSettingTemplate]);

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
    console.log("handleTemplateChoice called with:", choice);
    setShowWelcome(false);
    localStorage.setItem("hasVisitedFinHome", "true");
    console.log("Set hasVisitedFinHome to true");
    
    if (choice === "template") {
      console.log("Setting template data with", memoizedTemplateForTwo.length, "items");
      // Set flag to indicate we're applying template data
      setIsSettingTemplate(true);
      // Use startTransition to prevent the UI from freezing during expensive calculations
      startTransition(() => {
        setBudgetData(memoizedTemplateForTwo);
      });
    } else {
      console.log("Setting empty budget data");
      setBudgetData([]);
    }
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

"use client";

import "./globals.css";
import React, { useEffect, useState, createContext } from "react";
import { WelcomeModal } from "./components/WelcomeModal/WelcomeModal";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { BudgetItem } from "./shared/types";
import { Cog, MoonIcon, SunIcon } from "lucide-react";

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
}

const rootContext = createContext<RootContextType | null>(null);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const templateForTwo: BudgetItem[] = [
    {
      id: 1,
      itemName: "Person 1 Salary",
      category: "Salary",
      type: "income",
      planned: 28000,
      paymentMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      corrections: [],
    },
    {
      id: 2,
      itemName: "Person 2 Salary",
      category: "Salary",
      type: "income",
      planned: 25000,
      paymentMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      corrections: [],
    },
    {
      id: 3,
      itemName: "Rent/Mortgage",
      category: "Housing",
      type: "expense",
      planned: 12000,
      paymentMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      corrections: [],
    },
    {
      id: 4,
      itemName: "Car Loan",
      category: "Loan",
      type: "expense",
      planned: 3500,
      totalAmount: 210000,
      amountPaidOff: 50000,
      paymentMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      corrections: [],
    },
    {
      id: 5,
      itemName: "Groceries",
      category: "Groceries",
      type: "expense",
      planned: 4500,
      paymentMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      corrections: [],
    },
    {
      id: 6,
      itemName: "Utilities (Water, Electric)",
      category: "Housing",
      type: "expense",
      planned: 1200,
      paymentMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      corrections: [],
    },
    {
      id: 7,
      itemName: "Car Insurance",
      category: "Transportation",
      type: "expense",
      planned: 3000,
      paymentMonths: [6, 12],
      corrections: [],
    },
    {
      id: 8,
      itemName: "Gas/Fuel",
      category: "Transportation",
      type: "expense",
      planned: 1000,
      paymentMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      corrections: [],
    },
    {
      id: 9,
      itemName: "Netflix",
      category: "Entertainment",
      type: "expense",
      planned: 129,
      paymentMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      corrections: [],
    },
    {
      id: 10,
      itemName: "Spotify Duo",
      category: "Entertainment",
      type: "expense",
      planned: 149,
      paymentMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      corrections: [],
    },
    {
      id: 11,
      itemName: "Mobile Subscription (P1)",
      category: "Subscriptions",
      type: "expense",
      planned: 150,
      paymentMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      corrections: [],
    },
    {
      id: 12,
      itemName: "Mobile Subscription (P2)",
      category: "Subscriptions",
      type: "expense",
      planned: 150,
      paymentMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      corrections: [],
    },
    {
      id: 13,
      itemName: "Savings",
      category: "Savings",
      type: "expense",
      planned: 5000,
      paymentMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      corrections: [],
    },
  ];
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [view, setView] = useState("dashboard");
  const [budgetData, setBudgetData] = useState<BudgetItem[]>([]);
  const [monthsPassed, setMonthsPassed] = useState(new Date().getMonth() + 1);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedFinHome");
    const savedData = localStorage.getItem("finHomeData");

    if (!savedData && !hasVisited) {
      setShowWelcome(true);
    }
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem("finHomeData");
    if (savedData) {
      setBudgetData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("finHomeData", JSON.stringify(budgetData));
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
    if (choice === "template") {
      setBudgetData(templateForTwo);
    } else {
      setBudgetData([]);
    }
    setShowWelcome(false);
    localStorage.setItem("hasVisitedHorizonFinance", "true");
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
  };

  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <rootContext.Provider value={contextValue}>
          <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-200 dark-mode-transition">
            {showWelcome && (
              <WelcomeModal onSelectTemplateAction={handleTemplateChoice} />
            )}
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
              <div className="text-center py-4 lg:px-4">
                <div
                  className="p-2 bg-orange-800 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex"
                  role="alert"
                >
                  <span className="flex rounded-full bg-orange-500 uppercase px-2 py-1 text-xs font-bold mr-3">
                    Notice
                  </span>
                  <span className="font-semibold mr-2 text-left flex-auto">
                    This is a brand new app - very much in alpha state. Bugs are
                    being fixed continuously.
                  </span>
                  <svg
                    className="fill-current opacity-75 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  ></svg>
                </div>
              </div>
              <br />
              <nav className="bg-white dark:bg-gray-800 shadow rounded-lg mb-8 dark-mode-transition">
                <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                  <div className="relative flex items-center justify-between h-16">
                    <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                      <div className="flex-shrink-0 flex items-center text-gray-800 dark:text-white font-bold text-xl">
                        FinHome
                      </div>
                      <div className="hidden sm:block sm:ml-6">
                        <div className="flex space-x-4">
                          <Link
                            href="/"
                            className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === "/" ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                          >
                            Dashboard
                          </Link>
                          <Link
                            href="/budget"
                            className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === "/budget" ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`}
                          >
                            Budget
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Link
                        href="/settings"
                        className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                      >
                        <Cog className="h-6 w-6" />
                      </Link>
                      <Link
                        href="?darkmode"
                        className="ml-2 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                      >
                        {isDarkMode ? (
                          <SunIcon className="h-6 w-6" />
                        ) : (
                          <MoonIcon className="h-6 w-6" />
                        )}
                      </Link>
                    </div>
                  </div>
                </div>
              </nav>

              {children}

              <footer className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
                <p>FinHome by Oliver Karstoft</p>
              </footer>
            </div>
          </div>
        </rootContext.Provider>
      </body>
    </html>
  );
}

export { rootContext };

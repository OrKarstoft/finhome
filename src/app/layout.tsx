"use client";

import "./globals.css";
import { useEffect, useState, createContext } from "react";
import { WelcomeModal } from "./components/WelcomeModal/WelcomeModal";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { BudgetItem } from "./shared/types";
import { Moon, Settings, Sun } from "./shared/icons";

export type RootContextType = {
  budgetData: BudgetItem[];
  setBudgetData: React.Dispatch<React.SetStateAction<BudgetItem[]>>;
  monthsPassed: number;
  setMonthsPassed: React.Dispatch<React.SetStateAction<number>>;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const rootContext = createContext<RootContextType | undefined>(undefined);

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
    localStorage.setItem("finHomeData", JSON.stringify(budgetData));
  }, [budgetData]);

  const handleTemplateChoice = (choice: "blank" | "template") => {
    if (choice === "template") {
      setBudgetData(templateForTwo);
    } else {
      setBudgetData([]);
    }
    setShowWelcome(false);
    localStorage.setItem("hasVisitedFinHome", "true");
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <rootContext.Provider
          value={{
            budgetData,
            setBudgetData,
            monthsPassed,
            setMonthsPassed,
            isDarkMode,
            setIsDarkMode,
          }}
        >
          <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-200 dark-mode-transition">
            {showWelcome && (
              <WelcomeModal onSelectTemplateAction={handleTemplateChoice} />
            )}
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
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
                        <Settings className="h-6 w-6" />
                      </Link>
                      <Link
                        href="?darkmode"
                        className="ml-2 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                      >
                        {isDarkMode ? (
                          <Sun className="h-6 w-6" />
                        ) : (
                          <Moon className="h-6 w-6" />
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

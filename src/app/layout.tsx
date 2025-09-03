"use client";

import "./globals.css";
import React, { useContext, useCallback } from "react";
import { WelcomeModal } from "./components/WelcomeModal/WelcomeModal";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cog } from "lucide-react";
import { RootProvider, RootContext } from "./RootProvider";
import { templateForTwo } from "./shared/consts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RootProvider>
          <InnerLayout>{children}</InnerLayout>
        </RootProvider>
      </body>
    </html>
  );
}

function InnerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const context = useContext(RootContext);
  if (!context)
    throw new Error(
      "Context not found. Ensure Dashboard is wrapped in rootContext.Provider.",
    );
  const { showWelcome, setShowWelcome, setBudgetData } = context;
  const pathname = usePathname();

  const handleTemplateAction = useCallback((choice: "blank" | "template") => {
    setShowWelcome(false);
    localStorage.setItem("hasVisitedFinHome", "true");

    if (choice === "template") {
      setBudgetData(templateForTwo);
    } else {
      setBudgetData([]);
    }
  }, []);
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans text-gray-800 dark:text-gray-200 dark-mode-transition">
      {showWelcome && <WelcomeModal action={handleTemplateAction} />}
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
              This is a brand new app - very much in alpha state. Bugs are being
              fixed continuously.
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
          <div className="max-w-8xl px-2 sm:px-6 lg:px-8">
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
                {/* <button */}
                {/*   className="ml-2 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" */}
                {/*   onClick={() => setIsDarkMode(!isDarkMode)} */}
                {/* > */}
                {/*   {isDarkMode ? ( */}
                {/*     <SunIcon className="h-6 w-6" /> */}
                {/*   ) : ( */}
                {/*     <MoonIcon className="h-6 w-6" /> */}
                {/*   )} */}
                {/* </button> */}
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
  );
}

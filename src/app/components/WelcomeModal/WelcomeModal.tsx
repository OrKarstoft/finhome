"use client";

import React from "react";
import { PiggyBank, Target, Edit, Settings } from "lucide-react";
import Modal from "../Modal/Modal";
import { RootContext } from "../../RootProvider";

export const WelcomeModal: React.FC = () => {
  // initialise context
  const context = React.useContext(RootContext);
  if (!context)
    throw new Error(
      "Context not found. Ensure WelcomeModal is wrapped in rootContext.Provider.",
    );
  const { handleTemplateChoice } = context;

  return (
    <Modal onClose={() => handleTemplateChoice("blank")}>
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500">
          <PiggyBank className="h-8 w-8 text-white" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
          Welcome to FinHome!
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Your personal tool for tracking your annual budget against your
          real-life spending.
        </p>
      </div>
      <div className="mt-6 space-y-4 text-left">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <Target className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white">
              The Projected Budget
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track your planned budget against actual expenses. Make
              corrections throughout the year to see how your financial horizon
              changes.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <Edit className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white">
              Full Control
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add, edit, and delete any income or expense. Manage your own
              categories in the settings.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <Settings className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white">
              Private & Secure
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your data is yours. Nothing is saved on a server. Use the settings
              page to export your data as a text string to save or transfer.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => handleTemplateChoice("blank")}
          className="w-full py-3 px-4 text-sm font-semibold rounded-lg text-indigo-600 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900/70 transition-colors"
        >
          Start with a Blank Slate
        </button>
        <button
          onClick={() => handleTemplateChoice("template")}
          className="w-full py-3 px-4 text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          Use a Template for Two
        </button>
      </div>
    </Modal>
  );
};

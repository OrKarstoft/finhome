"use client";

import React from "react";
import Modal from "../../../components/Modal/Modal";

export function ConfirmationModal({
  onConfirmAction,
  onCancelAction,
  message,
}: {
  onConfirmAction: () => void;
  onCancelAction: () => void;
  message: string;
}) {
  return (
    <Modal onClose={onCancelAction}>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
        Confirm Deletion
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mt-2">{message}</p>
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onCancelAction}
          className="py-2 px-4 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={onConfirmAction}
          className="py-2 px-4 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}

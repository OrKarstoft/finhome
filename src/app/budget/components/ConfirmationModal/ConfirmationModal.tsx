"use client";

import React from "react";
import Modal from "../../../components/Modal/Modal";

export function ConfirmationModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal onClose={onCancel}>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
        Confirm Deletion
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mt-2">
        Are you sure you want to delete this item? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onCancel}
          className="py-2 px-4 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="py-2 px-4 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}

"use client";

import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}
export default function Modal({ children, onClose }: ModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-full overflow-y-auto dark-mode-transition"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

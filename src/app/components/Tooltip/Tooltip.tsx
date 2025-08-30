import React, { useState } from "react";

export const Tooltip: React.FC<{
  content: string;
  children: React.ReactElement;
}> = ({ content, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 left-1/2 -translate-x-1/2">
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
};

import React from "react";

export default function LoadingSpinner({ fullPage = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 gap-3">
      <div className="relative w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-slate-500 animate-pulse">
        Finding your next home...
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

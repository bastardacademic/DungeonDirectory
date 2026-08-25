import React from "react";

export default function Card({ children }) {
  return (
    <div className="rounded-2xl bg-white dark:bg-surface shadow p-6">
      {children}
    </div>
  );
}

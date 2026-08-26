import React from "react";

export default function Button({ children, variant = "primary", ...props }) {
  const base = "px-4 py-2 rounded-xl font-medium focus:outline-none";
  const styles = {
    primary: "bg-primary-500 hover:bg-primary-700 text-white",
    ghost  : "bg-transparent text-primary-500 hover:bg-primary-50"
  };
  return (
    <button className={`${base} ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
}

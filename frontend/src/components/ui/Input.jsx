import React from "react";

export default function Input(props) {
  return (
    <input
      className="w-full border rounded-xl px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
      {...props}
    />
  );
}

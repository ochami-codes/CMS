// src/components/PasswordInput.jsx
import { useState, useEffect } from "react";

// Simple password strength evaluator
function getPasswordStrength(password) {
  if (!password) return { label: "", color: "" };

  let score = 0;
  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: "Weak", color: "bg-red-500" };
  if (score === 2 || score === 3) return { label: "Medium", color: "bg-yellow-400" };
  if (score >= 4) return { label: "Strong", color: "bg-green-500" };
}

export default function PasswordInput({ label, value, onChange, showStrength = false, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState({ label: "", color: "" });

  useEffect(() => {
    if (showStrength) {
      setStrength(getPasswordStrength(value));
    }
  }, [value, showStrength]);

  return (
    <div className="relative w-full">
      {label && <label className="block mb-1">{label}</label>}

      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="w-full border px-3 py-2 rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? (
          // Eye open icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        ) : (
          // Eye closed icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.959 9.959 0 012.326-3.877M6.75 6.75l10.5 10.5M3 3l18 18"
            />
          </svg>
        )}
      </button>

      {showStrength && strength.label && (
        <div className="mt-1 h-2 w-full bg-gray-200 rounded">
          <div
            className={`h-2 rounded ${strength.color}`}
            style={{ width: strength.label === "Weak" ? "33%" : strength.label === "Medium" ? "66%" : "100%" }}
          />
          <p className="text-sm mt-1">{strength.label}</p>
        </div>
      )}
    </div>
  );
}

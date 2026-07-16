import { useState, useEffect } from "react";

/**
 * Debounce component
 * 
 * Props:
 * - value: the input value to debounce
 * - delay: debounce delay in ms (default: 500)
 * - onDebounce: callback fired after delay with the debounced value
 */
export default function Debounce({ value, delay = 500, onDebounce }) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  useEffect(() => {
    if (onDebounce) {
      onDebounce(debouncedValue);
    }
  }, [debouncedValue, onDebounce]);

  return null; // This component doesn’t render anything
}

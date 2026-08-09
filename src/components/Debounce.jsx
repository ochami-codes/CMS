import { useEffect } from "react";

/**
 * Debounce component
 *
 * Props:
 * - value: value to debounce
 * - delay: debounce delay in ms
 * - onDebounce: callback fired after delay
 */
export default function Debounce({
  value,
  delay = 500,
  onDebounce,
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDebounce?.(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay, onDebounce]);

  return null;
}


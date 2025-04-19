import { useState, useEffect } from "react";

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up the timer
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer on each value change
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Example usage:
// const [inputValue, setInputValue] = useState('');
// const debouncedValue = useDebounce(inputValue, 500);
//
// useEffect(() => {
//   // This effect will only run when debouncedValue changes
//   performExpensiveOperation(debouncedValue);
// }, [debouncedValue]);

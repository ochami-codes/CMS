// src/utils/validators.js

// Check if a field is not empty
export const isRequired = (value) => {
  return value !== undefined && value !== null && value.toString().trim() !== "";
};

// Simple email validation
export const isEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Password strength validation
// Must be at least 6 characters, include a number and a letter
export const isStrongPassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return regex.test(password);
};

// Minimum length validator
export const minLength = (value, length) => {
  return value?.toString().length >= length;
};

// Maximum length validator
export const maxLength = (value, length) => {
  return value?.toString().length <= length;
};

// Confirm password matches
export const isMatch = (value1, value2) => {
  return value1 === value2;
};

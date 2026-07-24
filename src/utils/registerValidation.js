/* -------------------------
   Kenyan Phone Helpers
------------------------- */

export const isValidKenyanPhone = (phone) => {
  if (!phone) return false;

  const cleaned = phone.replace(/\s+/g, "");

  return /^(?:\+254|254|0)(7\d{8}|1\d{8})$/.test(cleaned);
};

export const normalizeKenyanPhone = (phone) => {
  let normalized = phone.replace(/\s+/g, "");

  if (normalized.startsWith("0")) {
    normalized = "254" + normalized.slice(1);
  }

  if (normalized.startsWith("+")) {
    normalized = normalized.slice(1);
  }

  return normalized;
};

/* -------------------------
   Registration Validation
------------------------- */

export const validateRegistration = (form) => {
  const errors = {};

  /* Required fields */
  Object.entries(form).forEach(([key, value]) => {
    if (!value?.toString().trim()) {
      errors[key] = "This field is required";
    }
  });

  /* Password validation */
  if (form.password.length < 8) {
    errors.password =
      "Password must be at least 8 characters";
  }

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword =
      "Passwords do not match";
  }

  /* Phone validation */
  if (!isValidKenyanPhone(form.phone)) {
    errors.phone =
      "Enter a valid Kenyan phone number";
  }

  return errors;
};

/* -------------------------
   Registration Payload
------------------------- */

export const createRegistrationPayload = (form) => {
  return {
    full_name: form.fullName.trim(),
    email: form.email.trim(),
    password: form.password,
    phone: normalizeKenyanPhone(form.phone),
    date_of_birth: form.dateOfBirth,
    gender: form.gender,
  };
};
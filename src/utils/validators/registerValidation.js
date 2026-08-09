/* -------------------------
   Kenyan Phone Helpers
------------------------- */

export const isValidKenyanPhone = (phone) => {
  if (!phone) return false;

  const cleaned = phone.replace(/\s+/g, "");

  return /^(?:\+254|254|0)(7\d{8}|1\d{8})$/.test(cleaned);
};

export const normalizeKenyanPhone = (phone) => {
  if (!phone) return "";

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
   Date of Birth Validation
------------------------- */

export const validateDateOfBirth = (dateOfBirth) => {
  if (!dateOfBirth) {
    return "Date of birth is required";
  }

  const dob = new Date(dateOfBirth);

  if (Number.isNaN(dob.getTime())) {
    return "Enter a valid date of birth";
  }

  const today = new Date();

  // Remove time component
  today.setHours(0, 0, 0, 0);

  // DOB cannot be in the future
  if (dob > today) {
    return "Date of birth cannot be in the future";
  }

  // Calculate age accurately
  let age = today.getFullYear() - dob.getFullYear();

  const monthDifference =
    today.getMonth() - dob.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() < dob.getDate())
  ) {
    age--;
  }

  // Reasonable maximum age: 120 years
  if (age > 120) {
    return "Enter a valid date of birth";
  }

  return null;
};

/* -------------------------
   Email Validation
------------------------- */

export const isValidEmail = (email) => {
  if (!email) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email.trim()
  );
};

/* -------------------------
   Name Validation
------------------------- */

export const validateFullName = (fullName) => {
  if (!fullName?.trim()) {
    return "Full name is required";
  }

  if (fullName.trim().length < 2) {
    return "Name must be at least 2 characters";
  }

  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(fullName.trim())) {
    return "Name contains invalid characters";
  }

  return null;
};

/* -------------------------
   Password Validation
------------------------- */

export const validatePassword = (password) => {
  if (!password) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  return null;
};

/* -------------------------
   Gender Validation
------------------------- */

export const validateGender = (gender) => {
  if (!gender?.trim()) {
    return "Please select your gender";
  }

  const validGenders = [
    "male",
    "female",
    "other",
    "prefer_not_to_say",
  ];

  if (
    !validGenders.includes(
      gender.trim().toLowerCase()
    )
  ) {
    return "Please select a valid gender";
  }

  return null;
};

/* -------------------------
   Individual Field Validation
------------------------- */

export const validateRegistrationField = (
  field,
  value,
  form = {}
) => {
  switch (field) {
    case "fullName":
      return validateFullName(value);

    case "email":
      if (!value?.trim()) {
        return "Email is required";
      }

      if (!isValidEmail(value)) {
        return "Enter a valid email address";
      }

      return null;

    case "phone":
      if (!value?.trim()) {
        return "Phone number is required";
      }

      if (!isValidKenyanPhone(value)) {
        return "Enter a valid Kenyan phone number";
      }

      return null;

    case "dateOfBirth":
      return validateDateOfBirth(value);

    case "password":
      return validatePassword(value);

    case "confirmPassword":
      if (!value) {
        return "Please confirm your password";
      }

      if (value !== form.password) {
        return "Passwords do not match";
      }

      return null;

    case "gender":
      return validateGender(value);

    default:
      return null;
  }
};

/* -------------------------
   Validate Entire Form
------------------------- */

export const validateRegistration = (form) => {
  const errors = {};

  const fields = [
    "fullName",
    "email",
    "phone",
    "dateOfBirth",
    "password",
    "confirmPassword",
    "gender",
  ];

  fields.forEach((field) => {
    const error = validateRegistrationField(
      field,
      form[field],
      form
    );

    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};

/* -------------------------
   Registration Payload
------------------------- */

export const createRegistrationPayload = (form) => {
  return {
    full_name: form.fullName.trim(),
    email: form.email.trim().toLowerCase(),
    password: form.password,
    phone: normalizeKenyanPhone(form.phone),
    date_of_birth: form.dateOfBirth,
    gender: form.gender,
  };
};
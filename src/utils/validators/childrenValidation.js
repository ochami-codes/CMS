/* =========================
   CHILD NAME
========================== */

export const validateChildName = (
  value
) => {
  if (
    value === undefined ||
    value === null ||
    value.trim() === ""
  ) {
    return "Child's name is required";
  }

  const name = value.trim();

  if (name.length < 2) {
    return "Child's name must be at least 2 characters";
  }

  if (name.length > 100) {
    return "Child's name must not exceed 100 characters";
  }

  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(name)) {
    return "Child's name contains invalid characters";
  }

  return "";
};


/* =========================
   DATE OF BIRTH
========================== */

export const validateChildDateOfBirth = (
  value
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "Date of birth is required";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Please enter a valid date of birth";
  }

  const today = new Date();

  if (date > today) {
    return "Date of birth cannot be in the future";
  }

  return "";
};


/* =========================
   GENDER
========================== */

export const validateChildGender = (
  value
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "Please select gender";
  }

  const validValues = [
    "male",
    "female",
  ];

  if (!validValues.includes(value)) {
    return "Please select a valid gender";
  }

  return "";
};


/* =========================
   DEDICATION STATUS
========================== */

export const validateDedication = (
  value
) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "Please select dedication status";
  }

  const validValues = [
    "unknown",
    "dedicated",
    "not_dedicated",
  ];

  if (!validValues.includes(value)) {
    return "Please select a valid dedication status";
  }

  return "";
};


/* =========================
   DEDICATION DATE
========================== */

export const validateDedicationDate = (
  dedication,
  dedicationDate
) => {
  if (dedication !== "dedicated") {
    return "";
  }

  if (
    dedicationDate === undefined ||
    dedicationDate === null ||
    dedicationDate === ""
  ) {
    return "Dedication date is required";
  }

  const date =
    new Date(dedicationDate);

  if (Number.isNaN(date.getTime())) {
    return "Please enter a valid dedication date";
  }

  const today = new Date();

  if (date > today) {
    return "Dedication date cannot be in the future";
  }

  return "";
};


/* =========================
   PARENT
========================== */

export const validateParent = (
  selectedParent
) => {
  if (!selectedParent) {
    return "Please select a parent";
  }

  if (!selectedParent.id) {
    return "Selected parent is invalid";
  }

  return "";
};


/* =========================
   CHILD FIELD VALIDATION
========================== */

export const validateChildField = (
  field,
  value,
  formData = {}
) => {
  switch (field) {
    case "full_name":
      return validateChildName(value);

    case "date_of_birth":
      return validateChildDateOfBirth(
        value
      );

    case "gender":
      return validateChildGender(value);

    case "dedication":
      return validateDedication(value);

    case "dedication_date":
      return validateDedicationDate(
        formData.dedication,
        value
      );

    default:
      return "";
  }
};


/* =========================
   FULL CHILD FORM
   VALIDATION
========================== */

export const validateChildForm = (
  formData,
  selectedParent
) => {
  const errors = {};

  const fields = [
    "full_name",
    "date_of_birth",
    "gender",
    "dedication",
    "dedication_date",
  ];

  fields.forEach((field) => {
    const error =
      validateChildField(
        field,
        formData[field],
        formData
      );

    if (error) {
      errors[field] = error;
    }
  });

  const parentError =
    validateParent(
      selectedParent
    );

  if (parentError) {
    errors.parent = parentError;
  }

  return errors;
};

import {
isValidKenyanPhone,
isValidEmail,
validateFullName,
validateDateOfBirth,
validateGender,
} from "./registerValidation";

/* -------------------------
Individual Member Field
Validation
------------------------- */

export const validateMemberField = (
field,
value
) => {
const trimmedValue =
typeof value === "string"
? value.trim()
: value;

switch (field) {
/* -------------------------
REQUIRED
------------------------- */
case "full_name":
  return validateFullName(
    trimmedValue
  );

case "phone":
  if (!trimmedValue) {
    return "Phone number is required";
  }

  if (
    !isValidKenyanPhone(
      trimmedValue
    )
  ) {
    return "Enter a valid Kenyan phone number";
  }

  return null;

case "date_of_birth":
  if (!trimmedValue) {
    return "Date of birth is required";
  }

  return validateDateOfBirth(
    trimmedValue
  );

case "gender":
  if (!trimmedValue) {
    return "Please select your gender";
  }

  return validateGender(
    trimmedValue
  );

case "baptized":
  if (!trimmedValue) {
    return "Please select baptism status";
  }

  return null;

case "membership_type":
  if (!trimmedValue) {
    return "Please select membership type";
  }

  return null;

/* -------------------------
   OPTIONAL
------------------------- */

case "email":
  if (!trimmedValue) {
    return null;
  }

  if (
    !isValidEmail(trimmedValue)
  ) {
    return "Enter a valid email address";
  }

  return null;

case "marital_status":
  return null;

case "baptismal_date":
  if (!trimmedValue) {
    return null;
  }

  return validateDateOfBirth(
    trimmedValue
  );

case "emergency_contact_name":
  return null;

case "emergency_contact_relationship":
  return null;

case "emergency_contact_phone":
  if (!trimmedValue) {
    return null;
  }

  if (
    !isValidKenyanPhone(
      trimmedValue
    )
  ) {
    return "Enter a valid Kenyan phone number";
  }

  return null;

default:
  return null;

}
};

/* -------------------------
Validate Entire Form
------------------------- */

export const validateMember = (
form
) => {
const errors = {};

const fields = [
"full_name",
"phone",
"date_of_birth",
"gender",
"baptized",
"membership_type",
"marital_status",
"baptismal_date",
"emergency_contact_name",
"emergency_contact_relationship",
"emergency_contact_phone",
];

fields.forEach((field) => {
const error =
validateMemberField(
field,
form[field]
);

if (error) {
  errors[field] = error;
}

});

return errors;
};

// src/utils/memberFields.js
import { DEPARTMENTS } from "./departments";

export const memberFields = {
  // ------------------------
  // Youth Members
  // ------------------------
  [DEPARTMENTS.YOUTH]: {
    table: "members",
    fields: [
      { name: "full_name", label: "Full Name", type: "text", required: true },
      { name: "phone", label: "Phone Number", type: "text", required: true },
      { name: "date_of_birth", label: "Date of Birth", type: "date", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      {
        name: "department",
        label: "Department",
        type: "select",
        options: ["Youth", "Adults", "Women", "Men"],
        required: true,
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        options: ["Male", "Female"],
        required: true,
      },
    ],
  },

  // ------------------------
  // Children
  // ------------------------
  [DEPARTMENTS.CHILDREN]: {
    table: "children",
    fields: [
      { name: "full_name", label: "Child's Name", type: "text", required: true },
      { name: "date_of_birth", label: "Date of Birth", type: "date", required: true },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        options: ["Male", "Female"],
        required: true,
      },
      { name: "parent_name", label: "Parent's Name", type: "text", required: true },
      { name: "parent_phone", label: "Parent's Phone", type: "text", required: true },
    ],
  },

  // ------------------------
  // General Adult Members
  // ------------------------
  [DEPARTMENTS.MEMBERS]: {
    table: "members",
    fields: [
      { name: "full_name", label: "Full Name", type: "text", required: true },
      { name: "phone", label: "Phone Number", type: "text", required: true },
      { name: "date_of_birth", label: "Date of Birth", type: "date", required: true },
      {
        name: "department",
        label: "Department",
        type: "select",
        options: ["Adults", "Women", "Men"],
        required: true,
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        options: ["Male", "Female"],
        required: true,
      },
    ],
  },

  // ------------------------
  // Communication Team
  // ------------------------
  [DEPARTMENTS.COMMUNICATION]: {
    table: "communication_members",
    fields: [
      { name: "full_name", label: "Full Name", type: "text", required: true },
      { name: "phone", label: "Phone Number", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
    ],
  },
};

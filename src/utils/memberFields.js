// src/utils/memberFields.js
import { DEPARTMENTS } from "./departments";

export const memberFields = {
  // ------------------------
  // Youth (stored in members table)
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
        label: "Select Department",
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
  // Children (stored in children table)
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
      { name: "department", type: "hidden", value: "children" }, // automatically set
    ],
  },

  // ------------------------
  // General Members (other adult members stored in members table)
  // ------------------------
  [DEPARTMENTS.MEMBERS]: {
    table: "members",
    fields: [
      { name: "full_name", label: "Full Name", type: "text", required: true },
      { name: "phone", label: "Phone Number", type: "text", required: true },
      { name: "date_of_birth", label: "Date of Birth", type: "date", required: true },
      {
        name: "department",
        label: "Select Department",
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
  // Communication Members (optional separate table)
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

// src/utils/memberFields.js
export const memberFields = {
  "youth": {
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
        options: [], // dynamically filled from DepartmentsAPI in the component
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

  "children": {
    table: "children",
    fields: [
      { name: "full_name", label: "Child's Name", type: "text", required: true },
      { name: "date_of_birth", label: "Date of Birth", type: "date", required: true },
      { name: "gender", label: "Gender", type: "select", options: ["Male", "Female"], required: true },
      { name: "parent_name", label: "Parent's Name", type: "text", required: true },
      { name: "parent_phone", label: "Parent's Phone", type: "text", required: true },
    ],
  },

  "members": {
    table: "members",
    fields: [
      { name: "full_name", label: "Full Name", type: "text", required: true },
      { name: "phone", label: "Phone Number", type: "text", required: true },
      { name: "date_of_birth", label: "Date of Birth", type: "date", required: true },
      {
        name: "department",
        label: "Department",
        type: "select",
        options: [], // dynamically filled from DepartmentsAPI
        required: true,
      },
      { name: "gender", label: "Gender", type: "select", options: ["Male", "Female"], required: true },
    ],
  },

  "communication": {
    table: "communication_members",
    fields: [
      { name: "full_name", label: "Full Name", type: "text", required: true },
      { name: "phone", label: "Phone Number", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
    ],
  },
};

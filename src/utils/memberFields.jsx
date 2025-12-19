// src/utils/memberFields.js

export const memberFields = {
  youth: [
    { name: "full_name", label: "Full Name", type: "text", required: true },
    { name: "phone", label: "Phone Number", type: "text", required: true },
    { name: "dob", label: "Date of Birth", type: "date", required: true },
    { name: "email", label: "Email", type: "email", required: true },
  ],
  children: [
    { name: "parent_name", label: "Parent's Name", type: "text", required: true },
    { name: "parent_phone", label: "Parent's Phone", type: "text", required: true },
    { name: "child_name", label: "Child's Name", type: "text", required: true },
    { name: "child_dob", label: "Child's Date of Birth", type: "date", required: true },
  ],
  members: [
    { name: "full_name", label: "Full Name", type: "text", required: true },
    { name: "phone", label: "Phone Number", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "dob", label: "Date of Birth", type: "date", required: true },
  ],
};
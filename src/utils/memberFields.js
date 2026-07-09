export const memberFields = {
  youth: {
    table: "members",
    fixedDepartment: "youth",
    fields: [
      {
        name: "full_name",
        label: "Full Name",
        type: "text",
        required: true,
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "text",
        required: true,
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        required: true,
        options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ],
      },
    ],
  },

  children: {
    table: "children",
    fields: [
      {
        name: "full_name",
        label: "Child's Name",
        type: "text",
        required: true,
      },
      {
        name: "date_of_birth",
        label: "Date of Birth",
        type: "date",
        required: true,
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        required: true,
        options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ],
      },
      {
        name: "parent_name",
        label: "Parent's Name",
        type: "text",
        required: true,
      },
      {
        name: "parent_phone",
        label: "Parent's Phone",
        type: "text",
        required: true,
      },
    ],
  },

  members: {
    table: "members",
    fixedDepartment: "members",
    fields: [
      {
        name: "full_name",
        label: "Full Name",
        type: "text",
        required: true,
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "text",
        required: true,
      },
      {
        name: "date_of_birth",
        label: "Date of Birth",
        type: "date",
        required: true,
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        required: true,
        options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
        ],
      },
      {
        name: "baptized",
        label: "Baptism Status",
        type: "select",
        required: true,
        options: [
          { label: "Unknown", value: "unknown" },
          { label: "Not Baptized", value: "not_baptized" },
          { label: "Baptized", value: "baptized" },
        ],
      },
      {
        name: "membership_type",
        label: "Membership Type",
        type: "select",
        required: true,
        options: [
          { label: "Birth", value: "birth" },
          { label: "Baptism", value: "baptism" },
          {
            label: "Profession of Faith",
            value: "profession_of_faith",
          },
          {
            label: "Transfer In",
            value: "transfer_in",
          },
          { label: "Other", value: "other" },
        ],
      },
      {
        name: "marital_status",
        label: "Marital Status",
        type: "select",
        options: [
          { label: "Single", value: "single" },
          { label: "Married", value: "married" },
          { label: "Divorced", value: "divorced" },
          { label: "Widowed", value: "widowed" },
        ],
      },
      {
        name: "baptismal_date",
        label: "Baptismal Date",
        type: "date",
      },
      {
        name: "emergency_contact_name",
        label: "Emergency Contact Name",
        type: "text",
      },
      {
        name: "emergency_contact_relationship",
        label: "Relationship",
        type: "text",
      },
      {
        name: "emergency_contact_phone",
        label: "Emergency Contact Phone",
        type: "text",
      },
    ],
  },

  communication: {
    table: "communication_members",
    fixedDepartment: "communication",
    fields: [
      {
        name: "full_name",
        label: "Full Name",
        type: "text",
        required: true,
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "text",
        required: true,
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
      },
    ],
  },
};
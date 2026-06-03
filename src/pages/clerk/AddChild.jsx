import { useEffect, useState } from "react";

import { ClerkAPI } from "../../utils/api";

import { useToast } from "../../components/ToastProvider";

import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import Card from "../../components/Card";

export default function AddChild({
  onChildAdded,
}) {
  const { showToast } = useToast();

  const initialState = {
    full_name: "",
    date_of_birth: "",
    gender: "",

    dedication: "unknown",
    dedication_date: "",

    notes: "",
  };

  const [formData, setFormData] =
    useState(initialState);

  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState([]);

  const [selectedParent, setSelectedParent] =
    useState(null);

  const [searching, setSearching] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  /* =====================
     SEARCH PARENTS
  ===================== */

  useEffect(() => {
  const searchTerm =
    query.trim();

  if (
    searchTerm.length < 2
  ) {
    setResults([]);
    return;
  }

  const timer = setTimeout(
    async () => {
      try {
        setSearching(true);

        const data =
          await ClerkAPI.searchParents(
            searchTerm
          );

        setResults(data ?? []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    },
    300
  );

  return () =>
    clearTimeout(timer);
}, [query]);

  /* =====================
     INPUT CHANGE
  ===================== */

  const updateField = (
    name,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================
     SUBMIT
  ===================== */

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (!selectedParent) {
        showToast(
          "Select a parent first",
          "error"
        );
        return;
      }

      try {
        setLoading(true);

        const payload = {
          parent_member_id:
            selectedParent.id,

          child: {
            full_name:
              formData.full_name,

            date_of_birth:
              formData.date_of_birth,

            gender:
              formData.gender,

            dedication:
              formData.dedication,

            dedication_date:
              formData.dedication_date,

            notes:
              formData.notes,
          },
        };

        const res =
          await ClerkAPI.addChild(
            payload
          );

        showToast(
          "Child registered successfully",
          "success"
        );

        onChildAdded?.(
          res?.child
        );

        setFormData(
          initialState
        );

        setQuery("");

        setResults([]);

        setSelectedParent(
          null
        );
      } catch (err) {
        showToast(
          err.message ||
            "Failed to register child",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <Card>
      <h2>
        Register Child
      </h2>

      <p>
        Select an existing parent
        before registering a child.
      </p>

      <form
        onSubmit={
          handleSubmit
        }
      >
        {/* =====================
            PARENT
        ===================== */}

        {/* =====================
    PARENT SEARCH
===================== */}

<h3>Parent / Guardian</h3>

<SearchBar
  value={query}
  onChange={(e) => {
    setQuery(e.target.value);
    setSelectedParent(null);
  }}
  placeholder="Search by name or phone..."
  onClear={() => {
    setQuery("");
    setResults([]);
    setSelectedParent(null);
  }}
/>

{searching && (
  <p>Searching...</p>
)}

{query.trim().length >= 2 &&
  !searching &&
  results.length === 0 &&
  !selectedParent && (
    <p>
      No matching parent found.
      Register the parent as a member first.
    </p>
  )}

{results.length > 0 &&
  !selectedParent && (
    <div>
      {results.map((member) => (
        <button
          type="button"
          key={member.id}
          onClick={() => {
            setSelectedParent(member);
            setQuery(member.full_name);
            setResults([]);
          }}
        >
          <div>
            <strong>
              {member.full_name}
            </strong>
          </div>

          {member.phone && (
            <small>
              Phone: {member.phone}
            </small>
          )}
        </button>
      ))}
    </div>
  )}

{selectedParent && (
  <Card>
    <h4>
      Selected Parent
    </h4>

    <p>
      <strong>
        {
          selectedParent.full_name
        }
      </strong>
    </p>

    {selectedParent.phone && (
      <p>
        Phone:{" "}
        {
          selectedParent.phone
        }
      </p>
    )}
    <Button
      type="button"
      onClick={() => {
        setSelectedParent(
          null
        );
        setQuery("");
      }}
    >
      Change Parent
    </Button>
  </Card>
)}

        {/* =====================
            CHILD DETAILS
        ===================== */}

        <h3>
          Child Information
        </h3>

        <input
          type="text"
          placeholder="Full Name"
          value={
            formData.full_name
          }
          onChange={(e) =>
            updateField(
              "full_name",
              e.target.value
            )
          }
          required
        />

        <input
          type="date"
          value={
            formData.date_of_birth
          }
          onChange={(e) =>
            updateField(
              "date_of_birth",
              e.target.value
            )
          }
          required
        />

        <select
          value={
            formData.gender
          }
          onChange={(e) =>
            updateField(
              "gender",
              e.target.value
            )
          }
          required
        >
          <option value="">
            Select Gender
          </option>

          <option value="male">
            Male
          </option>

          <option value="female">
            Female
          </option>
        </select>

        {/* =====================
            DEDICATION
        ===================== */}

        
<select
  value={formData.dedication}
  onChange={(e) =>
    updateField("dedication", e.target.value)
  }
>
  <option>Dedication Status</option>
  <option value="unknown">
    Unknown
  </option>
  <option value="dedicated">
    Dedicated
  </option>
  <option value="not_dedicated">
    Not Dedicated
  </option>
</select>

{formData.dedication === "dedicated" && (
  <input
    type="date"
    value={formData.dedication_date}
    onChange={(e) =>
      updateField(
        "dedication_date",
        e.target.value
      )
    }
  />
)}

        {/* =====================
            NOTES
        ===================== */}

        <h3>
          Notes
        </h3>

        <textarea
          rows={4}
          placeholder="Additional notes"
          value={
            formData.notes
          }
          onChange={(e) =>
            updateField(
              "notes",
              e.target.value
            )
          }
        />

        {/* =====================
            SUBMIT
        ===================== */}

        <Button
          type="submit"
          disabled={
            loading
          }
        >
          {loading
            ? "Registering..."
            : "Register Child"}
        </Button>
      </form>
    </Card>
  );
}
import { useMemo, useState, useEffect } from "react";

import { memberFields } from "../../utils/memberFields";
import { MembersAPI, AdminAPI } from "../../utils/api";

import useDepartments from "../../hooks/useDepartment";

import { useToast } from "../../components/ToastProvider";

import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import Card from "../../components/Card";

import styles from "../../styles/components/AddMember.module.css";

export default function AddMember({
  department,
  onMemberAdded,
}) {
  const { showToast } = useToast();

  const config = memberFields[department];
  const fields = config?.fields ?? [];

  const initialState = useMemo(
    () =>
      Object.fromEntries(
        fields.map((field) => [field.name, ""])
      ),
    [fields]
  );

  const {
    departments,
    error: departmentsError,
  } = useDepartments();

  const [memberType, setMemberType] =
    useState("system");

  const [formData, setFormData] =
    useState(initialState);

  const [loading, setLoading] =
    useState(false);

  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState([]);

  const [searching, setSearching] =
    useState(false);

  const [selectedProfile, setSelectedProfile] =
    useState(null);

  if (departmentsError) {
    showToast(
      "Failed loading departments",
      "error"
    );
  }

  /* SEARCH USERS */
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);

        const data =
          await AdminAPI.searchProfiles(
            query
          );

        setResults(data?.profiles ?? []);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const updateField = (name, value) =>
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let payload;

      if (memberType === "system") {
        if (!selectedProfile) {
          throw new Error("Select a user");
        }

        payload = {
          department,
          profile_id: selectedProfile.id,
          is_system_user: true,
        };
      } else {
        payload = {
          ...formData,
          department,
          is_system_user: false,
        };
      }

      const res =
        await MembersAPI.add(payload);

      showToast(
        "Member added",
        "success"
      );

      onMemberAdded?.(res?.member);

      setFormData(initialState);
      setQuery("");
      setSelectedProfile(null);
    } catch (err) {
      showToast(
        err.message ||
          "Failed adding member",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          Add Member
        </h2>

        <p className={styles.subtitle}>
          Add registered users or
          manual members
        </p>
      </div>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <select
          className={styles.select}
          value={memberType}
          onChange={(e) =>
            setMemberType(e.target.value)
          }
        >
          <option value="system">
            System User
          </option>

          <option value="manual">
            Manual Member
          </option>
        </select>

        {memberType === "system" && (
          <div className={styles.searchBox}>
            <SearchBar
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder="Search member..."
              onClear={() => {
                setQuery("");
                setSelectedProfile(null);
              }}
            />

            {searching && (
              <p>Searching...</p>
            )}

            {results.length > 0 &&
              !selectedProfile && (
                <div
                  className={
                    styles.results
                  }
                >
                  {results.map(
                    (profile) => (
                      <button
                        key={profile.id}
                        type="button"
                        className={
                          styles.resultBtn
                        }
                        onClick={() => {
                          setSelectedProfile(
                            profile
                          );

                          setQuery(
                            profile.full_name
                          );

                          setResults([]);
                        }}
                      >
                        {
                          profile.full_name
                        }
                      </button>
                    )
                  )}
                </div>
              )}

            {selectedProfile && (
              <div
                className={
                  styles.selected
                }
              >
                Selected:{" "}
                {
                  selectedProfile.full_name
                }
              </div>
            )}
          </div>
        )}

        {memberType === "manual" &&
          fields.map((field) => (
            <div
              key={field.name}
              className={
                styles.fieldGroup
              }
            >
              <label
                className={
                  styles.label
                }
              >
                {field.label}
              </label>

              {field.type ===
              "select" ? (
                <select
                  className={
                    styles.selectField
                  }
                  value={
                    formData[
                      field.name
                    ]
                  }
                  onChange={(e) =>
                    updateField(
                      field.name,
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select
                  </option>

                  {field.name ===
                  "department"
                    ? departments.map(
                        (department) => (
                          <option
                            key={
                              department.id
                            }
                            value={
                              department.id
                            }
                          >
                            {
                              department.name
                            }
                          </option>
                        )
                      )
                    : field.options?.map(
                        (option) => (
                          <option
                            key={
                              option
                            }
                            value={
                              option
                            }
                          >
                            {option}
                          </option>
                        )
                      )}
                </select>
              ) : (
                <input
                  className={
                    styles.input
                  }
                  type={
                    field.type ||
                    "text"
                  }
                  value={
                    formData[
                      field.name
                    ]
                  }
                  onChange={(e) =>
                    updateField(
                      field.name,
                      e.target.value
                    )
                  }
                />
              )}
            </div>
          ))}

        <div
          className={
            styles.submitBtn
          }
        >
          <Button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Add Member"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
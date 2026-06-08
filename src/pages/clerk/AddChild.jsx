import { useEffect, useState } from "react";

import { ClerkAPI } from "../../utils/api";

import { useToast } from "../../components/ToastProvider";

import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import Card from "../../components/Card";

import styles from "../../styles/components/AddChild.module.css";

export default function AddChild({ onChildAdded }) {
  const { showToast } = useToast();

  const initialState = {
    full_name: "",
    date_of_birth: "",
    gender: "",
    dedication: "unknown",
    dedication_date: "",
    notes: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  /* SEARCH PARENTS */
  useEffect(() => {
    const searchTerm = query.trim();

    if (searchTerm.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearching(true);

        const data = await ClerkAPI.searchParents(searchTerm);
        setResults(data ?? []);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const updateField = (name, value) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedParent) {
      showToast("Select a parent first", "error");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        parent_member_id: selectedParent.id,
        child: { ...formData },
      };

      const res = await ClerkAPI.addChild(payload);

      showToast("Child registered successfully", "success");

      onChildAdded?.(res?.child);

      setFormData(initialState);
      setQuery("");
      setResults([]);
      setSelectedParent(null);
    } catch (err) {
      showToast(err.message || "Failed to register child", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={styles.card}>
      <h2 className={styles.title}>Register Child</h2>
      <p className={styles.subtitle}>
        Select a parent before registering a child
      </p>

      <form onSubmit={handleSubmit}>
        {/* PARENT SEARCH */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Parent / Guardian</h3>

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

          {searching && <p className={styles.notice}>Searching...</p>}

          {query.trim().length >= 2 &&
            !searching &&
            results.length === 0 &&
            !selectedParent && (
              <p className={styles.notice}>
                No matching parent found.
              </p>
            )}

          {results.length > 0 && !selectedParent && (
            <div className={styles.results}>
              {results.map((member) => (
                <button
                  type="button"
                  key={member.id}
                  className={styles.resultBtn}
                  onClick={() => {
                    setSelectedParent(member);
                    setQuery(member.full_name);
                    setResults([]);
                  }}
                >
                  <strong>{member.full_name}</strong>
                  {member.phone && <div>{member.phone}</div>}
                </button>
              ))}
            </div>
          )}

          {selectedParent && (
            <div className={styles.selectedCard}>
              <div className={styles.selectedTitle}>
                Selected Parent
              </div>
              <div>{selectedParent.full_name}</div>
              {selectedParent.phone && <div>{selectedParent.phone}</div>}

              <Button
                type="button"
                onClick={() => {
                  setSelectedParent(null);
                  setQuery("");
                }}
              >
                Change Parent
              </Button>
            </div>
          )}
        </div>

        {/* CHILD INFO */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Child Information</h3>

          <div className={styles.field}>
            <label className={styles.label}>Full Name</label>
            <input
              className={styles.input}
              value={formData.full_name}
              onChange={(e) =>
                updateField("full_name", e.target.value)
              }
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Date of Birth</label>
            <input
              className={styles.input}
              type="date"
              value={formData.date_of_birth}
              onChange={(e) =>
                updateField("date_of_birth", e.target.value)
              }
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Gender</label>
            <select
              className={styles.select}
              value={formData.gender}
              onChange={(e) =>
                updateField("gender", e.target.value)
              }
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        {/* DEDICATION */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Dedication</h3>

          <div className={styles.dedicationBox}>
            <select
              className={styles.select}
              value={formData.dedication}
              onChange={(e) =>
                updateField("dedication", e.target.value)
              }
            >
              <option value="unknown">Unknown</option>
              <option value="dedicated">Dedicated</option>
              <option value="not_dedicated">Not Dedicated</option>
            </select>

            {formData.dedication === "dedicated" && (
              <input
                className={styles.input}
                type="date"
                value={formData.dedication_date}
                onChange={(e) =>
                  updateField("dedication_date", e.target.value)
                }
              />
            )}
          </div>
        </div>

        {/* NOTES */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Notes</h3>

          <textarea
            className={styles.textarea}
            rows={4}
            value={formData.notes}
            onChange={(e) =>
              updateField("notes", e.target.value)
            }
          />
        </div>

        {/* SUBMIT */}
        <div className={styles.actions}>
          <Button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register Child"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
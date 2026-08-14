import { useState, useCallback } from "react";

import { ClerkAPI } from "../../utils/api";
import { validateChildForm } from "../../utils/validators/childrenValidation";
import SearchBar from "../../components/SearchBar";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Debounce from "../../components/Debounce";
import { useClerkActions } from "../../hooks/clerk/useClerkActions";
import TextDisplay from "../../components/TextDisplay";
import styles from "../../styles/components/AddChild.module.css";

const INITIAL_FORM = {
  full_name: "",
  date_of_birth: "",
  gender: "",
  dedication: "unknown",
  dedication_date: "",
  notes: "",
};

export default function AddChild({ onChildAdded }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);
  const [searching, setSearching] = useState(false);
  const [errors, setErrors] = useState({});

  const {
    addChild,
    loading: { addChild: addChildLoading },
  } = useClerkActions();

  /* =========================
     SEARCH PARENTS
  ========================== */
  const searchParents = useCallback(async (searchTerm) => {
    const term = searchTerm.trim();
    if (term.length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    try {
      setSearching(true);
      const data = await ClerkAPI.searchParents(term);
      setResults(data ?? []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  /* =========================
     FIELD UPDATE
  ========================== */
  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /* =========================
     SUBMIT
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedParent) {
      return <TextDisplay as="p" size="sm" color="danger">Please select parent first</TextDisplay>
    }

    const validationErrors = validateChildForm(formData, selectedParent);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

      const payload = {
        parent_member_id: selectedParent.id,
        child: formData,
      };

      const res = await addChild(payload);
      onChildAdded?.(res?.child);

      // reset
      setFormData(INITIAL_FORM);
      setQuery("");
      setResults([]);
      setSelectedParent(null);
      setErrors({});
    } 
  return (
    <Card className={styles.card}>
      <h2 className={styles.title}>Register Child</h2>
      <p className={styles.subtitle}>Select a parent before registering a child</p>

      <Debounce value={query} delay={300} onDebounce={searchParents} />

      <form onSubmit={handleSubmit}>
        {/* PARENT SEARCH */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Parent / Guardian</h3>

          <SearchBar
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedParent(null);
              setResults([]);
            }}
            placeholder="Search by name or phone..."
            onClear={() => {
              setQuery("");
              setResults([]);
              setSelectedParent(null);
              setSearching(false);
            }}
          />

          {searching && <p className={styles.notice}>Searching...</p>}

          {query.trim().length >= 2 &&
            !searching &&
            results.length === 0 &&
            !selectedParent && (
              <p className={styles.notice}>No matching parent found.</p>
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
              <div className={styles.selectedTitle}>Selected Parent</div>
              <div>{selectedParent.full_name}</div>
              {selectedParent.phone && <div>{selectedParent.phone}</div>}
              <Button
                type="button"
                onClick={() => {
                  setSelectedParent(null);
                  setQuery("");
                  setResults([]);
                }}
              >
                Change Parent
              </Button>
            </div>
          )}
        </div>

        {/* CHILD INFORMATION */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Child Information</h3>

          <div className={styles.field}>
            <label className={styles.label}>Full Name</label>
            <input
              className={styles.input}
              value={formData.full_name}
              onChange={(e) => updateField("full_name", e.target.value)}
              required
            />
            {errors.full_name && (
              <TextDisplay as="span" size="sm" color="danger">
                {errors.full_name}
              </TextDisplay>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Date of Birth</label>
            <input
              className={styles.input}
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => updateField("date_of_birth", e.target.value)}
              required
            />
            {errors.date_of_birth && (
              <TextDisplay as="span" size="sm" color="danger">
                {errors.date_of_birth}
              </TextDisplay>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Gender</label>
            <select
              className={styles.select}
              value={formData.gender}
              onChange={(e) => updateField("gender", e.target.value)}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            {errors.gender && (
              <TextDisplay as="span" size="sm" color="danger">
                {errors.gender}
              </TextDisplay>
            )}
          </div>
        </div>

        {/* DEDICATION */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Dedication</h3>
          <div className={styles.dedicationBox}>
            <select
              className={styles.select}
              value={formData.dedication}
              onChange={(e) => updateField("dedication", e.target.value)}
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
          {errors.dedication_date && (
            <TextDisplay as="span" size="sm" color="danger">
              {errors.dedication_date}
            </TextDisplay>
          )}
        </div>

        {/* NOTES */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Notes</h3>
          <textarea
            className={styles.textarea}
            rows={4}
            value={formData.notes}
            onChange={(e) => updateField("notes", e.target.value)}
          />
        </div>

        {/* SUBMIT */}
        <div className={styles.actions}>
          <Button type="submit" loading={addChildLoading}>
            {addChildLoading ? "Registering..." : "Register Child"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

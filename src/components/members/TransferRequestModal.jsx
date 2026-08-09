import { useEffect, useState } from "react";
import Modal from "../Modal";
import Button from "../Button";
import SearchBar from "../SearchBar";

import useConferences from "../../hooks/conferences/useConferences";
import useSearchChurches from "../../hooks/churches/useSearchChurches";
import  {useCreateTransfer} from "../../hooks/clerk/useCreateTransfer";
import TextDisplay from "../TextDisplay";
import styles from "../../styles/components/TransferRequestModal.module.css";

const initialForm = {
  conference_id: "",
  destination_church_id: "",
  external_church_name: "",
  reason: "",
};

export default function TransferRequestModal({ isOpen, onClose }) {
  const [manualChurch, setManualChurch] = useState(false);
  const [churchQuery, setChurchQuery] = useState("");
  const [selectedChurch, setSelectedChurch] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const updateForm = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  /* -------------------------
     Hooks
  ------------------------- */
  const { conferences = [] } = useConferences();

  const {
    results: churchResults = [],
    loading: searching,
  } = useSearchChurches({
    conferenceId: formData.conference_id,
    search: churchQuery,
  });

  const { mutateAsync: createTransfer, isPending: loading } = useCreateTransfer();

  /* -------------------------
     Reset
  ------------------------- */
  useEffect(() => {
    if (!isOpen) {
      setFormData(initialForm);
      setChurchQuery("");
      setSelectedChurch(null);
      setManualChurch(false);
    }
  }, [isOpen]);

  /* -------------------------
     Church Selection
  ------------------------- */
  const selectChurch = (church) => {
    updateForm("destination_church_id", church.id);
    setSelectedChurch(church);
    setChurchQuery(church.name);
  };

  const enableManualChurch = () => {
    setManualChurch(true);
    setChurchQuery("");
    setSelectedChurch(null);
    updateForm("destination_church_id", "");
  };

  const enableChurchSearch = () => {
    setManualChurch(false);
    updateForm("external_church_name", "");
  };

  /* -------------------------
     Submit
  ------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createTransfer(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal open={isOpen} title="Membership Transfer Request" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.section}>
           <TextDisplay as="p" size="sm" color="danger">
            An administrator cannot request for membership transfer unless they hand over administrative authority
           </TextDisplay>
          </div>
        {/* Conference */}
        <div className={styles.section}>
          <div className={styles.field}>
            <label>Destination Conference</label>
            <select
              value={formData.conference_id}
              onChange={(e) => {
                updateForm("conference_id", e.target.value);
                updateForm("destination_church_id", "");
                updateForm("external_church_name", "");
                setSelectedChurch(null);
                setChurchQuery("");
              }}
              required
            >
              <option value="">Select Conference</option>
              {conferences.map((conference) => (
                <option key={conference.id} value={conference.id}>
                  {conference.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Church Search */}
        {formData.conference_id && !manualChurch && (
          <div className={styles.section}>
            <div className={styles.field}>
              <label>Destination Church</label>
              <SearchBar
                value={churchQuery}
                placeholder="Search church..."
                onChange={(e) => setChurchQuery(e.target.value)}
                onClear={() => {
                  setChurchQuery("");
                  setSelectedChurch(null);
                  updateForm("destination_church_id", "");
                }}
              />
              {searching && <p className={styles.helperText}>Searching...</p>}
              {churchResults.length > 0 && (
                <div className={styles.results}>
                  {churchResults.map((church) => (
                    <button
                      key={church.id}
                      type="button"
                      className={styles.resultItem}
                      onClick={() => selectChurch(church)}
                    >
                      {church.name}
                    </button>
                  ))}
                </div>
              )}
              <button
                type="button"
                className={styles.linkButton}
                onClick={enableManualChurch}
              >
                Church not listed?
              </button>
            </div>
          </div>
        )}

        {/* Selected Church */}
        {selectedChurch && (
          <div className={styles.selectedChurch}>
            Selected: <strong>{selectedChurch.name}</strong>
          </div>
        )}

        {/* Manual Church */}
        {manualChurch && (
          <div className={styles.section}>
            <div className={styles.field}>
              <label>Church Name</label>
              <input
                type="text"
                value={formData.external_church_name}
                onChange={(e) => updateForm("external_church_name", e.target.value)}
                placeholder="Enter church name"
                required
              />
              <button
                type="button"
                className={styles.linkButton}
                onClick={enableChurchSearch}
              >
                Search Existing Church
              </button>
            </div>
          </div>
        )}

        {/* Reason */}
        <div className={styles.section}>
          <div className={styles.field}>
            <label>Reason for Transfer</label>
            <textarea
              rows={4}
              value={formData.reason}
              onChange={(e) => updateForm("reason", e.target.value)}
              placeholder="Provide a reason..."
              required
            />
          </div>
        </div>

        <Button type="submit" loading={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </Modal>
  );
}

import { useEffect, useState, useMemo } from "react";
import Modal from "../Modal";
import Button from "../Button";
import SearchBar from "../SearchBar";
import TextDisplay from "../TextDisplay";

import { useMembers } from "../../hooks/clerk/useMembers";
import useConferences from "../../hooks/conferences/useConferences";
import useSearchChurches from "../../hooks/churches/useSearchChurches";
import { useClerkActions } from "../../hooks/clerk/useClerkActions";

import styles from "../../styles/components/TransferRequestModal.module.css";

/* -------------------------
   Initial Form State
------------------------- */
const initialForm = {
  member_id: "",
  conference_id: "",
  destination_church_id: "",
  external_church_name: "",
  reason: "",
};

export default function ClerkCreateTransfer({ isOpen, onClose }) {
  /* -------------------------
     Local State
  ------------------------- */
  const [manualChurch, setManualChurch] = useState(false);
  const [churchQuery, setChurchQuery] = useState("");
  const [selectedChurch, setSelectedChurch] = useState(null);
  const [formData, setFormData] = useState(initialForm);

  const [memberQuery, setMemberQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  const updateForm = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  /* -------------------------
     Hooks
  ------------------------- */
  const { conferences = [] } = useConferences();

  const {
    results: churchResults = [],
    loading: searchingChurches,
  } = useSearchChurches({
    conferenceId: formData.conference_id,
    search: churchQuery,
  });

  const { createClerkTransfer, loading: { createClerkTransfer: isCreating } } =
    useClerkActions();

  const { members = [], loading: memberSearching } = useMembers();

  const memberResults = useMemo(() => {
    const query = memberQuery.trim().toLowerCase();
    if (query.length < 2) return [];
    return members.filter((member) => {
      const fields = [
        member.full_name,
        member.phone,
        member.email,
        member.membership_number,
      ].map((f) => f?.toLowerCase() ?? "");
      return fields.some((f) => f.includes(query));
    });
  }, [members, memberQuery]);

  /* -------------------------
     Reset on Close
  ------------------------- */
  useEffect(() => {
    if (!isOpen) {
      setFormData(initialForm);
      setChurchQuery("");
      setSelectedChurch(null);
      setManualChurch(false);
      setMemberQuery("");
      setSelectedMember(null);
    }
  }, [isOpen]);

  /* -------------------------
     Selection Handlers
  ------------------------- */
  const selectMember = (member) => {
    updateForm("member_id", member.id);
    setSelectedMember(member);
    setMemberQuery(member.full_name);
  };

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
    await createClerkTransfer(formData);
    onClose();
  };

  if (!isOpen) return null;

  /* -------------------------
     Render
  ------------------------- */
  return (
    <Modal open={isOpen} title="Membership Transfer Request" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Info */}
        <div className={styles.section}>
          <TextDisplay as="p" size="sm" color="info">
            Ensure that the member being transferred is already recorded in the
            church register.
          </TextDisplay>
        </div>

        {/* Member Search */}
        <div className={styles.section}>
          <div className={styles.field}>
            <label>Member</label>
            <SearchBar
              value={memberQuery}
              placeholder="Search member..."
              onChange={(e) => setMemberQuery(e.target.value)}
              onClear={() => {
                setMemberQuery("");
                setSelectedMember(null);
                updateForm("member_id", "");
              }}
            />
            {memberSearching && (
              <p className={styles.helperText}>Searching...</p>
            )}
            {memberResults.length > 0 && (
              <div className={styles.results}>
                {memberResults.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    className={styles.resultItem}
                    onClick={() => selectMember(member)}
                  >
                    {member.full_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {memberQuery.length >= 2 &&
          memberResults.length === 0 &&
          !memberSearching && (
            <TextDisplay as="p" size="sm" color="danger">
              Member not found. Please add the member first before creating a
              transfer.
            </TextDisplay>
          )}

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
              {searchingChurches && (
                <p className={styles.helperText}>Searching...</p>
              )}
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
                onChange={(e) =>
                  updateForm("external_church_name", e.target.value)
                }
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

        {/* Submit */}
        <Button type="submit" loading={isCreating}>
          {isCreating ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </Modal>
  );
}

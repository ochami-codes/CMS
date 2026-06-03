import { useEffect, useState } from "react";

import Modal from "../Modal";
import Button from "../Button";
import SearchBar from "../SearchBar";

import {
  ChurchAPI,
  AuthAPI,
  ClerkAPI,
} from "../../utils/api";

import styles from "../../styles/components/TransferRequestModal.module.css";

const initialForm = {
  conference_id: "",
  destination_church_id: "",
  external_church_name: "",
  reason: "",
};

export default function TransferRequestModal({
  isOpen,
  onClose,
}) {
  const [loading, setLoading] =
    useState(false);

  const [searching, setSearching] =
    useState(false);

  const [manualChurch, setManualChurch] =
    useState(false);

  const [churchQuery, setChurchQuery] =
    useState("");

  const [conferences, setConferences] =
    useState([]);

  const [churchResults, setChurchResults] =
    useState([]);

  const [selectedChurch, setSelectedChurch] =
    useState(null);

  const [formData, setFormData] =
    useState(initialForm);

  const updateForm = (
    field,
    value
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialForm);
      setChurchQuery("");
      setChurchResults([]);
      setSelectedChurch(null);
      setManualChurch(false);
      return;
    }

    loadConferences();
  }, [isOpen]);

  useEffect(() => {
    if (
      !formData.conference_id ||
      manualChurch
    ) {
      setChurchResults([]);
      return;
    }

    const searchTerm =
      churchQuery.trim();

    if (searchTerm.length < 2) {
      setChurchResults([]);
      return;
    }

    const timer = setTimeout(
      async () => {
        try {
          setSearching(true);

          const data =
            await ChurchAPI.getChurches({
              conference_id:
                formData.conference_id,
              search: searchTerm,
              limit: 20,
            });

          setChurchResults(data.churches || []);
        } catch {
          setChurchResults([]);
        } finally {
          setSearching(false);
        }
      },
      300
    );

    return () =>
      clearTimeout(timer);
  }, [
    churchQuery,
    formData.conference_id,
    manualChurch,
  ]);

  async function loadConferences() {
    try {
      const data =
        await AuthAPI.getConferences();

      setConferences(
        data?.conferences || []
      );
    } catch (error) {
      console.error(error);
      setConferences([]);
    }
  }

  function selectChurch(church) {
    updateForm(
      "destination_church_id",
      church.id
    );

    setSelectedChurch(church);
    setChurchQuery(church.name);
    setChurchResults([]);
  }

  function enableManualChurch() {
    setManualChurch(true);
    setChurchQuery("");
    setChurchResults([]);
    setSelectedChurch(null);

    updateForm(
      "destination_church_id",
      ""
    );
  }

  function enableChurchSearch() {
    setManualChurch(false);

    updateForm(
      "external_church_name",
      ""
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      await ClerkAPI.createTransfer(
        formData
      );

      onClose();
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <Modal
      open={isOpen}
      title="Membership Transfer Request"
      onClose={onClose}
    >
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        {/* Conference */}

        <div className={styles.field}>
          <label>
            Destination Conference
          </label>

          <select
            value={
              formData.conference_id
            }
            onChange={(e) => {
              updateForm(
                "conference_id",
                e.target.value
              );

              updateForm(
                "destination_church_id",
                ""
              );

              updateForm(
                "external_church_name",
                ""
              );

              setSelectedChurch(null);
              setChurchQuery("");
            }}
            required
          >
            <option value="">
              Select Conference
            </option>

            {conferences.map(
              (conference) => (
                <option
                  key={
                    conference.id
                  }
                  value={
                    conference.id
                  }
                >
                  {conference.name}
                </option>
              )
            )}
          </select>
        </div>

        {/* Church Search */}

        {formData.conference_id &&
          !manualChurch && (
            <div className={styles.field}>
              <label>
                Destination Church
              </label>

              <SearchBar
                value={churchQuery}
                placeholder="Search church..."
                onChange={(e) =>
                  setChurchQuery(
                    e.target.value
                  )
                }
                onClear={() => {
                  setChurchQuery("");
                  setChurchResults([]);
                  setSelectedChurch(
                    null
                  );

                  updateForm(
                    "destination_church_id",
                    ""
                  );
                }}
              />

              {searching && (
                <p
                  className={
                    styles.helperText
                  }
                >
                  Searching...
                </p>
              )}

              {churchResults.length >
                0 && (
                <div
                  className={
                    styles.results
                  }
                >
                  {churchResults.map(
                    (church) => (
                      <button
                        key={
                          church.id
                        }
                        type="button"
                        className={
                          styles.resultItem
                        }
                        onClick={() =>
                          selectChurch(
                            church
                          )
                        }
                      >
                        {church.name}
                      </button>
                    )
                  )}
                </div>
              )}

              <button
                type="button"
                className={
                  styles.linkButton
                }
                onClick={
                  enableManualChurch
                }
              >
                Church not listed?
              </button>
            </div>
          )}

        {/* Selected Church */}

        {selectedChurch && (
          <div
            className={
              styles.selectedChurch
            }
          >
            Selected:
            <strong>
              {selectedChurch.name}
            </strong>
          </div>
        )}

        {/* Manual Entry */}

        {manualChurch && (
          <div className={styles.field}>
            <label>
              Church Name
            </label>

            <input
              type="text"
              value={
                formData.external_church_name
              }
              onChange={(e) =>
                updateForm(
                  "external_church_name",
                  e.target.value
                )
              }
              placeholder="Enter church name"
              required
            />

            <button
              type="button"
              className={
                styles.linkButton
              }
              onClick={
                enableChurchSearch
              }
            >
              Search Existing Church
            </button>
          </div>
        )}

        {/* Reason */}

        <div className={styles.field}>
          <label>
            Reason for Transfer
          </label>

          <textarea
            rows={4}
            value={formData.reason}
            onChange={(e) =>
              updateForm(
                "reason",
                e.target.value
              )
            }
            placeholder="Provide a reason for the transfer request"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Submitting..."
            : "Submit Request"}
        </Button>
      </form>
    </Modal>
  );
}
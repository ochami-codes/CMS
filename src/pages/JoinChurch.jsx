import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Input from "../components/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";

import { ChurchAPI } from "../utils/api";

import "../styles/pages.css";

export default function JoinChurch() {
  const navigate = useNavigate();

  const { switchChurch } = useAuth();

  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [
    openingChurchId,
    setOpeningChurchId,
  ] = useState(null);

  /* =========================
     SEARCH
  ========================= */

  const handleSearch = async (
    e
  ) => {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);

    try {
      const res =
        await ChurchAPI.searchChurches(
          query
        );

      setResults(
        res?.churches || []
      );
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     OPEN CHURCH
  ========================= */

  const handleOpenChurch =
    async (churchId) => {
      try {
        setOpeningChurchId(
          churchId
        );

        await switchChurch(
          churchId
        );

        navigate("/dashboard");
      } catch (err) {
        console.error(err);
      } finally {
        setOpeningChurchId(
          null
        );
      }
    };

  /* =========================
     FULLSCREEN TRANSITION
  ========================= */

  if (openingChurchId) {
    return (
      <Loader message="Opening church..." />
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <div className="page-container">

      <div className="page-card">
        <h2 className="card-title">
          Find Your Church
        </h2>

        <p className="card-subtitle">
          Search for your church
          or create a new one
        </p>
      </div>

      <div className="page-card">
        <form
          onSubmit={handleSearch}
          className="form-stack"
        >
          <Input
            label="Search Church"
            value={query}
            onChange={(e) =>
              setQuery(
                e.target.value
              )
            }
            placeholder="e.g. Maai Mahiu SDA"
          />

          <Button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading
              ? "Searching..."
              : "Search"}
          </Button>
        </form>
      </div>

      {results.length > 0 && (
        <div className="page-card">
          <h3 className="card-title">
            Results
          </h3>

          <div className="actions">
            {results.map(
              (church) => {
                const isOpening =
                  openingChurchId ===
                  church.id;

                return (
                  <div
                    key={
                      church.id
                    }
                    className="dashboard-action-card"
                  >
                    <h3>
                      {church.name}
                    </h3>

                    <p
                      style={{
                        fontSize:
                          "0.9rem",

                        color:
                          "#6b7280",
                      }}
                    >
                      Code:{" "}
                      {
                        church.church_code
                      }
                    </p>

                    <Button
                      className="btn-primary"
                      disabled={
                        isOpening
                      }
                      onClick={() =>
                        handleOpenChurch(
                          church.id
                        )
                      }
                    >
                      {isOpening
                        ? "Opening..."
                        : "Open Church"}
                    </Button>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      {!loading &&
        query &&
        results.length === 0 && (
          <div className="page-card">
            <p>
              No churches found.
            </p>

            <Button
              className="btn-secondary"
              onClick={() =>
                navigate(
                  "/create-church"
                )
              }
            >
              ➕ Create Church
              Instead
            </Button>
          </div>
        )}
    </div>
  );
}

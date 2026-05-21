import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChurch, FaSearch } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import Loader from "../components/Loader";
import PageHeader from "../components/PageHeader";

import { ChurchAPI } from "../utils/api";

import styles from "../styles/pages/JoinChurch.module.css";

export default function JoinChurch() {
  const navigate = useNavigate();
  const { switchChurch } = useAuth();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openingChurchId, setOpeningChurchId] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await ChurchAPI.searchChurches(query);
      setResults(res?.churches || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChurch = async (churchId) => {
    try {
      setOpeningChurchId(churchId);

      await switchChurch(churchId);

      navigate("/dashboard");
    } finally {
      setOpeningChurchId(null);
    }
  };

  if (openingChurchId) {
    return <Loader message="Opening church..." />;
  }

  return (
    <div className={styles.container}>

      <PageHeader
        title="Find Your Church"
        subtitle="Search for your church or create a new one"
      />

      {/* SEARCH */}
      <Card className={styles.searchCard}>

        <form onSubmit={handleSearch} className={styles.form}>

          <Input
            label="Search Church"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Maai Mahiu SDA"
          />

          <Button
            type="submit"
            disabled={loading}
            className={styles.searchBtn}
          >
            <FaSearch />
            {loading ? "Searching..." : "Search"}
          </Button>

        </form>

      </Card>

      {/* RESULTS */}
      {results.length > 0 && (

        <section>

          <h2 className={styles.title}>
            Results
          </h2>

          <div className={styles.grid}>

            {results.map((church) => {

              const isOpening =
                openingChurchId === church.id;

              return (
                <Card
                  key={church.id}
                  className={styles.resultCard}
                >

                  <FaChurch className={styles.icon} />

                  <h3>{church.name}</h3>

                  <p className={styles.code}>
                    Code: {church.church_code}
                  </p>

                  <Button
                    onClick={() =>
                      handleOpenChurch(church.id)
                    }
                    disabled={isOpening}
                  >
                    {isOpening
                      ? "Opening..."
                      : "Open Church"}
                  </Button>

                </Card>
              );
            })}

          </div>

        </section>

      )}

      {/* EMPTY STATE */}
      {!loading && query && results.length === 0 && (

        <Card className={styles.empty}>

          <h3>No churches found</h3>

          <p>Try a different search or create a new church.</p>

          <Button
            variant="outline"
            onClick={() => navigate("/create-church")}
          >
            ➕ Create Church
          </Button>

        </Card>

      )}

    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChurch, FaSearch } from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import Loader from "../components/Loader";
import PageHeader from "../components/PageHeader";
import BackButton from "../components/BackButton";
import useSearchChurches from "../hooks/churches/useSearchChurches";

import styles from "../styles/pages/JoinChurch.module.css";

export default function JoinChurch() {
  const navigate = useNavigate();
  const { switchChurch, isSwitchingChurch, switchChurchError } = useAuth();

  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Pass an object to the hook
  const { results, loading, isError } = useSearchChurches({
    search: searchTerm,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    setSearchTerm(trimmedQuery);
  };

  const handleOpenChurch = async (churchId) => {
    try {
      await switchChurch(churchId);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to open church:", err);
    }
  };

  if (isSwitchingChurch) {
    return <Loader message="Opening church..." />;
  }

  return (
    <div className={styles.container}>
      <BackButton/>
      <PageHeader
        title="Find Your Church"
        subtitle="Search for your church or create a new one"
      />

      {switchChurchError && (
        <Card className={styles.error}>
          <p>{switchChurchError}</p>
        </Card>
      )}

      {/* Search */}
      <Card className={styles.searchCard}>
        <form onSubmit={handleSearch} className={styles.form}>
          <Input
            label="Search Church"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Maai Mahiu SDA"
          />
          <Button type="submit" disabled={loading} className={styles.searchBtn}>
            <FaSearch />
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>
      </Card>

      {/* Error */}
      {isError && (
        <Card className={styles.error}>
          <p>Failed to search for churches. Please try again.</p>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <section>
          <h2 className={styles.title}>Results</h2>
          <div className={styles.grid}>
            {results.map((church) => (
              <Card key={church.id} className={styles.resultCard}>
                <FaChurch className={styles.icon} />
                <h3>{church.name}</h3>
                <p className={styles.code}>Code: {church.church_code}</p>
                <Button
                  onClick={() => handleOpenChurch(church.id)}
                  disabled={isSwitchingChurch}
                >
                  {isSwitchingChurch ? "Opening..." : "Open Church"}
                </Button>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!loading && searchTerm && results.length === 0 && (
        <Card className={styles.empty}>
          <h3>No churches found</h3>
          <p>Try a different search or create a new church.</p>
          <Button variant="outline" onClick={() => navigate("/create-church")}>
            ➕ Create Church
          </Button>
        </Card>
      )}
    </div>
  );
}


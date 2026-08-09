import { useState } from "react";

import Card from "../Card";
import Button from "../Button";
import SearchBar from "../SearchBar";
import Loader from "../Loader";
import ErrorState from "../ErrorState";
import useMembers from "../../hooks/members/useMembers";
import useAddDepartmentMember from "../../hooks/departments/useAddDepartmentMember";
import TextDisplay from "../TextDisplay";
import styles from "../../styles/components/AddMemberdept.module.css";

export default function AddMember({ departmentId }) {
  const [query, setQuery] = useState("");

  const { members, loading, isError, refresh } = useMembers({ search: query });
  const { addMember, isLoadingFor } = useAddDepartmentMember();

  const handleAdd = async (memberId) => {
    await addMember({ departmentId, memberId });
    setQuery("");
  };

  const hasResults = !loading && !isError && members.length > 0;
  const noResults =
    !loading && !isError && query.trim().length >= 2 && members.length === 0;

  return (
    <Card className={styles.card}>
      <header className={styles.header}>
        <TextDisplay
          as="h2"
          size="xl"
          weight="bold"
          color="primary"
        >
          Add Department Member
        </TextDisplay>
        <TextDisplay as="p" size="md" color="muted">
          Search existing church members and assign them to this department.
        </TextDisplay>
      </header>

      <SearchBar
        value={query}
        placeholder="Search member..."
        onChange={(e) => setQuery(e.target.value)}
        onClear={() => setQuery("")}
      />

      {loading && (
        <div className={styles.loading}>
          <Loader message="Searching members..." fullScreen={false} />
        </div>
      )}

      {isError && (
        <div className={styles.error}>
          <ErrorState message="Failed to search members." onRetry={refresh} />
        </div>
      )}

      {noResults && (
        <div className={styles.empty}>
          <TextDisplay as="p" size="md" color="muted">
            No matching member found.
          </TextDisplay>
          <TextDisplay as="small" size="sm" color="muted">
            Ask the church clerk to register the member before assigning them to
            this department.
          </TextDisplay>
        </div>
      )}

      {hasResults && (
        <div className={styles.results}>
          {members.map((member) => (
            <div key={member.id} className={styles.member}>
              <div>
                <TextDisplay as="h4" size="md" weight="bold" color="primary">
                  {member.full_name}
                </TextDisplay>
                <TextDisplay as="small" size="sm" color="muted">
                  {member.phone}
                </TextDisplay>
              </div>
              <Button
                size="sm"
                loading={isLoadingFor(member.id)}
                onClick={() => handleAdd(member.id)}
              >
                Add
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}


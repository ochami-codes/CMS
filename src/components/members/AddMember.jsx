import { useState } from "react";

import Card from "../Card";
import Button from "../Button";
import SearchBar from "../SearchBar";
import Loader from "../Loader";

import useMembers from "../../hooks/members/useMembers";
import useAddDepartmentMember from "../../hooks/departments/useAddDepartmentMember";

import styles from "../../styles/components/AddMemberdept.module.css";

export default function AddMember({
  departmentId,
}) {
  const [query, setQuery] =
    useState("");

  const {
  members,
  loading,
} = useMembers({
  search: query,
});

  const {
    addMember,
    loading: adding,
  } = useAddDepartmentMember();

  const handleAdd = async (
    memberId
  ) => {
    await addMember({
      departmentId,
      memberId,
    });

    setQuery("");
  };

  return (
    <Card className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          Add Department Member
        </h2>

        <p className={styles.subtitle}>
          Search existing church members and
          assign them to this department.
        </p>
      </header>

      <SearchBar
        value={query}
        placeholder="Search member..."
        onChange={(e) =>
          setQuery(e.target.value)
        }
        onClear={() =>
          setQuery("")
        }
      />

      {loading && (
        <div
          className={styles.loading}
        >
          <Loader
            message="Searching members..."
            fullScreen={false}
          />
        </div>
      )}

      {!loading &&
        query.trim().length >= 2 &&
        members.length === 0 && (
          <div
            className={styles.empty}
          >
            <p>
              No matching member found.
            </p>

            <small>
              Ask the church clerk to
              register the member before
              assigning them to this
              department.
            </small>
          </div>
        )}

      {!loading &&
        members.length > 0 && (
          <div
            className={styles.results}
          >
            {members.map(
              (member) => (
                <div
                  key={member.id}
                  className={
                    styles.member
                  }
                >
                  <div>
                    <h4>
                      {
                        member.full_name
                      }
                    </h4>

                    <small>
                      {member.phone}
                    </small>
                  </div>

                  <Button
                    size="sm"
                    disabled={
                      adding
                    }
                    onClick={() =>
                      handleAdd(
                        member.id
                      )
                    }
                  >
                    Add
                  </Button>
                </div>
              )
            )}
          </div>
        )}
    </Card>
  );
}
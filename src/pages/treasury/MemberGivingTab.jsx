import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import Card from "../../components/Card";
import Button from "../../components/Button";
import ResponsiveDataView from "../../components/ResponsiveDataView";
import MemberLedgerDrawer from "../../components/treasury/MemberLedgerDrawer";


import styles from "../../styles/pages/MemberGivingTab.module.css";

export default function MemberGivingTab({
  members = [],
}) {

  const [query, setQuery] =
    useState("");

  const [selectedMember, setSelectedMember] =
    useState(null);


  const filteredMembers =
    useMemo(() => {

      const search =
        query.trim().toLowerCase();

      if (!search) {
        return members;
      }

      return members.filter((member) =>
        [
          member.full_name,
          member.phone,
          member.member_number,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(search)
          )
      );

    }, [
      members,
      query,
    ]);


  const columns = [
    {
      key: "full_name",
      label: "Member",
    },
    {
      key: "phone",
      label: "Phone",
    },
  ];


  return (
    <>

      <section className={styles.container}>

        <div className={styles.intro}>

          <h2>
            Member Giving
          </h2>

          <p>
            Search members and view their
            complete giving ledger, including
            tithe, offerings and other
            contributions.
          </p>

        </div>


        <Card>

          <div className={styles.actionsBar}>

            <div className={styles.searchBox}>

              <Search size={16} />

              <input
                value={query}
                placeholder="Search member..."
                onChange={(e) =>
                  setQuery(e.target.value)
                }
              />

            </div>

          </div>


          <ResponsiveDataView
            columns={columns}
            data={filteredMembers}
            emptyMessage="No matching members found."
            renderActions={(member) => (
              <Button
                size="sm"
                onClick={() =>
                  setSelectedMember(member)
                }
              >
                Ledger
              </Button>
            )}
          />

        </Card>

      </section>


      <MemberLedgerDrawer
        member={selectedMember}
        onClose={() =>
          setSelectedMember(null)
        }
      />

    </>
  );

}
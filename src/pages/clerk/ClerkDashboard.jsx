import { useState } from "react";

import Tabs from "../../components/Tabs";
import Button from "../../components/Button";

import ClerkOverview from "./ClerkOverview";
import MembersRegister from "./MembersRegister";
import ChildrenRegister from "./ChildrenRegister";
import TransfersRegister from "./TransfersRegister";
import AddMember from "./AddMember";
import AddChild from "./AddChild";

import styles from "../../styles/pages/Clerk.module.css";

const TABS = [
  {
    key: "overview",
    label: "Overview",
  },
  {
    key: "members",
    label: "Members",
  },
  {
    key: "children",
    label: "Children",
  },
  {
    key: "transfers",
    label: "Transfers",
  },
];

export default function ClerkDashboard() {
  const [activeTab, setActiveTab] =
    useState("overview");

  const [showAddMember, setShowAddMember] =
    useState(false);

  const [showAddChild, setShowAddChild] =
    useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    setShowAddMember(false);
    setShowAddChild(false);
  };

  const actions =
    activeTab === "members" ? (
      <Button
        size="sm"
        onClick={() =>
          setShowAddMember(true)
        }
      >
        Add Member
      </Button>
    ) : activeTab === "children" ? (
      <Button
        size="sm"
        onClick={() =>
          setShowAddChild(true)
        }
      >
        Add Child
      </Button>
    ) : null;

  return (
    <div className={styles.page}>
      <div className={styles.tabsWrapper}>
        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          onChange={handleTabChange}
          actions={actions}
        />
      </div>

      <div className={styles.content}>
        {activeTab === "overview" && (
          <ClerkOverview />
        )}

        {activeTab === "members" &&
          (showAddMember ? (
            <AddMember
              onMemberAdded={() =>
                setShowAddMember(false)
              }
            />
          ) : (
            <MembersRegister />
          ))}

        {activeTab === "children" &&
          (showAddChild ? (
            <AddChild
              onChildAdded={() =>
                setShowAddChild(false)
              }
            />
          ) : (
            <ChildrenRegister />
          ))}

        {activeTab === "transfers" && (
          <TransfersRegister />
        )}
      </div>
    </div>
  );
}
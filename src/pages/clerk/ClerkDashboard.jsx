import { useState } from "react";

import Tabs from "../../components/Tabs";
import Button from "../../components/Button";
import RequirePermission from "../../components/RequirePermission";

import ClerkOverview from "./ClerkOverview";
import MembersRegister from "./MembersRegister";
import ChildrenRegister from "./ChildrenRegister";
import TransfersRegister from "./TransfersRegister";
import BackButton from "../../components/BackButton";
import AddMember from "./AddMember";
import AddChild from "./AddChild";

import ClerkCreateTransfer from "../../components/members/ClerkCreateTransfer";

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

  const [
    showCreateTransfer,
    setShowCreateTransfer,
  ] = useState(false);

  /* -------------------------
     Handle Tab Change
  ------------------------- */

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    setShowAddMember(false);
    setShowAddChild(false);
    setShowCreateTransfer(false);
  };

  /* -------------------------
     Tab Actions
  ------------------------- */

  const renderActions = () => {
    switch (activeTab) {
      case "members":
        return (
          <Button
            size="sm"
            onClick={() =>
              setShowAddMember(true)
            }
          >
            Add Member
          </Button>
        );

      case "children":
        return (
          <Button
            size="sm"
            onClick={() =>
              setShowAddChild(true)
            }
          >
            Add Child
          </Button>
        );

      case "transfers":
        return (
          <Button
            size="sm"
            onClick={() =>
              setShowCreateTransfer(true)
            }
          >
            Create Transfer
          </Button>
        );

      default:
        return null;
    }
  };

  return (
    <RequirePermission permission="access_clerk_dashboard">
      <BackButton/>
      <div className={styles.page}>
        <div className={styles.tabsWrapper}>
          <Tabs
            tabs={TABS}
            activeTab={activeTab}
            onChange={handleTabChange}
            actions={renderActions()}
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

          {activeTab === "transfers" &&
            (showCreateTransfer ? (
              <ClerkCreateTransfer
                isOpen={() => 
                  setShowCreateTransfer(true)
                }
                onClose={() =>
                  setShowCreateTransfer(false)
                }
              />
            ) : (
              <TransfersRegister />
            ))}
        </div>
      </div>
    </RequirePermission>
  );
}
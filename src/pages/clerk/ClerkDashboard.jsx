import { useState } from "react";
import styles from "../../styles/pages/Clerk.module.css";

import ClerkOverview from "./ClerkOverview";
import MembersRegister from "./MembersRegister";
import TransfersRegister from "./TransfersRegister";
import ChildrenRegister from "./ChildrenRegister";
import ClerkTabs from "./ClerkTabs";
import AddMember from "./AddMember";
import AddChild from "./AddChild";
export default function ClerkDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);

  if (tab !== "members") {
    setShowAddMember(false);
  }
  if (tab !== "children") {
    setShowAddChild(false);
  }
};
  return (
    <div className={styles.page}>

      <div className={styles.tabsWrapper}>
        <ClerkTabs
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onAddMember={() => setShowAddMember(true)}
          onAddChild={() => setShowAddChild(true)}
        />
      </div>

      <div className={styles.content}>
        {activeTab === "overview" && <ClerkOverview />}
        {activeTab === "members" &&
          (showAddMember ? (
            <AddMember
              onMemberAdded={() => {
                setShowAddMember(false);
              }}
            />
          ) : (
            <MembersRegister />
          ))}
        {activeTab === "children" &&
          (showAddChild ? (
            <AddChild
              onChildAdded={() => {
                setShowAddChild(false);
              }}
            />
          ) : (
            <ChildrenRegister />
          ))}
        {activeTab === "transfers" && <TransfersRegister />}
      </div>

    </div>
  );
}

import { useState } from "react";
import styles from "../../styles/pages/Clerk.module.css";

import ClerkOverview from "./ClerkOverview";
import MembersRegister from "./MembersRegister";
import TransfersRegister from "./TransfersRegister";
import ChildrenRegister from "./ChildrenRegister";
import ClerkTabs from "./ClerkTabs";

export default function ClerkDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className={styles.page}>

      <div className={styles.tabsWrapper}>
        <ClerkTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      <div className={styles.content}>
        {activeTab === "overview" && <ClerkOverview />}
        {activeTab === "members" && <MembersRegister />}
        {activeTab === "children" && <ChildrenRegister />}
        {activeTab === "transfers" && <TransfersRegister />}
      </div>

    </div>
  );
}

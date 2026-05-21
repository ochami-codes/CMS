import { useState } from "react";


import ClerkOverview from "./ClerkOverview";
import MembersRegister from "./MembersRegister";
import TransfersRegister from "./TransfersRegister";
import ChildrenRegister from "./ChildrenRegister";
import ClerkTabs from "./ClerkTabs";

export default function ClerkDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="page-container">

      <ClerkTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {activeTab === "overview" && <ClerkOverview />}
      {activeTab === "members" && <MembersRegister />}
      {activeTab === "children" && <ChildrenRegister />}
      {activeTab === "transfers" && <TransfersRegister />}

    </div>
  );
}

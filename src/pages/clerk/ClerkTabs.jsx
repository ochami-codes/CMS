import Button from "../../components/Button";

import styles from "../../styles/pages/Clerk.module.css";

export default function ClerkTabs({
  activeTab,
  setActiveTab,
}) {

  const tabs = [
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

  return (
    <div className={styles.tabs}>

      {tabs.map((tab) => (
        <Button
          key={tab.key}
          size="sm"
          variant={
            activeTab === tab.key
              ? "primary"
              : "ghost"
          }
          className={
            styles.tabButton
          }
          onClick={() =>
            setActiveTab(tab.key)
          }
        >
          {tab.label}
        </Button>
      ))}

    </div>
  );
}

export default function ClerkTabs({ activeTab, setActiveTab }) {
  return (
    <div className="clerk-tabs">

      <button
        className={activeTab === "overview" ? "active" : ""}
        onClick={() => setActiveTab("overview")}
      >
        Overview
      </button>

      <button
        className={activeTab === "members" ? "active" : ""}
        onClick={() => setActiveTab("members")}
      >
        Members
      </button>

      <button
        className={activeTab === "children" ? "active" : ""}
        onClick={() => setActiveTab("children")}
      >
        Children
      </button>

      <button
        className={activeTab === "transfers" ? "active" : ""}
        onClick={() => setActiveTab("transfers")}
      >
        Transfers
      </button>

    </div>
  );
}

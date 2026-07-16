import { useState } from "react";
import ResponsiveDataView from "../../components/ResponsiveDataView";
import Button from "../../components/Button";
import ChildrenProfileCard from "../../components/members/ChildrenProfileCard";
import EditChildModal from "../../components/members/EditChildModal";
import EmptyState from "../../components/EmptyState";
import { Baby, RefreshCw } from "lucide-react";
import { useClerkActions } from "../../hooks/clerk/useClerkActions";
import  useChildren  from "../../hooks/clerk/useChildren";

export default function ChildrenRegister() {
  const [selectedChild, setSelectedChild] = useState(null);
  const [editingChild, setEditingChild] = useState(null);
  const {
    children,
    loading,
    error,
    refetch,
  } = useChildren();
  const { updateChild } = useClerkActions();
  /* -------------------------
     AGE CALCULATION
  -------------------------- */
  const calculateAge = (dob) => {
    if (!dob) return "-";
    const diff = new Date() - new Date(dob);
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  };

  /* -------------------------
     TABLE COLUMNS
  -------------------------- */
  const columns = [
    { key: "full_name", label: "Name" },
    { key: "parent_name", label: "Parent" },
    { key: "parent_phone", label: "Phone" },
    { key: "gender", label: "Gender" },
    {
      key: "date_of_birth",
      label: "Age",
      render: (value, row) => calculateAge(row.date_of_birth),
    },
  ];

  /* -------------------------
     ACTIONS
  -------------------------- */
  const handleEdit = (child) => {
  setEditingChild(child);
};
const handleSaveChild = async ({
  childId,
  payload,
}) => {
  try {
    await updateChild(
      childId,
      payload
    );

    setEditingChild(null);

    refetch();
  } catch (err) {
    console.error(err);
  }
};
  const renderActions = (child) => (
    <div className="actions">
      <Button
        variant="primary"
        size="sm"
        onClick={() => setSelectedChild(child)}
      >
        View
      </Button>

      <Button
        variant="primary"
        size="sm"
        onClick={() => handleEdit(child)}
      >
        Edit
      </Button>
    </div>
  );

  /* -------------------------
     LOADING STATE
  -------------------------- */
  if (loading) {
    return (
      <div className="page-card">
        <h2 className="card-title">
          <Baby size={18} />
          Children Register
        </h2>

        <p>Loading children...</p>
      </div>
    );
  }

  /* -------------------------
     ERROR STATE
  -------------------------- */
  if (error) {
    return (
      <div className="page-card">
        <h2 className="card-title">
          <Baby size={18} />
          Children Register
        </h2>

        <EmptyState
          icon={<Baby size={28} />}
          title="Failed to load children"
          message="Something went wrong while fetching data."
          action={
            <Button
              variant="primary"
              onClick={refetch}
            >
              <RefreshCw size={16} />
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  /* -------------------------
     EMPTY STATE
  -------------------------- */
  if (!children || children.length === 0) {
    return (
      <div className="page-card">
        <h2 className="card-title">
          <Baby size={18} />
          Children Register
        </h2>

        <EmptyState
          icon={<Baby size={28} />}
          title="No children registered"
          message="Start by adding children to the church registry."
        />
      </div>
    );
  }

  /* -------------------------
     MAIN VIEW
  -------------------------- */
  return (
    <div className="page-card">
      <h2 className="card-title">
        <Baby size={18} />
        Children Register
      </h2>

      <ResponsiveDataView
        columns={columns}
        data={children}
        renderActions={renderActions}
      />

      {selectedChild && (
        <ChildrenProfileCard
          child={selectedChild}
          onClose={() => setSelectedChild(null)}
          onEdit={handleEdit}
        />
      )}

      {editingChild && (
        <EditChildModal
          open={!!editingChild}
          child={editingChild}
          onClose={() => setEditingChild(null)}
          onSave={handleSaveChild}
        />
      )}
      </div>
  );
}
import { useState } from "react";

import ResponsiveDataView from "../../components/ResponsiveDataView";
import Button from "../../components/Button";
import MemberProfileCard from "../../components/members/MemberProfileCard";
import EmptyState from "../../components/EmptyState";
import { Users, RefreshCw } from "lucide-react";

import { useMembers } from "../../hooks/clerk/useMembers";

export default function MembersRegister() {
  const [selectedMember, setSelectedMember] = useState(null);
  const {
    members,
    loading,
    error,
    refetch,
  } = useMembers();

  /* -------------------------
     COLUMNS
  -------------------------- */
  const columns = [
    { key: "full_name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "gender", label: "Gender" },
    { key: "status", label: "Status" },
    { key: "membership_type", label: "Membership Type" },
    { key: "primary_role_id", label: "Role" },
    {
      key: "baptized",
      label: "Baptized",
      render: (value) => (value ? "Yes" : "No"),
    },
  ];

  /* -------------------------
     ACTIONS
  -------------------------- */
  const handleEdit = (member) => {
    console.log("Edit member:", member);
  };

  const handleRemove = (member) => {
    console.log("Remove member:", member);
  };

  const renderActions = (member) => (
    <div className="actions">
      <Button
        variant="primary"
        size="sm"
        onClick={() => setSelectedMember(member)}
      >
        View
      </Button>

      <Button
        variant="secondary"
        size="sm"
        onClick={() => handleEdit(member)}
      >
        Edit
      </Button>

      <Button
        variant="danger"
        size="sm"
        onClick={() => handleRemove(member)}
      >
        Remove
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
          <Users size={18} />
          Members Register
        </h2>

        <p>Loading members...</p>
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
          <Users size={18} />
          Members Register
        </h2>

        <EmptyState
          icon={<Users size={28} />}
          title="Failed to load members"
          message="Something went wrong while fetching members."
          action={
            <Button variant="primary" onClick={refetch}>
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
  if (!members || members.length === 0) {
    return (
      <div className="page-card">
        <h2 className="card-title">
          <Users size={18} />
          Members Register
        </h2>

        <EmptyState
          icon={<Users size={28} />}
          title="No members found"
          message="Start by adding members to the church registry."
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
        <Users size={18} />
        Members Register
      </h2>

      <ResponsiveDataView
        columns={columns}
        data={members}
        renderActions={renderActions}
      />

      {selectedMember && (
        <MemberProfileCard
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onEdit={() => console.log("edit", selectedMember)}
        />
      )}
    </div>
  );
}
// src/pages/admin/MembersRegister.jsx

import { useState } from "react";

import ResponsiveDataView from "../../components/ResponsiveDataView";
import Button from "../../components/Button";
import MemberProfileCard from "../../components/members/MemberProfileCard";
import EditMemberModal from "../../components/members/EditMemberModal";
import ErrorState from "../../components/ErrorState";
import EmptyState from "../../components/EmptyState";
import { Users } from "lucide-react";
import { useClerkActions } from "../../hooks/clerk/useClerkActions";
import { useMembers } from "../../hooks/clerk/useMembers";

export default function MembersRegister() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);

  const { members, loading, isError, error, refetch } = useMembers();
  const { updateMember, loading: { updateMember: updateMemberLoading } } = useClerkActions();

  /* -------------------------
     TABLE COLUMNS
  -------------------------- */
  const columns = [
    { key: "full_name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "gender", label: "Gender" },
    { key: "status", label: "Status" },
    { key: "membership_type", label: "Membership Type" },
    {
      key: "baptized",
      label: "Baptized",
      render: (value) => (value ? "Yes" : "No"),
    },
  ];

  /* -------------------------
     ACTIONS
  -------------------------- */
  const handleEdit = (member) => setEditingMember(member);

  const handleSaveMember = async ({ memberId, payload }) => {
    try {
      console.log("Saving member:", memberId, payload);
      await updateMember({ memberId, payload });
      setEditingMember(null);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const renderActions = (member) => (
    <div className="actions">
      <Button variant="primary" size="sm" onClick={() => setSelectedMember(member)}>
        View
      </Button>
      <Button variant="secondary" size="sm" onClick={() => handleEdit(member)}>
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
          <Users size={18} /> Members Register
        </h2>
        <p>Loading members...</p>
      </div>
    );
  }

  /* -------------------------
     ERROR STATE
  -------------------------- */
  if (isError) {
    return (
      <div className="page-card">
        <h2 className="card-title">
          <Users size={18} /> Members Register
        </h2>
        <ErrorState
          title="Failed to load members"
          error={error}
          message={error?.message ?? "Something went wrong while fetching members."}
          onRetry={refetch}
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
          <Users size={18} /> Members Register
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
        <Users size={18} /> Members Register
      </h2>

      <ResponsiveDataView columns={columns} data={members} renderActions={renderActions} />

      {selectedMember && (
        <MemberProfileCard
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onEdit={() => {
            setEditingMember(selectedMember);
            setSelectedMember(null);
          }}
        />
      )}

      {editingMember && (
        <EditMemberModal
          open
          member={editingMember}
          loading={updateMemberLoading}
          onClose={() => setEditingMember(null)}
          onSave={handleSaveMember}
        />
      )}
    </div>
  );
}

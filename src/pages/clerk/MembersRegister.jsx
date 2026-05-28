import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ResponsiveDataView from "../../components/ResponsiveDataView";
import Button from "../../components/Button";
import MemberProfileCard from "../../components/members/MemberProfileCard";
export default function MembersRegister() {
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState(null);
  useEffect(() => {
    setMembers([
      {
        id: 1,
        name: "John Doe",
        phone: "0712345678",
        gender: "Male",
        status: "Active",
        membershipType: "Baptism",
        role: "Member",
        baptized: true,
      },
    ]);
  }, []);

  const columns = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "gender", label: "Gender" },
    { key: "status", label: "Status" },
    { key: "membershipType", label: "Type" },
    { key: "role", label: "Role" },
    {
      key: "baptized",
      label: "Baptized",
      render: (value) => (value ? "Yes" : "No"),
    },
  ];

  const handleView = (member) => {
    console.log("View member:", member);
    // later: navigate(`/members/${member.id}`)
  };

  const handleEdit = (member) => {
    console.log("Edit member:", member);
    // later: navigate(`/members/${member.id}/edit`)
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

  return (
    <div className="page-card">
      <h2 className="card-title">📋 Members Register</h2>

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

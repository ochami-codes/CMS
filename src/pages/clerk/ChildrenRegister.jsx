import { useEffect, useState } from "react";
import ResponsiveDataView from "../../components/ResponsiveDataView";
import Button from "../../components/Button";
import ChildrenProfileCard from "../../components/members/ChildrenProfileCard";
import { Baby } from "lucide-react";
export default function ChildrenRegister() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  useEffect(() => {
    setChildren([
      {
        id: 1,
        name: "Baby Jane",
        parent_name: "John Doe",
        parent_phone: "0712345678",
        gender: "Female",
        dob: "2020-05-12",
      },
    ]);
  }, []);

  const calculateAge = (dob) => {
    if (!dob) return "-";
    const diff = new Date() - new Date(dob);
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  };

  const columns = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "parent_name",
      label: "Parent",
    },
    {
      key: "parent_phone",
      label: "Phone",
    },
    {
      key: "gender",
      label: "Gender",
    },
    {
      key: "dob",
      label: "Age",
      render: (value, row) => calculateAge(row.dob),
    },
  ];

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
       size="sm">
        Edit
      </Button>
    </div>
  );

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
    onEdit={() => console.log("edit", selectedChild)}
  />
)}
    </div>
  );
}

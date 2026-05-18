import { useEffect, useState } from "react";

export default function ChildrenRegister() {
  const [children, setChildren] = useState([]);

  useEffect(() => {
    // replace with API later
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

  return (
    <div className="page-card">

      <h2 className="card-title">👶 Children Register</h2>

      <div className="table-responsive">
        <table className="members-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Parent</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>DOB</th>
            </tr>
          </thead>

          <tbody>
            {children.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.parent_name}</td>
                <td>{c.parent_phone}</td>
                <td>{c.gender}</td>
                <td>{c.dob}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}

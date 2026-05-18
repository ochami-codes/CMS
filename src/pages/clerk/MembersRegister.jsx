import { useEffect, useState } from "react";

export default function MembersRegister() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    setMembers([
      {
        id: 1,
        name: "John Doe",
        phone: "0712345678",
        gender: "Male",
        status: "Active",
      },
    ]);
  }, []);

  return (
    <div className="page-card">

      <h2 className="card-title">📋 Members Register</h2>

      <div className="table-responsive">
        <table className="members-table">

          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {members.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.phone}</td>
                <td>{m.gender}</td>
                <td>{m.status}</td>
                <td>
                  <button className="btn btn-danger">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}

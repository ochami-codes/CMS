export default function TransfersRegister() {
  const transfers = [
    {
      id: 1,
      name: "Mary Smith",
      from: "Westlands SDA",
      to: "Nairobi Central",
      status: "pending",
    },
  ];

  return (
    <div className="page-card">

      <h2 className="card-title">🔁 Transfers</h2>

      <table className="members-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {transfers.map((t) => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.from}</td>
              <td>{t.to}</td>
              <td>
                <span className={`status-${t.status}`}>
                  {t.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

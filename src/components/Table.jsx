import styles from "../styles/components/Table.module.css";

export default function Table({
  columns = [],
  data = [],
  renderActions,
}) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>
                {col.label}
              </th>
            ))}

            {renderActions && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {data.length ? (
            data.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : row[col.key] ?? "—"}
                  </td>
                ))}

                {renderActions && (
                  <td>
                    {renderActions(row)}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (renderActions ? 1 : 0)}>
                No records
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
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
            {columns.map(col => (
              <th key={col.key}>
                {col.label}
              </th>
            ))}

            {renderActions && (
              <th>Actions</th>
            )}

          </tr>

        </thead>


        <tbody>

          {data.length ? (

            data.map((row, index) => (

              <tr key={index}>

                {columns.map(col => (

                  <td key={col.key}>
                    {row[col.key]}
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

              <td
                colSpan={
                  columns.length + 1
                }
              >
                No records
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}

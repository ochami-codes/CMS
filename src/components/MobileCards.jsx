import styles from "../styles/components/MobileCards.module.css";

export default function MobileCards({
  columns,
  data,
  renderActions
}) {

  return (

    <div className={styles.list}>

      {data.map((row,index)=>(

        <div
          key={index}
          className={styles.card}
        >

          {columns.map(col=>(

            <div
              key={col.key}
              className={styles.item}
            >

              <small>
                {col.label}
              </small>

              <span>
  {col.render
    ? col.render(row[col.key], row)
    : row[col.key]}
</span>

            </div>

          ))}

          {renderActions && (

            <div className={styles.actions}>
              {renderActions(row)}
            </div>

          )}

        </div>

      ))}

    </div>

  );

}

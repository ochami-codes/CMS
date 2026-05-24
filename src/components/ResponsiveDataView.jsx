import Table from "./Table";
import MobileCards from "./MobileCards";

import styles from "../styles/components/ResponsiveDataView.module.css";

export default function ResponsiveDataView({
  columns,
  data,
  renderActions,
}) {
  return (
    <div className={styles.wrapper}>

      <div className={styles.tableView}>
        <Table
          columns={columns}
          data={data}
          renderActions={renderActions}
        />
      </div>

      <div className={styles.cardView}>
        <MobileCards
          columns={columns}
          data={data}
          renderActions={renderActions}
        />
      </div>

    </div>
  );
}

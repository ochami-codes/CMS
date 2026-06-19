import {
  Plus,
  ArrowDownCircle,
  ArrowUpCircle,
  Download,
  Landmark
} from "lucide-react";
import { useState } from "react";

import Card from "../../components/Card";
import Button from "../../components/Button";
import ResponsiveDataView from "../../components/ResponsiveDataView";

import ReceiveFundsForm from "../../components/treasury/ReceiveFundsForm";
import RecordExpenseForm from "../../components/treasury/RecordExpenseForm";

import styles from "../../styles/pages/TransactionsTab.module.css";


export default function TransactionsTab({
  transactions = [],
  summary = {},
  onRefresh,
  onExport,
}) {

  const [activeForm, setActiveForm] =
    useState(null);



  const closeForm = () => {
    setActiveForm(null);
  };


  const handleSuccess = () => {
    closeForm();
    onRefresh?.();
  };



  const columns = [
    {
      key: "transaction_date",
      label: "Date",
    },

    {
      key: "fund_name",
      label: "Fund",
    },

    {
      key: "contributor_name",
      label: "Contributor",
    },

    {
      key: "type",
      label: "Type",

      render: (row) => (
        <span
          className={
            row.type === "income"
              ? styles.income
              : styles.expense
          }
        >
          {row.type}
        </span>
      ),
    },

    {
      key: "amount",
      label: "Amount",

      render: (row) =>
        `KES ${Number(row.amount)
          .toLocaleString()}`,
    },

    {
      key: "recorded_by_name",
      label: "Recorded By",
    },
  ];



  return (

    <section className={styles.container}>


      {/* HEADER */}

      <div className={styles.header}>

        <div>

          <h2>
            Transactions
          </h2>

          <p>
            Record income, expenses and manage funds
          </p>

        </div>


        <Button
          variant="secondary"
          onClick={onExport}
        >
          <Download size={16}/>
          Export
        </Button>


      </div>





      {/* QUICK ACTIONS */}

      <div className={styles.actions}>


        <Card
          className={styles.actionCard}
          onClick={() =>
            setActiveForm("income")
          }
        >

          <ArrowDownCircle size={32}/>

          <div>

            <h3>
              Receive Funds
            </h3>

            <p>
              Tithe, offerings, contributions
            </p>

          </div>


          <Plus size={18}/>

        </Card>





        <Card
          className={styles.actionCard}
          onClick={() =>
            setActiveForm("expense")
          }
        >

          <ArrowUpCircle size={32}/>

          <div>

            <h3>
              Record Expense
            </h3>

            <p>
              Payments and spending
            </p>

          </div>


          <Plus size={18}/>

        </Card>






        <Card
          className={styles.actionCard}
          onClick={() =>
            setActiveForm("fund")
          }
        >

          <Landmark size={32}/>


          <div>

            <h3>
              Add Fund
            </h3>

            <p>
              Create local or departmental fund
            </p>

          </div>


          <Plus size={18}/>

        </Card>


      </div>







      {/* FORMS */}

      {activeForm === "income" && (

        <ReceiveFundsForm

          onSuccess={handleSuccess}

          onCancel={closeForm}

        />

      )}





      {activeForm === "expense" && (

        <RecordExpenseForm

          onSuccess={handleSuccess}

          onCancel={closeForm}

        />

      )}





      {activeForm === "fund" && (

        <CreateFundForm

          onSuccess={handleSuccess}

          onCancel={closeForm}

        />

      )}






      {/* SUMMARY */}

      <div className={styles.summary}>


        <Card>

          <span>
            Today's Records
          </span>

          <strong>
            {summary.today_count ?? 0}
          </strong>

        </Card>



        <Card>

          <span>
            Amount Recorded Today
          </span>

          <strong className={styles.income}>
            KES{" "}
            {summary.today_recorded
              ?.toLocaleString() ?? 0}
          </strong>

        </Card>



        <Card>

          <span>
            Today's Expenses
          </span>

          <strong className={styles.expense}>
            KES{" "}
            {summary.today_expenses
              ?.toLocaleString() ?? 0}
          </strong>

        </Card>


      </div>





      {/* HISTORY */}

      <Card className={styles.history}>

        <h3>
          Recent Transactions
        </h3>


        <ResponsiveDataView

          columns={columns}

          data={transactions}

        />

      </Card>


    </section>
  );
}
import { useState, useMemo } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

import Card from "../Card";
import Button from "../Button";
import useTreasuryFunds from "../../hooks/treasury/useTreasuryFunds";
import { TreasuryAPI } from "../../utils/api";

import styles from "../../styles/components/RecordExpenseForm.module.css";


export default function RecordExpenseForm({
  onSuccess,
  onCancel,
}) {

  const fundFilters = useMemo(
  () => ({
    group_type: "local",
  }),
  []
);


const {
  funds
} = useTreasuryFunds(fundFilters);
  const [loading, setLoading] = useState(false);


  const [form, setForm] = useState({

    fund_id: "",

    amount: "",

    payee_name: "",

    expense_category: "",

    payment_method: "",

    date: new Date()
      .toISOString()
      .split("T")[0],

    notes: "",

  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });

  };




  const submit = async (e) => {

    e.preventDefault();


    if (loading) return;


    setLoading(true);


    try {

      await TreasuryAPI.createTransaction({

        type: "OUT",

        fund_id:
          form.fund_id,

        amount:
          Number(form.amount),

        payee_name:
          form.payee_name,

        expense_category:
          form.expense_category,

        payment_method:
          form.payment_method,

        date:
          form.date,

        notes:
          form.notes,

      });


      toast.success(
        "Expense recorded"
      );


      onSuccess?.();


    } catch(error) {

      toast.error(
        error.message ||
        "Failed recording expense"
      );

    } finally {

      setLoading(false);

    }

  };



  return (

    <Card className={styles.card}>


      <div className={styles.header}>

        <h2>
          Record Expense
        </h2>

        <p>
          Record money spent from a church fund
        </p>

      </div>



      <form
        className={styles.form}
        onSubmit={submit}
      >



        {/* FUND */}

        <div className={styles.field}>

          <label>
            Pay From Fund
          </label>

          <small>
            Choose the fund that provided this money
          </small>


          <select

            name="fund_id"

            value={form.fund_id}

            onChange={handleChange}

            required

          >

            <option value="">
              Select fund
            </option>


            {funds.map((fund)=>(

              <option
                key={fund.id}
                value={fund.id}
              >
                {fund.name}
              </option>

            ))}

          </select>

        </div>




        {/* AMOUNT */}

        <div className={styles.field}>

          <label>
            Amount Spent
          </label>


          <input

            type="number"

            name="amount"

            value={form.amount}

            onChange={handleChange}

            placeholder="KES"

            min="1"

            required

          />

        </div>




        {/* PAYEE */}

        <div className={styles.field}>

          <label>
            Paid To
          </label>

          <small>
            Person, company or place that received money
          </small>


          <input

            name="payee_name"

            value={form.payee_name}

            onChange={handleChange}

            placeholder="e.g. ABC Hardware"

            required

          />

        </div>





        {/* CATEGORY */}

        <div className={styles.field}>


          <label>
            Expense Category
          </label>


          <small>
            What was the money used for?
            Example: Transport, Food, Repairs, Electricity
          </small>


          <input

            name="expense_category"

            value={form.expense_category}

            onChange={handleChange}

            placeholder="e.g. Youth camp food"

            required

          />


        </div>





        {/* PAYMENT */}

        <div className={styles.field}>


          <label>
            Payment Method
          </label>


          <select

            name="payment_method"

            value={form.payment_method}

            onChange={handleChange}

          >

            <option value="">
              Select method
            </option>

            <option value="cash">
              Cash
            </option>

            <option value="bank">
              Bank
            </option>

            <option value="mobile_money">
              Mobile Money
            </option>

            <option value="cheque">
              Cheque
            </option>

          </select>

        </div>





        {/* DATE */}

        <div className={styles.field}>

          <label>
            Date
          </label>

          <input

            type="date"

            name="date"

            value={form.date}

            onChange={handleChange}

          />

        </div>





        {/* NOTES */}

        <div
          className={`${styles.field} ${styles.full}`}
        >

          <label>
            Notes (Optional)
          </label>


          <textarea

            name="notes"

            value={form.notes}

            onChange={handleChange}

            placeholder="Add more details if needed"

          />

        </div>




        <div className={styles.actions}>


          {onCancel && (

            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
            >
              Cancel
            </Button>

          )}



          <Button
          type="submit"
          disabled={loading}>

            <Save size={16}/>

            {loading
              ? "Saving..."
              : "Save Expense"
            }

          </Button>


        </div>


      </form>


    </Card>

  );

}
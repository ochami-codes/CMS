import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

import Card from "../Card";
import Button from "../Button";

import { TreasuryAPI } from "../../utils/api";

import styles from "../../styles/components/RecordExpenseForm.module.css";


export default function RecordExpenseForm({
  onSuccess,
  onCancel,
}) {

  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(false);


  const [form, setForm] = useState({
    fund_id: "",
    amount: "",
    paid_to: "",
    reference: "",
    date: new Date()
      .toISOString()
      .split("T")[0],
    notes: "",
  });



  useEffect(() => {

    TreasuryAPI.funds()
      .then(setFunds)
      .catch(() =>
        toast.error(
          "Failed loading funds"
        )
      );

  }, []);



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

        fund_id:
          form.fund_id,

        amount:
          Number(form.amount),

        type:
          "expense",

        external_name:
          form.paid_to || null,

        reference:
          form.reference || null,

        date:
          form.date,

        notes:
          form.notes,

      });


      toast.success(
        "Expense recorded"
      );


      onSuccess?.();


    } catch(err){

      toast.error(
        err.message ||
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
          Record money spent by the church
        </p>

      </div>



      <form
        className={styles.form}
        onSubmit={submit}
      >



        {/* Fund */}

        <div className={styles.field}>

          <label>
            Fund
          </label>


          <select

            name="fund_id"

            value={
              form.fund_id
            }

            onChange={
              handleChange
            }

            required

          >

            <option value="">
              Select Fund
            </option>


            {funds.map(f => (

              <option
                key={f.id}
                value={f.id}
              >
                {f.name}
              </option>

            ))}

          </select>


        </div>




        {/* Amount */}

        <div className={styles.field}>

          <label>
            Amount
          </label>


          <input

            type="number"

            name="amount"

            min="1"

            value={
              form.amount
            }

            onChange={
              handleChange
            }

            placeholder="KES"

            required

          />

        </div>




        {/* Paid To */}

        <div className={styles.field}>

          <label>
            Paid To
          </label>


          <input

            name="paid_to"

            value={
              form.paid_to
            }

            onChange={
              handleChange
            }

            placeholder="Supplier / Person"

          />

        </div>




        {/* Reference */}

        <div className={styles.field}>

          <label>
            Reference
          </label>


          <input

            name="reference"

            value={
              form.reference
            }

            onChange={
              handleChange
            }

            placeholder="Receipt / MPESA"

          />

        </div>




        {/* Date */}

        <div className={styles.field}>

          <label>
            Date
          </label>


          <input

            type="date"

            name="date"

            value={
              form.date
            }

            onChange={
              handleChange
            }

          />

        </div>




        {/* Notes */}

        <div
          className={`${styles.field} ${styles.full}`}
        >

          <label>
            Notes
          </label>


          <textarea

            name="notes"

            value={
              form.notes
            }

            onChange={
              handleChange
            }

            placeholder="Expense details"

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
            disabled={loading}
          >

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
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { TreasuryAPI } from "../../utils/api";


export default function useTreasuryTransactions({
  start,
  end,
  fundId,
  type,
} = {}) {

  const [transactions, setTransactions] =
    useState([]);

  const [summary, setSummary] =
    useState({
      today_count: 0,
      today_recorded: 0,
      today_expenses: 0,
    });


  const [loading, setLoading] =
    useState(true);



  const fetchTransactions =
    useCallback(async () => {

      try {

        setLoading(true);


        const response =
          await TreasuryAPI.transactions({
            start,
            end,
            fund_id: fundId,
            type,
          });



        setTransactions(
          response.transactions || []
        );


        setSummary(
          response.summary || {}
        );


      } catch (error) {

        toast.error(
          "Failed loading transactions"
        );


      } finally {

        setLoading(false);

      }

    }, [
      start,
      end,
      fundId,
      type,
    ]);



  useEffect(() => {

    fetchTransactions();

  }, [
    fetchTransactions,
  ]);



  return {

    transactions,

    summary,

    loading,

    refresh:
      fetchTransactions,

  };

}
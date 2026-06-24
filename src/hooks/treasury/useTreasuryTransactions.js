import {
  useCallback,
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import { TreasuryAPI } from "../../utils/api";


const DEFAULT_SUMMARY = {

  today_count: 0,

  today_recorded: 0,

  today_expenses: 0,

};


export default function useTreasuryTransactions({
  start,
  end,
  fundId,
  type,
} = {}) {

  const [transactions, setTransactions] =
    useState([]);

  const [summary, setSummary] =
    useState(DEFAULT_SUMMARY);

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

            fund_id:
              fundId,

            type,

          });


        const {
          transactions = [],
          summary = DEFAULT_SUMMARY,
        } = response.data || {};


        setTransactions(
          transactions
        );

        setSummary(
          summary
        );

      } catch (error) {

        console.error(error);

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
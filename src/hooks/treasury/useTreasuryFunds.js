import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import { TreasuryAPI } from "../../utils/api";


export default function useTreasuryFunds() {

  const [funds, setFunds] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  const fetchFunds =
    useCallback(async () => {

      try {

        setLoading(true);


        const response =
          await TreasuryAPI.funds();


        setFunds(
          response.data || []
        );


      } catch (error) {

        toast.error(
          "Failed loading funds"
        );

      } finally {

        setLoading(false);

      }

    }, []);



  useEffect(() => {
    fetchFunds();
  }, [fetchFunds]);



  return {
    funds,
    loading,
    refresh: fetchFunds,
  };
}
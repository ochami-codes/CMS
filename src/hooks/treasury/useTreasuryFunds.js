import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import toast from "react-hot-toast";

import { TreasuryAPI } from "../../utils/api";


export default function useTreasuryFunds(
  filters = {}
) {

  const [funds, setFunds] = useState([]);

  const [loading, setLoading] =
    useState(true);


  const hasFetched = useRef(false);

  const filtersRef = useRef(filters);



  const fetchFunds = useCallback(
    async (force = false) => {


      if (
        hasFetched.current &&
        !force
      ) {
        return;
      }


      try {

        setLoading(true);


        const response =
          await TreasuryAPI.funds(
            filtersRef.current
          );


        setFunds(
          response?.data ?? []
        );


        hasFetched.current = true;


      } catch (error) {

        console.error(
          "Treasury funds error:",
          error
        );


        toast.error(
          "Failed loading funds"
        );


      } finally {

        setLoading(false);

      }

    },
    []
  );




  useEffect(() => {

    fetchFunds();

  }, [fetchFunds]);





  return {

    funds,

    loading,


    refresh: () =>
      fetchFunds(true),

  };

}
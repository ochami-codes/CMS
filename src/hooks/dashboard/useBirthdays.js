import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import {
  getMyBirthday,
  getTodaysBirthdays,
  getUpcomingBirthdays,
} from "../../utils/api";

export default function useBirthdays({
  churchId,
  enabled = true,
} = {}) {
  const query = useQuery({
    queryKey: ["birthdays", churchId],

    enabled: enabled && !!churchId,

    staleTime: 5 * 60 * 1000,

    queryFn: async () => {
      const [
        birthday,
        todayBirthdays,
        upcomingBirthdays,
      ] = await Promise.all([
        getMyBirthday(),
        getTodaysBirthdays(churchId),
        getUpcomingBirthdays(
          churchId,
          30
        ),
      ]);

      return {
        birthday: birthday ?? null,

        todayBirthdays:
          todayBirthdays ?? [],

        upcomingBirthdays:
          upcomingBirthdays ?? [],
      };
    },

    onError: (error) => {
      console.error(error);

      toast.error(
        error?.message ??
          "Failed to load birthdays"
      );
    },
  });

  return {
    birthday:
      query.data?.birthday ?? null,

    todayBirthdays:
      query.data?.todayBirthdays ?? [],

    upcomingBirthdays:
      query.data?.upcomingBirthdays ?? [],

    loading: query.isPending,

    error: query.error,

    refresh: query.refetch,

    isFetching: query.isFetching,

    isRefetching:
      query.isRefetching,
  };
}
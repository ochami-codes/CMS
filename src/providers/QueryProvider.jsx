import {
  QueryCache,
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  ReactQueryDevtools,
} from "@tanstack/react-query-devtools";

import toast
  from "react-hot-toast";

const queryClient =
  new QueryClient({

    queryCache:
      new QueryCache({

        onError: (
          error,
          query
        ) => {

          console.error(
            "Query Error:",
            query.queryKey,
            error
          );

          toast.error(
            error?.message ||
            "Failed loading data"
          );

        },

      }),

    mutationCache:
      new MutationCache({

        onError: (
          error
        ) => {

          console.error(
            "Mutation Error:",
            error
          );

          toast.error(
            error?.message ||
            "Operation failed"
          );

        },

      }),

    defaultOptions: {

      queries: {

        staleTime:
          5 * 60 * 1000,

        retry: 1,

        refetchOnWindowFocus:
          false,

        refetchOnReconnect:
          true,

      },

      mutations: {

        retry: 0,

      },

    },

  });

export default function QueryProvider({
  children,
}) {

  return (

    <QueryClientProvider
      client={queryClient}
    >

      {children}

      <ReactQueryDevtools
        initialIsOpen={false}
      />

    </QueryClientProvider>

  );

}
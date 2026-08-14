import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useToast } from "../../components/ToastProvider";

import { SabbathSchoolAPI } from "../../utils/api";

export default function useLessonGuides({
  quarter,
  enabled = true,
} = {}) {
  const {showToast} = useToast();
  const queryClient =
    useQueryClient();

  const query = useQuery({
    queryKey: [
      "lesson-guides",
      quarter,
    ],

    enabled,

    queryFn: () =>
      SabbathSchoolAPI.getLessonGuides({
        quarter,
      }),

    staleTime:
      5 * 60 * 1000,

    select: (data) => ({
      subscriptions:
        data?.subscriptions ?? [],

      summary:
        data?.summary ?? {
          totalSubscribers: 0,
          currentQuarter: "",
          adultGuides: 0,
          youthGuides: 0,
          childrenGuides: 0,
        },
    }),

    onError: (error) => {
      console.error(error);

      showToast(
        error?.message ??
          "Failed to load lesson guides"
      );
    },
  });

  const invalidateLessonGuides = () =>
  queryClient.invalidateQueries({
    queryKey: ["lesson-guides"],
  });

const createMutation = useMutation({
  mutationFn:
    SabbathSchoolAPI.createLessonGuide,

  onSuccess: () => {
    showToast("Subscription added");
    invalidateLessonGuides();
  },

  onError: (error) => {
    console.error(error);

    showToast(
      error?.message ??
        "Failed to add subscription", {type:"error"}
    );
  },
});

const createMyMutation = useMutation({
  mutationFn:
    SabbathSchoolAPI.createMyLessonGuide,

  onSuccess: () => {
    showToast(
      "You have successfully subscribed."
    );

    invalidateLessonGuides();
  },

  onError: (error) => {
    console.error(error);

    showToast(
      error?.message ??
        "Failed to subscribe", {type:"error"}
    );
  },
});

  const updateMutation =
    useMutation({
      mutationFn:
        SabbathSchoolAPI.updateLessonGuide,

      onSuccess: () => {
        showToast(
          "Subscription updated"
        );

        queryClient.invalidateQueries({
          queryKey: [
            "lesson-guides",
          ],
        });
      },

      onError: (error) => {
        console.error(error);

        showToast(
          error?.message ??
            "Failed to update subscription", {type:"error"}
        );
      },
    });

  const deleteMutation =
    useMutation({
      mutationFn:
        SabbathSchoolAPI.deleteLessonGuide,

      onSuccess: () => {
        showToast(
          "Subscription removed"
        );

        queryClient.invalidateQueries({
          queryKey: [
            "lesson-guides",
          ],
        });
      },

      onError: (error) => {
        console.error(error);

        showToast(
          error?.message ??
            "Failed to remove subscription", {type:"error"}
        );
      },
    });

 return {
  subscriptions:
    query.data?.subscriptions ?? [],

  summary:
    query.data?.summary,

  loading:
    query.isPending,

  error:
    query.error,
  isError: 
    query.isError,  

  refresh:
    query.refetch,

  isFetching:
    query.isFetching,

  createSubscription:
    createMutation.mutateAsync,

  creating:
    createMutation.isPending,

  createMySubscription:
    createMyMutation.mutateAsync,

  creatingMySubscription:
    createMyMutation.isPending,

  updateSubscription:
    updateMutation.mutateAsync,

  updating:
    updateMutation.isPending,

  deleteSubscription:
    deleteMutation.mutateAsync,

  deleting:
    deleteMutation.isPending,
};
}
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";

import { SabbathSchoolAPI } from "../../utils/api";

export default function useLessonGuides({
  departmentId,
  quarter,
  enabled = true,
} = {}) {
  const queryClient =
    useQueryClient();

  const query = useQuery({
    queryKey: [
      "lesson-guides",
      departmentId,
      quarter,
    ],

    enabled:
      enabled && !!departmentId,

    queryFn: () =>
      SabbathSchoolAPI.getLessonGuides({
        departmentId,
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

      toast.error(
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
    toast.success("Subscription added");
    invalidateLessonGuides();
  },

  onError: (error) => {
    console.error(error);

    toast.error(
      error?.message ??
        "Failed to add subscription"
    );
  },
});

const createMyMutation = useMutation({
  mutationFn:
    SabbathSchoolAPI.createMyLessonGuide,

  onSuccess: () => {
    toast.success(
      "You have successfully subscribed."
    );

    invalidateLessonGuides();
  },

  onError: (error) => {
    console.error(error);

    toast.error(
      error?.message ??
        "Failed to subscribe"
    );
  },
});

  const updateMutation =
    useMutation({
      mutationFn:
        SabbathSchoolAPI.updateLessonGuide,

      onSuccess: () => {
        toast.success(
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

        toast.error(
          error?.message ??
            "Failed to update subscription"
        );
      },
    });

  const deleteMutation =
    useMutation({
      mutationFn:
        SabbathSchoolAPI.deleteLessonGuide,

      onSuccess: () => {
        toast.success(
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

        toast.error(
          error?.message ??
            "Failed to remove subscription"
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
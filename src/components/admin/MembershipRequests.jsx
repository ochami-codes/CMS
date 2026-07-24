// src/pages/admin/MembershipRequests.jsx

import {
  useMemo,
} from "react";

import {
  useMembershipRequests,
} from "../../hooks/admin/useMembershipRequests";

import {
  useToast,
} from "../../components/ToastProvider";

import Card from "../Card";
import PageHeader from "../PageHeader";
import EmptyState from "../EmptyState";
import Loader from "../Loader";
import Button from "../Button";
import ResponsiveDataView from "../ResponsiveDataView";

export default function MembershipRequests() {
  const { showToast } = useToast();

  const {
  requests,
  isLoading,
  reviewRequest,
  isReviewing,
  reviewVariables,
} = useMembershipRequests();

  /* =======================
     APPROVE / REJECT
  ======================= */

  async function handleAction(
    id,
    action
  ) {
    const status =
      action === "approve"
        ? "approved"
        : "rejected";

    try {
      await reviewRequest({
        id,
        action,
      });

      showToast(
        status === "approved"
          ? "Membership approved"
          : "Membership rejected",
        "success"
      );
    } catch (err) {
      showToast(
        err?.message ||
          "Action failed",
        "error"
      );
    }
  }

  /* =======================
     TABLE DATA
  ======================= */

  const rows = useMemo(
    () =>
      requests.map((request) => ({
        id:
          request.membership_request_id,

        name:
          request.full_name || "-",

        email:
          request.email || "-",

        status:
          request.membership_status || "-",

        requested:
          request.membership_requested_at
            ? new Date(
                request.membership_requested_at
              ).toLocaleDateString()
            : "-",

        raw: request,
      })),
    [requests]
  );

  const columns = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "requested",
      label: "Requested",
    },
  ];

  /* =======================
     ACTIONS
  ======================= */

  const renderActions = (row) => {
    const id =
      row.raw.membership_request_id;

    const pending =
      row.raw.membership_status ===
      "requested";

    if (!pending) {
      return (
        <span>
          Processed
        </span>
      );
    }

    return (
      <>
        <Button
          size="sm"
          loading={
  isReviewing &&
  reviewVariables?.id === id &&
  reviewVariables?.action === "approve"
}
          onClick={() =>
            handleAction(
              id,
              "approve"
            )
          }
        >
          Approve
        </Button>

        <Button
          variant="secondary"
          size="sm"
        loading={
  isReviewing &&
  reviewVariables?.id === id &&
  reviewVariables?.action === "reject"
}
          onClick={() =>
            handleAction(
              id,
              "reject"
            )
          }
        >
          Reject
        </Button>
      </>
    );
  };

  return (
    <>
      <PageHeader
        title="Membership Requests"
        subtitle="
          Approve or reject church
          membership requests.
        "
      />

      <Card>
        {isLoading && (
          <Loader
            fullScreen={false}
            message="
              Loading membership requests...
            "
          />
        )}

        {!isLoading &&
          !requests.length && (
            <EmptyState
              title="No requests"
              description="
                No membership requests found.
              "
            />
          )}

        {!isLoading &&
          requests.length > 0 && (
            <ResponsiveDataView
              columns={columns}
              data={rows}
              renderActions={
                renderActions
              }
            />
          )}
      </Card>
    </>
  );
}

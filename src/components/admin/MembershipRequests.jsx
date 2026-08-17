// src/pages/admin/MembershipRequests.jsx

import { useMemo } from "react";

import { useMembershipRequests } from "../../hooks/admin/useMembershipRequests";

import ErrorState from "../ErrorState";
import Card from "../Card";
import PageHeader from "../PageHeader";
import EmptyState from "../EmptyState";
import Loader from "../Loader";
import Button from "../Button";
import ResponsiveDataView from "../ResponsiveDataView";

export default function MembershipRequests() {

  const {
    requests,
    isLoading,
    isError,
    error,
    refetch,
    reviewRequest,
    isApproving,
    isRejecting
  } = useMembershipRequests();

  /* =======================
     APPROVE / REJECT
  ======================= */
  async function handleAction(id, action) {

      await reviewRequest({ id, action });
    
  }

  /* =======================
     TABLE DATA
  ======================= */
  const rows = useMemo(
    () =>
      requests.map((request) => ({
        id: request.membership_request_id,
        name: request.full_name || "-",
        email: request.email || "-",
        status: request.membership_status || "-",
        requested: request.membership_requested_at
          ? new Date(request.membership_requested_at).toLocaleDateString()
          : "-",
        raw: request,
      })),
    [requests]
  );

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
    { key: "requested", label: "Requested" },
  ];

  /* =======================
     ACTIONS
  ======================= */
  const renderActions = (row) => {
    const id = row.raw.membership_request_id;
    const pending = row.raw.membership_status === "requested";

    if (!pending) {
      return <span>Processed</span>;
    }

    return (
      <>
        <Button
          variant="success"
          loading={isApproving(id)}
          onClick={() => handleAction(id, "approve")}
        >
          Approve
        </Button>
        <Button
          variant="danger"
          loading={isRejecting(id)}
          onClick={() => handleAction(id, "reject")}
        >
          Reject
        </Button>
      </>
    );
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <>
      <PageHeader
        title="Membership Requests"
        subtitle="Approve or reject church membership requests."
      />

      <Card>
        {isLoading && (
          <Loader fullScreen={false} message="Loading membership requests..." />
        )}

        {!isLoading && isError && (
        <ErrorState
  error={error}
  title="Failed to load data"
  message={error?.message}
  onRetry={refetch}
/>
        )}

        {!isLoading && !isError && requests.length === 0 && (
          <EmptyState
            title="No requests"
            description="No membership requests found."
          />
        )}

        {!isLoading && !isError && requests.length > 0 && (
          <ResponsiveDataView
            columns={columns}
            data={rows}
            renderActions={renderActions}
          />
        )}
      </Card>
    </>
  );
}


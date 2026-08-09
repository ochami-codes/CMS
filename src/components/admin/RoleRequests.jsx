import { useMemo } from "react";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ToastProvider";
import { useRoleRequests } from "../../hooks/admin/useRoleRequests";
import BadgeList from "../BadgeList";
import Loader from "../Loader";
import Card from "../Card";
import Button from "../Button";
import ErrorState from "../ErrorState";
import EmptyState from "../EmptyState";
import ResponsiveDataView from "../ResponsiveDataView";
import PageHeader from "../PageHeader";

export default function RoleRequests() {
  const { authReady, activeChurchId } = useAuth();
  const { showToast } = useToast();

  const enabled = authReady && Boolean(activeChurchId);

  /* ======================
     TANSTACK QUERY
  ====================== */
  const {
    requests,
    isLoading,
    error,
    isError,
    refetch,
    reviewRequest,
    isApproving,
    isRejecting,
  } = useRoleRequests({ enabled });

  /* ======================
     REVIEW REQUEST
  ====================== */
  async function handleReview(request, action) {
    try {
      await reviewRequest({ requestId: request.id, action });

      showToast(
        `Request ${action === "approved" ? "approved" : "rejected"}`,
        "success"
      );
    } catch (err) {
      showToast(err?.message || "Action failed", "error");
    }
  }

  /* ======================
     TABLE DATA
  ====================== */
  const rows = useMemo(
    () =>
      requests.map((req) => ({
        name: req.member?.full_name ?? "-",
        status: req.status ?? "-",
        role: req.role ?? null,
        date: req.requested_at
          ? new Date(req.requested_at).toLocaleDateString()
          : "-",
        raw: req,
      })),
    [requests]
  );

  const columns = [
    { key: "name", label: "Name" },
    { key: "status", label: "Status" },
    {
  key: "role",
  label: "Role",
  render: (role) => (
    <BadgeList
      items={role ? [role] : []}
    />
  ),
},
    { key: "date", label: "Date" },
  ];

  /* ======================
     ACTIONS
  ====================== */
  const renderActions = (row) => {
    const req = row.raw;

    return (
      <>
        <Button
          size="sm"
          loading={isApproving}
          onClick={() => handleReview(req, "approved")}
        >
          Approve
        </Button>

        <Button
          size="sm"
          variant="danger"
          loading={isRejecting}
          onClick={() => handleReview(req, "rejected")}
        >
          Reject
        </Button>
      </>
    );
  };

  const blocked = !authReady || !activeChurchId;

  /* ======================
     UI
  ====================== */
  return (
    <>
      <PageHeader
        title="Role Requests"
        subtitle="Approve or reject ministry role requests."
      />

      <Card>
        {isLoading && (
          <Loader fullScreen={false} message="Loading role requests..." />
        )}

        {!isLoading && isError && (
          <ErrorState
            title="Unable to load membership requests"
            message={
              error?.message ??
              "We couldn't load membership requests. Please try again."
            }
            onRetry={refetch}
          />
        )}

        {!isLoading && blocked && (
          <EmptyState
            title="No permission"
            description="You cannot manage role requests."
          />
        )}

        {!isLoading && !blocked && !requests.length && (
          <EmptyState title="No pending requests" />
        )}

        {!isLoading && !blocked && requests.length > 0 && (
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
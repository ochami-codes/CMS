import {
  useMemo,
} from "react";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ToastProvider";

import { useRoleRequests } from "../../hooks/admin/useRoleRequests";

import Loader from "../Loader";
import Card from "../Card";
import Button from "../Button";
import EmptyState from "../EmptyState";
import ResponsiveDataView from "../ResponsiveDataView";
import PageHeader from "../PageHeader";

export default function RoleRequests() {
  const {
    authReady,
    activeChurchId,
    hasRole,
  } = useAuth();

  const {
    showToast,
  } = useToast();


  /* ======================
     PERMISSIONS
  ====================== */

  const canManageRoles =
    hasRole("admin") ||
    hasRole("elder") ||
    hasRole("pastor");


  const enabled =
    authReady &&
    Boolean(activeChurchId) &&
    canManageRoles;


  /* ======================
     TANSTACK QUERY
  ====================== */

  const {
    requests,
    isLoading,
    reviewRequest,
    isReviewing,
    reviewingRequestId,
    reviewingStatus,
  } =
    useRoleRequests({
      enabled,
    });

  /* ======================
     REVIEW REQUEST
  ====================== */

  async function handleReview(
    request,
    action
  ) {
    try {
      await reviewRequest({
        requestId:
          request.id,

        action,
      });

      showToast(
        `Request ${
          action === "approved"
            ? "approved"
            : "rejected"
        }`,
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


  /* ======================
     TABLE DATA
  ====================== */

  const rows =
    useMemo(
      () =>
        requests.map(req => ({
          name:
            req.full_name || "-",

          status:
            req.role_request_status || "-",

          role:
            req.requested_role || "-",

          date:
            req.role_requested_at
              ? new Date(
                  req.role_requested_at
                ).toLocaleDateString()
              : "-",

          raw: req,
        })),

      [requests]
    );


  const columns = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "role",
      label: "Requested Role",
    },
    {
      key: "date",
      label: "Date",
    },
  ];


  /* ======================
     ACTIONS
  ====================== */

  const renderActions =
    (row) => {

      const req =
        row.raw;

      const approving =
        isReviewing &&
        reviewingRequestId === req.id &&
        reviewingStatus === "approved";

      const rejecting =
        isReviewing &&
        reviewingRequestId === req.id &&
        reviewingStatus === "rejected";


      return (
        <>
          <Button
            size="sm"
            loading={approving}
            disabled={isReviewing}
            onClick={() =>
              handleReview(
                req,
                "approved"
              )
            }
          >
            Approve
          </Button>

          <Button
            size="sm"
            variant="secondary"
            loading={rejecting}
            disabled={isReviewing}
            onClick={() =>
              handleReview(
                req,
                "rejected"
              )
            }
          >
            Reject
          </Button>
        </>
      );
    };


  const blocked =
    !authReady ||
    !activeChurchId ||
    !canManageRoles;


  /* ======================
     UI
  ====================== */

  return (
    <>
      <PageHeader
        title="Role Requests"
        subtitle="
          Approve or reject
          ministry role requests.
        "
      />

      <Card>

        {isLoading && (
          <Loader
            fullScreen={false}
            message="
              Loading role requests...
            "
          />
        )}


        {!isLoading &&
          blocked && (

          <EmptyState
            title="No permission"
            description="
              You cannot manage
              role requests.
            "
          />

        )}


        {!isLoading &&
          !blocked &&
          !requests.length && (

          <EmptyState
            title="No pending requests"
          />

        )}


        {!isLoading &&
          !blocked &&
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

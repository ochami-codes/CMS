// src/pages/admin/MembershipRequests.jsx

import {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";

import {
  AdminMembershipAPI,
} from "../../utils/api";

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

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState({});


  /* =======================
     LOAD REQUESTS
  ======================= */

  const loadRequests =
    useCallback(async () => {

      try {
        setLoading(true);

        const res =
          await AdminMembershipAPI
            .fetchAll();

        setRequests(
          res?.requests || []
        );

      } catch {

        showToast(
          "Failed loading membership requests",
          "error"
        );

      } finally {
        setLoading(false);
      }

    }, [showToast]);


  useEffect(() => {
    loadRequests();
  }, [loadRequests]);


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

    const key =
      `${id}-${action}`;

    try {

      setActionLoading(prev => ({
        ...prev,
        [key]: true,
      }));

      await AdminMembershipAPI.review(
        id,
        status
      );

      // update locally instead
      setRequests(prev =>
        prev.map(item =>
          item.membership_request_id === id
            ? {
                ...item,
                membership_status:
                  status,
              }
            : item
        )
      );

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

    } finally {

      setActionLoading(prev => ({
        ...prev,
        [key]: false,
      }));

    }
  }


  /* =======================
     TABLE DATA
  ======================= */

  const rows =
    useMemo(() =>
      requests.map(request => ({
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
    [requests]);


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

  const renderActions =
    (row) => {

      const id =
        row.raw.membership_request_id;

      const pending =
        row.raw.membership_status ===
        "requested";

      if (!pending)
        return (
          <span>
            Processed
          </span>
        );

      return (
        <>
          <Button
            size="sm"
            loading={
              actionLoading[
                `${id}-approve`
              ]
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
              actionLoading[
                `${id}-reject`
              ]
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

        {loading && (
          <Loader
            fullScreen={false}
            message="
            Loading membership requests...
            "
          />
        )}

        {!loading &&
          !requests.length && (

          <EmptyState
            title="No requests"
            description="
            No membership requests found.
            "
          />

        )}

        {!loading &&
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

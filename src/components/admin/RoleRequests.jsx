// src/pages/admin/RoleRequests.jsx

import {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

import { AdminAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ToastProvider";

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

  const { showToast } =
    useToast();

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [processing, setProcessing] =
    useState({});

  const canManageRoles =
    hasRole("admin") ||
    hasRole("elder") ||
    hasRole("pastor");


  /* ======================
     LOAD REQUESTS
  ====================== */

  const fetchRequests =
    useCallback(async () => {

      if (
        !authReady ||
        !activeChurchId ||
        !canManageRoles
      ) {
        setLoading(false);
        return;
      }

      try {

        setLoading(true);

        const res =
          await AdminAPI
            .fetchRoleRequests();

        setRequests(
          res?.requests || []
        );

      } catch (err) {

        showToast(
          err?.message ||
          "Failed loading requests",
          "error"
        );

      } finally {

        setLoading(false);

      }

    }, [
      authReady,
      activeChurchId,
      canManageRoles,
      showToast,
    ]);


  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);


  /* ======================
     REVIEW REQUEST
  ====================== */

  async function handleReview(
    request,
    status
  ) {

    const key =
      `${request.id}-${status}`;

    try {

      setProcessing(prev => ({
        ...prev,
        [key]: true,
      }));

      await AdminAPI
        .reviewRoleRequest(
          request.id,
          status
        );

      // remove immediately
      setRequests(prev =>
        prev.filter(
          r =>
            r.id !== request.id
        )
      );

      showToast(

        `Request ${
          status === "approved"
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

    } finally {

      setProcessing(prev => ({
        ...prev,
        [key]: false,
      }));

    }
  }


  /* ======================
     TABLE DATA
  ====================== */

  const rows =
    useMemo(() =>
      requests.map(req => ({
        name:
          req.full_name || "-",

        email:
          req.email || "-",

        role:
          req.requested_role || "-",

        date:
          req.role_requested_at
            ? new Date(
                req.role_requested_at
              )
                .toLocaleDateString()
            : "-",

        raw: req,
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
      key: "role",
      label:
        "Requested Role",
    },
    {
      key: "date",
      label: "Date",
    },
  ];


  const renderActions =
    (row) => {

      const req =
        row.raw;

      return (
        <>
          <Button
            size="sm"
            loading={
              processing[
                `${req.id}-approved`
              ]
            }
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
            loading={
              processing[
                `${req.id}-rejected`
              ]
            }
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

        {loading && (
          <Loader
            fullScreen={false}
            message="
            Loading role requests...
            "
          />
        )}

        {!loading &&
          blocked && (

          <EmptyState
            title="
            No permission
            "
            description="
            You cannot manage
            role requests.
            "
          />

        )}

        {!loading &&
          !blocked &&
          !requests.length && (

          <EmptyState
            title="
            No pending requests
            "
          />

        )}

        {!loading &&
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

// src/pages/admin/MembershipRequests.jsx

import { useEffect, useState } from "react";
import { AdminMembershipAPI } from "../../utils/api";
import { useToast } from "../../components/ToastProvider";

import Card from "../Card";
import PageHeader from "../PageHeader";
import EmptyState from "../EmptyState";
import Loader from "../Loader";
import Button from "../Button";
import Table from "../Table";
import MobileCards from "../MobileCards";

export default function MembershipRequests() {
  const { showToast } = useToast();

  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState({});

  /* -------------------- LOAD -------------------- */

  const loadRequests =
    async () => {
      try {
        setLoading(true);

        const res =
          await AdminMembershipAPI.fetchAll();

        setRequests(
          res.requests || []
        );

      } catch {
        showToast(
          "Failed loading requests",
          "error"
        );

      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadRequests();
  }, []);

  /* -------------------- ACTIONS -------------------- */

  const handleAction =
    async (id, action) => {

      const status =
        action === "approve"
          ? "approved"
          : "rejected";

      const key =
        `${id}-${action}`;

      setActionLoading(prev => ({
        ...prev,
        [key]: true,
      }));

      try {
        await AdminMembershipAPI.review(
          id,
          status
        );

        showToast(
          status === "approved"
            ? "Membership approved"
            : "Membership rejected"
        );

        loadRequests();

      } catch (err) {

        showToast(
          err.message ||
            "Action failed",
          "error"
        );

      } finally {

        setActionLoading(prev => ({
          ...prev,
          [key]: false,
        }));

      }
    };

  /* -------------------- TABLE DATA -------------------- */

  const rows =
    requests.map(r => ({

      id:
        r.membership_request_id,

      name:
        r.full_name || "-",

      email:
        r.email || "-",

      status:
        r.membership_status,

      requested:

        r.membership_requested_at
          ? new Date(
              r.membership_requested_at
            ).toLocaleDateString()
          : "-",

      raw: r,
    }));


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


  /* -------------------- LOADING -------------------- */

  if (loading)
    return (
      <Loader
        message="Loading membership requests..."
      />
    );


  return (
    <>

      <PageHeader
        title="Membership Requests"
        subtitle="Approve or reject church membership requests."
      />

      <Card>

        {!requests.length ? (

          <EmptyState
            title="No requests"
            description="No pending membership requests."
          />

        ) : (

          <>
            {/* DESKTOP */}

            <Table
              columns={columns}
              data={rows}

              renderActions={(row) => {

                const id =
                  row.raw
                    .membership_request_id;

                const pending =
                  row.raw
                    .membership_status ===
                  "requested";

                if (!pending)
                  return "No action";

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
              }}
            />


            {/* MOBILE */}

            <MobileCards
              columns={columns}
              data={rows}

              renderActions={(row) => {

                const id =
                  row.raw
                    .membership_request_id;

                const pending =
                  row.raw
                    .membership_status ===
                  "requested";

                if (!pending)
                  return null;

                return (
                  <>

                    <Button
                      size="sm"

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
              }}
            />

          </>

        )}

      </Card>

    </>
  );
}

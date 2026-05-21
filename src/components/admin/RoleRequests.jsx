// src/pages/admin/RoleRequests.jsx

import {
  useEffect,
  useState,
  useCallback,
} from "react";

import { AdminAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ToastProvider";

import Loader from "../Loader";
import Card from "../Card";
import Table from "../Table";
import Button from "../Button";
import EmptyState from "../EmptyState";
import MobileCards from "../MobileCards";
import PageHeader from "../PageHeader";

export default function RoleRequests() {

  const {
    user,
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

  const [error, setError] =
    useState("");

  const [processingId,
    setProcessingId] =
      useState(null);


  /* ---------------- PERMISSION ---------------- */

  const canManageRoles =
    hasRole("admin") ||
    hasRole("elder") ||
    hasRole("pastor");


  /* ---------------- FETCH ---------------- */

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
        setError("");

        const res =
          await AdminAPI.fetchRoleRequests();

        setRequests(
          res.requests || []
        );

      } catch (err) {

        const msg =
          err.message ||
          "Failed loading requests";

        setError(msg);

        showToast(
          msg,
          "error"
        );

      } finally {

        setLoading(false);

      }

    },[
      authReady,
      activeChurchId,
      canManageRoles,
      showToast
    ]);


  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);


  /* ---------------- REVIEW ---------------- */

  const handleReview =
    async (request,status)=>{

      try{

        setProcessingId(
          request.id
        );

        await AdminAPI
          .reviewRoleRequest(
            request.id,
            status
          );

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
          }`
        );

      }catch{

        showToast(
          "Action failed",
          "error"
        );

      }finally{

        setProcessingId(null);

      }

    };


  /* ---------------- GUARDS ---------------- */

  if (!authReady || loading)
    return (
      <Loader
        message="Loading role requests..."
      />
    );

  if (!user || !activeChurchId)
    return (
      <EmptyState
        title="No church selected"
      />
    );

  if (!canManageRoles)
    return (
      <EmptyState
        title="No permission"
      />
    );


  /* ---------------- DATA ---------------- */

  const rows =
    requests.map(req => ({

      name:
        req.full_name,

      email:
        req.email,

      role:
        req.requested_role,

      date:
        new Date(
          req.role_requested_at
        )
        .toLocaleDateString(),

      raw:req
    }));


  const columns = [

    {
      key:"name",
      label:"Name"
    },

    {
      key:"email",
      label:"Email"
    },

    {
      key:"role",
      label:"Requested Role"
    },

    {
      key:"date",
      label:"Date"
    }

  ];


  return (
    <>

      <PageHeader
        title="Role Requests"
        subtitle="Approve or reject ministry role requests."
      />

      <Card>

        {error && (
          <p>
            {error}
          </p>
        )}


        {!requests.length ? (

          <EmptyState
            title="No pending requests"
          />

        ) : (

          <>

            {/* DESKTOP */}

            <Table

              columns={columns}

              data={rows}

              renderActions={(row)=>(

                <>
                  <Button

                    size="sm"

                    disabled={
                      processingId ===
                      row.raw.id
                    }

                    onClick={()=>

                      handleReview(
                        row.raw,
                        "approved"
                      )

                    }
                  >
                    Approve
                  </Button>


                  <Button

                    variant="secondary"

                    size="sm"

                    disabled={
                      processingId ===
                      row.raw.id
                    }

                    onClick={()=>

                      handleReview(
                        row.raw,
                        "rejected"
                      )

                    }
                  >
                    Reject
                  </Button>

                </>

              )}

            />


            {/* MOBILE */}

            <MobileCards

              columns={columns}

              data={rows}

              renderActions={(row)=>(

                <>
                  <Button
                    size="sm"

                    onClick={()=>

                      handleReview(
                        row.raw,
                        "approved"
                      )

                    }
                  >
                    Approve
                  </Button>


                  <Button
                    variant="secondary"

                    size="sm"

                    onClick={()=>

                      handleReview(
                        row.raw,
                        "rejected"
                      )

                    }
                  >
                    Reject
                  </Button>

                </>

              )}

            />

          </>

        )}

      </Card>

    </>
  );
}

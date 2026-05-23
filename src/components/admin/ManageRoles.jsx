import {
  useEffect,
  useState,
  useCallback,
} from "react";

import { Search } from "lucide-react";

import {
  AdminAPI,
} from "../../utils/api";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useToast,
} from "../../components/ToastProvider";

import Button from "../../components/Button";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";
import SearchBar from "../SearchBar";
import Table from "../Table";
import MobileCards from "../MobileCards";
import Modal from "../Modal";

import styles from
"../../styles/admin/ManageRoles.module.css";

export default function ManageRoles() {
  const {
    activeChurchId,
    getRoleLabel,
  } = useAuth();

  const { showToast } =
    useToast();

  const [members, setMembers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [
    selectedMember,
    setSelectedMember,
  ] = useState(null);

  const [
    processingId,
    setProcessingId,
  ] = useState(null);

  const [
    saving,
    setSaving,
  ] = useState(false);

  /* -------------------------
     LOAD MEMBERS
  -------------------------- */

  const loadMembers =
    useCallback(async () => {

      if (!activeChurchId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const params =
          new URLSearchParams({
            search,
          });

        const res =
          await AdminAPI
          .fetchMembers(
            params.toString()
          );

        setMembers(
          res.members || []
        );

      } catch {

        showToast(
          "Failed loading members",
          "error"
        );

      } finally {

        setLoading(false);

      }

    }, [
      activeChurchId,
      search,
      showToast,
    ]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);



  /* -------------------------
     ACTIVATE / DEACTIVATE
  -------------------------- */

  const toggleMember =
    async (member) => {

      try {

        setProcessingId(
          member.id
        );

        if (member.active) {

          await AdminAPI
            .deactivateMember(
              member.id
            );

        } else {

          await AdminAPI
            .activateMember(
              member.id
            );

        }

        await loadMembers();

        showToast(
          "Member updated",
          "success"
        );

      } catch {

        showToast(
          "Action failed",
          "error"
        );

      } finally {

        setProcessingId(
          null
        );

      }

    };



  /* -------------------------
     MODAL ACTIONS
  -------------------------- */

  const closeModal = () =>
    setSelectedMember(null);


  const handleSave =
    async () => {

      try {

        setSaving(true);

        // save roles here

        showToast(
          "Roles updated",
          "success"
        );

        closeModal();

      } catch {

        showToast(
          "Failed updating roles",
          "error"
        );

      } finally {

        setSaving(false);

      }

    };



  /* -------------------------
     TABLE COLUMNS
  -------------------------- */

  const columns = [

    {
      key:
      "full_name",

      label:
      "Member",
    },

    {
      key:
      "departments",

      label:
      "Departments",

      render:
      (m) =>

      m.departments?.length
        ? m.departments.join(
            ", "
          )
        : "-",
    },

    {
      key:
      "active",

      label:
      "Status",

      render:
      (m) => (

        <span
          className={
            m.active
              ? styles.active
              : styles.inactive
          }
        >

          {m.active
            ? "Active"
            : "Inactive"}

        </span>

      ),
    },

    {
      key:
      "roles",

      label:
      "Roles",

      render:
      (m) => (

        <div
          className={
            styles.roles
          }
        >

          {(m.roles || [])
            .map(role => (

            <span
              key={role}
              className={
                styles.roleBadge
              }
            >

              {
                getRoleLabel(
                  role
                )
              }

            </span>

          ))}

        </div>

      ),
    },

  ];



  return (

    <div
      className={
        styles.section
      }
    >

      <PageHeader
        title="
        Members & Roles
        "

        subtitle="
        Manage members,
        permissions
        and access
        "
      />


      <SearchBar
        value={search}

        icon={
          <Search
            size={16}
          />
        }

        placeholder="
        Search members...
        "

        onChange={
          (e) =>
          setSearch(
            e.target.value
          )
        }

        onClear={() =>
          setSearch("")
        }
      />


      {loading && (

        <Loader
          message="
          Loading members...
          "
        />

      )}


      {!loading &&
       members.length === 0 && (

        <EmptyState
          title="
          No members found
          "
        />

      )}



      {!loading &&
       members.length > 0 && (

        <>

          <Table
            columns={columns}
            data={members}

            renderActions={
              (m) => (

              <>
                <Button
                  variant="
                  secondary
                  "

                  onClick={() =>
                    setSelectedMember(
                      m
                    )
                  }
                >

                  Manage Roles

                </Button>


                <Button
                  loading={
                    processingId
                    === m.id
                  }

                  variant={
                    m.active
                      ? "danger"
                      : "success"
                  }

                  onClick={() =>
                    toggleMember(
                      m
                    )
                  }
                >

                  {m.active
                    ? "Deactivate"
                    : "Activate"}

                </Button>

              </>

            )}
          />


          <div
            className={
              styles.mobileList
            }
          >

            {members.map(
              member => (

              <MobileCards
                key={
                  member.id
                }

                columns={
                  columns
                }

                data={[
                  member
                ]}

                renderActions={
                  () => (

                  <>
                    <Button
                      variant="
                      secondary
                      "

                      onClick={() =>
                        setSelectedMember(
                          member
                        )
                      }
                    >

                      Manage Roles

                    </Button>


                    <Button
                      variant={
                        member.active
                        ? "danger"
                        : "success"
                      }

                      loading={
                        processingId
                        === member.id
                      }

                      onClick={() =>
                        toggleMember(
                          member
                        )
                      }
                    >

                      {
                        member.active
                        ? "Deactivate"
                        : "Activate"
                      }

                    </Button>

                  </>

                )}
              />

            ))}

          </div>

        </>

      )}



      {selectedMember && (

        <Modal
          open={
            !!selectedMember
          }

          onClose={
            closeModal
          }

          title={`
          Manage Roles:
          ${selectedMember.full_name}
          `}

          size="lg"

          footer={

            <>
              <Button
                variant="
                secondary
                "

                onClick={
                  closeModal
                }
              >

                Cancel

              </Button>


              <Button
                onClick={
                  handleSave
                }

                loading={
                  saving
                }
              >

                Save Changes

              </Button>
            </>

          }
        >

          {/* Roles UI here */}

        </Modal>

      )}

    </div>

  );

}

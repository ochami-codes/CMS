import { useEffect, useState } from "react";

import Button from "../Button";
import Modal from "../Modal";
import RoleSelector from "../RoleSelector";

import styles from "../../styles/admin/ManageRolesModal.module.css";

export default function ManageRolesModal({
  member,
  saving,
  onClose,
  onSave,
}) {
  const [selectedRoles, setSelectedRoles] =
    useState([]);

  useEffect(() => {
    if (!member) return;

    const roleNames = (
      member.roles ?? []
    ).map((role) =>
      typeof role === "string"
        ? role
        : role.name
    );

    setSelectedRoles(roleNames);
  }, [member]);

  if (!member) return null;

  const handleSave = async () => {
    await onSave({
      memberId: member.id,
      roles: selectedRoles,
    });
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Manage Roles"
      size="lg"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            loading={saving}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </>
      }
    >
      <div className={styles.content}>
        {/* Member Header */}

        <div className={styles.memberHeader}>
          <div className={styles.avatar}>
            {member.full_name
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <h3>{member.full_name}</h3>

            <p>
              Select the roles this member
              should have.
            </p>
          </div>
        </div>

        {/* Instructions */}

        <div className={styles.instructions}>
          <strong>Manage access</strong>

          <p>
            Select one or more roles to
            control this member's
            responsibilities and access
            within the church.
          </p>
        </div>

        {/* Role Section */}

        <div className={styles.roleSection}>
          <div className={styles.sectionHeader}>
            <h4>Available Roles</h4>

            <span className={styles.count}>
              {selectedRoles.length} selected
            </span>
          </div>

          <RoleSelector
            selectedRoles={selectedRoles}
            onChange={setSelectedRoles}
            multiple
          />
        </div>
      </div>
    </Modal>
  );
}

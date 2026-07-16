import { useState } from "react";

import Modal from "../Modal";
import Card from "../Card";
import Button from "../Button";
import Input from "../Input";
import Select from "../Select";

import useMembers from "../../hooks/members/useMembers";
import useLessonGuides from "../../hooks/SabbathSchool/useLessonGuides";

import styles from "../../styles/components/LessonGuideModal.module.css";

const currentYear = new Date().getFullYear();

const quarterOptions = [
  { value: 1, label: "Quarter 1" },
  { value: 2, label: "Quarter 2" },
  { value: 3, label: "Quarter 3" },
  { value: 4, label: "Quarter 4" },
];

const lessonTypeOptions = [
  { value: "adult", label: "Adult" },
  { value: "youth", label: "Youth" },
  { value: "children", label: "Children" },
];

export default function LessonGuideModal({
  open,
  onClose,
  departmentId,
  mode = "leader",
}) {
  const isLeader = mode === "leader";

  const {
    createSubscription,
    createMySubscription,
    creating,
    creatingMySubscription,
  } = useLessonGuides({
    departmentId,
    enabled: false,
  });

  const [subscriberType, setSubscriberType] = useState("member");

const [memberId, setMemberId] = useState("");
  const [nameOverride, setNameOverride] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [lessonType, setLessonType] = useState("adult");
  const [year, setYear] = useState(currentYear);
  const [quarter, setQuarter] = useState("");
  const [remarks, setRemarks] = useState("");

  const submitting = creating || creatingMySubscription;
  const { members } = useMembers({
  enabled: isLeader,
});

const memberOptions = members.map(
  (member) => ({
    value: member.id,
    label: member.full_name,
  })
);
  const subscriberTypeOptions = [
  {
    value: "member",
    label: "Existing Member",
  },
  {
    value: "manual",
    label: "Enter Manually",
  },
];

  async function handleSubmit(e) {
    e.preventDefault();

    if (isLeader) {
      await createSubscription({
  memberId:
    subscriberType === "member"
      ? memberId
      : null,

  nameOverride:
    subscriberType === "manual"
      ? nameOverride
      : null,

  phoneNumber:
    subscriberType === "manual"
      ? phoneNumber
      : null,

  lessonType,
  year,
  quarter,
  remarks,
});
    } else {
      await createMySubscription({
        lessonType,
        year,
        quarter,
        remarks,
      });
    }

    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Lesson Guide Subscription" size="md">
      <Card>
        <form onSubmit={handleSubmit} className={styles.form}>
          {isLeader && (
           <>
  <Select
    label="Subscriber"
    value={subscriberType}
    options={subscriberTypeOptions}
    onChange={(e) => {
      setSubscriberType(e.target.value);
      setMemberId("");
      setNameOverride("");
      setPhoneNumber("");
    }}
  />

  {subscriberType === "member" ? (
    <Select
      label="Member"
      value={memberId}
      options={memberOptions}
      placeholder="Select a member"
      onChange={(e) =>
        setMemberId(e.target.value)
      }
    />
  ) : (
    <>
      <Input
        label="Name"
        value={nameOverride}
        onChange={(e) =>
          setNameOverride(
            e.target.value
          )
        }
      />

      <Input
        label="Phone Number"
        value={phoneNumber}
        onChange={(e) =>
          setPhoneNumber(
            e.target.value
          )
        }
      />
    </>
  )}
</>
          )}

          <Select
            label="Lesson Type"
            value={lessonType}
            options={lessonTypeOptions}
            onChange={(e) => setLessonType(e.target.value)}
          />

          <Input
            type="number"
            label="Year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />

          <Select
            label="Quarter"
            value={quarter}
            options={quarterOptions}
            onChange={(e) => setQuarter(Number(e.target.value))}
          />

          <Input
            label="Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />

          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Subscribe
            </Button>
          </div>
        </form>
      </Card>
    </Modal>
  );
}

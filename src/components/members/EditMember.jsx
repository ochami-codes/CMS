// src/components/members/EditMember.jsx

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  memberFields,
} from "../../utils/memberFields";

import {
  MembersAPI,
  DepartmentsAPI,
} from "../../utils/api";

import { useToast } from "../ToastProvider";

import Card from "../Card";
import Button from "../Button";

export default function EditMember({
  department,
  onUpdated,
}) {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const { showToast } =
    useToast();

  const config =
    memberFields[department];

  const fields =
    config?.fields ?? [];

  const [formData,
    setFormData] =
    useState({});

  const [departments,
    setDepartments] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [saving,
    setSaving] =
    useState(false);


  /* =====================
     LOAD DATA
  ===================== */

  useEffect(() => {

    if (!department || !id)
      return;

    const load =
      async () => {

        try {

          setLoading(true);

          const [
            deptRes,
            membersRes,
          ] =
            await Promise.all([
              DepartmentsAPI
                .fetchAll(),

              MembersAPI
                .fetchAll(
                  department
                ),
            ]);

          setDepartments(
            deptRes ?? []
          );

          const member =
            membersRes?.members
              ?.find(
                m => m.id === id
              );

          if (!member)
            throw Error(
              "Member not found"
            );

          const init =
            Object.fromEntries(
              fields.map(f => [
                f.name,

                f.name ===
                "department"
                  ? member
                      .department_id
                  : member[
                      f.name
                    ] ?? "",
              ])
            );

          setFormData(init);

        } catch (err) {

          showToast(
            err.message ||
              "Load failed",
            "error"
          );

        } finally {
          setLoading(false);
        }
      };

    load();

  }, [
    department,
    id,
    fields,
    showToast,
  ]);


  /* =====================
     UPDATE
  ===================== */

  const handleUpdate =
    async (e) => {

      e.preventDefault();

      try {

        setSaving(true);

        for (const f of fields) {

          if (
            f.required &&
            !formData[f.name]
          ) {
            throw Error(
              `${f.label} required`
            );
          }

        }

        const payload = {
          ...formData,
        };

        if (
          payload.department
        ) {
          payload
            .department_id =
            payload.department;
        }

        await MembersAPI.update(
          id,
          payload
        );

        showToast(
          "Member updated",
          "success"
        );

        onUpdated?.();

        navigate(
          `/dashboard/${department}`
        );

      } catch (err) {

        showToast(
          err.message ||
            "Update failed",
          "error"
        );

      } finally {
        setSaving(false);
      }
    };


  /* =====================
     STATES
  ===================== */

  if (loading) {

    return (
      <Card>
        Loading member...
      </Card>
    );

  }

  if (!Object.keys(
    formData
  ).length) {

    return (
      <Card>
        No member data found
      </Card>
    );

  }


  /* =====================
     UI
  ===================== */

  return (

<Card>

<h2>
Edit {department}
</h2>

<p>
Update member details
</p>


<form onSubmit={handleUpdate}>


{fields.map(f => (

<div key={f.name}>

<label>
{f.label}
</label>


{f.type ===
"select" ? (

<select

value={
formData[f.name]
}

onChange={(e)=>
setFormData(prev=>({
...prev,
[f.name]:
e.target.value
}))
}

>

<option value="">
Select
</option>


{f.name ===
"department"

? departments.map(
d=>(
<option
key={d.id}
value={d.id}
>
{d.name}
</option>
)
)

: f.options?.map(
o=>(
<option
key={o}
value={o}
>
{o}
</option>
)
)}

</select>

) : (

<input

type={
f.type || "text"
}

value={
formData[f.name]
}

onChange={(e)=>
setFormData(prev=>({
...prev,
[f.name]:
e.target.value
}))
}

/>

)}

</div>

))}


<Button
type="submit"
disabled={saving}
>

{saving
? "Saving..."
: "Update Member"}

</Button>

</form>

</Card>

  );
}

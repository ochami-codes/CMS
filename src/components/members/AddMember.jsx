// src/components/members/AddMember.jsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  memberFields,
} from "../../utils/memberFields";

import {
  MembersAPI,
  DepartmentsAPI,
  AdminAPI,
} from "../../utils/api";

import { useToast } from "../ToastProvider";

import SearchBar from "../SearchBar";
import Button from "../Button";
import Card from "../Card";
import EmptyState from "../EmptyState";

export default function AddMember({
  department,
  onMemberAdded,
}) {
  const { showToast } = useToast();

  const config =
    memberFields[department];

  const fields =
    config?.fields ?? [];

  const initialState =
    useMemo(
      () =>
        Object.fromEntries(
          fields.map(f => [
            f.name,
            "",
          ])
        ),
      [fields]
    );

  const [memberType,
    setMemberType] =
    useState("system");

  const [formData,
    setFormData] =
    useState(initialState);

  const [departments,
    setDepartments] =
    useState([]);

  const [loading,
    setLoading] =
    useState(false);

  const [query,
    setQuery] =
    useState("");

  const [results,
    setResults] =
    useState([]);

  const [searching,
    setSearching] =
    useState(false);

  const [
    selectedProfile,
    setSelectedProfile,
  ] = useState(null);

  /* =====================
     LOAD DEPARTMENTS
  ===================== */

  useEffect(() => {
    const load =
      async () => {
        try {
          const data =
            await DepartmentsAPI.fetchAll();

          setDepartments(
            data ?? []
          );

        } catch {
          showToast(
            "Failed loading departments",
            "error"
          );
        }
      };

    load();
  }, [showToast]);

  /* =====================
     SEARCH USERS
  ===================== */

  useEffect(() => {

    if (
      query.trim().length < 2
    ) {
      setResults([]);
      return;
    }

    const timer =
      setTimeout(
        async () => {

          try {
            setSearching(true);

            const data =
              await AdminAPI.searchProfiles(
                query
              );

            setResults(
              data?.profiles ?? []
            );

          } finally {
            setSearching(false);
          }

        },
        300
      );

    return () =>
      clearTimeout(timer);

  }, [query]);

  /* =====================
     INPUT CHANGE
  ===================== */

  const updateField =
    (name, value) =>
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));


  /* =====================
     SUBMIT
  ===================== */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {
        setLoading(true);

        let payload;

        if (
          memberType ===
          "system"
        ) {

          if (
            !selectedProfile
          ) {
            throw Error(
              "Select a user"
            );
          }

          payload = {
            department,
            profile_id:
              selectedProfile.id,

            is_system_user:
              true,
          };

        } else {

          payload = {
            ...formData,
            department,
            is_system_user:
              false,
          };

        }

        const res =
          await MembersAPI.add(
            payload
          );

        const member =
          res?.member;

        showToast(
          "Member added",
          "success"
        );

        onMemberAdded?.(
          member
        );

        setFormData(
          initialState
        );

        setQuery("");

        setSelectedProfile(
          null
        );

      } catch (err) {

        showToast(
          err.message ||
          "Failed adding member",
          "error"
        );

      } finally {
        setLoading(false);
      }
    };


  return (

<Card>

      <h2>
        Add Member
      </h2>

      <p>
        Add registered users
        or manual members
      </p>

<form onSubmit={handleSubmit}>

{/* MEMBER TYPE */}

<select
value={memberType}
onChange={(e)=>
setMemberType(
e.target.value
)}
>

<option value="system">
System User
</option>

<option value="manual">
Manual Member
</option>

</select>


{/* SYSTEM USER */}

{memberType==="system" && (

<>

<SearchBar
value={query}
onChange={(e)=>
setQuery(
e.target.value
)}
placeholder="Search member..."
onClear={()=>{
setQuery("");
setSelectedProfile(
null
);
}}
/>

{searching && (
<p>Searching...</p>
)}

{results.length > 0 &&
!selectedProfile && (

<div>

{results.map(
profile => (

<button
type="button"
key={profile.id}

onClick={()=>{
setSelectedProfile(
profile
);

setQuery(
profile.full_name
);

setResults([]);
}}
>

{profile.full_name}

</button>

))
}

</div>
)}

{selectedProfile && (

<p>
Selected:
{" "}
{selectedProfile.full_name}
</p>

)}

</>

)}


{/* MANUAL FORM */}

{memberType==="manual" &&
fields.map(field=>(

<div key={field.name}>

<label>

{field.label}

</label>

{field.type==="select" ? (

<select

value={
formData[
field.name
]
}

onChange={(e)=>
updateField(
field.name,
e.target.value
)
}
>

<option value="">
Select
</option>

{field.name==="department"

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

: field.options?.map(
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
field.type ||
"text"
}

value={
formData[
field.name
]
}

onChange={(e)=>
updateField(
field.name,
e.target.value
)
}

/>

)}

</div>

))}


<Button
type="submit"
disabled={loading}
>

{loading
? "Saving..."
: "Add Member"}

</Button>

</form>

</Card>

  );
}

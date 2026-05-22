import {
  useEffect,
  useState,
  useCallback,
} from "react";
import { Search } from "lucide-react";
import Button from "../../components/Button";
import {
  AdminAPI,
} from "../../utils/api";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useToast,
} from "../../components/ToastProvider";

import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";

import MobileCards from "../MobileCards";
import Table from "../Table";
import SearchBar from "../SearchBar";
import Modal from "../Modal";

import styles from "../../styles/admin/ManageRoles.module.css";

export default function ManageRoles() {
  const {
    user,
    rolesData,
    getRoleLabel,
    activeChurchId,
    refetchUser,
  } = useAuth();

  const { showToast } =
    useToast();

  const [members,setMembers] =
    useState([]);

  const [loading,setLoading] =
    useState(true);

  const [search,setSearch] =
    useState("");

  const [
    processingId,
    setProcessingId,
  ] = useState(null);

  const [
    selectedMember,
    setSelectedMember,
  ] = useState(null);

  const loadMembers =
    useCallback(async () => {

      if(!activeChurchId)
        return;

      try {
        setLoading(true);

        const params =
          new URLSearchParams({
            search
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

  },[
      activeChurchId,
      search,
      showToast
  ]);

  useEffect(()=>{
      loadMembers();
  },[loadMembers]);

  const toggleMember =
    async(member)=>{

      setProcessingId(
        member.id
      );

      try{

        member.active
        ? await AdminAPI
            .deactivateMember(
               member.id
            )

        : await AdminAPI
            .activateMember(
               member.idv
            );

       await loadMembers();

        showToast(
          "Member updated"
        );

      }catch{

        showToast(
          "Action failed",
          "error"
        );

      }finally{

        setProcessingId(
          null
        );

      }
  };

const columns = [

{
 key:"full_name",
 label:"Member"
},

{
 key:"departments",
 label:"Departments",

 render:(m)=>
  m.departments.length
   ? m.departments.join(", ")
   : "-"
},

{
 key:"active",
 label:"Status",

 render:(m)=>(

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

)
},

{
 key:"roles",

 label:"Roles",

 render:(m)=>(

<div className={styles.roles}>

{m.roles.map(role=>(

<span
key={role}
className={
styles.roleBadge
}
>

{
getRoleLabel(role)
}

</span>

))}

</div>

)
}

];

  return (
    <div className={styles.section}>

    <PageHeader
title="Members & Roles"
subtitle="
Manage members,
permissions and access
"
/>

<SearchBar
value={search}

icon={<Search size={16}/>}

placeholder="
Search members...
"

onChange={(e)=>
setSearch(
e.target.value
)}

onClear={()=>
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
        members.length===0 && (

        <EmptyState
          title="
            No members found
          "
        />
      )}

      {!loading &&
       members.length>0 && (

        <>
<Table
columns={columns}
data={members}

renderActions={(m)=>(

<>

<Button
variant="secondary"
onClick={()=>
setSelectedMember(m)
}
>
Manage Roles
</Button>

<Button
variant={
m.active
? "danger"
: "success"
}

onClick={()=>
toggleMember(
m.id,
m.active
)}
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
columns={columns}
data={members}
renderActions={(m)=>(

<>

<Button
variant="secondary"
onClick={()=>
setSelectedMember(m)
}
>
Manage Roles
</Button>

<Button
variant={
m.active
? "danger"
: "success"
}

onClick={()=>
toggleMember(
m.id,
m.active
)}
>

{m.active
? "Deactivate"
: "Activate"}

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
open={!!member}

onClose={onClose}

title={
`Manage Roles:
 ${member.full_name}`
}

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
onClick={handleSave}
loading={saving}
>
Save Changes
</Button>

</>
}
>

{/* roles UI */}

</Modal>

      )}

    </div>
  );
}


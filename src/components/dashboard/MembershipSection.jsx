// components/dashboard/MembershipSection.jsx
import { useState } from "react";
import { UserPlus } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { MembershipAPI } from "../../utils/api";

import Card from "../Card";
import Button from "../Button";
import PageHeader from "../PageHeader";

import styles from "../../styles/dashboard/MembershipSection.module.css";

export default function MembershipSection() {

const [loading,setLoading] =
useState(false);

const [successMessage,
setSuccessMessage] =
useState("");

const [errorMessage,
setErrorMessage] =
useState("");


const {

activeMembershipStatus,

refetchUser,

} = useAuth();


const handleRequestMembership =
async()=>{

try{

setLoading(true);

setSuccessMessage("");
setErrorMessage("");

await MembershipAPI.submit({});

await refetchUser();

setSuccessMessage(
"Membership request submitted 🙏"
);

}

catch(err){

setErrorMessage(

err?.response?.data?.message ||

"Request failed"

);

}

finally{

setLoading(false);

}

};


const status =
activeMembershipStatus;


const hasActiveRequest =
status === "requested";


const statusMessage =

status === "requested"

? "Your membership request is pending review."

: status === "active"

? "Your membership has been approved 🎉"

: status === "rejected"

? "Your membership request was rejected."

: "Request membership to access ministries and announcements.";



return(

<section className={styles.section}>


<PageHeader

title="Join Your Church"

icon={<UserPlus size={18}/>}

/>


<Card>

<div className={styles.content}>


<p className={styles.status}>
{statusMessage}
</p>



{!hasActiveRequest && (

<Button

variant="primary"

disabled={loading}

onClick={
handleRequestMembership
}

>

{loading

? "Sending request..."

: "Request Membership"

}

</Button>

)}



{successMessage && (

<p className={styles.success}>

{successMessage}

</p>

)}



{errorMessage && (

<p className={styles.error}>

{errorMessage}

</p>

)}


</div>

</Card>

</section>

)

}
